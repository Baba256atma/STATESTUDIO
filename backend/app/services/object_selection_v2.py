from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Any, List, Optional, Tuple
import re
import math

from app.services.hybrid_rulebook import load_object_dictionary, infer_objects_from_text_scored


@dataclass
class SelectionResult:
    allowed_objects: List[str]
    focused_object_id: Optional[str]
    scores: Dict[str, float]
    matched: List[str]
    why: str
    method: str
    source: str


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "").lower()).strip()


def tokenize(text: str) -> List[str]:
    return [t for t in re.split(r"[^a-z0-9_]+", normalize(text)) if t]


def clamp01(x: Any) -> float:
    try:
        v = float(x)
    except Exception:
        return 0.0
    if v < 0.0:
        return 0.0
    if v > 1.0:
        return 1.0
    return v


def topk(scores: Dict[str, float], k: int) -> List[Tuple[str, float]]:
    return sorted(scores.items(), key=lambda kv: float(kv[1]), reverse=True)[: max(0, int(k))]


def _safe_dict(x: Any) -> Dict[str, Any]:
    return x if isinstance(x, dict) else {}


def _safe_list(x: Any) -> List[Any]:
    return x if isinstance(x, list) else []


def _merge_entry(catalog: Dict[str, Dict[str, Any]], oid: str, entry: Dict[str, Any]) -> None:
    if not oid:
        return
    cur = catalog.get(oid, {"label": oid, "tags": [], "synonyms": [], "domain_hints": {}})
    label = entry.get("label") or entry.get("name") or entry.get("display_name") or cur.get("label") or oid
    tags = list({*[_ for _ in _safe_list(cur.get("tags")) if isinstance(_, str)], *[_ for _ in _safe_list(entry.get("tags")) if isinstance(_, str)]})
    synonyms = list({*[_ for _ in _safe_list(cur.get("synonyms")) if isinstance(_, str)], *[_ for _ in _safe_list(entry.get("synonyms")) if isinstance(_, str)]})
    domain_hints = _safe_dict(cur.get("domain_hints"))
    domain_hints.update(_safe_dict(entry.get("domain_hints")))
    catalog[oid] = {"label": str(label), "tags": tags, "synonyms": synonyms, "domain_hints": domain_hints}


def load_object_catalog() -> Dict[str, Dict[str, Any]]:
    """Build a normalized object catalog from the canonical dictionary loader."""
    data = load_object_dictionary()
    catalog: Dict[str, Dict[str, Any]] = {}

    for inst in _safe_list(data.get("instances")):
        if not isinstance(inst, dict):
            continue
        oid = str(inst.get("id") or "").strip()
        if oid:
            _merge_entry(catalog, oid, inst)

    for tid, tentry in _safe_dict(data.get("types")).items():
        if not isinstance(tentry, dict):
            continue
        oid = str(tentry.get("id") or tid or "").strip()
        if oid:
            _merge_entry(catalog, oid, tentry)

    for obj in _safe_list(data.get("objects")):
        if not isinstance(obj, dict):
            continue
        oid = str(obj.get("id") or "").strip()
        if oid:
            _merge_entry(catalog, oid, obj)

    if catalog:
        return catalog

    # Fallback MVP catalog (used only if canonical dictionary is empty/missing).
    return {
        "obj_inventory": {"label": "Inventory", "tags": ["inventory", "stock"], "synonyms": ["buffer"], "domain_hints": {}},
        "obj_delivery": {"label": "Delivery", "tags": ["delivery", "delay"], "synonyms": ["shipping"], "domain_hints": {}},
        "obj_risk_zone": {"label": "Risk", "tags": ["risk", "incident"], "synonyms": ["exposure"], "domain_hints": {}},
        "obj_time": {"label": "Time", "tags": ["time", "schedule"], "synonyms": ["deadline"], "domain_hints": {}},
        "obj_quality": {"label": "Quality", "tags": ["quality", "defect"], "synonyms": ["rework"], "domain_hints": {}},
    }


