"""Strategy generation orchestration above intelligence and compare mode."""

from __future__ import annotations

from engines.evolution.evolution_service import get_current_policy_inputs
from engines.scenario_simulation.scenario_action_models import ScenarioActionRequest
from engines.scenario_simulation.scenario_action_service import run_scenario_action
from engines.strategy_generation.strategy_evaluator import evaluate_generated_strategy
from engines.strategy_generation.strategy_generator import generate_candidate_strategies
from engines.strategy_generation.strategy_models import (
    EvaluatedStrategy,
    StrategyGenerationInput,
    StrategyGenerationResult,
    StrategyGenerationSummary,
)
from engines.strategy_generation.strategy_policy import rank_generated_strategies, summarize_generation, clamp01
from engines.system_intelligence.intelligence_models import SystemIntelligenceInput
from engines.system_intelligence.intelligence_service import run_system_intelligence


def run_strategy_generation(input_data: StrategyGenerationInput) -> StrategyGenerationResult:
    candidates = generate_candidate_strategies(input_data)
    strategy_policy_inputs = get_current_policy_inputs().get("strategy_generation", {})
    evaluated_rows: list[dict] = []

    for candidate in candidates:
        primary_action = candidate.actions[0] if candidate.actions else None
        if primary_action is None or not primary_action.source_object_id:
            continue
        scenario_bundle = run_scenario_action(
            ScenarioActionRequest(
                scenario_action=primary_action,
                scene_json=input_data.scene_json,
                object_graph=input_data.object_graph,
                max_depth=2 if input_data.mode == "stress_test" else 3 if input_data.mode == "optimize" else 2,
                decay=0.7 if input_data.mode == "stress_test" else 0.76,
            )
        )
        simulated_intelligence = run_system_intelligence(
            SystemIntelligenceInput(
                scenario_action=scenario_bundle.scenario_action.model_dump(mode="python"),
                propagation=scenario_bundle.propagation.model_dump(mode="python") if scenario_bundle.propagation else None,
                decision_path=scenario_bundle.decision_path.model_dump(mode="python") if scenario_bundle.decision_path else None,
                scene_json=input_data.scene_json,
                current_focus_object_id=primary_action.source_object_id,
                mode="decision" if "decision_path" in (primary_action.requested_outputs or []) else "simulation",
            )
        )
        evaluated, compare_result = evaluate_generated_strategy(
            strategy=candidate,
            baseline_intelligence=input_data.intelligence,
            simulated_intelligence=simulated_intelligence,
            constraints=input_data,
        )
        evaluated_rows.append(
            {
                "evaluated": evaluated,
                "compare": compare_result,
                "score": evaluated.score + float(
                    strategy_policy_inputs.get(f"strategy_kind:{primary_action.action_kind}", 0.0)
                ),
                "expected_impact": evaluated.expected_impact,
                "risk_level": evaluated.risk_level,
            }
        )

    ranked_rows = rank_generated_strategies(evaluated_rows)
    strategies: list[EvaluatedStrategy] = []
    for idx, item in enumerate(ranked_rows, start=1):
        evaluated = item["evaluated"]
        evaluated.ranking = idx
        strategies.append(evaluated)

    recommended = strategies[0] if strategies else None
    headline, explanation = summarize_generation(
        recommended_title=recommended.strategy.title if recommended else None,
        preferred_focus=input_data.constraints.preferredFocus,
        strategy_count=len(strategies),
    )
    summary = StrategyGenerationSummary(
        headline=headline,
        explanation=explanation,
        confidence=clamp01(recommended.score if recommended else 0.0),
    )

    return StrategyGenerationResult(
        strategies=strategies,
        recommended_strategy_id=recommended.strategy.strategy_id if recommended else None,
        summary=summary,
    )
