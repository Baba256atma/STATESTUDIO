"""Built-in end-to-end AI routing evaluation scenarios."""

from __future__ import annotations

from tools.e2e_ai_eval.eval_types import EvaluationCase, ProviderScenario


DEFAULT_AUDIT_STAGES = [
    "request_received",
    "privacy_classified",
    "routing_decided",
    "provider_selected",
    "model_selected",
    "provider_execution_started",
    "provider_execution_completed",
    "response_returned",
]

FALLBACK_AUDIT_STAGES = [
    "request_received",
    "privacy_classified",
    "routing_decided",
    "provider_selected",
    "fallback_applied",
    "model_selected",
    "provider_execution_started",
    "provider_execution_completed",
    "response_returned",
]

INVALID_RESPONSE_AUDIT_STAGES = [
    "request_received",
    "privacy_classified",
    "routing_decided",
    "provider_selected",
    "model_selected",
    "provider_execution_started",
    "provider_execution_completed",
    "response_returned",
]


def get_default_evaluation_cases() -> list[EvaluationCase]:
    """Return built-in evaluation cases for the full routing pipeline."""
    return [
        EvaluationCase(
            case_id="safe_public_summarization",
            task_type="summarize_context",
            input_text="Summarize this public industry note for a status email.",
            metadata={"task": "summarize_context", "cloud_allowed": True, "cloud_permitted": True},
            expected_sensitivity_level="public",
            expected_privacy_mode="cloud_allowed",
            expected_cloud_allowed=True,
            expected_local_required=False,
            expected_provider="ollama",
            expected_selected_model="reasoning-model",
            expected_audit_stages=DEFAULT_AUDIT_STAGES,
            provider_scenarios=_healthy_local_and_cloud(),
            notes="Low-risk request stays local because a healthy local provider is preferred.",
        ),
        EvaluationCase(
            case_id="internal_operational_analysis",
            task_type="analyze_scenario",
            input_text="Analyze internal supplier backlog and delivery pressure for the operations team.",
            metadata={"task": "analyze_scenario"},
            expected_sensitivity_level="internal",
            expected_privacy_mode="default",
            expected_cloud_allowed=False,
            expected_local_required=False,
            expected_provider="ollama",
            expected_selected_model="reasoning-model",
            expected_audit_stages=DEFAULT_AUDIT_STAGES,
            provider_scenarios=_healthy_local_and_cloud(),
        ),
        EvaluationCase(
            case_id="confidential_uploaded_content_analysis",
            task_type="analyze_scenario",
            input_text="Review the uploaded contract and revenue forecast for risk exposure.",
            metadata={"task": "analyze_scenario", "contains_uploaded_content": True},
            expected_sensitivity_level="confidential",
            expected_privacy_mode="default",
            expected_cloud_allowed=False,
            expected_local_required=False,
            expected_provider="ollama",
            expected_selected_model="reasoning-model",
            expected_audit_stages=DEFAULT_AUDIT_STAGES,
            provider_scenarios=_healthy_local_and_cloud(),
        ),
        EvaluationCase(
            case_id="latency_sensitive_explain_task",
            task_type="explain",
            input_text="Explain the public release status in one short paragraph.",
            metadata={
                "task": "explain",
                "latency_sensitive": True,
                "cloud_allowed": True,
                "cloud_permitted": True,
            },
            expected_sensitivity_level="public",
            expected_privacy_mode="cloud_allowed",
            expected_cloud_allowed=True,
            expected_local_required=False,
            expected_provider="ollama",
            expected_selected_model="fast-model",
            expected_audit_stages=DEFAULT_AUDIT_STAGES,
            provider_scenarios=_healthy_local_and_cloud(),
        ),
        EvaluationCase(
            case_id="provider_unavailable_fallback_case",
            task_type="explain",
            input_text="Explain the public outage status and likely next step.",
            metadata={"task": "explain", "cloud_allowed": True, "cloud_permitted": True},
            expected_sensitivity_level="public",
            expected_privacy_mode="cloud_allowed",
            expected_cloud_allowed=True,
            expected_local_required=False,
            expected_provider="openai",
            expected_fallback_behavior=True,
            expected_selected_model="cloud-reasoning-model",
            expected_audit_stages=FALLBACK_AUDIT_STAGES,
            provider_scenarios=[
                ProviderScenario(
                    provider="ollama",
                    kind="local",
                    available=False,
                    models=["balanced-model", "fast-model", "reasoning-model", "extract-model"],
                ),
                ProviderScenario(
                    provider="openai",
                    kind="cloud",
                    available=True,
                    models=["cloud-reasoning-model"],
                    response_payload=_valid_payload("Cloud fallback completed successfully."),
                ),
            ],
        ),
        EvaluationCase(
            case_id="restricted_content_local_only",
            task_type="analyze_scenario",
            input_text="Analyze this bank account and passport handling incident for containment actions.",
            metadata={"task": "analyze_scenario"},
            expected_sensitivity_level="restricted",
            expected_privacy_mode="local_preferred",
            expected_cloud_allowed=False,
            expected_local_required=True,
            expected_provider="ollama",
            expected_selected_model="reasoning-model",
            expected_audit_stages=DEFAULT_AUDIT_STAGES,
            provider_scenarios=_healthy_local_and_cloud(),
        ),
        EvaluationCase(
            case_id="cloud_allowed_reasoning_scenario",
            task_type="summarize_context",
            input_text="Summarize this public product update and explain the likely customer impact.",
            metadata={"task": "summarize_context", "cloud_allowed": True, "cloud_permitted": True},
            expected_sensitivity_level="public",
            expected_privacy_mode="cloud_allowed",
            expected_cloud_allowed=True,
            expected_local_required=False,
            expected_provider="openai",
            expected_selected_model="cloud-reasoning-model",
            expected_audit_stages=DEFAULT_AUDIT_STAGES,
            provider_scenarios=[
                ProviderScenario(
                    provider="ollama",
                    kind="local",
                    available=False,
                    models=["balanced-model", "fast-model", "reasoning-model", "extract-model"],
                ),
                ProviderScenario(
                    provider="openai",
                    kind="cloud",
                    available=True,
                    models=["cloud-reasoning-model"],
                    response_payload=_valid_payload("Cloud reasoning execution completed."),
                ),
            ],
        ),
        EvaluationCase(
            case_id="benchmark_influenced_selection_scenario",
            task_type="analyze_scenario",
            input_text="Analyze internal operations risk and summarize the main decision points.",
            metadata={"task": "analyze_scenario"},
            expected_sensitivity_level="internal",
            expected_privacy_mode="default",
            expected_cloud_allowed=False,
            expected_local_required=False,
            expected_provider="ollama",
            expected_benchmark_used=True,
            expected_selected_model="balanced-model",
            expected_audit_stages=DEFAULT_AUDIT_STAGES,
            provider_scenarios=_healthy_local_and_cloud(),
            benchmark_summary=[
                {"model": "balanced-model", "avg_latency_ms": 18, "success_rate": 0.99, "json_valid_rate": 0.99},
                {"model": "reasoning-model", "avg_latency_ms": 30, "success_rate": 0.55, "json_valid_rate": 0.70},
            ],
        ),
        EvaluationCase(
            case_id="invalid_structured_response_case",
            task_type="explain",
            input_text="Explain the public roadmap update in structured form.",
            metadata={"task": "explain", "cloud_allowed": True, "cloud_permitted": True},
            expected_sensitivity_level="public",
            expected_privacy_mode="cloud_allowed",
            expected_cloud_allowed=True,
            expected_local_required=False,
            expected_provider="ollama",
            expected_selected_model="reasoning-model",
            expected_response_valid=False,
            expected_audit_stages=INVALID_RESPONSE_AUDIT_STAGES,
            provider_scenarios=[
                ProviderScenario(
                    provider="ollama",
                    kind="local",
                    available=True,
                    models=["balanced-model", "fast-model", "reasoning-model", "extract-model"],
                    response_payload=["not", "a", "structured", "object"],
                ),
                ProviderScenario(
                    provider="openai",
                    kind="cloud",
                    available=True,
                    models=["cloud-reasoning-model"],
                ),
            ],
        ),
    ]


def _healthy_local_and_cloud() -> list[ProviderScenario]:
    return [
        ProviderScenario(
            provider="ollama",
            kind="local",
            available=True,
            models=["balanced-model", "fast-model", "reasoning-model", "extract-model"],
            response_payload=_valid_payload("Local execution completed successfully."),
        ),
        ProviderScenario(
            provider="openai",
            kind="cloud",
            available=True,
            models=["cloud-reasoning-model"],
            response_payload=_valid_payload("Cloud execution completed successfully."),
        ),
    ]


def _valid_payload(summary: str) -> dict[str, object]:
    return {
        "summary": summary,
        "risk_signals": [],
        "object_candidates": [],
        "metadata": {"confidence": 0.92},
    }
