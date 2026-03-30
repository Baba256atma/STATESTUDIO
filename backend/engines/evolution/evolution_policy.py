"""Bounded policy evolution helpers for Nexora."""

from __future__ import annotations

from collections import defaultdict

from engines.evolution.learning_models import EvolutionState, PolicyAdjustment


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


def clamp_delta(value: float, limit: float = 0.12) -> float:
    try:
        numeric = float(value)
    except Exception:
        return 0.0
    if numeric <= -limit:
        return -limit
    if numeric >= limit:
        return limit
    return numeric


def recency_weight(age_seconds: float) -> float:
    if age_seconds <= 0:
        return 1.0
    if age_seconds < 86400:
        return 1.0
    if age_seconds < 7 * 86400:
        return 0.82
    if age_seconds < 30 * 86400:
        return 0.68
    return 0.5


def build_policy_inputs(evolution_state: EvolutionState | None) -> dict[str, dict[str, float]]:
    aggregates: dict[str, dict[str, float]] = {
        "intelligence": defaultdict(float),
        "compare": defaultdict(float),
        "strategy_generation": defaultdict(float),
    }
    if not evolution_state:
        return {key: dict(value) for key, value in aggregates.items()}
    for adjustment in evolution_state.policy_adjustments:
        policy_name = adjustment.policy_name
        if policy_name not in aggregates:
            continue
        aggregates[policy_name][adjustment.key] += clamp_delta(adjustment.delta * adjustment.confidence)
    return {key: {inner_key: clamp_delta(inner_value) for inner_key, inner_value in value.items()} for key, value in aggregates.items()}
