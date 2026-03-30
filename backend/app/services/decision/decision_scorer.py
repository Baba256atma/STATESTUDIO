"""Deterministic scoring for Decision Engine Lite."""

from __future__ import annotations

from app.models.scanner_output import FragilityScanResponse
from app.models.scenario_output import ScenarioSimulationResult


_IMPACT_LEVEL_SCORE = {
    "low": 1.0,
    "moderate": 0.72,
    "high": 0.42,
    "critical": 0.18,
}


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


def score_option(
    *,
    baseline: FragilityScanResponse | None,
    scenario: ScenarioSimulationResult,
    decision_goal: str | None = None,
) -> float:
    """Score one scenario option with a transparent weighted model."""
    baseline_inverse_fragility = 1.0 - float(baseline.fragility_score if baseline else 0.5)
    impact_component = _IMPACT_LEVEL_SCORE.get(scenario.overall_impact_level, 0.4)
    affected_count = len(scenario.affected_objects)
    propagation_count = len(scenario.propagation_steps)
    object_spread_penalty = min(0.24, 0.05 * affected_count)
    propagation_penalty = min(0.20, 0.04 * max(0, propagation_count - 1))
    max_object_impact = max((state.impact_score for state in scenario.object_states), default=0.0)
    stability_component = 1.0 - (max_object_impact * 0.45)
    goal_bonus = _decision_goal_bonus(decision_goal, scenario)

    raw_score = (
        (baseline_inverse_fragility * 0.24)
        + (impact_component * 0.34)
        + (stability_component * 0.30)
        + goal_bonus
        - object_spread_penalty
        - propagation_penalty
    )
    return round(_clamp01(raw_score), 4)


def _decision_goal_bonus(decision_goal: str | None, scenario: ScenarioSimulationResult) -> float:
    goal = " ".join(str(decision_goal or "").strip().lower().split())
    if not goal:
        return 0.0

    object_ids = set(scenario.primary_objects + scenario.affected_objects)
    state_changes = {state.state_change for state in scenario.object_states}

    if "delay" in goal and "obj_delivery" not in object_ids and "delay" not in state_changes:
        return 0.06
    if "cost" in goal and "obj_cost" not in object_ids and "obj_cashflow" not in object_ids:
        return 0.06
    if "stability" in goal and scenario.overall_impact_level in {"low", "moderate"}:
        return 0.05
    return 0.0


def score_confidence(
    *,
    baseline: FragilityScanResponse | None,
    scenario: ScenarioSimulationResult,
) -> float:
    baseline_confidence = float(baseline.summary_detail.confidence if baseline else 0.5)
    scenario_confidence = max((step.confidence for step in scenario.propagation_steps), default=0.45)
    return round(_clamp01((baseline_confidence * 0.55) + (scenario_confidence * 0.45)), 4)
