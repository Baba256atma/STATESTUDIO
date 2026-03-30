"""Evaluate generated strategies by reusing compare and intelligence layers."""

from __future__ import annotations

from typing import Any

from engines.compare_mode.compare_models import CompareInput
from engines.compare_mode.compare_service import run_compare
from engines.strategy_generation.strategy_models import EvaluatedStrategy, GeneratedStrategy, StrategyGenerationInput
from engines.strategy_generation.strategy_policy import compute_expected_impact, compute_risk_level, score_strategy
from engines.system_intelligence.intelligence_models import SystemIntelligenceResult


def evaluate_generated_strategy(
    *,
    strategy: GeneratedStrategy,
    baseline_intelligence: SystemIntelligenceResult,
    simulated_intelligence: SystemIntelligenceResult,
    constraints: StrategyGenerationInput,
) -> tuple[EvaluatedStrategy, dict[str, Any]]:
    compare_result = run_compare(
        CompareInput(
            scenarioA={
                "scenario": constraints.currentScenario or {"id": "baseline", "title": "Current System"},
                "intelligence": baseline_intelligence,
            },
            scenarioB={
                "scenario": {"id": strategy.strategy_id, "title": strategy.title},
                "intelligence": simulated_intelligence,
            },
            focusDimension=constraints.constraints.preferredFocus,
        )
    )
    compare_dict = compare_result.model_dump(mode="python")
    simulated_dict = simulated_intelligence.model_dump(mode="python")
    score = score_strategy(
        compare_result=compare_dict,
        intelligence=simulated_dict,
        preferred_focus=constraints.constraints.preferredFocus,
        risk_tolerance=constraints.constraints.riskTolerance,
    )
    evaluated = EvaluatedStrategy(
        strategy=strategy,
        intelligence=simulated_intelligence,
        score=score,
        ranking=1,
        tradeoffs=[str(item.explanation) for item in compare_result.tradeoffs[:3]],
        risk_level=compute_risk_level(simulated_dict),
        expected_impact=compute_expected_impact(compare_dict),
    )
    return evaluated, compare_dict

