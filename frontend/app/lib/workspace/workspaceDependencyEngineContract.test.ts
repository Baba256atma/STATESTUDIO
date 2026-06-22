import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import {
  approveCandidateObject,
  resetWorkspaceObjectApprovalStoreForTests,
  syncApprovalStatesForDataSource,
} from "./workspaceObjectApprovalRuntime.ts";
import {
  createWorkspaceObjectsFromApprovedCandidates,
  resetWorkspaceObjectCreationStoreForTests,
} from "./workspaceObjectCreationPipeline.ts";
import {
  discoverCandidateObjects,
  resetWorkspaceCandidateObjectStoreForTests,
} from "./workspaceCandidateObjectDiscoveryEngine.ts";
import {
  classifyDataSourceColumns,
  resetWorkspaceColumnClassificationStoreForTests,
} from "./workspaceColumnClassificationEngine.ts";
import { importWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import { resetWorkspaceDataSourcesForTests } from "./workspaceDataSourceRegistry.ts";
import {
  discoverAndSaveWorkspaceDataSourceSchema,
  resetWorkspaceDataSourceSchemaRegistryForTests,
} from "./workspaceDataSourceSchemaResolver.ts";
import {
  discoverCandidateRelationships,
  resetWorkspaceRelationshipCandidateStoreForTests,
} from "./workspaceRelationshipCandidateContract.ts";
import {
  classifyCandidateRelationships,
  resetWorkspaceRelationshipClassificationStoreForTests,
} from "./workspaceRelationshipClassificationContract.ts";
import {
  approveRelationshipCandidate,
  getRelationshipApprovalState,
  resetWorkspaceRelationshipApprovalStoreForTests,
} from "./workspaceRelationshipApprovalContract.ts";
import {
  createApprovedRelationships,
  resetWorkspaceRelationshipCreationStoreForTests,
} from "./workspaceRelationshipCreationContract.ts";
import {
  buildObjectIntelligenceProfiles,
  resetWorkspaceObjectIntelligenceStoreForTests,
} from "./workspaceObjectIntelligenceContract.ts";
import {
  calculateObjectImpact,
  resetWorkspaceImpactProfileStoreForTests,
} from "./workspaceImpactEngineContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";
import {
  NEXORA_DEPENDENCY_ENGINE_LOG_PREFIX,
  WORKSPACE_DEPENDENCY_ENGINE_SOURCE,
  WORKSPACE_DEPENDENCY_ENGINE_TAGS,
  calculateObjectDependency,
  getDependencyProfile,
  getDependencyProfiles,
  resetWorkspaceDependencyProfileStoreForTests,
} from "./workspaceDependencyEngineContract.ts";

const DATA_SOURCE_ID = "wds_dependency_engine_entities";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const DEPENDENCY_STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";

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

function seedDependencyWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "dependency_engine_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "dependency_engine_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "dependency_engine_entities.csv",
      csvText,
    }).success,
    true
  );
  assert.equal(classifyDataSourceColumns(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  assert.equal(discoverCandidateObjects(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  syncApprovalStatesForDataSource(workspace.workspaceId, DATA_SOURCE_ID).forEach((candidate) => {
    approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, candidate.candidateId);
  });
  assert.equal(
    createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID).success,
    true
  );
  return workspace;
}

function approveRelationships(workspaceId: string, relationshipTypes: readonly string[]): void {
  assert.equal(discoverCandidateRelationships(workspaceId).success, true);
  assert.equal(classifyCandidateRelationships(workspaceId).success, true);
  const approvals = getRelationshipApprovalState(workspaceId).approvals;
  for (const relationshipType of relationshipTypes) {
    const approval = approvals.find((entry) => entry.relationshipType === relationshipType);
    assert.ok(approval, `Expected approval ${relationshipType}`);
    assert.equal(approveRelationshipCandidate(workspaceId, approval.candidateRelationshipId).success, true);
  }
  assert.equal(createApprovedRelationships(workspaceId).success, true);
}

function buildPrerequisiteSignals(workspaceId: string): void {
  assert.equal(buildObjectIntelligenceProfiles(workspaceId).success, true);
  assert.equal(calculateObjectImpact(workspaceId).success, true);
}

function dependency(workspaceId: string, objectId: string) {
  const profile = getDependencyProfile(workspaceId, objectId);
  assert.ok(profile, `Expected dependency profile ${objectId}`);
  return profile;
}

function seedStoredObjectIntelligenceProfiles(workspaceId: string): void {
  const timestamp = new Date().toISOString();
  const profile = (
    objectId: string,
    incomingRelationshipCount: number
  ) =>
    Object.freeze({
      contractVersion: "DS-3:1",
      objectId,
      workspaceId,
      objectName: objectId.replace(/^obj_/, ""),
      objectType: objectId.replace(/^obj_/, ""),
      originCandidateId: `candidate_${objectId}`,
      originWorkspaceObjectId: objectId,
      relationshipCount: incomingRelationshipCount,
      incomingRelationshipCount,
      outgoingRelationshipCount: 0,
      connectedObjectCount: incomingRelationshipCount,
      intelligenceStatus: "ready",
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-3:1-foundation",
    });
  const store = {
    [workspaceId]: {
      obj_low: profile("obj_low", 0),
      obj_medium: profile("obj_medium", 1),
      obj_high: profile("obj_high", 2),
      obj_critical: profile("obj_critical", 4),
    },
  };
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, JSON.stringify(store));
  resetWorkspaceObjectIntelligenceStoreForTests();
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, JSON.stringify(store));
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceDataSourceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationStoreForTests();
  resetWorkspaceCandidateObjectStoreForTests();
  resetWorkspaceObjectApprovalStoreForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCandidateStoreForTests();
  resetWorkspaceRelationshipClassificationStoreForTests();
  resetWorkspaceRelationshipApprovalStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceImpactProfileStoreForTests();
  resetWorkspaceDependencyProfileStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-3:3 tags, source, and diagnostic prefix", () => {
  assert.equal(NEXORA_DEPENDENCY_ENGINE_LOG_PREFIX, "[NexoraDependencyEngine]");
  assert.equal(WORKSPACE_DEPENDENCY_ENGINE_SOURCE, "ds-3:3-dependency");
  assert.deepEqual(WORKSPACE_DEPENDENCY_ENGINE_TAGS, [
    "[DS33_DEPENDENCY_ENGINE]",
    "[OBJECT_DEPENDENCY_READY]",
    "[DEPENDENCY_SCORE_PERSISTED]",
    "[OBJECT_INTELLIGENCE_EXPANDED]",
    "[DS34_READY]",
    "[DS_3_3_COMPLETE]",
  ]);
});

