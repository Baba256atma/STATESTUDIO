/**
 * NPA-T OVS-PROBLEM-FORM:1 — Problem body geometry (focused).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { resolveCanonicalExecutiveObjectType } from "../decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { resolveExecutiveOvsObjectStateVisual } from "./executiveOvsObjectStateVisual.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION,
  resolveExecutiveOvsObjectFamily,
  resolveExecutiveOvsObjectVisualLanguage,
  resolveExecutiveOvsPrimitive,
} from "./executiveOvsObjectVisualLanguage.ts";
import {
  EXECUTIVE_OVS_LIVE_PRIMARY_FORM_FAMILIES,
  EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY,
  EXECUTIVE_OVS_SEMANTIC_FORM_STATUS,
  resolveExecutiveOvsSemanticFormGrammar,
} from "./executiveOvsSemanticFormGrammar.ts";
import {
  EXECUTIVE_OVS_PROBLEM_PRISM,
  createExecutiveOvsProblemPrismGeometry,
  measureExecutiveOvsProblemPrism,
} from "./executiveOvsProblemPrismGeometry.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("1 — problem identity resolves the Problem family", () => {
  const form = resolveExecutiveOvsSemanticFormGrammar({
    objectKind: "problem",
    kind: "problem",
    id: "ctx-problem-capacity",
    label: "Capacity Gap",
  });
  assert.equal(form.family, "problem");
  assert.equal(form.cue, "problem");
  assert.equal(form.livePrimary, true);
});

test("2 — Problem family resolves prism", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem, "prism");
  assert.equal(resolveExecutiveOvsPrimitive("problem"), "prism");
  assert.equal(
    resolveExecutiveOvsObjectVisualLanguage({
      objectKind: "problem",
      enabled: true,
    }).primitive,
    "prism",
  );
});

test("3 — prism renders the constrained trapezoidal body, not a box", () => {
  const measure = measureExecutiveOvsProblemPrism(1.08, 0.78, 0.53);
  assert.equal(measure.isBox, false);
  assert.equal(measure.isDiamond, false);
  assert.equal(measure.isTrapezoid, true);
  assert.ok(measure.topWidth < measure.bottomWidth * 0.72);
  const geometry = createExecutiveOvsProblemPrismGeometry(1.08, 0.78, 0.53);
  assert.equal(
    geometry.getAttribute("position").count,
    EXECUTIVE_OVS_PROBLEM_PRISM.vertexCount,
  );
  assert.equal(
    geometry.getAttribute("position").count / 3,
    EXECUTIVE_OVS_PROBLEM_PRISM.triangleCount,
  );
  geometry.dispose();
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.match(body, /createExecutiveOvsProblemPrismGeometry/);
  assert.doesNotMatch(body, /case "prism":[\s\S]*boxGeometry args=\{\[width, height, depth\]\}/);
  assert.equal(
    EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.problemPrismIsBoxPlaceholder,
    false,
  );
  assert.equal(
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.certifiesProblemPrismAsDistinct,
    true,
  );
});

test("4 — Risk remains diamond", () => {
  assert.equal(resolveExecutiveOvsObjectFamily("risk"), "risk");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
});

test("5 — operational remains rounded-block", () => {
  assert.equal(resolveExecutiveOvsObjectFamily("object"), "operational");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
});

test("6 — ID and name do not select Problem", () => {
  assert.equal(
    resolveExecutiveOvsSemanticFormGrammar({
      id: "ctx-problem-capacity",
      kind: "object",
      label: "Capacity Gap",
    }).family,
    "operational",
  );
  assert.equal(
    resolveExecutiveOvsSemanticFormGrammar({
      id: "obj-other",
      kind: "object",
      objectKind: "problem",
      label: "Neutral Subject",
    }).family,
    "problem",
  );
  assert.equal(resolveExecutiveOvsObjectFamily("Capacity Gap"), "operational");
  assert.equal(resolveExecutiveOvsObjectFamily("problem-shaped"), "operational");
});

test("7 — state does not change the Problem primitive", () => {
  for (const status of ["stable", "watch", "unresolved", "risk"]) {
    const form = resolveExecutiveOvsSemanticFormGrammar({
      objectKind: "problem",
      kind: "problem",
      status,
    });
    assert.equal(form.primitive, "prism");
    assert.equal(
      resolveExecutiveOvsObjectStateVisual({
        status,
        objectKind: "problem",
      }).geometryPrimitive,
      "prism",
    );
  }
});

test("8 — theme does not change the Problem primitive", () => {
  const day = resolveExecutiveOvsSemanticFormGrammar({
    objectKind: "problem",
    theme: "day",
  });
  const night = resolveExecutiveOvsSemanticFormGrammar({
    objectKind: "problem",
    theme: "night",
  });
  assert.equal(day.primitive, night.primitive);
  assert.equal(day.family, "problem");
});

test("9 — DTH does not select Problem geometry", () => {
  const dth = resolveCanonicalExecutiveObjectType({
    id: "obj-capacity",
    kind: "object",
    label: "Capacity",
  });
  assert.equal(dth, "kpi");
  const form = resolveExecutiveOvsSemanticFormGrammar({
    id: "obj-capacity",
    kind: "object",
    label: "Capacity",
    dthCanonicalType: "problem",
  });
  assert.equal(form.family, "operational");
});

test("10 — generic fallback remains operational", () => {
  assert.equal(resolveExecutiveOvsObjectFamily("unknown"), "operational");
  assert.equal(resolveExecutiveOvsObjectFamily("widget"), "operational");
  assert.deepEqual([...EXECUTIVE_OVS_LIVE_PRIMARY_FORM_FAMILIES], [
    "operational",
    "risk",
    "problem",
  ]);
  const problemRowStatus = "LIVE";
  assert.equal(problemRowStatus, EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.LIVE);
});