def select_objects_v2(
    text: str,
    mode: str,
    *,
    k: int = 15,
    recent_object_ids: Optional[List[str]] = None,
    fragility_drivers: Optional[Dict[str, float]] = None,
    preferred_focus_id: Optional[str] = None,
) -> SelectionResult:
    catalog = load_object_catalog()
    if not catalog:
        return SelectionResult([], None, {}, [], "No catalog available.", "scoring_v2", "dictionary+heuristics")

    ntext = normalize(text)
    tokens = set(tokenize(text))
    recent_set = {x for x in (recent_object_ids or []) if isinstance(x, str)}
    drivers = _safe_dict(fragility_drivers)
    k = max(12, min(20, int(k or 15)))

    driver_targets: Dict[str, List[str]] = {
        "inventory_pressure": ["obj_inventory"],
        "time_pressure": ["obj_time", "obj_delivery"],
        "quality_risk": ["obj_quality", "obj_risk_zone"],
        "volatility": ["obj_risk_zone"],
        "loop_risk": ["obj_risk_zone"],
    }

    scores: Dict[str, float] = {}
    matched: List[str] = []
    direct_matches: List[str] = []

    for oid, meta in catalog.items():
        label = str(meta.get("label") or oid)
        synonyms = [s for s in _safe_list(meta.get("synonyms")) if isinstance(s, str)]
        tags = [t for t in _safe_list(meta.get("tags")) if isinstance(t, str)]

        label_tokens = set(tokenize(" ".join([label] + synonyms)))
        tag_tokens = set(tokenize(" ".join(tags)))

        kw_overlap = len(tokens.intersection(label_tokens))
        tag_overlap = len(tokens.intersection(tag_tokens))
        keyword_match = clamp01(kw_overlap / max(1.0, math.sqrt(max(1, len(tokens)))))
        tag_match = clamp01(tag_overlap / max(1.0, math.sqrt(max(1, len(tokens)))))
        recency_boost = 1.0 if oid in recent_set else 0.0

        fragility_driver_boost = 0.0
        for d_key, d_val in drivers.items():
            if oid in driver_targets.get(str(d_key), []):
                fragility_driver_boost = max(fragility_driver_boost, clamp01(d_val))

        s = (
            0.55 * keyword_match
            + 0.25 * tag_match
            + 0.10 * recency_boost
            + 0.10 * fragility_driver_boost
        )
        scores[oid] = clamp01(s)
        if kw_overlap > 0 or tag_overlap > 0:
            matched.append(oid)

        text_hit = normalize(label) in ntext or any(normalize(syn) in ntext for syn in synonyms if len(normalize(syn)) > 2)
        if text_hit:
            direct_matches.append(oid)

    scored_pairs = topk(scores, len(scores))
    threshold = 0.08
    selected = [oid for oid, s in scored_pairs if s >= threshold][:k]

    anchors = ["obj_risk_zone", "obj_inventory", "obj_delivery"] if mode == "business" else []
    for oid in anchors:
        if oid in catalog and oid not in selected:
            selected.append(oid)

    if len(selected) < k:
        for oid, _ in scored_pairs:
            if oid not in selected:
                selected.append(oid)
            if len(selected) >= k:
                break

    selected = selected[:k]
    matched = [oid for oid in matched if oid in selected]

    focused_object_id: Optional[str] = None
    if preferred_focus_id and preferred_focus_id in selected and scores.get(preferred_focus_id, 0.0) >= 0.05:
        focused_object_id = preferred_focus_id
    elif direct_matches:
        direct_in_selected = [oid for oid in direct_matches if oid in selected]
        if direct_in_selected:
            focused_object_id = sorted(direct_in_selected, key=lambda oid: scores.get(oid, 0.0), reverse=True)[0]
    if focused_object_id is None and selected:
        focused_object_id = sorted(selected, key=lambda oid: scores.get(oid, 0.0), reverse=True)[0]

    active_drivers = [k for k, v in drivers.items() if clamp01(v) > 0.15][:3]
    why = f"Selected based on keywords: {', '.join(matched[:5]) or 'none'}, drivers: {', '.join(active_drivers) or 'none'}, recent: {len(recent_set)}."

    # Include scored hits from the existing infer function to keep parity with legacy matching.
    try:
        legacy_hits = [oid for oid, _ in infer_objects_from_text_scored(text, mode, load_object_dictionary())[:5]]
        for oid in legacy_hits:
            if oid in selected and oid not in matched:
                matched.append(oid)
    except Exception:
        pass

    return SelectionResult(
        allowed_objects=selected,
        focused_object_id=focused_object_id,
        scores=scores,
        matched=matched[:12],
        why=why,
        method="scoring_v2",
        source="dictionary+heuristics",
    )
