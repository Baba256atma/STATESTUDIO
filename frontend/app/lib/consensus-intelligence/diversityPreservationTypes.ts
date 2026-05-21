/** D9:7:6 — Executive strategic diversity preservation + enterprise anti-consensus fragility types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { PerspectiveCategory, StrategicConsensusSnapshot } from "./consensusIntelligenceTypes";
import type { CollectiveStrategicGuidanceSnapshot } from "./distributedAdvisoryTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";
import type { EnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingTypes";
import type { CounterfactualReasoningSnapshot } from "./strategicDebateTypes";

export type DiversityCategory =
  | "governance_diversity"
  | "resilience_diversity"
  | "operational_diversity"
  | "foresight_diversity"
  | "orchestration_diversity"
  | "trust_diversity"
  | "counterfactual_diversity"
  | "unknown";

export type FragilityStrength = "weak" | "monitored" | "elevated" | "dangerous" | "systemic";

export type PluralityState = "collapsed" | "narrowing" | "diverse" | "balanced" | "resilient";

export type PluralityPerspective =
  | PerspectiveCategory
  | "counterfactual"
  | "trust"
  | "explainability";

export type DiversityResilienceObservation = {
  diversityId: string;
  pluralityState: PluralityState;
  fragilityStrength: FragilityStrength;
  diversityCategory: DiversityCategory;
  summary: string;
  preservedPerspectives: readonly PluralityPerspective[];
  weakenedPerspectives: readonly PluralityPerspective[];
  diversitySignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type AntiConsensusFragilitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly DiversityCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type PerspectivePluralityField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  pluralityPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly DiversityCategory[];
  generatedAt: number;
};

export type EnterpriseGroupthinkIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  monocultureRisk: "low" | "moderate" | "high" | "systemic";
  linkedCategories: readonly DiversityCategory[];
  generatedAt: number;
};

export type DiversityPreservationSummary = {
  dominantPluralityState: PluralityState;
  dominantFragilityStrength: FragilityStrength;
  preservationHeadline: string;
  resiliencePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type StrategicDiversitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: DiversityPreservationSummary;
  recentObservations: readonly DiversityResilienceObservation[];
  groupthinkIndicators: readonly EnterpriseGroupthinkIndicator[];
  fragilitySignals: readonly AntiConsensusFragilitySignal[];
  pluralityFields: readonly PerspectivePluralityField[];
};

export type StrategicDiversityPreservationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  consensusPrioritySnapshot?: EnterpriseConsensusPrioritySnapshot | null;
  collectiveGuidanceSnapshot?: CollectiveStrategicGuidanceSnapshot | null;
  counterfactualSnapshot?: CounterfactualReasoningSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type StrategicDiversityPreservationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StrategicDiversitySnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type DiversityPreservationStoreState = {
  observations: readonly DiversityResilienceObservation[];
  snapshots: readonly StrategicDiversitySnapshot[];
  groupthinkIndicators: readonly EnterpriseGroupthinkIndicator[];
  fragilitySignals: readonly AntiConsensusFragilitySignal[];
  pluralityFields: readonly PerspectivePluralityField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastPluralityState: PluralityState | null;
};
