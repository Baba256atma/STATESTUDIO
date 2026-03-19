"""Actor defaults and helpers for the Nexora war-room engine."""

from __future__ import annotations

from engines.war_room.war_room_schema import WarRoomActor


_DEFAULTS: dict[str, dict[str, object]] = {
    "company": {
        "objectives": ["stability", "margin", "resilience"],
        "resources": 0.7,
        "influence": 0.7,
    },
    "competitor": {
        "objectives": ["market share", "pressure", "growth"],
        "resources": 0.65,
        "influence": 0.65,
    },
    "government": {
        "objectives": ["stability", "legitimacy", "control"],
        "resources": 0.8,
        "influence": 0.8,
    },
    "market": {
        "objectives": ["demand", "price balance", "adaptation"],
        "resources": 0.75,
        "influence": 0.85,
    },
    "department": {
        "objectives": ["execution", "budget", "coordination"],
        "resources": 0.55,
        "influence": 0.45,
    },
    "alliance": {
        "objectives": ["cooperation", "stability", "shared leverage"],
        "resources": 0.7,
        "influence": 0.7,
    },
    "pressure_group": {
        "objectives": ["pressure", "concessions", "visibility"],
        "resources": 0.5,
        "influence": 0.6,
    },
}


class ActorModel:
    """Normalize actor definitions with deterministic defaults."""

    def normalize(self, actor: WarRoomActor) -> WarRoomActor:
        """Apply default objectives, resources, and influence by actor type."""
        defaults = _DEFAULTS.get(actor.type.lower(), {})
        return WarRoomActor(
            id=actor.id,
            type=actor.type,
            objectives=actor.objectives or list(defaults.get("objectives", ["stability", "resilience"])),
            resources=actor.resources if actor.resources != 0.6 else float(defaults.get("resources", 0.6)),
            influence=actor.influence if actor.influence != 0.5 else float(defaults.get("influence", 0.5)),
        )
