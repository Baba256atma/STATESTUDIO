"""Adapter to convert ChaosResult into scene actions JSON."""
from __future__ import annotations

from typing import Dict, List

from .core import ChaosResult
from .mapping import map_chaos


def _clamp01(value: float) -> float:
    if value != value:
        return 0.0
    return max(0.0, min(1.0, value))


def _scale_from_intensity(intensity: float) -> float:
    intensity = _clamp01(float(intensity))
    return 0.6 + intensity * 0.6


def _polarity_for_signal(signal: str | None) -> str:
    if not signal:
        return "neutral"
    polarity_map = {
        "risk": "negative",
        "delay": "negative",
        "quality": "negative",
        "inventory": "neutral",
        "pressure": "neutral",
        "trust": "positive",
        "urgent": "positive",
    }
    return polarity_map.get(signal, "neutral")


def _color_for_polarity(polarity: str, mode: str) -> str:
    if mode == "spirit":
        color_map = {
            "negative": "#d95c4f",
            "neutral": "#4b4a8a",
            "positive": "#6fcf97",
        }
    else:
        color_map = {
            "negative": "#e74c3c",
            "neutral": "#3498db",
            "positive": "#2ecc71",
        }
    return color_map.get(polarity, "#3498db")


def build_scene_actions(result: ChaosResult, mode: str = "business") -> Dict[str, object]:
    intensity = _clamp01(float(result.intensity))
    volatility = _clamp01(float(result.volatility))
    polarity = _polarity_for_signal(result.dominant_signal)
    color = _color_for_polarity(polarity, mode)
    scale = _scale_from_intensity(intensity)

    objects: List[Dict[str, object]] = []
    for obj_id in map_chaos(result, mode):
        objects.append(
            {
                "id": obj_id,
                "scale": scale,
                "color": color,
                "emphasis": volatility,
            }
        )

    return {
        "scene": {
            "intensity": intensity,
            "volatility": volatility,
        },
        "objects": objects,
    }
