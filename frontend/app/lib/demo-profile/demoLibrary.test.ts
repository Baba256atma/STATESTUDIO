import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { DemoLibrarySection } from "../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx";
import {
  commitPreparedCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { CSV_MVP_DEMO_INVENTORY_FILE } from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import { collectNexoraLivePrioritySources } from "../nex-mvp/nexoraLiveEpistemicProjection.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { isRealManagerWorkspaceId } from "../workspace/liveManagerDataWorkspaceGuard.ts";
import {
  createManagerWorkspaceFromEntry,
  projectManagerWorkspaceEntries,
  selectManagerWorkspaceEntry,
} from "../workspace/managerWorkspaceEntry.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  getWorkspaceById,
  getWorkspaceRegistrySnapshot,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import { resetActiveDemo } from "./demoProfileReset.ts";
import {
  DEMO_LIBRARY_ITEMS,
  openDemoLibraryItem,
  projectDemoLibrary,
  readDemoLibraryFocus,
  requestDemoLibraryFocus,
  resetDemoLibraryFocusForTests,
} from "./demoLibrary.ts";
import {
  readActiveDemoProfile,
  readStoredDemoProfile,
  resetDemoProfileForTests,
} from "./demoProfileStore.ts";
import {
  MANUFACTURING_DEMO_INVENTORY_FILE,
  MANUFACTURING_DEMO_INVENTORY_TEXT,
  MANUFACTURING_DEMO_ORDERS_FILE,
  MANUFACTURING_DEMO_PRODUCTION_FILE,
} from "./manufacturingDemoPackage.ts";
import {
  PROJECT_DEMO_PROGRESS_FILE,
  PROJECT_DEMO_RESOURCES_FILE,
  PROJECT_DEMO_SCHEDULE_FILE,
} from "./projectDemoPackage.ts";

const FIXTURE_LABELS = [
  "Margin Pressure",
  "Capacity Gap",
  "Pricing Response",
  "Demand Surge",
  "Capacity Expansion Plan",
  "Approve Repricing",
  "Expand Capacity",
  "Pricing Rollout",
  "Capacity Expansion",
];

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetDemoLibraryFocusForTests();
});

function commitOwnedCsv(workspaceId: string, fileName: string, importId: string, csvText: string) {
  const previous = getActiveWorkspaceId();
  setActiveWorkspace(workspaceId);
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(prepared.ready, true);
  const committed = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(committed.committed, true);
  if (previous && previous !== workspaceId) setActiveWorkspace(previous);
}

function fingerprint(workspaceId: string) {
  return listCsvRealDataImports(workspaceId).map((entry) => ({
    importId: entry.importId,
    fileName: entry.prepared.fileName,
    workspaceId: entry.workspaceId,
    rows: entry.prepared.parse.records.map((record) => record.values),
  }));
}

function fileNames(profilePrefix: string) {
  return listCsvRealDataImports(DEMO_WORKSPACE_ID)
    .filter((entry) => entry.importId.startsWith(profilePrefix))
    .map((entry) => entry.prepared.fileName)
    .sort();
}

function section(active: "manufacturing" | "project" | null) {
  return renderToStaticMarkup(
    React.createElement(DemoLibrarySection, {
      activeProfile: active,
      confirmingReset: false,
      notice: null,
      failure: null,
      onOpen: () => undefined,
      onRequestReset: () => undefined,
      onConfirmReset: () => undefined,
      onCancelReset: () => undefined,
    }),
  );
}

test("library presents Manufacturing and Project Management without a new authority", () => {
  const library = projectDemoLibrary(null);
  assert.equal(library.identity, "DEMO-MVP:4/DemoLibrary");
  assert.deepEqual(
    library.items.map((item) => item.title),
    ["Manufacturing", "Project Management"],
  );
  assert.equal(library.items[0]?.id, "manufacturing");
  assert.equal(library.items[1]?.id, "project");
  assert.match(library.items[0]?.description ?? "", /rising demand/);
  assert.match(library.items[1]?.description ?? "", /schedule pressure/);
  assert.equal(library.items.every((item) => item.sourceCount === 3), true);
  assert.equal(library.saveOffered, false);
  assert.equal(library.resetOffered, false);
  assert.equal(library.items.some((item) => item.active), false);
  assert.equal(DEMO_LIBRARY_ITEMS.some((item) => item.title === "Finance" || item.title.includes("ISO")), false);
  const source = readFileSync(fileURLToPath(new URL("./demoLibrary.ts", import.meta.url)), "utf8");
  assert.equal(source.includes("expected-truth"), false);
  assert.equal(source.includes("resetActiveDemo"), false);
  assert.equal(source.includes("createManagerWorkspace"), false);
  assert.equal(source.includes("workspaceRegistryStore"), false);
  assert.match(source, /openManufacturingDemo\(\)/);
  assert.match(source, /openProjectDemo\(\)/);
});

