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
  getWorkspaceCreatedObjects,
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
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";
import {
  NEXORA_OBJECT_INTELLIGENCE_LOG_PREFIX,
  WORKSPACE_OBJECT_INTELLIGENCE_SOURCE,
  WORKSPACE_OBJECT_INTELLIGENCE_TAGS,
  buildObjectIntelligenceProfiles,
  getObjectIntelligenceProfile,
  getObjectIntelligenceProfiles,
  resetWorkspaceObjectIntelligenceStoreForTests,
} from "./workspaceObjectIntelligenceContract.ts";

const DATA_SOURCE_ID = "wds_object_intelligence_entities";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";

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

function seedObjectIntelligenceWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "object_intelligence_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "object_intelligence_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "object_intelligence_entities.csv",
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

function createApprovedRelationshipSet(
  workspaceId: string,
  relationshipTypes: readonly string[]
): void {
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

function profile(workspaceId: string, objectId: string) {
  const match = getObjectIntelligenceProfile(workspaceId, objectId);
  assert.ok(match, `Expected object intelligence profile ${objectId}`);
  return match;
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
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-3:1 tags, source, and diagnostic prefix", () => {
  assert.equal(NEXORA_OBJECT_INTELLIGENCE_LOG_PREFIX, "[NexoraObjectIntelligence]");
  assert.equal(WORKSPACE_OBJECT_INTELLIGENCE_SOURCE, "ds-3:1-foundation");
  assert.deepEqual(WORKSPACE_OBJECT_INTELLIGENCE_TAGS, [
    "[DS31_OBJECT_INTELLIGENCE]",
    "[OBJECT_INTELLIGENCE_FOUNDATION]",
    "[OBJECT_PROFILE_PERSISTED]",
    "[OBJECT_RELATIONSHIP_METRICS_READY]",
    "[DS32_READY]",
    "[DS_3_1_COMPLETE]",
  ]);
});

