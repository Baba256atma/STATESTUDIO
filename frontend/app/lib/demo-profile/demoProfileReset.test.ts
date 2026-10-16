import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { saveApprovalWorkflowEnvelope } from "../approval/approvalWorkflowStore.ts";
import { saveCollaborationEnvelope } from "../collaboration/collaborationStore.ts";
import { appendDecisionMemoryEntry } from "../decision/memory/decisionMemoryStore.ts";
import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes.ts";
import {
  enableAutomaticMonitoring,
  listAutomaticMonitoringPolicies,
  resetAutomaticMonitoringRuntimeForTests,
} from "../data-reality/automaticMonitoringRuntime.ts";
import { CSV_MVP_DEMO_INVENTORY_FILE } from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  commitPreparedCsvRealDataImport,
  listCsvImportCandidates,
  listCsvRealDataImports,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { DURABLE_MONITORING_STORAGE_KEY } from "../data-reality/durableMonitoringRuntime.ts";
import { collectNexoraLivePrioritySources } from "../nex-mvp/nexoraLiveEpistemicProjection.ts";
import {
  loadSceneOrgSavedScenes,
  persistSceneOrgSavedScenes,
} from "../scene-org/sceneOrgSavedSceneDurability.ts";
import { createSceneOrgCanonicalReference } from "../scene-org/sceneOrgRegionContract.ts";
import { createSceneOrgSavedScene } from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import type { DemoResetStorage } from "./demoProfileReset.ts";
import { resetActiveDemo } from "./demoProfileReset.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  readActiveDemoProfile,
  resetDemoProfileForTests,
} from "./demoProfileStore.ts";
import {
  MANUFACTURING_DEMO_INVENTORY_FILE,
  MANUFACTURING_DEMO_INVENTORY_TEXT,
  MANUFACTURING_DEMO_ORDERS_FILE,
  MANUFACTURING_DEMO_ORDERS_TEXT,
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

class MemoryStorage implements DemoResetStorage {
  private readonly items = new Map<string, string>();

  get length(): number {
    return this.items.size;
  }

  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }
}

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetAutomaticMonitoringRuntimeForTests();
});

function names(profileId: "manufacturing" | "project") {
  return listCsvRealDataImports(DEMO_WORKSPACE_ID)
    .filter((entry) => entry.importId.startsWith(`demo-profile:${profileId}:`))
    .map((entry) => entry.prepared.fileName)
    .sort();
}

function fact(fileName: string, metricKey: string): number | undefined {
  const entry = listCsvRealDataImports(DEMO_WORKSPACE_ID).find((item) => item.prepared.fileName === fileName);
  return entry?.prepared.handoff?.dataset.records.find((record) => record.metricKey === metricKey)?.value;
}

function commitOwnedCsv(workspaceId: string, fileName: string, importId: string, csvText: string) {
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
}

function fingerprint(workspaceId: string) {
  return listCsvRealDataImports(workspaceId).map((entry) => ({
    importId: entry.importId,
    fileName: entry.prepared.fileName,
    workspaceId: entry.workspaceId,
    rows: entry.prepared.parse.records.map((record) => record.values),
  }));
}

function memoryEntry(id: string, workspaceId: string): DecisionMemoryEntry {
  return {
    id,
    created_at: 1,
    workspace_id: workspaceId,
    title: id,
    source: "manual",
  };
}

