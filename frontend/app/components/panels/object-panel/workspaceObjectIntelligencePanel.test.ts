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
import {
  NEXORA_OKR_PANEL_LOG_PREFIX,
  WORKSPACE_OKR_PANEL_TAGS,
  resolveObjectOkrSummaryState,
} from "./okrSummaryRuntime.ts";
import {
  NEXORA_RISK_PANEL_LOG_PREFIX,
  WORKSPACE_RISK_PANEL_TAGS,
  resolveObjectRiskSummaryState,
} from "./riskSummaryRuntime.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../../../lib/workspace/workspaceRegistryStore.ts";
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
import { resetWorkspaceOkrStoreForTests } from "../../../lib/okr/workspaceOkrContract.ts";
import { resetWorkspaceOkrKpiBindingStoreForTests } from "../../../lib/okr/workspaceOkrKpiBinding.ts";
import { resetWorkspaceOkrProgressProfileStoreForTests } from "../../../lib/okr/workspaceOkrProgressEngine.ts";
import { resetWorkspaceOkrHealthProfileStoreForTests } from "../../../lib/okr/workspaceOkrHealthEngine.ts";
import { resetWorkspaceDetectedRiskStoreForTests } from "../../../lib/risk/workspaceRiskDetectionEngine.ts";
import { resetWorkspaceRiskSeverityProfileStoreForTests } from "../../../lib/risk/workspaceRiskSeverityEngine.ts";
import { resetWorkspaceRiskObjectBindingStoreForTests } from "../../../lib/risk/workspaceRiskObjectBinding.ts";
import {
  createWorkspaceScenario,
  resetWorkspaceScenarioStoreForTests,
} from "../../../lib/scenario/workspaceScenarioContract.ts";
import {
  generateWorkspaceScenarioInsight,
  resetWorkspaceScenarioInsightStoreForTests,
} from "../../../lib/scenario/workspaceScenarioInsightEngine.ts";
import {
  createWorkspaceScenarioAssumption,
  resetWorkspaceScenarioSimulationStoreForTests,
  runWorkspaceScenarioSimulation,
} from "../../../lib/scenario/workspaceScenarioSimulationEngine.ts";
import {
  NEXORA_SCENARIO_PANEL_LOG_PREFIX,
  WORKSPACE_SCENARIO_PANEL_TAGS,
  resolveObjectScenarioSummaryState,
} from "../../../lib/scenario/scenarioWorkspaceIntegrationRuntime.ts";

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const IMPACT_STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";
const DEPENDENCY_STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";
const CONFIDENCE_STORAGE_KEY = "nexora.workspaceConfidenceProfiles.v1";
const KPI_STORAGE_KEY = "nexora.workspaceKpis.v1";
const KPI_BINDING_STORAGE_KEY = "nexora.workspaceKpiObjectBindings.v1";
const KPI_HEALTH_STORAGE_KEY = "nexora.workspaceKpiHealthProfiles.v1";
const OBJECTIVE_STORAGE_KEY = "nexora.workspaceObjectives.v1";
const OKR_KPI_BINDING_STORAGE_KEY = "nexora.workspaceOkrKpiBindings.v1";
const OKR_PROGRESS_STORAGE_KEY = "nexora.workspaceOkrProgressProfiles.v1";
const OKR_HEALTH_STORAGE_KEY = "nexora.workspaceOkrHealthProfiles.v1";
const RISK_BINDING_STORAGE_KEY = "nexora.workspaceRiskObjectBindings.v1";
const DETECTED_RISK_STORAGE_KEY = "nexora.workspaceDetectedRisks.v1";
const RISK_SEVERITY_STORAGE_KEY = "nexora.workspaceRiskSeverityProfiles.v1";

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

type OkrSeedInput = {
  workspaceId: string;
  objectiveId: string;
  objectiveTitle: string;
  kpiId: string;
  objectId: string;
  healthStatus?: "healthy" | "watch" | "warning" | "critical" | "unknown";
  progressPercent?: number;
  includeHealth?: boolean;
  includeProgress?: boolean;
};

