import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX,
  WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
  resolveWorkspaceObjectIntelligencePanelState,
} from "./workspaceObjectIntelligencePanelRuntime.ts";
import {
  NEXORA_KPI_PANEL_LOG_PREFIX,
  WORKSPACE_KPI_PANEL_TAGS,
  resolveObjectKpiSummaryState,
} from "./kpiSummaryRuntime.ts";
import { resetWorkspaceRegistryForTests } from "../../../lib/workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectIntelligenceStoreForTests } from "../../../lib/workspace/workspaceObjectIntelligenceContract.ts";
import { resetWorkspaceImpactProfileStoreForTests } from "../../../lib/workspace/workspaceImpactEngineContract.ts";
import { resetWorkspaceDependencyProfileStoreForTests } from "../../../lib/workspace/workspaceDependencyEngineContract.ts";
import { resetWorkspaceConfidenceProfileStoreForTests } from "../../../lib/workspace/workspaceConfidenceEngineContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../../../lib/workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../../../lib/workspace/workspaceSceneSync.ts";
import { resetWorkspaceKpiStoreForTests } from "../../../lib/kpi/workspaceKpiContract.ts";
import { resetWorkspaceKpiObjectBindingStoreForTests } from "../../../lib/kpi/workspaceKpiObjectBinding.ts";
import { resetWorkspaceKpiHealthProfileStoreForTests } from "../../../lib/kpi/workspaceKpiHealthEngine.ts";

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const IMPACT_STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";
const DEPENDENCY_STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";
const CONFIDENCE_STORAGE_KEY = "nexora.workspaceConfidenceProfiles.v1";
const KPI_STORAGE_KEY = "nexora.workspaceKpis.v1";
const KPI_BINDING_STORAGE_KEY = "nexora.workspaceKpiObjectBindings.v1";
const KPI_HEALTH_STORAGE_KEY = "nexora.workspaceKpiHealthProfiles.v1";

type SeedInput = {
  workspaceId: string;
  objectId: string;
  objectName?: string;
  objectType?: string;
  impact?: boolean;
  dependency?: boolean;
  confidence?: boolean;
};

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

function seedStores(input: SeedInput): void {
  const timestamp = new Date().toISOString();
  const objectName = input.objectName ?? "Product";
  const objectType = input.objectType ?? "product";
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceImpactProfileStoreForTests();
  resetWorkspaceDependencyProfileStoreForTests();
  resetWorkspaceConfidenceProfileStoreForTests();
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: {
        [input.objectId]: {
          contractVersion: "DS-3:1",
          objectId: input.objectId,
          workspaceId: input.workspaceId,
          objectName,
          objectType,
          originCandidateId: `candidate_${input.objectId}`,
          originWorkspaceObjectId: input.objectId,
          relationshipCount: 4,
          incomingRelationshipCount: 2,
          outgoingRelationshipCount: 2,
          connectedObjectCount: 4,
          intelligenceStatus: "ready",
          createdAt: timestamp,
          updatedAt: timestamp,
          source: "ds-3:1-foundation",
        },
      },
    })
  );
  window.localStorage.setItem(
    IMPACT_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: input.impact === false ? {} : {
        [input.objectId]: {
          contractVersion: "DS-3:2",
          objectId: input.objectId,
          workspaceId: input.workspaceId,
          impactScore: 88,
          impactLevel: "High",
          impactReason: "4 relationships; 4 connected objects; broad model influence.",
          relationshipCount: 4,
          connectedObjectCount: 4,
          calculatedAt: timestamp,
          source: "ds-3:2-impact",
        },
      },
    })
  );
  window.localStorage.setItem(
    DEPENDENCY_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: input.dependency === false ? {} : {
        [input.objectId]: {
          contractVersion: "DS-3:3",
          objectId: input.objectId,
          workspaceId: input.workspaceId,
          dependencyScore: 91,
          dependencyLevel: "Critical",
          dependencyReason: "4 dependent objects; 2 incoming relationships; central dependency hub.",
          incomingRelationshipCount: 2,
          dependentObjectCount: 4,
          calculatedAt: timestamp,
          source: "ds-3:3-dependency",
        },
      },
    })
  );
  window.localStorage.setItem(
    CONFIDENCE_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: input.confidence === false ? {} : {
        [input.objectId]: {
          contractVersion: "DS-3:4",
          objectId: input.objectId,
          workspaceId: input.workspaceId,
          confidenceScore: 84,
          confidenceLevel: "Very High",
          confidenceReason: "multiple confirmed relationships; high graph connectivity; complete object profile.",
          relationshipCoverage: 90,
          connectionEvidence: 80,
          profileCompleteness: 100,
          calculatedAt: timestamp,
          source: "ds-3:4-confidence",
        },
      },
    })
  );
}

