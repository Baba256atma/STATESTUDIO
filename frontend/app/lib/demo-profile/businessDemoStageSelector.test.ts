import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createMemoryCsvDurabilityStorage } from "../data-reality/csvRealDataImportDurability.ts";
import {
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { ensureCsvMvpDemoBootstrap } from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  DemoLibrarySection,
  NexoraManagerWorkspaceControl,
} from "../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { createManagerWorkspaceFromEntry, projectManagerWorkspaceEntries } from "../workspace/managerWorkspaceEntry.ts";
import { productFixturesPermittedForWorkspace } from "../workspace/liveManagerDataWorkspaceGuard.ts";
import { BUSINESS_DEMO_WORKSPACE_ID, DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  getWorkspaceRegistrySnapshot,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import {
  openBusinessDemo,
  resetBusinessDemoActivationForTests,
} from "./businessDemoActivation.ts";
import {
  BUSINESS_DEMO_EXPENSES_TEXT,
  BUSINESS_DEMO_INVENTORY_TEXT,
  BUSINESS_DEMO_SALES_TEXT,
  businessDemoImportId,
} from "./businessDemoPackage.ts";
import { BUSINESS_DEMO_STAGE_OBJECTS, resolveBusinessDemoStageMaterials } from "./businessDemoStageCatalog.ts";
import { resolveActiveDemoProfileStageMaterials } from "./demoProfileStageCatalog.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  readActiveDemoProfile,
  readStoredDemoProfile,
  resetDemoProfileForTests,
} from "./demoProfileStore.ts";

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
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage, sessionStorage: storage, dispatchEvent() { return true; } },
  });
}

function columnNumbers(csv: string, column: string): number[] {
  const [header, ...rows] = csv.trim().split("\n");
  const index = header.split(",").indexOf(column);
  return rows.map((row) => Number(row.split(",")[index]));
}

function stageIds(): string[] {
  return resolveBusinessDemoStageMaterials()?.catalog.objects.map((object) => object.id) ?? [];
}

beforeEach(() => {
  installStorage();
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetBusinessDemoActivationForTests();
});

afterEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetBusinessDemoActivationForTests();
});

test("Try Nexora offers Business Demo without making it a customer or a demo profile", async () => {
  const markup = renderToStaticMarkup(React.createElement(DemoLibrarySection, {
    activeProfile: null,
    confirmingReset: false,
    notice: null,
    failure: null,
    onOpen: () => undefined,
    businessDemoActive: false,
    onOpenBusinessDemo: () => undefined,
    onRequestReset: () => undefined,
    onConfirmReset: () => undefined,
    onCancelReset: () => undefined,
  }));
  assert.match(markup, /Manufacturing/);
  assert.match(markup, /Project Management/);
  assert.match(markup, /Business Demo/);
  assert.match(markup, /data-testid="open-business-demo"/);
  assert.equal(markup.includes("data-demo-library-item=\"business\""), false);

  openManufacturingDemo();
  const manufacturingIds = resolveActiveDemoProfileStageMaterials()?.catalog.objects.map((object) => object.id) ?? [];
  const storage = createMemoryCsvDurabilityStorage();
  const opened = await openBusinessDemo({ storage });
  assert.equal(opened.opened, true);
  assert.equal(opened.profileId, null);
  assert.equal(opened.workspaceId, BUSINESS_DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readStoredDemoProfile(), "manufacturing");
  assert.deepEqual([...opened.importIds].sort(), [
    businessDemoImportId("expenses.csv"),
    businessDemoImportId("inventory.csv"),
    businessDemoImportId("sales.csv"),
  ].sort());
  const view = projectManagerWorkspaceEntries(getWorkspaceRegistrySnapshot());
  assert.equal(view.active.identityLabel, "Business Demo");
  assert.equal(view.active.role, "business-demo");
  assert.equal(view.real.some((entry) => entry.workspaceId === BUSINESS_DEMO_WORKSPACE_ID), false);
  assert.equal(view.demo?.workspaceId, DEMO_WORKSPACE_ID);
  const header = renderToStaticMarkup(React.createElement(NexoraManagerWorkspaceControl, {}));
  assert.match(header, /Business Demo/);
  assert.match(header, new RegExp(`data-manager-workspace-id="${BUSINESS_DEMO_WORKSPACE_ID}"`));
  assert.equal(header.includes("data-demo-profile=\"manufacturing\""), false);
  assert.equal(manufacturingIds.every((id) => !stageIds().includes(id)), true);
});