function seedOkrBindings(input: OkrSeedInput | readonly OkrSeedInput[]): void {
  const entries = Array.isArray(input) ? input : [input];
  const timestamp = new Date().toISOString();
  const objectiveStore: Record<string, Record<string, unknown>> = {};
  const okrBindingStore: Record<string, Record<string, unknown>> = {};
  const progressStore: Record<string, Record<string, unknown>> = {};
  const healthStore: Record<string, Record<string, unknown>> = {};

  for (const entry of entries) {
    objectiveStore[entry.workspaceId] ??= {};
    okrBindingStore[entry.workspaceId] ??= {};
    progressStore[entry.workspaceId] ??= {};
    healthStore[entry.workspaceId] ??= {};

    objectiveStore[entry.workspaceId][entry.objectiveId] = {
      contractVersion: "DS-5:1",
      objectiveId: entry.objectiveId,
      workspaceId: entry.workspaceId,
      title: entry.objectiveTitle,
      description: "",
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-5:1-foundation",
    };

    const bindingId = `wokr_kpi_bind_${entry.workspaceId}_${entry.objectiveId}_${entry.kpiId}`;
    okrBindingStore[entry.workspaceId][bindingId] = {
      contractVersion: "DS-5:4",
      workspaceId: entry.workspaceId,
      bindingId,
      objectiveId: entry.objectiveId,
      kpiId: entry.kpiId,
      bindingStrength: "strong",
      bindingConfidence: 0.8,
      bindingReason: `Manually bound objective "${entry.objectiveTitle}" to KPI "${entry.kpiId}".`,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-5:4-okr-kpi-binding",
    };

    if (entry.includeProgress !== false) {
      const progressPercent = entry.progressPercent ?? 100;
      progressStore[entry.workspaceId][entry.objectiveId] = {
        contractVersion: "DS-5:2",
        workspaceId: entry.workspaceId,
        objectiveId: entry.objectiveId,
        progressPercent,
        score: Math.min(progressPercent, 100),
        keyResultCount: 1,
        completedKeyResults: progressPercent >= 100 ? 1 : 0,
        variance: 0,
        trend: "stable",
        reason: `${entry.objectiveTitle} objective reached ${progressPercent}% progress.`,
        calculatedAt: timestamp,
        source: "ds-5:2-okr-progress",
      };
    }

    if (entry.includeHealth !== false) {
      const healthStatus = entry.healthStatus ?? "healthy";
      const progressPercent = entry.progressPercent ?? 100;
      healthStore[entry.workspaceId][entry.objectiveId] = {
        contractVersion: "DS-5:3",
        workspaceId: entry.workspaceId,
        objectiveId: entry.objectiveId,
        healthScore: Math.min(progressPercent, 100),
        healthStatus,
        severity: healthStatus === "critical" ? "critical" : "none",
        healthReason:
          progressPercent >= 100
            ? `${entry.objectiveTitle} objective exceeded expected progress.`
            : `${entry.objectiveTitle} objective reached ${progressPercent}% progress and is declining.`,
        progressPercent,
        variance: 0,
        trend: "stable",
        calculatedAt: timestamp,
        source: "ds-5:3-okr-health",
      };
    }
  }

  window.localStorage.setItem(OBJECTIVE_STORAGE_KEY, JSON.stringify(objectiveStore));
  window.localStorage.setItem(OKR_KPI_BINDING_STORAGE_KEY, JSON.stringify(okrBindingStore));
  window.localStorage.setItem(OKR_PROGRESS_STORAGE_KEY, JSON.stringify(progressStore));
  window.localStorage.setItem(OKR_HEALTH_STORAGE_KEY, JSON.stringify(healthStore));
}

