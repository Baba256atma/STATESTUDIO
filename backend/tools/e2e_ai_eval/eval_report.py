"""Reporting helpers for end-to-end AI routing evaluation."""

from __future__ import annotations

import json
from pathlib import Path

from backend.tools.e2e_ai_eval.eval_results import (
    EvaluationCaseResult,
    EvaluationRunResult,
    EvaluationScoreSummary,
)


def build_summary(case_results: list[EvaluationCaseResult]) -> EvaluationScoreSummary:
    """Aggregate pass rates and latency across case results."""
    total_cases = len(case_results)
    passed_cases = sum(1 for result in case_results if result.passed)
    latencies = [result.latency_ms for result in case_results if result.latency_ms is not None]
    return EvaluationScoreSummary(
        total_cases=total_cases,
        passed_cases=passed_cases,
        pass_rate=_rate(passed_cases, total_cases),
        privacy_pass_rate=_rate(sum(1 for result in case_results if result.privacy_classification_passed), total_cases),
        routing_pass_rate=_rate(sum(1 for result in case_results if result.routing_passed), total_cases),
        provider_selection_pass_rate=_rate(sum(1 for result in case_results if result.provider_selection_passed), total_cases),
        model_selection_pass_rate=_rate(sum(1 for result in case_results if result.model_selection_passed), total_cases),
        fallback_pass_rate=_rate(sum(1 for result in case_results if result.fallback_passed), total_cases),
        response_valid_pass_rate=_rate(sum(1 for result in case_results if result.response_valid_passed), total_cases),
        audit_pass_rate=_rate(sum(1 for result in case_results if result.audit_passed), total_cases),
        average_latency_ms=round(sum(latencies) / len(latencies), 2) if latencies else 0.0,
    )


def print_console_report(run_result: EvaluationRunResult) -> str:
    """Return a compact plain-text console summary for an evaluation run."""
    summary = run_result.summary
    lines = [
        "Nexora AI E2E Evaluation",
        f"Cases: {summary.passed_cases}/{summary.total_cases} passed ({summary.pass_rate:.0%})",
        f"Privacy: {summary.privacy_pass_rate:.0%}",
        f"Routing: {summary.routing_pass_rate:.0%}",
        f"Provider: {summary.provider_selection_pass_rate:.0%}",
        f"Model: {summary.model_selection_pass_rate:.0%}",
        f"Fallback: {summary.fallback_pass_rate:.0%}",
        f"Response validity: {summary.response_valid_pass_rate:.0%}",
        f"Audit: {summary.audit_pass_rate:.0%}",
        f"Average latency: {summary.average_latency_ms:.2f} ms",
    ]
    for case in run_result.cases:
        status = "PASS" if case.passed else "FAIL"
        lines.append(
            f"- {status} {case.case_id} provider={case.selected_provider} model={case.selected_model} score={case.score:.2f}"
        )
    return "\n".join(lines)


def write_json_report(run_result: EvaluationRunResult, output_path: str | Path) -> Path:
    """Write the full evaluation result to a JSON file."""
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(run_result.model_dump(), indent=2, ensure_ascii=True) + "\n",
        encoding="utf-8",
    )
    return path


def _rate(passed: int, total: int) -> float:
    return round((passed / total), 4) if total else 0.0
