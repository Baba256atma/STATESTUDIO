import assert from "node:assert/strict";
import test from "node:test";

import { CANONICAL_OBJECT_STORAGE_KEY, createCanonicalObject, listCanonicalObjects, resetCanonicalObjectsForTests } from "../scene-org/canonicalObjectRegistry.ts";
import { createManagerWorkspaceFromEntry } from "./managerWorkspaceEntry.ts";
import { DEMO_WORKSPACE_ID } from "./workspaceRegistryContract.ts";
import {
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaceRegistrySnapshot,
  resetWorkspaceRegistryForTests,
  upsertWorkspace,
} from "./workspaceRegistryStore.ts";
import { requestWorkspaceDeletion } from "./workspaceDeletionLifecycle.ts";
import { resetWorkspaceDeletionGuardForTests } from "./workspaceDeletionGuard.ts";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) { values.set(key, value); },
  };
}

test("a deleted workspace identity cannot be recreated or receive a later object write", () => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  const store = memory();
  resetCanonicalObjectsForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "Fence Company", kind: "BUSINESS" });
  assert.ok(company);
  const created = createCanonicalObject({
    workspaceId: company.workspaceId,
    objectType: "MACHINE",
    displayName: "CNC Machine A",
  });
  assert.equal(created.ok, true);
  deleteWorkspace(company.workspaceId);
  assert.equal(getWorkspaceById(company.workspaceId), null);
  assert.ok(getWorkspaceRegistrySnapshot().revokedWorkspaces[company.workspaceId]);
  const stale = createCanonicalObject({
    workspaceId: company.workspaceId,
    objectType: "MACHINE",
    displayName: "Stale Tab Machine",
  });
  assert.equal(stale.ok, false);
  if (!stale.ok) assert.equal(stale.reason, "workspace-revoked");
  assert.equal(listCanonicalObjects(company.workspaceId).length, 0);
  assert.equal(store.getItem(CANONICAL_OBJECT_STORAGE_KEY)?.includes(company.workspaceId) ?? false, false);
  const restored = upsertWorkspace({
    workspaceId: company.workspaceId,
    workspaceName: company.name,
    kind: company.kind,
    status: "active",
    createdAt: "2026-11-10T00:00:00.000Z",
    updatedAt: "2026-11-10T00:00:00.000Z",
    lastOpenedAt: "2026-11-10T00:00:00.000Z",
  });
  assert.equal(restored.workspaces[company.workspaceId], undefined);
  assert.ok(getWorkspaceById(DEMO_WORKSPACE_ID));
});

test("deletion request rejects a new canonical object before the registry entry is removed", () => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  resetCanonicalObjectsForTests(memory());
  const company = createManagerWorkspaceFromEntry({ name: "Deleting Company", kind: "BUSINESS" });
  assert.ok(company);
  const current = getWorkspaceById(company.workspaceId);
  assert.ok(current);
  upsertWorkspace({
    ...current,
    metadata: { ...(current.metadata ?? {}), disposableCertification: "local-certification" },
  });
  const requested = requestWorkspaceDeletion({ workspaceId: company.workspaceId, operationId: "op-fence" });
  assert.equal(requested.ok, true);
  const created = createCanonicalObject({
    workspaceId: company.workspaceId,
    objectType: "MACHINE",
    displayName: "Too Late",
  });
  assert.equal(created.ok, false);
  if (!created.ok) assert.equal(created.reason, "deletion-in-progress");
  const generation = Number(getWorkspaceById(company.workspaceId)?.metadata?.authorityGeneration ?? 0);
  assert.ok(generation >= 2);
});

test("two sequential object creates in one active workspace both remain", () => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  resetCanonicalObjectsForTests(memory());
  const company = createManagerWorkspaceFromEntry({ name: "Concurrent Company", kind: "BUSINESS" });
  assert.ok(company);
  const first = createCanonicalObject({ workspaceId: company.workspaceId, objectType: "MACHINE", displayName: "CNC Machine A" });
  const second = createCanonicalObject({ workspaceId: company.workspaceId, objectType: "MACHINE", displayName: "CNC Machine B" });
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  const names = listCanonicalObjects(company.workspaceId).map((object) => object.displayName).sort();
  assert.deepEqual(names, ["CNC Machine A", "CNC Machine B"]);
});
