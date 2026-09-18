/**
 * NPA-T NMI:2 — Management Map read contract.
 * Composes from NMI:1 UnifiedManagementModel. Does not own canonical entities.
 */

import type { NmiCanonicalRef, NmiContextKind, NmiNodeKind, UnifiedManagementModel } from "./nmiContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { nmiManagementMapIdentity } from "./nmiManagementMapIdentity.ts";

export const NMI_MANAGEMENT_MAP_SECTIONS = Object.freeze([
  "CONTEXT",
  "GOALS",
  "OPERATIONS",
  "KPI_DATA",
  "PROBLEMS",
  "RISKS",
  "VARIABLES",
  "SCENARIOS",
  "DECISIONS",
  "EXECUTIONS",
  "OUTCOMES",
  "LEARNING",
] as const);

export type NmiManagementMapSection = (typeof NMI_MANAGEMENT_MAP_SECTIONS)[number];

export const NMI_NODE_KIND_TO_SECTION: Readonly<Record<NmiNodeKind, NmiManagementMapSection>> = Object.freeze({
  BUSINESS_PROJECT: "CONTEXT",
  MANAGER_ROLE: "CONTEXT",
  GOAL: "GOALS",
  PROCESS: "OPERATIONS",
  KPI: "KPI_DATA",
  DATA_EVIDENCE: "KPI_DATA",
  PROBLEM: "PROBLEMS",
  RISK: "RISKS",
  VARIABLE: "VARIABLES",
  SCENARIO: "SCENARIOS",
  DECISION: "DECISIONS",
  EXECUTION: "EXECUTIONS",
  OUTCOME: "OUTCOMES",
  LEARNING: "LEARNING",
});

export const NMI_MANAGEMENT_MAP_SCOPE_KINDS = Object.freeze([
  "ENTIRE_CONTEXT",
  "ENTIRE_BUSINESS",
  "ENTIRE_PROJECT",
  "GOAL",
  "PROCESS",
  "PROBLEM",
  "RISK",
  "SCENARIO",
  "DECISION",
  "EXECUTION",
] as const);

export type NmiManagementMapScopeKind = (typeof NMI_MANAGEMENT_MAP_SCOPE_KINDS)[number];

export type NmiManagementMapScope = {
  readonly kind: NmiManagementMapScopeKind;
  readonly nodeId?: string;
};

export type NmiManagementMapNodeAnnotation = {
  readonly id: string;
  readonly title?: string | null;
  readonly knownStatus?: string | null;
  readonly contextKind?: NmiContextKind;
  readonly provenance?: readonly string[];
};

export type ManagementMapNode = {
  readonly nodeId: string;
  readonly canonicalRef: NmiCanonicalRef;
  readonly kind: NmiNodeKind;
  readonly title: string | null;
  readonly section: NmiManagementMapSection;
  readonly contextKind: NmiContextKind;
  readonly provenance: readonly string[];
  readonly knownStatus: string | null;
  readonly relationshipIds: readonly string[];
  readonly analyticalRole: boolean;
  readonly copiesCanonicalEntity: false;
};

export type NmiManagementMapSectionView = {
  readonly section: NmiManagementMapSection;
  readonly nodeIds: readonly string[];
  readonly empty: boolean;
};

export type NmiHybridLanePreservation = {
  readonly flattened: false;
  readonly businessNodeIds: readonly string[];
  readonly projectNodeIds: readonly string[];
  readonly hybridNodeIds: readonly string[];
  readonly unknownNodeIds: readonly string[];
};

export type ManagementMap = {
  readonly identity: typeof nmiManagementMapIdentity;
  readonly mapId: string;
  readonly sourceModelId: string;
  readonly sourceModel: UnifiedManagementModel;
  readonly contextId: string;
  readonly contextKind: NmiContextKind;
  readonly contextAuthority: "BCA:1/BusinessProjectContextFoundation";
  readonly scope: NmiManagementMapScope;
  readonly nodes: readonly ManagementMapNode[];
  readonly relationships: readonly NmiManagementRelationship[];
  readonly unresolvedRelationshipIds: readonly string[];
  readonly outOfScopeRelationshipIds: readonly string[];
  readonly missingSections: readonly NmiManagementMapSection[];
  readonly sections: readonly NmiManagementMapSectionView[];
  readonly disconnectedNodeIds: readonly string[];
  readonly hybridLanes: NmiHybridLanePreservation | null;
  readonly compositionProvenance: readonly string[];
  readonly mutatesStage: false;
  readonly mutatesQueue: false;
  readonly mutatesObjects: false;
  readonly writesDataReality: false;
  readonly writesSemantics: false;
  readonly writesEvidence: false;
  readonly bypassesGate: false;
  readonly createsCausalCertainty: false;
  readonly fabricatesMissingNodes: false;
  readonly fabricatesMissingEdges: false;
  readonly decisionRoadmapImplemented: false;
  readonly attentionImplemented: false;
  readonly startsNmi3: false;
  readonly parallelAdvisor: false;
};

export type NmiManagementMapProjection = {
  readonly mapId: string;
  readonly contextKind: NmiContextKind;
  readonly scope: NmiManagementMapScope;
  readonly lines: readonly string[];
  readonly sections: readonly NmiManagementMapSectionView[];
  readonly mutatesQueue: false;
  readonly mutatesStage: false;
};

export type NmiManagementBranch = {
  readonly originNodeId: string;
  readonly originPresent: boolean;
  readonly maxDepth: number;
  readonly nodes: readonly ManagementMapNode[];
  readonly relationships: readonly NmiManagementRelationship[];
  readonly unresolvedRelationshipIds: readonly string[];
  readonly cycleEncountered: boolean;
  readonly truncatedByDepth: boolean;
  readonly inventedNodes: false;
  readonly inventedRelationships: false;
  readonly createsCausalCertainty: false;
};

export const NMI_MANAGEMENT_MAP_CONTRACT = Object.freeze({
  identity: nmiManagementMapIdentity,
  sourceAuthority: "NPA-T NMI:1/ManagementIntelligenceFoundation",
  copiesCanonicalEntities: false as const,
  mutatesStage: false as const,
  mutatesQueue: false as const,
  mutatesObjects: false as const,
  writesDataReality: false as const,
  writesSemantics: false as const,
  writesEvidence: false as const,
  bypassesGate: false as const,
  createsCausalCertainty: false as const,
  fabricatesMissingNodes: false as const,
  fabricatesMissingEdges: false as const,
  decisionRoadmapImplemented: false as const,
  attentionImplemented: false as const,
  managerFacingQueueUi: false as const,
  parallelAdvisor: false as const,
  startsNmi3: false as const,
  redesignsQueue: false as const,
  newStageTheatre: false as const,
});

export const NMI_MANAGEMENT_MAP_GATE_FLOW = Object.freeze([
  "EXTERNAL_OR_INTERNAL_INPUT",
  "GATE_API_RDI_1",
  "CANONICAL_AUTHORITY_OR_DATA_REALITY",
  "NMI_UNIFIED_MANAGEMENT_MODEL",
  "NMI_MANAGEMENT_MAP",
] as const);
