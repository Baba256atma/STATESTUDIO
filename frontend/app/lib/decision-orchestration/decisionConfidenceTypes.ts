/** D9:5:6 — Executive decision confidence arbitration + enterprise strategic certainty awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import type { InterventionWindowSnapshot } from "../foresight-cognition/interventionTimingTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { StrategicConsensusSnapshot } from "../foresight-cognition/consensusForesightTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import type { AdaptiveSequencingSnapshot } from "./adaptiveSequencingTypes";

export type ConfidenceCategory =
  | "escalation"
  | "resilience"
  | "governance"
  | "coordination"
  | "recovery"
  | "preparedness"
  | "orchestration"
  | "advisory"
  | "unknown";

export type ConfidenceLevel = "weak" | "limited" | "moderate" | "strong" | "executive_grade";

export type CertaintyState = "uncertain" | "fragmented" | "stabilizing" | "reliable" | "highly_confident";

export type ExecutiveDecisionConfidence = {
  confidenceId: string;
  certaintyState: CertaintyState;
  confidenceLevel: ConfidenceLevel;
  confidenceCategory: ConfidenceCategory;
  summary: string;
  confidenceSignals: readonly string[];
  uncertaintySignals: readonly string[];
  confidenceScore: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type StrategicCertaintySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ConfidenceCategory[];
  certaintyState: CertaintyState;
  confidenceScore: number;
  generatedAt: number;
};

export type EnterpriseUncertaintyField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  uncertaintyConcentration: "low" | "moderate" | "elevated" | "critical";
  linkedCategories: readonly ConfidenceCategory[];
  generatedAt: number;
};

export type OperationalAmbiguityIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  ambiguitySummary: string;
  ambiguityIntensity: "low" | "moderate" | "high";
  linkedCategories: readonly ConfidenceCategory[];
  generatedAt: number;
};

export type ConfidenceCoordinationSummary = {
  dominantCertaintyState: CertaintyState;
  dominantConfidenceLevel: ConfidenceLevel;
  confidenceHeadline: string;
  certaintyPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type ConfidenceArbitrationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  confidenceCount: number;
  coordinationSummary: ConfidenceCoordinationSummary;
  recentExecutiveConfidences: readonly ExecutiveDecisionConfidence[];
  certaintySignals: readonly StrategicCertaintySignal[];
  uncertaintyFields: readonly EnterpriseUncertaintyField[];
  ambiguityIndicators: readonly OperationalAmbiguityIndicator[];
};

export type ExecutiveDecisionConfidenceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  dependencySnapshot?: DependencyAwarenessSnapshot | null;
  arbitrationSnapshot?: MultiObjectiveDecisionSnapshot | null;
  scenarioSnapshot?: ScenarioCoordinationSnapshot | null;
  sequencingSnapshot?: AdaptiveSequencingSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
  consensusSnapshot?: StrategicConsensusSnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type ExecutiveDecisionConfidenceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ConfidenceArbitrationSnapshot | null;
  newExecutiveConfidences: number;
  storeSignature: string;
};

export type DecisionConfidenceStoreState = {
  executiveConfidences: readonly ExecutiveDecisionConfidence[];
  snapshots: readonly ConfidenceArbitrationSnapshot[];
  certaintySignals: readonly StrategicCertaintySignal[];
  uncertaintyFields: readonly EnterpriseUncertaintyField[];
  ambiguityIndicators: readonly OperationalAmbiguityIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
