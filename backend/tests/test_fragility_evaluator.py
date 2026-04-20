from __future__ import annotations

import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (BACKEND_DIR, ROOT_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from app.services.scanner.fragility_evaluator import evaluate_fragility
from ingestion.schemas import Signal, SignalBundle, SourceDocument
from mapping.schemas import ObjectImpact, ObjectImpactSet


def _bundle(*signals: Signal) -> SignalBundle:
    return SignalBundle(
        source=SourceDocument(
            id="src_eval",
            type="text",
            raw_content="scanner input",
            metadata={"domain": "retail"},
        ),
        signals=list(signals),
    )


def test_fragility_evaluator_basic_case_is_nonzero() -> None:
    result = evaluate_fragility(
        _bundle(
            Signal(
                id="sig_1",
                type="delay",
                label="Schedule / delivery delay",
                description="inventory shortage may delay delivery",
                entities=["inventory", "delivery"],
                strength=0.72,
                source_id="src_eval",
            )
        ),
        ObjectImpactSet(
            primary=[
                ObjectImpact(
                    object_id="obj_inventory",
                    role="primary",
                    score=0.84,
                    reasons=["matched keyword: inventory"],
                    source_signal_ids=["sig_1"],
                )
            ],
            affected=[
                ObjectImpact(
                    object_id="obj_delivery",
                    role="affected",
                    score=0.52,
                    reasons=["related to: obj_inventory"],
                    source_signal_ids=["sig_1"],
                )
            ],
            context=[],
        ),
    )

    assert result["fragility_score"] > 0
    assert result["fragility_level"] in {"moderate", "high", "critical"}


def test_fragility_evaluator_multi_pressure_scores_higher_than_basic() -> None:
    basic = evaluate_fragility(
        _bundle(
            Signal(
                id="sig_1",
                type="delay",
                label="Schedule / delivery delay",
                description="inventory shortage may delay delivery",
                entities=["inventory", "delivery"],
                strength=0.72,
                source_id="src_eval",
            )
        ),
        ObjectImpactSet(primary=[], affected=[], context=[]),
    )
    multi = evaluate_fragility(
        _bundle(
            Signal(
                id="sig_1",
                type="delay",
                label="Schedule / delivery delay",
                description="shipping delays are rising",
                entities=["delivery"],
                strength=0.76,
                source_id="src_eval",
            ),
            Signal(
                id="sig_2",
                type="cost",
                label="Cost / margin pressure",
                description="cost pressure is rising",
                entities=["cost"],
                strength=0.71,
                source_id="src_eval",
            ),
            Signal(
                id="sig_3",
                type="supply",
                label="Supplier stress",
                description="supplier instability is affecting inventory",
                entities=["supplier", "inventory"],
                strength=0.84,
                source_id="src_eval",
            ),
        ),
        ObjectImpactSet(
            primary=[
                ObjectImpact(
                    object_id="obj_inventory",
                    role="primary",
                    score=0.9,
                    reasons=["matched keyword: inventory"],
                    source_signal_ids=["sig_3"],
                ),
                ObjectImpact(
                    object_id="obj_delivery",
                    role="primary",
                    score=0.88,
                    reasons=["matched keyword: delivery"],
                    source_signal_ids=["sig_1"],
                ),
            ],
            affected=[],
            context=[],
        ),
    )

    assert multi["fragility_score"] > basic["fragility_score"]


def test_fragility_evaluator_low_risk_case_stays_low() -> None:
    result = evaluate_fragility(
        _bundle(
            Signal(
                id="sig_1",
                type="risk",
                label="Operational risk",
                description="system is stable with no major disruption detected",
                entities=["system"],
                strength=0.12,
                source_id="src_eval",
            )
        ),
        ObjectImpactSet(primary=[], affected=[], context=[]),
    )

    assert result["fragility_score"] < 0.28
    assert result["fragility_level"] == "low"
