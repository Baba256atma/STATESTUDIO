import assert from "node:assert/strict";
import test from "node:test";

import { readValidatedSceneRelationshipsForRender } from "../relationships/relationshipRendererRuntime.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
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
  getWorkspaceRelationships,
  resetWorkspaceRelationshipCreationStoreForTests,
} from "./workspaceRelationshipCreationContract.ts";
import {
  getSceneRelationships,
  resetWorkspaceRelationshipSceneSyncStoreForTests,
  syncWorkspaceRelationshipsToScene,
} from "./workspaceRelationshipSceneSyncContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
  syncWorkspaceObjectsToSceneAction,
} from "./workspaceSceneSync.ts";
import {
  certifyEmptyWorkspaceRelationshipIntelligence,
  certifyWorkspaceRelationshipIntelligence,
} from "./workspaceRelationshipCertification.ts";
import {
  NEXORA_RELATIONSHIP_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_RELATIONSHIP_CERTIFICATION_GATE_TITLES,
  WORKSPACE_RELATIONSHIP_CERTIFICATION_TAGS,
} from "./workspaceRelationshipCertificationContract.ts";

const DATA_SOURCE_ID = "wds_relationship_certification_entities";

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

function seedRelationshipCertificationWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "relationship_certification_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "relationship_certification_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "relationship_certification_entities.csv",
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
  assert.equal(syncWorkspaceObjectsToSceneAction(workspace.workspaceId).success, true);
  return workspace;
}

function approveExpectedRelationships(workspaceId: string, relationshipTypes: readonly string[]): void {
  const approvals = getRelationshipApprovalState(workspaceId).approvals;
  for (const relationshipType of relationshipTypes) {
    const approval = approvals.find((entry) => entry.relationshipType === relationshipType);
    assert.ok(approval, `Expected relationship approval ${relationshipType}`);
    assert.equal(approveRelationshipCandidate(workspaceId, approval.candidateRelationshipId).success, true);
  }
}

function runCertifiedPipeline(input: {
  workspaceName: string;
  csvText: string;
  relationshipTypes: readonly string[];
  isolationWorkspaceId?: string | null;
}) {
  const workspace = seedRelationshipCertificationWorkspace(input.workspaceName, input.csvText);
  approveExpectedRelationships(workspace.workspaceId, input.relationshipTypes);
  const creation = createApprovedRelationships(workspace.workspaceId);
  assert.equal(creation.success, true);
  const sync = syncWorkspaceRelationshipsToScene(workspace.workspaceId);
  assert.equal(sync.success, true);
  const duplicateCreation = createApprovedRelationships(workspace.workspaceId);
  const duplicateSync = syncWorkspaceRelationshipsToScene(workspace.workspaceId);
  return certifyWorkspaceRelationshipIntelligence({
    workspaceId: workspace.workspaceId,
    expectedRelationshipTypes: input.relationshipTypes,
    expectedSceneRelationshipCount: input.relationshipTypes.length,
    isolationWorkspaceId: input.isolationWorkspaceId,
    duplicateCreationResult: duplicateCreation,
    duplicateSceneSyncResult: duplicateSync,
    buildPassed: true,
  });
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
  resetWorkspaceRelationshipSceneSyncStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-2:6 tags, diagnostic prefix, and certification gate titles", () => {
  assert.equal(NEXORA_RELATIONSHIP_CERTIFICATION_LOG_PREFIX, "[NexoraRelationshipCertification]");
  assert.deepEqual(WORKSPACE_RELATIONSHIP_CERTIFICATION_TAGS, [
    "[DS26_CERTIFIED]",
    "[RELATIONSHIP_INTELLIGENCE_CERTIFIED]",
    "[WORKSPACE_RELATIONSHIP_PLATFORM_READY]",
    "[DS3_READY]",
    "[DS_2_COMPLETE]",
  ]);
  assert.equal(
    WORKSPACE_RELATIONSHIP_CERTIFICATION_GATE_TITLES.AC,
    "Build Passes"
  );
});

test("certifies Scenario 1 Supplier to Product supplies relationship", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-2:6 Supplier Product",
    csvText: "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n",
    relationshipTypes: ["supplies"],
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "A")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "M")?.status, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_1_supplier_product")?.status,
    "PASS"
  );
});

