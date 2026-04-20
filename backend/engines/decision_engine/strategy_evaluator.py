"""Strategy evaluation and scoring for Nexora decisions."""

from __future__ import annotations

from engines.decision_engine.decision_schema import CandidateAction, DecisionWeights, StrategyEvaluation
from engines.scenario_simulation.simulation_schema import SimulationResult


class StrategyEvaluator:
    """Convert simulated outcomes into comparable strategy scores."""

    def evaluate(
        self,
        *,
        action: CandidateAction,
        baseline: SimulationResult,
        result: SimulationResult,
        weights: DecisionWeights,
    ) -> StrategyEvaluation:
        """Return weighted decision metrics for a strategy."""
        baseline_state = baseline.final_state
        final_state = result.final_state

        baseline_risk = self._risk_score(baseline_state, len(baseline.events))
        strategy_risk = self._risk_score(final_state, len(result.events))
        strategy_cost = self._cost_score(final_state)
        resilience_score = self._resilience_score(baseline, result)
        stability_score = result.stability_score
        decision_score = round(
            (weights.stability_weight * stability_score)
            + (weights.resilience_weight * resilience_score)
            - (weights.cost_weight * strategy_cost)
            - (weights.risk_weight * strategy_risk),
            4,
        )

        return StrategyEvaluation(
            id=action.id,
            description=action.description,
            expected_outcome=self._expected_outcome(action, baseline, result),
            risk=strategy_risk,
            cost=strategy_cost,
            stability_score=stability_score,
            resilience_score=resilience_score,
            decision_score=decision_score,
            unintended_consequences=self._unintended_consequences(action, baseline_state, final_state, baseline_risk, strategy_risk),
            simulation=result,
        )

    def _risk_score(self, state: dict[str, float], event_count: int) -> float:
        values = [
            value
            for key, value in state.items()
            if any(token in key for token in ("risk", "cost", "delay", "pressure", "panic", "protest", "security"))
        ]
        average = sum(values) / len(values) if values else 0.3
        penalty = min(event_count * 0.02, 0.2)
        return round(min(1.0, average + penalty), 4)

    def _cost_score(self, state: dict[str, float]) -> float:
        cost_values = [value for key, value in state.items() if "cost" in key]
        return round(sum(cost_values) / len(cost_values), 4) if cost_values else 0.3

    def _resilience_score(self, baseline: SimulationResult, result: SimulationResult) -> float:
        baseline_events = len(baseline.events)
        result_events = len(result.events)
        event_improvement = max(baseline_events - result_events, 0) * 0.05
        stability_improvement = max(result.stability_score - baseline.stability_score, 0.0)
        score = 0.55 + event_improvement + (0.7 * stability_improvement)
        return round(min(1.0, max(0.0, score)), 4)

    def _expected_outcome(
        self,
        action: CandidateAction,
        baseline: SimulationResult,
        result: SimulationResult,
    ) -> str:
        parts: list[str] = []
        b_stab, r_stab = baseline.stability_score, result.stability_score
        if r_stab > b_stab + 0.01:
            parts.append(f"stability score moves {b_stab:.2f} → {r_stab:.2f}")

        b_risk = self._risk_score(baseline.final_state, len(baseline.events))
        r_risk = self._risk_score(result.final_state, len(result.events))
        if r_risk + 0.02 < b_risk:
            parts.append(f"modeled risk eases ({b_risk:.2f} → {r_risk:.2f})")

        delay_keys = [k for k in result.final_state if "delay" in k]
        if delay_keys:
            b_del = sum(baseline.final_state.get(k, 0.0) for k in delay_keys) / len(delay_keys)
            r_del = sum(result.final_state.get(k, 0.0) for k in delay_keys) / len(delay_keys)
            if r_del + 0.02 < b_del:
                parts.append("reduces average delay pressure vs baseline")

        if self._cost_score(result.final_state) + 0.03 < self._cost_score(baseline.final_state):
            parts.append("cost pressure eases vs baseline")

        if any("inventory" in key and result.final_state[key] > baseline.final_state.get(key, 0.0) for key in result.final_state):
            parts.append("inventory headroom improves")

        if any("reliability" in key and result.final_state[key] > baseline.final_state.get(key, 0.0) for key in result.final_state):
            parts.append("upstream reliability improves")

        if any("adoption" in key and result.final_state[key] > baseline.final_state.get(key, 0.0) for key in result.final_state):
            parts.append("adoption signal strengthens")

        if len(result.events) < len(baseline.events):
            parts.append("fewer fragility events than baseline path")

        if parts:
            return "; ".join(dict.fromkeys(parts))[:220]
        return f"{action.description.rstrip('.')} yields limited measurable lift vs baseline."

    def _unintended_consequences(
        self,
        action: CandidateAction,
        baseline_state: dict[str, float],
        final_state: dict[str, float],
        baseline_risk: float,
        strategy_risk: float,
    ) -> list[str]:
        consequences: list[str] = []
        if self._cost_score(final_state) > self._cost_score(baseline_state) + 0.05:
            consequences.append("Implementation cost increases materially.")
        demand_keys = [key for key in final_state if "demand" in key]
        if demand_keys and any(final_state[key] < baseline_state.get(key, 0.0) - 0.08 for key in demand_keys):
            consequences.append("Demand softens under the intervention.")
        if strategy_risk > baseline_risk + 0.03:
            consequences.append("Risk exposure increases despite the intervention.")
        if "pricing" in action.description.lower():
            consequences.append("Aggressive pricing can weaken demand if overused.")
        return consequences
