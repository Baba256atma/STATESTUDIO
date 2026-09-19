/**
 * NPA-T DTH-EXP:4A — Director Nexo Selection tests.
 * Family selection only. No scene population, rendering, or DTH-EXP:4B.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
  type NexoraDirectorPlan,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { createInitialNexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { DTH_EXP_NEXO_RECIPE_FAMILIES } from "./dthExpSceneRecipeContract.ts";
import { DTH_EXP_VAI_ROLE_AUTHORITY } from "./dthExpTheatreContract.ts";
import {
  DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY,
  DTH_EXP_NEXO_FAMILY_BOUNDARY,
  defineNexoFlowRecipe,
  dthExpDirectorNexoSelectionIdentity,
  projectDthExpTheatreScene,
  resolveNexoFamilyRecipe,
  selectNexoraDirectorNexoFamily,
  verifyDthExpDirectorNexoSelectionBoundary,
  verifyDthExpNexoFamilyBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

function dirPlan(): NexoraDirectorPlan {
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

function select(
  need: DthExpDirectorManagementNeed,
  extras?: {
    readonly subject?: string | null;
    readonly current?: Parameters<typeof selectNexoraDirectorNexoFamily>[0]["currentNexoFamily"];
    readonly plan?: NexoraDirectorPlan | null;
  },
) {
  return selectNexoraDirectorNexoFamily({
    directorPlan: extras?.plan ?? dirPlan(),
    canonicalSubjectId: extras?.subject ?? "obj-product-line-a",
    managementNeed: need,
    currentNexoFamily: extras?.current ?? null,
  });
}

test("DTH-EXP:4A identity and boundary", () => {
  assert.equal(dthExpDirectorNexoSelectionIdentity, "NPA-T DTH-EXP:4A/DirectorNexoSelection");
  assert.equal(verifyDthExpDirectorNexoSelectionBoundary().ok, true);
  assert.equal(DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.startsDthExp4B, false);
  assert.equal(DTH_EXP_NEXO_FAMILY_BOUNDARY.startsDthExp4, false);
  assert.equal(DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("1 — Project/scenario portfolio comparison → NEXO_BUBBLE", () => {
  assert.equal(select("PORTFOLIO_COMPARISON").selectedFamily, "NEXO_BUBBLE");
  assert.equal(select("PORTFOLIO_COMPARISON").ranksCandidates, false);
});

test("2 — KPI/cost magnitude comparison → NEXO_BARS", () => {
  assert.equal(select("MAGNITUDE_COMPARISON").selectedFamily, "NEXO_BARS");
});

test("3 — Operational flow request → NEXO_FLOW", () => {
  assert.equal(select("OPERATIONAL_FLOW").selectedFamily, "NEXO_FLOW");
});

test("4 — Bottleneck-location request → NEXO_FLOW", () => {
  const result = select("BOTTLENECK_LOCATION");
  assert.equal(result.selectedFamily, "NEXO_FLOW");
  assert.equal(DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.bottleneckFamily, false);
});

test("5 — Variable/lever request → NEXO_IMPACT", () => {
  const result = select("VARIABLE_LEVER");
  assert.equal(result.selectedFamily, "NEXO_IMPACT");
  assert.equal(result.decidesVaiRoles, false);
});

test("6 — Risk-focused request → NEXO_RISK", () => {
  assert.equal(select("RISK_FOCUS").selectedFamily, "NEXO_RISK");
});

test("7 — Time/history/trend request → NEXO_TIME", () => {
  assert.equal(select("TEMPORAL_DEVELOPMENT").selectedFamily, "NEXO_TIME");
  assert.equal(DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.parallelTimelineFamily, false);
});

test("8 — Cause/why investigation → NEXO_CAUSE", () => {
  const result = select("CAUSE_INVESTIGATION");
  assert.equal(result.selectedFamily, "NEXO_CAUSE");
  assert.equal(result.createsCausalTruth, false);
});

test("9 — Execution/blocker request → NEXO_EXECUTION", () => {
  assert.equal(select("EXECUTION_STATUS").selectedFamily, "NEXO_EXECUTION");
  assert.equal(select("EXECUTION_STATUS").writesExecution, false);
});

test("10 — Outcome/Goal-vs-actual request → NEXO_OUTCOME", () => {
  const result = select("OUTCOME_ASSESSMENT");
  assert.equal(result.selectedFamily, "NEXO_OUTCOME");
  assert.equal(result.writesOutcome, false);
});

test("11 — No NexoBottleneck family is created", () => {
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_BOTTLENECK"), false);
  assert.equal(select("BOTTLENECK_LOCATION").selectedFamily, "NEXO_FLOW");
});

test("12 — No Timeline family is created", () => {
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("TIMELINE"), false);
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_TIMELINE"), false);
  assert.equal(select("TEMPORAL_DEVELOPMENT").selectedFamily, "NEXO_TIME");
});

test("13 — Selection uses existing Director/context rather than a parallel router", () => {
  const plan = dirPlan();
  assert.equal(plan.authority, nexoraSemanticPresentationDirectorIdentity);
  const fromNeed = selectNexoraDirectorNexoFamily({
    directorPlan: plan,
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: "CAUSE_INVESTIGATION",
  });
  const fromSceneIntent = selectNexoraDirectorNexoFamily({
    directorPlan: plan,
    canonicalSubjectId: "obj-product-line-a",
    sceneIntentKind: "INVESTIGATE_CONDITION",
  });
  const scenarioPlan = directNexoraPresentation({
    owner: "COLLECTION_QUERY",
    presentationRequest: "COLLECTION",
    primaryReference: null,
    references: Object.freeze([]),
    collectionKind: "scenario",
    collectionScope: "CONTEXTUAL",
    collectionMembers: Object.freeze([{ id: "obj-scenario-a", label: "Scenario A" }]),
    currentStage: createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
  });
  const fromDirectorCollection = selectNexoraDirectorNexoFamily({
    directorPlan: scenarioPlan,
    canonicalSubjectId: "obj-product-line-a",
  });
  assert.equal(scenarioPlan.intent, "SHOW_COLLECTION");
  assert.equal(fromNeed.sourceDirectorIdentity, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(fromSceneIntent.selectedFamily, "NEXO_CAUSE");
  assert.equal(fromSceneIntent.managementNeed, "CAUSE_INVESTIGATION");
  assert.equal(fromDirectorCollection.selectedFamily, "NEXO_BUBBLE");
  assert.equal(DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.keywordRouter, false);
  assert.equal(DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.parallelIntentRouter, false);
});

test("14 — Selection does not mutate canonical Objects", () => {
  const subject = Object.freeze({ id: "obj-product-line-a", label: "Product Line A" });
  const before = JSON.stringify(subject);
  select("CAUSE_INVESTIGATION", { subject: subject.id });
  assert.equal(JSON.stringify(subject), before);
  assert.equal(select("CAUSE_INVESTIGATION").writesCanonicalObjects, false);
});

test("15 — Selection does not populate scene actors", () => {
  const result = select("OPERATIONAL_FLOW");
  assert.equal(result.populatesScene, false);
  assert.deepEqual([...result.actors], []);
});

test("16 — Selection does not create Evidence", () => {
  const result = select("CAUSE_INVESTIGATION");
  assert.deepEqual([...result.evidenceRefs], []);
});

test("17 — Selection does not create causal truth", () => {
  assert.equal(select("CAUSE_INVESTIGATION").createsCausalTruth, false);
});

test("18 — Selection does not create Decision/Execution/Outcome truth", () => {
  const result = select("EXECUTION_STATUS");
  assert.equal(result.writesDecision, false);
  assert.equal(result.writesExecution, false);
  assert.equal(result.writesOutcome, false);
});

test("19 — Explicit new intent overrides stale Nexo perspective", () => {
  const execution = select("EXECUTION_STATUS", { current: "NEXO_BUBBLE" });
  assert.equal(execution.selectedFamily, "NEXO_EXECUTION");
  const impact = select("VARIABLE_LEVER", { current: "NEXO_TIME" });
  assert.equal(impact.selectedFamily, "NEXO_IMPACT");
  const cause = select("CAUSE_INVESTIGATION", { current: "NEXO_FLOW" });
  assert.equal(cause.selectedFamily, "NEXO_CAUSE");
});

test("20 — Supported continuation can preserve current Nexo perspective", () => {
  const result = select("CONTINUATION", { current: "NEXO_FLOW" });
  assert.equal(result.selectedFamily, "NEXO_FLOW");
  assert.equal(result.selectionState, "preserved");
});

test("21 — Ambiguous unsupported intent returns safe no-selection", () => {
  const result = select("UNSPECIFIED", { current: "NEXO_FLOW" });
  assert.equal(result.selectedFamily, null);
  assert.equal(result.selectionState, "unresolved");
  assert.equal(result.canonicalSubjectId, "obj-product-line-a");
  const nmiOnly = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    nmiContextHint: "Variables",
  });
  assert.equal(nmiOnly.selectedFamily, null);
});

test("22 — Active canonical subject identity survives family selection", () => {
  const result = select("CAUSE_INVESTIGATION", { subject: "obj-product-line-a" });
  assert.equal(result.canonicalSubjectId, "obj-product-line-a");
});

test("23 — VAI authority remains unchanged", () => {
  const result = select("VARIABLE_LEVER");
  assert.equal(result.decidesVaiRoles, false);
  assert.equal(result.selectedFamily, "NEXO_IMPACT");
  assert.deepEqual([...DTH_EXP_VAI_ROLE_AUTHORITY], [
    "LEVER",
    "OUTCOME",
    "PATH_OF_EFFECT",
    "MODERATOR",
    "CONTROL",
    "CONFOUNDER",
  ]);
});

test("24 — DIR:1 remains the single Director authority", () => {
  const result = select("OPERATIONAL_FLOW");
  assert.equal(result.sourceDirectorIdentity, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.parallelDirector, false);
  assert.equal(dirPlan().authority, nexoraSemanticPresentationDirectorIdentity);
});

test("25 — DTH-EXP:1–3B gates remain green", () => {
  assert.equal(verifyDthExpNexoFamilyBoundary().ok, true);
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
  const scene = projectDthExpTheatreScene({
    theatre,
    visualRolesByCanonicalObjectId: { "obj-revenue": "flow-node" },
  });
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "flow-node");
  const family = defineNexoFlowRecipe({
    recipeId: "nexo:flow:compat",
    upstream: [{ canonicalObjectId: "obj-supplier-a" }],
    focal: { canonicalObjectId: "obj-revenue" },
    downstream: [{ canonicalObjectId: "obj-market" }],
  });
  const resolved = resolveNexoFamilyRecipe({
    definition: family,
    context: {
      objects: Object.freeze([
        { id: "obj-supplier-a", label: "Supplier A" },
        { id: "obj-revenue", label: "Revenue" },
        { id: "obj-market", label: "Market" },
      ]),
    },
  });
  assert.equal(resolved.scene.identity, "NPA-T DTH-EXP:1/TheatreFoundation");
});

test("management journey: Product Line A perspective changes without subject loss", () => {
  const subject = "obj-product-line-a";
  const steps: readonly DthExpDirectorManagementNeed[] = [
    "OPERATIONAL_FLOW",
    "BOTTLENECK_LOCATION",
    "CAUSE_INVESTIGATION",
    "VARIABLE_LEVER",
    "RISK_FOCUS",
    "TEMPORAL_DEVELOPMENT",
  ];
  const expected = [
    "NEXO_FLOW",
    "NEXO_FLOW",
    "NEXO_CAUSE",
    "NEXO_IMPACT",
    "NEXO_RISK",
    "NEXO_TIME",
  ] as const;
  let current: (typeof expected)[number] | null = null;
  steps.forEach((need, index) => {
    const result = select(need, { subject, current });
    assert.equal(result.canonicalSubjectId, subject);
    assert.equal(result.selectedFamily, expected[index]);
    assert.deepEqual([...result.actors], []);
    current = result.selectedFamily;
  });
});
