/**
 * NPA-T EXECUTIVE-WORK-CENTER:1 — focused executive-work CENTER vs Primary Body.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { MANAGER_OBJECT_REGISTERED_GOAL } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { resolveCanonicalExecutiveObjectType } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  resolveExecutiveOvsObjectVisualLanguage,
} from "@/app/lib/spatial-presentation/executiveOvsObjectVisualLanguage.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_CANONICAL_RISK_OBJECT_ID } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import {
  NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS,
  resolveNexoraMvpSubjectPrimaryStageBodyAdmission,
} from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";
import {
  NEXORA_MVP_EXECUTIVE_WORK_CENTER_BOUNDARY,
  NEXORA_MVP_STAGE_REPRESENTATION_ROLE,
  countNexoraMvpPrimaryStageBodies,
  countNexoraMvpRenderedStageBodies,
  findNexoraMvpExecutiveWorkCenterId,
  resolveNexoraMvpStageRepresentationRole,
} from "@/app/lib/nex-mvp/nexoraMvpExecutiveWorkCenter.ts";

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

function catalogObjectIds(): readonly string[] {
  return catalog.objects.map((entry) => entry.id);
}

test("1 — Capacity is Primary before/during/after focus", () => {
  const overview = present(initialState());
  const before = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "obj-capacity",
  );
  assert.equal(before.admittedPrimaryBody, true);
  assert.equal(
    overview.scene.objects.find((entry) => entry.id === "obj-capacity")
      ?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  );

  const during = present(
    selectNexoraMVPInteractionSubject(initialState(), "obj-capacity", catalog),
  );
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(catalog, "obj-capacity")
      .admittedPrimaryBody,
    true,
  );
  assert.equal(
    during.scene.objects.find((entry) => entry.id === "obj-capacity")
      ?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  );

  const afterGap = present(
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
  assert.equal(
    afterGap.scene.objects.find((entry) => entry.id === "obj-capacity")
      ?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  );
});

test("2 — Risk is Primary before/during/after focus", () => {
  const overview = present(initialState());
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
    ).admittedPrimaryBody,
    true,
  );
  assert.equal(
    overview.scene.objects.find(
      (entry) => entry.id === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
    )?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  );
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
      catalog,
    ),
  );
  assert.equal(
    focused.scene.objects.find(
      (entry) => entry.id === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
    )?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  );
});

test("3 — Capacity Gap is not Primary before focus", () => {
  const overview = present(initialState());
  assert.equal(
    overview.scene.objects.some((entry) => entry.id === "ctx-problem-capacity"),
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

test("4 — Capacity Gap remains not Primary while rendered at CENTER", () => {
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
  assert.ok(center);
  assert.equal(center?.focused, true);
  assert.equal(center?.spatialRole, "center");
  assert.equal(
    center?.stageRepresentationRole,
    NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER,
  );
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      "ctx-problem-capacity",
    ).status,
    NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE,
  );
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      "ctx-problem-capacity",
    ).admittedPrimaryBody,
    false,
  );
});

test("5 — Capacity Gap remains absent from catalog.objects", () => {
  const before = catalogObjectIds();
  selectNexoraMVPInteractionSubject(
    initialState(),
    "ctx-problem-capacity",
    catalog,
  );
  present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  selectNexoraMVPInteractionSubject(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
    "obj-capacity",
    catalog,
  );
  assert.deepEqual(catalogObjectIds(), before);
  assert.equal(
    catalog.objects.some((entry) => entry.id === "ctx-problem-capacity"),
    false,
  );
});

test("6 — Capacity Gap retains kind=problem", () => {
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
  assert.equal(center?.kind, "problem");
  assert.equal(center?.objectKind, "problem");
  assert.notEqual(center?.kind, "object");
});

test("7 — Capacity Gap resolves Problem OVS family/prism at CENTER", () => {
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
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: center?.objectKind ?? center?.kind,
    enabled: true,
  });
  assert.equal(language.family, "problem");
  assert.equal(language.primitive, "prism");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem, "prism");
  assert.equal(
    focused.scene.objects.filter((entry) => entry.id === "ctx-problem-capacity")
      .length,
    1,
  );
});

test("8 — exiting Capacity Gap focus removes temporary CENTER representation", () => {
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
  assert.equal(
    exited.scene.objects.some((entry) => entry.id === "ctx-problem-capacity"),
    false,
  );
  assert.equal(findNexoraMvpExecutiveWorkCenterId(exited.scene.objects), null);
  assert.equal(countNexoraMvpPrimaryStageBodies(exited.scene.objects), 8);
});

test("9 — re-entering does not duplicate Capacity Gap CENTER", () => {
  const first = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  const second = present(
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
  const firstCount = first.scene.objects.filter(
    (entry) => entry.id === "ctx-problem-capacity",
  ).length;
  const secondCount = second.scene.objects.filter(
    (entry) => entry.id === "ctx-problem-capacity",
  ).length;
  assert.equal(firstCount, 1);
  assert.equal(secondCount, 1);
});

test("10 — Advisor subject remains Capacity Gap throughout canonical focus", () => {
  const state = selectNexoraMVPInteractionSubject(
    initialState(),
    "ctx-problem-capacity",
    catalog,
  );
  const presentation = present(state);
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(advisor.focusedSubject?.id, "ctx-problem-capacity");
  assert.equal(advisor.advisorSubjectId, "ctx-problem-capacity");
  assert.equal(advisor.subjectKind, "problem");
  assert.equal(presentation.focusedSubjectId, "ctx-problem-capacity");
});

test("11 — Problem prism existence does not change admission", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem, "prism");
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      "ctx-problem-capacity",
    ).admittedPrimaryBody,
    false,
  );
  assert.equal(
    NEXORA_MVP_EXECUTIVE_WORK_CENTER_BOUNDARY.ovsReuseAllowedWithoutAdmission,
    true,
  );
});

test("12 — Scenario/Decision/Execution follow existing CENTER policy", () => {
  for (const id of [
    "ctx-scenario-demand",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
  ] as const) {
    const focused = present(
      selectNexoraMVPInteractionSubject(initialState(), id, catalog),
    );
    const center = focused.scene.objects.find((entry) => entry.id === id);
    assert.ok(center, id);
    assert.equal(
      center?.stageRepresentationRole,
      NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER,
    );
    assert.equal(
      resolveNexoraMvpSubjectPrimaryStageBodyAdmission(catalog, id)
        .admittedPrimaryBody,
      false,
    );
    assert.equal(catalog.objects.some((entry) => entry.id === id), false);
  }
});

test("13 — Goal follows existing policy (not CENTER-eligible)", () => {
  const next = selectNexoraMVPInteractionSubject(
    initialState(),
    MANAGER_OBJECT_REGISTERED_GOAL.objectId,
    catalog,
  );
  const presentation = present(next);
  assert.equal(next.focusedSubject, null);
  assert.equal(
    presentation.scene.objects.some(
      (entry) => entry.id === MANAGER_OBJECT_REGISTERED_GOAL.objectId,
    ),
    false,
  );
  assert.equal(
    resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      MANAGER_OBJECT_REGISTERED_GOAL.objectId,
    ).admittedPrimaryBody,
    false,
  );
});

test("14 — Outcome is not activated because ring exists", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.outcome, "ring");
  const presentation = present(initialState());
  assert.equal(
    presentation.scene.objects.some((entry) => entry.kind === "outcome"),
    false,
  );
  const role = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "none",
    stageKind: "outcome",
    objectKind: "outcome",
    ovsPrimitive: "ring",
  });
  assert.equal(role, null);
});

test("15 — DTH cannot trigger CENTER role", () => {
  const dth = resolveCanonicalExecutiveObjectType({
    id: "obj-capacity",
    kind: "object",
    label: "Capacity",
  });
  assert.equal(dth, "kpi");
  const role = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "none",
    stageKind: "problem",
    objectKind: "problem",
    dthCanonicalType: dth,
    focusedExecutiveWorkId: null,
  });
  assert.equal(role, null);
});

test("16 — MLEVEL cannot trigger CENTER role", () => {
  const l1 = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    subjectId: "ctx-problem-capacity",
    focusedExecutiveWorkId: "ctx-problem-capacity",
    managementLevel: "L1",
  });
  const l3 = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    subjectId: "ctx-problem-capacity",
    focusedExecutiveWorkId: "ctx-problem-capacity",
    managementLevel: "L3",
  });
  assert.equal(l1, NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER);
  assert.deepEqual(l1, l3);
});

test("17 — state/theme cannot trigger CENTER role", () => {
  const day = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "object",
    theme: "day",
    status: "unresolved",
  });
  const night = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "object",
    theme: "night",
    status: "stable",
  });
  assert.equal(day, NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY);
  assert.equal(night, NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY);
  const unfocusedProblem = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    theme: "night",
    status: "watch",
  });
  assert.equal(unfocusedProblem, null);
});

test("18 — unknown focused identity fails closed", () => {
  const next = selectNexoraMVPInteractionSubject(
    initialState(),
    "unknown-focus-subject",
    catalog,
  );
  assert.equal(next.focusedSubject, null);
  const role = resolveNexoraMvpStageRepresentationRole({
    catalogMembership: "none",
    stageKind: "mystery",
    objectKind: "mystery",
    subjectId: "unknown-focus-subject",
    focusedExecutiveWorkId: "unknown-focus-subject",
  });
  assert.equal(role, null);
});

test("Primary population vs rendered population during Problem CENTER", () => {
  const overview = present(initialState());
  assert.equal(countNexoraMvpPrimaryStageBodies(overview.scene.objects), 8);
  assert.equal(countNexoraMvpRenderedStageBodies(overview.scene.objects), 8);
  const focused = present(
    selectNexoraMVPInteractionSubject(
      initialState(),
      "ctx-problem-capacity",
      catalog,
    ),
  );
  assert.equal(countNexoraMvpPrimaryStageBodies(focused.scene.objects), 8);
  assert.ok(countNexoraMvpRenderedStageBodies(focused.scene.objects) > 8);
  assert.equal(
    findNexoraMvpExecutiveWorkCenterId(focused.scene.objects),
    "ctx-problem-capacity",
  );
});
