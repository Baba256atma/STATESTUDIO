"""Replay storage endpoints."""
from __future__ import annotations

import json
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.replay import ReplayEpisode, ReplayFrame
from app.services.replay_store import ReplayStore
from app.services.orchestrator import analyze_full_pipeline
from app.services.demo_scripts import DEMO_SCRIPTS, DEMO_TITLES, DemoId
from app.utils import responses

router = APIRouter()
store = ReplayStore()


class CreateEpisodeIn(BaseModel):
    title: str | None = None


class DemoSeedIn(BaseModel):
    demo_id: DemoId


class BranchEpisodeIn(BaseModel):
    title: str | None = None
    include_history: bool = False


def _episode_summary(episode: ReplayEpisode) -> dict:
    return {
        "episode_id": episode.episode_id,
        "title": episode.title,
        "created_at": episode.created_at,
        "updated_at": episode.updated_at,
        "duration": episode.duration,
        "frame_count": len(episode.frames),
    }


@router.post("/replay/episodes")
def create_episode(payload: CreateEpisodeIn) -> dict:
    episode = store.create_episode(payload.title)
    return {"episode_id": episode.episode_id, "created_at": episode.created_at}


@router.get("/replay/episodes")
def list_episodes() -> List[dict]:
    return store.list_episodes()


