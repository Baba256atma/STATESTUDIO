"""Map archetype analysis outputs to visual state instructions."""
from __future__ import annotations

import math
import logging
from typing import Dict, List, Sequence

from app.utils.clamp import clamp, clamp01, ensure_finite
from .schemas import ArchetypeDefinition, ArchetypeState, FeedbackLoop, ArchetypeDetectionResult
from .state_compat import normalize_archetype_state


def _coerce_detections(state: ArchetypeState) -> List[ArchetypeDetectionResult]:
    """Handle legacy/missing fields gracefully via canonical normalization."""
    detections: List[ArchetypeDetectionResult] = []
    canonical = normalize_archetype_state(state)
    for item in canonical.get("detections", []):
        try:
            detections.append(
                ArchetypeDetectionResult(
                    archetype_id=item.get("archetype_id"),
                    confidence=clamp01(ensure_finite(item.get("confidence", 0.0), 0.0)),
                    dominant_loop=item.get("dominant_loop", "R") or "R",
                    notes=item.get("notes", "") or "",
                )
            )
        except Exception:
            continue
    return detections


def _focus_id(detections: List[ArchetypeDetectionResult], state: ArchetypeState) -> str | None:
    if detections:
        top = max(detections, key=lambda item: item.confidence)
        return top.archetype_id
    # Fallback: derive from optional fields if present
    dominant_signal = getattr(state, "dominant_signal", None)
    if isinstance(dominant_signal, str) and dominant_signal.strip():
        return dominant_signal.strip()
    affected = getattr(state, "affected_objects", None)
    if isinstance(affected, Sequence) and affected:
        first = affected[0]
        if isinstance(first, str) and first.strip():
            return first.strip()
    leverage_focus = getattr(state, "leverage_focus", None)
    if isinstance(leverage_focus, str) and leverage_focus.strip():
        return leverage_focus.strip()
    return None


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
    canonical = normalize_archetype_state(state)
    definition_map: Dict[str, ArchetypeDefinition] = {
        definition.id: definition for definition in definitions
    }

    detections = _coerce_detections(state)
    focus_id = canonical.get("leverage_focus") or canonical.get("dominant_signal") or _focus_id(detections, state)
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
                "intensity": clamp01(ensure_finite(detection.confidence, 0.0)),
                "opacity": clamp(0.75 + clamp01(detection.confidence) * 0.2, 0.6, 0.95),
                "scale": clamp(0.9 + clamp01(detection.confidence) * 0.4, 0.7, 1.4),
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
                        "strength": clamp01(ensure_finite(detection.confidence, 0.0)),
                    }
                )

    # Some state versions do not provide `system_pressure`. Derive it safely.
    field = {
        "chaos": clamp01(ensure_finite(canonical.get("instability", 0.0), 0.0)),
        "density": clamp01(
            ensure_finite(0.3 + canonical.get("system_pressure", canonical.get("instability", 0.0)) * 0.5, 0.3)
        ),
        "noiseAmp": clamp01(ensure_finite(canonical.get("instability", 0.0), 0.0)),
    }

    logging.getLogger(__name__).debug(
        "visual_mapper_state",
        extra={
            "has_detected": bool(canonical.get("detections")),
            "has_results": bool(canonical.get("detections")),
            "focus_id": focus_id,
            "detections_count": len(detections),
            "has_system_pressure": canonical.get("system_pressure") is not None,
            "system_pressure": canonical.get("system_pressure"),
        },
    )

    return {
        "t": canonical.get("timestamp"),
        "focus": focus_id,
        "nodes": nodes or [],
        "loops": loops or [],
        "levers": levers or [],
        "flows": [],
        "field": field,
    }
