/** D9:3:1 — Strategic organizational timeline cognition + enterprise temporal awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { InstitutionalRecallSnapshot } from "../institutional-memory/institutionalRecallTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";

export type TimelineCategory =
  | "fragility"
  | "escalation"
  | "governance"
  | "resilience"
  | "recovery"
  | "operational"
  | "coordination"
  | "strategic"
  | "unknown";

export type TemporalSequenceType =
  | "isolated"
  | "sequential"
  | "recurring"
  | "cascading"
  | "cyclical";

export type TimelineState =
  | "emerging"
  | "developing"
  | "escalating"
  | "stabilizing"
  | "recovering";

export type OrganizationalTimelineEvent = {
  eventId: string;
  category: TimelineCategory;
  label: string;
  summary: string;
  observedAt: number;
  sequenceOrder: number;
};

export type StrategicTimelineSequence = {
  timelineId: string;
  sequenceType: TemporalSequenceType;
  timelineState: TimelineState;
  category: TimelineCategory;
  summary: string;
  events: readonly string[];
  eventIds: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OperationalChronologyFrame = {
  frameId: string;
  category: TimelineCategory;
  chronologyLabel: string;
  narrative: string;
  timelineIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
};

export type TemporalCognitionSignal = {
  signalId: string;
  category: TimelineCategory;
  sequenceType: TemporalSequenceType;
  timelineState: TimelineState;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type OrganizationalEvolutionEvent = {
  evolutionId: string;
  category: TimelineCategory;
  evolutionLabel: string;
  progressionSummary: string;
  linkedTimelineIds: readonly string[];
  generatedAt: number;
};

export type EnterpriseTemporalSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  sequenceCount: number;
  eventCount: number;
  temporalSummary: string;
  dominantCategories: readonly TimelineCategory[];
  dominantSequenceType: TemporalSequenceType;
  dominantTimelineState: TimelineState;
  recentSequences: readonly StrategicTimelineSequence[];
  chronologyFrames: readonly OperationalChronologyFrame[];
  temporalSignals: readonly TemporalCognitionSignal[];
  evolutionEvents: readonly OrganizationalEvolutionEvent[];
  recentEvents: readonly OrganizationalTimelineEvent[];
};

export type EnterpriseTemporalCognitionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  recallSnapshot?: InstitutionalRecallSnapshot | null;
  unifiedMemorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type TemporalCognitionStoreState = {
  sequences: readonly StrategicTimelineSequence[];
  events: readonly OrganizationalTimelineEvent[];
  snapshots: readonly EnterpriseTemporalSnapshot[];
  signals: readonly TemporalCognitionSignal[];
  chronologyFrames: readonly OperationalChronologyFrame[];
  evolutionEvents: readonly OrganizationalEvolutionEvent[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};

export type EnterpriseTemporalCognitionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseTemporalSnapshot | null;
  newSequences: number;
  storeSignature: string;
};
