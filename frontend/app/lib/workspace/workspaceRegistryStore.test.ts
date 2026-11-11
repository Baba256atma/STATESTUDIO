import test from "node:test";
import assert from "node:assert/strict";

import { evaluateWorkspaceAuthority } from "./workspaceAuthorityFence.ts";
import {
  BUSINESS_DEMO_WORKSPACE_ID,
  DEMO_WORKSPACE_ID,
  DEMO_WORKSPACE_NAME,
  type Workspace,
} from "./workspaceRegistryContract.ts";
import {
  canArchiveWorkspace,
  canDeleteWorkspace,
  archiveWorkspace,
  createWorkspace,
  deleteWorkspace,
  duplicateWorkspace,
  getActiveWorkspace,
  getActiveWorkspaceId,
  getWorkspaceById,
  getWorkspaceRegistrySnapshot,
  listActiveWorkspaces,
  listWorkspaces,
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY,
  abandonWorkspaceRegistryMemoryForTests,
  failWorkspaceRevocationPersistForTests,
  recoverWorkspaceRegistryFromStorage,
  renameWorkspace,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
  subscribeWorkspaceRegistry,
  upsertWorkspace,
} from "./workspaceRegistryStore.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
});

test.afterEach(() => {
  resetWorkspaceRegistryForTests();
});

test("creates the demo workspace as the initial active workspace", () => {
  const snapshot = getWorkspaceRegistrySnapshot();
  assert.equal(snapshot.activeWorkspaceId, DEMO_WORKSPACE_ID);
  assert.deepEqual(snapshot.workspaceOrder, [DEMO_WORKSPACE_ID, BUSINESS_DEMO_WORKSPACE_ID]);
  assert.equal(getWorkspaceById(BUSINESS_DEMO_WORKSPACE_ID)?.kind, undefined);
  assert.equal(getActiveWorkspace()?.workspaceName, DEMO_WORKSPACE_NAME);
  assert.equal(getActiveWorkspace()?.status, "active");
});

test("looks up workspaces by id and returns null for unknown ids", () => {
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(getWorkspaceById("missing"), null);
  assert.equal(getWorkspaceById(""), null);
});

test("supports future workspace CRUD attachment through mutations", () => {
  const nextWorkspace: Workspace = Object.freeze({
    workspaceId: "future_workspace",
    workspaceName: "Future Workspace",
    status: "active",
    createdAt: "2026-06-19T00:00:00.000Z",
    updatedAt: "2026-06-19T00:00:00.000Z",
    lastOpenedAt: "2026-06-19T00:00:00.000Z",
    domain: "supply_chain",
    objectCount: 0,
    dataSourceCount: 0,
  });

  upsertWorkspace(nextWorkspace);
  setActiveWorkspace(nextWorkspace.workspaceId);

  assert.equal(listWorkspaces().length, 3);
  assert.equal(getActiveWorkspaceId(), "future_workspace");
  assert.equal(getActiveWorkspace()?.domain, "supply_chain");

  archiveWorkspace(nextWorkspace.workspaceId, "2026-06-20T00:00:00.000Z");
  assert.equal(getWorkspaceById(nextWorkspace.workspaceId)?.status, "archived");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
});

test("notifies subscribers when registry state changes", () => {
  let notifications = 0;
  const unsubscribe = subscribeWorkspaceRegistry(() => {
    notifications += 1;
  });

  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(notifications, 0);

  const workspace = createWorkspace("Notify Workspace");
  assert.equal(notifications, 2);

  archiveWorkspace(workspace.workspaceId);
  assert.equal(notifications, 3);

  unsubscribe();
});

test("creates a workspace and activates it", () => {
  const workspace = createWorkspace("North America Ops");

  assert.equal(getActiveWorkspaceId(), workspace.workspaceId);
  assert.equal(getWorkspaceById(workspace.workspaceId)?.workspaceName, "North America Ops");
  assert.equal(getWorkspaceById(workspace.workspaceId)?.objectCount, 0);
  assert.equal(listActiveWorkspaces().length, 3);
});

test("renames a workspace while preserving identity", () => {
  const workspace = createWorkspace("Original Name");
  renameWorkspace(workspace.workspaceId, "Renamed Workspace", "2026-06-21T00:00:00.000Z");

  const renamed = getWorkspaceById(workspace.workspaceId);
  assert.equal(renamed?.workspaceId, workspace.workspaceId);
  assert.equal(renamed?.workspaceName, "Renamed Workspace");
  assert.equal(renamed?.updatedAt, "2026-06-21T00:00:00.000Z");
});