type KpiSeedInput = {
  workspaceId: string;
  kpiId: string;
  kpiName: string;
  objectId: string;
  healthStatus?: "healthy" | "watch" | "warning" | "critical" | "unknown";
  progressPercent?: number;
  healthReason?: string;
  includeHealth?: boolean;
};

function seedKpiBindings(input: KpiSeedInput | readonly KpiSeedInput[]): void {
  const entries = Array.isArray(input) ? input : [input];
  const timestamp = new Date().toISOString();
  const kpiStore: Record<string, Record<string, unknown>> = {};
  const bindingStore: Record<string, Record<string, unknown>> = {};
  const healthStore: Record<string, Record<string, unknown>> = {};

  for (const entry of entries) {
    kpiStore[entry.workspaceId] ??= {};
    bindingStore[entry.workspaceId] ??= {};
    healthStore[entry.workspaceId] ??= {};

    kpiStore[entry.workspaceId][entry.kpiId] = {
      contractVersion: "DS-4:1",
      kpiId: entry.kpiId,
      workspaceId: entry.workspaceId,
      name: entry.kpiName,
      description: "",
      unit: "score",
      targetValue: 100,
      currentValue: entry.progressPercent ?? 100,
      status: entry.healthStatus ?? "healthy",
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-4:1-foundation",
    };

    const bindingId = `wkpi_bind_${entry.workspaceId}_${entry.kpiId}_${entry.objectId}`;
    bindingStore[entry.workspaceId][bindingId] = {
      contractVersion: "DS-4:4",
      workspaceId: entry.workspaceId,
      bindingId,
      kpiId: entry.kpiId,
      objectId: entry.objectId,
      bindingStrength: "strong",
      bindingConfidence: 0.8,
      bindingReason: `Manually bound ${entry.kpiName} to object ${entry.objectId}.`,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-4:4-kpi-object-binding",
    };

    if (entry.includeHealth !== false) {
      const healthStatus = entry.healthStatus ?? "healthy";
      const progressPercent = entry.progressPercent ?? 100;
      healthStore[entry.workspaceId][entry.kpiId] = {
        contractVersion: "DS-4:3",
        workspaceId: entry.workspaceId,
        kpiId: entry.kpiId,
        healthScore: progressPercent,
        healthStatus,
        severity: healthStatus === "critical" ? "critical" : "none",
        healthReason:
          entry.healthReason ??
          (progressPercent >= 100
            ? `${entry.kpiName} exceeded target and is stable.`
            : `${entry.kpiName} is at ${progressPercent}% of target and declining.`),
        progressPercent,
        variance: 0,
        trend: "stable",
        calculatedAt: timestamp,
        source: "ds-4:3-kpi-health",
      };
    }
  }

  window.localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(kpiStore));
  window.localStorage.setItem(KPI_BINDING_STORAGE_KEY, JSON.stringify(bindingStore));
  window.localStorage.setItem(KPI_HEALTH_STORAGE_KEY, JSON.stringify(healthStore));
}

