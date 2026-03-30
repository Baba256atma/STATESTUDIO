"""Object dictionary/profile helpers extracted from backend.main."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any


def load_object_dict(object_dict_path: Path, instance_dict_path: Path) -> dict[str, dict[str, dict]]:
    try:
        if not object_dict_path.exists():
            return {"legacy": {}, "types": {}, "instances": {}}
        with object_dict_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        extra_instances: dict[str, dict] = {}
        if instance_dict_path.exists():
            try:
                with instance_dict_path.open("r", encoding="utf-8") as f2:
                    inst_data = json.load(f2)
                if isinstance(inst_data, dict) and isinstance(inst_data.get("instances"), list):
                    for inst in inst_data["instances"]:
                        if isinstance(inst, dict) and inst.get("id"):
                            extra_instances[str(inst.get("id"))] = inst
            except Exception:
                logging.exception("failed_loading_extra_instances")
        legacy: dict[str, dict] = {}
        types: dict[str, dict] = {}
        instances: dict[str, dict] = {}
        if isinstance(data, dict):
            if isinstance(data.get("types"), dict):
                for tid, tentry in data["types"].items():
                    if isinstance(tentry, dict):
                        types[str(tentry.get("id") or tid)] = tentry
            if isinstance(data.get("instances"), list):
                for inst in data["instances"]:
                    if isinstance(inst, dict) and inst.get("id"):
                        instances[str(inst.get("id"))] = inst
            if isinstance(data.get("objects"), list):
                for obj in data["objects"]:
                    if isinstance(obj, dict) and obj.get("id"):
                        legacy[str(obj.get("id"))] = obj
        elif isinstance(data, list):
            for obj in data:
                if isinstance(obj, dict) and obj.get("id"):
                    legacy[str(obj.get("id"))] = obj
        instances.update(extra_instances)
        return {"legacy": legacy, "types": types, "instances": instances}
    except Exception:
        logging.exception("failed_loading_object_dict")
    return {"legacy": {}, "types": {}, "instances": {}}


def validate_object_dict(obj_map: dict[str, dict]) -> None:
    """Lightweight sanity checks for object profiles."""
    try:
        seen = set()
        for oid, entry in obj_map.items():
            if oid in seen:
                logging.warning("duplicate_object_id_in_dictionary", extra={"id": oid})
            seen.add(oid)
            if not isinstance(entry, dict):
                logging.warning("invalid_object_entry_type", extra={"id": oid})
                continue
            lbl = entry.get("label") or oid
            if not isinstance(lbl, str):
                logging.warning("invalid_object_label", extra={"id": oid})
            summary = entry.get("summary", "")
            if summary is not None and not isinstance(summary, str):
                logging.warning("invalid_object_summary", extra={"id": oid})
    except Exception:
        logging.exception("object_dict_validation_failed")


def get_object_entry(
    obj_id: str,
    *,
    object_instances: dict[str, dict],
    object_types: dict[str, dict],
    legacy_objects: dict[str, dict],
    raw_object_dict: dict[str, dict],
) -> dict | None:
    if not obj_id:
        return None
    return object_instances.get(obj_id) or object_types.get(obj_id) or legacy_objects.get(obj_id) or raw_object_dict.get(obj_id)


def get_type_for_instance(inst: dict | None, *, object_types: dict[str, dict]) -> dict | None:
    if not inst or not isinstance(inst, dict):
        return None
    t_id = inst.get("type")
    if not t_id:
        return None
    return object_types.get(str(t_id))


def get_any_entry(
    obj_id: str,
    *,
    object_instances: dict[str, dict],
    object_types: dict[str, dict],
    legacy_objects: dict[str, dict],
    raw_object_dict: dict[str, dict],
) -> tuple[dict | None, dict | None]:
    inst = object_instances.get(obj_id)
    if inst:
        return inst, get_type_for_instance(inst, object_types=object_types)
    t = object_types.get(obj_id)
    if t:
        return t, None
    legacy = legacy_objects.get(obj_id) or raw_object_dict.get(obj_id)
    return legacy, None


def next_instance_id(type_id: str, instance_counters: dict[str, int]) -> str:
    cur = instance_counters.get(type_id, 1) + 1
    instance_counters[type_id] = cur
    label_part = type_id.replace("type_", "") if type_id.startswith("type_") else type_id
    return f"obj_{label_part}__{cur}"


def build_object_profile(
    obj_id: str,
    *,
    object_instances: dict[str, dict],
    object_types: dict[str, dict],
    legacy_objects: dict[str, dict],
    raw_object_dict: dict[str, dict],
) -> dict | None:
    if not obj_id:
        return None
    inst, tentry = get_any_entry(
        obj_id,
        object_instances=object_instances,
        object_types=object_types,
        legacy_objects=legacy_objects,
        raw_object_dict=raw_object_dict,
    )
    if not isinstance(inst, dict):
        return None
    type_id = inst.get("type") or (tentry.get("id") if isinstance(tentry, dict) else None)
    type_label = tentry.get("label") if isinstance(tentry, dict) else None
    base = tentry if isinstance(tentry, dict) else {}
    label = inst.get("label") or base.get("label") or obj_id
    one_liner = inst.get("one_liner") or base.get("one_liner") or ""
    summary = inst.get("summary") or base.get("summary") or ""
    tags = inst.get("tags") if isinstance(inst.get("tags"), list) else base.get("tags") if isinstance(base.get("tags"), list) else []
    synonyms = inst.get("synonyms") if isinstance(inst.get("synonyms"), list) else base.get("synonyms") if isinstance(base.get("synonyms"), list) else []
    domain_hints = inst.get("domain_hints") if isinstance(inst.get("domain_hints"), dict) else base.get("domain_hints") if isinstance(base.get("domain_hints"), dict) else {}
    ux = inst.get("ux") if isinstance(inst.get("ux"), dict) else base.get("ux") if isinstance(base.get("ux"), dict) else {}
    overrides = inst.get("overrides") if isinstance(inst.get("overrides"), dict) else {}
    if isinstance(overrides.get("ux"), dict):
        ux = {**ux, **overrides.get("ux")}
    shape = ux.get("shape") or "cube"
    base_color = ux.get("base_color") or "#3498db"
    final_color = overrides.get("color") or base_color
    return {
        "id": obj_id,
        "label": label,
        "type": type_id,
        "type_label": type_label,
        "one_liner": one_liner,
        "summary": summary,
        "tags": [t for t in tags if isinstance(t, str)],
        "synonyms": [s for s in synonyms if isinstance(s, str)],
        "domain_hints": domain_hints,
        "ux": {"shape": shape, "base_color": base_color},
        "final_color": final_color,
    }


def build_object_info(
    obj_id: str,
    *,
    object_instances: dict[str, dict],
    object_types: dict[str, dict],
    legacy_objects: dict[str, dict],
    raw_object_dict: dict[str, dict],
) -> dict | None:
    entry, type_entry = get_any_entry(
        obj_id,
        object_instances=object_instances,
        object_types=object_types,
        legacy_objects=legacy_objects,
        raw_object_dict=raw_object_dict,
    )
    if not isinstance(entry, dict):
        return None
    label = entry.get("label") or entry.get("display_name") or entry.get("name") or obj_id
    type_label = type_entry.get("label") if isinstance(type_entry, dict) else None
    one_liner = entry.get("one_liner") or (type_entry.get("one_liner") if isinstance(type_entry, dict) else "") or ""
    summary = entry.get("summary") or entry.get("hint") or entry.get("description") or (type_entry.get("summary") if isinstance(type_entry, dict) else "")
    tags = entry.get("tags") if isinstance(entry.get("tags"), list) else []
    if isinstance(type_entry, dict) and isinstance(type_entry.get("tags"), list):
        tags = tags or type_entry.get("tags")
    safe_tags = [t for t in tags if isinstance(t, str) and t.strip()]
    synonyms = entry.get("synonyms") if isinstance(entry.get("synonyms"), list) else []
    if isinstance(type_entry, dict) and isinstance(type_entry.get("synonyms"), list):
        synonyms = synonyms or type_entry.get("synonyms")
    safe_synonyms = [t for t in synonyms if isinstance(t, str) and t.strip()]
    domain_hints = entry.get("domain_hints") if isinstance(entry.get("domain_hints"), dict) else {}
    if not domain_hints and isinstance(type_entry, dict) and isinstance(type_entry.get("domain_hints"), dict):
        domain_hints = type_entry.get("domain_hints")
    ux = entry.get("ux") if isinstance(entry.get("ux"), dict) else None
    if not ux and isinstance(type_entry, dict) and isinstance(type_entry.get("ux"), dict):
        ux = type_entry.get("ux")
    obj_type = entry.get("type") if entry.get("type") else (type_entry.get("id") if isinstance(type_entry, dict) else None)
    return {
        "id": obj_id,
        "label": str(label),
        "type": obj_type,
        "type_label": type_label,
        "one_liner": str(one_liner),
        "summary": str(summary),
        "tags": safe_tags[:10],
        "synonyms": safe_synonyms[:10],
        "domain_hints": domain_hints,
        "ux": ux,
    }


def text_tokens(value: str) -> set[str]:
    if not value or not isinstance(value, str):
        return set()
    out = []
    cur = []
    for ch in value.lower():
        if ch.isalnum() or ch in {"_", "-"}:
            cur.append(ch)
        else:
            if cur:
                out.append("".join(cur))
                cur = []
    if cur:
        out.append("".join(cur))
    return set(out)


def infer_allowed_objects_from_text(
    text: str,
    *,
    mode: str | None,
    object_instances: dict[str, dict],
    object_types: dict[str, dict],
    legacy_objects: dict[str, dict],
    allowed_only: list[str] | None = None,
) -> list[str]:
    if not text:
        return []
    tokens = text_tokens(text)
    if not tokens:
        return []
    allow_set = set(allowed_only) if allowed_only else None

    def score_entry(entry: dict[str, Any]) -> float:
        score = 0.0
        fields = []
        for key in ("id", "canonical_id", "name", "display_name", "label", "summary", "one_liner"):
            val = entry.get(key)
            if isinstance(val, str):
                fields.append(val)
        tags = entry.get("tags")
        if isinstance(tags, list):
            fields.extend(str(t) for t in tags if isinstance(t, str))
        syns = entry.get("synonyms")
        if isinstance(syns, list):
            fields.extend(str(s) for s in syns if isinstance(s, str))
        domain_hints = entry.get("domain_hints")
        mode_tokens: set[str] = set()
        if isinstance(domain_hints, dict):
            for v in domain_hints.values():
                if isinstance(v, list):
                    fields.extend(str(x) for x in v if isinstance(x, str))
            if mode and mode in domain_hints and isinstance(domain_hints[mode], list):
                mode_tokens = text_tokens(" ".join(str(x) for x in domain_hints[mode] if isinstance(x, str)))
        for f in fields:
            score += len(tokens.intersection(text_tokens(f)))
        if mode_tokens:
            score += len(tokens.intersection(mode_tokens)) * 2
        return score

    scored_instances: list[tuple[str, float]] = []
    for oid, entry in object_instances.items():
        if allow_set is not None and oid not in allow_set:
            continue
        s = score_entry(entry)
        if s > 0:
            scored_instances.append((oid, s))

    scored_types: list[tuple[str, float]] = []
    for oid, entry in object_types.items():
        if allow_set is not None and oid not in allow_set:
            continue
        s = score_entry(entry)
        if s > 0:
            scored_types.append((oid, s))

    scored_legacy: list[tuple[str, float]] = []
    for oid, entry in legacy_objects.items():
        if allow_set is not None and oid not in allow_set:
            continue
        s = score_entry(entry)
        if s > 0:
            scored_legacy.append((oid, s))

    if scored_instances:
        scored_instances.sort(key=lambda item: item[1], reverse=True)
        return [oid for oid, _ in scored_instances[:3]]
    if scored_types:
        scored_types.sort(key=lambda item: item[1], reverse=True)
        return [oid for oid, _ in scored_types[:3]]
    scored_legacy.sort(key=lambda item: item[1], reverse=True)
    return [oid for oid, _ in scored_legacy[:3]]


def initialize_registry_state(object_dict_path: Path, instance_dict_path: Path) -> dict[str, Any]:
    loaded = load_object_dict(object_dict_path, instance_dict_path)
    raw_object_dict = loaded.get("legacy", {})
    object_types = loaded.get("types", {})
    object_instances = loaded.get("instances", {})

    computed_legacy: dict[str, dict] = {}
    for inst_id in object_instances.keys():
        prof = build_object_profile(
            inst_id,
            object_instances=object_instances,
            object_types=object_types,
            legacy_objects={},
            raw_object_dict=raw_object_dict,
        )
        if prof:
            computed_legacy[inst_id] = prof
    if not computed_legacy and raw_object_dict:
        computed_legacy = raw_object_dict.copy()

    validate_object_dict({**computed_legacy, **object_types, **object_instances})

    instance_counters: dict[str, int] = {}
    for inst in object_instances.values():
        if not isinstance(inst, dict):
            continue
        t = inst.get("type")
        if not t:
            continue
        inst_id = inst.get("id", "")
        n = 1
        if isinstance(inst_id, str) and "__" in inst_id:
            try:
                n = max(n, int(inst_id.rsplit("__", 1)[-1]))
            except Exception:
                n = n
        instance_counters[t] = max(instance_counters.get(t, 0), n)

    return {
        "raw_object_dict": raw_object_dict,
        "object_types": object_types,
        "object_instances": object_instances,
        "legacy_objects": computed_legacy,
        "instance_counters": instance_counters,
    }
