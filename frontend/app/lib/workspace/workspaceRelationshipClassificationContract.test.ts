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
  getCandidateRelationships,
  resetWorkspaceRelationshipCandidateStoreForTests,
} from "./workspaceRelationshipCandidateContract.ts";
import {
  getWorkspaceDiscoveredRelationships,
  resetWorkspaceRelationshipsForTests,
} from "./workspaceRelationshipDiscoveryContract.ts";
import { getWorkspaceSyncedSceneObjects, resetWorkspaceSceneSyncForTests } from "./workspaceSceneSync.ts";
import {
  NEXORA_RELATIONSHIP_CLASSIFICATION_LOG_PREFIX,
  WORKSPACE_RELATIONSHIP_CLASSIFICATION_SOURCE,
  WORKSPACE_RELATIONSHIP_CLASSIFICATION_TAGS,
  classifyCandidateRelationships,
  getRelationshipClassification,
  getRelationshipClassifications,
  resetWorkspaceRelationshipClassificationStoreForTests,
  type WorkspaceRelationshipStrength,
} from "./workspaceRelationshipClassificationContract.ts";

const DATA_SOURCE_ID = "wds_classification_entities";
const CANDIDATE_STORAGE_KEY = "nexora.workspaceRelationshipCandidates.v1";

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

function seedCandidateWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "classification_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "classification_entities.csv",
      csvText,
    }),
  });
  const schema = discoverAndSaveWorkspaceDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    fileName: "classification_entities.csv",
    csvText,
  });
  assert.equal(schema.success, true, schema.reason);
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
  return workspace;
}

function findClassification(workspaceId: string, relationshipType: string) {
  const classification = getRelationshipClassifications(workspaceId).find(
    (entry) => entry.relationshipType === relationshipType
  );
  assert.ok(classification, `Expected classification ${relationshipType}`);
  return classification;
}

function seedStoredCandidate(input: {
  workspaceId: string;
  candidateRelationshipId: string;
  relationshipType: string;
  confidence: number;
}): void {
  window.localStorage.setItem(
    CANDIDATE_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: {
        [input.candidateRelationshipId]: {
          contractVersion: "DS-2:1",
          candidateRelationshipId: input.candidateRelationshipId,
          workspaceId: input.workspaceId,
          sourceObjectId: "obj_source",
          targetObjectId: "obj_target",
          relationshipType: input.relationshipType,
          confidence: input.confidence,
          reason: "Seeded DS-2:1 candidate for classification validation.",
          direction: "source_to_target",
          discoveredAt: "2026-06-22T00:00:00.000Z",
          status: "suggested",
        },
      },
    })
  );
}

