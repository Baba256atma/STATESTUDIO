"""Transparent heuristic policy rules for system intelligence v1."""

from __future__ import annotations

from typing import Literal


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


def mode_weight(mode: str, *, analysis: float, simulation: float, decision: float) -> float:
    if mode == "decision":
        return decision
    if mode == "simulation":
        return simulation
    return analysis


def compute_object_priority(
    *,
    role: str,
    propagation_strength: float,
    decision_strength: float,
    fragility_score: float,
    is_focus_object: bool,
    mode: str,
) -> float:
    role_bonus = {
        "source": 0.28,
        "leverage": 0.24,
        "bottleneck": 0.24,
        "destination": 0.18,
        "impacted": 0.14,
        "protected": 0.1,
        "context": 0.06,
    }.get(role, 0.08)
    score = role_bonus
    score += propagation_strength * mode_weight(mode, analysis=0.18, simulation=0.32, decision=0.14)
    score += decision_strength * mode_weight(mode, analysis=0.12, simulation=0.18, decision=0.34)
    score += fragility_score * mode_weight(mode, analysis=0.26, simulation=0.14, decision=0.18)
    if is_focus_object:
        score += 0.06
    return clamp01(score)


def compute_path_significance(
    *,
    path_role: str,
    path_strength: float,
    endpoint_priority: float,
    fragility_signal: float,
    mode: str,
) -> float:
    role_bonus = {
        "primary": 0.22,
        "secondary": 0.12,
        "tradeoff": 0.14,
        "feedback": 0.16,
    }.get(path_role, 0.1)
    score = role_bonus
    score += path_strength * mode_weight(mode, analysis=0.18, simulation=0.3, decision=0.24)
    score += endpoint_priority * 0.22
    score += fragility_signal * mode_weight(mode, analysis=0.22, simulation=0.14, decision=0.12)
    return clamp01(score)


def classify_advice_kind(*, role: str, fragility_score: float, leverage_score: float) -> Literal[
    "focus",
    "mitigate",
    "protect",
    "investigate",
    "simulate_next",
]:
    if role == "bottleneck":
        return "mitigate"
    if role == "protected":
        return "protect"
    if leverage_score >= 0.55:
        return "focus"
    if fragility_score >= 0.6:
        return "investigate"
    return "simulate_next"


def resolve_suggested_focus(object_insights: list[dict]) -> str | None:
    if not object_insights:
        return None
    ranked = sorted(
        object_insights,
        key=lambda item: (
            float(item.get("strategic_priority", 0.0)),
            float(item.get("leverage_score", 0.0)),
            float(item.get("pressure_score", 0.0)),
        ),
        reverse=True,
    )
    top = ranked[0] if ranked else None
    return str(top.get("object_id")) if top and top.get("object_id") else None
