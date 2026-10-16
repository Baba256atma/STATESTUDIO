import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import { projectNexoraLlmManagementContext } from "../conversational-control/nexoraLlmManagementContext.ts";
import { EXECUTIVE_OPERATIONS_DEMO_DATASET_ID } from "../data-reality/demo/executiveOperationsDemoDataset.ts";
import {
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_PENDING_FILE,
  ensureCsvMvpDemoBootstrap,
} from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  getCsvRealDataImportCommitInvocationCount,
  listCsvImportCandidates,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { projectAdvisorDataContext } from "../manager-object/nexoraAdvisorDataContext.ts";
import { hostNmiLiveManagementIntelligence } from "../nmi/nmiLivePipeline.ts";
import { collectNexoraLivePrioritySources } from "../nex-mvp/nexoraLiveEpistemicProjection.ts";
import {
  createEmptyNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { isManagerWorkspaceKind } from "../workspace/workspaceRegistryContract.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import {
  DEMO_PROFILE_BOUNDARY,
  MANUFACTURING_DEMO_PROFILE_ID,
} from "./demoProfileContract.ts";
import {
  forgetDemoProfileMemoryForTests,
  openManufacturingDemo,
  readActiveDemoProfile,
  readStoredDemoProfile,
  resetDemoProfileForTests,
  restoreDemoProfileSelectionFromSession,
  selectManufacturingDemoProfile,
} from "./demoProfileStore.ts";
import {
  MANUFACTURING_DEMO_INVENTORY_FILE,
  MANUFACTURING_DEMO_INVENTORY_TEXT,
  MANUFACTURING_DEMO_ORDERS_FILE,
  MANUFACTURING_DEMO_ORDERS_TEXT,
  MANUFACTURING_DEMO_PRODUCTION_FILE,
  MANUFACTURING_DEMO_PRODUCTION_TEXT,
  MANUFACTURING_DEMO_RESET_SURFACE,
  MANUFACTURING_DEMO_UNAVAILABLE_OBSERVATIONS,
  ensureManufacturingDemoPackage,
} from "./manufacturingDemoPackage.ts";

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
] as const;

const packageDir = fileURLToPath(new URL("./manufacturing/", import.meta.url));

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
});

function packageImports() {
  return listCsvRealDataImports(DEMO_WORKSPACE_ID).filter((entry) =>
    entry.importId.startsWith("demo-profile:manufacturing:"),
  );
}

function manufacturingStage() {
  return resolveNexoraMVPDataRealityAwareStageExperience({
    baseCatalog: createEmptyNexoraMVPObjectInteractionCatalog(),
    suppressUnownedDemoDataset: true,
  });
}

test("Manufacturing is a Demo Profile and not a Manager Workspace", () => {
  assert.equal(MANUFACTURING_DEMO_PROFILE_ID, "manufacturing");
  assert.equal(isManagerWorkspaceKind("MANUFACTURING"), false);
  assert.equal(isManagerWorkspaceKind(MANUFACTURING_DEMO_PROFILE_ID), false);
  assert.equal(DEMO_PROFILE_BOUNDARY.selectsManagerWorkspace, false);
  assert.equal(DEMO_PROFILE_BOUNDARY.storedInWorkspaceRegistry, false);
  assert.equal(DEMO_PROFILE_BOUNDARY.extendsManagerWorkspaceKind, false);
  assert.equal(DEMO_PROFILE_BOUNDARY.validWorkspaceId, DEMO_WORKSPACE_ID);
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(selectManufacturingDemoProfile(), true);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(company);
  setActiveWorkspace(company.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readStoredDemoProfile(), "manufacturing");
  assert.notEqual(company.workspaceId, "manufacturing");
  assert.equal(company.kind, "BUSINESS");
});

