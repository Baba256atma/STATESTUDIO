from __future__ import annotations

from fastapi.testclient import TestClient
import main


client = TestClient(main.app)


def test_chat_missing_text():
    res = client.post("/chat", json={})
    assert res.status_code == 422
    body = res.json()
    assert body.get("ok") is False
    assert body.get("error", {}).get("type") == "VALIDATION_ERROR"
    assert body.get("actions") == []
    assert body.get("advice_slice") is None
    assert body.get("timeline_slice") is None
    assert body.get("war_room_slice") is None
    assert body.get("drivers") == []
    assert body.get("signals") == []


def test_chat_success_actions_array():
    res = client.post("/chat", json={"text": "hello", "user_id": "u1"})
    assert res.status_code == 200
    body = res.json()
    assert body.get("ok") is True
    assert isinstance(body.get("actions"), list)
    assert body.get("user_id") == "u1"
    assert "context" in body and isinstance(body.get("context"), dict)
    assert "scene_json" in body
    assert body.get("advice_slice") is None
    assert body.get("timeline_slice") is None
    assert body.get("war_room_slice") is None
    assert body.get("drivers") == []
    assert body.get("signals") == []


def test_chat_user_id_consistency_header():
    res = client.post("/chat", json={"text": "hi"}, headers={"x-user-id": "header-user"})
    assert res.status_code == 200
    body = res.json()
    assert body.get("user_id") == "header-user"


def test_chat_blocked_input_uses_unified_error_envelope(monkeypatch):
    monkeypatch.setattr(
        main,
        "check_ai_input_safety",
        lambda _text: {"ok": False, "reason": "policy"},
    )

    res = client.post("/chat", json={"text": "blocked content", "user_id": "blocked-user"})
    assert res.status_code == 422
    body = res.json()
    assert body.get("ok") is False
    assert body.get("user_id") == "blocked-user"
    assert body.get("error", {}).get("type") == "INPUT_BLOCKED"
    assert body.get("error", {}).get("details") == "policy"
    assert body.get("actions") == []
    assert body.get("drivers") == []
    assert body.get("signals") == []
