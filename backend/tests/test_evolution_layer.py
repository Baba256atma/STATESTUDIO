from __future__ import annotations

from fastapi.testclient import TestClient

import main
from engines.evolution.evolution_service import run_evolution_pass, save_memory, update_outcome
from engines.evolution.memory_models import (
    ComparisonMemoryRecord,
    MemorySaveRequest,
    ObservedOutcome,
    OutcomeUpdateRequest,
    PredictedSummary,
    ScenarioMemoryRecord,
    StrategyMemoryRecord,
)


def test_evolution_memory_save_and_outcome_update():
    saved = save_memory(
        MemorySaveRequest(
            scenario_record=ScenarioMemoryRecord(
                record_id="scenario:test",
                timestamp=1.0,
                scenario_id="scenario:test",
                scenario_title="Test Scenario",
                source_action_ids=["act:1"],
                source_object_ids=["obj_delivery"],
                mode="simulation",
                predicted_summary=PredictedSummary(headline="Test", expected_impact=0.6, expected_risk=0.3),
            ),
            strategy_records=[
                StrategyMemoryRecord(
                    record_id="strategy:test",
                    timestamp=1.0,
                    strategy_id="strategy:test",
                    title="Protect Delivery",
                    rationale="Test rationale",
                    actions=[{"action_kind": "stress_reduce"}],
                    predicted_score=0.7,
                    chosen=True,
                    outcome_status="positive",
                )
            ],
            comparison_record=ComparisonMemoryRecord(
                record_id="compare:test",
                timestamp=1.0,
                scenario_a_id="scenario:a",
                scenario_b_id="scenario:b",
                winner="B",
                recommendation="choose_A",
                user_choice="B",
                confidence=0.66,
            ),
        )
    )

    assert saved["scenario_record"] is not None
    updated = update_outcome(
        OutcomeUpdateRequest(
            record_id="scenario:test",
            observed_outcome=ObservedOutcome(outcome_status="negative", observed_impact=0.35, observed_risk=0.72),
        )
    )
    assert updated is not None
    assert updated.observed_outcome is not None


def test_evolution_run_produces_bounded_adjustments():
    state = run_evolution_pass()

    assert state.summary.headline
    assert all(-0.2 <= item.delta <= 0.2 for item in state.policy_adjustments)


def test_evolution_routes_return_payloads():
    client = TestClient(main.app)

    save_response = client.post(
        "/system/memory/save",
        json={
            "scenario_record": {
                "record_id": "scenario:route",
                "timestamp": 2.0,
                "scenario_id": "scenario:route",
                "scenario_title": "Route Scenario",
                "source_action_ids": ["act:route"],
                "source_object_ids": ["obj_inventory"],
                "mode": "decision",
            }
        },
    )
    assert save_response.status_code == 200

    evo_response = client.post("/system/evolution/run", json={})
    assert evo_response.status_code == 200
    assert "evolution" in evo_response.json()

    recent_response = client.get("/system/memory/recent")
    assert recent_response.status_code == 200
    assert "memory" in recent_response.json()
