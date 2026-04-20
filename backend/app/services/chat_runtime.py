from __future__ import annotations

import logging
import os
import time
from dataclasses import dataclass
from typing import Any, Callable

from fastapi import Request
from fastapi.responses import JSONResponse

from app.models.replay import ReplayFrame, ReplayMeta
from app.services.chat_contract_alignment import build_replay_system_state
from app.services.decision_analysis_chat_attachment import try_build_decision_analysis_payload
from app.services.event_store_mem import EventStoreMem
from app.services.replay_store import ReplayStore
from app.utils.responses import build_error_envelope


logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ChatPipelineDependencies:
    object_types: dict[str, dict]
    object_instances: dict[str, dict]
    legacy_objects: dict[str, dict]
    instance_counters: dict[str, int]
    episode_by_user: dict[str, str]
    tick_text: str
    check_ai_input_safety: Callable[[str], dict[str, Any]]
    semantic_infer_allowed_objects_from_text: Callable[[str], list[str]]
    load_object_dictionary: Callable[[], dict[str, dict]]
    infer_objects_from_text: Callable[[str, str, dict[str, dict]], list[str]]
    pick_allowed_objects: Callable[[list[str] | None, list[str]], tuple[list[str], str | None, str]]
    build_scene_actions: Callable[..., dict[str, Any]]
    llm_chat_actions: Callable[[str, list[str], str], Any]
    get_object_profile: Callable[[str, str | None], dict[str, Any] | None]
    next_instance_id: Callable[[str], str]
    build_base_scene_json: Callable[[str, dict[str, Any], float, float], dict[str, Any]]
    scene_state_summary: Callable[[dict[str, Any], float, float], str | None]
    bump_scene_intensity: Callable[[dict[str, Any], float], float]
    apply_intensity_to_objects: Callable[[dict[str, Any], float, list[str] | None], list[dict[str, Any]]]
    ensure_default_positions: Callable[[list[dict[str, Any]]], None]
    sync_intensity: Callable[[dict[str, Any], float, float], dict[str, Any]]
    sync_scene_state: Callable[[dict[str, Any]], dict[str, Any]]
    kpi_step: Callable[[str, str, list[str], str], dict[str, Any]]
    clamp01: Callable[[float], float]
    evaluate_loops: Callable[..., dict[str, Any]]
    compute_fragility: Callable[..., dict[str, Any] | None]
    map_state_to_scene_objects: Callable[[dict[str, Any]], dict[str, Any]]
    map_loops_from_state: Callable[[dict[str, Any]], dict[str, Any]]
    package_chat_response: Callable[..., dict[str, Any]]
    ensure_default_workspace: Callable[[], dict[str, Any]]
    game_advice: Callable[..., dict[str, Any]]
    record_decision_event: Callable[..., Any]
    build_memory_context: Callable[..., dict[str, Any]]
    build_memory_v2: Callable[..., dict[str, Any]]
    build_object_selection: Callable[..., dict[str, Any]]
    build_strategic_patterns: Callable[..., dict[str, Any]]
    build_strategic_advice: Callable[..., dict[str, Any]]
    run_strategic_council_service: Callable[[dict[str, Any]], Any]
    build_opponent_model: Callable[..., dict[str, Any]]
    select_objects_v2: Callable[..., Any]
    build_conflict_map_v0: Callable[[dict[str, Any], dict[str, Any]], list[dict[str, Any]]]
    build_risk_propagation_v0: Callable[..., dict[str, Any]]


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
    value: Any,
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


