from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Dict, List, Tuple


@lru_cache(maxsize=1)
def load_object_dictionary(path: Path | None = None) -> Dict[str, object]:
    """Load object dictionary (types + instances + legacy). Cached for reuse."""
    try:
        dict_path = path or Path(__file__).resolve().parents[2] / "data" / "object_dictionary_v1.json"
        if not dict_path.exists():
            return {"types": {}, "instances": [], "objects": []}
        with dict_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        types = data.get("types") if isinstance(data, dict) else {}
        instances = data.get("instances") if isinstance(data, dict) else []
        legacy = data.get("objects") if isinstance(data, dict) else []
        return {
            "types": types if isinstance(types, dict) else {},
            "instances": instances if isinstance(instances, list) else [],
            "objects": legacy if isinstance(legacy, list) else [],
        }
    except Exception:
        logging.exception("hybrid_rulebook_load_failed")
        return {"types": {}, "instances": [], "objects": []}


def _text_tokens(text: str) -> List[str]:
    out: List[str] = []
    cur: List[str] = []
    for ch in text.lower():
        if ch.isalnum() or ch in {"_", "-"}:
            cur.append(ch)
        else:
            if cur:
                out.append("".join(cur))
                cur = []
    if cur:
        out.append("".join(cur))
    return out


def infer_objects_from_text_scored(text: str, mode: str, object_dict: Dict[str, object]) -> List[Tuple[str, float]]:
    """Infer object ids from text and return scored candidates (sorted desc)."""
    if not text:
        return []
    tokens = set(_text_tokens(text))
    if not tokens:
        return []

    scored: List[Tuple[str, float]] = []

    def score_entry(entry: Dict, oid: str) -> float:
        score = 0.0
        fields: List[str] = []
        for key in ("id", "label", "name", "display_name", "summary", "one_liner"):
            val = entry.get(key)
            if isinstance(val, str):
                fields.append(val)
        for key in ("tags", "synonyms"):
            vals = entry.get(key)
            if isinstance(vals, list):
                fields.extend(str(v) for v in vals if isinstance(v, str))
        domain = entry.get("domain_hints")
        if isinstance(domain, dict):
            for v in domain.values():
                if isinstance(v, list):
                    fields.extend(str(x) for x in v if isinstance(x, str))
            if mode in domain and isinstance(domain[mode], list):
                fields.extend(str(x) for x in domain[mode] if isinstance(x, str))

        field_tokens = set()
        for f in fields:
            field_tokens.update(_text_tokens(f))

        # base score: token overlap
        score += float(len(tokens.intersection(field_tokens)))

        # small stability bias: exact id token match gets a tiny boost
        if oid.lower() in tokens:
            score += 0.25

        return score

    # instances
    for inst in (object_dict.get("instances") or []):
        if not isinstance(inst, dict) or not inst.get("id"):
            continue
        oid = str(inst["id"])
        s = score_entry(inst, oid)
        if s > 0:
            scored.append((oid, s))

    # types
    types = object_dict.get("types") or {}
    if isinstance(types, dict):
        for tid, tentry in types.items():
            if not isinstance(tentry, dict):
                continue
            oid = str(tid)
            s = score_entry(tentry, oid)
            if s > 0:
                scored.append((oid, s))

    # legacy objects
    for obj in (object_dict.get("objects") or []):
        if not isinstance(obj, dict) or not obj.get("id"):
            continue
        oid = str(obj["id"])
        s = score_entry(obj, oid)
        if s > 0:
            scored.append((oid, s))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored


def infer_objects_from_text(text: str, mode: str, object_dict: Dict[str, object]) -> List[str]:
    """Infer object ids from text using synonyms/domain_hints/tags/labels."""
    if not text:
        return []
    scored = infer_objects_from_text_scored(text, mode, object_dict)
    return [oid for oid, _ in scored[:3]]


def pick_allowed_objects(payload_allowed: List[str] | None, inferred: List[str]) -> Tuple[List[str], str | None, str]:
    """Hybrid policy: UI allowlist wins, else first inferred, else none."""
    if payload_allowed:
        cleaned: List[str] = []
        seen = set()
        for x in payload_allowed:
            if not isinstance(x, str):
                continue
            sid = x.strip()
            if not sid or sid in seen:
                continue
            seen.add(sid)
            cleaned.append(sid)
        focus = cleaned[0] if cleaned else None
        return cleaned, focus, "ui"
    if inferred:
        cleaned_inf: List[str] = []
        seen = set()
        for oid in inferred:
            if oid and oid not in seen:
                seen.add(oid)
                cleaned_inf.append(oid)
        if cleaned_inf:
            return cleaned_inf, cleaned_inf[0], "inferred"
    return [], None, "none"


def sanitize_allowed_objects(allowed: List[str]) -> List[str]:
    seen = set()
    out: List[str] = []
    for x in allowed:
        if not isinstance(x, str):
            continue
        sid = x.strip()
        if not sid or sid in seen:
            continue
        seen.add(sid)
        out.append(sid)
    return out
