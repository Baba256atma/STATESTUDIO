# backend/main.py
import os
import json
import time
from datetime import datetime, timezone
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator
import logging
from pathlib import Path

from ai.enrichment import generate_ai_reply
from chaos_engine.core import ChaosEngine
from chaos_engine.scene_adapter import build_scene_actions
from fastapi.middleware.cors import CORSMiddleware
from memory.engine import ObjectMemoryEngine
from memory.store import JsonMemoryStore
from archetypes.engine import ArchetypeEngine
from archetypes.library import get_archetype_library
from archetypes.schemas import ArchetypeState
from archetypes.visual_mapper import map_archetype_to_visual_state
from app.routers.human_catalog_router import router as human_catalog_router
from app.routers.analysis_router import router as analysis_router
from app.routers.replay_router import router as replay_router
from app.routers.ai_chat_router import router as ai_chat_router
from app.routers.events_router import router as events_router
from app.routers.debug_router import router as debug_router
from app.routers.config_router import router as config_router
from app.routers.scenario_router import router as scenario_router
from app.routers.montecarlo_router import router as montecarlo_router
from app.routers.memory_router import router as memory_router
from app.routers.simulator_router import router as simulator_router
from app.routers.timeline_router import router as timeline_router
from app.routers.replay_view_router import router as replay_view_router
from app.routers.collaboration_router import router as collaboration_router
from app.routers.product_router import router as product_router
from app.routes.decision_routes import router as decision_routes_router
from app.services.event_store_mem import EventStoreMem
from app.services.chat_ai import llm_chat_actions
from app.services import build_loops_from_kpi
from app.services.loop_engine import evaluate_loops
from app.services.hybrid_rulebook import load_object_dictionary, infer_objects_from_text, pick_allowed_objects
from app.services.object_selection_v2 import select_objects_v2
from app.services.game_theory_v0 import game_advice_v0
from app.services.decision_memory_v0 import record_decision_event_v0, build_memory_context_v0
from app.services.conflict_map_v0 import build_conflict_map_v0
from app.services.object_selection_v25 import build_object_selection_v25
from app.services.decision_memory_v2 import build_memory_v2
from app.services.risk_propagation_v0 import build_risk_propagation_v0
from app.services.strategic_advice_v0 import build_strategic_advice_v0
from app.services.opponent_model_v0 import build_opponent_model_v0
from app.services.strategic_pattern_memory_v0 import build_strategic_patterns_v0
from app.services.chat_contract_alignment import (
    build_backend_engine_roles,
    build_replay_system_state,
    package_chat_response,
)
from app.services.product_store_v0 import ensure_default_workspace_v0
from app.models.system_archetypes import SystemArchetypeState
from app.semantics.nexora_semantics import infer_allowed_objects_from_text
from app.engines.fragility_v1 import compute_fragility_v1
from core.scene_templates import map_state_to_scene_objects, map_loops_from_state
from app.services.replay_store import ReplayStore
from app.models.replay import ReplayFrame, ReplayMeta

_OBJECT_DICT: dict[str, dict] = {}
_OBJECT_TYPES: dict[str, dict] = {}
_OBJECT_INSTANCES: dict[str, dict] = {}
_LEGACY_OBJECTS: dict[str, dict] = {}
_INSTANCE_COUNTERS: dict[str, int] = {}
_OBJECT_DICT_PATH = Path(__file__).resolve().parent / "data" / "object_dictionary_v1.json"
_INSTANCE_DICT_PATH = Path(__file__).resolve().parent / "data" / "object_instances_v1.json"
#
#
# MVP note: per-user KPI state is kept in memory (resets on server restart).
# This prevents different users from affecting each other's KPI/loop visuals.
_KPI_STATE_BY_USER: dict[str, dict[str, float]] = {}
_EPISODE_BY_USER: dict[str, str] = {}
_KPI_DEFAULT = {"inventory": 0.5, "delivery": 0.5, "risk": 0.5}
TICK_TEXT = "__tick__"


def _sync_intensity(scene_json: dict, intensity: float, volatility: float | None = None) -> dict:
    """Keep intensity in sync to avoid UI mismatch."""
    try:
        if not isinstance(scene_json, dict):
            return scene_json
        vol_value = float(volatility) if volatility is not None else None

        # top-level state_vector
        sv = scene_json.get("state_vector")
        if not isinstance(sv, dict):
            sv = {}
            scene_json["state_vector"] = sv
        sv["intensity"] = float(intensity)
        if vol_value is not None:
            sv["volatility"] = vol_value

        # nested scene structures
        scene = scene_json.get("scene")
        if not isinstance(scene, dict):
            scene = {}
            scene_json["scene"] = scene

        inner_sv = scene.get("state_vector")
        if not isinstance(inner_sv, dict):
            inner_sv = {}
            scene["state_vector"] = inner_sv
        inner_sv["intensity"] = float(intensity)
        if vol_value is not None:
            inner_sv["volatility"] = vol_value

        inner = scene.get("scene")
        if not isinstance(inner, dict):
            inner = {}
            scene["scene"] = inner
        inner["intensity"] = float(intensity)
        if vol_value is not None:
            inner["volatility"] = vol_value
        return scene_json
    except Exception:
        return scene_json


def _sync_scene_state(scene_json: dict | None) -> dict | None:
    """Ensure nested scene state mirrors top-level state_vector."""
    if not isinstance(scene_json, dict):
        return scene_json
    sv = scene_json.get("state_vector")
    sc = scene_json.get("scene")
    if not isinstance(sv, dict) or not isinstance(sc, dict):
        return scene_json
    sc_scene = sc.get("scene")
    if not isinstance(sc_scene, dict):
        sc_scene = {}
        sc["scene"] = sc_scene
    sc_sv = sc.get("state_vector")
    if not isinstance(sc_sv, dict):
        sc_sv = {}
        sc["state_vector"] = sc_sv
    if "intensity" in sv:
        sc_scene["intensity"] = sv["intensity"]
        sc_sv["intensity"] = sv["intensity"]
    if "volatility" in sv:
        sc_scene["volatility"] = sv["volatility"]
        sc_sv["volatility"] = sv["volatility"]
    return scene_json



def _clamp01(x: float) -> float:
    try:
        v = float(x)
    except Exception:
        return 0.0
    if v < 0.0:
        return 0.0
    if v > 1.0:
        return 1.0
    return v


def _coerce_pos3(raw) -> list[float] | None:
    if isinstance(raw, list) and len(raw) >= 3:
        try:
            return [float(raw[0]), float(raw[1]), float(raw[2])]
        except Exception:
            return None
    if isinstance(raw, dict):
        try:
            x = float(raw.get("x"))
            y = float(raw.get("y"))
            z = float(raw.get("z"))
            return [x, y, z]
        except Exception:
            return None
    return None


def _semantic_zone_for_object(o: dict) -> str:
    oid = str(o.get("id") or "").lower()
    typ = str(o.get("type") or "").lower()
    lbl = str(o.get("label") or o.get("name") or "").lower()
    tags = o.get("tags")
    tag_text = " ".join(str(t).lower() for t in tags) if isinstance(tags, list) else ""
    txt = f"{oid} {typ} {lbl} {tag_text}"
    if any(k in txt for k in ["supplier", "source", "upstream", "procure"]):
        return "supplier"
    if any(k in txt for k in ["delivery", "transport", "ship", "flow"]):
        return "delivery"
    if any(k in txt for k in ["inventory", "warehouse", "stock", "buffer", "core"]):
        return "inventory"
    if any(k in txt for k in ["order", "customer", "demand"]):
        return "demand"
    if any(k in txt for k in ["risk", "delay", "issue", "price", "cash"]):
        return "risk"
    return "unknown"


def _grid_fallback_position(index: int, *, row_size: int = 4, spacing: float = 3.0) -> list[float]:
    i = max(0, int(index))
    col = i % row_size
    row = i // row_size
    x = (col - ((row_size - 1) / 2.0)) * spacing
    z = ((1.0 - row) * spacing) * 0.7
    return [float(x), 0.0, float(z)]


