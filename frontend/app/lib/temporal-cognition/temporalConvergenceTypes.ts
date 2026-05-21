/** D9:3:6 — Strategic temporal convergence + enterprise stability alignment awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { MultiTimelineSnapshot } from "./multiTimelineTypes";
import type { OrganizationalReplaySnapshot } from "./operationalReplayTypes";
import type { TemporalDriftSnapshot } from "./temporalDriftProjectionTypes";
import type { EnterpriseTemporalSnapshot } from "./temporalCognitionTypes";

export type ConvergenceCategory =
  | "resilience_alignment"
  | "governance_stabilization"
  | "recovery_synchronization"
  | "operational_coordination"
  | "fragility_reduction"
  | "escalation_decay"
  | "adaptive_alignment"
  | "unknown";

export type ConvergenceStrength = "weak" | "moderate" | "strong" | "accelerating";

export type AlignmentState =
  | "emerging"
  | "synchronizing"
  | "stabilizing"
  | "converging"
  | "institutionalized";

export type ConvergenceConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type StabilityConvergencePattern = {
  convergenceId: string;
  category: ConvergenceCategory;
  convergenceStrength: ConvergenceStrength;
  alignmentState: AlignmentState;
  summary: string;
  convergenceSignals: readonly string[];
  confidence: number;
  confidenceLevel: ConvergenceConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseConvergenceSignal = {
  signalId: string;
  category: ConvergenceCategory;
  convergenceStrength: ConvergenceStrength;
  alignmentState: AlignmentState;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type OrganizationalAlignmentTrajectory = {
  trajectoryId: string;
  category: ConvergenceCategory;
  alignmentState: AlignmentState;
  trajectorySummary: string;
  linkedConvergenceIds: readonly string[];
  generatedAt: number;
};

export type OperationalSynchronizationSequence = {
  sequenceId: string;
  category: ConvergenceCategory;
  synchronizationLabel: string;
  progressionSummary: string;
  signalLabels: readonly string[];
  generatedAt: number;
};

export type StrategicAlignmentSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  convergenceCount: number;
  alignmentSummary: string;
  dominantCategory: ConvergenceCategory;
  dominantConvergenceStrength: ConvergenceStrength;
  dominantAlignmentState: AlignmentState;
  recentConvergencePatterns: readonly StabilityConvergencePattern[];
  convergenceSignals: readonly EnterpriseConvergenceSignal[];
  alignmentTrajectories: readonly OrganizationalAlignmentTrajectory[];
  synchronizationSequences: readonly OperationalSynchronizationSequence[];
};

export type TemporalConvergenceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTemporalSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  multiTimelineSnapshot?: MultiTimelineSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type TemporalConvergenceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StrategicAlignmentSnapshot | null;
  newConvergencePatterns: number;
  storeSignature: string;
};

export type TemporalConvergenceStoreState = {
  patterns: readonly StabilityConvergencePattern[];
  snapshots: readonly StrategicAlignmentSnapshot[];
  signals: readonly EnterpriseConvergenceSignal[];
  trajectories: readonly OrganizationalAlignmentTrajectory[];
  sequences: readonly OperationalSynchronizationSequence[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
