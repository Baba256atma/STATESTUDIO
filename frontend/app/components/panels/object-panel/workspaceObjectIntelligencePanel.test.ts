import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX,
  WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
  resolveWorkspaceObjectIntelligencePanelState,
} from "./workspaceObjectIntelligencePanelRuntime.ts";
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

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const IMPACT_STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";
const DEPENDENCY_STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";
const CONFIDENCE_STORAGE_KEY = "nexora.workspaceConfidenceProfiles.v1";

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
});

test("exports DS-3:5 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX, "[NexoraObjectIntelligencePanel]");
  assert.deepEqual(WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS, [
    "[DS35_OBJECT_INTELLIGENCE_PANEL]",
    "[OBJECT_INTELLIGENCE_VISIBLE]",
    "[IMPACT_DEPENDENCY_CONFIDENCE_VISIBLE]",
    "[OBJECT_PANEL_UPGRADED]",
    "[DS36_READY]",
    "[DS_3_5_COMPLETE]",
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
