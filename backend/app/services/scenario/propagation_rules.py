"""Deterministic propagation rule chains for Scenario Simulation Lite."""

from __future__ import annotations

from typing import Any


RuleStep = dict[str, Any]


SCENARIO_RULES: dict[str, list[RuleStep]] = {
    "supplier_disruption": [
        {
            "object_id": "obj_supplier",
            "state_change": "stress",
            "label": "Supplier disruption intensifies",
            "type": "shock",
            "reason": "Supplier-side instability tightens inbound reliability first.",
        },
        {
            "object_id": "obj_inventory",
            "state_change": "stress",
            "label": "Inventory buffer tightens",
            "type": "propagation",
            "reason": "Supplier disruption reduces buffer resilience and raises stock pressure.",
        },
        {
            "object_id": "obj_delivery",
            "state_change": "delay",
            "label": "Delivery risk rises",
            "type": "propagation",
            "reason": "Inventory pressure flows into fulfillment and delivery timing.",
        },
        {
            "object_id": "obj_customer",
            "state_change": "watch",
            "label": "Customer pressure builds",
            "type": "outcome",
            "reason": "Persistent delivery pressure starts to affect service reliability.",
        },
    ],
    "cost_pressure": [
        {
            "object_id": "obj_cost",
            "state_change": "increase",
            "label": "Cost pressure rises",
            "type": "shock",
            "reason": "Input or operating costs increase the system's commercial pressure.",
        },
        {
            "object_id": "obj_cashflow",
            "state_change": "stress",
            "label": "Cash pressure tightens",
            "type": "propagation",
            "reason": "Rising costs compress cash flexibility and reduce room to absorb shocks.",
        },
        {
            "object_id": "obj_customer",
            "state_change": "watch",
            "label": "Customer sensitivity increases",
            "type": "outcome",
            "reason": "Commercial pressure can spill into price sensitivity and customer response.",
        },
    ],
    "demand_spike": [
        {
            "object_id": "obj_inventory",
            "state_change": "stress",
            "label": "Inventory depletion accelerates",
            "type": "shock",
            "reason": "A demand spike consumes available inventory faster than normal operations.",
        },
        {
            "object_id": "obj_delivery",
            "state_change": "delay",
            "label": "Service bottleneck forms",
            "type": "propagation",
            "reason": "Inventory strain creates downstream pressure on fulfillment and delivery flow.",
        },
        {
            "object_id": "obj_customer",
            "state_change": "watch",
            "label": "Customer impact risk rises",
            "type": "outcome",
            "reason": "If service bottlenecks persist, customer experience becomes exposed.",
        },
    ],
    "delivery_delay": [
        {
            "object_id": "obj_delivery",
            "state_change": "delay",
            "label": "Delivery delay deepens",
            "type": "shock",
            "reason": "Delivery instability increases execution pressure immediately.",
        },
        {
            "object_id": "obj_customer",
            "state_change": "watch",
            "label": "Service pressure grows",
            "type": "propagation",
            "reason": "Delayed delivery increases customer-facing pressure and response risk.",
        },
        {
            "object_id": "obj_risk_zone",
            "state_change": "stress",
            "label": "Operational risk accumulates",
            "type": "outcome",
            "reason": "Sustained delay increases visible operating uncertainty across the system.",
        },
    ],
    "operational_weakness": [
        {
            "object_id": "obj_process",
            "state_change": "stress",
            "label": "Operational inconsistency grows",
            "type": "shock",
            "reason": "Process weakness reduces coordination and execution stability first.",
        },
        {
            "object_id": "obj_delivery",
            "state_change": "delay",
            "label": "Fulfillment delay risk rises",
            "type": "propagation",
            "reason": "Operational inconsistency creates friction in delivery and handoffs.",
        },
        {
            "object_id": "obj_customer",
            "state_change": "watch",
            "label": "Service reliability comes under watch",
            "type": "outcome",
            "reason": "Process-driven delay risk eventually becomes visible to customers.",
        },
    ],
    "generic_instability": [
        {
            "object_id": "obj_risk_zone",
            "state_change": "stress",
            "label": "System instability rises",
            "type": "shock",
            "reason": "General instability first appears as broader system pressure.",
        },
        {
            "object_id": "obj_inventory",
            "state_change": "watch",
            "label": "Inventory resilience comes under watch",
            "type": "propagation",
            "reason": "Broader instability can quickly spill into inventory reliability.",
        },
        {
            "object_id": "obj_delivery",
            "state_change": "watch",
            "label": "Delivery reliability comes under watch",
            "type": "outcome",
            "reason": "If instability persists, execution reliability is the next visible pressure point.",
        },
    ],
}


def classify_scenario_type(scenario_text: str) -> str:
    """Classify the scenario type using deterministic keyword rules."""
    text = " ".join(str(scenario_text or "").strip().lower().split())
    if any(token in text for token in ("supplier", "vendor", "procurement", "supply", "source")):
        return "supplier_disruption"
    if any(token in text for token in ("cost", "costs", "price", "pricing", "margin", "inflation", "expense")):
        return "cost_pressure"
    if any(token in text for token in ("demand spike", "demand surge", "surge", "spike", "volume jump")):
        return "demand_spike"
    if any(token in text for token in ("delivery", "shipping", "shipment", "logistics", "delay")):
        return "delivery_delay"
    if any(token in text for token in ("operations", "operational", "staffing", "fulfillment", "process", "bottleneck")):
        return "operational_weakness"
    return "generic_instability"


def estimate_scenario_severity(scenario_text: str) -> float:
    """Estimate deterministic scenario severity from explicit language."""
    text = " ".join(str(scenario_text or "").strip().lower().split())
    if any(token in text for token in ("critical", "severe", "sharply", "worsens", "collapse", "fails")):
        return 0.9
    if any(token in text for token in ("minor", "small", "slight", "limited", "stable", "remain stable", "fluctuation")):
        return 0.38
    if any(token in text for token in ("moderate", "gradual", "slowly")):
        return 0.56
    return 0.72


def get_rule_chain(scenario_type: str) -> list[RuleStep]:
    """Return the propagation rule chain for a scenario type."""
    return list(SCENARIO_RULES.get(scenario_type, SCENARIO_RULES["generic_instability"]))
