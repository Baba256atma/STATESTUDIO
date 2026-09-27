/**
 * NPA-T OBJECT-TYPE-3D:HANDOFF-FIX1 — identity-safe OVS family projection.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { resolveCanonicalExecutiveObjectType } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import { NEXORA_MVP_CANONICAL_RISK_OBJECT_ID } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import {
  resolveExecutiveOvsObjectFamily,
  resolveExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";

const here = dirname(fileURLToPath(import.meta.url));

function ovsFromHandoff(input: { readonly id: string; readonly kind: string }) {
  const objectKind = projectExecutiveOvsObjectKindHandoff(input);
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind,
    enabled: true,
  });
  return Object.freeze({
    objectKind,
    family: language.family,
    primitive: language.primitive,
  });
}

test("A — Capacity remains operational rounded-block", () => {
  const result = ovsFromHandoff({ id: "obj-capacity", kind: "object" });
  assert.equal(result.objectKind, "object");
  assert.equal(result.family, "operational");
  assert.equal(result.primitive, "rounded-block");
});

test("B — Customer remains operational rounded-block", () => {
  const result = ovsFromHandoff({ id: "obj-customer", kind: "object" });
  assert.equal(result.objectKind, "object");
  assert.equal(result.family, "operational");
  assert.equal(result.primitive, "rounded-block");
});

test("C — Risk identity is risk → diamond", () => {
  const result = ovsFromHandoff({
    id: NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
    kind: "object",
  });
  assert.equal(result.objectKind, "risk");
  assert.equal(result.family, "risk");
  assert.equal(result.primitive, "diamond");
});

test("D — Risk does not depend on the display label", () => {
  const objectKind = projectExecutiveOvsObjectKindHandoff({
    id: NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
    kind: "object",
  });
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind,
    enabled: true,
  });
  assert.equal(objectKind, "risk");
  assert.equal(language.primitive, "diamond");
  assert.equal(resolveExecutiveOvsObjectFamily("Exposure Watch object"), "operational");
});

test("E — A non-Risk Object whose display text contains risk stays operational", () => {
  const objectKind = projectExecutiveOvsObjectKindHandoff({
    id: "obj-delivery",
    kind: "object",
  });
  assert.equal(objectKind, "object");
  assert.equal(objectKind.includes("risk"), false);
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind,
    enabled: true,
  });
  assert.equal(language.family, "operational");
  assert.equal(language.primitive, "rounded-block");
});

test("F — DTH KPI grouping does not enter OVS for operational Objects", () => {
  const operational = [
    "obj-revenue",
    "obj-capacity",
    "obj-budget",
    "obj-demand",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ] as const;
  for (const id of operational) {
    const dth = resolveCanonicalExecutiveObjectType({
      id,
      kind: "object",
      label: id.replace("obj-", ""),
    });
    assert.equal(dth, "kpi", id);
    const result = ovsFromHandoff({ id, kind: "object" });
    assert.equal(result.objectKind, "object", id);
    assert.equal(result.family, "operational", id);
    assert.equal(result.primitive, "rounded-block", id);
  }
});

test("G — True subject kind kpi still reaches the KPI cylinder", () => {
  const result = ovsFromHandoff({ id: "kpi-availability", kind: "kpi" });
  assert.equal(result.objectKind, "kpi");
  assert.equal(result.family, "kpi");
  assert.equal(result.primitive, "cylinder");
});

test("H — Stage Object and OVS:3 share the identity-safe projection helper", () => {
  const stage = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  const isometric = readFileSync(
    join(here, "./executiveOvsIsometricTheatreVisual.ts"),
    "utf8",
  );
  assert.match(stage, /projectExecutiveOvsObjectKindHandoff/);
  assert.match(isometric, /projectExecutiveOvsObjectKindHandoff/);
  assert.doesNotMatch(stage, /presentation\.id,\s*\n\s*presentation\.label/);
});