function scene(sceneId: string, owner?: string) {
  return createSceneOrgSavedScene({
    sceneId,
    name: sceneId,
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: owner,
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
}

function mutateManufacturing() {
  const orders = listCsvRealDataImports(DEMO_WORKSPACE_ID).find(
    (entry) => entry.prepared.fileName === MANUFACTURING_DEMO_ORDERS_FILE,
  );
  assert.ok(orders);
  assert.equal(
    removeCsvRealDataImport({
      workspaceId: DEMO_WORKSPACE_ID,
      sourceContextId: orders.sourceContextId,
      activeSourceContextId: orders.sourceContextId,
      confirmedActiveRemoval: true,
    }).removed,
    true,
  );
  commitOwnedCsv(
    DEMO_WORKSPACE_ID,
    "experiment.csv",
    `demo-profile:manufacturing:${DEMO_WORKSPACE_ID}:experiment.csv`,
    MANUFACTURING_DEMO_ORDERS_TEXT,
  );
  const saved = saveCsvImportCandidate({
    workspaceId: DEMO_WORKSPACE_ID,
    candidateId: `csv:${DEMO_WORKSPACE_ID}:pending-note.csv`,
    fileName: "pending-note.csv",
    status: "preview",
    input: {
      workspaceId: DEMO_WORKSPACE_ID,
      fileName: "pending-note.csv",
      fileSize: 4,
      csvText: "a,b\n",
      importId: `demo-profile:manufacturing:${DEMO_WORKSPACE_ID}:pending-note.csv`,
      importedAt: "2026-08-31T00:00:00.000Z",
    },
    parse: null,
    mapping: null,
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  });
  assert.equal(saved.saved, true);
}

test("Reset Demo refuses a Company, a real Project, and an unselected Demo", () => {
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company);
  assert.ok(expansion);
  setActiveWorkspace(company.workspaceId);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", `manager:${company.workspaceId}:manager-stock.csv`, MANUFACTURING_DEMO_INVENTORY_TEXT);
  setActiveWorkspace(expansion.workspaceId);
  commitOwnedCsv(expansion.workspaceId, "project-control.csv", `manager:${expansion.workspaceId}:project-control.csv`, MANUFACTURING_DEMO_INVENTORY_TEXT);
  const companyBefore = fingerprint(company.workspaceId);
  const projectBefore = fingerprint(expansion.workspaceId);
  setActiveWorkspace(company.workspaceId);
  const companyReset = resetActiveDemo();
  assert.equal(companyReset.status, "refused");
  assert.equal(companyReset.reason, "not_demo_workspace");
  setActiveWorkspace(expansion.workspaceId);
  const projectReset = resetActiveDemo();
  assert.equal(projectReset.status, "refused");
  assert.equal(projectReset.reason, "not_demo_workspace");
  assert.deepEqual(fingerprint(company.workspaceId), companyBefore);
  assert.deepEqual(fingerprint(expansion.workspaceId), projectBefore);
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  const unselected = resetActiveDemo();
  assert.equal(unselected.status, "refused");
  assert.equal(unselected.reason, "no_modern_profile");
  assert.equal(unselected.removed.csvImportIds.length, 0);
});

test("Manufacturing reset restores the certified baseline and stays on Manufacturing", () => {
  openManufacturingDemo();
  assert.deepEqual(names("manufacturing"), [
    MANUFACTURING_DEMO_INVENTORY_FILE,
    MANUFACTURING_DEMO_ORDERS_FILE,
    MANUFACTURING_DEMO_PRODUCTION_FILE,
  ].sort());
  mutateManufacturing();
  assert.equal(names("manufacturing").includes("experiment.csv"), true);
  assert.equal(names("manufacturing").includes(MANUFACTURING_DEMO_ORDERS_FILE), false);
  assert.equal(listCsvImportCandidates(DEMO_WORKSPACE_ID).length, 1);
  const first = resetActiveDemo();
  assert.equal(first.status, "reset");
  assert.equal(first.profileId, "manufacturing");
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.deepEqual(names("manufacturing"), [
    MANUFACTURING_DEMO_INVENTORY_FILE,
    MANUFACTURING_DEMO_ORDERS_FILE,
    MANUFACTURING_DEMO_PRODUCTION_FILE,
  ].sort());
  assert.equal(names("project").length, 0);
  assert.equal(fact(MANUFACTURING_DEMO_ORDERS_FILE, "ordersReceived"), 1230);
  assert.equal(fact(MANUFACTURING_DEMO_PRODUCTION_FILE, "usedCapacity"), 980);
  assert.equal(fact(MANUFACTURING_DEMO_INVENTORY_FILE, "onHand"), 320);
  assert.equal(listCsvImportCandidates(DEMO_WORKSPACE_ID).length, 0);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE),
    false,
  );
  const second = resetActiveDemo();
  assert.equal(second.status, "reset");
  assert.equal(second.profileId, "manufacturing");
  assert.deepEqual(names("manufacturing"), [
    MANUFACTURING_DEMO_INVENTORY_FILE,
    MANUFACTURING_DEMO_ORDERS_FILE,
    MANUFACTURING_DEMO_PRODUCTION_FILE,
  ].sort());
  assert.equal(fact(MANUFACTURING_DEMO_ORDERS_FILE, "ordersReceived"), 1230);
});