def _normalize_chat_response_shape(response_body: dict[str, Any]) -> dict[str, Any]:
    normalized = dict(response_body)
    actions = normalized.get("actions")
    normalized["actions"] = actions if isinstance(actions, list) else []
    scene_json = normalized.get("scene_json")
    normalized["scene_json"] = scene_json if isinstance(scene_json, dict) else None
    context = normalized.get("context")
    normalized["context"] = context if isinstance(context, dict) else {}
    error = normalized.get("error")
    normalized["error"] = error if isinstance(error, dict) or error is None else None
    source = normalized.get("source")
    normalized["source"] = source if isinstance(source, str) and source.strip() else None
    reply = normalized.get("reply")
    normalized["reply"] = reply if isinstance(reply, str) else ""
    normalized["advice_slice"] = normalized.get("advice_slice") if isinstance(normalized.get("advice_slice"), dict) else None
    normalized["timeline_slice"] = (
        normalized.get("timeline_slice") if isinstance(normalized.get("timeline_slice"), dict) else None
    )
    normalized["war_room_slice"] = (
        normalized.get("war_room_slice") if isinstance(normalized.get("war_room_slice"), dict) else None
    )
    normalized["scene_payload"] = (
        normalized.get("scene_payload") if isinstance(normalized.get("scene_payload"), dict) else None
    )
    normalized["scene_overlay"] = (
        normalized.get("scene_overlay") if isinstance(normalized.get("scene_overlay"), dict) else None
    )
    normalized["object_impacts"] = (
        normalized.get("object_impacts") if isinstance(normalized.get("object_impacts"), dict) else None
    )
    drivers = normalized.get("drivers")
    normalized["drivers"] = drivers if isinstance(drivers, list) else []
    signals = normalized.get("signals")
    normalized["signals"] = signals if isinstance(signals, list) else []
    if normalized["scene_json"] is not None and not isinstance(normalized["scene_json"].get("scene"), dict):
        normalized["scene_json"]["scene"] = {}
    return normalized


def _build_chat_error_payload(
    *,
    error_type: str,
    message: str,
    user_id: str | None = None,
    details: Any = None,
) -> dict[str, Any]:
    envelope = build_error_envelope(
        error_type,
        message,
        code=error_type,
        details=details,
    )
    return _normalize_chat_response_shape(
        {
            "ok": False,
            "user_id": user_id,
            "reply": "",
            "actions": [],
            "scene_json": None,
            "source": None,
            "analysis_summary": None,
            "context": {},
            "error": envelope["error"],
            "debug": None,
            "advice_slice": None,
            "timeline_slice": None,
            "war_room_slice": None,
            "scene_payload": None,
            "scene_overlay": None,
            "object_impacts": None,
            "drivers": [],
            "signals": [],
        }
    )


