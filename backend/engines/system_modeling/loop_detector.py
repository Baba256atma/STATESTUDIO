"""Feedback-loop detection for system modeling."""

from __future__ import annotations

from backend.engines.system_modeling.model_schema import SystemLoop


class SystemLoopDetector:
    """Detect simple reinforcing and balancing loops from text and relationships."""

    def detect(self, text: str, relationships: list[dict]) -> list[SystemLoop]:
        """Return feedback loops inferred from the problem description."""
        normalized = text.lower()
        loops: list[SystemLoop] = []

        if all(token in normalized for token in ("delay", "shortage", "panic order")):
            loops.append(
                SystemLoop(
                    name="Supply Pressure Loop",
                    type="reinforcing",
                    path=[
                        "supplier delay",
                        "inventory shortage",
                        "panic orders",
                        "supplier overload",
                    ],
                )
            )

        if all(token in normalized for token in ("competition", "pricing", "margin")):
            loops.append(
                SystemLoop(
                    name="Competition Pricing Loop",
                    type="reinforcing",
                    path=[
                        "competitive pressure",
                        "price cuts",
                        "margin erosion",
                        "strategic stress",
                    ],
                )
            )

        if all(token in normalized for token in ("protest", "legitimacy", "instability")):
            loops.append(
                SystemLoop(
                    name="Legitimacy Instability Loop",
                    type="reinforcing",
                    path=[
                        "political instability",
                        "public protest",
                        "state pressure",
                        "legitimacy decline",
                    ],
                )
            )

        if not loops and len(relationships) >= 3:
            loops.append(
                SystemLoop(
                    name="Operational Pressure Loop",
                    type="reinforcing",
                    path=[
                        relationships[0]["from"],
                        relationships[0]["to"],
                        relationships[1]["to"],
                        relationships[2]["to"],
                    ],
                )
            )

        return loops
