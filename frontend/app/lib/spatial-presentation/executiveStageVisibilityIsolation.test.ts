/**
 * NPA-T STAGE-VISIBILITY:FIX1 — Object occlusion, dark-field & workspace isolation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { NEXORA_MVP_STAGE_ATMOSPHERE_FIELD } from "../nex-mvp/nexoraMVPWorkspacePresentation.ts";
import {
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";
import { executiveStageSafeViewportCameraFitIdentity } from "./executiveStageSafeViewportCameraFit.ts";
import { executiveThreadCollapseControlPlacementIdentity } from "./executiveThreadExpansion.ts";
import { EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY } from "./executiveStageObjectLabelTerritory.ts";
import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "./executiveOvsObjectVisualLanguage.ts";
import { resolveExecutiveCollectionLayout } from "./executiveStageQueueFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));

const environment = readFileSync(
  join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
  "utf8",
);
const stageMount = readFileSync(
  join(here, "../../executive/nex-mvp/NexoraStageMount.tsx"),
  "utf8",
);
const stage3d = readFileSync(
  join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
  "utf8",
);
const shell = readFileSync(
  join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
  "utf8",
);
const detail = readFileSync(
  join(here, "../../executive/nex-mvp/scene-org/NexoraWorkspaceRegionBoundary.tsx"),
  "utf8",
);
const label = readFileSync(
  join(here, "../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx"),
  "utf8",
);
const deepZ = readFileSync(
  join(here, "../../executive/nex-mvp/stage/NexoraStageDeepZEnvironment.tsx"),
  "utf8",
);
const cameraFit = readFileSync(
  join(here, "./executiveStageSafeViewportCameraFit.ts"),
  "utf8",
);
const thread = readFileSync(
  join(here, "./executiveThreadExpansion.ts"),
  "utf8",
);
const ovs = readFileSync(
  join(here, "./executiveOvsObjectVisualLanguage.ts"),
  "utf8",
);

test("A — Capacity Expansion remains a Stage Object, not caption-only (generic collection members)", () => {
  const layout = resolveExecutiveCollectionLayout({
    objectIds: [
      "ctx-scenario-capacity",
      "ctx-scenario-demand",
      "ctx-scenario-pricing",
    ],
  });
  for (const id of [
    "ctx-scenario-capacity",
    "ctx-scenario-demand",
    "ctx-scenario-pricing",
  ]) {
    assert.ok(layout.positions[id], id);
    assert.equal(layout.positions[id]!.z, 0);
  }
  assert.match(environment, /depthWrite=\{false\}/);
  assert.match(environment, /depthTest=\{false\}/);
});

test("B/C — Demand Surge and Pricing Response keep semantic Z 0; field cannot depth-occlude", () => {
  assert.equal(EXECUTIVE_STAGE_2D_DEPTH, 0);
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.positionY, -2.4);
  assert.match(environment, /renderOrder=\{-30\}/);
  assert.match(environment, /stageVisibilityLayer: "environment-background"/);
  assert.doesNotMatch(environment, /Demand Surge|Pricing Response|ctx-scenario-demand/);
});

test("D — STAGE-LABEL:FIX1 caption contract unchanged", () => {
  assert.match(label, /data-object-caption="primary"/);
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.movesObjects, false);
  assert.doesNotMatch(label, /zIndexRange=\{\[16777271/);
});

test("E — Horizontal field is VS:3 merged-ground, not a depth wall", () => {
  assert.match(environment, /stageAtmosphereField: "merged-ground"/);
  assert.match(environment, /position=\{\[0, 0, -6\]\}/);
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.mergesIntoBackground, true);
});

test("F/G/H — Detail Workspace isolates Stage Canvas, Html, and pointers", () => {
  assert.match(shell, /stageSurfaceActive=\{!detailWorkspaceOpen\}/);
  assert.match(stageMount, /data-stage-surface-active/);
  assert.match(stageMount, /visibility: stageSurfaceActive \? "visible" : "hidden"/);
  assert.match(stageMount, /pointerEvents: stageSurfaceActive \? "auto" : "none"/);
  assert.match(detail, /aria-label="Detail Workspace"/);
  assert.match(detail, /zIndex: 40/);
});

test("I — No ghost Stage hit targets while Detail is active", () => {
  assert.match(stageMount, /pointerEvents: stageSurfaceActive \? "auto" : "none"/);
  assert.match(stageMount, /aria-hidden=\{stageSurfaceActive \? undefined : true\}/);
});

test("J/K — Closing Detail restores the same Stage mount (not a second Canvas)", () => {
  assert.equal((shell.match(/<NexoraStageMount/g) ?? []).length, 1);
  assert.doesNotMatch(stageMount, /createRoot|second canvas/i);
});

test("L — STAGE-THREAD:FIX1 identity preserved", () => {
  assert.equal(
    executiveThreadCollapseControlPlacementIdentity,
    "STAGE-THREAD:FIX1/CollapseThreadControlPlacement",
  );
  assert.doesNotMatch(environment, /Collapse Thread|thread-gateway/);
  assert.doesNotMatch(thread, /STAGE-VISIBILITY:FIX1/);
});

test("M — STAGE-CAMERA:FIX1 pose character preserved", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
  assert.equal(
    executiveStageSafeViewportCameraFitIdentity,
    "NPA-T STAGE-CAMERA:FIX1/SafeViewportCameraFit",
  );
  assert.doesNotMatch(cameraFit, /STAGE-VISIBILITY:FIX1/);
});

test("N — Object XY/Z protection", () => {
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.changesSemanticZ, false);
  assert.doesNotMatch(environment, /targetPosition\[2\]\s*=/);
  assert.doesNotMatch(stageMount, /object\.z\s*=/);
});

test("O — Director / Nexo files not rewritten as visibility", () => {
  assert.doesNotMatch(environment, /selectDirectorNexoFamily|DIR:1/);
  assert.doesNotMatch(stageMount, /dthExpSelectDirectorNexoFamily/);
});

test("P — OVS family geometry unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.scenario, "rounded-block");
  assert.doesNotMatch(ovs, /STAGE-VISIBILITY:FIX1/);
});

test("Q — Isolation is generic, not collection-specific", () => {
  assert.doesNotMatch(environment, /if \(.*scenario/);
  assert.doesNotMatch(stageMount, /Demand Surge|Pricing Response|Capacity Expansion/);
  assert.match(stage3d, /isolation: "isolate"/);
});

test("R — no new visibility store / label / depth / workspace router", () => {
  assert.doesNotMatch(stageMount, /createVisibilityStore|useVisibilityRegistry/);
  assert.doesNotMatch(environment, /VISUAL-SYSTEM:4/);
  assert.match(deepZ, /STAGE-DEPTH:1/);
  assert.match(deepZ, /depthWrite=\{false\}/);
});
