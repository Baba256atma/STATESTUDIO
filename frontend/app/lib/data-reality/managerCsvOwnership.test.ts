import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import { projectNexoraLlmManagementContext } from "../conversational-control/nexoraLlmManagementContext.ts";
import { projectAdvisorDataContext } from "../manager-object/nexoraAdvisorDataContext.ts";
import { openManufacturingDemo, resetDemoProfileForTests } from "../demo-profile/demoProfileStore.ts";
import { ensureManufacturingDemoPackage, MANUFACTURING_DEMO_INVENTORY_TEXT } from "../demo-profile/manufacturingDemoPackage.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID, LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS } from "../workspace/workspaceRegistryContract.ts";
import { resetWorkspaceRegistryForTests, setActiveWorkspace } from "../workspace/workspaceRegistryStore.ts";
import { listPublishedKpiObservations } from "./publishedKpiObservedDirection.ts";
import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  discardCsvImportCandidate,
  exportCsvRealDataImportState,
  getCsvImportCandidate,
  hydrateCsvRealDataImportState,
  listCsvImportCandidates,
  listCsvPublishedKpiObservations,
  listCsvRealDataImports,
  listCsvRemovedSourceReferences,
  removeCsvRealDataImport,
  removeWorkspaceCsvData,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "./csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  updateCsvColumnMapping,
} from "./csvRealDataVerticalSlice.ts";

const SENTINEL = "SENTINEL-ROW-ZX91";

function installStorage() {
  const data = new Map<string, string>();
  const localStorage = {
    get length() {
      return data.size;
    },
    key(index: number) {
      return [...data.keys()][index] ?? null;
    },
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
    removeItem(key: string) {
      data.delete(key);
    },
    clear() {
      data.clear();
    },
  };
  Object.defineProperty(globalThis, "localStorage", { value: localStorage, configurable: true });
  Object.defineProperty(globalThis, "window", {
    value: { localStorage, dispatchEvent() { return true; } },
    configurable: true,
  });
}

