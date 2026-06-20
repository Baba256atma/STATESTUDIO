import test from "node:test";
import assert from "node:assert/strict";

import { createWorkspace, resetWorkspaceRegistryForTests } from "./workspaceRegistryStore.ts";
import {
  assertWorkspaceOwnership,
  hasWorkspaceOwnership,
  type WorkspaceOwnedObject,
} from "./workspaceOwnershipContract.ts";
import {
  getWorkspaceDataSources,
  getWorkspaceObjects,
  getWorkspaceOwnershipCounts,
  getWorkspaceRisks,
  getWorkspaceScenarios,
  getWorkspaceScopedResources,
  resolveWorkspaceIdForOwnership,
} from "./workspaceContextResolver.ts";
import {
  resolveWorkspaceAssistantIsolation,
  resolveWorkspaceDashboardIsolation,
  resolveWorkspaceDataSourceIsolation,
  resolveWorkspaceIsolationContext,
  resolveWorkspaceSceneIsolation,
} from "./workspaceIsolationFoundations.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
});

test.afterEach(() => {
  resetWorkspaceRegistryForTests();
});

test("owned resources declare workspaceId ownership", () => {
  const object: WorkspaceOwnedObject = Object.freeze({
    workspaceId: "workspace_a",
    resourceId: "object_1",
    resourceKind: "object",
    objectId: "object_1",
    objectName: "Object One",
  });

  assert.equal(hasWorkspaceOwnership(object), true);
  assert.equal(assertWorkspaceOwnership(object, "workspace_a"), true);
  assert.equal(assertWorkspaceOwnership(object, "workspace_b"), false);
});

test("context resolver returns workspace-scoped empty collections by default", () => {
  const workspace = createWorkspace("Isolated Workspace");
  const scoped = getWorkspaceScopedResources(workspace.workspaceId);

  assert.equal(scoped.workspaceId, workspace.workspaceId);
  assert.deepEqual(getWorkspaceObjects(workspace.workspaceId), []);
  assert.deepEqual(getWorkspaceRisks(workspace.workspaceId), []);
  assert.deepEqual(getWorkspaceScenarios(workspace.workspaceId), []);
  assert.deepEqual(getWorkspaceDataSources(workspace.workspaceId), []);
  assert.equal(scoped.counts.objects, 0);
  assert.equal(scoped.counts.dataSources, 0);
});

test("isolation foundations bind scene dashboard assistant and data sources to one workspace", () => {
  const workspace = createWorkspace("Isolation Workspace");
  const scene = resolveWorkspaceSceneIsolation(workspace.workspaceId);
  const dashboard = resolveWorkspaceDashboardIsolation(workspace.workspaceId);
  const assistant = resolveWorkspaceAssistantIsolation(workspace.workspaceId);
  const dataSources = resolveWorkspaceDataSourceIsolation(workspace.workspaceId);
  const isolation = resolveWorkspaceIsolationContext(workspace.workspaceId);

  assert.equal(scene.workspaceId, workspace.workspaceId);
  assert.equal(dashboard.workspaceId, workspace.workspaceId);
  assert.equal(assistant.workspaceId, workspace.workspaceId);
  assert.equal(dataSources.workspaceId, workspace.workspaceId);
  assert.equal(isolation.workspaceId, workspace.workspaceId);
  assert.equal(isolation.scene.isolated, true);
  assert.equal(isolation.dashboard.isolated, true);
  assert.equal(isolation.assistant.isolated, true);
  assert.equal(isolation.dataSources.isolated, true);
});

test("ownership diagnostics expose scoped counts", () => {
  const workspace = createWorkspace("Diagnostics Workspace");
  const counts = getWorkspaceOwnershipCounts(workspace.workspaceId);

  assert.equal(resolveWorkspaceIdForOwnership(workspace.workspaceId), workspace.workspaceId);
  assert.equal(counts.objects, 0);
  assert.equal(counts.risks, 0);
  assert.equal(counts.scenarios, 0);
  assert.equal(counts.dataSources, 0);
});
