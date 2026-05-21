/** D9:6:2 — Strategic reasoning integrity monitor + enterprise cognitive consistency verification types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { ConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { AdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { MetaCognitionRuntimeSnapshot } from "./metaCognitionTypes";

export type VerificationCategory =
  | "cognition_alignment"
  | "foresight_consistency"
  | "orchestration_integrity"
  | "confidence_reliability"
  | "institutional_alignment"
  | "temporal_consistency"
  | "governance_coherence"
  | "unknown";

export type IntegrityStrength = "weak" | "monitored" | "stable" | "strong" | "executive_grade";

export type ConsistencyState =
  | "contradictory"
  | "fragmented"
  | "partially_aligned"
  | "coherent"
  | "verified";

export type ExecutiveTrustObservation = {
  integrityId: string;
  consistencyState: ConsistencyState;
  integrityStrength: IntegrityStrength;
  verificationCategory: VerificationCategory;
  summary: string;
  consistencySignals: readonly string[];
  integrityRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CognitiveConsistencySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly VerificationCategory[];
  signalStrength: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EnterpriseContradictionIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  linkedCategories: readonly VerificationCategory[];
  contradictionSeverity: "low" | "moderate" | "high" | "critical";
  generatedAt: number;
};

export type CrossRuntimeAlignment = {
  alignmentId: string;
  sourceRuntime: string;
  targetRuntime: string;
  alignmentSummary: string;
  alignmentStrength: IntegrityStrength;
  generatedAt: number;
};

export type IntegrityVerificationSummary = {
  dominantConsistencyState: ConsistencyState;
  dominantIntegrityStrength: IntegrityStrength;
  verificationHeadline: string;
  trustPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type StrategicReasoningIntegritySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  verificationCount: number;
  awarenessSummary: IntegrityVerificationSummary;
  recentTrustObservations: readonly ExecutiveTrustObservation[];
  consistencySignals: readonly CognitiveConsistencySignal[];
  contradictionIndicators: readonly EnterpriseContradictionIndicator[];
  crossRuntimeAlignments: readonly CrossRuntimeAlignment[];
};

export type StrategicReasoningIntegrityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  metaCognitionSnapshot?: MetaCognitionRuntimeSnapshot | null;
  confidenceSnapshot?: ConfidenceArbitrationSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  sequencingSnapshot?: AdaptiveSequencingSnapshot | null;
  advisoryLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type StrategicReasoningIntegrityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StrategicReasoningIntegritySnapshot | null;
  newTrustObservations: number;
  storeSignature: string;
};

export type ReasoningIntegrityStoreState = {
  trustObservations: readonly ExecutiveTrustObservation[];
  snapshots: readonly StrategicReasoningIntegritySnapshot[];
  consistencySignals: readonly CognitiveConsistencySignal[];
  contradictionIndicators: readonly EnterpriseContradictionIndicator[];
  crossRuntimeAlignments: readonly CrossRuntimeAlignment[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