test("Manufacturing and Project cards call the certified entry seams", () => {
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && expansion);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", "manager-stock", MANUFACTURING_DEMO_INVENTORY_TEXT);
  commitOwnedCsv(expansion.workspaceId, "project-control.csv", "project-control", MANUFACTURING_DEMO_INVENTORY_TEXT);
  const companyCsv = fingerprint(company.workspaceId);
  const projectCsv = fingerprint(expansion.workspaceId);
  const beforeOrder = getWorkspaceRegistrySnapshot().workspaceOrder.slice();

  const manufacturing = openDemoLibraryItem("manufacturing");
  assert.equal(manufacturing?.opened, true);
  assert.equal(manufacturing?.profileId, "manufacturing");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.deepEqual(fileNames("demo-profile:manufacturing:"), [
    MANUFACTURING_DEMO_INVENTORY_FILE,
    MANUFACTURING_DEMO_ORDERS_FILE,
    MANUFACTURING_DEMO_PRODUCTION_FILE,
  ].sort());
  assert.equal(fileNames("demo-profile:project:").length, 0);
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.kind, undefined);
  assert.equal(isRealManagerWorkspaceId(DEMO_WORKSPACE_ID), false);
  assert.deepEqual(getWorkspaceRegistrySnapshot().workspaceOrder, beforeOrder);

  const project = openDemoLibraryItem("project");
  assert.equal(project?.opened, true);
  assert.equal(readActiveDemoProfile(), "project");
  assert.deepEqual(fileNames("demo-profile:project:"), [
    PROJECT_DEMO_PROGRESS_FILE,
    PROJECT_DEMO_RESOURCES_FILE,
    PROJECT_DEMO_SCHEDULE_FILE,
  ].sort());
  assert.equal(fileNames("demo-profile:manufacturing:").length, 0);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE),
    false,
  );
  const labels = collectNexoraLivePrioritySources().map((item) => item.subjectLabel);
  for (const label of FIXTURE_LABELS) assert.equal(labels.includes(label), false);

  const returned = openDemoLibraryItem("manufacturing");
  assert.equal(returned?.opened, true);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(fileNames("demo-profile:project:").length, 0);
  assert.equal(fileNames("demo-profile:manufacturing:").length, 3);
  assert.equal(openDemoLibraryItem("finance"), null);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.deepEqual(fingerprint(company.workspaceId), companyCsv);
  assert.deepEqual(fingerprint(expansion.workspaceId), projectCsv);
});

test("active projection follows the live profile and leaves manager workspaces in the registry", () => {
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(company);
  openDemoLibraryItem("manufacturing");
  assert.equal(projectDemoLibrary(readActiveDemoProfile()).items.find((item) => item.id === "manufacturing")?.active, true);
  assert.equal(projectDemoLibrary(readActiveDemoProfile()).items.find((item) => item.id === "project")?.active, false);
  assert.equal(projectDemoLibrary(readActiveDemoProfile()).resetOffered, true);
  selectManagerWorkspaceEntry(company.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readStoredDemoProfile(), "manufacturing");
  const away = projectDemoLibrary(readActiveDemoProfile());
  assert.equal(away.items.some((item) => item.active), false);
  assert.equal(away.resetOffered, false);
  const view = projectManagerWorkspaceEntries(getWorkspaceRegistrySnapshot());
  assert.equal(view.active.identityLabel, "BAHA Doors · Business");
  assert.equal(view.real.some((entry) => entry.role === "demo"), false);
  assert.equal(DEMO_LIBRARY_ITEMS.some((item) => view.real.some((entry) => entry.workspaceId === item.id)), false);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", "manager-stock", MANUFACTURING_DEMO_INVENTORY_TEXT);
  const companyCsv = fingerprint(company.workspaceId);
  assert.equal(resetActiveDemo().status, "refused");
  assert.deepEqual(fingerprint(company.workspaceId), companyCsv);
  assert.equal(getActiveWorkspaceId(), company.workspaceId);
});

