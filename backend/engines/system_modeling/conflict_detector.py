"""Conflict and tradeoff detection for system modeling."""

from __future__ import annotations

from engines.system_modeling.model_schema import SystemConflict, SystemObject


class SystemConflictDetector:
    """Identify strategic conflicts and tradeoffs from text."""

    def detect(self, text: str, objects: list[SystemObject]) -> list[SystemConflict]:
        """Return conflicts inferred from the problem description."""
        normalized = text.lower()
        actor_ids = [item.id for item in objects if item.type == "actor"] or [objects[0].id]
        conflicts: list[SystemConflict] = []

        if "cost" in normalized and any(token in normalized for token in ("resilience", "stability", "reliability", "shortage", "delay")):
            conflicts.append(
                SystemConflict(
                    name="Cost vs Resilience",
                    actors=actor_ids,
                    tradeoff=["cost reduction", "system resilience"],
                )
            )

        if any(token in normalized for token in ("growth", "expansion", "market share")) and any(
            token in normalized for token in ("stability", "cash", "burn", "risk")
        ):
            conflicts.append(
                SystemConflict(
                    name="Growth vs Stability",
                    actors=actor_ids,
                    tradeoff=["growth", "system stability"],
                )
            )

        if "security" in normalized and any(token in normalized for token in ("freedom", "adoption", "usability", "speed")):
            conflicts.append(
                SystemConflict(
                    name="Security vs Speed",
                    actors=actor_ids,
                    tradeoff=["security", "speed of adoption"],
                )
            )

        return conflicts
