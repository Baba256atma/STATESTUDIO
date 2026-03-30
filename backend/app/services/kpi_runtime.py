"""Deterministic in-memory KPI helpers for MVP chat/runtime flows."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from app.services.scene_utils import clamp01


def kpi_step(
    *,
    user_id: str,
    text: str,
    allowed_objects: list[str],
    mode: str,
    kpi_state_by_user: dict[str, dict[str, float]],
    kpi_default: dict[str, float],
    build_loops: Callable[[dict[str, float], set[str] | None], list[Any]],
) -> dict[str, Any]:
    """Lightweight per-user KPI updater."""
    txt = (text or "").lower()
    uid = user_id or "dev-anon"
    state = kpi_state_by_user.get(uid)
    if not isinstance(state, dict):
        state = dict(kpi_default)
        kpi_state_by_user[uid] = state

    inv = float(state.get("inventory", 0.5) or 0.5)
    delv = float(state.get("delivery", 0.5) or 0.5)
    risk = float(state.get("risk", 0.5) or 0.5)

    def dec(val: float, amt: float = 0.05) -> float:
        return clamp01(val - amt)

    def inc(val: float, amt: float = 0.05) -> float:
        return clamp01(val + amt)

    allow_set = {a for a in allowed_objects if isinstance(a, str)}
    focus_inventory = ("obj_inventory" in allow_set) or ("inventory" in txt) or ("stock" in txt) or ("storage" in txt) or ("warehouse" in txt)
    focus_delivery = ("obj_delivery" in allow_set) or ("delivery" in txt) or ("delay" in txt) or ("shipping" in txt) or ("lead time" in txt) or ("deadline" in txt)
    focus_risk = ("obj_risk_zone" in allow_set) or ("risk" in txt) or ("exposure" in txt) or ("incident" in txt) or ("issue" in txt) or ("quality" in txt)

    if focus_inventory:
        if any(k in txt for k in ["low", "stockout", "spike"]):
            inv = dec(inv, 0.07)
        if any(k in txt for k in ["restock", "reorder", "arrived", "stabilize"]):
            inv = inc(inv, 0.06)
    if focus_delivery:
        if any(k in txt for k in ["delay", "late", "slip", "bottleneck"]):
            delv = dec(delv, 0.07)
        if any(k in txt for k in ["on time", "recovered", "caught up"]):
            delv = inc(delv, 0.06)
    if focus_risk:
        if any(k in txt for k in ["risk", "incident", "unstable", "quality drop"]):
            risk = inc(risk, 0.07)
        if any(k in txt for k in ["mitigate", "fix", "resolved"]):
            risk = dec(risk, 0.06)

    state["inventory"] = inv
    state["delivery"] = delv
    state["risk"] = risk

    focus_ids = [a for a in allowed_objects if isinstance(a, str)]
    focus_set = set(focus_ids)
    loops = build_loops(
        {"inventory": inv, "delivery": delv, "risk": risk},
        focus_set if focus_set else None,
    )

    return {
        "kpi": {"inventory": inv, "delivery": delv, "risk": risk},
        "loops": loops,
        "signals": [],
    }
