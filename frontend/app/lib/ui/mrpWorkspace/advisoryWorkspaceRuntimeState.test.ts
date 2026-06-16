import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_STATE_VERSION,
  MRP_ADVISORY_RUNTIME_TAG,
} from "./advisory/advisoryStateContract.ts";
import {
  resolveAdvisoryRecommendationRuntimeFromContext,
} from "./advisory/advisoryStateContextResolver.ts";
import {
  selectAdvisoryConfidence,
  selectAdvisoryHasRecommendation,
  selectAdvisoryRecommendationId,
  selectAdvisoryRecommendationTitle,
  selectAdvisorySelectedObjectId,
  selectAdvisorySourceScenarioId,
} from "./advisory/advisoryStateSelectors.ts";
import {
  hydrateAdvisoryStateOnMount,
  resetAdvisoryStateRuntimeForTests,
  syncAdvisoryStateFromContext,
  traceAdvisoryRuntimeOnce,
} from "./advisory/advisoryStateRuntime.ts";
import {
  guardAdvisorySceneWrite,
  resetAdvisorySceneAwarenessRuntimeForTests,
} from "./advisory/advisorySceneAwarenessRuntime.ts";
import { resolveAdvisoryWorkspaceContext } from "./advisory/advisoryWorkspaceContextResolver.ts";
import {
  getAdvisoryWorkspaceState,
  hydrateAdvisoryWorkspaceStateOnMount,
  resetAdvisoryWorkspaceStateRuntimeForTests,
} from "./advisory/advisoryWorkspaceStateRuntime.ts";
import {
  syncAdvisoryWorkspaceContext,
  resetAdvisoryWorkspaceContextRuntimeForTests,
} from "./advisory/advisoryWorkspaceContextRuntime.ts";
import { resetAdvisoryWorkspaceRuntimeForTests } from "./advisory/advisoryWorkspaceRuntime.ts";
import { buildAdvisoryWorkspaceViewFromState } from "./advisory/advisoryWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetAdvisoryWorkspaceRuntimeForTests();
  resetAdvisoryStateRuntimeForTests();
  resetAdvisorySceneAwarenessRuntimeForTests();
  resetAdvisoryWorkspaceStateRuntimeForTests();
  resetAdvisoryWorkspaceContextRuntimeForTests();
});

test("exports advisory runtime freeze tag and version", () => {
  assert.equal(MRP_ADVISORY_RUNTIME_TAG, "[MRP_ADVISORY_RUNTIME]");
  assert.equal(ADVISORY_STATE_VERSION, "5A.2.0");
});

test("context resolver hydrates recommendation runtime fields", () => {
  const context = resolveAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });

  const runtime = resolveAdvisoryRecommendationRuntimeFromContext({ workspaceContext: context });

  assert.equal(runtime.recommendationId, "recommendation:factory-a");
  assert.equal(runtime.recommendationTitle, "Capacity stabilization");
  assert.equal(runtime.confidence, "moderate");
  assert.equal(runtime.selectedObjectId, "factory-a");
  assert.equal(runtime.sourceScenarioId, "scenario:factory-a:expected_case");
  assert.ok(runtime.rationale?.includes("Factory A"));
});

test("selectors read AdvisoryWorkspaceState recommendation fields", () => {
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "machine-a",
    selectedObjectLabel: "Production Line",
  });

  const state = getAdvisoryWorkspaceState();
  assert.equal(selectAdvisoryRecommendationId(state), "recommendation:machine-a");
  assert.equal(selectAdvisoryRecommendationTitle(state), "Shift reallocation");
  assert.equal(selectAdvisoryConfidence(state), "moderate");
  assert.equal(selectAdvisorySelectedObjectId(state), "machine-a");
  assert.equal(selectAdvisorySourceScenarioId(state), "scenario:machine-a:expected_case");
  assert.equal(selectAdvisoryHasRecommendation(state), true);
});

test("hydrateAdvisoryWorkspaceStateOnMount resolves runtime and card snapshots", () => {
  hydrateAdvisoryWorkspaceStateOnMount("cert-5a2");

  const state = getAdvisoryWorkspaceState();
  assert.equal(state.phase, "ready");
  assert.equal(state.recommendationId, null);

  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });

  const hydrated = getAdvisoryWorkspaceState();
  assert.equal(hydrated.recommendationId, "recommendation:factory-a");
  assert.match(hydrated.executiveRecommendation.detail, /\[MRP_ADVISORY_RUNTIME\]/);

  const view = buildAdvisoryWorkspaceViewFromState(hydrated);
  assert.equal(view.cards[0]?.headline, "Capacity stabilization");
});

test("syncAdvisoryStateFromContext publishes through workspace store", () => {
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "supplier-1",
    selectedObjectLabel: "Supplier Network",
  });

  const runtime = syncAdvisoryStateFromContext();
  assert.equal(runtime.recommendationId, "recommendation:supplier-1");
  assert.equal(getAdvisoryWorkspaceState().recommendationTitle, "Dual-source activation");
});

test("hydrateAdvisoryStateOnMount traces runtime activation", () => {
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "alpha",
    selectedObjectLabel: "Project Alpha",
  });

  const runtime = hydrateAdvisoryStateOnMount("mount-5a2");
  assert.equal(runtime.selectedObjectId, "alpha");
  traceAdvisoryRuntimeOnce("mount-5a2");
  traceAdvisoryRuntimeOnce("mount-5a2");
});

test("blocks all advisory scene writes", () => {
  for (const capability of [
    "modify_scene",
    "move_objects",
    "modify_topology",
    "change_camera",
    "control_scene",
  ] as const) {
    const result = guardAdvisorySceneWrite({ capability, source: "cert-5a2" });
    assert.equal(result.allowed, false, capability);
  }
});

test("empty context resets recommendation runtime fields", () => {
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncAdvisoryWorkspaceContext({});

  const state = getAdvisoryWorkspaceState();
  assert.equal(state.recommendationId, null);
  assert.equal(state.selectedObjectId, null);
  assert.equal(state.confidence, "unknown");
});
