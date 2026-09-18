/**
 * NPA-T NMI:3 — Management Relationship Intelligence contract.
 * Interprets existing NMI:1 relationships. Does not own BCA:3, VAI, CC:8, or causal truth.
 */

import type { NmiCanonicalRef, NmiNodeKind } from "./nmiContract.ts";
import type { NmiManagementRelation, NmiRelationEpistemicStatus } from "./nmiRelationshipContract.ts";
import { nmiRelationshipIntelligenceIdentity } from "./nmiRelationshipIntelligenceIdentity.ts";

export const NMI_RELATIONSHIP_CLASSES = Object.freeze([
  "STRUCTURAL",
  "PERFORMANCE",
  "EVIDENCE",
  "ANALYTICAL",
  "RESPONSE",
  "COMMITMENT",
  "EXECUTION",
  "OBSERVATION",
  "LEARNING",
  "UNCLASSIFIED",
] as const);

export type NmiRelationshipClass = (typeof NMI_RELATIONSHIP_CLASSES)[number];

export const NMI_MANAGEMENT_CERTAINTY = Object.freeze([
  "CONFIRMED",
  "SUPPORTED",
  "LIKELY",
  "ASSUMED",
  "AMBIGUOUS",
  "UNKNOWN",
] as const);

export type NmiManagementCertainty = (typeof NMI_MANAGEMENT_CERTAINTY)[number];

export const NMI_CAUSAL_COMMUNICATION = Object.freeze([
  "STRUCTURAL_RELATIONSHIP",
  "ASSOCIATION",
  "ANALYTICAL_INFLUENCE",
  "SUPPORTED_CAUSAL_HYPOTHESIS",
  "CONFIRMED_CAUSAL_RELATIONSHIP",
  "NON_CAUSAL",
] as const);

export type NmiCausalCommunication = (typeof NMI_CAUSAL_COMMUNICATION)[number];

export const NMI_RELATIONSHIP_GAP_REASONS = Object.freeze([
  "MISSING_RELATIONSHIP",
  "MISSING_EVIDENCE",
  "AMBIGUOUS_TARGET",
  "UNKNOWN_CONTEXT",
  "UNSUPPORTED_CAUSAL_LINK",
  "CANONICAL_REFERENCE_MISSING",
] as const);

export type NmiRelationshipGapReason = (typeof NMI_RELATIONSHIP_GAP_REASONS)[number];

export const NMI_MANAGEMENT_QUESTION_KINDS = Object.freeze([
  "GOAL_THREATENED_BY_PROBLEM",
  "KPI_MEASURING_GOAL",
  "DATA_SUPPORTING_KPI",
  "OPERATIONS_RELATED_TO_PROBLEM",
  "VARIABLES_ASSOCIATED_WITH_ISSUE",
  "SCENARIOS_ADDRESSING",
  "DECISION_SELECTING_SCENARIO",
  "EXECUTION_OF_DECISION",
  "OUTCOME_OF_EXECUTION",
  "DISCONNECTED_NODES",
] as const);

export type NmiManagementQuestionKind = (typeof NMI_MANAGEMENT_QUESTION_KINDS)[number];

export type NmiVaiCausalOverlay = {
  readonly relationshipId: string;
  readonly vaiLadder?: string;
  readonly vaiCausalStatus?: string;
  readonly vaiAssociationStatus?: string;
  readonly coreInt3CauseEstablished?: boolean;
  readonly conflictingEvidence?: boolean;
};

export type ManagementRelationshipIntelligence = {
  readonly identity: typeof nmiRelationshipIntelligenceIdentity;
  readonly relationshipId: string;
  readonly sourceRef: NmiCanonicalRef | null;
  readonly targetRef: NmiCanonicalRef | null;
  readonly sourceId: string;
  readonly targetId: string;
  readonly kind: NmiManagementRelation;
  readonly managementClass: NmiRelationshipClass;
  readonly managementMeaning: string;
  readonly evidenceRefs: readonly string[];
  readonly provenance: readonly string[];
  readonly epistemicStatus: NmiRelationEpistemicStatus;
  readonly causal: false;
  readonly causalCommunication: NmiCausalCommunication;
  readonly certainty: NmiManagementCertainty;
  readonly numericStrength: null;
  readonly unresolvedReason: NmiRelationshipGapReason | null;
  readonly directionPreserved: true;
  readonly reversesSemanticMeaning: false;
  readonly canonicalRelationshipAuthority: "NMI:1";
  readonly causalAuthority: "VAI:3 / CORE-INT:3";
};