type RiskSeedInput = {
  workspaceId: string;
  objectId: string;
  riskId: string;
  detectionId: string;
  riskTitle: string;
  severityLevel?: "low" | "medium" | "high" | "critical";
  priority?: "p1" | "p2" | "p3" | "p4";
  severityScore?: number;
  includeSeverity?: boolean;
  includeDetected?: boolean;
};

function seedRiskBindings(input: RiskSeedInput | readonly RiskSeedInput[]): void {
  const entries = Array.isArray(input) ? input : [input];
  const timestamp = new Date().toISOString();
  const bindingStore: Record<string, Record<string, unknown>> = {};
  const detectedStore: Record<string, Record<string, unknown>> = {};
  const severityStore: Record<string, Record<string, unknown>> = {};

  for (const entry of entries) {
    bindingStore[entry.workspaceId] ??= {};
    detectedStore[entry.workspaceId] ??= {};
    severityStore[entry.workspaceId] ??= {};

    const bindingId = `wrisk_bind_${entry.workspaceId}_${entry.riskId}_${entry.objectId}`;
    bindingStore[entry.workspaceId][bindingId] = {
      contractVersion: "DS-6:4",
      workspaceId: entry.workspaceId,
      bindingId,
      riskId: entry.riskId,
      objectId: entry.objectId,
      bindingStrength: "strong",
      bindingConfidence: 0.8,
      bindingReason: `Manually bound ${entry.riskTitle} to object ${entry.objectId}.`,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-6:4-risk-object-binding",
    };

    if (entry.includeDetected !== false) {
      detectedStore[entry.workspaceId][entry.detectionId] = {
        detectionId: entry.detectionId,
        workspaceId: entry.workspaceId,
        riskId: entry.riskId,
        title: entry.riskTitle,
        description: "Test detected risk.",
        riskSource: "combined",
        detectionReason: "Test detection reason.",
        confidence: 1,
        detectedAt: timestamp,
        source: "ds-6:2-risk-detection",
      };
    }

    if (entry.includeSeverity !== false) {
      severityStore[entry.workspaceId][entry.detectionId] = {
        contractVersion: "DS-6:3",
        workspaceId: entry.workspaceId,
        detectionId: entry.detectionId,
        riskId: entry.riskId,
        severityScore: entry.severityScore ?? 100,
        severityLevel: entry.severityLevel ?? "critical",
        priority: entry.priority ?? "p1",
        severityReason: `${entry.riskTitle} has critical confidence.`,
        evaluatedAt: timestamp,
        source: "ds-6:3-risk-severity",
      };
    }
  }

  window.localStorage.setItem(RISK_BINDING_STORAGE_KEY, JSON.stringify(bindingStore));
  window.localStorage.setItem(DETECTED_RISK_STORAGE_KEY, JSON.stringify(detectedStore));
  window.localStorage.setItem(RISK_SEVERITY_STORAGE_KEY, JSON.stringify(severityStore));
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
  resetWorkspaceOkrStoreForTests();
  resetWorkspaceOkrKpiBindingStoreForTests();
  resetWorkspaceOkrProgressProfileStoreForTests();
  resetWorkspaceOkrHealthProfileStoreForTests();
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskSeverityProfileStoreForTests();
  resetWorkspaceRiskObjectBindingStoreForTests();
  resetWorkspaceScenarioSimulationStoreForTests();
  resetWorkspaceScenarioInsightStoreForTests();
  resetWorkspaceScenarioStoreForTests();
});