test("the package files match the ingestion text and omit answer fields", () => {
  assert.equal(readFileSync(`${packageDir}orders.csv`, "utf8"), MANUFACTURING_DEMO_ORDERS_TEXT);
  assert.equal(readFileSync(`${packageDir}production.csv`, "utf8"), MANUFACTURING_DEMO_PRODUCTION_TEXT);
  assert.equal(readFileSync(`${packageDir}inventory.csv`, "utf8"), MANUFACTURING_DEMO_INVENTORY_TEXT);
  const combined = `${MANUFACTURING_DEMO_ORDERS_TEXT}${MANUFACTURING_DEMO_PRODUCTION_TEXT}${MANUFACTURING_DEMO_INVENTORY_TEXT}`;
  assert.doesNotMatch(combined, /Capacity Gap|Margin Pressure|Approve Repricing|Expand Capacity|recommended_decision|best_scenario|management_takeaway/);
  assert.equal(MANUFACTURING_DEMO_ORDERS_TEXT.trim().split("\n").length, 9);
  assert.equal(MANUFACTURING_DEMO_PRODUCTION_TEXT.trim().split("\n").length, 9);
  assert.equal(MANUFACTURING_DEMO_INVENTORY_TEXT.trim().split("\n").length, 9);
  assert.deepEqual(
    MANUFACTURING_DEMO_UNAVAILABLE_OBSERVATIONS.map((entry) => entry.column),
    ["backlog", "orders_shipped"],
  );
});

test("opening Manufacturing loads three demo_workspace imports through prepare and commit", () => {
  const opened = openManufacturingDemo();
  assert.equal(opened.opened, true);
  assert.equal(opened.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(opened.profileId, "manufacturing");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  const imports = packageImports();
  assert.equal(imports.length, 3);
  assert.deepEqual(
    imports.map((entry) => entry.prepared.fileName).sort(),
    [MANUFACTURING_DEMO_INVENTORY_FILE, MANUFACTURING_DEMO_ORDERS_FILE, MANUFACTURING_DEMO_PRODUCTION_FILE],
  );
  for (const entry of imports) {
    assert.equal(entry.workspaceId, DEMO_WORKSPACE_ID);
    assert.equal(entry.prepared.workspaceId, DEMO_WORKSPACE_ID);
    assert.equal(entry.prepared.handoff?.workspaceId, DEMO_WORKSPACE_ID);
    assert.equal(entry.prepared.ready, true);
    assert.notEqual(entry.prepared.handoff?.dataset.id, EXECUTIVE_OPERATIONS_DEMO_DATASET_ID);
    assert.match(entry.importId, /^demo-profile:manufacturing:demo_workspace:/);
    assert.doesNotMatch(entry.workspaceId, /manufacturing/);
  }
  const orders = imports.find((entry) => entry.prepared.fileName === MANUFACTURING_DEMO_ORDERS_FILE);
  const production = imports.find((entry) => entry.prepared.fileName === MANUFACTURING_DEMO_PRODUCTION_FILE);
  const inventory = imports.find((entry) => entry.prepared.fileName === MANUFACTURING_DEMO_INVENTORY_FILE);
  assert.equal(orders?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "ordersReceived")?.value, 1230);
  assert.equal(production?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "usedCapacity")?.value, 980);
  assert.equal(production?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "totalCapacity")?.value, 1000);
  assert.equal(inventory?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "onHand")?.value, 320);
  assert.equal(orders?.prepared.parse.records.length, 8);
  assert.equal(production?.prepared.parse.records[0]?.values[1], 740);
  assert.equal(inventory?.prepared.parse.records[7]?.values[1], 320);
});

test("reopen and session restore do not duplicate imports", () => {
  const first = openManufacturingDemo();
  assert.equal(first.opened, true);
  const afterFirst = getCsvRealDataImportCommitInvocationCount();
  assert.equal(packageImports().length, 3);
  const second = openManufacturingDemo();
  assert.equal(second.opened, true);
  assert.equal(packageImports().length, 3);
  assert.equal(getCsvRealDataImportCommitInvocationCount(), afterFirst);
  const ids = packageImports().map((entry) => entry.importId).sort();
  forgetDemoProfileMemoryForTests();
  assert.equal(readStoredDemoProfile(), null);
  assert.equal(restoreDemoProfileSelectionFromSession(), "manufacturing");
  const restored = ensureManufacturingDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(restored.refused, false);
  assert.equal(restored.files.every((file) => file.alreadyPresent), true);
  assert.equal(getCsvRealDataImportCommitInvocationCount(), afterFirst);
  assert.deepEqual(packageImports().map((entry) => entry.importId).sort(), ids);
});

