# backend/main.py
import os
import json
import time
import logging
from datetime import datetime, timezone
from typing import Any
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field, model_validator
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
from app.routers.ai_local import router as ai_local_router
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
from app.routers.fragility_scanner_router import router as fragility_scanner_router
from ingestion.router import router as ingestion_router
from app.routers.strategic_council_router import router as strategic_council_router
from app.routers.decision_router import router as decision_execution_router
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
from engines.strategic_council.council_service import run_strategic_council_service
from app.services.opponent_model_v0 import build_opponent_model_v0
from app.services.strategic_pattern_memory_v0 import build_strategic_patterns_v0
from app.services.chat_contract_alignment import (
    build_backend_engine_roles,
    package_chat_response,
)
from app.services.chat_runtime import ChatPipelineDependencies, execute_chat_pipeline
from app.services.product_store_v0 import ensure_default_workspace_v0
from app.services.ai_safety_guard import check_ai_input_safety
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_audit import RequestAuditMiddleware
from app.core.config import get_local_ai_settings
from app.services.ai.orchestrator import LocalAIOrchestrator
from app.models.system_archetypes import SystemArchetypeState
from app.semantics.nexora_semantics import infer_allowed_objects_from_text
from app.engines.fragility_v1 import compute_fragility_v1
from core.scene_templates import map_state_to_scene_objects, map_loops_from_state
from app.services.replay_store import ReplayStore
from app.models.replay import ReplayFrame, ReplayMeta
from app.models.scanner_output import (
    FragilityDriver,
    FragilitySceneHint,
    PanelAdviceSlice,
    PanelTimelineSlice,
    PanelWarRoomSlice,
)
from app.models.scenario_output import ScenarioSceneOverlay
from mapping.schemas import ObjectImpactSet
from app.services.kpi_runtime import kpi_step as _run_kpi_step
from app.services.object_registry import (
    build_object_info as _registry_build_object_info,
    build_object_profile as _registry_build_object_profile,
    get_any_entry as _registry_get_any_entry,
    get_object_entry as _registry_get_object_entry,
    infer_allowed_objects_from_text as _registry_infer_allowed_objects_from_text,
    initialize_registry_state as _registry_initialize_state,
    load_object_dict as _registry_load_object_dict,
    next_instance_id as _registry_next_instance_id,
    validate_object_dict as _registry_validate_object_dict,
)
from app.services.scene_utils import (
    apply_intensity_to_objects as _apply_intensity_to_objects,
    build_base_scene_json as _build_base_scene_json,
    bump_scene_intensity as _bump_scene_intensity,
    clamp01 as _clamp01,
    ensure_default_positions as _ensure_default_positions,
    scene_state_summary as _scene_state_summary,
    sync_intensity as _sync_intensity,
    sync_scene_state as _sync_scene_state,
)

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

def _kpi_step(user_id: str, text: str, allowed_objects: list[str], mode: str) -> dict:
    return _run_kpi_step(
        user_id=user_id,
        text=text,
        allowed_objects=allowed_objects,
        mode=mode,
        kpi_state_by_user=_KPI_STATE_BY_USER,
        kpi_default=_KPI_DEFAULT,
        build_loops=build_loops_from_kpi,
    )

def _load_object_dict() -> dict[str, dict]:
    return _registry_load_object_dict(_OBJECT_DICT_PATH, _INSTANCE_DICT_PATH)


def _validate_object_dict(obj_map: dict[str, dict]) -> None:
    _registry_validate_object_dict(obj_map)


def _get_obj_entry(obj_id: str) -> dict | None:
    return _registry_get_object_entry(
        obj_id,
        object_instances=_OBJECT_INSTANCES,
        object_types=_OBJECT_TYPES,
        legacy_objects=_LEGACY_OBJECTS,
        raw_object_dict=_OBJECT_DICT,
    )


