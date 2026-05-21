/** D9:3:7 — Strategic temporal compression + executive organizational evolution summarization types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { MultiTimelineSnapshot } from "./multiTimelineTypes";
import type { OrganizationalReplaySnapshot } from "./operationalReplayTypes";
import type { StrategicAlignmentSnapshot } from "./temporalConvergenceTypes";
import type { TemporalDriftSnapshot } from "./temporalDriftProjectionTypes";
import type { EnterpriseTemporalSnapshot } from "./temporalCognitionTypes";

export type CompressionLevel = "raw" | "summarized" | "condensed" | "distilled" | "executive_core";

export type SummaryCategory =
  | "fragility"
  | "resilience"
  | "governance"
  | "escalation"
  | "operational"
  | "coordination"
  | "recovery"
  | "strategic"
  | "unknown";

export type TimelineAbstractionState =
  | "fragmented"
  | "organized"
  | "condensed"
  | "distilled"
  | "executive_ready";

export type ExecutiveTemporalDigest = {
  compressionId: string;
  category: SummaryCategory;
  compressionLevel: CompressionLevel;
  abstractionState: TimelineAbstractionState;
  summary: string;
  distilledSignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OrganizationalEvolutionSummary = {
  summaryId: string;
  category: SummaryCategory;
  evolutionHeadline: string;
  narrative: string;
  linkedCompressionIds: readonly string[];
  compressionLevel: CompressionLevel;
  generatedAt: number;
};

export type StrategicTimelineCompression = {
  compressionKey: string;
  category: SummaryCategory;
  timelineLabel: string;
  compressedSteps: readonly string[];
  sourceEventCount: number;
  generatedAt: number;
};

export type EvolutionDistillationSignal = {
  signalId: string;
  category: SummaryCategory;
  label: string;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type TemporalAbstractionLayer = {
  layerId: string;
  abstractionState: TimelineAbstractionState;
  layerSummary: string;
  digestIds: readonly string[];
  generatedAt: number;
};

export type TemporalCompressionSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  digestCount: number;
  compressionSummary: string;
  dominantCategory: SummaryCategory;
  dominantCompressionLevel: CompressionLevel;
  dominantAbstractionState: TimelineAbstractionState;
  recentDigests: readonly ExecutiveTemporalDigest[];
  evolutionSummaries: readonly OrganizationalEvolutionSummary[];
  timelineCompressions: readonly StrategicTimelineCompression[];
  distillationSignals: readonly EvolutionDistillationSignal[];
  abstractionLayers: readonly TemporalAbstractionLayer[];
};

export type StrategicTemporalCompressionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTemporalSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  multiTimelineSnapshot?: MultiTimelineSnapshot | null;
  convergenceSnapshot?: StrategicAlignmentSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type StrategicTemporalCompressionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: TemporalCompressionSnapshot | null;
  newDigests: number;
  storeSignature: string;
};

export type TemporalCompressionStoreState = {
  digests: readonly ExecutiveTemporalDigest[];
  summaries: readonly OrganizationalEvolutionSummary[];
  timelineCompressions: readonly StrategicTimelineCompression[];
  snapshots: readonly TemporalCompressionSnapshot[];
  signals: readonly EvolutionDistillationSignal[];
  abstractionLayers: readonly TemporalAbstractionLayer[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
