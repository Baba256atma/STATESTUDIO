from __future__ import annotations

import pytest

from tests.ai_regression.utils import clone_case, get_case, run_case_observed, run_case_result, valid_payload


@pytest.mark.regression
@pytest.mark.fallback
def test_local_provider_failure_triggers_cloud_fallback_when_allowed():
    case = get_case("provider_unavailable_fallback_case")
    result = run_case_result(case)

    assert result.fallback_passed is True
    assert result.fallback_used is True
    assert result.selected_provider == "openai"


@pytest.mark.regression
@pytest.mark.fallback
def test_fallback_disabled_triggers_safe_failure():
    base_case = get_case("provider_unavailable_fallback_case")
    case = clone_case(
        base_case,
        case_id="fallback_disabled_safe_failure",
        metadata={"task": "explain"},
        expected_privacy_mode="default",
        expected_cloud_allowed=False,
        expected_provider=None,
        expected_fallback_behavior=False,
        expected_response_valid=False,
        expected_audit_stages=[
            "request_received",
            "privacy_classified",
            "routing_decided",
            "response_returned",
        ],
        provider_scenarios=[
            base_case.provider_scenarios[0],
            base_case.provider_scenarios[1].model_copy(
                update={"response_payload": valid_payload("Fallback would have succeeded if allowed.")}
            ),
        ],
    )

    observed = run_case_observed(case)

    assert observed.selected_provider is None
    assert observed.response.ok is False
    assert "response_returned" in observed.audit_stages
