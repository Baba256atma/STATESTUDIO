from __future__ import annotations

import asyncio
import json
from pathlib import Path

from tools.e2e_ai_eval.eval_assertions import evaluate_case_result
from tools.e2e_ai_eval.eval_cases import get_default_evaluation_cases
from tools.e2e_ai_eval.eval_report import build_summary, print_console_report, write_json_report
from tools.e2e_ai_eval.eval_results import EvaluationRunResult, EvaluationScoreSummary
from tools.e2e_ai_eval.eval_runner import run_evaluation


def test_evaluation_runner_executes_cases_successfully(tmp_path: Path):
    cases = get_default_evaluation_cases()
    output_path = tmp_path / "e2e_eval.json"

    result = asyncio.run(run_evaluation(cases[:2], output_path=output_path))

    assert result.summary.total_cases == 2
    assert output_path.exists()
    payload = json.loads(output_path.read_text(encoding="utf-8"))
    assert payload["summary"]["total_cases"] == 2


def test_expected_routing_mismatch_is_reported_clearly():
    case = get_default_evaluation_cases()[0].model_copy(update={"expected_provider": "openai"})
    result = asyncio.run(run_evaluation([case], output_path=None))

    assert result.cases[0].routing_passed is False
    assert "unexpected provider" in " ".join(result.cases[0].failure_reasons).lower()


def test_fallback_behavior_is_scored_correctly():
    case = next(
        item for item in get_default_evaluation_cases()
        if item.case_id == "provider_unavailable_fallback_case"
    )
    result = asyncio.run(run_evaluation([case], output_path=None))

    assert result.cases[0].fallback_passed is True
    assert result.cases[0].fallback_used is True


def test_audit_completeness_is_checked_correctly():
    case = get_default_evaluation_cases()[0]
    observed_run = asyncio.run(run_evaluation([case], output_path=None))
    passed_case = observed_run.cases[0]

    assert passed_case.audit_passed is True
    assert any(assertion.stage == "audit" for assertion in passed_case.stage_assertions)


def test_response_validation_failures_are_captured_correctly():
    case = next(
        item for item in get_default_evaluation_cases()
        if item.case_id == "invalid_structured_response_case"
    )
    result = asyncio.run(run_evaluation([case], output_path=None))

    assert result.cases[0].response_valid_passed is True
    assert result.cases[0].passed is True


def test_report_generation_works(tmp_path: Path):
    result = asyncio.run(run_evaluation(get_default_evaluation_cases()[:1], output_path=None))
    summary = build_summary(result.cases)
    run_result = EvaluationRunResult(
        started_at=result.started_at,
        completed_at=result.completed_at,
        mocked_providers=True,
        include_audit_checks=True,
        output_path=None,
        cases=result.cases,
        summary=summary,
    )
    report_path = write_json_report(run_result, tmp_path / "report.json")
    console_report = print_console_report(run_result)

    assert report_path.exists()
    assert "Nexora AI E2E Evaluation" in console_report


def test_mocked_provider_mode_runs_without_network_dependencies():
    result = asyncio.run(run_evaluation(get_default_evaluation_cases()[:1], output_path=None))
    assert result.mocked_providers is True
    assert result.summary.total_cases == 1
