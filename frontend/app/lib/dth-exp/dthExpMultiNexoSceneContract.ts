/**
 * NPA-T DTH-EXP:8B — composed Multi-Nexo Theatre projection.
 * Primary 5A skeleton + local supporting attachments. Not a Scene store or dashboard.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import type { DthExpNormalizedPoint, DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import type { DthExpEvidenceSceneProjection } from "./dthExpEvidenceSceneContract.ts";
import type {
  DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY,
  DthExpMultiNexoCompositionPlan,
  DthExpMultiNexoConflictCategory,
  DthExpMultiNexoDisclosureState,
  DthExpMultiNexoSupportReason,
} from "./dthExpMultiNexoCompositionContract.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import type {
  DTH_EXP_MULTI_NEXO_SCENE_ENGINE,
  dthExpMultiNexoSceneIdentity,
  dthExpMultiNexoSceneVersion,
} from "./dthExpMultiNexoSceneIdentity.ts";

export const DTH_EXP_MULTI_NEXO_COMPOSITION_LAYERS = Object.freeze([
  "primary-management-structure",
  "primary-focal-attention",
  "supporting-nexo-meaning",
  "evidence",
  "contextual-deferred-detail",
] as const);

export const DTH_EXP_MULTI_NEXO_CONFLICT_PRIORITY = Object.freeze([
  "canonical-truth-authority-safety",
  "canonical-subject-continuity",
  "primary-nexo-management-meaning",
  "causal-semantic-safety",
  "focal-actor-readability",
  "primary-relationships",
  "relevant-supporting-nexo-meaning",
  "evidence-relevance",
  "contextual-detail",
  "decorative-richness",
] as const);

export const DTH_EXP_MULTI_NEXO_SCENE_DENSITIES = Object.freeze(["sparse", "normal", "dense", "overloaded"] as const);
export type DthExpMultiNexoSceneDensity = (typeof DTH_EXP_MULTI_NEXO_SCENE_DENSITIES)[number];

export type DthExpMultiNexoAttachment = Readonly<{
  family: DthExpNexoRecipeFamily;
  attachedToCanonicalObjectId: string;
  attachmentTarget: "actor";
  primaryPosition: DthExpNormalizedPoint;
  localOffset: DthExpNormalizedPoint;
  annotationPosition: DthExpNormalizedPoint;
  disclosure: DthExpMultiNexoDisclosureState;
  reason: DthExpMultiNexoSupportReason | null;
  causalSeparationHint: boolean;
  rearrangesBaseScene: false;
}>;

export type DthExpMultiNexoComposedActor = Readonly<{
  canonicalObjectId: string;
  theatreActorCount: 1;
  primaryVisualRole: DthExpVisualRole | null;
  supportingAnnotations: readonly string[];
  primaryPosition: DthExpNormalizedPoint | null;
  isFocal: boolean;
}>;

export type DthExpMultiNexoComposedScene = Readonly<{
  identity: typeof dthExpMultiNexoSceneIdentity;
  version: typeof dthExpMultiNexoSceneVersion;
  engine: typeof DTH_EXP_MULTI_NEXO_SCENE_ENGINE;
  compositionId: string;
  eligibilityCompositionId: string;
  canonicalSubjectId: string;
  primaryFamily: DthExpNexoRecipeFamily;
  admittedSupports: readonly DthExpNexoRecipeFamily[];
  omittedSupports: readonly DthExpNexoRecipeFamily[];
  deferredSupports: readonly DthExpNexoRecipeFamily[];
  actors: readonly DthExpMultiNexoComposedActor[];
  attachments: readonly DthExpMultiNexoAttachment[];
  relationshipRefs: readonly string[];
  relationshipSemantics: readonly Readonly<{ relationshipId: string; semanticRelation: string | null }>[];
  evidenceRefs: readonly string[];
  evidenceCopiedPerFamily: false;
  evidenceCountCreatesConfidence: false;
  layers: typeof DTH_EXP_MULTI_NEXO_COMPOSITION_LAYERS;
  attentionHierarchy: typeof DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY;
  conflictPriority: typeof DTH_EXP_MULTI_NEXO_CONFLICT_PRIORITY;
  resolvedConflicts: readonly DthExpMultiNexoConflictCategory[];
  unresolvedConflicts: readonly DthExpMultiNexoConflictCategory[];
  density: DthExpMultiNexoSceneDensity;
  densityIsPresentationOnly: true;
  presentationPriorityIsBusinessRanking: false;
  primaryOwnsBaseSpatialGrammar: true;
  secondGlobalLayoutEngine: false;
  compositionCreatesCausality: false;
  fallbackToSinglePrimary: boolean;
  advisorConsumable: true;
  parsesRawText: false;
  choosesPrimaryFamily: false;
  transitionAuthority: "DTH-EXP:5B";
  secondAnimationEngine: false;
  reducedMotionComplete: true;
  liveStageWiring: false;
  multiNexoRendering: false;
  writesCanonicalObjects: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  assignsVaiRoles: false;
  calculatesRisk: false;
  ranksBubbleCandidates: false;
  parallelTimelineAuthority: false;
  declaresOutcomeSuccess: false;
}>;

export type DthExpMultiNexoSceneInput = Readonly<{
  eligibility: DthExpMultiNexoCompositionPlan;
  spatial: DthExpSpatialLayoutProjection;
  evidence?: DthExpEvidenceSceneProjection | null;
  scene?: DthExpTheatreScene | null;
  reducedMotion?: boolean;
}>;
