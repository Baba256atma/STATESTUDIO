"""Runner for the AI routing regression suite."""

from __future__ import annotations

import argparse
import asyncio
from datetime import UTC, datetime
from pathlib import Path

from tests.ai_regression.regression_assertions import assert_regression_case
from tests.ai_regression.regression_cases import get_regression_cases
from tests.ai_regression.regression_report import (
    build_regression_summary,
    render_regression_console_report,
    write_regression_report,
)
from tests.ai_regression.regression_types import RegressionCase, RegressionRunResult
from tools.e2e_ai_eval.eval_runner import run_evaluation


DEFAULT_OUTPUT_PATH = Path("backend/tools/e2e_ai_eval/regression_summary.json")


async def run_regression_suite(
    cases: list[RegressionCase] | None = None,
    *,
    verbose: bool = False,
    output_path: str | Path | None = DEFAULT_OUTPUT_PATH,
) -> RegressionRunResult:
    """Execute the regression suite using the evaluation harness as the engine."""
    selected_cases = cases or get_regression_cases()
    evaluation_result = await run_evaluation(
        [case.evaluation_case for case in selected_cases],
        include_audit_checks=True,
        output_path=None,
    )
    evaluation_lookup = {case_result.case_id: case_result for case_result in evaluation_result.cases}
    case_results = [
        assert_regression_case(case, evaluation_lookup[case.case_id])
        for case in selected_cases
    ]
    run_result = RegressionRunResult(
        generated_at=datetime.now(UTC).isoformat(),
        verbose=verbose,
        cases=case_results,
        summary=build_regression_summary(case_results),
    )
    if output_path:
        write_regression_report(run_result, output_path)
    return run_result


def run_regression_suite_sync(
    cases: list[RegressionCase] | None = None,
    *,
    verbose: bool = False,
    output_path: str | Path | None = DEFAULT_OUTPUT_PATH,
) -> RegressionRunResult:
    """Synchronous wrapper for pytest and shell integration."""
    return asyncio.run(
        run_regression_suite(
            cases,
            verbose=verbose,
            output_path=output_path,
        )
    )


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the Nexora AI routing regression suite.")
    parser.add_argument("--verbose", action="store_true", help="Print stage-by-stage regression details.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT_PATH), help="Path for the JSON regression report.")
    return parser.parse_args()


def main() -> int:
    """CLI entrypoint for local runs and CI."""
    args = _parse_args()
    run_result = run_regression_suite_sync(
        verbose=args.verbose,
        output_path=args.output,
    )
    print(render_regression_console_report(run_result, verbose=args.verbose))
    return 0 if run_result.summary.failed_cases == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
