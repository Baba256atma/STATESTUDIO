/**
 * LLM-6 — Token Usage Meter contracts and constants.
 */

export const LLM_TOKEN_CONTRACT_VERSION = "LLM/6" as const;
export const LLM_TOKEN_PLATFORM_ID = "llm-token-usage-meter" as const;
export const LLM_TOKEN_PLATFORM_NAME = "Token Usage Meter" as const;
export const LLM_TOKEN_FOUNDATION_DEPENDENCY = "LLM/1" as const;
export const LLM_TOKEN_PROVIDER_DEPENDENCY = "LLM/2" as const;
export const LLM_TOKEN_RUNTIME_DEPENDENCY = "LLM/3" as const;
export const LLM_TOKEN_PROMPT_DEPENDENCY = "LLM/4" as const;
export const LLM_TOKEN_CONTEXT_DEPENDENCY = "LLM/5" as const;

export const LLM_TOKEN_TAGS = Object.freeze([
  "[LLM_6]",
  "[TOKEN_METER]",
  "[DETERMINISTIC]",
  "[OBSERVATION_ONLY]",
  "[NO_BILLING]",
  "[NO_PROVIDER_TOKENIZERS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_TOKEN_AGGREGATION_SCOPE_KEYS = Object.freeze([
  "user",
  "session",
  "workspace",
  "organization",
  "provider",
  "model",
] as const);

export const LLM_TOKEN_PUBLIC_API_REGISTRY = Object.freeze([
  "recordTokenUsage",
  "estimateTokenUsage",
  "aggregateTokenUsage",
  "validateTokenRecord",
  "getTokenManifest",
  "getTokenRegistry",
  "buildLlmTokenMeterLayer",
] as const);

export const LLM_TOKEN_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
  "LLM/5",
] as const);

export const LLM_TOKEN_PRINCIPLES = Object.freeze([
  "observation_only_never_modifies_requests_or_responses",
  "deterministic_estimation_without_provider_tokenizers",
  "no_billing_no_monetary_cost",
  "immutable_usage_records",
  "isolated_aggregation_scopes",
  "provider_independent",
  "future_reconciliation_supported",
] as const);

export const LLM_TOKEN_ESTIMATION_RULE = Object.freeze({
  ruleId: "chars-divided-by-four-ceiling",
  description: "Deterministic token estimate: ceil(characterCount / 4). No provider tokenizers.",
  charsPerToken: 4,
  readOnly: true as const,
});

export const LLM_TOKEN_MANDATORY_RECORD_FIELDS = Object.freeze([
  "recordId",
  "requestId",
  "responseId",
  "providerKey",
  "modelKey",
  "userId",
  "workspaceId",
  "organizationId",
  "estimatedInputTokens",
  "estimatedOutputTokens",
  "totalTokens",
  "timestamp",
  "readOnly",
] as const);

export const LLM_TOKEN_DEFAULT_LIMITS = Object.freeze({
  maxRecords: 8192,
  maxAggregationKeys: 512,
} as const);

export const LLM_TOKEN_MUST_NOT_OWN = Object.freeze([
  "billing",
  "monetary_cost_calculation",
  "provider_api_calls",
  "request_modification",
  "response_modification",
  "provider_specific_tokenizers",
  "database_persistence",
] as const);
