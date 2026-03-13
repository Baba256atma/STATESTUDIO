from __future__ import annotations

from typing import Any, Dict, List


YOU_PLAYER = {"id": "player_org", "label": "You"}
MARKET_PLAYER = {"id": "player_market", "label": "Market/Competitor"}

YOU_STRATEGIES = ["buffer_up", "speed_up", "cost_cut"]
MARKET_STRATEGIES = ["demand_spike", "delay_shock", "price_pressure"]


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


def _fnum(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)


def build_payoff_matrix(kpi: dict, fragility: dict) -> dict:
    """
    Build a lightweight payoff matrix using KPI + fragility heuristics.
    Payoff tuple format: [you_payoff, market_payoff].
    """
    kpi = kpi if isinstance(kpi, dict) else {}
    fragility = fragility if isinstance(fragility, dict) else {}

    inventory = _clamp01(kpi.get("inventory", 0.5))
    delivery = _clamp01(kpi.get("delivery", 0.5))
    risk = _clamp01(kpi.get("risk", 0.5))
    fragility_score = _clamp01(fragility.get("score", 0.5))

    # Baseline payoff signal for "you".
    base_you = 0.55 * delivery + 0.35 * inventory - 0.60 * risk - 0.25 * fragility_score

    # Strategy effects under market actions (small deterministic deltas).
    strategy_effects: Dict[str, Dict[str, float]] = {
        "buffer_up": {"demand_spike": 0.12, "delay_shock": 0.09, "price_pressure": -0.04},
        "speed_up": {"demand_spike": 0.07, "delay_shock": -0.03, "price_pressure": 0.02},
        "cost_cut": {"demand_spike": -0.05, "delay_shock": -0.06, "price_pressure": 0.06},
    }

    payoffs: Dict[str, Dict[str, List[float]]] = {}
    for ys in YOU_STRATEGIES:
        payoffs[ys] = {}
        for ms in MARKET_STRATEGIES:
            you_payoff = base_you + strategy_effects.get(ys, {}).get(ms, 0.0)
            # Market payoff: inverse competitive pressure with slight strategy bias.
            market_payoff = (0.20 + 0.50 * risk + 0.30 * fragility_score) - (0.40 * inventory + 0.35 * delivery) - you_payoff * 0.25
            payoffs[ys][ms] = [float(you_payoff), float(market_payoff)]

    return {
        "you_strategies": list(YOU_STRATEGIES),
        "market_strategies": list(MARKET_STRATEGIES),
        "payoffs": payoffs,
    }


def game_advice_v0(*, kpi: dict, fragility: dict, allowed_objects: list[str]) -> dict:
    """
    Compute a lightweight minimax recommendation for strategy mode overlays.
    """
    matrix = build_payoff_matrix(kpi, fragility)
    payoffs = matrix.get("payoffs", {})

    mins: Dict[str, float] = {}
    for ys in YOU_STRATEGIES:
        row = payoffs.get(ys, {})
        vals = []
        for ms in MARKET_STRATEGIES:
            pair = row.get(ms, [0.0, 0.0])
            vals.append(_fnum(pair[0], 0.0))
        mins[ys] = min(vals) if vals else 0.0

    recommended = max(mins.items(), key=lambda kv: kv[1])[0] if mins else YOU_STRATEGIES[0]
    worst_case_payoff = mins.get(recommended, 0.0)

    rationale = (
        f"Selected {recommended} via minimax: strongest worst-case payoff "
        f"({worst_case_payoff:.2f}) under uncertain market response."
    )

    return {
        "players": [YOU_PLAYER, MARKET_PLAYER],
        "payoff_matrix": matrix,
        "recommendation": {
            "recommended_strategy": recommended,
            "rationale": rationale,
            "method": "minimax_v0",
            "risk_tradeoff": {
                "worst_case_payoff": float(worst_case_payoff),
                "fragility_score": _clamp01((fragility or {}).get("score", 0.0)),
            },
        },
        "notes": {
            "hud": "Heuristic game layer (v0), not an optimization solver.",
            "allowed_objects_count": len([x for x in (allowed_objects or []) if isinstance(x, str)]),
        },
    }