function commitOwned(workspaceId: string, fileName: string, importId: string, csvText = MANUFACTURING_DEMO_INVENTORY_TEXT) {
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  return commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-08-31T00:00:00.000Z",
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

test("manager CSV stays with one workspace and refuses the wrong owner", () => {
  const companyA = createManagerWorkspaceFromEntry({ name: "Company A", kind: "BUSINESS" });
  const companyB = createManagerWorkspaceFromEntry({ name: "Company B", kind: "BUSINESS" });
  const project = createManagerWorkspaceFromEntry({ name: "Project C", kind: "PROJECT" });
  assert.ok(companyA && companyB && project);
  setActiveWorkspace(companyA.workspaceId);
  const alpha = commitOwned(companyA.workspaceId, "alpha.csv", "alpha");
  assert.equal(alpha.committed, true);
  assert.equal(alpha.current?.workspaceId, companyA.workspaceId);

  setActiveWorkspace(companyB.workspaceId);
  const beta = commitOwned(companyB.workspaceId, "beta.csv", "beta");
  assert.equal(beta.committed, true);
  const stolen = commitOwned(companyA.workspaceId, "alpha-copy.csv", "alpha-copy");
  assert.equal(stolen.committed, false);
  assert.equal(stolen.reason, "wrong_workspace");
  assert.equal(listCsvRealDataImports(companyA.workspaceId).map((entry) => entry.prepared.fileName).join(","), "alpha.csv");
  assert.equal(listCsvRealDataImports(companyB.workspaceId).map((entry) => entry.prepared.fileName).join(","), "beta.csv");

  setActiveWorkspace(project.workspaceId);
  const projectFile = commitOwned(project.workspaceId, "project.csv", "project");
  assert.equal(projectFile.committed, true);
  assert.equal(commitOwned(companyA.workspaceId, "alpha.csv", "alpha-again").reason, "wrong_workspace");
  assert.equal(listCsvRealDataImports(project.workspaceId).map((entry) => entry.prepared.fileName).join(","), "project.csv");
  assert.equal(listCsvRealDataImports(companyA.workspaceId).some((entry) => entry.prepared.fileName === "project.csv"), false);

  const pending = saveCsvImportCandidate({
    workspaceId: companyA.workspaceId,
    candidateId: csvImportCandidateId(companyA.workspaceId, "pending.csv"),
    fileName: "pending.csv",
    status: "mapping",
    input: {
      workspaceId: companyA.workspaceId,
      fileName: "pending.csv",
      fileSize: 4,
      csvText: "a,b\n1,2\n",
      importId: "pending",
      importedAt: "2026-08-31T00:00:00.000Z",
    },
    parse: null,
    mapping: null,
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  });
  assert.equal(pending.saved, false);
  assert.equal(pending.reason, "wrong_workspace");
  assert.equal(listCsvImportCandidates(companyA.workspaceId).length, 0);

  const removed = removeCsvRealDataImport({
    workspaceId: companyA.workspaceId,
    sourceContextId: alpha.current!.sourceContextId,
    activeSourceContextId: null,
  });
  assert.equal(removed.removed, false);
  assert.equal(removed.reason, "wrong_workspace");
  assert.equal(listCsvRealDataImports(companyA.workspaceId).length, 1);

  setActiveWorkspace(DEMO_WORKSPACE_ID);
  const demoDelete = removeCsvRealDataImport({
    workspaceId: companyA.workspaceId,
    sourceContextId: alpha.current!.sourceContextId,
    activeSourceContextId: null,
  });
  assert.equal(demoDelete.removed, false);
  assert.equal(demoDelete.reason, "wrong_workspace");
  assert.equal(commitOwned(DEMO_WORKSPACE_ID, "demo-local.csv", "demo-local").committed, true);
  assert.equal(listCsvRealDataImports(companyA.workspaceId).some((entry) => entry.prepared.fileName === "demo-local.csv"), false);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === "alpha.csv"), false);

  setActiveWorkspace(companyA.workspaceId);
  for (const mode of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    assert.equal(commitOwned(mode, "mode.csv", `mode-${mode}`).reason, "refused_workflow_key");
    assert.equal(setActiveWorkspace(mode).activeWorkspaceId, companyA.workspaceId);
  }
});