def _resolve_object_position(o: dict, fallback_index: int = 0) -> list[float]:
    # 1) explicit position (array or {x,y,z})
    pos = _coerce_pos3(o.get("position"))
    if pos is not None:
        return pos
    # 2) explicit transform.pos
    tr = o.get("transform")
    if isinstance(tr, dict):
        tr_pos = _coerce_pos3(tr.get("pos"))
        if tr_pos is not None:
            return tr_pos
    # 3) semantic zones
    zone = _semantic_zone_for_object(o)
    zone_base: dict[str, list[float]] = {
        "supplier": [-6.0, 0.0, 0.0],
        "delivery": [-3.0, 0.0, 0.0],
        "inventory": [0.0, 0.0, 0.0],
        "demand": [3.0, 0.0, 0.0],
        "risk": [0.0, 0.0, -3.0],
    }
    if zone in zone_base:
        base = zone_base[zone]
        offset_x = ((fallback_index % 3) - 1) * 0.9
        offset_z = ((fallback_index // 3) % 2) * 0.8
        return [base[0] + offset_x, base[1], base[2] + offset_z]
    # 4) deterministic grid
    return _grid_fallback_position(fallback_index)


# Ensure objects have stable default positions for line/loop rendering.
def _ensure_default_positions(objs: list[dict]) -> list[dict]:
    """Ensure objects have stable default positions for line/loop rendering.

    - Keeps any existing `position`.
    - Applies a deterministic layout for known business objects.
    - Falls back to a simple horizontal layout for any other objects.
    """
    if not isinstance(objs, list):
        return objs

    for idx, o in enumerate(objs):
        if not isinstance(o, dict):
            continue
        oid = o.get("id")
        if not isinstance(oid, str) or not oid:
            continue
        resolved = _resolve_object_position(o, idx)
        o["position"] = resolved
        tr = o.get("transform")
        if isinstance(tr, dict):
            if _coerce_pos3(tr.get("pos")) is None:
                tr["pos"] = list(resolved)
        else:
            o["transform"] = {"pos": list(resolved)}

    return objs


def _kpi_step(user_id: str, text: str, allowed_objects: list[str], mode: str) -> dict:
    """Lightweight KPI updater (per-user)."""
    txt = (text or "").lower()

    # Per-user KPI state (MVP: in-memory).
    uid = user_id or "dev-anon"
    state = _KPI_STATE_BY_USER.get(uid)
    if not isinstance(state, dict):
        state = dict(_KPI_DEFAULT)
        _KPI_STATE_BY_USER[uid] = state

    inv = float(state.get("inventory", 0.5) or 0.5)
    delv = float(state.get("delivery", 0.5) or 0.5)
    risk = float(state.get("risk", 0.5) or 0.5)

    def dec(val, amt=0.05):
        return _clamp01(val - amt)

    def inc(val, amt=0.05):
        return _clamp01(val + amt)

    allow_set = set([a for a in allowed_objects if isinstance(a, str)])
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

    # Persist per-user state
    state["inventory"] = inv
    state["delivery"] = delv
    state["risk"] = risk

    focus_ids = [a for a in allowed_objects if isinstance(a, str)]
    focus_set = set(focus_ids)

    loops = build_loops_from_kpi(
        {"inventory": inv, "delivery": delv, "risk": risk},
        focus_set if focus_set else None,
    )

    return {
        "kpi": {"inventory": inv, "delivery": delv, "risk": risk},
        "loops": loops,
        "signals": [],
    }


def _build_base_scene_json(
    mode: str,
    scene_actions: dict | None,
    intensity: float,
    volatility: float | None = None,
) -> dict:
    scene_json = {
        "meta": {
            "version": os.getenv("APP_VERSION", "dev"),
            "generated_at": datetime.now(timezone.utc).isoformat(),
        },
        "domain_model": {"mode": mode},
        "state_vector": {
            "intensity": float(intensity),
            "volatility": float(volatility if volatility is not None else intensity),
        },
        "scene": scene_actions or {},
    }
    scene_json = _sync_intensity(scene_json, intensity, volatility)
    return _sync_scene_state(scene_json) or scene_json


def _scene_state_summary(
    scene_json: dict | None,
    fallback_intensity: float,
    fallback_volatility: float,
) -> str:
    try:
        sv = scene_json.get("state_vector", {}) if isinstance(scene_json, dict) else {}
        intensity = float(sv.get("intensity", fallback_intensity))
        volatility = float(sv.get("volatility", fallback_volatility))
        return f"intensity={intensity:.2f}, volatility={volatility:.2f}"
    except Exception:
        return f"intensity={float(fallback_intensity):.2f}, volatility={float(fallback_volatility):.2f}"


def _bump_scene_intensity(scene: dict, delta: float) -> float:
    try:
        sv = scene.get("state_vector") if isinstance(scene, dict) else None
        if not isinstance(sv, dict):
            sv = {}
            if isinstance(scene, dict):
                scene["state_vector"] = sv
        cur = float(sv.get("intensity", 0.34) or 0.34)
        nxt = max(0.0, min(1.0, cur + float(delta)))
        sv["intensity"] = nxt
        return nxt
    except Exception:
        return 0.34


def _apply_intensity_to_objects(
    scene: dict,
    intensity: float,
    allow_ids: list[str] | None = None,
) -> list[dict]:
    out: list[dict] = []
    objects_local = None
    try:
        sc = scene.get("scene") if isinstance(scene, dict) else None
        if isinstance(sc, dict):
            objects_local = sc.get("objects")
        if not isinstance(objects_local, list):
            objects_local = scene.get("objects") if isinstance(scene, dict) else None
    except Exception:
        objects_local = None

    if not isinstance(objects_local, list):
        return out

    scale = 1.0 + (max(0.0, min(1.0, float(intensity))) * 0.8)
    allowed = set(allow_ids) if isinstance(allow_ids, list) and allow_ids else None

    for obj in objects_local:
        if not isinstance(obj, dict):
            continue
        oid = obj.get("id")
        if not isinstance(oid, str) or not oid:
            continue
        if allowed is not None and oid not in allowed:
            continue
        out.append(
            {
                "type": "applyObject",
                "object": oid,
                "value": {
                    "id": oid,
                    "scale": scale,
                    "color": obj.get("color") or "#3498db",
                    "emphasis": float(obj.get("emphasis", 0.0) or 0.0),
                },
            }
        )
    return out


def _build_chat_context(
    *,
    intent: str,
    allowed_objects: list[str] | None,
    focused_object_id: str | None,
    mode: str,
    object_info: dict | None,
    inference: dict | None,
    kpi: dict | None = None,
    loops: list | None = None,
    fragility: dict | None = None,
    conflicts: list | None = None,
    risk_propagation: dict | None = None,
    loops_suggestions: list | None = None,
    active_loop: dict | None = None,
) -> dict:
    return {
        "intent": intent,
        "allowed_objects": allowed_objects,
        "focused_object_id": focused_object_id,
        "mode": mode,
        "object_info": object_info,
        "inference": inference,
        "kpi": kpi,
        "loops": loops,
        "fragility": fragility,
        "conflicts": conflicts,
        "risk_propagation": risk_propagation,
        "loops_suggestions": loops_suggestions,
        "active_loop": active_loop,
    }


def _attach_response_extension(
    response_body: dict,
    key: str,
    value,
    *,
    scene_json: dict | None = None,
    include_in_context: bool = True,
    include_in_scene_json: bool = True,
    include_in_scene_section: bool = False,
) -> None:
    response_body[key] = value
    if include_in_context and isinstance(response_body.get("context"), dict):
        response_body["context"][key] = value
    if include_in_scene_json and isinstance(scene_json, dict):
        scene_json[key] = value
    if include_in_scene_section and isinstance(scene_json, dict) and isinstance(scene_json.get("scene"), dict):
        scene_json["scene"][key] = value


def _load_object_dict() -> dict[str, dict]:
    try:
        if not _OBJECT_DICT_PATH.exists():
            return {"legacy": {}, "types": {}, "instances": {}}
        with _OBJECT_DICT_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
        extra_instances: dict[str, dict] = {}
        if _INSTANCE_DICT_PATH.exists():
            try:
                with _INSTANCE_DICT_PATH.open("r", encoding="utf-8") as f2:
                    inst_data = json.load(f2)
                if isinstance(inst_data, dict) and isinstance(inst_data.get("instances"), list):
                    for inst in inst_data["instances"]:
                        if isinstance(inst, dict) and inst.get("id"):
                            extra_instances[str(inst.get("id"))] = inst
            except Exception:
                logging.exception("failed_loading_extra_instances")
        legacy = {}
        types = {}
        instances = {}
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
                # legacy objects list fallback
                for obj in data["objects"]:
                    if isinstance(obj, dict) and obj.get("id"):
                        legacy[str(obj.get("id"))] = obj
        elif isinstance(data, list):
            for obj in data:
                if isinstance(obj, dict) and obj.get("id"):
                    legacy[str(obj.get("id"))] = obj
        # merge extra instances
        instances.update(extra_instances)
        return {"legacy": legacy, "types": types, "instances": instances}
    except Exception:
        logging.exception("failed_loading_object_dict")
    return {"legacy": {}, "types": {}, "instances": {}}


def _validate_object_dict(obj_map: dict[str, dict]) -> None:
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


def _get_obj_entry(obj_id: str) -> dict | None:
    if not obj_id:
        return None
    return _OBJECT_INSTANCES.get(obj_id) or _OBJECT_TYPES.get(obj_id) or _LEGACY_OBJECTS.get(obj_id) or _OBJECT_DICT.get(obj_id)


def _get_type_for_instance(inst: dict | None) -> dict | None:
    if not inst or not isinstance(inst, dict):
        return None
    t_id = inst.get("type")
    if not t_id:
        return None
    return _OBJECT_TYPES.get(str(t_id))


def _get_any_entry(obj_id: str) -> tuple[dict | None, dict | None]:
    """Return (instance_or_entry, type_entry_or_none)."""
    inst = _OBJECT_INSTANCES.get(obj_id)
    if inst:
        return inst, _get_type_for_instance(inst)
    t = _OBJECT_TYPES.get(obj_id)
    if t:
        return t, None
    legacy = _LEGACY_OBJECTS.get(obj_id) or _OBJECT_DICT.get(obj_id)
    return legacy, None


def _next_instance_id(type_id: str) -> str:
    cur = _INSTANCE_COUNTERS.get(type_id, 1) + 1
    _INSTANCE_COUNTERS[type_id] = cur
    label_part = type_id.replace("type_", "") if type_id.startswith("type_") else type_id
    return f"obj_{label_part}__{cur}"


def get_object_profile(obj_id: str, mode: str | None = None) -> dict | None:
    """Build a merged profile from instance/type/legacy."""
    if not obj_id:
        return None
    inst, tentry = _get_any_entry(obj_id)
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


def _build_object_info(obj_id: str) -> dict | None:
    entry, type_entry = _get_any_entry(obj_id)
    if not isinstance(entry, dict):
        return None
    label = entry.get("label") or entry.get("display_name") or entry.get("name") or obj_id
    type_label = type_entry.get("label") if isinstance(type_entry, dict) else None
    one_liner = entry.get("one_liner") or (type_entry.get("one_liner") if isinstance(type_entry, dict) else "") or ""
    summary = entry.get("summary") or entry.get("hint") or entry.get("description") or (
        type_entry.get("summary") if isinstance(type_entry, dict) else ""
    )
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


def _text_tokens(s: str) -> set[str]:
    if not s or not isinstance(s, str):
        return set()
    out = []
    cur = []
    for ch in s.lower():
        if ch.isalnum() or ch in {"_", "-"}:
            cur.append(ch)
        else:
            if cur:
                out.append("".join(cur))
                cur = []
    if cur:
        out.append("".join(cur))
    return set(out)


def _infer_allowed_objects_from_text(text: str, mode: str | None = None, allowed_only: list[str] | None = None) -> list[str]:
    if not text:
        return []
    tokens = _text_tokens(text)
    if not tokens:
        return []
    allow_set = set(allowed_only) if allowed_only else None

    def score_entry(oid: str, entry: dict) -> float:
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
                mode_tokens = set(_text_tokens(" ".join(str(x) for x in domain_hints[mode] if isinstance(x, str))))
        for f in fields:
            score += len(tokens.intersection(_text_tokens(f)))
        if mode_tokens:
            score += len(tokens.intersection(mode_tokens)) * 2
        return score

    scored_instances: list[tuple[str, float]] = []
    for oid, entry in _OBJECT_INSTANCES.items():
        if allow_set is not None and oid not in allow_set:
            continue
        s = score_entry(oid, entry)
        if s > 0:
            scored_instances.append((oid, s))

    scored_types: list[tuple[str, float]] = []
    for oid, entry in _OBJECT_TYPES.items():
        if allow_set is not None and oid not in allow_set:
            continue
        s = score_entry(oid, entry)
        if s > 0:
            scored_types.append((oid, s))

    scored_legacy: list[tuple[str, float]] = []
    for oid, entry in _LEGACY_OBJECTS.items():
        if allow_set is not None and oid not in allow_set:
            continue
        s = score_entry(oid, entry)
        if s > 0:
            scored_legacy.append((oid, s))

    if scored_instances:
        scored_instances.sort(key=lambda x: x[1], reverse=True)
        return [oid for oid, _ in scored_instances[:3]]
    if scored_types:
        scored_types.sort(key=lambda x: x[1], reverse=True)
        return [oid for oid, _ in scored_types[:3]]
    scored_legacy.sort(key=lambda x: x[1], reverse=True)
    return [oid for oid, _ in scored_legacy[:3]]

app = FastAPI(title="StateStudio API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(human_catalog_router)
app.include_router(analysis_router)
app.include_router(replay_router)
app.include_router(ai_chat_router)
app.include_router(events_router)
app.include_router(debug_router)
app.include_router(decision_routes_router)
app.include_router(config_router)
app.include_router(scenario_router)
app.include_router(montecarlo_router)
app.include_router(memory_router)
app.include_router(simulator_router)
app.include_router(timeline_router)
app.include_router(replay_view_router)
app.include_router(collaboration_router)
app.include_router(product_router)

@app.get("/objects")
def list_objects():
    items = []
    source_map = _OBJECT_INSTANCES if _OBJECT_INSTANCES else _LEGACY_OBJECTS
    for oid in source_map.keys():
        profile = get_object_profile(oid, None) or {}
        items.append(profile)
    return {"ok": True, "objects": items}


@app.get("/objects/{obj_id}")
def get_object(obj_id: str):
    profile = get_object_profile(obj_id, None)
    if not profile:
        raise HTTPException(status_code=404, detail={"ok": False, "error": {"message": "Unknown object"}})
    return {
        "ok": True,
        "object": profile,
    }

@app.on_event("startup")
def init_chaos_engine():
    app.state.chaos_engine = ChaosEngine()
    app.state.memory_engine = ObjectMemoryEngine(JsonMemoryStore())
    app.state.archetype_engine = ArchetypeEngine()
    app.state.event_store = EventStoreMem()
    app.state.backend_engine_roles = build_backend_engine_roles()
    global _OBJECT_DICT, _OBJECT_TYPES, _OBJECT_INSTANCES, _LEGACY_OBJECTS
    loaded = _load_object_dict()
    _OBJECT_DICT = loaded.get("legacy", {})
    _OBJECT_TYPES = loaded.get("types", {})
    _OBJECT_INSTANCES = loaded.get("instances", {})
    # compute legacy-compatible objects from merged profiles of instances
    computed_legacy: dict[str, dict] = {}
    for inst_id in _OBJECT_INSTANCES.keys():
        prof = get_object_profile(inst_id, None)
        if prof:
            computed_legacy[inst_id] = prof
    if not computed_legacy and _OBJECT_DICT:
        computed_legacy = _OBJECT_DICT.copy()
    _LEGACY_OBJECTS = computed_legacy
    _validate_object_dict({**_LEGACY_OBJECTS, **_OBJECT_TYPES, **_OBJECT_INSTANCES})
    # seed instance counters per type
    _INSTANCE_COUNTERS.clear()
    for inst in _OBJECT_INSTANCES.values():
        if not isinstance(inst, dict):
            continue
        t = inst.get("type")
        if not t:
            continue
        # extract suffix number if present
        inst_id = inst.get("id", "")
        n = 1
        if isinstance(inst_id, str) and "__" in inst_id:
            try:
                n = max(n, int(inst_id.rsplit("__", 1)[-1]))
            except Exception:
                n = n
        _INSTANCE_COUNTERS[t] = max(_INSTANCE_COUNTERS.get(t, 0), n)
    try:
        ensure_default_workspace_v0()
    except Exception:
        # Keep startup resilient in demo/launch mode even if product store is unavailable.
        pass


class ChatIn(BaseModel):
    # Accept both "text" and "message" from clients; normalize to .text
    text: str | None = None
    message: str | None = None
    history: list[str] | None = None
    mode: str | None = None
    user_id: str | None = None
    allowed_objects: list[str] | None = None

    @model_validator(mode="after")
    def _normalize_text(self):
        if not self.text and self.message:
            self.text = self.message
        if not self.text or not str(self.text).strip():
            raise ValueError("Missing chat text. Provide 'text' (preferred) or 'message'.")
        self.text = str(self.text).strip()
        return self


class ArchetypeAnalyzeIn(BaseModel):
    signals: list[str]
    metrics: dict[str, float]
    history: list[ArchetypeState] | None = None


@app.get("/health")
def health():
    return {
        "ok": True,
        "version": os.getenv("APP_VERSION", "dev"),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/chat")
def chat(payload: ChatIn, request: Request):
    text = (payload.text or payload.message or "").strip()
    # --- Nexora MVP: infer canonical focus from user wording ---
    inferred_allowed: list[str] = []
    try:
        inferred_allowed = infer_allowed_objects_from_text(text)
    except Exception:
        inferred_allowed = []

    # Apply only if frontend did NOT force focus
    if not payload.allowed_objects and inferred_allowed:
        payload.allowed_objects = inferred_allowed

    if not text:
        return (
            JSONResponse(
                status_code=400,
                content={
                    "ok": False,
                    "user_id": None,
                    "reply": "",
                    "actions": [],
                    "scene_json": None,
                    "source": None,
                    "error": {"type": "INVALID_INPUT", "message": "text is required"},
                    "debug": None,
                },
            )
        )

    mode = payload.mode if payload.mode in {"business", "spirit"} else "business"
    engine: ChaosEngine = request.app.state.chaos_engine
    mem_engine: ObjectMemoryEngine = request.app.state.memory_engine

    user_id = (
        payload.user_id
        or request.headers.get("x-user-id")
        or request.headers.get("x-session-id")
        or (request.client.host if request.client else "dev-anon")
    )
    client_allowed = payload.allowed_objects if isinstance(payload.allowed_objects, list) else None

    allowed_objects: list[str] = []
    focused_object_id: str | None = None
    inference_info = None

    greetings = ("hi", "hello", "hey", "salam", "سلام", "درود")
    text_lower = text.lower()
    if any(text_lower.startswith(g) for g in greetings):
        reply = "Hi 👋 How are you feeling today?"
        actions = [
            {"type": "pulse", "object": "obj_55", "intensity": 0.25, "duration_ms": 800},
            {"type": "glow", "object": "obj_66", "intensity": 0.18, "duration_ms": 800},
        ]
        return {
            "ok": True,
            "user_id": user_id,
            "reply": reply,
            "actions": actions,
            "scene_json": None,
            "source": "ai",
            "analysis_summary": None,
            "context": {"active_object_id": None},
            "error": None,
            "debug": {"path": "greeting"} if os.getenv("ENV") == "dev" else None,
        }

    actions: list[dict] = []
    debug = {"path": "legacy"} if os.getenv("ENV") == "dev" else None
    scene_json = None
    source = None
    analysis_summary = None
    intent = "general"
    is_create_instance = any(
        phrase in text_lower
        for phrase in [
            "add another inventory",
            "create inventory",
            "add inventory instance",
            "add another delivery",
            "create delivery",
            "create risk instance",
            "add risk instance",
            "create risk",
            "add risk",
        ]
    )
    is_tick = text_lower.strip() == TICK_TEXT
    if is_create_instance:
        intent = "create_instance"
    ask_phrases = (
        text_lower.startswith("tell me about"),
        text_lower.startswith("about"),
        text_lower.startswith("/about"),
        text_lower.startswith("describe"),
        "about the selected object" in text_lower,
        "what is this object" in text_lower,
        "ask about" in text_lower,
        text_lower.strip() == "describe selected",
    )
    if any(ask_phrases):
        intent = "ask_object_info"
    elif any(k in text_lower for k in ["increase intensity", "decrease intensity", "raise intensity", "lower intensity"]):
        intent = "adjust_intensity"

    # Hybrid rulebook: UI focus wins; otherwise infer softly from dictionary.
    try:
        obj_dict = load_object_dictionary()
        inferred = infer_objects_from_text(text, mode, obj_dict) if intent != "ask_object_info" else []
        allowed_objects, focused_object_id, focus_source = pick_allowed_objects(client_allowed, inferred)
        allowed_objects = allowed_objects or []
        if inferred:
            inference_info = {"method": "dictionary", "source": focus_source, "matched": inferred}
        if focused_object_id is None and allowed_objects:
            focused_object_id = allowed_objects[0]
    except Exception:
        allowed_objects = client_allowed or []
        if allowed_objects and focused_object_id is None:
            focused_object_id = allowed_objects[0]

    try:
        chaos = engine.analyze(text, payload.history, candidate_objects=allowed_objects if allowed_objects else None)
        scene_actions = build_scene_actions(chaos, mode=mode)

        # Always keep the technical/system summary separate from the user-facing reply.
        analysis_summary = (getattr(chaos, "explanation", None) or "").strip() or None

        text_l = (text or "").strip().lower()
        is_intensity_up = any(k in text_l for k in ["increase intensity", "more intensity", "boost intensity", "raise intensity"])
        is_intensity_down = any(k in text_l for k in ["decrease intensity", "less intensity", "reduce intensity", "lower intensity"])
        effective_intensity = float(getattr(chaos, "intensity", 0.34) or 0.34)

        objects = scene_actions.get("objects") if isinstance(scene_actions, dict) else None
        loop_suggestions: list[dict] = []
        active_loop: dict | None = None
        loop_effects_applied = False
        if is_tick:
            target_id = None
            if allowed_objects:
                target_id = allowed_objects[0]
            elif _OBJECT_INSTANCES:
                target_id = list(_OBJECT_INSTANCES.keys())[0]
            elif _LEGACY_OBJECTS:
                target_id = list(_LEGACY_OBJECTS.keys())[0]
            # slight deterministic drift
            effective_intensity = min(1.0, max(0.0, effective_intensity + 0.02))
            scene_json = _build_base_scene_json(
                mode,
                scene_actions,
                effective_intensity,
                getattr(chaos, "volatility", chaos.intensity),
            )
            if target_id:
                actions = [
                    {
                        "type": "applyObject",
                        "object": target_id,
                        "value": {
                            "id": target_id,
                            "scale": 1.0 + effective_intensity * 0.2,
                            "color": "#8ec5ff",
                            "emphasis": effective_intensity * 0.2,
                        },
                    }
                ]
            reply = ""
            analysis_summary = _scene_state_summary(
                scene_json,
                effective_intensity,
                getattr(chaos, "volatility", chaos.intensity),
            )
            return {
                "ok": True,
                "user_id": user_id,
                "reply": reply,
                "actions": actions,
                "scene_json": scene_json,
                "source": "simulation",
                "analysis_summary": analysis_summary,
                "context": _build_chat_context(
                    intent="tick",
                    allowed_objects=allowed_objects,
                    focused_object_id=target_id,
                    mode=mode,
                    object_info=get_object_profile(target_id, mode) if target_id else None,
                    inference=inference_info,
                ),
                "error": None,
                "debug": debug,
            }

        # Fast path: create new instance intent
        if intent == "create_instance":
            # map keywords to type
            target_type = None
            if "inventory" in text_lower:
                target_type = "type_inventory"
            elif "delivery" in text_lower:
                target_type = "type_delivery"
            elif "risk" in text_lower:
                target_type = "type_risk"

            if allowed_objects and target_type:
                # only allow if focus contains same type/instance
                allowed_profiles = [get_object_profile(a, mode) for a in allowed_objects]
                if not any((p and (p.get("type") == target_type or p.get("id") == target_type)) for p in allowed_profiles):
                    return {
                        "ok": True,
                        "user_id": user_id,
                        "reply": "You're focused on another object. Clear focus or select this type first.",
                        "actions": [],
                        "scene_json": scene_json,
                        "source": "dictionary",
                        "analysis_summary": None,
                        "context": {
                            "intent": intent,
                            "allowed_objects": allowed_objects,
                            "focused_object_id": None,
                            "mode": mode,
                            "object_info": None,
                            "inference": inference_info,
                        },
                        "error": None,
                        "debug": debug,
                    }

            if target_type and target_type in _OBJECT_TYPES:
                new_id = _next_instance_id(target_type)
                type_entry = _OBJECT_TYPES.get(target_type, {})
                label = f"{type_entry.get('label', target_type)} { _INSTANCE_COUNTERS.get(target_type, 1)}"
                base_color = (type_entry.get("ux") or {}).get("base_color") if isinstance(type_entry.get("ux"), dict) else "#3498db"
                _OBJECT_INSTANCES[new_id] = {
                  "id": new_id,
                  "type": target_type,
                  "label": label,
                  "overrides": {"color": base_color},
                }
                profile = get_object_profile(new_id, mode) or {"id": new_id, "label": label, "ux": {"shape": "cube", "base_color": base_color}}
                # update scene_actions with new object
                if not isinstance(scene_actions, dict):
                    scene_actions = {}
                objs = scene_actions.get("objects")
                if not isinstance(objs, list):
                    objs = []
                objs.append(
                    {
                        "id": new_id,
                        "label": label,
                        "type": target_type,
                        "color": profile.get("final_color"),
                        "ux": profile.get("ux"),
                        "scale": 1.0,
                        "emphasis": 0.0,
                        "position": [len(objs) * 1.6, 0, 0],
                    }
                )
                scene_actions["objects"] = objs
                actions = [
                    {
                        "type": "applyObject",
                        "object": new_id,
                        "value": {"id": new_id, "scale": 1.0, "color": profile.get("final_color"), "emphasis": 0.0},
                    }
                ]
                reply = f"Created {label}."
                scene_json = _build_base_scene_json(
                    mode,
                    scene_actions,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                analysis_summary = _scene_state_summary(
                    scene_json,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                return {
                    "ok": True,
                    "user_id": user_id,
                    "reply": reply,
                    "actions": actions,
                    "scene_json": scene_json,
                    "source": "dictionary",
                    "analysis_summary": analysis_summary,
                    "context": _build_chat_context(
                        intent=intent,
                        allowed_objects=allowed_objects if allowed_objects else [new_id],
                        focused_object_id=new_id,
                        mode=mode,
                        object_info=profile,
                        inference=inference_info,
                    ),
                    "error": None,
                    "debug": debug,
                }

        # Fast path: dictionary info when user asks about an object.
        if intent == "ask_object_info":
            if len(allowed_objects) == 1:
                profile = get_object_profile(allowed_objects[0], mode)
                fallback_label = allowed_objects[0]
                label = (profile or {}).get("label") or fallback_label
                one_liner = (profile or {}).get("one_liner") or ""
                summary = (profile or {}).get("summary") or ""
                desc = summary.strip() if summary and summary.strip() else (one_liner.strip() if one_liner and one_liner.strip() else f"Object {label} — (No description yet.)")
                tags = (profile or {}).get("tags")
                tag_text = ""
                if isinstance(tags, list) and tags:
                    tag_text = "Tags: " + ", ".join(str(t) for t in tags if isinstance(t, str))
                reply_parts = [f"{label} — {desc}" if desc else label]
                if tag_text:
                    reply_parts.append(tag_text)
                reply = "\n".join([p for p in reply_parts if p])
                scene_json = _build_base_scene_json(
                    mode,
                    scene_actions,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                analysis_summary = _scene_state_summary(
                    scene_json,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                return {
                    "ok": True,
                    "user_id": user_id,
                    "reply": reply,
                    "actions": [],
                    "scene_json": scene_json,
                    "source": "dictionary",
                    "analysis_summary": analysis_summary,
                    "context": _build_chat_context(
                        intent=intent,
                        allowed_objects=allowed_objects,
                        focused_object_id=focused_object_id or (allowed_objects[0] if allowed_objects else None),
                        mode=mode,
                        object_info=profile
                        or {
                            "id": allowed_objects[0],
                            "label": label,
                            "one_liner": one_liner,
                            "summary": desc,
                            "tags": tags if isinstance(tags, list) else [],
                            "synonyms": (profile or {}).get("synonyms") if isinstance((profile or {}).get("synonyms"), list) else [],
                            "domain_hints": (profile or {}).get("domain_hints") if isinstance((profile or {}).get("domain_hints"), dict) else {},
                        },
                        inference=inference_info,
                    ),
                    "error": None,
                    "debug": debug,
                }
            else:
                return {
                    "ok": True,
                    "user_id": user_id,
                    "reply": "Please click one object first.",
                    "actions": [],
                    "scene_json": None,
                    "source": "dictionary",
                    "analysis_summary": None,
                    "context": {
                        "intent": intent,
                        "allowed_objects": allowed_objects,
                        "focused_object_id": None,
                        "mode": mode,
                        "object_info": None,
                        "inference": inference_info,
                    },
                    "error": None,
                    "debug": debug,
                }

        # Fast-path command handling (no LLM required): make intensity commands immediately visible.
        if isinstance(scene_actions, dict) and intent == "adjust_intensity":
            if not allowed_objects:
                return {
                    "ok": True,
                    "user_id": user_id,
                    "reply": "I can adjust intensity, but I need a target. Click an object or describe the topic (e.g., inventory, delivery, risk).",
                    "actions": [],
                    "scene_json": None,
                    "source": "rule",
                    "analysis_summary": None,
                    "error": None,
                    "debug": debug,
                    "context": {
                        "intent": intent,
                        "allowed_objects": allowed_objects,
                        "focused_object_id": None,
                        "mode": mode,
                        "object_info": None,
                        "inference": inference_info,
                    },
                }
            target_id = allowed_objects[0]
            focused_object_id = target_id
            delta = 0.15 if is_intensity_up else -0.15
            new_intensity = _bump_scene_intensity(scene_actions, delta)
            effective_intensity = new_intensity

            # Also reflect intensity in the nested scene metadata if present
            try:
                sc = scene_actions.get("scene")
                if isinstance(sc, dict):
                    inner = sc.get("scene")
                    if isinstance(inner, dict):
                        inner["intensity"] = new_intensity
            except Exception:
                pass

            actions = _apply_intensity_to_objects(scene_actions, new_intensity, [target_id])

            # Human reply for this intent (keep system summary separate)
            reply = f"Done — I {'increased' if is_intensity_up else 'decreased'} intensity slightly. Now intensity={new_intensity:.2f}."
            source = "rule"
            if debug is not None:
                debug["path"] = "rule"

        if source != "rule":
            try:
                llm_resp = llm_chat_actions(text, allowed_objects, mode)
                reply = (llm_resp.reply or "").strip()
                actions = [dict(a) for a in llm_resp.actions]
                source = "ai"
                if debug is not None:
                    debug["path"] = "ai"
            except Exception:
                reply = ""
                source = "fallback"

        # Final reply guardrails:
        # - Never show the raw system summary as the main chat reply.
        # - If AI did not produce a reply, produce a short, human-friendly response.
        summary_prefixes = ("current system pattern summary:", "system pattern summary:")
        if (not reply) or any(reply.lower().startswith(p) for p in summary_prefixes):
            # Keep the technical text in analysis_summary; give the user a human reply.
            if mode == "business":
                reply = "Got it. Want to focus on risk, delivery delay, or inventory?"
            else:
                reply = "Got it. What would you like to focus on next?"

            # Convert scene_actions objects to applyObject actions for frontend when LLM did not provide
            if not actions and allowed_objects:
                if isinstance(objects, list):
                    for obj in objects:
                        if not isinstance(obj, dict):
                            continue
                        obj_id = obj.get("id")
                        if not obj_id or obj_id not in allowed_objects:
                            continue
                        actions.append({"type": "applyObject", "object": obj_id, "value": obj})

        try:
            affected_ids = [obj.get("id") for obj in objects or [] if isinstance(obj, dict) and obj.get("id")]
            updated_actions, mem_state = mem_engine.process(
                user_id=user_id,
                affected_ids=affected_ids,
                base_intensity=chaos.intensity,
                scene_actions=scene_actions,
                )
            scene_actions = updated_actions
        except Exception:
            pass

        # If we handled an intensity command, ensure the final scene_actions reflects it and
        # that we return visible applyObject actions even if later processing changed the structure.
        if source == "rule" and isinstance(scene_actions, dict):
            try:
                sc = scene_actions.get("scene")
                if isinstance(sc, dict):
                    inner = sc.get("scene")
                    if isinstance(inner, dict):
                        inner["intensity"] = effective_intensity
            except Exception:
                pass
            if not actions:
                actions = _apply_intensity_to_objects(scene_actions, effective_intensity, allowed_objects if allowed_objects else None)

        context_object_info = None
        if isinstance(allowed_objects, list) and len(allowed_objects) == 1:
            context_object_info = get_object_profile(allowed_objects[0], mode)
            if context_object_info is None:
                context_object_info = {
                    "id": allowed_objects[0],
                    "label": allowed_objects[0],
                    "summary": "(No description yet.)",
                    "tags": [],
                    "ux": {"shape": "cube", "base_color": "#3498db"},
                }

        scene_json = _build_base_scene_json(
            mode,
            scene_actions,
            effective_intensity,
            getattr(chaos, "volatility", chaos.intensity),
        )

        # Ensure baseline business objects are always present for visualization (loops/lines) even when focus is narrow.
        try:
            scene_section = scene_json.get("scene")
            if not isinstance(scene_section, dict):
                scene_section = {}
                scene_json["scene"] = scene_section
            objs = scene_section.get("objects")
            if not isinstance(objs, list):
                objs = []
                scene_section["objects"] = objs
            if mode == "business":
                base_objs = [
                    {"id": "obj_inventory", "label": "Inventory"},
                    {"id": "obj_delivery", "label": "Delivery"},
                    {"id": "obj_risk_zone", "label": "Risk"},
                ]
                existing_ids = {o.get("id") for o in objs if isinstance(o, dict)}
                for base in base_objs:
                    if base["id"] not in existing_ids:
                        objs.append(base)
                        existing_ids.add(base["id"])
            # Ensure every object has a position so Three.js can render loop/edge lines.
            _ensure_default_positions(objs)
        except Exception:
            pass

        loops: list[dict] = []
        loop_suggestions: list[str] = []
        active_loop = None
        try:
            kpi_payload = _kpi_step(user_id, text, allowed_objects, mode)
            scene_section = scene_json.get("scene")
            if not isinstance(scene_section, dict):
                scene_section = {}
                scene_json["scene"] = scene_section
            scene_section["kpi"] = kpi_payload.get("kpi")
            loops_out = evaluate_loops(kpi_payload.get("kpi", {}), allowed_objects if allowed_objects else None, top_k=3)
            if isinstance(loops_out, dict):
                loops = loops_out.get("loops") or []
                loop_suggestions = loops_out.get("loops_suggestions") or []
                active_loop = loops_out.get("active_loop")
            scene_section["loops"] = loops
            scene_section["active_loop"] = active_loop
            scene_section["loops_suggestions"] = loop_suggestions
            # --- Fragility Engine v1 (Product A) ---
            try:
                fragility = compute_fragility_v1(
                    kpi=scene_section.get("kpi") if isinstance(scene_section.get("kpi"), dict) else None,
                    loops=loops if isinstance(loops, list) else None,
                    chaos=chaos if "chaos" in locals() else None,
                    allowed_objects=allowed_objects if isinstance(allowed_objects, list) else None,
                )
                # Attach to scene for frontend/HUD consumption (safe additive field)
                scene_section["fragility"] = fragility
            except Exception:
                fragility = None
            # --- Nexora MVP mapping layer (Template → 3D-ready objects/loops) ---
            # We keep this non-breaking for the current frontend by attaching the
            # mapped output under `scene.nexora_mvp`.
            #
            # Derived state signals from the lightweight KPI triad:
            # - inventory_pressure: higher when inventory KPI is low
            # - time_pressure: higher when delivery KPI is low
            # - quality_risk: mirrors risk KPI
            try:
                inv = _clamp01(kpi_payload.get("kpi", {}).get("inventory", 0.5))
                delv = _clamp01(kpi_payload.get("kpi", {}).get("delivery", 0.5))
                rsk = _clamp01(kpi_payload.get("kpi", {}).get("risk", 0.5))

                # Persist derived signals into state_vector (safe additive fields)
                sv = scene_json.get("state_vector") if isinstance(scene_json, dict) else None
                if not isinstance(sv, dict):
                    sv = {}
                    if isinstance(scene_json, dict):
                        scene_json["state_vector"] = sv
                sv["inventory_pressure"] = _clamp01(1.0 - inv)
                sv["time_pressure"] = _clamp01(1.0 - delv)
                sv["quality_risk"] = rsk

                # Minimal domain model for mapping functions
                dm = scene_json.get("domain_model") if isinstance(scene_json, dict) else None
                if not isinstance(dm, dict):
                    dm = {"mode": mode}
                    if isinstance(scene_json, dict):
                        scene_json["domain_model"] = dm
                if "business" not in dm or not isinstance(dm.get("business"), dict):
                    dm["business"] = {}
                dm_biz = dm.get("business") if isinstance(dm.get("business"), dict) else {}
                dm_biz.setdefault("inventory", {"status": "normal"})
                dm_biz.setdefault("quality", {"defect_rate": 0.0})
                dm_biz.setdefault("time", {"schedule_status": "on_track"})
                dm["business"] = dm_biz

                # Run mapping (non-breaking: attach output under scene_section)
                tmp_scene = {
                    "domain_model": dm,
                    "state_vector": sv,
                    "scene": {},
                }
                tmp_scene = map_state_to_scene_objects(tmp_scene)
                tmp_scene = map_loops_from_state(tmp_scene)

                scene_section["nexora_mvp"] = {
                    "objects": (tmp_scene.get("scene") or {}).get("objects", []),
                    "loops": (tmp_scene.get("scene") or {}).get("loops", []),
                }
            except Exception:
                # Mapping must never break /chat in MVP.
                pass
            # optional applyObject from KPI severity if focus/allowlist exists
            if allowed_objects:
                kpi_apply: list[dict] = []
                inv = _clamp01(kpi_payload.get("kpi", {}).get("inventory", 0.5))
                delv = _clamp01(kpi_payload.get("kpi", {}).get("delivery", 0.5))
                risk = _clamp01(kpi_payload.get("kpi", {}).get("risk", 0.5))
                for oid in allowed_objects:
                    if "inventory" in oid:
                        kpi_apply.append({"type": "applyObject", "object": oid, "value": {"id": oid, "emphasis": (1 - inv) * 0.6}})
                    elif "delivery" in oid:
                        kpi_apply.append({"type": "applyObject", "object": oid, "value": {"id": oid, "emphasis": (1 - delv) * 0.6, "color": "#e74c3c"}})
                    elif "risk" in oid:
                        kpi_apply.append({"type": "applyObject", "object": oid, "value": {"id": oid, "emphasis": risk * 0.7, "color": "#f39c12"}})
                if kpi_apply:
                    actions.extend(kpi_apply)
            # Ensure loop endpoints exist in objects for frontend rendering
            try:
                objs_list = scene_section.get("objects")
                if not isinstance(objs_list, list):
                    objs_list = []
                    scene_section["objects"] = objs_list
                existing_ids = {o.get("id") for o in objs_list if isinstance(o, dict)}
                endpoints: set[str] = set()
                for lp in loops:
                    if not isinstance(lp, dict):
                        continue
                    edges_lp = lp.get("edges")
                    if not isinstance(edges_lp, list):
                        continue
                    for e in edges_lp:
                        if not isinstance(e, dict):
                            continue
                        f = e.get("from")
                        t = e.get("to")
                        if isinstance(f, str):
                            endpoints.add(f)
                        if isinstance(t, str):
                            endpoints.add(t)
                for eid in endpoints:
                    if eid in existing_ids:
                        continue
                    label = eid
                    if eid == "obj_inventory":
                        label = "Inventory"
                    elif eid == "obj_delivery":
                        label = "Delivery"
                    elif eid == "obj_risk_zone":
                        label = "Risk"
                    objs_list.append({"id": eid, "label": label})
                    existing_ids.add(eid)
                _ensure_default_positions(objs_list)
            except Exception:
                pass
        except Exception:
            pass
        scene_json = _sync_intensity(scene_json, effective_intensity, getattr(chaos, "volatility", chaos.intensity))
        scene_json = _sync_scene_state(scene_json)
        analysis_summary = _scene_state_summary(
            scene_json,
            effective_intensity,
            getattr(chaos, "volatility", chaos.intensity),
        )
        if debug is not None:
            debug["actions_count"] = len(actions)
            debug["source"] = source
    except Exception as exc:
        logging.exception("chat_failed", exc_info=exc)
        return (
            JSONResponse(
                status_code=500,
                content={
                    "ok": False,
                    "user_id": user_id,
                    "reply": "",
                    "actions": [],
                    "scene_json": None,
                    "source": None,
                    "error": {"type": "INTERNAL_ERROR", "message": "Chat failed"},
                    "debug": None,
                },
            )
        )

    try:
        store: EventStoreMem | None = getattr(request.app.state, "event_store", None)
        if store is not None:
            store.append(user_id, text, reply, actions)
    except Exception as exc:  # pragma: no cover
        logging.warning("event_log_failed", exc_info=exc)

    # --- Decision Snapshot (Replay) ---
    try:
        replay_store = ReplayStore()
        ep_id = _EPISODE_BY_USER.get(user_id)
        if not ep_id:
            ep = replay_store.create_episode(title=f"chat:{user_id}")
            ep_id = ep.episode_id
            _EPISODE_BY_USER[user_id] = ep_id

        # Compact system_state for Product A (Fragility Scanner)
        sys_state = build_replay_system_state(
            mode=mode,
            intent=intent,
            allowed_objects=allowed_objects,
            focused_object_id=focused_object_id,
            scene_json=scene_json if isinstance(scene_json, dict) else {},
            source=source,
            chaos=chaos,
            fragility=fragility if isinstance(fragility, dict) else {},
            loops=loops if 'loops' in locals() else (scene_json.get("scene") or {}).get("loops") if isinstance(scene_json, dict) else None,
            risk_propagation=None,
        )

        signals = getattr(chaos, "signal_scores", None)
        if not isinstance(signals, dict):
            signals = {}

        frame = ReplayFrame(
            t=time.time(),
            input_text=text,
            human_state={},
            system_signals=signals,
            system_state=sys_state,
            visual={
                "scene_json": scene_json,
                "actions": actions,
                "analysis_summary": analysis_summary,
                "fragility": fragility,
            },
            meta=ReplayMeta(note=None, tags=["chat"]),
        )
        replay_store.append_frame(ep_id, frame)
    except Exception:
        # Replay must never break /chat in MVP
        pass

    # Final sync to keep intensity/volatility consistent across scene_json structures
    scene_json = _sync_intensity(scene_json, effective_intensity, getattr(chaos, "volatility", chaos.intensity))
    scene_json = _sync_scene_state(scene_json)
    analysis_summary = _scene_state_summary(
        scene_json,
        effective_intensity,
        getattr(chaos, "volatility", chaos.intensity),
    )

    # --- Fragility highlights (Product A) ---
    try:
        if isinstance(fragility, dict) and fragility.get("level") == "high":
            highlight_actions: list[dict] = []
            # Prefer to highlight allowed objects only (will also be enforced by allowlist filter later)
            for oid in (allowed_objects or [])[:3]:
                if not isinstance(oid, str) or not oid:
                    continue
                highlight_actions.append(
                    {
                        "type": "applyObject",
                        "object": oid,
                        "value": {"id": oid, "emphasis": 0.85},
                    }
                )
            # If risk zone is part of the allowlist, emphasize it strongly
            if isinstance(allowed_objects, list) and "obj_risk_zone" in allowed_objects:
                highlight_actions.append(
                    {
                        "type": "applyObject",
                        "object": "obj_risk_zone",
                        "value": {"id": "obj_risk_zone", "emphasis": 0.95, "color": "#f39c12"},
                    }
                )
            if highlight_actions:
                actions.extend(highlight_actions)
    except Exception:
        pass

    # Enforce allowlist: never leak actions to non-allowed objects
    allow_set = set(allowed_objects) if allowed_objects else None
    if allow_set is not None:
        filtered_actions: list[dict] = []
        for act in actions:
            if not isinstance(act, dict):
                continue
            o = act.get("object") or act.get("target")
            if isinstance(o, str):
                if o in allow_set:
                    filtered_actions.append(act)
                continue
            if act.get("type") == "applyLoop":
                loop_val = act.get("loop") or act.get("value")
                edges = loop_val.get("edges") if isinstance(loop_val, dict) else None
                if isinstance(edges, list):
                    kept = []
                    for e in edges:
                        if not isinstance(e, dict):
                            continue
                        fr = e.get("from")
                        to = e.get("to")
                        if fr in allow_set and to in allow_set:
                            kept.append(e)
                    if kept:
                        new_loop = dict(loop_val)
                        new_loop["edges"] = kept
                        filtered_actions.append({"type": act.get("type"), "loop": new_loop})
                continue
            # Unknown action without an object: drop when allowlist is set
        actions = filtered_actions

    context_allowed_objects = allowed_objects
    context_focused_object_id = focused_object_id
    context_inference = inference_info
    try:
        fragility_drivers = fragility.get("drivers") if isinstance(fragility, dict) else {}
        selection = select_objects_v2(
            text=text,
            mode=mode or "business",
            k=15,
            recent_object_ids=allowed_objects if isinstance(allowed_objects, list) else [],
            fragility_drivers=fragility_drivers if isinstance(fragility_drivers, dict) else {},
            preferred_focus_id=focused_object_id,
        )
        if selection.allowed_objects:
            context_allowed_objects = selection.allowed_objects
        if selection.focused_object_id:
            context_focused_object_id = selection.focused_object_id

        scores_top = [
            {"id": oid, "score": float(score)}
            for oid, score in sorted(selection.scores.items(), key=lambda kv: kv[1], reverse=True)[:5]
        ]
        context_inference = {
            "method": selection.method,
            "source": selection.source,
            "matched": selection.matched,
            "scores_top": scores_top,
            "why": selection.why,
        }
    except Exception:
        # Selection is best-effort and must never break chat.
        context_allowed_objects = allowed_objects
        context_focused_object_id = focused_object_id
        context_inference = inference_info

    conflicts = []
    try:
        scene_kpi = (
            scene_json.get("scene", {}).get("kpi")
            if isinstance(scene_json, dict) and isinstance(scene_json.get("scene"), dict)
            else {}
        )
        conflicts = build_conflict_map_v0(scene_kpi if isinstance(scene_kpi, dict) else {}, fragility if isinstance(fragility, dict) else {})
        if (
            isinstance(scene_json, dict)
            and isinstance(scene_json.get("scene"), dict)
        ):
            scene_json["scene"]["conflicts"] = conflicts
    except Exception:
        conflicts = []

    risk_propagation = {}
    try:
        risk_propagation = build_risk_propagation_v0(
            scene_json if isinstance(scene_json, dict) else {},
            fragility if isinstance(fragility, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
        )
        if isinstance(scene_json, dict):
            scene_json["risk_propagation"] = risk_propagation
            if isinstance(scene_json.get("scene"), dict):
                scene_json["scene"]["risk_propagation"] = risk_propagation
    except Exception:
        risk_propagation = {}

    response_body = {
        "ok": True,
        "user_id": user_id,
        "reply": reply,
        "actions": actions,
        "scene_json": scene_json,
        "conflicts": conflicts,
        "risk_propagation": risk_propagation,
        "source": source,
        "analysis_summary": analysis_summary,
        "fragility": fragility,
        "context": _build_chat_context(
            intent=intent,
            allowed_objects=context_allowed_objects,
            focused_object_id=context_focused_object_id,
            mode=mode,
            object_info=context_object_info,
            inference=context_inference,
            kpi=scene_json.get("scene", {}).get("kpi") if isinstance(scene_json, dict) else None,
            loops=loops if 'loops' in locals() else scene_json.get("scene", {}).get("loops") if isinstance(scene_json, dict) else None,
            fragility=fragility,
            conflicts=conflicts,
            risk_propagation=risk_propagation,
            loops_suggestions=loop_suggestions,
            active_loop=active_loop,
        ),
        "error": None,
        "debug": debug,
    }
    response_body = package_chat_response(
        base_response=response_body,
        scene_json=scene_json if isinstance(scene_json, dict) else {},
        chaos=chaos,
        mode=mode,
        allowed_objects=context_allowed_objects if isinstance(context_allowed_objects, list) else [],
        focused_object_id=context_focused_object_id,
        fragility=fragility if isinstance(fragility, dict) else {},
        risk_propagation=risk_propagation if isinstance(risk_propagation, dict) else {},
        loops=loops if 'loops' in locals() else scene_json.get("scene", {}).get("loops") if isinstance(scene_json, dict) else [],
        conflicts=conflicts if isinstance(conflicts, list) else [],
        active_loop=active_loop,
        analysis_summary=analysis_summary,
        engine_roles=getattr(request.app.state, "backend_engine_roles", None),
    )
    try:
        response_body["workspace"] = ensure_default_workspace_v0()
    except Exception:
        pass
    game_keywords = ("competitor", "pricing", "game", "strategy", "market", "rival")
    should_include_game = (mode == "strategy") or any(k in text_lower for k in game_keywords)
    if should_include_game:
        try:
            context_kpi = (
                response_body.get("context", {}).get("kpi")
                if isinstance(response_body.get("context"), dict)
                else None
            )
            context_fragility = (
                response_body.get("context", {}).get("fragility")
                if isinstance(response_body.get("context"), dict)
                else None
            )
            context_allowed = (
                response_body.get("context", {}).get("allowed_objects")
                if isinstance(response_body.get("context"), dict)
                else []
            )
            response_body["game"] = game_advice_v0(
                kpi=context_kpi if isinstance(context_kpi, dict) else {},
                fragility=context_fragility if isinstance(context_fragility, dict) else {},
                allowed_objects=context_allowed if isinstance(context_allowed, list) else [],
            )
        except Exception:
            # Game layer is optional and must never break /chat.
            pass

    memory_ctx = {}
    memory_v2 = {}
    try:
        ctx = response_body.get("context") if isinstance(response_body.get("context"), dict) else {}
        episode_id = _EPISODE_BY_USER.get(user_id, "")
        record_decision_event_v0(
            user_id=user_id,
            episode_id=episode_id or "",
            text=text,
            mode=str(ctx.get("mode") or mode or "business"),
            focused_object_id=ctx.get("focused_object_id") if isinstance(ctx.get("focused_object_id"), str) else None,
            allowed_objects=ctx.get("allowed_objects") if isinstance(ctx.get("allowed_objects"), list) else [],
            fragility=ctx.get("fragility") if isinstance(ctx.get("fragility"), dict) else (response_body.get("fragility") if isinstance(response_body.get("fragility"), dict) else {}),
            kpi=ctx.get("kpi") if isinstance(ctx.get("kpi"), dict) else {},
            actions=response_body.get("actions") if isinstance(response_body.get("actions"), list) else [],
        )
        memory_ctx = build_memory_context_v0(
            user_id,
            kpi=ctx.get("kpi") if isinstance(ctx.get("kpi"), dict) else {},
            fragility=ctx.get("fragility") if isinstance(ctx.get("fragility"), dict) else {},
            focused_object_id=ctx.get("focused_object_id") if isinstance(ctx.get("focused_object_id"), str) else None,
        )
        if isinstance(ctx, dict):
            ctx["memory"] = memory_ctx
            response_body["context"] = ctx
    except Exception:
        # Decision memory is optional and must never break /chat.
        pass

    try:
        memory_v2 = build_memory_v2(
            memory_ctx if isinstance(memory_ctx, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            {},
        )
        _attach_response_extension(response_body, "memory_v2", memory_v2, scene_json=scene_json)
    except Exception:
        # Memory v2 is optional and must never break /chat.
        pass

    object_selection = {}
    try:
        object_selection = build_object_selection_v25(
            scene_json if isinstance(scene_json, dict) else {},
            fragility if isinstance(fragility, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            memory_ctx if isinstance(memory_ctx, dict) else {},
            memory_v2 if isinstance(memory_v2, dict) else {},
        )
        _attach_response_extension(response_body, "object_selection", object_selection, scene_json=scene_json)

        # Rebuild memory_v2 with object selection context for richer reasoning.
        memory_v2 = build_memory_v2(
            memory_ctx if isinstance(memory_ctx, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            object_selection if isinstance(object_selection, dict) else {},
        )
        _attach_response_extension(response_body, "memory_v2", memory_v2, scene_json=scene_json)
    except Exception:
        # Object selection v2.5 is optional and must never break /chat.
        pass

    try:
        strategic_patterns = build_strategic_patterns_v0(
            memory_ctx if isinstance(memory_ctx, dict) else {},
            memory_v2 if isinstance(memory_v2, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            risk_propagation if isinstance(risk_propagation, dict) else {},
            object_selection if isinstance(object_selection, dict) else {},
        )
        _attach_response_extension(
            response_body,
            "strategic_patterns",
            strategic_patterns,
            scene_json=scene_json,
            include_in_scene_section=True,
        )
    except Exception:
        # Strategic pattern memory is optional and must never break /chat.
        pass

    strategic_advice = {}
    try:
        strategic_advice = build_strategic_advice_v0(
            scene_json if isinstance(scene_json, dict) else {},
            fragility if isinstance(fragility, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            risk_propagation if isinstance(risk_propagation, dict) else {},
            object_selection if isinstance(object_selection, dict) else {},
            memory_v2 if isinstance(memory_v2, dict) else {},
        )
        _attach_response_extension(
            response_body,
            "strategic_advice",
            strategic_advice,
            scene_json=scene_json,
            include_in_scene_section=True,
        )
    except Exception:
        # Strategic advice is optional and must never break /chat.
        pass

    try:
        opponent_model = build_opponent_model_v0(
            scene_json if isinstance(scene_json, dict) else {},
            fragility if isinstance(fragility, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            risk_propagation if isinstance(risk_propagation, dict) else {},
            object_selection if isinstance(object_selection, dict) else {},
            memory_v2 if isinstance(memory_v2, dict) else {},
            strategic_advice if isinstance(strategic_advice, dict) else {},
        )
        _attach_response_extension(
            response_body,
            "opponent_model",
            opponent_model,
            scene_json=scene_json,
            include_in_scene_section=True,
        )
    except Exception:
        # Opponent model is optional and must never break /chat.
        pass
    return response_body


@app.post("/system/analyze")
def analyze_system(payload: ArchetypeAnalyzeIn, request: Request):
    engine: ArchetypeEngine = request.app.state.archetype_engine
    try:
        state = engine.detect(
            signals=payload.signals,
            metrics=payload.metrics,
            history=payload.history,
        )
        visual = map_archetype_to_visual_state(state, get_archetype_library())
        return {"archetypes": state.detected, "visual": visual}
    except Exception as exc:
        logging.exception("archetype analysis failed: %s", exc)
        return {"archetypes": [], "visual": {"nodes": [], "loops": [], "levers": []}}


@app.get("/debug/system-state-schema")
def debug_system_state_schema():
    """Expose SystemArchetypeState fields and an example dump in dev only."""
    if os.getenv("ENV") != "dev":
        raise HTTPException(status_code=404, detail="Not found")
    fields = list(SystemArchetypeState.model_fields.keys())
    example = SystemArchetypeState(
        timestamp=datetime.now(timezone.utc),
        results=[],
        pressure=0.0,
        instability=0.0,
    )
    return {
        "fields": fields,
        "example": example.model_dump(),
    }


@app.get("/debug/business-loops")
def debug_business_loops():
    """Return current KPI state and loop evaluation (dev only)."""
    if os.getenv("ENV") != "dev":
        raise HTTPException(status_code=404, detail="Not found")
    # In dev, show the default state and any currently tracked users.
    loops = build_loops_from_kpi(_KPI_DEFAULT, None)
    return {"ok": True, "default_kpi": _KPI_DEFAULT, "users": list(_KPI_STATE_BY_USER.keys()), "loops": loops}
