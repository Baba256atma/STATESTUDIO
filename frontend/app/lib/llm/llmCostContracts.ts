/**
 * LLM-7 — Cost Estimator contracts and constants.
 */

export const LLM_COST_CONTRACT_VERSION = "LLM/7" as const;
export const LLM_COST_PLATFORM_ID = "llm-cost-estimator" as const;
export const LLM_COST_PLATFORM_NAME = "Cost Estimator" as const;
export const LLM_COST_FOUNDATION_DEPENDENCY = "LLM/1" as const;
export const LLM_COST_TOKEN_DEPENDENCY = "LLM/6" as const;

export const LLM_COST_TAGS = Object.freeze([
  "[LLM_7]",
  "[COST_ESTIMATOR]",
  "[DETERMINISTIC]",
  "[ESTIMATION_ONLY]",
  "[NO_BILLING]",
  "[NO_LIVE_PRICING]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_COST_AGGREGATION_SCOPE_KEYS = Object.freeze([
  "user",
  "workspace",
  "organization",
  "provider",
  "model",
  "currency",
] as const);

export const LLM_COST_PUBLIC_API_REGISTRY = Object.freeze([
  "estimateLlmCost",
  "recordLlmCost",
  "aggregateLlmCost",
  "validateLlmCostRecord",
  "getLlmCostManifest",
  "getLlmCostRegistry",
  "buildLlmCostEstimatorLayer",
] as const);

export const LLM_COST_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
  "LLM/5",
  "LLM/6",
] as const);

export const LLM_COST_PRINCIPLES = Object.freeze([
  "consumes_token_records_only",
  "deterministic_cost_estimation",
  "no_billing_no_payment_no_invoicing",
  "no_quota_enforcement",
  "no_live_pricing_fetch",
  "placeholder_pricing_for_tests",
  "provider_model_pricing_profiles",
] as const);

export const LLM_COST_DEFAULT_CURRENCY = "USD" as const;

export const LLM_COST_PRICING_VERSION = "LLM/7-pricing-v1" as const;

export const LLM_COST_MANDATORY_RECORD_FIELDS = Object.freeze([
  "costRecordId",
  "tokenRecordId",
  "requestId",
  "responseId",
  "providerKey",
  "modelKey",
  "userId",
  "workspaceId",
  "organizationId",
  "inputTokens",
  "outputTokens",
  "inputCost",
  "outputCost",
  "totalEstimatedCost",
  "currency",
  "pricingProfileId",
  "timestamp",
  "readOnly",
] as const);

export const LLM_COST_DEFAULT_LIMITS = Object.freeze({
  maxCostRecords: 8192,
  maxPricingProfiles: 128,
} as const);

export const LLM_COST_MUST_NOT_OWN = Object.freeze([
  "billing",
  "payment_processing",
  "invoicing",
  "quota_enforcement",
  "live_pricing_fetch",
  "provider_api_calls",
  "token_estimation",
] as const);

export const LLM_COST_ROUNDING_PRECISION = 8 as const;
