"""Benchmark cases for Nexora local AI evaluation."""

from __future__ import annotations


BENCHMARK_CASES: list[dict] = [
    {
        "id": "supply_chain_fragility",
        "task": "analyze_scenario",
        "input_text": "A supplier delay is reducing inventory resilience and increasing delivery risk across the business system.",
        "expected_signals": ["delivery_risk", "inventory_pressure"],
        "expected_objects": ["supplier", "inventory", "delivery"],
    },
    {
        "id": "rising_operational_costs",
        "task": "analyze_scenario",
        "input_text": "Operating costs are rising faster than revenue, creating margin pressure and weakening business stability.",
        "expected_signals": ["cost_pressure", "margin_risk"],
        "expected_objects": ["operations", "revenue", "cost_base"],
    },
    {
        "id": "geopolitical_instability",
        "task": "analyze_scenario",
        "input_text": "Geopolitical instability is disrupting upstream supply access and increasing cross-border delivery uncertainty.",
        "expected_signals": ["supply_risk", "delivery_uncertainty"],
        "expected_objects": ["supplier", "delivery", "risk_zone"],
    },
    {
        "id": "product_launch_risk",
        "task": "explain",
        "input_text": "A new product launch depends on marketing timing, inventory readiness, and fulfillment reliability. Explain the main risk dynamics.",
        "expected_signals": ["launch_risk"],
        "expected_objects": ["inventory", "delivery", "demand"],
    },
    {
        "id": "delayed_logistics",
        "task": "extract_objects",
        "input_text": "Logistics delays are causing late deliveries, customer complaints, and inventory imbalance.",
        "expected_signals": ["delivery_delay"],
        "expected_objects": ["delivery", "inventory", "customer"],
    },
]