function appendObjectIntelligenceProfile(input: {
  workspaceId: string;
  objectId: string;
  objectName?: string;
  objectType?: string;
}): void {
  const timestamp = new Date().toISOString();
  const objectName = input.objectName ?? "Object";
  const objectType = input.objectType ?? "object";
  const raw = window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY);
  const store = raw ? (JSON.parse(raw) as Record<string, Record<string, unknown>>) : {};
  store[input.workspaceId] ??= {};
  store[input.workspaceId][input.objectId] = {
    contractVersion: "DS-3:1",
    objectId: input.objectId,
    workspaceId: input.workspaceId,
    objectName,
    objectType,
    originCandidateId: `candidate_${input.objectId}`,
    originWorkspaceObjectId: input.objectId,
    relationshipCount: 4,
    incomingRelationshipCount: 2,
    outgoingRelationshipCount: 2,
    connectedObjectCount: 4,
    intelligenceStatus: "ready",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: "ds-3:1-foundation",
  };
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, JSON.stringify(store));
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceImpactProfileStoreForTests();
  resetWorkspaceDependencyProfileStoreForTests();
  resetWorkspaceConfidenceProfileStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceKpiObjectBindingStoreForTests();
  resetWorkspaceKpiHealthProfileStoreForTests();
});

test("exports DS-3:5 tags, DS-4:5 KPI panel tags, and diagnostic prefixes", () => {
  assert.equal(NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX, "[NexoraObjectIntelligencePanel]");
  assert.equal(NEXORA_KPI_PANEL_LOG_PREFIX, "[NexoraKpiPanel]");
  assert.ok(WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS.includes("[DS45_KPI_PANEL]"));
  assert.deepEqual(WORKSPACE_KPI_PANEL_TAGS, [
    "[DS45_KPI_PANEL]",
    "[KPI_VISIBLE_IN_OBJECT_PANEL]",
    "[OBJECT_PANEL_EXTENDED]",
    "[NO_NEW_PANEL_CREATED]",
    "[DS46_READY]",
    "[DS_4_5_COMPLETE]",
  ]);
});

test("loads object with full intelligence", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_product" });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_product",
  });

  assert.equal(state.objectName, "Product");
  assert.deepEqual(state.impact, { score: "88", level: "High", available: true });
  assert.deepEqual(state.dependency, { score: "91", level: "Critical", available: true });
  assert.deepEqual(state.confidence, { score: "84", level: "Very High", available: true });
  assert.ok(state.reasons.includes("broad model influence"));
});

test("loads scene object ids by resolving origin workspace object ids", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_product" });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "scene_obj_product",
  });

  assert.equal(state.objectId, "obj_product");
  assert.equal(state.impact.score, "88");
});

test("handles missing impact, dependency, and confidence safely", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_product", impact: false });
  assert.deepEqual(
    resolveWorkspaceObjectIntelligencePanelState({ workspaceId: "workspace_a", objectId: "obj_product" }).impact,
    { score: "--", level: "Unavailable", available: false }
  );

  seedStores({ workspaceId: "workspace_a", objectId: "obj_product", dependency: false });
  assert.deepEqual(
    resolveWorkspaceObjectIntelligencePanelState({ workspaceId: "workspace_a", objectId: "obj_product" }).dependency,
    { score: "--", level: "Unavailable", available: false }
  );

  seedStores({ workspaceId: "workspace_a", objectId: "obj_product", confidence: false });
  assert.deepEqual(
    resolveWorkspaceObjectIntelligencePanelState({ workspaceId: "workspace_a", objectId: "obj_product" }).confidence,
    { score: "--", level: "Unavailable", available: false }
  );
});

test("handles no intelligence profile", () => {
  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_missing",
  });

  assert.equal(state.hasAnyIntelligence, false);
  assert.equal(state.impact.available, false);
  assert.equal(state.dependency.available, false);
  assert.equal(state.confidence.available, false);
});

test("preserves workspace isolation", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_product" });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_b",
    objectId: "obj_product",
  });

  assert.equal(state.hasAnyIntelligence, false);
  assert.equal(state.impact.score, "--");
});

test("existing Object Panel is upgraded and no new right panel route is required", () => {
  const actionPanelSource = readFileSync(
    new URL("../ExecutiveActionPanel.tsx", import.meta.url),
    "utf8"
  );

  assert.match(actionPanelSource, /WorkspaceObjectIntelligencePanel/);
  assert.match(actionPanelSource, /<ActionsSection/);
});

test("does not mutate scene or topology", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_product" });
  assert.equal(getWorkspaceSceneJson("workspace_a"), null);

  resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_product",
  });

  assert.equal(getWorkspaceSceneJson("workspace_a"), null);
});

