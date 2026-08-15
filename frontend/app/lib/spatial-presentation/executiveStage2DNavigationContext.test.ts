/**
 * STAGE-2D:6 — Navigation Context Density & Workspace Isolation invariants.
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
  EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_BOUNDARY,
  EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS,
  EXECUTIVE_STAGE_2D_DEFAULT_MODEL_ID,
  composeExecutiveStage2DNavigationScopeKey,
  createEmptyExecutiveStage2DScopedNavigationTrail,
  getExecutiveStage2DNavigationContextIdentity,
  pushExecutiveStage2DScopedNavigationEntry,
  resolveExecutiveStage2DBreadcrumbLabels,
  resolveExecutiveStage2DNavigationBreadcrumbWindow,
  resolveExecutiveStage2DNavigationScope,
  sanitizeExecutiveStage2DScopedNavigationTrail,
  transitionExecutiveStage2DNavigationScope,
  truncateExecutiveStage2DNavigationLabel,
  verifyExecutiveStage2DNavigationContext,
} from "./executiveStage2DNavigationContext.ts";
import {
  EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS,
  stepBackExecutiveStage2DNavigationTrail,
} from "./executiveStage2DNavigationTrail.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initial(workspace: "overview" | "scenario" | "problem" = "overview") {
  return createInitialNexoraMVPObjectInteractionState({
    workspace,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function pipelineFromState(state: ReturnType<typeof initial>) {
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: state.presentationState,
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomp =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  return applyExecutiveStageFixedCameraToStagePresentation(withRecomp);
}

test("STAGE-2D:6 identity / version / namespace", () => {
  const identity = getExecutiveStage2DNavigationContextIdentity();
  assert.equal(identity.id, "STAGE-2D:6/ExecutiveStage2DNavigationContext");
  assert.equal(identity.version, "2.6.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-2d-navigation-context",
  );
  assert.equal(verifyExecutiveStage2DNavigationContext().ok, true);
  const scope = resolveExecutiveStage2DNavigationScope({ workspace: "overview" });
  assert.equal(
    scope.scopeKey,
    `workspace.overview:${EXECUTIVE_STAGE_2D_DEFAULT_MODEL_ID}`,
  );
  assert.equal(
    composeExecutiveStage2DNavigationScopeKey(scope.scope),
    scope.scopeKey,
  );
});

test("Invariant A — Same scope preserves trail", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  const before = state.stage2dNavigationTrail.objectIds;
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, before);
  assert.equal(state.stage2dNavigationScopeStatus, "stable");
  assert.equal(state.presentationState, "report");
});

test("Invariant B — Scope change isolates trail", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "scenario",
    presentationState: "minimum",
    environmentIntent: "simulate",
  });
  assert.ok(!state.stage2dNavigationTrail.objectIds.includes("obj-revenue"));
  assert.equal(
    state.stage2dNavigationTrail.scopeKey.startsWith("workspace.scenario:"),
    true,
  );
});

test("Invariant C — New valid focus seeds new scope trail", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "decision",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, ["obj-delivery"]);
  assert.equal(state.stage2dNavigationTrail.currentIndex, 0);
  assert.equal(state.stage2dNavigationScopeStatus, "changed");
});

test("Invariant D — Invalid focus produces Overview", () => {
  const previous = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  let trail = pushExecutiveStage2DScopedNavigationEntry(previous, "obj-revenue");
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-delivery");
  const result = transitionExecutiveStage2DNavigationScope({
    previousTrail: trail,
    nextWorkspace: "scenario",
    currentFocusObjectId: "obj-delivery",
    isValidInScope: () => false,
  });
  assert.deepEqual(result.trail.objectIds, []);
  assert.equal(result.trail.currentIndex, -1);
  assert.equal(result.focusObjectId, null);
  assert.equal(result.scopeStatus, "reset");
});

test("Invariant E — Stale cross-scope object sanitization", () => {
  let trail = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-revenue");
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-foreign");
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-delivery");
  const sanitized = sanitizeExecutiveStage2DScopedNavigationTrail(
    trail,
    (id) => id === "obj-revenue" || id === "obj-delivery",
  );
  assert.deepEqual(sanitized.objectIds, ["obj-revenue", "obj-delivery"]);
  assert.equal(sanitized.activeObjectId, "obj-delivery");
});

test("Invariant F — Data Reality refresh does not reset trail", () => {
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_BOUNDARY.resetsOnDataRealityRefresh,
    false,
  );
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "neutral",
  });
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, [
    "obj-revenue",
    "obj-customer",
  ]);
});

test("Invariant G — Workspace change clears Forward branch", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  state = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(state.stage2dNavigationTrail.currentIndex, 1);
  assert.ok(
    state.stage2dNavigationTrail.currentIndex <
      state.stage2dNavigationTrail.objectIds.length - 1,
  );
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "problem",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(state.stage2dNavigationTrail.objectIds.length, 1);
  assert.equal(state.stage2dNavigationTrail.currentIndex, 0);
  assert.equal(
    state.stage2dNavigationTrail.currentIndex,
    state.stage2dNavigationTrail.objectIds.length - 1,
  );
});

test("Invariant H — Current-index-aware breadcrumb window", () => {
  let trail = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  for (const id of [
    "obj-revenue",
    "obj-delivery",
    "obj-customer",
    "obj-capacity",
    "obj-inventory",
    "obj-demand",
  ]) {
    trail = pushExecutiveStage2DScopedNavigationEntry(trail, id);
  }
  // Back twice → current = capacity (index 3)
  let stepped = stepBackExecutiveStage2DNavigationTrail(trail);
  stepped = stepBackExecutiveStage2DNavigationTrail(stepped);
  const scoped = Object.freeze({
    ...stepped,
    scope: trail.scope,
    scopeKey: trail.scopeKey,
  });
  const window = resolveExecutiveStage2DNavigationBreadcrumbWindow(scoped);
  assert.ok(window.visibleObjectIds.includes("obj-capacity"));
  assert.ok(window.visibleCount <= EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS.maxVisibleEntries);
  assert.ok(window.hasOverflowBefore || window.hasOverflowAfter);
  // Future history after current should be represented when possible.
  assert.ok(window.overflowAfter >= 0);
  assert.ok(window.visibleStartIndex <= scoped.currentIndex);
});

test("Invariant I — Visible entry cap", () => {
  let trail = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  for (let i = 0; i < 10; i += 1) {
    trail = pushExecutiveStage2DScopedNavigationEntry(trail, `obj-${i}`);
  }
  const window = resolveExecutiveStage2DNavigationBreadcrumbWindow(trail);
  assert.ok(
    window.visibleCount <=
      EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS.maxVisibleEntries,
  );
});

test("Invariant J — Current anchor label priority", () => {
  let trail = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-a");
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-b");
  trail = pushExecutiveStage2DScopedNavigationEntry(
    trail,
    "obj-long",
  );
  const window = resolveExecutiveStage2DNavigationBreadcrumbWindow(trail);
  const labels = resolveExecutiveStage2DBreadcrumbLabels({
    trail,
    window,
    labelsById: {
      "obj-a": "Alpha Object Name",
      "obj-b": "Beta Object Name",
      "obj-long": "Customer Satisfaction Index Extended",
    },
  });
  const current = labels.find((entry) => entry.isCurrent)!;
  const others = labels.filter((entry) => !entry.isCurrent);
  assert.ok(current.displayLabel.length >= others[0]!.displayLabel.length || current.mode === "full" || current.mode === "compact");
  assert.equal(current.objectId, "obj-long");
  assert.ok(
    current.displayLabel.length <=
      EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS.currentLabelMaxChars ||
      current.displayLabel.endsWith("…"),
  );
});

test("Invariant K — Deterministic truncation", () => {
  const a = truncateExecutiveStage2DNavigationLabel(
    "Customer Satisfaction Index",
    14,
  );
  const b = truncateExecutiveStage2DNavigationLabel(
    "Customer Satisfaction Index",
    14,
  );
  assert.equal(a, b);
  assert.equal(a.endsWith("…"), true);
});

test("Invariant L — Overflow counts", () => {
  let trail = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  for (const id of ["a", "b", "c", "d", "e", "f", "g"]) {
    trail = pushExecutiveStage2DScopedNavigationEntry(trail, id);
  }
  let stepped = stepBackExecutiveStage2DNavigationTrail(trail);
  stepped = stepBackExecutiveStage2DNavigationTrail(stepped);
  stepped = stepBackExecutiveStage2DNavigationTrail(stepped);
  const scoped = Object.freeze({
    ...stepped,
    scope: trail.scope,
    scopeKey: trail.scopeKey,
  });
  const window = resolveExecutiveStage2DNavigationBreadcrumbWindow(scoped);
  assert.equal(
    window.overflowBefore + window.visibleCount + window.overflowAfter,
    scoped.objectIds.length,
  );
});

test("Invariant M — Internal trail bound", () => {
  let trail = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  for (let i = 0; i < EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS.maxEntries + 5; i += 1) {
    trail = pushExecutiveStage2DScopedNavigationEntry(trail, `obj-${i}`);
  }
  assert.ok(
    trail.objectIds.length <= EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS.maxEntries,
  );
});

test("Invariant N — No relationship inference", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "scenario",
    presentationState: "minimum",
    environmentIntent: "simulate",
  });
  const presentation = pipelineFromState(state);
  const invented = presentation.scene.connections.some(
    (connection) =>
      connection.relation === "navigation-history" ||
      connection.id.includes("trail-scope"),
  );
  assert.equal(invented, false);
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_BOUNDARY.inventsRelationships,
    false,
  );
  const fixtureHas = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
    (edge) =>
      edge.id.includes("trail") || edge.id.includes("workspace"),
  );
  assert.equal(fixtureHas, false);
});

test("Invariant O — One-hop regression", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = selectNexoraMVPInteractionSubject(state, "obj-customer");
  const presentation = pipelineFromState(state);
  const recomp = (
    presentation.scene as {
      readonly stage2dRecomposition?: { readonly neighborhoodDepth: number };
    }
  ).stage2dRecomposition;
  assert.equal(recomp?.neighborhoodDepth, 1);
  assert.equal(
    EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_BOUNDARY.expandsNeighborhoodBeyondOneHop,
    false,
  );
});

test("Invariant P — Anchor regression", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-delivery");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: "scenario",
    presentationState: "minimum",
    environmentIntent: "simulate",
  });
  const presentation = pipelineFromState(state);
  const delivery = presentation.scene.objects.find(
    (entry) => entry.id === "obj-delivery",
  );
  assert.ok(delivery);
  assert.deepEqual(delivery.targetPosition, [0, 0, 0]);
});

test("Invariant Q — Planarity regression", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  const presentation = pipelineFromState(state);
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
  for (const connection of presentation.scene.connections) {
    if (connection.routePoints) {
      for (const point of connection.routePoints) {
        assert.equal(point[2], 0);
      }
    }
  }
});

test("Invariant R — Camera regression", () => {
  const presentation = pipelineFromState(
    selectNexoraMVPInteractionSubject(initial(), "obj-capacity"),
  );
  const fixed = resolveExecutiveStageFixedCamera();
  assert.deepEqual(presentation.scene.camera.position, [
    fixed.position.x,
    fixed.position.y,
    fixed.position.z,
  ]);
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
  assert.equal(fixed.position.z, EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE);
});

test("Invariant S — Overview reset", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.mode, "overview");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, []);
  assert.equal(state.stage2dNavigationTrail.currentIndex, -1);
  assert.equal(state.stage2dNavigationScopeStatus, "reset");
  assert.ok(state.stage2dNavigationTrail.scopeKey.includes("workspace.overview"));
});

test("Invariant T — Determinism", () => {
  const run = () => {
    let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    state = selectNexoraMVPInteractionSubject(state, "obj-delivery");
    state = selectNexoraMVPInteractionSubject(state, "obj-customer");
    state = stepBackNexoraMVPObjectInteraction(state);
    state = stepForwardNexoraMVPObjectInteraction(state);
    state = syncNexoraMVPObjectInteractionShellContext(state, {
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    const presentation = deriveNexoraMVPStageInteractionPresentation(state);
    return {
      trail: state.stage2dNavigationTrail,
      breadcrumb: presentation.breadcrumb.map((entry) => entry.label),
      overflowBefore: presentation.breadcrumbOverflowBefore,
      overflowAfter: presentation.breadcrumbOverflowAfter,
    };
  };
  assert.deepEqual(run(), run());
});

test("Stage host exposes STAGE-2D:6 observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-navigation-scope/);
  assert.match(host, /data-stage-navigation-scope-status/);
  assert.match(host, /data-stage-navigation-visible-count/);
  assert.match(host, /data-stage-navigation-overflow-before/);
  assert.match(host, /data-stage-navigation-overflow-after/);
  assert.match(host, /stage-2d-6|getExecutiveStage2DNavigationContextObservability/);
});
