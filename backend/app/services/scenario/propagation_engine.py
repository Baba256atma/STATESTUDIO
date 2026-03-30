"""Deterministic propagation engine for Scenario Simulation Lite."""

from __future__ import annotations

from typing import Any

from app.models.scenario_output import ScenarioObjectState, ScenarioPropagationStep


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


def _impact_level(score: float) -> str:
    if score >= 0.82:
        return "critical"
    if score >= 0.6:
        return "high"
    if score >= 0.32:
        return "moderate"
    return "low"


def _select_root_object(
    chain: list[dict[str, Any]],
    baseline_primary: list[str],
    baseline_affected: list[str],
) -> str:
    ordered_candidates = [*baseline_primary, *baseline_affected]
    chain_object_ids = [str(step.get("object_id", "")).strip() for step in chain]
    for candidate in ordered_candidates:
        if candidate in chain_object_ids:
            return candidate
    return chain_object_ids[0] if chain_object_ids else "obj_risk_zone"


def simulate_propagation(
    *,
    scenario_type: str,
    scenario_text: str,
    chain: list[dict[str, Any]],
    baseline_primary: list[str],
    baseline_affected: list[str],
    baseline_fragility_score: float,
    severity: float,
    max_steps: int,
) -> dict[str, Any]:
    """Simulate a short deterministic propagation chain from a scenario assumption."""
    del scenario_type
    del scenario_text

    root_object_id = _select_root_object(chain, baseline_primary, baseline_affected)
    ordered_chain = sorted(
        chain,
        key=lambda step: (
            0 if str(step.get("object_id", "")).strip() == root_object_id else 1,
            chain.index(step),
        ),
    )[: max(1, max_steps)]

    propagation_steps: list[ScenarioPropagationStep] = []
    object_states: list[ScenarioObjectState] = []
    primary_objects: list[str] = []
    affected_objects: list[str] = []

    current_sources = [root_object_id]
    impact_seed = max(0.22, (baseline_fragility_score * 0.45) + (severity * 0.55))

    for index, step in enumerate(ordered_chain, start=1):
        object_id = str(step.get("object_id", "")).strip()
        if not object_id:
            continue

        impact_score = _clamp01(impact_seed - ((index - 1) * 0.14))
        role = "primary" if index <= 2 and len(primary_objects) < 2 else "affected" if impact_score >= 0.34 else "context"
        if role == "primary":
            primary_objects.append(object_id)
        elif role == "affected":
            affected_objects.append(object_id)

        reasons = [
            str(step.get("reason", "Scenario pressure propagates to this object.")),
            f"Impact score classified as {_impact_level(impact_score)}.",
        ]
        object_states.append(
            ScenarioObjectState(
                object_id=object_id,
                role=role,
                impact_score=impact_score,
                state_change=str(step.get("state_change", "watch")),
                reasons=reasons,
            )
        )

        propagation_steps.append(
            ScenarioPropagationStep(
                id=f"scenario_step_{index}",
                order=index,
                label=str(step.get("label", "Scenario step")),
                type=str(step.get("type", "propagation")),
                source_object_ids=current_sources,
                target_object_ids=[object_id],
                confidence=_clamp01(impact_score - 0.04),
                reason=str(step.get("reason", "Scenario pressure propagates to the next object.")),
            )
        )
        current_sources = [object_id]

    if not primary_objects and object_states:
        primary_objects = [object_states[0].object_id]
        object_states[0].role = "primary"

    if not affected_objects:
        affected_objects = [state.object_id for state in object_states[1:3] if state.object_id not in primary_objects]

    overall_score = max((state.impact_score for state in object_states), default=0.0)

    return {
        "primary_objects": primary_objects[:2],
        "affected_objects": affected_objects[:4],
        "object_states": object_states,
        "propagation_steps": propagation_steps,
        "overall_impact_level": _impact_level(overall_score),
    }
