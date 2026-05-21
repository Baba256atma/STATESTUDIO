/** D9:6:4 — Executive cognitive uncertainty awareness + enterprise strategic ambiguity intelligence types. */

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
import type { MetaCognitionRuntimeSnapshot } from "./metaCognitionTypes";
import type { StrategicReasoningIntegritySnapshot } from "./reasoningIntegrityTypes";

export type AmbiguityCategory =
  | "operational_visibility_gap"
  | "coordination_incompleteness"
  | "evidence_sparsity"
  | "foresight_limitation"
  | "temporal_gap"
  | "governance_unknown"
  | "confidence_without_evidence"
  | "subsystem_blind_spot"
  | "unknown";

export type UncertaintySeverity = "low" | "monitored" | "elevated" | "material" | "critical";

export type CautionPosture = "none" | "moderated" | "cautious" | "restricted" | "unknown_zone";

export type StrategicAmbiguityObservation = {
  ambiguityId: string;
  cautionPosture: CautionPosture;
  uncertaintySeverity: UncertaintySeverity;
  ambiguityCategory: AmbiguityCategory;
  summary: string;
  knownSignals: readonly string[];
  unknownZones: readonly string[];
  cautionRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseAmbiguitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly AmbiguityCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type UncertaintyTopologyField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  topologyConcentration: "low" | "moderate" | "elevated" | "critical";
  linkedCategories: readonly AmbiguityCategory[];
  generatedAt: number;
};

export type IncompleteInformationIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  informationGap: "partial" | "substantial" | "severe";
  linkedCategories: readonly AmbiguityCategory[];
  generatedAt: number;
};

export type UnknownZoneObservation = {
  zoneId: string;
  zoneLabel: string;
  zoneSummary: string;
  zoneScope: "subsystem" | "cross_runtime" | "enterprise";
  generatedAt: number;
};

export type UncertaintyAwarenessSummary = {
  dominantCautionPosture: CautionPosture;
  dominantUncertaintySeverity: UncertaintySeverity;
  uncertaintyHeadline: string;
  epistemicPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type ExecutiveCognitiveUncertaintySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  ambiguityCount: number;
  awarenessSummary: UncertaintyAwarenessSummary;
  recentAmbiguityObservations: readonly StrategicAmbiguityObservation[];
  ambiguitySignals: readonly EnterpriseAmbiguitySignal[];
  uncertaintyTopologyFields: readonly UncertaintyTopologyField[];
  incompleteInformationIndicators: readonly IncompleteInformationIndicator[];
  unknownZoneObservations: readonly UnknownZoneObservation[];
};

export type ExecutiveCognitiveUncertaintyInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  metaCognitionSnapshot?: MetaCognitionRuntimeSnapshot | null;
  reasoningIntegritySnapshot?: StrategicReasoningIntegritySnapshot | null;
  cognitiveDriftSnapshot?: ExecutiveCognitiveDriftSnapshot | null;
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

export type ExecutiveCognitiveUncertaintyResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveCognitiveUncertaintySnapshot | null;
  newAmbiguityObservations: number;
  storeSignature: string;
};

export type CognitiveUncertaintyStoreState = {
  ambiguityObservations: readonly StrategicAmbiguityObservation[];
  snapshots: readonly ExecutiveCognitiveUncertaintySnapshot[];
  ambiguitySignals: readonly EnterpriseAmbiguitySignal[];
  uncertaintyTopologyFields: readonly UncertaintyTopologyField[];
  incompleteInformationIndicators: readonly IncompleteInformationIndicator[];
  unknownZoneObservations: readonly UnknownZoneObservation[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastCautionPosture: CautionPosture | null;
};
