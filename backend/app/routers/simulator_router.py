from __future__ import annotations

from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.engines.fragility_v1 import compute_fragility_v1
from app.services.decision_memory_v0 import build_memory_context_v0
from app.services.game_theory_v0 import game_advice_v0
from app.services.montecarlo_report_adapter import build_manager_report
from app.services.montecarlo_service import run_simulation
from app.services.replay_store import ReplayStore
from app.utils import responses
from engines.compare_mode.compare_models import CompareInput
from engines.compare_mode.compare_service import run_compare
from engines.evolution.evolution_service import (
    get_current_evolution_state,
    get_recent_memory,
    run_evolution_pass,
    save_memory,
    update_outcome,
)
from engines.evolution.memory_models import MemorySaveRequest, OutcomeUpdateRequest
from engines.scenario_simulation.propagation_models import PropagationRequest
from engines.scenario_simulation.propagation_service import run_propagation_simulation
from engines.scenario_simulation.scenario_action_models import ScenarioActionRequest
from engines.scenario_simulation.scenario_action_service import run_scenario_action
from engines.strategy_generation.strategy_models import StrategyGenerationInput
from engines.strategy_generation.strategy_service import run_strategy_generation
from engines.system_intelligence.intelligence_models import SystemIntelligenceInput
from engines.system_intelligence.intelligence_service import run_system_intelligence


router = APIRouter()
store = ReplayStore()


class ScenarioIn(BaseModel):
    name: str
    delta: Dict[str, float] = Field(default_factory=dict)


class MonteCarloCfg(BaseModel):
    n: int = Field(200, ge=10, le=5000)
    sigma: float = Field(0.08, ge=0.0, le=1.0)


class SimulatorRunIn(BaseModel):
    episode_id: str
    scenarios: List[ScenarioIn]
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


@router.post("/simulator/run")
def simulator_run(payload: SimulatorRunIn):
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
    base_fragility = ss.get("fragility") if isinstance(ss.get("fragility"), dict) else {}
    allowed_objects = ss.get("allowed_objects") if isinstance(ss.get("allowed_objects"), list) else []
    loops = ss.get("loops") if isinstance(ss.get("loops"), list) else []
    chaos = ss.get("chaos") if isinstance(ss.get("chaos"), dict) else {}

    class _ChaosShim:
        def __init__(self, intensity: float, volatility: float):
            self.intensity = intensity
            self.volatility = volatility

    chaos_obj = _ChaosShim(
        intensity=_clamp01(chaos.get("intensity", 0.0)),
        volatility=_clamp01(chaos.get("volatility", chaos.get("intensity", 0.0))),
    )

    scenario_results: List[Dict[str, Any]] = []
    for sc in payload.scenarios:
        delta = sc.delta if isinstance(sc.delta, dict) else {}

        inv = _clamp01(_clamp01(base_kpi.get("inventory", 0.5)) + float(delta.get("inventory", 0.0)))
        delv = _clamp01(_clamp01(base_kpi.get("delivery", 0.5)) + float(delta.get("delivery", 0.0)))
        if "risk" in delta:
            risk = _clamp01(_clamp01(base_kpi.get("risk", 0.5)) + float(delta.get("risk", 0.0)))
        else:
            # Lightweight risk recalculation using inventory/delivery pressure.
            base_risk = _clamp01(base_kpi.get("risk", 0.5))
            risk = _clamp01(base_risk + 0.20 * (0.5 - inv) + 0.15 * (0.5 - delv))
        kpi = {"inventory": inv, "delivery": delv, "risk": risk}

        fragility = compute_fragility_v1(
            kpi=kpi,
            loops=loops,
            chaos=chaos_obj,
            allowed_objects=[x for x in allowed_objects if isinstance(x, str)],
        )
        fragility = fragility if isinstance(fragility, dict) else dict(base_fragility)
        sim_fragility = dict(fragility)
        sim_fragility["loops"] = loops
        sim_fragility["chaos"] = chaos
        sim_fragility["allowed_objects"] = allowed_objects

        mc_result = run_simulation(
            kpi=kpi,
            fragility=sim_fragility,
            n=int(payload.montecarlo.n),
            sigma=float(payload.montecarlo.sigma),
        )
        mc_report = build_manager_report(mc_result)
        strategy = game_advice_v0(kpi=kpi, fragility=fragility, allowed_objects=[x for x in allowed_objects if isinstance(x, str)])
        memory_hint = build_memory_context_v0(
            "simulator",
            kpi=kpi,
            fragility=fragility,
            focused_object_id=ss.get("focused_object_id") if isinstance(ss.get("focused_object_id"), str) else None,
        )

        scenario_results.append(
            {
                "name": sc.name,
                "kpi": kpi,
                "fragility": fragility,
                "montecarlo": {"result": mc_result, "manager_report": mc_report},
                "strategy": strategy,
                "memory_hint": memory_hint.get("similar") if isinstance(memory_hint, dict) else None,
            }
        )

    if not scenario_results:
        return responses.ok({"scenarios": [], "best_scenario": None, "manager_report": {"recommendation": "", "reasoning": "No scenarios provided."}})

    def _rank_key(item: Dict[str, Any]) -> tuple[float, float]:
        frag_score = _clamp01(((item.get("fragility") if isinstance(item.get("fragility"), dict) else {}).get("score", 1.0)))
        monte = item.get("montecarlo") if isinstance(item.get("montecarlo"), dict) else {}
        monte_result = (monte.get("result") if isinstance(monte, dict) else {}) or {}
        monte_stats = monte_result.get("stats") if isinstance(monte_result, dict) else {}
        mc_mean = _clamp01(monte_stats.get("mean", 1.0) if isinstance(monte_stats, dict) else 1.0)
        expected_payoff = 1.0 - mc_mean
        return (frag_score, -expected_payoff)

    best = min(scenario_results, key=_rank_key)
    best_name = best.get("name")

    recommendation = (best.get("strategy") or {}).get("recommendation", {})
    reasoning = (
        f"Best scenario '{best_name}' selected by lowest fragility score; "
        "tie-break by higher expected payoff proxy from Monte Carlo."
    )
    manager_report = {
        "recommendation": recommendation.get("recommended_strategy"),
        "reasoning": reasoning,
    }

    return responses.ok(
        {
            "scenarios": scenario_results,
            "best_scenario": best_name,
            "manager_report": manager_report,
        }
    )


