/**
 * NPA-T MANAGER-WORKSPACE-ISOLATION:4 — Legacy Runtime Container & Reference Repair.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  enableAutomaticMonitoring,
  getAutomaticMonitoringPolicy,
  resetAutomaticMonitoringRuntimeForTests,
} from "../data-reality/automaticMonitoringRuntime.ts";
import { resetProactiveAdvisorDeliveryForTests } from "../data-reality/proactiveAdvisorDelivery.ts";
import {
  commitPreparedCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { CSV_MVP_DEMO_INVENTORY_TEXT } from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import {
  persistDurableMonitoringRuntime,
  recoverDurableMonitoringRuntime,
  type NexoraDurableMonitoringStorage,
} from "../data-reality/durableMonitoringRuntime.ts";
import {
  createNexoraLiveConnection,
  type NexoraLiveConnection,
} from "../data-reality/liveDataConnectorFoundation.ts";
import {
  getNexoraLiveConnection,
  listNexoraLiveConnections,
  resetLiveDataConnectionStoreForTests,
  saveNexoraLiveConnection,
} from "../data-reality/liveDataConnectionStore.ts";
import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { nmiFoundationIdentity } from "../nmi/nmiIdentity.ts";
import { SCENE_ORG_EMPTY_DETAIL_CANONICAL_ID, emptySceneOrgDetailReference } from "../scene-org/sceneOrgDetailWorkspaceContract.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "../conversational-control/executiveContextSnapshot.ts";
import { updateNexoraExecutiveContext } from "../conversational-control/executiveContextUpdater.ts";
import {
  LEGACY_WORKSPACE_V1_CONTAINER,
  legacyWorkspaceContainerCanSelectManagerWorkspace,
  loadWorkspaceState,
} from "./workspacePersistence.ts";
import {
  applyCsvLegacyIdentityMigration,
  applyMonitoringLegacyIdentityMigration,
  managerLearningWorkspaceId,
  readManagerLiveConnections,
  readManagerMonitoringPolicies,
} from "./legacyWorkspaceIdentityMigration.ts";
import { bindWorkflowMode, createManagerWorkspace, readLiveExecutiveDataWorkspaceId, resolveActiveManagerWorkspace, type ManagerWorkspace } from "./managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID, isLegacyWorkflowWorkspaceIdentifier } from "./workspaceRegistryContract.ts";
import { getActiveWorkspaceId, resetWorkspaceRegistryForTests } from "./workspaceRegistryStore.ts";

const shellSource = readFileSync(new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url), "utf8");
const persistenceSource = readFileSync(new URL("./workspacePersistence.ts", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../../screens/HomeScreen.tsx", import.meta.url), "utf8");
const coordinatorSource = readFileSync(new URL("../../executive/nex-mvp/data/NexoraAutomaticMonitoringCoordinator.tsx", import.meta.url), "utf8");
const explorerSource = readFileSync(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url), "utf8");

class MemoryStorage implements NexoraDurableMonitoringStorage {
  readonly data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
}

function connection(workspaceId: string, connectionId: string): NexoraLiveConnection {
  return createNexoraLiveConnection({
    connectionId,
    workspaceId,
    providerId: "provider-mwi4",
    providerType: "generic-http",
    displayName: connectionId,
    capabilities: ["manual-fetch"],
    createdAt: "2026-10-12T12:00:00.000Z",
    configurationReference: "https://example.test/status",
    credentialReference: null,
  });
}

function commitNamedCsv(workspaceId: string, fileName: string, importId: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: CSV_MVP_DEMO_INVENTORY_TEXT.length,
    csvText: CSV_MVP_DEMO_INVENTORY_TEXT,
    importId,
    importedAt: "2026-10-12T12:00:00.000Z",
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-10-12T12:00:01.000Z",
  });
  assert.equal(result.committed, true, result.reason);
}

function requireCreatedWorkspace(input: {
  readonly name: string;
  readonly kind: "BUSINESS" | "PROJECT";
}): ManagerWorkspace {
  const workspace = createManagerWorkspace(input);
  if (workspace == null) throw new Error(`${input.name} was not created`);
  return workspace;
}

function resetRuntime() {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetLiveDataConnectionStoreForTests();
  resetAutomaticMonitoringRuntimeForTests();
  resetProactiveAdvisorDeliveryForTests();
}

test.beforeEach(resetRuntime);
test.afterEach(resetRuntime);

test("MWI:4 I1/I2/I3 two workspaces isolate monitoring, connections, and the dial", () => {
  saveNexoraLiveConnection(connection("overview", "conn-history"));
  enableAutomaticMonitoring({ workspaceId: "overview", connectionId: "conn-history", targetId: "target-history", frequency: "daily", enabledAt: "2026-10-12T12:00:00.000Z" });
  const business = requireCreatedWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const project = requireCreatedWorkspace({ name: "Factory Floor", kind: "PROJECT" });
  saveNexoraLiveConnection(connection(business.workspaceId, "conn-business"));
  saveNexoraLiveConnection(connection(project.workspaceId, "conn-project"));
  enableAutomaticMonitoring({ workspaceId: business.workspaceId, connectionId: "conn-business", targetId: "target-business", frequency: "daily", enabledAt: "2026-10-12T12:00:00.000Z" });
  enableAutomaticMonitoring({ workspaceId: project.workspaceId, connectionId: "conn-project", targetId: "target-project", frequency: "daily", enabledAt: "2026-10-12T12:00:00.000Z" });
  commitNamedCsv(business.workspaceId, "business.csv", "mwi4-business");
  commitNamedCsv(project.workspaceId, "project.csv", "mwi4-project");

  assert.deepEqual(listCsvRealDataImports(business.workspaceId).map((item) => item.importId), ["mwi4-business"]);
  assert.deepEqual(listCsvRealDataImports(project.workspaceId).map((item) => item.importId), ["mwi4-project"]);
  assert.deepEqual(readManagerLiveConnections(business.workspaceId).map((item) => item.connectionId), ["conn-business"]);
  assert.deepEqual(readManagerLiveConnections(project.workspaceId).map((item) => item.connectionId), ["conn-project"]);
  assert.deepEqual(readManagerMonitoringPolicies(business.workspaceId).map((item) => item.connectionId), ["conn-business"]);
  assert.deepEqual(readManagerMonitoringPolicies(project.workspaceId).map((item) => item.connectionId), ["conn-project"]);
  assert.deepEqual(readManagerLiveConnections("overview"), []);
  assert.deepEqual(readManagerMonitoringPolicies("decision"), []);
  assert.equal(listNexoraLiveConnections("overview").length, 1);

  for (const mode of ["overview", "decision", "execution"] as const) {
    bindWorkflowMode({ workspaceId: project.workspaceId, workflowMode: mode });
    assert.equal(readLiveExecutiveDataWorkspaceId(), project.workspaceId);
    assert.deepEqual(readManagerLiveConnections(project.workspaceId).map((item) => item.connectionId), ["conn-project"]);
    assert.deepEqual(readManagerLiveConnections(business.workspaceId).map((item) => item.connectionId), ["conn-business"]);
    assert.deepEqual(listCsvRealDataImports(business.workspaceId).map((item) => item.importId), ["mwi4-business"]);
    assert.deepEqual(listCsvRealDataImports(project.workspaceId).map((item) => item.importId), ["mwi4-project"]);
  }
});

test("MWI:4 I4/I5/I6 historical monitoring moves only with one explicit proof and stays idempotent", () => {
  const historical = {
    policies: [{ policyId: "pm2:policy:overview:conn-history", workspaceId: "overview", connectionId: "conn-history" }],
    runtimeStates: [{ policyId: "pm2:policy:overview:conn-history", workspaceId: "overview", connectionId: "conn-history" }],
    liveData: {
      connections: [{ workspaceId: "overview", connectionId: "conn-history", displayName: "History" }],
      observations: [{ workspaceId: "overview", connectionId: "conn-history", observationId: "obs-1", snapshot: { source: { identity: { workspaceId: "overview" } } } }],
    },
    advisorDelivery: { briefs: [{ workspaceId: "overview", briefId: "brief-1" }] },
  };
  const business = requireCreatedWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const project = requireCreatedWorkspace({ name: "Factory Floor", kind: "PROJECT" });
  const guessed = applyMonitoringLegacyIdentityMigration(historical, {
    activeWorkspaceId: business.workspaceId,
    proofs: [{ connectionId: "conn-history", targetWorkspaceId: business.workspaceId, basis: "active-workspace" }],
  });
  assert.equal(guessed.changed, false);
  assert.equal(guessed.state, historical);
  assert.equal(guessed.activeWorkspaceUsedAsEvidence, false);

  const conflict = applyMonitoringLegacyIdentityMigration(historical, {
    proofs: [
      { connectionId: "conn-history", targetWorkspaceId: business.workspaceId, basis: "explicit-source-link" },
      { connectionId: "conn-history", targetWorkspaceId: project.workspaceId, basis: "import-ownership" },
    ],
  });
  assert.equal(conflict.changed, false);
  assert.equal(conflict.state.liveData.connections[0]?.workspaceId, "overview");

  const moved = applyMonitoringLegacyIdentityMigration(historical, {
    activeWorkspaceId: project.workspaceId,
    proofs: [{ connectionId: "conn-history", targetWorkspaceId: business.workspaceId, basis: "explicit-source-link" }],
  });
  assert.equal(moved.changed, true);
  assert.equal(moved.state.liveData.connections[0]?.workspaceId, business.workspaceId);
  assert.equal(moved.state.liveData.connections[0]?.connectionId, "conn-history");
  assert.equal(moved.state.policies[0]?.policyId, "pm2:policy:overview:conn-history");
  assert.equal(moved.state.liveData.observations[0]?.observationId, "obs-1");
  assert.equal(moved.state.advisorDelivery.briefs[0]?.workspaceId, "overview");
  const second = applyMonitoringLegacyIdentityMigration(moved.state);
  assert.equal(second.changed, false);
  assert.equal(second.state, moved.state);
});

test("MWI:4 recover keeps ambiguous monitoring in place across two passes", () => {
  saveNexoraLiveConnection(connection("overview", "conn-history"));
  enableAutomaticMonitoring({ workspaceId: "overview", connectionId: "conn-history", targetId: "target-history", frequency: "daily", enabledAt: "2026-10-12T12:00:00.000Z" });
  const business = requireCreatedWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  saveNexoraLiveConnection(connection(business.workspaceId, "conn-business"));
  const storage = new MemoryStorage();
  const first = persistDurableMonitoringRuntime(storage, "2026-10-12T12:05:00.000Z");
  resetLiveDataConnectionStoreForTests();
  resetAutomaticMonitoringRuntimeForTests();
  recoverDurableMonitoringRuntime(storage, "2026-10-12T12:06:00.000Z");
  assert.equal(listNexoraLiveConnections("overview")[0]?.connectionId, "conn-history");
  assert.equal(getAutomaticMonitoringPolicy("overview", "conn-history")?.connectionId, "conn-history");
  assert.deepEqual(readManagerLiveConnections(business.workspaceId).map((item) => item.connectionId), ["conn-business"]);
  const secondStorage = new MemoryStorage();
  const second = persistDurableMonitoringRuntime(secondStorage, "2026-10-12T12:07:00.000Z");
  assert.deepEqual(
    second.liveData.connections.map((item) => item.connectionId).sort(),
    first.liveData.connections.map((item) => item.connectionId).sort(),
  );
  resetLiveDataConnectionStoreForTests();
  resetAutomaticMonitoringRuntimeForTests();
  recoverDurableMonitoringRuntime(secondStorage, "2026-10-12T12:08:00.000Z");
  assert.equal(listNexoraLiveConnections("overview").length, 1);
  assert.equal(readManagerLiveConnections(business.workspaceId).length, 1);
});

test("MWI:4 new monitoring truth cannot be written under a workflow key", () => {
  createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  saveNexoraLiveConnection(connection("decision", "conn-new"));
  enableAutomaticMonitoring({ workspaceId: "decision", connectionId: "conn-new", targetId: "target-new", frequency: "hourly", enabledAt: "2026-10-12T12:00:00.000Z" });
  assert.equal(getNexoraLiveConnection("decision", "conn-new"), null);
  assert.equal(getAutomaticMonitoringPolicy("decision", "conn-new"), null);
});

test("MWI:4 I7/I8 nexora.workspace.v1 cannot select a Manager Workspace", () => {
  const business = requireCreatedWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const loaded = loadWorkspaceState();
  assert.equal(loaded, null);
  assert.equal(getActiveWorkspaceId(), business.workspaceId);
  assert.equal(legacyWorkspaceContainerCanSelectManagerWorkspace(), false);
  assert.equal(LEGACY_WORKSPACE_V1_CONTAINER.classification, "OBSOLETE_CONTAINER");
  assert.equal(LEGACY_WORKSPACE_V1_CONTAINER.overridesActiveWorkspaceId, false);
  assert.equal(LEGACY_WORKSPACE_V1_CONTAINER.redirectsDataReality, false);
  assert.equal(LEGACY_WORKSPACE_V1_CONTAINER.redirectsMonitoring, false);
  assert.equal(LEGACY_WORKSPACE_V1_CONTAINER.redirectsLearning, false);
  assert.equal(LEGACY_WORKSPACE_V1_CONTAINER.changesConversationManagerWorkspaceId, false);
  assert.doesNotMatch(persistenceSource, /from ["'][^"']*workspaceRegistryStore/);
  assert.doesNotMatch(homeSource, /loadWorkspaceState\(/);
  assert.doesNotMatch(homeSource, /setActiveWorkspace\(/);
  assert.match(coordinatorSource, /readManagerLiveConnections/);
  assert.match(explorerSource, /readManagerLiveConnections/);
  assert.equal(resolveActiveManagerWorkspace().managerWorkspace?.workspaceId, business.workspaceId);
});

test("MWI:4 I9/I10 empty Detail is a placeholder and Saved Scene authority stays in place", () => {
  const empty = emptySceneOrgDetailReference();
  assert.equal(empty.canonicalId, SCENE_ORG_EMPTY_DETAIL_CANONICAL_ID);
  assert.equal(isLegacyWorkflowWorkspaceIdentifier(empty.canonicalId), false);
  assert.equal(empty.kind, "collection");
  assert.doesNotMatch(shellSource, /detailSourceId \?\? interaction\.workspace/);
  assert.match(shellSource, /emptySceneOrgDetailReference\(\)/);
  assert.match(shellSource, /applySceneOrgSavedSceneCollectionMutation/);
  assert.match(shellSource, /persistSceneOrgSavedScenes/);
  assert.match(shellSource, /loadSceneOrgSavedScenes/);
});

test("MWI:4 I11/I12 prior CSV isolation and NMI authority remain", () => {
  commitNamedCsv("overview", "delivery.csv", "mwi4-ambiguous");
  const business = requireCreatedWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const migrated = applyCsvLegacyIdentityMigration({
    committed: listCsvRealDataImports("overview"),
    pending: [],
    removed: [],
  }, { activeWorkspaceId: business.workspaceId });
  assert.equal(migrated.changed, false);
  assert.equal(migrated.state.committed[0]?.workspaceId, "overview");
  assert.equal(managerLearningWorkspaceId("decision"), "nexora-mvp");
  assert.equal(managerLearningWorkspaceId(business.workspaceId), business.workspaceId);
  const context = updateNexoraExecutiveContext({
    previousContext: createEmptyNexoraExecutiveContextSnapshot({
      currentWorkspaceId: "overview",
      managerWorkspaceId: business.workspaceId,
    }),
    trustedSuccess: true,
    runtimeWorkspaceId: "execution",
  });
  assert.equal(context.nextContext.managerWorkspaceId, business.workspaceId);
  assert.equal(context.nextContext.currentWorkspaceId, "execution");
  assert.equal(DEMO_WORKSPACE_ID, "demo_workspace");
  assert.equal(nmiFoundationIdentity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.businessProjectContext, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
});
