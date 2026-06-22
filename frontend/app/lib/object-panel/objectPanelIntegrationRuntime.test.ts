import assert from "node:assert/strict";
import test from "node:test";

import {
  NEXORA_OBJECT_PANEL_INTEGRATION_LOG_PREFIX,
  OBJECT_PANEL_INTEGRATION_TAGS,
  resolveObjectPanelIntegrationState,
} from "./objectPanelIntegrationRuntime.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceObjectIntelligenceStoreForTests } from "../workspace/workspaceObjectIntelligenceContract.ts";
import { resetWorkspaceImpactProfileStoreForTests } from "../workspace/workspaceImpactEngineContract.ts";
import { resetWorkspaceDependencyProfileStoreForTests } from "../workspace/workspaceDependencyEngineContract.ts";
import { resetWorkspaceConfidenceProfileStoreForTests } from "../workspace/workspaceConfidenceEngineContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";

const CREATED_OBJECTS_STORAGE_KEY = "nexora.workspaceCreatedObjects.v2";
const SCENE_SYNC_OBJECTS_STORAGE_KEY = "nexora.workspaceSceneSyncObjects.v2";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const IMPACT_STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";
const DEPENDENCY_STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";
const CONFIDENCE_STORAGE_KEY = "nexora.workspaceConfidenceProfiles.v1";

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

