import assert from "node:assert/strict";
import test from "node:test";

import {
  dismissEmptyWorkspaceOnboarding,
  getEmptyWorkspaceSceneJson,
  openEmptyWorkspaceModelingPlaceholder,
  reopenEmptyWorkspaceOnboarding,
  resolveEmptyWorkspaceState,
} from "./emptyWorkspaceContract.ts";
import {
  DEMO_WORKSPACE,
  type Workspace,
} from "./workspaceRegistryContract.ts";

function workspace(overrides: Partial<Workspace> = {}): Workspace {
  return {
    workspaceId: overrides.workspaceId ?? "empty_workspace",
    workspaceName: overrides.workspaceName ?? "Empty Workspace",
    status: overrides.status ?? "active",
    createdAt: overrides.createdAt ?? "2026-06-20T00:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-06-20T00:00:00.000Z",
    lastOpenedAt: overrides.lastOpenedAt ?? "2026-06-20T00:00:00.000Z",
    metadata: overrides.metadata,
  };
}

test("detects a newly created non-demo workspace as empty", () => {
  const state = resolveEmptyWorkspaceState(workspace());

  assert.equal(state?.state, "empty");
  assert.equal(state?.hasUserObjects, false);
  assert.equal(state?.hasUserRelationships, false);
  assert.equal(state?.hasUserDataSources, false);
  assert.equal(state?.hasApprovedModel, false);
  assert.equal(state?.onboardingState, "welcome");
});

test("does not mark Demo Workspace as empty", () => {
  const state = resolveEmptyWorkspaceState(DEMO_WORKSPACE);

  assert.equal(state?.state, "modeled");
  assert.equal(state?.reason, "demo_workspace");
});

test("respects future approved model metadata", () => {
  const state = resolveEmptyWorkspaceState(
    workspace({
      metadata: { approvedModel: true },
    })
  );

  assert.equal(state?.state, "modeled");
  assert.equal(state?.hasApprovedModel, true);
});

test("tracks dismissed and placeholder onboarding per workspace", () => {
  const target = workspace({ workspaceId: "onboarding_workspace" });

  dismissEmptyWorkspaceOnboarding(target.workspaceId);
  assert.equal(resolveEmptyWorkspaceState(target)?.onboardingState, "dismissed");

  openEmptyWorkspaceModelingPlaceholder(target.workspaceId);
  assert.equal(resolveEmptyWorkspaceState(target)?.onboardingState, "modeling_placeholder");

  reopenEmptyWorkspaceOnboarding(target.workspaceId);
  assert.equal(resolveEmptyWorkspaceState(target)?.onboardingState, "welcome");
});

test("creates an empty workspace scene without renderable model objects", () => {
  const scene = getEmptyWorkspaceSceneJson("empty_workspace");

  assert.equal(scene.meta?.emptyWorkspace, true);
  assert.equal(scene.meta?.workspaceId, "empty_workspace");
  assert.deepEqual(scene.scene.objects, []);
  assert.deepEqual(scene.scene.relationships, []);
});
