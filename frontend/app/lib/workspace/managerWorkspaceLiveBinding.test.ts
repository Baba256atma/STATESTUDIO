/**
 * NPA-T MWI:2 — live executive data binding invariants I1–I8.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import { createCsvDurableSnapshot } from "../data-reality/csvRealDataImportDurability.ts";
import {
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_INVENTORY_TEXT,
  ensureCsvMvpDemoBootstrap,
} from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  commitPreparedCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { NEXORA_MVP_WORKSPACE_KINDS } from "../nex-mvp/nexoraMVPApplicationFoundation.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "../nmi/nmiContract.ts";
import {
  DEMO_WORKSPACE_ID,
  LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS,
} from "./workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import {
  acceptNewManagerPersistenceWorkspaceId,
  bindWorkflowMode,
  createManagerWorkspace,
  MANAGER_WORKSPACE_AUTHORITY,
  readLiveExecutiveDataWorkspaceId,
  resolveLiveExecutiveDataWorkspace,
} from "./managerWorkspaceIdentity.ts";

const SHELL = new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url);

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
});

test.afterEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
});

test("I1 I2 I8 — live data workspace follows the registry, not the dial", () => {
  const shell = readFileSync(SHELL, "utf8");
  assert.match(shell, /readLiveExecutiveDataWorkspaceId/);
  assert.match(shell, /resolveLiveExecutiveDataWorkspace/);
  assert.match(shell, /workspaceId=\{dataWorkspaceId\}/);
  assert.match(shell, /listCsvRealDataImports\(dataWorkspaceId\)/);
  assert.doesNotMatch(shell, /ensureCsvMvpDemoBootstrap\(\{\s*workspaceId:\s*application\.workspace/);
  assert.match(shell, /data-active-workspace=\{application\.workspace\}/);
  assert.match(shell, /activeWorkspace=\{application\.workspace\}/);
  assert.deepEqual([...NEXORA_MVP_WORKSPACE_KINDS], [...LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS]);

  const created = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(created);
  const workspaceId = readLiveExecutiveDataWorkspaceId();
  assert.equal(workspaceId, created.workspaceId);
  assert.equal(workspaceId, getActiveWorkspaceId());

  for (const workflowMode of NEXORA_MVP_WORKSPACE_KINDS) {
    bindWorkflowMode({ workspaceId, workflowMode });
    setActiveWorkspace(workflowMode);
    assert.equal(readLiveExecutiveDataWorkspaceId(), workspaceId);
    assert.equal(getActiveWorkspaceId(), workspaceId);
  }
});

test("I3 I4 — two manager workspaces isolate CSV data and reject workflow keys", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion Project", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);

  const bahaImport = commitInventory(baha.workspaceId, "baha-inventory.csv", CSV_MVP_DEMO_INVENTORY_TEXT);
  const factoryText = CSV_MVP_DEMO_INVENTORY_TEXT.replace("80", "11");
  const factoryImport = commitInventory(factory.workspaceId, "factory-inventory.csv", factoryText);
  assert.equal(bahaImport.workspaceId, baha.workspaceId);
  assert.equal(factoryImport.workspaceId, factory.workspaceId);
  assert.notEqual(baha.workspaceId, factory.workspaceId);

  assert.deepEqual(
    listCsvRealDataImports(baha.workspaceId).map((entry) => entry.prepared.fileName),
    ["baha-inventory.csv"],
  );
  assert.deepEqual(
    listCsvRealDataImports(factory.workspaceId).map((entry) => entry.prepared.fileName),
    ["factory-inventory.csv"],
  );

  for (const workflowMode of NEXORA_MVP_WORKSPACE_KINDS) {
    setActiveWorkspace(baha.workspaceId);
    bindWorkflowMode({ workspaceId: baha.workspaceId, workflowMode });
    assert.equal(readLiveExecutiveDataWorkspaceId(), baha.workspaceId);
    assert.equal(listCsvRealDataImports(baha.workspaceId).length, 1);
    assert.equal(listCsvRealDataImports(factory.workspaceId).length, 1);
  }

  const refused = prepareCsvRealDataImport({
    workspaceId: "decision",
    fileName: "should-not-land.csv",
    fileSize: factoryText.length,
    csvText: factoryText,
    importId: "mwi2-decision",
    importedAt: "2026-10-12T00:00:00.000Z",
  });
  assert.equal(refused.ready, true);
  const refusal = commitPreparedCsvRealDataImport({
    prepared: refused,
    expectedWorkspaceId: "decision",
    mode: "new",
    committedAt: "2026-10-12T00:00:01.000Z",
  });
  assert.equal(refusal.committed, false);
  assert.equal(refusal.reason, "refused_workflow_key");
  assert.equal(listCsvRealDataImports("decision").length, 0);
  for (const identifier of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    assert.equal(acceptNewManagerPersistenceWorkspaceId(identifier), false);
  }

  const snapshot = createCsvDurableSnapshot("2026-10-12T00:02:00.000Z");
  const persistedIds = snapshot.committed.map((entry) => entry.workspaceId);
  assert.ok(persistedIds.includes(baha.workspaceId));
  assert.ok(persistedIds.includes(factory.workspaceId));
  for (const identifier of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    assert.equal(persistedIds.includes(identifier), false);
  }
});

test("I5 — demo bootstrap cannot write into a real manager workspace", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(baha);
  const refused = ensureCsvMvpDemoBootstrap({ workspaceId: baha.workspaceId });
  assert.equal(refused.refused, true);
  assert.equal(refused.refusalReason, "manager_workspace");
  assert.equal(refused.inventorySeeded, false);
  assert.equal(listCsvRealDataImports(baha.workspaceId).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE), false);

  setActiveWorkspace(DEMO_WORKSPACE_ID);
  const demo = ensureCsvMvpDemoBootstrap({ workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(demo.refused, false);
  assert.equal(demo.inventorySeeded, true);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).length > 0, true);
  assert.equal(listCsvRealDataImports(baha.workspaceId).length, 0);
  assert.equal(resolveLiveExecutiveDataWorkspace().demoBootstrapPermitted, true);
  assert.equal(resolveLiveExecutiveDataWorkspace().workspaceId, DEMO_WORKSPACE_ID);

  setActiveWorkspace(baha.workspaceId);
  assert.equal(resolveLiveExecutiveDataWorkspace().demoBootstrapPermitted, false);
  assert.equal(resolveLiveExecutiveDataWorkspace().workspaceId, baha.workspaceId);
});

test("I6 I7 — one registry authority and NMI/BCA stay in place", () => {
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.parallelWorkspaceStore, false);
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.activeWorkspaceOwner, "workspaceRegistryStore.getActiveWorkspaceId");
  assert.equal(readLiveExecutiveDataWorkspaceId(), getActiveWorkspaceId());
  assert.equal(NMI_FOUNDATION_CONTRACT.ownsUnifiedManagementModelContracts, true);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.businessProjectContext, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.replacesNmiUnifiedCompanyProject, false);
});

function commitInventory(workspaceId: string, fileName: string, csvText: string) {
  const previous = getActiveWorkspaceId();
  setActiveWorkspace(workspaceId);
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `mwi2:${workspaceId}:${fileName}`,
    importedAt: "2026-10-12T00:00:00.000Z",
  });
  assert.equal(prepared.ready, true);
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-10-12T00:00:00.000Z",
  });
  assert.equal(result.committed, true, result.reason);
  assert.ok(result.current);
  if (previous && previous !== workspaceId) setActiveWorkspace(previous);
  return result.current;
}