test("legacy demo CSV does not remain beside the Manufacturing inventory import", () => {
  const seeded = ensureCsvMvpDemoBootstrap({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(seeded.refused, false);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE),
    true,
  );
  assert.equal(
    listCsvImportCandidates(DEMO_WORKSPACE_ID).some((entry) => entry.fileName === CSV_MVP_DEMO_PENDING_FILE),
    true,
  );
  const opened = openManufacturingDemo();
  assert.equal(opened.opened, true);
  const names = listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.prepared.fileName);
  assert.equal(names.filter((name) => name === MANUFACTURING_DEMO_INVENTORY_FILE).length, 1);
  assert.equal(names.includes(CSV_MVP_DEMO_INVENTORY_FILE), false);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("cei3-mvp-demo:")),
    false,
  );
  assert.equal(
    listCsvImportCandidates(DEMO_WORKSPACE_ID).some((entry) => entry.fileName === CSV_MVP_DEMO_PENDING_FILE),
    false,
  );
});

test("legacy demo bootstrap still runs when Manufacturing is not selected", () => {
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  const seeded = ensureCsvMvpDemoBootstrap({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(seeded.inventorySeeded || seeded.inventoryAlreadyPresent, true);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(packageImports().length, 0);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE),
    true,
  );
});

test("Manufacturing contains fixture answers and the Executive Operations baseline dataset", () => {
  openManufacturingDemo();
  const experience = manufacturingStage();
  const live = hostNmiLiveManagementIntelligence({ catalog: experience.catalog });
  const text = JSON.stringify({
    catalog: experience.catalog,
    nodes: live.overlayMapNodes,
    subjects: live.advisorBundle.subjects,
  });
  for (const label of FIXTURE_LABELS) assert.doesNotMatch(text, new RegExp(label));
  assert.equal(experience.catalog.contextSubjects.length, 0);
  assert.notEqual(experience.runtimeState.datasetIdentity.datasetId, EXECUTIVE_OPERATIONS_DEMO_DATASET_ID);
  assert.equal(experience.usesActiveDataSource, false);
  const legacy = resolveNexoraMVPDataRealityAwareStageExperience();
  assert.equal(legacy.runtimeState.datasetIdentity.datasetId, EXECUTIVE_OPERATIONS_DEMO_DATASET_ID);
  assert.match(JSON.stringify(legacy.catalog.contextSubjects), /Capacity Gap/);
  resetDemoProfileForTests();
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.ok(collectNexoraLivePrioritySources().some((source) => source.subjectLabel === "Capacity Gap"));
  openManufacturingDemo();
  const contained = collectNexoraLivePrioritySources().map((source) => source.subjectLabel);
  for (const label of FIXTURE_LABELS) assert.equal(contained.includes(label), false);
  assert.equal(contained.length, 0);
});

test("hidden expected truth is not imported by runtime owners", () => {
  const truth = JSON.parse(readFileSync(`${packageDir}manufacturing.expected-truth.json`, "utf8")) as {
    testOnly: boolean;
    signals: string[];
  };
  assert.equal(truth.testOnly, true);
  assert.ok(truth.signals.includes("demand trend increasing"));
  const runtimeFiles = [
    new URL("./demoProfileContract.ts", import.meta.url),
    new URL("./demoProfileStore.ts", import.meta.url),
    new URL("./manufacturingDemoPackage.ts", import.meta.url),
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    new URL("../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx", import.meta.url),
    new URL("../data-reality/csvRealDataVerticalSlice.ts", import.meta.url),
    new URL("../data-reality/csvRealDataImportStore.ts", import.meta.url),
    new URL("../nmi/nmiLivePipeline.ts", import.meta.url),
    new URL("../manager-object/nexoraAdvisorDataContext.ts", import.meta.url),
    new URL("../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts", import.meta.url),
    new URL("../conversational-control/executiveDecisionRuntimeAdapter.ts", import.meta.url),
    new URL("../conversational-control/executiveExecutionRuntimeAdapter.ts", import.meta.url),
  ];
  for (const file of runtimeFiles) {
    const source = readFileSync(file, "utf8");
    assert.equal(source.includes("manufacturing.expected-truth"), false, file.pathname);
    assert.equal(source.includes("demand trend increasing"), false, file.pathname);
  }
  const orders = MANUFACTURING_DEMO_ORDERS_TEXT.trim().split("\n").slice(1).map((row) => Number(row.split(",")[1]));
  const production = MANUFACTURING_DEMO_PRODUCTION_TEXT.trim().split("\n").slice(1).map((row) => {
    const cells = row.split(",");
    return [Number(cells[1]), Number(cells[2])] as const;
  });
  const inventory = MANUFACTURING_DEMO_INVENTORY_TEXT.trim().split("\n").slice(1).map((row) => Number(row.split(",")[1]));
  assert.ok(orders.at(-1)! > orders[0]!);
  assert.ok(production.at(-1)![0]! / production.at(-1)![1]! > production[0]![0]! / production[0]![1]!);
  assert.ok(production.at(-1)![1]! - production.at(-1)![0]! < production[0]![1]! - production[0]![0]!);
  assert.ok(inventory.at(-1)! < inventory[0]!);
});

