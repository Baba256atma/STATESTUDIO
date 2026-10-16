import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import { saveApprovalWorkflowEnvelope } from "../approval/approvalWorkflowStore.ts";
import { saveCollaborationEnvelope } from "../collaboration/collaborationStore.ts";
import { appendDecisionMemoryEntry } from "../decision/memory/decisionMemoryStore.ts";
import { DURABLE_MONITORING_STORAGE_KEY } from "../data-reality/durableMonitoringRuntime.ts";
import {
  commitPreparedCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { CSV_MVP_DEMO_INVENTORY_FILE } from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { openManufacturingDemo, readActiveDemoProfile, resetDemoProfileForTests } from "../demo-profile/demoProfileStore.ts";
import { MANUFACTURING_DEMO_INVENTORY_TEXT } from "../demo-profile/manufacturingDemoPackage.ts";
import { createSceneOrgCanonicalReference } from "../scene-org/sceneOrgRegionContract.ts";
import { persistSceneOrgSavedScenes } from "../scene-org/sceneOrgSavedSceneDurability.ts";
import { createSceneOrgSavedScene } from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import { resolveLiveExecutiveDataWorkspace } from "./managerWorkspaceIdentity.ts";
import { createManagerWorkspaceFromEntry, selectManagerWorkspaceEntry } from "./managerWorkspaceEntry.ts";
import { saveActiveManagerWorkspace } from "./managerWorkspaceSave.ts";
import { DEMO_WORKSPACE_ID, LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS } from "./workspaceRegistryContract.ts";
import {
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  getActiveWorkspaceId,
  getWorkspaceById,
  recoverWorkspaceRegistryFromStorage,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";

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
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: localStorage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage, sessionStorage: localStorage, dispatchEvent() {} },
  });
  return localStorage;
}

function removeStorage() {
  delete (globalThis as { localStorage?: unknown }).localStorage;
  delete (globalThis as { window?: unknown }).window;
}

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
});

afterEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  removeStorage();
});

function commitOwnedCsv(workspaceId: string, fileName: string, importId: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: MANUFACTURING_DEMO_INVENTORY_TEXT.length,
    csvText: MANUFACTURING_DEMO_INVENTORY_TEXT,
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
}

function reloadRegistry() {
  const raw = (globalThis as { localStorage: Storage }).localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY);
  assert.ok(raw);
  resetWorkspaceRegistryForTests();
  (globalThis as { localStorage: Storage }).localStorage.setItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY, raw);
  return recoverWorkspaceRegistryFromStorage().activeWorkspaceId;
}

test("save verifies a Company and recovers the same id, name, and kind", () => {
  installStorage();
  const company = createManagerWorkspaceFromEntry({ name: "Recovery Test Company", kind: "BUSINESS" });
  assert.ok(company);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", "manager-stock");
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-company",
    name: "scene-company",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: company.workspaceId,
    canonicalReferences: [
      createSceneOrgCanonicalReference({
        canonicalId: "obj-capacity",
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    ],
    layout: {
      presentationDepth: "report",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
  });
  assert.equal(persistSceneOrgSavedScenes([scene]).persisted, true);
  appendDecisionMemoryEntry({
    workspaceId: company.workspaceId,
    projectId: "default_project",
    entry: { id: "mem-company", created_at: 1, workspace_id: company.workspaceId, title: "Company note", source: "manual" },
  });
  saveApprovalWorkflowEnvelope({
    workspaceId: company.workspaceId,
    projectId: "default_project",
    decisionId: "decision-a",
    envelope: { workflow: { id: "company" }, audit_events: [], trust_provenance: [] } as never,
  });
  saveCollaborationEnvelope({
    workspaceId: company.workspaceId,
    projectId: "default_project",
    decisionId: "decision-a",
    envelope: { inputs: [], audit_events: [], trust_provenance: [], updated_at: 1 },
  });
  (globalThis as { localStorage: Storage }).localStorage.setItem(
    DURABLE_MONITORING_STORAGE_KEY,
    JSON.stringify({ policies: [{ policyId: "policy-company", workspaceId: company.workspaceId }] }),
  );
  const first = saveActiveManagerWorkspace();
  assert.equal(first.status, "saved");
  assert.equal(first.workspaceId, company.workspaceId);
  assert.equal(first.workspaceKind, "BUSINESS");
  assert.equal(first.workspaceName, "Recovery Test Company");
  assert.deepEqual(first.csvImports, [{ importId: "manager-stock", fileName: "manager-stock.csv", workspaceId: company.workspaceId }]);
  assert.ok(first.persisted.includes("workspace-registry"));
  assert.ok(first.persisted.includes("csv-imports"));
  assert.ok(first.persisted.includes("saved-scenes"));
  assert.ok(first.persisted.includes("decision-memory"));
  assert.ok(first.persisted.includes("approval"));
  assert.ok(first.persisted.includes("collaboration"));
  assert.ok(first.persisted.includes("monitoring"));
  assert.ok(first.unsupported.includes("decision-session"));
  assert.ok(first.unsupported.includes("execution-session"));
  assert.ok(first.unsupported.includes("outcome-registry"));
  const again = saveActiveManagerWorkspace();
  assert.equal(listCsvRealDataImports(company.workspaceId).length, 1);
  assert.equal(again.csvImports[0]?.importId, "manager-stock");
  assert.equal(reloadRegistry(), company.workspaceId);
  const recovered = getWorkspaceById(company.workspaceId);
  assert.equal(recovered?.workspaceName, "Recovery Test Company");
  assert.equal(recovered?.kind, "BUSINESS");
  assert.equal(resolveLiveExecutiveDataWorkspace().demoBootstrapPermitted, false);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE), false);
});

