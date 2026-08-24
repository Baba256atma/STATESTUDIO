/**
 * STAGE-OBJ:1 — 3D Object on 2D Plane Foundation invariants A–R.
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
  buildNexoraMVPAdvisorContextBridge,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import { EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT } from "./executiveStage2DHardSeparation.ts";
import {
  EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL,
  EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY,
  MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH,
  getExecutiveObject3DGeometryIdentity,
  isExecutiveObject3DGeometryEnabled,
  resolveExecutiveObject3DGeometryProfile,
  setExecutiveObject3DGeometryEnabled,
  verifyExecutiveObject3DGeometry,
} from "./executiveObject3DGeometry.ts";
import { setExecutive3DObjectVisualEnabled } from "./executive3DObjectVisualProfile.ts";

const here = dirname(fileURLToPath(import.meta.url));

/** STAGE-OBJ:1 depth contract tests isolate from STAGE-3DOBJ:1 visual foundation. */
function withStageObj1GeometryOnly<T>(run: () => T): T {
  setExecutive3DObjectVisualEnabled(false);
  setExecutiveObject3DGeometryEnabled(true);
  try {
    return run();
  } finally {
    setExecutive3DObjectVisualEnabled(true);
  }
}
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

test("STAGE-OBJ:1 identity", () => {
  const identity = getExecutiveObject3DGeometryIdentity();
  assert.equal(identity.id, "STAGE-OBJ:1/ExecutiveObject3DGeometry");
  assert.equal(identity.version, "4.1.0");
  assert.equal(verifyExecutiveObject3DGeometry().ok, true);
  assert.equal(
    EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY.geometryOrigin,
    "back-on-plane-front-toward-camera",
  );
});

test("A/B/C — Semantic z=0, anchor center, fixed camera", () => {
  for (const id of [
    "obj-budget",
    "obj-capacity",
    "obj-delivery",
    "obj-revenue",
    "obj-customer",
    "obj-risk",
  ]) {
    const { presentation } = pipeline(id);
    const anchor = presentation.scene.objects.find((entry) => entry.id === id)!;
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
    assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
  }
  assert.equal(resolveExecutiveStageFixedCamera().position.z, 11);
});

test("D/E/F — Geometry depth > 0 when enabled, under cap, rotation contract", () => {
  withStageObj1GeometryOnly(() => {
    const profile = resolveExecutiveObject3DGeometryProfile({
      objectKind: "object",
      geometryFamily: "block",
      presentationLevel: "minimum",
    });
    assert.equal(profile.enabled, true);
    assert.ok(profile.depth > 0);
    assert.ok(profile.depth <= MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH);
    assert.equal(profile.backZ, 0);
    assert.equal(profile.frontZ, profile.depth);
    assert.equal(profile.centerZ, profile.depth * 0.5);
    assert.equal(profile.visualFoundation, false);
  });
  const source = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(source, /group\.rotation\.x = 0/);
  assert.match(source, /group\.rotation\.y = 0/);
});

test("G/H/R — Hard XY overlap 0 + min gap with 3D silhouette pad", () => {
  setExecutiveObject3DGeometryEnabled(true);
  for (const id of [
    "obj-budget",
    "obj-capacity",
    "obj-delivery",
    "obj-revenue",
    "obj-customer",
  ]) {
    const readability = overlapFor(id);
    assert.equal(readability.layoutOverlapCount, 0, id);
    assert.ok(
      (readability.layoutMinGap ?? 0) >=
        EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minVisualGap,
      `${id} gap=${readability.layoutMinGap}`,
    );
  }
  const hard = readFileSync(
    join(here, "executiveStage2DHardSeparation.ts"),
    "utf8",
  );
  assert.match(hard, /resolveExecutiveObject3DSilhouetteHalfExtent/);
});

test("I/J — Collision never changes semantic z; connections z=0", () => {
  assert.equal(EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY.usesZForCollision, false);
  const { presentation } = pipeline("obj-delivery");
  for (const connection of presentation.scene.connections) {
    for (const point of connection.routePoints ?? []) {
      assert.equal(point[2], 0);
    }
  }
});

test("K — Deep-Z remains behind objects", () => {
  const scene = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(scene, /NexoraStageDeepZEnvironment/);
  assert.match(scene, /spatialLayer: "semantic-plane"/);
});

test("L/M — Direct click authority + Budget anchor", () => {
  const { state, presentation } = pipeline("obj-budget");
  assert.equal(state.focusedSubject?.id, "obj-budget");
  assert.equal(presentation.scene.focusedObjectId, "obj-budget");
  const readability = (
    presentation.scene as {
      readonly stage2dReadability?: { readonly anchorObjectId?: string };
    }
  ).stage2dReadability;
  assert.equal(
    readability?.anchorObjectId ?? presentation.scene.focusedObjectId,
    "obj-budget",
  );
  const bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(bridge.focusedSubject?.id, "obj-budget");
});

test("N/O — Attention does not change depth; presentation levels within contract", () => {
  assert.equal(EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY.attentionChangesDepth, false);
  withStageObj1GeometryOnly(() => {
    const min = resolveExecutiveObject3DGeometryProfile({
      presentationLevel: "minimum",
      enabled: true,
    });
    const report = resolveExecutiveObject3DGeometryProfile({
      presentationLevel: "report",
      enabled: true,
    });
    const operation = resolveExecutiveObject3DGeometryProfile({
      presentationLevel: "operation",
      enabled: true,
    });
    assert.equal(min.depth, EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL.minimum);
    assert.equal(report.depth, EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL.report);
    assert.equal(operation.depth, EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL.operation);
    assert.ok(min.depth < report.depth && report.depth < operation.depth);
    assert.ok(operation.depth <= MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH);
  });
});

test("P — Context hierarchy remains subordinate (source policy)", () => {
  const context = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageContextNodes.tsx"),
    "utf8",
  );
  assert.match(context, /ringGeometry|planeGeometry|circleGeometry/);
  assert.doesNotMatch(context, /RoundedBox/);
});

test("Q — Topology identical with 3D ON/OFF", () => {
  // Isolate STAGE-OBJ:1 from STAGE-3DOBJ:1 silhouette boost.
  setExecutive3DObjectVisualEnabled(false);
  setExecutiveObject3DGeometryEnabled(true);
  const on = snapshot("obj-delivery");
  setExecutiveObject3DGeometryEnabled(false);
  const off = snapshot("obj-delivery");
  setExecutiveObject3DGeometryEnabled(true);
  setExecutive3DObjectVisualEnabled(true);
  assert.deepEqual(on, off);
  assert.equal(isExecutiveObject3DGeometryEnabled(), true);
});

test("Stage host / renderer expose STAGE-OBJ:1", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-object-3d-enabled/);
  assert.match(host, /data-stage-object-geometry/);
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /STAGE-OBJ:1/);
  assert.match(renderer, /back-on-plane-front-toward-camera/);
});
