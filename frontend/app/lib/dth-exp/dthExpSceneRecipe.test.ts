/**
 * NPA-T DTH-EXP:3A — Scene Recipe System tests.
 * Shared recipe engine only. Does not implement Nexo family recipes or Director selection.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { dthExpObjectStageRoleIdentity } from "./dthExpObjectStageRoleIdentity.ts";
import { DTH_EXP_NEXO_TIME_BOUNDARY } from "./dthExpVisualRole.ts";
import {
  DTH_EXP_DEFAULT_RECIPE_FALLBACK,
  DTH_EXP_NEXO_RECIPE_FAMILIES,
  DTH_EXP_NEXO_RECIPE_IMPLEMENTATION,
  DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY,
  DTH_EXP_SCENE_RECIPE_BOUNDARY,
  DTH_EXP_VAI_ROLE_AUTHORITY,
  dthExpFoundationIdentity,
  dthExpSceneRecipeIdentity,
  projectDthExpTheatreScene,
  resolveDthExpSceneRecipe,
  resolveDthExpTheatreActor,
  verifyDthExpObjectStageRoleBoundary,
  verifyDthExpSceneRecipeBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpSceneRecipe, DthExpSceneRecipeContext } from "./dthExpSceneRecipeContract.ts";
import { dthExpSceneRecipeVersion } from "./dthExpSceneRecipeIdentity.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

function actorReq(
  slotId: string,
  canonicalObjectId: string,
  extras?: Partial<DthExpSceneRecipe["actorRequirements"][number]>,
): DthExpSceneRecipe["actorRequirements"][number] {
  return Object.freeze({
    slotId,
    participation: extras?.participation ?? "primary",
    canonicalObjectId,
    visualRole: extras?.visualRole ?? null,
    attention: extras?.attention ?? null,
    grouping: extras?.grouping ?? null,
    required: extras?.required ?? true,
    evidenceRefs: extras?.evidenceRefs ?? Object.freeze([]),
    vaiRoleRef: extras?.vaiRoleRef ?? null,
  });
}

function recipe(overrides?: Partial<DthExpSceneRecipe>): DthExpSceneRecipe {
  return Object.freeze({
    identity: dthExpSceneRecipeIdentity,
    version: dthExpSceneRecipeVersion,
    recipeId: overrides?.recipeId ?? "recipe:demo",
    family: overrides?.family ?? "GENERIC",
    nexoFamilyRecipeImplemented: false,
    managementIntent: overrides?.managementIntent ?? "Inspect related objects",
    actorRequirements: overrides?.actorRequirements ??
      Object.freeze([
        actorReq("focal", "obj-revenue", { participation: "focal", visualRole: "flow-node", attention: "focal" }),
        actorReq("support", "obj-capacity", {
          participation: "supporting",
          visualRole: "flow-node",
          attention: "emphasized",
          grouping: "upstream",
        }),
      ]),
    relationshipRequirements: overrides?.relationshipRequirements ?? Object.freeze([]),
    evidenceRequirements: overrides?.evidenceRequirements ?? Object.freeze([]),
    analyticalBindings: overrides?.analyticalBindings ?? Object.freeze([]),
    fallback: overrides?.fallback ?? DTH_EXP_DEFAULT_RECIPE_FALLBACK,
    compositionMetadata: Object.freeze({
      composer: "DTH-EXP:3A/SceneRecipeResolver",
      automaticDirectorSelection: false,
      animationImplemented: false,
      layoutImplemented: false,
    }),
    isTheatreScene: false,
    copiesManagementTruth: false,
    writesCanonicalObjectVisualRole: false,
  });
}

const objects = Object.freeze([
  Object.freeze({ id: "obj-revenue", kind: "object", label: "Revenue", authority: "NEX-MVP:4/catalog" }),
  Object.freeze({ id: "obj-capacity", kind: "object", label: "Capacity", authority: "NEX-MVP:4/catalog" }),
  Object.freeze({ id: "obj-delivery", kind: "object", label: "Delivery", authority: "NEX-MVP:4/catalog" }),
]);

function context(overrides?: Partial<DthExpSceneRecipeContext>): DthExpSceneRecipeContext {
  return Object.freeze({
    objects: overrides?.objects ?? objects,
    relationships: overrides?.relationships ??
      Object.freeze([
        Object.freeze({
          relationshipId: "rel-capacity-revenue",
          fromId: "obj-capacity",
          toId: "obj-revenue",
          semanticRelation: "affects",
          sourceAuthority: "NMI:1/relationship",
          sourceRef: "nmi:src:cap-rev",
        }),
      ]),
    availableEvidenceRefs: overrides?.availableEvidenceRefs,
    availableBindingRefs: overrides?.availableBindingRefs,
    theatreSceneIdentity: overrides?.theatreSceneIdentity ?? "dth1:scene:demo",
  });
}

test("DTH-EXP:3A identity and boundary", () => {
  assert.equal(dthExpSceneRecipeIdentity, "NPA-T DTH-EXP:3A/SceneRecipeSystem");
  assert.equal(verifyDthExpSceneRecipeBoundary().ok, true);
  assert.equal(DTH_EXP_SCENE_RECIPE_BOUNDARY.startsDthExp3B, false);
  assert.equal(DTH_EXP_SCENE_RECIPE_BOUNDARY.recipeIsTheatreScene, false);
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.startsDthExp3, false);
});

test("1 — Valid recipe resolves into a Theatre Scene", () => {
  const resolved = resolveDthExpSceneRecipe({ recipe: recipe(), context: context() });
  assert.equal(resolved.projectionStatus, "ok");
  assert.equal(resolved.scene.identity, dthExpFoundationIdentity);
  assert.ok(resolved.scene.actors.length >= 2);
});

test("2 — Recipe and resolved Scene remain distinct", () => {
  const input = recipe();
  const resolved = resolveDthExpSceneRecipe({ recipe: input, context: context() });
  assert.equal(resolved.recipeIsResolvedScene, false);
  assert.equal(input.isTheatreScene, false);
  assert.notEqual(input.identity, resolved.scene.identity);
  assert.equal(resolved.scene.recipeRef, input.recipeId);
  assert.equal("actorRequirements" in resolved.scene, false);
});

test("3 — Actor resolution uses DTH-EXP:2", () => {
  const resolved = resolveDthExpSceneRecipe({ recipe: recipe(), context: context() });
  assert.equal(resolved.actorResolver, "DTH-EXP:2/ObjectStageRoles");
  const viaExp2 = resolveDthExpTheatreActor({
    object: objects[0],
    sceneIdentity: "dth1:scene:demo",
    visualRole: "flow-node",
  });
  assert.equal(viaExp2.identity, dthExpObjectStageRoleIdentity);
  const actor = resolved.scene.actors.find((item) => item.canonicalObjectId === "obj-revenue");
  assert.equal(actor?.isTheatreActorNotBusinessObject, true);
  assert.equal(actor?.actorId, "theatre-actor:obj-revenue");
});

test("4 — Canonical Object IDs survive recipe resolution", () => {
  const resolved = resolveDthExpSceneRecipe({ recipe: recipe(), context: context() });
  assert.deepEqual([...resolved.scene.participatingCanonicalObjectIds].sort(), ["obj-capacity", "obj-revenue"]);
});

test("5 — Recipe does not duplicate Objects", () => {
  const resolved = resolveDthExpSceneRecipe({ recipe: recipe(), context: context() });
  const ids = resolved.scene.actors.map((item) => item.canonicalObjectId);
  assert.equal(ids.length, new Set(ids).size);
  const duplicate = recipe({
    actorRequirements: Object.freeze([
      actorReq("a", "obj-revenue", { participation: "focal" }),
      actorReq("b", "obj-revenue", { participation: "supporting" }),
    ]),
  });
  const failed = resolveDthExpSceneRecipe({ recipe: duplicate, context: context() });
  assert.equal(failed.projectionStatus, "failed");
  assert.ok(failed.limitations.includes("malformed-recipe:duplicate-object"));
});

test("6 — Recipe visual roles remain temporary", () => {
  const object = { id: "obj-revenue", kind: "object", label: "Revenue" };
  const before = JSON.stringify(object);
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe(),
    context: context({ objects: Object.freeze([object, objects[1]]) }),
  });
  assert.equal(JSON.stringify(object), before);
  assert.equal("visualType" in object, false);
  assert.equal(resolved.scene.actors[0]?.visualRoleIsPermanent, false);
  assert.equal(recipe().writesCanonicalObjectVisualRole, false);
});

test("7 — Same Object can participate under different recipe roles", () => {
  const flow = resolveDthExpSceneRecipe({
    recipe: recipe({
      recipeId: "recipe:flow-view",
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-revenue", { participation: "focal", visualRole: "flow-node" }),
      ]),
    }),
    context: context(),
  });
  const cause = resolveDthExpSceneRecipe({
    recipe: recipe({
      recipeId: "recipe:cause-view",
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-revenue", { participation: "focal", visualRole: "cause-node" }),
      ]),
    }),
    context: context(),
  });
  assert.equal(flow.scene.actors[0]?.canonicalObjectId, cause.scene.actors[0]?.canonicalObjectId);
  assert.equal(flow.scene.actors[0]?.visualRole, "flow-node");
  assert.equal(cause.scene.actors[0]?.visualRole, "cause-node");
});

test("8 — Existing relationships can be projected", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      relationshipRequirements: Object.freeze([
        Object.freeze({
          requirementId: "rel-req-1",
          relationshipId: "rel-capacity-revenue",
          fromCanonicalObjectId: "obj-capacity",
          toCanonicalObjectId: "obj-revenue",
          required: true,
          evidenceRefs: Object.freeze([]),
        }),
      ]),
    }),
    context: context(),
  });
  assert.equal(resolved.projectionStatus, "ok");
  assert.equal(resolved.scene.relationships[0]?.sourceAuthority, "NMI:1/relationship");
  assert.equal(resolved.scene.relationships[0]?.sourceRef, "nmi:src:cap-rev");
  assert.equal(resolved.scene.relationships[0]?.impliesCausality, false);
});

test("9 — Unsupported relationships are not invented", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      relationshipRequirements: Object.freeze([
        Object.freeze({
          requirementId: "invented",
          relationshipId: "rel-missing",
          fromCanonicalObjectId: "obj-capacity",
          toCanonicalObjectId: "obj-revenue",
          required: false,
          evidenceRefs: Object.freeze([]),
        }),
      ]),
    }),
    context: context(),
  });
  assert.equal(resolved.scene.relationships.length, 0);
  assert.ok(resolved.limitations.includes("omitted-optional-relationship:invented"));
  const requiredMissing = resolveDthExpSceneRecipe({
    recipe: recipe({
      relationshipRequirements: Object.freeze([
        Object.freeze({
          requirementId: "invented-required",
          relationshipId: "rel-missing",
          fromCanonicalObjectId: "obj-capacity",
          toCanonicalObjectId: "obj-revenue",
          required: true,
          evidenceRefs: Object.freeze([]),
        }),
      ]),
    }),
    context: context(),
  });
  assert.equal(requiredMissing.projectionStatus, "failed");
  assert.equal(requiredMissing.scene.actors.length, 0);
});

test("10 — Evidence is referenced, not copied", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-revenue", {
          participation: "focal",
          visualRole: "bar",
          evidenceRefs: Object.freeze(["cc8:evidence:revenue"]),
        }),
      ]),
      evidenceRequirements: Object.freeze([
        Object.freeze({
          requirementId: "ev-1",
          evidenceRef: "cc8:evidence:revenue",
          attachedToKind: "object" as const,
          attachedToId: "obj-revenue",
          required: true,
        }),
      ]),
    }),
    context: context({ availableEvidenceRefs: Object.freeze(["cc8:evidence:revenue"]) }),
  });
  assert.equal(resolved.scene.evidenceAttachments[0]?.authority, "CC:8");
  assert.equal(resolved.scene.evidenceAttachments[0]?.copiesEvidence, false);
  assert.equal(resolved.scene.writes.evidence, false);
  assert.equal("evidencePayload" in resolved.scene, false);
});

test("11 — Missing optional Evidence degrades safely", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      evidenceRequirements: Object.freeze([
        Object.freeze({
          requirementId: "ev-optional",
          evidenceRef: "cc8:evidence:missing",
          attachedToKind: "scene" as const,
          attachedToId: "recipe:demo",
          required: false,
        }),
      ]),
    }),
    context: context({ availableEvidenceRefs: Object.freeze(["cc8:evidence:other"]) }),
  });
  assert.notEqual(resolved.projectionStatus, "failed");
  assert.ok(resolved.limitations.includes("omitted-optional-evidence:ev-optional"));
  assert.equal(resolved.scene.evidenceAttachments.some((item) => item.evidenceRef === "cc8:evidence:missing"), false);
});

test("12 — Missing required actor fails safely", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-missing", { participation: "focal", required: true }),
      ]),
    }),
    context: context(),
  });
  assert.equal(resolved.projectionStatus, "failed");
  assert.equal(resolved.scene.actors.length, 0);
  assert.ok(resolved.limitations.includes("missing-required-actor:obj-missing"));
});

test("13 — Attention rules remain presentation-only", () => {
  const object = { id: "obj-revenue", kind: "object", label: "Revenue", attention: "critical" };
  const before = JSON.stringify(object);
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-revenue", { participation: "focal", attention: "focal" }),
        actorReq("support", "obj-capacity", { participation: "supporting", attention: "de-emphasized", required: true }),
      ]),
    }),
    context: context({ objects: Object.freeze([object, objects[1]]) }),
  });
  assert.equal(JSON.stringify(object), before);
  assert.equal(resolved.scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.attention, "focal");
  assert.equal(resolved.scene.writes.canonicalObjects, false);
});

test("14 — Grouping remains presentation-only", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-revenue", { participation: "focal", grouping: "focal" }),
        actorReq("up", "obj-capacity", { participation: "supporting", grouping: "upstream" }),
      ]),
    }),
    context: context(),
  });
  assert.equal(resolved.scene.actors.find((item) => item.canonicalObjectId === "obj-capacity")?.presentation.grouping, "upstream");
  assert.equal(resolved.scene.writes.canonicalObjects, false);
});

test("15 — Analytical bindings do not create new truth", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      analyticalBindings: Object.freeze([
        Object.freeze({
          bindingId: "bind-kpi",
          canonicalObjectId: "obj-revenue",
          dimension: "kpi-value" as const,
          authority: "existing KPI observation owners",
          valueRef: "kpi:revenue:current",
          required: true,
          calculatesTruth: false as const,
          redefinesVaiRole: false as const,
        }),
      ]),
    }),
    context: context({ availableBindingRefs: Object.freeze(["kpi:revenue:current"]) }),
  });
  assert.equal(resolved.analyticalBindings[0]?.valueRef, "kpi:revenue:current");
  assert.equal(resolved.analyticalBindings[0]?.calculatedByRecipe, false);
  assert.equal(resolved.analyticalBindings[0]?.copiedIntoRecipe, false);
  assert.equal("kpiValue" in resolved.scene, false);
});

test("16 — VAI roles remain externally owned", () => {
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-capacity", {
          participation: "focal",
          visualRole: "impact-node",
          vaiRoleRef: "LEVER",
        }),
      ]),
    }),
    context: context(),
  });
  assert.equal(resolved.scene.actors[0]?.vaiRoleRef, "LEVER");
  assert.equal(resolved.scene.actors[0]?.visualRole, "impact-node");
  assert.equal(resolved.scene.actors[0]?.visualRoleMutatesVaiRole, false);
  assert.equal(DTH_EXP_VAI_ROLE_AUTHORITY[0], "LEVER");
  assert.equal(DTH_EXP_SCENE_RECIPE_BOUNDARY.parallelVaiRoleAuthority, false);
});

test("17 — Stage authority remains unchanged", () => {
  const resolved = resolveDthExpSceneRecipe({ recipe: recipe(), context: context() });
  assert.equal(resolved.scene.secondStage, false);
  assert.equal(resolved.scene.stageHost, "NEX-MVP:3/Nexora3DExecutiveStage");
  assert.equal(DTH_EXP_SCENE_RECIPE_BOUNDARY.parallelStage, false);
});

test("18 — Director authority remains unchanged", () => {
  const resolved = resolveDthExpSceneRecipe({ recipe: recipe(), context: context() });
  assert.equal(resolved.automaticDirectorSelection, false);
  assert.equal(resolved.scene.secondDirector, false);
  assert.equal(resolved.scene.directorComposition.authority, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(DTH_EXP_SCENE_RECIPE_BOUNDARY.director, "DIR:1");
});

test("19 — Reserved Nexo families exist as vocabulary only", () => {
  assert.deepEqual([...DTH_EXP_NEXO_RECIPE_FAMILIES], [
    "NEXO_BUBBLE",
    "NEXO_BARS",
    "NEXO_FLOW",
    "NEXO_IMPACT",
    "NEXO_RISK",
    "NEXO_TIME",
    "NEXO_CAUSE",
    "NEXO_EXECUTION",
    "NEXO_OUTCOME",
  ]);
  assert.ok(Object.values(DTH_EXP_NEXO_RECIPE_IMPLEMENTATION).every((implemented) => implemented === false));
  const reserved = resolveDthExpSceneRecipe({
    recipe: recipe({ family: "NEXO_FLOW" }),
    context: context(),
  });
  assert.equal(reserved.recipeFamily, "NEXO_FLOW");
  assert.equal(reserved.nexoFamilyRecipesImplemented, false);
  assert.equal(reserved.scene.nexoFamiliesImplemented, false);
});

test("20 — NexoTime does not create Timeline authority", () => {
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.parallelTimelineTheatreSystem, false);
  assert.equal(DTH_EXP_SCENE_RECIPE_BOUNDARY.parallelTimelineAuthority, false);
  const resolved = resolveDthExpSceneRecipe({
    recipe: recipe({
      family: "NEXO_TIME",
      actorRequirements: Object.freeze([
        actorReq("focal", "obj-revenue", { participation: "focal", visualRole: "time-point", grouping: "current" }),
      ]),
    }),
    context: context(),
  });
  assert.equal(resolved.nexoTimeParallelTimeline, false);
  assert.equal(resolved.scene.nexoTimeParallelTimeline, false);
});

test("21 — DTH-EXP:1–2 gates remain green", () => {
  assert.equal(verifyDthExpObjectStageRoleBoundary().ok, true);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: selectNexoraMVPInteractionSubject(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      "obj-revenue",
      catalog,
    ),
    catalog,
  });
  const before = JSON.parse(JSON.stringify(theatre));
  const scene = projectDthExpTheatreScene({
    theatre,
    visualRolesByCanonicalObjectId: { "obj-revenue": "bubble" },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(theatre)), before);
  assert.equal(scene.recipeRef, null);
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "bubble");
});
