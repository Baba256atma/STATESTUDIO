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
  getWorkspaceDiscoveredRelationships,
  resetWorkspaceRelationshipsForTests,
} from "./workspaceRelationshipDiscoveryContract.ts";
import { getWorkspaceSyncedSceneObjects, resetWorkspaceSceneSyncForTests } from "./workspaceSceneSync.ts";
import {
  NEXORA_RELATIONSHIP_DISCOVERY_LOG_PREFIX,
  WORKSPACE_RELATIONSHIP_CANDIDATE_TAGS,
  discoverCandidateRelationships,
  getCandidateRelationship,
  getCandidateRelationships,
  resetWorkspaceRelationshipCandidateStoreForTests,
  type WorkspaceRelationshipCandidateType,
} from "./workspaceRelationshipCandidateContract.ts";

const DATA_SOURCE_ID = "wds_relationship_entities";

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

function seedRelationshipWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "relationship_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "relationship_entities.csv",
      csvText,
    }),
  });
  const schema = discoverAndSaveWorkspaceDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    fileName: "relationship_entities.csv",
    csvText,
  });
  assert.equal(schema.success, true, schema.reason);
  assert.equal(classifyDataSourceColumns(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  assert.equal(discoverCandidateObjects(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  syncApprovalStatesForDataSource(workspace.workspaceId, DATA_SOURCE_ID).forEach((candidate) => {
    approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, candidate.candidateId);
  });
  const created = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(created.success, true, created.reason);
  return workspace;
}

function findCandidate(
  workspaceId: string,
  sourceObjectName: string,
  targetObjectName: string,
  relationshipType: WorkspaceRelationshipCandidateType
) {
  const objects = getWorkspaceCreatedObjects(workspaceId);
  const source = objects.find((object) => object.objectName === sourceObjectName);
  const target = objects.find((object) => object.objectName === targetObjectName);
  assert.ok(source, `Expected source object ${sourceObjectName}`);
  assert.ok(target, `Expected target object ${targetObjectName}`);
  const candidate = getCandidateRelationships(workspaceId).find(
    (entry) =>
      entry.sourceObjectId === source.objectId &&
      entry.targetObjectId === target.objectId &&
      entry.relationshipType === relationshipType
  );
  assert.ok(candidate, `Expected ${sourceObjectName} -> ${targetObjectName} ${relationshipType}`);
  return candidate;
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
  resetWorkspaceRelationshipsForTests();
  resetWorkspaceSceneSyncForTests();
});

test("exports DS-2:1 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_RELATIONSHIP_DISCOVERY_LOG_PREFIX, "[NexoraRelationshipDiscovery]");
  assert.deepEqual(WORKSPACE_RELATIONSHIP_CANDIDATE_TAGS, [
    "[DS21_RELATIONSHIP_DISCOVERY]",
    "[RELATIONSHIP_CANDIDATES_READY]",
    "[RELATIONSHIP_DIRECTION_ENGINE]",
    "[RELATIONSHIP_DISCOVERY_PERSISTED]",
    "[DS22_READY]",
    "[DS_2_1_COMPLETE]",
  ]);
});

test("discovers Customer to Product purchases candidate", () => {
  const workspace = seedRelationshipWorkspace(
    "Customer Product Relationship",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );

  const result = discoverCandidateRelationships(workspace.workspaceId);

  assert.equal(result.success, true);
  const candidate = findCandidate(workspace.workspaceId, "Customer", "Product", "purchases");
  assert.equal(candidate.direction, "source_to_target");
  assert.equal(candidate.status, "suggested");
  assert.ok(candidate.confidence >= 0.75);
  assert.match(candidate.reason, /purchase/i);
});

test("discovers Supplier to Product supplies candidate", () => {
  const workspace = seedRelationshipWorkspace(
    "Supplier Product Relationship",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );

  discoverCandidateRelationships(workspace.workspaceId);

  const candidate = findCandidate(workspace.workspaceId, "Supplier", "Product", "supplies");
  assert.ok(candidate.confidence >= 0.8);
});

test("discovers Employee to Department belongs_to candidate", () => {
  const workspace = seedRelationshipWorkspace(
    "Employee Department Relationship",
    "employee_id,employee_name,department_id,department_name\n7,Ada,3,Operations\n"
  );

  discoverCandidateRelationships(workspace.workspaceId);

  const candidate = findCandidate(workspace.workspaceId, "Employee", "Department", "belongs_to");
  assert.ok(candidate.confidence >= 0.85);
});

test("discovers Project to Department managed_by candidate", () => {
  const workspace = seedRelationshipWorkspace(
    "Project Department Relationship",
    "project_id,project_name,department_id,department_name\n22,Launch,3,Operations\n"
  );

  discoverCandidateRelationships(workspace.workspaceId);

  const candidate = findCandidate(workspace.workspaceId, "Project", "Department", "managed_by");
  assert.ok(candidate.confidence >= 0.7);
});

test("supports multiple candidates and unknown combinations", () => {
  const workspace = seedRelationshipWorkspace(
    "Multiple Relationship Candidates",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name,region_id,region_name\n1,Acme,10,Global Supply,100,Widget,4,West\n"
  );

  discoverCandidateRelationships(workspace.workspaceId);

  assert.ok(getCandidateRelationships(workspace.workspaceId).length >= 3);
  assert.ok(findCandidate(workspace.workspaceId, "Customer", "Product", "purchases"));
  assert.ok(findCandidate(workspace.workspaceId, "Supplier", "Product", "supplies"));
  assert.ok(
    getCandidateRelationships(workspace.workspaceId).some((candidate) =>
      ["related_to", "unknown"].includes(candidate.relationshipType)
    )
  );
});

test("persists candidates and reads single candidate by id", () => {
  const workspace = seedRelationshipWorkspace(
    "Persist Relationship Candidates",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );

  discoverCandidateRelationships(workspace.workspaceId);
  const candidate = findCandidate(workspace.workspaceId, "Customer", "Product", "purchases");
  const stored = getCandidateRelationship(workspace.workspaceId, candidate.candidateRelationshipId);

  assert.deepEqual(stored, candidate);
});

test("preserves workspace isolation", () => {
  const workspaceA = seedRelationshipWorkspace(
    "Relationship Workspace A",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  const workspaceB = seedRelationshipWorkspace(
    "Relationship Workspace B",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );

  discoverCandidateRelationships(workspaceA.workspaceId);

  assert.ok(getCandidateRelationships(workspaceA.workspaceId).length > 0);
  assert.equal(getCandidateRelationships(workspaceB.workspaceId).length, 0);
});

test("does not create relationships, scene nodes, or scene mutations", () => {
  const workspace = seedRelationshipWorkspace(
    "Relationship Discovery Only",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );

  discoverCandidateRelationships(workspace.workspaceId);

  assert.equal(getWorkspaceDiscoveredRelationships(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});
