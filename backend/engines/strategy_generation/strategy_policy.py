"""Deterministic policy rules for strategy generation and ranking."""

from __future__ import annotations

from typing import Any


def clamp01(value: float) -> float:
    try:
        numeric = float(value)
    except Exception:
        return 0.0
    if numeric <= 0.0:
        return 0.0
    if numeric >= 1.0:
        return 1.0
    return numeric


def derive_object_label(object_id: str) -> str:
    return object_id.replace("obj_", "").replace("_", " ").strip().title() or object_id


def average(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def compute_risk_level(intelligence: dict[str, Any]) -> float:
    objects = intelligence.get("object_insights", []) or []
    if not objects:
        return 0.0
    pressure = average([clamp01(item.get("pressure_score", 0.0)) for item in objects])
    fragility = average([clamp01(item.get("fragility_score", 0.0) or 0.0) for item in objects])
    return clamp01((pressure * 0.58) + (fragility * 0.42))


def compute_expected_impact(compare_result: dict[str, Any]) -> float:
    object_deltas = compare_result.get("object_deltas", []) or []
    path_deltas = compare_result.get("path_deltas", []) or []
    positive_object_delta = average([max(0.0, float(item.get("delta", 0.0))) for item in object_deltas])
    positive_path_delta = average([max(0.0, float(item.get("delta", 0.0))) for item in path_deltas])
    summary_confidence = clamp01(compare_result.get("summary", {}).get("confidence", 0.0))
    return clamp01((positive_object_delta * 0.45) + (positive_path_delta * 0.25) + (summary_confidence * 0.3))


def score_strategy(
    *,
    compare_result: dict[str, Any],
    intelligence: dict[str, Any],
    preferred_focus: str,
    risk_tolerance: float,
) -> float:
    summary = compare_result.get("summary", {}) or {}
    winner = str(summary.get("winner", "tie") or "tie")
    confidence = clamp01(summary.get("confidence", 0.0))
    tradeoffs = compare_result.get("tradeoffs", []) or []
    wins = sum(1 for item in tradeoffs if str(item.get("winner")) == "B")
    ties = sum(1 for item in tradeoffs if str(item.get("winner")) == "tie")
    risk_level = compute_risk_level(intelligence)
    expected_impact = compute_expected_impact(compare_result)
    focus_bonus = 0.08 * sum(1 for item in tradeoffs if str(item.get("dimension")) == preferred_focus and str(item.get("winner")) == "B")
    winner_bonus = 0.18 if winner == "B" else 0.08 if winner == "tie" else 0.0
    tradeoff_balance = (wins / 4.0) * 0.26 + (ties / 4.0) * 0.08
    risk_alignment = 1.0 - max(0.0, risk_level - risk_tolerance)
    return clamp01((expected_impact * 0.34) + (confidence * 0.16) + winner_bonus + tradeoff_balance + (risk_alignment * 0.16) + focus_bonus)


def rank_generated_strategies(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(
        items,
        key=lambda item: (
            float(item.get("score", 0.0)),
            float(item.get("expected_impact", 0.0)),
            -float(item.get("risk_level", 1.0)),
        ),
        reverse=True,
    )


def summarize_generation(*, recommended_title: str | None, preferred_focus: str, strategy_count: int) -> tuple[str, str]:
    if not recommended_title:
        return (
            "No strategy recommendation is ready yet.",
            "Nexora needs stronger system signals before it can rank a credible strategic move.",
        )
    return (
        f"{recommended_title} is the strongest current strategy.",
        f"Nexora generated {strategy_count} deterministic options and ranked them against the current {preferred_focus} focus.",
    )

