"""Main orchestrator for Nexora scenario simulation."""

from __future__ import annotations

from backend.engines.scenario_simulation.fragility_monitor import FragilityMonitor
from backend.engines.scenario_simulation.loop_executor import LoopExecutor
from backend.engines.scenario_simulation.shock_applier import ScenarioShockApplier
from backend.engines.scenario_simulation.signal_state import SignalStateManager
from backend.engines.scenario_simulation.simulation_core import SimulationCore
from backend.engines.scenario_simulation.simulation_schema import (
    ScenarioComparisonEntry,
    ScenarioComparisonResult,
    ScenarioInput,
    SimulationResult,
)
from backend.engines.system_modeling.model_schema import SystemModel


class ScenarioSimulationEngine:
    """Run deterministic scenario simulations from a system model."""

    def __init__(self) -> None:
        self.state_manager = SignalStateManager()
        self.shock_applier = ScenarioShockApplier(self.state_manager)
        self.loop_executor = LoopExecutor(self.state_manager)
        self.fragility_monitor = FragilityMonitor(self.state_manager)
        self.core = SimulationCore(
            state_manager=self.state_manager,
            loop_executor=self.loop_executor,
            fragility_monitor=self.fragility_monitor,
        )

    def simulate(self, system_model: SystemModel, scenario: ScenarioInput | None = None) -> SimulationResult:
        """Run the scenario simulation and return timeline output."""
        scenario = scenario or ScenarioInput()
        initial_state = self.state_manager.initialize(system_model)
        shocked_state = self.shock_applier.apply(initial_state, scenario.shocks)
        result = self.core.run(system_model=system_model, scenario=scenario, initial_state=shocked_state)
        result.metadata.update(
            {
                "initial_state": initial_state,
                "shocked_state": shocked_state,
            }
        )
        return result

    def compare(
        self,
        system_model: SystemModel,
        scenarios: dict[str, ScenarioInput],
    ) -> ScenarioComparisonResult:
        """Run multiple named scenarios and compare their stability outcomes."""
        baseline = self.simulate(system_model, ScenarioInput())
        scenario_results = [
            ScenarioComparisonEntry(
                scenario_name=name,
                result=self.simulate(system_model, scenario),
            )
            for name, scenario in scenarios.items()
        ]
        ranked = sorted(scenario_results, key=lambda item: item.result.stability_score, reverse=True)
        return ScenarioComparisonResult(
            baseline=baseline,
            scenarios=scenario_results,
            best_scenario=ranked[0].scenario_name if ranked else None,
            worst_scenario=ranked[-1].scenario_name if ranked else None,
        )
