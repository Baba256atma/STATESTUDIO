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
  commitPreparedCsvRealDataImport,
  getCsvRealDataImportCommitInvocationCount,
  listCsvImportCandidates,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { projectAdvisorDataContext } from "../manager-object/nexoraAdvisorDataContext.ts";
import { hostNmiLiveManagementIntelligence } from "../nmi/nmiLivePipeline.ts";
import { collectNexoraLivePrioritySources } from "../nex-mvp/nexoraLiveEpistemicProjection.ts";
import { createEmptyNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import {
  DEMO_WORKSPACE_ID,
  isManagerWorkspaceKind,
  type WorkspaceId,
} from "../workspace/workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import {
  DEMO_PROFILE_BOUNDARY,
  PROJECT_DEMO_PROFILE_ID,
} from "./demoProfileContract.ts";
import { DEMO_PROFILE_DURABLE_STATE, retireAllDemoProfileImports } from "./demoProfilePackageTransition.ts";
import { MANUFACTURING_DEMO_INVENTORY_TEXT } from "./manufacturingDemoPackage.ts";
import {
  forgetDemoProfileMemoryForTests,
  openManufacturingDemo,
  openProjectDemo,
  readActiveDemoProfile,
  readStoredDemoProfile,
  resetDemoProfileForTests,
  restoreDemoProfileSelectionFromSession,
} from "./demoProfileStore.ts";
import {
  ensureProjectDemoPackage,
  PROJECT_DEMO_PROGRESS_FILE,
  PROJECT_DEMO_PROGRESS_TEXT,
  PROJECT_DEMO_RESOURCES_FILE,
  PROJECT_DEMO_RESOURCES_TEXT,
  PROJECT_DEMO_SCHEDULE_CONVENTION,
  PROJECT_DEMO_SCHEDULE_FILE,
  PROJECT_DEMO_SCHEDULE_TEXT,
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
] as const;

const ANSWER_LEAK = /Project Delay|Delivery Risk|Resource Constraint|recommended_action|Add Resources|Extend Schedule|Reduce Scope|best_scenario|management_takeaway|project_status/;

const packageDir = fileURLToPath(new URL("./project/", import.meta.url));

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
});

function profileImports(profileId: "manufacturing" | "project") {
  return listCsvRealDataImports(DEMO_WORKSPACE_ID).filter((entry) =>
    entry.importId.startsWith(`demo-profile:${profileId}:`),
  );
}

function projectStage() {
  return resolveNexoraMVPDataRealityAwareStageExperience({
    baseCatalog: createEmptyNexoraMVPObjectInteractionCatalog(),
    suppressUnownedDemoDataset: true,
  });
}

function commitManagerInventory(workspaceId: WorkspaceId) {
  const previous = getActiveWorkspaceId();
  setActiveWorkspace(workspaceId);
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName: "manager-stock.csv",
    fileSize: MANUFACTURING_DEMO_INVENTORY_TEXT.length,
    csvText: MANUFACTURING_DEMO_INVENTORY_TEXT,
    importId: `manager:${workspaceId}:manager-stock.csv`,
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
  return committed.current?.importId;
}

