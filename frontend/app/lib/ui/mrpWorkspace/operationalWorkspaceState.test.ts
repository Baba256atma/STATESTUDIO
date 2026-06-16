import test from "node:test";
import assert from "node:assert/strict";

import {
  OPERATIONAL_RUNTIME_TAG,
  OPERATIONAL_STATE_TAG,
  DEFAULT_OPERATIONAL_READY_STATE,
  OPERATIONAL_EMPTY_DETAIL,
  OPERATIONAL_EMPTY_HEADLINE,
  OPERATIONAL_LOADING_DETAIL,
  OPERATIONAL_LOADING_HEADLINE,
} from "./operational/operationalWorkspaceStateContract.ts";
import {
  buildOperationalWorkspaceStateSignature,
  createOperationalDefaultReadyState,
  createOperationalEmptyState,
  createOperationalLoadingState,
  getOperationalWorkspaceState,
  getOperationalWorkspaceStatePublishCountForTests,
  getOperationalWorkspaceStateServerSnapshot,
  hydrateOperationalWorkspaceStateOnMount,
  publishOperationalWorkspaceState,
  resetOperationalWorkspaceStateRuntimeForTests,
} from "./operational/operationalWorkspaceStateRuntime.ts";
import { buildOperationalWorkspaceViewFromState } from "./operational/operationalWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetOperationalWorkspaceStateRuntimeForTests();
});

test("exports runtime state tags", () => {
  assert.equal(OPERATIONAL_STATE_TAG, "[OPERATIONAL_STATE]");
  assert.equal(OPERATIONAL_RUNTIME_TAG, "[OPERATIONAL_RUNTIME]");
});

test("createOperationalDefaultReadyState provides safe defaults", () => {
  const state = createOperationalDefaultReadyState();
  assert.equal(state.phase, "ready");
  assert.equal(state.operationalStatus, "healthy");
  assert.equal(state.activityLevel, "medium");
  assert.ok(state.operationalFocus.headline.trim());
  assert.ok(state.operationalFocus.detail.trim());
  assert.ok(state.operationalNotes.headline.trim());
  assert.ok(state.operationalNotes.detail.trim());
  assert.deepEqual(state.objectContext, DEFAULT_OPERATIONAL_READY_STATE.objectContext);
});

test("loading state uses loading copy for focus and notes", () => {
  const state = createOperationalLoadingState();
  assert.equal(state.phase, "loading");
  assert.equal(state.operationalFocus.headline, OPERATIONAL_LOADING_HEADLINE);
  assert.equal(state.operationalNotes.detail, OPERATIONAL_LOADING_DETAIL);
});

test("empty state uses empty copy for focus and notes", () => {
  const state = createOperationalEmptyState();
  assert.equal(state.phase, "empty");
  assert.equal(state.operationalFocus.headline, OPERATIONAL_EMPTY_HEADLINE);
  assert.equal(state.operationalNotes.detail, OPERATIONAL_EMPTY_DETAIL);
});

test("publishOperationalWorkspaceState skips duplicate signatures", () => {
  const first = publishOperationalWorkspaceState({
    phase: "ready",
    operationalStatus: DEFAULT_OPERATIONAL_READY_STATE.operationalStatus,
    activityLevel: DEFAULT_OPERATIONAL_READY_STATE.activityLevel,
    operationalFocus: DEFAULT_OPERATIONAL_READY_STATE.operationalFocus,
    operationalNotes: DEFAULT_OPERATIONAL_READY_STATE.operationalNotes,
  });
  const second = publishOperationalWorkspaceState({
    phase: "ready",
    operationalStatus: DEFAULT_OPERATIONAL_READY_STATE.operationalStatus,
    activityLevel: DEFAULT_OPERATIONAL_READY_STATE.activityLevel,
    operationalFocus: DEFAULT_OPERATIONAL_READY_STATE.operationalFocus,
    operationalNotes: DEFAULT_OPERATIONAL_READY_STATE.operationalNotes,
  });

  assert.equal(first.changed, true);
  assert.equal(second.changed, false);
  assert.equal(getOperationalWorkspaceStatePublishCountForTests(), 2);
});

test("hydrateOperationalWorkspaceStateOnMount transitions loading to ready", () => {
  hydrateOperationalWorkspaceStateOnMount("test-mount");
  const state = getOperationalWorkspaceState();
  assert.equal(state.phase, "ready");
  assert.equal(state.operationalStatus, "healthy");
  assert.match(state.operationalFocus.detail, /MRP:4:8/);
});

test("getOperationalWorkspaceStateServerSnapshot returns loading defaults", () => {
  publishOperationalWorkspaceState({
    phase: "ready",
    operationalStatus: "warning",
  });
  const snapshot = getOperationalWorkspaceStateServerSnapshot();
  assert.equal(snapshot.phase, "loading");
  assert.equal(snapshot.revision, 0);
});

test("buildOperationalWorkspaceViewFromState maps runtime source and phase", () => {
  const view = buildOperationalWorkspaceViewFromState(createOperationalEmptyState());
  assert.equal(view.phase, "empty");
  assert.equal(view.source, "operational_workspace_runtime_state");
  assert.equal(view.cards.length, 4);
  for (const card of view.cards) {
    assert.ok(card.headline.trim());
    assert.ok(card.detail.trim());
  }
});

test("buildOperationalWorkspaceStateSignature is stable for identical payloads", () => {
  const payload = {
    phase: "ready" as const,
    operationalStatus: "healthy" as const,
    activityLevel: "medium" as const,
    operationalFocus: DEFAULT_OPERATIONAL_READY_STATE.operationalFocus,
    operationalNotes: DEFAULT_OPERATIONAL_READY_STATE.operationalNotes,
    objectContext: DEFAULT_OPERATIONAL_READY_STATE.objectContext,
  };
  assert.equal(
    buildOperationalWorkspaceStateSignature(payload),
    buildOperationalWorkspaceStateSignature(payload)
  );
});