test("builds a single object profile without scoring", () => {
  const workspace = seedObjectIntelligenceWorkspace(
    "Single Object Intelligence",
    "customer_id,customer_name\n1,Acme\n"
  );

  const result = buildObjectIntelligenceProfiles(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(result.profiles.length, 1);
  const customer = result.profiles[0];
  assert.ok(customer);
  assert.equal(customer.objectId, "obj_customer");
  assert.equal(customer.objectName, "Customer");
  assert.equal(customer.objectType, "customer");
  assert.match(customer.originCandidateId ?? "", /customer/);
  assert.equal(customer.originWorkspaceObjectId, "obj_customer");
  assert.equal(customer.relationshipCount, 0);
  assert.equal(customer.incomingRelationshipCount, 0);
  assert.equal(customer.outgoingRelationshipCount, 0);
  assert.equal(customer.connectedObjectCount, 0);
  assert.equal(customer.intelligenceStatus, "ready");
  assert.equal(customer.source, WORKSPACE_OBJECT_INTELLIGENCE_SOURCE);
  assert.equal("impactScore" in customer, false);
  assert.equal("dependencyScore" in customer, false);
  assert.equal("confidenceScore" in customer, false);
  assert.equal("importanceScore" in customer, false);
});

test("calculates outgoing and incoming relationship metrics", () => {
  const workspace = seedObjectIntelligenceWorkspace(
    "Supplier Product Intelligence",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  createApprovedRelationshipSet(workspace.workspaceId, ["supplies"]);

  buildObjectIntelligenceProfiles(workspace.workspaceId);

  const supplier = profile(workspace.workspaceId, "obj_supplier");
  assert.equal(supplier.relationshipCount, 1);
  assert.equal(supplier.outgoingRelationshipCount, 1);
  assert.equal(supplier.incomingRelationshipCount, 0);
  assert.equal(supplier.connectedObjectCount, 1);

  const product = profile(workspace.workspaceId, "obj_product");
  assert.equal(product.relationshipCount, 1);
  assert.equal(product.outgoingRelationshipCount, 0);
  assert.equal(product.incomingRelationshipCount, 1);
  assert.equal(product.connectedObjectCount, 1);
});

test("calculates multiple relationship metrics and connected object counts", () => {
  const workspace = seedObjectIntelligenceWorkspace(
    "Multiple Object Intelligence",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name,employee_id,employee_name,department_id,department_name,project_id,project_name\n1,Acme,10,Global Supply,100,Widget,5,Ada,20,Operations,50,Atlas\n"
  );
  createApprovedRelationshipSet(workspace.workspaceId, [
    "purchases",
    "supplies",
    "belongs_to",
    "managed_by",
  ]);

  buildObjectIntelligenceProfiles(workspace.workspaceId);

  const product = profile(workspace.workspaceId, "obj_product");
  assert.equal(product.relationshipCount, 2);
  assert.equal(product.incomingRelationshipCount, 2);
  assert.equal(product.outgoingRelationshipCount, 0);
  assert.equal(product.connectedObjectCount, 2);

  const department = profile(workspace.workspaceId, "obj_department");
  assert.equal(department.relationshipCount, 2);
  assert.equal(department.incomingRelationshipCount, 2);
  assert.equal(department.outgoingRelationshipCount, 0);
  assert.equal(department.connectedObjectCount, 2);
});

test("preserves workspace isolation", () => {
  const workspaceA = seedObjectIntelligenceWorkspace(
    "Intelligence Workspace A",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const workspaceB = seedObjectIntelligenceWorkspace(
    "Intelligence Workspace B",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  createApprovedRelationshipSet(workspaceA.workspaceId, ["supplies"]);

  buildObjectIntelligenceProfiles(workspaceA.workspaceId);

  assert.equal(getObjectIntelligenceProfiles(workspaceA.workspaceId).length, 2);
  assert.equal(getObjectIntelligenceProfiles(workspaceB.workspaceId).length, 0);
});

test("persists profiles and reloads from storage", () => {
  const workspace = seedObjectIntelligenceWorkspace(
    "Persist Object Intelligence",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  createApprovedRelationshipSet(workspace.workspaceId, ["supplies"]);
  buildObjectIntelligenceProfiles(workspace.workspaceId);
  const stored = window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY);
  assert.ok(stored);

  resetWorkspaceObjectIntelligenceStoreForTests();
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, stored);

  assert.equal(getObjectIntelligenceProfiles(workspace.workspaceId).length, 2);
  assert.equal(profile(workspace.workspaceId, "obj_product").incomingRelationshipCount, 1);
});

test("rebuild preserves createdAt while updating metrics", () => {
  const workspace = seedObjectIntelligenceWorkspace(
    "Rebuild Object Intelligence",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );

  buildObjectIntelligenceProfiles(workspace.workspaceId);
  const first = profile(workspace.workspaceId, "obj_supplier");
  createApprovedRelationshipSet(workspace.workspaceId, ["supplies"]);
  buildObjectIntelligenceProfiles(workspace.workspaceId);
  const second = profile(workspace.workspaceId, "obj_supplier");

  assert.equal(second.createdAt, first.createdAt);
  assert.equal(second.relationshipCount, 1);
});

test("does not mutate scene, topology, dashboard, or create scoring outputs", () => {
  const workspace = seedObjectIntelligenceWorkspace(
    "No Scene Object Intelligence",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  createApprovedRelationshipSet(workspace.workspaceId, ["purchases"]);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);

  buildObjectIntelligenceProfiles(workspace.workspaceId);

  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);
  const profiles = getObjectIntelligenceProfiles(workspace.workspaceId);
  assert.equal(profiles.length, getWorkspaceCreatedObjects(workspace.workspaceId).length);
  assert.equal(
    profiles.some(
      (entry) =>
        "recommendations" in entry ||
        "risks" in entry ||
        "kpis" in entry ||
        "impactScore" in entry ||
        "dependencyScore" in entry ||
        "confidenceScore" in entry
    ),
    false
  );
});
