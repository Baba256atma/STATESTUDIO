"""Overlay-safe scene hints for Scenario Simulation Lite."""

from __future__ import annotations

from app.models.scenario_output import ScenarioObjectState, ScenarioSceneOverlay


_STATE_LABELS = {
    "increase": "Pressure increasing",
    "decrease": "Pressure easing",
    "stress": "Under stress",
    "delay": "Delay risk rising",
    "watch": "Watch closely",
}


def build_scene_overlay(
    object_states: list[ScenarioObjectState],
    primary_objects: list[str],
    affected_objects: list[str],
) -> ScenarioSceneOverlay:
    """Build overlay-safe scene emphasis for scenario output."""
    highlighted_object_ids = []
    overlay_labels_by_object: dict[str, str] = {}

    for state in object_states:
        if state.object_id not in highlighted_object_ids:
            highlighted_object_ids.append(state.object_id)
        overlay_labels_by_object[state.object_id] = _STATE_LABELS.get(state.state_change, "Watch closely")

    return ScenarioSceneOverlay(
        highlighted_object_ids=highlighted_object_ids[:6],
        primary_object_ids=primary_objects[:2],
        affected_object_ids=affected_objects[:4],
        dim_unrelated_objects=bool(primary_objects),
        overlay_labels_by_object=overlay_labels_by_object,
    )
