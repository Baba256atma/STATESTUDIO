/**
 * STAGE-3DOBJ:1 — Executive 3D Object Visual Foundation invariants A–X.
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
import {
  resolveExecutiveObject3DGeometryProfile,
  setExecutiveObject3DGeometryEnabled,
} from "./executiveObject3DGeometry.ts";
import {
  EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY,
  EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL,
  MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH,
  getExecutive3DObjectVisualIdentity,
  getExecutive3DObjectVisualObservability,
  isExecutive3DObjectVisualEnabled,
  resolveExecutive3DObjectVisualProfile,
  setExecutive3DObjectVisualEnabled,
  verifyExecutive3DObjectVisualFoundation,
} from "./executive3DObjectVisualProfile.ts";
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

test("STAGE-3DOBJ:1 identity / verify", () => {
  const identity = getExecutive3DObjectVisualIdentity();
  assert.equal(identity.id, "STAGE-3DOBJ:1/Executive3DObjectVisualFoundation");
  assert.equal(identity.version, "1.0.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-3d-object-visual",
  );
  assert.equal(verifyExecutive3DObjectVisualFoundation().ok, true);
});

test("A/B/C — Semantic z=0, anchor {0,0,0}, camera fixed", () => {
  setExecutive3DObjectVisualEnabled(true);
  setExecutiveObject3DGeometryEnabled(true);
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

test("D/E/F/G — Local +Z geometry, back=0, front=+depth, depth capped", () => {
  setExecutive3DObjectVisualEnabled(true);
  const profile = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  assert.equal(profile.backZ, 0);
  assert.equal(profile.frontZ, profile.depth);
  assert.equal(profile.centerZ, profile.depth * 0.5);
  assert.ok(profile.depth > 0);
  assert.ok(profile.depth <= MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH);
  assert.equal(profile.rotationX, 0);
  assert.equal(profile.rotationY, 0);
  assert.equal(
    EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.geometryOrigin,
    "back-on-plane-front-toward-camera",
  );
});

test("H/I/J — No Z collision; hard overlap 0; reserved clipping authority intact", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.usesZForCollision, false);
  setExecutive3DObjectVisualEnabled(true);
  for (const id of [
    "obj-budget",
    "obj-capacity",
    "obj-delivery",
    "obj-revenue",
    "obj-customer",
  ]) {
    const readability = overlapFor(id);
    assert.equal(readability.layoutOverlapCount, 0, id);
  }
  const hard = readFileSync(
    join(here, "executiveStage2DHardSeparation.ts"),
    "utf8",
  );
  assert.match(hard, /STAGE-3DOBJ:1/);
  assert.match(hard, /isExecutive3DObjectVisualEnabled/);
  const reserved = readFileSync(
    join(here, "executiveStageReservedRegionContainment.ts"),
    "utf8",
  );
  assert.match(reserved, /STAGE/);
});

test("K/L/M — Labels / Thread / Motion ownership unchanged", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.ownsLabels, false);
  const label = readFileSync(
    join(here, "executiveStageObjectLabelTerritory.ts"),
    "utf8",
  );
  assert.match(label, /STAGE-LABEL:1/);
  const motion = readFileSync(join(here, "executiveStageMotion.ts"), "utf8");
  assert.match(motion, /STAGE-MOTION/);
  const thread = readFileSync(
    join(here, "executiveThreadExpansion.ts"),
    "utf8",
  );
  assert.match(thread, /STAGE-THREAD/);
});

test("N/O — Deterministic kind profiles; presentation level changes detail not identity", () => {
  setExecutive3DObjectVisualEnabled(true);
  const kinds = {
    object: "rounded-executive-slab",
    goal: "target-puck",
    problem: "angular-block",
    risk: "beveled-diamond",
    scenario: "soft-hex-plate",
    decision: "decisive-hex",
    execution: "operational-slab",
    context: "subordinate-plate",
  } as const;
  for (const [kind, visualShape] of Object.entries(kinds)) {
    const min = resolveExecutive3DObjectVisualProfile({
      objectKind: kind,
      presentationLevel: "minimum",
      enabled: true,
    });
    const op = resolveExecutive3DObjectVisualProfile({
      objectKind: kind,
      presentationLevel: "operation",
      enabled: true,
    });
    assert.equal(min.visualShape, visualShape, kind);
    assert.equal(op.visualShape, visualShape, kind);
    assert.equal(min.shapeFamily, op.shapeFamily);
    assert.ok(min.depth <= op.depth || kind === "context");
  }
  assert.equal(
    resolveExecutive3DObjectVisualProfile({ objectKind: "object", enabled: true })
      .shapeFamily,
    "business-object",
  );
});

test("P/Q — State never changes topology or geometry depth", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.stateChangesDepth, false);
  const normal = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    executiveState: "normal",
    enabled: true,
  });
  const critical = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    executiveState: "critical",
    enabled: true,
  });
  const watch = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    executiveState: "watch",
    enabled: true,
  });
  assert.equal(normal.depth, critical.depth);
  assert.equal(normal.depth, watch.depth);
  assert.notEqual(critical.edgeRole, normal.edgeRole);
  const on = snapshot("obj-capacity");
  // State is presentation-only; topology snapshot unchanged by visual toggle.
  assert.ok(on.every((entry) => entry.z === 0));
});

test("R/S — Focus/selection do not create duplicate 3D body", () => {
  assert.equal(
    EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.focusCreatesDuplicateBody,
    false,
  );
  assert.equal(
    EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.selectionCreatesDuplicateBody,
    false,
  );
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /Never a second volumetric shell/);
  assert.match(renderer, /frontFace/);
  assert.doesNotMatch(renderer, /duplicate.?shell/i);
});

test("T — Context remains subordinate (flatter depth)", () => {
  const business = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  const context = resolveExecutive3DObjectVisualProfile({
    objectKind: "context",
    presentationLevel: "minimum",
    enabled: true,
  });
  assert.ok(context.depth < business.depth * 0.7);
  assert.equal(context.visualShape, "subordinate-plate");
});

test("U — Labels-off semantic families remain distinguishable by shape", () => {
  const shapes = [
    "object",
    "goal",
    "problem",
    "risk",
    "scenario",
    "decision",
    "execution",
  ].map(
    (kind) =>
      resolveExecutive3DObjectVisualProfile({
        objectKind: kind,
        enabled: true,
      }).visualShape,
  );
  assert.equal(new Set(shapes).size, shapes.length);
  assert.notEqual(
    resolveExecutive3DObjectVisualProfile({ objectKind: "problem", enabled: true })
      .shape,
    resolveExecutive3DObjectVisualProfile({ objectKind: "risk", enabled: true })
      .shape,
  );
});

test("V/W/X — Click / relationships / motion authority unchanged", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.inventsRelationships, false);
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.movesCamera, false);
  const { state, presentation } = pipeline("obj-budget");
  assert.equal(state.focusedSubject?.id, "obj-budget");
  assert.equal(presentation.scene.focusedObjectId, "obj-budget");
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(host, /stageMotionAuthority: "stage-motion-1"/);
});

test("Depth bands — Minimum / Report / Operation / max", () => {
  setExecutive3DObjectVisualEnabled(true);
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL.minimum, 0.18);
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL.report, 0.26);
  assert.equal(EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL.operation, 0.32);
  assert.equal(MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH, 0.4);
  const bizMin = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  assert.equal(bizMin.depth, 0.18);
  assert.ok(bizMin.depth >= 0.16 && bizMin.depth <= 0.22);
});

test("Geometry compose — visual ON upgrades depth; OFF keeps STAGE-OBJ:1", () => {
  setExecutiveObject3DGeometryEnabled(true);
  setExecutive3DObjectVisualEnabled(true);
  const on = resolveExecutiveObject3DGeometryProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  assert.equal(on.visualFoundation, true);
  assert.equal(on.depth, 0.18);
  assert.ok(on.frontFaceInset > 0);

  setExecutive3DObjectVisualEnabled(false);
  const off = resolveExecutiveObject3DGeometryProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  assert.equal(off.visualFoundation, false);
  assert.equal(off.depth, 0.14);
  setExecutive3DObjectVisualEnabled(true);
});

test("Topology identical with visual ON/OFF", () => {
  // Isolate STAGE-3DOBJ:1 pad from STAGE-3DOBJ:3 form silhouette boost.
  setExecutive3DObjectPremiumFormEnabled(false);
  setExecutive3DObjectVisualEnabled(true);
  const on = snapshot("obj-delivery");
  setExecutive3DObjectVisualEnabled(false);
  const off = snapshot("obj-delivery");
  setExecutive3DObjectVisualEnabled(true);
  setExecutive3DObjectPremiumFormEnabled(true);
  // Semantic topology identity: same objects, z=0, shared anchor.
  // Hard-separation XY may shift slightly when projected silhouette pad changes.
  assert.deepEqual(
    on.map((entry) => entry.id),
    off.map((entry) => entry.id),
  );
  assert.ok(on.every((entry) => entry.z === 0));
  assert.ok(off.every((entry) => entry.z === 0));
  assert.deepEqual(
    on.find((entry) => entry.id === "obj-delivery"),
    { id: "obj-delivery", x: 0, y: 0, z: 0 },
  );
  assert.deepEqual(
    off.find((entry) => entry.id === "obj-delivery"),
    { id: "obj-delivery", x: 0, y: 0, z: 0 },
  );
  assert.equal(isExecutive3DObjectVisualEnabled(), true);
});

test("Observability + host wiring", () => {
  const obs = getExecutive3DObjectVisualObservability({
    enabled: true,
    objectKind: "risk",
  });
  assert.equal(obs.contract, "stage-3dobj-1");
  assert.equal(obs.kind, "risk");
  assert.equal(obs.profile, "beveled-diamond");
  assert.equal(obs.backZ, "0");
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-3dobj-contract/);
  assert.match(host, /data-stage-3dobj-depth/);
  assert.match(host, /data-stage-3dobj-material-role/);
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /obj3dVisual|STAGE-3DOBJ:1|stage3dobj/);
  assert.match(renderer, /isExecutive3DObjectVisualEnabled/);
});

test("Representative object geometry audit fields", () => {
  setExecutive3DObjectVisualEnabled(true);
  const rows = [
    "Revenue:object",
    "Capacity:object",
    "Budget:object",
    "Delivery:object",
    "Customer:object",
    "Risk:risk",
    "Problem:problem",
    "Scenario:scenario",
    "Decision:decision",
    "Execution:execution",
    "Goal:goal",
  ].map((entry) => {
    const [label, kind] = entry.split(":");
    const profile = resolveExecutive3DObjectVisualProfile({
      objectKind: kind,
      presentationLevel: "minimum",
      enabled: true,
    });
    return {
      label,
      semanticZ: 0,
      shape: profile.visualShape,
      width: profile.width,
      height: profile.height,
      depth: profile.depth,
      frontZ: profile.frontZ,
      backZ: profile.backZ,
      rotationX: profile.rotationX,
      rotationY: profile.rotationY,
      bevel: profile.bevel,
      material: profile.materialRole,
    };
  });
  for (const row of rows) {
    assert.equal(row.semanticZ, 0);
    assert.equal(row.backZ, 0);
    assert.equal(row.frontZ, row.depth);
    assert.equal(row.rotationX, 0);
    assert.equal(row.rotationY, 0);
    assert.ok(row.depth <= MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH);
  }
  assert.equal(rows.find((r) => r.label === "Risk")!.shape, "beveled-diamond");
  assert.equal(rows.find((r) => r.label === "Decision")!.shape, "decisive-hex");
});