test("duplicates a workspace shell with consistent copy naming", () => {
  const workspace = createWorkspace("Planning Workspace");
  const duplicate = duplicateWorkspace(workspace.workspaceId);

  assert.ok(duplicate);
  assert.notEqual(duplicate?.workspaceId, workspace.workspaceId);
  assert.equal(duplicate?.workspaceName, "Planning Workspace Copy");
  assert.equal(duplicate?.metadata?.duplicatedFromWorkspaceId, workspace.workspaceId);
  assert.equal(getActiveWorkspaceId(), duplicate?.workspaceId);
});

test("archives workspace without orphaning active workspace", () => {
  const workspace = createWorkspace("Archive Me");
  assert.equal(canArchiveWorkspace(workspace.workspaceId), true);

  archiveWorkspace(workspace.workspaceId, "2026-06-22T00:00:00.000Z");

  assert.equal(getWorkspaceById(workspace.workspaceId)?.status, "archived");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(listActiveWorkspaces().some((entry) => entry.workspaceId === workspace.workspaceId), false);
});

test("deletes active workspace and falls back to a valid active workspace", () => {
  const workspace = createWorkspace("Delete Me");
  assert.equal(canDeleteWorkspace(workspace.workspaceId), true);

  deleteWorkspace(workspace.workspaceId);

  assert.equal(getWorkspaceById(workspace.workspaceId), null);
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.ok(getActiveWorkspace());
});

test("prevents deleting or archiving the last active workspace", () => {
  assert.equal(canDeleteWorkspace(DEMO_WORKSPACE_ID), false);
  assert.equal(canArchiveWorkspace(DEMO_WORKSPACE_ID), false);

  deleteWorkspace(DEMO_WORKSPACE_ID);
  archiveWorkspace(DEMO_WORKSPACE_ID);

  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.status, "active");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(listActiveWorkspaces().length, 2);
});

test("a stale registry snapshot cannot restore a revoked workspace", () => {
  const data = new Map<string, string>();
  const localStorage = {
    get length() { return data.size; },
    clear() { data.clear(); },
    getItem(key: string) { return data.get(key) ?? null; },
    key(index: number) { return [...data.keys()][index] ?? null; },
    removeItem(key: string) { data.delete(key); },
    setItem(key: string, value: string) { data.set(key, value); },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: localStorage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage, dispatchEvent() { return true; } },
  });
  try {
    resetWorkspaceRegistryForTests();
    const created = createWorkspace("Stale Resurrection");
    deleteWorkspace(created.workspaceId);
    const durable = localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY);
    assert.ok(durable);
    const poison = JSON.parse(durable);
    poison.workspaces[created.workspaceId] = created;
    if (!poison.workspaceOrder.includes(created.workspaceId)) poison.workspaceOrder.push(created.workspaceId);
    poison.activeWorkspaceId = created.workspaceId;
    delete poison.revokedWorkspaces[created.workspaceId];
    localStorage.setItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY, JSON.stringify(poison));

    const repaired = recoverWorkspaceRegistryFromStorage(durable);
    const stored = JSON.parse(localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY) ?? "{}");
    assert.equal(repaired.workspaces[created.workspaceId], undefined);
    assert.equal(stored.workspaces[created.workspaceId], undefined);
    assert.equal(stored.activeWorkspaceId, DEMO_WORKSPACE_ID);
    assert.equal(stored.revokedWorkspaces[created.workspaceId].generation >= 1, true);
    assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.status, "active");
    assert.equal(getWorkspaceById(BUSINESS_DEMO_WORKSPACE_ID)?.status, "active");
  } finally {
    resetWorkspaceRegistryForTests();
    delete (globalThis as { localStorage?: unknown }).localStorage;
    delete (globalThis as { window?: unknown }).window;
  }
});

