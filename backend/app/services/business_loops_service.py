from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Dict, List, Optional, Tuple

LOOPS_CONFIG_PATH = Path(__file__).resolve().parents[2] / "data" / "business_loops.json"


def clamp01(x: float) -> float:
    try:
        v = float(x)
    except Exception:
        return 0.0
    if v < 0.0:
        return 0.0
    if v > 1.0:
        return 1.0
    return v


@lru_cache(maxsize=1)
def load_loop_library() -> Dict:
    try:
        if not LOOPS_CONFIG_PATH.exists():
            logging.warning("business_loops_config_missing", extra={"path": str(LOOPS_CONFIG_PATH)})
            return {}
        with LOOPS_CONFIG_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else {}
    except Exception:
        logging.exception("business_loops_config_load_failed")
        return {}


def _eval_map(metric_val: float, map_key: str, maps_cfg: Dict[str, str]) -> float:
    if map_key == "low":
        return clamp01(1.0 - metric_val)
    if map_key == "high":
        return clamp01(metric_val)
    # custom map via expressions is out of scope for this minimal loader
    expr = maps_cfg.get(map_key)
    if expr:
        try:
            # extremely limited eval context; only x and clamp01
            return clamp01(eval(expr, {"__builtins__": {}}, {"x": metric_val, "clamp01": clamp01}))
        except Exception:
            return 0.0
    return 0.0


def _activation_passes(kpi: Dict[str, float], activation: Dict) -> bool:
    if not activation or not isinstance(activation, dict):
        return True
    any_conds = activation.get("any")
    all_conds = activation.get("all")

    def _check(cond: Dict) -> bool:
        if not isinstance(cond, dict):
            return False
        metric = cond.get("metric")
        op = cond.get("op")
        val = cond.get("value")
        if metric is None or op is None:
            return False
        try:
            cur = float(kpi.get(metric, 0.0))
            tgt = float(val)
        except Exception:
            return False
        if op == "<":
            return cur < tgt
        if op == "<=":
            return cur <= tgt
        if op == ">":
            return cur > tgt
        if op == ">=":
            return cur >= tgt
        return False

    if isinstance(any_conds, list) and any_conds:
        return any(_check(c) for c in any_conds)
    if isinstance(all_conds, list) and all_conds:
        return all(_check(c) for c in all_conds)
    return True


def build_loops_from_kpi(kpi: Dict[str, float], allowed_objects: Optional[List[str]] = None) -> List[Dict]:
    cfg = load_loop_library()
    loops_cfg = cfg.get("loops", []) if isinstance(cfg, dict) else []
    maps_cfg = cfg.get("mappings", {}).get("map", {}) if isinstance(cfg, dict) else {}
    allow_set = set(a for a in (allowed_objects or []) if isinstance(a, str))

    runtime: List[Dict] = []
    for entry in loops_cfg:
        if not isinstance(entry, dict):
            continue
        edges_cfg = entry.get("edges")
        if not isinstance(edges_cfg, list) or not edges_cfg:
            continue
        if not _activation_passes(kpi, entry.get("activation", {})):
            continue

        # weight
        weighting = entry.get("weighting", {})
        weights = []
        if isinstance(weighting, dict):
            for spec in weighting.values():
                if not isinstance(spec, dict):
                    continue
                metric = spec.get("metric")
                map_key = spec.get("map")
                if metric is None or map_key is None:
                    continue
                weights.append(_eval_map(float(kpi.get(metric, 0.0)), map_key, maps_cfg))
        loop_weight = clamp01(sum(weights) / len(weights)) if weights else 0.3

        built_edges = []
        for e in edges_cfg:
            if not isinstance(e, dict):
                continue
            from_id = str(e.get("from"))
            to_id = str(e.get("to"))
            if allow_set and not (from_id in allow_set and to_id in allow_set):
                continue
            built_edges.append(
                {
                    "from": from_id,
                    "to": to_id,
                    "kind": e.get("kind") or "link",
                    "weight": loop_weight,
                    "label": e.get("label"),
                }
            )
        if allow_set and not built_edges:
            continue

        runtime.append(
            {
                "id": entry.get("id"),
                "label": entry.get("label") or entry.get("id"),
                "polarity": entry.get("polarity") or "negative",
                "weight": loop_weight,
                "edges": built_edges,
            }
        )

    runtime.sort(key=lambda l: l.get("weight", 0), reverse=True)
    return runtime


def score_loops(text: str, kpi: Dict[str, float], allowed_set: Optional[set[str]]) -> List[Dict]:
    txt = (text or "").lower()
    cfg = load_loop_library()
    loops_cfg = cfg.get("loops", []) if isinstance(cfg, dict) else []
    scored: List[Dict] = []
    for entry in loops_cfg:
        if not isinstance(entry, dict):
            continue
        # basic keyword scoring
        triggers = entry.get("trigger", {}).get("when_any", [])
        score = 0.0
        matched: List[str] = []
        for kw in triggers:
            if not isinstance(kw, str):
                continue
            if kw.lower() in txt:
                score += 1.0
                matched.append(kw)
        # allowlist bonus
        nodes = entry.get("nodes", [])
        if allowed_set and any(n in allowed_set for n in nodes):
            score += 0.5
        # small KPI-based bonus
        inv = clamp01(kpi.get("inventory", 0.5))
        delv = clamp01(kpi.get("delivery", 0.5))
        risk = clamp01(kpi.get("risk", 0.5))
        if inv < 0.35 and "inventory" in (entry.get("tags") or []):
            score += 0.2
        if delv < 0.35 and "delivery" in (entry.get("tags") or []):
            score += 0.2
        if risk > 0.65 and "risk" in (entry.get("tags") or []):
            score += 0.2
        if score > 0:
            scored.append({"id": entry.get("id"), "label": entry.get("label"), "score": score, "matched": matched, "entry": entry})
    scored.sort(key=lambda s: s.get("score", 0.0), reverse=True)
    return scored


def pick_active_loop(scored: List[Dict], threshold: float = 1.0) -> Optional[Dict]:
    if not scored:
        return None
    top = scored[0]
    if top.get("score", 0.0) >= threshold:
        return top
    return None


def apply_loop_tick(loop_entry: Dict, kpi: Dict[str, float], allowed_set: Optional[set[str]]):
    effects = loop_entry.get("effects", {}) if isinstance(loop_entry, dict) else {}
    intensity_delta = float(effects.get("intensity_delta_per_tick", 0.0) or 0.0)
    new_intensity = clamp01(float(kpi.get("intensity", kpi.get("delivery", 0.5))) + intensity_delta)

    emphasis_map = effects.get("emphasis", {}) if isinstance(effects, dict) else {}
    actions: List[Dict] = []
    nodes = loop_entry.get("nodes", [])
    for oid in nodes:
        if allowed_set and oid not in allowed_set:
            continue
        emp = float(emphasis_map.get(oid, 0.0) or 0.0)
        if emp <= 0:
            continue
        actions.append({"type": "applyObject", "object": oid, "value": {"id": oid, "emphasis": emp}})

    loop_payload = {
        "id": loop_entry.get("id"),
        "label": loop_entry.get("label"),
        "polarity": loop_entry.get("polarity") or "negative",
        "weight": clamp01(loop_entry.get("effects", {}).get("intensity_delta_per_tick", 0.0) * 10 if isinstance(loop_entry.get("effects"), dict) else 0.3),
        "edges": loop_entry.get("edges") or [],
    }
    return new_intensity, actions, loop_payload
