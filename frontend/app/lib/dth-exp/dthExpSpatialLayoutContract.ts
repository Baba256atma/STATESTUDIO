/**
 * NPA-T DTH-EXP:5A — spatial grammar contract.
 * Normalized presentation semantics only. Not pixel UI and not business truth.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import { DTH_EXP_SPATIAL_LAYOUT_ENGINE, dthExpSpatialLayoutIdentity, dthExpSpatialLayoutVersion } from "./dthExpSpatialLayoutIdentity.ts";

export const DTH_EXP_NORMALIZED_STAGE_SPACE = Object.freeze({
  xMin: 0,
  xMax: 1,
  yMin: 0,
  yMax: 1,
  origin: "bottom-left" as const,
  unit: "normalized-scene-space" as const,
  pixelIndependent: true as const,
  focalZone: Object.freeze({ x: 0.5, y: 0.5, radius: 0.14 }),
});

export const DTH_EXP_SPATIAL_DENSITIES = Object.freeze(["sparse", "normal", "dense"] as const);
export type DthExpSpatialDensity = (typeof DTH_EXP_SPATIAL_DENSITIES)[number];

export const DTH_EXP_SPATIAL_DISCLOSURE_STATES = Object.freeze([
  "visible",
  "contextual",
  "de-emphasized",
  "collapsed",
  "hidden",
] as const);
export type DthExpSpatialDisclosureState = (typeof DTH_EXP_SPATIAL_DISCLOSURE_STATES)[number];

export const DTH_EXP_SPATIAL_DEPTHS = Object.freeze(["foreground", "middle", "background"] as const);
export type DthExpSpatialDepth = (typeof DTH_EXP_SPATIAL_DEPTHS)[number];

export const DTH_EXP_SIZE_REASONS = Object.freeze([
  "focal-attention",
  "authoritative-magnitude",
  "equal-comparison-slot",
  "supporting-context",
  "collapsed-distant-context",
] as const);
export type DthExpSpatialSizeReason = (typeof DTH_EXP_SIZE_REASONS)[number];

export const DTH_EXP_FUTURE_TRANSITION_SEMANTICS = Object.freeze({
  moveCloser: "stronger-current-relevance-or-relationship-presentation",
  grow: "focus-or-authoritative-magnitude",
  fade: "secondary-context",
  expand: "investigation-detail",
  rearrange: "management-perspective-changed",
});

export type DthExpNormalizedPoint = Readonly<{ x: number; y: number }>;

export type DthExpSpatialActorLayout = Readonly<{
  actorId: string;
  canonicalObjectId: string;
  engine: typeof DTH_EXP_SPATIAL_LAYOUT_ENGINE;
  lane: string;
  region: string;
  order: number;
  position: DthExpNormalizedPoint;
  size: Readonly<{ width: number; height: number }>;
  sizeReason: DthExpSpatialSizeReason;
  depth: DthExpSpatialDepth;
  emphasis: "none" | "low" | "medium" | "high";
  disclosure: DthExpSpatialDisclosureState;
  grouping: string | null;
  distanceFromFocal: number;
  proximityImpliesCausality: false;
  layoutReason: string;
  animationTarget: Readonly<{
    position: DthExpNormalizedPoint;
    size: Readonly<{ width: number; height: number }>;
    emphasis: "none" | "low" | "medium" | "high";
    disclosure: DthExpSpatialDisclosureState;
    grouping: string | null;
    interpolationImplemented: false;
    durationMs: null;
    easing: null;
  }>;
}>;

export type DthExpSpatialRelationshipPath = Readonly<{
  relationshipId: string;
  fromCanonicalObjectId: string;
  toCanonicalObjectId: string;
  fromPosition: DthExpNormalizedPoint;
  toPosition: DthExpNormalizedPoint;
  presentationKind: "directional" | "undirected" | "candidate" | "contextual";
  semanticRelation: string | null;
  sourceAuthority: string;
  sourceRef: string;
  impliesCausality: false;
  upgradesAssociationToCause: false;
}>;

export type DthExpSpatialEvidenceHint = Readonly<{
  evidenceRef: string;
  authority: "CC:8";
  attachedToKind: "object" | "relationship" | "scene";
  attachedToId: string;
  position: DthExpNormalizedPoint;
  placement: "attach-to-actor" | "attach-to-relationship" | "attach-to-focal-investigation" | "collapsed-cluster";
  copiesEvidence: false;
}>;

export type DthExpSpatialLayoutProjection = Readonly<{
  identity: typeof dthExpSpatialLayoutIdentity;
  version: typeof dthExpSpatialLayoutVersion;
  engine: typeof DTH_EXP_SPATIAL_LAYOUT_ENGINE;
  family: DthExpNexoRecipeFamily;
  coordinateSpace: typeof DTH_EXP_NORMALIZED_STAGE_SPACE;
  sceneRef: string;
  focalCanonicalObjectId: string | null;
  density: DthExpSpatialDensity;
  actors: readonly DthExpSpatialActorLayout[];
  relationshipPaths: readonly DthExpSpatialRelationshipPath[];
  evidenceHints: readonly DthExpSpatialEvidenceHint[];
  futureTransitionSemantics: typeof DTH_EXP_FUTURE_TRANSITION_SEMANTICS;
  animationEngine: false;
  interpolationImplemented: false;
  liveStageWiring: false;
  mutatesTheatreScene: false;
  mutatesCanonicalObjects: false;
  proximityImpliesCausality: false;
  parallelTimelineAuthority: false;
  bottleneckFamily: false;
  declaresOutcomeSuccess: false;
  layoutProvenance: "DTH-EXP:5A/SharedSpatialGrammar";
}>;

export type DthExpSpatialLayoutInput = Readonly<{
  scene: DthExpTheatreScene;
  family: DthExpNexoRecipeFamily;
  bottleneckFocusCanonicalObjectId?: string | null;
  magnitudeByCanonicalObjectId?: Readonly<Record<string, number>>;
  bubbleXByCanonicalObjectId?: Readonly<Record<string, number>>;
  bubbleYByCanonicalObjectId?: Readonly<Record<string, number>>;
}>;
