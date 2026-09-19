/**
 * NPA-T DTH-EXP:3A — Scene Recipe + canonical context → Theatre Scene.
 * Uses DTH-EXP:2 actor resolution. Does not invent Objects, relationships, or Evidence.
 */

import type { NexoraDecisionTheatreSceneActorRole } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneActorRoles.ts";
import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { VAI_CONTEXTUAL_ROLES } from "@/app/lib/vai/vaiContract.ts";
import { dthExpFoundationIdentity, dthExpFoundationVersion } from "./dthExpIdentity.ts";
import { dthExpSceneRecipeIdentity } from "./dthExpSceneRecipeIdentity.ts";
import { resolveDthExpTheatreActor } from "./dthExpResolveTheatreActor.ts";
import { DTH_EXP_NEXO_TIME_BOUNDARY } from "./dthExpVisualRole.ts";
import { isDthExpVisualRole, type DthExpVisualRole } from "./dthExpVisualRole.ts";
import { isDthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import type { DthExpEvidenceAttachment, DthExpSceneRelationship, DthExpTheatreActor, DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import {
  DTH_EXP_NEXO_RECIPE_FAMILIES,
  DTH_EXP_RECIPE_ANALYTICAL_DIMENSIONS,
  DTH_EXP_RECIPE_FAMILIES,
  DTH_EXP_RECIPE_PARTICIPATIONS,
  type DthExpRecipeFamily,
  type DthExpRecipeParticipation,
  type DthExpResolvedAnalyticalBinding,
  type DthExpSceneRecipe,
  type DthExpSceneRecipeContext,
  type DthExpSceneRecipeResolution,
} from "./dthExpSceneRecipeContract.ts";

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function unique<T>(items: readonly T[]): readonly T[] {
  return Object.freeze(items.filter((item, index, all) => all.indexOf(item) === index));
}

function isFamily(value: string): value is DthExpRecipeFamily {
  return (DTH_EXP_RECIPE_FAMILIES as readonly string[]).includes(value);
}

function isParticipation(value: string): value is DthExpRecipeParticipation {
  return (DTH_EXP_RECIPE_PARTICIPATIONS as readonly string[]).includes(value);
}

function participationToSceneRole(participation: DthExpRecipeParticipation): NexoraDecisionTheatreSceneActorRole {
  if (participation === "focal") return "ANCHOR";
  if (participation === "primary") return "PRIMARY_ACTOR";
  if (participation === "supporting") return "SUPPORTING_ACTOR";
  return "CONTEXT_ACTOR";
}

function emptyScene(limitations: readonly string[], recipeId: string | null): DthExpTheatreScene {
  return freezeTree({
    identity: dthExpFoundationIdentity,
    version: dthExpFoundationVersion,
    sceneId: `dth-exp:3a:failed:${recipeId ?? "none"}`,
    sceneIntentKind: null,
    sceneIntentRef: null,
    sceneScriptRef: null,
    dthTheatreSceneIdentity: null,
    recipeRef: recipeId,
    focalCanonicalObjectIds: Object.freeze([]),
    participatingCanonicalObjectIds: Object.freeze([]),
    actors: Object.freeze([]),
    relationships: Object.freeze([]),
    visualRoles: Object.freeze([]),
    evidenceAttachments: Object.freeze([]),
    directorComposition: Object.freeze({
      authority: nexoraSemanticPresentationDirectorIdentity,
      intent: null,
      stageEffect: null,
      mutationRequired: null,
      secondDirector: false as const,
      automaticNexoSelection: false as const,
    }),
    advisorContextRef: "DTH:1/advisorReadable",
    advisorOwnedByTheatreExpansion: false,
    stageHost: "NEX-MVP:3/Nexora3DExecutiveStage",
    stageInteractionAuthority: "NEX-MVP:4/NexoraObjectInteraction",
    secondStage: false,
    secondDirector: false,
    nexoTimeParallelTimeline: false,
    nexoFamiliesImplemented: false,
    projectionStatus: "failed",
    limitations: Object.freeze(limitations.slice()),
    safeFallback: "preserve-existing-stage-and-dth",
    writes: Object.freeze({
      canonicalObjects: false,
      evidence: false,
      dataReality: false,
      vaiRoles: false,
      decisionState: false,
      executionState: false,
      outcome: false,
      learning: false,
      stageSnapshots: false,
      directorPlans: false,
    }),
  });
}

function failedResolution(
  limitations: readonly string[],
  recipe: DthExpSceneRecipe | null,
): DthExpSceneRecipeResolution {
  return freezeTree({
    identity: dthExpSceneRecipeIdentity,
    recipeId: recipe?.recipeId ?? "",
    recipeFamily: recipe?.family ?? null,
    recipeIsResolvedScene: false,
    scene: emptyScene(limitations, recipe?.recipeId ?? null),
    analyticalBindings: Object.freeze([]),
    projectionStatus: "failed",
    limitations: Object.freeze(limitations.slice()),
    actorResolver: "DTH-EXP:2/ObjectStageRoles",
    automaticDirectorSelection: false,
    nexoFamilyRecipesImplemented: false,
    nexoTimeParallelTimeline: false,
  });
}

function validateRecipe(recipe: DthExpSceneRecipe | null | undefined): readonly string[] {
  if (recipe == null) return Object.freeze(["malformed-recipe:missing"]);
  const limitations: string[] = [];
  if (recipe.identity !== dthExpSceneRecipeIdentity) limitations.push("malformed-recipe:identity");
  if (!recipe.recipeId.trim()) limitations.push("malformed-recipe:recipeId");
  if (recipe.isTheatreScene !== false) limitations.push("malformed-recipe:isTheatreScene");
  if (recipe.copiesManagementTruth !== false) limitations.push("malformed-recipe:copiesManagementTruth");
  if (!isFamily(recipe.family)) limitations.push(`malformed-recipe:family:${String(recipe.family)}`);
  if (recipe.nexoFamilyRecipeImplemented !== false) limitations.push("malformed-recipe:nexo-implemented");
  if (recipe.actorRequirements.length === 0) limitations.push("malformed-recipe:no-actors");
  const ids = recipe.actorRequirements.map((item) => item.canonicalObjectId);
  if (ids.some((id, index) => ids.indexOf(id) !== index)) {
    limitations.push("malformed-recipe:duplicate-object");
  }
  for (const actor of recipe.actorRequirements) {
    if (!actor.slotId.trim() || !actor.canonicalObjectId.trim()) {
      limitations.push(`malformed-recipe:actor-slot:${actor.slotId || "empty"}`);
    }
    if (!isParticipation(actor.participation)) {
      limitations.push(`malformed-recipe:participation:${actor.slotId}`);
    }
    if (actor.visualRole != null && !isDthExpVisualRole(actor.visualRole)) {
      limitations.push(`malformed-recipe:visual-role:${actor.slotId}`);
    }
    if (actor.attention != null && !isDthExpSceneAttention(actor.attention)) {
      limitations.push(`malformed-recipe:attention:${actor.slotId}`);
    }
    if (actor.vaiRoleRef != null && !(VAI_CONTEXTUAL_ROLES as readonly string[]).includes(actor.vaiRoleRef)) {
      limitations.push(`malformed-recipe:vai-role:${actor.slotId}`);
    }
  }
  for (const binding of recipe.analyticalBindings) {
    if (!(DTH_EXP_RECIPE_ANALYTICAL_DIMENSIONS as readonly string[]).includes(binding.dimension)) {
      limitations.push(`malformed-recipe:binding-dimension:${binding.bindingId}`);
    }
    if (binding.calculatesTruth !== false) limitations.push(`malformed-recipe:binding-calculates:${binding.bindingId}`);
    if (binding.redefinesVaiRole !== false) limitations.push(`malformed-recipe:binding-redefines-vai:${binding.bindingId}`);
  }
  if ((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes(recipe.family) && recipe.nexoFamilyRecipeImplemented) {
    limitations.push("malformed-recipe:nexo-family-implemented");
  }
  return Object.freeze(limitations);
}

export function resolveDthExpSceneRecipe(input: {
  readonly recipe?: DthExpSceneRecipe | null;
  readonly context?: DthExpSceneRecipeContext | null;
}): DthExpSceneRecipeResolution {
  const recipe = input.recipe ?? null;
  const malformed = validateRecipe(recipe);
  if (recipe == null || malformed.length > 0) {
    return failedResolution(malformed.length > 0 ? malformed : ["malformed-recipe:missing"], recipe);
  }
  const context = input.context ?? { objects: Object.freeze([]) };
  const objectsById = new Map(context.objects.map((item) => [item.id, item]));
  const limitations: string[] = [];
  const actors: DthExpTheatreActor[] = [];
  const sceneIdentity = context.theatreSceneIdentity?.trim() || `dth-exp:3a:${recipe.recipeId}`;

  for (const requirement of recipe.actorRequirements) {
    const object = objectsById.get(requirement.canonicalObjectId) ?? null;
    if (object == null) {
      if (requirement.required) {
        return failedResolution(
          [`missing-required-actor:${requirement.canonicalObjectId}`, ...limitations],
          recipe,
        );
      }
      limitations.push(`omitted-optional-actor:${requirement.canonicalObjectId}`);
      continue;
    }
    const resolved = resolveDthExpTheatreActor({
      object,
      sceneIdentity,
      visualRole: requirement.visualRole,
      attention: requirement.attention ?? (requirement.participation === "focal" ? "focal" : "contextual"),
      grouping: requirement.grouping,
      vaiRole: requirement.vaiRoleRef,
      sceneActorRole: participationToSceneRole(requirement.participation),
      evidenceRefs: requirement.evidenceRefs,
    });
    limitations.push(...resolved.limitations);
    if (resolved.actor == null) {
      if (requirement.required) {
        return failedResolution(
          [`missing-required-actor:${requirement.canonicalObjectId}`, ...resolved.limitations, ...limitations],
          recipe,
        );
      }
      limitations.push(`omitted-optional-actor:${requirement.canonicalObjectId}`);
      continue;
    }
    actors.push(resolved.actor);
  }

  const actorIds = new Set(actors.map((item) => item.canonicalObjectId));
  const contextRelationships = context.relationships ?? [];
  const relationships: DthExpSceneRelationship[] = [];
  for (const requirement of recipe.relationshipRequirements) {
    const fromPresent = actorIds.has(requirement.fromCanonicalObjectId);
    const toPresent = actorIds.has(requirement.toCanonicalObjectId);
    const match = contextRelationships.find((item) => {
      if (requirement.relationshipId != null && requirement.relationshipId.length > 0) {
        return item.relationshipId === requirement.relationshipId;
      }
      return item.fromId === requirement.fromCanonicalObjectId && item.toId === requirement.toCanonicalObjectId;
    });
    if (!fromPresent || !toPresent || match == null) {
      if (requirement.required) {
        return failedResolution(
          [`unsupported-relationship:${requirement.requirementId}`, ...limitations],
          recipe,
        );
      }
      limitations.push(`omitted-optional-relationship:${requirement.requirementId}`);
      continue;
    }
    const from = actors.find((item) => item.canonicalObjectId === match.fromId);
    const to = actors.find((item) => item.canonicalObjectId === match.toId);
    if (from == null || to == null) {
      if (requirement.required) {
        return failedResolution([`unsupported-relationship:${requirement.requirementId}`, ...limitations], recipe);
      }
      limitations.push(`omitted-optional-relationship:${requirement.requirementId}`);
      continue;
    }
    relationships.push(
      Object.freeze({
        relationshipId: match.relationshipId,
        fromCanonicalObjectId: match.fromId,
        toCanonicalObjectId: match.toId,
        fromActorId: from.actorId,
        toActorId: to.actorId,
        semanticRelation: match.semanticRelation,
        sourceAuthority: match.sourceAuthority,
        sourceRef: match.sourceRef,
        impliesCausality: false as const,
        manufacturedCausalTruth: false as const,
        evidenceRefs: Object.freeze([...requirement.evidenceRefs]),
      }),
    );
  }

  const availableEvidence = new Set(context.availableEvidenceRefs ?? []);
  const evidenceAttachments: DthExpEvidenceAttachment[] = [];
  const addEvidence = (
    evidenceRef: string,
    attachedToKind: DthExpEvidenceAttachment["attachedToKind"],
    attachedToId: string,
    required: boolean,
    limitationKey: string,
  ) => {
    if (availableEvidence.size > 0 && !availableEvidence.has(evidenceRef)) {
      if (required) {
        return `missing-required-evidence:${limitationKey}`;
      }
      limitations.push(`omitted-optional-evidence:${limitationKey}`);
      return null;
    }
    evidenceAttachments.push(
      Object.freeze({
        evidenceRef,
        authority: "CC:8" as const,
        attachedToKind,
        attachedToId,
        copiesEvidence: false as const,
        copiesDataReality: false as const,
      }),
    );
    return null;
  };

  for (const actor of actors) {
    for (const evidenceRef of actor.evidenceRefs) {
      const requirement = recipe.evidenceRequirements.find(
        (item) => item.attachedToKind === "object" && item.attachedToId === actor.canonicalObjectId && item.evidenceRef === evidenceRef,
      );
      const failure = addEvidence(
        evidenceRef,
        "object",
        actor.canonicalObjectId,
        requirement?.required === true,
        evidenceRef,
      );
      if (failure) return failedResolution([failure, ...limitations], recipe);
    }
  }
  for (const relationship of relationships) {
    for (const evidenceRef of relationship.evidenceRefs) {
      const requirement = recipe.relationshipRequirements.find(
        (item) => item.relationshipId === relationship.relationshipId || item.requirementId === relationship.relationshipId,
      );
      const failure = addEvidence(
        evidenceRef,
        "relationship",
        relationship.relationshipId,
        requirement?.required === true,
        evidenceRef,
      );
      if (failure) return failedResolution([failure, ...limitations], recipe);
    }
  }
  for (const requirement of recipe.evidenceRequirements) {
    const failure = addEvidence(
      requirement.evidenceRef,
      requirement.attachedToKind,
      requirement.attachedToId,
      requirement.required,
      requirement.requirementId,
    );
    if (failure) return failedResolution([failure, ...limitations], recipe);
  }

  const uniqueEvidence = Object.freeze(
    evidenceAttachments.filter(
      (item, index, all) =>
        all.findIndex(
          (other) =>
            other.evidenceRef === item.evidenceRef &&
            other.attachedToKind === item.attachedToKind &&
            other.attachedToId === item.attachedToId,
        ) === index,
    ),
  );

  const availableBindings = new Set(context.availableBindingRefs ?? []);
  const analyticalBindings: DthExpResolvedAnalyticalBinding[] = [];
  for (const binding of recipe.analyticalBindings) {
    const missingValue = binding.valueRef == null || binding.valueRef.length === 0;
    const missingAvailability =
      availableBindings.size > 0 && binding.valueRef != null && !availableBindings.has(binding.valueRef);
    if (missingValue || missingAvailability) {
      if (binding.required) {
        return failedResolution([`unsupported-analytical-binding:${binding.bindingId}`, ...limitations], recipe);
      }
      limitations.push(`omitted-optional-binding:${binding.bindingId}`);
      continue;
    }
    analyticalBindings.push(
      Object.freeze({
        bindingId: binding.bindingId,
        canonicalObjectId: binding.canonicalObjectId,
        dimension: binding.dimension,
        authority: binding.authority,
        valueRef: binding.valueRef,
        calculatedByRecipe: false as const,
        copiedIntoRecipe: false as const,
      }),
    );
  }

  const focal = Object.freeze(
    recipe.actorRequirements
      .filter((item) => item.participation === "focal" && actorIds.has(item.canonicalObjectId))
      .map((item) => item.canonicalObjectId),
  );
  const visualRoles = unique(
    actors.map((item) => item.visualRole).filter((role): role is DthExpVisualRole => role != null),
  );
  const uniqueLimitations = unique(limitations);
  const projectionStatus = uniqueLimitations.length > 0 ? "partial" : "ok";
  const scene: DthExpTheatreScene = freezeTree({
    identity: dthExpFoundationIdentity,
    version: dthExpFoundationVersion,
    sceneId: `dth-exp:3a:${recipe.recipeId}:${projectionStatus}`,
    sceneIntentKind: null,
    sceneIntentRef: null,
    sceneScriptRef: null,
    dthTheatreSceneIdentity: context.theatreSceneIdentity ?? null,
    recipeRef: recipe.recipeId,
    focalCanonicalObjectIds: focal,
    participatingCanonicalObjectIds: Object.freeze(actors.map((item) => item.canonicalObjectId)),
    actors: Object.freeze(actors),
    relationships: Object.freeze(relationships),
    visualRoles,
    evidenceAttachments: uniqueEvidence,
    directorComposition: Object.freeze({
      authority: nexoraSemanticPresentationDirectorIdentity,
      intent: null,
      stageEffect: null,
      mutationRequired: null,
      secondDirector: false as const,
      automaticNexoSelection: false as const,
    }),
    advisorContextRef: "DTH:1/advisorReadable",
    advisorOwnedByTheatreExpansion: false,
    stageHost: "NEX-MVP:3/Nexora3DExecutiveStage",
    stageInteractionAuthority: "NEX-MVP:4/NexoraObjectInteraction",
    secondStage: false,
    secondDirector: false,
    nexoTimeParallelTimeline: DTH_EXP_NEXO_TIME_BOUNDARY.parallelTimelineTheatreSystem,
    nexoFamiliesImplemented: false,
    projectionStatus,
    limitations: uniqueLimitations,
    safeFallback: "preserve-existing-stage-and-dth",
    writes: Object.freeze({
      canonicalObjects: false,
      evidence: false,
      dataReality: false,
      vaiRoles: false,
      decisionState: false,
      executionState: false,
      outcome: false,
      learning: false,
      stageSnapshots: false,
      directorPlans: false,
    }),
  });

  return freezeTree({
    identity: dthExpSceneRecipeIdentity,
    recipeId: recipe.recipeId,
    recipeFamily: recipe.family,
    recipeIsResolvedScene: false,
    scene,
    analyticalBindings: Object.freeze(analyticalBindings),
    projectionStatus,
    limitations: uniqueLimitations,
    actorResolver: "DTH-EXP:2/ObjectStageRoles",
    automaticDirectorSelection: false,
    nexoFamilyRecipesImplemented: false,
    nexoTimeParallelTimeline: false,
  });
}