export type NmiRelationshipChainHop = {
  readonly relationshipId: string;
  readonly traversal: "FORWARD" | "REVERSE";
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly semanticSourceId: string;
  readonly semanticTargetId: string;
  readonly interpretation: ManagementRelationshipIntelligence;
};

export type NmiRelationshipChain = {
  readonly originNodeId: string;
  readonly maxHops: number;
  readonly hops: readonly NmiRelationshipChainHop[];
  readonly inventedRelationships: false;
  readonly truncatedByDepth: boolean;
};

export type NmiRelationshipGap = {
  readonly gapId: string;
  readonly focalNodeId: string;
  readonly reason: NmiRelationshipGapReason;
  readonly detail: string;
  readonly inventedRelationship: false;
};

export type NmiRelationshipGapCheck = {
  readonly check:
    | "GOAL"
    | "KPI"
    | "DATA"
    | "CONFIRMED_DRIVER"
    | "SCENARIO"
    | "DECISION"
    | "EXECUTION"
    | "OUTCOME";
  readonly present: boolean;
  readonly reason: NmiRelationshipGapReason | null;
  readonly relatedIds: readonly string[];
};

export type ManagementRelationshipGapReport = {
  readonly identity: typeof nmiRelationshipIntelligenceIdentity;
  readonly focalNodeId: string;
  readonly checks: readonly NmiRelationshipGapCheck[];
  readonly gaps: readonly NmiRelationshipGap[];
  readonly disconnectedValidNodeIds: readonly string[];
  readonly fabricatesMissingEdges: false;
};

export type NmiManagementQuestionAnswer = {
  readonly question: NmiManagementQuestionKind;
  readonly focalNodeId: string | null;
  readonly relatedIds: readonly string[];
  readonly relationshipIds: readonly string[];
  readonly interpretations: readonly ManagementRelationshipIntelligence[];
  readonly inventsRelationships: false;
};

export const NMI_RELATIONSHIP_KIND_CLASS: Readonly<Record<NmiManagementRelation, NmiRelationshipClass>> = Object.freeze({
  belongs_to: "STRUCTURAL",
  depends_on: "STRUCTURAL",
  supports: "STRUCTURAL",
  measures: "PERFORMANCE",
  threatens: "PERFORMANCE",
  evidenced_by: "EVIDENCE",
  affects: "ANALYTICAL",
  addresses: "RESPONSE",
  evaluated_by: "RESPONSE",
  selected_as: "COMMITMENT",
  executed_by: "EXECUTION",
  observed_by: "OBSERVATION",
  reassesses: "LEARNING",
});

export const NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT = Object.freeze({
  identity: nmiRelationshipIntelligenceIdentity,
  sourceModelAuthority: "NPA-T NMI:1/ManagementIntelligenceFoundation",
  sourceMapAuthority: "NPA-T NMI:2/BusinessProjectManagementMap",
  relationshipVocabularyAuthority: "NMI:1",
  bcaRelationshipIntelligence: "BCA:3/BusinessProjectRelationshipIntelligence",
  duplicatesBca3: false as const,
  duplicatesVaiCausal: false as const,
  ownsCanonicalRelationships: false as const,
  manufacturesConfidenceScores: false as const,
  upgradesAssociationToCause: false as const,
  mutatesStage: false as const,
  mutatesQueue: false as const,
  mutatesObjects: false as const,
  writesDataReality: false as const,
  bypassesGate: false as const,
  readsSealedRmsGroundTruth: false as const,
  parallelAdvisor: false as const,
  decisionRoadmapImplemented: false as const,
  startsNmi4: false as const,
});

export const NMI_RELATIONSHIP_INTELLIGENCE_GATE_FLOW = Object.freeze([
  "EXTERNAL_OR_INTERNAL_INPUT",
  "GATE_API_RDI_1",
  "CANONICAL_AUTHORITY_OR_DATA_REALITY",
  "NMI_UNIFIED_MANAGEMENT_MODEL",
  "NMI_MANAGEMENT_MAP",
  "NMI_RELATIONSHIP_INTELLIGENCE",
] as const);

export type NmiNodeKindLookup = Readonly<Record<string, NmiNodeKind>>;