def execute_chat_pipeline(payload: Any, request: Request, deps: ChatPipelineDependencies) -> dict[str, Any] | JSONResponse:
    text = (payload.text or payload.message or "").strip()
    user_id = (
        payload.user_id
        or request.headers.get("x-user-id")
        or request.headers.get("x-session-id")
        or (request.client.host if request.client else "dev-anon")
    )
    if not text:
        return JSONResponse(status_code=400, content=_build_chat_error_payload(error_type="INVALID_INPUT", message="text is required"))

    safety_result = deps.check_ai_input_safety(text)
    if not safety_result.get("ok", True):
        logger.warning("chat_input_blocked user_id=%s", user_id)
        return JSONResponse(
            status_code=422,
            content=_build_chat_error_payload(
                error_type="INPUT_BLOCKED",
                message="This input was blocked by the AI safety guard.",
                user_id=user_id,
                details=safety_result.get("reason"),
            ),
        )

    inferred_allowed: list[str] = []
    try:
        inferred_allowed = deps.semantic_infer_allowed_objects_from_text(text)
    except Exception:
        inferred_allowed = []

    if not payload.allowed_objects and inferred_allowed:
        payload.allowed_objects = inferred_allowed

    mode = payload.mode if payload.mode in {"business", "spirit"} else "business"
    engine = request.app.state.chaos_engine
    mem_engine = request.app.state.memory_engine

    client_allowed = payload.allowed_objects if isinstance(payload.allowed_objects, list) else None

    allowed_objects: list[str] = []
    focused_object_id: str | None = None
    inference_info = None

    greetings = ("hi", "hello", "hey", "salam", "سلام", "درود")
    text_lower = text.lower()
    if any(text_lower.startswith(g) for g in greetings):
        reply = "Hi 👋 How are you feeling today?"
        return _normalize_chat_response_shape({
            "ok": True,
            "user_id": user_id,
            "reply": reply,
            "actions": [],
            "scene_json": None,
            "source": "ai",
            "analysis_summary": None,
            "context": {"active_object_id": None},
            "error": None,
            "debug": {"path": "greeting"} if os.getenv("ENV") == "dev" else None,
        })

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
    is_tick = text_lower.strip() == deps.tick_text
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

    try:
        obj_dict = deps.load_object_dictionary()
        inferred = deps.infer_objects_from_text(text, mode, obj_dict) if intent != "ask_object_info" else []
        allowed_objects, focused_object_id, focus_source = deps.pick_allowed_objects(client_allowed, inferred)
        allowed_objects = allowed_objects or []
        if inferred:
            inference_info = {"method": "dictionary", "source": focus_source, "matched": inferred}
        if focused_object_id is None and allowed_objects:
            focused_object_id = allowed_objects[0]
    except Exception:
        allowed_objects = client_allowed or []
        if allowed_objects and focused_object_id is None:
            focused_object_id = allowed_objects[0]

    fragility: dict[str, Any] | None = None
    loops: list[dict[str, Any]] = []
    loop_suggestions: list[Any] = []
    active_loop: dict[str, Any] | None = None
    chaos = None

    try:
        chaos = engine.analyze(text, payload.history, candidate_objects=allowed_objects if allowed_objects else None)
        scene_actions = deps.build_scene_actions(chaos, mode=mode)

        analysis_summary = (getattr(chaos, "explanation", None) or "").strip() or None

        text_l = (text or "").strip().lower()
        is_intensity_up = any(k in text_l for k in ["increase intensity", "more intensity", "boost intensity", "raise intensity"])
        is_intensity_down = any(k in text_l for k in ["decrease intensity", "less intensity", "reduce intensity", "lower intensity"])
        effective_intensity = float(getattr(chaos, "intensity", 0.34) or 0.34)

        objects = scene_actions.get("objects") if isinstance(scene_actions, dict) else None
        if is_tick:
            target_id = None
            if allowed_objects:
                target_id = allowed_objects[0]
            elif deps.object_instances:
                target_id = list(deps.object_instances.keys())[0]
            elif deps.legacy_objects:
                target_id = list(deps.legacy_objects.keys())[0]
            effective_intensity = min(1.0, max(0.0, effective_intensity + 0.02))
            scene_json = deps.build_base_scene_json(
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
            analysis_summary = deps.scene_state_summary(
                scene_json,
                effective_intensity,
                getattr(chaos, "volatility", chaos.intensity),
            )
            return _normalize_chat_response_shape({
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
                    object_info=deps.get_object_profile(target_id, mode) if target_id else None,
                    inference=inference_info,
                ),
                "error": None,
                "debug": debug,
            })

        if intent == "create_instance":
            target_type = None
            if "inventory" in text_lower:
                target_type = "type_inventory"
            elif "delivery" in text_lower:
                target_type = "type_delivery"
            elif "risk" in text_lower:
                target_type = "type_risk"

            if allowed_objects and target_type:
                allowed_profiles = [deps.get_object_profile(a, mode) for a in allowed_objects]
                if not any((p and (p.get("type") == target_type or p.get("id") == target_type)) for p in allowed_profiles):
                    return _normalize_chat_response_shape({
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
                    })

            if target_type and target_type in deps.object_types:
                new_id = deps.next_instance_id(target_type)
                type_entry = deps.object_types.get(target_type, {})
                label = f"{type_entry.get('label', target_type)} {deps.instance_counters.get(target_type, 1)}"
                base_color = (type_entry.get("ux") or {}).get("base_color") if isinstance(type_entry.get("ux"), dict) else "#3498db"
                deps.object_instances[new_id] = {
                    "id": new_id,
                    "type": target_type,
                    "label": label,
                    "overrides": {"color": base_color},
                }
                profile = deps.get_object_profile(new_id, mode) or {"id": new_id, "label": label, "ux": {"shape": "cube", "base_color": base_color}}
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
                scene_json = deps.build_base_scene_json(
                    mode,
                    scene_actions,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                analysis_summary = deps.scene_state_summary(
                    scene_json,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                return _normalize_chat_response_shape({
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
                })

        if intent == "ask_object_info":
            if len(allowed_objects) == 1:
                profile = deps.get_object_profile(allowed_objects[0], mode)
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
                scene_json = deps.build_base_scene_json(
                    mode,
                    scene_actions,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                analysis_summary = deps.scene_state_summary(
                    scene_json,
                    effective_intensity,
                    getattr(chaos, "volatility", chaos.intensity),
                )
                return _normalize_chat_response_shape({
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
                })
            return _normalize_chat_response_shape({
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
            })

        if isinstance(scene_actions, dict) and intent == "adjust_intensity":
            if not allowed_objects:
                return _normalize_chat_response_shape({
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
                })
            target_id = allowed_objects[0]
            focused_object_id = target_id
            delta = 0.15 if is_intensity_up else -0.15
            new_intensity = deps.bump_scene_intensity(scene_actions, delta)
            effective_intensity = new_intensity
            try:
                sc = scene_actions.get("scene")
                if isinstance(sc, dict):
                    inner = sc.get("scene")
                    if isinstance(inner, dict):
                        inner["intensity"] = new_intensity
            except Exception:
                pass

            actions = deps.apply_intensity_to_objects(scene_actions, new_intensity, [target_id])
            reply = f"Done — I {'increased' if is_intensity_up else 'decreased'} intensity slightly. Now intensity={new_intensity:.2f}."
            source = "rule"
            if debug is not None:
                debug["path"] = "rule"

        if source != "rule":
            try:
                llm_resp = deps.llm_chat_actions(text, allowed_objects, mode)
                reply = (llm_resp.reply or "").strip()
                actions = [dict(a) for a in llm_resp.actions]
                source = "ai"
                if debug is not None:
                    debug["path"] = "ai"
            except Exception:
                reply = ""
                source = "fallback"

        summary_prefixes = ("current system pattern summary:", "system pattern summary:")
        if (not reply) or any(reply.lower().startswith(p) for p in summary_prefixes):
            if mode == "business":
                reply = "Got it. Want to focus on risk, delivery delay, or inventory?"
            else:
                reply = "Got it. What would you like to focus on next?"

            if not actions and allowed_objects and isinstance(objects, list):
                for obj in objects:
                    if not isinstance(obj, dict):
                        continue
                    obj_id = obj.get("id")
                    if not obj_id or obj_id not in allowed_objects:
                        continue
                    actions.append({"type": "applyObject", "object": obj_id, "value": obj})

        try:
            affected_ids = [obj.get("id") for obj in objects or [] if isinstance(obj, dict) and obj.get("id")]
            updated_actions, _mem_state = mem_engine.process(
                user_id=user_id,
                affected_ids=affected_ids,
                base_intensity=chaos.intensity,
                scene_actions=scene_actions,
            )
            scene_actions = updated_actions
        except Exception:
            pass

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
                actions = deps.apply_intensity_to_objects(scene_actions, effective_intensity, allowed_objects if allowed_objects else None)

        context_object_info = None
        if isinstance(allowed_objects, list) and len(allowed_objects) == 1:
            context_object_info = deps.get_object_profile(allowed_objects[0], mode)
            if context_object_info is None:
                context_object_info = {
                    "id": allowed_objects[0],
                    "label": allowed_objects[0],
                    "summary": "(No description yet.)",
                    "tags": [],
                    "ux": {"shape": "cube", "base_color": "#3498db"},
                }

        scene_json = deps.build_base_scene_json(
            mode,
            scene_actions,
            effective_intensity,
            getattr(chaos, "volatility", chaos.intensity),
        )

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
            deps.ensure_default_positions(objs)
        except Exception:
            pass

        try:
            kpi_payload = deps.kpi_step(user_id, text, allowed_objects, mode)
            scene_section = scene_json.get("scene")
            if not isinstance(scene_section, dict):
                scene_section = {}
                scene_json["scene"] = scene_section
            scene_section["kpi"] = kpi_payload.get("kpi")
            loops_out = deps.evaluate_loops(kpi_payload.get("kpi", {}), allowed_objects if allowed_objects else None, top_k=3)
            if isinstance(loops_out, dict):
                loops = loops_out.get("loops") or []
                loop_suggestions = loops_out.get("loops_suggestions") or []
                active_loop = loops_out.get("active_loop")
            scene_section["loops"] = loops
            scene_section["active_loop"] = active_loop
            scene_section["loops_suggestions"] = loop_suggestions
            try:
                fragility = deps.compute_fragility(
                    kpi=scene_section.get("kpi") if isinstance(scene_section.get("kpi"), dict) else None,
                    loops=loops if isinstance(loops, list) else None,
                    chaos=chaos if chaos is not None else None,
                    allowed_objects=allowed_objects if isinstance(allowed_objects, list) else None,
                )
                scene_section["fragility"] = fragility
            except Exception:
                fragility = None
            try:
                inv = deps.clamp01(kpi_payload.get("kpi", {}).get("inventory", 0.5))
                delv = deps.clamp01(kpi_payload.get("kpi", {}).get("delivery", 0.5))
                rsk = deps.clamp01(kpi_payload.get("kpi", {}).get("risk", 0.5))

                sv = scene_json.get("state_vector") if isinstance(scene_json, dict) else None
                if not isinstance(sv, dict):
                    sv = {}
                    if isinstance(scene_json, dict):
                        scene_json["state_vector"] = sv
                sv["inventory_pressure"] = deps.clamp01(1.0 - inv)
                sv["time_pressure"] = deps.clamp01(1.0 - delv)
                sv["quality_risk"] = rsk

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

                tmp_scene = {
                    "domain_model": dm,
                    "state_vector": sv,
                    "scene": {},
                }
                tmp_scene = deps.map_state_to_scene_objects(tmp_scene)
                tmp_scene = deps.map_loops_from_state(tmp_scene)

                scene_section["nexora_mvp"] = {
                    "objects": (tmp_scene.get("scene") or {}).get("objects", []),
                    "loops": (tmp_scene.get("scene") or {}).get("loops", []),
                }
            except Exception:
                pass
            if allowed_objects:
                kpi_apply: list[dict] = []
                inv = deps.clamp01(kpi_payload.get("kpi", {}).get("inventory", 0.5))
                delv = deps.clamp01(kpi_payload.get("kpi", {}).get("delivery", 0.5))
                risk = deps.clamp01(kpi_payload.get("kpi", {}).get("risk", 0.5))
                for oid in allowed_objects:
                    if "inventory" in oid:
                        kpi_apply.append({"type": "applyObject", "object": oid, "value": {"id": oid, "emphasis": (1 - inv) * 0.6}})
                    elif "delivery" in oid:
                        kpi_apply.append({"type": "applyObject", "object": oid, "value": {"id": oid, "emphasis": (1 - delv) * 0.6, "color": "#e74c3c"}})
                    elif "risk" in oid:
                        kpi_apply.append({"type": "applyObject", "object": oid, "value": {"id": oid, "emphasis": risk * 0.7, "color": "#f39c12"}})
                if kpi_apply:
                    actions.extend(kpi_apply)
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
                deps.ensure_default_positions(objs_list)
            except Exception:
                pass
        except Exception:
            pass
        scene_json = deps.sync_intensity(scene_json, effective_intensity, getattr(chaos, "volatility", chaos.intensity))
        scene_json = deps.sync_scene_state(scene_json)
        analysis_summary = deps.scene_state_summary(
            scene_json,
            effective_intensity,
            getattr(chaos, "volatility", chaos.intensity),
        )
        if debug is not None:
            debug["actions_count"] = len(actions)
            debug["source"] = source
    except Exception as exc:
        logging.exception("chat_failed", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content=_build_chat_error_payload(
                error_type="INTERNAL_ERROR",
                message="Chat failed.",
                user_id=user_id,
            ),
        )

    try:
        store: EventStoreMem | None = getattr(request.app.state, "event_store", None)
        if store is not None:
            store.append(user_id, text, reply, actions)
    except Exception as exc:  # pragma: no cover
        logging.warning("event_log_failed", exc_info=exc)

    try:
        replay_store = ReplayStore()
        ep_id = deps.episode_by_user.get(user_id)
        if not ep_id:
            ep = replay_store.create_episode(title=f"chat:{user_id}")
            ep_id = ep.episode_id
            deps.episode_by_user[user_id] = ep_id

        sys_state = build_replay_system_state(
            mode=mode,
            intent=intent,
            allowed_objects=allowed_objects,
            focused_object_id=focused_object_id,
            scene_json=scene_json if isinstance(scene_json, dict) else {},
            source=source,
            chaos=chaos,
            fragility=fragility if isinstance(fragility, dict) else {},
            loops=loops if isinstance(loops, list) else (scene_json.get("scene") or {}).get("loops") if isinstance(scene_json, dict) else None,
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
        pass

    scene_json = deps.sync_intensity(scene_json, effective_intensity, getattr(chaos, "volatility", chaos.intensity))
    scene_json = deps.sync_scene_state(scene_json)
    analysis_summary = deps.scene_state_summary(
        scene_json,
        effective_intensity,
        getattr(chaos, "volatility", chaos.intensity),
    )

    try:
        if isinstance(fragility, dict) and fragility.get("level") == "high":
            highlight_actions: list[dict] = []
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
        actions = filtered_actions

    context_allowed_objects = allowed_objects
    context_focused_object_id = focused_object_id
    context_inference = inference_info
    try:
        fragility_drivers = fragility.get("drivers") if isinstance(fragility, dict) else {}
        selection = deps.select_objects_v2(
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
        conflicts = deps.build_conflict_map_v0(scene_kpi if isinstance(scene_kpi, dict) else {}, fragility if isinstance(fragility, dict) else {})
        if isinstance(scene_json, dict) and isinstance(scene_json.get("scene"), dict):
            scene_json["scene"]["conflicts"] = conflicts
    except Exception:
        conflicts = []

    risk_propagation = {}
    try:
        risk_propagation = deps.build_risk_propagation_v0(
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
            loops=loops if isinstance(loops, list) else scene_json.get("scene", {}).get("loops") if isinstance(scene_json, dict) else None,
            fragility=fragility,
            conflicts=conflicts,
            risk_propagation=risk_propagation,
            loops_suggestions=loop_suggestions,
            active_loop=active_loop,
        ),
        "error": None,
        "debug": debug,
    }
    response_body = deps.package_chat_response(
        base_response=response_body,
        scene_json=scene_json if isinstance(scene_json, dict) else {},
        chaos=chaos,
        mode=mode,
        allowed_objects=context_allowed_objects if isinstance(context_allowed_objects, list) else [],
        focused_object_id=context_focused_object_id,
        fragility=fragility if isinstance(fragility, dict) else {},
        risk_propagation=risk_propagation if isinstance(risk_propagation, dict) else {},
        loops=loops if isinstance(loops, list) else scene_json.get("scene", {}).get("loops") if isinstance(scene_json, dict) else [],
        conflicts=conflicts if isinstance(conflicts, list) else [],
        active_loop=active_loop,
        analysis_summary=analysis_summary,
        engine_roles=getattr(request.app.state, "backend_engine_roles", None),
    )
    try:
        response_body["workspace"] = deps.ensure_default_workspace()
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
            response_body["game"] = deps.game_advice(
                kpi=context_kpi if isinstance(context_kpi, dict) else {},
                fragility=context_fragility if isinstance(context_fragility, dict) else {},
                allowed_objects=context_allowed if isinstance(context_allowed, list) else [],
            )
        except Exception:
            pass

    memory_ctx = {}
    memory_v2 = {}
    try:
        ctx = response_body.get("context") if isinstance(response_body.get("context"), dict) else {}
        episode_id = deps.episode_by_user.get(user_id, "")
        deps.record_decision_event(
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
        memory_ctx = deps.build_memory_context(
            user_id,
            kpi=ctx.get("kpi") if isinstance(ctx.get("kpi"), dict) else {},
            fragility=ctx.get("fragility") if isinstance(ctx.get("fragility"), dict) else {},
            focused_object_id=ctx.get("focused_object_id") if isinstance(ctx.get("focused_object_id"), str) else None,
        )
        if isinstance(ctx, dict):
            ctx["memory"] = memory_ctx
            response_body["context"] = ctx
    except Exception:
        pass

    try:
        memory_v2 = deps.build_memory_v2(
            memory_ctx if isinstance(memory_ctx, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            {},
        )
        _attach_response_extension(response_body, "memory_v2", memory_v2, scene_json=scene_json)
    except Exception:
        pass

    object_selection = {}
    try:
        object_selection = deps.build_object_selection(
            scene_json if isinstance(scene_json, dict) else {},
            fragility if isinstance(fragility, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            memory_ctx if isinstance(memory_ctx, dict) else {},
            memory_v2 if isinstance(memory_v2, dict) else {},
        )
        _attach_response_extension(response_body, "object_selection", object_selection, scene_json=scene_json)

        memory_v2 = deps.build_memory_v2(
            memory_ctx if isinstance(memory_ctx, dict) else {},
            conflicts if isinstance(conflicts, list) else [],
            object_selection if isinstance(object_selection, dict) else {},
        )
        _attach_response_extension(response_body, "memory_v2", memory_v2, scene_json=scene_json)
    except Exception:
        pass

    try:
        strategic_patterns = deps.build_strategic_patterns(
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
        pass

    strategic_advice = {}
    try:
        strategic_advice = deps.build_strategic_advice(
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
        pass

    try:
        decision_analysis = try_build_decision_analysis_payload(text)
        if decision_analysis is not None:
            _attach_response_extension(
                response_body,
                "decision_analysis",
                decision_analysis,
                scene_json=scene_json,
                include_in_scene_section=True,
            )
    except Exception:
        pass

    try:
        strategic_council = deps.run_strategic_council_service(
            {
                "text": text,
                "mode": mode,
                "focused_object_id": context_focused_object_id,
                "allowed_objects": context_allowed_objects if isinstance(context_allowed_objects, list) else [],
                "fragility": fragility if isinstance(fragility, dict) else {},
                "propagation": risk_propagation if isinstance(risk_propagation, dict) else {},
                "decision_path": response_body.get("decision_path")
                if isinstance(response_body.get("decision_path"), dict)
                else {},
                "compare_result": response_body.get("decision_comparison")
                if isinstance(response_body.get("decision_comparison"), dict)
                else {},
                "strategy_result": strategic_advice if isinstance(strategic_advice, dict) else {},
                "memory_summary": memory_v2 if isinstance(memory_v2, dict) else {},
                "learning_summary": response_body.get("strategic_patterns")
                if isinstance(response_body.get("strategic_patterns"), dict)
                else {},
                "scene_json": scene_json if isinstance(scene_json, dict) else {},
            }
        )
        _attach_response_extension(
            response_body,
            "strategic_council",
            strategic_council.model_dump(mode="python"),
            scene_json=scene_json,
            include_in_scene_section=True,
        )
    except Exception:
        pass

    try:
        opponent_model = deps.build_opponent_model(
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
        pass
    return _normalize_chat_response_shape(response_body)
