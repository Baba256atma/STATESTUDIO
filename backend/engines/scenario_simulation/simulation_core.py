"""Core deterministic simulation loop for scenario evolution."""

from __future__ import annotations

from backend.engines.scenario_simulation.fragility_monitor import FragilityMonitor
from backend.engines.scenario_simulation.loop_executor import LoopExecutor
from backend.engines.scenario_simulation.signal_state import SignalStateManager
from backend.engines.scenario_simulation.simulation_schema import ScenarioInput, SimulationResult, SimulationStep
from backend.engines.system_modeling.model_schema import SystemModel, SystemObject, SystemRelationship


_OBJECT_SIGNAL_AFFINITIES: dict[str, tuple[str, ...]] = {
    "obj_supplier": ("reliability", "delay", "pressure", "cost"),
    "obj_inventory": ("inventory", "panic", "cost"),
    "obj_customer": ("customer satisfaction", "demand", "revenue"),
    "obj_company": ("cost", "margin", "risk", "stability"),
    "obj_market": ("demand", "margin", "adoption"),
    "obj_competitor": ("demand", "margin", "pressure"),
    "obj_startup": ("margin", "risk", "adoption", "liquidity"),
    "obj_government": ("legitimacy", "protest", "pressure"),
    "obj_regulator": ("cost", "pressure", "stability"),
    "obj_population": ("protest", "legitimacy", "demand"),
    "obj_bank": ("liquidity", "risk", "stability"),
    "obj_central_bank": ("liquidity", "stability", "cost"),
    "obj_leadership": ("stability", "morale", "risk"),
    "obj_team": ("morale", "stability", "pressure"),
    "obj_technology": ("adoption", "security", "reliability"),
    "obj_workforce": ("morale", "pressure", "stability"),
    "obj_logistics": ("delay", "inventory", "cost"),
    "obj_investor": ("liquidity", "growth", "risk"),
}

_RELATION_EFFECTS: dict[str, float] = {
    "dependency": 0.02,
    "influence": 0.03,
    "control": 0.025,
    "competition": 0.03,
    "cooperation": 0.02,
}


class SimulationCore:
    """Run deterministic scenario simulations across time steps."""

    def __init__(
        self,
        *,
        state_manager: SignalStateManager,
        loop_executor: LoopExecutor,
        fragility_monitor: FragilityMonitor,
    ) -> None:
        self.state_manager = state_manager
        self.loop_executor = loop_executor
        self.fragility_monitor = fragility_monitor

    def run(self, *, system_model: SystemModel, scenario: ScenarioInput, initial_state: dict[str, float]) -> SimulationResult:
        """Execute the simulation timeline and return final state and events."""
        timeline = [SimulationStep(t=0, signals=dict(initial_state))]
        current_state = dict(initial_state)
        events = []
        emitted_keys: set[tuple[int, str, str]] = set()

        for time_step in range(1, scenario.time_steps + 1):
            propagated = self._propagate_relationships(current_state, system_model.objects, system_model.relationships)
            looped = self.loop_executor.apply(propagated, system_model.loops)
            current_state = self._apply_natural_drift(looped)
            step_events = self.fragility_monitor.check(
                time_step=time_step,
                state=current_state,
                fragility_points=system_model.fragility_points,
                emitted_keys=emitted_keys,
            )
            events.extend(step_events)
            timeline.append(SimulationStep(t=time_step, signals=dict(current_state)))

        stability_score = self._stability_score(current_state, len(events))
        return SimulationResult(
            timeline=timeline,
            events=events,
            final_state=current_state,
            stability_score=stability_score,
            metadata={
                "time_steps": scenario.time_steps,
                "event_count": len(events),
            },
        )

    def _propagate_relationships(
        self,
        state: dict[str, float],
        objects: list[SystemObject],
        relationships: list[SystemRelationship],
    ) -> dict[str, float]:
        updated = dict(state)
        objects_by_id = {item.id: item for item in objects}
        for relationship in relationships:
            source = objects_by_id.get(relationship.from_object)
            target = objects_by_id.get(relationship.to_object)
            if source is None or target is None:
                continue
            source_keys = self._signal_keys_for_object(source.id, updated)
            target_keys = self._signal_keys_for_object(target.id, updated)
            if not source_keys or not target_keys:
                continue
            source_pressure = sum(updated[key] for key in source_keys) / len(source_keys)
            relation_effect = _RELATION_EFFECTS.get(relationship.type, 0.02)
            for key in target_keys:
                delta = self._delta_for_signal(key, relationship.type, source_pressure, relation_effect)
                self.state_manager.apply_delta(updated, key, delta)
        return updated

    def _signal_keys_for_object(self, object_id: str, state: dict[str, float]) -> list[str]:
        affinities = _OBJECT_SIGNAL_AFFINITIES.get(object_id, ())
        return [key for key in state if any(alias in key for alias in affinities)]

    def _delta_for_signal(self, signal_key: str, relation_type: str, source_pressure: float, relation_effect: float) -> float:
        magnitude = relation_effect * max(source_pressure - 0.5, 0.0)
        if relation_type == "competition":
            if any(token in signal_key for token in ("margin", "stability", "satisfaction", "liquidity", "morale", "legitimacy")):
                return -magnitude
            return magnitude
        if relation_type == "cooperation":
            if any(token in signal_key for token in ("risk", "cost", "delay", "pressure", "panic", "protest", "security")):
                return -magnitude
            return magnitude
        if any(token in signal_key for token in ("reliability", "stability", "satisfaction", "margin", "liquidity", "morale", "legitimacy", "adoption")):
            return -magnitude if relation_type in {"dependency", "influence"} else magnitude
        return magnitude

    def _apply_natural_drift(self, state: dict[str, float]) -> dict[str, float]:
        updated = dict(state)
        for key, value in state.items():
            if any(token in key for token in ("risk", "cost", "delay", "pressure", "panic", "protest", "security")):
                drift = -0.01 if value > 0.5 else 0.0
                self.state_manager.apply_delta(updated, key, drift)
            else:
                drift = 0.01 if value < 0.5 else 0.0
                self.state_manager.apply_delta(updated, key, drift)
        return updated

    def _stability_score(self, state: dict[str, float], event_count: int) -> float:
        risk_values = [
            value
            for key, value in state.items()
            if any(token in key for token in ("risk", "cost", "delay", "pressure", "panic", "protest", "security"))
        ]
        health_values = [
            value
            for key, value in state.items()
            if any(token in key for token in ("inventory", "reliability", "stability", "satisfaction", "margin", "liquidity", "morale", "legitimacy", "adoption"))
        ]
        average_risk = sum(risk_values) / len(risk_values) if risk_values else 0.3
        average_health = sum(health_values) / len(health_values) if health_values else 0.6
        score = 0.55 * average_health + 0.45 * (1.0 - average_risk) - min(event_count * 0.03, 0.25)
        return self.state_manager.clamp(score)
