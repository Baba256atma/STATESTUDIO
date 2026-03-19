"""Deterministic stage assertions for end-to-end AI routing evaluation."""

from __future__ import annotations

from typing import Any

from app.schemas.audit import AuditEvent
from tools.e2e_ai_eval.eval_results import EvaluationCaseResult, StageAssertionResult
from tools.e2e_ai_eval.eval_types import EvaluationCase, ObservedEvaluationState


REDACTION_FORBIDDEN_KEYS = {"text", "prompt", "messages", "raw_output"}


def evaluate_case_result(
    case: EvaluationCase,
    observed: ObservedEvaluationState,
    *,
    include_audit_checks: bool,
) -> EvaluationCaseResult:
    """Compare observed pipeline behavior to expected case outcomes."""
    assertions = [
        _assert_privacy(case, observed),
        _assert_routing(case, observed),
        _assert_provider(case, observed),
        _assert_model_selection(case, observed),
        _assert_fallback(case, observed),
        _assert_response_validity(case, observed),
        _assert_audit(case, observed) if include_audit_checks else _audit_skipped(),
    ]

    passed_count = sum(1 for assertion in assertions if assertion.passed)
    total_count = len(assertions)
    score = round(passed_count / total_count, 4) if total_count else 0.0
    failure_reasons = [assertion.reason for assertion in assertions if not assertion.passed]
    warnings = [assertion.reason for assertion in assertions if assertion.stage == "audit" and not include_audit_checks]

    by_stage = {assertion.stage: assertion for assertion in assertions}
    return EvaluationCaseResult(
        case_id=case.case_id,
        passed=not failure_reasons,
        score=score,
        privacy_classification_passed=by_stage["privacy"].passed,
        routing_passed=by_stage["routing"].passed,
        provider_selection_passed=by_stage["provider_selection"].passed,
        model_selection_passed=by_stage["model_selection"].passed,
        fallback_passed=by_stage["fallback"].passed,
        response_valid_passed=by_stage["response_validity"].passed,
        audit_passed=by_stage["audit"].passed,
        latency_ms=observed.latency_ms,
        selected_provider=observed.selected_provider,
        selected_model=observed.selected_model,
        fallback_used=observed.fallback_used,
        benchmark_used=observed.benchmark_used,
        failure_reasons=failure_reasons,
        warnings=warnings,
        stage_assertions=assertions,
    )


def _assert_privacy(case: EvaluationCase, observed: ObservedEvaluationState) -> StageAssertionResult:
    actual = observed.privacy_result
    passed = (
        actual.sensitivity_level == case.expected_sensitivity_level
        and actual.privacy_mode == case.expected_privacy_mode
        and actual.cloud_allowed is case.expected_cloud_allowed
        and actual.local_required is case.expected_local_required
    )
    return StageAssertionResult(
        stage="privacy",
        passed=passed,
        reason=(
            "Privacy classification matched expected policy outcome"
            if passed
            else "Privacy classification did not match expected policy outcome"
        ),
        expected={
            "sensitivity_level": case.expected_sensitivity_level,
            "privacy_mode": case.expected_privacy_mode,
            "cloud_allowed": case.expected_cloud_allowed,
            "local_required": case.expected_local_required,
        },
        actual={
            "sensitivity_level": actual.sensitivity_level,
            "privacy_mode": actual.privacy_mode,
            "cloud_allowed": actual.cloud_allowed,
            "local_required": actual.local_required,
        },
    )


def _assert_routing(case: EvaluationCase, observed: ObservedEvaluationState) -> StageAssertionResult:
    actual = observed.routing_decision
    passed = actual.selected_provider == case.expected_provider
    return StageAssertionResult(
        stage="routing",
        passed=passed,
        reason="Routing decision matched expected provider" if passed else "Routing decision selected an unexpected provider",
        expected={"selected_provider": case.expected_provider},
        actual={
            "selected_provider": actual.selected_provider,
            "routing_reason": actual.routing_reason,
            "cloud_allowed": actual.cloud_allowed,
        },
    )