@router.get("/replay/episodes/{episode_id}")
def get_episode(episode_id: str) -> ReplayEpisode:
    try:
        return store.get_episode(episode_id)
    except FileNotFoundError:
        raise HTTPException(
          status_code=404,
          detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None


@router.post("/replay/episodes/{episode_id}/frames")
def append_frame(episode_id: str, frame: ReplayFrame) -> dict:
    try:
        episode, warnings = store.append_frame(episode_id, frame)
        return responses.ok(_episode_summary(episode), warnings=warnings or None)
    except FileNotFoundError:
        raise HTTPException(
          status_code=404,
          detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=responses.error("INVALID_INPUT", str(exc)),
        ) from exc


@router.post("/replay/episodes/{episode_id}/export")
def export_episode(episode_id: str) -> dict:
    try:
        episode = store.get_episode(episode_id)
        return json.loads(episode.model_dump_json())
    except FileNotFoundError:
        raise HTTPException(
          status_code=404,
          detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None


@router.post("/replay/episodes/{episode_id}/branch")
def branch_episode(episode_id: str, payload: BranchEpisodeIn):
    """Create a new episode branched from an existing one."""
    child = store.create_branch_from_episode(
        parent_episode_id=episode_id,
        title=payload.title,
        include_history=bool(payload.include_history),
    )
    return {"ok": True, "parent_episode_id": episode_id, "episode": child.model_dump()}


@router.get("/replay/compare")
def compare_episodes(a: str, b: str):
    try:
        ea = store.get_episode(a)
        eb = store.get_episode(b)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None

    def fnum(x, default=0.0):
        try:
            return float(x)
        except Exception:
            return float(default)

    def get_last_view(ep):
        frames = ep.frames or []
        if not frames:
            return {"episode_id": ep.episode_id, "frame": None, "t": None, "kpi": None, "fragility": None}
        fr = frames[-1]
        ss = fr.system_state if isinstance(fr.system_state, dict) else {}
        return {
            "episode_id": ep.episode_id,
            "t": getattr(fr, "t", None),
            "kpi": ss.get("kpi") if isinstance(ss.get("kpi"), dict) else {},
            "fragility": ss.get("fragility") if isinstance(ss.get("fragility"), dict) else {},
            "loops": ss.get("loops") if isinstance(ss.get("loops"), list) else [],
            "intent": ss.get("intent"),
            "allowed_objects": ss.get("allowed_objects") if isinstance(ss.get("allowed_objects"), list) else [],
        }

    A = get_last_view(ea)
    B = get_last_view(eb)

    Ak = A.get("kpi") or {}
    Bk = B.get("kpi") or {}
    Afr = A.get("fragility") or {}
    Bfr = B.get("fragility") or {}

    # KPI deltas (B - A)
    kpi_keys = ["inventory", "delivery", "risk"]
    delta_kpi = {k: fnum(Bk.get(k, 0.0)) - fnum(Ak.get(k, 0.0)) for k in kpi_keys}

    # Fragility deltas
    a_score = fnum(Afr.get("score", 0.0))
    b_score = fnum(Bfr.get("score", 0.0))
    delta_fragility_score = b_score - a_score
    a_level = Afr.get("level")
    b_level = Bfr.get("level")

    # Reasons delta
    def reasons_map(fr):
        reasons = fr.get("reasons") if isinstance(fr.get("reasons"), list) else []
        out = {}
        for r in reasons:
            if not isinstance(r, dict):
                continue
            code = r.get("code")
            if isinstance(code, str) and code:
                out[code] = fnum(r.get("weight", 0.0))
        return out

    def drivers_map(fr: Dict[str, Any]) -> Dict[str, float]:
        drivers = fr.get("drivers") if isinstance(fr.get("drivers"), dict) else {}
        out: Dict[str, float] = {}
        for k, v in drivers.items():
            if isinstance(k, str) and k:
                out[k] = fnum(v, 0.0)
        return out

    def kpi_direction(key: str, delta: float) -> str:
        """Return 'worse'/'better'/'flat' based on business meaning."""
        if key in ("inventory", "delivery"):
            # higher is better
            if delta < -0.05:
                return "worse"
            if delta > 0.05:
                return "better"
            return "flat"
        if key == "risk":
            # higher is worse
            if delta > 0.05:
                return "worse"
            if delta < -0.05:
                return "better"
            return "flat"
        # default
        if delta > 0.05:
            return "worse"
        if delta < -0.05:
            return "better"
        return "flat"

    Ra = reasons_map(Afr)
    Rb = reasons_map(Bfr)
    codes = sorted(set(Ra.keys()) | set(Rb.keys()))

    changed = []
    for c in codes:
        aw = fnum(Ra.get(c, 0.0))
        bw = fnum(Rb.get(c, 0.0))
        dw = bw - aw
        if abs(dw) > 1e-9:
            changed.append({"code": c, "delta_weight": dw, "a_weight": aw, "b_weight": bw})

    changed.sort(key=lambda x: abs(float(x.get("delta_weight", 0.0))), reverse=True)
    top_changed = changed[:3]

    # Drivers delta (fragility.drivers)
    Da = drivers_map(Afr)
    Db = drivers_map(Bfr)
    driver_keys = sorted(set(Da.keys()) | set(Db.keys()))
    driver_changed = []
    for k in driver_keys:
        av = fnum(Da.get(k, 0.0))
        bv = fnum(Db.get(k, 0.0))
        dv = bv - av
        if abs(dv) > 1e-9:
            driver_changed.append({"key": k, "delta": dv, "a": av, "b": bv})
    driver_changed.sort(key=lambda x: abs(float(x.get("delta", 0.0))), reverse=True)
    top_driver_changes = driver_changed[:5]

    # Summary logic: inventory/delivery higher is better, risk higher is worse.
    worsened = []
    improved = []

    def add_if(name, cond_worse, cond_better):
        if cond_worse:
            worsened.append(name)
        elif cond_better:
            improved.append(name)

    add_if("inventory", delta_kpi["inventory"] < -0.05, delta_kpi["inventory"] > 0.05)
    add_if("delivery",   delta_kpi["delivery"]   < -0.05, delta_kpi["delivery"]   > 0.05)
    add_if("risk",       delta_kpi["risk"]       > 0.05,  delta_kpi["risk"]       < -0.05)

    if delta_fragility_score > 0.02:
        headline = f"Fragility increased ({a_level} → {b_level})"
    elif delta_fragility_score < -0.02:
        headline = f"Fragility decreased ({a_level} → {b_level})"
    else:
        headline = f"Fragility stable ({a_level} → {b_level})"

    # Executive-friendly summary
    kpi_judgements = {k: kpi_direction(k, float(delta_kpi.get(k, 0.0))) for k in kpi_keys}

    # Short text the manager can read in 2 seconds
    if delta_fragility_score > 0.02:
        executive_summary = "Risk profile worsened; consider stabilizing the biggest drivers before scaling." 
    elif delta_fragility_score < -0.02:
        executive_summary = "Risk profile improved; keep the stabilizing actions and monitor key drivers." 
    else:
        executive_summary = "Risk profile is stable; small changes detected—monitor drivers and KPIs." 

    scorecard = {
        "fragility": {"a": {"score": a_score, "level": a_level}, "b": {"score": b_score, "level": b_level}, "delta_score": delta_fragility_score},
        "kpi": {
            "a": {k: fnum(Ak.get(k, 0.0)) for k in kpi_keys},
            "b": {k: fnum(Bk.get(k, 0.0)) for k in kpi_keys},
            "delta": delta_kpi,
            "judgement": kpi_judgements,
        },
    }

    return {
        "ok": True,
        "a": A,
        "b": B,
        "delta": {
            "kpi": delta_kpi,
            "fragility": {"score": delta_fragility_score, "level": {"a": a_level, "b": b_level}},
        },
        "top_changed_reasons": top_changed,
        "summary": {
            "headline": headline,
            "what_worsened": worsened,
            "what_improved": improved,
        },
        "top_changed_drivers": top_driver_changes,
        "manager": {
            "headline": headline,
            "executive_summary": executive_summary,
            "scorecard": scorecard,
            "key_reason_changes": top_changed,
            "key_driver_changes": top_driver_changes,
        },
    }


@router.post("/replay/demo")
def create_demo_episode() -> dict:
    try:
        episode = store.create_episode(title="Demo Episode")
        inputs = [
            "We are growing fast",
            "Now quality is dropping",
            "We are rushing fixes",
            "Side effects keep coming back",
            "Team conflict is escalating",
        ]
        for text in inputs:
            analyze_full_pipeline(text=text, episode_id=episode.episode_id)
        return responses.ok({"episode_id": episode.episode_id, "title": "Demo Episode"})
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=responses.error("INTERNAL_ERROR", "failed to create demo"),
        ) from exc


@router.post("/replay/demo/seed")
def seed_demo_episode(payload: DemoSeedIn) -> dict:
    try:
        demo_id = payload.demo_id
        title = DEMO_TITLES[demo_id]
        episode = store.create_episode(title=title)
        for text in DEMO_SCRIPTS[demo_id]:
            analyze_full_pipeline(text=text, episode_id=episode.episode_id)
        updated = store.get_episode(episode.episode_id)
        return responses.ok(
            {
                "episode_id": updated.episode_id,
                "title": updated.title,
                "frame_count": len(updated.frames),
            }
        )
    except KeyError:
        raise HTTPException(
            status_code=422,
            detail=responses.error("INVALID_INPUT", "unknown demo_id"),
        ) from None
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=responses.error("INTERNAL_ERROR", "failed to seed demo"),
        ) from exc
