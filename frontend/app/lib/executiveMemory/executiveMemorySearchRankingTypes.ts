/**
 * APP-4:9 — Executive Memory Search & Ranking domain types.
 */

import type { ExecutiveMemoryCategory, ExecutiveMemoryProviderId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryLifecycleState, ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type { EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS } from "./executiveMemorySearchRankingConstants.ts";

export type ExecutiveMemoryRankingRuleType = (typeof EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS)[number];

export type ExecutiveMemoryRankingRule = Readonly<{
  ruleId: string;
  ruleType: ExecutiveMemoryRankingRuleType;
  weight: number;
  enabled: boolean;
  readOnly: true;
}>;

export type ExecutiveMemoryRankingProfile = Readonly<{
  profileId: string;
  label: string;
  description: string;
  rules: readonly ExecutiveMemoryRankingRule[];
  builtIn: boolean;
  readOnly: true;
}>;

export type ExecutiveMemorySearchQuery = Readonly<{
  recordId?: string;
  workspaceId?: ExecutiveMemoryWorkspaceId;
  goalId?: string;
  intentId?: string;
  scenarioId?: string;
  decisionId?: string;
  contextId?: string;
  category?: ExecutiveMemoryCategory;
  providerId?: ExecutiveMemoryProviderId;
  tags?: readonly string[];
  referenceIds?: readonly string[];
  riskId?: string;
  kpiId?: string;
  lifecycleState?: ExecutiveMemoryLifecycleState;
  confidenceMin?: number;
  confidenceMax?: number;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  rankingProfileId?: string;
  limit?: number;
  offset?: number;
  readOnly: true;
}>;

export type CreateExecutiveMemorySearchQueryInput = Readonly<Omit<ExecutiveMemorySearchQuery, "readOnly">>;

export type ExecutiveMemoryRankingExplanationEntry = Readonly<{
  ruleType: ExecutiveMemoryRankingRuleType;
  contribution: number;
  reason: string;
  readOnly: true;
}>;

export type ExecutiveMemoryRankingExplanation = Readonly<{
  recordId: string;
  score: number;
  profileId: string;
  reasons: readonly ExecutiveMemoryRankingExplanationEntry[];
  readOnly: true;
}>;

export type ExecutiveMemoryRankingResult = Readonly<{
  record: ExecutiveMemoryStoredRecord;
  score: number;
  rank: number;
  explanation: ExecutiveMemoryRankingExplanation;
  readOnly: true;
}>;

export type ExecutiveMemorySearchResult = Readonly<{
  success: boolean;
  reason: string;
  records: readonly ExecutiveMemoryStoredRecord[];
  rankedResults: readonly ExecutiveMemoryRankingResult[];
  totalMatched: number;
  profileId: string;
  executionTimeMs: number;
  error: ExecutiveMemorySearchError | null;
  readOnly: true;
}>;

export type ExecutiveMemorySearchError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryRankingStatistics = Readonly<{
  searchesExecuted: number;
  rankingsExecuted: number;
  totalExecutionTimeMs: number;
  averageExecutionTimeMs: number;
  averageResults: number;
  profileUsage: Readonly<Record<string, number>>;
  filterUsage: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveMemorySearchEngineState = Readonly<{
  engineId: "executive-memory-search-engine";
  contractVersion: string;
  initialized: boolean;
  registeredProfileCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type CreateExecutiveMemoryRankingProfileInput = Readonly<{
  profileId: string;
  label: string;
  description: string;
  rules: readonly Omit<ExecutiveMemoryRankingRule, "readOnly">[];
}>;

export type ExecutiveMemorySearchValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemorySearchValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveMemorySearchValidationIssue[];
  readOnly: true;
}>;
