/** D9:6:6 — Executive cognitive trust calibration + enterprise reliability-awareness types. */

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

export type TrustCategory =
  | "foresight_reliability"
  | "orchestration_reliability"
  | "governance_reliability"
  | "confidence_reliability"
  | "memory_reliability"
  | "temporal_reliability"
  | "advisory_reliability"
  | "unknown";

export type ReliabilityStrength = "weak" | "limited" | "moderate" | "strong" | "executive_grade";

export type TrustState =
  | "cautious"
  | "monitored"
  | "conditionally_reliable"
  | "reliable"
  | "highly_trustworthy";

export type StrategicTrustAdjustment = {
  trustCalibrationId: string;
  trustState: TrustState;
  reliabilityStrength: ReliabilityStrength;
  trustCategory: TrustCategory;
  summary: string;
  reliabilitySignals: readonly string[];
  cautionSignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseReliabilitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly TrustCategory[];
  signalStrength: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type OperationalTrustworthinessField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  trustworthinessLevel: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly TrustCategory[];
  generatedAt: number;
};

export type CognitiveReliabilityIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  reliabilityPosture: "degraded" | "stable" | "strengthening" | "executive_grade";
  linkedCategories: readonly TrustCategory[];
  generatedAt: number;
};

export type TrustCalibrationSummary = {
  dominantTrustState: TrustState;
  dominantReliabilityStrength: ReliabilityStrength;
  calibrationHeadline: string;
  dependabilityPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type ExecutiveTrustCalibrationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  adjustmentCount: number;
  awarenessSummary: TrustCalibrationSummary;
  recentTrustAdjustments: readonly StrategicTrustAdjustment[];
  reliabilitySignals: readonly EnterpriseReliabilitySignal[];
  trustworthinessFields: readonly OperationalTrustworthinessField[];
  reliabilityIndicators: readonly CognitiveReliabilityIndicator[];
};

export type ExecutiveTrustCalibrationInput = {
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

export type ExecutiveTrustCalibrationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveTrustCalibrationSnapshot | null;
  newTrustAdjustments: number;
  storeSignature: string;
};

export type TrustCalibrationStoreState = {
  trustAdjustments: readonly StrategicTrustAdjustment[];
  snapshots: readonly ExecutiveTrustCalibrationSnapshot[];
  reliabilitySignals: readonly EnterpriseReliabilitySignal[];
  trustworthinessFields: readonly OperationalTrustworthinessField[];
  reliabilityIndicators: readonly CognitiveReliabilityIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastTrustState: TrustState | null;
};