def _get_any_entry(obj_id: str) -> tuple[dict | None, dict | None]:
    return _registry_get_any_entry(
        obj_id,
        object_instances=_OBJECT_INSTANCES,
        object_types=_OBJECT_TYPES,
        legacy_objects=_LEGACY_OBJECTS,
        raw_object_dict=_OBJECT_DICT,
    )


def _next_instance_id(type_id: str) -> str:
    return _registry_next_instance_id(type_id, _INSTANCE_COUNTERS)


def get_object_profile(obj_id: str, mode: str | None = None) -> dict | None:
    return _registry_build_object_profile(
        obj_id,
        object_instances=_OBJECT_INSTANCES,
        object_types=_OBJECT_TYPES,
        legacy_objects=_LEGACY_OBJECTS,
        raw_object_dict=_OBJECT_DICT,
    )


def _build_object_info(obj_id: str) -> dict | None:
    return _registry_build_object_info(
        obj_id,
        object_instances=_OBJECT_INSTANCES,
        object_types=_OBJECT_TYPES,
        legacy_objects=_LEGACY_OBJECTS,
        raw_object_dict=_OBJECT_DICT,
    )


def _infer_allowed_objects_from_text(text: str, mode: str | None = None, allowed_only: list[str] | None = None) -> list[str]:
    return _registry_infer_allowed_objects_from_text(
        text,
        mode=mode,
        object_instances=_OBJECT_INSTANCES,
        object_types=_OBJECT_TYPES,
        legacy_objects=_LEGACY_OBJECTS,
        allowed_only=allowed_only,
    )

