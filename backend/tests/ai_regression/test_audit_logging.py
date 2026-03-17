from __future__ import annotations

import pytest

from backend.tests.ai_regression.utils import get_case, run_case_observed


@pytest.mark.regression
@pytest.mark.audit
def test_routing_decision_is_recorded():
    observed = run_case_observed(get_case("safe_public_summarization"))

    assert "routing_decided" in observed.audit_stages


@pytest.mark.regression
@pytest.mark.audit
def test_provider_selection_is_recorded():
    observed = run_case_observed(get_case("internal_operational_analysis"))

    assert "provider_selected" in observed.audit_stages


@pytest.mark.regression
@pytest.mark.audit
def test_fallback_is_recorded():
    observed = run_case_observed(get_case("provider_unavailable_fallback_case"))

    assert "fallback_applied" in observed.audit_stages
