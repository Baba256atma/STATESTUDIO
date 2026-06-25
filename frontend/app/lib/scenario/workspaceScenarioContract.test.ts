import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import {
  WORKSPACE_KPI_STORAGE_KEY,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import {
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
  resetWorkspaceOkrStoreForTests,
} from "../okr/workspaceOkrContract.ts";
import {
  WORKSPACE_RISK_STORAGE_KEY,
  resetWorkspaceRiskStoreForTests,
} from "../risk/workspaceRiskContract.ts";
import {
  NEXORA_SCENARIO_FOUNDATION_LOG_PREFIX,
  WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_TAGS,
  WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES,
  WORKSPACE_SCENARIO_METRICS_RESERVATION_TAGS,
  WORKSPACE_SCENARIO_RESERVED_OWNERS,
  WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS,
  WORKSPACE_SCENARIO_SOURCE,
  WORKSPACE_SCENARIO_STORAGE_KEY,
  WORKSPACE_SCENARIO_TAGS,
  WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS,
  WORKSPACE_SCENARIO_TIMELINE_RESERVATION_TAGS,
  createWorkspaceScenario,
  deleteWorkspaceScenario,
  getWorkspaceScenario,
  getWorkspaceScenarios,
  resetWorkspaceScenarioMemoryForTests,
  resetWorkspaceScenarioStoreForTests,
  updateWorkspaceScenario,
  type WorkspaceScenarioAssumptions,
  type WorkspaceScenarioComparison,
  type WorkspaceScenarioMetrics,
  type WorkspaceScenarioNotes,
  type WorkspaceScenarioOverrides,
  type WorkspaceScenarioSimulation,
  type WorkspaceScenarioTimeline,
} from "./workspaceScenarioContract.ts";

function ensureBrowserStorage(): void {
  if (typeof globalThis.window !== "undefined") return;
  const store: Record<string, string> = {};
  (globalThis as typeof globalThis & { window: Window }).window = {
    localStorage: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) delete store[key];
      },
    },
  } as unknown as Window;
}

