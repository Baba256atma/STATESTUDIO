from __future__ import annotations

from fastapi.testclient import TestClient

import main
from engines.strategy_generation.strategy_models import StrategyGenerationInput
from engines.strategy_generation.strategy_service import run_strategy_generation


def _intelligence_payload():
    return {
        "active": True,
        "object_insights": [
            {
                "object_id": "obj_delivery",
                "role": "source",
                "strategic_priority": 0.84,
                "pressure_score": 0.78,
                "leverage_score": 0.34,
                "fragility_score": 0.62,
                "rationale": "Delivery is the strongest pressure source.",
            },
            {
                "object_id": "obj_inventory",
                "role": "bottleneck",
                "strategic_priority": 0.8,
                "pressure_score": 0.7,
                "leverage_score": 0.42,
                "fragility_score": 0.56,
                "rationale": "Inventory is the clearest bottleneck.",
            },
            {
                "object_id": "obj_cash",
                "role": "leverage",
                "strategic_priority": 0.72,
                "pressure_score": 0.44,
                "leverage_score": 0.75,
                "fragility_score": 0.28,
                "rationale": "Cash is the best leverage point.",
            },
        ],
        "path_insights": [
            {
                "path_id": "path:delivery->inventory",
                "source_object_id": "obj_delivery",
                "target_object_id": "obj_inventory",
                "path_strength": 0.76,
                "path_role": "primary",
                "significance_score": 0.8,
                "rationale": "Delivery to inventory is the strongest path.",
            }
        ],
        "summary": {
            "headline": "Delivery is the main pressure point.",
            "summary": "Inventory bottleneck and cash leverage dominate the system.",
            "key_signal": "Pressure converges on inventory.",
            "suggested_focus_object_id": "obj_inventory",
            "suggested_mode": "decision",
        },
        "advice": [],
        "meta": {"engine_version": "system_intelligence_v1"},
    }


def _scene_json():
    return {
        "scene": {
            "objects": [
                {"id": "obj_delivery", "type": "node"},
                {"id": "obj_inventory", "type": "node"},
                {"id": "obj_cash", "type": "node"},
            ],
            "loops": [
                {"from": "obj_delivery", "to": "obj_inventory"},
                {"from": "obj_inventory", "to": "obj_cash"},
            ],
        }
    }


def test_strategy_generation_returns_ranked_strategies():
    result = run_strategy_generation(
        StrategyGenerationInput(
            intelligence=_intelligence_payload(),
            currentScenario={"id": "baseline", "title": "Current System"},
            scene_json=_scene_json(),
            mode="optimize",
        )
    )

    assert len(result.strategies) >= 2
    assert result.recommended_strategy_id is not None
    assert result.strategies[0].ranking == 1
    assert result.summary.headline


def test_strategy_generation_route_returns_payload():
    client = TestClient(main.app)
    response = client.post(
        "/system/strategy/generate",
        json={
            "intelligence": _intelligence_payload(),
            "currentScenario": {"id": "baseline", "title": "Current System"},
            "scene_json": _scene_json(),
            "mode": "explore",
        },
    )

    assert response.status_code == 200
    payload = response.json()["strategy_generation"]
    assert payload["recommended_strategy_id"] is not None
    assert isinstance(payload["strategies"], list)
