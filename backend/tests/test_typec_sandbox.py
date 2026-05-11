from __future__ import annotations

from fastapi.testclient import TestClient

import main
from app.models.typec_sandbox_models import TypeCSandboxRequest
from app.services.typec_sandbox import run_typec_sandbox
from app.services.typec_sandbox.sandbox_clone import clone_scene_snapshot
from app.services.typec_sandbox.strategy_generator import generate_sandbox_strategies


def _scene() -> dict:
    return {
        "state_vector": {},
        "scene": {
            "objects": [
                {"id": "nexora_core", "label": "Nexora Core"},
                {"id": "supplier", "label": "Supplier"},
                {"id": "inventory", "label": "Inventory"},
                {"id": "delivery", "label": "Delivery"},
            ],
            "loops": [
                {
                    "id": "supply",
                    "type": "dependency",
                    "edges": [
                        {"from": "supplier", "to": "inventory"},
                        {"from": "inventory", "to": "delivery"},
                    ],
                }
            ],
        },
    }


def test_sandbox_clone_is_isolated():
    scene = _scene()
    clone = clone_scene_snapshot(scene)
    clone["scene"]["objects"][0]["label"] = "Changed"
    assert scene["scene"]["objects"][0]["label"] == "Nexora Core"


def test_strategy_generation_validation():
    strategies = generate_sandbox_strategies(_scene())
    assert strategies
    assert all(strategy.id for strategy in strategies)
    assert all(0 <= strategy.confidence <= 1 for strategy in strategies)


def test_run_sandbox_does_not_mutate_scene():
    scene = _scene()
    original = repr(scene)
    result = run_typec_sandbox(TypeCSandboxRequest(sceneSnapshot=scene))
    assert result.strategies
    assert repr(scene) == original


def test_sandbox_result_has_best_strategy():
    result = run_typec_sandbox(TypeCSandboxRequest(sceneSnapshot=_scene()))
    assert result.bestStrategyId
    assert any(strategy.id == result.bestStrategyId for strategy in result.strategies)


def test_sandbox_route_validates_empty_scene():
    client = TestClient(main.app)
    response = client.post("/typec/sandbox/run", json={"sceneSnapshot": {}})
    assert response.status_code == 422


def test_sandbox_route_returns_result():
    client = TestClient(main.app)
    response = client.post("/typec/sandbox/run", json={"sceneSnapshot": _scene()})
    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "sandbox"
    assert body["strategies"]
