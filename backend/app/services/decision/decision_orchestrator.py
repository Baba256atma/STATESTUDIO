"""Orchestration for Nexora Decision Engine Lite."""

from __future__ import annotations

import logging
from typing import Any

from app.models.decision_input import DecisionEngineInput
from app.models.decision_output import (
    DecisionEngineResult,
    DecisionOption,
    LegacyComparisonItem,
    LegacySceneActions,
    LegacySimulationResult,
)
from app.models.scanner_output import FragilityScanResponse, PanelAdviceSlice, PanelTimelineEvent, PanelTimelineSlice, PanelWarRoomSlice
from app.models.scenario_input import ScenarioSimulationRequest
from app.models.scenario_output import ScenarioSimulationResult
from app.services.decision.decision_comparator import compare_options
from app.services.decision.decision_scorer import score_confidence, score_option
from app.services.decision.recommendation_builder import build_recommendation
from app.services.scanner.scanner_orchestrator import FragilityScannerOrchestrator
from app.services.scenario.scenario_orchestrator import ScenarioSimulationOrchestrator


logger = logging.getLogger(__name__)


class DecisionEngineOrchestrator:
    """Compare scenario options and produce a deterministic recommendation."""

    def __init__(
        self,
        scanner_orchestrator: FragilityScannerOrchestrator | None = None,
        scenario_orchestrator: ScenarioSimulationOrchestrator | None = None,
    ) -> None:
        self._scanner_orchestrator = scanner_orchestrator or FragilityScannerOrchestrator()
        self._scenario_orchestrator = scenario_orchestrator or ScenarioSimulationOrchestrator(self._scanner_orchestrator)

    def compare(self, payload: dict[str, Any]) -> dict[str, Any]:
        request = DecisionEngineInput.model_validate(payload)
        baseline = self._resolve_baseline(request)
        scenarios = self._resolve_scenarios(request, baseline)
        options = [self._build_option(index, scenario, baseline, request.decision_goal) for index, scenario in enumerate(scenarios, start=1)]
        comparison = compare_options(options)
        scenarios_by_option_id = {option.id: scenario for option, scenario in zip(options, scenarios)}
        recommendation = build_recommendation(
            comparison=comparison,
            scenarios_by_option_id=scenarios_by_option_id,
        )
        selected_scenario = scenarios_by_option_id[recommendation.recommended_option_id]
        result = DecisionEngineResult(
            ok=True,
            comparison_result=comparison,
            recommendation=recommendation,
            timeline_slice=self._build_timeline_slice(selected_scenario, recommendation),
            advice_slice=self._build_advice_slice(
                recommendation,
                [*selected_scenario.primary_objects, *selected_scenario.affected_objects],
            ),
            war_room_slice=self._build_war_room_slice(comparison, recommendation),
            comparison=[LegacyComparisonItem(option=option.label, score=option.score) for option in comparison.options],
            simulation_result=LegacySimulationResult(
                impact_score=max(0.0, min(1.0, 1.0 - comparison.options[0].score)),
                risk_change=round(-0.18 * comparison.options[0].score, 4),
                kpi_effects=[],
                affected_objects=selected_scenario.affected_objects,
            ),
            scene_actions=LegacySceneActions(
                highlight=selected_scenario.primary_objects[:2],
                dim=[object_id for object_id in selected_scenario.affected_objects[2:]],
            ),
        )

        logger.info(
            "decision_compare_completed best_option_id=%s scores=%s decision_goal=%s",
            comparison.best_option_id,
            {option.id: option.score for option in comparison.options},
            request.decision_goal,
        )
        return result.model_dump()

    def _resolve_baseline(self, request: DecisionEngineInput) -> FragilityScanResponse:
        if request.baseline is not None:
            return request.baseline

        context_text = " ".join(
            str(item.get("text", "")).strip()
            for item in request.context
            if isinstance(item, dict) and str(item.get("text", "")).strip()
        )
        scan_payload = {
            "text": context_text or "current operating pressure requires comparison",
            "source_type": "text",
            "metadata": {"decision_mode": "compare_lite"},
        }
        result = self._scanner_orchestrator.run_scan(scan_payload)
        return FragilityScanResponse.model_validate(result)

    def _resolve_scenarios(
        self,
        request: DecisionEngineInput,
        baseline: FragilityScanResponse,
    ) -> list[ScenarioSimulationResult]:
        if request.scenarios:
            return request.scenarios

        selected_label = request.selected_objects[0].replace("obj_", "").replace("_", " ") if request.selected_objects else "primary pressure point"
        synthesized_requests = [
            ScenarioSimulationRequest(
                scenario_text=f"What if we stabilize {selected_label} first to contain disruption?",
                baseline_scanner_result=baseline,
                max_steps=3,
            ),
            ScenarioSimulationRequest(
                scenario_text="What if we prioritize cost containment while monitoring downstream pressure?",
                baseline_scanner_result=baseline,
                max_steps=3,
            ),
        ]
        return [
            ScenarioSimulationResult.model_validate(
                self._scenario_orchestrator.run_simulation(item.model_dump())
            )
            for item in synthesized_requests
        ]

    def _build_option(
        self,
        index: int,
        scenario: ScenarioSimulationResult,
        baseline: FragilityScanResponse,
        decision_goal: str | None,
    ) -> DecisionOption:
        score = score_option(baseline=baseline, scenario=scenario, decision_goal=decision_goal)
        confidence = score_confidence(baseline=baseline, scenario=scenario)
        label = f"Option {index}: {scenario.scenario_type.replace('_', ' ').title()}"
        pros = self._extract_pros(scenario)
        cons = self._extract_cons(scenario)
        return DecisionOption(
            id=f"decision_option_{index}",
            label=label,
            scenario_summary=scenario.scenario_summary,
            impact_level=scenario.overall_impact_level,
            key_object_ids=scenario.primary_objects[:2] + scenario.affected_objects[:2],
            pros=pros,
            cons=cons,
            score=score,
            confidence=confidence,
        )

    @staticmethod
    def _extract_pros(scenario: ScenarioSimulationResult) -> list[str]:
        pros: list[str] = []
        if scenario.overall_impact_level in {"low", "moderate"}:
            pros.append("Projected impact remains relatively contained.")
        if len(scenario.affected_objects) <= 2:
            pros.append("Downstream spread stays focused on a limited set of objects.")
        if "obj_customer" not in scenario.affected_objects:
            pros.append("Customer-facing pressure remains more contained.")
        return pros[:3] or ["Provides a clearer stabilization path than the alternatives."]

    @staticmethod
    def _extract_cons(scenario: ScenarioSimulationResult) -> list[str]:
        cons: list[str] = []
        if scenario.overall_impact_level in {"high", "critical"}:
            cons.append("Projected pressure remains elevated even after intervention.")
        if len(scenario.affected_objects) >= 3:
            cons.append("Propagation reaches a broader downstream footprint.")
        if "obj_cashflow" in scenario.affected_objects or "obj_cost" in scenario.affected_objects:
            cons.append("Cost or cash pressure remains exposed.")
        if "obj_customer" in scenario.affected_objects:
            cons.append("Customer-facing risk can still escalate if recovery slows.")
        return cons[:3] or ["Some residual pressure remains unresolved."]

    @staticmethod
    def _build_timeline_slice(
        scenario: ScenarioSimulationResult,
        recommendation,
    ) -> PanelTimelineSlice:
        related_object_ids = list(dict.fromkeys([*scenario.primary_objects[:2], *scenario.affected_objects[:3]]))
        decision_event = PanelTimelineEvent(
            id="decision_selected",
            label="Recommended option selected",
            type="decision",
            order=0,
            confidence=0.82,
            related_object_ids=related_object_ids,
        )
        shifted_events = [
            PanelTimelineEvent(
                id=event.id,
                label=event.label,
                type=event.type,
                order=event.order + 1,
                confidence=event.confidence,
                related_object_ids=getattr(event, "related_object_ids", []) or related_object_ids,
            )
            for event in scenario.timeline_slice.events
        ]
        return PanelTimelineSlice(
            headline="Decision Timeline",
            events=[decision_event, *shifted_events],
            related_object_ids=related_object_ids,
            summary="Tracking the expected progression of the selected option.",
        )

    @staticmethod
    def _build_advice_slice(recommendation, related_object_ids: list[str] | None = None) -> PanelAdviceSlice:
        primary_recommendation = recommendation.key_actions[0] if recommendation.key_actions else None
        return PanelAdviceSlice(
            title="Decision Advice",
            summary=recommendation.reason,
            recommendations=recommendation.key_actions[:3],
            why=recommendation.expected_outcome,
            recommendation=primary_recommendation,
            risk_summary=f"Risk level if chosen: {recommendation.risk_level}.",
            related_object_ids=(related_object_ids or [])[:5],
            supporting_driver_labels=[],
            recommended_actions=[
                {
                    "action": action,
                    "impact_summary": recommendation.expected_outcome,
                    "tradeoff": None,
                }
                for action in recommendation.key_actions[:3]
            ],
            primary_recommendation={"action": primary_recommendation} if primary_recommendation else None,
            confidence={"score": 0.82},
        )

    @staticmethod
    def _build_war_room_slice(comparison, recommendation) -> PanelWarRoomSlice:
        best_option = next(option for option in comparison.options if option.id == recommendation.recommended_option_id)
        posture = "defensive" if best_option.impact_level in {"high", "critical"} else "balanced" if best_option.impact_level == "moderate" else "aggressive"
        priorities = list(recommendation.key_actions[:3]) or best_option.pros[:2]
        risks = best_option.cons[:3]
        return PanelWarRoomSlice(
            headline=f"Best option: {best_option.label}",
            posture=posture,
            priorities=priorities,
            risks=risks,
            related_object_ids=best_option.key_object_ids[:5],
            summary=recommendation.reason,
            executive_summary=recommendation.expected_outcome,
            recommendation=priorities[0] if priorities else None,
            compare_summary=comparison.comparison_summary,
            advice_summary=recommendation.reason,
        )
