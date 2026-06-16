import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_MRP_SELECTED_OBJECT } from "../mrpContext/mrpContextStoreContract.ts";
import {
  OPERATIONAL_OBJECT_CONTEXT_TAG,
  DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
} from "./operational/operationalObjectContextContract.ts";
import {
  resolveOperationalObjectContext,
} from "./operational/operationalObjectContextResolver.ts";
import {
  resetOperationalObjectContextRuntimeForTests,
  syncOperationalObjectContext,
} from "./operational/operationalObjectContextRuntime.ts";
import {
  getOperationalWorkspaceState,
  hydrateOperationalWorkspaceStateOnMount,
  resetOperationalWorkspaceStateRuntimeForTests,
} from "./operational/operationalWorkspaceStateRuntime.ts";
import { buildOperationalWorkspaceViewFromState } from "./operational/operationalWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetOperationalObjectContextRuntimeForTests();
  resetOperationalWorkspaceStateRuntimeForTests();
});

test("exports object context tag", () => {
  assert.equal(OPERATIONAL_OBJECT_CONTEXT_TAG, "[OPERATIONAL_OBJECT_CONTEXT]");
});

test("resolveOperationalObjectContext returns safe defaults when deselected", () => {
  const context = resolveOperationalObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  assert.equal(context.hasSelection, false);
  assert.equal(context.selectedObject, DEFAULT_MRP_SELECTED_OBJECT);
  assert.equal(context.objectOperationalStatus, "Awaiting selection");
  assert.equal(context.objectActivityLevel, "None");
  assert.equal(context.objectAttentionPriority, "None");
});

test("resolveOperationalObjectContext reflects Factory A fixture", () => {
  const context = resolveOperationalObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  assert.equal(context.hasSelection, true);
  assert.equal(context.selectedObject, "Factory A");
  assert.equal(context.objectOperationalStatus, "Running");
  assert.equal(context.objectActivityLevel, "High");
  assert.equal(context.objectAttentionPriority, "Elevated");
});

test("resolveOperationalObjectContext reflects Supplier Network fixture", () => {
  const context = resolveOperationalObjectContext({
    selectedObjectId: "supplier-network",
    selectedObjectLabel: "Supplier Network",
  });
  assert.equal(context.objectOperationalStatus, "Monitoring");
  assert.equal(context.objectActivityLevel, "Medium");
  assert.equal(context.objectAttentionPriority, "Watch");
});

test("resolveOperationalObjectContext reflects Production Line fixture", () => {
  const context = resolveOperationalObjectContext({
    selectedObjectId: "production-line",
    selectedObjectLabel: "Production Line",
  });
  assert.equal(context.objectOperationalStatus, "Active");
  assert.equal(context.objectActivityLevel, "High");
  assert.equal(context.objectAttentionPriority, "Focused");
});

test("resolveOperationalObjectContext reflects Project Alpha fixture", () => {
  const context = resolveOperationalObjectContext({
    selectedObjectId: "project-alpha",
    selectedObjectLabel: "Project Alpha",
  });
  assert.equal(context.objectOperationalStatus, "In Progress");
  assert.equal(context.objectActivityLevel, "Medium");
  assert.equal(context.objectAttentionPriority, "Priority");
});

test("syncOperationalObjectContext updates workspace state read-only", () => {
  syncOperationalObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const state = getOperationalWorkspaceState();
  assert.equal(state.objectContext.selectedObject, "Factory A");
  assert.equal(state.objectContext.hasSelection, true);
});

test("deselection restores defaults without clearing operational fields", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  syncOperationalObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncOperationalObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const state = getOperationalWorkspaceState();
  assert.deepEqual(state.objectContext, DEFAULT_OPERATIONAL_OBJECT_CONTEXT);
  assert.equal(state.phase, "ready");
  assert.ok(state.operationalFocus.headline.trim());
});

test("workspace view includes object context panel data", () => {
  syncOperationalObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const view = buildOperationalWorkspaceViewFromState(getOperationalWorkspaceState());
  assert.equal(view.objectContext.selectedObject, "Factory A");
  assert.equal(view.objectContext.objectOperationalStatus, "Running");
});

test("custom object status overrides fixture when provided", () => {
  const context = resolveOperationalObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
    selectedObjectStatus: "Under Review",
  });
  assert.equal(context.objectOperationalStatus, "Under Review");
  assert.equal(context.objectActivityLevel, "High");
  assert.equal(context.objectAttentionPriority, "Elevated");
});