test("certifies Scenario 2 Customer to Product purchases relationship", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-2:6 Customer Product",
    csvText: "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n",
    relationshipTypes: ["purchases"],
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_2_customer_product")?.status,
    "PASS"
  );
});

test("certifies Scenario 3 Employee to Department belongs_to relationship", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-2:6 Employee Department",
    csvText: "employee_id,employee_name,department_id,department_name\n5,Ada,20,Operations\n",
    relationshipTypes: ["belongs_to"],
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_3_employee_department")?.status,
    "PASS"
  );
});

test("certifies Scenario 4 Project to Department managed_by relationship", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-2:6 Project Department",
    csvText: "project_id,project_name,department_id,department_name\n50,Atlas,20,Operations\n",
    relationshipTypes: ["managed_by"],
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_4_project_department")?.status,
    "PASS"
  );
});

test("certifies Scenario 5 multiple relationship set with duplicate protections", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-2:6 Multiple Relationships",
    csvText:
      "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name,employee_id,employee_name,department_id,department_name,project_id,project_name\n1,Acme,10,Global Supply,100,Widget,5,Ada,20,Operations,50,Atlas\n",
    relationshipTypes: ["purchases", "supplies", "belongs_to", "managed_by"],
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "K")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "L")?.status, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_5_multiple_relationship_set")?.status,
    "PASS"
  );
});

test("certifies Scenario 8 workspace switching and isolation", () => {
  const isolatedWorkspace = seedRelationshipCertificationWorkspace(
    "DS-2:6 Isolation Workspace",
    "customer_id,customer_name,product_id,product_name\n2,Other,200,Gadget\n"
  );
  const report = runCertifiedPipeline({
    workspaceName: "DS-2:6 Active Workspace",
    csvText: "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n",
    relationshipTypes: ["supplies"],
    isolationWorkspaceId: isolatedWorkspace.workspaceId,
  });

  setActiveWorkspace(report.workspaceId);
  assert.equal(getWorkspaceSceneJson()?.scene.relationships?.length, 1);
  setActiveWorkspace(isolatedWorkspace.workspaceId);
  assert.equal(getWorkspaceSceneJson()?.scene.relationships?.length ?? 0, 0);
  assert.equal(report.gates.find((entry) => entry.gateId === "F")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "AB")?.status, "PASS");
});

test("certifies Scenario 9 reload persistence through stored relationship state", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-2:6 Reload Persistence",
    csvText: "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n",
    relationshipTypes: ["supplies"],
  });

  assert.equal(report.scenarios.find((entry) => entry.scenarioId === "scenario_9_reload_persistence")?.status, "PASS");
  assert.equal(getWorkspaceRelationships(report.workspaceId ?? "").length, 1);
  assert.equal(getSceneRelationships(report.workspaceId ?? "").length, 1);
});

test("certifies Scenarios 10 and 11: selection-safe render stability after sync", () => {
  const workspace = seedRelationshipCertificationWorkspace(
    "DS-2:6 Render Stability",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveExpectedRelationships(workspace.workspaceId, ["supplies"]);
  createApprovedRelationships(workspace.workspaceId);
  syncWorkspaceRelationshipsToScene(workspace.workspaceId);

  const beforePositions = getWorkspaceSyncedSceneObjects(workspace.workspaceId).map((object) => ({
    id: object.id,
    position: object.position,
  }));
  const sceneJson = getWorkspaceSceneJson(workspace.workspaceId);
  assert.ok(sceneJson);
  const firstRead = readValidatedSceneRelationshipsForRender(sceneJson, sceneJson.scene.objects);
  const secondRead = readValidatedSceneRelationshipsForRender(sceneJson, sceneJson.scene.objects);
  const afterPositions = getWorkspaceSyncedSceneObjects(workspace.workspaceId).map((object) => ({
    id: object.id,
    position: object.position,
  }));

  assert.equal(firstRead.length, 1);
  assert.equal(secondRead.length, 1);
  assert.deepEqual(afterPositions, beforePositions);
});

test("certifies Scenario 12 empty workspace safe no-op", () => {
  const workspace = createWorkspace("DS-2:6 Empty Workspace");
  const scenario = certifyEmptyWorkspaceRelationshipIntelligence(workspace.workspaceId);

  assert.equal(scenario.status, "PASS");
});
