"""Build JSON actions for frontend from a ChaosResult.

This module converts backend `ChaosResult` into a deterministic JSON
structure suitable for the frontend scene renderer. It intentionally
contains no rendering logic, only pure data transformations.
"""
from __future__ import annotations

from typing import Dict, List
import math

from .core import ChaosResult
from .mapping import map_chaos_to_objects


# Polarity -> color mapping (hex). Chosen to be visually distinct and
# deterministic. These are application-level choices and can be tuned.
_POLARITY_COLOR = {
    "negative": "#FF5C5C",  # red
    "neutral": "#5CA0FF",   # blue
    "positive": "#6DFF8A",  # green
}


def _clamp01(x: float) -> float:
    if x != x:
        return 0.0
    return max(0.0, min(1.0, float(x)))


def _polarity_of(dominant_signal: str | None) -> str:
    """Map a dominant signal keyword to a polarity.

    We keep a small mapping consistent with the engine's registry.
    If unknown, default to neutral.
    """
    if not dominant_signal:
        return "neutral"

    mapping = {
        "inventory": "neutral",
        "quality": "negative",
        "delay": "negative",
        "risk": "negative",
        "pressure": "neutral",
        "trust": "positive",
        # fallbacks: common aliases
        "urgent": "positive",
    }
    return mapping.get(dominant_signal, "neutral")


def build_scene_actions(result: ChaosResult) -> Dict:
    """Build the final JSON-friendly structure for the frontend.

    Schema:
    {
      "intensity": float,
      "volatility": float,
      "reason": string,
      "actions": [ { objectId, scale, color, priority } ]
    }

    Math choices:
    - scale: maps intensity (0..1) to a scene-friendly scale range [0.2, 2.0].
      This is a simple linear mapping chosen to align with existing UI slider
      ranges and to provide visible change at modest intensities.
      scale = 0.2 + intensity * 1.8

    - color: derived purely from the dominant signal's polarity to keep
      the mapping deterministic and explainable.

    - priority: integer 1..10 computed by combining intensity and
      volatility with a small non-linear weighting so that highly
      intense or highly volatile results get higher priority.

    - actions list: derived from `map_chaos_to_objects` with the same
      `result` input; duplicates are removed while preserving order.
    """
    if result is None:
        return {"intensity": 0.0, "volatility": 0.0, "reason": "", "actions": []}

    intensity = _clamp01(result.intensity)
    volatility = _clamp01(result.volatility)
    reason = result.explanation or ""

    # Determine object ids using the mapping layer. This will attempt to
    # use the dominant signal or fallbacks and return a deterministic set.
    object_ids = map_chaos_to_objects(result)

    # If mapping returned nothing, fall back to affected_objects
    if not object_ids and result.affected_objects:
        # truncate based on intensity
        count = int(math.ceil(intensity * len(result.affected_objects)))
        object_ids = result.affected_objects[:count]

    # Ensure uniqueness while preserving order
    seen = set()
    unique_ids: List[str] = []
    for oid in object_ids:
        if oid not in seen:
            seen.add(oid)
            unique_ids.append(oid)

    # Compute color from dominant signal polarity
    polarity = _polarity_of(result.dominant_signal)
    color = _POLARITY_COLOR.get(polarity, _POLARITY_COLOR["neutral"])

    # Compute scale as linear mapping to [0.2, 2.0]
    scale = 0.2 + intensity * 1.8
    scale = float(max(0.2, min(2.0, scale)))

    # Priority: combine intensity and volatility, weight intensity more
    # because it indicates magnitude; volatility increases priority if high.
    raw_priority = intensity * 0.75 + volatility * 0.25
    # map to 1..10 integer range
    priority = int(math.ceil(_clamp01(raw_priority) * 9.0))
    priority = max(1, min(10, priority))

    actions = []
    for i, oid in enumerate(unique_ids):
        # Slight per-object priority tweaking to preserve order: earlier
        # mapped objects are considered slightly more important.
        pri = max(1, min(10, priority - i))
        actions.append({
            "objectId": oid,
            "scale": round(scale, 3),
            "color": color,
            "priority": pri,
        })

    return {
        "intensity": round(float(intensity), 3),
        "volatility": round(float(volatility), 3),
        "reason": reason,
        "actions": actions,
    }
