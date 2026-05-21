/** D9:6:9 — Executive cognitive governance intelligence + enterprise strategic self-regulation types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { ConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { AdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { ExecutiveCognitiveAdaptationSnapshot } from "./cognitiveAdaptationTypes";
import type { ExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftTypes";
import type { ExecutiveCognitiveResilienceSnapshot } from "./cognitiveResilienceTypes";
import type { ExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintyTypes";
import type { StrategicExplanationSnapshot } from "./explainabilityTypes";
import type { MetaCognitionRuntimeSnapshot } from "./metaCognitionTypes";
import type { StrategicReasoningIntegritySnapshot } from "./reasoningIntegrityTypes";
import type { ExecutiveTrustCalibrationSnapshot } from "./trustCalibrationTypes";

export type GovernanceCategory =
  | "confidence_governance"
  | "orchestration_governance"
  | "uncertainty_governance"
  | "trust_governance"
  | "explainability_governance"
  | "foresight_governance"
  | "resilience_governance"
  | "unknown";

export type GovernanceStrength = "weak" | "monitored" | "stable" | "governed" | "enterprise_grade";

export type RegulationState =
  | "unrestricted"
  | "monitored"
  | "constrained"
  | "stabilized"
  | "self_regulated";

export type CognitiveConstraintObservation = {
  governanceId: string;
  regulationState: RegulationState;
  governanceStrength: GovernanceStrength;
  governanceCategory: GovernanceCategory;
  summary: string;
  governanceSignals: readonly string[];
  governanceRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseSelfRegulationSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly GovernanceCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StrategicBoundaryIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  boundaryLevel: "low" | "moderate" | "high" | "enterprise_grade";
  linkedCategories: readonly GovernanceCategory[];
  generatedAt: number;
};

export type GovernanceIntegrityField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  integrityPosture: "low" | "moderate" | "high" | "enterprise_grade";
  linkedCategories: readonly GovernanceCategory[];
  generatedAt: number;
};

export type SelfRegulationSummary = {
  dominantRegulationState: RegulationState;
  dominantGovernanceStrength: GovernanceStrength;
  regulationHeadline: string;
  integrityPosture: "low" | "moderate" | "high" | "enterprise_grade";
};

export type ExecutiveCognitiveGovernanceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: SelfRegulationSummary;
  recentConstraintObservations: readonly CognitiveConstraintObservation[];
  selfRegulationSignals: readonly EnterpriseSelfRegulationSignal[];
  boundaryIndicators: readonly StrategicBoundaryIndicator[];
  governanceIntegrityFields: readonly GovernanceIntegrityField[];
};

export type ExecutiveCognitiveGovernanceInput = {
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
  cognitiveAdaptationSnapshot?: ExecutiveCognitiveAdaptationSnapshot | null;
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

export type ExecutiveCognitiveGovernanceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveCognitiveGovernanceSnapshot | null;
  newConstraintObservations: number;
  storeSignature: string;
};

export type CognitiveGovernanceStoreState = {
  constraintObservations: readonly CognitiveConstraintObservation[];
  snapshots: readonly ExecutiveCognitiveGovernanceSnapshot[];
  selfRegulationSignals: readonly EnterpriseSelfRegulationSignal[];
  boundaryIndicators: readonly StrategicBoundaryIndicator[];
  governanceIntegrityFields: readonly GovernanceIntegrityField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRegulationState: RegulationState | null;
};
