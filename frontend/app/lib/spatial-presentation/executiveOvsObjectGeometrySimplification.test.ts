/**
 * NPA-T VISUAL-SYSTEM:1 — OVS:1 geometry simplification (focused A–L).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { NEXORA_MVP_CANONICAL_RISK_OBJECT_ID } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import {
  applyExecutiveStage2DTopologyPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import {
  applyExecutiveStage2DTopologyRecompositionToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_OVS_DEPTH_FACTOR_BY_FAMILY,
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_MATERIAL_LANGUAGE,
  EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION,
  EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY,
  resolveExecutiveOvsObjectFamily,
  resolveExecutiveOvsObjectVisualLanguage,
  resolveExecutiveOvsPrimitive,
  verifyExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";
import { EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY } from "./executiveOvsObjectStateVisual.ts";
import { EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY } from "./executiveOvsIsometricTheatreVisual.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomp =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  return applyExecutiveStageFixedCameraToStagePresentation(withRecomp);
}

function languageOf(kind: string) {
  return resolveExecutiveOvsObjectVisualLanguage({
    objectKind: kind,
    width: 1,
    height: 1,
    enabled: true,
  });
}

test("A — Family → primitive mapping unchanged", () => {
  assert.equal(verifyExecutiveOvsObjectVisualLanguage(), true);
  const expected = {
    operational: "rounded-block",
    goal: "orb",
    kpi: "cylinder",
    problem: "prism",
    risk: "diamond",
    scenario: "rounded-block",
    decision: "hex-prism",
    execution: "rounded-block",
    outcome: "ring",
    context: "orb",
  } as const;
  for (const [family, primitive] of Object.entries(expected)) {
    assert.equal(
      EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE[
        family as keyof typeof EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE
      ],
      primitive,
      family,
    );
  }
});

test("B — Decision remains decision → hex-prism", () => {
  assert.equal(resolveExecutiveOvsObjectFamily("decision"), "decision");
  assert.equal(resolveExecutiveOvsPrimitive("decision"), "hex-prism");
  assert.equal(languageOf("decision").primitive, "hex-prism");
  assert.equal(languageOf("decision").family, "decision");
});

test("C — Decision geometry uses one coherent body", () => {
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.onePrimaryBody, true);
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.decorativeSubMeshes, false);
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.hexPrismRadialSegments, 6);
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.hexPrismHeightSegments, 1);
  assert.match(body, /hexPrismHeightSegments/);
  assert.doesNotMatch(body, /extrudeGeometry|latheGeometry|csg/i);
  assert.equal((body.match(/<RoundedBox/g) ?? []).length, 1);
  assert.ok(
    EXECUTIVE_OVS_DEPTH_FACTOR_BY_FAMILY.decision <
      EXECUTIVE_OVS_DEPTH_FACTOR_BY_FAMILY.operational,
  );
  assert.ok(languageOf("decision").depth < languageOf("object").depth);
  assert.ok(languageOf("decision").depth >= 0.28);
});

test("D — Operational remains rounded-block", () => {
  assert.equal(languageOf("object").family, "operational");
  assert.equal(languageOf("object").primitive, "rounded-block");
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.roundedBlockSmoothness, 2);
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.match(body, /roundedBlockSmoothness/);
  assert.doesNotMatch(body, /smoothness=\{4\}/);
});

test("E — Scenario remains rounded-block", () => {
  const scenario = languageOf("scenario");
  assert.equal(scenario.primitive, "rounded-block");
  assert.equal(scenario.family, "scenario");
  assert.ok(scenario.depth < languageOf("object").depth);
  assert.ok(
    EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.scenario >
      EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.operational,
  );
});

test("F — Execution remains rounded-block", () => {
  const execution = languageOf("execution");
  assert.equal(execution.primitive, "rounded-block");
  assert.equal(execution.family, "execution");
  assert.ok(
    EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.execution <
      EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.operational,
  );
});

test("G — Risk remains diamond", () => {
  assert.equal(languageOf("risk").primitive, "diamond");
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.diamondDetail, 0);
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.match(body, /octahedronGeometry/);
  assert.match(body, /diamondDetail/);
});

test("H — Goal / KPI / Outcome primitives unchanged", () => {
  assert.equal(languageOf("goal").primitive, "orb");
  assert.equal(languageOf("kpi").primitive, "cylinder");
  assert.equal(languageOf("outcome").primitive, "ring");
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.cylinderRadialSegments, 24);
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.orbWidthSegments, 24);
  assert.equal(EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.torusTubularSegments, 28);
});

test("I — Unknown remains operational fallback", () => {
  const unknown = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "unmapped-widget-xyz",
    enabled: true,
  });
  assert.equal(unknown.family, "operational");
  assert.equal(unknown.primitive, "rounded-block");
  assert.equal(unknown.fallback, true);
});

test("J — HANDOFF-FIX1 behavior unchanged", () => {
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({ id: "obj-capacity", kind: "object" }),
    "object",
  );
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({
      id: NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
      kind: "object",
    }),
    "risk",
  );
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({
      id: "obj-capacity",
      kind: "decision",
    }),
    "decision",
  );
  const handoff = readFileSync(
    join(here, "./projectExecutiveOvsObjectKindHandoff.ts"),
    "utf8",
  );
  assert.doesNotMatch(handoff, /input\.label/);
  assert.doesNotMatch(handoff, /input\.status/);
  assert.doesNotMatch(handoff, /input\.attention/);
});

test("K — No Object semantic Z change", () => {
  const presentation = pipeline("obj-capacity");
  assert.ok(
    presentation.scene.objects.every((entry) => entry.targetPosition[2] === 0),
  );
  assert.equal(languageOf("decision").backZ, 0);
  assert.equal(languageOf("object").rotationX, 0);
  assert.equal(languageOf("object").rotationY, 0);
});

test("L — No OVS:2 / OVS:3 ownership change", () => {
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.ownsSelection, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
  assert.equal(EXECUTIVE_OVS_MATERIAL_LANGUAGE.metalness, 0.22);
  assert.equal(EXECUTIVE_OVS_MATERIAL_LANGUAGE.roughness, 0.46);
  assert.equal(EXECUTIVE_OVS_MATERIAL_LANGUAGE.highlightLift, 0.12);
  const lighting = readFileSync(
    join(here, "./executiveLightingFoundation.ts"),
    "utf8",
  );
  assert.match(lighting, /ambientIntensity: 0\.26/);
  const environment = readFileSync(
    join(here, "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx"),
    "utf8",
  );
  assert.doesNotMatch(environment, /circleGeometry args=\{\[9, 64\]\}/);
  assert.match(environment, /planeGeometry/);
  assert.match(environment, /NEXORA_MVP_STAGE_ATMOSPHERE_FIELD/);
});
