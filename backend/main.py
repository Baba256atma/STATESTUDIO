# backend/main.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
import logging

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

@app.on_event("startup")
def init_chaos_engine():
    app.state.chaos_engine = ChaosEngine()
    app.state.memory_engine = ObjectMemoryEngine(JsonMemoryStore())
    app.state.archetype_engine = ArchetypeEngine()


class ChatIn(BaseModel):
    text: str
    history: list[str] | None = None
    mode: str | None = None


class ArchetypeAnalyzeIn(BaseModel):
    signals: list[str]
    metrics: dict[str, float]
    history: list[ArchetypeState] | None = None


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/chat")
def chat(payload: ChatIn, request: Request):
    mode = payload.mode if payload.mode in {"business", "spirit"} else "business"
    engine: ChaosEngine = request.app.state.chaos_engine
    mem_engine: ObjectMemoryEngine = request.app.state.memory_engine
    chaos = engine.analyze(payload.text, payload.history)
    try:
        # AI reply is advisory only; ChaosEngine outputs remain authoritative.
        reply = generate_ai_reply(payload.text, chaos, mode)
    except Exception:
        reply = chaos.explanation or ""
    scene_actions = build_scene_actions(chaos, mode=mode)
    try:
        user_id = (
            request.headers.get("x-user-id")
            or request.headers.get("x-session-id")
            or (request.client.host if request.client else "anonymous")
        )
        affected_ids = [obj.get("id") for obj in scene_actions.get("objects", []) if obj.get("id")]
        updated_actions, mem_state = mem_engine.process(
            user_id=user_id,
            affected_ids=affected_ids,
            base_intensity=chaos.intensity,
            scene_actions=scene_actions,
        )
        scene_actions = updated_actions
        memory_summary = {
            "objects": {
                obj_id: {
                    "hits": mem_state[obj_id].hits,
                    "energy": mem_state[obj_id].energy,
                    "trend": mem_state[obj_id].trend,
                }
                for obj_id in affected_ids
                if obj_id in mem_state
            }
        }
    except Exception:
        memory_summary = None
    return {
        "mode": mode,
        "reply": reply,
        "chaos": {
            "intensity": chaos.intensity,
            "volatility": chaos.volatility,
            "dominant_signal": chaos.dominant_signal,
            "affected_objects": chaos.affected_objects,
            "explanation": chaos.explanation,
        },
        "scene_actions": scene_actions,
        "memory": memory_summary,
    }


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
