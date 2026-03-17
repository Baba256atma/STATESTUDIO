"""Deterministic object extraction for system modeling."""

from __future__ import annotations

import re
from dataclasses import dataclass

from backend.engines.system_modeling.model_schema import SystemObject


@dataclass(frozen=True)
class _ObjectDefinition:
    aliases: tuple[str, ...]
    object_id: str
    object_type: str
    name: str
    description: str


_OBJECT_DEFINITIONS: tuple[_ObjectDefinition, ...] = (
    _ObjectDefinition(("company", "firm", "business"), "obj_company", "actor", "Company", "Organization attempting to manage the system."),
    _ObjectDefinition(("supplier", "suppliers", "vendor", "vendors"), "obj_supplier", "actor", "Supplier", "Entity providing materials, services, or upstream capacity."),
    _ObjectDefinition(("customer", "customers", "buyer", "buyers", "client", "clients"), "obj_customer", "actor", "Customer", "Demand-side actor affected by system performance."),
    _ObjectDefinition(("inventory", "stock", "buffer"), "obj_inventory", "resource", "Inventory", "Stored goods or operational buffer used to absorb disruption."),
    _ObjectDefinition(("market", "industry"), "obj_market", "environment", "Market", "External environment shaping demand, price, and competitive pressure."),
    _ObjectDefinition(("competitor", "competitors", "rival", "rivals"), "obj_competitor", "actor", "Competitor", "External actor competing for demand, capital, or attention."),
    _ObjectDefinition(("startup", "startups"), "obj_startup", "actor", "Startup", "Emerging company competing for growth, talent, and capital."),
    _ObjectDefinition(("government", "state"), "obj_government", "actor", "Government", "Public authority influencing policy, regulation, and force."),
    _ObjectDefinition(("regulator", "regulators"), "obj_regulator", "actor", "Regulator", "Institution imposing formal policy or compliance constraints."),
    _ObjectDefinition(("population", "public", "citizens"), "obj_population", "actor", "Population", "Civil population experiencing system outcomes."),
    _ObjectDefinition(("bank", "banks"), "obj_bank", "actor", "Banking System", "Financial institutions transmitting credit and liquidity conditions."),
    _ObjectDefinition(("central bank",), "obj_central_bank", "actor", "Central Bank", "Monetary authority influencing liquidity and interest rates."),
    _ObjectDefinition(("leadership", "management", "executive team"), "obj_leadership", "actor", "Leadership", "Decision-making group steering organizational direction."),
    _ObjectDefinition(("team", "teams", "department", "departments", "organization"), "obj_team", "actor", "Organization Team", "Internal group executing operational work."),
    _ObjectDefinition(("technology", "platform", "system", "software"), "obj_technology", "system", "Technology Platform", "Technology stack or platform being adopted or operated."),
    _ObjectDefinition(("workforce", "employees", "staff"), "obj_workforce", "actor", "Workforce", "People carrying operational and organizational load."),
    _ObjectDefinition(("logistics", "distribution", "transport"), "obj_logistics", "system", "Logistics Network", "Movement and coordination layer for goods or services."),
    _ObjectDefinition(("investor", "investors", "capital"), "obj_investor", "actor", "Investor", "Capital providers influencing growth and survival."),
)


class SystemObjectExtractor:
    """Extract system objects from natural language descriptions."""

    def extract(self, text: str) -> list[SystemObject]:
        """Return ordered unique objects found in the input text."""
        normalized = _normalize(text)
        matched: list[tuple[int, _ObjectDefinition]] = []
        seen: set[str] = set()
        for definition in _OBJECT_DEFINITIONS:
            position = _first_match_position(normalized, definition.aliases)
            if position is None or definition.object_id in seen:
                continue
            seen.add(definition.object_id)
            matched.append((position, definition))

        matched.sort(key=lambda item: item[0])
        objects = [
            SystemObject(
                id=definition.object_id,
                type=definition.object_type,
                name=definition.name,
                description=definition.description,
            )
            for _, definition in matched
        ]
        if not objects:
            objects.append(
                SystemObject(
                    id="obj_system",
                    type="system",
                    name="Core System",
                    description="Primary system described by the problem statement.",
                )
            )
        return objects


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def _first_match_position(text: str, aliases: tuple[str, ...]) -> int | None:
    positions = [
        match.start()
        for alias in aliases
        if (match := re.search(rf"\b{re.escape(alias)}\b", text))
    ]
    return min(positions) if positions else None
