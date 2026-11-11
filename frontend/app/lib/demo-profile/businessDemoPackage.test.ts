import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  commitPreparedCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { ensureCsvMvpDemoBootstrap } from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  createMemoryCsvDurabilityStorage,
  parseCsvDurableSnapshot,
} from "../data-reality/csvRealDataImportDurability.ts";
import {
  CSV_MAPPING_TARGETS,
  prepareCsvRealDataImport,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import {
  MANUFACTURING_DEMO_PACKAGE_FILES,
  ensureManufacturingDemoPackage,
  manufacturingDemoImportId,
} from "./manufacturingDemoPackage.ts";
import {
  PROJECT_DEMO_PACKAGE_FILES,
  ensureProjectDemoPackage,
} from "./projectDemoPackage.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  resetDemoProfileForTests,
} from "./demoProfileStore.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { BUSINESS_DEMO_WORKSPACE_ID, DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import {
  BUSINESS_DEMO_EXPENSES_FILE,
  BUSINESS_DEMO_INVENTORY_FILE,
  BUSINESS_DEMO_PACKAGE_FILES,
  BUSINESS_DEMO_SALES_FILE,
  businessDemoImportId,
  ensureBusinessDemoPackage,
  listBusinessDemoPackageImports,
} from "./businessDemoPackage.ts";

const here = dirname(fileURLToPath(import.meta.url));

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
}

