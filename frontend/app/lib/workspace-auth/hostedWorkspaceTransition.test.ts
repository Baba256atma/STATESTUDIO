import assert from "node:assert/strict";
import test from "node:test";

import { DEMO_PROFILE_SESSION_KEY } from "../demo-profile/demoProfileContract.ts";
import { resetActiveDemo } from "../demo-profile/demoProfileReset.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  readActiveDemoProfile,
  releaseDemoProfileForManagerWorkspace,
  restoreDemoProfileSelectionFromSession,
} from "../demo-profile/demoProfileStore.ts";
import { readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  getWorkspaceById,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import type { HostedWorkspaceProjection } from "./hostedWorkspaceRecord.ts";
import { readStoredHostedWorkspaceSelection, selectAuthorizedHostedWorkspace } from "./hostedActiveWorkspace.ts";

const companyA = Object.freeze({
  workspaceId: "ws_aaaaaaaaaaaaaaaaaa",
  name: "Company A",
  kind: "BUSINESS",
  createdAt: "2026-10-15T00:00:00.000Z",
  updatedAt: "2026-10-15T00:00:00.000Z",
}) as HostedWorkspaceProjection;

const projectA = Object.freeze({
  workspaceId: "ws_bbbbbbbbbbbbbbbbbb",
  name: "Project A",
  kind: "PROJECT",
  createdAt: "2026-10-15T00:00:00.000Z",
  updatedAt: "2026-10-15T00:00:00.000Z",
}) as HostedWorkspaceProjection;

const companyB = Object.freeze({
  workspaceId: "ws_cccccccccccccccccc",
  name: "Company B",
  kind: "BUSINESS",
  createdAt: "2026-10-15T00:00:00.000Z",
  updatedAt: "2026-10-15T00:00:00.000Z",
}) as HostedWorkspaceProjection;

const userA = Object.freeze([companyA, projectA]);

function settle(): void {
  resetWorkspaceRegistryForTests();
  releaseDemoProfileForManagerWorkspace();
}

test("manufacturing demo yields to an authorized company", () => {
  settle();
  assert.equal(openManufacturingDemo().opened, true);
  assert.equal(selectAuthorizedHostedWorkspace(companyA, userA), true);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readLiveExecutiveDataWorkspaceId(), companyA.workspaceId);
  assert.equal(readStoredHostedWorkspaceSelection(), companyA.workspaceId);
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.kind, undefined);
});

test("project demo yields to an authorized company", () => {
  settle();
  assert.equal(openProjectDemo().opened, true);
  assert.equal(selectAuthorizedHostedWorkspace(companyA, userA), true);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readLiveExecutiveDataWorkspaceId(), companyA.workspaceId);
});

test("company returns to manufacturing without deleting the hosted workspace", () => {
  settle();
  selectAuthorizedHostedWorkspace(companyA, userA);
  assert.equal(openManufacturingDemo().opened, true);
  assert.equal(readLiveExecutiveDataWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(getWorkspaceById(companyA.workspaceId)?.workspaceName, "Company A");
  assert.equal(getWorkspaceById(companyA.workspaceId)?.status, "active");
  assert.notEqual(readLiveExecutiveDataWorkspaceId(), companyA.workspaceId);
});

test("manufacturing then company then project keeps one live workspace", () => {
  settle();
  openManufacturingDemo();
  assert.equal(selectAuthorizedHostedWorkspace(companyA, userA), true);
  assert.equal(selectAuthorizedHostedWorkspace(projectA, userA), true);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readLiveExecutiveDataWorkspaceId(), projectA.workspaceId);
  assert.equal(getWorkspaceById(companyA.workspaceId)?.kind, "BUSINESS");
  assert.equal(getWorkspaceById(projectA.workspaceId)?.kind, "PROJECT");
});

test("reset demo stays inside the active demo", () => {
  settle();
  openProjectDemo();
  const result = resetActiveDemo();
  assert.equal(result.status, "reset");
  assert.equal(readActiveDemoProfile(), "project");
  assert.equal(readLiveExecutiveDataWorkspaceId(), DEMO_WORKSPACE_ID);
});

test("anonymous cannot activate a company", () => {
  settle();
  openManufacturingDemo();
  assert.equal(selectAuthorizedHostedWorkspace(companyA, []), false);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(readLiveExecutiveDataWorkspaceId(), DEMO_WORKSPACE_ID);
});

test("another user cannot activate company A", () => {
  settle();
  openProjectDemo();
  assert.equal(selectAuthorizedHostedWorkspace(companyA, [companyB]), false);
  assert.equal(readLiveExecutiveDataWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "project");
});

test("a stale demo profile cannot override an active hosted workspace", () => {
  settle();
  const memory = new Map<string, string>();
  const previousWindow = globalThis.window;
  globalThis.window = {
    dispatchEvent: () => true,
    sessionStorage: {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
      removeItem: (key: string) => {
        memory.delete(key);
      },
      clear: () => memory.clear(),
      key: () => null,
      length: 0,
    },
    localStorage: {
      getItem: (key: string) => memory.get(`local:${key}`) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(`local:${key}`, value);
      },
      removeItem: (key: string) => {
        memory.delete(`local:${key}`);
      },
      clear: () => memory.clear(),
      key: () => null,
      length: 0,
    },
  } as unknown as Window & typeof globalThis;
  try {
    openProjectDemo();
    assert.equal(selectAuthorizedHostedWorkspace(companyA, userA), true);
    window.sessionStorage.setItem(DEMO_PROFILE_SESSION_KEY, "project");
    assert.equal(restoreDemoProfileSelectionFromSession(), null);
    assert.equal(readActiveDemoProfile(), null);
    assert.equal(readLiveExecutiveDataWorkspaceId(), companyA.workspaceId);
    assert.equal(
      window.localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY)?.includes(companyA.workspaceId) ?? false,
      false,
    );
  } finally {
    if (previousWindow === undefined) delete (globalThis as { window?: Window }).window;
    else globalThis.window = previousWindow;
  }
});
