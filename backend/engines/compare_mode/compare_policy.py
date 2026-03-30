"""Transparent weighting and judgment rules for compare mode v1."""

from __future__ import annotations

from typing import Literal


CompareFocusDimension = Literal["risk", "efficiency", "stability", "growth", "balanced"]


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


def clamp_signed(value: float) -> float:
    try:
        numeric = float(value)
    except Exception:
        return 0.0
    if numeric <= -1.0:
        return -1.0
    if numeric >= 1.0:
        return 1.0
    return numeric


def dimension_weights(focus_dimension: CompareFocusDimension) -> dict[str, float]:
    if focus_dimension == "risk":
        return {"risk": 0.52, "efficiency": 0.12, "stability": 0.26, "growth": 0.1}
    if focus_dimension == "efficiency":
        return {"risk": 0.12, "efficiency": 0.52, "stability": 0.16, "growth": 0.2}
    if focus_dimension == "stability":
        return {"risk": 0.24, "efficiency": 0.12, "stability": 0.5, "growth": 0.14}
    if focus_dimension == "growth":
        return {"risk": 0.08, "efficiency": 0.22, "stability": 0.12, "growth": 0.58}
    return {"risk": 0.25, "efficiency": 0.25, "stability": 0.25, "growth": 0.25}


def compute_object_dimension_score(
    *,
    strategic_priority: float,
    pressure_score: float,
    leverage_score: float,
    fragility_score: float,
    focus_dimension: CompareFocusDimension,
) -> float:
    if focus_dimension == "risk":
        return clamp01((1.0 - pressure_score) * 0.52 + (1.0 - fragility_score) * 0.38 + strategic_priority * 0.1)
    if focus_dimension == "efficiency":
        return clamp01(leverage_score * 0.45 + (1.0 - pressure_score) * 0.35 + strategic_priority * 0.2)
    if focus_dimension == "stability":
        return clamp01((1.0 - fragility_score) * 0.48 + (1.0 - pressure_score) * 0.32 + strategic_priority * 0.2)
    if focus_dimension == "growth":
        return clamp01(leverage_score * 0.54 + strategic_priority * 0.28 + (1.0 - pressure_score) * 0.18)
    weighted = dimension_weights("balanced")
    return clamp01(
        compute_object_dimension_score(
            strategic_priority=strategic_priority,
            pressure_score=pressure_score,
            leverage_score=leverage_score,
            fragility_score=fragility_score,
            focus_dimension="risk",
        )
        * weighted["risk"]
        + compute_object_dimension_score(
            strategic_priority=strategic_priority,
            pressure_score=pressure_score,
            leverage_score=leverage_score,
            fragility_score=fragility_score,
            focus_dimension="efficiency",
        )
        * weighted["efficiency"]
        + compute_object_dimension_score(
            strategic_priority=strategic_priority,
            pressure_score=pressure_score,
            leverage_score=leverage_score,
            fragility_score=fragility_score,
            focus_dimension="stability",
        )
        * weighted["stability"]
        + compute_object_dimension_score(
            strategic_priority=strategic_priority,
            pressure_score=pressure_score,
            leverage_score=leverage_score,
            fragility_score=fragility_score,
            focus_dimension="growth",
        )
        * weighted["growth"]
    )


def compute_path_significance_score(
    *,
    path_strength: float,
    significance_score: float,
    path_role: str,
    focus_dimension: CompareFocusDimension,
) -> float:
    role_bonus = {
        "primary": 0.16,
        "tradeoff": 0.12,
        "feedback": 0.1,
        "secondary": 0.06,
    }.get(path_role, 0.06)
    if focus_dimension == "risk":
        return clamp01(significance_score * 0.44 + (1.0 - path_strength) * 0.24 + role_bonus + 0.08)
    if focus_dimension == "efficiency":
        return clamp01(path_strength * 0.5 + significance_score * 0.28 + role_bonus + 0.04)
    if focus_dimension == "stability":
        return clamp01(significance_score * 0.4 + (1.0 - abs(path_strength - 0.5)) * 0.18 + role_bonus + 0.08)
    if focus_dimension == "growth":
        return clamp01(path_strength * 0.42 + significance_score * 0.34 + role_bonus + 0.08)
    return clamp01(path_strength * 0.34 + significance_score * 0.34 + role_bonus + 0.1)


def compute_dimension_score(
    *,
    total_pressure: float,
    total_fragility: float,
    total_leverage: float,
    total_priority: float,
    path_strength: float,
    risk_concentration: float,
    focus_dimension: Literal["risk", "efficiency", "stability", "growth"],
) -> float:
    if focus_dimension == "risk":
        return clamp01((1.0 - total_pressure) * 0.44 + (1.0 - total_fragility) * 0.36 + (1.0 - risk_concentration) * 0.2)
    if focus_dimension == "efficiency":
        return clamp01(path_strength * 0.4 + total_leverage * 0.34 + (1.0 - total_pressure) * 0.26)
    if focus_dimension == "stability":
        return clamp01((1.0 - total_fragility) * 0.4 + (1.0 - risk_concentration) * 0.34 + (1.0 - total_pressure) * 0.26)
    return clamp01(total_leverage * 0.42 + total_priority * 0.24 + path_strength * 0.2 + (1.0 - total_pressure) * 0.14)


def resolve_dimension_winner(score_a: float, score_b: float) -> str:
    if abs(score_a - score_b) < 0.035:
        return "tie"
    return "A" if score_a > score_b else "B"


def resolve_tradeoff_confidence(score_a: float, score_b: float) -> float:
    return clamp01(0.45 + abs(score_a - score_b) * 0.85)


def resolve_dominance(
    tradeoff_winners: list[str],
    *,
    score_margin: float,
) -> str:
    wins_a = sum(1 for winner in tradeoff_winners if winner == "A")
    wins_b = sum(1 for winner in tradeoff_winners if winner == "B")
    if wins_a >= 3 and wins_b == 0 and score_margin >= 0.06:
        return "A"
    if wins_b >= 3 and wins_a == 0 and score_margin <= -0.06:
        return "B"
    if wins_a == wins_b:
        return "tie"
    return "tradeoff"


def classify_object_interpretation(delta: float) -> str:
    if delta > 0.05:
        return "improved"
    if delta < -0.05:
        return "worse"
    return "neutral"


def classify_path_interpretation(delta: float) -> str:
    if delta > 0.05:
        return "stronger"
    if delta < -0.05:
        return "weaker"
    return "equal"

