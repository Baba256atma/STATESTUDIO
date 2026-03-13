"""Mapping layer for alternate mode: chaos signals -> object ids."""
from __future__ import annotations

from typing import List
import math

from .core import ChaosResult


# Maps object categories to object ids used by the frontend scene.
OBJECT_REGISTRY_SPIRIT: dict[str, list[str]] = {
    "root": ["obj_root"],
    "sacral": ["obj_sacral"],
    "solar": ["obj_solar"],
    "heart": ["obj_heart"],
    "throat": ["obj_throat"],
    "third_eye": ["obj_third_eye"],
    "crown": ["obj_crown"],
}

# Maps chaos signal keywords to object categories.
SIGNAL_TO_OBJECT: dict[str, str] = {
    "risk": "root",
    "fear": "root",
    "safety": "root",
    "creativity": "sacral",
    "intimacy": "sacral",
    "confidence": "solar",
    "power": "solar",
    "pressure": "solar",
    "trust": "heart",
    "connection": "heart",
    "communication": "throat",
    "clarity": "third_eye",
    "insight": "third_eye",
    "meaning": "crown",
    "purpose": "crown",
}


def _clamp_int(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))


def map_chaos_to_objects_spirit(result: ChaosResult) -> List[str]:
    """Map a ChaosResult to alternate-mode object ids."""
    if not result:
        return []

    intensity = float(result.intensity if result.intensity is not None else 0.0)
    intensity = max(0.0, min(1.0, intensity))

    mapped_ids: list[str] = []

    dominant = (result.dominant_signal or "").lower()
    if dominant and dominant in SIGNAL_TO_OBJECT:
        obj_key = SIGNAL_TO_OBJECT[dominant]
        pool = OBJECT_REGISTRY_SPIRIT.get(obj_key, [])
        count = int(math.ceil(intensity * len(pool)))
        count = _clamp_int(count, 0, len(pool))
        mapped_ids.extend(pool[:count])
        return list(dict.fromkeys(mapped_ids))

    explanation = (result.explanation or "").lower()
    obj_keys: list[str] = []
    for signal, obj_key in SIGNAL_TO_OBJECT.items():
        if signal in explanation:
            obj_keys.append(obj_key)

    if obj_keys:
        seen_objs: set[str] = set()
        for obj_key in obj_keys:
            if obj_key in seen_objs:
                continue
            seen_objs.add(obj_key)
            pool = OBJECT_REGISTRY_SPIRIT.get(obj_key, [])
            count = int(math.ceil(intensity * len(pool)))
            count = _clamp_int(count, 0, len(pool))
            mapped_ids.extend(pool[:count])
        return list(dict.fromkeys(mapped_ids))

    return []