function seedStoredStrengthCandidates(workspaceId: string): void {
  const entries = [
    ["cand_weak", "unknown", 0.39],
    ["cand_medium", "related_to", 0.4],
    ["cand_strong", "managed_by", 0.7],
    ["cand_critical", "supplies", 0.9],
  ] as const;
  window.localStorage.setItem(
    CANDIDATE_STORAGE_KEY,
    JSON.stringify({
      [workspaceId]: Object.fromEntries(
        entries.map(([candidateRelationshipId, relationshipType, confidence]) => [
          candidateRelationshipId,
          {
            contractVersion: "DS-2:1",
            candidateRelationshipId,
            workspaceId,
            sourceObjectId: `source_${candidateRelationshipId}`,
            targetObjectId: `target_${candidateRelationshipId}`,
            relationshipType,
            confidence,
            reason: "Seeded confidence boundary candidate.",
            direction: "source_to_target",
            discoveredAt: "2026-06-22T00:00:00.000Z",
            status: "suggested",
          },
        ])
      ),
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
  resetWorkspaceRelationshipsForTests();
  resetWorkspaceSceneSyncForTests();
});

test("exports DS-2:2 tags, source, and diagnostic prefix", () => {
  assert.equal(
    NEXORA_RELATIONSHIP_CLASSIFICATION_LOG_PREFIX,
    "[NexoraRelationshipClassification]"
  );
  assert.equal(WORKSPACE_RELATIONSHIP_CLASSIFICATION_SOURCE, "ds-2:2-classification");
  assert.deepEqual(WORKSPACE_RELATIONSHIP_CLASSIFICATION_TAGS, [
    "[DS22_RELATIONSHIP_CLASSIFICATION]",
    "[RELATIONSHIP_CATEGORY_ENGINE]",
    "[RELATIONSHIP_STRENGTH_ENGINE]",
    "[RELATIONSHIP_CLASSIFICATION_PERSISTED]",
    "[DS23_READY]",
    "[DS_2_2_COMPLETE]",
  ]);
});

test("classifies Supplier to Product as Business Flow strong", () => {
  const workspace = seedCandidateWorkspace(
    "Supplier Product Classification",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );

  const result = classifyCandidateRelationships(workspace.workspaceId);

  assert.equal(result.success, true);
  const classification = findClassification(workspace.workspaceId, "supplies");
  assert.equal(classification.relationshipCategory, "Business Flow");
  assert.equal(classification.relationshipStrength, "strong");
  assert.equal(classification.source, WORKSPACE_RELATIONSHIP_CLASSIFICATION_SOURCE);
});

test("classifies Customer to Product as Business Flow strong", () => {
  const workspace = seedCandidateWorkspace(
    "Customer Product Classification",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );

  classifyCandidateRelationships(workspace.workspaceId);

  const classification = findClassification(workspace.workspaceId, "purchases");
  assert.equal(classification.relationshipCategory, "Business Flow");
  assert.equal(classification.relationshipStrength, "strong");
});

test("classifies Employee to Department as Organization strong", () => {
  const workspace = seedCandidateWorkspace(
    "Employee Department Classification",
    "employee_id,employee_name,department_id,department_name\n7,Ada,3,Operations\n"
  );

  classifyCandidateRelationships(workspace.workspaceId);

  const classification = findClassification(workspace.workspaceId, "belongs_to");
  assert.equal(classification.relationshipCategory, "Organization");
  assert.equal(classification.relationshipStrength, "strong");
});

test("classifies Project to Department as Governance medium or strong", () => {
  const workspace = seedCandidateWorkspace(
    "Project Department Classification",
    "project_id,project_name,department_id,department_name\n22,Launch,3,Operations\n"
  );

  classifyCandidateRelationships(workspace.workspaceId);

  const classification = findClassification(workspace.workspaceId, "managed_by");
  assert.equal(classification.relationshipCategory, "Governance");
  assert.ok(["medium", "strong"].includes(classification.relationshipStrength));
});

test("normalizes invalid relationship types to unknown", () => {
  const workspaceId = "invalid_type_workspace";
  seedStoredCandidate({
    workspaceId,
    candidateRelationshipId: "cand_invalid_type",
    relationshipType: "not_allowed",
    confidence: 0.31,
  });

  const result = classifyCandidateRelationships(workspaceId);

  assert.equal(result.success, true);
  assert.equal(getCandidateRelationships(workspaceId).length, 1);
  const classification = getRelationshipClassification(workspaceId, "cand_invalid_type");
  assert.ok(classification);
  assert.equal(classification.relationshipType, "unknown");
  assert.equal(classification.relationshipCategory, "Unknown");
  assert.equal(classification.relationshipStrength, "weak");
  assert.equal(classification.confidence, 0.31);
});

test("calculates relationship strength from confidence boundaries", () => {
  const workspaceId = "strength_boundary_workspace";
  seedStoredStrengthCandidates(workspaceId);

  classifyCandidateRelationships(workspaceId);

  const strengths = Object.fromEntries(
    getRelationshipClassifications(workspaceId).map((classification) => [
      classification.candidateRelationshipId,
      classification.relationshipStrength,
    ])
  ) as Record<string, WorkspaceRelationshipStrength>;

  assert.equal(strengths.cand_weak, "weak");
  assert.equal(strengths.cand_medium, "medium");
  assert.equal(strengths.cand_strong, "strong");
  assert.equal(strengths.cand_critical, "critical");
});

test("persists classifications and reads single classification by candidate id", () => {
  const workspace = seedCandidateWorkspace(
    "Persist Relationship Classifications",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );

  classifyCandidateRelationships(workspace.workspaceId);
  const classification = findClassification(workspace.workspaceId, "purchases");

  assert.deepEqual(
    getRelationshipClassification(workspace.workspaceId, classification.candidateRelationshipId),
    classification
  );
});

test("preserves workspace isolation", () => {
  const workspaceA = seedCandidateWorkspace(
    "Classification Workspace A",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  const workspaceB = seedCandidateWorkspace(
    "Classification Workspace B",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );

  classifyCandidateRelationships(workspaceA.workspaceId);

  assert.ok(getRelationshipClassifications(workspaceA.workspaceId).length > 0);
  assert.equal(getRelationshipClassifications(workspaceB.workspaceId).length, 0);
});

test("does not create relationships, scene nodes, or scene mutations", () => {
  const workspace = seedCandidateWorkspace(
    "Classification Only",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );

  classifyCandidateRelationships(workspace.workspaceId);

  assert.equal(getWorkspaceDiscoveredRelationships(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});
