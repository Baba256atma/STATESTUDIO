"""Human analysis endpoints producing signals and archetype state."""
from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.signals import HumanArchetypeState
from app.models.system_archetypes import SystemArchetypeState
from app.services.catalog_store import CatalogStore
from app.services.human_signal_extractor import extract_signals
from app.services.human_archetype_engine import score_archetypes
from app.services.bridge_engine import map_human_to_system
from app.services.system_archetype_mapper import map_system_archetypes
from app.services.orchestrator import analyze_full_pipeline
from app.utils import responses

router = APIRouter()
store = CatalogStore()


class AnalyzeHumanIn(BaseModel):
    text: str


class AnalyzeBridgeIn(BaseModel):
    human_state: HumanArchetypeState


class AnalyzeSystemIn(BaseModel):
    system_signals: dict[str, float]
    history: list[SystemArchetypeState] | None = None


class AnalyzeFullIn(BaseModel):
    text: str
    metrics: dict[str, float] | None = None
    episode_id: str | None = None


@router.post("/analyze/human")
def analyze_human(payload: AnalyzeHumanIn) -> dict:
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=422, detail=responses.error("INVALID_INPUT", "text is required"))
    try:
        report = extract_signals(payload.text)
        catalog = store.load_human_catalog()
        human_state = score_archetypes(report, catalog)
        bridge_cfg = store.load_bridge_config()
        system_signals = map_human_to_system(human_state, bridge_cfg)
        return {
            "signals": report,
            "human_state": human_state,
            "system_signals": system_signals,
        }
    except ValueError as exc:
        raise HTTPException(
            status_code=422, detail=responses.error("INVALID_INPUT", str(exc))
        ) from exc
    except Exception as exc:
        logging.exception("human analysis failed: %s", exc)
        raise HTTPException(status_code=500, detail="analysis failed") from exc


@router.post("/analyze/bridge")
def analyze_bridge(payload: AnalyzeBridgeIn) -> dict:
    try:
        bridge_cfg = store.load_bridge_config()
        system_signals = map_human_to_system(payload.human_state, bridge_cfg)
        return {"system_signals": system_signals}
    except Exception as exc:
        logging.exception("bridge analysis failed: %s", exc)
        raise HTTPException(status_code=500, detail="analysis failed") from exc


@router.post("/analyze/system")
def analyze_system(payload: AnalyzeSystemIn) -> dict:
    try:
        catalog = store.load_system_archetypes()
        state = map_system_archetypes(
            system_signals=payload.system_signals,
            archetype_defs=catalog.items,
            history=payload.history,
        )
        return {"system_archetypes": state}
    except Exception as exc:
        logging.exception("system analysis failed: %s", exc)
        raise HTTPException(status_code=500, detail="analysis failed") from exc


@router.post("/analyze/full")
def analyze_full(payload: AnalyzeFullIn) -> dict:
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=422, detail=responses.error("INVALID_INPUT", "text is required"))
    try:
        result = analyze_full_pipeline(
            text=payload.text,
            metrics=payload.metrics,
            episode_id=payload.episode_id,
        )
        warnings = []
        if result.get("replay_warning"):
            warnings.append(result["replay_warning"])
        return responses.ok(
            {
                "episode_id": result["episode_id"],
                "signals": result["signals"],
                "human_state": result["human_state"],
                "system_signals": result["system_signals"],
                "system_state": result["system_state"],
                "visual": result["visual"],
            },
            warnings=warnings or None,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422, detail=responses.error("INVALID_INPUT", str(exc))
        ) from exc
    except Exception as exc:
        logging.exception("full analysis failed: %s", exc)
        raise HTTPException(status_code=500, detail="analysis failed") from exc