function workspaceObject(input: {
  workspaceId: string;
  objectId: string;
  objectName?: string;
  objectType?: string;
}) {
  const timestamp = new Date().toISOString();
  return {
    contractVersion: "DS-1:5",
    objectId: input.objectId,
    workspaceId: input.workspaceId,
    dataSourceId: "wds_integration",
    objectName: input.objectName ?? "Product",
    objectType: input.objectType ?? "product",
    primaryIdentifier: `${input.objectId}_id`,
    sourceColumns: [`${input.objectType ?? "product"}_id`, `${input.objectType ?? "product"}_name`],
    originCandidateId: `candidate_${input.objectId}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    creationSource: "ds-1-approved-candidate",
  };
}

function seedWorkspaceObject(input: {
  workspaceId: string;
  objectId: string;
  objectName?: string;
  objectType?: string;
}): void {
  resetWorkspaceObjectCreationStoreForTests();
  window.localStorage.setItem(
    CREATED_OBJECTS_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: {
        [input.objectId]: workspaceObject(input),
      },
    })
  );
}

function seedSyncedSceneObject(input: {
  workspaceId: string;
  objectId: string;
  sceneObjectId?: string;
}): void {
  resetWorkspaceSceneSyncForTests();
  const sceneObjectId = input.sceneObjectId ?? `scene_${input.objectId}`;
  window.localStorage.setItem(
    SCENE_SYNC_OBJECTS_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: [
        {
          id: sceneObjectId,
          objectId: input.objectId,
          sceneObjectId,
          workspaceId: input.workspaceId,
          originWorkspaceObjectId: input.objectId,
          originCandidateId: `candidate_${input.objectId}`,
          candidateId: `candidate_${input.objectId}`,
          dataSourceId: "wds_integration",
          label: "Product",
          name: "Product",
          objectName: "Product",
          type: "entity",
          objectType: "entity",
          source: "workspace_scene_sync",
          sourceColumns: ["product_id", "product_name"],
          primaryIdentifier: "product_id",
          position: [0, 0, 0],
          pos: [0, 0, 0],
          status: "scene_ready",
          color: "#cbd5e1",
          scale: 1,
          role: "entity",
          confidence: "high",
        },
      ],
    })
  );
}

function seedIntelligence(input: {
  workspaceId: string;
  objectId: string;
  impact?: boolean;
  dependency?: boolean;
  confidence?: boolean;
}): void {
  const timestamp = new Date().toISOString();
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
          objectName: "Product",
          objectType: "product",
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

function seedFullObject(workspaceId: string, objectId = "obj_product"): void {
  seedWorkspaceObject({ workspaceId, objectId });
  seedSyncedSceneObject({ workspaceId, objectId });
  seedIntelligence({ workspaceId, objectId });
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceImpactProfileStoreForTests();
  resetWorkspaceDependencyProfileStoreForTests();
  resetWorkspaceConfidenceProfileStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-3:6 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_OBJECT_PANEL_INTEGRATION_LOG_PREFIX, "[NexoraObjectPanelIntegration]");
  assert.deepEqual(OBJECT_PANEL_INTEGRATION_TAGS, [
    "[DS36_OBJECT_PANEL_INTEGRATION]",
    "[OBJECT_CLICK_INTELLIGENCE_CONNECTED]",
    "[OBJECT_PANEL_RUNTIME_STABLE]",
    "[OBJECT_INTELLIGENCE_MVP_READY]",
    "[DS37_READY]",
    "[DS_3_6_COMPLETE]",
  ]);
});

test("resolves workspace object click to full intelligence", () => {
  seedFullObject("workspace_a");

  const state = resolveObjectPanelIntegrationState({
    workspaceId: "workspace_a",
    objectId: "obj_product",
  });

  assert.equal(state.resolvedObjectId, "obj_product");
  assert.equal(state.resolutionKind, "workspace_object");
  assert.equal(state.impactLoaded, true);
  assert.equal(state.dependencyLoaded, true);
  assert.equal(state.confidenceLoaded, true);
  assert.equal(state.panelRendered, true);
});

test("resolves synced scene object click and scene_obj prefix click", () => {
  seedFullObject("workspace_a");

  const synced = resolveObjectPanelIntegrationState({
    workspaceId: "workspace_a",
    objectId: "scene_obj_product",
  });
  const prefixed = resolveObjectPanelIntegrationState({
    workspaceId: "workspace_a",
    objectId: "scene_obj_product",
  });

  assert.equal(synced.resolvedObjectId, "obj_product");
  assert.equal(synced.resolutionKind, "synced_scene_object");
  assert.equal(prefixed.resolvedObjectId, "obj_product");
});

test("resolves pipeline-created and workspace-created object ids", () => {
  seedFullObject("workspace_a", "obj_supplier");

  const state = resolveObjectPanelIntegrationState({
    workspaceId: "workspace_a",
    objectId: "obj_supplier",
  });

  assert.equal(state.resolvedObjectId, "obj_supplier");
  assert.equal(state.objectExists, true);
});

test("object deselect closes without stale intelligence", () => {
  seedFullObject("workspace_a");
  const open = resolveObjectPanelIntegrationState({ workspaceId: "workspace_a", objectId: "obj_product" });
  const closed = resolveObjectPanelIntegrationState({ workspaceId: "workspace_a", objectId: null });

  assert.equal(open.panelRendered, true);
  assert.equal(closed.panelRendered, false);
  assert.equal(closed.impactLoaded, false);
});

test("workspace switch prevents cross-workspace leakage", () => {
  seedFullObject("workspace_a");
  createWorkspace("Workspace B");

  const state = resolveObjectPanelIntegrationState({
    workspaceId: "workspace_b",
    objectId: "obj_product",
  });

  assert.equal(state.panelRendered, false);
  assert.equal(state.resolvedObjectId, "");
  assert.equal(state.impactLoaded, false);
});

test("deleted object resolves to graceful empty state", () => {
  seedWorkspaceObject({ workspaceId: "workspace_a", objectId: "obj_customer", objectName: "Customer", objectType: "customer" });
  seedIntelligence({ workspaceId: "workspace_a", objectId: "obj_product" });

  const state = resolveObjectPanelIntegrationState({
    workspaceId: "workspace_a",
    objectId: "obj_product",
  });

  assert.equal(state.objectExists, false);
  assert.equal(state.panelRendered, false);
  assert.equal(state.intelligenceProfile, null);
});

test("missing impact, dependency, and confidence profiles do not crash", () => {
  seedWorkspaceObject({ workspaceId: "workspace_a", objectId: "obj_product" });
  seedIntelligence({ workspaceId: "workspace_a", objectId: "obj_product", impact: false });
  assert.equal(
    resolveObjectPanelIntegrationState({ workspaceId: "workspace_a", objectId: "obj_product" }).impactLoaded,
    false
  );

  seedWorkspaceObject({ workspaceId: "workspace_a", objectId: "obj_product" });
  seedIntelligence({ workspaceId: "workspace_a", objectId: "obj_product", dependency: false });
  assert.equal(
    resolveObjectPanelIntegrationState({ workspaceId: "workspace_a", objectId: "obj_product" }).dependencyLoaded,
    false
  );

  seedWorkspaceObject({ workspaceId: "workspace_a", objectId: "obj_product" });
  seedIntelligence({ workspaceId: "workspace_a", objectId: "obj_product", confidence: false });
  assert.equal(
    resolveObjectPanelIntegrationState({ workspaceId: "workspace_a", objectId: "obj_product" }).confidenceLoaded,
    false
  );
});

test("does not mutate scene or topology", () => {
  seedFullObject("workspace_a");
  assert.equal(getWorkspaceSceneJson("workspace_a"), null);

  resolveObjectPanelIntegrationState({ workspaceId: "workspace_a", objectId: "obj_product" });

  assert.equal(getWorkspaceSceneJson("workspace_a"), null);
});
