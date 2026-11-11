import assert from "node:assert/strict";
import test from "node:test";

import {
  commitPreparedCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { evaluateWorkspaceAuthority } from "../workspace/workspaceAuthorityFence.ts";
import { blockWorkspaceMutations, resetWorkspaceDeletionGuardForTests } from "../workspace/workspaceDeletionGuard.ts";
import {
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  deleteWorkspace,
  getWorkspaceById,
  recordWorkspaceRevocation,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { selectAuthorizedHostedWorkspace } from "./hostedActiveWorkspace.ts";
import type { HostedWorkspaceProjection } from "./hostedWorkspaceRecord.ts";

const HOSTED_ID = "ws_aaaaaaaaaaaaaaaaaa";
const STALE = "Date,Inventory On Hand\n2026-01-01,999999\n";

function projection(workspaceId = HOSTED_ID): HostedWorkspaceProjection {
  return Object.freeze({
    workspaceId,
    name: "Company A",
    kind: "BUSINESS",
    createdAt: "2026-10-15T00:00:00.000Z",
    updatedAt: "2026-10-15T00:00:00.000Z",
  });
}

function prepared(workspaceId: string) {
  return prepareCsvRealDataImport({
    workspaceId,
    fileName: "stale.csv",
    fileSize: STALE.length,
    csvText: STALE,
    importId: `imp_${workspaceId}`,
    importedAt: "2026-10-15T00:00:00.000Z",
  });
}

function commit(workspaceId: string) {
  return commitPreparedCsvRealDataImport({
    prepared: prepared(workspaceId),
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-10-15T00:00:00.000Z",
  });
}

function installWindowStorage(initial?: Record<string, string>): Storage {
  const data = new Map(Object.entries(initial ?? {}));
  const localStorage: Storage = {
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

test("an unselected hosted id cannot commit local CSV", () => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const company = projection();
  assert.equal(selectAuthorizedHostedWorkspace(company, []), false);
  const result = commit(HOSTED_ID);
  assert.equal(result.committed, false);
  assert.equal(result.reason, "wrong_workspace");
  assert.equal(evaluateWorkspaceAuthority(HOSTED_ID).ok, false);
  assert.equal(listCsvRealDataImports(HOSTED_ID).length, 0);
});

test("an authorized hosted session commits locally and stays out of the browser registry", () => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const storage = installWindowStorage({
    [MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY]: JSON.stringify({
      version: "NW-A:1",
      workspaces: {
        demo_workspace: {
          workspaceId: "demo_workspace",
          workspaceName: "Demo Workspace",
          status: "active",
          createdAt: "2026-06-19T00:00:00.000Z",
          updatedAt: "2026-06-19T00:00:00.000Z",
          lastOpenedAt: "2026-06-19T00:00:00.000Z",
        },
      },
      workspaceOrder: ["demo_workspace"],
      activeWorkspaceId: "demo_workspace",
      revokedWorkspaces: {},
    }),
  });
  const company = projection();
  assert.equal(selectAuthorizedHostedWorkspace(company, [company]), true);
  const result = commit(HOSTED_ID);
  assert.equal(result.committed, true);
  assert.equal(result.reason, "committed");
  assert.equal(listCsvRealDataImports(HOSTED_ID).some((entry) => JSON.stringify(entry).includes("999999")), true);
  assert.equal(storage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY)?.includes(HOSTED_ID) ?? false, false);
  assert.equal(getWorkspaceById(HOSTED_ID)?.workspaceId, HOSTED_ID);
  const authority = evaluateWorkspaceAuthority(HOSTED_ID);
  assert.equal(authority.ok, true);
});

test("a revoked hosted session is not reattached or admitted", () => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const company = projection();
  assert.equal(selectAuthorizedHostedWorkspace(company, [company]), true);
  recordWorkspaceRevocation(HOSTED_ID, "2026-11-11T00:00:00.000Z");
  const result = commit(HOSTED_ID);
  assert.equal(result.committed, false);
  const authority = evaluateWorkspaceAuthority(HOSTED_ID);
  assert.equal(authority.ok, false);
  if (authority.ok) throw new Error("expected revocation");
  assert.equal(authority.reason, "workspace-revoked");
  assert.equal(listCsvRealDataImports(HOSTED_ID).length, 0);
});

test("revoked and deleting local workspaces cannot commit CSV", () => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  resetCsvRealDataImportStoreForTests();
  const company = createManagerWorkspaceFromEntry({ name: "Local CSV", kind: "BUSINESS" });
  assert.ok(company);
  deleteWorkspace(company.workspaceId);
  const revoked = commit(company.workspaceId);
  assert.equal(revoked.committed, false);
  const authority = evaluateWorkspaceAuthority(company.workspaceId);
  assert.equal(authority.ok, false);
  if (authority.ok) throw new Error("expected revocation");
  assert.equal(authority.reason, "workspace-revoked");
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);

  const current = createManagerWorkspaceFromEntry({ name: "Deleting CSV", kind: "BUSINESS" });
  assert.ok(current);
  blockWorkspaceMutations(current.workspaceId);
  const blocked = commit(current.workspaceId);
  assert.equal(blocked.committed, false);
  assert.equal(blocked.reason, "deletion-in-progress");
  assert.equal(listCsvRealDataImports(current.workspaceId).length, 0);
});
