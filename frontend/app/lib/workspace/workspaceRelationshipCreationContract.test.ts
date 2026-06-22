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
  rejectRelationshipCandidate,
  resetWorkspaceRelationshipApprovalStoreForTests,
} from "./workspaceRelationshipApprovalContract.ts";
import {
  getWorkspaceDiscoveredRelationships,
  resetWorkspaceRelationshipsForTests,
} from "./workspaceRelationshipDiscoveryContract.ts";
import { getWorkspaceSyncedSceneObjects, resetWorkspaceSceneSyncForTests } from "./workspaceSceneSync.ts";
import {
  NEXORA_RELATIONSHIP_CREATION_LOG_PREFIX,
  WORKSPACE_RELATIONSHIP_CREATION_SOURCE,
  WORKSPACE_RELATIONSHIP_CREATION_TAGS,
  createApprovedRelationships,
  getWorkspaceRelationship,
  getWorkspaceRelationships,
  resetWorkspaceRelationshipCreationStoreForTests,
} from "./workspaceRelationshipCreationContract.ts";

const DATA_SOURCE_ID = "wds_relationship_creation_entities";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

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

function seedCreationWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "relationship_creation_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "relationship_creation_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "relationship_creation_entities.csv",
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
  assert.equal(discoverCandidateRelationships(workspace.workspaceId).success, true);
  assert.equal(classifyCandidateRelationships(workspace.workspaceId).success, true);
  return workspace;
}

function findApproval(workspaceId: string, relationshipType: string) {
  const approval = getRelationshipApprovalState(workspaceId).approvals.find(
    (entry) => entry.relationshipType === relationshipType
  );
  assert.ok(approval, `Expected approval ${relationshipType}`);
  return approval;
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
  resetWorkspaceRelationshipsForTests();
  resetWorkspaceSceneSyncForTests();
});

test("exports DS-2:4 tags, source, and diagnostic prefix", () => {
  assert.equal(NEXORA_RELATIONSHIP_CREATION_LOG_PREFIX, "[NexoraRelationshipCreation]");
  assert.equal(WORKSPACE_RELATIONSHIP_CREATION_SOURCE, "ds-2:4-creation");
  assert.deepEqual(WORKSPACE_RELATIONSHIP_CREATION_TAGS, [
    "[DS24_RELATIONSHIP_CREATION]",
    "[WORKSPACE_RELATIONSHIPS_CREATED]",
    "[RELATIONSHIP_TRACEABILITY_ENABLED]",
    "[RELATIONSHIP_CREATION_PERSISTED]",
    "[DS25_READY]",
    "[DS_2_4_COMPLETE]",
  ]);
});