test("exports DS-3:5 tags, DS-4:5 KPI panel tags, DS-5:5 OKR panel tags, DS-6:5 risk panel tags, and diagnostic prefixes", () => {
  assert.equal(NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX, "[NexoraObjectIntelligencePanel]");
  assert.equal(NEXORA_KPI_PANEL_LOG_PREFIX, "[NexoraKpiPanel]");
  assert.equal(NEXORA_OKR_PANEL_LOG_PREFIX, "[NexoraOkrPanel]");
  assert.equal(NEXORA_RISK_PANEL_LOG_PREFIX, "[NexoraRiskPanel]");
  assert.ok(WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS.includes("[DS45_KPI_PANEL]"));
  assert.ok(WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS.includes("[DS55_OKR_PANEL]"));
  assert.ok(WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS.includes("[DS65_RISK_PANEL]"));
  assert.ok(WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS.includes("[DS75_SCENARIO_PANEL]"));
  assert.equal(NEXORA_SCENARIO_PANEL_LOG_PREFIX, "[NexoraScenarioWorkspace]");
  assert.deepEqual(WORKSPACE_SCENARIO_PANEL_TAGS, [
    "[DS75_SCENARIO_PANEL]",
    "[SCENARIO_VISIBLE_IN_OBJECT_PANEL]",
    "[OBJECT_PANEL_EXTENDED]",
    "[NO_NEW_PANEL_CREATED]",
    "[DS76_READY]",
    "[DS_7_5_COMPLETE]",
  ]);
  assert.deepEqual(WORKSPACE_KPI_PANEL_TAGS, [
    "[DS45_KPI_PANEL]",
    "[KPI_VISIBLE_IN_OBJECT_PANEL]",
    "[OBJECT_PANEL_EXTENDED]",
    "[NO_NEW_PANEL_CREATED]",
    "[DS46_READY]",
    "[DS_4_5_COMPLETE]",
  ]);
  assert.deepEqual(WORKSPACE_OKR_PANEL_TAGS, [
    "[DS55_OKR_PANEL]",
    "[OKR_VISIBLE_IN_OBJECT_PANEL]",
    "[OBJECT_PANEL_EXTENDED]",
    "[NO_NEW_PANEL_CREATED]",
    "[DS56_READY]",
    "[DS_5_5_COMPLETE]",
  ]);
  assert.deepEqual(WORKSPACE_RISK_PANEL_TAGS, [
    "[DS65_RISK_PANEL]",
    "[RISK_VISIBLE_IN_OBJECT_PANEL]",
    "[OBJECT_PANEL_EXTENDED]",
    "[NO_NEW_PANEL_CREATED]",
    "[DS66_READY]",
    "[DS_6_5_COMPLETE]",
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

test("shows OKR summary for Forecast manual walkthrough", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    kpiId: "wkpi_forecast_accuracy",
    kpiName: "Forecast Accuracy",
    healthStatus: "healthy",
    progressPercent: 102,
  });
  seedOkrBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    objectiveId: "wobj_improve_forecasting",
    objectiveTitle: "Improve Forecasting",
    kpiId: "wkpi_forecast_accuracy",
    healthStatus: "healthy",
    progressPercent: 105,
  });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(state.okrSummary.objectiveCount, 1);
  assert.equal(state.okrSummary.items[0]?.objectiveTitle, "Improve Forecasting");
  assert.equal(state.okrSummary.items[0]?.healthStatusLabel, "Healthy");
  assert.equal(state.okrSummary.items[0]?.progressLabel, "105%");
});

test("shows OKR summary for Sales manual walkthrough", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_sales", objectName: "Sales", objectType: "sales" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    kpiId: "wkpi_revenue_growth",
    kpiName: "Revenue Growth",
    healthStatus: "warning",
    progressPercent: 80,
  });
  seedOkrBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    objectiveId: "wobj_become_market_leader",
    objectiveTitle: "Become Market Leader",
    kpiId: "wkpi_revenue_growth",
    healthStatus: "warning",
    progressPercent: 70,
  });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(state.okrSummary.items[0]?.objectiveTitle, "Become Market Leader");
  assert.equal(state.okrSummary.items[0]?.healthStatusLabel, "Warning");
  assert.equal(state.okrSummary.items[0]?.progressLabel, "70%");
});

