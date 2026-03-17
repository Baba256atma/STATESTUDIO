from __future__ import annotations

import asyncio

import pytest

from backend.tools.e2e_ai_eval.eval_cases import get_default_evaluation_cases
from backend.tools.e2e_ai_eval.eval_runner import run_evaluation
from backend.tests.ai_regression.utils import get_case, run_case_result


@pytest.mark.regression
@pytest.mark.e2e
def test_evaluation_case_executes_successfully():
    case = get_case("safe_public_summarization")
    result = run_case_result(case)

    assert result.passed is True


@pytest.mark.regression
@pytest.mark.e2e
def test_routing_path_matches_expected_policy():
    case = get_case("restricted_content_local_only")
    result = run_case_result(case)

    assert result.routing_passed is True
    assert result.selected_provider == "ollama"


@pytest.mark.regression
@pytest.mark.e2e
def test_full_evaluation_harness_passes_default_regression_cases():
    result = asyncio.run(run_evaluation(get_default_evaluation_cases(), output_path=None))

    assert result.summary.total_cases >= 1
    assert result.summary.passed_cases == result.summary.total_cases
