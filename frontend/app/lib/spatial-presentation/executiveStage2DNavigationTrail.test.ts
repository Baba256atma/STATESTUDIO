/**
 * STAGE-2D:5 — Navigation Trail & Context Continuity invariants.
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
  jumpNexoraMVPObjectInteractionNavigationTrail,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
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
  EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY,
  EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS,
  createEmptyExecutiveStage2DNavigationTrail,
  getExecutiveStage2DNavigationTrailIdentity,
  pushExecutiveStage2DNavigationEntry,
  sanitizeExecutiveStage2DNavigationTrail,
  verifyExecutiveStage2DNavigationTrail,
} from "./executiveStage2DNavigationTrail.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function pipelineFromState(state: ReturnType<typeof initial>) {
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

test("STAGE-2D:5 identity / version / namespace", () => {
  const identity = getExecutiveStage2DNavigationTrailIdentity();
  assert.equal(identity.id, "STAGE-2D:5/ExecutiveStage2DNavigationTrail");
  assert.equal(identity.version, "2.5.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-2d-navigation-trail",
  );
  assert.equal(verifyExecutiveStage2DNavigationTrail().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.drawsTrailEdgesOnStage,
    false,
  );
});

test("Invariant A — First object click creates trail", () => {
  const state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, ["obj-revenue"]);
  assert.equal(state.stage2dNavigationTrail.activeObjectId, "obj-revenue");
  assert.equal(state.stage2dNavigationTrail.currentIndex, 0);
});

test("Invariant B — Click-to-click appends", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, [
    "obj-revenue",
    "obj-delivery",
  ]);
  assert.equal(state.stage2dNavigationTrail.currentIndex, 1);
});

test("Invariant C — Consecutive duplicate prevention", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, ["obj-revenue"]);
});

test("Invariant D — Revisit policy appends again", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, [
    "obj-revenue",
    "obj-delivery",
    "obj-customer",
    "obj-revenue",
  ]);
  assert.equal(state.stage2dNavigationTrail.currentIndex, 3);
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.revisitPolicy,
    "append-again",
  );
});

test("Invariant E — Back changes anchor", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  state = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(state.focusedSubject?.id, "obj-delivery");
  assert.equal(state.stage2dNavigationTrail.activeObjectId, "obj-delivery");
  assert.equal(state.stage2dNavigationTrail.currentIndex, 1);
});

test("Invariant F — Anchor exact center after Back", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  state = stepBackNexoraMVPObjectInteraction(state);
  const presentation = pipelineFromState(state);
  const delivery = presentation.scene.objects.find(
    (entry) => entry.id === "obj-delivery",
  );
  assert.ok(delivery);
  assert.deepEqual(delivery.targetPosition, [0, 0, 0]);
});

test("Invariant G — Current truth recomputation (no cached topology)", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  const customerScene = pipelineFromState(state);
  const customerRelated = (
    customerScene.scene as {
      readonly stage2dRecomposition?: { readonly relatedObjectIds: readonly string[] };
    }
  ).stage2dRecomposition?.relatedObjectIds ?? [];

  state = stepBackNexoraMVPObjectInteraction(state);
  const deliveryScene = pipelineFromState(state);
  const deliveryRelated = (
    deliveryScene.scene as {
      readonly stage2dRecomposition?: {
        readonly relatedObjectIds: readonly string[];
        readonly anchorObjectId: string | null;
      };
    }
  ).stage2dRecomposition;

  assert.equal(deliveryRelated?.anchorObjectId, "obj-delivery");
  // Neighborhood is Delivery's live 1-hop truth, not Customer's prior set.
  assert.notDeepEqual(deliveryRelated?.relatedObjectIds, customerRelated);
  assert.ok(deliveryRelated?.relatedObjectIds.includes("obj-customer"));
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.storesCachedTopology,
    false,
  );
  // Trail state is identity-only.
  assert.equal("positions" in state.stage2dNavigationTrail, false);
});

test("Invariant H — New click after Back truncates forward branch", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  state = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(state.stage2dNavigationTrail.activeObjectId, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, [
    "obj-revenue",
    "obj-delivery",
    "obj-capacity",
  ]);
  assert.ok(!state.stage2dNavigationTrail.objectIds.includes("obj-customer"));
});

test("Invariant I — Overview reset clears trail", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.mode, "overview");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, []);
  assert.equal(state.stage2dNavigationTrail.activeObjectId, null);
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.overviewClearsTrail,
    true,
  );
});

test("Invariant J — Breadcrumb click changes anchor via trail jump", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  state = jumpNexoraMVPObjectInteractionNavigationTrail(state, 0);
  assert.equal(state.focusedSubject?.id, "obj-revenue");
  assert.equal(state.stage2dNavigationTrail.currentIndex, 0);
  // Forward branch preserved until a new click truncates.
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, [
    "obj-revenue",
    "obj-delivery",
    "obj-customer",
  ]);
  state = stepForwardNexoraMVPObjectInteraction(state);
  assert.equal(state.focusedSubject?.id, "obj-delivery");
});

test("Invariant K — No relationship inference from trail adjacency", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  const presentation = pipelineFromState(state);
  const invented = presentation.scene.connections.some(
    (connection) =>
      connection.id.includes("trail") ||
      connection.relation === "navigation-history",
  );
  assert.equal(invented, false);
  // Capacity may be related via canonical fixtures — trail itself invents nothing.
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.inventsRelationships,
    false,
  );
  // Ensure no decorative trail edge between Revenue and Capacity from history.
  const trailEdge = presentation.scene.connections.find(
    (connection) =>
      (connection.sourceId === "obj-revenue" &&
        connection.targetId === "obj-capacity") ||
      (connection.sourceId === "obj-capacity" &&
        connection.targetId === "obj-revenue"),
  );
  // Fixture has no Revenue↔Capacity edge.
  const fixtureHas = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
    (edge) =>
      (String(edge.sourceId) === "obj-revenue" &&
        String(edge.targetId) === "obj-capacity") ||
      (String(edge.sourceId) === "obj-capacity" &&
        String(edge.targetId) === "obj-revenue"),
  );
  assert.equal(fixtureHas, false);
  assert.equal(trailEdge == null || trailEdge.visualRole === "hidden", true);
});

test("Invariant L — 1-hop regression", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  const presentation = pipelineFromState(state);
  const recomp = (
    presentation.scene as {
      readonly stage2dRecomposition?: {
        readonly neighborhoodDepth: number;
        readonly relatedObjectIds: readonly string[];
      };
    }
  ).stage2dRecomposition;
  assert.equal(recomp?.neighborhoodDepth, 1);
  // Trail length 3 must not expand neighborhood to trail chain.
  assert.ok((recomp?.relatedObjectIds.length ?? 0) <= 6);
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.expandsNeighborhoodBeyondOneHop,
    false,
  );
});

test("Invariant M — z=0 regression", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = stepBackNexoraMVPObjectInteraction(state);
  const presentation = pipelineFromState(state);
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
});

test("Invariant N — Camera regression", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-delivery");
  state = stepBackNexoraMVPObjectInteraction(state);
  const presentation = pipelineFromState(
    selectNexoraMVPInteractionSubject(initial(), "obj-delivery"),
  );
  const camera = presentation.scene.camera;
  const fixed = resolveExecutiveStageFixedCamera();
  assert.deepEqual(camera.position, [
    fixed.position.x,
    fixed.position.y,
    fixed.position.z,
  ]);
  assert.deepEqual(camera.target, [0, 0, 0]);
  assert.equal(fixed.position.z, EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE);
  void state;
});

test("Invariant O — Invalid historical object does not crash", () => {
  let trail = createEmptyExecutiveStage2DNavigationTrail();
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-revenue");
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-missing");
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-delivery");
  const sanitized = sanitizeExecutiveStage2DNavigationTrail(
    trail,
    (id) => id === "obj-revenue" || id === "obj-delivery",
  );
  assert.deepEqual(sanitized.objectIds, ["obj-revenue", "obj-delivery"]);
  assert.equal(sanitized.activeObjectId, "obj-delivery");

  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = Object.freeze({
    ...state,
    stage2dNavigationTrail: Object.freeze({
      ...trail,
      scopeKey: state.stage2dNavigationTrail.scopeKey,
      scope: state.stage2dNavigationTrail.scope,
    }),
    trail: Object.freeze([
      Object.freeze({ id: "obj-revenue", kind: "object" as const, label: "Revenue" }),
      Object.freeze({ id: "obj-missing", kind: "object" as const, label: "Missing" }),
      Object.freeze({ id: "obj-delivery", kind: "object" as const, label: "Delivery" }),
    ]),
  });
  const next = stepBackNexoraMVPObjectInteraction(state);
  assert.ok(next.focusedSubject?.id === "obj-delivery" || next.mode === "overview" || next.focusedSubject?.id === "obj-revenue");
});

test("Invariant P — Trail bound", () => {
  let trail = createEmptyExecutiveStage2DNavigationTrail();
  for (let index = 0; index < EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS.maxEntries + 8; index += 1) {
    trail = pushExecutiveStage2DNavigationEntry(trail, `obj-${index}`);
  }
  assert.ok(
    trail.objectIds.length <= EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS.maxEntries,
  );
  assert.equal(
    trail.objectIds[0],
    `obj-${8}`,
  );
});

test("Invariant Q — Determinism", () => {
  const run = () => {
    let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
    state = selectNexoraMVPInteractionSubject(state, "obj-customer");
    state = stepBackNexoraMVPObjectInteraction(state);
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    return state.stage2dNavigationTrail;
  };
  assert.deepEqual(run(), run());
});

test("Workspace change resets foreign trail continuity", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "scenario",
    presentationState: "minimum",
    environmentIntent: "simulate",
  });
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, ["obj-delivery"]);
  assert.equal(state.stage2dNavigationTrail.currentIndex, 0);
});

test("Stage host exposes STAGE-2D:5 observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-navigation-mode/);
  assert.match(host, /data-stage-navigation-depth/);
  assert.match(host, /data-stage-navigation-current-index/);
  assert.match(host, /data-stage-navigation-contract/);
  const breadcrumb = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageInteractionBreadcrumb.tsx"),
    "utf8",
  );
  assert.match(breadcrumb, /onNavigateTrailIndex/);
  assert.match(breadcrumb, /data-stage-navigation-ui="trail"/);
});
