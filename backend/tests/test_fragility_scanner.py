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


def _client() -> TestClient:
    app = FastAPI()
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
    assert "fragility_score" in payload
    assert "fragility_level" in payload
    assert "findings" in payload
    assert "suggested_objects" in payload
    assert "scene_payload" in payload


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
    assert isinstance(payload["fragility_score"], float)
    assert isinstance(payload["fragility_level"], str)
    assert isinstance(payload["findings"], list)
    assert isinstance(payload["suggested_objects"], list)
    assert isinstance(payload["scene_payload"], dict)
