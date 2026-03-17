"""CLI benchmark runner for Nexora local AI models."""

from __future__ import annotations

import asyncio
import json
import random
import sys
import time
from pathlib import Path


CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from app.schemas.ai import AIRequest  # noqa: E402
from app.services.ai.orchestrator import LocalAIOrchestrator  # noqa: E402
from benchmark_cases import BENCHMARK_CASES  # noqa: E402
from benchmark_models import MODELS  # noqa: E402
from benchmark_report import print_console_report, summarize_results, write_report_json  # noqa: E402


def _compute_confidence(response) -> float:
    confidences: list[float] = []
    confidences.extend(float(signal.confidence) for signal in response.risk_signals)
    confidences.extend(float(obj.confidence) for obj in response.object_candidates)
    if not confidences:
        return 0.0
    return round(sum(confidences) / len(confidences), 4)


def _is_json_valid(output: str) -> bool:
    if not output:
        return False
    try:
        json.loads(output)
        return True
    except json.JSONDecodeError:
        return False


async def _run_case(orchestrator: LocalAIOrchestrator, model: str, case: dict) -> dict:
    started_at = time.perf_counter()
    error_message: str | None = None

    try:
        response = await orchestrator.analyze(
            AIRequest(
                text=case["input_text"],
                model=model,
                context={"benchmark_case_id": case["id"]},
                metadata={"task": case["task"], "benchmark": True},
            )
        )
    except Exception as exc:
        latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
        return {
            "model": model,
            "case_id": case["id"],
            "latency_ms": latency_ms,
            "success": False,
            "json_valid": False,
            "object_count": 0,
            "risk_signal_count": 0,
            "confidence": 0.0,
            "error_message": str(exc),
        }

    latency_ms = float(response.latency_ms or round((time.perf_counter() - started_at) * 1000, 2))
    if isinstance(response.metadata, dict):
        error_message = response.metadata.get("provider_error") or response.metadata.get("validation_error")

    return {
        "model": model,
        "case_id": case["id"],
        "latency_ms": latency_ms,
        "success": bool(response.ok),
        "json_valid": _is_json_valid(response.output),
        "object_count": len(response.object_candidates),
        "risk_signal_count": len(response.risk_signals),
        "confidence": _compute_confidence(response),
        "error_message": error_message,
    }


async def run_benchmark() -> tuple[list[dict], list[dict]]:
    """Run all benchmark cases against all configured models."""
    orchestrator = LocalAIOrchestrator()
    cases = list(BENCHMARK_CASES)
    random.shuffle(cases)

    total_runs = len(MODELS) * len(cases)
    current_run = 0
    results: list[dict] = []

    for model in MODELS:
        for case in cases:
            current_run += 1
            print(f"[{current_run}/{total_runs}] model={model} case={case['id']}")
            results.append(await _run_case(orchestrator, model, case))

    summary = summarize_results(results)
    return results, summary


async def main() -> None:
    results, summary = await run_benchmark()
    print_console_report(summary)
    output_path = write_report_json(results=results, summary=summary, output_path=CURRENT_DIR / "benchmark_results.json")
    print(f"Benchmark report written to {output_path}")


if __name__ == "__main__":
    asyncio.run(main())
