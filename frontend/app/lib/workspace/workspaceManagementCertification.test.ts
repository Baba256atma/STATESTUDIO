import test from "node:test";
import assert from "node:assert/strict";

import {
  DEMO_WORKSPACE_ID,
  DEMO_WORKSPACE_NAME,
} from "./workspaceRegistryContract.ts";
import {
  archiveWorkspace,
  canDeleteWorkspace,
  createWorkspace,
  deleteWorkspace,
  duplicateWorkspace,
  getActiveWorkspace,
  getActiveWorkspaceId,
  getWorkspaceById,
  getWorkspaceRegistrySnapshot,
  initializeWorkspaceRegistry,
  listActiveWorkspaces,
  listWorkspaces,
  renameWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { selectWorkspaceForRuntime } from "./workspaceSelectionBinding.ts";
import {
  getWorkspaceDataSources,
  getWorkspaceObjects,
  getWorkspaceRisks,
  getWorkspaceScenarios,
  getWorkspaceScopedResources,
} from "./workspaceContextResolver.ts";
import {
  assertWorkspaceOwnership,
  hasWorkspaceOwnership,
  type WorkspaceOwnedObject,
} from "./workspaceOwnershipContract.ts";
import {
  resolveWorkspaceAssistantIsolation,
  resolveWorkspaceDashboardIsolation,
  resolveWorkspaceIsolationContext,
  resolveWorkspaceSceneIsolation,
} from "./workspaceIsolationFoundations.ts";

type WindowStub = {
  dispatchEvent: (event: Event) => boolean;
};

const originalWindow = (globalThis as typeof globalThis & { window?: Window }).window;
const originalCustomEvent = (globalThis as typeof globalThis & { CustomEvent?: typeof CustomEvent }).CustomEvent;

class TestCustomEvent<T = unknown> extends Event {
  detail: T;

  constructor(type: string, init?: CustomEventInit<T>) {
    super(type);
    this.detail = init?.detail as T;
  }
}

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
});

test.afterEach(() => {
  resetWorkspaceRegistryForTests();
  if (originalWindow) {
    (globalThis as typeof globalThis & { window?: Window }).window = originalWindow;
  } else {
    delete (globalThis as typeof globalThis & { window?: Window }).window;
  }
  if (originalCustomEvent) {
    (globalThis as typeof globalThis & { CustomEvent?: typeof CustomEvent }).CustomEvent = originalCustomEvent;
  } else {
    delete (globalThis as typeof globalThis & { CustomEvent?: typeof CustomEvent }).CustomEvent;
  }
});

