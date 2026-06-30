/**
 * LLM-13 — Enterprise Cache Platform contracts and constants.
 */

export const LLM_CACHE_CONTRACT_VERSION = "LLM/13" as const;
export const LLM_CACHE_PLATFORM_ID = "llm-enterprise-cache-platform" as const;
export const LLM_CACHE_PLATFORM_NAME = "Enterprise Cache Platform" as const;
export const LLM_CACHE_RUNTIME_DEPENDENCY = "LLM/12" as const;

export const LLM_CACHE_POLICY_KEYS = Object.freeze([
  "no_cache",
  "session_cache",
  "workspace_cache",
  "organization_cache",
] as const);

export const LLM_CACHE_EXPIRATION_KEYS = Object.freeze([
  "immediate",
  "five_minutes",
  "one_hour",
  "twenty_four_hours",
  "never",
] as const);

export const LLM_CACHE_EXPIRATION_MS: Readonly<Record<(typeof LLM_CACHE_EXPIRATION_KEYS)[number], number | null>> =
  Object.freeze({
    immediate: 0,
    five_minutes: 5 * 60 * 1000,
    one_hour: 60 * 60 * 1000,
    twenty_four_hours: 24 * 60 * 60 * 1000,
    never: null,
  });

export const LLM_CACHE_NON_CACHEABLE_REASONS = Object.freeze([
  "authentication_failure",
  "provider_error",
  "timeout",
  "partial_stream",
  "invalid_response",
  "explicit_bypass",
  "policy_no_cache",
] as const);

export const LLM_CACHE_PUBLIC_API_REGISTRY = Object.freeze([
  "lookupLlmCache",
  "storeLlmCacheResponse",
  "bypassLlmCache",
  "invalidateLlmCache",
  "getLlmCacheStatistics",
  "getLlmCachePlatformSnapshot",
  "resetLlmCachePlatformForTests",
] as const);

export const LLM_CACHE_SAFETY_RULES = Object.freeze([
  "never_cache_authentication_failures",
  "never_cache_provider_errors",
  "never_cache_timeout_responses",
  "never_cache_partial_streams",
  "never_cache_invalid_responses",
  "support_explicit_cache_bypass",
  "statistics_do_not_influence_runtime",
] as const);

export const LLM_CACHE_MUST_NOT_OWN = Object.freeze([
  "prompt_generation",
  "context_builder",
  "token_meter",
  "provider_routing",
  "business_logic",
  "llm_runtime_execution",
] as const);

export const LLM_CACHE_KEY_SEPARATOR = "|" as const;

export const LLM_CACHE_DEFAULT_LIMITS = Object.freeze({
  maxEntries: 4096,
  maxBypassRecords: 256,
} as const);