test("Project reset restores the certified baseline and stays on Project", () => {
  openProjectDemo();
  const schedule = listCsvRealDataImports(DEMO_WORKSPACE_ID).find(
    (entry) => entry.prepared.fileName === PROJECT_DEMO_SCHEDULE_FILE,
  );
  assert.ok(schedule);
  assert.equal(
    removeCsvRealDataImport({
      workspaceId: DEMO_WORKSPACE_ID,
      sourceContextId: schedule.sourceContextId,
      activeSourceContextId: schedule.sourceContextId,
      confirmedActiveRemoval: true,
    }).removed,
    true,
  );
  commitOwnedCsv(
    DEMO_WORKSPACE_ID,
    "experiment.csv",
    `demo-profile:project:${DEMO_WORKSPACE_ID}:experiment.csv`,
    MANUFACTURING_DEMO_ORDERS_TEXT,
  );
  const first = resetActiveDemo();
  assert.equal(first.status, "reset");
  assert.equal(first.profileId, "project");
  assert.equal(readActiveDemoProfile(), "project");
  assert.deepEqual(names("project"), [
    PROJECT_DEMO_PROGRESS_FILE,
    PROJECT_DEMO_RESOURCES_FILE,
    PROJECT_DEMO_SCHEDULE_FILE,
  ].sort());
  assert.equal(names("manufacturing").length, 0);
  assert.equal(fact(PROJECT_DEMO_PROGRESS_FILE, "plannedProgress"), 0.84);
  assert.equal(fact(PROJECT_DEMO_PROGRESS_FILE, "actualProgress"), 0.68);
  assert.equal(fact(PROJECT_DEMO_RESOURCES_FILE, "resourceLoad"), 11);
  assert.equal(fact(PROJECT_DEMO_SCHEDULE_FILE, "scheduleVarianceDays"), 9);
  const second = resetActiveDemo();
  assert.equal(second.status, "reset");
  assert.deepEqual(names("project"), [
    PROJECT_DEMO_PROGRESS_FILE,
    PROJECT_DEMO_RESOURCES_FILE,
    PROJECT_DEMO_SCHEDULE_FILE,
  ].sort());
});

test("reset then switch then reset returns each profile to its own baseline", () => {
  openManufacturingDemo();
  mutateManufacturing();
  assert.equal(resetActiveDemo().profileId, "manufacturing");
  assert.equal(readActiveDemoProfile(), "manufacturing");
  openProjectDemo();
  assert.equal(readActiveDemoProfile(), "project");
  assert.equal(names("manufacturing").length, 0);
  const schedule = listCsvRealDataImports(DEMO_WORKSPACE_ID).find(
    (entry) => entry.prepared.fileName === PROJECT_DEMO_SCHEDULE_FILE,
  );
  assert.ok(schedule);
  removeCsvRealDataImport({
    workspaceId: DEMO_WORKSPACE_ID,
    sourceContextId: schedule.sourceContextId,
    activeSourceContextId: schedule.sourceContextId,
    confirmedActiveRemoval: true,
  });
  assert.equal(resetActiveDemo().profileId, "project");
  assert.equal(fact(PROJECT_DEMO_SCHEDULE_FILE, "scheduleVarianceDays"), 9);
  openManufacturingDemo();
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(names("project").length, 0);
  assert.equal(fact(MANUFACTURING_DEMO_ORDERS_FILE, "ordersReceived"), 1230);
  assert.equal(fact(MANUFACTURING_DEMO_PRODUCTION_FILE, "usedCapacity"), 980);
  assert.equal(fact(MANUFACTURING_DEMO_INVENTORY_FILE, "onHand"), 320);
});