test("calculates single object low dependency", () => {
  const workspace = seedDependencyWorkspace(
    "Single Dependency Object",
    "customer_id,customer_name\n1,Acme\n"
  );
  buildPrerequisiteSignals(workspace.workspaceId);

  const result = calculateObjectDependency(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(result.dependencyProfiles.length, 1);
  const customer = result.dependencyProfiles[0];
  assert.ok(customer);
  assert.equal(customer.objectId, "obj_customer");
  assert.equal(customer.dependencyScore, 0);
  assert.equal(customer.dependencyLevel, "Low");
  assert.equal(customer.incomingRelationshipCount, 0);
  assert.equal(customer.dependentObjectCount, 0);
  assert.equal(customer.source, WORKSPACE_DEPENDENCY_ENGINE_SOURCE);
});

test("assigns low, medium, high, and critical dependency levels", () => {
  const workspace = createWorkspace("Dependency Level Boundaries");
  seedStoredObjectIntelligenceProfiles(workspace.workspaceId);

  const result = calculateObjectDependency(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(dependency(workspace.workspaceId, "obj_low").dependencyLevel, "Low");
  assert.equal(dependency(workspace.workspaceId, "obj_low").dependencyScore, 0);
  assert.equal(dependency(workspace.workspaceId, "obj_medium").dependencyLevel, "Medium");
  assert.equal(dependency(workspace.workspaceId, "obj_medium").dependencyScore, 25);
  assert.equal(dependency(workspace.workspaceId, "obj_high").dependencyLevel, "High");
  assert.equal(dependency(workspace.workspaceId, "obj_high").dependencyScore, 50);
  assert.equal(dependency(workspace.workspaceId, "obj_critical").dependencyLevel, "Critical");
  assert.equal(dependency(workspace.workspaceId, "obj_critical").dependencyScore, 100);
});

test("calculates dependency from incoming relationships and dependent object counts", () => {
  const workspace = seedDependencyWorkspace(
    "Relationship Dependency Metrics",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["purchases", "supplies"]);
  buildPrerequisiteSignals(workspace.workspaceId);

  calculateObjectDependency(workspace.workspaceId);

  const product = dependency(workspace.workspaceId, "obj_product");
  assert.equal(product.incomingRelationshipCount, 2);
  assert.equal(product.dependentObjectCount, 2);
  assert.equal(product.dependencyScore, 100);
  assert.equal(product.dependencyLevel, "Critical");
});

test("generates dependency reasons", () => {
  const workspace = seedDependencyWorkspace(
    "Dependency Reason",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  buildPrerequisiteSignals(workspace.workspaceId);
  calculateObjectDependency(workspace.workspaceId);

  const product = dependency(workspace.workspaceId, "obj_product");

  assert.match(product.dependencyReason, /1 dependent object/);
  assert.match(product.dependencyReason, /1 incoming relationship/);
  assert.match(product.dependencyReason, /central dependency hub|limited model reliance/);
});

test("preserves workspace isolation", () => {
  const workspaceA = seedDependencyWorkspace(
    "Dependency Workspace A",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const workspaceB = seedDependencyWorkspace(
    "Dependency Workspace B",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationships(workspaceA.workspaceId, ["supplies"]);
  buildPrerequisiteSignals(workspaceA.workspaceId);
  buildObjectIntelligenceProfiles(workspaceB.workspaceId);

  calculateObjectDependency(workspaceA.workspaceId);

  assert.equal(getDependencyProfiles(workspaceA.workspaceId).length, 2);
  assert.equal(getDependencyProfiles(workspaceB.workspaceId).length, 0);
});

test("persists dependency profiles and reloads from storage", () => {
  const workspace = seedDependencyWorkspace(
    "Persist Dependency Profiles",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  buildPrerequisiteSignals(workspace.workspaceId);
  calculateObjectDependency(workspace.workspaceId);
  const stored = window.localStorage.getItem(DEPENDENCY_STORAGE_KEY);
  assert.ok(stored);

  resetWorkspaceDependencyProfileStoreForTests();
  window.localStorage.setItem(DEPENDENCY_STORAGE_KEY, stored);

  assert.equal(getDependencyProfiles(workspace.workspaceId).length, 2);
  assert.equal(dependency(workspace.workspaceId, "obj_product").dependencyLevel, "Critical");
});

test("does not mutate scene, topology, dashboard, or create non-dependency outputs", () => {
  const workspace = seedDependencyWorkspace(
    "No Scene Dependency",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["purchases"]);
  buildPrerequisiteSignals(workspace.workspaceId);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);

  calculateObjectDependency(workspace.workspaceId);

  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);
  assert.equal(
    getDependencyProfiles(workspace.workspaceId).some(
      (entry) =>
        "confidenceScore" in entry ||
        "importanceScore" in entry ||
        "recommendations" in entry ||
        "risks" in entry
    ),
    false
  );
});
