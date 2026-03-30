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

from app.routers.scenario_router import router as scenario_router
from app.services.scenario.propagation_rules import classify_scenario_type


def _client() -> TestClient:
    app = FastAPI()
    app.include_router(scenario_router)
    return TestClient(app)


def test_supplier_disruption_scenario_simulation():
    with _client() as client:
        response = client.post(
            "/scenario/simulate",
            json={
                "scenario_text": "What if supplier instability worsens next week?",
                "domain": "retail",
                "max_steps": 4,
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["ok"] is True
    assert payload["scenario_type"] == "supplier_disruption"
    assert "obj_supplier" in payload["primary_objects"]
    assert payload["affected_objects"]
    assert payload["propagation_steps"]
    assert payload["timeline_slice"]["events"]
    assert payload["timeline_slice"]["headline"] == "Scenario Timeline"
    assert isinstance(payload["timeline_slice"]["related_object_ids"], list)
    assert payload["advice_slice"]["recommendations"]
    assert payload["advice_slice"]["title"] == "Scenario Advice"
    assert isinstance(payload["advice_slice"]["related_object_ids"], list)
    assert "confidence" in payload["advice_slice"]
    assert payload["scene_overlay"]["highlighted_object_ids"]
    assert "scene_json" not in payload


def test_cost_pressure_scenario_simulation():
    with _client() as client:
        response = client.post(
            "/scenario/simulate",
            json={
                "scenario_text": "What if costs rise sharply this month?",
                "domain": "retail",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["scenario_type"] == "cost_pressure"
    object_ids = [state["object_id"] for state in payload["object_states"]]
    assert "obj_cost" in object_ids
    assert "obj_cashflow" in object_ids
    assert payload["overall_impact_level"] in {"high", "critical"}


def test_low_impact_scenario_stays_limited():
    with _client() as client:
        response = client.post(
            "/scenario/simulate",
            json={
                "scenario_text": "What if minor delivery fluctuation occurs but operations remain stable?",
                "domain": "retail",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["overall_impact_level"] in {"low", "moderate"}
    assert len(payload["propagation_steps"]) <= 3
    assert payload["scene_overlay"]["dim_unrelated_objects"] is True
    assert "scene_json" not in payload


def test_scenario_simulation_is_deterministic():
    with _client() as client:
        first = client.post(
            "/scenario/simulate",
            json={"scenario_text": "What if supplier instability worsens next week?", "domain": "retail"},
        )
        second = client.post(
            "/scenario/simulate",
            json={"scenario_text": "What if supplier instability worsens next week?", "domain": "retail"},
        )

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["scenario_type"] == second.json()["scenario_type"]
    assert first.json()["overall_impact_level"] == second.json()["overall_impact_level"]
    assert first.json()["primary_objects"] == second.json()["primary_objects"]
    assert first.json()["affected_objects"] == second.json()["affected_objects"]
    assert first.json()["timeline_slice"] == second.json()["timeline_slice"]


def test_classify_scenario_type_prefers_clear_supply_signal():
    assert classify_scenario_type("supplier instability worsens") == "supplier_disruption"
