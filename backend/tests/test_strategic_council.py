from __future__ import annotations

from fastapi.testclient import TestClient

import main
from engines.strategic_council.council_models import CouncilAgentInput
from engines.strategic_council.council_service import run_strategic_council_service


client = TestClient(main.app)


def _sample_input() -> CouncilAgentInput:
    return CouncilAgentInput(
        text="What should we do about the supplier delay?",
        mode="business",
        focused_object_id="obj_supplier_1",
        allowed_objects=["obj_supplier_1", "obj_delivery_1", "obj_inventory_1"],
        fragility={
            "level": "high",
            "drivers": {
                "supplier_delay": 0.84,
                "inventory_pressure": 0.71,
                "delivery_pressure": 0.63,
            },
        },
        propagation={
            "edges": [
                {"from": "obj_supplier_1", "to": "obj_delivery_1"},
                {"from": "obj_delivery_1", "to": "obj_inventory_1"},
            ]
        },
        compare_result={"tradeoffs": [{"dimension": "speed_vs_cost"}]},
        strategy_result={"recommended_actions": [{"action": "Increase buffer inventory"}]},
        scene_json={
            "scene": {
                "objects": [
                    {"id": "obj_supplier_1", "label": "Supplier"},
                    {"id": "obj_delivery_1", "label": "Delivery"},
                    {"id": "obj_inventory_1", "label": "Inventory"},
                ]
            }
        },
    )


def test_strategic_council_generates_distinct_grounded_opinions():
    result = run_strategic_council_service(_sample_input())

    assert result.active is True
    assert [item.role for item in result.opinions] == ["ceo", "cfo", "coo"]
    assert "strategic weakness" in result.opinions[0].headline.lower()
    assert "cost" in result.opinions[1].headline.lower()
    assert "execution" in result.opinions[2].headline.lower() or "operational" in result.opinions[2].headline.lower()


def test_strategic_council_detects_disagreement_and_builds_synthesis():
    result = run_strategic_council_service(_sample_input())

    assert result.disagreements
    assert result.disagreements[0].dimension in {"pace_of_change", "investment_posture"}
    assert "phased" in result.synthesis.recommended_direction.lower()
    assert result.synthesis.top_actions
    assert result.synthesis.confidence > 0.4


def test_strategic_council_weak_signal_fallback_is_cautious():
    result = run_strategic_council_service(CouncilAgentInput())

    assert result.active is False
    assert result.disagreements == []
    assert "waiting for stronger signals" in result.synthesis.headline.lower()
    assert result.synthesis.confidence < 0.4


def test_strategic_council_route_returns_contract():
    response = client.post(
        "/system/strategic-council/run",
        json=_sample_input().model_dump(mode="python"),
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["council"]["active"] is True
    assert len(payload["council"]["opinions"]) == 3
    assert "synthesis" in payload["council"]
