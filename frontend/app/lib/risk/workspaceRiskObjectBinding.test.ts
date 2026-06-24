import assert from "node:assert/strict";
import test from "node:test";

import { resetWorkspaceObjectIntelligenceStoreForTests } from "../workspace/workspaceObjectIntelligenceContract.ts";
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
  WORKSPACE_DETECTED_RISK_STORAGE_KEY,
  WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  resetWorkspaceDetectedRiskMemoryForTests,
  resetWorkspaceDetectedRiskStoreForTests,
  type WorkspaceDetectedRisk,
} from "./workspaceRiskDetectionEngine.ts";
import {
  WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY,
  resetWorkspaceRiskSeverityProfileStoreForTests,
} from "./workspaceRiskSeverityEngine.ts";
import { resetWorkspaceRiskStoreForTests } from "./workspaceRiskContract.ts";
import {
  NEXORA_RISK_OBJECT_BINDING_LOG_PREFIX,
  WORKSPACE_RISK_OBJECT_BINDING_READ_APIS,
  WORKSPACE_RISK_OBJECT_BINDING_SOURCE,
  WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY,
  WORKSPACE_RISK_OBJECT_BINDING_TAGS,
  bindRiskToObject,
  getRiskObjectBindings,
  getRiskObjectBindingsForObject,
  getRiskObjectBindingsForRisk,
  resetWorkspaceRiskObjectBindingMemoryForTests,
  resetWorkspaceRiskObjectBindingStoreForTests,
  resolveRiskObjectBindingMatch,
  suggestRiskObjectBindingMatches,
  suggestRiskObjectBindings,
  unbindRiskFromObject,
} from "./workspaceRiskObjectBinding.ts";

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
  resetWorkspaceRiskObjectBindingStoreForTests();
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskSeverityProfileStoreForTests();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function snapshotProtectedStorageKeys(): Record<string, string | null> {
  ensureBrowserStorage();
  const keys = [
    WORKSPACE_DETECTED_RISK_STORAGE_KEY,
    WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY,
    "nexora.workspaceObjectIntelligenceProfiles.v1",
    "nexora.workspaceObjects.v1",
    "nexora.workspaceRelationships.v1",
    "nexora.workspaceScenes.v1",
    "nexora.workspaceKpis.v1",
    "nexora.workspaceObjectives.v1",
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

function seedObjectProfiles(
  workspaceId: string,
  objects: readonly { objectId: string; objectName: string; objectType: string }[]
) {
  const store = {
    [workspaceId]: Object.fromEntries(
      objects.map((object) => [
        object.objectId,
        {
          contractVersion: "DS-3:1",
          objectId: object.objectId,
          workspaceId,
          objectName: object.objectName,
          objectType: object.objectType,
          originCandidateId: null,
          originWorkspaceObjectId: null,
          relationshipCount: 0,
          incomingRelationshipCount: 0,
          outgoingRelationshipCount: 0,
          connectedObjectCount: 0,
          intelligenceStatus: "ready",
          createdAt: "2026-06-24T00:00:00.000Z",
          updatedAt: "2026-06-24T00:00:00.000Z",
          source: "ds-3:1-foundation",
        },
      ])
    ),
  };
  window.localStorage.setItem(
    "nexora.workspaceObjectIntelligenceProfiles.v1",
    JSON.stringify(store)
  );
}

function seedDetectedRisks(
  workspaceId: string,
  risks: readonly WorkspaceDetectedRisk[]
): void {
  const store = {
    [workspaceId]: Object.fromEntries(risks.map((risk) => [risk.detectionId, risk])),
  };
  window.localStorage.setItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY, JSON.stringify(store));
  resetWorkspaceDetectedRiskMemoryForTests();
}

function buildDetectedRisk(input: {
  workspaceId: string;
  detectionId: string;
  riskId: string;
  title: string;
  confidence?: number;
  riskSource?: WorkspaceDetectedRisk["riskSource"];
}): WorkspaceDetectedRisk {
  return Object.freeze({
    detectionId: input.detectionId,
    workspaceId: input.workspaceId,
    riskId: input.riskId,
    title: input.title,
    description: "Test detected risk.",
    riskSource: input.riskSource ?? "kpi",
    detectionReason: "Test detection reason.",
    confidence: input.confidence ?? 0.95,
    detectedAt: "2026-06-24T00:00:00.000Z",
    source: WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  });
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-6:4 risk object binding tags and storage key", () => {
  assert.equal(NEXORA_RISK_OBJECT_BINDING_LOG_PREFIX, "[NexoraRiskObjectBinding]");
  assert.equal(
    WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY,
    "nexora.workspaceRiskObjectBindings.v1"
  );
  assert.deepEqual(WORKSPACE_RISK_OBJECT_BINDING_READ_APIS, [
    "getDetectedWorkspaceRisks",
    "getWorkspaceRiskSeverityProfiles",
  ]);
  assert.deepEqual(WORKSPACE_RISK_OBJECT_BINDING_TAGS, [
    "[DS64_RISK_OBJECT_BINDING]",
    "[RISK_OBJECT_TRACEABILITY_READY]",
    "[RISKS_LINKED_TO_OBJECTS]",
    "[RISK_BINDINGS_PERSISTED]",
    "[DS65_READY]",
    "[DS_6_4_COMPLETE]",
  ]);
});