app = FastAPI(title="StateStudio API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Request audit logging for MVP operational visibility.
app.add_middleware(RequestAuditMiddleware)
# Simple in-memory per-IP rate limiting for MVP safety.
app.add_middleware(RateLimitMiddleware, max_requests=60, window_seconds=60)
app.include_router(human_catalog_router)
app.include_router(analysis_router)
app.include_router(replay_router)
app.include_router(ai_chat_router)
app.include_router(ai_local_router)
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
app.include_router(fragility_scanner_router)
app.include_router(ingestion_router)
app.include_router(strategic_council_router)
app.include_router(decision_execution_router)

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

logger = logging.getLogger(__name__)


@app.on_event("startup")
async def init_chaos_engine():
    app.state.chaos_engine = ChaosEngine()
    app.state.memory_engine = ObjectMemoryEngine(JsonMemoryStore())
    app.state.archetype_engine = ArchetypeEngine()
    app.state.event_store = EventStoreMem()
    app.state.backend_engine_roles = build_backend_engine_roles()
    # Local AI startup state is initialized here without blocking existing startup behavior.
    app.state.local_ai_settings = get_local_ai_settings()
    app.state.local_ai_available = False
    try:
        local_ai_health = await LocalAIOrchestrator(settings=app.state.local_ai_settings).get_health()
        app.state.local_ai_available = bool(local_ai_health.available)
        if not local_ai_health.available:
            logger.warning("local_ai_unavailable_on_startup provider=%s", local_ai_health.provider)
    except Exception:
        logger.warning("local_ai_startup_check_failed", exc_info=False)
    global _OBJECT_DICT, _OBJECT_TYPES, _OBJECT_INSTANCES, _LEGACY_OBJECTS
    registry_state = _registry_initialize_state(_OBJECT_DICT_PATH, _INSTANCE_DICT_PATH)
    _OBJECT_DICT = registry_state["raw_object_dict"]
    _OBJECT_TYPES = registry_state["object_types"]
    _OBJECT_INSTANCES = registry_state["object_instances"]
    _LEGACY_OBJECTS = registry_state["legacy_objects"]
    _INSTANCE_COUNTERS.clear()
    _INSTANCE_COUNTERS.update(registry_state["instance_counters"])
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


class ChatActionOut(BaseModel):
    target_id: str | None = None
    targetId: str | None = None
    verb: str | None = None
    type: str | None = None
    object: str | None = None
    value: dict[str, Any] | None = None
    color: str | None = None
    intensity: float | None = None
    position: list[float] | None = None
    visible: bool | None = None
    scale: float | None = None

    model_config = ConfigDict(extra="allow")


class ChatErrorOut(BaseModel):
    type: str | None = None
    message: str | None = None


class ChatResponseOut(BaseModel):
    ok: bool = True
    user_id: str | None = None
    reply: str = ""
    actions: list[ChatActionOut] = Field(default_factory=list)
    scene_json: dict[str, Any] | None = None
    source: str | None = None
    analysis_summary: str | None = None
    context: dict[str, Any] | None = None
    error: ChatErrorOut | None = None
    debug: dict[str, Any] | None = None
    active_mode: str | None = None
    session_id: str | None = None
    advice_slice: PanelAdviceSlice | None = None
    timeline_slice: PanelTimelineSlice | None = None
    war_room_slice: PanelWarRoomSlice | None = None
    scene_payload: FragilitySceneHint | None = None
    scene_overlay: ScenarioSceneOverlay | None = None
    object_impacts: ObjectImpactSet | None = None
    drivers: list[FragilityDriver] = Field(default_factory=list)
    signals: list[str] = Field(default_factory=list)

    model_config = ConfigDict(extra="allow")


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


def _build_chat_pipeline_dependencies() -> ChatPipelineDependencies:
    return ChatPipelineDependencies(
        object_types=_OBJECT_TYPES,
        object_instances=_OBJECT_INSTANCES,
        legacy_objects=_LEGACY_OBJECTS,
        instance_counters=_INSTANCE_COUNTERS,
        episode_by_user=_EPISODE_BY_USER,
        tick_text=TICK_TEXT,
        check_ai_input_safety=check_ai_input_safety,
        semantic_infer_allowed_objects_from_text=infer_allowed_objects_from_text,
        load_object_dictionary=load_object_dictionary,
        infer_objects_from_text=infer_objects_from_text,
        pick_allowed_objects=pick_allowed_objects,
        build_scene_actions=build_scene_actions,
        llm_chat_actions=llm_chat_actions,
        get_object_profile=get_object_profile,
        next_instance_id=_next_instance_id,
        build_base_scene_json=_build_base_scene_json,
        scene_state_summary=_scene_state_summary,
        bump_scene_intensity=_bump_scene_intensity,
        apply_intensity_to_objects=_apply_intensity_to_objects,
        ensure_default_positions=_ensure_default_positions,
        sync_intensity=_sync_intensity,
        sync_scene_state=_sync_scene_state,
        kpi_step=_kpi_step,
        clamp01=_clamp01,
        evaluate_loops=evaluate_loops,
        compute_fragility=compute_fragility_v1,
        map_state_to_scene_objects=map_state_to_scene_objects,
        map_loops_from_state=map_loops_from_state,
        package_chat_response=package_chat_response,
        ensure_default_workspace=ensure_default_workspace_v0,
        game_advice=game_advice_v0,
        record_decision_event=record_decision_event_v0,
        build_memory_context=build_memory_context_v0,
        build_memory_v2=build_memory_v2,
        build_object_selection=build_object_selection_v25,
        build_strategic_patterns=build_strategic_patterns_v0,
        build_strategic_advice=build_strategic_advice_v0,
        run_strategic_council_service=run_strategic_council_service,
        build_opponent_model=build_opponent_model_v0,
        select_objects_v2=select_objects_v2,
        build_conflict_map_v0=build_conflict_map_v0,
        build_risk_propagation_v0=build_risk_propagation_v0,
    )


@app.post("/chat", response_model=ChatResponseOut)
def chat(payload: ChatIn, request: Request):
    return execute_chat_pipeline(payload, request, _build_chat_pipeline_dependencies())


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
