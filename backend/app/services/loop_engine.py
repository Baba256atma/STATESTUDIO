from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "business_loops.json"


def clamp01(x: float) -> float:
    return 0.0 if x < 0 else 1.0 if x > 1 else x


def map_low(x: float) -> float:
    return clamp01(1.0 - float(x))


def map_high(x: float) -> float:
    return clamp01(float(x))


_OPS = {
    "<": lambda a, b: a < b,
    "<=": lambda a, b: a <= b,
    ">": lambda a, b: a > b,
    ">=": lambda a, b: a >= b,
    "==": lambda a, b: a == b,
    "!=": lambda a, b: a != b,
}


@lru_cache(maxsize=1)
def load_loops() -> Dict[str, Any]:
    if not DATA_PATH.exists():
        return {"version": 1, "loops": [], "mappings": {}}
    with DATA_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        return {"version": 1, "loops": [], "mappings": {}}
    data.setdefault("loops", [])
    data.setdefault("mappings", {})
    return data


def _condition_score(cond: Dict[str, Any], kpi: Dict[str, float]) -> Tuple[bool, float]:
    metric = str(cond.get("metric") or "")
    op = str(cond.get("op") or "")
    value = cond.get("value")
    if metric not in kpi or op not in _OPS:
        return False, 0.0
    try:
        x = float(kpi[metric])
        t = float(value)
    except Exception:
        return False, 0.0
    passed = bool(_OPS[op](x, t))

    def closeness_leq(v: float, thresh: float) -> float:
        if v > thresh:
            return 0.0
        denom = abs(thresh) if abs(thresh) > 1e-6 else 1.0
        return clamp01((thresh - v) / denom)

    def closeness_geq(v: float, thresh: float) -> float:
        if v < thresh:
            return 0.0
        denom = abs(1.0 - thresh) if abs(1.0 - thresh) > 1e-6 else 1.0
        return clamp01((v - thresh) / denom)

    score = 0.0
    if op == "<" or op == "<=":
        score = closeness_leq(x, t)
    elif op == ">" or op == ">=":
        score = closeness_geq(x, t)
    elif op == "==":
        score = 1.0 if abs(x - t) < 1e-6 else 0.0
    elif op == "!=":
        score = 0.0 if abs(x - t) < 1e-6 else 0.5

    return passed, clamp01(score)


def _activation_passed(act: Dict[str, Any], kpi: Dict[str, float]) -> Tuple[bool, List[Dict[str, Any]], float]:
    """Return (active, triggered_conds, strength_from_conditions)."""
    if not isinstance(act, dict):
        return False, [], 0.0
    if "any" in act and isinstance(act["any"], list):
        scores = []
        trig = []
        for c in act["any"]:
            if not isinstance(c, dict):
                continue
            passed, s = _condition_score(c, kpi)
            if passed:
                trig.append(c)
            scores.append(s)
        if not scores:
            return False, [], 0.0
        return any(s > 0 for s in scores), trig, max(scores)
    if "all" in act and isinstance(act["all"], list):
        scores = []
        trig = []
        valid_conds = [c for c in act["all"] if isinstance(c, dict)]
        if not valid_conds:
            return False, [], 0.0
        for c in valid_conds:
            passed, s = _condition_score(c, kpi)
            if passed:
                trig.append(c)
            scores.append(s)
        active = len(trig) == len(valid_conds)
        strength = sum(scores) / len(scores) if scores else 0.0
        return active, trig, clamp01(strength)
    return False, [], 0.0


def _weight_from_rule(rule: Dict[str, Any], kpi: Dict[str, float]) -> float:
    metric = str(rule.get("metric") or "")
    map_name = str(rule.get("map") or "")
    if metric not in kpi:
        return 0.0
    x = float(kpi[metric])
    if map_name == "low":
        return map_low(x)
    if map_name == "high":
        return map_high(x)
    return clamp01(x)


def evaluate_loops(
    kpi: Dict[str, float],
    allowed_objects: Optional[List[str]] = None,
    top_k: int = 3,
) -> Dict[str, Any]:
    data = load_loops()
    loops_cfg = data.get("loops", [])
    allow_set = set(allowed_objects) if allowed_objects else None

    active: List[Dict[str, Any]] = []

    for lp in loops_cfg:
        if not isinstance(lp, dict):
            continue
        loop_id = str(lp.get("id") or "")
        if not loop_id:
            continue
        label = str(lp.get("label") or loop_id)
        polarity = str(lp.get("polarity") or "unknown")
        edges_cfg = lp.get("edges") if isinstance(lp.get("edges"), list) else []

        # If an allowlist is provided but none of the configured edges touch it, do not filter edges.
        allow_filter = allow_set
        if allow_set:
            touches = False
            for e in edges_cfg:
                if not isinstance(e, dict):
                    continue
                frm = e.get("from")
                to = e.get("to")
                if isinstance(frm, str) and frm in allow_set:
                    touches = True
                    break
                if isinstance(to, str) and to in allow_set:
                    touches = True
                    break
            if not touches:
                allow_filter = None

        passed, triggered, cond_strength = _activation_passed(lp.get("activation") or {}, kpi)
        if not passed:
            continue

        weighting = lp.get("weighting") if isinstance(lp.get("weighting"), dict) else {}
        weights: List[float] = []
        for _, rule in weighting.items():
            if isinstance(rule, dict):
                weights.append(_weight_from_rule(rule, kpi))
        strength = float(sum(weights) / len(weights)) if weights else cond_strength
        strength = clamp01(strength if strength > 0 else 0.25)

        edges: List[Dict[str, Any]] = []
        for e in edges_cfg:
            if not isinstance(e, dict):
                continue
            frm = e.get("from")
            to = e.get("to")
            if not isinstance(frm, str) or not isinstance(to, str):
                continue
            # When an allowlist is present, keep edges that touch at least one allowed id.
            if allow_filter and not (frm in allow_filter or to in allow_filter):
                continue
            edges.append(
                {
                    "from": frm,
                    "to": to,
                    "kind": e.get("kind") or e.get("polarity") or "unknown",
                    "weight": clamp01(float(e.get("weight", strength))),
                    "label": e.get("label"),
                }
            )
        if allow_set and not edges:
            continue

        active.append(
            {
                "id": loop_id,
                "label": label,
                "polarity": polarity,
                "strength": strength,
                "edges": edges,
                "triggered_by": triggered,
            }
        )

    active.sort(key=lambda x: float(x.get("strength", 0)), reverse=True)
    if top_k:
        active = active[: max(1, int(top_k))]
    active_loop = active[0]["id"] if active else None

    suggestions: List[str] = []
    for lp in active:
        text = (lp.get("label") or "").lower()
        if "inventory" in text:
            suggestions.append("Consider reviewing reorder points and lead time assumptions.")
        if "delivery" in text or "delay" in text:
            suggestions.append("Consider prioritizing bottlenecks and reducing cycle time variance.")
        if "risk" in text:
            suggestions.append("Consider mitigating top risks and adding monitoring for early signals.")
    # de-dupe
    dedup = []
    seen = set()
    for s in suggestions:
        if s in seen:
            continue
        seen.add(s)
        dedup.append(s)

    return {
        "loops": active,
        "active_loop": active_loop,
        "loops_suggestions": dedup[:5],
    }
