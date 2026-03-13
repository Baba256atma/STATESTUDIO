from __future__ import annotations

from fastapi.testclient import TestClient

import main


def test_chat_writes_event():
    client = TestClient(main.app)
    res = client.post("/chat", json={"text": "hello", "user_id": "tester"})
    assert res.status_code == 200
    res2 = client.get("/events/recent", params={"user_id": "tester"})
    assert res2.status_code == 200
    body = res2.json()
    assert body.get("ok") is True
    assert isinstance(body.get("events"), list)
    assert body["events"], "expected at least one event"


def test_events_requires_user_id():
    client = TestClient(main.app)
    res = client.get("/events/recent")
    assert res.status_code == 400
    body = res.json()
    assert body.get("ok") is False or body.get("error")


def test_replay_route_ok():
    client = TestClient(main.app)
    client.post("/chat", json={"text": "ping", "user_id": "tester2"})
    res = client.post("/events/replay", params={"user_id": "tester2"})
    assert res.status_code in (200, 404)  # 404 if empty is acceptable
    if res.status_code == 200:
        assert res.json().get("ok") is True
