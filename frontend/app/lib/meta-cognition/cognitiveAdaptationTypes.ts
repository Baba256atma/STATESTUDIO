/** D9:6:8 — Executive cognitive adaptation intelligence + enterprise self-stabilization awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { ConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { AdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { ExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftTypes";
import type { ExecutiveCognitiveResilienceSnapshot } from "./cognitiveResilienceTypes";
import type { ExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintyTypes";
import type { StrategicExplanationSnapshot } from "./explainabilityTypes";
import type { MetaCognitionRuntimeSnapshot } from "./metaCognitionTypes";
import type { StrategicReasoningIntegritySnapshot } from "./reasoningIntegrityTypes";
import type { ExecutiveTrustCalibrationSnapshot } from "./trustCalibrationTypes";

export type AdaptationCategory =
  | "confidence_rebalancing"
  | "orchestration_stabilization"
  | "governance_reinforcement"
  | "uncertainty_adaptation"
  | "explainability_alignment"
  | "resilience_preservation"
  | "trust_recalibration"
  | "unknown";

export type AdaptationStrength = "weak" | "moderate" | "strong" | "enterprise_grade";

export type StabilizationState =
  | "reactive"
  | "adaptive"
  | "balancing"
  | "stabilizing"
  | "self_stabilized";

export type AdaptiveReasoningObservation = {
  adaptationId: string;
  stabilizationState: StabilizationState;
  adaptationStrength: AdaptationStrength;
  adaptationCategory: AdaptationCategory;
  summary: string;
  adaptationSignals: readonly string[];
  stabilizationRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseSelfStabilizationSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly AdaptationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StrategicAdaptationIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  adaptationLevel: "low" | "moderate" | "high" | "enterprise_grade";
  linkedCategories: readonly AdaptationCategory[];
  generatedAt: number;
};

export type RuntimeBalanceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  balancePosture: "low" | "moderate" | "high" | "enterprise_grade";
  linkedCategories: readonly AdaptationCategory[];
  generatedAt: number;
};

export type SelfStabilizationSummary = {
  dominantStabilizationState: StabilizationState;
  dominantAdaptationStrength: AdaptationStrength;
  stabilizationHeadline: string;
  balancePosture: "low" | "moderate" | "high" | "enterprise_grade";
};

export type ExecutiveCognitiveAdaptationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: SelfStabilizationSummary;
  recentAdaptiveObservations: readonly AdaptiveReasoningObservation[];
  selfStabilizationSignals: readonly EnterpriseSelfStabilizationSignal[];
  adaptationIndicators: readonly StrategicAdaptationIndicator[];
  runtimeBalanceFields: readonly RuntimeBalanceField[];
};

export type ExecutiveCognitiveAdaptationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  metaCognitionSnapshot?: MetaCognitionRuntimeSnapshot | null;
  reasoningIntegritySnapshot?: StrategicReasoningIntegritySnapshot | null;
  cognitiveDriftSnapshot?: ExecutiveCognitiveDriftSnapshot | null;
  cognitiveUncertaintySnapshot?: ExecutiveCognitiveUncertaintySnapshot | null;
  explainabilitySnapshot?: StrategicExplanationSnapshot | null;
  trustCalibrationSnapshot?: ExecutiveTrustCalibrationSnapshot | null;
  cognitiveResilienceSnapshot?: ExecutiveCognitiveResilienceSnapshot | null;
  confidenceSnapshot?: ConfidenceArbitrationSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  sequencingSnapshot?: AdaptiveSequencingSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type ExecutiveCognitiveAdaptationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveCognitiveAdaptationSnapshot | null;
  newAdaptiveObservations: number;
  storeSignature: string;
};

export type CognitiveAdaptationStoreState = {
  adaptiveObservations: readonly AdaptiveReasoningObservation[];
  snapshots: readonly ExecutiveCognitiveAdaptationSnapshot[];
  selfStabilizationSignals: readonly EnterpriseSelfStabilizationSignal[];
  adaptationIndicators: readonly StrategicAdaptationIndicator[];
  runtimeBalanceFields: readonly RuntimeBalanceField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastStabilizationState: StabilizationState | null;
};
