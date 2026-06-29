/**
 * APP-9:3 — Confidence Evolution Query domain types.
 * Read-only query layer over APP-9:2 ConfidenceEvolutionEngineRecord records.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import type {
  ConfidenceChangeReason,
  ConfidenceEvolutionValidationIssue,
  ConfidenceEvolutionValidationResult,
  ConfidenceLevel,
  ConfidenceSource,
  ConfidenceWorkspaceId,
} from "./confidenceEvolutionTypes.ts";
import type { ConfidenceRecordStatus } from "./confidenceEvolutionEngineTypes.ts";

export const CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION = "APP-9/3" as const;
export const CONFIDENCE_EVOLUTION_QUERY_ARCHITECTURE_VERSION = "APP-9/3-confidence-query-arch" as const;

export const CONFIDENCE_EVOLUTION_QUERY_TAGS = Object.freeze([
  "[APP9_3]",
  "[CONFIDENCE_EVOLUTION_QUERY]",
  "[READ_ONLY]",
  "[ORDERED_READ_MODEL]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CONFIDENCE_EVOLUTION_QUERY_FILTER_KEYS = Object.freeze([
  "workspaceId",
  "confidenceLevel",
  "confidenceScoreMin",
  "confidenceScoreMax",
  "source",
  "reason",
  "status",
  "tag",
  "updatedAtFrom",
  "updatedAtTo",
  "createdAtFrom",
  "createdAtTo",
  "includeArchived",
  "direction",
] as const);

export const CONFIDENCE_EVOLUTION_QUERY_ORDER_FIELDS = Object.freeze([
  "updatedAt",
  "createdAt",
  "id",
] as const);

export const CONFIDENCE_EVOLUTION_QUERY_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "decision-journal/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "ConfidenceChart",
  "ConfidenceEditor",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export type ConfidenceEvolutionQueryDirection = "asc" | "desc";
export type ConfidenceEvolutionQueryOrderField = (typeof CONFIDENCE_EVOLUTION_QUERY_ORDER_FIELDS)[number];

export type ConfidenceEvolutionQueryFilters = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  confidenceLevel?: ConfidenceLevel;
  confidenceScoreMin?: number;
  confidenceScoreMax?: number;
  source?: ConfidenceSource;
  reason?: ConfidenceChangeReason;
  status?: ConfidenceRecordStatus;
  tag?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  includeArchived?: boolean;
  direction?: ConfidenceEvolutionQueryDirection;
}>;

export type ConfidenceEvolutionQueryRange = Readonly<{
  updatedAtFrom?: string;
  updatedAtTo?: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionQueryOrdering = Readonly<{
  primary: "updatedAt";
  secondary: "createdAt";
  fallback: "id";
  direction: ConfidenceEvolutionQueryDirection;
  readOnly: true;
}>;

export type ConfidenceEvolutionQuerySummary = Readonly<{
  firstRecordAt: string | null;
  lastRecordAt: string | null;
  archivedCount: number;
  activeCount: number;
  draftCount: number;
  reviewedCount: number;
  confidenceLevelDistribution: Readonly<Record<string, number>>;
  sourceCounts: Readonly<Record<string, number>>;
  reasonCounts: Readonly<Record<string, number>>;
  averageConfidenceScore: number | null;
  minConfidenceScore: number | null;
  maxConfidenceScore: number | null;
  readOnly: true;
}>;

export type ConfidenceEvolutionQueryResult = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  records: readonly ConfidenceEvolutionEngineRecord[];
  totalRecords: number;
  includedArchived: boolean;
  filters: ConfidenceEvolutionQueryFilters;
  ordering: ConfidenceEvolutionQueryOrdering;
  generatedAt: string;
  summary: ConfidenceEvolutionQuerySummary;
  contractVersion: typeof CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ConfidenceEvolutionQueryInput = Readonly<{
  filters: ConfidenceEvolutionQueryFilters;
  generatedAt?: string;
}>;

export type ConfidenceEvolutionQueryEngineState = Readonly<{
  engineId: "confidence-evolution-query-engine";
  contractVersion: typeof CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionQueryResponse = Readonly<{
  success: boolean;
  reason: string;
  data: ConfidenceEvolutionQueryResult | null;
  readOnly: true;
}>;

export type ConfidenceEvolutionQueryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionQueryCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ConfidenceEvolutionQueryCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export const DEFAULT_CONFIDENCE_EVOLUTION_QUERY_DIRECTION: ConfidenceEvolutionQueryDirection = "desc";
export const DEFAULT_CONFIDENCE_EVOLUTION_INCLUDE_ARCHIVED = false;

export type { ConfidenceEvolutionValidationIssue, ConfidenceEvolutionValidationResult };

export function querySuccess(reason: string, data: ConfidenceEvolutionQueryResult): ConfidenceEvolutionQueryResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function queryFailure(reason: string): ConfidenceEvolutionQueryResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
