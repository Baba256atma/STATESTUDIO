/**
 * NPA-T STAGE-VISUAL:POLISH-1 — background depth, ring restraint, label consistency.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getNexoraMVPSceneEnvironmentIntent } from "../nex-mvp/nexoraMVPApplicationFoundation.ts";
import {
  NEXORA_MVP_STAGE_ATMOSPHERE_FIELD,
  deriveNexoraMVPSceneEnvironmentVisualState,
} from "../nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { EXECUTIVE_OBJECT_MATERIAL_PROFILES } from "./executiveObjectMaterialSurface.ts";
import {
  EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY,
  EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS,
  resolveExecutiveObjectLabelPresentation,
} from "./executiveObjectLabelInformationDensity.ts";
import { EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY } from "./executiveOvsObjectStateVisual.ts";
import { EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES } from "./executiveObjectStateVisualHierarchy.ts";
import { EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY } from "./executiveOvsIsometricTheatreVisual.ts";
import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "./executiveOvsObjectVisualLanguage.ts";
import {
  EXECUTIVE_STAGE_DEEP_Z_RANGE,
  EXECUTIVE_STAGE_DEEP_Z_BOUNDARY,
} from "./executiveStageDeepZVisualEnvironment.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";

const here = dirname(fileURLToPath(import.meta.url));

function hexLuminance(hex: string): number {
  const raw = hex.replace("#", "");
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

test("A — Atmosphere authority remains the existing environment path", () => {
  assert.equal(getNexoraMVPSceneEnvironmentIntent("overview"), "neutral");
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
    "utf8",
  );
  assert.match(controller, /NexoraSceneEnvironmentController/);
  assert.doesNotMatch(controller, /AtmosphereEngine|WorkspaceMoodStore|StageBackgroundV2/);
});

test("B — Continuous field preserved; radius-9 disc not restored", () => {
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent, 48);
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.circleRadius9Retired, true);
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
    "utf8",
  );
  assert.doesNotMatch(controller, /circleGeometry args=\{\[9, 64\]\}/);
  assert.match(controller, /planeGeometry/);
});

test("C — Neutral background and field are measurably distinct and dark", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("neutral");
  const bg = hexLuminance(visual.background);
  const field = hexLuminance(visual.groundColor);
  assert.ok(field > bg, "field should be lighter than void");
  assert.ok(field < 50, "field remains dark");
  assert.ok(bg < 40, "background remains dark");
  assert.notEqual(visual.background, "#000000");
});

test("D — Five intents remain distinct and restrained", () => {
  const intents = ["neutral", "investigate", "simulate", "commit", "execute"] as const;
  const fills = intents.map((intent) =>
    deriveNexoraMVPSceneEnvironmentVisualState(intent).fillLightColor.toLowerCase(),
  );
  assert.equal(new Set(fills).size, 5);
  assert.ok(!fills.includes("#c07070"));
  assert.ok(!fills.includes("#a5b4fc"));
  assert.ok(!fills.includes("#fcd34d"));
  assert.ok(!fills.includes("#86efac"));
  for (const intent of intents) {
    assert.equal(
      deriveNexoraMVPSceneEnvironmentVisualState(intent).keyLightColor,
      "#f3f5f7",
    );
  }
});

test("E — Family material protection", () => {
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor, "#4a5563");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.decision.baseColor, "#3f5868");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.execution.baseColor, "#3f5a58");
});

test("F — Ring ownership maps to existing systems", () => {
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.inventsBusinessStates, false);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.isNexoraObject, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
});

test("G — State rings remain ordered", () => {
  assert.ok(
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.edgeOpacity >
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.edgeOpacity,
  );
  assert.ok(
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.edgeOpacity >
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.normal.edgeOpacity,
  );
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceTint, 0.07);
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.surfaceTint, 0.18);
});

test("H — Focus/selection remains an interaction class, not a new ring system", () => {
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.ownsFocus, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.ownsSelection, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
});

test("I — Deep-Z decorative rings/particles no longer dominate", () => {
  assert.ok(EXECUTIVE_STAGE_DEEP_Z_RANGE.rings.length <= 2);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.particleCount, 0);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.radialSegmentCount, 0);
  for (const ring of EXECUTIVE_STAGE_DEEP_Z_RANGE.rings) {
    assert.ok(ring.opacity <= 0.03);
    assert.ok(ring.z < 0);
  }
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.decorativeSubordinateToSemanticRings, true);
});

test("J — Contact grounding is darker/weaker than state rings", () => {
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.match(body, /ContactPresence/);
  assert.match(body, /opacity=\{0\.14\}/);
  assert.match(body, /#050910/);
  assert.ok(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.edgeOpacity >= 0.3);
});

test("K — Normal active label is readable without hover", () => {
  const idle = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-revenue",
    objectName: "Revenue",
    objectKind: "kpi",
    spatialRole: "overview",
    status: "stable",
  });
  assert.ok(idle.opacity >= EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.normal);
  assert.equal(idle.tone, "object.label.primary");
  assert.ok(idle.visible);
});

test("L — Hover provides only bounded emphasis", () => {
  const idle = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-revenue",
    objectName: "Revenue",
    spatialRole: "overview",
    status: "stable",
  });
  const hovered = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-revenue",
    objectName: "Revenue",
    spatialRole: "overview",
    status: "stable",
    hovered: true,
  });
  assert.ok(hovered.opacity - idle.opacity <= 0.08 + 1e-6);
  assert.ok(hovered.opacity > idle.opacity || hovered.level !== idle.level);
  assert.equal(hovered.tone, idle.tone);
  assert.notEqual(hovered.level, "detail");
});

test("M — Focused label is stronger than normal, not glowing", () => {
  const idle = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-revenue",
    objectName: "Revenue",
    spatialRole: "overview",
    status: "stable",
  });
  const focused = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-revenue",
    objectName: "Revenue",
    spatialRole: "focus",
    focused: true,
    selected: true,
    status: "stable",
  });
  assert.ok(focused.opacity >= idle.opacity);
  assert.equal(focused.prominence, "full");
  assert.equal(focused.tone, "object.label.primary");
});

test("N — De-emphasized background label remains readable", () => {
  const background = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-inventory",
    objectName: "Inventory",
    spatialRole: "background",
    status: "stable",
  });
  assert.equal(background.prominence, "minimal");
  assert.ok(background.opacity >= EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.minimal);
  assert.ok(background.opacity < EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.full);
  assert.equal(background.tone, "object.label.secondary");
});

test("O — No per-Object label hacks", () => {
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.usesLabelNameHacks,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.usesObjectIdLabelHacks,
    false,
  );
  const source = readFileSync(
    join(here, "./executiveObjectLabelInformationDensity.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /objectName === ["']Revenue["']/);
  assert.doesNotMatch(source, /Margin Pressure|Demand Surge|Pricing Response|Approve Repricing/);
});

test("P — Camera / XY / Z unchanged", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.semanticPlaneZ, 0);
});

test("Q — Nexo / Director unchanged", () => {
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
});

test("R — No new authority", () => {
  const files = [
    "./executiveObjectLabelInformationDensity.ts",
    "./executiveStageDeepZVisualEnvironment.ts",
    "../nex-mvp/nexoraMVPWorkspacePresentation.ts",
  ];
  for (const file of files) {
    const source = readFileSync(join(here, file), "utf8");
    assert.doesNotMatch(
      source,
      /PaletteEngine|RingRegistry|LabelSystemV2|AtmosphereEngine|WorkspaceMoodStore/,
    );
  }
});
