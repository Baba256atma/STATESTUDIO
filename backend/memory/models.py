from __future__ import annotations

from dataclasses import dataclass
import time


def clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


def now_ts() -> int:
    return int(time.time())


@dataclass
class ObjectMemoryState:
    hits: int
    energy: float
    last_intensity: float
    last_ts: int
    trend: str  # "rising" | "falling" | "stable"


@dataclass
class MemoryConfig:
    half_life_seconds: int = 900
    energy_gain: float = 0.35
    max_energy: float = 1.0
    min_scale: float = 0.25
    max_scale_boost: float = 0.25
    max_emphasis_boost: float = 0.30
