import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { ensureCsvMvpDemoBootstrap } from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  commitPreparedCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { deckIdentityForDemoProfile } from "../deck/nexoraDeckIdentityContract.ts";
import { resolveActiveDemoProfileStageMaterials } from "../demo-profile/demoProfileStageCatalog.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  readActiveDemoProfile,
  readStoredDemoProfile,
  resetDemoProfileForTests,
} from "../demo-profile/demoProfileStore.ts";
import { isCustomerHostedWorkspaceId } from "../workspace-auth/hostedWorkspaceId.ts";
import {
  isRealManagerWorkspaceId,
  productFixturesPermittedForWorkspace,
  refuseCrossWorkspaceCsvTarget,
} from "./liveManagerDataWorkspaceGuard.ts";
import { projectManagerWorkspaceEntries } from "./managerWorkspaceEntry.ts";
import { createManagerWorkspaceFromEntry } from "./managerWorkspaceEntry.ts";
import {
  classifyWorkspaceIdentifier,
  resolveLiveExecutiveDataWorkspace,
  resolveStageActiveManagerWorkspaceId,
} from "./managerWorkspaceIdentity.ts";
import {
  BUSINESS_DEMO_WORKSPACE_ID,
  DEMO_WORKSPACE_ID,
  normalizeWorkspaceId,
} from "./workspaceRegistryContract.ts";
import {
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  getActiveWorkspaceId,
  getWorkspaceById,
  getWorkspaceRegistrySnapshot,
  recoverWorkspaceRegistryFromStorage,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";

const INVENTORY = "Date,Inventory On Hand\n2026-01-31,10\n";

function installStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage, dispatchEvent() { return true; } },
  });
  return storage;
}

function commit(workspaceId: string, importId: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName: `${importId}.csv`,
    fileSize: INVENTORY.length,
    csvText: INVENTORY,
    importId,
    importedAt: "2026-11-04T00:00:00.000Z",
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  return commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-11-04T00:00:00.000Z",
  });
}

beforeEach(() => {
  installStorage();
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
});

afterEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
});

test("Business Demo is a stable kindless workspace and not a hosted or manager workspace", () => {
  assert.equal(normalizeWorkspaceId(`  ${BUSINESS_DEMO_WORKSPACE_ID}  `), BUSINESS_DEMO_WORKSPACE_ID);
  assert.notEqual(BUSINESS_DEMO_WORKSPACE_ID, DEMO_WORKSPACE_ID);
  const record = getWorkspaceById(BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(record?.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(record?.kind, undefined);
  assert.equal(classifyWorkspaceIdentifier(BUSINESS_DEMO_WORKSPACE_ID), "business_demo");
  assert.equal(classifyWorkspaceIdentifier(DEMO_WORKSPACE_ID), "demo_test");
  assert.equal(isRealManagerWorkspaceId(BUSINESS_DEMO_WORKSPACE_ID), false);
  assert.equal(isCustomerHostedWorkspaceId(BUSINESS_DEMO_WORKSPACE_ID), false);
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);

  assert.equal(setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID).activeWorkspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(resolveLiveExecutiveDataWorkspace().demoBootstrapPermitted, false);
  assert.equal(resolveLiveExecutiveDataWorkspace().classification, "business_demo");
});

test("registry recovery keeps Business Demo kindless and preserves its active selection", () => {
  const storage = globalThis.localStorage;
  storage.setItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY, JSON.stringify({
    version: "NW-A:1",
    workspaces: {
      [DEMO_WORKSPACE_ID]: {
        workspaceId: DEMO_WORKSPACE_ID,
        workspaceName: "Demo Workspace",
        status: "active",
        createdAt: "2026-06-19T00:00:00.000Z",
        updatedAt: "2026-06-19T00:00:00.000Z",
        lastOpenedAt: "2026-06-19T00:00:00.000Z",
      },
    },
    workspaceOrder: [DEMO_WORKSPACE_ID],
    activeWorkspaceId: DEMO_WORKSPACE_ID,
  }));
  const recovered = recoverWorkspaceRegistryFromStorage();
  assert.equal(recovered.activeWorkspaceId, DEMO_WORKSPACE_ID);
  assert.equal(recovered.workspaces[BUSINESS_DEMO_WORKSPACE_ID]?.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(recovered.workspaces[BUSINESS_DEMO_WORKSPACE_ID]?.kind, undefined);

  resetWorkspaceRegistryForTests();
  storage.setItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY, JSON.stringify({
    version: "NW-A:1",
    workspaces: {
      [DEMO_WORKSPACE_ID]: {
        workspaceId: DEMO_WORKSPACE_ID,
        workspaceName: "Demo Workspace",
        status: "active",
        createdAt: "2026-06-19T00:00:00.000Z",
        updatedAt: "2026-06-19T00:00:00.000Z",
        lastOpenedAt: "2026-06-19T00:00:00.000Z",
      },
      [BUSINESS_DEMO_WORKSPACE_ID]: {
        workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
        workspaceName: "Tampered",
        status: "active",
        createdAt: "2026-11-04T00:00:00.000Z",
        updatedAt: "2026-11-04T00:00:00.000Z",
        lastOpenedAt: "2026-11-04T00:00:00.000Z",
        kind: "BUSINESS",
      },
    },
    workspaceOrder: [DEMO_WORKSPACE_ID, BUSINESS_DEMO_WORKSPACE_ID],
    activeWorkspaceId: BUSINESS_DEMO_WORKSPACE_ID,
  }));
  const selected = recoverWorkspaceRegistryFromStorage();
  assert.equal(selected.activeWorkspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(selected.workspaces[BUSINESS_DEMO_WORKSPACE_ID]?.kind, undefined);
  assert.equal(selected.workspaces[BUSINESS_DEMO_WORKSPACE_ID]?.workspaceName, "Business Demo");
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.kind, undefined);
});

