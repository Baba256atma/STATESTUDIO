"""Scenario shock application for deterministic simulation."""

from __future__ import annotations

from engines.scenario_simulation.signal_state import SignalStateManager
from engines.scenario_simulation.simulation_schema import ScenarioShock


_SHOCK_ALIASES: dict[str, tuple[str, ...]] = {
    "demand": ("demand",),
    "supplier reliability": ("reliability", "supplier reliability"),
    "inventory": ("inventory", "inventory level"),
    "inventory level": ("inventory", "inventory level"),
    "cost": ("cost", "operational cost"),
    "operational cost": ("cost", "operational cost"),
    "risk": ("risk", "system risk"),
    "political pressure": ("pressure", "system pressure"),
    "pressure": ("pressure", "system pressure"),
    "adoption": ("adoption", "adoption rate"),
    "customer satisfaction": ("customer satisfaction",),
    "delay": ("delay",),
}


class ScenarioShockApplier:
    """Apply scenario shocks to normalized signal state."""

    def __init__(self, state_manager: SignalStateManager) -> None:
        self.state_manager = state_manager

    def apply(self, state: dict[str, float], shocks: list[ScenarioShock]) -> dict[str, float]:
        """Apply each configured shock to the current state."""
        updated = dict(state)
        for shock in shocks:
            for candidate in self._resolve_targets(shock.signal, updated):
                self.state_manager.apply_delta(updated, candidate, shock.delta)
        return updated

    def _resolve_targets(self, signal_name: str, state: dict[str, float]) -> list[str]:
        normalized = self.state_manager.normalize_name(signal_name)
        aliases = _SHOCK_ALIASES.get(normalized, (normalized,))
        return [key for key in state if any(alias in key for alias in aliases)]
