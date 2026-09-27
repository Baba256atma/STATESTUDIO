/**
 * NPA-T OVS:2 — Object State & Interaction Visuals tests A–I.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "./executiveOvsObjectVisualLanguage.ts";
import { EXECUTIVE_STAGE_MOTION } from "./executiveStageMotion.ts";
import {
  EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY,
  EXECUTIVE_OVS_UNAVAILABLE_STATE_SIGNALS,
  getExecutiveOvsObjectStateVisualIdentity,
  resolveExecutiveOvsObjectStateVisual,
  verifyExecutiveOvsObjectStateVisual,
} from "./executiveOvsObjectStateVisual.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("OVS:2 identity / I — no duplicate authority", () => {
  const identity = getExecutiveOvsObjectStateVisualIdentity();
  assert.equal(identity.id, "NPA-T OVS:2/ObjectStateInteractionVisuals");
  assert.equal(verifyExecutiveOvsObjectStateVisual(), true);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.ownsSelection, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.inventsBusinessStates, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.independentUseFrame, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
  assert.match(EXECUTIVE_OVS_UNAVAILABLE_STATE_SIGNALS.executingActive, /no authoritative/);
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /resolveExecutiveOvsObjectStateVisual/);
  assert.doesNotMatch(renderer, /<Canvas/);
  const moduleSource = readFileSync(
    join(here, "./executiveOvsObjectStateVisual.ts"),
    "utf8",
  );
  assert.doesNotMatch(moduleSource, /useFrame\(/);
  assert.doesNotMatch(moduleSource, /from "@react-three\/fiber"/);
});

test("A — Existing signals resolve deterministically", () => {
  const a = resolveExecutiveOvsObjectStateVisual({
    status: "watch",
    attention: "elevated",
  });
  const b = resolveExecutiveOvsObjectStateVisual({
    status: "watch",
    attention: "elevated",
  });
  assert.equal(a.managementClass, "watch");
  assert.deepEqual(a, b);
  assert.equal(
    resolveExecutiveOvsObjectStateVisual({ status: "risk" }).managementClass,
    "critical",
  );
  assert.equal(
    resolveExecutiveOvsObjectStateVisual({
      executiveVisualState: "unresolved",
    }).managementClass,
    "unresolved",
  );
  assert.equal(
    resolveExecutiveOvsObjectStateVisual({ attention: "critical" }).managementClass,
    "critical",
  );
});

test("B — Normal baseline is the calm OVS:1 presentation", () => {
  const baseline = resolveExecutiveOvsObjectStateVisual({
    status: "stable",
    attention: "normal",
    executiveVisualState: "normal",
  });
  assert.equal(baseline.managementClass, "normal");
  assert.equal(baseline.interactionClass, "idle");
  assert.equal(baseline.edgeStyle, "none");
  assert.equal(baseline.edgeOpacity, 0);
  assert.equal(baseline.depthBias, 0);
  assert.equal(baseline.opacityScale, 1);
  assert.equal(baseline.emissiveScale, 1);
  assert.equal(baseline.motionHint, "none");
});

test("C — Watch vs Critical are visually distinct", () => {
  const watch = resolveExecutiveOvsObjectStateVisual({ status: "watch" });
  const critical = resolveExecutiveOvsObjectStateVisual({ status: "risk" });
  assert.equal(watch.managementClass, "watch");
  assert.equal(critical.managementClass, "critical");
  assert.ok(critical.emissiveScale > watch.emissiveScale);
  assert.ok(critical.edgeOpacity > watch.edgeOpacity);
  assert.ok(critical.edgeExtent > watch.edgeExtent);
  assert.ok(critical.maxEmissive >= watch.maxEmissive);
});

test("D — Selection does not change identity or geometry family", () => {
  const idle = resolveExecutiveOvsObjectStateVisual({
    objectKind: "risk",
    status: "watch",
  });
  const selected = resolveExecutiveOvsObjectStateVisual({
    objectKind: "risk",
    status: "watch",
    selected: true,
  });
  assert.equal(idle.geometryFamily, "risk");
  assert.equal(idle.geometryPrimitive, "diamond");
  assert.equal(selected.geometryFamily, idle.geometryFamily);
  assert.equal(selected.geometryPrimitive, idle.geometryPrimitive);
  assert.equal(selected.managementClass, "watch");
  assert.equal(selected.interactionClass, "selected");
});

test("E — Critical + Selected keeps critical meaning and adds emphasis", () => {
  const critical = resolveExecutiveOvsObjectStateVisual({ status: "risk" });
  const both = resolveExecutiveOvsObjectStateVisual({
    status: "risk",
    selected: true,
  });
  assert.equal(both.managementClass, "critical");
  assert.equal(both.interactionClass, "selected");
  assert.ok(both.emissiveScale > critical.emissiveScale);
  assert.ok(both.depthBias > critical.depthBias);
  assert.ok(both.edgeOpacity > critical.edgeOpacity);
});

test("F — Reduced motion keeps meaning on static channels", () => {
  const moving = resolveExecutiveOvsObjectStateVisual({
    status: "risk",
    reducedMotion: false,
  });
  const still = resolveExecutiveOvsObjectStateVisual({
    status: "risk",
    reducedMotion: true,
  });
  assert.equal(still.motionHint, "none");
  assert.equal(moving.motionHint, "none");
  assert.equal(still.managementClass, "critical");
  assert.equal(still.edgeOpacity, moving.edgeOpacity);
  assert.equal(still.emissiveScale, moving.emissiveScale);
  assert.equal(EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs, 80);
});

test("G — OVS:1 family/primitive mapping is unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.goal, "orb");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.kpi, "cylinder");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.problem, "prism");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.scenario, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.decision, "hex-prism");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.execution, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.outcome, "ring");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.context, "orb");
  const goal = resolveExecutiveOvsObjectStateVisual({
    objectKind: "goal",
    status: "risk",
    focused: true,
  });
  assert.equal(goal.geometryPrimitive, "orb");
  assert.equal(goal.managementClass, "critical");
});

test("H — Operational fallback still carries state visuals", () => {
  const unknown = resolveExecutiveOvsObjectStateVisual({
    objectKind: "unmapped-widget-xyz",
    status: "watch",
    selected: true,
  });
  assert.equal(unknown.geometryFamily, "operational");
  assert.equal(unknown.geometryPrimitive, "rounded-block");
  assert.equal(unknown.managementClass, "watch");
  assert.equal(unknown.interactionClass, "selected");
  assert.ok(unknown.edgeOpacity > 0);
});
