from __future__ import annotations

from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.engines.fragility_v1 import compute_fragility_v1
from app.services.montecarlo_report_adapter import build_manager_report
from app.services.montecarlo_service import run_simulation
from app.services.replay_store import ReplayStore
from app.utils import responses


router = APIRouter()
store = ReplayStore()


class ScenarioIn(BaseModel):
    name: str
    delta: Dict[str, float] = Field(default_factory=dict)


class TimelineCfg(BaseModel):
    steps: int = Field(3, ge=1, le=20)
    model: str = "simple_drift"


class MonteCarloCfg(BaseModel):
    n: int = Field(150, ge=10, le=5000)
    sigma: float = Field(0.08, ge=0.0, le=1.0)
    every_step: bool = False


class TimelineRunIn(BaseModel):
    episode_id: str
    scenarios: List[ScenarioIn]
    timeline: TimelineCfg = Field(default_factory=TimelineCfg)
    montecarlo: MonteCarloCfg = Field(default_factory=MonteCarloCfg)


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


def simulate_step(kpi: Dict[str, float], step_index: int, volatility: float) -> Dict[str, float]:
    """v0 simple drift model."""
    _ = step_index  # reserved for future model variants
    inventory = _clamp01(kpi.get("inventory", 0.5))
    delivery = _clamp01(kpi.get("delivery", 0.5))
    risk = _clamp01(kpi.get("risk", 0.5))

    time_pressure = _clamp01(1.0 - delivery)
    inventory_next = _clamp01(inventory - 0.04 * time_pressure)
    delivery_next = _clamp01(delivery + 0.03 * inventory)
    risk_next = _clamp01(risk + 0.05 * _clamp01(volatility))
    return {"inventory": inventory_next, "delivery": delivery_next, "risk": risk_next}


@router.post("/simulator/timeline")
def simulator_timeline(payload: TimelineRunIn):
    try:
        episode = store.get_episode(payload.episode_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=responses.error("NOT_FOUND", "Episode not found")) from None

    frames = episode.frames or []
    if not frames:
        raise HTTPException(status_code=404, detail=responses.error("NOT_FOUND", "Episode has no frames"))

    last = frames[-1]
    ss = last.system_state if isinstance(last.system_state, dict) else {}
    base_kpi = ss.get("kpi") if isinstance(ss.get("kpi"), dict) else {}
    loops = ss.get("loops") if isinstance(ss.get("loops"), list) else []
    allowed_objects = ss.get("allowed_objects") if isinstance(ss.get("allowed_objects"), list) else []
    chaos = ss.get("chaos") if isinstance(ss.get("chaos"), dict) else {}
    base_volatility = _clamp01(chaos.get("volatility", chaos.get("intensity", 0.0)))

    class _ChaosShim:
        def __init__(self, intensity: float, volatility: float):
            self.intensity = intensity
            self.volatility = volatility

    chaos_obj = _ChaosShim(
        intensity=_clamp01(chaos.get("intensity", 0.0)),
        volatility=base_volatility,
    )

    scenario_results: List[Dict[str, Any]] = []
    for sc in payload.scenarios:
        delta = sc.delta if isinstance(sc.delta, dict) else {}
        kpi = {
            "inventory": _clamp01(_clamp01(base_kpi.get("inventory", 0.5)) + float(delta.get("inventory", 0.0))),
            "delivery": _clamp01(_clamp01(base_kpi.get("delivery", 0.5)) + float(delta.get("delivery", 0.0))),
            "risk": _clamp01(_clamp01(base_kpi.get("risk", 0.5)) + float(delta.get("risk", 0.0))),
        }

        timeline: List[Dict[str, Any]] = []
        mc_per_step: List[Dict[str, Any]] = []
        final_fragility: Dict[str, Any] = {}

        for step in range(int(payload.timeline.steps)):
            kpi = simulate_step(kpi, step, base_volatility)
            fragility = compute_fragility_v1(
                kpi=kpi,
                loops=loops,
                chaos=chaos_obj,
                allowed_objects=[x for x in allowed_objects if isinstance(x, str)],
            )
            final_fragility = fragility if isinstance(fragility, dict) else {}
            timeline.append({"step": step, "kpi": dict(kpi), "fragility": final_fragility})

            if payload.montecarlo.every_step:
                sim_fragility = dict(final_fragility)
                sim_fragility["loops"] = loops
                sim_fragility["chaos"] = chaos
                sim_fragility["allowed_objects"] = allowed_objects
                mc_result = run_simulation(
                    kpi=kpi,
                    fragility=sim_fragility,
                    n=int(payload.montecarlo.n),
                    sigma=float(payload.montecarlo.sigma),
                )
                mc_per_step.append(
                    {
                        "step": step,
                        "result": mc_result,
                        "manager_report": build_manager_report(mc_result),
                    }
                )

        if payload.montecarlo.every_step:
            montecarlo = {"per_step": mc_per_step}
        else:
            sim_fragility = dict(final_fragility)
            sim_fragility["loops"] = loops
            sim_fragility["chaos"] = chaos
            sim_fragility["allowed_objects"] = allowed_objects
            mc_last = run_simulation(
                kpi=kpi,
                fragility=sim_fragility,
                n=int(payload.montecarlo.n),
                sigma=float(payload.montecarlo.sigma),
            )
            montecarlo = {"result": mc_last, "manager_report": build_manager_report(mc_last)}

        scenario_results.append(
            {
                "name": sc.name,
                "timeline": timeline,
                "final_fragility": final_fragility,
                "montecarlo": montecarlo,
            }
        )

    if not scenario_results:
        return responses.ok(
            {
                "scenarios": [],
                "best_scenario": None,
                "timeline_horizon": int(payload.timeline.steps),
                "manager_report": {"insight": "No scenarios provided.", "warning": ""},
            }
        )

    def _final_score(item: Dict[str, Any]) -> float:
        frag = item.get("final_fragility") if isinstance(item.get("final_fragility"), dict) else {}
        return _clamp01(frag.get("score", 1.0))

    best = min(scenario_results, key=_final_score)
    worst = max(scenario_results, key=_final_score)

    insight = f"{best.get('name')} stabilizes risk after step 1."
    warning = f"{worst.get('name')} increases fragility in later steps."

    return responses.ok(
        {
            "scenarios": scenario_results,
            "best_scenario": best.get("name"),
            "timeline_horizon": int(payload.timeline.steps),
            "manager_report": {"insight": insight, "warning": warning},
        }
    )