test("project is a Demo Profile and not a PROJECT Manager Workspace", () => {
  assert.equal(PROJECT_DEMO_PROFILE_ID, "project");
  assert.equal(isManagerWorkspaceKind("PROJECT"), true);
  assert.equal(isManagerWorkspaceKind(PROJECT_DEMO_PROFILE_ID), false);
  assert.equal(DEMO_PROFILE_BOUNDARY.selectsManagerWorkspace, false);
  assert.equal(DEMO_PROFILE_BOUNDARY.storedInWorkspaceRegistry, false);
  assert.equal(DEMO_PROFILE_BOUNDARY.extendsManagerWorkspaceKind, false);
  assert.equal(DEMO_PROFILE_BOUNDARY.validWorkspaceId, DEMO_WORKSPACE_ID);
  const opened = openProjectDemo();
  assert.equal(opened.opened, true);
  assert.equal(opened.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "project");
  assert.notEqual(getActiveWorkspaceId(), "project");
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(expansion);
  assert.equal(expansion.kind, "PROJECT");
  assert.notEqual(expansion.workspaceId, "project");
  assert.notEqual(expansion.workspaceId, PROJECT_DEMO_PROFILE_ID);
  setActiveWorkspace(expansion.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(readStoredDemoProfile(), "project");
});

test("Project package files match ingestion text and omit answer fields", () => {
  assert.equal(readFileSync(`${packageDir}progress.csv`, "utf8"), PROJECT_DEMO_PROGRESS_TEXT);
  assert.equal(readFileSync(`${packageDir}resources.csv`, "utf8"), PROJECT_DEMO_RESOURCES_TEXT);
  assert.equal(readFileSync(`${packageDir}schedule.csv`, "utf8"), PROJECT_DEMO_SCHEDULE_TEXT);
  const combined = `${PROJECT_DEMO_PROGRESS_TEXT}${PROJECT_DEMO_RESOURCES_TEXT}${PROJECT_DEMO_SCHEDULE_TEXT}`;
  assert.doesNotMatch(combined, ANSWER_LEAK);
  assert.equal(PROJECT_DEMO_SCHEDULE_CONVENTION.positiveMeans, "behind plan");
  const progress = PROJECT_DEMO_PROGRESS_TEXT.trim().split("\n").slice(1).map((row) => {
    const cells = row.split(",");
    return [Number(cells[1]), Number(cells[2])] as const;
  });
  const load = PROJECT_DEMO_RESOURCES_TEXT.trim().split("\n").slice(1).map((row) => Number(row.split(",")[1]));
  const variance = PROJECT_DEMO_SCHEDULE_TEXT.trim().split("\n").slice(1).map((row) => Number(row.split(",")[1]));
  assert.equal(progress[0]![0], progress[0]![1]);
  assert.ok(progress.at(-1)![0]! - progress.at(-1)![1]! > progress[1]![0]! - progress[1]![1]!);
  assert.ok(load.at(-1)! > load[0]!);
  assert.equal(variance[0], 0);
  assert.ok(variance.at(-1)! > variance[0]!);
});

test("Project package uses production parse, prepare, and commit on demo_workspace", () => {
  const source = readFileSync(fileURLToPath(new URL("./projectDemoPackage.ts", import.meta.url)), "utf8");
  assert.match(source, /parseCsvDeterministically/);
  assert.match(source, /prepareCsvRealDataImport/);
  assert.match(source, /commitPreparedCsvRealDataImport/);
  const opened = openProjectDemo();
  assert.equal(opened.opened, true);
  assert.equal(opened.packageImportCount, 3);
  const imports = profileImports("project");
  assert.equal(imports.length, 3);
  for (const entry of imports) {
    assert.equal(entry.workspaceId, DEMO_WORKSPACE_ID);
    assert.match(entry.importId, /^demo-profile:project:demo_workspace:/);
    assert.doesNotMatch(entry.workspaceId, /^project$/);
    assert.equal(entry.prepared.ready, true);
    assert.equal(entry.prepared.parse.records.length, 8);
  }
  const progress = imports.find((entry) => entry.prepared.fileName === PROJECT_DEMO_PROGRESS_FILE);
  const resources = imports.find((entry) => entry.prepared.fileName === PROJECT_DEMO_RESOURCES_FILE);
  const schedule = imports.find((entry) => entry.prepared.fileName === PROJECT_DEMO_SCHEDULE_FILE);
  assert.equal(progress?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "plannedProgress")?.value, 0.84);
  assert.equal(progress?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "actualProgress")?.value, 0.68);
  assert.equal(resources?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "resourceLoad")?.value, 11);
  assert.equal(schedule?.prepared.handoff?.dataset.records.find((record) => record.metricKey === "scheduleVarianceDays")?.value, 9);
  assert.equal(progress?.prepared.parse.records[0]?.values[1], 0.12);
  assert.equal(progress?.prepared.parse.records[0]?.values[2], 0.12);
});

test("opening Project again does not duplicate imports", () => {
  const first = openProjectDemo();
  assert.equal(first.opened, true);
  const afterFirst = getCsvRealDataImportCommitInvocationCount();
  const second = openProjectDemo();
  assert.equal(second.opened, true);
  assert.equal(profileImports("project").length, 3);
  assert.equal(getCsvRealDataImportCommitInvocationCount(), afterFirst);
  forgetDemoProfileMemoryForTests();
  assert.equal(restoreDemoProfileSelectionFromSession(), "project");
  const restored = ensureProjectDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(restored.files.every((file) => file.alreadyPresent), true);
  assert.equal(getCsvRealDataImportCommitInvocationCount(), afterFirst);
  assert.equal(profileImports("project").length, 3);
});

test("Manufacturing to Project retires only the Manufacturing package", () => {
  openManufacturingDemo();
  assert.equal(profileImports("manufacturing").length, 3);
  const switched = openProjectDemo();
  assert.equal(switched.opened, true);
  assert.equal(readActiveDemoProfile(), "project");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(profileImports("manufacturing").length, 0);
  assert.equal(profileImports("project").length, 3);
  const names = listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.prepared.fileName);
  assert.deepEqual(names.filter((name) => name.startsWith("manufacturing-")), []);
  assert.equal(names.includes(CSV_MVP_DEMO_INVENTORY_FILE), false);
});