test("manager CSV, decisions, executions, learning, scenes, approval, collaboration, and monitoring survive reset", () => {
  const company = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company);
  assert.ok(expansion);
  setActiveWorkspace(company.workspaceId);
  commitOwnedCsv(company.workspaceId, "manager-stock.csv", `manager:${company.workspaceId}:manager-stock.csv`, MANUFACTURING_DEMO_INVENTORY_TEXT);
  setActiveWorkspace(expansion.workspaceId);
  commitOwnedCsv(expansion.workspaceId, "project-control.csv", `manager:${expansion.workspaceId}:project-control.csv`, MANUFACTURING_DEMO_INVENTORY_TEXT);
  const storage = new MemoryStorage();
  const session = new MemoryStorage();
  saveApprovalWorkflowEnvelope({
    workspaceId: company.workspaceId,
    projectId: "default_project",
    decisionId: "decision-a",
    envelope: { workflow: { id: "company" }, audit_events: [], trust_provenance: [] } as never,
    storage,
  });
  saveApprovalWorkflowEnvelope({
    workspaceId: DEMO_WORKSPACE_ID,
    projectId: "default_project",
    decisionId: "decision-demo",
    envelope: { workflow: { id: "demo" }, audit_events: [], trust_provenance: [] } as never,
    storage,
  });
  saveCollaborationEnvelope({
    workspaceId: expansion.workspaceId,
    projectId: "default_project",
    decisionId: "decision-a",
    envelope: { inputs: [], audit_events: [], trust_provenance: [], updated_at: 1 },
    storage,
  });
  saveCollaborationEnvelope({
    workspaceId: DEMO_WORKSPACE_ID,
    projectId: "default_project",
    decisionId: "decision-demo",
    envelope: { inputs: [], audit_events: [], trust_provenance: [], updated_at: 1 },
    storage,
  });
  appendDecisionMemoryEntry({
    workspaceId: company.workspaceId,
    projectId: "default_project",
    entry: memoryEntry("memory-company", company.workspaceId),
    storage,
  });
  appendDecisionMemoryEntry({
    workspaceId: DEMO_WORKSPACE_ID,
    projectId: "default_project",
    entry: memoryEntry("memory-demo", DEMO_WORKSPACE_ID),
    storage,
  });
  persistSceneOrgSavedScenes([
    scene("scene-company", company.workspaceId),
    scene("scene-project", expansion.workspaceId),
    scene("scene-demo", DEMO_WORKSPACE_ID),
    scene("scene-unassigned"),
  ], storage);
  storage.setItem(DURABLE_MONITORING_STORAGE_KEY, JSON.stringify({
    policies: [
      { policyId: "policy-demo", workspaceId: DEMO_WORKSPACE_ID },
      { policyId: "policy-company", workspaceId: company.workspaceId },
    ],
    runtimeStates: [
      { policyId: "policy-demo", workspaceId: DEMO_WORKSPACE_ID },
      { policyId: "policy-company", workspaceId: company.workspaceId },
    ],
    liveData: {
      connections: [{ workspaceId: DEMO_WORKSPACE_ID }, { workspaceId: expansion.workspaceId }],
      observations: [{ workspaceId: DEMO_WORKSPACE_ID }, { workspaceId: company.workspaceId }],
    },
  }));
  enableAutomaticMonitoring({
    workspaceId: DEMO_WORKSPACE_ID,
    connectionId: "demo-connection",
    targetId: "orders",
    frequency: "daily",
    enabledAt: "2026-08-31T00:00:00.000Z",
  });
  enableAutomaticMonitoring({
    workspaceId: company.workspaceId,
    connectionId: "company-connection",
    targetId: "orders",
    frequency: "daily",
    enabledAt: "2026-08-31T00:00:00.000Z",
  });
  const decisions = createNexoraCanonicalDecisionRuntime();
  const executions = createNexoraCanonicalExecutionRuntime({ decisionRuntime: decisions.adapter, now: () => "2026-08-31T00:00:00.000Z" });
  for (const [id, workspaceId] of [
    ["dec-demo", DEMO_WORKSPACE_ID],
    ["dec-company", company.workspaceId],
    ["dec-project", expansion.workspaceId],
    ["dec-unassigned", null],
  ] as const) {
    assert.equal(decisions.adapter.transitionDecision({
      decisionId: id,
      action: "approve",
      title: id,
      workspaceId,
    }).status, "applied");
    assert.equal(executions.createExecution({ decisionId: id, workspaceId }).status, "created");
  }
  openManufacturingDemo();
  const companyCsv = fingerprint(company.workspaceId);
  const projectCsv = fingerprint(expansion.workspaceId);
  const result = resetActiveDemo({
    decisionRuntime: decisions,
    executionRuntime: executions,
    localStorage: storage,
    sessionStorage: session,
    sceneStorage: storage,
  });
  assert.equal(result.status, "reset");
  assert.equal(result.profileId, "manufacturing");
  assert.deepEqual(fingerprint(company.workspaceId), companyCsv);
  assert.deepEqual(fingerprint(expansion.workspaceId), projectCsv);
  assert.deepEqual(decisions.adapter.listDecisions().map((decision) => decision.decisionId).sort(), [
    "dec-company",
    "dec-project",
    "dec-unassigned",
  ]);
  assert.deepEqual(executions.listExecutions().map((execution) => execution.executionId).sort(), [
    "execution-dec-company",
    "execution-dec-project",
    "execution-dec-unassigned",
  ]);
  assert.equal(session.getItem(NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY)?.includes("dec-demo"), false);
  assert.equal(session.getItem(NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY)?.includes("dec-company"), true);
  assert.equal(session.getItem(NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY)?.includes("execution-dec-demo"), false);
  assert.equal(session.getItem(NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY)?.includes("execution-dec-project"), true);
  assert.equal(storage.getItem(`nexora.approvalWorkflow.${company.workspaceId}.default_project.decision-a`)?.includes("company"), true);
  assert.equal(storage.getItem(`nexora.approvalWorkflow.${DEMO_WORKSPACE_ID}.default_project.decision-demo`), null);
  assert.equal(storage.getItem(`nexora.collaboration.${expansion.workspaceId}.default_project.decision-a`) != null, true);
  assert.equal(storage.getItem(`nexora.collaboration.${DEMO_WORKSPACE_ID}.default_project.decision-demo`), null);
  assert.equal(storage.getItem(`nexora.decisionMemory.${company.workspaceId}.default_project`)?.includes("memory-company"), true);
  assert.equal(storage.getItem(`nexora.decisionMemory.${DEMO_WORKSPACE_ID}.default_project`), null);
  const scenes = loadSceneOrgSavedScenes(storage).scenes.map((entry) => entry.sceneId).sort();
  assert.deepEqual(scenes, ["scene-company", "scene-project", "scene-unassigned"]);
  assert.equal(listAutomaticMonitoringPolicies(company.workspaceId).length, 1);
  assert.equal(listAutomaticMonitoringPolicies(DEMO_WORKSPACE_ID).length, 0);
  const monitoring = JSON.parse(storage.getItem(DURABLE_MONITORING_STORAGE_KEY) ?? "{}") as {
    policies: { policyId: string }[];
    liveData: { connections: { workspaceId: string }[] };
  };
  assert.deepEqual(monitoring.policies.map((policy) => policy.policyId), ["policy-company"]);
  assert.deepEqual(monitoring.liveData.connections.map((connection) => connection.workspaceId), [expansion.workspaceId]);
  openProjectDemo();
  assert.deepEqual(fingerprint(company.workspaceId), companyCsv);
  assert.deepEqual(fingerprint(expansion.workspaceId), projectCsv);
  const again = resetActiveDemo({
    decisionRuntime: decisions,
    executionRuntime: executions,
    localStorage: storage,
    sessionStorage: session,
    sceneStorage: storage,
  });
  assert.equal(again.status, "reset");
  assert.equal(again.profileId, "project");
  assert.deepEqual(fingerprint(company.workspaceId), companyCsv);
  assert.deepEqual(fingerprint(expansion.workspaceId), projectCsv);
  assert.equal(decisions.adapter.listDecisions().length, 3);
  assert.equal(executions.listExecutions().length, 3);
});

