"""Stage-aware assertions for the AI routing regression suite."""

from __future__ import annotations

from backend.tests.ai_regression.regression_types import (
    RegressionCase,
    RegressionCaseResult,
    RegressionStageResult,
)
from backend.tools.e2e_ai_eval.eval_results import EvaluationCaseResult


CRITICAL_STAGE_MAP = {
    "privacy": ["privacy"],
    "routing": ["routing", "provider_selection"],
    "provider": ["routing", "provider_selection"],
    "model_selection": ["model_selection"],
    "fallback": ["fallback", "routing", "provider_selection"],
    "audit": ["audit", "response_validity"],
    "e2e": [
        "privacy",
        "routing",
        "provider_selection",
        "model_selection",
        "fallback",
        "response_validity",
        "audit",
    ],
}


def assert_regression_case(case: RegressionCase, evaluation_result: EvaluationCaseResult) -> RegressionCaseResult:
    """Convert evaluation results into CI-friendly regression results."""
    stage_lookup = {stage.stage: stage for stage in evaluation_result.stage_assertions}
    critical_stages = CRITICAL_STAGE_MAP[case.category]
    stages = [
        RegressionStageResult(
            stage=stage_name,
            passed=bool(stage_lookup[stage_name].passed),
            reason=stage_lookup[stage_name].reason,
        )
        for stage_name in critical_stages
    ]
    failure_reasons = [stage.reason for stage in stages if not stage.passed]
    return RegressionCaseResult(
        case_id=case.case_id,
        category=case.category,
        passed=not failure_reasons,
        latency_ms=evaluation_result.latency_ms,
        fallback_used=evaluation_result.fallback_used,
        selected_provider=evaluation_result.selected_provider,
        selected_model=evaluation_result.selected_model,
        failure_reasons=failure_reasons,
        stages=stages,
    )
