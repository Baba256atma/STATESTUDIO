from __future__ import annotations

import json
import logging
import os
import re
from typing import Callable, Dict, List, Tuple

from app.models.chat import Action, ChatRequest, ChatResponse

Logger = logging.getLogger(__name__)

VERBS = {"color", "change", "pulse", "shake", "reveal", "hide", "position", "intensity"}


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def rule_extract_actions(text: str, allowed_objects: List[str] | None) -> Tuple[List[Action], float]:
    objects = set(re.findall(r"\b(obj_[a-zA-Z0-9_]+)\b", text or ""))
    if allowed_objects:
        objects = {obj for obj in objects if obj in allowed_objects}
    verbs_found = set(re.findall(r"\b(" + "|".join(VERBS) + r")\b", text or "", re.IGNORECASE))
    actions: List[Action] = []
    verb = next(iter(verbs_found), None)
    for obj in objects:
        actions.append(Action(target_id=obj, verb=verb or "reveal"))
    if actions and verb:
        return actions, 0.9
    if actions:
        return actions, 0.6
    return [], 0.0


def _openai_client():
    try:
        from openai import OpenAI
    except Exception as exc:  # pragma: no cover
        raise RuntimeError("OpenAI SDK not installed") from exc
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY missing")
    return OpenAI(api_key=api_key)


def llm_generate_actions(
    text: str,
    allowed_objects: List[str] | None,
    context: Dict[str, str] | None = None,
    client_factory: Callable[[], object] = _openai_client,
) -> ChatResponse:
    client = client_factory()
    model = os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
    sys_prompt = (
        "You are an action planner. Respond ONLY with JSON matching "
        '{"reply": string, "actions": [{"target_id": string, "verb": string, "value": string|null, "color": string|null, "intensity": number|null}], "debug": object|null}. '
        "Do not include any extra text."
    )
    user_prompt = {
        "text": text,
        "allowed_objects": allowed_objects or [],
        "context": context or {},
    }
    response = client.responses.create(model=model, input=[{"role": "system", "content": sys_prompt}, {"role": "user", "content": json.dumps(user_prompt)}])
    raw = "".join(response.output_text)
    data = json.loads(raw)
    return ChatResponse.model_validate(data)


def validate_and_fix(resp: ChatResponse) -> ChatResponse:
    actions = []
    for act in resp.actions or []:
        intensity = _clamp01(act.intensity) if act.intensity is not None else None
        actions.append(Action(**{**act.model_dump(), "intensity": intensity}))
    reply = resp.reply or "OK"
    debug = resp.debug
    return ChatResponse(reply=reply, actions=actions, debug=debug)


def handle_chat(request: ChatRequest) -> ChatResponse:
    allowed_objects = request.allowed_objects or []
    actions, confidence = rule_extract_actions(request.text, allowed_objects)
    path = "rules" if actions and confidence >= 0.75 else "llm"
    text_lower = (request.text or "").strip().lower()
    greetings = ("hi", "hello", "salam", "hey")
    is_greeting = any(text_lower.startswith(g) for g in greetings)
    if path == "rules":
        reply = "Hi there! How can I refine the scene?" if is_greeting else "Understood."
        resp = ChatResponse(reply=reply, actions=actions, debug={"path": path})
        Logger.info("chat_pipeline", extra={"request_id": id(request), "path": path, "actions_count": len(actions)})
        return validate_and_fix(resp)

    try:
        llm_resp = llm_generate_actions(request.text, allowed_objects, {"mode": request.mode})
        resp = validate_and_fix(llm_resp)
        resp.debug = (resp.debug or {}) | {"path": path}
        Logger.info("chat_pipeline", extra={"request_id": id(request), "path": path, "actions_count": len(resp.actions)})
        if is_greeting:
            resp.reply = "Hello! I’m ready to adjust the scene—tell me what to change."
        return resp
    except Exception as exc:
        Logger.warning(
            "chat_pipeline_fallback",
            extra={"request_id": id(request), "path": "fallback", "error": str(exc)},
        )
        # Fallback: safe minimal response
        friendly = "Hello! I'm ready to adjust the scene." if is_greeting else "Acknowledged."
        return ChatResponse(reply=friendly, actions=[], debug={"path": "fallback", "error": str(exc)})
