"""Strategy selection and interaction logic for the war-room engine."""

from __future__ import annotations

from backend.engines.decision_engine.decision_engine import StrategicDecisionEngine
from backend.engines.decision_engine.decision_schema import CandidateAction
from backend.engines.scenario_simulation.signal_state import SignalStateManager
from backend.engines.scenario_simulation.simulation_schema import ScenarioInput, ScenarioShock, SimulationResult
from backend.engines.system_modeling.model_schema import SystemModel
from backend.engines.war_room.war_room_schema import WarRoomActor, WarRoomStrategy


class StrategyInteractionEngine:
    """Select actor strategies and compute combined interaction shocks."""

    def __init__(self, decision_engine: StrategicDecisionEngine | None = None) -> None:
        self.decision_engine = decision_engine or StrategicDecisionEngine()
        self.state_manager = SignalStateManager()

    def select_strategies(
        self,
        *,
        actors: list[WarRoomActor],
        strategies_by_actor: dict[str, list[WarRoomStrategy]],
        system_model: SystemModel,
        baseline_simulation: SimulationResult,
        time_steps: int,
        current_state: dict[str, float],
        recommended_by_actor: dict[str, str],
    ) -> dict[str, WarRoomStrategy]:
        """Pick one strategy per actor using deterministic best-response heuristics."""
        selections: dict[str, WarRoomStrategy] = {}
        pressure = current_state.get("system pressure", current_state.get("pressure", 0.35))
        demand = current_state.get("demand", 0.5)
        risk = current_state.get("system risk", current_state.get("security risk", 0.3))

        for actor in actors:
            options = strategies_by_actor.get(actor.id, [])
            if not options:
                continue
            ranked = sorted(
                options,
                key=lambda item: self._score_strategy(
                    actor=actor,
                    strategy=item,
                    pressure=pressure,
                    demand=demand,
                    risk=risk,
                    recommended_id=recommended_by_actor.get(actor.id),
                ),
                reverse=True,
            )
            selections[actor.id] = ranked[0]
        return selections

    def recommend_actor_preferences(
        self,
        *,
        actors: list[WarRoomActor],
        strategies_by_actor: dict[str, list[WarRoomStrategy]],
        system_model: SystemModel,
        baseline_simulation: SimulationResult,
        time_steps: int,
    ) -> dict[str, str]:
        """Use the decision engine to derive one preferred strategy per actor."""
        preferred: dict[str, str] = {}
        for actor in actors:
            options = strategies_by_actor.get(actor.id, [])
            if not options:
                continue
            analysis = self.decision_engine.analyze(
                system_model=system_model,
                simulation=baseline_simulation,
                candidate_actions=[
                    CandidateAction(id=strategy.id, description=strategy.description)
                    for strategy in options
                ],
                scenario=ScenarioInput(time_steps=time_steps),
            )
            if analysis.recommended_action is not None:
                preferred[actor.id] = analysis.recommended_action.id
        return preferred

    def to_shocks(
        self,
        *,
        selections: dict[str, WarRoomStrategy],
        actors_by_id: dict[str, WarRoomActor],
    ) -> list[ScenarioShock]:
        """Convert actor strategies into scaled scenario shocks."""
        shocks: list[ScenarioShock] = []
        for actor_id, strategy in selections.items():
            actor = actors_by_id[actor_id]
            scale = round(0.6 + (0.4 * actor.influence), 4)
            for signal, delta in strategy.shocks.items():
                shocks.append(ScenarioShock(signal=signal, delta=max(min(delta * scale, 1.0), -1.0)))
        return shocks

    def interaction_shocks(self, selections: dict[str, WarRoomStrategy]) -> list[ScenarioShock]:
        """Add second-order shocks when actor strategies collide."""
        chosen = list(selections.values())
        aggressive_count = sum(1 for item in chosen if item.style == "aggressive")
        cooperative_count = sum(1 for item in chosen if item.style == "cooperative")
        shocks: list[ScenarioShock] = []
        if aggressive_count >= 2:
            shocks.extend(
                [
                    ScenarioShock(signal="pressure", delta=0.12),
                    ScenarioShock(signal="cost", delta=0.08),
                    ScenarioShock(signal="risk", delta=0.08),
                ]
            )
        if cooperative_count >= 2:
            shocks.extend(
                [
                    ScenarioShock(signal="pressure", delta=-0.08),
                    ScenarioShock(signal="risk", delta=-0.06),
                ]
            )
        if any("price" in item.name.lower() for item in chosen) and any("innovation" in item.name.lower() for item in chosen):
            shocks.append(ScenarioShock(signal="demand", delta=0.06))
        return shocks

    def _score_strategy(
        self,
        *,
        actor: WarRoomActor,
        strategy: WarRoomStrategy,
        pressure: float,
        demand: float,
        risk: float,
        recommended_id: str | None,
    ) -> float:
        score = 0.0
        if recommended_id == strategy.id:
            score += 0.25
        if actor.type.lower() in {"company", "alliance"} and any(token in strategy.name.lower() for token in ("supplier", "capacity", "alliance")):
            score += 0.18
        if actor.type.lower() == "competitor" and any(token in strategy.name.lower() for token in ("price", "innovation", "expand")):
            score += 0.16
        if actor.type.lower() == "government" and any(token in strategy.name.lower() for token in ("policy", "intervention", "regulation")):
            score += 0.18
        if pressure > 0.55 and strategy.style in {"defensive", "cooperative"}:
            score += 0.12
        if demand > 0.55 and strategy.style == "aggressive":
            score += 0.1
        if risk > 0.55 and strategy.style in {"defensive", "adaptive"}:
            score += 0.1
        score += 0.03 * len(strategy.shocks)
        return score
