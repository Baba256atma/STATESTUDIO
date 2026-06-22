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
  calculateObjectDependency,
  resetWorkspaceDependencyProfileStoreForTests,
} from "./workspaceDependencyEngineContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";
import {
  NEXORA_CONFIDENCE_ENGINE_LOG_PREFIX,
  WORKSPACE_CONFIDENCE_ENGINE_SOURCE,
  WORKSPACE_CONFIDENCE_ENGINE_TAGS,
  calculateObjectConfidence,
  getConfidenceProfile,
  getConfidenceProfiles,
  resetWorkspaceConfidenceProfileStoreForTests,
} from "./workspaceConfidenceEngineContract.ts";

const DATA_SOURCE_ID = "wds_confidence_engine_entities";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
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

function seedConfidenceWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "confidence_engine_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "confidence_engine_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "confidence_engine_entities.csv",
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
  assert.equal(calculateObjectDependency(workspaceId).success, true);
}

function confidence(workspaceId: string, objectId: string) {
  const profile = getConfidenceProfile(workspaceId, objectId);
  assert.ok(profile, `Expected confidence profile ${objectId}`);
  return profile;
}

function seedStoredObjectIntelligenceProfiles(workspaceId: string): void {
  const timestamp = new Date().toISOString();
  const profile = (input: {
    objectId: string;
    objectName: string;
    objectType: string;
    originCandidateId: string | null;
    relationshipCount: number;
    incomingRelationshipCount: number;
    outgoingRelationshipCount: number;
    connectedObjectCount: number;
  }) =>
    Object.freeze({
      contractVersion: "DS-3:1",
      objectId: input.objectId,
      workspaceId,
      objectName: input.objectName,
      objectType: input.objectType,
      originCandidateId: input.originCandidateId,
      originWorkspaceObjectId: input.objectId,
      relationshipCount: input.relationshipCount,
      incomingRelationshipCount: input.incomingRelationshipCount,
      outgoingRelationshipCount: input.outgoingRelationshipCount,
      connectedObjectCount: input.connectedObjectCount,
      intelligenceStatus: "ready",
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "ds-3:1-foundation",
    });
  const store = {
    [workspaceId]: {
      obj_low: profile({
        objectId: "obj_low",
        objectName: "",
        objectType: "",
        originCandidateId: null,
        relationshipCount: 0,
        incomingRelationshipCount: 0,
        outgoingRelationshipCount: 0,
        connectedObjectCount: 0,
      }),
      obj_medium: profile({
        objectId: "obj_medium",
        objectName: "Medium",
        objectType: "medium",
        originCandidateId: "candidate_medium",
        relationshipCount: 0,
        incomingRelationshipCount: 0,
        outgoingRelationshipCount: 0,
        connectedObjectCount: 0,
      }),
      obj_high: profile({
        objectId: "obj_high",
        objectName: "High",
        objectType: "high",
        originCandidateId: "candidate_high",
        relationshipCount: 1,
        incomingRelationshipCount: 0,
        outgoingRelationshipCount: 1,
        connectedObjectCount: 1,
      }),
      obj_very_high: profile({
        objectId: "obj_very_high",
        objectName: "Very High",
        objectType: "very_high",
        originCandidateId: "candidate_very_high",
        relationshipCount: 2,
        incomingRelationshipCount: 1,
        outgoingRelationshipCount: 1,
        connectedObjectCount: 2,
      }),
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
  resetWorkspaceConfidenceProfileStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-3:4 tags, source, and diagnostic prefix", () => {
  assert.equal(NEXORA_CONFIDENCE_ENGINE_LOG_PREFIX, "[NexoraConfidenceEngine]");
  assert.equal(WORKSPACE_CONFIDENCE_ENGINE_SOURCE, "ds-3:4-confidence");
  assert.deepEqual(WORKSPACE_CONFIDENCE_ENGINE_TAGS, [
    "[DS34_CONFIDENCE_ENGINE]",
    "[OBJECT_CONFIDENCE_READY]",
    "[CONFIDENCE_SCORE_PERSISTED]",
    "[OBJECT_INTELLIGENCE_TRIAD_READY]",
    "[DS35_READY]",
    "[DS_3_4_COMPLETE]",
  ]);
});

test("calculates single object medium confidence from complete identity", () => {
  const workspace = seedConfidenceWorkspace(
    "Single Confidence Object",
    "customer_id,customer_name\n1,Acme\n"
  );
  buildPrerequisiteSignals(workspace.workspaceId);

  const result = calculateObjectConfidence(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(result.confidenceProfiles.length, 1);
  const customer = result.confidenceProfiles[0];
  assert.ok(customer);
  assert.equal(customer.objectId, "obj_customer");
  assert.equal(customer.relationshipCoverage, 0);
  assert.equal(customer.connectionEvidence, 0);
  assert.equal(customer.profileCompleteness, 100);
  assert.equal(customer.confidenceScore, 25);
  assert.equal(customer.confidenceLevel, "Medium");
  assert.equal(customer.source, WORKSPACE_CONFIDENCE_ENGINE_SOURCE);
});

test("assigns low, medium, high, and very high confidence levels", () => {
  const workspace = createWorkspace("Confidence Level Boundaries");
  seedStoredObjectIntelligenceProfiles(workspace.workspaceId);

  const result = calculateObjectConfidence(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(confidence(workspace.workspaceId, "obj_low").confidenceLevel, "Low");
  assert.equal(confidence(workspace.workspaceId, "obj_low").confidenceScore, 15);
  assert.equal(confidence(workspace.workspaceId, "obj_medium").confidenceLevel, "Medium");
  assert.equal(confidence(workspace.workspaceId, "obj_medium").confidenceScore, 25);
  assert.equal(confidence(workspace.workspaceId, "obj_high").confidenceLevel, "High");
  assert.equal(confidence(workspace.workspaceId, "obj_high").confidenceScore, 63);
  assert.equal(confidence(workspace.workspaceId, "obj_very_high").confidenceLevel, "Very High");
  assert.equal(confidence(workspace.workspaceId, "obj_very_high").confidenceScore, 93);
});

test("validates relationship coverage and connection evidence from graph metrics", () => {
  const workspace = seedConfidenceWorkspace(
    "Relationship Confidence Metrics",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["purchases", "supplies"]);
  buildPrerequisiteSignals(workspace.workspaceId);

  calculateObjectConfidence(workspace.workspaceId);

  const product = confidence(workspace.workspaceId, "obj_product");
  assert.equal(product.relationshipCoverage, 75);
  assert.equal(product.connectionEvidence, 80);
  assert.equal(product.profileCompleteness, 100);
  assert.equal(product.confidenceScore, 83);
  assert.equal(product.confidenceLevel, "Very High");
});

test("generates confidence reasons", () => {
  const workspace = seedConfidenceWorkspace(
    "Confidence Reason",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  buildPrerequisiteSignals(workspace.workspaceId);
  calculateObjectConfidence(workspace.workspaceId);

  const product = confidence(workspace.workspaceId, "obj_product");

  assert.match(product.confidenceReason, /limited relationship evidence|multiple confirmed relationships/);
  assert.match(product.confidenceReason, /partial graph connectivity|high graph connectivity/);
  assert.match(product.confidenceReason, /complete object profile/);
});

test("preserves workspace isolation", () => {
  const workspaceA = seedConfidenceWorkspace(
    "Confidence Workspace A",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const workspaceB = seedConfidenceWorkspace(
    "Confidence Workspace B",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationships(workspaceA.workspaceId, ["supplies"]);
  buildPrerequisiteSignals(workspaceA.workspaceId);
  buildObjectIntelligenceProfiles(workspaceB.workspaceId);

  calculateObjectConfidence(workspaceA.workspaceId);

  assert.equal(getConfidenceProfiles(workspaceA.workspaceId).length, 2);
  assert.equal(getConfidenceProfiles(workspaceB.workspaceId).length, 0);
});

test("persists confidence profiles and reloads from storage", () => {
  const workspace = seedConfidenceWorkspace(
    "Persist Confidence Profiles",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  buildPrerequisiteSignals(workspace.workspaceId);
  calculateObjectConfidence(workspace.workspaceId);
  const stored = window.localStorage.getItem(CONFIDENCE_STORAGE_KEY);
  assert.ok(stored);

  resetWorkspaceConfidenceProfileStoreForTests();
  window.localStorage.setItem(CONFIDENCE_STORAGE_KEY, stored);

  assert.equal(getConfidenceProfiles(workspace.workspaceId).length, 2);
  assert.equal(confidence(workspace.workspaceId, "obj_product").confidenceLevel, "High");
});

test("does not mutate scene, topology, dashboard, or create non-confidence outputs", () => {
  const workspace = seedConfidenceWorkspace(
    "No Scene Confidence",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["purchases"]);
  buildPrerequisiteSignals(workspace.workspaceId);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);

  calculateObjectConfidence(workspace.workspaceId);

  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);
  assert.equal(
    getConfidenceProfiles(workspace.workspaceId).some(
      (entry) =>
        "importanceScore" in entry ||
        "recommendations" in entry ||
        "risks" in entry
    ),
    false
  );
});
