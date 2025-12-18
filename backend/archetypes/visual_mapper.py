"""Map archetype analysis outputs to visual state instructions."""
from __future__ import annotations

import math
from typing import Dict, List

from app.utils.clamp import clamp, clamp01, ensure_finite
from .schemas import ArchetypeDefinition, ArchetypeState, FeedbackLoop


def _focus_id(state: ArchetypeState) -> str | None:
    if not state.detected:
        return None
    top = max(state.detected, key=lambda item: item.confidence)
    return top.archetype_id


def _layout_positions(count: int, radius: float) -> List[tuple[float, float, float]]:
    if count <= 1:
        return [(0.0, 0.0, 0.0)]
    positions: List[tuple[float, float, float]] = []
    for idx in range(count):
        angle = (2 * math.pi * idx) / count
        positions.append((math.cos(angle) * radius, math.sin(angle) * radius * 0.6, 0.0))
    return positions


def _loop_to_visual(loop: FeedbackLoop, center: tuple[float, float, float], idx: int) -> dict:
    radius = 0.9 + idx * 0.35
    return {
        "id": loop.id,
        "type": loop.type,
        "center": [center[0], center[1], center[2]],
        "radius": clamp(radius, 0.5, 3.0),
        "intensity": clamp01(ensure_finite(loop.strength, 0.0)),
        "flowSpeed": clamp(0.2 + ensure_finite(loop.strength, 0.0) * 0.6, 0.05, 1.2),
        "delay": clamp01(ensure_finite(loop.delay, 0.0)) if loop.delay is not None else None,
    }


def map_archetype_to_visual_state(
    state: ArchetypeState, definitions: List[ArchetypeDefinition]
) -> dict:
    """Convert archetype state into VisualState-compatible JSON."""
    definition_map: Dict[str, ArchetypeDefinition] = {
        definition.id: definition for definition in definitions
    }

    focus_id = _focus_id(state)
    detections = state.detected
    positions = _layout_positions(len(detections), radius=2.4)

    nodes: List[dict] = []
    loops: List[dict] = []
    levers: List[dict] = []

    for idx, detection in enumerate(detections):
        definition = definition_map.get(detection.archetype_id)
        if definition is None:
            continue
        pos = positions[idx] if idx < len(positions) else (0.0, 0.0, 0.0)
        node_shape = "ico" if detection.dominant_loop == "R" else "box"
        nodes.append(
            {
                "id": detection.archetype_id,
                "shape": node_shape,
                "pos": [pos[0], pos[1], pos[2]],
                "color": "#9aa4b2",
                "intensity": _clamp01(detection.confidence),
                "opacity": _clamp(0.75 + detection.confidence * 0.2, 0.6, 0.95),
                "scale": _clamp(0.9 + detection.confidence * 0.4, 0.7, 1.4),
            }
        )

        for loop_idx, loop in enumerate(definition.loops):
            loop_id = f"{detection.archetype_id}:{loop.id}"
            loop_entry = _loop_to_visual(loop, pos, loop_idx)
            loop_entry["id"] = loop_id
            loops.append(loop_entry)

        if definition.leverage_points:
            for lp_idx, point in enumerate(definition.leverage_points):
                angle = (2 * math.pi * lp_idx) / max(1, len(definition.leverage_points))
                offset = 0.9
                lever_pos = (
                    pos[0] + math.cos(angle) * offset,
                    pos[1] + math.sin(angle) * offset * 0.5,
                    pos[2] + 0.2,
                )
                levers.append(
                    {
                        "id": f"{detection.archetype_id}:lever:{lp_idx}",
                        "target": detection.archetype_id,
                        "pos": [lever_pos[0], lever_pos[1], lever_pos[2]],
                        "strength": _clamp01(detection.confidence),
                    }
                )

    field = {
        "chaos": _clamp01(state.instability),
        "density": clamp01(ensure_finite(0.3 + state.system_pressure * 0.5, 0.3)),
        "noiseAmp": clamp01(ensure_finite(state.instability, 0.0)),
    }

    return {
        "t": state.timestamp,
        "focus": focus_id,
        "nodes": nodes or [],
        "loops": loops or [],
        "levers": levers or [],
        "flows": [],
        "field": field,
    }
