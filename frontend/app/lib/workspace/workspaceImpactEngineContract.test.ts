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
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";
import {
  NEXORA_IMPACT_ENGINE_LOG_PREFIX,
  WORKSPACE_IMPACT_ENGINE_SOURCE,
  WORKSPACE_IMPACT_ENGINE_TAGS,
  calculateObjectImpact,
  getImpactProfile,
  getImpactProfiles,
  resetWorkspaceImpactProfileStoreForTests,
} from "./workspaceImpactEngineContract.ts";

const DATA_SOURCE_ID = "wds_impact_engine_entities";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const IMPACT_STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";

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

function seedImpactWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "impact_engine_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "impact_engine_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "impact_engine_entities.csv",
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

function impact(workspaceId: string, objectId: string) {
  const profile = getImpactProfile(workspaceId, objectId);
  assert.ok(profile, `Expected impact profile ${objectId}`);
  return profile;
}

function seedStoredObjectIntelligenceProfiles(workspaceId: string): void {
  const timestamp = new Date().toISOString();
  const profile = (
    objectId: string,
    relationshipCount: number,
    connectedObjectCount: number
  ) =>
    Object.freeze({
      contractVersion: "DS-3:1",
      objectId,
      workspaceId,
      objectName: objectId.replace(/^obj_/, ""),
      objectType: objectId.replace(/^obj_/, ""),
      originCandidateId: `candidate_${objectId}`,
      originWorkspaceObjectId: objectId,
      relationshipCount,
      incomingRelationshipCount: relationshipCount,
      outgoingRelationshipCount: 0,
      connectedObjectCount,
      intelligenceStatus: "ready",
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-3:1-foundation",
    });
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
      [workspaceId]: {
        obj_low: profile("obj_low", 0, 0),
        obj_medium: profile("obj_medium", 1, 1),
        obj_high: profile("obj_high", 2, 2),
        obj_critical: profile("obj_critical", 4, 4),
      },
    })
  );
  resetWorkspaceObjectIntelligenceStoreForTests();
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
      [workspaceId]: {
        obj_low: profile("obj_low", 0, 0),
        obj_medium: profile("obj_medium", 1, 1),
        obj_high: profile("obj_high", 2, 2),
        obj_critical: profile("obj_critical", 4, 4),
      },
    })
  );
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
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-3:2 tags, source, and diagnostic prefix", () => {
  assert.equal(NEXORA_IMPACT_ENGINE_LOG_PREFIX, "[NexoraImpactEngine]");
  assert.equal(WORKSPACE_IMPACT_ENGINE_SOURCE, "ds-3:2-impact");
  assert.deepEqual(WORKSPACE_IMPACT_ENGINE_TAGS, [
    "[DS32_IMPACT_ENGINE]",
    "[OBJECT_IMPACT_READY]",
    "[IMPACT_SCORE_PERSISTED]",
    "[OBJECT_INTELLIGENCE_EXPANDED]",
    "[DS33_READY]",
    "[DS_3_2_COMPLETE]",
  ]);
});

