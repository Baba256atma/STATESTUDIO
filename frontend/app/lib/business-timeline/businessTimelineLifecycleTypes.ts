/**
 * APP-7:4 — Business Timeline Lifecycle + Milestone domain types.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type {
  BusinessEventCategory,
  BusinessEventImportance,
  BusinessEventType,
  BusinessValidationIssue,
  BusinessValidationResult,
  BusinessWorkspaceId,
} from "./businessTimelineTypes.ts";

export const BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION = "APP-7/4" as const;
export const BUSINESS_TIMELINE_LIFECYCLE_ARCHITECTURE_VERSION = "APP-7/4-lifecycle-milestone-arch" as const;

export const BUSINESS_TIMELINE_LIFECYCLE_TAGS = Object.freeze([
  "[APP7_4]",
  "[BUSINESS_TIMELINE_LIFECYCLE]",
  "[MILESTONE_LAYER]",
  "[READ_ONLY]",
  "[NO_PREDICTION]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_LIFECYCLE_PHASE_KEYS = Object.freeze([
  "founding",
  "early-growth",
  "growth",
  "expansion",
  "transformation",
  "crisis",
  "recovery",
  "stabilization",
  "decline",
  "renewal",
  "unknown",
] as const);

export const BUSINESS_MILESTONE_CATEGORY_KEYS = Object.freeze([
  "financial",
  "strategy",
  "product",
  "investment",
  "legal",
  "risk",
  "operations",
] as const satisfies readonly BusinessEventCategory[]);

export const BUSINESS_MILESTONE_TYPE_KEYS = Object.freeze([
  "achievement",
  "transformation",
  "expansion",
  "investment",
  "acquisition",
  "merger",
  "incident",
  "financial",
] as const satisfies readonly BusinessEventType[]);

export const BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS = Object.freeze({
  min: 0,
  max: 1,
} as const);

export const BUSINESS_TIMELINE_LIFECYCLE_FORBIDDEN_PATTERNS = Object.freeze([
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

export type BusinessLifecyclePhase = (typeof BUSINESS_LIFECYCLE_PHASE_KEYS)[number];

export type BusinessLifecycleSegmentMetadata = Readonly<{
  metadataVersion: typeof BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION;
  eventCount: number;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type BusinessLifecycleSegment = Readonly<{
  id: string;
  workspaceId: BusinessWorkspaceId;
  phase: BusinessLifecyclePhase;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  eventIds: readonly string[];
  importance: BusinessEventImportance;
  confidence: number;
  metadata: BusinessLifecycleSegmentMetadata;
  readOnly: true;
}>;

export type BusinessMilestoneMetadata = Readonly<{
  metadataVersion: typeof BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION;
  manual: boolean;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type BusinessMilestone = Readonly<{
  id: string;
  workspaceId: BusinessWorkspaceId;
  eventId: string;
  title: string;
  occurredAt: string;
  category: BusinessEventCategory;
  type: BusinessEventType;
  importance: BusinessEventImportance;
  reason: string;
  confidence: number;
  metadata: BusinessMilestoneMetadata;
  readOnly: true;
}>;

export type BusinessEventLifecycleMapping = Readonly<{
  eventId: string;
  workspaceId: BusinessWorkspaceId;
  phase: BusinessLifecyclePhase;
  confidence: number;
  readOnly: true;
}>;

export type BusinessLifecycleSummary = Readonly<{
  segmentCount: number;
  milestoneCount: number;
  eventCount: number;
  phaseCounts: Readonly<Record<string, number>>;
  firstSegmentAt: string | null;
  lastSegmentAt: string | null;
  criticalMilestoneCount: number;
  highMilestoneCount: number;
  readOnly: true;
}>;

export type BusinessLifecycleModel = Readonly<{
  workspaceId: BusinessWorkspaceId;
  segments: readonly BusinessLifecycleSegment[];
  milestones: readonly BusinessMilestone[];
  eventMappings: readonly BusinessEventLifecycleMapping[];
  summary: BusinessLifecycleSummary;
  generatedAt: string;
  contractVersion: typeof BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BusinessLifecycleEngineState = Readonly<{
  engineId: "business-timeline-lifecycle-engine";
  contractVersion: typeof BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type BusinessLifecycleBuildInput = Readonly<{
  workspaceId: BusinessWorkspaceId;
  includeArchived?: boolean;
  generatedAt?: string;
}>;

export type BusinessLifecycleCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessLifecycleCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly BusinessLifecycleCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { BusinessEngineEvent, BusinessValidationIssue, BusinessValidationResult };

export function isBusinessLifecyclePhase(value: string): value is BusinessLifecyclePhase {
  return (BUSINESS_LIFECYCLE_PHASE_KEYS as readonly string[]).includes(value);
}

export function clampLifecycleConfidence(value: number): number {
  return Math.min(BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.max, Math.max(BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.min, value));
}
