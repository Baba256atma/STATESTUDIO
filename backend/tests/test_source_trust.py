from __future__ import annotations

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (BACKEND_DIR, ROOT_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from app.connectors.source_trust import (
    apply_source_weight_to_signal,
    resolve_source_trust_label,
    resolve_source_trust_score,
)
from ingestion.schemas import Signal


def test_verified_web_trust_exceeds_csv() -> None:
    w = resolve_source_trust_score("web_source", {"trust_level": "verified"})
    c = resolve_source_trust_score("csv_upload", {})
    assert w == 1.0
    assert c == 0.7
    assert w > c


def test_apply_weight_clamps_and_copies_signal() -> None:
    s = Signal(
        id="s1",
        type="risk",
        label="Risk",
        description="x",
        strength=0.9,
        source_id="src",
        metadata={"k": 1},
    )
    out = apply_source_weight_to_signal(s, 0.7, "csv_upload")
    assert out is not s
    assert s.strength == 0.9
    assert abs(out.strength - 0.63) < 1e-6
    assert out.metadata["merge_trust_score"] == 0.7
    assert out.metadata["merge_source_connector"] == "csv_upload"


def test_resolve_source_trust_label_tiers() -> None:
    assert resolve_source_trust_label("web_source", {"trust_level": "verified"}) == "high"
    assert resolve_source_trust_label("csv_upload", {}) == "medium"
