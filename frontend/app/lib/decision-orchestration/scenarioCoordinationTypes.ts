/** D9:5:4 — Executive scenario coordination + enterprise strategic response topology types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { ActionCategory } from "./decisionOrchestrationTypes";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";

export type ResponseScenarioId = ActionCategory | "enterprise_stabilization" | "unknown";

export type ScenarioRelationshipCategory =
  | "reinforcing"
  | "stabilizing"
  | "conflicting"
  | "amplifying"
  | "constraining"
  | "dependent"
  | "adaptive"
  | "unknown";

export type CoordinationStrength = "weak" | "moderate" | "strong" | "systemic";

export type TopologyState = "isolated" | "linked" | "coordinated" | "interconnected" | "constrained";

export type CoordinationConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type StrategicResponseScenario = {
  scenarioId: string;
  scenarioCategory: ResponseScenarioId;
  scenarioLabel: string;
  scenarioSummary: string;
  coordinationRole: "primary" | "supporting" | "amplifier" | "constraint";
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type ScenarioCoordinationRelationship = {
  relationshipId: string;
  source: ResponseScenarioId;
  target: ResponseScenarioId;
  relationship: ScenarioRelationshipCategory;
  coordinationStrength: CoordinationStrength;
  relationshipSummary: string;
  confidence: number;
  generatedAt: number;
};

export type OperationalInteractionField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  linkedScenarios: readonly ResponseScenarioId[];
  interactionIntensity: "low" | "moderate" | "high";
  generatedAt: number;
};

export type ResponseReinforcementSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedScenarios: readonly ResponseScenarioId[];
  reinforcementStrength: CoordinationStrength;
  confidence: number;
  generatedAt: number;
};

export type EnterpriseResponseTopology = {
  topologyId: string;
  topologyState: TopologyState;
  coordinationStrength: CoordinationStrength;
  summary: string;
  interactionRelationships: readonly ScenarioCoordinationRelationship[];
  coordinationRisks: readonly string[];
  confidence: number;
  confidenceLevel: CoordinationConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type TopologyAwarenessSummary = {
  dominantTopologyState: TopologyState;
  dominantCoordinationStrength: CoordinationStrength;
  topologyHeadline: string;
  coordinationPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type ScenarioCoordinationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  topologyCount: number;
  awarenessSummary: TopologyAwarenessSummary;
  recentResponseTopologies: readonly EnterpriseResponseTopology[];
  strategicResponseScenarios: readonly StrategicResponseScenario[];
  interactionFields: readonly OperationalInteractionField[];
  reinforcementSignals: readonly ResponseReinforcementSignal[];
};

export type ExecutiveScenarioCoordinationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  dependencySnapshot?: DependencyAwarenessSnapshot | null;
  arbitrationSnapshot?: MultiObjectiveDecisionSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
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

export type ExecutiveScenarioCoordinationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ScenarioCoordinationSnapshot | null;
  newResponseTopologies: number;
  storeSignature: string;
};

export type ScenarioCoordinationStoreState = {
  responseTopologies: readonly EnterpriseResponseTopology[];
  snapshots: readonly ScenarioCoordinationSnapshot[];
  strategicScenarios: readonly StrategicResponseScenario[];
  interactionFields: readonly OperationalInteractionField[];
  reinforcementSignals: readonly ResponseReinforcementSignal[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
