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

from app.routers.fragility_scanner_router import router as fragility_scanner_router
from app.utils.responses import install_exception_handlers


def _client() -> TestClient:
    app = FastAPI()
    install_exception_handlers(app)
    app.include_router(fragility_scanner_router)
    return TestClient(app)


def test_fragility_scanner_valid_post():
    with _client() as client:
        response = client.post(
            "/scanner/fragility",
            json={
                "text": "Supplier dependency and inventory shortage are causing severe delays and weak recovery.",
                "source_type": "report",
                "mode": "business",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert "summary" in payload
    assert "summary_detail" in payload
    assert "fragility_score" in payload
    assert "fragility_level" in payload
    assert "findings" in payload
    assert "suggested_objects" in payload
    assert "scene_payload" in payload
    assert "object_impacts" in payload
    assert "advice_slice" in payload
    assert "timeline_slice" in payload
    assert "war_room_slice" in payload


def test_fragility_scanner_missing_input_validation():
    with _client() as client:
        response = client.post(
            "/scanner/fragility",
            json={
                "source_type": "report",
                "mode": "business",
            },
        )

    assert response.status_code == 422
    payload = response.json()
    assert payload["ok"] is False
    assert payload["error"]["type"] == "VALIDATION_ERROR"
    assert isinstance(payload["error"]["details"], list)


def test_fragility_scanner_response_shape():
    with _client() as client:
        response = client.post(
            "/scanner/fragility",
            json={
                "text": "A bottleneck and volatile operating conditions are increasing delivery pressure.",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload["summary"], str)
    assert isinstance(payload["summary_detail"], dict)
    assert isinstance(payload["fragility_score"], float)
    assert isinstance(payload["fragility_level"], str)
    assert isinstance(payload["findings"], list)
    assert isinstance(payload["suggested_objects"], list)
    assert isinstance(payload["scene_payload"], dict)
    assert isinstance(payload["object_impacts"], dict)
    assert isinstance(payload["advice_slice"], dict)
    assert isinstance(payload["timeline_slice"], dict)
    assert isinstance(payload["war_room_slice"], dict)


def test_fragility_scanner_accepts_signal_bundle_directly():
    with _client() as client:
        response = client.post(
            "/scanner/fragility",
            json={
                "signal_bundle": {
                    "source": {
                        "id": "src_1",
                        "type": "text",
                        "raw_content": "inventory shortage may delay delivery",
                        "metadata": {"domain": "retail"},
                    },
                    "signals": [
                        {
                            "id": "sig_1",
                            "type": "delay",
                            "description": "inventory shortage may delay delivery",
                            "entities": ["inventory", "delivery"],
                            "strength": 0.82,
                            "source_id": "src_1",
                        }
                    ],
                }
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["ok"] is True
    assert payload["fragility_score"] > 0
    assert payload["scene_payload"]["highlighted_object_ids"]
    assert payload["object_impacts"]["primary"]
