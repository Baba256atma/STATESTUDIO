/**
 * NPA-T VISUAL-POLISH:1 — shared Object surface polish. Presentation only.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_MATERIAL_LANGUAGE,
  EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY,
  resolveExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";
import { resolveExecutiveOvsObjectStateVisual } from "./executiveOvsObjectStateVisual.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("A — Geometry identity is unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.kpi, "cylinder");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem, "prism");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.decision, "hex-prism");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.outcome, "ring");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.goal, "orb");
  const operational = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "object",
    enabled: true,
  });
  const risk = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "risk",
    enabled: true,
  });
  assert.equal(operational.primitive, "rounded-block");
  assert.equal(risk.primitive, "diamond");
});

test("B — OVS:2 still owns semantic state treatment", () => {
  const stable = resolveExecutiveOvsObjectStateVisual({ status: "stable" });
  const watch = resolveExecutiveOvsObjectStateVisual({ status: "watch" });
  const unresolved = resolveExecutiveOvsObjectStateVisual({
    status: "unresolved",
  });
  assert.equal(stable.managementClass, "normal");
  assert.equal(watch.managementClass, "watch");
  assert.equal(unresolved.managementClass, "unresolved");
  assert.ok(watch.emissiveScale > stable.emissiveScale);
  assert.ok(unresolved.roughnessBias > watch.roughnessBias);
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /ovsState\.emissiveScale/);
  assert.match(renderer, /ovsState\.roughnessBias/);
});

test("C — Polish does not create Object authority", () => {
  assert.equal(EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.ownsObjectCatalog, false);
  const language = readFileSync(join(here, "./executiveOvsObjectVisualLanguage.ts"), "utf8");
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  for (const source of [language, body]) {
    assert.doesNotMatch(source, /managerObjectCatalog/);
    assert.doesNotMatch(source, /kind:\s*"operational"/);
  }
});

test("D — No independent animation loop", () => {
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  const language = readFileSync(join(here, "./executiveOvsObjectVisualLanguage.ts"), "utf8");
  assert.doesNotMatch(body, /useFrame/);
  assert.match(body, /ContactPresence/);
  assert.match(body, /raycast=\{\(\) => null\}/);
  assert.doesNotMatch(language, /useFrame/);
});

test("E — Shared rendering: no per-Object lights", () => {
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  for (const source of [body, renderer]) {
    assert.doesNotMatch(source, /<pointLight|<spotLight|<directionalLight/);
  }
  assert.ok(EXECUTIVE_OVS_MATERIAL_LANGUAGE.metalness < 0.4);
  assert.ok(EXECUTIVE_OVS_MATERIAL_LANGUAGE.roughness > 0.35);
  assert.ok(EXECUTIVE_OVS_MATERIAL_LANGUAGE.emissiveScale < 0.5);
});

test("F — Single Canvas is preserved", () => {
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.equal(canvas.split("<Canvas").length - 1, 1);
});

test("G — OVS:3 structures remain visual-only", () => {
  const structures = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsIsometricTheatreStructures.tsx"),
    "utf8",
  );
  assert.match(structures, /isCanonicalObject: false/);
  assert.match(structures, /canonicalObjectId: null/);
});
