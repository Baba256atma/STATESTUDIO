from __future__ import annotations

import json
import os
from typing import List, Tuple

from pydantic import BaseModel, ValidationError, Field

SYSTEM_PROMPT = """
You are an action planner. Respond ONLY with strict JSON matching:
{"reply": string, "actions": [{"type": string, "object": string, "value": object}], "debug": object|null}
Rules:
- Output must be valid JSON (no markdown, no extra text).
- Use only object ids from allowed_objects. If none apply, set actions to [].
- Allowed action types: setColor, setIntensity, pulse, shake, reveal, hide, setPosition, applyObject.
- For applyObject, include {"type":"applyObject","object":"<id>","value":{...objectUpdate...}}.
- intensity must stay within [0,1] if provided.
- If the message is emotional/abstract, give a short supportive reply and affect at most 1-3 objects (or none).
- If unclear, return actions: [] and ask a brief clarifying question.
- Never include the word "chakra" unless explicitly present in the user request; prefer neutral terms like "center".
""".strip()


class ChatLLMResponse(BaseModel):
    reply: str
    actions: List[dict] = Field(default_factory=list)
    debug: dict | None = None


def _openai_client():
    try:
        from openai import OpenAI
    except Exception as exc:  # pragma: no cover
        raise RuntimeError("OpenAI SDK not installed") from exc
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY missing")
    return OpenAI(api_key=api_key)


def build_user_prompt(text: str, allowed_objects: List[str] | None, mode: str | None) -> str:
    payload = {
        "text": text,
        "allowed_objects": allowed_objects or [],
        "mode": mode or "business",
    }
    return json.dumps(payload)


def llm_chat_actions(
    text: str,
    allowed_objects: List[str] | None,
    mode: str | None,
    timeout: float | None = 8.0,
    client_factory=_openai_client,
) -> ChatLLMResponse:
    client = client_factory()
    model = os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
    user_prompt = build_user_prompt(text, allowed_objects, mode)
    response = client.responses.create(
        model=model,
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        timeout=timeout,
    )
    raw = "".join(response.output_text)
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError("LLM returned non-JSON") from exc
    try:
        return ChatLLMResponse.model_validate(data)
    except ValidationError as exc:
        raise RuntimeError(f"LLM response validation failed: {exc}") from exc