test("a real BUSINESS workspace cannot read Manufacturing imports", () => {
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(company);
  const refused = ensureManufacturingDemoPackage({ workspaceId: company.workspaceId });
  assert.equal(refused.refused, true);
  assert.equal(refused.refusalReason, "not_demo_workspace");
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
  openManufacturingDemo();
  assert.equal(packageImports().length, 3);
  setActiveWorkspace(company.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(getActiveWorkspaceId(), company.workspaceId);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
  assert.equal(
    listCsvRealDataImports(company.workspaceId).some((entry) => entry.importId.includes("manufacturing")),
    false,
  );
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(packageImports().length, 3);
  const again = openManufacturingDemo();
  assert.equal(again.packageImportCount, 3);
  assert.equal(packageImports().length, 3);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
});

test("a real PROJECT workspace cannot read Manufacturing imports", () => {
  const project = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(project);
  openManufacturingDemo();
  setActiveWorkspace(project.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(project.kind, "PROJECT");
  assert.notEqual(project.workspaceId, MANUFACTURING_DEMO_PROFILE_ID);
  assert.equal(listCsvRealDataImports(project.workspaceId).length, 0);
  const refused = ensureManufacturingDemoPackage({ workspaceId: project.workspaceId });
  assert.equal(refused.refused, true);
  assert.equal(packageImports().length, 3);
});

test("Advisor can describe committed observations and does not receive fixture answers or raw CSV", () => {
  openManufacturingDemo();
  const advisor = projectAdvisorDataContext(DEMO_WORKSPACE_ID);
  const text = JSON.stringify(advisor);
  for (const label of FIXTURE_LABELS) assert.equal(text.includes(label), false);
  assert.equal(advisor.sources.length, 3);
  const orders = advisor.sources.find((source) => source.label === MANUFACTURING_DEMO_ORDERS_FILE);
  const ordersField = orders?.fields.find((field) => field.column === "Orders Received");
  assert.equal(ordersField?.observation.rowCount, 8);
  assert.equal(ordersField?.observation.minimum, 760);
  assert.equal(ordersField?.observation.maximum, 1230);
  const ordersImport = packageImports().find((entry) => entry.prepared.fileName === MANUFACTURING_DEMO_ORDERS_FILE);
  assert.ok(ordersImport);
  const context = projectNexoraLlmManagementContext({
    resolvedSubjectId: null,
    subjectLabel: null,
    subjectKind: null,
    subjectEpistemic: null,
    referentId: null,
    referentProvenance: null,
    utterance: "What is happening in manufacturing?",
    workspaceId: DEMO_WORKSPACE_ID,
    advisorData: advisor,
    advisorDataDialogue: {
      sourceContextId: ordersImport.sourceContextId,
      fieldColumn: "Orders Received",
    },
  });
  const packed = JSON.stringify(context);
  assert.equal(packed.includes(MANUFACTURING_DEMO_ORDERS_TEXT), false);
  assert.equal(packed.includes("demand trend increasing"), false);
  assert.equal(packed.includes("demo_test"), false);
  const fieldRef = context.dataReality.refs.find((ref) => ref.kind === "data-reality-field");
  assert.ok(fieldRef);
  assert.match(fieldRef.value ?? "", /average/);
});

test("reset surface names only Manufacturing-owned demo state", () => {
  assert.equal(MANUFACTURING_DEMO_RESET_SURFACE.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(MANUFACTURING_DEMO_RESET_SURFACE.profileId, "manufacturing");
  assert.deepEqual(MANUFACTURING_DEMO_RESET_SURFACE.fileNames, [
    MANUFACTURING_DEMO_ORDERS_FILE,
    MANUFACTURING_DEMO_PRODUCTION_FILE,
    MANUFACTURING_DEMO_INVENTORY_FILE,
  ]);
  assert.ok(MANUFACTURING_DEMO_RESET_SURFACE.mustNotClear.includes("BUSINESS workspace records"));
  assert.ok(MANUFACTURING_DEMO_RESET_SURFACE.mustNotClear.includes("PROJECT workspace records"));
});
