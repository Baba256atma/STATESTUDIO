"""B.13 — supply-chain object vocabulary (extends retail baseline, additive keywords)."""

from __future__ import annotations

from mapping.domain.retail_mapping import RETAIL_OBJECT_VOCABULARY


def _extend_keywords(
    object_id: str,
    extra: tuple[str, ...],
) -> dict[str, object]:
    base = dict(RETAIL_OBJECT_VOCABULARY[object_id])
    merged = tuple(dict.fromkeys(tuple(base.get("keywords", ())) + extra))
    base["keywords"] = merged
    return base


SUPPLY_CHAIN_OBJECT_VOCABULARY: dict[str, dict[str, object]] = {
    **RETAIL_OBJECT_VOCABULARY,
    "obj_supplier": _extend_keywords(
        "obj_supplier",
        (
            "tier 2",
            "tier-2",
            "subsupplier",
            "material flow",
            "upstream delay",
            "container",
            "allocation",
        ),
    ),
    "obj_delivery": _extend_keywords(
        "obj_delivery",
        (
            "lead time variance",
            "transit time",
            "dock delay",
            "inbound delay",
        ),
    ),
    "obj_throughput": _extend_keywords(
        "obj_throughput",
        (
            "line stoppage",
            "production slip",
            "wip",
        ),
    ),
}