test("matches forecast, supply chain, and growth risks to objects", () => {
  const forecastMatch = resolveRiskObjectBindingMatch({
    riskTitle: "Forecast Failure Risk",
    objectName: "Forecast",
    objectType: "forecast",
  });
  assert.equal(forecastMatch.matchKind, "exact");
  assert.ok(forecastMatch.bindingConfidence >= 0.8);

  const supplyMatch = resolveRiskObjectBindingMatch({
    riskTitle: "Supply Chain Risk",
    objectName: "Warehouse",
    objectType: "warehouse",
  });
  assert.ok(supplyMatch.bindingConfidence >= 0.8);

  const growthMatch = resolveRiskObjectBindingMatch({
    riskTitle: "Growth Execution Risk",
    objectName: "Sales",
    objectType: "sales",
  });
  assert.ok(growthMatch.bindingConfidence >= 0.65);
});

test("binds and unbinds risks manually with duplicate protection", () => {
  const workspace = createWorkspace("Risk Binding Workspace");
  const detected = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_supply_chain",
    riskId: "risk_supply_chain",
    title: "Supply Chain Risk",
  });
  seedDetectedRisks(workspace.workspaceId, [detected]);

  const first = bindRiskToObject(
    workspace.workspaceId,
    detected.riskId,
    "obj_warehouse_1"
  );
  assert.equal(first.success, true);
  assert.equal(first.created, true);
  assert.equal(first.binding?.source, WORKSPACE_RISK_OBJECT_BINDING_SOURCE);

  const duplicate = bindRiskToObject(
    workspace.workspaceId,
    detected.riskId,
    "obj_warehouse_1"
  );
  assert.equal(duplicate.success, true);
  assert.equal(duplicate.created, false);
  assert.equal(duplicate.binding?.bindingId, first.binding?.bindingId);

  assert.equal(getRiskObjectBindingsForRisk(workspace.workspaceId, detected.riskId).length, 1);
  assert.equal(getRiskObjectBindingsForObject(workspace.workspaceId, "obj_warehouse_1").length, 1);

  const removed = unbindRiskFromObject(workspace.workspaceId, first.binding?.bindingId ?? "");
  assert.equal(removed.success, true);
  assert.equal(removed.deleted, true);
  assert.equal(getRiskObjectBindings(workspace.workspaceId).length, 0);
});

