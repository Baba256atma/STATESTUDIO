/**
 * NPA-T OVS-BODY-ADMISSION:1 — Primary Stage Body admission (focused).
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
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resolveNexoraMVPInteractionSubject,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
  getNexoraMVPStageObjectFixtures,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import {
  NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS,
  NEXORA_MVP_PRIMARY_STAGE_BODY_ADMISSION_BOUNDARY,
  NEXORA_MVP_STAGE_REPRESENTATION_CLASS,
  resolveNexoraMvpPrimaryStageBodyAdmission,
  resolveNexoraMvpSubjectPrimaryStageBodyAdmission,
} from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

const GENERIC_OBJECT_IDS = [
  "obj-capacity",
  "obj-inventory",
  "obj-demand",
  "obj-customer",
  "obj-delivery",
  "obj-budget",
  "obj-revenue",
] as const;

test("1 — existing operational objects retain Primary Body admission", () => {
  for (const id of GENERIC_OBJECT_IDS) {
    const result = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(catalog, id);
    assert.equal(result.admittedPrimaryBody, true);
    assert.equal(result.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.LIVE_PRIMARY);
    assert.equal(
      result.representationClass,
      NEXORA_MVP_STAGE_REPRESENTATION_CLASS.PRIMARY_BODY,
    );
    assert.equal(result.managementKind, "object");
  }
  assert.equal(getNexoraMVPStageObjectFixtures().length, 8);
});

test("2 — Risk retains Primary Body admission", () => {
  const result = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
  );
  assert.equal(result.admittedPrimaryBody, true);
  assert.equal(result.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.LIVE_PRIMARY);
  assert.equal(result.managementKind, "risk");
  const record = getNexoraMVPStageObjectFixtures().find(
    (object) => object.id === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
  );
  assert.equal(record?.kind, "object");
  assert.equal(record?.objectKind, "risk");
});

test("3 — Problem follows Context Node admission", () => {
  const gap = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "ctx-problem-capacity",
  );
  assert.equal(gap.admittedPrimaryBody, false);
  assert.equal(gap.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE);
  assert.equal(gap.managementKind, "problem");
  const byKind = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
  });
  assert.equal(byKind.admittedPrimaryBody, false);
  assert.equal(byKind.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE);
});

test("4 — Goal is package/orientation, not a Primary Body", () => {
  const result = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    MANAGER_OBJECT_REGISTERED_GOAL.objectId,
  );
  assert.equal(result.admittedPrimaryBody, false);
  assert.equal(
    result.status,
    NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.PACKAGE_WORKFLOW,
  );
  assert.equal(result.managementKind, "goal");
});

test("5 — Scenario is Context Node, not a Primary Body", () => {
  const result = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "ctx-scenario-demand",
  );
  assert.equal(result.admittedPrimaryBody, false);
  assert.equal(result.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE);
  assert.equal(result.managementKind, "scenario");
});

test("6 — Decision is Context Node / workflow, not a Primary Body", () => {
  const result = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "ctx-decision-capacity",
  );
  assert.equal(result.admittedPrimaryBody, false);
  assert.equal(result.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE);
  assert.equal(result.managementKind, "decision");
});

test("7 — Execution is Context Node / workflow, not a Primary Body", () => {
  const result = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "ctx-execution-capacity",
  );
  assert.equal(result.admittedPrimaryBody, false);
  assert.equal(result.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE);
  assert.equal(result.managementKind, "execution");
});

test("8 — geometry existence alone cannot trigger admission", () => {
  const prism = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "none",
    ovsFamily: "problem",
    ovsPrimitive: EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem,
  });
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem, "prism");
  assert.equal(prism.admittedPrimaryBody, false);
  const orb = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "goal",
    ovsFamily: "goal",
    ovsPrimitive: "orb",
  });
  assert.equal(orb.admittedPrimaryBody, false);
  const ring = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "outcome",
    ovsFamily: "outcome",
    ovsPrimitive: "ring",
  });
  assert.equal(ring.admittedPrimaryBody, false);
});

test("9 — DTH type cannot trigger admission", () => {
  const dth = resolveCanonicalExecutiveObjectType({
    id: "obj-capacity",
    kind: "object",
    label: "Capacity",
  });
  assert.equal(dth, "kpi");
  const withoutMembership = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "none",
    dthCanonicalType: dth,
    objectKind: "object",
    stageKind: "object",
  });
  assert.equal(withoutMembership.admittedPrimaryBody, false);
  const liveCapacity = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "obj-capacity",
  );
  assert.equal(liveCapacity.admittedPrimaryBody, true);
  assert.equal(liveCapacity.managementKind, "object");
  assert.equal(
    NEXORA_MVP_PRIMARY_STAGE_BODY_ADMISSION_BOUNDARY.ownsDth,
    false,
  );
});

test("10 — Day/Night cannot trigger admission", () => {
  const day = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    theme: "day",
  });
  const night = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    theme: "night",
  });
  assert.deepEqual(day, night);
  assert.equal(day.admittedPrimaryBody, false);
});

test("11 — OVS state cannot trigger admission", () => {
  const stable = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    status: "stable",
  });
  const unresolved = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    status: "unresolved",
  });
  assert.equal(stable.admittedPrimaryBody, unresolved.admittedPrimaryBody);
  assert.equal(stable.status, unresolved.status);
});

test("12 — label/id cannot trigger admission", () => {
  const labelled = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "none",
    id: "ctx-problem-capacity",
    label: "Capacity Gap",
    stageKind: "object",
    objectKind: "object",
  });
  assert.equal(labelled.admittedPrimaryBody, false);
  const namedProblem = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "object",
    id: "obj-not-a-problem",
    label: "This is a problem",
  });
  assert.equal(namedProblem.admittedPrimaryBody, true);
  assert.equal(namedProblem.managementKind, "object");
});

test("13 — MLEVEL placement does not redefine admission", () => {
  const l1 = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "risk",
    managementLevel: "L1",
  });
  const l3 = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "risk",
    managementLevel: "L3",
  });
  assert.equal(l1.admittedPrimaryBody, true);
  assert.deepEqual(l1, l3);
});

test("14 — generic unknown identities fail safely", () => {
  const unknown = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "none",
    stageKind: "mystery",
    objectKind: "mystery",
  });
  assert.equal(unknown.admittedPrimaryBody, false);
  assert.equal(unknown.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.NOT_ADMITTED);
  const misplacedProblem = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "objects",
    stageKind: "object",
    objectKind: "problem",
  });
  assert.equal(misplacedProblem.admittedPrimaryBody, false);
  assert.equal(
    misplacedProblem.status,
    NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE,
  );
});

test("Capacity remains Primary while Capacity Gap remains Context", () => {
  const capacity = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "obj-capacity",
  );
  const gap = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "ctx-problem-capacity",
  );
  assert.equal(capacity.admittedPrimaryBody, true);
  assert.equal(gap.admittedPrimaryBody, false);
  assert.equal(capacity.managementKind, "object");
  assert.equal(gap.managementKind, "problem");
});

test("canonical selection does not require Primary Body representation", () => {
  const subject = resolveNexoraMVPInteractionSubject(
    "ctx-problem-capacity",
    catalog,
  );
  assert.equal(subject?.kind, "problem");
  assert.equal(subject?.label, "Capacity Gap");
  const admission = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "ctx-problem-capacity",
  );
  assert.equal(admission.admittedPrimaryBody, false);
});

test("OVS family does not control body admission", () => {
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "problem",
    enabled: true,
  });
  assert.equal(language.family, "problem");
  assert.equal(language.primitive, "prism");
  const admission = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: "contextSubjects",
    stageKind: "problem",
    objectKind: "problem",
    ovsFamily: language.family,
    ovsPrimitive: language.primitive,
  });
  assert.equal(admission.admittedPrimaryBody, false);
  assert.equal(
    NEXORA_MVP_PRIMARY_STAGE_BODY_ADMISSION_BOUNDARY.ovsFamilyAdmitsBody,
    false,
  );
  assert.equal(
    NEXORA_MVP_PRIMARY_STAGE_BODY_ADMISSION_BOUNDARY.geometryExistenceAdmitsBody,
    false,
  );
});

test("live catalog has no Primary Problem body", () => {
  for (const object of catalog.objects) {
    const result = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
      catalog,
      object.id,
    );
    assert.notEqual(result.managementKind, "problem");
    assert.equal(result.admittedPrimaryBody, true);
  }
  const problems = catalog.contextSubjects.filter(
    (subject) => subject.kind === "problem",
  );
  assert.ok(problems.length >= 1);
  assert.ok(problems.some((subject) => subject.id === "ctx-problem-capacity"));
});

test("focused Problem may occupy CENTER without becoming an admitted Primary Body", () => {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const overview = deriveNexoraMVPStageInteractionPresentation(
    initial,
    catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  assert.equal(
    overview.scene.objects.some((object) => object.id === "ctx-problem-capacity"),
    false,
  );
  const focused = selectNexoraMVPInteractionSubject(
    initial,
    "ctx-problem-capacity",
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    focused,
    catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  const center = presentation.scene.objects.find(
    (object) => object.id === "ctx-problem-capacity",
  );
  assert.ok(center);
  assert.equal(center?.focused, true);
  assert.equal(center?.kind, "problem");
  const admission = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    "ctx-problem-capacity",
  );
  assert.equal(admission.admittedPrimaryBody, false);
  assert.equal(admission.status, NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE);
  assert.equal(
    NEXORA_MVP_PRIMARY_STAGE_BODY_ADMISSION_BOUNDARY.visibilityIsNotAdmission,
    true,
  );
  assert.equal(
    NEXORA_MVP_PRIMARY_STAGE_BODY_ADMISSION_BOUNDARY
      .stageProdFocusCenterProjectsExecutiveWork,
    true,
  );
});
