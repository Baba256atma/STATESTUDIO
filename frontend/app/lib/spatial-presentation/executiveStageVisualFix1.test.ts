/**
 * NPA-T STAGE-VISUAL:FIX1 — Object square/frame visual audit & repair.
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
import { EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS } from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY,
  resolveExecutiveOvsObjectStateVisual,
} from "./executiveOvsObjectStateVisual.ts";
import { EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES } from "./executiveObjectStateVisualHierarchy.ts";
import { EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY } from "./executiveOvsIsometricTheatreVisual.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  resolveExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";
import {
  EXECUTIVE_STAGE_DEEP_Z_RANGE,
} from "./executiveStageDeepZVisualEnvironment.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveObjectVisualPresentation } from "./executiveObjectVisualFoundation.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";

const here = dirname(fileURLToPath(import.meta.url));

function rendererSource(): string {
  return readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
}

function stageObjectSource(): string {
  return readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
}

function watchPresentation(objectId: string, objectKind: string) {
  return resolveExecutiveObjectVisualPresentation({
    objectId,
    objectKind,
    status: "watch",
    attention: "elevated",
    stateMarker: "attention",
    focused: false,
    selected: false,
    hovered: false,
  });
}

test("A — Square frame has one known owner: ExecutiveObjectEdgeGeometry", () => {
  const stage = stageObjectSource();
  const renderer = rendererSource();
  assert.match(stage, /ExecutiveObjectEdgeGeometry/);
  assert.match(stage, /edge\.mode !== "none" && edge\.wireframe/);
  assert.match(renderer, /export function ExecutiveObjectEdgeGeometry/);
  assert.doesNotMatch(renderer, /BoundingBoxRegistry|SelectionBoxSystem|EditorFrame/);
});

test("B — Frame appears for Watch attention edge, not as an unknown cue", () => {
  const watch = resolveExecutiveOvsObjectStateVisual({
    objectKind: "object",
    status: "watch",
  });
  const normal = resolveExecutiveOvsObjectStateVisual({
    objectKind: "object",
    status: "stable",
    attention: "normal",
    executiveVisualState: "normal",
  });
  assert.equal(watch.managementClass, "watch");
  assert.equal(watch.edgeStyle, "solid");
  assert.ok(watch.edgeOpacity > 0);
  assert.equal(normal.managementClass, "normal");
  assert.equal(normal.edgeStyle, "none");
  assert.equal(normal.edgeOpacity, 0);

  const visual = watchPresentation("obj-customer", "object");
  assert.equal(visual.edge.mode, "attention");
  assert.equal(visual.edge.wireframe, true);
  assert.equal(visual.edge.color, EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.edgeColor);
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.edgeColor, "#d4b45a");
});

test("C — Customer (operational rounded-block, Watch) does not use AABB edge", () => {
  const kind = projectExecutiveOvsObjectKindHandoff({
    id: "obj-customer",
    kind: "object",
  });
  const language = resolveExecutiveOvsObjectVisualLanguage({ objectKind: kind });
  assert.equal(language.family, "operational");
  assert.equal(language.primitive, "rounded-block");
  const visual = watchPresentation("obj-customer", kind);
  assert.equal(visual.edge.mode, "attention");
  assert.equal(visual.emphasis.focused, false);
  assert.equal(visual.emphasis.selected, false);
  assert.equal(visual.emphasis.hover, false);
  const renderer = rendererSource();
  assert.match(renderer, /if \(ovs\.enabled\) \{/);
  assert.doesNotMatch(
    renderer,
    /ovs\.primitive === "orb" \|\|[\s\S]*ovs\.primitive === "diamond"\)/,
  );
});

test("D — Capacity matches Customer: Watch rounded-block, no AABB owner split", () => {
  const kind = projectExecutiveOvsObjectKindHandoff({
    id: "obj-capacity",
    kind: "object",
  });
  const language = resolveExecutiveOvsObjectVisualLanguage({ objectKind: kind });
  assert.equal(language.primitive, "rounded-block");
  const visual = watchPresentation("obj-capacity", kind);
  assert.equal(visual.edge.mode, "attention");
  assert.equal(
    visual.edge.color,
    watchPresentation("obj-customer", "object").edge.color,
  );
});

test("E — Normal Object has no unexplained attention frame", () => {
  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-revenue",
    objectKind: "object",
    status: "stable",
    attention: "normal",
    stateMarker: "none",
    focused: false,
    selected: false,
    hovered: false,
  });
  assert.equal(visual.edge.mode, "none");
  assert.equal(visual.edge.wireframe, false);
});

test("F — Watch remains readable through certified OVS:2 / SP:2.4 cues", () => {
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceTint, 0.07);
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.edgeOpacity, 0.32);
  const ovs = resolveExecutiveOvsObjectStateVisual({ status: "watch" });
  assert.equal(ovs.edgeOpacity, 0.34);
  assert.equal(ovs.edgeExtent, 1.08);
});

test("G — Focus remains an independent interaction class", () => {
  const focused = resolveExecutiveOvsObjectStateVisual({
    status: "stable",
    focused: true,
  });
  const watch = resolveExecutiveOvsObjectStateVisual({
    status: "watch",
    focused: false,
  });
  assert.equal(focused.interactionClass, "focused");
  assert.equal(watch.managementClass, "watch");
  assert.notEqual(focused.interactionClass, watch.managementClass);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.ownsFocus, false);
});

test("H — Selected remains independent of Watch", () => {
  const selected = resolveExecutiveOvsObjectStateVisual({
    status: "stable",
    selected: true,
  });
  assert.equal(selected.interactionClass, "selected");
  assert.equal(selected.managementClass, "normal");
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.ownsSelection, false);
});

test("I — Hover does not invent an AABB; OVS edges stay primitive rings", () => {
  const hovered = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-customer",
    objectKind: "object",
    status: "stable",
    attention: "normal",
    stateMarker: "none",
    focused: false,
    selected: false,
    hovered: true,
  });
  assert.equal(hovered.edge.mode, "hover");
  assert.ok(hovered.edge.extentScale <= 1.12 + 1e-6);
  const renderer = rendererSource();
  assert.match(renderer, /rounded-block \/ prism must not fall through/);
});

test("J — Critical / Unresolved cues remain", () => {
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.surfaceTint, 0.18);
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.unresolved.surfaceTint, 0.08);
  const critical = resolveExecutiveOvsObjectStateVisual({ status: "risk" });
  const unresolved = resolveExecutiveOvsObjectStateVisual({
    executiveVisualState: "unresolved",
  });
  assert.equal(critical.managementClass, "critical");
  assert.ok(critical.edgeOpacity > 0);
  assert.equal(unresolved.managementClass, "unresolved");
  assert.ok(unresolved.edgeOpacity > 0);
});

test("K — Territory remains circular STAGE-OBJ:2; collection still skips broad halo", () => {
  const stage = stageObjectSource();
  assert.match(stage, /visualLayerRole: "state-territory"/);
  assert.match(stage, /!isCollectionMember/);
  assert.match(stage, /<ringGeometry/);
});

test("L — Geometry families unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.decision, "hex-prism");
});

test("M — Material palette unchanged", () => {
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor, "#4a5563");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.decision.baseColor, "#3f5868");
});

test("N — Label hierarchy unchanged", () => {
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.full, 0.96);
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.normal, 0.88);
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.hoverLift, 0.06);
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.minimal, 0.64);
});

test("O — Background atmosphere unchanged", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("neutral");
  assert.equal(visual.background, "#080c14");
  assert.equal(visual.groundColor, "#141b26");
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent, 48);
  assert.equal(getNexoraMVPSceneEnvironmentIntent("overview"), "neutral");
});

test("P — Camera / XY / Z unchanged", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.semanticPlaneZ, 0);
});

test("Q — Director / Nexo unchanged", () => {
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
});

test("R — No new frame/selection/territory authority", () => {
  const renderer = rendererSource();
  assert.doesNotMatch(
    renderer,
    /FrameRegistry|SelectionBoxSystem|TerritoryEngineV2|BoundingBoxCue/,
  );
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.particleCount, 0);
});
