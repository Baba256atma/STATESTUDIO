"""Strategy normalization for war-room actors."""

from __future__ import annotations

import re

from engines.war_room.war_room_schema import WarRoomStrategy


class StrategyModel:
    """Convert free-form strategy strings into typed strategy definitions."""

    def build(self, actor_id: str, strategy_name: str) -> WarRoomStrategy:
        """Return a deterministic strategy model from a free-form label."""
        normalized = self._normalize(strategy_name)
        return WarRoomStrategy(
            id=f"{actor_id}:{normalized.replace(' ', '_')}",
            actor_id=actor_id,
            name=strategy_name,
            style=self._style_for(normalized),
            description=strategy_name,
            shocks=self._shocks_for(normalized),
        )

    @staticmethod
    def _normalize(value: str) -> str:
        return re.sub(r"\s+", " ", value.strip().lower())

    def _style_for(self, normalized: str) -> str:
        if any(token in normalized for token in ("price war", "aggressive", "attack", "pressure", "expand", "reduce price")):
            return "aggressive"
        if any(token in normalized for token in ("defend", "protect", "hedge", "preserve")):
            return "defensive"
        if any(token in normalized for token in ("alliance", "cooperate", "partner", "diversify suppliers")):
            return "cooperative"
        return "adaptive"

    def _shocks_for(self, normalized: str) -> dict[str, float]:
        shocks: dict[str, float] = {}
        if "expand capacity" in normalized or "capacity" in normalized:
            shocks.update({"inventory": 0.18, "cost": 0.08})
        if "reduce price" in normalized or "price war" in normalized:
            shocks.update({"demand": 0.12, "cost": 0.06, "pressure": 0.08})
        if "diversify suppliers" in normalized or "supplier" in normalized:
            shocks.update({"supplier reliability": 0.18, "delay": -0.1, "cost": 0.05})
        if "product innovation" in normalized or "innovation" in normalized:
            shocks.update({"adoption": 0.18, "cost": 0.07})
        if "policy intervention" in normalized or "regulation" in normalized:
            shocks.update({"pressure": -0.12, "risk": -0.08, "cost": 0.04})
        if "alliance" in normalized or "cooperate" in normalized:
            shocks.update({"pressure": -0.08, "risk": -0.05})
        if "budget freeze" in normalized or "cost control" in normalized:
            shocks.update({"cost": -0.14, "pressure": 0.04})
        if "talent retention" in normalized or "retain talent" in normalized:
            shocks.update({"pressure": -0.05, "adoption": 0.08})
        return shocks or {"risk": -0.04}
