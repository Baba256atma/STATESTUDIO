from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from collections.abc import Callable
from typing import Any

from pydantic import ValidationError

from app.models.typec_ai_models import TypeCAIInsightRequest, TypeCAIInsightResponse

SYSTEM_PROMPT = """
You are Nexora Type-C AI.
You assist executive decision-making.
You do not execute decisions.
You do not invent system state.
You explain tradeoffs, risks, and strategic considerations clearly and conservatively.
Return ONLY JSON with:
{
  "executiveSummary": string,
  "strategicInsight": string,
  "cautionNote": string,
  "suggestedQuestions": string[],
  "confidence": number
}
""".strip()

MAX_PROMPT_CHARS = 4_000


def fallback_typec_ai_response() -> TypeCAIInsightResponse:
    return TypeCAIInsightResponse(
        executiveSummary="AI insight is unavailable; deterministic guidance remains the source of truth.",
        strategicInsight="Use the current recommendation, adaptive guidance, and memory patterns for review.",
        cautionNote="No AI output was applied to routing, execution, scene state, or memory.",
        suggestedQuestions=[
            "What assumption should be validated first?",
            "Which risk would change the recommendation?",
        ],
        confidence=0.25,
    )


def _clamp_list(values: list[str] | None, max_items: int = 4) -> list[str]:
    if not values:
        return []
    return [" ".join(str(value or "").split()).strip()[:180] for value in values if str(value or "").strip()][
        :max_items
    ]


def sanitize_typec_ai_request(request: TypeCAIInsightRequest) -> dict[str, Any]:
    decision = request.decisionRecommendation
    guidance = request.adaptiveGuidance
    memory = request.memorySummary
    return {
        "recommendation": None
        if decision is None
        else {
            "scenario": decision.recommendedScenarioId,
            "reasoning": decision.reasoning[:600],
            "tradeoff": decision.tradeoff[:400],
            "riskWarning": decision.riskWarning[:400],
            "nextAction": decision.nextAction[:300],
            "confidence": decision.confidence,
        },
        "adaptiveGuidance": None
        if guidance is None
        else {
            "message": guidance.message[:400],
            "contextFactors": _clamp_list(guidance.contextFactors, 8),
            "recommendedAdjustment": guidance.recommendedAdjustment[:400],
            "confidence": guidance.confidence,
        },
        "memoryPatterns": None
        if memory is None
        else {
            "repeatedRisks": _clamp_list(memory.repeatedRisks),
            "stablePatterns": _clamp_list(memory.stablePatterns),
            "unstablePatterns": _clamp_list(memory.unstablePatterns),
        },
    }


def build_typec_ai_user_prompt(request: TypeCAIInsightRequest) -> str:
    payload = {
        "sourceOfTruth": "Deterministic Type-C recommendation and guidance. AI is advisory only.",
        "constraints": [
            "Do not invent objects, scenarios, or metrics.",
            "Do not propose automatic execution.",
            "Keep wording short and executive.",
            "Suggest questions, not commands.",
        ],
        "context": sanitize_typec_ai_request(request),
        "requestedOutput": [
            "executiveSummary",
            "strategicInsight",
            "cautionNote",
            "suggestedQuestions",
            "confidence",
        ],
    }
    text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return text[:MAX_PROMPT_CHARS]


def validate_typec_ai_response(raw: Any) -> TypeCAIInsightResponse:
    if isinstance(raw, str):
        raw = json.loads(raw)
    if not isinstance(raw, dict):
        raise ValueError("ai_response_not_object")
    return TypeCAIInsightResponse.model_validate(raw)


def _call_openai(prompt: str) -> dict[str, Any]:
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    model = os.getenv("TYPEC_AI_MODEL") or os.getenv("OPENAI_DEFAULT_MODEL") or "gpt-5"
    response = client.responses.create(
        model=model,
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        timeout=float(os.getenv("TYPEC_AI_TIMEOUT_SECONDS", "8")),
    )
    return json.loads(response.output_text)


def _call_ollama(prompt: str) -> dict[str, Any]:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
    model = os.getenv("TYPEC_AI_MODEL") or os.getenv("OLLAMA_MODEL") or "llama3.2:3b"
    body = json.dumps(
        {
            "model": model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
            "format": "json",
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url}/api/chat",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=float(os.getenv("TYPEC_AI_TIMEOUT_SECONDS", "8"))) as response:
        payload = json.loads(response.read().decode("utf-8"))
    message = payload.get("message") if isinstance(payload, dict) else None
    content = message.get("content") if isinstance(message, dict) else ""
    return json.loads(content)


def _call_configured_provider(prompt: str) -> dict[str, Any]:
    provider = (os.getenv("TYPEC_AI_PROVIDER") or "openai").strip().lower()
    if provider == "ollama":
        return _call_ollama(prompt)
    if provider == "openai":
        return _call_openai(prompt)
    raise ValueError(f"unsupported_typec_ai_provider:{provider}")


def generate_typec_ai_insight(
    request: TypeCAIInsightRequest,
    provider: Callable[[str], Any] | None = None,
) -> TypeCAIInsightResponse:
    try:
        prompt = build_typec_ai_user_prompt(request)
        raw = (provider or _call_configured_provider)(prompt)
        return validate_typec_ai_response(raw)
    except (ValidationError, ValueError, json.JSONDecodeError, urllib.error.URLError, RuntimeError, Exception):
        return fallback_typec_ai_response()
