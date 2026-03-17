"""Benchmark aggregation and reporting helpers."""

from __future__ import annotations

import json
from pathlib import Path


def summarize_results(results: list[dict]) -> list[dict]:
    """Aggregate benchmark results per model."""
    by_model: dict[str, list[dict]] = {}
    for result in results:
        by_model.setdefault(str(result["model"]), []).append(result)

    summary: list[dict] = []
    for model, model_results in by_model.items():
        total = len(model_results) or 1
        summary.append(
            {
                "model": model,
                "avg_latency_ms": round(
                    sum(float(item.get("latency_ms", 0.0) or 0.0) for item in model_results) / total,
                    2,
                ),
                "success_rate": round(
                    sum(1 for item in model_results if item.get("success")) / total,
                    4,
                ),
                "json_valid_rate": round(
                    sum(1 for item in model_results if item.get("json_valid")) / total,
                    4,
                ),
                "avg_objects_detected": round(
                    sum(int(item.get("object_count", 0) or 0) for item in model_results) / total,
                    2,
                ),
                "avg_risk_signals": round(
                    sum(int(item.get("risk_signal_count", 0) or 0) for item in model_results) / total,
                    2,
                ),
                "avg_confidence": round(
                    sum(float(item.get("confidence", 0.0) or 0.0) for item in model_results) / total,
                    4,
                ),
            }
        )

    summary.sort(key=lambda item: item["model"])
    return summary


def print_console_report(summary: list[dict]) -> None:
    """Print a compact console summary table."""
    print()
    print("Model            Avg Latency    Success    JSON Valid")
    print("-----------------------------------------------------")
    for item in summary:
        model = str(item["model"]).ljust(16)
        latency = f'{item["avg_latency_ms"]:.0f} ms'.ljust(14)
        success = f'{item["success_rate"] * 100:.0f}%'.ljust(10)
        json_valid = f'{item["json_valid_rate"] * 100:.0f}%'
        print(f"{model}{latency}{success}{json_valid}")
    print()


def write_report_json(
    *,
    results: list[dict],
    summary: list[dict],
    output_path: str | Path = "benchmark_results.json",
) -> Path:
    """Write benchmark details and summary to a JSON file."""
    path = Path(output_path)
    path.write_text(
        json.dumps(
            {
                "summary": summary,
                "results": results,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    return path
