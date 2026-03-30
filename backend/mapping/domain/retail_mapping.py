"""Retail-first mapping vocabulary aligned with current Nexora scene objects."""

from __future__ import annotations


RETAIL_OBJECT_VOCABULARY: dict[str, dict[str, object]] = {
    "obj_inventory": {
        "keywords": (
            "inventory",
            "stock",
            "stockout",
            "shortage",
            "warehouse",
            "buffer",
            "backorder",
        ),
        "weight": 1.0,
        "related_objects": ("obj_delivery", "obj_supplier", "obj_cost"),
    },
    "obj_delivery": {
        "keywords": (
            "delivery",
            "delay",
            "shipping",
            "shipment",
            "fulfillment",
            "late",
            "logistics",
        ),
        "weight": 1.0,
        "related_objects": ("obj_inventory", "obj_customer", "obj_cost"),
    },
    "obj_supplier": {
        "keywords": (
            "supplier",
            "supply",
            "vendor",
            "procurement",
            "source",
            "reliance",
        ),
        "weight": 0.95,
        "related_objects": ("obj_inventory", "obj_delivery", "obj_risk_zone"),
    },
    "obj_cost": {
        "keywords": ("cost", "expense", "price", "margin", "budget", "inflation"),
        "weight": 0.84,
        "related_objects": ("obj_delivery", "obj_inventory", "obj_cashflow"),
    },
    "obj_cashflow": {
        "keywords": ("cash", "liquidity", "runway", "finance", "financial", "burn"),
        "weight": 0.82,
        "related_objects": ("obj_cost", "obj_inventory"),
    },
    "obj_customer": {
        "keywords": ("customer", "service", "sla", "satisfaction", "retention", "demand"),
        "weight": 0.76,
        "related_objects": ("obj_delivery", "obj_inventory"),
    },
    "obj_risk_zone": {
        "keywords": ("risk", "fragility", "uncertainty", "exposure", "issue", "instability"),
        "weight": 0.7,
        "related_objects": ("obj_supplier", "obj_delivery", "obj_inventory"),
    },
    "obj_process": {
        "keywords": ("process", "handoff", "workflow", "governance"),
        "weight": 0.64,
        "related_objects": ("obj_delivery", "obj_quality"),
    },
    "obj_quality": {
        "keywords": ("quality", "defect", "rework", "complaint"),
        "weight": 0.66,
        "related_objects": ("obj_delivery", "obj_customer"),
    },
    "obj_throughput": {
        "keywords": ("throughput", "capacity", "flow", "bottleneck", "output"),
        "weight": 0.68,
        "related_objects": ("obj_delivery", "obj_process"),
    },
}

