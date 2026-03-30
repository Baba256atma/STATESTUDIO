"""Orchestration layer for Scenario Simulation Lite."""

from __future__ import annotations

import logging
from typing import Any

from app.models.scanner_output import FragilityScanResponse, PanelAdviceSlice, PanelTimelineEvent, PanelTimelineSlice
from app.models.scenario_input import ScenarioSimulationRequest
from app.models.scenario_output import ScenarioSimulationResult
from app.services.scanner.scanner_orchestrator import FragilityScannerOrchestrator
from app.services.scenario.propagation_engine import simulate_propagation
from app.services.scenario.propagation_rules import (
    classify_scenario_type,
    estimate_scenario_severity,
    get_rule_chain,
)
from app.services.scenario.scene_overlay_builder import build_scene_overlay


logger = logging.getLogger(__name__)


class ScenarioSimulationOrchestrator:
    """Coordinate deterministic what-if propagation for the Nexora MVP."""

    def __init__(self, scanner_orchestrator: FragilityScannerOrchestrator | None = None) -> None:
        self._scanner_orchestrator = scanner_orchestrator or FragilityScannerOrchestrator()

    def run_simulation(self, request_data: dict[str, Any]) -> dict[str, Any]:
        request = ScenarioSimulationRequest.model_validate(request_data)
        baseline = self._resolve_baseline(request)
        scenario_type = classify_scenario_type(request.scenario_text)
        severity = estimate_scenario_severity(request.scenario_text)
        baseline_primary = [impact.object_id for impact in baseline.object_impacts.primary]
        baseline_affected = [impact.object_id for impact in baseline.object_impacts.affected]
        chain = get_rule_chain(scenario_type)

        simulation = simulate_propagation(
            scenario_type=scenario_type,
            scenario_text=request.scenario_text,
            chain=chain,
            baseline_primary=baseline_primary,
            baseline_affected=baseline_affected,
            baseline_fragility_score=baseline.fragility_score,
            severity=severity,
            max_steps=request.max_steps,
        )
        scene_overlay = build_scene_overlay(
            object_states=simulation["object_states"],
            primary_objects=simulation["primary_objects"],
            affected_objects=simulation["affected_objects"],
        )
        timeline_slice = self._build_timeline_slice(simulation["propagation_steps"])
        advice_slice = self._build_advice_slice(
            scenario_type=scenario_type,
            primary_objects=simulation["primary_objects"],
            affected_objects=simulation["affected_objects"],
            overall_impact_level=simulation["overall_impact_level"],
        )
        scenario_summary = self._build_summary(
            scenario_type=scenario_type,
            overall_impact_level=simulation["overall_impact_level"],
            primary_objects=simulation["primary_objects"],
            affected_objects=simulation["affected_objects"],
        )

        logger.info(
            "scenario_simulation_completed scenario_type=%s impact_level=%s primary_objects=%s step_count=%s",
            scenario_type,
            simulation["overall_impact_level"],
            simulation["primary_objects"],
            len(simulation["propagation_steps"]),
        )

        result = ScenarioSimulationResult(
            ok=True,
            scenario_summary=scenario_summary,
            scenario_type=scenario_type,
            overall_impact_level=simulation["overall_impact_level"],
            primary_objects=simulation["primary_objects"],
            affected_objects=simulation["affected_objects"],
            object_states=simulation["object_states"],
            propagation_steps=simulation["propagation_steps"],
            scene_overlay=scene_overlay,
            timeline_slice=timeline_slice,
            advice_slice=advice_slice,
        )
        return result.model_dump()

    def _resolve_baseline(self, request: ScenarioSimulationRequest) -> FragilityScanResponse:
        if request.baseline_scanner_result is not None:
            return request.baseline_scanner_result

        scan_payload: dict[str, Any] = {
            "text": request.scenario_text,
            "source_type": "text",
            "metadata": {
                **dict(request.metadata or {}),
                **({"domain": request.domain} if request.domain else {}),
                "scenario_mode": "simulation_lite",
            },
        }
        if request.signal_bundle is not None:
            scan_payload = {
                "signal_bundle": request.signal_bundle.model_dump(),
                "metadata": {
                    **dict(request.metadata or {}),
                    **({"domain": request.domain} if request.domain else {}),
                    "scenario_mode": "simulation_lite",
                },
            }
        baseline_result = self._scanner_orchestrator.run_scan(scan_payload)
        return FragilityScanResponse.model_validate(baseline_result)

    @staticmethod
    def _build_timeline_slice(propagation_steps: list[Any]) -> PanelTimelineSlice:
        related_object_ids: list[str] = []
        events = [
            PanelTimelineEvent(
                id=step.id,
                label=step.label,
                type=step.type,
                order=step.order,
                confidence=step.confidence,
                related_object_ids=list(
                    dict.fromkeys(
                        [
                            *getattr(step, "source_object_ids", []),
                            *getattr(step, "target_object_ids", []),
                        ]
                    )
                )[:5],
            )
            for step in propagation_steps
        ]
        for event in events:
            related_object_ids.extend(event.related_object_ids)
        related_object_ids = list(dict.fromkeys(related_object_ids))[:5]
        return PanelTimelineSlice(
            headline="Scenario Timeline",
            summary=(
                f"Tracking {len(events)} projected propagation steps."
                if events
                else "No projected propagation steps are available yet."
            ),
            events=events,
            related_object_ids=related_object_ids,
        )

    @staticmethod
    def _build_advice_slice(
        *,
        scenario_type: str,
        primary_objects: list[str],
        affected_objects: list[str],
        overall_impact_level: str,
    ) -> PanelAdviceSlice:
        primary_label = primary_objects[0].replace("obj_", "").replace("_", " ") if primary_objects else "primary pressure point"
        affected_label = affected_objects[0].replace("obj_", "").replace("_", " ") if affected_objects else "downstream impact"
        recommendation_map = {
            "supplier_disruption": [
                f"Stabilize {primary_label} first before inventory pressure deepens.",
                f"Protect {affected_label} with temporary buffer capacity and close monitoring.",
            ],
            "cost_pressure": [
                f"Contain {primary_label} first to preserve short-term operating flexibility.",
                f"Review {affected_label} exposure before pressure reaches customer-facing decisions.",
            ],
            "demand_spike": [
                f"Rebalance {primary_label} first to avoid a wider service bottleneck.",
                f"Watch {affected_label} closely while demand pressure remains elevated.",
            ],
            "delivery_delay": [
                f"Intervene at {primary_label} first to stop delay pressure from spreading.",
                f"Prepare a mitigation path for {affected_label} if recovery stays slow.",
            ],
            "operational_weakness": [
                f"Stabilize {primary_label} first to restore execution consistency.",
                f"Watch {affected_label} for secondary pressure while the process remains weak.",
            ],
            "generic_instability": [
                f"Stabilize {primary_label} first before broader pressure spreads further.",
                f"Keep {affected_label} under watch while the system remains unsettled.",
            ],
        }
        recommendations = recommendation_map.get(scenario_type, recommendation_map["generic_instability"])
        related_object_ids = list(dict.fromkeys([*primary_objects[:2], *affected_objects[:3]]))[:5]
        primary_recommendation = recommendations[0] if recommendations else None
        return PanelAdviceSlice(
            title="Scenario Advice",
            summary=f"Projected impact is {overall_impact_level}; intervene at the first pressure point before downstream objects harden into higher risk.",
            why=(
                f"{scenario_type.replace('_', ' ').title()} is projected to pressure {primary_label} first and may then spread into {affected_label}."
            ),
            recommendation=primary_recommendation,
            risk_summary=(
                f"Scenario impact is projected at a {overall_impact_level} level across {len(related_object_ids)} tracked object(s)."
            ),
            recommendations=recommendations,
            related_object_ids=related_object_ids,
            supporting_driver_labels=[scenario_type.replace("_", " ").title()],
            recommended_actions=[
                {
                    "action": action,
                    "impact_summary": f"Helps contain projected {scenario_type.replace('_', ' ')} pressure.",
                    "tradeoff": None,
                }
                for action in recommendations[:3]
            ],
            primary_recommendation={"action": primary_recommendation} if primary_recommendation else None,
            confidence={"score": 0.72},
        )

    @staticmethod
    def _build_summary(
        *,
        scenario_type: str,
        overall_impact_level: str,
        primary_objects: list[str],
        affected_objects: list[str],
    ) -> str:
        primary_label = primary_objects[0].replace("obj_", "").replace("_", " ") if primary_objects else "core operations"
        if affected_objects:
            downstream = affected_objects[0].replace("obj_", "").replace("_", " ")
            return f"{scenario_type.replace('_', ' ').title()} would likely put {primary_label} under {overall_impact_level} pressure first, then spread into {downstream}."
        return f"{scenario_type.replace('_', ' ').title()} would likely keep pressure concentrated around {primary_label} at a {overall_impact_level} level."
