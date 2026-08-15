/**
 * STAGE-OBJ:2 — Executive Business Object Presence & Identity invariants A–X.
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
} from "./executiveStage2DFixedCamera.ts";
import {
  resolveExecutiveStage2DMinVisualGap,
  resolveExecutiveStage2DVisualFootprint,
} from "./executiveStage2DHardSeparation.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import {
  EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL,
  MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH,
  resolveExecutiveObject3DGeometryProfile,
} from "./executiveObject3DGeometry.ts";
import {
  EXECUTIVE_OBJECT_PRESENCE_BY_LEVEL,
  EXECUTIVE_OBJECT_PRESENCE_BOUNDARY,
  EXECUTIVE_OBJECT_PRESENCE_CONNECTION,
  EXECUTIVE_OBJECT_PRESENCE_HARD_FOOTPRINT,
  EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE,
  fingerprintExecutiveObjectSilhouetteFamily,
  getExecutiveObjectPresenceIdentity,
  isExecutiveObjectPresenceV2Enabled,
  resolveExecutiveObjectGeometryShapeForFamily,
  resolveExecutiveObjectSemanticShapeFamily,
  resolveExecutiveObjectVisualIdentity,
  setExecutiveObjectPresenceV2Enabled,
  verifyExecutiveObjectPresenceIdentity,
} from "./executiveObjectPresenceIdentity.ts";

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

test("STAGE-OBJ:2 identity", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const identity = getExecutiveObjectPresenceIdentity();
  assert.equal(
    identity.id,
    "STAGE-OBJ:2/ExecutiveBusinessObjectPresenceIdentity",
  );
  assert.equal(identity.version, "4.2.0");
  assert.equal(verifyExecutiveObjectPresenceIdentity().ok, true);
  assert.equal(isExecutiveObjectPresenceV2Enabled(), true);
});

test("A/B/C — Semantic z=0, anchor center, fixed camera", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-budget",
    "obj-customer",
    "obj-delivery",
    "obj-risk",
  ]) {
    const presentation = pipeline(id);
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
});

test("D/E — Local +Z appearance-only; Deep-Z environmental only", () => {
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.changesSemanticZ, false);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.usesZForTopology, false);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.restoresTypeCXzTopology, false);
  assert.equal(
    EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL.minimum,
    0.14,
  );
  assert.ok(MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH <= 0.36);
  const deepZ = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageDeepZEnvironment.tsx"),
    "utf8",
  );
  assert.match(deepZ, /EXECUTIVE_OBJECT_PRESENCE_DEEP_Z/);
});

test("F/G — Business presence profile + deterministic silhouettes", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const biz = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    presentationLevel: "minimum",
    interactionState: "focused",
  });
  assert.equal(biz.shapeFamily, "business-object");
  assert.equal(biz.geometryShape, "rounded-slab");
  assert.ok(biz.presence.width >= 1.0);
  assert.equal(
    resolveExecutiveObjectSemanticShapeFamily("goal"),
    "goal",
  );
  assert.equal(
    resolveExecutiveObjectGeometryShapeForFamily("goal"),
    "disc-slab",
  );
  assert.equal(
    resolveExecutiveObjectGeometryShapeForFamily("problem"),
    "rect-slab",
  );
  assert.equal(
    resolveExecutiveObjectGeometryShapeForFamily("risk"),
    "diamond-slab",
  );
  assert.equal(
    resolveExecutiveObjectGeometryShapeForFamily("scenario"),
    "soft-plate",
  );
  assert.equal(
    resolveExecutiveObjectGeometryShapeForFamily("decision"),
    "hex-slab",
  );
  assert.equal(
    resolveExecutiveObjectGeometryShapeForFamily("execution"),
    "rounded-slab",
  );
  assert.equal(
    resolveExecutiveObjectGeometryShapeForFamily("context"),
    "soft-plate",
  );
});

test("H/I/Q — Focused > related > context presence", () => {
  const focused = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    interactionState: "focused",
  });
  const related = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    interactionState: "related",
  });
  const context = resolveExecutiveObjectVisualIdentity({
    objectKind: "context",
    interactionState: "background",
  });
  assert.ok(focused.bodyScale > related.bodyScale);
  assert.ok(related.bodyScale > context.bodyScale);
  assert.equal(context.territoryStyle, "none");
  assert.equal(focused.territoryStyle, "focused");
  assert.equal(
    EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.focused,
    1.12,
  );
});

test("J/K/L — State does not change Z / relationships / depth", () => {
  const normal = resolveExecutiveObject3DGeometryProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    executiveState: "normal",
    interactionState: "focused",
  });
  const watch = resolveExecutiveObject3DGeometryProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    executiveState: "watch",
    interactionState: "focused",
  });
  const critical = resolveExecutiveObject3DGeometryProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    executiveState: "critical",
    interactionState: "focused",
  });
  assert.equal(normal.depth, watch.depth);
  assert.equal(watch.depth, critical.depth);
  assert.equal(normal.backZ, 0);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.inventsRelationships, false);
});

test("M/N/O/P — Hard XY overlap 0 + presence footprints + territory policy", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  assert.equal(resolveExecutiveStage2DMinVisualGap(), 0.4);
  const anchorFp = resolveExecutiveStage2DVisualFootprint("anchor", "minimum");
  assert.ok(
    anchorFp.halfExtent >= EXECUTIVE_OBJECT_PRESENCE_HARD_FOOTPRINT.minimum.anchor,
  );
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-budget",
    "obj-customer",
    "obj-delivery",
    "obj-risk",
  ]) {
    const readability = overlapFor(id);
    assert.equal(readability.layoutOverlapCount, 0);
    assert.ok(
      (readability.layoutMinGap ?? 0) >=
        EXECUTIVE_OBJECT_PRESENCE_HARD_FOOTPRINT.minVisualGap - 1e-6,
    );
  }
  const focused = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    interactionState: "focused",
  });
  assert.equal(focused.territoryCollision, "hard-footprint");
  const quiet = resolveExecutiveObjectVisualIdentity({
    objectKind: "object",
    interactionState: "related",
    executiveState: "watch",
  });
  assert.equal(quiet.territoryCollision, "soft-visual");
});

test("R — Relationship lines less dominant than bodies", () => {
  assert.ok(EXECUTIVE_OBJECT_PRESENCE_CONNECTION.anchorIncidentOpacityCap < 0.6);
  assert.ok(EXECUTIVE_OBJECT_PRESENCE_CONNECTION.anchorIncidentLineWidthCap < 1.3);
  const bridge = readFileSync(
    join(
      here,
      "../nex-mvp/nexoraMVPExecutiveStage2DTopologyReadability.ts",
    ),
    "utf8",
  );
  assert.match(bridge, /EXECUTIVE_OBJECT_PRESENCE_CONNECTION/);
});

test("S — Deep-Z less dominant", () => {
  assert.ok(EXECUTIVE_OBJECT_PRESENCE_BY_LEVEL.minimum.width > 0.8);
});

test("T — Labels-disabled still exposes type differences", () => {
  const families = [
    "object",
    "problem",
    "risk",
    "scenario",
    "decision",
    "execution",
  ].map((kind) => fingerprintExecutiveObjectSilhouetteFamily(kind));
  assert.equal(new Set(families).size, families.length);
  assert.notEqual(
    fingerprintExecutiveObjectSilhouetteFamily("problem"),
    fingerprintExecutiveObjectSilhouetteFamily("risk"),
  );
  assert.notEqual(
    fingerprintExecutiveObjectSilhouetteFamily("decision"),
    fingerprintExecutiveObjectSilhouetteFamily("scenario"),
  );
});

test("U/V/W/X — Click authority / no inference / motion / topology contracts", () => {
  const objectSrc = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectSrc, /onSelect\(presentation\.id\)/);
  assert.match(objectSrc, /sampleExecutiveStageMotionObject/);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.inventsRelationships, false);
  assert.equal(EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.movesCamera, false);
  const presentation = pipeline("obj-revenue");
  assert.equal(presentation.scene.mode, "focus");
  assert.equal(presentation.scene.focusedObjectId, "obj-revenue");
});

test("Presence V1 compare path restores legacy shrink", () => {
  setExecutiveObjectPresenceV2Enabled(false);
  const legacy = resolveExecutiveObject3DGeometryProfile({
    objectKind: "object",
    width: 0.72,
    height: 0.72,
    presentationLevel: "minimum",
  });
  assert.ok(Math.abs(legacy.width - 0.5184) < 1e-4);
  setExecutiveObjectPresenceV2Enabled(true);
  const v2 = resolveExecutiveObject3DGeometryProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    interactionState: "focused",
  });
  assert.ok(v2.width > 0.9);
});

test("Host exposes STAGE-OBJ:2 observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-object-presence/);
  assert.match(host, /data-stage-object-presence-contract/);
  assert.match(host, /getExecutiveObjectPresenceObservability/);
});