test("shows multiple OKRs for object with multiple objective bindings", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_sales", objectName: "Sales", objectType: "sales" });
  seedKpiBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      kpiId: "wkpi_revenue_growth",
      kpiName: "Revenue Growth",
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      kpiId: "wkpi_market_share",
      kpiName: "Market Share",
    },
  ]);
  seedOkrBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      objectiveId: "wobj_become_market_leader",
      objectiveTitle: "Become Market Leader",
      kpiId: "wkpi_revenue_growth",
      healthStatus: "warning",
      progressPercent: 70,
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      objectiveId: "wobj_reduce_cost",
      objectiveTitle: "Reduce Operational Cost",
      kpiId: "wkpi_market_share",
      healthStatus: "critical",
      progressPercent: 45,
    },
  ]);

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(state.okrSummary.objectiveCount, 2);
  assert.equal(state.okrSummary.items[0]?.objectiveTitle, "Become Market Leader");
  assert.equal(state.okrSummary.items[1]?.objectiveTitle, "Reduce Operational Cost");
});

test("shows empty OKR summary when object has KPI bindings but no OKR bindings", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    kpiId: "wkpi_forecast_accuracy",
    kpiName: "Forecast Accuracy",
  });

  const summary = resolveObjectOkrSummaryState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(summary.emptyMessage, "No OKRs linked to this object.");
  assert.equal(summary.items.length, 0);
});

test("shows missing health message when OKR binding exists without health profile", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_sales", objectName: "Sales", objectType: "sales" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    kpiId: "wkpi_revenue_growth",
    kpiName: "Revenue Growth",
  });
  seedOkrBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    objectiveId: "wobj_become_market_leader",
    objectiveTitle: "Become Market Leader",
    kpiId: "wkpi_revenue_growth",
    includeHealth: false,
  });

  const summary = resolveObjectOkrSummaryState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(summary.items.length, 1);
  assert.equal(summary.items[0]?.healthAvailable, false);
  assert.equal(summary.items[0]?.objectiveTitle, "Become Market Leader");
});

test("switches OKR summary when changing selected object", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  appendObjectIntelligenceProfile({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    objectName: "Sales",
    objectType: "sales",
  });
  seedKpiBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_forecast",
      kpiId: "wkpi_forecast_accuracy",
      kpiName: "Forecast Accuracy",
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      kpiId: "wkpi_revenue_growth",
      kpiName: "Revenue Growth",
    },
  ]);
  seedOkrBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_forecast",
      objectiveId: "wobj_improve_forecasting",
      objectiveTitle: "Improve Forecasting",
      kpiId: "wkpi_forecast_accuracy",
      progressPercent: 105,
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      objectiveId: "wobj_become_market_leader",
      objectiveTitle: "Become Market Leader",
      kpiId: "wkpi_revenue_growth",
      progressPercent: 70,
      healthStatus: "warning",
    },
  ]);

  const forecastState = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });
  const salesState = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(forecastState.okrSummary.items[0]?.objectiveTitle, "Improve Forecasting");
  assert.equal(salesState.okrSummary.items[0]?.objectiveTitle, "Become Market Leader");
});

test("keeps OKR summary hidden when no object is selected", () => {
  const summary = resolveObjectOkrSummaryState({
    workspaceId: "workspace_a",
    objectId: "",
  });

  assert.equal(summary.visible, false);
  assert.equal(summary.items.length, 0);
});

test("preserves OKR summary workspace isolation", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_sales", objectName: "Sales", objectType: "sales" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    kpiId: "wkpi_revenue_growth",
    kpiName: "Revenue Growth",
  });
  seedOkrBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    objectiveId: "wobj_become_market_leader",
    objectiveTitle: "Become Market Leader",
    kpiId: "wkpi_revenue_growth",
  });

  const isolated = resolveObjectOkrSummaryState({
    workspaceId: "workspace_b",
    objectId: "obj_sales",
  });

  assert.equal(isolated.emptyMessage, "No OKRs linked to this object.");
  assert.equal(isolated.objectiveCount, 0);
});