test("creates approved Supplier to Product relationship", () => {
  const workspace = seedCreationWorkspace(
    "Create Supplier Product",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const approval = findApproval(workspace.workspaceId, "supplies");
  approveRelationshipCandidate(workspace.workspaceId, approval.candidateRelationshipId);

  const result = createApprovedRelationships(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(result.createdCount, 1);
  const relationship = result.relationships[0];
  assert.ok(relationship);
  assert.equal(relationship.sourceObjectId, "obj_supplier");
  assert.equal(relationship.targetObjectId, "obj_product");
  assert.equal(relationship.relationshipType, "supplies");
  assert.equal(relationship.source, WORKSPACE_RELATIONSHIP_CREATION_SOURCE);
});

test("creates approved Customer to Product relationship", () => {
  const workspace = seedCreationWorkspace(
    "Create Customer Product",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  const approval = findApproval(workspace.workspaceId, "purchases");
  approveRelationshipCandidate(workspace.workspaceId, approval.candidateRelationshipId);

  createApprovedRelationships(workspace.workspaceId);

  const relationship = getWorkspaceRelationships(workspace.workspaceId)[0];
  assert.ok(relationship);
  assert.equal(relationship.sourceObjectId, "obj_customer");
  assert.equal(relationship.targetObjectId, "obj_product");
  assert.equal(relationship.relationshipType, "purchases");
});

test("ignores suggested and rejected relationships", () => {
  const workspace = seedCreationWorkspace(
    "Ignore Non Approved",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n"
  );
  const customer = findApproval(workspace.workspaceId, "purchases");
  rejectRelationshipCandidate(workspace.workspaceId, customer.candidateRelationshipId);

  const result = createApprovedRelationships(workspace.workspaceId);

  assert.equal(result.success, false);
  assert.equal(result.createdCount, 0);
  assert.equal(getWorkspaceRelationships(workspace.workspaceId).length, 0);
});

test("skips duplicate relationships", () => {
  const workspace = seedCreationWorkspace(
    "Duplicate Relationship Skip",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const approval = findApproval(workspace.workspaceId, "supplies");
  approveRelationshipCandidate(workspace.workspaceId, approval.candidateRelationshipId);

  const first = createApprovedRelationships(workspace.workspaceId);
  const second = createApprovedRelationships(workspace.workspaceId);

  assert.equal(first.createdCount, 1);
  assert.equal(second.createdCount, 0);
  assert.equal(second.duplicateCount, 1);
  assert.equal(getWorkspaceRelationships(workspace.workspaceId).length, 1);
});

test("creates multiple approved relationships", () => {
  const workspace = seedCreationWorkspace(
    "Multiple Relationship Creation",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n"
  );
  approveRelationshipCandidate(
    workspace.workspaceId,
    findApproval(workspace.workspaceId, "purchases").candidateRelationshipId
  );
  approveRelationshipCandidate(
    workspace.workspaceId,
    findApproval(workspace.workspaceId, "supplies").candidateRelationshipId
  );

  const result = createApprovedRelationships(workspace.workspaceId);

  assert.equal(result.createdCount, 2);
  assert.equal(getWorkspaceRelationships(workspace.workspaceId).length, 2);
});

test("persists relationships after reload", () => {
  const workspace = seedCreationWorkspace(
    "Persist Relationship Creation",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationshipCandidate(
    workspace.workspaceId,
    findApproval(workspace.workspaceId, "supplies").candidateRelationshipId
  );
  createApprovedRelationships(workspace.workspaceId);
  const stored = window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY);
  assert.ok(stored);

  resetWorkspaceRelationshipCreationStoreForTests();
  window.localStorage.setItem(RELATIONSHIP_STORAGE_KEY, stored);

  assert.equal(getWorkspaceRelationships(workspace.workspaceId).length, 1);
});

test("preserves workspace isolation", () => {
  const workspaceA = seedCreationWorkspace(
    "Creation Workspace A",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const workspaceB = seedCreationWorkspace(
    "Creation Workspace B",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationshipCandidate(
    workspaceA.workspaceId,
    findApproval(workspaceA.workspaceId, "supplies").candidateRelationshipId
  );

  createApprovedRelationships(workspaceA.workspaceId);

  assert.equal(getWorkspaceRelationships(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceRelationships(workspaceB.workspaceId).length, 0);
});

test("preserves traceability", () => {
  const workspace = seedCreationWorkspace(
    "Relationship Traceability",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const approval = findApproval(workspace.workspaceId, "supplies");
  approveRelationshipCandidate(workspace.workspaceId, approval.candidateRelationshipId);

  createApprovedRelationships(workspace.workspaceId);
  const relationship = getWorkspaceRelationships(workspace.workspaceId)[0];
  assert.ok(relationship);

  assert.equal(relationship.originCandidateRelationshipId, approval.candidateRelationshipId);
  assert.equal(
    getWorkspaceRelationship(workspace.workspaceId, relationship.relationshipId)
      ?.originCandidateRelationshipId,
    approval.candidateRelationshipId
  );
});

test("does not create scene nodes, scene relationships, topology, or rendering state", () => {
  const workspace = seedCreationWorkspace(
    "Relationship Creation Storage Only",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationshipCandidate(
    workspace.workspaceId,
    findApproval(workspace.workspaceId, "supplies").candidateRelationshipId
  );

  createApprovedRelationships(workspace.workspaceId);

  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceDiscoveredRelationships(workspace.workspaceId).length, 0);
});