test("Business Demo Stage objects come from its CSV package and stay inside that Workspace", async () => {
  const storage = createMemoryCsvDurabilityStorage();
  openManufacturingDemo();
  const manufacturing = resolveActiveDemoProfileStageMaterials();
  assert.ok(manufacturing);
  openProjectDemo();
  const project = resolveActiveDemoProfileStageMaterials();
  assert.equal(project?.profileId, "project");
  const projectIds = project.catalog.objects.map((object) => object.id);
  const demoImportIds = listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.importId).sort();

  const opened = await openBusinessDemo({ storage });
  assert.equal(opened.status, "loaded");
  const materials = resolveBusinessDemoStageMaterials();
  assert.ok(materials);
  assert.deepEqual(
    materials.catalog.objects.map((object) => object.label),
    ["Revenue", "Inventory", "Operating Cost"],
  );
  assert.deepEqual(
    materials.catalog.objects.map((object) => object.id),
    BUSINESS_DEMO_STAGE_OBJECTS.map((object) => object.id),
  );
  assert.equal(materials.catalog.objects.every((object) => object.managerWorkspaceId === BUSINESS_DEMO_WORKSPACE_ID), true);
  const currentRevenue = materials.dataset.records.find((record) => record.metricKey === "currentRevenue");
  const previousRevenue = materials.dataset.records.find((record) => record.metricKey === "previousRevenue");
  const onHand = materials.dataset.records.find((record) => record.metricKey === "onHand");
  const operatingCost = materials.dataset.records.find((record) => record.metricKey === "operatingCost");
  assert.equal(currentRevenue?.objectKey, "revenue");
  assert.equal(currentRevenue?.value, columnNumbers(BUSINESS_DEMO_SALES_TEXT, "Current Revenue").reduce((sum, value) => sum + value, 0));
  assert.equal(previousRevenue?.value, columnNumbers(BUSINESS_DEMO_SALES_TEXT, "Previous Revenue").reduce((sum, value) => sum + value, 0));
  const inventoryValues = columnNumbers(BUSINESS_DEMO_INVENTORY_TEXT, "Inventory On Hand");
  assert.equal(onHand?.objectKey, "inventory");
  assert.equal(onHand?.value, inventoryValues[inventoryValues.length - 1]);
  assert.equal(operatingCost?.objectKey, "cost");
  assert.equal(operatingCost?.value, columnNumbers(BUSINESS_DEMO_EXPENSES_TEXT, "Operating Cost").reduce((sum, value) => sum + value, 0));
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    baseCatalog: materials.catalog,
    dataset: materials.dataset,
  });
  assert.deepEqual(experience.catalog.objects.map((object) => object.id), stageIds());
  const fixtureIds = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((object) => object.id);
  assert.equal(experience.catalog.objects.some((object) => fixtureIds.includes(object.id)), false);
  assert.equal(productFixturesPermittedForWorkspace(BUSINESS_DEMO_WORKSPACE_ID), false);
  assert.equal(manufacturing.catalog.objects.some((object) => stageIds().includes(object.id)), false);
  assert.equal(projectIds.some((id) => stageIds().includes(id)), false);
  assert.deepEqual(listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.importId).sort(), demoImportIds);

  const repeated = await openBusinessDemo({ storage });
  assert.equal(repeated.status, "already_present");
  assert.equal(listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).length, 3);
  assert.deepEqual(stageIds(), BUSINESS_DEMO_STAGE_OBJECTS.map((object) => object.id));

  resetCsvRealDataImportStoreForTests();
  assert.equal(resolveBusinessDemoStageMaterials(), null);
  const restored = await openBusinessDemo({ storage });
  assert.equal(restored.status, "already_present");
  assert.deepEqual(stageIds(), BUSINESS_DEMO_STAGE_OBJECTS.map((object) => object.id));
  assert.equal(listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).length, 3);

  const bootstrap = ensureCsvMvpDemoBootstrap({ workspaceId: BUSINESS_DEMO_WORKSPACE_ID });
  assert.equal(bootstrap.refused, true);

  openManufacturingDemo();
  assert.equal(resolveBusinessDemoStageMaterials(), null);
  assert.equal(resolveActiveDemoProfileStageMaterials()?.profileId, "manufacturing");
  assert.equal(listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).length, 3);

  const back = await openBusinessDemo({ storage });
  assert.equal(back.status, "already_present");
  openProjectDemo();
  assert.equal(resolveActiveDemoProfileStageMaterials()?.profileId, "project");
  assert.equal(resolveBusinessDemoStageMaterials(), null);

  const company = createManagerWorkspaceFromEntry({ name: "Stage Customer", kind: "BUSINESS" });
  assert.ok(company);
  setActiveWorkspace(company.workspaceId);
  assert.equal(resolveBusinessDemoStageMaterials(), null);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
  const refused = await openBusinessDemo({ storage });
  assert.equal(refused.opened, true);
  assert.equal(getActiveWorkspaceId(), BUSINESS_DEMO_WORKSPACE_ID);
  setActiveWorkspace(company.workspaceId);
  const wrongWorkspace = await openBusinessDemo({
    storage: {
      async get() {
        setActiveWorkspace(company.workspaceId);
        return storage.records.get("current") ?? null;
      },
      async set(value: string) {
        storage.records.set("current", value);
      },
      async clear() {
        storage.records.delete("current");
      },
    },
  });
  assert.equal(wrongWorkspace.opened, false);
  assert.equal(wrongWorkspace.status, "refused_wrong_workspace");
  assert.equal(resolveBusinessDemoStageMaterials(), null);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
  assert.equal(listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).length, 3);
});