test("Project to Manufacturing restores Manufacturing without duplicates", () => {
  openManufacturingDemo();
  openProjectDemo();
  const beforeReturn = getCsvRealDataImportCommitInvocationCount();
  const returned = openManufacturingDemo();
  assert.equal(returned.opened, true);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(profileImports("project").length, 0);
  assert.equal(profileImports("manufacturing").length, 3);
  const afterReturn = getCsvRealDataImportCommitInvocationCount();
  assert.ok(afterReturn > beforeReturn);
  openManufacturingDemo();
  assert.equal(getCsvRealDataImportCommitInvocationCount(), afterReturn);
  assert.equal(profileImports("manufacturing").length, 3);
});

test("profile switching cannot remove CSV from a real manager workspace", () => {
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company);
  assert.ok(expansion);
  const companyImportId = commitManagerInventory(company.workspaceId);
  const projectImportId = commitManagerInventory(expansion.workspaceId);
  openManufacturingDemo();
  openProjectDemo();
  openManufacturingDemo();
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 1);
  assert.equal(listCsvRealDataImports(expansion.workspaceId).length, 1);
  assert.equal(listCsvRealDataImports(company.workspaceId)[0]?.importId, companyImportId);
  assert.equal(listCsvRealDataImports(expansion.workspaceId)[0]?.importId, projectImportId);
  const refused = ensureProjectDemoPackage({ workspaceId: company.workspaceId });
  assert.equal(refused.refused, true);
  assert.equal(refused.retiredOtherProfileImportIds.length, 0);
  assert.equal(retireAllDemoProfileImports(company.workspaceId).removedImportIds.length, 0);
  assert.equal(retireAllDemoProfileImports(expansion.workspaceId).removedImportIds.length, 0);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 1);
  assert.equal(listCsvRealDataImports(expansion.workspaceId).length, 1);
});

test("legacy bootstrap and Executive Operations dataset stay out of Project Demo", () => {
  const seeded = ensureCsvMvpDemoBootstrap({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(seeded.refused, false);
  openProjectDemo();
  const names = listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.prepared.fileName);
  assert.equal(names.includes(CSV_MVP_DEMO_INVENTORY_FILE), false);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("cei3-mvp-demo:")),
    false,
  );
  assert.equal(
    listCsvImportCandidates(DEMO_WORKSPACE_ID).some((entry) => entry.fileName === CSV_MVP_DEMO_PENDING_FILE),
    false,
  );
  const experience = projectStage();
  assert.notEqual(experience.runtimeState.datasetIdentity.datasetId, EXECUTIVE_OPERATIONS_DEMO_DATASET_ID);
  assert.equal(experience.catalog.contextSubjects.length, 0);
  resetDemoProfileForTests();
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  const retired = retireAllDemoProfileImports(DEMO_WORKSPACE_ID);
  assert.equal(retired.removedImportIds.length, 3);
  const legacy = ensureCsvMvpDemoBootstrap({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(legacy.inventorySeeded || legacy.inventoryAlreadyPresent, true);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(profileImports("project").length, 0);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE),
    true,
  );
  assert.equal(retireAllDemoProfileImports(DEMO_WORKSPACE_ID).removedImportIds.length, 0);
});

test("Project keeps the nine fixture answers absent", () => {
  openProjectDemo();
  const experience = projectStage();
  const live = hostNmiLiveManagementIntelligence({ catalog: experience.catalog });
  const text = JSON.stringify({
    catalog: experience.catalog,
    nodes: live.overlayMapNodes,
    subjects: live.advisorBundle.subjects,
  });
  for (const label of FIXTURE_LABELS) assert.doesNotMatch(text, new RegExp(label));
  assert.equal(live.advisorBundle.subjects?.length ?? 0, 0);
  resetDemoProfileForTests();
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.ok(collectNexoraLivePrioritySources().some((source) => source.subjectLabel === "Capacity Gap"));
  openProjectDemo();
  const contained = collectNexoraLivePrioritySources().map((source) => source.subjectLabel);
  for (const label of FIXTURE_LABELS) assert.equal(contained.includes(label), false);
  assert.equal(contained.length, 0);
});

test("hidden Project expected truth cannot enter runtime owners", () => {
  const truth = JSON.parse(readFileSync(`${packageDir}project.expected-truth.json`, "utf8")) as {
    testOnly: boolean;
    signals: string[];
  };
  assert.equal(truth.testOnly, true);
  assert.ok(truth.signals.includes("project delivery pressure is emerging"));
  const runtimeFiles = [
    new URL("./demoProfileContract.ts", import.meta.url),
    new URL("./demoProfileStore.ts", import.meta.url),
    new URL("./demoProfilePackageTransition.ts", import.meta.url),
    new URL("./projectDemoPackage.ts", import.meta.url),
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
    assert.equal(source.includes("project.expected-truth"), false, file.pathname);
    assert.equal(source.includes("project delivery pressure is emerging"), false, file.pathname);
  }
});

