/** D9:6:3 — Executive cognitive drift awareness + enterprise strategic reasoning stability types. */

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
import type { StrategicReasoningIntegritySnapshot } from "./reasoningIntegrityTypes";

export type DriftCategory =
  | "confidence_drift"
  | "orchestration_drift"
  | "foresight_drift"
  | "advisory_instability"
  | "governance_inconsistency"
  | "temporal_fragmentation"
  | "strategic_noise"
  | "unknown";

export type DriftSeverity = "low" | "monitored" | "elevated" | "unstable" | "critical";

export type StabilityState = "stable" | "adaptive" | "fluctuating" | "degrading" | "fragmented";

export type StrategicReasoningStability = {
  driftId: string;
  stabilityState: StabilityState;
  driftSeverity: DriftSeverity;
  driftCategory: DriftCategory;
  summary: string;
  stabilitySignals: readonly string[];
  driftRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseDriftSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly DriftCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type CognitiveVolatilityIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  linkedCategories: readonly DriftCategory[];
  volatilityLevel: "low" | "moderate" | "high" | "critical";
  generatedAt: number;
};

export type LongHorizonConsistencyField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  persistenceLevel: "low" | "moderate" | "high" | "executive_grade";
  generatedAt: number;
};

export type DriftAwarenessSummary = {
  dominantStabilityState: StabilityState;
  dominantDriftSeverity: DriftSeverity;
  driftHeadline: string;
  durabilityPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type ExecutiveCognitiveDriftSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  stabilityCount: number;
  awarenessSummary: DriftAwarenessSummary;
  recentReasoningStabilities: readonly StrategicReasoningStability[];
  driftSignals: readonly EnterpriseDriftSignal[];
  volatilityIndicators: readonly CognitiveVolatilityIndicator[];
  longHorizonConsistencyFields: readonly LongHorizonConsistencyField[];
};

export type ExecutiveCognitiveDriftInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  metaCognitionSnapshot?: MetaCognitionRuntimeSnapshot | null;
  reasoningIntegritySnapshot?: StrategicReasoningIntegritySnapshot | null;
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

export type ExecutiveCognitiveDriftResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveCognitiveDriftSnapshot | null;
  newReasoningStabilities: number;
  storeSignature: string;
};

export type CognitiveDriftStoreState = {
  reasoningStabilities: readonly StrategicReasoningStability[];
  snapshots: readonly ExecutiveCognitiveDriftSnapshot[];
  driftSignals: readonly EnterpriseDriftSignal[];
  volatilityIndicators: readonly CognitiveVolatilityIndicator[];
  longHorizonConsistencyFields: readonly LongHorizonConsistencyField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastStabilityState: StabilityState | null;
};