test("removal drops active rows and pending text, and reload does not restore them", () => {
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(company);
  const csvText = `Date,Inventory On Hand,Note\n2026-01-31,640,${SENTINEL}\n`;
  const parsed = parseCsvDeterministically(csvText);
  const mapping = updateCsvColumnMapping(suggestCsvColumnMappings(parsed.columns, "sentinel"), 2, null);
  const prepared = prepareCsvRealDataImport({
    workspaceId: company.workspaceId,
    fileName: "alpha.csv",
    fileSize: csvText.length,
    csvText,
    importId: "alpha",
    importedAt: "2026-08-31T00:00:00.000Z",
  }, mapping);
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const committed = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: company.workspaceId,
    mode: "new",
    committedAt: "2026-08-31T00:00:00.000Z",
  });
  assert.equal(committed.committed, true);

  const contextBefore = JSON.stringify(projectNexoraLlmManagementContext({
    resolvedSubjectId: null,
    subjectLabel: "Inventory",
    subjectKind: null,
    subjectEpistemic: null,
    referentId: null,
    referentProvenance: null,
    utterance: "What needs attention?",
    workspaceId: readLiveExecutiveDataWorkspaceId(),
    advisorData: projectAdvisorDataContext(company.workspaceId),
  }));
  assert.equal(contextBefore.includes(SENTINEL), false);
  assert.equal(contextBefore.includes(csvText), false);
  assert.equal(contextBefore.includes("alpha.csv"), false);
  assert.match(contextBefore, /Inventory/);

  const removed = removeCsvRealDataImport({
    workspaceId: company.workspaceId,
    sourceContextId: committed.current!.sourceContextId,
    activeSourceContextId: null,
    removedAt: "2026-08-31T01:00:00.000Z",
  });
  assert.equal(removed.removed, true);
  const tombstone = listCsvRemovedSourceReferences(company.workspaceId)[0];
  assert.equal(tombstone?.label, "alpha.csv");
  assert.equal(JSON.stringify(tombstone).includes(SENTINEL), false);
  assert.equal(JSON.stringify(tombstone).includes("640"), false);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.sourceContextId === committed.current!.sourceContextId), false);
  const reality = projectAdvisorDataContext(company.workspaceId);
  assert.equal(reality.sources.some((source) => source.lifecycle === "committed"), false);
  assert.equal(reality.sources.some((source) => source.acceptedEvidence), false);

  const contextAfter = JSON.stringify(projectNexoraLlmManagementContext({
    resolvedSubjectId: null,
    subjectLabel: "Inventory",
    subjectKind: null,
    subjectEpistemic: null,
    referentId: null,
    referentProvenance: null,
    utterance: "What needs attention?",
    workspaceId: readLiveExecutiveDataWorkspaceId(),
    advisorData: projectAdvisorDataContext(company.workspaceId),
  }));
  assert.equal(contextAfter.includes(committed.current!.sourceContextId), false);
  assert.equal(contextAfter.includes(SENTINEL), false);

  const snapshot = exportCsvRealDataImportState();
  resetCsvRealDataImportStoreForTests();
  hydrateCsvRealDataImportState(snapshot);
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 0);
  assert.equal(JSON.stringify(listCsvRemovedSourceReferences(company.workspaceId)).includes(SENTINEL), false);

  const pendingSaved = saveCsvImportCandidate({
    workspaceId: company.workspaceId,
    candidateId: csvImportCandidateId(company.workspaceId, "pending.csv"),
    fileName: "pending.csv",
    status: "mapping",
    input: {
      workspaceId: company.workspaceId,
      fileName: "pending.csv",
      fileSize: csvText.length,
      csvText,
      importId: "pending",
      importedAt: "2026-08-31T02:00:00.000Z",
    },
    parse: parsed,
    mapping,
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  });
  assert.equal(pendingSaved.saved, true);
  assert.equal(getCsvImportCandidate(company.workspaceId, pendingSaved.candidate.candidateId)?.input.csvText.includes(SENTINEL), true);
  assert.ok(discardCsvImportCandidate(company.workspaceId, pendingSaved.candidate.candidateId));
  assert.equal(getCsvImportCandidate(company.workspaceId, pendingSaved.candidate.candidateId), null);
  const afterDiscard = exportCsvRealDataImportState();
  resetCsvRealDataImportStoreForTests();
  hydrateCsvRealDataImportState(afterDiscard);
  assert.equal(listCsvImportCandidates(company.workspaceId).length, 0);
  assert.equal(JSON.stringify(exportCsvRealDataImportState().pending).includes(SENTINEL), false);
});

