from __future__ import annotations

from fastapi.testclient import TestClient
from pydantic import ValidationError

import main
from app.models.typec_ai_models import TypeCAIInsightRequest, TypeCAIInsightResponse
from app.services.typec_ai_service import (
    fallback_typec_ai_response,
    generate_typec_ai_insight,
    validate_typec_ai_response,
)


def _request() -> TypeCAIInsightRequest:
    return TypeCAIInsightRequest.model_validate(
        {
            "decisionRecommendation": {
                "recommendedScenarioId": "scenario_a",
                "reasoning": "Scenario A has lower structural risk.",
                "tradeoff": "Lower risk with slower execution.",
                "riskWarning": "Validate assumptions.",
                "nextAction": "Open War Room.",
                "confidence": 0.72,
            },
            "adaptiveGuidance": {
                "message": "Similar scenarios were previously stable.",
                "contextFactors": ["memory_pattern_stable"],
                "recommendedAdjustment": "Proceed with monitoring.",
                "confidence": 0.8,
            },
            "memorySummary": {
                "repeatedRisks": ["Recurring supplier delay risk detected"],
                "stablePatterns": ["Pattern shows consistent stability under similar conditions"],
                "unstablePatterns": [],
            },
        }
    )


def test_typec_ai_request_validation():
    payload = _request()
    assert payload.decisionRecommendation is not None
    assert payload.memorySummary is not None
    assert payload.decisionRecommendation.confidence == 0.72


def test_typec_ai_response_schema_validation():
    response = validate_typec_ai_response(
        {
            "executiveSummary": "Review the lower-risk option.",
            "strategicInsight": "The recommendation is structurally supported.",
            "cautionNote": "AI advice is advisory only.",
            "suggestedQuestions": ["What assumption changes the risk?"],
            "confidence": 1.5,
        }
    )
    assert isinstance(response, TypeCAIInsightResponse)
    assert response.confidence == 1
    assert response.source == "ai_assisted"


def test_typec_ai_response_rejects_malformed_structure():
    try:
        validate_typec_ai_response({"executiveSummary": "Only one field"})
    except ValidationError:
        return
    raise AssertionError("expected validation error")


def test_typec_ai_provider_success():
    def fake_provider(_prompt: str):
        return {
            "executiveSummary": "Proceed with a structured review.",
            "strategicInsight": "The best option lowers propagation exposure.",
            "cautionNote": "Validate assumptions before execution.",
            "suggestedQuestions": ["Which dependency is most fragile?"],
            "confidence": 0.82,
        }

    response = generate_typec_ai_insight(_request(), provider=fake_provider)
    assert response.executiveSummary == "Proceed with a structured review."
    assert response.confidence == 0.82


def test_typec_ai_provider_fallback_on_failure():
    def failing_provider(_prompt: str):
        raise RuntimeError("provider unavailable")

    response = generate_typec_ai_insight(_request(), provider=failing_provider)
    assert response.executiveSummary == fallback_typec_ai_response().executiveSummary
    assert response.confidence == 0.25


def test_typec_ai_route_validates_empty_context():
    client = TestClient(main.app)
    response = client.post("/typec/ai/insight", json={})
    assert response.status_code == 422


def test_typec_ai_route_returns_safe_response(monkeypatch):
    from app.routes import typec_ai

    monkeypatch.setattr(typec_ai, "generate_typec_ai_insight", lambda _payload: fallback_typec_ai_response())
    client = TestClient(main.app)
    response = client.post("/typec/ai/insight", json=_request().model_dump())
    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "ai_assisted"
    assert body["confidence"] == 0.25