test("calculates single object low impact", () => {
  const workspace = seedImpactWorkspace(
    "Single Impact Object",
    "customer_id,customer_name\n1,Acme\n"
  );
  buildObjectIntelligenceProfiles(workspace.workspaceId);

  const result = calculateObjectImpact(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(result.impactProfiles.length, 1);
  const customer = result.impactProfiles[0];
  assert.ok(customer);
  assert.equal(customer.objectId, "obj_customer");
  assert.equal(customer.impactScore, 0);
  assert.equal(customer.impactLevel, "Low");
  assert.equal(customer.relationshipCount, 0);
  assert.equal(customer.connectedObjectCount, 0);
  assert.equal(customer.source, WORKSPACE_IMPACT_ENGINE_SOURCE);
});

test("assigns low, medium, high, and critical impact levels", () => {
  const workspace = createWorkspace("Impact Level Boundaries");
  seedStoredObjectIntelligenceProfiles(workspace.workspaceId);

  const result = calculateObjectImpact(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(impact(workspace.workspaceId, "obj_low").impactLevel, "Low");
  assert.equal(impact(workspace.workspaceId, "obj_low").impactScore, 0);
  assert.equal(impact(workspace.workspaceId, "obj_medium").impactLevel, "Medium");
  assert.equal(impact(workspace.workspaceId, "obj_medium").impactScore, 25);
  assert.equal(impact(workspace.workspaceId, "obj_high").impactLevel, "High");
  assert.equal(impact(workspace.workspaceId, "obj_high").impactScore, 50);
  assert.equal(impact(workspace.workspaceId, "obj_critical").impactLevel, "Critical");
  assert.equal(impact(workspace.workspaceId, "obj_critical").impactScore, 100);
});

test("calculates impact from DS-3:1 relationship metrics", () => {
  const workspace = seedImpactWorkspace(
    "Relationship Impact Metrics",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["purchases", "supplies"]);
  buildObjectIntelligenceProfiles(workspace.workspaceId);

  calculateObjectImpact(workspace.workspaceId);

  const product = impact(workspace.workspaceId, "obj_product");
  assert.equal(product.relationshipCount, 2);
  assert.equal(product.connectedObjectCount, 2);
  assert.equal(product.impactScore, 100);
  assert.equal(product.impactLevel, "Critical");
});

test("generates impact reasons", () => {
  const workspace = seedImpactWorkspace(
    "Impact Reason",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  buildObjectIntelligenceProfiles(workspace.workspaceId);
  calculateObjectImpact(workspace.workspaceId);

  const product = impact(workspace.workspaceId, "obj_product");

  assert.match(product.impactReason, /1 relationship/);
  assert.match(product.impactReason, /1 connected object/);
  assert.match(product.impactReason, /central model position|limited influence/);
});

test("preserves workspace isolation", () => {
  const workspaceA = seedImpactWorkspace(
    "Impact Workspace A",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const workspaceB = seedImpactWorkspace(
    "Impact Workspace B",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationships(workspaceA.workspaceId, ["supplies"]);
  buildObjectIntelligenceProfiles(workspaceA.workspaceId);
  buildObjectIntelligenceProfiles(workspaceB.workspaceId);

  calculateObjectImpact(workspaceA.workspaceId);

  assert.equal(getImpactProfiles(workspaceA.workspaceId).length, 2);
  assert.equal(getImpactProfiles(workspaceB.workspaceId).length, 0);
});

test("persists impact profiles and reloads from storage", () => {
  const workspace = seedImpactWorkspace(
    "Persist Impact Profiles",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  buildObjectIntelligenceProfiles(workspace.workspaceId);
  calculateObjectImpact(workspace.workspaceId);
  const stored = window.localStorage.getItem(IMPACT_STORAGE_KEY);
  assert.ok(stored);

  resetWorkspaceImpactProfileStoreForTests();
  window.localStorage.setItem(IMPACT_STORAGE_KEY, stored);

  assert.equal(getImpactProfiles(workspace.workspaceId).length, 2);
  assert.equal(impact(workspace.workspaceId, "obj_product").impactLevel, "Critical");
});

test("does not mutate scene, topology, dashboard, or create non-impact scores", () => {
  const workspace = seedImpactWorkspace(
    "No Scene Impact",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["purchases"]);
  buildObjectIntelligenceProfiles(workspace.workspaceId);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);

  calculateObjectImpact(workspace.workspaceId);

  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);
  assert.equal(
    getImpactProfiles(workspace.workspaceId).some(
      (entry) =>
        "dependencyScore" in entry ||
        "confidenceScore" in entry ||
        "importanceScore" in entry ||
        "recommendations" in entry ||
        "risks" in entry
    ),
    false
  );
});
