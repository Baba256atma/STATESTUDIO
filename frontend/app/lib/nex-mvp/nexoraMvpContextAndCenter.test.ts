/**
 * NPA-T CONTEXT-AND-CENTER:1 — Context vs Executive-Work CENTER lifecycle.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { MANAGER_OBJECT_REGISTERED_GOAL } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { resolveCanonicalExecutiveObjectType } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "@/app/lib/spatial-presentation/executiveOvsObjectVisualLanguage.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS,
  resolveNexoraMvpSubjectPrimaryStageBodyAdmission,
} from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";
import {
  NEXORA_MVP_STAGE_REPRESENTATION_ROLE,
  findNexoraMvpExecutiveWorkCenterId,
} from "@/app/lib/nex-mvp/nexoraMvpExecutiveWorkCenter.ts";
import {
  NEXORA_MVP_CONTEXT_AND_CENTER_BOUNDARY,
  NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE,
  resolveNexoraMvpExecutiveWorkPresentationMode,
  suppressSameCanonicalContextPresentation,
} from "@/app/lib/nex-mvp/nexoraMvpContextAndCenter.ts";

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

function catalogSnapshot() {
  return Object.freeze({
    objectIds: catalog.objects.map((entry) => entry.id),
    contextIds: catalog.contextSubjects.map((entry) => entry.id),
  });
}

test("1 — Capacity Gap unfocused follows Context policy", () => {
  const overview = present(initialState());
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "contextSubjects",
      subjectId: "ctx-problem-capacity",
      stageKind: "problem",
      objectKind: "problem",
    }),
    NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.CONTEXT,
  );
  assert.equal(
    overview.scene.objects.some((entry) => entry.id === "ctx-problem-capacity"),
    false,
  );
  assert.equal(
    overview.contextNodes.some(
      (node) => node.subjectId === "ctx-problem-capacity",
    ),
    false,
  );
  assert.ok(
    catalog.contextSubjects.some((entry) => entry.id === "ctx-problem-capacity"),
  );
});

test("2 — Capacity Gap focus creates exactly one CENTER representation", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  const centers = focused.scene.objects.filter(
    (entry) => entry.id === "ctx-problem-capacity",
  );
  assert.equal(centers.length, 1);
  assert.equal(
    centers[0]?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER,
  );
});

test("3 — CENTER uses same canonical ID", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(
    findNexoraMvpExecutiveWorkCenterId(focused.scene.objects),
    "ctx-problem-capacity",
  );
  assert.equal(focused.focusedSubjectId, "ctx-problem-capacity");
});

test("4 — CENTER retains kind=problem", () => {
  const center = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  ).scene.objects.find((entry) => entry.id === "ctx-problem-capacity");
  assert.equal(center?.kind, "problem");
  assert.equal(center?.objectKind, "problem");
});

test("5 — Capacity Gap remains absent from Primary catalog", () => {
  selectNexoraMVPInteractionSubject(
    initialState(),
    "ctx-problem-capacity",
    catalog,
  );
  assert.equal(
    catalog.objects.some((entry) => entry.id === "ctx-problem-capacity"),
    false,
  );
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      "ctx-problem-capacity",
    ).admittedPrimaryBody,
    false,
  );
});

test("6 — Context catalog record remains present", () => {
  const before = catalogSnapshot();
  present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.deepEqual(catalogSnapshot(), before);
  assert.ok(
    catalog.contextSubjects.some((entry) => entry.id === "ctx-problem-capacity"),
  );
});

test("7 — same-subject Context presentation is suppressed during CENTER", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(
    focused.contextNodes.some(
      (node) => node.subjectId === "ctx-problem-capacity",
    ),
    false,
  );
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "contextSubjects",
      subjectId: "ctx-problem-capacity",
      stageKind: "problem",
      objectKind: "problem",
      focusedExecutiveWorkId: "ctx-problem-capacity",
    }),
    NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.EXECUTIVE_WORK_CENTER,
  );
  const suppressed = suppressSameCanonicalContextPresentation(
    [
      { id: "ctx-problem-capacity", subjectId: "ctx-problem-capacity" },
      { id: "anchor-obj-capacity", subjectId: "obj-capacity" },
    ],
    "ctx-problem-capacity",
  );
  assert.deepEqual(
    suppressed.map((node) => node.id),
    ["anchor-obj-capacity"],
  );
});

test("8 — unrelated Context subjects are unaffected by same-subject suppression", () => {
  const remaining = suppressSameCanonicalContextPresentation(
    [
      { id: "ctx-problem-capacity", subjectId: "ctx-problem-capacity" },
      { id: "ctx-scenario-demand", subjectId: "ctx-scenario-demand" },
      { id: "ctx-problem-margin", subjectId: "ctx-problem-margin" },
    ],
    "ctx-problem-capacity",
  );
  assert.equal(
    remaining.some((node) => node.subjectId === "ctx-problem-capacity"),
    false,
  );
  assert.ok(remaining.some((node) => node.subjectId === "ctx-scenario-demand"));
  assert.ok(remaining.some((node) => node.subjectId === "ctx-problem-margin"));
  assert.equal(
    NEXORA_MVP_CONTEXT_AND_CENTER_BOUNDARY.suppressesUnrelatedContext,
    false,
  );
});

test("9 — exit removes CENTER", () => {
  const exited = present(
    selectNexoraMVPInteractionSubject(
      selectNexoraMVPInteractionSubject(
        initialState(),
        "ctx-problem-capacity",
        catalog,
      ),
      "obj-capacity",
      catalog,
    ),
  );
  assert.equal(findNexoraMvpExecutiveWorkCenterId(exited.scene.objects), null);
  assert.equal(
    exited.scene.objects.some((entry) => entry.id === "ctx-problem-capacity"),
    false,
  );
});

test("10 — exit restores normal Context eligibility", () => {
  const afterExit = selectNexoraMVPInteractionSubject(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
    "obj-capacity",
    catalog,
  );
  assert.ok(
    catalog.contextSubjects.some((entry) => entry.id === "ctx-problem-capacity"),
  );
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "contextSubjects",
      subjectId: "ctx-problem-capacity",
      stageKind: "problem",
      objectKind: "problem",
      focusedExecutiveWorkId: afterExit.focusedSubject?.id ?? null,
    }),
    NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.CONTEXT,
  );
  const capacityFocus = present(afterExit);
  const gapAsContext = capacityFocus.contextNodes.some(
    (node) => node.subjectId === "ctx-problem-capacity",
  );
  const gapInCollapsedThread = capacityFocus.contextNodes.some(
    (node) =>
      node.role === "collapsed-thread" &&
      (node.collapsedMemberIds ?? []).includes("ctx-problem-capacity"),
  );
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      "ctx-problem-capacity",
    ).status,
    NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE,
  );
  assert.ok(
    gapAsContext || gapInCollapsedThread || capacityFocus.mode === "object-focused",
    "Gap remains Context-eligible after exit; visible node depends on disclosure",
  );
});

test("11 — re-entry creates exactly one CENTER", () => {
  const reentered = present(
    selectNexoraMVPInteractionSubject(
      selectNexoraMVPInteractionSubject(
        selectNexoraMVPInteractionSubject(
          initialState(),
          "ctx-problem-capacity",
          catalog,
        ),
        "obj-capacity",
        catalog,
      ),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(
    reentered.scene.objects.filter(
      (entry) => entry.id === "ctx-problem-capacity",
    ).length,
    1,
  );
});

test("12 — switch Problem → another executive-work subject removes old CENTER", () => {
  const switched = present(
    selectNexoraMVPInteractionSubject(
      selectNexoraMVPInteractionSubject(
        initialState(),
        "ctx-problem-capacity",
        catalog,
      ),
      "ctx-scenario-demand",
      catalog,
    ),
  );
  assert.equal(
    findNexoraMvpExecutiveWorkCenterId(switched.scene.objects),
    "ctx-scenario-demand",
  );
  assert.equal(
    switched.scene.objects.filter((entry) =>
      entry.stageRepresentationRole ===
      NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER,
    ).length,
    1,
  );
  assert.equal(
    switched.scene.objects.some((entry) => entry.id === "ctx-problem-capacity"),
    false,
  );
});

test("13 — Advisor canonical ID remains correct", () => {
  const state = selectNexoraMVPInteractionSubject(
    initialState(),
    "ctx-problem-capacity",
    catalog,
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(state, present(state));
  assert.equal(advisor.advisorSubjectId, "ctx-problem-capacity");
  assert.equal(advisor.focusedSubject?.id, "ctx-problem-capacity");
  assert.equal(advisor.subjectKind, "problem");
});

test("14 — context/CENTER render IDs cannot become canonical authority", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  const center = focused.scene.objects.find(
    (entry) => entry.id === "ctx-problem-capacity",
  );
  assert.equal(center?.id, "ctx-problem-capacity");
  const anchor = focused.contextNodes.find(
    (node) => node.role === "source-anchor",
  );
  if (anchor != null) {
    assert.match(anchor.id, /^anchor-/);
    assert.notEqual(anchor.id, focused.focusedSubjectId);
    assert.notEqual(anchor.subjectId, "ctx-problem-capacity");
  }
});

test("15 — Scenario follows actual CENTER + Context policy", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-scenario-demand",
      catalog,
    ),
  );
  assert.equal(
    findNexoraMvpExecutiveWorkCenterId(focused.scene.objects),
    "ctx-scenario-demand",
  );
  assert.equal(
    focused.contextNodes.some((node) => node.subjectId === "ctx-scenario-demand"),
    false,
  );
  assert.ok(
    catalog.contextSubjects.some((entry) => entry.id === "ctx-scenario-demand"),
  );
});

test("16 — Decision follows actual CENTER + Context policy", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-decision-capacity",
      catalog,
    ),
  );
  assert.equal(
    findNexoraMvpExecutiveWorkCenterId(focused.scene.objects),
    "ctx-decision-capacity",
  );
  assert.equal(
    focused.contextNodes.some(
      (node) => node.subjectId === "ctx-decision-capacity",
    ),
    false,
  );
});

test("17 — Execution follows actual CENTER + Context policy", () => {
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-execution-capacity",
      catalog,
    ),
  );
  assert.equal(
    findNexoraMvpExecutiveWorkCenterId(focused.scene.objects),
    "ctx-execution-capacity",
  );
  assert.equal(
    focused.contextNodes.some(
      (node) => node.subjectId === "ctx-execution-capacity",
    ),
    false,
  );
});

test("18 — Goal remains non-CENTER", () => {
  const next = selectNexoraMVPInteractionSubject(
    initialState(),
    MANAGER_OBJECT_REGISTERED_GOAL.objectId,
    catalog,
  );
  assert.equal(next.focusedSubject, null);
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "none",
      subjectId: MANAGER_OBJECT_REGISTERED_GOAL.objectId,
      stageKind: "goal",
      objectKind: "goal",
      focusedExecutiveWorkId: MANAGER_OBJECT_REGISTERED_GOAL.objectId,
    }),
    null,
  );
});

test("19 — Outcome remains non-CENTER", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.outcome, "ring");
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "none",
      subjectId: "outcome-demo",
      stageKind: "outcome",
      objectKind: "outcome",
      focusedExecutiveWorkId: "outcome-demo",
      ovsPrimitive: "ring",
    }),
    null,
  );
});

test("20 — OVS family/primitive cannot trigger CENTER", () => {
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "contextSubjects",
      subjectId: "ctx-problem-capacity",
      stageKind: "problem",
      objectKind: "problem",
      ovsFamily: "problem",
      ovsPrimitive: "prism",
    }),
    NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.CONTEXT,
  );
});

test("21 — DTH cannot trigger CENTER", () => {
  const dth = resolveCanonicalExecutiveObjectType({
    id: "obj-capacity",
    kind: "object",
    label: "Capacity",
  });
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "contextSubjects",
      subjectId: "ctx-problem-capacity",
      stageKind: "problem",
      objectKind: "problem",
      dthCanonicalType: dth,
    }),
    NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.CONTEXT,
  );
});

test("22 — MLEVEL cannot trigger CENTER", () => {
  const l1 = resolveNexoraMvpExecutiveWorkPresentationMode({
    catalogMembership: "contextSubjects",
    subjectId: "ctx-problem-capacity",
    stageKind: "problem",
    objectKind: "problem",
    focusedExecutiveWorkId: "ctx-problem-capacity",
    managementLevel: "L1",
  });
  const l3 = resolveNexoraMvpExecutiveWorkPresentationMode({
    catalogMembership: "contextSubjects",
    subjectId: "ctx-problem-capacity",
    stageKind: "problem",
    objectKind: "problem",
    focusedExecutiveWorkId: "ctx-problem-capacity",
    managementLevel: "L3",
  });
  assert.equal(
    l1,
    NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.EXECUTIVE_WORK_CENTER,
  );
  assert.deepEqual(l1, l3);
});

test("23 — state/theme cannot trigger CENTER", () => {
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "contextSubjects",
      subjectId: "ctx-problem-capacity",
      stageKind: "problem",
      objectKind: "problem",
      status: "unresolved",
      theme: "night",
    }),
    NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.CONTEXT,
  );
});

test("24 — unknown subject fails closed", () => {
  assert.equal(
    resolveNexoraMvpExecutiveWorkPresentationMode({
      catalogMembership: "none",
      subjectId: "unknown-focus-subject",
      stageKind: "mystery",
      objectKind: "mystery",
      focusedExecutiveWorkId: "unknown-focus-subject",
    }),
    null,
  );
  const next = selectNexoraMVPInteractionSubject(
    initialState(),
    "unknown-focus-subject",
    catalog,
  );
  assert.equal(next.focusedSubject, null);
});

test("Primary membership is unchanged during Context↔CENTER", () => {
  const before = catalog.objects.map((entry) => entry.id);
  present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.deepEqual(
    catalog.objects.map((entry) => entry.id),
    before,
  );
});