@router.post("/simulation/propagation")
def simulation_propagation(payload: PropagationRequest):
    result = run_propagation_simulation(payload)
    return responses.ok(
        {
            "simulation": {
                "propagation": result.model_dump(mode="python"),
            }
        }
    )


@router.post("/simulation/scenario-action")
def simulation_scenario_action(payload: ScenarioActionRequest):
    result = run_scenario_action(payload)
    return responses.ok(
        {
            "simulation": {
                "scenario_action": result.scenario_action.model_dump(mode="python"),
                "propagation": result.propagation.model_dump(mode="python") if result.propagation is not None else None,
                "decision_path": result.decision_path.model_dump(mode="python") if result.decision_path is not None else None,
            },
            "analysis": result.analysis.model_dump(mode="python") if result.analysis is not None else None,
        }
    )


@router.post("/system/intelligence/run")
def system_intelligence_run(payload: SystemIntelligenceInput):
    result = run_system_intelligence(payload)
    return responses.ok({"intelligence": result.model_dump(mode="python")})


@router.post("/system/compare/run")
def system_compare_run(payload: CompareInput):
    result = run_compare(payload)
    return responses.ok({"comparison": result.model_dump(mode="python")})


@router.post("/system/strategy/generate")
def system_strategy_generate(payload: StrategyGenerationInput):
    result = run_strategy_generation(payload)
    return responses.ok({"strategy_generation": result.model_dump(mode="python")})


@router.post("/system/memory/save")
def system_memory_save(payload: MemorySaveRequest):
    saved = save_memory(payload)
    return responses.ok({"memory": saved})


@router.post("/system/outcome/update")
def system_outcome_update(payload: OutcomeUpdateRequest):
    updated = update_outcome(payload)
    return responses.ok({"outcome": updated.model_dump(mode="python") if updated is not None else None})


@router.post("/system/evolution/run")
def system_evolution_run(_: dict[str, Any] | None = None):
    result = run_evolution_pass()
    return responses.ok({"evolution": result.model_dump(mode="python")})


@router.get("/system/memory/recent")
def system_memory_recent(limit: int = 12):
    return responses.ok({"memory": get_recent_memory(limit=limit)})


@router.get("/system/evolution/state")
def system_evolution_state():
    return responses.ok({"evolution": get_current_evolution_state().model_dump(mode="python")})
