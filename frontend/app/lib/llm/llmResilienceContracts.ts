/**
 * LLM-11 — Retry, Timeout & Fallback Coordinator contracts and constants.
 */

export const LLM_RESILIENCE_CONTRACT_VERSION = "LLM/11" as const;
export const LLM_RESILIENCE_PLATFORM_ID = "llm-resilience-coordinator" as const;
export const LLM_RESILIENCE_PLATFORM_NAME = "Retry, Timeout & Fallback Coordinator" as const;
export const LLM_RESILIENCE_SECURITY_DEPENDENCY = "LLM/10" as const;
export const LLM_RESILIENCE_ROUTER_DEPENDENCY = "LLM/8" as const;

export const LLM_RESILIENCE_TAGS = Object.freeze([
  "[LLM_11]",
  "[RESILIENCE_COORDINATOR]",
  "[DETERMINISTIC]",
  "[COORDINATION_ONLY]",
  "[NO_EXECUTION]",
  "[NO_PROVIDER_CALLS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_RESILIENCE_RETRY_POLICY_KEYS = Object.freeze([
  "never_retry",
  "retry_once",
  "retry_twice",
  "configurable_retry",
  "provider_failure",
  "timeout_failure",
  "network_failure",
  "unknown_failure",
] as const);

export const LLM_RESILIENCE_TIMEOUT_POLICY_KEYS = Object.freeze([
  "immediate",
  "short",
  "standard",
  "long",
  "enterprise_override",
] as const);

export const LLM_RESILIENCE_FALLBACK_POLICY_KEYS = Object.freeze([
  "no_fallback",
  "same_provider_alternate_model",
  "alternate_provider",
  "local_first",
  "enterprise_override",
] as const);

export const LLM_RESILIENCE_FAILURE_CATEGORY_KEYS = Object.freeze([
  "timeout",
  "provider_unavailable",
  "invalid_response",
  "validation_failure",
  "security_denial",
  "unknown_failure",
] as const);

export const LLM_RESILIENCE_PUBLIC_API_REGISTRY = Object.freeze([
  "buildResilienceDecision",
  "validateResilienceDecision",
  "registerRetryPolicy",
  "registerTimeoutPolicy",
  "registerFallbackPolicy",
  "discoverResiliencePolicies",
  "getResilienceManifest",
  "getResilienceRegistry",
  "buildLlmResilienceCoordinatorLayer",
] as const);

export const LLM_RESILIENCE_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
  "LLM/5",
  "LLM/6",
  "LLM/7",
  "LLM/8",
  "LLM/9",
  "LLM/10",
] as const);

export const LLM_RESILIENCE_PRINCIPLES = Object.freeze([
  "coordinates_only_never_executes",
  "no_provider_calls_no_runtime_execution",
  "no_billing_no_security_or_routing_changes",
  "deterministic_policy_coordination",
  "timeout_values_metadata_only",
  "fallback_references_routes_never_selects",
  "future_runtime_consumes_contracts",
] as const);

export const LLM_RESILIENCE_MUST_NOT_OWN = Object.freeze([
  "provider_execution",
  "retry_loops",
  "timeout_timers",
  "route_selection",
  "security_policy_changes",
  "billing",
] as const);

export const LLM_RESILIENCE_DEFAULT_LIMITS = Object.freeze({
  maxRetryPolicies: 32,
  maxTimeoutPolicies: 16,
  maxFallbackPolicies: 16,
} as const);

export const LLM_RESILIENCE_TIMEOUT_METADATA_MS = Object.freeze({
  immediate: 1000,
  short: 5000,
  standard: 30000,
  long: 120000,
  enterprise_override: 60000,
} as const);

export const LLM_RESILIENCE_CONFIGURABLE_RETRY_ATTEMPTS = Object.freeze({
  configurable_retry: 3,
  retry_once: 1,
  retry_twice: 2,
} as const);
