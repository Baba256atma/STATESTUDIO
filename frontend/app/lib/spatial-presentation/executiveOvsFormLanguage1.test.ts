/**
 * NPA-T OVS-FORM-LANGUAGE:1 — semantic form grammar proofs A–G.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { resolveCanonicalExecutiveObjectType } from "../decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { MANAGER_OBJECT_KINDS } from "../manager-object/managerObjectInteractionFoundation.ts";
import { collectManagerObjectContext } from "../manager-object/managerObjectContext.ts";
import { getNexoraMVPStageObjectFixtures } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { resolveExecutiveOvsObjectStateVisual } from "./executiveOvsObjectStateVisual.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_KIND_TOKEN_TO_FAMILY,
  resolveExecutiveOvsObjectFamily,
  resolveExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";
import {
  EXECUTIVE_OVS_FORM_CHANNEL_RULE,
  EXECUTIVE_OVS_LIVE_PRIMARY_FORM_FAMILIES,
  EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY,
  EXECUTIVE_OVS_SEMANTIC_FORM_MATRIX,
  EXECUTIVE_OVS_SEMANTIC_FORM_STATUS,
  resolveExecutiveOvsSemanticFormGrammar,
  verifyExecutiveOvsSemanticFormGrammar,
} from "./executiveOvsSemanticFormGrammar.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";

const here = dirname(fileURLToPath(import.meta.url));

const GENERIC = [
  "obj-capacity",
  "obj-customer",
  "obj-inventory",
  "obj-demand",
  "obj-delivery",
  "obj-budget",
  "obj-revenue",
] as const;

test("A — Existing authority: Manager Object kinds and OVS primitive map", () => {
  assert.equal(verifyExecutiveOvsSemanticFormGrammar(), true);
  assert.deepEqual([...MANAGER_OBJECT_KINDS], [
    "object",
    "goal",
    "problem",
    "risk",
    "opportunity",
    "scenario",
    "decision",
    "execution",
    "outcome",
    "unknown",
  ]);
  assert.equal(
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.primitiveMapOwner,
    "EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE",
  );
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_KIND_TOKEN_TO_FAMILY.risk, "risk");
  assert.equal(EXECUTIVE_OVS_KIND_TOKEN_TO_FAMILY.object, "operational");
  const language = readFileSync(
    join(here, "./executiveOvsObjectVisualLanguage.ts"),
    "utf8",
  );
  assert.doesNotMatch(language, /kind\.includes\("risk"\)/);
});

test("B — No label inference for live mappings", () => {
  for (const label of [
    "Capacity",
    "Revenue",
    "Customer",
    "Inventory",
    "Demand",
    "Delivery",
    "Budget",
  ]) {
    const form = resolveExecutiveOvsSemanticFormGrammar({
      id: `obj-${label.toLowerCase()}`,
      kind: "object",
      label,
    });
    assert.equal(form.family, "operational", label);
    assert.equal(form.primitive, "rounded-block", label);
  }
  assert.equal(resolveExecutiveOvsObjectFamily("Capacity"), "operational");
  assert.equal(resolveExecutiveOvsObjectFamily("Revenue Risk"), "operational");
  assert.equal(resolveExecutiveOvsObjectFamily("obj-risk"), "operational");
});

test("C — Risk preservation", () => {
  assert.equal(
    collectManagerObjectContext("obj-risk").objectKind.value,
    "risk",
  );
  const form = resolveExecutiveOvsSemanticFormGrammar({
    id: "obj-other",
    kind: "object",
    objectKind: "risk",
    label: "Exposure",
    status: "stable",
  });
  assert.equal(form.cue, "risk");
  assert.equal(form.family, "risk");
  assert.equal(form.primitive, "diamond");
  assert.equal(form.livePrimary, true);
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({ id: "obj-risk", kind: "object" }),
    "object",
  );
});

test("D — Generic / unknown fallback", () => {
  for (const cue of ["object", "unknown", "", "widget", "pack"]) {
    assert.equal(resolveExecutiveOvsObjectFamily(cue || "object"), "operational");
  }
  const unknown = resolveExecutiveOvsSemanticFormGrammar({
    kind: "object",
    objectKind: "unknown",
  });
  assert.equal(unknown.family, "operational");
  assert.equal(unknown.primitive, "rounded-block");
});

test("E — State independence", () => {
  for (const status of ["stable", "watch", "unresolved", "risk"] as const) {
    const generic = resolveExecutiveOvsSemanticFormGrammar({
      kind: "object",
      status,
    });
    const risk = resolveExecutiveOvsSemanticFormGrammar({
      kind: "object",
      objectKind: "risk",
      status,
    });
    assert.equal(generic.family, "operational");
    assert.equal(risk.family, "risk");
    assert.equal(risk.primitive, "diamond");
    const state = resolveExecutiveOvsObjectStateVisual({ status });
    assert.equal(
      resolveExecutiveOvsObjectVisualLanguage({
        objectKind: "object",
        enabled: true,
      }).primitive,
      "rounded-block",
    );
    assert.ok(state.managementClass.length > 0);
  }
});

test("F — Cross-context grammar (Business and Project share families)", () => {
  const businessRisk = resolveExecutiveOvsSemanticFormGrammar({
    objectKind: "risk",
    kind: "object",
  });
  const projectRisk = resolveExecutiveOvsSemanticFormGrammar({
    objectKind: "risk",
    kind: "object",
    id: "project-risk-1",
  });
  assert.equal(businessRisk.family, projectRisk.family);
  assert.equal(businessRisk.primitive, projectRisk.primitive);
  const businessObject = resolveExecutiveOvsSemanticFormGrammar({
    kind: "object",
    label: "Capacity",
  });
  const projectObject = resolveExecutiveOvsSemanticFormGrammar({
    kind: "object",
    label: "Resource",
  });
  assert.equal(businessObject.family, "operational");
  assert.equal(projectObject.family, "operational");
  assert.equal(
    EXECUTIVE_OVS_FORM_CHANNEL_RULE.identityForm,
    "what the management object IS",
  );
});

test("G — DTH classification is not OVS authority", () => {
  const dthCapacity = resolveCanonicalExecutiveObjectType({
    id: "obj-capacity",
    kind: "object",
    label: "Capacity",
  });
  assert.equal(dthCapacity, "kpi");
  const ovs = resolveExecutiveOvsSemanticFormGrammar({
    id: "obj-capacity",
    kind: "object",
    label: "Capacity",
    dthCanonicalType: dthCapacity,
  });
  assert.equal(ovs.family, "operational");
  assert.equal(ovs.primitive, "rounded-block");
  assert.equal(
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.usesDthAsSemanticAuthority,
    false,
  );
});

test("H — Day/Night and MLEVEL do not change family", () => {
  const base = resolveExecutiveOvsSemanticFormGrammar({
    objectKind: "risk",
    kind: "object",
  });
  for (const theme of ["day", "night"] as const) {
    for (const managementLevel of ["L1", "L2", "L3"] as const) {
      const next = resolveExecutiveOvsSemanticFormGrammar({
        objectKind: "risk",
        kind: "object",
        theme,
        managementLevel,
      });
      assert.equal(next.family, base.family);
      assert.equal(next.primitive, base.primitive);
    }
  }
});

test("I — Seven generic live bodies stay operational without name families", () => {
  const fixtures = getNexoraMVPStageObjectFixtures();
  for (const id of GENERIC) {
    const fixture = fixtures.find((entry) => entry.id === id);
    assert.equal(fixture?.kind, "object");
    assert.equal(fixture?.objectKind, undefined);
    const form = resolveExecutiveOvsSemanticFormGrammar({
      id: fixture!.id,
      kind: fixture!.kind,
      objectKind: fixture!.objectKind,
      label: fixture!.label,
    });
    assert.equal(form.family, "operational");
    assert.equal(form.livePrimary, true);
  }
  const risk = fixtures.find((entry) => entry.id === "obj-risk");
  assert.equal(risk?.objectKind, "risk");
});

test("J — Problem / Outcome / KPI admission statuses", () => {
  assert.deepEqual([...EXECUTIVE_OVS_LIVE_PRIMARY_FORM_FAMILIES], [
    "operational",
    "risk",
    "problem",
  ]);
  const problem = EXECUTIVE_OVS_SEMANTIC_FORM_MATRIX.find(
    (row) => row.concept === "problem",
  );
  assert.equal(problem?.status, EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.LIVE);
  const outcome = EXECUTIVE_OVS_SEMANTIC_FORM_MATRIX.find(
    (row) => row.concept === "outcome",
  );
  assert.equal(
    outcome?.status,
    EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.GEOMETRY_EXISTS_ACTIVATION_NOT_APPROVED,
  );
  const kpi = EXECUTIVE_OVS_SEMANTIC_FORM_MATRIX.find(
    (row) => row.concept === "kpi",
  );
  assert.equal(
    kpi?.status,
    EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.GEOMETRY_EXISTS_ACTIVATION_NOT_APPROVED,
  );
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.match(body, /case "prism":/);
  assert.match(body, /createExecutiveOvsProblemPrismGeometry/);
  assert.equal(
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.certifiesProblemPrismAsDistinct,
    true,
  );
  assert.equal(
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.activatesOutcomeRingAsLivePrimary,
    false,
  );
});
