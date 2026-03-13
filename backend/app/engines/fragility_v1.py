# backend/app/engines/fragility_v1.py
from __future__ import annotations

from typing import Any, Dict, List


def _clamp01(x: Any) -> float:
    try:
        v = float(x)
    except Exception:
        return 0.0
    if v < 0.0:
        return 0.0
    if v > 1.0:
        return 1.0
    return v


def compute_fragility_v1(
    kpi: Dict[str, Any] | None,
    loops: List[dict] | None,
    chaos: Any | None,
    allowed_objects: List[str] | None = None,
) -> Dict[str, Any]:
    """
    Lightweight Fragility Engine v1.

    Returns:
      {
        "score": 0..1,
        "level": "low"|"medium"|"high",
        "reasons": [{"code": str, "message": str, "weight": float}],
        "drivers": {...}
      }
    """
    kpi = kpi if isinstance(kpi, dict) else {}
    loops = loops if isinstance(loops, list) else []
    allowed_objects = allowed_objects if isinstance(allowed_objects, list) else []

    inv = _clamp01(kpi.get("inventory", 0.5))
    delv = _clamp01(kpi.get("delivery", 0.5))
    rsk = _clamp01(kpi.get("risk", 0.5))

    inventory_pressure = _clamp01(1.0 - inv)
    time_pressure = _clamp01(1.0 - delv)
    quality_risk = _clamp01(rsk)

    vol = 0.0
    if chaos is not None:
        vol = _clamp01(getattr(chaos, "volatility", getattr(chaos, "intensity", 0.0)) or 0.0)

    # simple loop risk: more loops => more fragility
    loop_risk = _clamp01(0.15 * len(loops))
    if loop_risk > 0.45:
        loop_risk = 0.45

    score = _clamp01(
        0.28 * inventory_pressure
        + 0.28 * time_pressure
        + 0.28 * quality_risk
        + 0.16 * vol
        + loop_risk
    )

    level = "low"
    if score >= 0.67:
        level = "high"
    elif score >= 0.34:
        level = "medium"

    # short business reasons
    reasons: List[Dict[str, Any]] = []
    def add(code: str, weight: float, msg: str) -> None:
        reasons.append({"code": code, "weight": float(_clamp01(weight)), "message": msg})

    if inventory_pressure > 0.35:
        add("inventory_pressure", inventory_pressure, "Inventory looks stressed (low buffer).")
    if time_pressure > 0.35:
        add("time_pressure", time_pressure, "Delivery schedule is under pressure (delay risk).")
    if quality_risk > 0.35:
        add("quality_risk", quality_risk, "Risk exposure is elevated (quality/incident risk).")
    if vol > 0.35:
        add("volatility", vol, "System volatility is high (unstable conditions).")
    if loops:
        add("feedback_loops", _clamp01(0.15 * len(loops)), "Feedback loops amplify changes (fragility increases).")

    # sort by weight and keep top 5
    reasons.sort(key=lambda r: r.get("weight", 0.0), reverse=True)
    reasons = reasons[:5]

    return {
        "score": float(score),
        "level": level,
        "reasons": reasons,
        "drivers": {
            "inventory_pressure": float(inventory_pressure),
            "time_pressure": float(time_pressure),
            "quality_risk": float(quality_risk),
            "volatility": float(vol),
            "loop_risk": float(loop_risk),
        },
    }