test("library focus does not load demo data into a manager workspace", () => {
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  const expansion = createManagerWorkspaceFromEntry({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && expansion);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", "manager-stock", MANUFACTURING_DEMO_INVENTORY_TEXT);
  const before = fingerprint(company.workspaceId);
  assert.equal(requestDemoLibraryFocus(), 1);
  assert.equal(readDemoLibraryFocus(), 1);
  assert.equal(getActiveWorkspaceId(), expansion.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.deepEqual(fingerprint(company.workspaceId), before);
  assert.equal(listCsvRealDataImports(expansion.workspaceId).length, 0);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("demo-profile:")), false);
});

test("Demo Library markup keeps Try Nexora apart from My Workspaces", () => {
  const idle = section(null);
  assert.match(idle, /Try Nexora/);
  assert.match(idle, /Manufacturing/);
  assert.match(idle, /Project Management/);
  assert.match(idle, /Explore rising demand, limited capacity, and inventory pressure/);
  assert.match(idle, /Explore schedule pressure, resource load, and a growing progress gap/);
  assert.match(idle, /3 data sources/);
  assert.match(idle, /Try Demo/);
  assert.match(idle, /Demo data is provided by Nexora/);
  assert.doesNotMatch(idle, /data-testid="reset-demo"/);
  assert.doesNotMatch(idle, /Save Demo|Save as Workspace|Save Manufacturing/);
  const manufacturing = section("manufacturing");
  assert.match(manufacturing, /data-demo-library-item="manufacturing"[^>]*data-demo-library-active="true"/);
  assert.match(manufacturing, /aria-current="true"/);
  assert.match(manufacturing, />Active</);
  assert.match(manufacturing, /data-testid="reset-demo"/);
  const project = section("project");
  assert.match(project, /data-demo-library-item="project"[^>]*data-demo-library-active="true"/);
  assert.doesNotMatch(project, /data-demo-library-item="manufacturing"[^>]*data-demo-library-active="true"/);
  const control = readFileSync(
    fileURLToPath(new URL("../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx", import.meta.url)),
    "utf8",
  );
  assert.match(control, /My Workspaces/);
  assert.match(control, /\+ New Company/);
  assert.match(control, /\+ New Project/);
  assert.match(control, /Start with your own data/);
  assert.match(control, /openDemoLibraryItem/);
  assert.match(control, /resetActiveDemo\(\)/);
  assert.match(control, /createManagerWorkspaceFromEntry/);
  assert.match(control, /role="dialog"/);
  assert.match(control, /aria-label="Try Nexora and my workspaces"/);
  assert.match(control, /width: "min\(22rem, calc\(100vw - 1rem\)\)"/);
  assert.doesNotMatch(control, /Save Demo|Save as Workspace|Save Manufacturing/);
  const explorer = readFileSync(
    fileURLToPath(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url)),
    "utf8",
  );
  assert.match(explorer, /Want to see how Nexora works\?/);
  assert.match(explorer, /requestDemoLibraryFocus\(\)/);
  assert.equal(explorer.includes("openManufacturingDemo"), false);
  assert.equal(explorer.includes("openProjectDemo"), false);
});

test("returning from a manager workspace restores the selected demo through the library", () => {
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && expansion);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", "manager-stock", MANUFACTURING_DEMO_INVENTORY_TEXT);
  commitOwnedCsv(expansion.workspaceId, "project-control.csv", "project-control", MANUFACTURING_DEMO_INVENTORY_TEXT);
  const companyCsv = fingerprint(company.workspaceId);
  const projectCsv = fingerprint(expansion.workspaceId);
  openDemoLibraryItem("project");
  assert.equal(selectManagerWorkspaceEntry(company.workspaceId), true);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(listCsvRealDataImports(company.workspaceId).some((entry) => entry.importId.startsWith("demo-profile:")), false);
  openDemoLibraryItem("manufacturing");
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(fileNames("demo-profile:project:").length, 0);
  assert.equal(selectManagerWorkspaceEntry(expansion.workspaceId), true);
  assert.equal(readActiveDemoProfile(), null);
  openDemoLibraryItem("project");
  assert.equal(readActiveDemoProfile(), "project");
  assert.equal(fileNames("demo-profile:manufacturing:").length, 0);
  assert.equal(listCsvRealDataImports(expansion.workspaceId).some((entry) => entry.importId.startsWith("demo-profile:")), false);
  assert.deepEqual(fingerprint(company.workspaceId), companyCsv);
  assert.deepEqual(fingerprint(expansion.workspaceId), projectCsv);
});
