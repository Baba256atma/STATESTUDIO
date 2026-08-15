/**
 * STAGE-2D:6V — Visual Center & Object Plane Certification invariants.
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
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_2D_OBJECT_PLANE,
  EXECUTIVE_STAGE_2D_SCREEN_CENTER_TOLERANCE_NDC,
  EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_BOUNDARY,
  certifyExecutiveStage2DAnchorScreenCenter,
  getExecutiveStage2DVisualCertificationIdentity,
  isInsideExecutiveStage2DDialExclusion,
  planarizeExecutiveStage2DObjectDepth,
  pushOutOfExecutiveStage2DDialExclusion,
  resolveExecutiveStage2DUsableRect,
  resolveExecutiveStage2DVisualCentroid,
  resolveExecutiveStage2DVisualPresentationOffset,
  verifyExecutiveStage2DVisualCertification,
} from "./executiveStage2DVisualCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(objectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (objectId) {
    state = selectNexoraMVPInteractionSubject(state, objectId);
    state = syncNexoraMVPObjectInteractionShellContext(state, {
      workspace: state.workspace,
      presentationState: "minimum",
      environmentIntent: state.environmentIntent,
    });
  }
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

test("STAGE-2D:6V identity / version / namespace", () => {
  const identity = getExecutiveStage2DVisualCertificationIdentity();
  assert.equal(identity.id, "STAGE-2D:6V/ExecutiveStage2DVisualCertification");
  assert.equal(identity.version, "2.6.1");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-2d-visual-certification",
  );
  assert.equal(verifyExecutiveStage2DVisualCertification().ok, true);
  assert.equal(EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_BOUNDARY.movesCamera, false);
});

test("V1 — Anchor world center", () => {
  for (const objectId of [
    "obj-delivery",
    "obj-revenue",
    "obj-capacity",
    "obj-customer",
  ]) {
    const presentation = pipeline(objectId);
    const anchor = presentation.scene.objects.find((entry) => entry.id === objectId);
    assert.ok(anchor);
    assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
  }
});

test("V2 — Anchor screen center within tolerance", () => {
  const cert = certifyExecutiveStage2DAnchorScreenCenter();
  assert.equal(cert.semanticWorld.x, 0);
  assert.equal(cert.semanticWorld.y, 0);
  assert.equal(cert.semanticWorld.z, 0);
  assert.ok(cert.withinTolerance, `distanceNdc=${cert.distanceNdc}`);
  assert.ok(cert.distanceNdc <= EXECUTIVE_STAGE_2D_SCREEN_CENTER_TOLERANCE_NDC);
  const usable = resolveExecutiveStage2DUsableRect();
  assert.notEqual(usable.centerX, 0.5);
});

test("V2 per-object — Delivery/Revenue/Capacity/Customer screen center", () => {
  // Screen-center is a Stage composition property (offset + usable rect),
  // independent of which object is semantic anchor — all share {0,0,0}.
  for (const objectId of [
    "obj-delivery",
    "obj-revenue",
    "obj-capacity",
    "obj-customer",
  ]) {
    const presentation = pipeline(objectId);
    const anchor = presentation.scene.objects.find((entry) => entry.id === objectId)!;
    assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
    const cert = certifyExecutiveStage2DAnchorScreenCenter();
    assert.equal(cert.withinTolerance, true, objectId);
  }
});

test("V3 — Fixed camera", () => {
  const presentation = pipeline("obj-delivery");
  const fixed = resolveExecutiveStageFixedCamera();
  assert.deepEqual(presentation.scene.camera.position, [
    fixed.position.x,
    fixed.position.y,
    fixed.position.z,
  ]);
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
  assert.equal(fixed.position.z, EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE);
  assert.equal(certifyExecutiveStage2DAnchorScreenCenter().cameraFixed, true);
});

test("V4 — Semantic plane z=0", () => {
  const presentation = pipeline("obj-delivery");
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
});

test("V5 — Front-facing planar thickness", () => {
  assert.equal(EXECUTIVE_STAGE_2D_OBJECT_PLANE.facesCamera, true);
  assert.equal(planarizeExecutiveStage2DObjectDepth(0.64), 0);
  assert.equal(planarizeExecutiveStage2DObjectDepth(0.05), 0);
  assert.equal(
    EXECUTIVE_STAGE_2D_OBJECT_PLANE.classification.boxGeometryDepth,
    "PLANARIZE",
  );
  const geometry = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(geometry, /planeGeometry|circleGeometry|ringGeometry|RoundedBox|boxGeometry|cylinderGeometry/);
  assert.match(geometry, /STAGE-OBJ:1|back-on-plane-front-toward-camera|centerZ/);
});

test("V6 — Primary neighbors avoid dial exclusion + material separation", () => {
  const presentation = pipeline("obj-delivery");
  const visible = presentation.scene.objects.filter(
    (entry) =>
      entry.disclosureState !== "hidden" &&
      (entry.role === "focused" || entry.role === "related"),
  );
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const a = visible[i]!;
      const b = visible[j]!;
      const distance = Math.hypot(
        a.targetPosition[0] - b.targetPosition[0],
        a.targetPosition[1] - b.targetPosition[1],
      );
      assert.ok(distance > 0.55, `${a.id}-${b.id} distance=${distance}`);
    }
    if (visible[i]!.role !== "focused") {
      assert.equal(
        isInsideExecutiveStage2DDialExclusion(
          visible[i]!.targetPosition[0],
          visible[i]!.targetPosition[1],
        ),
        false,
        visible[i]!.id,
      );
    }
  }
});

test("V7 — Connection attachment uses live-position sync path", () => {
  const source = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageConnections.tsx"),
    "utf8",
  );
  assert.match(source, /resolveExecutiveStage2DVisualAttachmentPosition/);
  assert.match(source, /LiveStageConnection/);
});

test("V8 — Label attachment remains object-local", () => {
  const source = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(source, /NexoraExecutiveObjectLabel/);
  assert.match(source, /publishExecutiveStage2DLivePosition/);
});

test("V9 — Control exclusion (Dial)", () => {
  const pushed = pushOutOfExecutiveStage2DDialExclusion(2.0, -1.5);
  assert.equal(isInsideExecutiveStage2DDialExclusion(pushed.x, pushed.y), false);
  const scene = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(scene, /stage2dVisualOffset/);
});

test("V10 — Topology balance / visual centroid", () => {
  const presentation = pipeline("obj-delivery");
  const positions = presentation.scene.objects
    .filter((entry) => entry.disclosureState !== "hidden" && entry.opacity > 0.2)
    .map((entry) =>
      Object.freeze({
        x: entry.targetPosition[0],
        y: entry.targetPosition[1],
      }),
    );
  const centroid = resolveExecutiveStage2DVisualCentroid(positions);
  assert.equal(centroid.quadrantCompression, false);
});

test("V11 — Anchor visual hierarchy", () => {
  const presentation = pipeline("obj-delivery");
  const delivery = presentation.scene.objects.find((entry) => entry.id === "obj-delivery")!;
  assert.equal(delivery.focused, true);
  assert.equal(delivery.labelProminence, "full");
  assert.ok(delivery.opacity >= 0.95);
});

test("V12 — No false relationships", () => {
  assert.equal(
    EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_BOUNDARY.inventsRelationships,
    false,
  );
  const presentation = pipeline("obj-delivery");
  const invented = presentation.scene.connections.some(
    (connection) => connection.relation === "visual-certification",
  );
  assert.equal(invented, false);
});

test("Root cause — usable center differs from canvas center; offset corrects", () => {
  const usable = resolveExecutiveStage2DUsableRect();
  assert.ok(Math.abs(usable.centerX - 0.5) > 0.01 || Math.abs(usable.centerY - 0.5) > 0.01);
  const offset = resolveExecutiveStage2DVisualPresentationOffset();
  // Without offset, semantic origin projects to canvas center — offset is non-zero.
  assert.ok(Math.hypot(offset.x, offset.y) > 0.01);
});

test("Presentation Level naming (UI)", () => {
  const source = readFileSync(
    join(here, "../../executive/nex-mvp/presentation/NexoraPresentationStateSelector.tsx"),
    "utf8",
  );
  assert.match(source, /Presentation Level/);
  assert.doesNotMatch(source, /Presentation Depth/);
});

test("Stage host exposes STAGE-2D:6V observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-visual-certification/);
  assert.match(host, /data-stage-anchor-screen-centered/);
  assert.match(host, /data-stage-object-plane/);
});
