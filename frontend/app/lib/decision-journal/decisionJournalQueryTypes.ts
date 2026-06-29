/**
 * APP-8:3 — Decision Journal Query domain types.
 * Read-only query layer over APP-8:2 DecisionJournalEngineEntry records.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalConfidence,
  DecisionJournalSource,
  DecisionJournalStatus,
  DecisionJournalTag,
  DecisionJournalValidationIssue,
  DecisionJournalValidationResult,
  DecisionWorkspaceId,
} from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_QUERY_CONTRACT_VERSION = "APP-8/3" as const;
export const DECISION_JOURNAL_QUERY_ARCHITECTURE_VERSION = "APP-8/3-journal-query-arch" as const;

export const DECISION_JOURNAL_QUERY_TAGS = Object.freeze([
  "[APP8_3]",
  "[DECISION_JOURNAL_QUERY]",
  "[READ_ONLY]",
  "[ORDERED_READ_MODEL]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_JOURNAL_QUERY_FILTER_KEYS = Object.freeze([
  "workspaceId",
  "status",
  "source",
  "confidence",
  "author",
  "reviewer",
  "tag",
  "updatedAtFrom",
  "updatedAtTo",
  "createdAtFrom",
  "createdAtTo",
  "includeArchived",
  "direction",
] as const);

export const DECISION_JOURNAL_QUERY_ORDER_FIELDS = Object.freeze([
  "updatedAt",
  "createdAt",
  "id",
] as const);

export const DECISION_JOURNAL_QUERY_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "JournalEditor",
  "JournalChart",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export type DecisionJournalQueryDirection = "asc" | "desc";
export type DecisionJournalQueryOrderField = (typeof DECISION_JOURNAL_QUERY_ORDER_FIELDS)[number];

export type DecisionJournalQueryFilters = Readonly<{
  workspaceId: DecisionWorkspaceId;
  status?: DecisionJournalStatus;
  source?: DecisionJournalSource;
  confidence?: DecisionJournalConfidence;
  author?: string;
  reviewer?: string;
  tag?: DecisionJournalTag;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  includeArchived?: boolean;
  direction?: DecisionJournalQueryDirection;
}>;

export type DecisionJournalQueryRange = Readonly<{
  updatedAtFrom?: string;
  updatedAtTo?: string;
  readOnly: true;
}>;

export type DecisionJournalQueryOrdering = Readonly<{
  primary: "updatedAt";
  secondary: "createdAt";
  fallback: "id";
  direction: DecisionJournalQueryDirection;
  readOnly: true;
}>;

export type DecisionJournalQuerySummary = Readonly<{
  firstEntryAt: string | null;
  lastEntryAt: string | null;
  archivedCount: number;
  draftCount: number;
  reviewedCount: number;
  activeCount: number;
  confidenceDistribution: Readonly<Record<string, number>>;
  authorCounts: Readonly<Record<string, number>>;
  sourceCounts: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type DecisionJournalQueryResult = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entries: readonly DecisionJournalEngineEntry[];
  totalEntries: number;
  includedArchived: boolean;
  filters: DecisionJournalQueryFilters;
  ordering: DecisionJournalQueryOrdering;
  generatedAt: string;
  summary: DecisionJournalQuerySummary;
  contractVersion: typeof DECISION_JOURNAL_QUERY_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionJournalQueryInput = Readonly<{
  filters: DecisionJournalQueryFilters;
  generatedAt?: string;
}>;

export type DecisionJournalQueryEngineState = Readonly<{
  engineId: "decision-journal-query-engine";
  contractVersion: typeof DECISION_JOURNAL_QUERY_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionJournalQueryResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionJournalQueryResult | null;
  readOnly: true;
}>;

export type DecisionJournalQueryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalQueryCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionJournalQueryCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export const DEFAULT_DECISION_JOURNAL_QUERY_DIRECTION: DecisionJournalQueryDirection = "desc";
export const DEFAULT_DECISION_JOURNAL_INCLUDE_ARCHIVED = false;

export type { DecisionJournalValidationIssue, DecisionJournalValidationResult };

export function querySuccess(reason: string, data: DecisionJournalQueryResult): DecisionJournalQueryResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function queryFailure(reason: string): DecisionJournalQueryResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
