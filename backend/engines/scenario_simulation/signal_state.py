"""Signal state management for deterministic scenario simulation."""

from __future__ import annotations

from backend.engines.system_modeling.model_schema import SystemModel


_DEFAULT_SIGNAL_VALUES: dict[str, float] = {
    "inventory level": 0.6,
    "operational cost": 0.4,
    "delay": 0.3,
    "demand": 0.5,
    "revenue": 0.6,
    "margin": 0.5,
    "system risk": 0.3,
    "system stability": 0.7,
    "reliability": 0.65,
    "customer satisfaction": 0.7,
    "panic orders": 0.2,
    "system pressure": 0.35,
    "protest intensity": 0.2,
    "legitimacy": 0.65,
    "liquidity": 0.6,
    "team morale": 0.65,
    "adoption rate": 0.5,
    "security risk": 0.3,
}


class SignalStateManager:
    """Initialize and update normalized simulation signal state."""

    def initialize(self, system_model: SystemModel) -> dict[str, float]:
        """Create a normalized 0..1 state for all signals in the model."""
        state: dict[str, float] = {}
        for signal in system_model.signals:
            key = self.normalize_name(signal.name)
            state[key] = _DEFAULT_SIGNAL_VALUES.get(key, self._default_for_type(signal.type))
        return state

    @staticmethod
    def normalize_name(signal_name: str) -> str:
        """Normalize a signal name to a stable state key."""
        return (signal_name or "").strip().lower()

    @staticmethod
    def clamp(value: float) -> float:
        """Clamp signal values to the normalized state range."""
        if value < 0.0:
            return 0.0
        if value > 1.0:
            return 1.0
        return round(value, 4)

    def apply_delta(self, state: dict[str, float], signal_name: str, delta: float) -> None:
        """Apply a bounded delta to a signal if it exists."""
        key = self.normalize_name(signal_name)
        if key not in state:
            return
        state[key] = self.clamp(state[key] + delta)

    @staticmethod
    def _default_for_type(signal_type: str) -> float:
        if signal_type == "risk":
            return 0.3
        if signal_type == "stress":
            return 0.35
        if signal_type == "behavior":
            return 0.25
        return 0.5
