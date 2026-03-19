"""Deterministic regression cases for the AI routing regression suite."""

from __future__ import annotations

from tests.ai_regression.regression_types import RegressionCase
from tools.e2e_ai_eval.eval_cases import get_default_evaluation_cases


def get_regression_cases() -> list[RegressionCase]:
    """Return curated regression cases derived from evaluation harness scenarios."""
    evaluation_cases = {case.case_id: case for case in get_default_evaluation_cases()}
    return [
        RegressionCase(
            case_id="safe_public_summarization",
            category="routing",
            description="Public low-risk summarization should stay deterministic and local-first.",
            evaluation_case=evaluation_cases["safe_public_summarization"],
        ),
        RegressionCase(
            case_id="internal_operational_analysis",
            category="privacy",
            description="Internal operational analysis should remain local-first and privacy-safe.",
            evaluation_case=evaluation_cases["internal_operational_analysis"],
        ),
        RegressionCase(
            case_id="confidential_uploaded_content_analysis",
            category="privacy",
            description="Uploaded confidential content must not become cloud-eligible.",
            evaluation_case=evaluation_cases["confidential_uploaded_content_analysis"],
        ),
        RegressionCase(
            case_id="cloud_allowed_reasoning_scenario",
            category="provider",
            description="Cloud-allowed reasoning should select the cloud provider when local is unavailable.",
            evaluation_case=evaluation_cases["cloud_allowed_reasoning_scenario"],
        ),
        RegressionCase(
            case_id="provider_unavailable_fallback_case",
            category="fallback",
            description="Local unavailability must trigger deterministic fallback when policy permits it.",
            evaluation_case=evaluation_cases["provider_unavailable_fallback_case"],
        ),
        RegressionCase(
            case_id="benchmark_influenced_selection_scenario",
            category="model_selection",
            description="Benchmark-aware model selection should remain stable for the curated benchmark case.",
            evaluation_case=evaluation_cases["benchmark_influenced_selection_scenario"],
        ),
        RegressionCase(
            case_id="invalid_structured_response_case",
            category="audit",
            description="Invalid structured output must still produce a complete and safe audit trail.",
            evaluation_case=evaluation_cases["invalid_structured_response_case"],
        ),
    ]
