from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

_DATA_DIR = Path(__file__).resolve().parents[2] / "data"


def _read_json(path: Path, default: Any) -> Any:
    try:
        if not path.exists():
            return default
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def deep_merge(base: dict, patch: dict) -> dict:
    if not isinstance(base, dict) or not isinstance(patch, dict):
        return patch if isinstance(patch, dict) else base
    out = dict(base)
    for key, value in patch.items():
        if isinstance(value, dict) and isinstance(out.get(key), dict):
            out[key] = deep_merge(out[key], value)
        else:
            out[key] = value
    return out


def _merge_instances(base: List[dict], overrides: Dict[str, dict]) -> List[dict]:
    if not overrides:
        return base
    merged: List[dict] = []
    for inst in base:
        if not isinstance(inst, dict):
            continue
        oid = inst.get("id")
        if not isinstance(oid, str):
            merged.append(inst)
            continue
        ov = overrides.get(oid)
        if not isinstance(ov, dict):
            merged.append(inst)
            continue
        next_inst = {**inst}
        if isinstance(ov.get("label"), str):
            next_inst["label"] = ov["label"]
        if isinstance(ov.get("shortLabel"), str):
            next_inst["shortLabel"] = ov["shortLabel"]
        if isinstance(ov.get("overrides"), dict):
            base_overrides = next_inst.get("overrides") if isinstance(next_inst.get("overrides"), dict) else {}
            next_inst["overrides"] = deep_merge(base_overrides, ov["overrides"])
        merged.append(next_inst)
    return merged


def _merge_types(base: Dict[str, dict], overrides: Dict[str, dict]) -> Dict[str, dict]:
    if not overrides:
        return base
    merged: Dict[str, dict] = {}
    for tid, entry in base.items():
        if not isinstance(entry, dict):
            merged[tid] = entry
            continue
        ov = overrides.get(tid)
        if not isinstance(ov, dict):
            merged[tid] = entry
            continue
        next_entry = {**entry}
        for key in ("label", "one_liner", "summary"):
            if isinstance(ov.get(key), str):
                next_entry[key] = ov[key]
        for key in ("tags", "synonyms"):
            if isinstance(ov.get(key), list):
                next_entry[key] = ov[key]
        for key in ("domain_hints", "ux"):
            if isinstance(ov.get(key), dict):
                base_val = next_entry.get(key) if isinstance(next_entry.get(key), dict) else {}
                next_entry[key] = deep_merge(base_val, ov[key])
        merged[tid] = next_entry
    return merged


def _filter_instances(
    instances: List[dict],
    enabled: List[str] | None,
    disabled: List[str] | None,
) -> List[dict]:
    out = instances
    if isinstance(enabled, list) and enabled:
        allow = {x for x in enabled if isinstance(x, str)}
        out = [inst for inst in out if isinstance(inst, dict) and inst.get("id") in allow]
    if isinstance(disabled, list) and disabled:
        deny = {x for x in disabled if isinstance(x, str)}
        out = [inst for inst in out if isinstance(inst, dict) and inst.get("id") not in deny]
    return out


def load_company_config(company_id: str) -> dict:
    safe_id = company_id or "default"
    base_dict = _read_json(_DATA_DIR / "object_dictionary_v1.json", {})
    base_types = base_dict.get("types") if isinstance(base_dict, dict) else {}
    base_instances = base_dict.get("instances") if isinstance(base_dict, dict) else []

    company_dir = _DATA_DIR / "companies" / safe_id
    overrides = _read_json(company_dir / "company_overrides.json", {})
    company_loops = _read_json(company_dir / "company_loops.json", {}).get("loop_templates", [])
    company_kpis = _read_json(company_dir / "company_kpis.json", {}).get("kpis", [])

    object_overrides = overrides.get("object_overrides") if isinstance(overrides, dict) else {}
    type_overrides = overrides.get("type_overrides") if isinstance(overrides, dict) else {}
    visibility = overrides.get("visibility") if isinstance(overrides, dict) else {}
    theme = overrides.get("theme") if isinstance(overrides, dict) else {}
    scene_preset = overrides.get("scene_preset") if isinstance(overrides, dict) else {}

    merged_types = _merge_types(base_types if isinstance(base_types, dict) else {}, type_overrides if isinstance(type_overrides, dict) else {})
    merged_instances = _merge_instances(
        base_instances if isinstance(base_instances, list) else [],
        object_overrides if isinstance(object_overrides, dict) else {},
    )
    merged_loops = company_loops if isinstance(company_loops, list) else []
    merged_kpis = company_kpis if isinstance(company_kpis, list) else []
    merged_instances = _filter_instances(
        merged_instances,
        visibility.get("objects_enabled") if isinstance(visibility, dict) else None,
        visibility.get("objects_disabled") if isinstance(visibility, dict) else None,
    )

    return {
        "company_id": safe_id,
        "types": merged_types,
        "instances": merged_instances,
        "loops": merged_loops,
        "kpis": merged_kpis,
        "theme": theme if isinstance(theme, dict) else {},
        "scene_preset": scene_preset if isinstance(scene_preset, dict) else {},
    }
