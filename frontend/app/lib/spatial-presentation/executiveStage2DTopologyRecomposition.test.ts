/**
 * STAGE-2D:3 — Click-to-Center Topology Recomposition invariants.
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
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_2D_ANCHOR_AUTHORITY,
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDARY,
  EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT,
  executiveStage2DTopologyRecompositionIdentity,
  executiveStage2DTopologyRecompositionNamespace,
  executiveStage2DTopologyRecompositionVersion,
  getExecutiveStage2DTopologyRecompositionIdentity,
  relaxExecutiveStage2DPositions,
  resolveExecutiveStage2DTopologyRecomposition,
  verifyExecutiveStage2DTopologyRecomposition,
} from "./executiveStage2DTopologyRecomposition.ts";

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

function fixtureObjects() {
  return [
    Object.freeze({ objectId: "obj-revenue", attention: "elevated" }),
    Object.freeze({ objectId: "obj-capacity", attention: "critical" }),
    Object.freeze({ objectId: "obj-budget", attention: "normal" }),
    Object.freeze({ objectId: "obj-delivery", attention: "normal" }),
    Object.freeze({ objectId: "obj-customer", attention: "normal" }),
    Object.freeze({ objectId: "obj-risk", attention: "normal" }),
    Object.freeze({ objectId: "obj-inventory", attention: "normal" }),
    Object.freeze({ objectId: "obj-demand", attention: "normal" }),
  ];
}

function fixtureRelationships() {
  return NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
    Object.freeze({
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    }),
  );
}

test("STAGE-2D:3 identity / version / namespace", () => {
  const identity = getExecutiveStage2DTopologyRecompositionIdentity();
  assert.equal(identity.id, "STAGE-2D:3/ExecutiveStage2DTopologyRecomposition");
  assert.equal(identity.version, "2.3.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-2d-topology-recomposition",
  );
  assert.equal(executiveStage2DTopologyRecompositionIdentity, identity.id);
  assert.equal(executiveStage2DTopologyRecompositionVersion, identity.version);
  assert.equal(executiveStage2DTopologyRecompositionNamespace, identity.namespace);
  assert.equal(verifyExecutiveStage2DTopologyRecomposition().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_2D_ANCHOR_AUTHORITY.anchorOwnsExactCenter,
    true,
  );
});

test("Invariant A — Clicked object becomes anchor", () => {
  const presentation = pipeline("obj-delivery");
  assert.equal(presentation.scene.focusedObjectId, "obj-delivery");
  const recomp = (
    presentation.scene as {
      readonly stage2dRecomposition?: { readonly anchorObjectId: string | null };
    }
  ).stage2dRecomposition;
  assert.equal(recomp?.anchorObjectId, "obj-delivery");
});

test("Invariant B — Anchor exact center", () => {
  const presentation = pipeline("obj-revenue");
  const anchor = presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
  assert.equal(anchor.focused, true);
});

test("Invariant C — Camera regression", () => {
  const camera = resolveExecutiveStageFixedCamera();
  assert.deepEqual(camera.position, {
    x: 0,
    y: 0,
    z: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  });
  assert.deepEqual(camera.target, { x: 0, y: 0, z: 0 });
  const presentation = pipeline("obj-budget");
  assert.deepEqual(presentation.scene.camera.position, [0, 0, 11]);
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
});

test("Invariant D — True 2D regression z === 0", () => {
  const presentation = pipeline("obj-delivery");
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0, object.id);
  }
});

test("Invariant E — Canonical relationships only", () => {
  const result = resolveExecutiveStage2DTopologyRecomposition({
    anchorObjectId: "obj-revenue",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  // Capacity is critical but not a Revenue edge — must not be related.
  assert.equal(result.relatedObjectIds.includes("obj-capacity"), false);
  assert.ok(
    result.relatedObjectIds.every((id) =>
      fixtureRelationships().some(
        (edge) =>
          (edge.sourceId === "obj-revenue" && edge.targetId === id) ||
          (edge.targetId === "obj-revenue" && edge.sourceId === id),
      ),
    ),
  );
  assert.equal(EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDARY.inventsRelationships, false);
});

test("Invariant F — One-hop neighborhood", () => {
  const result = resolveExecutiveStage2DTopologyRecomposition({
    anchorObjectId: "obj-delivery",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  assert.equal(result.neighborhoodDepth, 1);
  const expected = ["obj-capacity", "obj-customer", "obj-demand", "obj-risk"].sort();
  assert.deepEqual([...result.relatedObjectIds].sort(), expected);
});

test("Invariant G — Collision protection minimum XY separation", () => {
  const result = resolveExecutiveStage2DTopologyRecomposition({
    anchorObjectId: "obj-delivery",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  const visible = [
    result.anchorObjectId!,
    ...result.relatedObjectIds,
    ...result.backgroundObjectIds,
  ];
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const left = result.positions[visible[i]!]!;
      const right = result.positions[visible[j]!]!;
      const distance = Math.hypot(right.x - left.x, right.y - left.y);
      assert.ok(
        distance + 1e-6 >= EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT.minimumSeparation * 0.85,
        `${visible[i]}↔${visible[j]} distance ${distance}`,
      );
    }
  }
});

test("Invariant H — Anchor immovable under relaxation", () => {
  const poisoned = relaxExecutiveStage2DPositions({
    positions: {
      "obj-a": Object.freeze({ x: 0, y: 0, z: 0 }),
      "obj-b": Object.freeze({ x: 0.1, y: 0, z: 0 }),
      "obj-c": Object.freeze({ x: -0.1, y: 0, z: 0 }),
    },
    orderedIds: ["obj-a", "obj-b", "obj-c"],
    anchorObjectId: "obj-a",
    priority: { "obj-a": 100, "obj-b": 50, "obj-c": 50 },
  });
  assert.deepEqual(poisoned["obj-a"], { x: 0, y: 0, z: 0 });
});

test("Invariant I — Determinism", () => {
  const input = {
    anchorObjectId: "obj-revenue",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  };
  const a = resolveExecutiveStage2DTopologyRecomposition(input);
  const b = resolveExecutiveStage2DTopologyRecomposition(input);
  assert.deepEqual(a.positions, b.positions);
  assert.deepEqual(a.relatedObjectIds, b.relatedObjectIds);
});

test("Invariant J — Click-to-click transfers anchor", () => {
  const revenue = pipeline("obj-revenue");
  assert.deepEqual(
    revenue.scene.objects.find((o) => o.id === "obj-revenue")!.targetPosition,
    [0, 0, 0],
  );
  const delivery = pipeline("obj-delivery");
  assert.deepEqual(
    delivery.scene.objects.find((o) => o.id === "obj-delivery")!.targetPosition,
    [0, 0, 0],
  );
  assert.notEqual(
    delivery.scene.objects.find((o) => o.id === "obj-revenue")!.targetPosition[0],
    0,
  );
});

test("Invariant K — Critical non-neighbor stays non-related", () => {
  const result = resolveExecutiveStage2DTopologyRecomposition({
    anchorObjectId: "obj-revenue",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  // STAGE-OBJ:4 — important non-neighbor is peripheral (still not related).
  assert.equal(result.classifications["obj-capacity"], "peripheral");
  assert.equal(result.relatedObjectIds.includes("obj-capacity"), false);
  assert.ok(result.backgroundObjectIds.includes("obj-capacity"));
  assert.ok(result.peripheralObjectIds?.includes("obj-capacity"));
});

test("Invariant L — Overview with null anchor", () => {
  const overview = pipeline(null);
  assert.equal(overview.scene.mode, "overview");
  const recomp = (
    overview.scene as {
      readonly stage2dRecomposition?: {
        readonly mode: string;
        readonly anchorObjectId: string | null;
      };
    }
  ).stage2dRecomposition;
  assert.equal(recomp?.mode, "overview");
  assert.equal(recomp?.anchorObjectId, null);

  const resolved = resolveExecutiveStage2DTopologyRecomposition({
    anchorObjectId: null,
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  assert.equal(resolved.mode, "overview");
  assert.equal(resolved.recompositionReason, "overview-no-anchor");

  // Return-to-overview boundary
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.mode, "overview");
  assert.equal(state.focusedSubject, null);
});

test("Stage host exposes STAGE-2D:3 observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-topology-mode/);
  assert.match(host, /data-stage-anchor-object-id/);
  assert.match(host, /data-stage-anchor-position/);
  assert.match(host, /applyExecutiveStage2DTopologyRecompositionToStagePresentation/);

  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /applyExecutiveStage2DTopologyRecompositionToStagePresentation/);
});
