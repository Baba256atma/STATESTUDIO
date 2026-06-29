/**
 * APP-6:6 — Decision Query Engine domain types.
 * Read-only query layer over APP-6:5 DecisionState.
 */

import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import type {
  DecisionCategory,
  DecisionId,
  DecisionStatus,
  DecisionTag,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_QUERY_ENGINE_CONTRACT_VERSION = "APP-6/6" as const;
export const DECISION_QUERY_ENGINE_ARCHITECTURE_VERSION = "APP-6/6-query-engine-arch" as const;

export const DECISION_QUERY_ENGINE_TAGS = Object.freeze([
  "[APP6_6]",
  "[DECISION_QUERY_ENGINE]",
  "[STATE_DERIVED]",
  "[READ_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_SEARCH]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_QUERY_FILTER_KEYS = Object.freeze([
  "workspaceId",
  "decisionId",
  "lifecycle",
  "status",
  "category",
  "tags",
  "terminal",
  "active",
  "createdAfter",
  "createdBefore",
] as const);

export const DECISION_QUERY_SORT_FIELDS = Object.freeze([
  "createdAt",
  "updatedAt",
  "latestTimestamp",
  "decisionId",
  "currentLifecycle",
] as const);

export const DECISION_QUERY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredQueries: 1_024,
  maxResultCount: 512,
  maxTagFilterCount: 16,
} as const);

export const DECISION_QUERY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "ReplayEngine",
  "ComparisonEngine",
  "DashboardEngine",
  "AssistantEngine",
  "vectorSearch",
  "semanticSearch",
  "localStorage",
  "indexedDB",
  "axios",
] as const);

export const DECISION_QUERY_FUTURE_CONSUMERS = Object.freeze([
  "decision_comparison",
  "decision_replay",
  "decision_dashboard",
  "decision_assistant",
  "decision_api_layer",
  "decision_platform_certification",
] as const);

export type DecisionQueryFilterKey = (typeof DECISION_QUERY_FILTER_KEYS)[number];
export type DecisionQuerySortField = (typeof DECISION_QUERY_SORT_FIELDS)[number];
export type DecisionQuerySortDirection = "asc" | "desc";

export type DecisionQueryFilters = Readonly<{
  workspaceId?: DecisionWorkspaceId;
  decisionId?: DecisionId;
  lifecycle?: DecisionEngineLifecycle;
  status?: DecisionStatus;
  category?: DecisionCategory;
  tags?: readonly DecisionTag[];
  terminal?: boolean;
  active?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}>;

export type DecisionQuerySort = Readonly<{
  field: DecisionQuerySortField;
  direction: DecisionQuerySortDirection;
}>;

export type DecisionQueryInput = Readonly<{
  filters: DecisionQueryFilters;
  sort?: DecisionQuerySort;
  limit?: number;
}>;

export type DecisionQueryAttributes = Readonly<{
  category?: DecisionCategory;
  tags?: readonly DecisionTag[];
  readOnly: true;
}>;

export type DecisionQueryResult = Readonly<{
  queryId: string;
  filters: DecisionQueryFilters;
  sort: DecisionQuerySort;
  states: readonly DecisionState[];
  totalCount: number;
  queryTimestamp: string;
  contractVersion: typeof DECISION_QUERY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionQuerySnapshot = Readonly<{
  snapshotId: string;
  queryId: string;
  filters: DecisionQueryFilters;
  sort: DecisionQuerySort;
  states: readonly DecisionState[];
  totalCount: number;
  capturedAt: string;
  readOnly: true;
}>;

export type DecisionQueryEngineState = Readonly<{
  engineId: "decision-query-engine";
  contractVersion: typeof DECISION_QUERY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredQueryCount: number;
  indexedStateCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionQueryResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionQueryResult | null;
  readOnly: true;
}>;

export type DecisionQueryRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredQueryCount: number;
  queryIds: readonly string[];
  readOnly: true;
}>;

export type DecisionQueryContractSurface = Readonly<{
  contractVersion: typeof DECISION_QUERY_ENGINE_CONTRACT_VERSION;
  supportedFilters: readonly DecisionQueryFilterKey[];
  supportedSortFields: readonly DecisionQuerySortField[];
  futureConsumers: typeof DECISION_QUERY_FUTURE_CONSUMERS;
  readOnly: true;
}>;

export type DecisionQueryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionQueryEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionQueryCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function querySuccess(reason: string, data: DecisionQueryResult): DecisionQueryResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function queryFailure(reason: string): DecisionQueryResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}

export const DEFAULT_DECISION_QUERY_SORT = Object.freeze({
  field: "decisionId" as const,
  direction: "asc" as const,
});
