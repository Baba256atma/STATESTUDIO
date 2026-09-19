/**
 * NPA-T DTH-EXP:5B — semantic scene-transition contract.
 * Describes how actors should change between two 5A projections. Not playback.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import type { DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import {
  DTH_EXP_SCENE_TRANSITION_ENGINE,
  dthExpSceneTransitionIdentity,
  dthExpSceneTransitionVersion,
} from "./dthExpSceneTransitionIdentity.ts";

export const DTH_EXP_MOTION_OPERATIONS = Object.freeze([
  "reposition",
  "promote",
  "de-emphasize",
  "enter",
  "exit",
  "expand",
  "regroup",
  "role-transform",
] as const);
export type DthExpMotionOperation = (typeof DTH_EXP_MOTION_OPERATIONS)[number];

export const DTH_EXP_ACTOR_TRANSITION_CLASSES = Object.freeze([
  "persistent",
  "entering",
  "exiting",
  "context-reduced",
  "context-promoted",
] as const);
export type DthExpActorTransitionClass = (typeof DTH_EXP_ACTOR_TRANSITION_CLASSES)[number];

export const DTH_EXP_TRANSITION_REASONS = Object.freeze([
  "perspective-change",
  "became-focal",
  "became-supporting-context",
  "newly-relevant",
  "no-longer-required",
  "relationship-focus",
  "evidence-reveal",
  "authoritative-magnitude-change",
  "time-progression",
  "execution-state-presentation",
  "outcome-comparison-presentation",
  "same-family-focus-change",
] as const);
export type DthExpTransitionReason = (typeof DTH_EXP_TRANSITION_REASONS)[number];

export const DTH_EXP_TIMING_CATEGORIES = Object.freeze(["immediate", "short", "standard", "deliberate"] as const);
export type DthExpTimingCategory = (typeof DTH_EXP_TIMING_CATEGORIES)[number];

export const DTH_EXP_TRANSITION_SEQUENCE = Object.freeze([
  Object.freeze({ step: 1, intent: "preserve-focal-persistent-identity", timing: "immediate" as const }),
  Object.freeze({ step: 2, intent: "de-emphasize-obsolete-context", timing: "short" as const }),
  Object.freeze({ step: 3, intent: "reposition-persistent-actors", timing: "standard" as const }),
  Object.freeze({ step: 4, intent: "promote-new-focal-supporting", timing: "standard" as const }),
  Object.freeze({ step: 5, intent: "introduce-newly-relevant-actors", timing: "standard" as const }),
  Object.freeze({ step: 6, intent: "reveal-relevant-relationships", timing: "short" as const }),
  Object.freeze({ step: 7, intent: "reveal-evidence-details", timing: "deliberate" as const }),
]);

export type DthExpActorTransition = Readonly<{
  canonicalObjectId: string;
  actorId: string;
  classification: DthExpActorTransitionClass;
  operations: readonly DthExpMotionOperation[];
  reasons: readonly DthExpTransitionReason[];
  fromLane: string | null;
  toLane: string | null;
  fromVisualRole: DthExpVisualRole | null;
  toVisualRole: DthExpVisualRole | null;
  createsBusinessObject: false;
  deletesBusinessObject: false;
  presentationOnly: true;
  boundedTreatment: boolean;
  skipDetailedMotion: boolean;
}>;

export type DthExpRelationshipTransition = Readonly<{
  relationshipId: string;
  classification: "persistent" | "entering" | "exiting";
  semanticRelation: string | null;
  sourceAuthority: string;
  impliesCausality: false;
  upgradesAssociationToCause: false;
}>;

export type DthExpEvidenceTransition = Readonly<{
  evidenceRef: string;
  authority: "CC:8";
  classification: "persistent" | "entering" | "exiting" | "revealed";
  attachedToId: string;
  increasesCertainty: false;
  copiesEvidence: false;
}>;

export type DthExpReducedMotionEquivalent = Readonly<{
  appliesTargetProjectionDirectly: true;
  movement: false;
  managementMeaningPreserved: true;
  becameFocal: string | null;
  becameSecondary: readonly string[];
  entered: readonly string[];
  leftVisiblePerspective: readonly string[];
  roleChanged: readonly string[];
  relationshipsBecameRelevant: readonly string[];
  evidenceBecameRelevant: readonly string[];
}>;

export type DthExpSceneTransitionPlan = Readonly<{
  identity: typeof dthExpSceneTransitionIdentity;
  version: typeof dthExpSceneTransitionVersion;
  engine: typeof DTH_EXP_SCENE_TRANSITION_ENGINE;
  planId: string;
  sourceFamily: DthExpNexoRecipeFamily;
  targetFamily: DthExpNexoRecipeFamily;
  sourceSceneRef: string;
  targetSceneRef: string;
  managementTransitionReason: DthExpTransitionReason;
  sequence: typeof DTH_EXP_TRANSITION_SEQUENCE;
  timingCategories: typeof DTH_EXP_TIMING_CATEGORIES;
  actors: readonly DthExpActorTransition[];
  relationships: readonly DthExpRelationshipTransition[];
  evidence: readonly DthExpEvidenceTransition[];
  reducedMotion: DthExpReducedMotionEquivalent;
  replacement: Readonly<{
    policy: "latest-valid-target-supersedes-incomplete-plan";
    supersedesPlanId: string | null;
    obsoletePlanMustNotOverride: readonly [
      "new-subject",
      "new-director-selection",
      "new-scene-composition",
      "new-canonical-truth",
    ];
  }>;
  animationPlayback: false;
  liveStageWiring: false;
  interpolatesPixels: false;
  mutatesTheatreScene: false;
  mutatesCanonicalObjects: false;
  proximityImpliesCausality: false;
  parallelTimelineAuthority: false;
  bottleneckFamily: false;
  writesExecution: false;
  writesOutcome: false;
  assignsVaiRoles: false;
}>;

export type DthExpSceneTransitionInput = Readonly<{
  source: DthExpSpatialLayoutProjection;
  target: DthExpSpatialLayoutProjection;
  sourceScene?: DthExpTheatreScene | null;
  targetScene?: DthExpTheatreScene | null;
  supersededPlanId?: string | null;
}>;