test("shows KPI summary for object with multiple bindings", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedKpiBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_forecast",
      kpiId: "wkpi_forecast_accuracy",
      kpiName: "Forecast Accuracy",
      healthStatus: "healthy",
      progressPercent: 102,
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_forecast",
      kpiId: "wkpi_forecast_delay",
      kpiName: "Forecast Delay",
      healthStatus: "warning",
      progressPercent: 84,
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_forecast",
      kpiId: "wkpi_forecast_cost",
      kpiName: "Forecast Cost",
      healthStatus: "critical",
      progressPercent: 61,
    },
  ]);

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(state.kpiSummary.bindingCount, 3);
  assert.equal(state.kpiSummary.healthProfileCount, 3);
  assert.equal(state.kpiSummary.items.length, 3);
  assert.equal(state.kpiSummary.items[0]?.kpiName, "Forecast Accuracy");
  assert.equal(state.kpiSummary.items[0]?.healthStatusLabel, "Healthy");
  assert.equal(state.kpiSummary.items[0]?.progressLabel, "102%");
  assert.equal(state.kpiSummary.items[1]?.healthStatusLabel, "Warning");
  assert.equal(state.kpiSummary.items[1]?.progressLabel, "84%");
  assert.equal(state.kpiSummary.items[2]?.healthStatusLabel, "Critical");
  assert.equal(state.kpiSummary.items[2]?.progressLabel, "61%");
});

test("shows warehouse KPIs only when switching objects", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  appendObjectIntelligenceProfile({
    workspaceId: "workspace_a",
    objectId: "obj_warehouse",
    objectName: "Warehouse",
    objectType: "warehouse",
  });
  seedKpiBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_forecast",
      kpiId: "wkpi_forecast_accuracy",
      kpiName: "Forecast Accuracy",
      progressPercent: 102,
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_warehouse",
      kpiId: "wkpi_inventory_turnover",
      kpiName: "Inventory Turnover",
      healthStatus: "warning",
      progressPercent: 78,
    },
  ]);

  const forecastState = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });
  const warehouseState = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_warehouse",
  });

  assert.equal(forecastState.kpiSummary.items.length, 1);
  assert.equal(forecastState.kpiSummary.items[0]?.kpiName, "Forecast Accuracy");
  assert.equal(warehouseState.kpiSummary.items.length, 1);
  assert.equal(warehouseState.kpiSummary.items[0]?.kpiName, "Inventory Turnover");
});

test("shows empty KPI summary when object has no bindings", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(state.kpiSummary.emptyMessage, "No KPIs linked to this object.");
  assert.equal(state.kpiSummary.items.length, 0);
});

test("shows missing health message when binding exists without health profile", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    kpiId: "wkpi_forecast_accuracy",
    kpiName: "Forecast Accuracy",
    includeHealth: false,
  });

  const summary = resolveObjectKpiSummaryState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(summary.items.length, 1);
  assert.equal(summary.items[0]?.healthAvailable, false);
  assert.equal(summary.items[0]?.kpiName, "Forecast Accuracy");
});

test("keeps KPI summary hidden when no object is selected", () => {
  const summary = resolveObjectKpiSummaryState({
    workspaceId: "workspace_a",
    objectId: "",
  });

  assert.equal(summary.visible, false);
  assert.equal(summary.items.length, 0);
});

test("preserves KPI summary workspace isolation", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    kpiId: "wkpi_forecast_accuracy",
    kpiName: "Forecast Accuracy",
  });

  const isolated = resolveObjectKpiSummaryState({
    workspaceId: "workspace_b",
    objectId: "obj_forecast",
  });

  assert.equal(isolated.emptyMessage, "No KPIs linked to this object.");
  assert.equal(isolated.bindingCount, 0);
});

test("does not mutate KPI, object, or scene storage when resolving KPI summary", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    kpiId: "wkpi_forecast_accuracy",
    kpiName: "Forecast Accuracy",
  });

  const before = {
    kpis: window.localStorage.getItem(KPI_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    scene: getWorkspaceSceneJson("workspace_a"),
  };

  resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(window.localStorage.getItem(KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY), before.objects);
  assert.equal(getWorkspaceSceneJson("workspace_a"), before.scene);
});
