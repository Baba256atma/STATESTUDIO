/**
 * NPA-T DTH-EXP:4B — Director scene context contract.
 * Composition context only. Not a Scene store and not copied business truth.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { VaiContextualRole } from "@/app/lib/vai/vaiContract.ts";
import type { DthExpCanonicalObjectRef, DthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import type { DthExpDirectorNexoSelection } from "./dthExpDirectorNexoSelectionContract.ts";
import {
  type DthExpNexoRecipeFamily,
  type DthExpRecipeAnalyticalDimension,
  type DthExpRecipeParticipation,
  type DthExpRecipeRelationshipContext,
  type DthExpSceneRecipeResolution,
} from "./dthExpSceneRecipeContract.ts";
import {
  dthExpDirectorSceneCompositionIdentity,
  dthExpDirectorSceneCompositionVersion,
} from "./dthExpDirectorSceneCompositionIdentity.ts";

export const DTH_EXP_DIRECTOR_SCENE_COMPOSITION_STATES = Object.freeze([
  "ok",
  "no-selection",
  "insufficient-context",
  "missing-required-actor",
  "missing-required-binding",
  "unsupported-relationship",
] as const);

export type DthExpDirectorSceneCompositionState = (typeof DTH_EXP_DIRECTOR_SCENE_COMPOSITION_STATES)[number];

export type DthExpDirectorSceneObjectHint = Readonly<{
  object: DthExpCanonicalObjectRef;
  familyRelevance?: readonly DthExpNexoRecipeFamily[] | "all";
  participationHint?: DthExpRecipeParticipation | null;
  groupingHint?: string | null;
  sceneRelevanceReason?: string | null;
  vaiRoleRef?: VaiContextualRole | null;
  timeBucket?: "historical" | "current" | "future" | null;
  bottleneck?: boolean;
  collectionMember?: boolean;
}>;

export type DthExpDirectorSceneEvidenceHint = Readonly<{
  evidenceRef: string;
  attachedToKind: "object" | "relationship" | "scene";
  attachedToId: string;
  familyRelevance?: readonly DthExpNexoRecipeFamily[] | "all";
  relevantToQuestion?: boolean;
}>;

export type DthExpDirectorSceneBindingHint = Readonly<{
  bindingId: string;
  canonicalObjectId: string;
  dimension: DthExpRecipeAnalyticalDimension;
  authority: string;
  valueRef: string | null;
  required?: boolean;
  familyRelevance?: readonly DthExpNexoRecipeFamily[] | "all";
}>;

export type DthExpDirectorSceneGraph = Readonly<{
  objects: readonly DthExpDirectorSceneObjectHint[];
  relationships: readonly DthExpRecipeRelationshipContext[];
  evidence: readonly DthExpDirectorSceneEvidenceHint[];
  bindings: readonly DthExpDirectorSceneBindingHint[];
  bottleneckCanonicalObjectId?: string | null;
  previousSceneActorIds?: readonly string[];
  collectionMemberIds?: readonly string[];
  requiredRelationshipIds?: readonly string[];
}>;

export type DthExpDirectorSceneActorSelection = Readonly<{
  canonicalObjectId: string;
  objectAuthority: string | null;
  participation: DthExpRecipeParticipation;
  grouping: string | null;
  attention: DthExpSceneAttention | null;
  sceneRelevanceReason: string | null;
  vaiRoleRef: VaiContextualRole | null;
  sourceAuthority: string;
}>;

export type DthExpDirectorSceneComposition = Readonly<{
  identity: typeof dthExpDirectorSceneCompositionIdentity;
  version: typeof dthExpDirectorSceneCompositionVersion;
  sourceDirectorIdentity: typeof nexoraSemanticPresentationDirectorIdentity;
  selectedFamily: DthExpNexoRecipeFamily | null;
  canonicalSubjectId: string | null;
  compositionState: DthExpDirectorSceneCompositionState;
  compositionReason: string;
  actors: readonly DthExpDirectorSceneActorSelection[];
  relationships: readonly DthExpRecipeRelationshipContext[];
  evidenceRefs: readonly string[];
  analyticalBindings: readonly DthExpDirectorSceneBindingHint[];
  omittedCanonicalObjectIds: readonly string[];
  recipeResolution: DthExpSceneRecipeResolution | null;
  actorResolver: "DTH-EXP:2/ObjectStageRoles";
  recipePipeline: "DTH-EXP:3B→DTH-EXP:3A";
  copiesManagementTruth: false;
  inventsActors: false;
  inventsRelationships: false;
  inventsEvidence: false;
  calculatesTruth: false;
  assignsVaiRoles: false;
  upgradesRelationshipSemantics: false;
  createsCausalTruth: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  writesCanonicalObjects: false;
  parallelTimelineAuthority: false;
  bottleneckFamily: false;
}>;

export type DthExpDirectorSceneCompositionInput = Readonly<{
  selection: DthExpDirectorNexoSelection;
  directorPlan?: NexoraDirectorPlan | null;
  graph: DthExpDirectorSceneGraph;
}>;