test("BUSINESS and real PROJECT workspaces do not receive the Project package", () => {
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company);
  assert.ok(expansion);
  openProjectDemo();
  setActiveWorkspace(company.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
  setActiveWorkspace(expansion.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(expansion.kind, "PROJECT");
  assert.equal(listCsvRealDataImports(expansion.workspaceId).length, 0);
  assert.equal(ensureProjectDemoPackage({ workspaceId: expansion.workspaceId }).refused, true);
  assert.equal(profileImports("project").length, 3);
});

test("Advisor can read Project observations without fixture answers or raw CSV", () => {
  openProjectDemo();
  const advisor = projectAdvisorDataContext(DEMO_WORKSPACE_ID);
  const text = JSON.stringify(advisor);
  for (const label of FIXTURE_LABELS) assert.equal(text.includes(label), false);
  assert.doesNotMatch(text, ANSWER_LEAK);
  assert.equal(advisor.sources.length, 3);
  const progress = advisor.sources.find((source) => source.label === PROJECT_DEMO_PROGRESS_FILE);
  const planned = progress?.fields.find((field) => field.column === "Planned Progress");
  const actual = progress?.fields.find((field) => field.column === "Actual Progress");
  const load = advisor.sources
    .find((source) => source.label === PROJECT_DEMO_RESOURCES_FILE)
    ?.fields.find((field) => field.column === "Resource Load");
  const variance = advisor.sources
    .find((source) => source.label === PROJECT_DEMO_SCHEDULE_FILE)
    ?.fields.find((field) => field.column === "Schedule Variance Days");
  assert.equal(planned?.observation.rowCount, 8);
  assert.equal(planned?.observation.minimum, 0.12);
  assert.equal(planned?.observation.maximum, 0.84);
  assert.equal(actual?.observation.minimum, 0.12);
  assert.equal(actual?.observation.maximum, 0.68);
  assert.equal(load?.observation.minimum, 6);
  assert.equal(load?.observation.maximum, 11);
  assert.equal(variance?.observation.minimum, 0);
  assert.equal(variance?.observation.maximum, 9);
  const progressImport = profileImports("project").find((entry) => entry.prepared.fileName === PROJECT_DEMO_PROGRESS_FILE);
  assert.ok(progressImport);
  const context = projectNexoraLlmManagementContext({
    resolvedSubjectId: null,
    subjectLabel: null,
    subjectKind: null,
    subjectEpistemic: null,
    referentId: null,
    referentProvenance: null,
    utterance: "What is happening in the project?",
    workspaceId: DEMO_WORKSPACE_ID,
    advisorData: advisor,
    advisorDataDialogue: {
      sourceContextId: progressImport.sourceContextId,
      fieldColumn: "Actual Progress",
    },
  });
  const packed = JSON.stringify(context);
  assert.equal(packed.includes(PROJECT_DEMO_PROGRESS_TEXT), false);
  assert.equal(packed.includes("project delivery pressure is emerging"), false);
  assert.equal(packed.includes("demo_test"), false);
  const fieldRef = context.dataReality.refs.find((ref) => ref.kind === "data-reality-field");
  assert.ok(fieldRef);
  assert.match(fieldRef.value ?? "", /average/);
});

test("reload keeps Project on demo_workspace and leaves it inactive inside a Company", () => {
  openProjectDemo();
  forgetDemoProfileMemoryForTests();
  assert.equal(restoreDemoProfileSelectionFromSession(), "project");
  assert.equal(readActiveDemoProfile(), "project");
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(company);
  setActiveWorkspace(company.workspaceId);
  forgetDemoProfileMemoryForTests();
  assert.equal(restoreDemoProfileSelectionFromSession(), null);
  assert.equal(readStoredDemoProfile(), "project");
  assert.equal(readActiveDemoProfile(), null);
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "project");
});

test("durable demo state distinguishes a profile switch from a later reset", () => {
  assert.deepEqual([...DEMO_PROFILE_DURABLE_STATE.profiles], ["manufacturing", "project"]);
  assert.equal(DEMO_PROFILE_DURABLE_STATE.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(DEMO_PROFILE_DURABLE_STATE.importIdPrefix, "demo-profile:");
  assert.match(DEMO_PROFILE_DURABLE_STATE.switchRetires, /demo-profile imports/);
  assert.match(DEMO_PROFILE_DURABLE_STATE.resetWouldRestore, /original CSV baseline/);
  assert.ok(DEMO_PROFILE_DURABLE_STATE.mustNotClear.includes("manager CSV imports"));
});
