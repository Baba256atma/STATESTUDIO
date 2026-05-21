/** D9:7:5 — Executive strategic debate simulation + enterprise counterfactual reasoning types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { StrategicConsensusSnapshot } from "./consensusIntelligenceTypes";
import type { CollectiveStrategicGuidanceSnapshot } from "./distributedAdvisoryTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";
import type { EnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingTypes";

export type DebateCategory =
  | "governance_vs_acceleration"
  | "resilience_vs_speed"
  | "containment_vs_adaptation"
  | "stabilization_vs_growth"
  | "caution_vs_execution"
  | "continuity_vs_optimization"
  | "trust_vs_aggression"
  | "unknown";

export type DebateStrength = "weak" | "moderate" | "strong" | "executive_grade";

export type CounterfactualState =
  | "exploratory"
  | "contested"
  | "simulated"
  | "stress_tested"
  | "strategically_resolved";

export type ExecutiveStrategicDebate = {
  debateId: string;
  counterfactualState: CounterfactualState;
  debateStrength: DebateStrength;
  debateCategory: DebateCategory;
  summary: string;
  challengedAssumptions: readonly string[];
  reinforcedStrategies: readonly string[];
  counterfactualSignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type AlternativeStrategyProjection = {
  projectionId: string;
  projectionLabel: string;
  projectionSummary: string;
  primaryCategory: DebateCategory;
  survivabilityPosture: "low" | "moderate" | "high" | "executive_grade";
  generatedAt: number;
};

export type EnterpriseChallengeSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly DebateCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type AssumptionStressField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  stressPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly DebateCategory[];
  generatedAt: number;
};

export type DebateSimulationSummary = {
  dominantCounterfactualState: CounterfactualState;
  dominantDebateStrength: DebateStrength;
  debateHeadline: string;
  robustnessPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CounterfactualReasoningSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: DebateSimulationSummary;
  recentDebates: readonly ExecutiveStrategicDebate[];
  alternativeProjections: readonly AlternativeStrategyProjection[];
  challengeSignals: readonly EnterpriseChallengeSignal[];
  assumptionStressFields: readonly AssumptionStressField[];
};

export type ExecutiveStrategicDebateInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  consensusPrioritySnapshot?: EnterpriseConsensusPrioritySnapshot | null;
  collectiveGuidanceSnapshot?: CollectiveStrategicGuidanceSnapshot | null;
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

export type ExecutiveStrategicDebateResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CounterfactualReasoningSnapshot | null;
  newDebates: number;
  storeSignature: string;
};

export type StrategicDebateStoreState = {
  debates: readonly ExecutiveStrategicDebate[];
  snapshots: readonly CounterfactualReasoningSnapshot[];
  alternativeProjections: readonly AlternativeStrategyProjection[];
  challengeSignals: readonly EnterpriseChallengeSignal[];
  assumptionStressFields: readonly AssumptionStressField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastCounterfactualState: CounterfactualState | null;
};
