"""Main orchestrator for the Nexora Strategy War-Room Engine."""

from __future__ import annotations

from collections import defaultdict

from backend.engines.scenario_simulation.fragility_monitor import FragilityMonitor
from backend.engines.scenario_simulation.loop_executor import LoopExecutor
from backend.engines.scenario_simulation.shock_applier import ScenarioShockApplier
from backend.engines.scenario_simulation.signal_state import SignalStateManager
from backend.engines.scenario_simulation.simulation_core import SimulationCore
from backend.engines.scenario_simulation.simulation_schema import ScenarioInput
from backend.engines.war_room.actor_model import ActorModel
from backend.engines.war_room.conflict_detector import WarRoomConflictDetector
from backend.engines.war_room.outcome_evaluator import WarRoomOutcomeEvaluator
from backend.engines.war_room.strategy_interaction import StrategyInteractionEngine
from backend.engines.war_room.strategy_model import StrategyModel
from backend.engines.war_room.war_room_schema import (
    WarRoomActor,
    WarRoomResult,
    WarRoomSimulation,
    WarRoomTimelineStep,
)


class StrategyWarRoomEngine:
    """Run multi-actor strategic collision simulations over a shared system."""

    def __init__(self) -> None:
        self.actor_model = ActorModel()
        self.strategy_model = StrategyModel()
        self.state_manager = SignalStateManager()
        self.shock_applier = ScenarioShockApplier(self.state_manager)
        self.loop_executor = LoopExecutor(self.state_manager)
        self.fragility_monitor = FragilityMonitor(self.state_manager)
        self.core = SimulationCore(
            state_manager=self.state_manager,
            loop_executor=self.loop_executor,
            fragility_monitor=self.fragility_monitor,
        )
        self.interaction_engine = StrategyInteractionEngine()
        self.conflict_detector = WarRoomConflictDetector()
        self.outcome_evaluator = WarRoomOutcomeEvaluator()

    def run(self, simulation: WarRoomSimulation) -> WarRoomResult:
        """Execute a full war-room simulation."""
        actors = [self.actor_model.normalize(actor) for actor in simulation.actors]
        actors_by_id = {actor.id: actor for actor in actors}
        strategies_by_actor = {
            actor_id: [self.strategy_model.build(actor_id, item) for item in items]
            for actor_id, items in simulation.strategies.items()
        }
        baseline = self._baseline_simulation(simulation)
        recommended = self.interaction_engine.recommend_actor_preferences(
            actors=actors,
            strategies_by_actor=strategies_by_actor,
            system_model=simulation.system_model,
            baseline_simulation=baseline,
            time_steps=simulation.time_steps,
        )

        current_state = self.state_manager.initialize(simulation.system_model)
        timeline = [WarRoomTimelineStep(t=0, signals=dict(current_state), actor_strategies={})]
        fragility_events = []
        conflict_events = []
        emitted_keys: set[tuple[int, str, str]] = set()
        strategy_history: dict[str, list] = defaultdict(list)

        for time_step in range(1, simulation.time_steps + 1):
            selections = self.interaction_engine.select_strategies(
                actors=actors,
                strategies_by_actor=strategies_by_actor,
                system_model=simulation.system_model,
                baseline_simulation=baseline,
                time_steps=simulation.time_steps,
                current_state=current_state,
                recommended_by_actor=recommended,
            )
            for actor_id, strategy in selections.items():
                strategy_history[actor_id].append(strategy)

            current_state = self.shock_applier.apply(
                current_state,
                self.interaction_engine.to_shocks(selections=selections, actors_by_id=actors_by_id),
            )
            current_state = self.shock_applier.apply(
                current_state,
                self.interaction_engine.interaction_shocks(selections),
            )
            current_state = self.core._propagate_relationships(  # noqa: SLF001
                current_state,
                simulation.system_model.objects,
                simulation.system_model.relationships,
            )
            current_state = self.loop_executor.apply(current_state, simulation.system_model.loops)
            current_state = self.core._apply_natural_drift(current_state)  # noqa: SLF001

            conflict_events.extend(self.conflict_detector.detect(time_step, selections))
            fragility_events.extend(
                self.fragility_monitor.check(
                    time_step=time_step,
                    state=current_state,
                    fragility_points=simulation.system_model.fragility_points,
                    emitted_keys=emitted_keys,
                )
            )
            timeline.append(
                WarRoomTimelineStep(
                    t=time_step,
                    signals=dict(current_state),
                    actor_strategies={actor_id: strategy.name for actor_id, strategy in selections.items()},
                )
            )

        final_stability = self.core._stability_score(current_state, len(fragility_events) + len(conflict_events))  # noqa: SLF001
        actor_outcomes = self.outcome_evaluator.evaluate_actor_outcomes(
            actors=actors,
            strategy_history=strategy_history,
            final_state=current_state,
            baseline_stability=baseline.stability_score,
            final_stability=final_stability,
            conflict_count=len(conflict_events),
        )
        dominant = self.outcome_evaluator.dominant_strategy(actor_outcomes)
        fragility_summary = {
            "event_count": len(fragility_events),
            "signals": [event.signal for event in fragility_events],
            "thresholds": [point.signal for point in simulation.system_model.fragility_points],
        }
        return WarRoomResult(
            timeline=timeline,
            strategy_paths=actor_outcomes,
            actor_outcomes=actor_outcomes,
            conflict_events=conflict_events,
            system_fragility=fragility_summary,
            dominant_strategy=dominant,
            stability_score=final_stability,
            metadata={
                "time_steps": simulation.time_steps,
                "baseline_stability": baseline.stability_score,
                "recommended_preferences": recommended,
            },
        )

    def _baseline_simulation(self, simulation: WarRoomSimulation):
        return self.interaction_engine.decision_engine.simulation_engine.simulate(
            simulation.system_model,
            ScenarioInput(time_steps=simulation.time_steps),
        )
