from __future__ import annotations

from fastapi.testclient import TestClient

import main
from engines.compare_mode.compare_models import CompareInput
from engines.compare_mode.compare_service import run_compare


def _base_input() -> CompareInput:
    return CompareInput(
        focusDimension="risk",
        scenarioA={
            "scenario": {"id": "scenario:A", "title": "Stabilize Delivery"},
            "intelligence": {
                "active": True,
                "object_insights": [
                    {
                        "object_id": "obj_delivery",
                        "role": "source",
                        "strategic_priority": 0.82,
                        "pressure_score": 0.66,
                        "leverage_score": 0.44,
                        "fragility_score": 0.58,
                        "rationale": "Delivery remains pressured.",
                    },
                    {
                        "object_id": "obj_inventory",
                        "role": "bottleneck",
                        "strategic_priority": 0.72,
                        "pressure_score": 0.61,
                        "leverage_score": 0.49,
                        "fragility_score": 0.52,
                        "rationale": "Inventory is still exposed.",
                    },
                ],
                "path_insights": [
                    {
                        "path_id": "path:a",
                        "source_object_id": "obj_delivery",
                        "target_object_id": "obj_inventory",
                        "path_strength": 0.62,
                        "path_role": "primary",
                        "significance_score": 0.68,
                        "rationale": "Primary path remains active.",
                    }
                ],
                "summary": {
                    "headline": "A",
                    "summary": "A",
                    "key_signal": "A",
                    "suggested_focus_object_id": "obj_delivery",
                    "suggested_mode": "decision",
                },
                "advice": [],
                "meta": {"engine_version": "system_intelligence_v1"},
            },
        },
        scenarioB={
            "scenario": {"id": "scenario:B", "title": "Protect Inventory"},
            "intelligence": {
                "active": True,
                "object_insights": [
                    {
                        "object_id": "obj_delivery",
                        "role": "source",
                        "strategic_priority": 0.76,
                        "pressure_score": 0.48,
                        "leverage_score": 0.42,
                        "fragility_score": 0.36,
                        "rationale": "Delivery pressure is lower.",
                    },
                    {
                        "object_id": "obj_inventory",
                        "role": "protected",
                        "strategic_priority": 0.64,
                        "pressure_score": 0.33,
                        "leverage_score": 0.38,
                        "fragility_score": 0.28,
                        "rationale": "Inventory is better protected.",
                    },
                ],
                "path_insights": [
                    {
                        "path_id": "path:b",
                        "source_object_id": "obj_delivery",
                        "target_object_id": "obj_inventory",
                        "path_strength": 0.44,
                        "path_role": "secondary",
                        "significance_score": 0.48,
                        "rationale": "Path is calmer.",
                    }
                ],
                "summary": {
                    "headline": "B",
                    "summary": "B",
                    "key_signal": "B",
                    "suggested_focus_object_id": "obj_inventory",
                    "suggested_mode": "simulation",
                },
                "advice": [],
                "meta": {"engine_version": "system_intelligence_v1"},
            },
        },
    )


def test_compare_mode_detects_object_delta_and_winner():
    result = run_compare(_base_input())

    assert result.summary.winner in {"A", "B", "tie"}
    assert any(item.object_id == "obj_inventory" for item in result.object_deltas)
    assert len(result.tradeoffs) == 4
    assert len(result.advice) >= 1


def test_compare_mode_focus_weighting_changes_summary_mode():
    risk_result = run_compare(_base_input())
    growth_input = _base_input()
    growth_input.focusDimension = "growth"
    growth_result = run_compare(growth_input)

    assert risk_result.meta["comparison_mode"] == "risk"
    assert growth_result.meta["comparison_mode"] == "growth"


def test_compare_route_returns_payload():
    client = TestClient(main.app)
    response = client.post("/system/compare/run", json=_base_input().model_dump(mode="python"))

    assert response.status_code == 200
    payload = response.json()["comparison"]
    assert payload["meta"]["engine_version"] == "compare_mode_v1"
    assert isinstance(payload["tradeoffs"], list)
