/**
 * APP-7:3 — Business Timeline Query domain types.
 * Read-only query layer over APP-7:2 BusinessEngineEvent records.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type {
  BusinessEventCategory,
  BusinessEventImportance,
  BusinessEventSource,
  BusinessEventStatus,
  BusinessEventType,
  BusinessTag,
  BusinessValidationIssue,
  BusinessValidationResult,
  BusinessWorkspaceId,
} from "./businessTimelineTypes.ts";

export const BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION = "APP-7/3" as const;
export const BUSINESS_TIMELINE_QUERY_ARCHITECTURE_VERSION = "APP-7/3-query-ordering-arch" as const;

export const BUSINESS_TIMELINE_QUERY_TAGS = Object.freeze([
  "[APP7_3]",
  "[BUSINESS_TIMELINE_QUERY]",
  "[READ_ONLY]",
  "[ORDERED_READ_MODEL]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_TIMELINE_QUERY_FILTER_KEYS = Object.freeze([
  "workspaceId",
  "category",
  "type",
  "importance",
  "status",
  "source",
  "tags",
  "occurredFrom",
  "occurredTo",
  "includeArchived",
  "direction",
] as const);

export const BUSINESS_TIMELINE_QUERY_ORDER_FIELDS = Object.freeze([
  "occurredAt",
  "createdAt",
  "id",
] as const);

export const BUSINESS_TIMELINE_QUERY_FORBIDDEN_PATTERNS = Object.freeze([
  "scenario-timeline/",
  "decision-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "BusinessChart",
  "TimelineRenderer",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export type BusinessTimelineQueryDirection = "asc" | "desc";
export type BusinessTimelineQueryOrderField = (typeof BUSINESS_TIMELINE_QUERY_ORDER_FIELDS)[number];

export type BusinessTimelineQueryFilters = Readonly<{
  workspaceId: BusinessWorkspaceId;
  category?: BusinessEventCategory;
  type?: BusinessEventType;
  importance?: BusinessEventImportance;
  status?: BusinessEventStatus;
  source?: BusinessEventSource;
  tags?: readonly BusinessTag[];
  occurredFrom?: string;
  occurredTo?: string;
  includeArchived?: boolean;
  direction?: BusinessTimelineQueryDirection;
}>;

export type BusinessTimelineQueryRange = Readonly<{
  occurredFrom?: string;
  occurredTo?: string;
  readOnly: true;
}>;

export type BusinessTimelineQuerySummary = Readonly<{
  firstEventAt: string | null;
  lastEventAt: string | null;
  criticalCount: number;
  highCount: number;
  archivedCount: number;
  categoryCounts: Readonly<Record<string, number>>;
  typeCounts: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type BusinessTimelineQueryResult = Readonly<{
  workspaceId: BusinessWorkspaceId;
  events: readonly BusinessEngineEvent[];
  totalEvents: number;
  includedArchived: boolean;
  orderedBy: BusinessTimelineQueryOrderField;
  direction: BusinessTimelineQueryDirection;
  range: BusinessTimelineQueryRange;
  filters: BusinessTimelineQueryFilters;
  generatedAt: string;
  summary: BusinessTimelineQuerySummary;
  contractVersion: typeof BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BusinessTimelineQueryInput = Readonly<{
  filters: BusinessTimelineQueryFilters;
  generatedAt?: string;
}>;

export type BusinessTimelineQueryEngineState = Readonly<{
  engineId: "business-timeline-query-engine";
  contractVersion: typeof BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type BusinessTimelineQueryResponse = Readonly<{
  success: boolean;
  reason: string;
  data: BusinessTimelineQueryResult | null;
  readOnly: true;
}>;

export type BusinessTimelineQueryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessTimelineQueryCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly BusinessTimelineQueryCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export const DEFAULT_BUSINESS_TIMELINE_QUERY_DIRECTION: BusinessTimelineQueryDirection = "desc";
export const DEFAULT_BUSINESS_TIMELINE_INCLUDE_ARCHIVED = false;

export type { BusinessValidationIssue, BusinessValidationResult };

export function querySuccess(reason: string, data: BusinessTimelineQueryResult): BusinessTimelineQueryResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function queryFailure(reason: string): BusinessTimelineQueryResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
