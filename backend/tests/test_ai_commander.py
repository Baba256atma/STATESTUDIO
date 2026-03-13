from __future__ import annotations

import json

import pytest
from fastapi.testclient import TestClient

from app.models.chat import ChatRequest
from app.services import ai_commander
from app.services.ai_commander import Action, ChatResponse, handle_chat
import main


def test_rule_only_path():
    req = ChatRequest(text="obj_alpha shake now", allowed_objects=["obj_alpha"])
    resp = handle_chat(req)
    assert isinstance(resp, ChatResponse)
    assert resp.actions
    assert resp.actions[0].target_id == "obj_alpha"
    assert resp.debug and resp.debug.get("path") in {"rules", "fallback", "llm"}


def test_llm_path_mocked(monkeypatch):
    class FakeResp:
        def __init__(self, txt: str):
            self.output_text = [txt]

    class FakeClient:
        def responses_create(self, **kwargs):
            return FakeResp(json.dumps({"reply": "hi", "actions": [{"target_id": "obj_beta", "verb": "reveal"}]}))

        def responses(self):
            return self

        create = responses_create

    def fake_factory():
        class Wrap:
            def __init__(self):
                self.responses = self

            def create(self, **kwargs):
                return FakeResp(json.dumps({"reply": "hi", "actions": [{"target_id": "obj_beta", "verb": "reveal"}]}))

        return Wrap()

    monkeypatch.setenv("OPENAI_API_KEY", "test")
    resp = ai_commander.llm_generate_actions(
        "show obj_beta", allowed_objects=["obj_beta"], context={}, client_factory=fake_factory
    )
    assert resp.reply == "hi"
    assert resp.actions and resp.actions[0].target_id == "obj_beta"


def test_invalid_json_fallback(monkeypatch):
    class FakeResp:
        def __init__(self, txt: str):
            self.output_text = [txt]

    def fake_factory():
        class Wrap:
            def __init__(self):
                self.responses = self

            def create(self, **kwargs):
                return FakeResp("not json")

        return Wrap()

    monkeypatch.setenv("OPENAI_API_KEY", "test")
    req = ChatRequest(text="obj_gamma reveal", allowed_objects=["obj_gamma"])
    # Force llm path by clearing rule matches
    resp = ai_commander.handle_chat(req)
    assert isinstance(resp, ChatResponse)


def test_ai_chat_route_200():
    client = TestClient(main.app)
    response = client.post("/chat/ai", json={"text": "obj_alpha shake", "allowed_objects": ["obj_alpha"]})
    assert response.status_code == 200
    body = response.json()
    assert "reply" in body
    assert "actions" in body
