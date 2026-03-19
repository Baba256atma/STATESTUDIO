"""Conflict detection for multi-actor strategy simulations."""

from __future__ import annotations

from engines.war_room.war_room_schema import WarRoomConflictEvent, WarRoomStrategy


class WarRoomConflictDetector:
    """Detect conflict events from actor strategy collisions."""

    def detect(self, time_step: int, selections: dict[str, WarRoomStrategy]) -> list[WarRoomConflictEvent]:
        """Emit conflict events for the current round of actor strategies."""
        events: list[WarRoomConflictEvent] = []
        chosen = list(selections.items())
        aggressive = [actor_id for actor_id, strategy in chosen if strategy.style == "aggressive"]
        cooperative = [actor_id for actor_id, strategy in chosen if strategy.style == "cooperative"]

        if len(aggressive) >= 2:
            events.append(
                WarRoomConflictEvent(
                    time=time_step,
                    type="market_share_battle",
                    actors=aggressive,
                    description="Multiple actors escalated aggressive strategies, increasing competitive pressure.",
                    severity="high",
                )
            )

        if any("supplier" in strategy.name.lower() for _, strategy in chosen) and len(chosen) >= 2:
            events.append(
                WarRoomConflictEvent(
                    time=time_step,
                    type="supply_chain_competition",
                    actors=[actor_id for actor_id, _ in chosen],
                    description="Competing actions around supply or sourcing increase resource contention.",
                    severity="medium",
                )
            )

        if cooperative and aggressive:
            events.append(
                WarRoomConflictEvent(
                    time=time_step,
                    type="cooperation_breakdown",
                    actors=sorted(set(cooperative + aggressive)),
                    description="Cooperative and aggressive strategies collided in the same round.",
                    severity="medium",
                )
            )

        return events
