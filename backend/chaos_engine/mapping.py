"""Mapping layer: maps abstract chaos signals to scene object ids.

This module provides a lightweight, deterministic mapping from semantic
chaos signals (e.g. `inventory`, `quality`) to scene object identifiers.
It contains no rendering logic and is safe to import from backend code.

Behavior:
- The registry maps a signal name -> list of object ids associated.
- `map_chaos_to_objects` uses the `ChaosResult.intensity` (0..1) to
  decide how many of the mapped objects should be activated.
- The function returns a list of unique object ids (may be empty).

Design choices:
- Selection is deterministic and simple: choose the first N ids where
  N = ceil(intensity * len(mapped_ids)). If intensity is 0, no ids
  are returned.
- If `result.dominant_signal` is present and known, map from it. If not,
  we attempt to match any registry keys mentioned in `result.explanation`.
  As a last-resort fallback, we return a truncated list of
  `result.affected_objects` if present.
"""
from __future__ import annotations

from typing import List
import math

from .core import ChaosResult
from .object_mapping import map_chaos_to_objects_spirit


# Registry mapping abstract signals -> scene object ids. This is a small
# example mapping; it can be extended by the application without touching
# engine logic. Keys should match signal keywords used by `ChaosEngine`.
REGISTRY = {
    "inventory": ["obj_inventory"],
    "quality": ["obj_quality"],
    "pressure": ["obj_core"],
    "delay": ["obj_delivery"],
    "risk": ["obj_risk_zone"],
    "trust": ["obj_trust_node"],
}


def _clamp_int(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))


def map_chaos_to_objects(result: ChaosResult) -> List[str]:
    """Map a ChaosResult to a deterministic list of scene object ids.

    Rules:
    - If `result.dominant_signal` matches a registry entry, use that entry.
    - Use `intensity` to decide how many objects to pick: N = ceil(intensity * len(mapped)).
      If intensity == 0, N will be 0 and an empty list is returned.
    - If no dominant signal, attempt to find registry keys mentioned
      in `result.explanation` and aggregate their mapped ids.
    - If still nothing, fall back to `result.affected_objects` truncated
      by intensity (this avoids hard failure when upstream does not provide
      signal names).

    The function returns unique ids only.
    """
    if not result:
        return []

    intensity = float(result.intensity if result.intensity is not None else 0.0)
    intensity = max(0.0, min(1.0, intensity))

    mapped_ids = []

    # 1) Primary: dominant signal
    ds = result.dominant_signal
    if ds and ds in REGISTRY:
        pool = REGISTRY[ds]
        if pool:
            count = int(math.ceil(intensity * len(pool)))
            count = _clamp_int(count, 0, len(pool))
            mapped_ids.extend(pool[:count])
            return list(dict.fromkeys(mapped_ids))

    # 2) Secondary: look for registry keys in explanation text
    expl = (result.explanation or "").lower()
    keys_found = [k for k in REGISTRY.keys() if k in expl]
    if keys_found:
        for k in keys_found:
            pool = REGISTRY.get(k, [])
            if not pool:
                continue
            count = int(math.ceil(intensity * len(pool)))
            count = _clamp_int(count, 0, len(pool))
            mapped_ids.extend(pool[:count])
        # ensure uniqueness and preserve order
        return list(dict.fromkeys(mapped_ids))

    # 3) Fallback: use result.affected_objects truncated by intensity
    if result.affected_objects:
        pool = result.affected_objects
        count = int(math.ceil(intensity * len(pool)))
        count = _clamp_int(count, 0, len(pool))
        return list(dict.fromkeys(pool[:count]))

    return []


def map_chaos(result: ChaosResult, mode: str) -> List[str]:
    if mode == "spirit":
        return map_chaos_to_objects_spirit(result)
    return map_chaos_to_objects(result)