test("extends existing Object Panel with OKR summary before object actions", () => {
  const panelSource = readFileSync(
    new URL("./WorkspaceObjectIntelligencePanel.tsx", import.meta.url),
    "utf8"
  );
  const actionPanelSource = readFileSync(
    new URL("../ExecutiveActionPanel.tsx", import.meta.url),
    "utf8"
  );

  assert.match(panelSource, /OkrSummarySection/);
  assert.match(panelSource, /KpiSummarySection/);
  assert.match(actionPanelSource, /WorkspaceObjectIntelligencePanel/);
  assert.match(actionPanelSource, /<ActionsSection/);
  assert.ok(panelSource.indexOf("KpiSummarySection") < panelSource.indexOf("OkrSummarySection"));
});

test("does not mutate OKR, KPI, or scene storage when resolving OKR summary", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_sales", objectName: "Sales", objectType: "sales" });
  seedKpiBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    kpiId: "wkpi_revenue_growth",
    kpiName: "Revenue Growth",
  });
  seedOkrBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    objectiveId: "wobj_become_market_leader",
    objectiveTitle: "Become Market Leader",
    kpiId: "wkpi_revenue_growth",
  });

  const before = {
    kpis: window.localStorage.getItem(KPI_STORAGE_KEY),
    objectives: window.localStorage.getItem(OBJECTIVE_STORAGE_KEY),
    okrBindings: window.localStorage.getItem(OKR_KPI_BINDING_STORAGE_KEY),
    okrProgress: window.localStorage.getItem(OKR_PROGRESS_STORAGE_KEY),
    okrHealth: window.localStorage.getItem(OKR_HEALTH_STORAGE_KEY),
    scene: getWorkspaceSceneJson("workspace_a"),
  };

  resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(window.localStorage.getItem(KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(OBJECTIVE_STORAGE_KEY), before.objectives);
  assert.equal(window.localStorage.getItem(OKR_KPI_BINDING_STORAGE_KEY), before.okrBindings);
  assert.equal(window.localStorage.getItem(OKR_PROGRESS_STORAGE_KEY), before.okrProgress);
  assert.equal(window.localStorage.getItem(OKR_HEALTH_STORAGE_KEY), before.okrHealth);
  assert.equal(getWorkspaceSceneJson("workspace_a"), before.scene);
});

test("shows risk summary for Forecast manual walkthrough", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedRiskBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    riskId: "risk_forecast_failure",
    detectionId: "detect_forecast_failure",
    riskTitle: "Forecast Failure Risk",
    severityLevel: "critical",
    priority: "p1",
    severityScore: 100,
  });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(state.riskSummary.bindingCount, 1);
  assert.equal(state.riskSummary.items[0]?.riskTitle, "Forecast Failure Risk");
  assert.equal(state.riskSummary.items[0]?.severityLevelLabel, "Critical");
  assert.equal(state.riskSummary.items[0]?.priorityLabel, "P1");
  assert.equal(state.riskSummary.items[0]?.severityScoreLabel, "100");
});

test("shows risk summary for Sales manual walkthrough", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_sales", objectName: "Sales", objectType: "sales" });
  seedRiskBindings({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    riskId: "risk_growth_execution",
    detectionId: "detect_growth_execution",
    riskTitle: "Growth Execution Risk",
    severityLevel: "high",
    priority: "p2",
    severityScore: 80,
  });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(state.riskSummary.items[0]?.riskTitle, "Growth Execution Risk");
  assert.equal(state.riskSummary.items[0]?.severityLevelLabel, "High");
  assert.equal(state.riskSummary.items[0]?.priorityLabel, "P2");
  assert.equal(state.riskSummary.items[0]?.severityScoreLabel, "80");
});

