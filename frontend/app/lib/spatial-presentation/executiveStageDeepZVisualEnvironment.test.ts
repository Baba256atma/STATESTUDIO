/**
 * STAGE-DEPTH:1 — Deep-Z Visual Vortex Foundation invariants A–P.
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
import {
  EXECUTIVE_STAGE_DEEP_Z_BOUNDARY,
  EXECUTIVE_STAGE_DEEP_Z_RANGE,
  getExecutiveStageDeepZVisualEnvironmentIdentity,
  getExecutiveStageDeepZVisualEnvironmentObservability,
  isExecutiveStageDeepZEnvironmentEnabled,
  setExecutiveStageDeepZEnvironmentEnabled,
  verifyExecutiveStageDeepZVisualEnvironment,
} from "./executiveStageDeepZVisualEnvironment.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(objectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (objectId) {
    state = selectNexoraMVPInteractionSubject(state, objectId);
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
  return {
    state,
    presentation: applyExecutiveStageFixedCameraToStagePresentation(withRecomp),
  };
}

function snapshotPositions(objectId: string) {
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

test("STAGE-DEPTH:1 identity / verification", () => {
  const identity = getExecutiveStageDeepZVisualEnvironmentIdentity();
  assert.equal(
    identity.id,
    "STAGE-DEPTH:1/ExecutiveStageDeepZVisualEnvironment",
  );
  assert.equal(identity.version, "3.1.0");
  assert.equal(verifyExecutiveStageDeepZVisualEnvironment().ok, true);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.depthAxis, "-Z");
  assert.ok(EXECUTIVE_STAGE_DEEP_Z_RANGE.near < 0);
  assert.ok(EXECUTIVE_STAGE_DEEP_Z_RANGE.far < EXECUTIVE_STAGE_DEEP_Z_RANGE.near);
});

test("A/B/C — Semantic object/anchor/connection z=0", () => {
  const { presentation } = pipeline("obj-budget");
  const budget = presentation.scene.objects.find((e) => e.id === "obj-budget")!;
  assert.deepEqual(budget.targetPosition, [0, 0, 0]);
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
  for (const connection of presentation.scene.connections) {
    const route = connection.routePoints;
    if (!route) continue;
    for (const point of route) {
      assert.equal(point[2] ?? 0, 0);
    }
  }
});

test("D — Hard XY separation still passes", () => {
  const readability = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-delivery",
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
    ].map((objectId) => Object.freeze({ objectId })),
    relationships: [
      Object.freeze({ id: "r1", sourceId: "obj-delivery", targetId: "obj-capacity" }),
      Object.freeze({ id: "r2", sourceId: "obj-delivery", targetId: "obj-customer" }),
      Object.freeze({ id: "r3", sourceId: "obj-delivery", targetId: "obj-risk" }),
      Object.freeze({ id: "r4", sourceId: "obj-delivery", targetId: "obj-demand" }),
    ],
  });
  assert.equal(readability.layoutOverlapCount, 0);
});

test("E — Fixed camera", () => {
  const { presentation } = pipeline("obj-capacity");
  const fixed = resolveExecutiveStageFixedCamera();
  assert.deepEqual(presentation.scene.camera.position, [
    0,
    0,
    EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  ]);
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
  assert.equal(fixed.position.z, 11);
});

test("F/G/H/I — Deep-Z is non-object, non-relationship, non-collision, non-interactive", () => {
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.isNexoraObject, false);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.participatesInRelationships, false);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.participatesInCollision, false);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.interactive, false);
  const source = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageDeepZEnvironment.tsx"),
    "utf8",
  );
  assert.match(source, /raycast=\{\(\) => null\}/);
  assert.doesNotMatch(source, /onClick|onPointerOver|objectId/);
});

test("J — Empty Stage click Overview path retained", () => {
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.match(canvas, /onPointerMissed/);
  assert.match(canvas, /shouldResetExecutiveStage2DToOverview/);
});

test("K/L — Direct click authority + Budget Advisor subject", () => {
  const { state, presentation } = pipeline("obj-budget");
  assert.equal(state.focusedSubject?.id, "obj-budget");
  assert.equal(state.selectedSubject?.id, "obj-budget");
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

test("M — No object moved in Z by depth environment", () => {
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.movesSemanticObjects, false);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.usesZForTopology, false);
  const { presentation } = pipeline("obj-revenue");
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
});

test("N — Depth environment renders behind topology (source architecture)", () => {
  const scene = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(scene, /NexoraStageDeepZEnvironment/);
  assert.match(scene, /spatialLayer: "semantic-plane"/);
  const deepZIndex = scene.indexOf("<NexoraStageDeepZEnvironment");
  const topologyIndex = scene.indexOf('spatialLayer: "semantic-plane"');
  assert.ok(deepZIndex > 0 && topologyIndex > deepZIndex);
  const env = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageDeepZEnvironment.tsx"),
    "utf8",
  );
  assert.match(env, /renderOrder=\{-20\}/);
  assert.match(env, /depthWrite=\{false\}/);
});

test("O — Topology identical with depth enabled/disabled", () => {
  setExecutiveStageDeepZEnvironmentEnabled(true);
  const on = snapshotPositions("obj-delivery");
  setExecutiveStageDeepZEnvironmentEnabled(false);
  const off = snapshotPositions("obj-delivery");
  setExecutiveStageDeepZEnvironmentEnabled(true);
  assert.deepEqual(on, off);
  assert.equal(isExecutiveStageDeepZEnvironmentEnabled(), true);
});

test("P — Reduced-motion does not change semantic Stage state", () => {
  const before = snapshotPositions("obj-customer");
  const observability = getExecutiveStageDeepZVisualEnvironmentObservability({
    reducedMotion: true,
  });
  assert.equal(observability.reducedMotion, "true");
  const after = snapshotPositions("obj-customer");
  assert.deepEqual(before, after);
});

test("Depth environment uses negative Z convention", () => {
  for (const ring of EXECUTIVE_STAGE_DEEP_Z_RANGE.rings) {
    assert.ok(ring.z < 0, `ring z=${ring.z}`);
  }
});

test("Stage host exposes STAGE-DEPTH:1 observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-depth-environment/);
  assert.match(host, /data-stage-semantic-plane-z/);
  assert.match(host, /data-stage-depth-interactive="false"|depthInteractive/);
  assert.match(host, /getExecutiveStageDeepZVisualEnvironmentObservability/);
});
