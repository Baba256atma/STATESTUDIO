/** D9:5:9 — Executive strategic stability optimization + enterprise resilience-oriented orchestration types. */

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
import type { OutcomeProjectionSnapshot } from "./interventionProjectionTypes";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import type { AdaptiveSequencingSnapshot } from "./adaptiveSequencingTypes";

export type OptimizationCategory =
  | "resilience_strengthening"
  | "governance_stabilization"
  | "coordination_sustainability"
  | "escalation_resilience"
  | "recovery_continuity"
  | "operational_balance"
  | "adaptive_stability"
  | "strategic_sustainability"
  | "unknown";

export type OptimizationStrength = "weak" | "moderate" | "strong" | "systemic";

export type OptimizationState = "unstable" | "stabilizing" | "resilient" | "adaptive" | "sustainable";

export type StrategicStabilityOptimization = {
  optimizationId: string;
  optimizationState: OptimizationState;
  optimizationStrength: OptimizationStrength;
  optimizationCategory: OptimizationCategory;
  summary: string;
  resilienceSignals: readonly string[];
  sustainabilityRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseResiliencePathway = {
  pathwayId: string;
  pathwayLabel: string;
  pathwaySummary: string;
  linkedCategories: readonly OptimizationCategory[];
  pathwayStrength: OptimizationStrength;
  durability: "low" | "moderate" | "high";
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OperationalSustainabilitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly OptimizationCategory[];
  sustainabilityLevel: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StabilityReinforcementRelationship = {
  relationshipId: string;
  source: OptimizationCategory;
  target: OptimizationCategory;
  reinforcementSummary: string;
  reinforcementStrength: OptimizationStrength;
  generatedAt: number;
};

export type StabilityReinforcementTopology = {
  topologyId: string;
  topologySummary: string;
  reinforcementRelationships: readonly StabilityReinforcementRelationship[];
  topologyStrength: OptimizationStrength;
  generatedAt: number;
};

export type AdaptiveResilienceIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  linkedCategories: readonly OptimizationCategory[];
  adaptabilityLevel: "low" | "moderate" | "high";
  generatedAt: number;
};

export type StabilityOptimizationAwarenessSummary = {
  dominantOptimizationState: OptimizationState;
  dominantOptimizationStrength: OptimizationStrength;
  optimizationHeadline: string;
  resiliencePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type StabilityOptimizationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  optimizationCount: number;
  awarenessSummary: StabilityOptimizationAwarenessSummary;
  recentStabilityOptimizations: readonly StrategicStabilityOptimization[];
  resiliencePathways: readonly EnterpriseResiliencePathway[];
  sustainabilitySignals: readonly OperationalSustainabilitySignal[];
  reinforcementTopologies: readonly StabilityReinforcementTopology[];
  adaptiveResilienceIndicators: readonly AdaptiveResilienceIndicator[];
};

export type StrategicStabilityOptimizationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  dependencySnapshot?: DependencyAwarenessSnapshot | null;
  arbitrationSnapshot?: MultiObjectiveDecisionSnapshot | null;
  scenarioSnapshot?: ScenarioCoordinationSnapshot | null;
  sequencingSnapshot?: AdaptiveSequencingSnapshot | null;
  confidenceSnapshot?: ConfidenceArbitrationSnapshot | null;
  alignmentSnapshot?: GovernanceCoherenceSnapshot | null;
  projectionSnapshot?: OutcomeProjectionSnapshot | null;
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

export type StrategicStabilityOptimizationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StabilityOptimizationSnapshot | null;
  newStabilityOptimizations: number;
  storeSignature: string;
};

export type StabilityOptimizationStoreState = {
  stabilityOptimizations: readonly StrategicStabilityOptimization[];
  snapshots: readonly StabilityOptimizationSnapshot[];
  resiliencePathways: readonly EnterpriseResiliencePathway[];
  sustainabilitySignals: readonly OperationalSustainabilitySignal[];
  reinforcementTopologies: readonly StabilityReinforcementTopology[];
  adaptiveResilienceIndicators: readonly AdaptiveResilienceIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
