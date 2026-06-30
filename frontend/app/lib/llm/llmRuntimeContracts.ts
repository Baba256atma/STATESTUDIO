/**
 * LLM-3 — Runtime Request/Response contracts and constants.
 */

export const LLM_RUNTIME_CONTRACT_VERSION = "LLM/3" as const;
export const LLM_RUNTIME_PLATFORM_ID = "llm-runtime-contracts" as const;
export const LLM_RUNTIME_PLATFORM_NAME = "Runtime Request & Response Contracts" as const;
export const LLM_RUNTIME_FOUNDATION_DEPENDENCY = "LLM/1" as const;
export const LLM_RUNTIME_PROVIDER_DEPENDENCY = "LLM/2" as const;

export const LLM_RUNTIME_TAGS = Object.freeze([
  "[LLM_3]",
  "[RUNTIME_CONTRACTS]",
  "[CONTRACT_FIRST]",
  "[DETERMINISTIC]",
  "[NO_HTTP]",
  "[NO_SDK]",
  "[NO_PROVIDER_CALLS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_RUNTIME_STATUS_KEYS = Object.freeze([
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
  "timed_out",
  "dry_run",
] as const);

export const LLM_RUNTIME_MODE_KEYS = Object.freeze([
  "standard",
  "dry_run",
  "mock",
] as const);

export const LLM_RUNTIME_LIFECYCLE_KEYS = Object.freeze([
  "created",
  "validated",
  "dispatched",
  "executing",
  "finalized",
] as const);

export const LLM_RUNTIME_VALIDATION_RULE_KEYS = Object.freeze([
  "required_request_fields",
  "provider_key_compatibility",
  "runtime_mode_validity",
  "token_limit_bounds",
  "temperature_bounds",
  "trace_correlation_presence",
  "response_consistency",
  "error_consistency",
] as const);

export const LLM_RUNTIME_PUBLIC_API_REGISTRY = Object.freeze([
  "buildLlmRuntimeRequestEnvelope",
  "buildLlmRuntimeResponseEnvelope",
  "validateLlmRuntimeRequest",
  "validateLlmRuntimeResponse",
  "executeDryRunRuntimeRequest",
  "getLlmRuntimeRegistry",
  "buildLlmRuntimeContractLayer",
  "getLlmRuntimeManifest",
] as const);

export const LLM_RUNTIME_MANDATORY_REQUEST_FIELDS = Object.freeze([
  "requestId",
  "traceId",
  "correlationId",
  "userMessage",
  "systemInstructionRef",
  "providerKey",
  "modelKey",
  "runtimeMode",
  "workspaceId",
  "organizationId",
  "userId",
  "dryRun",
  "readOnly",
] as const);

export const LLM_RUNTIME_MANDATORY_RESPONSE_FIELDS = Object.freeze([
  "responseId",
  "requestId",
  "providerKey",
  "modelKey",
  "status",
  "outputText",
  "createdAt",
  "readOnly",
] as const);

export const LLM_RUNTIME_LIMITS = Object.freeze({
  minTemperature: 0,
  maxTemperature: 2,
  minMaxTokens: 1,
  maxMaxTokens: 128_000,
  maxUserMessageLength: 32_768,
} as const);

export const LLM_RUNTIME_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
] as const);

export const LLM_RUNTIME_PRINCIPLES = Object.freeze([
  "normalized_request_response_only",
  "no_provider_specific_payloads",
  "dry_run_never_calls_providers",
  "adapter_execution_interface_only",
  "deterministic_mock_for_tests",
  "business_logic_outside_llm_platform",
] as const);

export const LLM_RUNTIME_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredContracts: 32,
  maxRegisteredModes: 16,
} as const);

export const LLM_RUNTIME_DRY_RUN_OUTPUT_PREFIX = "[DRY-RUN]" as const;
