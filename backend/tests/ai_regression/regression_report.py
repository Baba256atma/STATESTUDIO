"""Reporting helpers for the AI routing regression suite."""

from __future__ import annotations

import json
from pathlib import Path

from tests.ai_regression.regression_types import (
    RegressionCaseResult,
    RegressionRunResult,
    RegressionSummary,
)


def build_regression_summary(case_results: list[RegressionCaseResult]) -> RegressionSummary:
    """Aggregate regression results into a compact summary."""
    total_cases = len(case_results)
    passed_cases = sum(1 for case in case_results if case.passed)
    failed_cases = total_cases - passed_cases
    latencies = [case.latency_ms for case in case_results if case.latency_ms is not None]
    stage_failure_counts: dict[str, int] = {}
    audit_failure_count = 0
    for case in case_results:
        for stage in case.stages:
            if not stage.passed:
                stage_failure_counts[stage.stage] = stage_failure_counts.get(stage.stage, 0) + 1
                if stage.stage == "audit":
                    audit_failure_count += 1
    return RegressionSummary(
        total_cases=total_cases,
        passed_cases=passed_cases,
        failed_cases=failed_cases,
        pass_rate=round((passed_cases / total_cases), 4) if total_cases else 0.0,
        average_latency_ms=round(sum(latencies) / len(latencies), 2) if latencies else 0.0,
        fallback_case_count=sum(1 for case in case_results if case.fallback_used),
        audit_failure_count=audit_failure_count,
        stage_failure_counts=stage_failure_counts,
    )


def render_regression_console_report(run_result: RegressionRunResult, *, verbose: bool = False) -> str:
    """Return a compact console summary for CI logs and local runs."""
    summary = run_result.summary
    lines = [
        "Nexora AI Routing Regression",
        f"Cases: {summary.passed_cases}/{summary.total_cases} passed ({summary.pass_rate:.0%})",
        f"Average latency: {summary.average_latency_ms:.2f} ms",
        f"Fallback cases: {summary.fallback_case_count}",
        f"Audit failures: {summary.audit_failure_count}",
    ]
    for case in run_result.cases:
        status = "PASS" if case.passed else "FAIL"
        lines.append(
            f"- {status} {case.case_id} category={case.category} provider={case.selected_provider} model={case.selected_model}"
        )
        if verbose:
            for stage in case.stages:
                stage_status = "PASS" if stage.passed else "FAIL"
                lines.append(f"  {stage_status} {stage.stage}: {stage.reason}")
    return "\n".join(lines)


def write_regression_report(run_result: RegressionRunResult, output_path: str | Path) -> Path:
    """Write a regression report JSON artifact."""
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(run_result.model_dump(), indent=2, ensure_ascii=True) + "\n",
        encoding="utf-8",
    )
    return path
