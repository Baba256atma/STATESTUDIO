/**
 * NPA-T NMI:6 — read-oriented Stage projection contract.
 * Context bundle only. Director/Stage remain presentation authority.
 */

import type { NmiCanonicalRef, NmiContextKind, NmiNodeKind } from "./nmiContract.ts";
import type { NmiCausalCommunication, NmiRelationshipGap } from "./nmiRelationshipIntelligenceContract.ts";
import type { NmiComparisonRef } from "./nmiDecisionRoadmapContract.ts";
import { nmiStageProjectionIdentity } from "./nmiStageProjectionIdentity.ts";
import { DirectorFoundationId } from "@/app/lib/director/directorFoundation.ts";

export const NMI_STAGE_PROJECTION_SOURCES = Object.freeze([
  "MANAGEMENT_MAP",
  "ATTENTION",
  "DECISION_ROADMAP",
] as const);

export type NmiStageProjectionSource = (typeof NMI_STAGE_PROJECTION_SOURCES)[number];

export const NMI_STAGE_PROJECTION_RELEVANCE_TIERS = Object.freeze([
  "PRIMARY",
  "DIRECT",
  "ROADMAP",
  "SUPPORTING",
] as const);

export type NmiStageProjectionRelevanceTier = (typeof NMI_STAGE_PROJECTION_RELEVANCE_TIERS)[number];

export const NMI_STAGE_PROJECTION_BUDGET = Object.freeze({
  primary: 1,
  direct: 8,
  roadmap: 8,
  supporting: 6,
  maxNodes: 16,
});

export type NmiStageProjectionNodeRef = {
  readonly nodeId: string;
  readonly canonicalRef: NmiCanonicalRef;
  readonly kind: NmiNodeKind;
  readonly title: string | null;
  readonly relevance: NmiStageProjectionRelevanceTier;
};

export type NmiStageProjectionRelationshipRef = {
  readonly relationshipId: string;
  readonly fromId: string;
  readonly toId: string;
  readonly kind: string;
  readonly epistemicStatus: string;
  readonly causal: false;
  readonly causalCommunication: NmiCausalCommunication;
  readonly convertsAssociationToCause: false;
};

export type NmiStageProjection = {
  readonly identity: typeof nmiStageProjectionIdentity;
  readonly projectionId: string;
  readonly selectedCanonicalId: string;
  readonly projectionAnchorId: string;
  readonly selectedNodeKind: NmiNodeKind | null;
  readonly managementContext: NmiContextKind;
  readonly source: NmiStageProjectionSource;
  readonly mapNodeRefs: readonly NmiStageProjectionNodeRef[];
  readonly relationshipRefs: readonly NmiStageProjectionRelationshipRef[];
  readonly decisionRoadmapRef: string | null;
  readonly comparisonRefs: readonly NmiComparisonRef[];
  readonly evidenceRefs: readonly string[];
  readonly provenanceRefs: readonly string[];
  readonly unresolvedRelationshipIds: readonly string[];
  readonly relationshipGaps: readonly NmiRelationshipGap[];
  readonly omittedNodeIds: readonly string[];
  readonly omittedCount: number;
  readonly truncated: boolean;
  readonly suggestedManagementFocus: string;
  readonly contextCollectionIds: readonly string[];
  readonly collectionOwnsReferent: false;
  readonly comparisonOwnsAnchor: false;
  readonly projectionProvenance: readonly string[];
  readonly presentationAuthority: typeof DirectorFoundationId;
  readonly stageWriter: "selectNexoraMVPInteractionSubject";
  readonly nmiWroteStage: false;
  readonly nmiWroteCoordinates: false;
  readonly nmiOwnsLayout: false;
  readonly nmiOwnsSceneIntent: false;
  readonly secondDirector: false;
  readonly secondStage: false;
  readonly secondFocusRegistry: false;
  readonly mutatesUnifiedManagementModel: false;
  readonly writesDataReality: false;
  readonly bypassesGate: false;
  readonly readsSealedRmsGroundTruth: false;
  readonly replacesAdvisor: false;
  readonly startsNmi7: false;
  readonly startsDthExp: false;
};

export const NMI_STAGE_PROJECTION_CONTRACT = Object.freeze({
  identity: nmiStageProjectionIdentity,
  presentationAuthority: DirectorFoundationId,
  stageWriter: "selectNexoraMVPInteractionSubject" as const,
  nmiWroteStage: false as const,
  nmiWroteCoordinates: false as const,
  secondDirector: false as const,
  secondStage: false as const,
  secondFocusRegistry: false as const,
  mutatesUnifiedManagementModel: false as const,
  writesDataReality: false as const,
  bypassesGate: false as const,
  readsSealedRmsGroundTruth: false as const,
  replacesAdvisor: false as const,
  startsNmi7: false as const,
  startsDthExp: false as const,
  createsNmiStage: false as const,
  redesignsDecisionTheatre: false as const,
});

export const NMI_STAGE_PROJECTION_GATE_FLOW = Object.freeze([
  "EXTERNAL_OR_INTERNAL_INPUT",
  "GATE_API_RDI_1",
  "CANONICAL_AUTHORITY_OR_DATA_REALITY",
  "NMI_UNIFIED_MANAGEMENT_MODEL",
  "NMI_MANAGEMENT_MAP",
  "NMI_RELATIONSHIP_INTELLIGENCE",
  "NMI_DECISION_ROADMAP",
  "NMI_ATTENTION_OR_MAP_SELECTION",
  "NMI_STAGE_PROJECTION_CONTEXT",
  "EXISTING_DIRECTOR_STAGE_WRITER",
] as const);
