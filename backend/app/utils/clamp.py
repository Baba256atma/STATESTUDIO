"""Shared clamping and validation helpers."""
from __future__ import annotations

import math


def clamp(value: float, lo: float, hi: float) -> float:
    if not math.isfinite(value):
        return lo
    return max(lo, min(hi, value))


def clamp01(value: float) -> float:
    return clamp(value, 0.0, 1.0)


def ensure_finite(value: float, default: float = 0.0) -> float:
    return value if math.isfinite(value) else default
