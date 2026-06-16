import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_MRP_SELECTED_OBJECT } from "../mrpContext/mrpContextStoreContract.ts";
import {
  EXEC_SUMMARY_OBJECT_CONTEXT_TAG,
  DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
} from "./executiveSummary/executiveSummaryObjectContextContract.ts";
import {
  resolveExecutiveSummaryObjectContext,
} from "./executiveSummary/executiveSummaryObjectContextResolver.ts";
import {
  resetExecutiveSummaryObjectContextRuntimeForTests,
  syncExecutiveSummaryObjectContext,
} from "./executiveSummary/executiveSummaryObjectContextRuntime.ts";
import {
  getExecutiveSummaryState,
  hydrateExecutiveSummaryStateOnMount,
  resetExecutiveSummaryStateRuntimeForTests,
} from "./executiveSummary/executiveSummaryStateRuntime.ts";
import { buildExecutiveSummaryWorkspaceViewFromState } from "./executiveSummary/executiveSummaryStateViewMapper.ts";
import { createExecutiveSummaryDefaultReadyState } from "./executiveSummary/executiveSummaryStateRuntime.ts";

test.beforeEach(() => {
  resetExecutiveSummaryObjectContextRuntimeForTests();
  resetExecutiveSummaryStateRuntimeForTests();
});

test("exports object context tag", () => {
  assert.equal(EXEC_SUMMARY_OBJECT_CONTEXT_TAG, "[EXEC_SUMMARY_OBJECT_CONTEXT]");
});

test("resolveExecutiveSummaryObjectContext returns safe defaults when deselected", () => {
  const context = resolveExecutiveSummaryObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  assert.equal(context.hasSelection, false);
  assert.equal(context.selectedObject, DEFAULT_MRP_SELECTED_OBJECT);
  assert.equal(context.objectStatus, "Awaiting selection");
  assert.equal(context.objectPriority, "None");
  assert.equal(context.objectAttentionLevel, "None");
});

test("resolveExecutiveSummaryObjectContext reflects Factory A fixture", () => {
  const context = resolveExecutiveSummaryObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  assert.equal(context.hasSelection, true);
  assert.equal(context.selectedObject, "Factory A");
  assert.equal(context.objectStatus, "Operational");
  assert.equal(context.objectPriority, "High");
  assert.equal(context.objectAttentionLevel, "Elevated");
});

test("resolveExecutiveSummaryObjectContext reflects Supplier Network fixture", () => {
  const context = resolveExecutiveSummaryObjectContext({
    selectedObjectId: "supplier-network",
    selectedObjectLabel: "Supplier Network",
  });
  assert.equal(context.objectStatus, "Monitoring");
  assert.equal(context.objectPriority, "Medium");
  assert.equal(context.objectAttentionLevel, "Watch");
});

test("resolveExecutiveSummaryObjectContext reflects Production Line fixture", () => {
  const context = resolveExecutiveSummaryObjectContext({
    selectedObjectId: "production-line",
    selectedObjectLabel: "Production Line",
  });
  assert.equal(context.objectStatus, "Active");
  assert.equal(context.objectPriority, "High");
  assert.equal(context.objectAttentionLevel, "Focused");
});

test("syncExecutiveSummaryObjectContext updates workspace state read-only", () => {
  syncExecutiveSummaryObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const state = getExecutiveSummaryState();
  assert.equal(state.objectContext.selectedObject, "Factory A");
  assert.equal(state.objectContext.hasSelection, true);
});

test("deselection restores defaults without clearing executive summary fields", () => {
  hydrateExecutiveSummaryStateOnMount("test");
  syncExecutiveSummaryObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncExecutiveSummaryObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const state = getExecutiveSummaryState();
  assert.deepEqual(state.objectContext, DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT);
  assert.equal(state.phase, "ready");
  assert.ok(state.topRisk.headline.trim());
});

test("workspace view includes object context panel data", () => {
  syncExecutiveSummaryObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const view = buildExecutiveSummaryWorkspaceViewFromState(
    getExecutiveSummaryState()
  );
  assert.equal(view.objectContext.selectedObject, "Factory A");
  assert.equal(view.objectContext.objectStatus, "Operational");
});

test("custom object status overrides fixture when provided", () => {
  const context = resolveExecutiveSummaryObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
    selectedObjectStatus: "Under Review",
  });
  assert.equal(context.objectStatus, "Under Review");
});

test("ready defaults include object context structure", () => {
  const state = createExecutiveSummaryDefaultReadyState();
  assert.equal(state.objectContext.hasSelection, false);
  assert.ok(state.objectContext.selectedObject.trim());
});
