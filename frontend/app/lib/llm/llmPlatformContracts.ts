/**
 * LLM-1 — LLM Platform contracts and constants.
 */

export const LLM_PLATFORM_CONTRACT_VERSION = "LLM/1" as const;
export const LLM_PLATFORM_ARCHITECTURE_VERSION = "LLM/1-arch" as const;
export const LLM_PLATFORM_API_VERSION = "LLM/1" as const;
export const LLM_PLATFORM_COMPATIBILITY_VERSION = "LLM/1-compat" as const;
export const LLM_PLATFORM_SOURCE = "llm-platform-foundation" as const;
export const LLM_PLATFORM_LOG_PREFIX = "[NexoraLLM]" as const;
export const LLM_PLATFORM_LAYER_ID = "LLM" as const;

export const LLM_PLATFORM_ID = "llm-platform" as const;
export const LLM_PLATFORM_NAME = "LLM Platform" as const;

export const LLM_PLATFORM_TAGS = Object.freeze([
  "[LLM_1]",
  "[LLM_FOUNDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_PROVIDER_CALLS]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const LLM_PLATFORM_PRINCIPLES = Object.freeze([
  "provider_independent",
  "multiple_llm_providers_supported",
  "future_local_models_supported",
  "cloud_providers_supported",
  "enterprise_deployment_supported",
  "deterministic_where_applicable",
  "business_intelligence_inside_nexora",
  "llms_are_replaceable_external_services",
  "llm_platform_is_only_provider_gateway",
  "no_other_nexora_layer_calls_providers_directly",
] as const);

export const LLM_PROVIDER_KEYS = Object.freeze([
  "gpt",
  "ollama",
  "claude",
  "gemini",
  "local_models",
  "future_providers",
] as const);

export const LLM_RUNTIME_CONTRACT_KEYS = Object.freeze([
  "runtime_execution",
  "runtime_request",
  "runtime_response",
  "runtime_lifecycle",
] as const);

export const LLM_EXTENSION_POINT_KEYS = Object.freeze([
  "provider_adapters",
  "runtime",
  "prompt_builder",
  "context_builder",
  "cache",
  "streaming",
  "security",
  "billing",
  "tool_calling",
  "model_registry",
] as const);

export const LLM_PLATFORM_MUST_OWN = Object.freeze([
  "provider_abstraction",
  "llm_communication",
  "prompt_transport",
  "model_routing",
  "runtime_contracts",
  "provider_lifecycle",
] as const);

export const LLM_PLATFORM_MUST_NOT_OWN = Object.freeze([
  "business_logic",
  "executive_intelligence",
  "knowledge_generation",
  "decision_making",
  "scenario_reasoning",
  "kpi_calculations",
  "risk_calculations",
  "timeline_analysis",
  "prompt_generation",
  "context_building",
  "token_metering",
  "cost_calculation",
  "cache_execution",
  "streaming_execution",
  "retry_execution",
  "security_filters",
  "billing",
  "provider_api_calls",
  "model_inference",
] as const);

export const LLM_FUTURE_PHASE_KEYS = Object.freeze([
  "provider_router",
  "runtime",
  "prompt_builder",
  "context_builder",
  "token_meter",
  "cost_calculator",
  "streaming",
  "retry",
  "security",
  "billing",
  "tool_calling",
  "model_registry",
  "platform_certification",
] as const);

export const LLM_FUTURE_DEPENDENCY_RULES = Object.freeze([
  Object.freeze({
    ruleId: "llm-1-prerequisite",
    description: "All LLM phases must depend on LLM/1.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-direct-provider-calls",
    description: "No Nexora layer other than LLM Platform may call external LLM providers.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "extend-only-contracts",
    description: "Future phases extend contracts only; no breaking changes to LLM/1.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-knl-modification",
    description: "LLM must not modify certified KNL platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-app-modification",
    description: "LLM must not modify certified APP platforms.",
    enforced: true as const,
  }),
] as const);

export const LLM_PUBLIC_API_REGISTRY = Object.freeze([
  "getLlmPlatformIdentity",
  "getLlmPlatformBoundaries",
  "getLlmPlatformRegistry",
  "getLlmPlatformVersionMetadata",
  "buildLlmPlatformFoundation",
  "validateLlmPlatformContracts",
  "getLlmPlatformManifest",
] as const);

export const LLM_VERSION_PATTERN = /^LLM\/\d+$/;

export const LLM_RELEASE_METADATA = Object.freeze({
  releaseStage: "mvp-foundation",
  mvpStatus: "active",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  compatibilityLevel: "foundation",
  readOnly: true as const,
});

export const LLM_MIGRATION_STRATEGY = Object.freeze({
  strategyId: "llm-contract-extension",
  description: "Future LLM phases extend LLM/1 contracts additively. Breaking changes require a new platform major version.",
  additiveOnly: true,
  breakingChangesForbidden: true,
  readOnly: true as const,
});

export const LLM_PROVIDER_LABELS = Object.freeze({
  gpt: "GPT Provider",
  ollama: "Ollama Provider",
  claude: "Claude Provider",
  gemini: "Gemini Provider",
  local_models: "Local Models Provider",
  future_providers: "Future Providers",
} as const);

export const LLM_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "llm-provider-adapters", label: "Provider Adapters", phaseKey: "provider_adapters", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-runtime", label: "LLM Runtime", phaseKey: "runtime", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-prompt-builder", label: "Prompt Builder", phaseKey: "prompt_builder", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-context-builder", label: "Context Builder", phaseKey: "context_builder", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-cache", label: "Cache Platform", phaseKey: "cache", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-streaming", label: "Streaming", phaseKey: "streaming", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-security", label: "Security Filters", phaseKey: "security", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-billing", label: "Billing", phaseKey: "billing", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-tool-calling", label: "Tool Calling", phaseKey: "tool_calling", status: "reserved" as const }),
  Object.freeze({ extensionId: "llm-model-registry", label: "Model Registry", phaseKey: "model_registry", status: "reserved" as const }),
] as const);

export const LLM_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredProviders: 64,
  maxRegisteredExtensionPoints: 32,
  maxRegisteredRuntimeContracts: 16,
} as const);

export const LLM_ARCHITECTURE_STACK = Object.freeze([
  "CORE",
  "KNL",
  "APP",
  "LLM",
  "SMM",
  "ASS",
  "IDN",
  "LAY",
  "EBUS",
  "INTG",
  "SEC",
  "OPS",
] as const);
