"""Deterministic signal extraction for system modeling."""

from __future__ import annotations

import re
from dataclasses import dataclass

from engines.system_modeling.model_schema import SystemSignal


@dataclass(frozen=True)
class _SignalDefinition:
    aliases: tuple[str, ...]
    signal_id: str
    signal_type: str
    name: str


_SIGNAL_DEFINITIONS: tuple[_SignalDefinition, ...] = (
    _SignalDefinition(("cost", "costs", "expense", "expenses", "burn"), "sig_cost", "metric", "Operational Cost"),
    _SignalDefinition(("demand",), "sig_demand", "metric", "Demand"),
    _SignalDefinition(("revenue", "sales"), "sig_revenue", "metric", "Revenue"),
    _SignalDefinition(("margin", "profitability"), "sig_margin", "metric", "Margin"),
    _SignalDefinition(("inventory", "inventory level", "stock"), "sig_inventory", "metric", "Inventory Level"),
    _SignalDefinition(("delay", "delays", "lead time"), "sig_delay", "metric", "Delay"),
    _SignalDefinition(("customer satisfaction", "satisfaction"), "sig_customer_satisfaction", "metric", "Customer Satisfaction"),
    _SignalDefinition(("pressure", "overload"), "sig_pressure", "stress", "System Pressure"),
    _SignalDefinition(("risk", "uncertainty"), "sig_risk", "risk", "System Risk"),
    _SignalDefinition(("stability", "instability"), "sig_stability", "metric", "System Stability"),
    _SignalDefinition(("reliability", "unreliable"), "sig_reliability", "metric", "Reliability"),
    _SignalDefinition(("panic orders", "panic order"), "sig_panic_orders", "behavior", "Panic Orders"),
    _SignalDefinition(("protest", "protests", "unrest"), "sig_protest", "metric", "Protest Intensity"),
    _SignalDefinition(("legitimacy", "trust"), "sig_legitimacy", "metric", "Legitimacy"),
    _SignalDefinition(("inflation",), "sig_inflation", "metric", "Inflation"),
    _SignalDefinition(("unemployment",), "sig_unemployment", "metric", "Unemployment"),
    _SignalDefinition(("liquidity", "credit"), "sig_liquidity", "metric", "Liquidity"),
    _SignalDefinition(("morale",), "sig_morale", "metric", "Team Morale"),
    _SignalDefinition(("adoption", "adoption rate"), "sig_adoption", "metric", "Adoption Rate"),
    _SignalDefinition(("security", "breach"), "sig_security", "risk", "Security Risk"),
)


class SystemSignalExtractor:
    """Extract system signals from natural language descriptions."""

    def extract(self, text: str) -> list[SystemSignal]:
        """Return ordered unique signals found in the input text."""
        normalized = _normalize(text)
        matched: list[tuple[int, _SignalDefinition]] = []
        seen: set[str] = set()
        for definition in _SIGNAL_DEFINITIONS:
            position = _first_match_position(normalized, definition.aliases)
            if position is None or definition.signal_id in seen:
                continue
            seen.add(definition.signal_id)
            matched.append((position, definition))

        matched.sort(key=lambda item: item[0])
        return [
            SystemSignal(
                id=definition.signal_id,
                name=definition.name,
                type=definition.signal_type,
            )
            for _, definition in matched
        ]


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def _first_match_position(text: str, aliases: tuple[str, ...]) -> int | None:
    positions = [
        match.start()
        for alias in aliases
        if (match := re.search(rf"\b{re.escape(alias)}\b", text))
    ]
    return min(positions) if positions else None
