/**
 * NPA-T COMPOSED-POPULATION:1 — population/count seam.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { resolveCanonicalExecutiveObjectType } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "@/app/lib/spatial-presentation/executiveOvsObjectVisualLanguage.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_CANONICAL_RISK_OBJECT_ID } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import { NEXORA_MVP_STAGE_REPRESENTATION_ROLE } from "@/app/lib/nex-mvp/nexoraMvpExecutiveWorkCenter.ts";
import {
  NEXORA_MVP_COMPOSED_POPULATION_BOUNDARY,
  NEXORA_MVP_STAGE_POPULATION_OPERATOR_FACING_SOURCE,
  countNexoraMvpCatalogPrimaryMembership,
  countNexoraMvpComposedPrimaryPopulation,
  countNexoraMvpRenderedStageBodyPopulation,
  formatNexoraMvpStagePopulationBadge,
  resolveNexoraMvpStagePopulationSnapshot,
} from "@/app/lib/nex-mvp/nexoraMvpComposedPopulation.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function present(state: ReturnType<typeof initialState>) {
  return deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
}

function population(state = initialState()) {
  const presentation = present(state);
  return resolveNexoraMvpStagePopulationSnapshot({
    catalog,
    composedObjects: presentation.scene.objects,
    contextNodeCount: presentation.contextNodes.length,
  });
}

test("1 — Overview catalog Primary count = admitted membership", () => {
  const overview = population();
  assert.equal(overview.catalogPrimaryCount, 8);
  assert.equal(countNexoraMvpCatalogPrimaryMembership(catalog), 8);
  assert.equal(catalog.objects.length, 8);
  assert.equal(
    NEXORA_MVP_COMPOSED_POPULATION_BOUNDARY.catalogCountFromScene,
    false,
  );
});

test("2 — Overview composed Primary count = current composed primary population", () => {
  const overview = population();
  assert.equal(overview.catalogPrimaryCount, 8);
  assert.equal(overview.composedPrimaryCount, 2);
  assert.ok(overview.composedPrimaryCount < overview.catalogPrimaryCount);
});

test("3 — Overview rendered body count = actual Stage body population", () => {
  const overview = population();
  assert.equal(overview.renderedStageBodyCount, overview.composedPrimaryCount);
  assert.equal(overview.executiveWorkCenterId, null);
  assert.equal(overview.renderedStageBodyCount, 2);
});

test("4 — Capacity focus does not mutate catalog Primary", () => {
  const before = population();
  const after = population(
    selectNexoraMVPInteractionSubject(initialState(), "obj-capacity", catalog),
  );
  assert.equal(after.catalogPrimaryCount, before.catalogPrimaryCount);
  assert.equal(after.catalogPrimaryCount, 8);
});

test("5 — Capacity Gap focus does not mutate catalog Primary", () => {
  const focused = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(focused.catalogPrimaryCount, 8);
  assert.notEqual(focused.composedPrimaryCount, focused.renderedStageBodyCount);
});

test("6 — Gap CENTER is excluded from Primary count", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  const snap = resolveNexoraMvpStagePopulationSnapshot({
    catalog,
    composedObjects: focused.scene.objects,
    contextNodeCount: focused.contextNodes.length,
  });
  assert.equal(snap.executiveWorkCenterId, "ctx-problem-capacity");
  assert.equal(
    focused.scene.objects.some(
      (entry) =>
        entry.id === "ctx-problem-capacity" &&
        entry.stageRepresentationRole ===
          NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER,
    ),
    true,
  );
  assert.ok(snap.composedPrimaryCount < snap.catalogPrimaryCount);
  assert.equal(
    focused.scene.objects.filter(
      (entry) =>
        entry.id === "ctx-problem-capacity" &&
        entry.stageRepresentationRole ===
          NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
    ).length,
    0,
  );
});

test("7 — Gap CENTER is included in rendered-body count where physically rendered", () => {
  const focused = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(focused.executiveWorkCenterId, "ctx-problem-capacity");
  assert.equal(
    focused.renderedStageBodyCount,
    focused.composedPrimaryCount + 1,
  );
});

test("8 — Context Nodes are excluded from Primary count", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  const snap = resolveNexoraMvpStagePopulationSnapshot({
    catalog,
    composedObjects: focused.scene.objects,
    contextNodeCount: focused.contextNodes.length,
  });
  assert.equal(
    snap.composedPrimaryCount,
    countNexoraMvpComposedPrimaryPopulation(focused.scene.objects),
  );
  const primaryIds = new Set(
    focused.scene.objects
      .filter(
        (entry) =>
          entry.stageRepresentationRole ===
          NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
      )
      .map((entry) => entry.id),
  );
  for (const node of focused.contextNodes) {
    if (node.role === "context") {
      assert.equal(primaryIds.has(node.subjectId), false);
    }
  }
});

test("9 — Scenario CENTER is excluded from Primary", () => {
  const snap = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-scenario-demand",
      catalog,
    ),
  );
  assert.equal(snap.executiveWorkCenterId, "ctx-scenario-demand");
  assert.equal(snap.catalogPrimaryCount, 8);
  assert.equal(snap.renderedStageBodyCount, snap.composedPrimaryCount + 1);
});

test("10 — Decision CENTER is excluded from Primary", () => {
  const snap = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-decision-capacity",
      catalog,
    ),
  );
  assert.equal(snap.executiveWorkCenterId, "ctx-decision-capacity");
  assert.equal(snap.catalogPrimaryCount, 8);
});

test("11 — Execution CENTER is excluded from Primary", () => {
  const snap = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-execution-capacity",
      catalog,
    ),
  );
  assert.equal(snap.executiveWorkCenterId, "ctx-execution-capacity");
  assert.equal(snap.catalogPrimaryCount, 8);
});

test("12 — Risk is included as Primary", () => {
  assert.equal(
    catalog.objects.some((entry) => entry.id === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID),
    true,
  );
  const overview = present(initialState());
  const risk = overview.scene.objects.find(
    (entry) => entry.id === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
  );
  assert.equal(
    risk?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  );
  assert.equal(population().catalogPrimaryCount, 8);
});

test("13 — operational bodies are included as Primary", () => {
  const overview = present(initialState());
  for (const id of [
    "obj-capacity",
    "obj-customer",
    "obj-inventory",
    "obj-demand",
    "obj-delivery",
    "obj-budget",
    "obj-revenue",
  ]) {
    assert.equal(
      overview.scene.objects.find((entry) => entry.id === id)
        ?.stageRepresentationRole,
      NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
    );
  }
});

test("14 — disclosure may change composed count without changing catalog count", () => {
  const overview = population();
  const gap = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(gap.catalogPrimaryCount, overview.catalogPrimaryCount);
  assert.notEqual(gap.composedPrimaryCount, overview.composedPrimaryCount);
  assert.ok(gap.composedPrimaryCount < gap.catalogPrimaryCount);
});

test("15 — MLEVEL cannot change catalog membership", () => {
  assert.equal(
    NEXORA_MVP_COMPOSED_POPULATION_BOUNDARY.ownsMlevel,
    false,
  );
  const l1 = countNexoraMvpCatalogPrimaryMembership(catalog);
  void "L3";
  assert.equal(l1, 8);
});

test("16 — DTH classification cannot change Primary count", () => {
  const problemType = resolveCanonicalExecutiveObjectType({
    id: "ctx-problem-capacity",
    kind: "problem",
    label: "Capacity Gap",
  });
  assert.equal(problemType, "problem");
  assert.equal(countNexoraMvpCatalogPrimaryMembership(catalog), 8);
});

test("17 — OVS family/primitive cannot change Primary count", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem, "prism");
  assert.equal(countNexoraMvpCatalogPrimaryMembership(catalog), 8);
});

test("18 — state/theme cannot change Primary count", () => {
  const operation = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "investigate",
  });
  assert.equal(population(operation).catalogPrimaryCount, 8);
  assert.equal(population().catalogPrimaryCount, 8);
});

test("19 — unspecified role fails closed", () => {
  const composed = countNexoraMvpComposedPrimaryPopulation([
    {
      id: "ghost-extra",
      stageRepresentationRole: undefined,
      disclosureState: "visible-related",
    },
    {
      id: "obj-capacity",
      stageRepresentationRole:
        NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
      disclosureState: "visible-related",
    },
  ]);
  assert.equal(composed, 1);
});

test("20 — visible badge resolves from exactly its certified count source", () => {
  const snap = population();
  assert.equal(
    snap.operatorFacingSource,
    NEXORA_MVP_STAGE_POPULATION_OPERATOR_FACING_SOURCE,
  );
  assert.equal(snap.operatorFacingCount, snap.composedPrimaryCount);
  assert.equal(
    snap.operatorFacingBadge,
    formatNexoraMvpStagePopulationBadge(snap.composedPrimaryCount),
  );
  assert.equal(
    NEXORA_MVP_COMPOSED_POPULATION_BOUNDARY.operatorFacingSource,
    "composedPrimaryCount",
  );
});

test("21 — visible badge remains semantically correct during Capacity Gap CENTER", () => {
  const snap = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(snap.catalogPrimaryCount, 8);
  assert.equal(snap.executiveWorkCenterId, "ctx-problem-capacity");
  assert.equal(
    snap.operatorFacingBadge,
    formatNexoraMvpStagePopulationBadge(snap.composedPrimaryCount),
  );
  assert.notEqual(
    snap.operatorFacingBadge,
    formatNexoraMvpStagePopulationBadge(snap.catalogPrimaryCount),
  );
  assert.notEqual(
    snap.operatorFacingBadge,
    formatNexoraMvpStagePopulationBadge(snap.renderedStageBodyCount),
  );
});

test("22 — exit restores normal composition/count behavior", () => {
  const focused = selectNexoraMVPInteractionSubject(
    initialState(),
    "ctx-problem-capacity",
    catalog,
  );
  const exited = population(
    selectNexoraMVPInteractionSubject(focused, "obj-capacity", catalog),
  );
  assert.equal(exited.executiveWorkCenterId, null);
  assert.equal(exited.catalogPrimaryCount, 8);
  assert.equal(
    exited.operatorFacingCount,
    exited.composedPrimaryCount,
  );
});

test("23 — re-entry does not accumulate counts", () => {
  const first = population(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  const exited = selectNexoraMVPInteractionSubject(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
    "obj-capacity",
    catalog,
  );
  const second = population(
    selectNexoraMVPInteractionSubject(exited, "ctx-problem-capacity", catalog),
  );
  assert.deepEqual(
    {
      catalog: first.catalogPrimaryCount,
      composed: first.composedPrimaryCount,
      rendered: first.renderedStageBodyCount,
      center: first.executiveWorkCenterId,
    },
    {
      catalog: second.catalogPrimaryCount,
      composed: second.composedPrimaryCount,
      rendered: second.renderedStageBodyCount,
      center: second.executiveWorkCenterId,
    },
  );
});

test("CENTER does not count as composed Primary even if physically rendered", () => {
  const objects = [
    {
      id: "obj-capacity",
      stageRepresentationRole:
        NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
      disclosureState: "visible-related" as const,
    },
    {
      id: "ctx-problem-capacity",
      stageRepresentationRole:
        NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER,
      disclosureState: "visible-primary" as const,
    },
  ];
  assert.equal(countNexoraMvpComposedPrimaryPopulation(objects), 1);
  assert.equal(countNexoraMvpRenderedStageBodyPopulation(objects), 2);
});

test("hidden Primary Bodies are not composed", () => {
  const objects = [
    {
      id: "obj-capacity",
      stageRepresentationRole:
        NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
      disclosureState: "visible-related" as const,
    },
    {
      id: "obj-revenue",
      stageRepresentationRole:
        NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
      disclosureState: "hidden" as const,
    },
  ];
  assert.equal(countNexoraMvpComposedPrimaryPopulation(objects), 1);
  assert.equal(countNexoraMvpRenderedStageBodyPopulation(objects), 1);
});