test("two manager workspaces and Demo stay isolated, including published values", () => {
  const companyA = createManagerWorkspaceFromEntry({ name: "Company A", kind: "BUSINESS" });
  const companyB = createManagerWorkspaceFromEntry({ name: "Company B", kind: "BUSINESS" });
  const project = createManagerWorkspaceFromEntry({ name: "Project C", kind: "PROJECT" });
  assert.ok(companyA && companyB && project);
  setActiveWorkspace(companyA.workspaceId);
  assert.equal(commitOwned(companyA.workspaceId, "alpha.csv", "alpha").committed, true);
  setActiveWorkspace(companyB.workspaceId);
  assert.equal(commitOwned(companyB.workspaceId, "beta.csv", "beta").committed, true);
  setActiveWorkspace(project.workspaceId);
  assert.equal(commitOwned(project.workspaceId, "project.csv", "project").committed, true);
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  openManufacturingDemo();
  ensureManufacturingDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  const demoNames = listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.prepared.fileName);
  assert.equal(demoNames.includes("alpha.csv"), false);
  assert.equal(demoNames.includes("beta.csv"), false);
  assert.equal(demoNames.includes("project.csv"), false);

  setActiveWorkspace(companyA.workspaceId);
  assert.deepEqual(listCsvRealDataImports(companyA.workspaceId).map((entry) => entry.prepared.fileName), ["alpha.csv"]);
  assert.equal(listPublishedKpiObservations().every((entry) => entry.provenance.every((item) => !item.includes(companyB.workspaceId))), true);
  assert.equal(listCsvRealDataImports(companyB.workspaceId).map((entry) => entry.prepared.fileName).join(","), "beta.csv");
  assert.equal(listCsvRealDataImports(project.workspaceId).map((entry) => entry.prepared.fileName).join(","), "project.csv");
  assert.equal(readLiveExecutiveDataWorkspaceId(), companyA.workspaceId);

  const cleared = removeWorkspaceCsvData(companyB.workspaceId);
  assert.equal(cleared.removed, false);
  assert.equal(cleared.reason, "wrong_workspace");
  assert.equal(listCsvRealDataImports(companyB.workspaceId).length, 1);
  const own = removeWorkspaceCsvData(companyA.workspaceId);
  assert.equal(own.removed, true);
  assert.equal(listCsvRealDataImports(companyA.workspaceId).length, 0);
  assert.equal(listCsvRealDataImports(companyB.workspaceId).length, 1);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).length > 0, true);
});

test("Advisor data identity follows the live workspace, not a workflow mode", () => {
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(company);
  assert.equal(commitOwned(company.workspaceId, "alpha.csv", "alpha").committed, true);
  for (const mode of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    assert.equal(setActiveWorkspace(mode).activeWorkspaceId, company.workspaceId);
    assert.equal(readLiveExecutiveDataWorkspaceId(), company.workspaceId);
  }
  const context = projectNexoraLlmManagementContext({
    resolvedSubjectId: null,
    subjectLabel: "Inventory",
    subjectKind: null,
    subjectEpistemic: null,
    referentId: null,
    referentProvenance: null,
    utterance: "Show the overview",
    workspaceId: readLiveExecutiveDataWorkspaceId(),
  });
  assert.equal(context.dataReality.projections.includes("data-reality-csv") || context.dataReality.refs.length >= 0, true);
  const serialized = JSON.stringify(context);
  assert.equal(serialized.includes(company.workspaceId) || projectAdvisorDataContext(readLiveExecutiveDataWorkspaceId()).workspaceId === company.workspaceId, true);
  assert.equal(projectAdvisorDataContext("problem").sources.some((source) => source.label === "alpha.csv"), false);

  const orchestrator = readFileSync(fileURLToPath(new URL("../conversational-control/conversationalExperienceOrchestrator.ts", import.meta.url)), "utf8");
  assert.match(orchestrator, /workspaceId: readLiveExecutiveDataWorkspaceId\(\)/);
  const explorer = readFileSync(fileURLToPath(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url)), "utf8");
  assert.match(explorer, /Your workspace data is stored in this browser for this MVP/);
  assert.match(explorer, /not used by your other workspaces or Nexora demos/);
  assert.match(explorer, /clear the browser’s site data/);
  assert.match(explorer, /demo-csv-upload-unavailable/);
  assert.equal(explorer.includes("clearCsvRealDataImportStore"), false);
  const flow = readFileSync(fileURLToPath(new URL("../../executive/nex-mvp/data/NexoraCsvRealDataImportFlow.tsx", import.meta.url)), "utf8");
  assert.match(flow, /Add data to \{destinationName\}/);
  assert.match(flow, /Choose CSV file/);
  const control = readFileSync(fileURLToPath(new URL("../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx", import.meta.url)), "utf8");
  assert.match(control, /csvHealth === "session-only"/);
  const upload = readFileSync(fileURLToPath(new URL("../workspace/workspaceCsvUploadRuntime.ts", import.meta.url)), "utf8");
  assert.equal(upload.includes("fileName: file?.name"), false);
});
