"""CLI and execution helpers for end-to-end AI routing evaluation."""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import UTC, datetime
from pathlib import Path
from tempfile import TemporaryDirectory


CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parents[1]
PROJECT_ROOT = CURRENT_DIR.parents[2]

for path in (PROJECT_ROOT, BACKEND_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)


from app.core.config import LocalAISettings
from app.schemas.ai import AIRequest
from app.services.ai.audit_logger import AIAuditLogger
from app.services.ai.orchestrator import LocalAIOrchestrator
from app.services.ai.privacy_types import PrivacyClassificationRequest
from app.services.ai.providers.base import AIProvider
from app.services.ai.providers.exceptions import ProviderInvalidResponseError, ProviderUnavailableError
from app.services.ai.providers.registry import AIProviderRegistry
from app.services.ai.providers.types import (
    ProviderChatRequest,
    ProviderChatResponse,
    ProviderDescriptor,
    ProviderHealthStatus,
    ProviderModelInfo,
    ProviderModelList,
)
from app.services.ai.validators import validate_structured_output
from tools.e2e_ai_eval.eval_assertions import evaluate_case_result
from tools.e2e_ai_eval.eval_cases import get_default_evaluation_cases
from tools.e2e_ai_eval.eval_report import build_summary, print_console_report, write_json_report
from tools.e2e_ai_eval.eval_results import EvaluationRunResult
from tools.e2e_ai_eval.eval_types import EvaluationCase, ObservedEvaluationState, ProviderScenario


DEFAULT_OUTPUT_PATH = BACKEND_DIR / "tools" / "e2e_ai_eval" / "e2e_eval_results.json"


class MockProvider(AIProvider):
    """Deterministic provider used by the evaluation harness."""

    def __init__(self, scenario: ProviderScenario) -> None:
        self.scenario = scenario

    @property
    def provider_key(self) -> str:
        return self.scenario.provider

    @property
    def default_model(self) -> str | None:
        return self.scenario.models[0] if self.scenario.models else None

    def describe(self) -> ProviderDescriptor:
        return ProviderDescriptor(
            key=self.scenario.provider,
            kind=self.scenario.kind,
            enabled=self.scenario.enabled,
            configured=self.scenario.configured,
            default_model=self.default_model,
            metadata=self.scenario.metadata,
        )

    async def health_check(self) -> ProviderHealthStatus:
        return ProviderHealthStatus(
            provider=self.scenario.provider,
            available=self.scenario.available,
            default_model=self.default_model,
            latency_ms=self.scenario.latency_ms,
        )

    async def list_models(self) -> ProviderModelList:
        return ProviderModelList(
            provider=self.scenario.provider,
            models=[
                ProviderModelInfo(name=model, provider=self.scenario.provider)
                for model in self.scenario.models
            ],
            latency_ms=self.scenario.latency_ms,
        )

    async def chat_json(self, request: ProviderChatRequest) -> ProviderChatResponse:
        if self.scenario.execution_error_code == "provider_unavailable":
            raise ProviderUnavailableError(self.scenario.execution_error_message or "Mock provider unavailable.")
        if self.scenario.execution_error_code == "invalid_provider_response":
            raise ProviderInvalidResponseError(
                self.scenario.execution_error_message or "Mock provider returned invalid output."
            )

        payload = self.scenario.response_payload
        return ProviderChatResponse(
            ok=True,
            provider=self.scenario.provider,
            model=request.model or self.default_model or "unknown-model",
            raw_model=request.model or self.default_model,
            output=json.dumps(payload, ensure_ascii=True) if payload is not None else "",
            data=payload,
            latency_ms=self.scenario.latency_ms,
            metadata=self.scenario.metadata,
        )


class StaticProviderFactory:
    """Small provider factory compatible with the orchestrator."""

    def __init__(self, scenarios: list[ProviderScenario]) -> None:
        providers = {scenario.provider: MockProvider(scenario) for scenario in scenarios}
        self._registry = AIProviderRegistry(providers)

    def registry(self) -> AIProviderRegistry:
        return self._registry

    def get_provider(self, provider_key: str) -> AIProvider:
        provider = self._registry.get(provider_key)
        if provider is None:
            raise KeyError(f"Provider is not registered: {provider_key}")
        return provider

    def get_default_provider(self) -> AIProvider:
        providers = self._registry.list()
        if not providers:
            raise KeyError("No providers are registered")
        return providers[0]


async def run_evaluation(
    cases: list[EvaluationCase] | None = None,
    *,
    include_audit_checks: bool = True,
    output_path: str | Path | None = DEFAULT_OUTPUT_PATH,
) -> EvaluationRunResult:
    """Execute the evaluation harness across the selected cases."""
    started_at = datetime.now(UTC)
    case_definitions = cases or get_default_evaluation_cases()
    case_results = []

    for case in case_definitions:
        observed = await _run_case(case)
        case_results.append(
            evaluate_case_result(
                case,
                observed,
                include_audit_checks=include_audit_checks,
            )
        )

    summary = build_summary(case_results)
    run_result = EvaluationRunResult(
        started_at=started_at.isoformat(),
        completed_at=datetime.now(UTC).isoformat(),
        mocked_providers=True,
        include_audit_checks=include_audit_checks,
        output_path=str(output_path) if output_path else None,
        cases=case_results,
        summary=summary,
    )
    if output_path:
        write_json_report(run_result, output_path)
    return run_result