test("a Project recovers its own identity and stays isolated from the Company", () => {
  installStorage();
  const company = createManagerWorkspaceFromEntry({ name: "Company A", kind: "BUSINESS" });
  const project = createManagerWorkspaceFromEntry({ name: "Recovery Test Project", kind: "PROJECT" });
  assert.ok(company && project);
  setActiveWorkspace(company.workspaceId);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", "manager-stock");
  setActiveWorkspace(project.workspaceId);
  commitOwnedCsv(project.workspaceId, "project-control.csv", "project-control");
  const saved = saveActiveManagerWorkspace();
  assert.equal(saved.status, "saved");
  assert.equal(saved.workspaceKind, "PROJECT");
  assert.equal(saved.workspaceName, "Recovery Test Project");
  assert.deepEqual(saved.csvImports.map((entry) => entry.fileName), ["project-control.csv"]);
  assert.equal(reloadRegistry(), project.workspaceId);
  assert.equal(getWorkspaceById(project.workspaceId)?.kind, "PROJECT");
  assert.equal(selectManagerWorkspaceEntry(company.workspaceId), true);
  assert.deepEqual(listCsvRealDataImports(company.workspaceId).map((entry) => entry.importId), ["manager-stock"]);
  assert.deepEqual(listCsvRealDataImports(project.workspaceId).map((entry) => entry.importId), ["project-control"]);
  const companySave = saveActiveManagerWorkspace();
  assert.equal(companySave.workspaceId, company.workspaceId);
  assert.deepEqual(companySave.csvImports.map((entry) => entry.importId), ["manager-stock"]);
});

test("Demo and workflow ids cannot be saved as a Manager Workspace", () => {
  installStorage();
  const before = (globalThis as { localStorage: Storage }).localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY);
  const demo = saveActiveManagerWorkspace();
  assert.equal(demo.status, "refused");
  assert.equal(demo.reason, "not_manager_workspace");
  assert.equal(demo.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal((globalThis as { localStorage: Storage }).localStorage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY), before);
  openManufacturingDemo();
  assert.equal(saveActiveManagerWorkspace().status, "refused");
  assert.equal(readActiveDemoProfile(), "manufacturing");
  for (const mode of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    setActiveWorkspace(mode);
    assert.notEqual(getActiveWorkspaceId(), mode);
  }
  assert.equal(saveActiveManagerWorkspace().reason, "not_manager_workspace");
  const source = readFileSync(fileURLToPath(new URL("./managerWorkspaceSave.ts", import.meta.url)), "utf8");
  assert.match(source, /isLegacyWorkflowWorkspaceIdentifier/);
  assert.equal(source.includes("savedWorkspaceStore"), false);
  assert.equal(source.includes("commitPreparedCsvRealDataImport"), false);
  const control = readFileSync(fileURLToPath(new URL("../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx", import.meta.url)), "utf8");
  assert.match(control, /saveActiveManagerWorkspace\(\)/);
  assert.match(control, /data-testid="manager-workspace-saved"/);
  assert.doesNotMatch(control, /Save My Workspace/);
  const shell = readFileSync(fileURLToPath(new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url)), "utf8");
  assert.match(shell, /managerWorkspaceProjectionReady &&/);
  assert.match(shell, /useLayoutEffect\(\(\) => \{\n\s+if \(hostedManagerRegistryRecovery\(deploymentMode\) === "contain"\) return;\n\s+recoverWorkspaceRegistryFromStorage\(\);/);
  const recoverAt = shell.indexOf("recoverWorkspaceRegistryFromStorage();");
  const bootstrapAt = shell.indexOf("ensureCsvMvpDemoBootstrap({");
  assert.ok(recoverAt >= 0 && recoverAt < bootstrapAt);
  assert.match(shell, /isRealManagerWorkspaceId\(binding\.workspaceId\)/);
});
