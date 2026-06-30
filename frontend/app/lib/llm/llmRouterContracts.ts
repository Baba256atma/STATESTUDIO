/**
 * LLM-8 — Model Router contracts and constants.
 */

export const LLM_ROUTER_CONTRACT_VERSION = "LLM/8" as const;
export const LLM_ROUTER_PLATFORM_ID = "llm-model-router" as const;
export const LLM_ROUTER_PLATFORM_NAME = "Model Router" as const;
export const LLM_ROUTER_FOUNDATION_DEPENDENCY = "LLM/1" as const;
export const LLM_ROUTER_PROVIDER_DEPENDENCY = "LLM/2" as const;
export const LLM_ROUTER_RUNTIME_DEPENDENCY = "LLM/3" as const;
export const LLM_ROUTER_COST_DEPENDENCY = "LLM/7" as const;

export const LLM_ROUTER_TAGS = Object.freeze([
  "[LLM_8]",
  "[MODEL_ROUTER]",
  "[DETERMINISTIC]",
  "[SELECTION_ONLY]",
  "[NO_EXECUTION]",
  "[NO_PROVIDER_CALLS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_ROUTER_POLICY_KEYS = Object.freeze([
  "default_route",
  "provider_preferred",
  "model_preferred",
  "capability_based",
  "cost_aware",
  "latency_aware",
  "local_first",
  "enterprise_override",
] as const);

export const LLM_ROUTER_PLACEHOLDER_POLICY_KEYS = Object.freeze([
  "cost_aware",
  "latency_aware",
  "local_first",
] as const);

export const LLM_ROUTER_PUBLIC_API_REGISTRY = Object.freeze([
  "selectLlmModelRoute",
  "validateLlmRouteDecision",
  "registerLlmRoutePolicy",
  "discoverLlmRoutePolicies",
  "getLlmRouteManifest",
  "getLlmRouterRegistry",
  "buildLlmModelRouterLayer",
] as const);

export const LLM_ROUTER_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
  "LLM/5",
  "LLM/6",
  "LLM/7",
] as const);

export const LLM_ROUTER_PRINCIPLES = Object.freeze([
  "router_selects_only_never_executes",
  "deterministic_route_decisions",
  "provider_independent",
  "no_live_provider_health",
  "no_live_cost_calculation",
  "no_billing_no_quota_enforcement",
  "placeholder_policies_contract_level_only",
] as const);

export const LLM_ROUTER_DEFAULT_ROUTE = Object.freeze({
  providerKey: "gpt",
  modelKey: "gpt-4o-mini",
} as const);

export const LLM_ROUTER_DEFAULT_FALLBACK = Object.freeze({
  providerKey: "ollama",
  modelKey: "llama3",
} as const);

export const LLM_ROUTER_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredPolicies: 32,
  maxRouteDecisions: 4096,
} as const);

export const LLM_ROUTER_MUST_NOT_OWN = Object.freeze([
  "provider_execution",
  "prompt_generation",
  "token_metering",
  "cost_calculation",
  "billing",
  "quota_enforcement",
  "live_health_checks",
] as const);

export const LLM_ROUTER_KNOWN_ROUTES = Object.freeze([
  Object.freeze({ providerKey: "gpt", modelKey: "gpt-4o-mini" }),
  Object.freeze({ providerKey: "gpt", modelKey: "gpt-4o" }),
  Object.freeze({ providerKey: "claude", modelKey: "claude-3-5-sonnet" }),
  Object.freeze({ providerKey: "claude", modelKey: "claude-3-haiku" }),
  Object.freeze({ providerKey: "gemini", modelKey: "gemini-1.5-pro" }),
  Object.freeze({ providerKey: "ollama", modelKey: "llama3" }),
  Object.freeze({ providerKey: "local_models", modelKey: "local-default" }),
  Object.freeze({ providerKey: "future_providers", modelKey: "future-default" }),
] as const);

export const LLM_ROUTER_DEFAULT_MODEL_BY_PROVIDER = Object.freeze({
  gpt: "gpt-4o-mini",
  ollama: "llama3",
  claude: "claude-3-haiku",
  gemini: "gemini-1.5-pro",
  local_models: "local-default",
  future_providers: "future-default",
} as const);
