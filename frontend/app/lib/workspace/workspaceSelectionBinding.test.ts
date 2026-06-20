import test from "node:test";
import assert from "node:assert/strict";

import type { Workspace } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace, resetWorkspaceRegistryForTests, upsertWorkspace } from "./workspaceRegistryStore.ts";
import { selectWorkspaceForRuntime } from "./workspaceSelectionBinding.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
});

test.afterEach(() => {
  resetWorkspaceRegistryForTests();
});

test("selects workspace and returns stable scene dashboard assistant binding", () => {
  const workspace: Workspace = Object.freeze({
    workspaceId: "workspace_two",
    workspaceName: "Workspace Two",
    status: "active",
    createdAt: "2026-06-19T00:00:00.000Z",
    updatedAt: "2026-06-19T00:00:00.000Z",
    lastOpenedAt: "2026-06-19T00:00:00.000Z",
  });

  upsertWorkspace(workspace);
  const binding = selectWorkspaceForRuntime(workspace.workspaceId);

  assert.equal(getActiveWorkspace()?.workspaceId, workspace.workspaceId);
  assert.equal(binding.activeWorkspace?.workspaceName, "Workspace Two");
  assert.equal(binding.sceneContextStable, true);
  assert.equal(binding.dashboardContextStable, true);
  assert.equal(binding.assistantContextStable, true);
  assert.equal(binding.isolationContext?.workspaceId, workspace.workspaceId);
  assert.equal(binding.isolationContext?.scene.isolated, true);
  assert.equal(binding.isolationContext?.dashboard.isolated, true);
  assert.equal(binding.isolationContext?.assistant.isolated, true);
  assert.equal(binding.isolationContext?.dataSources.isolated, true);
});
