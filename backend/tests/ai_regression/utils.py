"""Shared utilities for deterministic AI routing regression tests."""

from __future__ import annotations

import asyncio

from tools.e2e_ai_eval.eval_assertions import evaluate_case_result
from tools.e2e_ai_eval.eval_cases import get_default_evaluation_cases
from tools.e2e_ai_eval.eval_runner import run_case_observation, run_evaluation
from tools.e2e_ai_eval.eval_types import EvaluationCase, ProviderScenario


def get_case(case_id: str) -> EvaluationCase:
    """Return a built-in evaluation case by identifier."""
    for case in get_default_evaluation_cases():
        if case.case_id == case_id:
            return case
    raise KeyError(f"Unknown evaluation case: {case_id}")


def clone_case(case: EvaluationCase, **updates) -> EvaluationCase:
    """Return a deep-copied case with deterministic updates applied."""
    return case.model_copy(deep=True, update=updates)


def run_case_result(case: EvaluationCase, *, include_audit_checks: bool = True):
    """Execute and score a single evaluation case."""
    result = asyncio.run(
        run_evaluation(
            [case],
            include_audit_checks=include_audit_checks,
            output_path=None,
        )
    )
    return result.cases[0]


def run_case_observed(case: EvaluationCase):
    """Execute a single evaluation case and return observed pipeline state."""
    return asyncio.run(run_case_observation(case))


def score_observed_case(case: EvaluationCase, *, include_audit_checks: bool = True):
    """Execute a case and return both observed and scored results."""
    observed = run_case_observed(case)
    scored = evaluate_case_result(
        case,
        observed,
        include_audit_checks=include_audit_checks,
    )
    return observed, scored


def valid_payload(summary: str = "Deterministic regression response.") -> dict[str, object]:
    """Return a structured provider payload suitable for regression tests."""
    return {
        "summary": summary,
        "risk_signals": [],
        "object_candidates": [],
        "metadata": {"confidence": 0.95},
    }


def make_provider(
    provider: str,
    *,
    kind: str,
    available: bool = True,
    models: list[str] | None = None,
    response_payload: dict | list | None = None,
) -> ProviderScenario:
    """Build a deterministic provider scenario for custom regression cases."""
    return ProviderScenario(
        provider=provider,
        kind=kind,
        available=available,
        models=models or [],
        response_payload=response_payload,
    )