test("a cold start cannot restore a revoked workspace from an obsolete active snapshot", () => {
  const data = new Map<string, string>();
  const localStorage = {
    get length() { return data.size; },
    clear() { data.clear(); },
    getItem(key: string) { return data.get(key) ?? null; },
    key(index: number) { return [...data.keys()][index] ?? null; },
    removeItem(key: string) { data.delete(key); },
    setItem(key: string, value: string) { data.set(key, value); },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: localStorage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage, dispatchEvent() { return true; } },
  });
  try {
    resetWorkspaceRegistryForTests();
    const created = createWorkspace("Cold Start Resurrection");
    deleteWorkspace(created.workspaceId);
    const durable = localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY);
    assert.ok(durable);
    const revokedGeneration = JSON.parse(durable).revokedWorkspaces[created.workspaceId].generation;
    const poison = JSON.parse(durable);
    poison.workspaces[created.workspaceId] = created;
    if (!poison.workspaceOrder.includes(created.workspaceId)) poison.workspaceOrder.push(created.workspaceId);
    poison.activeWorkspaceId = created.workspaceId;
    delete poison.revokedWorkspaces[created.workspaceId];
    localStorage.setItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY, JSON.stringify(poison));
    abandonWorkspaceRegistryMemoryForTests();

    const repaired = recoverWorkspaceRegistryFromStorage();
    const stored = JSON.parse(localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY) ?? "{}");
    const ledger = JSON.parse(localStorage.getItem(WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY) ?? "{}");
    assert.equal(repaired.workspaces[created.workspaceId], undefined);
    assert.equal(stored.workspaces[created.workspaceId], undefined);
    assert.equal(stored.activeWorkspaceId, DEMO_WORKSPACE_ID);
    assert.equal(stored.revokedWorkspaces[created.workspaceId].generation, revokedGeneration);
    assert.equal(ledger.revocations[created.workspaceId].generation, revokedGeneration);
    assert.equal(getWorkspaceById(created.workspaceId), null);
    upsertWorkspace(created);
    assert.equal(getWorkspaceById(created.workspaceId), null);
    abandonWorkspaceRegistryMemoryForTests();
    recoverWorkspaceRegistryFromStorage();
    assert.equal(getWorkspaceById(created.workspaceId), null);
  } finally {
    resetWorkspaceRegistryForTests();
    delete (globalThis as { localStorage?: unknown }).localStorage;
    delete (globalThis as { window?: unknown }).window;
  }
});

function installRegistryStorage() {
  const data = new Map<string, string>();
  const localStorage = {
    get length() { return data.size; },
    clear() { data.clear(); },
    getItem(key: string) { return data.get(key) ?? null; },
    key(index: number) { return [...data.keys()][index] ?? null; },
    removeItem(key: string) { data.delete(key); },
    setItem(key: string, value: string) { data.set(key, value); },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: localStorage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage, dispatchEvent() { return true; } },
  });
  return localStorage;
}

test("a failed revocation write does not acknowledge deletion", () => {
  const localStorage = installRegistryStorage();
  try {
    resetWorkspaceRegistryForTests();
    const created = createWorkspace("Revocation Write Failure");
    failWorkspaceRevocationPersistForTests("ledger");
    deleteWorkspace(created.workspaceId);
    assert.equal(getWorkspaceById(created.workspaceId)?.status, "active");
    assert.equal(localStorage.getItem(WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY)?.includes(created.workspaceId) ?? false, false);
    failWorkspaceRevocationPersistForTests(null);
    deleteWorkspace(created.workspaceId);
    assert.equal(getWorkspaceById(created.workspaceId), null);
    const ledger = JSON.parse(localStorage.getItem(WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY) ?? "{}");
    assert.equal(ledger.revocations[created.workspaceId].generation, 1);
    abandonWorkspaceRegistryMemoryForTests();
    recoverWorkspaceRegistryFromStorage();
    assert.equal(getWorkspaceById(created.workspaceId), null);
  } finally {
    failWorkspaceRevocationPersistForTests(null);
    resetWorkspaceRegistryForTests();
    delete (globalThis as { localStorage?: unknown }).localStorage;
    delete (globalThis as { window?: unknown }).window;
  }
});

test("an unreadable revocation ledger fails closed for manager workspace mutation", () => {
  const localStorage = installRegistryStorage();
  try {
    resetWorkspaceRegistryForTests();
    const created = createWorkspace("Readable Ledger");
    localStorage.setItem(WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY, "{");
    abandonWorkspaceRegistryMemoryForTests();
    const verdict = evaluateWorkspaceAuthority(created.workspaceId);
    assert.equal(verdict.ok, false);
    if (!verdict.ok) assert.equal(verdict.reason, "invalid-workspace");
    const demo = evaluateWorkspaceAuthority(DEMO_WORKSPACE_ID);
    assert.equal(demo.ok, true);
    assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.status, "active");
    assert.equal(getWorkspaceById(BUSINESS_DEMO_WORKSPACE_ID)?.status, "active");
  } finally {
    resetWorkspaceRegistryForTests();
    delete (globalThis as { localStorage?: unknown }).localStorage;
    delete (globalThis as { window?: unknown }).window;
  }
});
