/**
 * STAGE-3DOBJ:2 — Face Symbology & Surface Identity invariants A–AD.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

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
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import { MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH } from "./executive3DObjectVisualProfile.ts";
import {
  EXECUTIVE_3D_OBJECT_FACE_BOUNDARY,
  EXECUTIVE_FACE_SYMBOL_BODY_RATIO,
  MAX_EXECUTIVE_3D_OBJECT_SYMBOL_RELIEF,
  MAX_TERRITORY_DOMINANCE,
  MIN_EXECUTIVE_FACE_SYMBOL_SCALE,
  MIN_FACE_SYMBOL_STROKE,
  getExecutive3DObjectFaceSymbologyIdentity,
  getExecutive3DObjectFaceSymbologyObservability,
  isExecutive3DObjectSurfaceEnabled,
  resolveExecutive3DObjectFaceSymbology,
  resolveExecutive3DObjectSurfaceReadability,
  setExecutive3DObjectSurfaceEnabled,
  verifyExecutive3DObjectFaceSymbology,
} from "./executive3DObjectFaceSymbology.ts";
import { setExecutive3DObjectPremiumFormEnabled } from "./executive3DObjectPremiumForm.ts";

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
  return {
    state,
    presentation: applyExecutiveStageFixedCameraToStagePresentation(withRecomp),
  };
}

function snapshot(objectId: string) {
  const { presentation } = pipeline(objectId);
  return Object.freeze(
    presentation.scene.objects
      .filter((entry) => entry.disclosureState !== "hidden")
      .map((entry) =>
        Object.freeze({
          id: entry.id,
          x: entry.targetPosition[0],
          y: entry.targetPosition[1],
          z: entry.targetPosition[2],
        }),
      )
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
  );
}

function overlapFor(objectId: string) {
  return resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: objectId,
    presentationState: "minimum",
    objects: [
      "obj-budget",
      "obj-capacity",
      "obj-delivery",
      "obj-revenue",
      "obj-customer",
      "obj-risk",
      "obj-inventory",
      "obj-demand",
    ].map((id) => Object.freeze({ objectId: id })),
    relationships: [
      Object.freeze({ id: "r1", sourceId: "obj-budget", targetId: "obj-capacity" }),
      Object.freeze({ id: "r2", sourceId: "obj-budget", targetId: "obj-delivery" }),
      Object.freeze({ id: "r3", sourceId: "obj-capacity", targetId: "obj-delivery" }),
      Object.freeze({ id: "r4", sourceId: "obj-delivery", targetId: "obj-customer" }),
      Object.freeze({ id: "r5", sourceId: "obj-revenue", targetId: "obj-customer" }),
      Object.freeze({ id: "r6", sourceId: "obj-revenue", targetId: "obj-budget" }),
      Object.freeze({ id: "r7", sourceId: "obj-capacity", targetId: "obj-inventory" }),
      Object.freeze({ id: "r8", sourceId: "obj-delivery", targetId: "obj-risk" }),
    ],
  });
}

test("STAGE-3DOBJ:2 identity / verify", () => {
  const identity = getExecutive3DObjectFaceSymbologyIdentity();
  assert.equal(
    identity.id,
    "STAGE-3DOBJ:2/Executive3DObjectFaceSymbologySurfaceIdentity",
  );
  assert.equal(
    identity.fixId,
    "STAGE-3DOBJ:2-FIX/ExecutiveFaceReadabilityMaterialPresence",
  );
  assert.equal(identity.version, "1.1.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-3d-object-face-symbology",
  );
  assert.equal(verifyExecutive3DObjectFaceSymbology().ok, true);
});

test("A/B/C/D — Semantic z=0, anchor, camera, Deep-Z contract", () => {
  setExecutive3DObjectSurfaceEnabled(true);
  for (const id of ["obj-capacity", "obj-risk", "obj-revenue"]) {
    const { presentation } = pipeline(id);
    const anchor = presentation.scene.objects.find((e) => e.id === id)!;
    assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
    for (const object of presentation.scene.objects) {
      if (object.disclosureState === "hidden") continue;
      assert.equal(object.targetPosition[2], 0);
    }
    assert.deepEqual(presentation.scene.camera.position, [
      0,
      0,
      EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
    ]);
  }
  assert.equal(resolveExecutiveStageFixedCamera().position.z, 11);
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.changesSemanticZ, false);
  const scene = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(scene, /NexoraStageDeepZEnvironment/);
});

test("E/F/G/H/I — Local surface only; safe zone; no silhouette expand; relief cap", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.expandsHardSilhouette, false);
  const face = resolveExecutive3DObjectFaceSymbology({
    objectKind: "object",
    presentationLevel: "operation",
    enabled: true,
  });
  assert.equal(face.expandsSilhouette, false);
  assert.ok(face.safeZone >= 0.16 && face.safeZone <= 0.22);
  assert.ok(face.symbolDepth <= MAX_EXECUTIVE_3D_OBJECT_SYMBOL_RELIEF);
  assert.ok(face.symbolDepth + 0.32 <= MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH);
  assert.equal(
    EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.faceCoordinateSystem,
    "normalized-face-grid-pm1",
  );
});

test("J/K/L/M/N — Deterministic distinct symbol families", () => {
  setExecutive3DObjectSurfaceEnabled(true);
  const business = resolveExecutive3DObjectFaceSymbology({
    objectKind: "object",
    enabled: true,
  });
  const risk = resolveExecutive3DObjectFaceSymbology({
    objectKind: "risk",
    enabled: true,
  });
  const problem = resolveExecutive3DObjectFaceSymbology({
    objectKind: "problem",
    enabled: true,
  });
  const scenario = resolveExecutive3DObjectFaceSymbology({
    objectKind: "scenario",
    enabled: true,
  });
  const decision = resolveExecutive3DObjectFaceSymbology({
    objectKind: "decision",
    enabled: true,
  });
  const execution = resolveExecutive3DObjectFaceSymbology({
    objectKind: "execution",
    enabled: true,
  });
  const goal = resolveExecutive3DObjectFaceSymbology({
    objectKind: "goal",
    enabled: true,
  });
  assert.equal(business.symbolKind, "executive-mark");
  assert.notEqual(business.symbolKind, risk.symbolKind);
  assert.notEqual(problem.symbolKind, risk.symbolKind);
  assert.notEqual(scenario.symbolKind, decision.symbolKind);
  assert.notEqual(decision.symbolKind, execution.symbolKind);
  assert.equal(goal.symbolKind, "target-point");
  assert.equal(risk.symbolKind, "facet-notch");
  assert.equal(problem.symbolKind, "fracture-gap");
  assert.equal(scenario.symbolKind, "branch-paths");
  assert.equal(decision.symbolKind, "convergence-choice");
  assert.equal(execution.symbolKind, "progress-segments");
});

test("O — Goal differs from Deep-Z / focus ring language", () => {
  const goal = resolveExecutive3DObjectFaceSymbology({
    objectKind: "goal",
    enabled: true,
  });
  assert.equal(goal.symbolGeometry, "point-ring");
  // Single restrained ring primitive — not multi-ring Deep-Z language.
  const rings = goal.primitives.filter((p) => p.type === "ring");
  assert.equal(rings.length, 1);
  const deepZ = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageDeepZEnvironment.tsx"),
    "utf8",
  );
  assert.match(deepZ, /ringGeometry|DeepZ|deep-z/i);
});

test("P/Q/R — State does not replace symbol / z / topology", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.stateReplacesSymbol, false);
  const normal = resolveExecutive3DObjectFaceSymbology({
    objectKind: "decision",
    executiveState: "normal",
    enabled: true,
  });
  const critical = resolveExecutive3DObjectFaceSymbology({
    objectKind: "decision",
    executiveState: "critical",
    enabled: true,
  });
  assert.equal(normal.symbolKind, critical.symbolKind);
  assert.notEqual(normal.stateMarker, critical.stateMarker);
  const snap = snapshot("obj-capacity");
  assert.ok(snap.every((e) => e.z === 0));
});

test("S/T — Focus/selection do not create duplicate body", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.createsFocusShell, false);
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.createsSelectionShell, false);
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /ExecutiveObjectFaceSurface/);
  assert.match(renderer, /Never a second volumetric shell/);
});

test("U/V/W — Labels / gateway / Thread subjects", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.ownsLabels, false);
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.appliesToThreadGateway, false);
  const label = readFileSync(
    join(here, "executiveStageObjectLabelTerritory.ts"),
    "utf8",
  );
  assert.match(label, /STAGE-LABEL:1/);
  const thread = readFileSync(
    join(here, "executiveThreadExpansion.ts"),
    "utf8",
  );
  assert.match(thread, /STAGE-THREAD/);
  // Thread subjects resolve by kind — same API as Stage objects.
  const problem = resolveExecutive3DObjectFaceSymbology({
    objectKind: "problem Capacity Gap",
    enabled: true,
  });
  assert.equal(problem.symbolKind, "fracture-gap");
});

test("X/Y/Z — Relationships / overlap / reserved", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.inventsRelationships, false);
  setExecutive3DObjectSurfaceEnabled(true);
  for (const id of ["obj-capacity", "obj-risk", "obj-budget"]) {
    assert.equal(overlapFor(id).layoutOverlapCount, 0, id);
  }
  const reserved = readFileSync(
    join(here, "executiveStageReservedRegionContainment.ts"),
    "utf8",
  );
  assert.match(reserved, /STAGE/);
});

test("AA/AB — Motion + raycast authority", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(host, /stageMotionAuthority: "stage-motion-1"/);
  const faceSurface = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectFaceSurface.tsx"),
    "utf8",
  );
  assert.match(faceSurface, /raycast=\{\(\) => null\}/);
});

test("AC — Surface ON/OFF identical semantic coordinates", () => {
  setExecutive3DObjectSurfaceEnabled(true);
  const on = snapshot("obj-delivery");
  setExecutive3DObjectSurfaceEnabled(false);
  const off = snapshot("obj-delivery");
  setExecutive3DObjectSurfaceEnabled(true);
  assert.deepEqual(on, off);
  assert.equal(isExecutive3DObjectSurfaceEnabled(), true);
});

test("AD — Deterministic face symbology", () => {
  const a = resolveExecutive3DObjectFaceSymbology({
    objectKind: "risk",
    presentationLevel: "report",
    executiveState: "watch",
    interactionState: "focused",
    enabled: true,
  });
  const b = resolveExecutive3DObjectFaceSymbology({
    objectKind: "risk",
    presentationLevel: "report",
    executiveState: "watch",
    interactionState: "focused",
    enabled: true,
  });
  assert.deepEqual(a, b);
});

test("No text glyphs / KPI on mesh; Context restrained", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.usesTextGlyphs, false);
  assert.equal(EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.embedsKpiText, false);
  const context = resolveExecutive3DObjectFaceSymbology({
    objectKind: "context",
    presentationLevel: "operation",
    enabled: true,
  });
  assert.equal(context.symbolKind, "context-dot");
  assert.ok(context.symbolScale < 0.55);
  assert.equal(context.surfacePattern, "plain");
});

test("Presentation levels enrich detail, keep identity", () => {
  const min = resolveExecutive3DObjectFaceSymbology({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  const report = resolveExecutive3DObjectFaceSymbology({
    objectKind: "object",
    presentationLevel: "report",
    enabled: true,
  });
  const operation = resolveExecutive3DObjectFaceSymbology({
    objectKind: "object",
    presentationLevel: "operation",
    enabled: true,
  });
  assert.equal(min.symbolKind, report.symbolKind);
  assert.equal(report.symbolKind, operation.symbolKind);
  assert.equal(min.secondaryPrimitives.length, 0);
  assert.ok(report.secondaryPrimitives.length >= 1);
  assert.equal(operation.surfacePattern, "inset-panel-rich");
});

test("Mesh budget + observability + host wiring", () => {
  const face = resolveExecutive3DObjectFaceSymbology({
    objectKind: "scenario",
    presentationLevel: "operation",
    enabled: true,
  });
  assert.ok(face.meshBudget.maxExtraMeshes <= 12);
  const obs = getExecutive3DObjectFaceSymbologyObservability({
    enabled: true,
    objectKind: "decision",
  });
  assert.equal(obs.contract, "stage-3dobj-2");
  assert.equal(obs.symbolKind, "convergence-choice");
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-3dobj-surface-contract/);
  assert.match(host, /data-stage-3dobj-symbol-kind/);
  assert.match(host, /data-stage-3dobj-face-calibration/);
  assert.match(host, /data-stage-3dobj-face-readability/);
  assert.match(host, /obj3dSurface|isExecutive3DObjectSurfaceEnabled/);
});

test("Business variants share face identity", () => {
  const revenue = resolveExecutive3DObjectFaceSymbology({
    objectKind: "obj-revenue Revenue object",
    enabled: true,
  });
  const capacity = resolveExecutive3DObjectFaceSymbology({
    objectKind: "obj-capacity Capacity object",
    enabled: true,
  });
  assert.equal(revenue.symbolKind, "executive-mark");
  assert.equal(capacity.symbolKind, "executive-mark");
  assert.equal(revenue.shapeFamily, "business-object");
  assert.equal(capacity.shapeFamily, "business-object");
});

test("STAGE-3DOBJ:2-FIX — readability floors G/H/I + territory Q", () => {
  // 2-FIX floors apply when premium form is OFF (form-first uses smaller symbols).
  setExecutive3DObjectPremiumFormEnabled(false);
  try {
    const businessMin = resolveExecutive3DObjectFaceSymbology({
      objectKind: "object",
      presentationLevel: "minimum",
      enabled: true,
    });
    assert.ok(businessMin.symbolScale >= MIN_EXECUTIVE_FACE_SYMBOL_SCALE);
    assert.ok(businessMin.minStroke >= MIN_FACE_SYMBOL_STROKE);
    assert.ok(
      businessMin.symbolBodyRatio >= EXECUTIVE_FACE_SYMBOL_BODY_RATIO.min,
    );
    // Minimum symbol scale >= Report (glance mode stronger/simple).
    const businessReport = resolveExecutive3DObjectFaceSymbology({
      objectKind: "object",
      presentationLevel: "report",
      enabled: true,
    });
    assert.ok(businessMin.symbolScale >= businessReport.symbolScale - 0.001);

    const watchReadability = resolveExecutive3DObjectSurfaceReadability({
      objectKind: "object",
      presentationLevel: "minimum",
      territoryOpacity: 0.12,
      enabled: true,
    });
    assert.equal(watchReadability.territoryDominanceOk, true);
    assert.ok(
      watchReadability.territoryToBodyContrast <= MAX_TERRITORY_DOMINANCE,
    );
    assert.equal(watchReadability.meetsSymbolFloor, true);
    assert.equal(watchReadability.readabilityStatus, "readable");
  } finally {
    setExecutive3DObjectPremiumFormEnabled(true);
  }
});
