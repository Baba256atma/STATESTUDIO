"""Fragility monitoring for scenario simulation."""

from __future__ import annotations

from engines.scenario_simulation.signal_state import SignalStateManager
from engines.scenario_simulation.simulation_schema import SimulationEvent
from engines.system_modeling.model_schema import SystemFragilityPoint


class FragilityMonitor:
    """Detect threshold breaches and emit fragility events."""

    def __init__(self, state_manager: SignalStateManager) -> None:
        self.state_manager = state_manager

    def check(
        self,
        *,
        time_step: int,
        state: dict[str, float],
        fragility_points: list[SystemFragilityPoint],
        emitted_keys: set[tuple[int, str, str]],
    ) -> list[SimulationEvent]:
        """Return new fragility events for the current state."""
        events: list[SimulationEvent] = []
        for point in fragility_points:
            signal_key = self._resolve_signal(point.signal, state)
            if signal_key is None:
                continue
            threshold_kind, threshold_value = self._threshold_for(point.threshold, signal_key)
            breached = state[signal_key] <= threshold_value if threshold_kind == "min" else state[signal_key] >= threshold_value
            if not breached:
                continue
            event_key = (time_step, signal_key, point.threshold)
            if event_key in emitted_keys:
                continue
            emitted_keys.add(event_key)
            events.append(
                SimulationEvent(
                    time=time_step,
                    type="fragility_warning",
                    signal=signal_key,
                    severity="high" if abs(state[signal_key] - threshold_value) >= 0.15 else "medium",
                    message=f"{signal_key} crossed fragility threshold: {point.threshold}",
                )
            )
        return events

    def _resolve_signal(self, label: str, state: dict[str, float]) -> str | None:
        normalized = self.state_manager.normalize_name(label)
        for key in state:
            if normalized in key or key in normalized:
                return key
        return None

    def _threshold_for(self, threshold: str, signal_key: str) -> tuple[str, float]:
        normalized = threshold.strip().lower()
        if "critical shortage" in normalized:
            return ("min", 0.2)
        if "above sustainable" in normalized:
            return ("max", 0.8)
        if "loss of governing credibility" in normalized:
            return ("min", 0.25)
        if "persistent breakdown" in normalized:
            return ("min", 0.3)
        if "below viable uptake" in normalized:
            return ("min", 0.35)
        if any(token in signal_key for token in ("risk", "cost", "delay", "pressure", "panic", "protest", "security")):
            return ("max", 0.8)
        return ("min", 0.2)
