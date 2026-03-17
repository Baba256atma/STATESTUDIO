"""Strategy-to-simulation adapter for Nexora decisions."""

from __future__ import annotations

from backend.engines.decision_engine.decision_schema import CandidateAction
from backend.engines.scenario_simulation.scenario_engine import ScenarioSimulationEngine
from backend.engines.scenario_simulation.simulation_schema import ScenarioInput, ScenarioShock, SimulationResult
from backend.engines.system_modeling.model_schema import SystemModel


class StrategySimulator:
    """Apply strategy heuristics as scenario shocks and simulate outcomes."""

    def __init__(self, simulation_engine: ScenarioSimulationEngine | None = None) -> None:
        self.simulation_engine = simulation_engine or ScenarioSimulationEngine()

    def simulate(
        self,
        *,
        system_model: SystemModel,
        baseline_scenario: ScenarioInput,
        action: CandidateAction,
    ) -> tuple[SimulationResult, ScenarioInput]:
        """Simulate one action and return both the result and derived scenario."""
        scenario = ScenarioInput(
            shocks=[*baseline_scenario.shocks, *self._strategy_shocks(action)],
            time_steps=baseline_scenario.time_steps,
            metadata={"strategy_id": action.id},
        )
        return self.simulation_engine.simulate(system_model, scenario), scenario

    def _strategy_shocks(self, action: CandidateAction) -> list[ScenarioShock]:
        text = f"{action.id} {action.description}".lower()
        shocks: list[ScenarioShock] = []

        if "inventory" in text or "buffer" in text or "stock" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="inventory", delta=0.25),
                    ScenarioShock(signal="cost", delta=0.08),
                ]
            )
        if "supplier" in text or "diversify" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="supplier reliability", delta=0.2),
                    ScenarioShock(signal="cost", delta=0.06),
                    ScenarioShock(signal="delay", delta=-0.12),
                ]
            )
        if "cost" in text or "efficiency" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="cost", delta=-0.18),
                    ScenarioShock(signal="pressure", delta=-0.06),
                ]
            )
        if "pressure" in text or "de-escalation" in text or "intervention" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="pressure", delta=-0.2),
                    ScenarioShock(signal="risk", delta=-0.1),
                ]
            )
        if "adoption" in text or "training" in text or "enablement" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="adoption", delta=0.22),
                    ScenarioShock(signal="cost", delta=0.08),
                ]
            )
        if "security" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="risk", delta=-0.18),
                    ScenarioShock(signal="cost", delta=0.05),
                ]
            )
        if "legitimacy" in text or "governance" in text or "communication" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="pressure", delta=-0.12),
                    ScenarioShock(signal="risk", delta=-0.08),
                ]
            )
        if "liquidity" in text or "reserve" in text or "credit" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="risk", delta=-0.1),
                    ScenarioShock(signal="cost", delta=0.04),
                ]
            )
        if "pricing" in text or "capacity" in text:
            shocks.extend(
                [
                    ScenarioShock(signal="demand", delta=-0.05),
                    ScenarioShock(signal="cost", delta=-0.08),
                ]
            )

        return shocks or [ScenarioShock(signal="risk", delta=-0.08)]
