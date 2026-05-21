/** D9:3:8 — Institutional temporal memory synchronization + enterprise cross-period awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { TemporalCompressionSnapshot } from "./temporalCompressionTypes";
import type { StrategicAlignmentSnapshot } from "./temporalConvergenceTypes";
import type { MultiTimelineSnapshot } from "./multiTimelineTypes";
import type { TemporalDriftSnapshot } from "./temporalDriftProjectionTypes";
import type { EnterpriseTemporalSnapshot } from "./temporalCognitionTypes";

export type SyncCategory =
  | "continuity"
  | "divergence"
  | "resilience_shift"
  | "governance_evolution"
  | "escalation_cycle"
  | "recovery_progression"
  | "operational_shift"
  | "strategic"
  | "unknown";

export type SyncStrength = "weak" | "moderate" | "strong" | "aligned";

export type PeriodAwarenessState =
  | "current"
  | "prior"
  | "bridged"
  | "synchronized"
  | "drifted";

export type SyncConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type TemporalMemorySyncRecord = {
  syncId: string;
  category: SyncCategory;
  syncStrength: SyncStrength;
  periodState: PeriodAwarenessState;
  summary: string;
  crossPeriodSignals: readonly string[];
  priorPeriodReference: string;
  currentPeriodReference: string;
  confidence: number;
  confidenceLevel: SyncConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CrossPeriodAwarenessSignal = {
  signalId: string;
  category: SyncCategory;
  syncStrength: SyncStrength;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type OrganizationalPeriodBridge = {
  bridgeId: string;
  fromPeriodReference: string;
  toPeriodReference: string;
  bridgeSummary: string;
  linkedSyncIds: readonly string[];
  generatedAt: number;
};

export type TemporalPeriodAlignment = {
  alignmentId: string;
  category: SyncCategory;
  alignmentLabel: string;
  alignmentSummary: string;
  syncIds: readonly string[];
  generatedAt: number;
};

export type PeriodSynchronizationSequence = {
  sequenceId: string;
  category: SyncCategory;
  sequenceLabel: string;
  stepLabels: readonly string[];
  generatedAt: number;
};

export type InstitutionalTemporalSyncSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  syncCount: number;
  periodSummary: string;
  dominantCategory: SyncCategory;
  dominantSyncStrength: SyncStrength;
  dominantPeriodState: PeriodAwarenessState;
  currentPeriodReference: string;
  priorPeriodReference: string | null;
  recentSyncRecords: readonly TemporalMemorySyncRecord[];
  awarenessSignals: readonly CrossPeriodAwarenessSignal[];
  periodBridges: readonly OrganizationalPeriodBridge[];
  periodAlignments: readonly TemporalPeriodAlignment[];
  synchronizationSequences: readonly PeriodSynchronizationSequence[];
};

export type TemporalMemorySyncInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTemporalSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  multiTimelineSnapshot?: MultiTimelineSnapshot | null;
  convergenceSnapshot?: StrategicAlignmentSnapshot | null;
  compressionSnapshot?: TemporalCompressionSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type TemporalMemorySyncResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalTemporalSyncSnapshot | null;
  newSyncRecords: number;
  storeSignature: string;
};

export type TemporalMemorySyncStoreState = {
  syncRecords: readonly TemporalMemorySyncRecord[];
  snapshots: readonly InstitutionalTemporalSyncSnapshot[];
  awarenessSignals: readonly CrossPeriodAwarenessSignal[];
  periodBridges: readonly OrganizationalPeriodBridge[];
  periodAlignments: readonly TemporalPeriodAlignment[];
  sequences: readonly PeriodSynchronizationSequence[];
  periodFingerprints: readonly { reference: string; fingerprint: string; recordedAt: number }[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
