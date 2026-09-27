/**
 * NPA-T VISUAL-SYSTEM:3 — Stage atmosphere & context field (focused A–Q).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
} from "../spatial-presentation/executiveOvsObjectVisualLanguage.ts";
import { EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY } from "../spatial-presentation/executiveOvsObjectStateVisual.ts";
import { EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY } from "../spatial-presentation/executiveOvsIsometricTheatreVisual.ts";
import { EXECUTIVE_OBJECT_MATERIAL_PROFILES } from "../spatial-presentation/executiveObjectMaterialSurface.ts";
import { EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES } from "../spatial-presentation/executiveObjectStateVisualHierarchy.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import { getNexoraMVPSceneEnvironmentIntent } from "./nexoraMVPApplicationFoundation.ts";
import {
  NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE,
  NEXORA_MVP_STAGE_ATMOSPHERE_FIELD,
  NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY,
  NEXORA_MVP_WORKSPACE_TRANSITION_MS,
  NEXORA_MVP_WORKSPACE_TRANSITION_MS_REDUCED,
  deriveNexoraMVPSceneEnvironmentVisualState,
} from "./nexoraMVPWorkspacePresentation.ts";

const here = dirname(fileURLToPath(import.meta.url));

const INTENTS = [
  "neutral",
  "investigate",
  "simulate",
  "commit",
  "execute",
] as const;

test("A — Existing environmentIntent remains sole management-context signal", () => {
  assert.equal(getNexoraMVPSceneEnvironmentIntent("overview"), "neutral");
  assert.equal(getNexoraMVPSceneEnvironmentIntent("problem"), "investigate");
  assert.equal(getNexoraMVPSceneEnvironmentIntent("scenario"), "simulate");
  assert.equal(getNexoraMVPSceneEnvironmentIntent("decision"), "commit");
  assert.equal(getNexoraMVPSceneEnvironmentIntent("execution"), "execute");
  assert.equal(
    NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY.ownsWorkspaceAuthority,
    false,
  );
});

test("B — All five intents resolve deterministic environment presentation", () => {
  for (const intent of INTENTS) {
    const a = deriveNexoraMVPSceneEnvironmentVisualState(intent);
    const b = deriveNexoraMVPSceneEnvironmentVisualState(intent);
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    assert.equal(a.intent, intent);
    assert.ok(a.background.startsWith("#"));
    assert.ok(a.groundColor.startsWith("#"));
    assert.ok(a.fillLightColor.startsWith("#"));
  }
});

test("C — Neutral uses deep graphite/navy", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("neutral");
  assert.equal(visual.background, "#080c14");
  assert.equal(visual.groundColor, "#141b26");
  assert.notEqual(visual.background, visual.groundColor);
  assert.equal(visual.objectSurfaceTreatment, "balanced");
  assert.notEqual(visual.background.toLowerCase(), "#000000");
});

test("D — Investigate is cooler/deeper but not risk-red", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("investigate");
  assert.equal(visual.background, "#070d16");
  assert.equal(visual.fillLightColor, "#7a93b0");
  assert.doesNotMatch(visual.background, /#c0|#d0|#e0|#f0|#ff|#c07|#d08/i);
  assert.notEqual(visual.fillLightColor.toLowerCase(), "#c07070");
});

test("E — Simulate is restrained graphite-indigo", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("simulate");
  assert.equal(visual.background, "#090c16");
  assert.equal(visual.fillLightColor, "#7d86a6");
  assert.notEqual(visual.fillLightColor.toLowerCase(), "#a5b4fc");
});

test("F — Commit is restrained deep blue/indigo, not gold", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("commit");
  assert.equal(visual.background, "#080c16");
  assert.equal(visual.fillLightColor, "#6d82a8");
  assert.notEqual(visual.fillLightColor.toLowerCase(), "#fcd34d");
  assert.notEqual(visual.groundColor.toLowerCase(), "#fcd34d");
});

test("G — Execute is restrained steel/teal, not bright green", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("execute");
  assert.equal(visual.background, "#080e10");
  assert.equal(visual.fillLightColor, "#6d8a86");
  assert.notEqual(visual.fillLightColor.toLowerCase(), "#86efac");
  assert.notEqual(visual.groundColor.toLowerCase(), "#86efac");
});

test("H — Context does not alter Object family material tokens", () => {
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor, "#4a5563");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.goal.baseColor, "#445a72");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.kpi.baseColor, "#3f5c6e");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.risk_problem.baseColor, "#5a5248");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.risk.baseColor, "#5a454c");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.scenario.baseColor, "#4f4a62");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.decision.baseColor, "#3f5868");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.execution.baseColor, "#3f5a58");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.outcome.baseColor, "#42564e");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.context.baseColor, "#4e5a66");
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.encodesObjectFamily, false);
});

test("I — Context does not alter Object state", () => {
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceTint, 0.07);
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.surfaceTint, 0.18);
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.unresolved.surfaceTint, 0.08);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.encodesObjectState, false);
  assert.equal(NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY.encodesObjectState, false);
});

test("J — Camera unchanged", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
});

test("K — XY unchanged (atmosphere does not write composition)", () => {
  const presentation = readFileSync(
    join(here, "./nexoraMVPWorkspacePresentation.ts"),
    "utf8",
  );
  assert.doesNotMatch(presentation, /positionFor|composeStage|spacingOverride/);
});

test("L — semantic Z unchanged", () => {
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.positionY, -2.4);
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
    "utf8",
  );
  assert.doesNotMatch(controller, /semanticZ|object\.z\s*=/);
});

test("M — OVS:3 / Nexo selection unchanged", () => {
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.decision, "hex-prism");
  const presentation = readFileSync(
    join(here, "./nexoraMVPWorkspacePresentation.ts"),
    "utf8",
  );
  assert.doesNotMatch(presentation, /NEXO_RISK|selectDirectorNexoFamily/);
});

test("N — reduced-motion transition uses existing policy", () => {
  const reduced = deriveNexoraMVPSceneEnvironmentVisualState("commit", {
    reducedMotion: true,
  });
  assert.equal(reduced.transitionMs, NEXORA_MVP_WORKSPACE_TRANSITION_MS_REDUCED);
  assert.equal(reduced.transitionMs, 80);
  assert.equal(reduced.background, deriveNexoraMVPSceneEnvironmentVisualState("commit").background);
});

test("O — normal transition uses existing environment interpolation", () => {
  const visual = deriveNexoraMVPSceneEnvironmentVisualState("neutral");
  assert.equal(visual.transitionMs, NEXORA_MVP_WORKSPACE_TRANSITION_MS);
  assert.equal(visual.transitionMs, 450);
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
    "utf8",
  );
  assert.match(controller, /environment\.transitionMs/);
  assert.match(controller, /\.lerp\(/);
  assert.doesNotMatch(controller, /bloom|OrbitControls|particle/i);
});

test("P — large Stage disc is no longer visibly defining the Stage", () => {
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.circleRadius9Retired, true);
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.visibleCircularBoundary, false);
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.geometry, "plane");
  assert.ok(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent > 20);
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
    "utf8",
  );
  assert.doesNotMatch(controller, /circleGeometry args=\{\[9, 64\]\}/);
  assert.match(controller, /planeGeometry/);
});

test("Q — no new atmosphere/theme/context authority", () => {
  const presentation = readFileSync(
    join(here, "./nexoraMVPWorkspacePresentation.ts"),
    "utf8",
  );
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
    "utf8",
  );
  for (const source of [presentation, controller]) {
    assert.doesNotMatch(source, /AtmosphereEngine|WorkspaceMoodStore|VisualEnvironmentManager|StageBackgroundV2/);
    assert.doesNotMatch(source, /create another Canvas|new THREE\.Scene/);
  }
  assert.ok("neutral" in NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE);
  assert.equal(Object.keys(NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE).length, 5);
});