def _assert_provider(case: EvaluationCase, observed: ObservedEvaluationState) -> StageAssertionResult:
    passed = observed.selected_provider == case.expected_provider
    return StageAssertionResult(
        stage="provider_selection",
        passed=passed,
        reason="Provider selection matched expected provider" if passed else "Provider selection did not match expected provider",
        expected={"selected_provider": case.expected_provider},
        actual={"selected_provider": observed.selected_provider},
    )


def _assert_model_selection(case: EvaluationCase, observed: ObservedEvaluationState) -> StageAssertionResult:
    if case.expected_selected_model:
        passed = observed.selected_model == case.expected_selected_model
        reason = "Model selection matched expected model" if passed else "Model selection did not match expected model"
    else:
        passed = bool(observed.selected_model)
        reason = "Model selection produced a concrete model" if passed else "Model selection did not produce a concrete model"
    if passed:
        passed = observed.benchmark_used is case.expected_benchmark_used
        if not passed:
            reason = "Benchmark usage did not match expected selection behavior"
    return StageAssertionResult(
        stage="model_selection",
        passed=passed,
        reason=reason,
        expected={
            "selected_model": case.expected_selected_model,
            "benchmark_used": case.expected_benchmark_used,
        },
        actual={
            "selected_model": observed.selected_model,
            "benchmark_used": observed.benchmark_used,
            "reason": observed.selection_result.reason,
        },
    )


def _assert_fallback(case: EvaluationCase, observed: ObservedEvaluationState) -> StageAssertionResult:
    passed = observed.fallback_used is case.expected_fallback_behavior
    return StageAssertionResult(
        stage="fallback",
        passed=passed,
        reason="Fallback behavior matched expectation" if passed else "Fallback behavior did not match expectation",
        expected={"fallback_used": case.expected_fallback_behavior},
        actual={"fallback_used": observed.fallback_used},
    )


def _assert_response_validity(case: EvaluationCase, observed: ObservedEvaluationState) -> StageAssertionResult:
    passed = observed.response_valid is case.expected_response_valid
    return StageAssertionResult(
        stage="response_validity",
        passed=passed,
        reason="Structured response validity matched expectation" if passed else "Structured response validity did not match expectation",
        expected={"response_valid": case.expected_response_valid},
        actual={
            "response_valid": observed.response_valid,
            "response_ok": observed.response.ok,
            "provider": observed.response.provider,
        },
    )


def _assert_audit(case: EvaluationCase, observed: ObservedEvaluationState) -> StageAssertionResult:
    missing_stages = [stage for stage in case.expected_audit_stages if stage not in observed.audit_stages]
    exposed_keys = _find_exposed_keys(observed.audit_events)
    passed = not missing_stages and not exposed_keys
    actual_reason = []
    if missing_stages:
        actual_reason.append(f"missing stages: {', '.join(missing_stages)}")
    if exposed_keys:
        actual_reason.append(f"exposed sensitive keys: {', '.join(sorted(exposed_keys))}")
    reason = "Audit trail matched expected execution path" if passed else "; ".join(actual_reason)
    return StageAssertionResult(
        stage="audit",
        passed=passed,
        reason=reason,
        expected={"required_stages": case.expected_audit_stages},
        actual={
            "recorded_stages": observed.audit_stages,
            "exposed_sensitive_keys": sorted(exposed_keys),
        },
    )


def _audit_skipped() -> StageAssertionResult:
    return StageAssertionResult(
        stage="audit",
        passed=True,
        reason="Audit checks were skipped",
        expected={},
        actual={},
    )


def _find_exposed_keys(events: list[AuditEvent]) -> set[str]:
    exposed: set[str] = set()
    for event in events:
        _walk_metadata(event.metadata, exposed)
    return exposed


def _walk_metadata(metadata: dict[str, Any], exposed: set[str]) -> None:
    for key, value in metadata.items():
        normalized_key = key.strip().lower()
        if normalized_key in REDACTION_FORBIDDEN_KEYS:
            exposed.add(normalized_key)
        if isinstance(value, dict):
            _walk_metadata(value, exposed)
