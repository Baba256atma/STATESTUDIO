from __future__ import annotations

import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (BACKEND_DIR, ROOT_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from app.engines.fragility_scoring import compute_fragility_score, map_score_to_level


def test_fragility_scoring_empty_signal_case():
    result = compute_fragility_score([])

    assert result["fragility_score"] == 0.0
    assert result["fragility_level"] == "low"
    assert result["dimension_scores"] == {}
    assert result["top_drivers"] == []


def test_fragility_scoring_high_signal_case():
    result = compute_fragility_score(
        [
            {
                "id": "sig_supplier_dependency",
                "label": "Supplier Dependency",
                "score": 0.9,
                "severity": "critical",
                "dimension": "dependency",
            },
            {
                "id": "sig_delay_risk",
                "label": "Delay Risk",
                "score": 0.85,
                "severity": "high",
                "dimension": "delivery",
            },
            {
                "id": "sig_recovery_weakness",
                "label": "Recovery Weakness",
                "score": 0.82,
                "severity": "high",
                "dimension": "resilience",
            },
        ]
    )

    assert result["fragility_score"] >= 0.8
    assert result["fragility_level"] in {"high", "critical"}
    assert "dependency" in result["dimension_scores"]
    assert result["top_drivers"][0]["id"] == "sig_supplier_dependency"


def test_fragility_level_mapping_correctness():
    assert map_score_to_level(0.1) == "low"
    assert map_score_to_level(0.4) == "medium"
    assert map_score_to_level(0.65) == "high"
    assert map_score_to_level(0.8) == "critical"
