from __future__ import annotations

import time
from typing import Any, Dict, Optional, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.scenario_input import ScenarioSimulationRequest
from app.models.scenario_output import ScenarioSimulationResult
from app.services.replay_store import ReplayStore
from app.models.replay import ReplayFrame, ReplayMeta
from app.engines.fragility_v1 import compute_fragility_v1
from app.services.loop_engine import evaluate_loops
from app.services.scenario.scenario_orchestrator import ScenarioSimulationOrchestrator


router = APIRouter()
store = ReplayStore()
simulation_orchestrator = ScenarioSimulationOrchestrator()


class ScenarioOverrideIn(BaseModel):
    episode_id: str = Field(..., description="Episode to apply override to")
    branch: bool = Field(default=False, description="Create a branch episode first")
    branch_title: Optional[str] = None
    include_history: bool = False

    # KPI overrides (delta = add/subtract, abs = set)
    delta: Dict[str, float] = Field(default_factory=dict)   # e.g. {"inventory": -0.1}
    absolute: Dict[str, float] = Field(default_factory=dict) # e.g. {"risk": 0.8}


def _clamp01(x: Any) -> float:
    try:
        v = float(x)
    except Exception:
        return 0.0
    if v < 0.0:
        return 0.0
    if v > 1.0:
        return 1.0
    return v


class _ChaosShim:
    def __init__(self, intensity: float, volatility: float):
        self.intensity = intensity
        self.volatility = volatility


@router.post("/scenario/simulate", response_model=ScenarioSimulationResult)
def simulate_scenario(payload: ScenarioSimulationRequest):
    """Run deterministic Scenario Simulation Lite and return overlay-safe propagation."""
    try:
        result = simulation_orchestrator.run_simulation(payload.model_dump())
        return ScenarioSimulationResult.model_validate(result)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"ok": False, "error": {"message": str(exc)}}) from exc
    except Exception as exc:  # pragma: no cover - defensive API guard
        raise HTTPException(
            status_code=500,
            detail={
                "ok": False,
                "error": {
                    "message": "Scenario simulation is currently unavailable.",
                    "detail": str(exc),
                },
            },
        ) from exc


@router.post("/scenario/override")
def scenario_override(payload: ScenarioOverrideIn):
    # Load episode and last frame
    parent = store.get_episode(payload.episode_id)
    frames = parent.frames or []
    if not frames:
        raise HTTPException(status_code=404, detail={"ok": False, "error": {"message": "Episode has no frames"}})

    target_episode_id = payload.episode_id

    # Optional branching
    if payload.branch:
        child = store.create_branch_from_episode(
            parent_episode_id=payload.episode_id,
            title=payload.branch_title,
            include_history=bool(payload.include_history),
        )
        target_episode_id = child.episode_id
        # reload to get last frame from child
        parent = store.get_episode(target_episode_id)
        frames = parent.frames or []

    last = frames[-1]
    ss = last.system_state if isinstance(last.system_state, dict) else {}

    base_kpi = ss.get("kpi") if isinstance(ss.get("kpi"), dict) else {}
    inv = _clamp01(base_kpi.get("inventory", 0.5))
    delv = _clamp01(base_kpi.get("delivery", 0.5))
    rsk = _clamp01(base_kpi.get("risk", 0.5))

    # Apply absolute first
    absd = payload.absolute if isinstance(payload.absolute, dict) else {}
    if "inventory" in absd: inv = _clamp01(absd["inventory"])
    if "delivery" in absd: delv = _clamp01(absd["delivery"])
    if "risk" in absd: rsk = _clamp01(absd["risk"])

    # Then delta
    delt = payload.delta if isinstance(payload.delta, dict) else {}
    if "inventory" in delt: inv = _clamp01(inv + float(delt["inventory"]))
    if "delivery" in delt: delv = _clamp01(delv + float(delt["delivery"]))
    if "risk" in delt: rsk = _clamp01(rsk + float(delt["risk"]))

    new_kpi = {"inventory": inv, "delivery": delv, "risk": rsk}

    allowed_objects = ss.get("allowed_objects") if isinstance(ss.get("allowed_objects"), list) else []
    allowed_objects = [x for x in allowed_objects if isinstance(x, str)]

    # Recompute loops
    loops_out = evaluate_loops(new_kpi, allowed_objects if allowed_objects else None, top_k=3)
    loops: List[dict] = []
    loop_suggestions: List[str] = []
    active_loop = None
    if isinstance(loops_out, dict):
        loops = loops_out.get("loops") or []
        loop_suggestions = loops_out.get("loops_suggestions") or []
        active_loop = loops_out.get("active_loop")

    # Build chaos shim from stored chaos dict
    chaos_dict = ss.get("chaos") if isinstance(ss.get("chaos"), dict) else {}
    intensity = _clamp01(chaos_dict.get("intensity", 0.0))
    volatility = _clamp01(chaos_dict.get("volatility", intensity))
    chaos = _ChaosShim(intensity=intensity, volatility=volatility)

    # Recompute fragility
    fragility = compute_fragility_v1(kpi=new_kpi, loops=loops, chaos=chaos, allowed_objects=allowed_objects)

    # Append new ReplayFrame
    new_ss = dict(ss)
    new_ss["kpi"] = new_kpi
    new_ss["loops"] = loops
    new_ss["loops_suggestions"] = loop_suggestions
    new_ss["active_loop"] = active_loop
    new_ss["fragility"] = fragility
    new_ss["scenario_override"] = {"delta": delt, "absolute": absd}

    frame = ReplayFrame(
        t=time.time(),
        input_text="__scenario_override__",
        human_state={},
        system_signals=last.system_signals if isinstance(last.system_signals, dict) else {},
        system_state=new_ss,
        visual={
            "kpi": new_kpi,
            "loops": loops,
            "fragility": fragility,
            "override": {"delta": delt, "absolute": absd},
        },
        meta=ReplayMeta(note="scenario_override", tags=["scenario", "override"]),
    )

    store.append_frame(target_episode_id, frame)

    return {
        "ok": True,
        "episode_id": target_episode_id,
        "kpi": new_kpi,
        "loops": loops,
        "fragility": fragility,
        "override": {"delta": delt, "absolute": absd},
    }
