/** D9:5:2 — Strategic action dependency + operational coordination graph types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import type { InterventionWindowSnapshot } from "../foresight-cognition/interventionTimingTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type {
  ActionCategory,
  DecisionCoordinationSnapshot,
} from "./decisionOrchestrationTypes";

export type DependencyCategory =
  | "prerequisite"
  | "reinforcement"
  | "synchronization"
  | "blocking"
  | "acceleration"
  | "stabilization"
  | "recovery"
  | "unknown";

export type DependencyStrength = "weak" | "moderate" | "strong" | "critical";

export type CoordinationState = "isolated" | "linked" | "dependent" | "synchronized" | "constrained";

export type DependencyConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type StrategicActionDependency = {
  dependencyId: string;
  source: ActionCategory;
  target: ActionCategory;
  relationship: DependencyCategory;
  dependencyStrength: DependencyStrength;
  dependencySummary: string;
  confidence: number;
  generatedAt: number;
};

export type EnterpriseDependencyNode = {
  nodeId: string;
  category: ActionCategory;
  nodeLabel: string;
  inboundCount: number;
  outboundCount: number;
  criticality: DependencyStrength;
  generatedAt: number;
};

export type ResponseRelationshipSignal = {
  signalId: string;
  source: ActionCategory;
  target: ActionCategory;
  relationship: DependencyCategory;
  signalLabel: string;
  signalSummary: string;
  dependencyStrength: DependencyStrength;
  confidence: number;
  generatedAt: number;
};

export type CoordinationBottleneckIndicator = {
  indicatorId: string;
  bottleneckCategory: ActionCategory | "coordination_instability" | "governance_delay" | "unknown";
  indicatorLabel: string;
  bottleneckSummary: string;
  severity: "moderate" | "elevated" | "critical";
  generatedAt: number;
};

export type OperationalCoordinationGraph = {
  dependencyGraphId: string;
  coordinationState: CoordinationState;
  dependencyStrength: DependencyStrength;
  summary: string;
  dependencyRelationships: readonly StrategicActionDependency[];
  bottlenecks: readonly string[];
  confidence: number;
  confidenceLevel: DependencyConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type DependencyAwarenessSummary = {
  dominantCoordinationState: CoordinationState;
  dominantDependencyStrength: DependencyStrength;
  dependencyHeadline: string;
  graphComplexity: "low" | "moderate" | "high" | "executive_grade";
};

export type DependencyAwarenessSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  graphCount: number;
  awarenessSummary: DependencyAwarenessSummary;
  recentCoordinationGraphs: readonly OperationalCoordinationGraph[];
  dependencyNodes: readonly EnterpriseDependencyNode[];
  relationshipSignals: readonly ResponseRelationshipSignal[];
  bottleneckIndicators: readonly CoordinationBottleneckIndicator[];
};

export type StrategicActionDependencyInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type StrategicActionDependencyResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: DependencyAwarenessSnapshot | null;
  newCoordinationGraphs: number;
  storeSignature: string;
};

export type ActionDependencyStoreState = {
  coordinationGraphs: readonly OperationalCoordinationGraph[];
  snapshots: readonly DependencyAwarenessSnapshot[];
  dependencyNodes: readonly EnterpriseDependencyNode[];
  relationshipSignals: readonly ResponseRelationshipSignal[];
  bottleneckIndicators: readonly CoordinationBottleneckIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
