/** D9:6:1 — Autonomous executive meta-cognition + enterprise self-reflective intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { ConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";

export type CognitionCategory =
  | "enterprise_cognition"
  | "institutional_memory"
  | "temporal_cognition"
  | "foresight"
  | "decision_orchestration"
  | "governance"
  | "confidence"
  | "unknown";

export type CognitionHealth = "weak" | "monitored" | "stable" | "strong" | "executive_grade";

export type IntegrityState = "uncertain" | "fragmented" | "coherent" | "reliable" | "verified";

export type ReasoningIntegrityObservation = {
  metaCognitionId: string;
  cognitionHealth: CognitionHealth;
  integrityState: IntegrityState;
  cognitionCategory: CognitionCategory;
  summary: string;
  qualitySignals: readonly string[];
  risks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CognitionQualitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly CognitionCategory[];
  signalStrength: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type MetaCognitiveRisk = {
  riskId: string;
  riskLabel: string;
  riskSummary: string;
  linkedCategories: readonly CognitionCategory[];
  riskSeverity: "low" | "moderate" | "high" | "critical";
  generatedAt: number;
};

export type StrategicCognitionHealth = {
  healthId: string;
  cognitionHealth: CognitionHealth;
  integrityState: IntegrityState;
  healthSummary: string;
  crossLayerAlignment: "low" | "moderate" | "high" | "executive_grade";
  confidenceReliability: "low" | "moderate" | "high";
  generatedAt: number;
};

export type SelfReflectionSummary = {
  summaryId: string;
  reflectionHeadline: string;
  reflectionSubline: string;
  cautionLevel: "low" | "moderate" | "elevated";
  generatedAt: number;
};

export type MetaCognitionAwarenessSummary = {
  dominantCognitionHealth: CognitionHealth;
  dominantIntegrityState: IntegrityState;
  metaCognitionHeadline: string;
  reflectionPosture: "low" | "moderate" | "high" | "executive_grade";
};

/** D9:6 runtime snapshot — distinct from UI `ExecutiveMetaCognitionSnapshot` in executiveMetaCognitionTypes. */
export type MetaCognitionRuntimeSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: MetaCognitionAwarenessSummary;
  recentIntegrityObservations: readonly ReasoningIntegrityObservation[];
  cognitionQualitySignals: readonly CognitionQualitySignal[];
  metaCognitiveRisks: readonly MetaCognitiveRisk[];
  strategicCognitionHealth: StrategicCognitionHealth | null;
  selfReflectionSummaries: readonly SelfReflectionSummary[];
};

export type ExecutiveMetaCognitionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  confidenceSnapshot?: ConfidenceArbitrationSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  advisoryLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type ExecutiveMetaCognitionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: MetaCognitionRuntimeSnapshot | null;
  newIntegrityObservations: number;
  storeSignature: string;
};

export type MetaCognitionStoreState = {
  integrityObservations: readonly ReasoningIntegrityObservation[];
  snapshots: readonly MetaCognitionRuntimeSnapshot[];
  cognitionQualitySignals: readonly CognitionQualitySignal[];
  metaCognitiveRisks: readonly MetaCognitiveRisk[];
  strategicCognitionHealthRecords: readonly StrategicCognitionHealth[];
  selfReflectionSummaries: readonly SelfReflectionSummary[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