test("shows risk summary for Warehouse manual walkthrough", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_warehouse", objectName: "Warehouse", objectType: "warehouse" });
  seedRiskBindings({
    workspaceId: "workspace_a",
    objectId: "obj_warehouse",
    riskId: "risk_supply_chain",
    detectionId: "detect_supply_chain",
    riskTitle: "Supply Chain Risk",
    severityLevel: "medium",
    priority: "p3",
    severityScore: 65,
  });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_warehouse",
  });

  assert.equal(state.riskSummary.items[0]?.riskTitle, "Supply Chain Risk");
  assert.equal(state.riskSummary.items[0]?.severityLevelLabel, "Medium");
  assert.equal(state.riskSummary.items[0]?.priorityLabel, "P3");
  assert.equal(state.riskSummary.items[0]?.severityScoreLabel, "65");
});

test("shows multiple risks for object with multiple bindings", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_sales", objectName: "Sales", objectType: "sales" });
  seedRiskBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      riskId: "risk_growth_execution",
      detectionId: "detect_growth_execution",
      riskTitle: "Growth Execution Risk",
      severityLevel: "high",
      priority: "p2",
      severityScore: 80,
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      riskId: "risk_market_expansion",
      detectionId: "detect_market_expansion",
      riskTitle: "Market Expansion Risk",
      severityLevel: "medium",
      priority: "p3",
      severityScore: 65,
    },
  ]);

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(state.riskSummary.bindingCount, 2);
  assert.equal(state.riskSummary.items.length, 2);
});

test("shows empty risk summary when object has no bindings", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });

  const summary = resolveObjectRiskSummaryState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(summary.emptyMessage, "No risks linked to this object.");
  assert.equal(summary.items.length, 0);
});

test("shows missing severity message when binding exists without severity profile", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedRiskBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    riskId: "risk_forecast_failure",
    detectionId: "detect_forecast_failure",
    riskTitle: "Forecast Failure Risk",
    includeSeverity: false,
  });

  const summary = resolveObjectRiskSummaryState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(summary.items.length, 1);
  assert.equal(summary.items[0]?.severityAvailable, false);
  assert.equal(summary.items[0]?.riskTitle, "Forecast Failure Risk");
});

test("switches risk summary when changing selected object", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  appendObjectIntelligenceProfile({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
    objectName: "Sales",
    objectType: "sales",
  });
  seedRiskBindings([
    {
      workspaceId: "workspace_a",
      objectId: "obj_forecast",
      riskId: "risk_forecast_failure",
      detectionId: "detect_forecast_failure",
      riskTitle: "Forecast Failure Risk",
      severityLevel: "critical",
      priority: "p1",
      severityScore: 100,
    },
    {
      workspaceId: "workspace_a",
      objectId: "obj_sales",
      riskId: "risk_growth_execution",
      detectionId: "detect_growth_execution",
      riskTitle: "Growth Execution Risk",
      severityLevel: "high",
      priority: "p2",
      severityScore: 80,
    },
  ]);

  const forecastState = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });
  const salesState = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_sales",
  });

  assert.equal(forecastState.riskSummary.items[0]?.riskTitle, "Forecast Failure Risk");
  assert.equal(salesState.riskSummary.items[0]?.riskTitle, "Growth Execution Risk");
});

test("keeps risk summary hidden when no object is selected", () => {
  const summary = resolveObjectRiskSummaryState({
    workspaceId: "workspace_a",
    objectId: "",
  });

  assert.equal(summary.visible, false);
  assert.equal(summary.items.length, 0);
});

test("preserves risk summary workspace isolation", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedRiskBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    riskId: "risk_forecast_failure",
    detectionId: "detect_forecast_failure",
    riskTitle: "Forecast Failure Risk",
  });

  const isolated = resolveObjectRiskSummaryState({
    workspaceId: "workspace_b",
    objectId: "obj_forecast",
  });

  assert.equal(isolated.emptyMessage, "No risks linked to this object.");
  assert.equal(isolated.bindingCount, 0);
});

