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
  getWorkspaceDiscoveredRelationships,
  resetWorkspaceRelationshipsForTests,
} from "./workspaceRelationshipDiscoveryContract.ts";
import { getWorkspaceSyncedSceneObjects, resetWorkspaceSceneSyncForTests } from "./workspaceSceneSync.ts";
import {
  NEXORA_RELATIONSHIP_APPROVAL_LOG_PREFIX,
  WORKSPACE_RELATIONSHIP_APPROVAL_TAGS,
  approveRelationshipCandidate,
  filterRelationshipApprovals,
  getApprovedRelationships,
  getRelationshipApprovalState,
  rejectRelationshipCandidate,
  renameRelationshipType,
  resetWorkspaceRelationshipApprovalStoreForTests,
} from "./workspaceRelationshipApprovalContract.ts";

const DATA_SOURCE_ID = "wds_relationship_approval_entities";
const APPROVAL_STORAGE_KEY = "nexora.workspaceRelationshipApprovals.v1";

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

function seedApprovalWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "relationship_approval_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "relationship_approval_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "relationship_approval_entities.csv",
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
  resetWorkspaceRelationshipsForTests();
  resetWorkspaceSceneSyncForTests();
});

test("exports DS-2:3 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_RELATIONSHIP_APPROVAL_LOG_PREFIX, "[NexoraRelationshipApproval]");
  assert.deepEqual(WORKSPACE_RELATIONSHIP_APPROVAL_TAGS, [
    "[DS23_RELATIONSHIP_APPROVAL]",
    "[RELATIONSHIP_REVIEW_WORKFLOW]",
    "[RELATIONSHIP_APPROVAL_PERSISTED]",
    "[DS24_READY]",
    "[DS_2_3_COMPLETE]",
  ]);
});

test("approves Supplier to Product without creating relationships", () => {
  const workspace = seedApprovalWorkspace(
    "Approve Supplier Product",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const candidate = findApproval(workspace.workspaceId, "supplies");

  const result = approveRelationshipCandidate(
    workspace.workspaceId,
    candidate.candidateRelationshipId
  );

  assert.equal(result.success, true);
  assert.equal(result.approval?.approvalStatus, "approved");
  assert.equal(getApprovedRelationships(workspace.workspaceId).length, 1);
  assert.equal(getWorkspaceDiscoveredRelationships(workspace.workspaceId).length, 0);
});

test("rejects Customer to Product", () => {
  const workspace = seedApprovalWorkspace(
    "Reject Customer Product",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  const candidate = findApproval(workspace.workspaceId, "purchases");

  rejectRelationshipCandidate(workspace.workspaceId, candidate.candidateRelationshipId);

  const state = getRelationshipApprovalState(workspace.workspaceId);
  assert.equal(state.rejectedCount, 1);
  assert.equal(state.approvedCount, 0);
  assert.equal(getApprovedRelationships(workspace.workspaceId).length, 0);
});

test("renames managed_by to owned_by", () => {
  const workspace = seedApprovalWorkspace(
    "Rename Managed By",
    "project_id,project_name,department_id,department_name\n22,Launch,3,Operations\n"
  );
  const candidate = findApproval(workspace.workspaceId, "managed_by");

  const result = renameRelationshipType(
    workspace.workspaceId,
    candidate.candidateRelationshipId,
    "owned_by"
  );

  assert.equal(result.success, true);
  assert.equal(result.approval?.relationshipType, "owned_by");
  assert.equal(result.approval?.relationshipCategory, "Governance");
});

test("supports multiple and mixed approval states", () => {
  const workspace = seedApprovalWorkspace(
    "Mixed Relationship Approvals",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name,region_id,region_name\n1,Acme,10,Global Supply,100,Widget,4,West\n"
  );
  const supplier = findApproval(workspace.workspaceId, "supplies");
  const customer = findApproval(workspace.workspaceId, "purchases");
  const unknown = getRelationshipApprovalState(workspace.workspaceId).approvals.find(
    (approval) => approval.relationshipCategory === "Unknown"
  );
  assert.ok(unknown);

  approveRelationshipCandidate(workspace.workspaceId, supplier.candidateRelationshipId);
  rejectRelationshipCandidate(workspace.workspaceId, customer.candidateRelationshipId);

  const state = getRelationshipApprovalState(workspace.workspaceId);
  assert.equal(state.approvedCount, 1);
  assert.equal(state.rejectedCount, 1);
  assert.ok(state.suggestedCount >= 1);
});

test("persists approvals after reload", () => {
  const workspace = seedApprovalWorkspace(
    "Persist Relationship Approval",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const candidate = findApproval(workspace.workspaceId, "supplies");
  approveRelationshipCandidate(workspace.workspaceId, candidate.candidateRelationshipId);
  const stored = window.localStorage.getItem(APPROVAL_STORAGE_KEY);
  assert.ok(stored);

  resetWorkspaceRelationshipApprovalStoreForTests();
  window.localStorage.setItem(APPROVAL_STORAGE_KEY, stored);

  const state = getRelationshipApprovalState(workspace.workspaceId);
  assert.equal(state.approvedCount, 1);
  assert.equal(state.approvals[0]?.approvalStatus, "approved");
});

test("preserves workspace isolation", () => {
  const workspaceA = seedApprovalWorkspace(
    "Approval Workspace A",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const workspaceB = seedApprovalWorkspace(
    "Approval Workspace B",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  const supplier = findApproval(workspaceA.workspaceId, "supplies");

  approveRelationshipCandidate(workspaceA.workspaceId, supplier.candidateRelationshipId);

  assert.equal(getRelationshipApprovalState(workspaceA.workspaceId).approvedCount, 1);
  assert.equal(getRelationshipApprovalState(workspaceB.workspaceId).approvedCount, 0);
});

test("filters approved and rejected approvals", () => {
  const workspace = seedApprovalWorkspace(
    "Filter Relationship Approvals",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n"
  );
  const supplier = findApproval(workspace.workspaceId, "supplies");
  const customer = findApproval(workspace.workspaceId, "purchases");
  approveRelationshipCandidate(workspace.workspaceId, supplier.candidateRelationshipId);
  rejectRelationshipCandidate(workspace.workspaceId, customer.candidateRelationshipId);

  const approvals = getRelationshipApprovalState(workspace.workspaceId).approvals;

  assert.equal(filterRelationshipApprovals(approvals, { status: "approved" }).length, 1);
  assert.equal(filterRelationshipApprovals(approvals, { status: "rejected" }).length, 1);
  assert.ok(filterRelationshipApprovals(approvals, { category: "Business Flow" }).length >= 2);
  assert.ok(filterRelationshipApprovals(approvals, { strength: "strong" }).length >= 2);
});

test("does not create relationships, scene nodes, or scene mutations", () => {
  const workspace = seedApprovalWorkspace(
    "Relationship Approval Only",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const candidate = findApproval(workspace.workspaceId, "supplies");

  approveRelationshipCandidate(workspace.workspaceId, candidate.candidateRelationshipId);

  assert.equal(getWorkspaceDiscoveredRelationships(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});
