/**
 * LLM-2 — Provider Adapter contracts and constants.
 */

export const LLM_PROVIDER_CONTRACT_VERSION = "LLM/2" as const;
export const LLM_PROVIDER_PLATFORM_ID = "llm-provider-adapter-contracts" as const;
export const LLM_PROVIDER_PLATFORM_NAME = "Provider Adapter Contracts" as const;
export const LLM_PROVIDER_FOUNDATION_DEPENDENCY = "LLM/1" as const;

export const LLM_PROVIDER_TAGS = Object.freeze([
  "[LLM_2]",
  "[PROVIDER_ADAPTERS]",
  "[CONTRACT_ONLY]",
  "[DETERMINISTIC]",
  "[NO_HTTP]",
  "[NO_SDK]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_PROVIDER_CAPABILITY_KEYS = Object.freeze([
  "chat",
  "completion",
  "streaming",
  "function_calling",
  "vision",
  "embeddings",
  "reasoning",
  "json_output",
  "structured_output",
  "image_generation",
  "audio",
] as const);

export const LLM_PROVIDER_RESERVED_CAPABILITY_KEYS = Object.freeze([
  "image_generation",
  "audio",
] as const);

export const LLM_PROVIDER_ERROR_CATEGORY_KEYS = Object.freeze([
  "authentication",
  "authorization",
  "rate_limit",
  "timeout",
  "provider_unavailable",
  "invalid_request",
  "invalid_response",
  "internal_error",
  "unknown_error",
] as const);

export const LLM_PROVIDER_HEALTH_STATE_KEYS = Object.freeze([
  "healthy",
  "degraded",
  "offline",
  "maintenance",
  "unknown",
] as const);

export const LLM_PROVIDER_STATUS_KEYS = Object.freeze([
  "registered",
  "reserved",
  "deprecated",
] as const);

export const LLM_PROVIDER_AUTH_METHOD_KEYS = Object.freeze([
  "api_key",
  "bearer_token",
  "oauth",
  "local_credentials",
  "none",
] as const);

export const LLM_PROVIDER_VENDOR_LABELS = Object.freeze({
  gpt: "OpenAI",
  ollama: "Ollama",
  claude: "Anthropic",
  gemini: "Google",
  local_models: "Local Models",
  future_providers: "Future Provider",
} as const);

export const LLM_PROVIDER_PUBLIC_API_REGISTRY = Object.freeze([
  "registerLlmProviderAdapter",
  "discoverLlmProviderAdapters",
  "getLlmProviderAdapterRegistry",
  "validateLlmProviderAdapter",
  "validateLlmProviderRegistry",
  "buildLlmProviderAdapterLayer",
  "getLlmProviderAdapterManifest",
] as const);

export const LLM_PROVIDER_MANDATORY_IDENTITY_FIELDS = Object.freeze([
  "providerId",
  "providerKey",
  "displayName",
  "version",
  "vendor",
  "contractVersion",
  "supportedCapabilities",
  "status",
  "readOnly",
] as const);

export const LLM_PROVIDER_MANDATORY_REQUEST_FIELDS = Object.freeze([
  "requestId",
  "providerKey",
  "modelId",
  "requestType",
  "readOnly",
] as const);

export const LLM_PROVIDER_MANDATORY_RESPONSE_FIELDS = Object.freeze([
  "responseId",
  "requestId",
  "providerKey",
  "modelId",
  "responseType",
  "readOnly",
] as const);

export const LLM_PROVIDER_COMPATIBLE_FOUNDATION_VERSIONS = Object.freeze([
  "LLM/1",
] as const);

export const LLM_PROVIDER_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredAdapters: 64,
} as const);

export const LLM_PROVIDER_DEFAULT_CAPABILITIES = Object.freeze({
  gpt: Object.freeze(["chat", "completion", "streaming", "function_calling", "vision", "embeddings", "json_output", "structured_output"] as const),
  ollama: Object.freeze(["chat", "completion", "streaming", "embeddings"] as const),
  claude: Object.freeze(["chat", "completion", "streaming", "function_calling", "vision", "reasoning", "json_output", "structured_output"] as const),
  gemini: Object.freeze(["chat", "completion", "streaming", "function_calling", "vision", "embeddings", "json_output"] as const),
  local_models: Object.freeze(["chat", "completion", "streaming", "embeddings"] as const),
  future_providers: Object.freeze(["chat"] as const),
} as const);

export const LLM_PROVIDER_PRINCIPLES = Object.freeze([
  "every_provider_implements_same_interface",
  "nexora_never_knows_active_provider",
  "provider_specific_formats_forbidden_outside_adapters",
  "capabilities_declare_support_only",
  "no_http_no_sdk_no_runtime",
  "immutable_contracts",
  "provider_errors_normalized",
] as const);