test("suggests bindings for manual walkthrough examples", () => {
  const workspace = createWorkspace("Risk Suggest Binding Workspace");
  seedObjectProfiles(workspace.workspaceId, [
    { objectId: "obj_forecast_1", objectName: "Forecast", objectType: "forecast" },
    { objectId: "obj_warehouse_1", objectName: "Warehouse", objectType: "warehouse" },
    { objectId: "obj_sales_1", objectName: "Sales", objectType: "sales" },
  ]);

  const forecastRisk = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_forecast_failure",
    riskId: "risk_forecast_failure",
    title: "Forecast Failure Risk",
    confidence: 1,
    riskSource: "combined",
  });
  const supplyRisk = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_supply_chain",
    riskId: "risk_supply_chain",
    title: "Supply Chain Risk",
  });
  const growthRisk = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_growth_execution",
    riskId: "risk_growth_execution",
    title: "Growth Execution Risk",
    confidence: 0.8,
    riskSource: "okr",
  });
  seedDetectedRisks(workspace.workspaceId, [forecastRisk, supplyRisk, growthRisk]);

  const forecastSuggestion = suggestRiskObjectBindingMatches({
    riskTitle: "Forecast Failure Risk",
    objects: [{ objectId: "obj_forecast_1", objectName: "Forecast", objectType: "forecast" }],
  });
  assert.ok(forecastSuggestion);
  assert.equal(forecastSuggestion.objectId, "obj_forecast_1");
  assert.ok(forecastSuggestion.bindingConfidence >= 0.8);

  const supplySuggestion = suggestRiskObjectBindingMatches({
    riskTitle: "Supply Chain Risk",
    objects: [{ objectId: "obj_warehouse_1", objectName: "Warehouse", objectType: "warehouse" }],
  });
  assert.ok(supplySuggestion);
  assert.equal(supplySuggestion.objectId, "obj_warehouse_1");
  assert.ok(supplySuggestion.bindingConfidence >= 0.8);

  const growthSuggestion = suggestRiskObjectBindingMatches({
    riskTitle: "Growth Execution Risk",
    objects: [{ objectId: "obj_sales_1", objectName: "Sales", objectType: "sales" }],
  });
  assert.ok(growthSuggestion);
  assert.equal(growthSuggestion.objectId, "obj_sales_1");
  assert.ok(growthSuggestion.bindingConfidence >= 0.65);

  const result = suggestRiskObjectBindings(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.createdCount, 3);
  assert.equal(getRiskObjectBindings(workspace.workspaceId).length, 3);
  assert.equal(getRiskObjectBindingsForRisk(workspace.workspaceId, forecastRisk.riskId).length, 1);
  assert.equal(getRiskObjectBindingsForObject(workspace.workspaceId, "obj_sales_1").length, 1);
});

test("isolates bindings by workspace and persists reload", () => {
  const workspaceA = createWorkspace("Risk Binding Workspace A");
  const workspaceB = createWorkspace("Risk Binding Workspace B");
  const detected = buildDetectedRisk({
    workspaceId: workspaceA.workspaceId,
    detectionId: "detect_a",
    riskId: "risk_a",
    title: "Supply Chain Risk",
  });
  seedDetectedRisks(workspaceA.workspaceId, [detected]);

  bindRiskToObject(workspaceA.workspaceId, detected.riskId, "obj_a");
  assert.equal(getRiskObjectBindings(workspaceA.workspaceId).length, 1);
  assert.equal(getRiskObjectBindings(workspaceB.workspaceId).length, 0);

  const storedRaw = window.localStorage.getItem(WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY);
  assert.ok(storedRaw);
  resetWorkspaceRiskObjectBindingMemoryForTests();
  assert.equal(getRiskObjectBindings(workspaceA.workspaceId).length, 1);
});

test("does not mutate detection, severity, object, or scene storage", () => {
  const workspace = createWorkspace("Risk Binding Safety Workspace");
  seedObjectProfiles(workspace.workspaceId, [
    { objectId: "obj_forecast_1", objectName: "Forecast", objectType: "forecast" },
  ]);
  const detected = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_forecast_failure",
    riskId: "risk_forecast_failure",
    title: "Forecast Failure Risk",
    confidence: 1,
    riskSource: "combined",
  });
  seedDetectedRisks(workspace.workspaceId, [detected]);

  const protectedBefore = snapshotProtectedStorageKeys();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  bindRiskToObject(workspace.workspaceId, detected.riskId, "obj_forecast_1");
  suggestRiskObjectBindings(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorageKeys(), protectedBefore);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("rejects binding when detected risk is missing", () => {
  const workspace = createWorkspace("Missing Risk Binding Workspace");
  const result = bindRiskToObject(workspace.workspaceId, "missing_risk", "obj_1");
  assert.equal(result.success, false);
  assert.equal(result.reason, "risk_not_found");
});