function importIds(workspaceId: string): string[] {
  return listCsvRealDataImports(workspaceId).map((entry) => entry.importId).sort();
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

test("Business Demo package loads three mapped imports and repeats without duplication", async () => {
  const storage = createMemoryCsvDurabilityStorage();
  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  const loaded = await ensureBusinessDemoPackage({ storage });
  assert.equal(loaded.status, "loaded");
  assert.equal(loaded.refused, false);
  assert.equal(loaded.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  assert.deepEqual(
    loaded.files.map((file) => file.fileName),
    [BUSINESS_DEMO_SALES_FILE, BUSINESS_DEMO_INVENTORY_FILE, BUSINESS_DEMO_EXPENSES_FILE],
  );
  assert.deepEqual(
    listBusinessDemoPackageImports().map((entry) => entry.importId).sort(),
    BUSINESS_DEMO_PACKAGE_FILES.map((file) => businessDemoImportId(file.fileName)).sort(),
  );
  for (const file of loaded.files) {
    assert.equal(file.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
    assert.equal(file.importId.startsWith("demo-profile:"), false);
    assert.equal(file.rowCount, 6);
    assert.equal(file.recognizedTargets.includes(file.targetId), true);
    const target = CSV_MAPPING_TARGETS.find((entry) => entry.targetId === file.targetId);
    assert.equal(target?.objectKey, file.objectKey);
    const committed = listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).find((entry) => entry.importId === file.importId);
    assert.equal(committed?.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
    assert.equal(committed?.prepared.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  }
  assert.equal(importIds(DEMO_WORKSPACE_ID).length, 0);

  const again = await ensureBusinessDemoPackage({ storage });
  assert.equal(again.status, "already_present");
  assert.equal(again.files.every((file) => file.alreadyPresent && !file.committed), true);
  assert.equal(listBusinessDemoPackageImports().length, 3);

  resetCsvRealDataImportStoreForTests();
  assert.equal(listBusinessDemoPackageImports().length, 0);
  const recovered = await ensureBusinessDemoPackage({ storage });
  assert.equal(recovered.status, "already_present");
  assert.equal(listBusinessDemoPackageImports().length, 3);
  const hydratedAgain = await ensureBusinessDemoPackage({ storage });
  assert.equal(hydratedAgain.status, "already_present");
  assert.equal(listBusinessDemoPackageImports().length, 3);

  const snapshot = parseCsvDurableSnapshot(storage.records.get("current") ?? "");
  const owners = new Set(snapshot.snapshot?.committed.map((entry) => entry.workspaceId));
  assert.equal(owners.has(BUSINESS_DEMO_WORKSPACE_ID), true);
  assert.equal(snapshot.snapshot?.committed.filter((entry) => entry.workspaceId === BUSINESS_DEMO_WORKSPACE_ID).length, 3);
});

test("Business Demo loading refuses other workspaces and preserves their imports", async () => {
  const storage = createMemoryCsvDurabilityStorage();
  openManufacturingDemo();
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  const manufacturingIds = importIds(DEMO_WORKSPACE_ID);
  assert.equal(manufacturingIds.length > 0, true);
  const manufacturingRefusal = await ensureBusinessDemoPackage({ storage });
  assert.equal(manufacturingRefusal.status, "refused_wrong_workspace");
  assert.deepEqual(importIds(DEMO_WORKSPACE_ID), manufacturingIds);
  assert.equal(listBusinessDemoPackageImports().length, 0);
  assert.equal(storage.records.has("current"), false);

  openProjectDemo();
  const projectIds = importIds(DEMO_WORKSPACE_ID);
  assert.equal(projectIds.some((id) => id.startsWith("demo-profile:project:")), true);
  assert.equal(projectIds.some((id) => id.startsWith("demo-profile:manufacturing:")), true);
  const projectRefusal = await ensureBusinessDemoPackage({ storage });
  assert.equal(projectRefusal.status, "refused_wrong_workspace");
  assert.deepEqual(importIds(DEMO_WORKSPACE_ID), projectIds);

  const company = createManagerWorkspaceFromEntry({ name: "Package Customer", kind: "BUSINESS" });
  assert.ok(company);
  const customerRefusal = await ensureBusinessDemoPackage({ storage });
  assert.equal(customerRefusal.status, "refused_wrong_workspace");
  assert.equal(customerRefusal.activeWorkspaceId, company.workspaceId);
  assert.equal(importIds(company.workspaceId).length, 0);
  assert.deepEqual(importIds(DEMO_WORKSPACE_ID), projectIds);

  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  const loaded = await ensureBusinessDemoPackage({ storage });
  assert.equal(loaded.status, "loaded");
  assert.deepEqual(importIds(DEMO_WORKSPACE_ID), projectIds);
  for (const file of MANUFACTURING_DEMO_PACKAGE_FILES) {
    assert.equal(projectIds.includes(manufacturingDemoImportId(DEMO_WORKSPACE_ID, file.fileName)), true);
  }
  for (const file of PROJECT_DEMO_PACKAGE_FILES) {
    assert.equal(projectIds.some((id) => id.endsWith(`:${file.fileName}`)), true);
  }

  const foreignDemo = commitPreparedCsvRealDataImport({
    prepared: prepareCsvRealDataImport({
      workspaceId: DEMO_WORKSPACE_ID,
      fileName: "sales.csv",
      fileSize: 8,
      csvText: "Date,Current Revenue\n2026-08-31,1\n",
      importId: businessDemoImportId(BUSINESS_DEMO_SALES_FILE),
      importedAt: "2026-08-31T00:00:00.000Z",
    }),
    expectedWorkspaceId: DEMO_WORKSPACE_ID,
    mode: "new",
    committedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(foreignDemo.committed, false);
  assert.equal(foreignDemo.reason, "wrong_workspace");
  const foreignCustomer = commitPreparedCsvRealDataImport({
    prepared: prepareCsvRealDataImport({
      workspaceId: company.workspaceId,
      fileName: "sales.csv",
      fileSize: 8,
      csvText: "Date,Current Revenue\n2026-08-31,1\n",
      importId: businessDemoImportId(BUSINESS_DEMO_SALES_FILE),
      importedAt: "2026-08-31T00:00:00.000Z",
    }),
    expectedWorkspaceId: company.workspaceId,
    mode: "new",
    committedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(foreignCustomer.reason, "wrong_workspace");
  assert.deepEqual(importIds(DEMO_WORKSPACE_ID), projectIds);
  assert.equal(importIds(company.workspaceId).length, 0);
  assert.equal(listBusinessDemoPackageImports().length, 3);

  const bootstrap = ensureCsvMvpDemoBootstrap({ workspaceId: BUSINESS_DEMO_WORKSPACE_ID });
  assert.equal(bootstrap.refused, true);
  assert.equal(bootstrap.refusalReason, "business_demo");
  assert.equal(listBusinessDemoPackageImports().length, 3);
  assert.deepEqual(importIds(DEMO_WORKSPACE_ID), projectIds);

  const snapshot = parseCsvDurableSnapshot(storage.records.get("current") ?? "");
  const durableIds = snapshot.snapshot?.committed.map((entry) => `${entry.workspaceId}:${entry.importId}`).sort();
  assert.equal(durableIds?.some((id) => id.startsWith(`${DEMO_WORKSPACE_ID}:demo-profile:manufacturing:`)), true);
  assert.equal(durableIds?.some((id) => id.startsWith(`${DEMO_WORKSPACE_ID}:demo-profile:project:`)), true);
  assert.equal(durableIds?.filter((id) => id.startsWith(`${BUSINESS_DEMO_WORKSPACE_ID}:`)).length, 3);
});

test("a conflicting Business Demo import is not adopted and a failed write leaves the prior snapshot", async () => {
  const storage = createMemoryCsvDurabilityStorage();
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  const manufacturing = ensureManufacturingDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  const project = ensureProjectDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(manufacturing.refused, false);
  assert.equal(project.refused, false);
  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  const seeded = await ensureBusinessDemoPackage({ storage });
  assert.equal(seeded.status, "loaded");
  const durableBefore = storage.records.get("current");
  assert.ok(durableBefore);

  resetCsvRealDataImportStoreForTests();
  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  const occupant = prepareCsvRealDataImport({
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    fileName: BUSINESS_DEMO_SALES_FILE,
    fileSize: 32,
    csvText: "Date,Current Revenue,Previous Revenue\n2026-08-31,10,9\n",
    importId: "demo-profile:manufacturing:business_demo_workspace:sales.csv",
    importedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(occupant.ready, true, occupant.errors.join("; "));
  const occupied = commitPreparedCsvRealDataImport({
    prepared: occupant,
    expectedWorkspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    mode: "new",
    committedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(occupied.committed, true);
  const conflicted = await ensureBusinessDemoPackage({ storage });
  assert.equal(conflicted.status, "failed_validation");
  assert.equal(conflicted.files.find((file) => file.fileName === BUSINESS_DEMO_SALES_FILE)?.conflict, true);
  const sales = listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).find((entry) => entry.prepared.fileName === BUSINESS_DEMO_SALES_FILE);
  assert.equal(sales?.importId, "demo-profile:manufacturing:business_demo_workspace:sales.csv");
  assert.equal(listBusinessDemoPackageImports().some((entry) => entry.importId === businessDemoImportId(BUSINESS_DEMO_SALES_FILE)), false);
  assert.equal(storage.records.get("current"), durableBefore);

  storage.failNextWrite = true;
  resetCsvRealDataImportStoreForTests();
  setActiveWorkspace(BUSINESS_DEMO_WORKSPACE_ID);
  const failed = await ensureBusinessDemoPackage({ storage });
  assert.equal(failed.status, "failed_persistence");
  assert.equal(storage.records.get("current"), durableBefore);
  const preserved = parseCsvDurableSnapshot(durableBefore);
  assert.equal(
    preserved.snapshot?.committed.some((entry) => entry.workspaceId === DEMO_WORKSPACE_ID && entry.importId.startsWith("demo-profile:")),
    true,
  );
  assert.equal(
    preserved.snapshot?.committed.filter((entry) => entry.workspaceId === BUSINESS_DEMO_WORKSPACE_ID).length,
    3,
  );
});

test("Business Demo package loading stays off the demo profile store", () => {
  const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  const menu = readFileSync(join(here, "../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx"), "utf8");
  const profileStore = readFileSync(join(here, "demoProfileStore.ts"), "utf8");
  assert.match(shell, /dataWorkspaceId === BUSINESS_DEMO_WORKSPACE_ID/);
  assert.match(shell, /ensureBusinessDemoPackage\(\)/);
  assert.match(menu, /open-business-demo/);
  assert.equal(menu.includes("releaseDemoProfileForManagerWorkspace"), false);
  assert.equal(profileStore.includes("ensureBusinessDemoPackage"), false);
  assert.equal(profileStore.includes("openBusinessDemo"), false);
});
