"""Shared backend configuration helpers."""

from __future__ import annotations

from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class LocalAISettings(BaseSettings):
    """Typed settings for the Nexora local AI layer."""

    model_config = SettingsConfigDict(
        extra="ignore",
        case_sensitive=False,
    )

    ai_local_enabled: bool = Field(
        default=True,
        validation_alias=AliasChoices("AI_LOCAL_ENABLED", "LOCAL_AI_ENABLED"),
    )
    ai_local_log_raw_responses: bool = Field(
        default=False,
        validation_alias="AI_LOCAL_LOG_RAW_RESPONSES",
    )
    ai_model_selection_enabled: bool = Field(
        default=True,
        validation_alias="AI_MODEL_SELECTION_ENABLED",
    )
    ai_default_fast_model: str | None = Field(
        default=None,
        validation_alias="AI_DEFAULT_FAST_MODEL",
    )
    ai_default_reasoning_model: str | None = Field(
        default=None,
        validation_alias="AI_DEFAULT_REASONING_MODEL",
    )
    ai_default_extraction_model: str | None = Field(
        default=None,
        validation_alias="AI_DEFAULT_EXTRACTION_MODEL",
    )
    ai_selection_strategy: str = Field(
        default="task_policy",
        validation_alias="AI_SELECTION_STRATEGY",
    )
    ai_provider_default: str = Field(
        default="ollama",
        validation_alias="AI_PROVIDER_DEFAULT",
    )
    ai_provider_fallback: str | None = Field(
        default=None,
        validation_alias="AI_PROVIDER_FALLBACK",
    )
    ai_local_provider_enabled: bool = Field(
        default=True,
        validation_alias="AI_LOCAL_PROVIDER_ENABLED",
    )
    ai_cloud_provider_enabled: bool = Field(
        default=False,
        validation_alias="AI_CLOUD_PROVIDER_ENABLED",
    )
    ai_routing_enabled: bool = Field(
        default=True,
        validation_alias="AI_ROUTING_ENABLED",
    )
    ai_routing_default_mode: str = Field(
        default="local_first",
        validation_alias="AI_ROUTING_DEFAULT_MODE",
    )
    ai_local_first: bool = Field(
        default=True,
        validation_alias="AI_LOCAL_FIRST",
    )
    ai_cloud_fallback_enabled: bool = Field(
        default=False,
        validation_alias="AI_CLOUD_FALLBACK_ENABLED",
    )
    ai_cloud_for_reasoning_enabled: bool = Field(
        default=False,
        validation_alias="AI_CLOUD_FOR_REASONING_ENABLED",
    )
    ai_privacy_strict_local: bool = Field(
        default=True,
        validation_alias="AI_PRIVACY_STRICT_LOCAL",
    )
    ai_privacy_classification_enabled: bool = Field(
        default=True,
        validation_alias="AI_PRIVACY_CLASSIFICATION_ENABLED",
    )
    ai_default_privacy_mode: str = Field(
        default="default",
        validation_alias="AI_DEFAULT_PRIVACY_MODE",
    )
    ai_cloud_blocked_sensitivity_levels: str = Field(
        default="confidential,restricted",
        validation_alias="AI_CLOUD_BLOCKED_SENSITIVITY_LEVELS",
    )
    ai_local_required_sensitivity_levels: str = Field(
        default="restricted",
        validation_alias="AI_LOCAL_REQUIRED_SENSITIVITY_LEVELS",
    )
    ai_classification_strict_mode: bool = Field(
        default=True,
        validation_alias="AI_CLASSIFICATION_STRICT_MODE",
    )
    ai_assume_uploaded_content_confidential: bool = Field(
        default=True,
        validation_alias="AI_ASSUME_UPLOADED_CONTENT_CONFIDENTIAL",
    )
    ai_audit_enabled: bool = Field(
        default=True,
        validation_alias="AI_AUDIT_ENABLED",
    )
    ai_audit_log_to_file: bool = Field(
        default=False,
        validation_alias="AI_AUDIT_LOG_TO_FILE",
    )
    ai_audit_file_path: str = Field(
        default="logs/ai_audit.jsonl",
        validation_alias="AI_AUDIT_FILE_PATH",
    )
    ai_audit_keep_in_memory: bool = Field(
        default=True,
        validation_alias="AI_AUDIT_KEEP_IN_MEMORY",
    )
    ai_audit_max_events: int = Field(
        default=500,
        validation_alias="AI_AUDIT_MAX_EVENTS",
        ge=1,
    )
    ai_audit_include_policy_tags: bool = Field(
        default=True,
        validation_alias="AI_AUDIT_INCLUDE_POLICY_TAGS",
    )
    ai_audit_redact_sensitive_fields: bool = Field(
        default=True,
        validation_alias="AI_AUDIT_REDACT_SENSITIVE_FIELDS",
    )
    ai_audit_include_provider_metadata: bool = Field(
        default=False,
        validation_alias="AI_AUDIT_INCLUDE_PROVIDER_METADATA",
    )
    ai_telemetry_enabled: bool = Field(
        default=True,
        validation_alias="AI_TELEMETRY_ENABLED",
    )
    ai_telemetry_log_to_file: bool = Field(
        default=False,
        validation_alias="AI_TELEMETRY_LOG_TO_FILE",
    )
    ai_telemetry_file_path: str = Field(
        default="logs/ai_telemetry.jsonl",
        validation_alias="AI_TELEMETRY_FILE_PATH",
    )
    ai_telemetry_keep_in_memory: bool = Field(
        default=True,
        validation_alias="AI_TELEMETRY_KEEP_IN_MEMORY",
    )
    ai_telemetry_max_events: int = Field(
        default=1000,
        validation_alias="AI_TELEMETRY_MAX_EVENTS",
        ge=1,
    )
    ai_telemetry_redact_sensitive_fields: bool = Field(
        default=True,
        validation_alias="AI_TELEMETRY_REDACT_SENSITIVE_FIELDS",
    )
    ai_telemetry_include_provider_metadata: bool = Field(
        default=False,
        validation_alias="AI_TELEMETRY_INCLUDE_PROVIDER_METADATA",
    )
    ai_cloud_allowed_tasks: str = Field(
        default="analyze_scenario,explain,summarize_context",
        validation_alias="AI_CLOUD_ALLOWED_TASKS",
    )
    ai_local_allowed_tasks: str = Field(
        default="analyze_scenario,extract_objects,explain,classify_intent,summarize_context",
        validation_alias="AI_LOCAL_ALLOWED_TASKS",
    )
    ai_benchmark_tuning_enabled: bool = Field(
        default=False,
        validation_alias="AI_BENCHMARK_TUNING_ENABLED",
    )
    ai_benchmark_results_path: str = Field(
        default="tools/ai_benchmark/benchmark_results.json",
        validation_alias="AI_BENCHMARK_RESULTS_PATH",
    )
    ai_benchmark_weight_latency: float = Field(
        default=0.35,
        validation_alias="AI_BENCHMARK_WEIGHT_LATENCY",
        ge=0.0,
        le=1.0,
    )
    ai_benchmark_weight_success: float = Field(
        default=0.35,
        validation_alias="AI_BENCHMARK_WEIGHT_SUCCESS",
        ge=0.0,
        le=1.0,
    )
    ai_benchmark_weight_json_validity: float = Field(
        default=0.2,
        validation_alias="AI_BENCHMARK_WEIGHT_JSON_VALIDITY",
        ge=0.0,
        le=1.0,
    )
    ai_benchmark_weight_extraction: float = Field(
        default=0.1,
        validation_alias="AI_BENCHMARK_WEIGHT_EXTRACTION",
        ge=0.0,
        le=1.0,
    )
    ai_benchmark_weight_reasoning: float = Field(
        default=0.25,
        validation_alias="AI_BENCHMARK_WEIGHT_REASONING",
        ge=0.0,
        le=1.0,
    )
    ai_benchmark_min_success_rate: float = Field(
        default=0.65,
        validation_alias="AI_BENCHMARK_MIN_SUCCESS_RATE",
        ge=0.0,
        le=1.0,
    )
    ollama_base_url: str = Field(
        default="http://localhost:11434",
        validation_alias="OLLAMA_BASE_URL",
    )
    ollama_default_model: str = Field(
        default="llama3.2:3b",
        validation_alias=AliasChoices("OLLAMA_DEFAULT_MODEL", "OLLAMA_MODEL"),
    )
    ollama_timeout_seconds: float = Field(
        default=10.0,
        validation_alias="OLLAMA_TIMEOUT_SECONDS",
        ge=0.1,
    )
    ollama_health_path: str = Field(
        default="/api/tags",
        validation_alias="OLLAMA_HEALTH_PATH",
    )
    openai_base_url: str = Field(
        default="https://api.openai.com/v1",
        validation_alias="OPENAI_BASE_URL",
    )
    openai_api_key: str | None = Field(
        default=None,
        validation_alias="OPENAI_API_KEY",
    )
    openai_default_model: str = Field(
        default="gpt-4o-mini",
        validation_alias="OPENAI_DEFAULT_MODEL",
    )
    anthropic_api_key: str | None = Field(
        default=None,
        validation_alias="ANTHROPIC_API_KEY",
    )
    anthropic_default_model: str = Field(
        default="claude-3-5-sonnet-latest",
        validation_alias="ANTHROPIC_DEFAULT_MODEL",
    )
    local_ai_provider: str = Field(default="ollama")

    @property
    def enabled(self) -> bool:
        """Backwards-compatible alias used by the existing local AI layer."""
        return self.ai_local_enabled

    @property
    def provider(self) -> str:
        """Return the configured provider name."""
        return self.local_ai_provider

    @property
    def base_url(self) -> str:
        """Backwards-compatible alias for the provider base URL."""
        return self.ollama_base_url.rstrip("/")

    @property
    def default_model(self) -> str:
        """Backwards-compatible alias for the default model name."""
        return self.ollama_default_model

    @property
    def timeout_seconds(self) -> float:
        """Backwards-compatible alias for request timeout seconds."""
        return self.ollama_timeout_seconds

    @property
    def health_path(self) -> str:
        """Normalized health endpoint path for the local AI provider."""
        path = self.ollama_health_path.strip() or "/api/tags"
        return path if path.startswith("/") else f"/{path}"

    @property
    def log_raw_responses(self) -> bool:
        """Return whether raw provider responses should be logged."""
        return self.ai_local_log_raw_responses

    @property
    def model_selection_enabled(self) -> bool:
        """Return whether task-based model selection is enabled."""
        return self.ai_model_selection_enabled

    @property
    def fast_model(self) -> str:
        """Return the configured fast-path model."""
        return (self.ai_default_fast_model or self.default_model).strip()

    @property
    def reasoning_model(self) -> str:
        """Return the configured reasoning model."""
        return (self.ai_default_reasoning_model or self.default_model).strip()

    @property
    def extraction_model(self) -> str:
        """Return the configured extraction model."""
        return (self.ai_default_extraction_model or self.default_model).strip()

    @property
    def benchmark_tuning_enabled(self) -> bool:
        """Return whether benchmark-assisted tuning is enabled."""
        return self.ai_benchmark_tuning_enabled

    @property
    def benchmark_results_path(self) -> str:
        """Return the configured benchmark results path."""
        return self.ai_benchmark_results_path.strip()

    @property
    def benchmark_weights(self) -> dict[str, float]:
        """Return normalized benchmark tuning weights."""
        return {
            "latency": self.ai_benchmark_weight_latency,
            "success": self.ai_benchmark_weight_success,
            "json_validity": self.ai_benchmark_weight_json_validity,
            "extraction": self.ai_benchmark_weight_extraction,
            "reasoning": self.ai_benchmark_weight_reasoning,
        }

    @property
    def benchmark_min_success_rate(self) -> float:
        """Return the minimum success rate required for benchmark preference boosts."""
        return self.ai_benchmark_min_success_rate

    @property
    def default_provider(self) -> str:
        """Return the default provider key for provider routing."""
        return (self.ai_provider_default or self.local_ai_provider).strip()

    @property
    def fallback_provider(self) -> str | None:
        """Return the fallback provider key for provider routing."""
        if self.ai_provider_fallback is None:
            return None
        normalized = self.ai_provider_fallback.strip()
        return normalized or None

    @property
    def local_provider_enabled(self) -> bool:
        """Return whether local providers may be selected."""
        return self.ai_local_provider_enabled

    @property
    def cloud_provider_enabled(self) -> bool:
        """Return whether cloud providers may be selected."""
        return self.ai_cloud_provider_enabled

    @property
    def openai_enabled(self) -> bool:
        """Return whether the OpenAI provider is configured for use."""
        return self.cloud_provider_enabled and bool((self.openai_api_key or "").strip())

    @property
    def anthropic_enabled(self) -> bool:
        """Return whether the Anthropic provider is configured for use."""
        return self.cloud_provider_enabled and bool((self.anthropic_api_key or "").strip())

    @property
    def routing_enabled(self) -> bool:
        """Return whether hybrid provider routing is enabled."""
        return self.ai_routing_enabled

    @property
    def routing_default_mode(self) -> str:
        """Return the configured default routing mode."""
        return self.ai_routing_default_mode.strip().lower() or "local_first"

    @property
    def local_first(self) -> bool:
        """Return whether routing should prefer local providers."""
        return self.ai_local_first

    @property
    def cloud_fallback_enabled(self) -> bool:
        """Return whether cloud fallback may be used when local is unavailable."""
        return self.ai_cloud_fallback_enabled

    @property
    def cloud_for_reasoning_enabled(self) -> bool:
        """Return whether reasoning-oriented tasks may route to cloud."""
        return self.ai_cloud_for_reasoning_enabled

    @property
    def privacy_strict_local(self) -> bool:
        """Return whether privacy-sensitive tasks must remain local."""
        return self.ai_privacy_strict_local

    @property
    def privacy_classification_enabled(self) -> bool:
        """Return whether privacy classification is enabled."""
        return self.ai_privacy_classification_enabled

    @property
    def default_privacy_mode(self) -> str:
        """Return the default privacy mode."""
        return self.ai_default_privacy_mode.strip().lower() or "default"

    @property
    def cloud_blocked_sensitivity_levels(self) -> set[str]:
        """Return sensitivity levels that block cloud routing."""
        return _parse_csv_to_set(self.ai_cloud_blocked_sensitivity_levels)

    @property
    def local_required_sensitivity_levels(self) -> set[str]:
        """Return sensitivity levels that require local execution."""
        return _parse_csv_to_set(self.ai_local_required_sensitivity_levels)

    @property
    def classification_strict_mode(self) -> bool:
        """Return whether conservative privacy classification strict mode is enabled."""
        return self.ai_classification_strict_mode

    @property
    def assume_uploaded_content_confidential(self) -> bool:
        """Return whether uploaded content should default to confidential."""
        return self.ai_assume_uploaded_content_confidential

    @property
    def audit_enabled(self) -> bool:
        """Return whether AI audit logging is enabled."""
        return self.ai_audit_enabled

    @property
    def audit_log_to_file(self) -> bool:
        """Return whether AI audit events should be appended to JSONL."""
        return self.ai_audit_log_to_file

    @property
    def audit_file_path(self) -> str:
        """Return the configured AI audit JSONL file path."""
        return self.ai_audit_file_path.strip()

    @property
    def audit_keep_in_memory(self) -> bool:
        """Return whether recent AI audit events should be stored in memory."""
        return self.ai_audit_keep_in_memory

    @property
    def audit_max_events(self) -> int:
        """Return the maximum number of in-memory AI audit events."""
        return self.ai_audit_max_events

    @property
    def audit_include_policy_tags(self) -> bool:
        """Return whether policy tags should be included in audit events."""
        return self.ai_audit_include_policy_tags

    @property
    def audit_redact_sensitive_fields(self) -> bool:
        """Return whether sensitive audit fields should be redacted."""
        return self.ai_audit_redact_sensitive_fields

    @property
    def audit_include_provider_metadata(self) -> bool:
        """Return whether provider metadata may be included in audit events."""
        return self.ai_audit_include_provider_metadata

    @property
    def telemetry_enabled(self) -> bool:
        """Return whether AI telemetry collection is enabled."""
        return self.ai_telemetry_enabled

    @property
    def telemetry_log_to_file(self) -> bool:
        """Return whether telemetry events should be appended to JSONL."""
        return self.ai_telemetry_log_to_file

    @property
    def telemetry_file_path(self) -> str:
        """Return the configured telemetry JSONL file path."""
        return self.ai_telemetry_file_path.strip()

    @property
    def telemetry_keep_in_memory(self) -> bool:
        """Return whether telemetry events should be retained in memory."""
        return self.ai_telemetry_keep_in_memory

    @property
    def telemetry_max_events(self) -> int:
        """Return the maximum number of retained telemetry events."""
        return self.ai_telemetry_max_events

    @property
    def telemetry_redact_sensitive_fields(self) -> bool:
        """Return whether telemetry metadata should redact sensitive values."""
        return self.ai_telemetry_redact_sensitive_fields

    @property
    def telemetry_include_provider_metadata(self) -> bool:
        """Return whether provider metadata may be included in telemetry events."""
        return self.ai_telemetry_include_provider_metadata

    @property
    def cloud_allowed_tasks(self) -> set[str]:
        """Return tasks that may route to cloud when policy allows."""
        return _parse_csv_to_set(self.ai_cloud_allowed_tasks)

    @property
    def local_allowed_tasks(self) -> set[str]:
        """Return tasks that may route to local providers."""
        return _parse_csv_to_set(self.ai_local_allowed_tasks)


@lru_cache(maxsize=1)
def get_local_ai_settings() -> LocalAISettings:
    """Return cached local AI configuration loaded from the environment."""
    return LocalAISettings()


def _parse_csv_to_set(raw_value: str) -> set[str]:
    """Normalize a comma-separated configuration string into a set."""
    return {
        item.strip()
        for item in raw_value.split(",")
        if isinstance(item, str) and item.strip()
    }
