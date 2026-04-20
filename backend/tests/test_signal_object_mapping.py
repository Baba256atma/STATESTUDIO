from __future__ import annotations

import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (BACKEND_DIR, ROOT_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from ingestion.schemas import Signal, SignalBundle, SourceDocument
from mapping.service import map_signals_to_objects


def _bundle(*signals: Signal) -> SignalBundle:
    return SignalBundle(
        source=SourceDocument(
            id="src_test",
            type="text",
            raw_content="inventory shortage causing delivery delay",
            metadata={"domain": "retail"},
        ),
        signals=list(signals),
    )


def test_mapping_simple_case_prefers_inventory_and_delivery() -> None:
    bundle = _bundle(
        Signal(
            id="sig_1",
            type="delay",
            label="Schedule / delivery delay",
            description="inventory shortage causing delivery delay",
            entities=["inventory", "delivery"],
            strength=0.8,
            source_id="src_test",
        )
    )

    result = map_signals_to_objects(bundle)

    selected_ids = [impact.object_id for impact in [*result.primary, *result.affected]]
    assert "obj_inventory" in selected_ids or "obj_delivery" in selected_ids
    assert any(impact.reasons for impact in result.primary + result.affected)


def test_mapping_multi_signal_stays_deterministic() -> None:
    bundle = _bundle(
        Signal(
            id="sig_1",
            type="cost",
            label="Cost / margin pressure",
            description="cost pressure is increasing across delivery",
            entities=["cost", "delivery"],
            strength=0.7,
            source_id="src_test",
        ),
        Signal(
            id="sig_2",
            type="demand",
            label="Demand shift",
            description="customer demand slowdown is weakening orders",
            entities=["customer", "demand"],
            strength=0.65,
            source_id="src_test",
        ),
        Signal(
            id="sig_3",
            type="delay",
            label="Schedule / delivery delay",
            description="supplier delay is stressing inventory and shipping",
            entities=["supplier", "inventory"],
            strength=0.82,
            source_id="src_test",
        ),
    )

    result_a = map_signals_to_objects(bundle)
    result_b = map_signals_to_objects(bundle)

    assert result_a.model_dump() == result_b.model_dump()
    assert 1 <= len(result_a.primary) <= 2
    assert len(result_a.affected) <= 3


def test_mapping_no_match_returns_empty_set() -> None:
    bundle = _bundle(
        Signal(
            id="sig_1",
            type="abstract",
            label="Abstract",
            description="astronomy telescope orbital nebula alignment",
            entities=["nebula"],
            strength=0.2,
            source_id="src_test",
        )
    )

    result = map_signals_to_objects(bundle)

    assert result.primary == []
    assert result.affected == []
    assert result.context == []
