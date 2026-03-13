from __future__ import annotations

from fastapi.testclient import TestClient
import main


def test_recent_requires_user():
    client = TestClient(main.app)
    res = client.get("/events/recent")
    assert res.status_code == 400
    body = res.json()
    assert body.get("ok") is False


def test_recent_and_replay_flow():
    client = TestClient(main.app)
    client.post("/chat", json={"text": "hello replay", "user_id": "ev1"})
    recent = client.get("/events/recent", params={"user_id": "ev1", "limit": 5})
    assert recent.status_code == 200
    body = recent.json()
    assert body.get("ok") is True
    replay = client.post("/events/replay", params={"user_id": "ev1", "limit": 5})
    assert replay.status_code in (200, 404)
    if replay.status_code == 200:
        assert replay.json().get("ok") is True
