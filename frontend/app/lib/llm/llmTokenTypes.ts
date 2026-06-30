/**
 * LLM-6 — Token Usage Meter domain types.
 */

import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmRuntimeRequestEnvelope, LlmRuntimeResponseEnvelope } from "./llmRuntimeTypes.ts";
import type {
  LLM_TOKEN_AGGREGATION_SCOPE_KEYS,
  LLM_TOKEN_CONTRACT_VERSION,
} from "./llmTokenContracts.ts";

export type LlmTokenAggregationScopeKey = (typeof LLM_TOKEN_AGGREGATION_SCOPE_KEYS)[number];

export type LlmTokenUsageRecord = Readonly<{
  recordId: string;
  requestId: string;
  responseId: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  userId: string;
  workspaceId: string;
  organizationId: string;
  sessionId: string;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  totalTokens: number;
  timestamp: string;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type LlmTokenEstimate = Readonly<{
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  totalTokens: number;
  estimationRuleId: string;
  readOnly: true;
}>;

export type LlmTokenEstimateInput = Readonly<{
  runtimeRequest: LlmRuntimeRequestEnvelope;
  runtimeResponse?: LlmRuntimeResponseEnvelope;
  additionalInputText?: string;
  additionalOutputText?: string;
  sessionId?: string;
}>;

export type LlmTokenAggregationSummary = Readonly<{
  scope: LlmTokenAggregationScopeKey;
  scopeKey: string;
  requestCount: number;
  responseCount: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  totalTokens: number;
  readOnly: true;
}>;

export type LlmTokenRegistry = Readonly<{
  records: readonly LlmTokenUsageRecord[];
  recordCount: number;
  aggregations: readonly LlmTokenAggregationSummary[];
  readOnly: true;
}>;

export type LlmTokenManifest = Readonly<{
  manifestId: string;
  meterVersion: typeof LLM_TOKEN_CONTRACT_VERSION;
  totalRecords: number;
  aggregationSummary: readonly LlmTokenAggregationSummary[];
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type LlmTokenValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmTokenValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmTokenValidationIssue[];
  readOnly: true;
}>;

export type LlmTokenRecordResult = Readonly<{
  success: boolean;
  reason: string;
  record: LlmTokenUsageRecord | null;
  readOnly: true;
}>;

export type LlmTokenMeterLayerState = Readonly<{
  contractVersion: typeof LLM_TOKEN_CONTRACT_VERSION;
  contextDependency: typeof import("./llmTokenContracts.ts").LLM_TOKEN_CONTEXT_DEPENDENCY;
  initialized: boolean;
  registry: LlmTokenRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmTokenPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmTokenContracts.ts").LLM_TOKEN_PLATFORM_ID;
  version: typeof LLM_TOKEN_CONTRACT_VERSION;
  title: typeof import("./llmTokenContracts.ts").LLM_TOKEN_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  aggregationScopes: readonly string[];
  readOnly: true;
}>;

export type LlmTokenAggregationQuery = Readonly<{
  scope: LlmTokenAggregationScopeKey;
  scopeKey: string;
}>;
