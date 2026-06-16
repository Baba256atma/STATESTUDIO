import test from "node:test";
import assert from "node:assert/strict";

import {
  EXEC_SUMMARY_RUNTIME_TAG,
  EXEC_SUMMARY_STATE_TAG,
  DEFAULT_EXECUTIVE_SUMMARY_READY_STATE,
  EXECUTIVE_SUMMARY_EMPTY_DETAIL,
  EXECUTIVE_SUMMARY_EMPTY_HEADLINE,
  EXECUTIVE_SUMMARY_LOADING_DETAIL,
  EXECUTIVE_SUMMARY_LOADING_HEADLINE,
} from "./executiveSummary/executiveSummaryStateContract.ts";
import {
  buildExecutiveSummaryStateSignature,
  createExecutiveSummaryDefaultReadyState,
  createExecutiveSummaryEmptyState,
  createExecutiveSummaryLoadingState,
  getExecutiveSummaryState,
  getExecutiveSummaryStatePublishCountForTests,
  getExecutiveSummaryStateServerSnapshot,
  hydrateExecutiveSummaryStateOnMount,
  publishExecutiveSummaryState,
  resetExecutiveSummaryStateRuntimeForTests,
} from "./executiveSummary/executiveSummaryStateRuntime.ts";
import { buildExecutiveSummaryWorkspaceViewFromState } from "./executiveSummary/executiveSummaryStateViewMapper.ts";

test.beforeEach(() => {
  resetExecutiveSummaryStateRuntimeForTests();
});

test("exports runtime state tags", () => {
  assert.equal(EXEC_SUMMARY_STATE_TAG, "[EXEC_SUMMARY_STATE]");
  assert.equal(EXEC_SUMMARY_RUNTIME_TAG, "[EXEC_SUMMARY_RUNTIME]");
});

test("createExecutiveSummaryDefaultReadyState provides safe defaults", () => {
  const state = createExecutiveSummaryDefaultReadyState();
  assert.equal(state.phase, "ready");
  assert.equal(state.systemStatus, "healthy");
  assert.ok(state.topRisk.headline.trim());
  assert.ok(state.topRisk.detail.trim());
  assert.ok(state.topOpportunity.headline.trim());
  assert.ok(state.topOpportunity.detail.trim());
  assert.ok(state.recommendedAttention.headline.trim());
  assert.ok(state.recommendedAttention.detail.trim());
  assert.equal(state.objectContext.hasSelection, false);
  assert.equal(state.revision, 0);
});

test("loading state uses loading copy for all fields", () => {
  const state = createExecutiveSummaryLoadingState();
  assert.equal(state.phase, "loading");
  assert.equal(state.topRisk.headline, EXECUTIVE_SUMMARY_LOADING_HEADLINE);
  assert.equal(state.topRisk.detail, EXECUTIVE_SUMMARY_LOADING_DETAIL);
  assert.equal(state.topOpportunity.headline, EXECUTIVE_SUMMARY_LOADING_HEADLINE);
  assert.equal(state.recommendedAttention.detail, EXECUTIVE_SUMMARY_LOADING_DETAIL);
});

test("empty state uses empty copy for all fields", () => {
  const state = createExecutiveSummaryEmptyState();
  assert.equal(state.phase, "empty");
  assert.equal(state.topRisk.headline, EXECUTIVE_SUMMARY_EMPTY_HEADLINE);
  assert.equal(state.recommendedAttention.detail, EXECUTIVE_SUMMARY_EMPTY_DETAIL);
});

test("publishExecutiveSummaryState skips duplicate signatures", () => {
  const first = publishExecutiveSummaryState({
    phase: "ready",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.systemStatus,
    topRisk: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topRisk,
    topOpportunity: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topOpportunity,
    recommendedAttention: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.recommendedAttention,
  });
  const second = publishExecutiveSummaryState({
    phase: "ready",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.systemStatus,
    topRisk: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topRisk,
    topOpportunity: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topOpportunity,
    recommendedAttention: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.recommendedAttention,
  });

  assert.equal(first.changed, true);
  assert.equal(second.changed, false);
  assert.equal(getExecutiveSummaryStatePublishCountForTests(), 2);
});

test("hydrateExecutiveSummaryStateOnMount transitions loading to ready", () => {
  hydrateExecutiveSummaryStateOnMount("test-mount");
  const state = getExecutiveSummaryState();
  assert.equal(state.phase, "ready");
  assert.equal(state.systemStatus, "healthy");
  assert.match(state.topRisk.detail, /MRP:4:2/);
});

test("getExecutiveSummaryStateServerSnapshot returns loading defaults", () => {
  publishExecutiveSummaryState({
    phase: "ready",
    systemStatus: "warning",
  });
  const snapshot = getExecutiveSummaryStateServerSnapshot();
  assert.equal(snapshot.phase, "loading");
  assert.equal(snapshot.revision, 0);
});

test("buildExecutiveSummaryWorkspaceViewFromState maps runtime source and phase", () => {
  const view = buildExecutiveSummaryWorkspaceViewFromState(createExecutiveSummaryEmptyState());
  assert.equal(view.phase, "empty");
  assert.equal(view.source, "executive_summary_runtime_state");
  assert.equal(view.cards.length, 4);
  for (const card of view.cards) {
    assert.ok(card.headline.trim());
    assert.ok(card.detail.trim());
    assert.ok(card.tone);
  }
  assert.equal(view.objectContext.hasSelection, false);
});

test("buildExecutiveSummaryStateSignature is stable for identical payloads", () => {
  const payload = {
    phase: "ready" as const,
    systemStatus: "healthy" as const,
    topRisk: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topRisk,
    topOpportunity: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topOpportunity,
    recommendedAttention: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.recommendedAttention,
    objectContext: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.objectContext,
  };
  assert.equal(
    buildExecutiveSummaryStateSignature(payload),
    buildExecutiveSummaryStateSignature(payload)
  );
});