function resetAllStoresForTests(): void {
  resetWorkspaceScenarioStoreForTests();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceOkrStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function snapshotProtectedStorageKeys(): Record<string, string | null> {
  ensureBrowserStorage();
  const keys = [
    WORKSPACE_KPI_STORAGE_KEY,
    WORKSPACE_OBJECTIVE_STORAGE_KEY,
    WORKSPACE_KEY_RESULT_STORAGE_KEY,
    WORKSPACE_RISK_STORAGE_KEY,
    "nexora.workspaceObjects.v1",
    "nexora.workspaceRelationships.v1",
    "nexora.workspaceScenes.v1",
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-7:1 scenario foundation tags and storage key", () => {
  assert.equal(NEXORA_SCENARIO_FOUNDATION_LOG_PREFIX, "[NexoraScenarioFoundation]");
  assert.equal(WORKSPACE_SCENARIO_STORAGE_KEY, "nexora.workspaceScenarios.v1");
  assert.deepEqual(WORKSPACE_SCENARIO_TAGS, [
    "[DS71_SCENARIO_FOUNDATION]",
    "[SCENARIO_INTELLIGENCE_FOUNDATION]",
    "[SCENARIO_STORAGE_READY]",
    "[SCENARIO_CRUD_READY]",
    "[DS72_READY]",
    "[DS_7_1_COMPLETE]",
  ]);
});

test("exports DS-7:1.5 reserved architecture ownership and placeholder types", () => {
  assert.ok(WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_TAGS.includes("[DS715_SCENARIO_ARCHITECTURE_RESERVED]"));
  assert.equal(WORKSPACE_SCENARIO_RESERVED_OWNERS.assumptions.ownerPhase, "DS-7:2");
  assert.equal(WORKSPACE_SCENARIO_RESERVED_OWNERS.overrides.ownerPhase, "DS-7:2");
  assert.equal(WORKSPACE_SCENARIO_RESERVED_OWNERS.simulation.ownerPhase, "DS-7:3");
  assert.equal(WORKSPACE_SCENARIO_RESERVED_OWNERS.comparison.ownerPhase, "DS-7:4");
  assert.equal(WORKSPACE_SCENARIO_RESERVED_OWNERS.notes.ownerPhase, "Future");

  const placeholders: readonly [
    WorkspaceScenarioAssumptions,
    WorkspaceScenarioOverrides,
    WorkspaceScenarioSimulation,
    WorkspaceScenarioComparison,
    WorkspaceScenarioNotes,
  ] = [
    WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.assumptions,
    WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.overrides,
    WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.simulation,
    WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.comparison,
    WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.notes,
  ];

  for (const placeholder of placeholders) {
    assert.equal(placeholder.reserved, true);
    assert.ok(placeholder.ownerPhase.length > 0);
    assert.ok(placeholder.description.length > 0);
  }
});

test("exports DS-7:1.6 metrics reservation for Index Intelligence integration", () => {
  assert.ok(WORKSPACE_SCENARIO_METRICS_RESERVATION_TAGS.includes("[DS716_SCENARIO_METRICS_RESERVED]"));
  assert.equal(WORKSPACE_SCENARIO_RESERVED_OWNERS.metrics.ownerPhase, "IDX-1");
  assert.equal(WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.metrics.reserved, true);
  assert.match(
    WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.metrics.description,
    /Index Intelligence/
  );

  const metrics: WorkspaceScenarioMetrics = WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.metrics;
  assert.equal(metrics.reserved, true);
  assert.equal(metrics.ownerPhase, "IDX-1");

  assert.ok(WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES.includes("Scenario Risk Score"));
  assert.ok(WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES.includes("Decision Confidence"));
  assert.ok(WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES.length >= 10);
});

test("exports DS-7:4.5 timeline reservation for Future Timeline Engine", () => {
  assert.ok(
    WORKSPACE_SCENARIO_TIMELINE_RESERVATION_TAGS.includes("[DS745_SCENARIO_TIMELINE_RESERVED]")
  );
  assert.ok(
    WORKSPACE_SCENARIO_TIMELINE_RESERVATION_TAGS.includes("[SCENARIO_TIMELINE_OWNER_READY]")
  );
  assert.equal(WORKSPACE_SCENARIO_RESERVED_OWNERS.timeline.ownerPhase, "Future");
  assert.equal(WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.timeline.reserved, true);
  assert.match(
    WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.timeline.description,
    /Timeline/
  );

  const timeline: WorkspaceScenarioTimeline = WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.timeline;
  assert.equal(timeline.reserved, true);
  assert.equal(timeline.ownerPhase, "Future");
  assert.equal(Object.keys(timeline).length, 3);

  assert.ok(WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.includes("Scenario Created"));
  assert.ok(WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.includes("Simulation Executed"));
  assert.ok(WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.includes("Comparison Generated"));
  assert.ok(WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.includes("Scenario Archived"));
  assert.ok(WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.length >= 10);
});

test("persists scenario metadata without reserved slots in storage", () => {
  const workspace = createWorkspace("Scenario Architecture Reservation Workspace");
  const created = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Baseline",
    scenarioType: "baseline",
    status: "active",
  });
  assert.equal(created.success, true);

  const raw = window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY);
  assert.ok(raw);
  const parsed = JSON.parse(raw ?? "{}") as Record<string, Record<string, Record<string, unknown>>>;
  const stored = parsed[workspace.workspaceId]?.[created.scenario?.scenarioId ?? ""];

  assert.ok(stored);
  assert.equal(stored.reserved, undefined);
  assert.equal(stored.assumptions, undefined);
  assert.equal(stored.overrides, undefined);
  assert.equal(stored.simulation, undefined);
  assert.equal(stored.comparison, undefined);
  assert.equal(stored.metrics, undefined);
  assert.equal(stored.timeline, undefined);
  assert.equal(stored.notes, undefined);
  assert.equal(stored.name, "Baseline");
  assert.equal(stored.scenarioType, "baseline");
  assert.equal(stored.status, "active");
});

