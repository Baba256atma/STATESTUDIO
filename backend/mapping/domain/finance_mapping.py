"""Finance mapping vocabulary placeholder for future expansion."""

from __future__ import annotations


FINANCE_OBJECT_VOCABULARY: dict[str, dict[str, object]] = {
    "obj_cashflow": {
        "keywords": ("cash", "liquidity", "working capital", "runway", "debt"),
        "weight": 1.0,
        "related_objects": ("obj_cost",),
    },
    "obj_cost": {
        "keywords": ("cost", "expense", "margin", "pricing", "revenue"),
        "weight": 0.9,
        "related_objects": ("obj_cashflow",),
    },
}

