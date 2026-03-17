from __future__ import annotations

import json
from pathlib import Path

import pytest

from backend.tests.ai_regression.regression_cases import get_regression_cases
from backend.tests.ai_regression.regression_runner import run_regression_suite_sync


@pytest.mark.regression
@pytest.mark.e2e
def test_regression_runner_executes_cases_and_writes_report(tmp_path: Path):
    output_path = tmp_path / "regression_summary.json"

    result = run_regression_suite_sync(output_path=output_path)

    assert result.summary.total_cases >= 1
    assert output_path.exists()
    payload = json.loads(output_path.read_text(encoding="utf-8"))
    assert payload["summary"]["total_cases"] == result.summary.total_cases


@pytest.mark.regression
@pytest.mark.e2e
def test_regression_runner_reports_failures_clearly():
    case = get_regression_cases()[0].model_copy(
        deep=True,
        update={
            "evaluation_case": get_regression_cases()[0].evaluation_case.model_copy(
                deep=True,
                update={"expected_provider": "openai"}
            )
        },
    )

    result = run_regression_suite_sync([case], output_path=None)

    assert result.summary.failed_cases == 1
    assert any("unexpected provider" in reason.lower() for reason in result.cases[0].failure_reasons)
