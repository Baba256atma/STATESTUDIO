from __future__ import annotations

from fastapi.testclient import TestClient

import main
from app.models.typec_ai_models import TypeCMultiAgentRequest
from app.services.typec_multi_agent_service import generate_typec_multi_agent_insight
from app.services.typec_agents import RISK_AGENT, STRATEGY_AGENT, run_agent
from app.services.typec_agents.executive_synthesizer import validate_synthesis


def _request() -> TypeCMultiAgentRequest:
    return TypeCMultiAgentRequest.model_validate(
        {
            "recommendation": {
                "recommendedScenarioId": "scenario_a",
                "reasoning": "Scenario A has lower propagation risk.",
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
                "stablePatterns": ["Pattern shows consistent stability"],
                "unstablePatterns": [],
            },
        }
    )


def test_multi_agent_request_validation():
    payload = _request()
    assert payload.recommendation is not None
    assert payload.memorySummary is not None


def test_agents_are_isolated_by_definition():
    risk = run_agent(RISK_AGENT, _request(), provider=None)
    strategy = run_agent(STRATEGY_AGENT, _request(), provider=None)
    assert risk.agent == "Risk Agent"
    assert strategy.agent == "Strategy Agent"
    assert risk.insight != strategy.insight


def test_multi_agent_orchestrator_sequence_stable():
    response = generate_typec_multi_agent_insight(_request(), provider=None)
    assert [agent.agent for agent in response.agentResponses] == [
        "Risk Agent",
        "Strategy Agent",
        "Operations Agent",
        "Financial Agent",
        "Fragility Agent",
    ]
    assert response.source == "multi_agent_ai"


def test_synthesis_validation_clamps_output():
    synthesis = validate_synthesis(
        {
            "executiveSummary": "Summary",
            "keyAgreement": "Agreement",
            "keyConflict": "Conflict",
            "strategicRecommendation": "Recommendation",
            "cautionAreas": ["a", "b", "c", "d", "e"],
            "confidence": 2,
        }
    )
    assert synthesis.confidence == 1
    assert len(synthesis.cautionAreas) == 4


def test_multi_agent_provider_fallback_on_malformed_output():
    def malformed_provider(_prompt: str):
        return {"bad": True}

    response = generate_typec_multi_agent_insight(_request(), provider=malformed_provider)
    assert response.agentResponses[0].agent == "Risk Agent"
    assert response.synthesis.confidence > 0


def test_multi_agent_route_validates_empty_context():
    client = TestClient(main.app)
    response = client.post("/typec/ai/multi-agent", json={})
    assert response.status_code == 422


def test_multi_agent_route_returns_safe_response(monkeypatch):
    from app.routes import typec_ai

    monkeypatch.setattr(
        typec_ai,
        "generate_typec_multi_agent_insight",
        lambda payload: generate_typec_multi_agent_insight(payload, provider=None),
    )
    client = TestClient(main.app)
    response = client.post("/typec/ai/multi-agent", json=_request().model_dump())
    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "multi_agent_ai"
    assert len(body["agentResponses"]) == 5
