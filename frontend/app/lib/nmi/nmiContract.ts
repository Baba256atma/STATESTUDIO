/**
 * NPA-T NMI:1 — UnifiedManagementModel contract.
 * Read-oriented composition. References existing canonical IDs. Not a store.
 */

import type { BusinessProjectContextKind } from "@/app/lib/business-context-awareness/businessProjectContextContract.ts";
import { nmiFoundationIdentity } from "./nmiIdentity.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";

export type NmiContextKind = BusinessProjectContextKind;

export const NMI_NODE_KINDS = Object.freeze([
  "BUSINESS_PROJECT",
  "MANAGER_ROLE",
  "GOAL",
  "PROCESS",
  "KPI",
  "DATA_EVIDENCE",
  "PROBLEM",
  "RISK",
  "VARIABLE",
  "SCENARIO",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "LEARNING",
] as const);

export type NmiNodeKind = (typeof NMI_NODE_KINDS)[number];

export type NmiCanonicalRef = {
  readonly id: string;
  readonly kind: NmiNodeKind;
  readonly authority: string;
  readonly sourceRef: string;
};

export const NMI_FOUNDATION_CONTRACT = Object.freeze({
  identity: nmiFoundationIdentity,
  ownsUnifiedManagementModelContracts: true as const,
  copiesCanonicalEntities: false as const,
  parallelContextClassifier: false as const,
  fabricatesMissingNodes: false as const,
  mutatesStage: false as const,
  mutatesObjects: false as const,
  approvesDecisions: false as const,
  startsExecutions: false as const,
  writesOutcomes: false as const,
  writesLearning: false as const,
  writesDataReality: false as const,
  writesSemantics: false as const,
  writesEvidence: false as const,
  writesGoals: false as const,
  createsCausalTruth: false as const,
  createsScenarios: false as const,
  managerFacingQueueUi: false as const,
  managementMapImplemented: false as const,
  attentionImplemented: false as const,
  decisionRoadmapImplemented: false as const,
  startsNmi2: false as const,
  startsRms2: false as const,
});

export type NmiDecisionRoadmapReadiness = {
  readonly implemented: false;
  readonly allowsIncompletePaths: true;
  readonly allowsMultiplePaths: true;
  readonly allowsCompetingScenarios: true;
  readonly allowsUnresolvedRelationships: true;
  readonly allowsMissingEvidence: true;
  readonly allowsNoDecision: true;
  readonly allowsDecisionWithoutExecution: true;
  readonly allowsExecutionWithoutOutcome: true;
  readonly fabricatesMissingNodes: false;
};

export type NmiFutureProjectionReadiness = {
  readonly managementMap: false;
  readonly attention: false;
  readonly queueUnchanged: true;
  readonly stageRemainsCurrentBranch: true;
  readonly advisorRemainsExplanation: true;
};

export type UnifiedManagementModel = {
  readonly identity: typeof nmiFoundationIdentity;
  readonly modelId: string;
  readonly contextId: string;
  readonly contextKind: NmiContextKind;
  readonly contextAuthority: "BCA:1/BusinessProjectContextFoundation";
  readonly businessProjectRef: NmiCanonicalRef | null;
  readonly managerRoleRef: NmiCanonicalRef | null;
  readonly nodes: readonly NmiCanonicalRef[];
  readonly relationships: readonly NmiManagementRelationship[];
  readonly unresolvedRelationshipIds: readonly string[];
  readonly missingNodes: readonly NmiNodeKind[];
  readonly compositionProvenance: readonly string[];
  readonly simulationStateIds: readonly string[];
  readonly observedRealityIds: readonly string[];
  readonly mutatesStage: false;
  readonly mutatesObjects: false;
  readonly approvesDecisions: false;
  readonly startsExecutions: false;
  readonly writesOutcomes: false;
  readonly writesLearning: false;
  readonly writesDataReality: false;
  readonly createsCausalCertainty: false;
  readonly scenarioIsDecision: false;
  readonly decisionIsExecution: false;
  readonly executionIsOutcome: false;
  readonly simulationIsObservedReality: false;
  readonly decisionRoadmap: NmiDecisionRoadmapReadiness;
  readonly futureProjections: NmiFutureProjectionReadiness;
};