async def run_case_observation(case: EvaluationCase) -> ObservedEvaluationState:
    """Execute a single evaluation case and return the observed pipeline state."""
    return await _run_case(case)


async def _run_case(case: EvaluationCase) -> ObservedEvaluationState:
    trace_id = f"eval-{case.case_id}"
    with TemporaryDirectory(prefix="nexora-e2e-eval-") as temp_dir:
        benchmark_path = Path(temp_dir) / "benchmark_results.json"
        benchmark_path.write_text(json.dumps({"summary": case.benchmark_summary}), encoding="utf-8")

        settings = LocalAISettings(
            ai_model_selection_enabled=True,
            ai_provider_default="ollama",
            ai_provider_fallback="openai",
            ai_cloud_provider_enabled=True,
            ai_cloud_fallback_enabled=True,
            ai_cloud_for_reasoning_enabled=True,
            ai_benchmark_tuning_enabled=bool(case.benchmark_summary),
            ai_benchmark_results_path=str(benchmark_path),
            ollama_default_model="balanced-model",
            ai_default_fast_model="fast-model",
            ai_default_reasoning_model="reasoning-model",
            ai_default_extraction_model="extract-model",
            openai_default_model="cloud-reasoning-model",
            openai_api_key="mock-openai-key",
            ai_audit_enabled=True,
            ai_audit_keep_in_memory=True,
            ai_audit_log_to_file=False,
        )
        audit_logger = AIAuditLogger(settings)
        orchestrator = LocalAIOrchestrator(
            settings=settings,
            provider_factory=StaticProviderFactory(case.provider_scenarios),
            audit_logger=audit_logger,
        )

        privacy_request = PrivacyClassificationRequest(
            task_type=case.task_type,
            text=case.input_text,
            contains_uploaded_content=bool(case.metadata.get("contains_uploaded_content")),
            workspace_privacy_mode=case.context.get("privacy_mode") if isinstance(case.context, dict) else None,
            metadata=case.metadata,
            context=case.context,
        )
        privacy_result = orchestrator.classify_privacy(privacy_request)
        routing_decision = await orchestrator.decide_routing(
            orchestrator._build_routing_request(
                task_type=case.task_type,
                metadata=case.metadata,
                privacy=privacy_result,
            )
        )
        selection_result = await orchestrator.select_model(
            _build_selection_payload(case)
        )
        response = await orchestrator.analyze(
            AIRequest(
                text=case.input_text,
                context=case.context,
                trace_id=trace_id,
                metadata={**case.metadata, "task": case.task_type},
            )
        )
        parsed_output = None
        if response.output:
            try:
                parsed_output = json.loads(response.output)
            except json.JSONDecodeError:
                parsed_output = None
        validation = validate_structured_output(parsed_output)
        audit_events = audit_logger.list_events(trace_id=trace_id)
        fallback_used = bool(response.metadata.get("selection_fallback_used")) or any(
            event.stage == "fallback_applied" for event in audit_events
        )
        benchmark_used = bool(response.metadata.get("selection_benchmark_used"))
        return ObservedEvaluationState(
            case_id=case.case_id,
            trace_id=trace_id,
            task_type=case.task_type,
            privacy_result=privacy_result,
            routing_decision=routing_decision,
            selection_result=selection_result,
            response=response,
            response_valid=validation.ok,
            selected_provider=routing_decision.selected_provider or (
                response.provider if response.ok else None
            ),
            selected_model=response.model or selection_result.selected_model,
            fallback_used=fallback_used,
            benchmark_used=benchmark_used,
            latency_ms=response.latency_ms,
            audit_events=audit_events,
            audit_stages=[event.stage for event in audit_events],
        )


def _build_selection_payload(case: EvaluationCase):
    from app.schemas.ai import ModelSelectionDebugRequest

    return ModelSelectionDebugRequest(
        task_type=case.task_type,
        requested_model=None,
        latency_sensitive=bool(case.metadata.get("latency_sensitive")),
        quality_policy=str(case.metadata.get("quality_policy", "balanced")),
        context=case.context,
        metadata={**case.metadata, "task": case.task_type},
    )


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Nexora end-to-end AI routing evaluation.")
    parser.add_argument("--case", dest="case_ids", action="append", help="Run a specific evaluation case by case_id.")
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT_PATH),
        help="Path to write the JSON evaluation report.",
    )
    parser.add_argument(
        "--no-audit-checks",
        action="store_true",
        help="Skip audit completeness and redaction assertions.",
    )
    return parser.parse_args()


async def _main() -> int:
    args = _parse_args()
    cases = get_default_evaluation_cases()
    if args.case_ids:
        selected = {case_id.strip() for case_id in args.case_ids if case_id and case_id.strip()}
        cases = [case for case in cases if case.case_id in selected]
    run_result = await run_evaluation(
        cases,
        include_audit_checks=not args.no_audit_checks,
        output_path=args.output,
    )
    print(print_console_report(run_result))
    return 0 if run_result.summary.passed_cases == run_result.summary.total_cases else 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(_main()))
