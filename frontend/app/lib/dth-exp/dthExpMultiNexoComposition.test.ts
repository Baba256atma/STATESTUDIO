/**
 * NPA-T DTH-EXP:8A — Multi-Nexo Composition Foundation tests.
 * Eligibility contract only. No merged layout, rendering, or DTH-EXP:8B.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY,
  DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY,
  DTH_EXP_NEXO_RECIPE_FAMILIES,
  DTH_EXP_PRIMARY_VISUAL_ROLE,
  dthExpDirectorNexoSelectionIdentity,
  dthExpMultiNexoCompositionIdentity,
  planDthExpMultiNexoComposition,
  projectDthExpTheatreScene,
  selectNexoraDirectorNexoFamily,
  verifyDthExpMultiNexoCompositionBoundary,
  verifyDthExpTheatreSceneResponseBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpMultiNexoAvailableSupport, DthExpMultiNexoCompositionInput } from "./dthExpMultiNexoCompositionContract.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";

function dirPlan() {
  return directNexoraPresentation({
    owner: "WORKSPACE_STATE",
    presentationRequest: "NONE",
    primaryReference: null,
    references: Object.freeze([]),
    collectionKind: null,
    collectionScope: null,
    collectionMembers: Object.freeze([]),
    currentStage: createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
  });
}

function support(family: DthExpNexoRecipeFamily, attached: readonly string[], extras: Partial<DthExpMultiNexoAvailableSupport> = {}): DthExpMultiNexoAvailableSupport {
  return Object.freeze({
    family,
    contextAvailable: true,
    attachedCanonicalObjectIds: attached,
    stale: false,
    ...extras,
  });
}

function input(partial: Partial<DthExpMultiNexoCompositionInput> = {}): DthExpMultiNexoCompositionInput {
  return Object.freeze({
    canonicalSubjectId: "obj-product-line-a",
    primaryFamily: "NEXO_FLOW",
    primarySelectionAuthority: "DTH-EXP:4A",
    managementNeed: "OPERATIONAL_FLOW",
    primaryReason: "director-management-need:OPERATIONAL_FLOW",
    primaryActorIds: Object.freeze(["obj-supplier-a", "obj-production", "obj-inventory", "obj-product-line-a", "obj-market"]),
    relationshipRefs: Object.freeze([
      Object.freeze({ relationshipId: "rel-production-inventory", semanticRelation: "feeds" }),
      Object.freeze({ relationshipId: "rel-staffing-production", semanticRelation: "associated" }),
    ]),
    evidenceRefs: Object.freeze(["cc8:ev-capacity-17"]),
    availableSupports: Object.freeze([
      support("NEXO_RISK", ["obj-production", "obj-product-line-a"]),
      support("NEXO_IMPACT", ["obj-production"]),
      support("NEXO_TIME", ["obj-product-line-a"]),
      support("NEXO_BUBBLE", ["obj-project-gamma"]),
    ]),
    ...partial,
  });
}

function plan(partial: Partial<DthExpMultiNexoCompositionInput> = {}) {
  return planDthExpMultiNexoComposition(input(partial));
}

function entry(result: ReturnType<typeof plan>, family: DthExpNexoRecipeFamily) {
  return result.supports.find((item) => item.family === family);
}

test("DTH-EXP:8A identity and boundary", () => {
  assert.equal(dthExpMultiNexoCompositionIdentity, "NPA-T DTH-EXP:8A/MultiNexoCompositionFoundation");
  assert.equal(verifyDthExpMultiNexoCompositionBoundary().ok, true);
  assert.equal(DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.startsDthExp8B, false);
});

test("1 — Multi-Nexo contract is read-only", () => {
  assert.equal(Object.isFrozen(plan()), true);
});

test("2 — It is not a second Theatre Scene store", () => {
  const result = plan();
  assert.equal(result.identity, dthExpMultiNexoCompositionIdentity);
  assert.equal("scene" in result, false);
});

test("3 — Exactly one primary Nexo exists", () => {
  assert.equal(plan().primaryCount, 1);
  assert.equal(plan().primaryFamily, "NEXO_FLOW");
});

test("4 — DIR:1/4A remains primary selector", () => {
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: "OPERATIONAL_FLOW",
  });
  const result = plan({ primaryFamily: selection.selectedFamily ?? "NEXO_FLOW" });
  assert.equal(selection.identity, dthExpDirectorNexoSelectionIdentity);
  assert.equal(selection.sourceDirectorIdentity, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(result.primaryFamily, selection.selectedFamily);
  assert.equal(DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.primarySelector, dthExpDirectorNexoSelectionIdentity);
});

test("5 — Supporting Nexo does not become primary authority", () => {
  assert.ok(plan().supports.every((item) => item.primaryAuthority === false));
});

test("6 — Supporting Nexo requires existing canonical context", () => {
  const result = plan({
    availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"], { contextAvailable: false })]),
  });
  assert.equal(entry(result, "NEXO_RISK")?.eligible, false);
  assert.equal(entry(result, "NEXO_RISK")?.compatibility, "insufficient-context");
});

test("7 — No automatic all-nine-family composition", () => {
  const result = plan({
    availableSupports: Object.freeze(DTH_EXP_NEXO_RECIPE_FAMILIES.map((family) => support(family, ["obj-product-line-a"]))),
  });
  assert.ok(result.supportingFamilies.length < 9);
  assert.equal(result.supportingFamilies.includes("NEXO_BUBBLE"), false);
});

test("8 — Same canonical actor can hold primary + supporting roles", () => {
  const actor = plan().actors.find((item) => item.canonicalObjectId === "obj-production");
  assert.equal(actor?.primaryVisualRole, "flow-node");
  assert.ok(actor?.supportingVisualRoles.includes("risk-context"));
  assert.ok(actor?.supportingVisualRoles.includes("impact-context"));
});

test("9 — Actor is not duplicated per family", () => {
  const matches = plan().actors.filter((item) => item.canonicalObjectId === "obj-production");
  assert.equal(matches.length, 1);
  assert.equal(matches[0]?.theatreActorCount, 1);
});

test("10 — Primary visual role remains distinct from supporting roles", () => {
  const actor = plan().actors.find((item) => item.canonicalObjectId === "obj-production");
  assert.equal(actor?.primaryVisualRole, DTH_EXP_PRIMARY_VISUAL_ROLE.NEXO_FLOW);
  assert.equal(actor?.supportingVisualRoles.includes("flow-node"), false);
});

test("11 — Primary family owns base spatial grammar", () => {
  assert.equal(plan().primaryOwnsBaseSpatialGrammar, true);
});

test("12 — Supporting family cannot independently rearrange base scene", () => {
  assert.ok(plan().supports.every((item) => item.rearrangesBaseScene === false));
});

test("13 — Shared relationship identity is preserved", () => {
  assert.ok(plan().relationshipRefs.includes("rel-production-inventory"));
});

test("14 — Relationship semantics are not upgraded", () => {
  assert.equal(input().relationshipRefs.find((item) => item.relationshipId === "rel-staffing-production")?.semanticRelation, "associated");
  assert.equal(plan().compositionCreatesCausality, false);
});

test("15 — Multi-Nexo composition does not create causality", () => {
  assert.equal(plan().compositionCreatesCausality, false);
});

test("16 — Evidence identity is shared across perspectives", () => {
  assert.deepEqual([...plan().evidenceRefs], ["cc8:ev-capacity-17"]);
});

test("17 — Evidence is not copied per Nexo", () => {
  assert.equal(plan().evidenceCopiedPerFamily, false);
});

test("18 — No NEXO_EVIDENCE is created", () => {
  assert.equal(plan().nexoEvidenceFamily, false);
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_EVIDENCE"), false);
});

test("19 — Compatibility states are deterministic", () => {
  assert.equal(entry(plan(), "NEXO_RISK")?.compatibility, entry(plan(), "NEXO_RISK")?.compatibility);
});

test("20 — Compatibility is semantic, not decorative", () => {
  assert.equal(plan().compatibilitySemanticNotDecorative, true);
});

test("21 — FLOW + relevant RISK can be eligible", () => {
  assert.equal(entry(plan(), "NEXO_RISK")?.eligible, true);
});

test("22 — FLOW + relevant IMPACT can be eligible", () => {
  assert.equal(entry(plan(), "NEXO_IMPACT")?.eligible, true);
});

test("23 — FLOW + relevant TIME can be eligible where temporal context exists", () => {
  assert.equal(entry(plan(), "NEXO_TIME")?.eligible, true);
});

test("24 — CAUSE + relevant IMPACT can be eligible without causal promotion", () => {
  const result = plan({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION" });
  assert.equal(entry(result, "NEXO_IMPACT")?.eligible, true);
  assert.equal(result.compositionCreatesCausality, false);
});

test("25 — EXECUTION + TIME can be eligible with valid context", () => {
  const result = plan({
    primaryFamily: "NEXO_EXECUTION",
    managementNeed: "EXECUTION_STATUS",
    availableSupports: Object.freeze([support("NEXO_TIME", ["obj-product-line-a"])]),
  });
  assert.equal(entry(result, "NEXO_TIME")?.eligible, true);
});

test("26 — OUTCOME + TIME can be eligible with valid context", () => {
  const result = plan({
    primaryFamily: "NEXO_OUTCOME",
    managementNeed: "OUTCOME_ASSESSMENT",
    availableSupports: Object.freeze([support("NEXO_TIME", ["obj-product-line-a"])]),
  });
  assert.equal(entry(result, "NEXO_TIME")?.eligible, true);
});

test("27 — BUBBLE + relevant RISK can be eligible where context supports it", () => {
  const result = plan({
    canonicalSubjectId: "obj-project-gamma",
    primaryFamily: "NEXO_BUBBLE",
    managementNeed: "PORTFOLIO_COMPARISON",
    primaryActorIds: Object.freeze(["obj-project-gamma"]),
    availableSupports: Object.freeze([support("NEXO_RISK", ["obj-project-gamma"])]),
  });
  assert.equal(entry(result, "NEXO_RISK")?.eligible, true);
});

test("28 — Unrelated Bubble context is incompatible with Flow", () => {
  const result = plan();
  assert.equal(entry(result, "NEXO_BUBBLE")?.eligible, false);
  assert.ok(entry(result, "NEXO_BUBBLE")?.conflict === "primary-grammar-conflict" || entry(result, "NEXO_BUBBLE")?.conflict === "unrelated-subject");
});

test("29 — Conditional compatibility requires shared relevant context", () => {
  const result = plan({
    availableSupports: Object.freeze([support("NEXO_IMPACT", ["obj-unrelated-lever"])]),
  });
  assert.equal(entry(result, "NEXO_IMPACT")?.eligible, false);
});

test("30 — Supporting family has management reason", () => {
  assert.equal(entry(plan(), "NEXO_RISK")?.reason, "supports-current-risk-context");
});

test("31 — Attention hierarchy preserves primary perspective", () => {
  assert.deepEqual([...plan().attentionHierarchy], [...DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY]);
  assert.equal(plan().attentionHierarchy[1], "primary-nexo-perspective");
  assert.equal(plan().attentionHierarchy[3], "supporting-nexo-meaning");
});

test("32 — Progressive-disclosure metadata is presentation-only", () => {
  assert.equal(entry(plan(), "NEXO_RISK")?.disclosure, "contextual");
  assert.equal(entry(plan(), "NEXO_BUBBLE")?.disclosure, "omitted");
});

test("33 — Conflict states are represented safely", () => {
  assert.equal(entry(plan(), "NEXO_BUBBLE")?.conflict != null, true);
});

test("34 — Authority conflict prevents unsupported supporting family", () => {
  const result = plan({
    availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"], { contextAvailable: false })]),
  });
  assert.equal(entry(result, "NEXO_RISK")?.conflict, "authority-conflict");
});

test("35 — Subject conflict prevents unrelated supporting family", () => {
  const result = plan({
    availableSupports: Object.freeze([support("NEXO_RISK", ["obj-project-gamma"])]),
  });
  assert.equal(entry(result, "NEXO_RISK")?.eligible, false);
  assert.equal(entry(result, "NEXO_RISK")?.conflict, "unrelated-subject");
});

test("36 — Stale supporting context is rejected", () => {
  const result = plan({
    availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"], { stale: true })]),
  });
  assert.equal(entry(result, "NEXO_RISK")?.conflict, "stale-context");
  assert.equal(entry(result, "NEXO_RISK")?.eligible, false);
});

test("37 — Primary perspective change requires support reevaluation", () => {
  const flow = plan();
  const cause = plan({
    primaryFamily: "NEXO_CAUSE",
    managementNeed: "CAUSE_INVESTIGATION",
    previousPrimaryFamily: "NEXO_FLOW",
    previousEligibleSupports: flow.supportingFamilies,
  });
  assert.equal(cause.primaryFamily, "NEXO_CAUSE");
  assert.equal(cause.supportsReevaluatedForPrimaryChange, true);
  assert.notEqual(cause.compositionId, flow.compositionId);
});

test("38 — Same-family refinement preserves only still-relevant support", () => {
  const result = plan({
    previousPrimaryFamily: "NEXO_FLOW",
    bottleneckCanonicalObjectId: "obj-production",
    availableSupports: Object.freeze([
      support("NEXO_RISK", ["obj-production"]),
      support("NEXO_TIME", ["obj-market"]),
    ]),
  });
  assert.equal(entry(result, "NEXO_RISK")?.eligible, true);
  assert.equal(entry(result, "NEXO_TIME")?.eligible, false);
});

test("39 — Advisor does not directly select supporting Nexo", () => {
  assert.equal(plan().advisorSelectsSupportingNexo, false);
});

test("40 — No second Director is created", () => {
  assert.equal(DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.parallelDirector, false);
  assert.equal(DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("41 — Supporting eligibility does not parse raw manager text", () => {
  assert.equal(plan().parsesRawText, false);
});

test("42 — Stage remains NEX-MVP:3/4", () => {
  assert.equal(DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("43 — No live /executive wiring", () => {
  assert.equal(plan().liveStageWiring, false);
});

test("44 — No multi-Nexo rendering yet", () => {
  assert.equal(plan().multiNexoRendering, false);
  assert.equal(plan().mergedLayoutImplemented, false);
});

test("45 — Reduced-motion retains full composition meaning", () => {
  const result = plan();
  assert.equal(result.reducedMotionComplete, true);
  assert.ok(result.primaryFamily);
  assert.ok(result.supports.length > 0);
});

test("46 — Same inputs produce same plan", () => {
  assert.deepEqual(plan(), plan());
});

test("47 — Unsafe Multi-Nexo falls back to certified single-primary scene", () => {
  const result = plan({
    availableSupports: Object.freeze([support("NEXO_BUBBLE", ["obj-project-gamma"])]),
    unsafeRequestedSupports: Object.freeze(["NEXO_BUBBLE"]),
  });
  assert.equal(result.fallbackToSinglePrimary, true);
  assert.deepEqual([...result.supportingFamilies], []);
});

test("48 — No canonical management writes occur", () => {
  const result = plan();
  assert.equal(result.writesCanonicalObjects, false);
  assert.equal(result.writesDecision, false);
  assert.equal(result.writesExecution, false);
  assert.equal(result.writesOutcome, false);
  assert.equal(result.assignsVaiRoles, false);
  assert.equal(result.calculatesRisk, false);
});

test("49 — DTH-EXP:1–7B gates remain green", () => {
  assert.equal(verifyDthExpTheatreSceneResponseBoundary().ok, true);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const scene = projectDthExpTheatreScene({
    theatre: projectNexoraDecisionTheatreFoundation({
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
    }),
    visualRolesByCanonicalObjectId: { "obj-revenue": "flow-node" },
  });
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "flow-node");
});

test("certification journey: one Theatre, one primary, bounded support", () => {
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: "OPERATIONAL_FLOW",
  });
  const flow = plan({ primaryFamily: selection.selectedFamily ?? "NEXO_FLOW" });
  assert.equal(flow.primaryCount, 1);
  assert.equal(flow.primaryOwnsBaseSpatialGrammar, true);
  assert.equal(entry(flow, "NEXO_RISK")?.eligible, true);
  assert.equal(entry(flow, "NEXO_RISK")?.primaryAuthority, false);
  assert.equal(flow.calculatesRisk, false);
  const production = flow.actors.find((item) => item.canonicalObjectId === "obj-production");
  assert.equal(production?.theatreActorCount, 1);
  assert.ok(production?.supportingVisualRoles.includes("impact-context"));
  assert.equal(flow.assignsVaiRoles, false);
  assert.deepEqual([...flow.evidenceRefs], ["cc8:ev-capacity-17"]);
  assert.equal(flow.evidenceCopiedPerFamily, false);
  assert.equal(entry(flow, "NEXO_BUBBLE")?.eligible, false);
  assert.equal(flow.compositionCreatesCausality, false);
  const cause = plan({
    primaryFamily: "NEXO_CAUSE",
    managementNeed: "CAUSE_INVESTIGATION",
    previousPrimaryFamily: "NEXO_FLOW",
    previousEligibleSupports: flow.supportingFamilies,
  });
  assert.equal(cause.primaryFamily, "NEXO_CAUSE");
  assert.equal(cause.supportsReevaluatedForPrimaryChange, true);
  const switched = plan({
    canonicalSubjectId: "obj-margin-pressure",
    primaryFamily: "NEXO_CAUSE",
    primaryActorIds: Object.freeze(["obj-margin-pressure"]),
    previousPrimaryFamily: "NEXO_FLOW",
    availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production", "obj-product-line-a"], { stale: true })]),
  });
  assert.equal(entry(switched, "NEXO_RISK")?.conflict, "stale-context");
  const unsafe = plan({ unsafeRequestedSupports: Object.freeze(["NEXO_IMPACT", "NEXO_RISK"]) });
  assert.equal(unsafe.fallbackToSinglePrimary, true);
  assert.equal(flow.reducedMotionComplete, true);
});
