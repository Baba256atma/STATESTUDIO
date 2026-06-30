/**
 * LLM-7 — Cost Estimator domain types.
 */

import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmTokenUsageRecord } from "./llmTokenTypes.ts";
import type {
  LLM_COST_AGGREGATION_SCOPE_KEYS,
  LLM_COST_CONTRACT_VERSION,
  LLM_COST_DEFAULT_CURRENCY,
} from "./llmCostContracts.ts";

export type LlmCostAggregationScopeKey = (typeof LLM_COST_AGGREGATION_SCOPE_KEYS)[number];

export type LlmCostPricingProfile = Readonly<{
  pricingProfileId: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  inputTokenPrice: number;
  outputTokenPrice: number;
  currency: typeof LLM_COST_DEFAULT_CURRENCY | string;
  pricingVersion: string;
  effectiveDate: string;
  readOnly: true;
}>;

export type LlmCostEstimate = Readonly<{
  inputCost: number;
  outputCost: number;
  totalEstimatedCost: number;
  currency: string;
  pricingProfileId: string;
  readOnly: true;
}>;

export type LlmCostRecord = Readonly<{
  costRecordId: string;
  tokenRecordId: string;
  requestId: string;
  responseId: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  userId: string;
  workspaceId: string;
  organizationId: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalEstimatedCost: number;
  currency: string;
  pricingProfileId: string;
  timestamp: string;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type LlmCostAggregationSummary = Readonly<{
  scope: LlmCostAggregationScopeKey;
  scopeKey: string;
  currency: string;
  recordCount: number;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalEstimatedCost: number;
  readOnly: true;
}>;

export type LlmCostRegistry = Readonly<{
  pricingProfiles: readonly LlmCostPricingProfile[];
  records: readonly LlmCostRecord[];
  recordCount: number;
  aggregations: readonly LlmCostAggregationSummary[];
  readOnly: true;
}>;

export type LlmCostManifest = Readonly<{
  manifestId: string;
  estimatorVersion: typeof LLM_COST_CONTRACT_VERSION;
  totalRecords: number;
  aggregationSummary: readonly LlmCostAggregationSummary[];
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type LlmCostValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmCostValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmCostValidationIssue[];
  readOnly: true;
}>;

export type LlmCostRecordResult = Readonly<{
  success: boolean;
  reason: string;
  record: LlmCostRecord | null;
  readOnly: true;
}>;

export type LlmCostAggregationQuery = Readonly<{
  scope: LlmCostAggregationScopeKey;
  scopeKey: string;
  currency?: string;
}>;

export type LlmCostEstimatorLayerState = Readonly<{
  contractVersion: typeof LLM_COST_CONTRACT_VERSION;
  tokenDependency: typeof import("./llmCostContracts.ts").LLM_COST_TOKEN_DEPENDENCY;
  initialized: boolean;
  registry: LlmCostRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmCostPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmCostContracts.ts").LLM_COST_PLATFORM_ID;
  version: typeof LLM_COST_CONTRACT_VERSION;
  title: typeof import("./llmCostContracts.ts").LLM_COST_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  aggregationScopes: readonly string[];
  readOnly: true;
}>;

export type LlmCostEstimateInput = Readonly<{
  tokenRecord: LlmTokenUsageRecord;
}>;
