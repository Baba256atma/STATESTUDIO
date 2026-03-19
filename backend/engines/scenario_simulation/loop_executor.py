"""Feedback loop execution for deterministic simulation."""

from __future__ import annotations

from engines.scenario_simulation.signal_state import SignalStateManager
from engines.system_modeling.model_schema import SystemLoop


class LoopExecutor:
    """Apply reinforcing and balancing loop dynamics to signal state."""

    def __init__(self, state_manager: SignalStateManager) -> None:
        self.state_manager = state_manager

    def apply(self, state: dict[str, float], loops: list[SystemLoop]) -> dict[str, float]:
        """Apply loop effects for one time step."""
        updated = dict(state)
        for loop in loops:
            self._apply_loop(updated, loop)
        return updated

    def _apply_loop(self, state: dict[str, float], loop: SystemLoop) -> None:
        matched_keys = [self._match_signal_name(item, state) for item in loop.path]
        matched_keys = [item for item in matched_keys if item is not None]
        if not matched_keys:
            return

        average_state = sum(state[item] for item in matched_keys) / len(matched_keys)
        if loop.type == "reinforcing":
            delta = 0.03 * average_state
            for key in matched_keys:
                if any(token in key for token in ("reliability", "stability", "satisfaction", "margin", "liquidity", "morale", "legitimacy")):
                    self.state_manager.apply_delta(state, key, -delta)
                else:
                    self.state_manager.apply_delta(state, key, delta)
            return

        delta = 0.02 * average_state
        for key in matched_keys:
            if any(token in key for token in ("risk", "pressure", "delay", "cost", "panic", "protest")):
                self.state_manager.apply_delta(state, key, -delta)
            else:
                self.state_manager.apply_delta(state, key, delta)

    def _match_signal_name(self, label: str, state: dict[str, float]) -> str | None:
        normalized = self.state_manager.normalize_name(label)
        for key in state:
            if normalized in key or key in normalized:
                return key
        return None
