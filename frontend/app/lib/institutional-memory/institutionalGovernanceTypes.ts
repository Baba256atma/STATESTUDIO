/** D9:2:9 — Institutional learning governance + strategic cognitive integrity types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { AdaptationRecoverySnapshot } from "./adaptationRecoveryTypes";
import type { DecisionOutcomeSnapshot } from "./decisionOutcomeTypes";
import type { InstitutionalCompressionSnapshot } from "./institutionalDistillationTypes";
import type { OrganizationalContinuitySnapshot } from "./institutionalContinuityTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "./institutionalMaturityTypes";
import type { LearningConsolidationSnapshot } from "./institutionalCorrelationTypes";
import type { InstitutionalRecallSnapshot } from "./institutionalRecallTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
} from "./institutionalMemoryTypes";

export type CognitiveGovernanceStatus =
  | "stable"
  | "monitored"
  | "degraded"
  | "unstable"
  | "recovering";

export type IntegrityLevel = "weak" | "moderate" | "strong" | "verified";

export type TrustCategory =
  | "memory_consistency"
  | "correlation_validity"
  | "resilience_integrity"
  | "governance_stability"
  | "strategic_reliability"
  | "operational_coherence"
  | "unknown";

export type InstitutionalLearningGovernanceSnapshot = {
  governanceSnapshotId: string;
  governanceStatus: CognitiveGovernanceStatus;
  integrityLevel: IntegrityLevel;
  summary: string;
  observations: readonly string[];
  confidence: number;
  generatedAt: number;
  lastEvaluatedAt: number;
  occurrenceCount: number;
};

export type CognitiveIntegritySignal = {
  signalId: string;
  category: TrustCategory;
  integrityLevel: IntegrityLevel;
  signalType: "validation" | "warning" | "recovery" | "verified";
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type StrategicTrustValidation = {
  validationId: string;
  category: TrustCategory;
  trustLevel: IntegrityLevel;
  validationSummary: string;
  linkedSnapshotIds: readonly string[];
  generatedAt: number;
};

export type OrganizationalLearningHealth = {
  healthId: string;
  governanceStatus: CognitiveGovernanceStatus;
  integrityLevel: IntegrityLevel;
  healthSummary: string;
  layerDepth: number;
  generatedAt: number;
};

export type InstitutionalConsistencyObservation = {
  observationId: string;
  category: TrustCategory;
  observation: string;
  severity: "low" | "medium" | "high";
  generatedAt: number;
};

export type InstitutionalLearningGovernanceAggregateSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  governanceStatus: CognitiveGovernanceStatus;
  integrityLevel: IntegrityLevel;
  governanceSummary: string;
  snapshotCount: number;
  trustValidationCount: number;
  dominantTrustCategories: readonly TrustCategory[];
  recentGovernanceSnapshots: readonly InstitutionalLearningGovernanceSnapshot[];
  integritySignals: readonly CognitiveIntegritySignal[];
  trustValidations: readonly StrategicTrustValidation[];
  learningHealth: OrganizationalLearningHealth | null;
  consistencyObservations: readonly InstitutionalConsistencyObservation[];
};

export type InstitutionalLearningGovernanceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  continuityPreserved?: boolean;
  fragilityElevated?: boolean;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  correlationSnapshot?: LearningConsolidationSnapshot | null;
  adaptationSnapshot?: AdaptationRecoverySnapshot | null;
  decisionOutcomeSnapshot?: DecisionOutcomeSnapshot | null;
  distillationSnapshot?: InstitutionalCompressionSnapshot | null;
  recallSnapshot?: InstitutionalRecallSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  continuitySnapshot?: OrganizationalContinuitySnapshot | null;
  now?: number;
};

export type InstitutionalGovernanceStoreState = {
  snapshots: readonly InstitutionalLearningGovernanceSnapshot[];
  integritySignals: readonly CognitiveIntegritySignal[];
  trustValidations: readonly StrategicTrustValidation[];
  consistencyObservations: readonly InstitutionalConsistencyObservation[];
  learningHealth: OrganizationalLearningHealth | null;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastGovernanceStatus: CognitiveGovernanceStatus | null;
};
