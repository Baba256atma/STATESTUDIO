/** D9:6:7 — Executive cognitive resilience monitoring + enterprise intelligence survivability types. */

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
import type { ExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintyTypes";
import type { StrategicExplanationSnapshot } from "./explainabilityTypes";
import type { MetaCognitionRuntimeSnapshot } from "./metaCognitionTypes";
import type { StrategicReasoningIntegritySnapshot } from "./reasoningIntegrityTypes";
import type { ExecutiveTrustCalibrationSnapshot } from "./trustCalibrationTypes";

export type ResilienceCategory =
  | "reasoning_resilience"
  | "orchestration_resilience"
  | "foresight_resilience"
  | "governance_resilience"
  | "confidence_resilience"
  | "memory_resilience"
  | "runtime_stability"
  | "unknown";

export type ResilienceStrength = "fragile" | "monitored" | "stable" | "resilient" | "enterprise_grade";

export type SurvivabilityState = "degraded" | "unstable" | "adaptive" | "durable" | "survivable";

export type RuntimeResilienceObservation = {
  resilienceId: string;
  survivabilityState: SurvivabilityState;
  resilienceStrength: ResilienceStrength;
  resilienceCategory: ResilienceCategory;
  summary: string;
  resilienceSignals: readonly string[];
  survivabilityRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseSurvivabilitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ResilienceCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StrategicDurabilityIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  durabilityLevel: "low" | "moderate" | "high" | "enterprise_grade";
  linkedCategories: readonly ResilienceCategory[];
  generatedAt: number;
};

export type CognitiveStressField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  stressConcentration: "low" | "moderate" | "elevated" | "critical";
  linkedCategories: readonly ResilienceCategory[];
  generatedAt: number;
};

export type SurvivabilitySummary = {
  dominantSurvivabilityState: SurvivabilityState;
  dominantResilienceStrength: ResilienceStrength;
  survivabilityHeadline: string;
  robustnessPosture: "low" | "moderate" | "high" | "enterprise_grade";
};

export type ExecutiveCognitiveResilienceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: SurvivabilitySummary;
  recentResilienceObservations: readonly RuntimeResilienceObservation[];
  survivabilitySignals: readonly EnterpriseSurvivabilitySignal[];
  durabilityIndicators: readonly StrategicDurabilityIndicator[];
  cognitiveStressFields: readonly CognitiveStressField[];
};

export type ExecutiveCognitiveResilienceInput = {
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

export type ExecutiveCognitiveResilienceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveCognitiveResilienceSnapshot | null;
  newResilienceObservations: number;
  storeSignature: string;
};

export type CognitiveResilienceStoreState = {
  resilienceObservations: readonly RuntimeResilienceObservation[];
  snapshots: readonly ExecutiveCognitiveResilienceSnapshot[];
  survivabilitySignals: readonly EnterpriseSurvivabilitySignal[];
  durabilityIndicators: readonly StrategicDurabilityIndicator[];
  cognitiveStressFields: readonly CognitiveStressField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastSurvivabilityState: SurvivabilityState | null;
};