test("NW-A Gates A-L certify registry, switcher, lifecycle, ownership, and isolation", () => {
  const init = initializeWorkspaceRegistry();

  assert.equal(init.activeWorkspaceId, DEMO_WORKSPACE_ID);
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.workspaceName, DEMO_WORKSPACE_NAME);
  assert.equal(getActiveWorkspace()?.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(getWorkspaceRegistrySnapshot().workspaceOrder.includes(DEMO_WORKSPACE_ID), true);

  const events: Array<{ type: string; detail: unknown }> = [];
  (globalThis as typeof globalThis & { CustomEvent?: typeof CustomEvent }).CustomEvent =
    TestCustomEvent as typeof CustomEvent;
  (globalThis as typeof globalThis & { window?: WindowStub }).window = {
    dispatchEvent: (event: Event) => {
      events.push({
        type: event.type,
        detail: "detail" in event ? (event as CustomEvent).detail : null,
      });
      return true;
    },
  };

  const workspaceA = createWorkspace("Workspace A");
  assert.equal(getActiveWorkspaceId(), workspaceA.workspaceId);
  assert.equal(getWorkspaceById(workspaceA.workspaceId)?.workspaceName, "Workspace A");
  assert.equal(listActiveWorkspaces().some((workspace) => workspace.workspaceId === workspaceA.workspaceId), true);

  const switchBinding = selectWorkspaceForRuntime(DEMO_WORKSPACE_ID);
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(switchBinding.activeWorkspace?.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(switchBinding.isolationContext?.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(events.some((event) => event.type === "nexora:workspace-context-refresh"), true);

  renameWorkspace(workspaceA.workspaceId, "Workspace A Renamed", "2026-06-20T00:00:00.000Z");
  assert.equal(getWorkspaceById(workspaceA.workspaceId)?.workspaceName, "Workspace A Renamed");
  assert.equal(getWorkspaceById(workspaceA.workspaceId)?.workspaceId, workspaceA.workspaceId);

  const duplicate = duplicateWorkspace(workspaceA.workspaceId);
  assert.ok(duplicate);
  assert.notEqual(duplicate.workspaceId, workspaceA.workspaceId);
  assert.equal(duplicate.workspaceName, "Workspace A Renamed Copy");
  assert.equal(getWorkspaceById(workspaceA.workspaceId)?.workspaceName, "Workspace A Renamed");
  assert.equal(listActiveWorkspaces().some((workspace) => workspace.workspaceId === duplicate.workspaceId), true);

  archiveWorkspace(workspaceA.workspaceId, "2026-06-20T01:00:00.000Z");
  assert.equal(getWorkspaceById(workspaceA.workspaceId)?.status, "archived");
  assert.equal(listWorkspaces().some((workspace) => workspace.workspaceId === workspaceA.workspaceId), true);
  assert.equal(listActiveWorkspaces().some((workspace) => workspace.workspaceId === workspaceA.workspaceId), false);

  deleteWorkspace(duplicate.workspaceId);
  assert.equal(getWorkspaceById(duplicate.workspaceId), null);
  assert.ok(getActiveWorkspaceId());
  assert.equal(canDeleteWorkspace(DEMO_WORKSPACE_ID), false);
  deleteWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.status, "active");

  const ownedObject: WorkspaceOwnedObject = Object.freeze({
    workspaceId: DEMO_WORKSPACE_ID,
    resourceId: "object_certification",
    resourceKind: "object",
    objectId: "object_certification",
  });
  assert.equal(hasWorkspaceOwnership(ownedObject), true);
  assert.equal(assertWorkspaceOwnership(ownedObject, DEMO_WORKSPACE_ID), true);
  assert.deepEqual(getWorkspaceObjects(DEMO_WORKSPACE_ID), []);
  assert.deepEqual(getWorkspaceRisks(DEMO_WORKSPACE_ID), []);
  assert.deepEqual(getWorkspaceScenarios(DEMO_WORKSPACE_ID), []);
  assert.deepEqual(getWorkspaceDataSources(DEMO_WORKSPACE_ID), []);
  assert.equal(getWorkspaceScopedResources(DEMO_WORKSPACE_ID).workspaceId, DEMO_WORKSPACE_ID);

  assert.equal(resolveWorkspaceSceneIsolation(DEMO_WORKSPACE_ID).isolated, true);
  assert.equal(resolveWorkspaceDashboardIsolation(DEMO_WORKSPACE_ID).isolated, true);
  assert.equal(resolveWorkspaceAssistantIsolation(DEMO_WORKSPACE_ID).isolated, true);
  assert.equal(resolveWorkspaceIsolationContext(DEMO_WORKSPACE_ID).dataSources.isolated, true);

  const stressWorkspaceA = createWorkspace("Stress Workspace A");
  const workspaceB = createWorkspace("Workspace B");
  const workspaceC = createWorkspace("Workspace C");
  for (const workspaceId of [
    stressWorkspaceA.workspaceId,
    workspaceB.workspaceId,
    workspaceC.workspaceId,
    stressWorkspaceA.workspaceId,
    workspaceB.workspaceId,
    workspaceC.workspaceId,
    stressWorkspaceA.workspaceId,
  ]) {
    const binding = selectWorkspaceForRuntime(workspaceId);
    assert.equal(getActiveWorkspaceId(), workspaceId);
    assert.equal(binding.isolationContext?.workspaceId, workspaceId);
  }

  const finalActiveId = getActiveWorkspaceId();
  assert.ok(finalActiveId);
  assert.equal(getWorkspaceById(finalActiveId)?.status, "active");
});