test("reset does not read hidden truth, clear global CSV storage, switch profiles, or expose fixtures", () => {
  const source = readFileSync(fileURLToPath(new URL("./demoProfileReset.ts", import.meta.url)), "utf8");
  assert.equal(source.includes("expected-truth"), false);
  assert.equal(source.includes("demand trend increasing"), false);
  assert.equal(source.includes("project delivery pressure is emerging"), false);
  assert.equal(source.includes("clearCsvRealDataImportStore"), false);
  assert.equal(source.includes("clearCsvRealDataImportDurability"), false);
  assert.equal(source.includes("openProjectDemo"), false);
  assert.equal(source.includes("openManufacturingDemo"), false);
  const shell = readFileSync(fileURLToPath(new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url)), "utf8");
  assert.match(shell, /subscribeDemoReset/);
  assert.match(shell, /createEmptyNexoraExecutiveScenarioSession/);
  assert.match(shell, /createEmptyNexoraMVPFlowDomainState/);
  openManufacturingDemo();
  assert.equal(resetActiveDemo().status, "reset");
  assert.equal(readActiveDemoProfile(), "manufacturing");
  const labels = collectNexoraLivePrioritySources().map((item) => item.subjectLabel);
  for (const label of FIXTURE_LABELS) assert.equal(labels.includes(label), false);
  const control = readFileSync(fileURLToPath(new URL("../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx", import.meta.url)), "utf8");
  assert.match(control, /data-testid="reset-demo"/);
  assert.match(control, /Reset this demo to its original starting point\?/);
  assert.match(control, /data-reset-demo=\{manufacturingActive \|\| projectActive \? "available" : "unavailable"\}/);
});
