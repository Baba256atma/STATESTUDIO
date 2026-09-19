/**
 * NPA-T DTH-EXP:3A — Scene Recipe contract.
 * Instructions for composing existing Theatre Actors. Not a chart, Scene store, or business truth.
 */

import type { VaiContextualRole } from "@/app/lib/vai/vaiContract.ts";
import { dthExpSceneRecipeIdentity, dthExpSceneRecipeVersion } from "./dthExpSceneRecipeIdentity.ts";
import type { DthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import type { DthExpProjectionStatus, DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import type { DthExpCanonicalObjectRef } from "./dthExpObjectStageRoleContract.ts";

export const DTH_EXP_NEXO_RECIPE_FAMILIES = Object.freeze([
  "NEXO_BUBBLE",
  "NEXO_BARS",
  "NEXO_FLOW",
  "NEXO_IMPACT",
  "NEXO_RISK",
  "NEXO_TIME",
  "NEXO_CAUSE",
  "NEXO_EXECUTION",
  "NEXO_OUTCOME",
] as const);

export type DthExpNexoRecipeFamily = (typeof DTH_EXP_NEXO_RECIPE_FAMILIES)[number];

export const DTH_EXP_NEXO_RECIPE_IMPLEMENTATION = Object.freeze(
  Object.fromEntries(DTH_EXP_NEXO_RECIPE_FAMILIES.map((family) => [family, false as const])) as Record<
    DthExpNexoRecipeFamily,
    false
  >,
);

export const DTH_EXP_RECIPE_FAMILIES = Object.freeze(["GENERIC", ...DTH_EXP_NEXO_RECIPE_FAMILIES] as const);
export type DthExpRecipeFamily = (typeof DTH_EXP_RECIPE_FAMILIES)[number];

export const DTH_EXP_RECIPE_PARTICIPATIONS = Object.freeze([
  "focal",
  "primary",
  "supporting",
  "contextual",
  "optional",
] as const);
export type DthExpRecipeParticipation = (typeof DTH_EXP_RECIPE_PARTICIPATIONS)[number];

export const DTH_EXP_RECIPE_GROUPINGS = Object.freeze([
  "upstream",
  "focal",
  "downstream",
  "candidates",
  "causes",
  "impacts",
  "risks",
  "historical",
  "current",
  "future",
  "planned",
  "active",
  "blocked",
  "completed",
] as const);
export type DthExpRecipeGrouping = (typeof DTH_EXP_RECIPE_GROUPINGS)[number];

export const DTH_EXP_RECIPE_ANALYTICAL_DIMENSIONS = Object.freeze([
  "kpi-value",
  "value",
  "cost",
  "risk",
  "time",
  "effort",
  "strategic-relevance",
  "vai-role",
  "evidence-strength",
  "execution-progress",
  "outcome-vs-goal",
] as const);
export type DthExpRecipeAnalyticalDimension = (typeof DTH_EXP_RECIPE_ANALYTICAL_DIMENSIONS)[number];

export type DthExpRecipeActorRequirement = Readonly<{
  slotId: string;
  participation: DthExpRecipeParticipation;
  canonicalObjectId: string;
  visualRole: DthExpVisualRole | null;
  attention: DthExpSceneAttention | null;
  grouping: string | null;
  required: boolean;
  evidenceRefs: readonly string[];
  vaiRoleRef: VaiContextualRole | null;
}>;

export type DthExpRecipeRelationshipRequirement = Readonly<{
  requirementId: string;
  relationshipId: string | null;
  fromCanonicalObjectId: string;
  toCanonicalObjectId: string;
  required: boolean;
  evidenceRefs: readonly string[];
}>;

export type DthExpRecipeEvidenceRequirement = Readonly<{
  requirementId: string;
  evidenceRef: string;
  attachedToKind: "object" | "relationship" | "scene";
  attachedToId: string;
  required: boolean;
}>;

export type DthExpRecipeAnalyticalBinding = Readonly<{
  bindingId: string;
  canonicalObjectId: string;
  dimension: DthExpRecipeAnalyticalDimension;
  authority: string;
  valueRef: string | null;
  required: boolean;
  calculatesTruth: false;
  redefinesVaiRole: false;
}>;

export type DthExpRecipeFallback = Readonly<{
  onMissingRequiredActor: "fail";
  onMissingOptionalActor: "omit";
  onMissingRequiredRelationship: "fail";
  onMissingOptionalRelationship: "omit";
  onMissingRequiredEvidence: "fail";
  onMissingOptionalEvidence: "omit";
  onMissingRequiredBinding: "fail";
  onMissingOptionalBinding: "omit";
  inventsActors: false;
  inventsRelationships: false;
}>;

export const DTH_EXP_DEFAULT_RECIPE_FALLBACK: DthExpRecipeFallback = Object.freeze({
  onMissingRequiredActor: "fail",
  onMissingOptionalActor: "omit",
  onMissingRequiredRelationship: "fail",
  onMissingOptionalRelationship: "omit",
  onMissingRequiredEvidence: "fail",
  onMissingOptionalEvidence: "omit",
  onMissingRequiredBinding: "fail",
  onMissingOptionalBinding: "omit",
  inventsActors: false,
  inventsRelationships: false,
});

export type DthExpSceneRecipe = Readonly<{
  identity: typeof dthExpSceneRecipeIdentity;
  version: typeof dthExpSceneRecipeVersion;
  recipeId: string;
  family: DthExpRecipeFamily;
  nexoFamilyRecipeImplemented: false;
  managementIntent: string;
  actorRequirements: readonly DthExpRecipeActorRequirement[];
  relationshipRequirements: readonly DthExpRecipeRelationshipRequirement[];
  evidenceRequirements: readonly DthExpRecipeEvidenceRequirement[];
  analyticalBindings: readonly DthExpRecipeAnalyticalBinding[];
  fallback: DthExpRecipeFallback;
  compositionMetadata: Readonly<{
    composer: "DTH-EXP:3A/SceneRecipeResolver";
    automaticDirectorSelection: false;
    animationImplemented: false;
    layoutImplemented: false;
  }>;
  isTheatreScene: false;
  copiesManagementTruth: false;
  writesCanonicalObjectVisualRole: false;
}>;

export type DthExpRecipeRelationshipContext = Readonly<{
  relationshipId: string;
  fromId: string;
  toId: string;
  semanticRelation: string | null;
  sourceAuthority: string;
  sourceRef: string;
}>;

export type DthExpSceneRecipeContext = Readonly<{
  objects: readonly DthExpCanonicalObjectRef[];
  relationships?: readonly DthExpRecipeRelationshipContext[];
  availableEvidenceRefs?: readonly string[];
  availableBindingRefs?: readonly string[];
  theatreSceneIdentity?: string | null;
}>;

export type DthExpResolvedAnalyticalBinding = Readonly<{
  bindingId: string;
  canonicalObjectId: string;
  dimension: DthExpRecipeAnalyticalDimension;
  authority: string;
  valueRef: string | null;
  calculatedByRecipe: false;
  copiedIntoRecipe: false;
}>;

export type DthExpSceneRecipeResolution = Readonly<{
  identity: typeof dthExpSceneRecipeIdentity;
  recipeId: string;
  recipeFamily: DthExpRecipeFamily | null;
  recipeIsResolvedScene: false;
  scene: DthExpTheatreScene;
  analyticalBindings: readonly DthExpResolvedAnalyticalBinding[];
  projectionStatus: DthExpProjectionStatus;
  limitations: readonly string[];
  actorResolver: "DTH-EXP:2/ObjectStageRoles";
  automaticDirectorSelection: false;
  nexoFamilyRecipesImplemented: false;
  nexoTimeParallelTimeline: false;
}>;
