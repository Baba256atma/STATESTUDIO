from __future__ import annotations

import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (BACKEND_DIR, ROOT_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from app.routers.decision_router import router as decision_router


def _client() -> TestClient:
    app = FastAPI()
    app.include_router(decision_router)
    return TestClient(app)


def _baseline() -> dict:
    return {
        "ok": True,
        "summary": "Inventory and delivery pressure are active.",
        "summary_detail": {"text": "Inventory and delivery pressure are active.", "confidence": 0.82},
        "fragility_score": 0.74,
        "fragility_level": "high",
        "drivers": [],
        "signals": ["supply", "delay"],
        "object_impacts": {
            "primary": [{"object_id": "obj_supplier", "role": "primary", "score": 0.91, "reasons": ["signal: supply"], "source_signal_ids": ["sig_1"]}],
            "affected": [{"object_id": "obj_inventory", "role": "affected", "score": 0.73, "reasons": ["signal: delay"], "source_signal_ids": ["sig_2"]}],
            "context": [],
        },
        "scene_payload": {
            "highlighted_object_ids": ["obj_supplier", "obj_inventory"],
            "primary_object_ids": ["obj_supplier"],
            "affected_object_ids": ["obj_inventory"],
            "dim_unrelated_objects": True,
            "reasons_by_object": {"obj_supplier": ["signal: supply"]},
            "objects": [],
            "highlights": [],
            "suggested_focus": [],
            "scanner_overlay": None,
            "state_vector": {},
        },
        "advice_slice": {"title": "Advice", "summary": "Stabilize supply first.", "recommendations": ["Stabilize supplier coverage."]},
        "timeline_slice": {"events": []},
        "war_room_slice": {"headline": "High pressure", "posture": "defensive", "priorities": ["Stabilize supply"], "risks": ["Delivery delay"]},
        "findings": [],
        "suggested_objects": ["obj_supplier", "obj_inventory"],
        "suggested_actions": ["Stabilize supplier coverage."],
        "debug": None,
    }


def _scenario(
    *,
    scenario_type: str,
    summary: str,
    impact_level: str,
    primary: list[str],
    affected: list[str],
    steps: list[tuple[str, str, str, float]],
    advice: list[str],
) -> dict:
    return {
        "ok": True,
        "scenario_summary": summary,
        "scenario_type": scenario_type,
        "overall_impact_level": impact_level,
        "primary_objects": primary,
        "affected_objects": affected,
        "object_states": [
            {
                "object_id": object_id,
                "role": "primary" if object_id in primary else "affected",
                "impact_score": confidence,
                "state_change": "stress" if index == 0 else "watch",
                "reasons": ["deterministic scenario state"],
            }
            for index, (object_id, _label, _type, confidence) in enumerate(
                [(step[0], step[1], step[2], step[3]) for step in steps]
            )
        ],
        "propagation_steps": [
            {
                "id": f"step_{index + 1}",
                "order": index + 1,
                "label": label,
                "type": step_type,
                "source_object_ids": [source_object],
                "target_object_ids": [source_object],
                "confidence": confidence,
                "reason": "deterministic propagation",
            }
            for index, (source_object, label, step_type, confidence) in enumerate(steps)
        ],
        "scene_overlay": {
            "highlighted_object_ids": primary + affected,
            "primary_object_ids": primary,
            "affected_object_ids": affected,
            "dim_unrelated_objects": True,
            "overlay_labels_by_object": {object_id: "Watch closely" for object_id in primary + affected},
        },
        "timeline_slice": {
            "events": [
                {
                    "id": f"timeline_{index + 1}",
                    "label": label,
                    "type": step_type,
                    "order": index + 1,
                    "confidence": confidence,
                }
                for index, (_source_object, label, step_type, confidence) in enumerate(steps)
            ]
        },
        "advice_slice": {
            "title": "Scenario Advice",
            "summary": summary,
            "recommendations": advice,
        },
    }


def test_decision_engine_compares_two_options_and_recommends_best():
    payload = {
        "baseline": _baseline(),
        "scenarios": [
            _scenario(
                scenario_type="supplier_disruption",
                summary="Supplier stabilization keeps delivery impact moderate and contained.",
                impact_level="moderate",
                primary=["obj_supplier", "obj_inventory"],
                affected=["obj_delivery"],
                steps=[
                    ("obj_supplier", "Supplier stabilized", "decision", 0.84),
                    ("obj_inventory", "Inventory pressure eases", "propagation", 0.78),
                ],
                advice=["Stabilize supplier coverage first.", "Protect inventory buffer next."],
            ),
            _scenario(
                scenario_type="cost_pressure",
                summary="Cost reduction lowers spend but keeps customer and delivery exposure high.",
                impact_level="high",
                primary=["obj_cost", "obj_cashflow"],
                affected=["obj_delivery", "obj_customer"],
                steps=[
                    ("obj_cost", "Cost action starts", "decision", 0.72),
                    ("obj_cashflow", "Cash pressure remains", "propagation", 0.68),
                ],
                advice=["Cut discretionary spend.", "Monitor delivery exposure."],
            ),
        ],
        "decision_goal": "minimize delay",
    }

    with _client() as client:
        response = client.post("/decision/compare", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert len(data["comparison_result"]["options"]) == 2
    assert data["comparison_result"]["best_option_id"] == "decision_option_1"
    assert data["recommendation"]["recommended_option_id"] == "decision_option_1"
    assert data["recommendation"]["key_actions"]
    assert data["advice_slice"]["recommendations"]
    assert data["timeline_slice"]["events"]
    assert data["war_room_slice"]["headline"]
    assert len(data["comparison"]) == 2


def test_decision_engine_is_deterministic_for_same_input():
    payload = {
        "baseline": _baseline(),
        "scenarios": [
            _scenario(
                scenario_type="delivery_delay",
                summary="Delivery action contains downstream pressure.",
                impact_level="moderate",
                primary=["obj_delivery"],
                affected=["obj_customer"],
                steps=[("obj_delivery", "Delivery stabilized", "decision", 0.79)],
                advice=["Stabilize delivery first."],
            ),
            _scenario(
                scenario_type="cost_pressure",
                summary="Cost action contains spend but leaves delivery pressure elevated.",
                impact_level="high",
                primary=["obj_cost"],
                affected=["obj_delivery", "obj_customer"],
                steps=[("obj_cost", "Cost pressure adjusted", "decision", 0.66)],
                advice=["Contain cost exposure."],
            ),
        ],
    }

    with _client() as client:
        first = client.post("/decision/compare", json=payload)
        second = client.post("/decision/compare", json=payload)

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["comparison_result"] == second.json()["comparison_result"]
    assert first.json()["recommendation"] == second.json()["recommendation"]
