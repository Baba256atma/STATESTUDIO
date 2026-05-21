/** D9:5:8 — Executive strategic intervention simulation + enterprise response outcome projection types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import type { ConfidenceArbitrationSnapshot } from "./decisionConfidenceTypes";
import type { GovernanceCoherenceSnapshot } from "./institutionalAlignmentTypes";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import type { AdaptiveSequencingSnapshot } from "./adaptiveSequencingTypes";

export type ProjectionCategory =
  | "escalation_reduction"
  | "resilience_growth"
  | "governance_stabilization"
  | "coordination_shift"
  | "recovery_acceleration"
  | "pressure_reduction"
  | "operational_tradeoff"
  | "strategic_realignment"
  | "unknown";

export type ProjectionStrength = "weak" | "moderate" | "strong" | "systemic";

export type ProjectionState = "hypothetical" | "emerging" | "probable" | "stabilizing" | "uncertain";

export type StrategicInterventionProjection = {
  projectionId: string;
  projectionState: ProjectionState;
  projectionStrength: ProjectionStrength;
  projectionCategory: ProjectionCategory;
  summary: string;
  projectedOutcomes: readonly string[];
  secondaryEffects: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseOutcomeSimulation = {
  simulationId: string;
  projectionState: ProjectionState;
  projectionStrength: ProjectionStrength;
  simulationSummary: string;
  linkedProjections: readonly string[];
  outcomeConsistency: "low" | "moderate" | "high";
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OperationalConsequenceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ProjectionCategory[];
  consequenceIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type ResponseEvolutionProjection = {
  evolutionId: string;
  evolutionSummary: string;
  trajectoryLabel: string;
  linkedCategories: readonly ProjectionCategory[];
  evolutionPhase: "initial" | "propagating" | "stabilizing" | "sustained";
  generatedAt: number;
};

export type InterventionEffectRelationship = {
  relationshipId: string;
  source: ProjectionCategory;
  target: ProjectionCategory;
  effectSummary: string;
  effectStrength: ProjectionStrength;
  generatedAt: number;
};

export type InterventionEffectTopology = {
  topologyId: string;
  topologySummary: string;
  effectRelationships: readonly InterventionEffectRelationship[];
  topologyStrength: ProjectionStrength;
  generatedAt: number;
};

export type OutcomeProjectionAwarenessSummary = {
  dominantProjectionState: ProjectionState;
  dominantProjectionStrength: ProjectionStrength;
  projectionHeadline: string;
  projectionPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type OutcomeProjectionSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  projectionCount: number;
  awarenessSummary: OutcomeProjectionAwarenessSummary;
  recentInterventionProjections: readonly StrategicInterventionProjection[];
  outcomeSimulations: readonly EnterpriseOutcomeSimulation[];
  consequenceSignals: readonly OperationalConsequenceSignal[];
  evolutionProjections: readonly ResponseEvolutionProjection[];
  effectTopologies: readonly InterventionEffectTopology[];
};

export type StrategicInterventionProjectionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  dependencySnapshot?: DependencyAwarenessSnapshot | null;
  arbitrationSnapshot?: MultiObjectiveDecisionSnapshot | null;
  scenarioSnapshot?: ScenarioCoordinationSnapshot | null;
  sequencingSnapshot?: AdaptiveSequencingSnapshot | null;
  confidenceSnapshot?: ConfidenceArbitrationSnapshot | null;
  alignmentSnapshot?: GovernanceCoherenceSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
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

export type StrategicInterventionProjectionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: OutcomeProjectionSnapshot | null;
  newInterventionProjections: number;
  storeSignature: string;
};

export type InterventionProjectionStoreState = {
  interventionProjections: readonly StrategicInterventionProjection[];
  snapshots: readonly OutcomeProjectionSnapshot[];
  outcomeSimulations: readonly EnterpriseOutcomeSimulation[];
  consequenceSignals: readonly OperationalConsequenceSignal[];
  evolutionProjections: readonly ResponseEvolutionProjection[];
  effectTopologies: readonly InterventionEffectTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