test("CSV mutations stay inside the active workspace", () => {
  const companyA = createManagerWorkspaceFromEntry({ name: "Company A", kind: "BUSINESS" });
  const companyB = createManagerWorkspaceFromEntry({ name: "Company B", kind: "PROJECT" });
  assert.ok(companyA && companyB);

  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(refuseCrossWorkspaceCsvTarget(BUSINESS_DEMO_WORKSPACE_ID), "wrong_workspace");
  assert.equal(commit(BUSINESS_DEMO_WORKSPACE_ID, "cross-demo").committed, false);
  assert.equal(commit(DEMO_WORKSPACE_ID, "demo-local").committed, true);
  assert.equal(refuseCrossWorkspaceCsvTarget("manufacturing"), "wrong_workspace");

  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(refuseCrossWorkspaceCsvTarget(DEMO_WORKSPACE_ID), "wrong_workspace");
  assert.equal(refuseCrossWorkspaceCsvTarget(companyA.workspaceId), "wrong_workspace");
  assert.equal(refuseCrossWorkspaceCsvTarget("kindless_unknown"), "wrong_workspace");
  assert.equal(commit(DEMO_WORKSPACE_ID, "cross-back").committed, false);
  assert.equal(commit(BUSINESS_DEMO_WORKSPACE_ID, "business-local").committed, true);
  assert.deepEqual(listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).map((entry) => entry.importId), ["business-local"]);

  setActiveWorkspace(companyA.workspaceId);
  assert.equal(refuseCrossWorkspaceCsvTarget(BUSINESS_DEMO_WORKSPACE_ID), "wrong_workspace");
  assert.equal(refuseCrossWorkspaceCsvTarget(companyB.workspaceId), "wrong_workspace");
  assert.equal(refuseCrossWorkspaceCsvTarget("kindless_unknown"), "wrong_workspace");
  assert.equal(commit(companyA.workspaceId, "company-local").committed, true);
  assert.equal(commit(BUSINESS_DEMO_WORKSPACE_ID, "from-customer").committed, false);
  assert.equal(commit(companyB.workspaceId, "from-a").committed, false);

  setActiveWorkspace(companyB.workspaceId);
  assert.equal(commit(companyA.workspaceId, "from-b").reason, "wrong_workspace");
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.importId).join(","), "demo-local");
  assert.equal(listCsvRealDataImports(companyB.workspaceId).length, 0);
});

test("Business Demo receives no legacy bootstrap, product fixtures, or other Stage materials", () => {
  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  const seeded = ensureCsvMvpDemoBootstrap({ workspaceId: BUSINESS_DEMO_WORKSPACE_ID });
  assert.equal(seeded.refused, true);
  assert.equal(seeded.refusalReason, "business_demo");
  assert.equal(seeded.inventorySeeded, false);
  assert.equal(listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).length, 0);
  assert.equal(productFixturesPermittedForWorkspace(BUSINESS_DEMO_WORKSPACE_ID), false);
  assert.equal(resolveStageActiveManagerWorkspaceId(), BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(resolveActiveDemoProfileStageMaterials(), null);

  openManufacturingDemo();
  assert.equal(resolveStageActiveManagerWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(resolveActiveDemoProfileStageMaterials()?.profileId, "manufacturing");
  const modernDemoActive = readActiveDemoProfile() === "manufacturing" && getActiveWorkspaceId() === DEMO_WORKSPACE_ID;
  assert.equal(productFixturesPermittedForWorkspace(DEMO_WORKSPACE_ID) && !modernDemoActive, false);

  const company = createManagerWorkspaceFromEntry({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(company);
  setActiveWorkspace(company.workspaceId);
  assert.equal(resolveStageActiveManagerWorkspaceId(), company.workspaceId);
  assert.equal(productFixturesPermittedForWorkspace(company.workspaceId), false);
  assert.equal(resolveActiveDemoProfileStageMaterials(), null);
});

test("selector and dormant demo profile keep Business Demo separate", () => {
  openManufacturingDemo();
  assert.equal(readStoredDemoProfile(), "manufacturing");
  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readStoredDemoProfile(), "manufacturing");
  assert.equal(deckIdentityForDemoProfile(BUSINESS_DEMO_WORKSPACE_ID, "manufacturing"), null);
  const view = projectManagerWorkspaceEntries(getWorkspaceRegistrySnapshot());
  assert.equal(view.active.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(view.active.identityLabel, "Business Demo");
  assert.equal(view.active.role, "business-demo");
  assert.equal(view.real.some((entry) => entry.workspaceId === BUSINESS_DEMO_WORKSPACE_ID), false);
  assert.equal(view.demo?.workspaceId, DEMO_WORKSPACE_ID);
  assert.notEqual(view.active.identityLabel, view.demo?.identityLabel);

  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  openProjectDemo();
  assert.equal(readActiveDemoProfile(), "project");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  const snapshot = getWorkspaceRegistrySnapshot();
  assert.equal(snapshot.workspaces[BUSINESS_DEMO_WORKSPACE_ID]?.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
});
