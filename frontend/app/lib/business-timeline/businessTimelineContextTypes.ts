/**
 * APP-7:5 — Business Timeline Context domain types.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type { BusinessLifecyclePhase } from "./businessTimelineLifecycleTypes.ts";
import type {
  BusinessEventCategory,
  BusinessEventType,
  BusinessValidationIssue,
  BusinessValidationResult,
  BusinessWorkspaceId,
} from "./businessTimelineTypes.ts";

export const BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION = "APP-7/5" as const;
export const BUSINESS_TIMELINE_CONTEXT_ARCHITECTURE_VERSION = "APP-7/5-causality-context-arch" as const;

export const BUSINESS_TIMELINE_CONTEXT_TAGS = Object.freeze([
  "[APP7_5]",
  "[BUSINESS_TIMELINE_CONTEXT]",
  "[HISTORICAL_RELATIONSHIPS]",
  "[READ_ONLY]",
  "[NO_PREDICTION]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_EVENT_RELATIONSHIP_TYPE_KEYS = Object.freeze([
  "previous",
  "next",
  "same-category",
  "same-type",
  "same-tag",
  "same-lifecycle-phase",
  "milestone-related",
  "temporal-proximity",
  "possible-cause",
  "possible-effect",
  "unknown",
] as const);

export const BUSINESS_CONTEXT_CONFIDENCE_BOUNDS = Object.freeze({
  min: 0,
  max: 1,
} as const);

export const BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS = 90;

export const BUSINESS_TIMELINE_CONTEXT_FORBIDDEN_PATTERNS = Object.freeze([
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

export type BusinessEventRelationshipType = (typeof BUSINESS_EVENT_RELATIONSHIP_TYPE_KEYS)[number];

export type BusinessEventRelationshipMetadata = Readonly<{
  metadataVersion: typeof BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION;
  directional: boolean;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type BusinessEventRelationship = Readonly<{
  id: string;
  workspaceId: BusinessWorkspaceId;
  fromEventId: string;
  toEventId: string;
  relationshipType: BusinessEventRelationshipType;
  confidence: number;
  reason: string;
  metadata: BusinessEventRelationshipMetadata;
  readOnly: true;
}>;

export type BusinessContextClusterMetadata = Readonly<{
  metadataVersion: typeof BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION;
  eventCount: number;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type BusinessContextCluster = Readonly<{
  id: string;
  workspaceId: BusinessWorkspaceId;
  title: string;
  description: string;
  eventIds: readonly string[];
  startAt: string;
  endAt: string;
  dominantCategory: BusinessEventCategory;
  dominantType: BusinessEventType;
  lifecyclePhase: BusinessLifecyclePhase;
  milestoneIds: readonly string[];
  relationshipIds: readonly string[];
  confidence: number;
  metadata: BusinessContextClusterMetadata;
  readOnly: true;
}>;

export type BusinessEventContextMetadata = Readonly<{
  metadataVersion: typeof BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type BusinessEventContext = Readonly<{
  eventId: string;
  workspaceId: BusinessWorkspaceId;
  previousEventId: string | null;
  nextEventId: string | null;
  relatedEventIds: readonly string[];
  relationshipIds: readonly string[];
  clusterIds: readonly string[];
  lifecycleSegmentIds: readonly string[];
  milestoneIds: readonly string[];
  confidence: number;
  metadata: BusinessEventContextMetadata;
  readOnly: true;
}>;

export type BusinessTimelineContextSummary = Readonly<{
  eventCount: number;
  relationshipCount: number;
  clusterCount: number;
  contextCount: number;
  relationshipTypeCounts: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type BusinessTimelineContextModel = Readonly<{
  workspaceId: BusinessWorkspaceId;
  events: readonly BusinessEngineEvent[];
  relationships: readonly BusinessEventRelationship[];
  clusters: readonly BusinessContextCluster[];
  eventContexts: readonly BusinessEventContext[];
  summary: BusinessTimelineContextSummary;
  generatedAt: string;
  contractVersion: typeof BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BusinessTimelineContextBuildInput = Readonly<{
  workspaceId: BusinessWorkspaceId;
  includeArchived?: boolean;
  proximityDays?: number;
  generatedAt?: string;
}>;

export type BusinessTimelineContextEngineState = Readonly<{
  engineId: "business-timeline-context-engine";
  contractVersion: typeof BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type BusinessTimelineContextCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessTimelineContextCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly BusinessTimelineContextCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { BusinessEngineEvent, BusinessValidationIssue, BusinessValidationResult };

export function isBusinessEventRelationshipType(value: string): value is BusinessEventRelationshipType {
  return (BUSINESS_EVENT_RELATIONSHIP_TYPE_KEYS as readonly string[]).includes(value);
}

export function clampContextConfidence(value: number): number {
  return Math.min(BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.max, Math.max(BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.min, value));
}

export function relationshipId(
  fromEventId: string,
  toEventId: string,
  relationshipType: BusinessEventRelationshipType
): string {
  return `business-relationship-${fromEventId}-${toEventId}-${relationshipType}`;
}