test("extends existing Object Panel with risk summary after OKR summary and before object actions", () => {
  const panelSource = readFileSync(
    new URL("./WorkspaceObjectIntelligencePanel.tsx", import.meta.url),
    "utf8"
  );
  const actionPanelSource = readFileSync(
    new URL("../ExecutiveActionPanel.tsx", import.meta.url),
    "utf8"
  );

  assert.match(panelSource, /RiskSummarySection/);
  assert.match(panelSource, /OkrSummarySection/);
  assert.match(panelSource, /KpiSummarySection/);
  assert.match(actionPanelSource, /WorkspaceObjectIntelligencePanel/);
  assert.match(actionPanelSource, /<ActionsSection/);
  assert.ok(panelSource.indexOf("KpiSummarySection") < panelSource.indexOf("OkrSummarySection"));
  assert.ok(panelSource.indexOf("OkrSummarySection") < panelSource.indexOf("RiskSummarySection"));
});

test("does not mutate risk, KPI, OKR, or scene storage when resolving risk summary", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  seedRiskBindings({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
    riskId: "risk_forecast_failure",
    detectionId: "detect_forecast_failure",
    riskTitle: "Forecast Failure Risk",
  });

  const before = {
    riskBindings: window.localStorage.getItem(RISK_BINDING_STORAGE_KEY),
    detectedRisks: window.localStorage.getItem(DETECTED_RISK_STORAGE_KEY),
    severityProfiles: window.localStorage.getItem(RISK_SEVERITY_STORAGE_KEY),
    kpis: window.localStorage.getItem(KPI_STORAGE_KEY),
    objectives: window.localStorage.getItem(OBJECTIVE_STORAGE_KEY),
    scene: getWorkspaceSceneJson("workspace_a"),
  };

  resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: "workspace_a",
    objectId: "obj_forecast",
  });

  assert.equal(window.localStorage.getItem(KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(OBJECTIVE_STORAGE_KEY), before.objectives);
  assert.equal(getWorkspaceSceneJson("workspace_a"), before.scene);
});

test("shows scenario summary for Forecast manual walkthrough", () => {
  const workspace = createWorkspace("Scenario Panel Workspace");
  seedStores({ workspaceId: workspace.workspaceId, objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    description: "Improve forecast accuracy.",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenario.scenario?.scenarioId ?? "");
  runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 })!,
    ],
  });

  const state = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
  });

  assert.equal(state.scenarioSummary.relatedScenarioCount, 1);
  assert.equal(state.scenarioSummary.items[0]?.scenarioName, "Forecast Improvement");
  assert.equal(state.scenarioSummary.items[0]?.simulationStatus, "Completed");
  assert.equal(state.scenarioSummary.timelineStatus, "reserved");
});

test("extends existing Object Panel with scenario summary after risk summary", () => {
  const panelSource = readFileSync(
    new URL("./WorkspaceObjectIntelligencePanel.tsx", import.meta.url),
    "utf8"
  );

  assert.match(panelSource, /ScenarioSummarySection/);
  assert.match(panelSource, /RiskSummarySection/);
  assert.ok(panelSource.indexOf("OkrSummarySection") < panelSource.indexOf("RiskSummarySection"));
  assert.ok(panelSource.indexOf("RiskSummarySection") < panelSource.indexOf("ScenarioSummarySection"));
});

test("does not mutate scenario storage when resolving object scenario summary", () => {
  seedStores({ workspaceId: "workspace_a", objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" });
  const scenario = createWorkspaceScenario({
    workspaceId: "workspace_a",
    name: "Forecast Improvement",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight("workspace_a", scenario.scenario?.scenarioId ?? "");

  const before = window.localStorage.getItem("nexora.workspaceScenarios.v1");
  resolveObjectScenarioSummaryState({ workspaceId: "workspace_a", objectId: "obj_forecast" });
  assert.equal(window.localStorage.getItem("nexora.workspaceScenarios.v1"), before);
});