test("manual walkthrough creates scenarios with persistence", () => {
  const workspace = createWorkspace("Scenario Foundation Workspace");

  const baseline = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Baseline",
    description: "Current-state baseline scenario.",
    scenarioType: "baseline",
    status: "active",
  });
  assert.equal(baseline.success, true);
  assert.equal(baseline.scenario?.scenarioType, "baseline");
  assert.equal(baseline.scenario?.status, "active");
  assert.equal(baseline.scenario?.source, WORKSPACE_SCENARIO_SOURCE);

  const optimisticGrowth = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Optimistic Growth",
    description: "High-growth future-state scenario.",
    scenarioType: "optimistic",
    status: "draft",
  });
  assert.equal(optimisticGrowth.success, true);
  assert.equal(optimisticGrowth.scenario?.scenarioType, "optimistic");
  assert.equal(optimisticGrowth.scenario?.status, "draft");

  assert.equal(getWorkspaceScenarios(workspace.workspaceId).length, 2);

  const updated = updateWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    scenarioId: optimisticGrowth.scenario?.scenarioId ?? "",
    status: "active",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.scenario?.status, "active");

  assert.ok(window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY));

  resetWorkspaceScenarioMemoryForTests();
  assert.equal(getWorkspaceScenarios(workspace.workspaceId).length, 2);
  assert.equal(
    getWorkspaceScenario(workspace.workspaceId, baseline.scenario?.scenarioId ?? "")?.name,
    "Baseline"
  );
});

test("creates, updates, and deletes scenarios", () => {
  const workspace = createWorkspace("Scenario CRUD Workspace");
  const created = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Realistic Outlook",
    scenarioType: "realistic",
  });
  const scenarioId = created.scenario?.scenarioId ?? "";

  assert.equal(getWorkspaceScenario(workspace.workspaceId, scenarioId)?.name, "Realistic Outlook");

  const updated = updateWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    scenarioId,
    description: "Updated realistic scenario description.",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.scenario?.description, "Updated realistic scenario description.");

  const deleted = deleteWorkspaceScenario(workspace.workspaceId, scenarioId);
  assert.equal(deleted.deleted, true);
  assert.equal(getWorkspaceScenarios(workspace.workspaceId).length, 0);
});

test("returns empty scenarios for invalid or empty workspace", () => {
  const workspace = createWorkspace("Empty Scenario Workspace");
  assert.equal(getWorkspaceScenarios("").length, 0);
  assert.equal(getWorkspaceScenarios(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceScenario(workspace.workspaceId, "missing"), null);

  const invalidCreate = createWorkspaceScenario({
    workspaceId: "",
    name: "Invalid Workspace Scenario",
  });
  assert.equal(invalidCreate.success, false);
  assert.equal(invalidCreate.reason, "missing_workspace");
});

test("preserves workspace isolation", () => {
  const workspaceA = createWorkspace("Scenario Workspace A");
  const workspaceB = createWorkspace("Scenario Workspace B");

  createWorkspaceScenario({
    workspaceId: workspaceA.workspaceId,
    name: "Baseline",
    scenarioType: "baseline",
    status: "active",
  });

  assert.equal(getWorkspaceScenarios(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceScenarios(workspaceB.workspaceId).length, 0);
});

test("rejects invalid status and scenario type on create", () => {
  const workspace = createWorkspace("Scenario Validation Workspace");

  const invalidStatus = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Invalid Status Scenario",
    status: "invalid" as "draft",
  });
  assert.equal(invalidStatus.success, false);
  assert.equal(invalidStatus.reason, "invalid_status");

  const invalidType = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Invalid Type Scenario",
    scenarioType: "invalid" as "baseline",
  });
  assert.equal(invalidType.success, false);
  assert.equal(invalidType.reason, "invalid_scenario_type");

  const missingName = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "   ",
  });
  assert.equal(missingName.success, false);
  assert.equal(missingName.reason, "missing_name");
});

test("does not mutate KPI, OKR, risk, or scene storage during scenario CRUD", () => {
  const workspace = createWorkspace("Scenario Safety Workspace");
  const protectedBefore = snapshotProtectedStorageKeys();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  const created = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Baseline",
    scenarioType: "baseline",
    status: "active",
  });
  updateWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    scenarioId: created.scenario?.scenarioId ?? "",
    status: "archived",
  });
  getWorkspaceScenarios(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorageKeys(), protectedBefore);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});
