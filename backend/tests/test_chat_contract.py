from __future__ import annotations

from fastapi.testclient import TestClient
import main


client = TestClient(main.app)


def test_chat_missing_text():
    res = client.post("/chat", json={})
    assert res.status_code == 400
    body = res.json()
    assert body.get("ok") is False
    assert body.get("error", {}).get("type") == "INVALID_INPUT"
    assert body.get("actions") == []


def test_chat_success_actions_array():
    res = client.post("/chat", json={"text": "hello", "user_id": "u1"})
    assert res.status_code == 200
    body = res.json()
    assert body.get("ok") is True
    assert isinstance(body.get("actions"), list)
    assert body.get("user_id") == "u1"


def test_chat_user_id_consistency_header():
    res = client.post("/chat", json={"text": "hi"}, headers={"x-user-id": "header-user"})
    assert res.status_code == 200
    body = res.json()
    assert body.get("user_id") == "header-user"
