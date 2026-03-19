"""Fragility-point detection for system modeling."""

from __future__ import annotations

from engines.system_modeling.model_schema import SystemFragilityPoint, SystemSignal


class SystemFragilityDetector:
    """Identify fragile thresholds implied by the problem description."""

    def detect(self, text: str, signals: list[SystemSignal]) -> list[SystemFragilityPoint]:
        """Return fragility points inferred from text and extracted signals."""
        normalized = text.lower()
        signal_names = {signal.name.lower() for signal in signals}
        fragility_points: list[SystemFragilityPoint] = []

        if "inventory level" in signal_names or ("inventory" in normalized and "shortage" in normalized):
            fragility_points.append(
                SystemFragilityPoint(
                    signal="inventory level",
                    threshold="critical shortage",
                )
            )

        if "operational cost" in signal_names or "cost" in normalized:
            fragility_points.append(
                SystemFragilityPoint(
                    signal="operational cost",
                    threshold="above sustainable level",
                )
            )

        if "legitimacy" in signal_names or ("protest" in normalized and "government" in normalized):
            fragility_points.append(
                SystemFragilityPoint(
                    signal="legitimacy",
                    threshold="loss of governing credibility",
                )
            )

        if "team morale" in signal_names or ("conflict" in normalized and "team" in normalized):
            fragility_points.append(
                SystemFragilityPoint(
                    signal="team morale",
                    threshold="persistent breakdown",
                )
            )

        if "adoption rate" in signal_names or ("adoption" in normalized and "technology" in normalized):
            fragility_points.append(
                SystemFragilityPoint(
                    signal="adoption rate",
                    threshold="below viable uptake",
                )
            )

        return fragility_points
