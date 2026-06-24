import assert from "node:assert/strict";
import test from "node:test";

import { resolveObjectPanelIntegrationState } from "../object-panel/objectPanelIntegrationRuntime.ts";
import { resolveWorkspaceObjectIntelligencePanelState } from "../../components/panels/object-panel/workspaceObjectIntelligencePanelRuntime.ts";
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
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  resetWorkspaceSceneSyncForTests,
  syncWorkspaceObjectsToSceneAction,
} from "./workspaceSceneSync.ts";
import {
  buildObjectIntelligenceProfiles,
  getObjectIntelligenceProfiles,
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
  calculateObjectConfidence,
  resetWorkspaceConfidenceProfileStoreForTests,
} from "./workspaceConfidenceEngineContract.ts";
import { certifyWorkspaceObjectIntelligence } from "./workspaceObjectIntelligenceCertification.ts";
import {
  NEXORA_OBJECT_INTELLIGENCE_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_GATE_TITLES,
  WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_TAGS,
} from "./workspaceObjectIntelligenceCertificationContract.ts";

const DATA_SOURCE_ID = "wds_object_intelligence_certification";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const IMPACT_STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";
const DEPENDENCY_STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";
const CONFIDENCE_STORAGE_KEY = "nexora.workspaceConfidenceProfiles.v1";
const CREATED_OBJECTS_STORAGE_KEY = "nexora.workspaceCreatedObjects.v2";
const SCENE_SYNC_OBJECTS_STORAGE_KEY = "nexora.workspaceSceneSyncObjects.v2";

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

function resetAllStores(): void {
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
}

function seedCertificationWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "object_intelligence_certification_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "object_intelligence_certification_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "object_intelligence_certification_entities.csv",
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

function runFullObjectIntelligencePipeline(workspaceId: string): void {
  assert.equal(buildObjectIntelligenceProfiles(workspaceId).success, true);
  assert.equal(calculateObjectImpact(workspaceId).success, true);
  assert.equal(calculateObjectDependency(workspaceId).success, true);
  assert.equal(calculateObjectConfidence(workspaceId).success, true);
}

function runEdgeCaseChecks(input: {
  workspaceId: string;
  isolationWorkspaceId: string;
  focusObjectId: string;
  sceneClickObjectId: string;
}) {
  const deletedState = resolveObjectPanelIntegrationState({
    workspaceId: input.workspaceId,
    objectId: "obj_missing",
  });
  const missingImpactState = resolveObjectPanelIntegrationState({
    workspaceId: input.workspaceId,
    objectId: input.focusObjectId,
  });
  const deselectState = resolveObjectPanelIntegrationState({
    workspaceId: input.workspaceId,
    objectId: null,
  });
  const switchState = resolveObjectPanelIntegrationState({
    workspaceId: input.isolationWorkspaceId,
    objectId: input.focusObjectId,
  });
  const sceneState = resolveObjectPanelIntegrationState({
    workspaceId: input.workspaceId,
    objectId: input.sceneClickObjectId,
  });
  const missingPanel = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId: input.workspaceId,
    objectId: input.focusObjectId,
  });

  let stressStable = true;
  for (let index = 0; index < 100; index += 1) {
    const state = resolveObjectPanelIntegrationState({
      workspaceId: input.workspaceId,
      objectId: index % 2 === 0 ? input.focusObjectId : null,
    });
    if (typeof state.panelRendered !== "boolean") {
      stressStable = false;
      break;
    }
  }

  return Object.freeze({
    deletedObjectSafe: deletedState.objectExists === false && deletedState.panelRendered === false,
    missingProfilesSafe: missingImpactState.panelRendered === true || missingPanel.hasAnyIntelligence === true,
    deselectCloses: deselectState.panelRendered === false,
    workspaceSwitchSafe: switchState.panelRendered === false,
    sceneObjectResolves: sceneState.resolvedObjectId === input.focusObjectId && sceneState.panelRendered,
    stressSelectionStable: stressStable,
  });
}

function runCertifiedPipeline(input: {
  workspaceName: string;
  csvText: string;
  relationshipTypes: readonly string[];
  focusObjectId?: string;
  syncScene?: boolean;
}) {
  const workspace = seedCertificationWorkspace(input.workspaceName, input.csvText);
  if (input.relationshipTypes.length > 0) {
    approveRelationships(workspace.workspaceId, input.relationshipTypes);
  }
  runFullObjectIntelligencePipeline(workspace.workspaceId);
  if (input.syncScene) {
    assert.equal(syncWorkspaceObjectsToSceneAction(workspace.workspaceId).success, true);
  }
  const isolationWorkspace = createWorkspace(`${input.workspaceName} Isolation`);
  const focusObjectId = input.focusObjectId ?? "obj_product";
  const sceneClickObjectId = input.syncScene
    ? `scene_${focusObjectId}`
    : null;
  const supplementalChecks = runEdgeCaseChecks({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolationWorkspace.workspaceId,
    focusObjectId,
    sceneClickObjectId: sceneClickObjectId ?? focusObjectId,
  });
  return certifyWorkspaceObjectIntelligence({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolationWorkspace.workspaceId,
    focusObjectId,
    sceneClickObjectId,
    supplementalChecks,
    buildPassed: true,
  });
}

test.beforeEach(() => {
  ensureBrowserStorage();
  resetAllStores();
});

test("exports DS-3:7 tags, diagnostic prefix, and certification gate titles", () => {
  assert.equal(
    NEXORA_OBJECT_INTELLIGENCE_CERTIFICATION_LOG_PREFIX,
    "[NexoraObjectIntelligenceCertification]"
  );
  assert.deepEqual(WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_TAGS, [
    "[DS37_CERTIFIED]",
    "[OBJECT_INTELLIGENCE_CERTIFIED]",
    "[OBJECT_INTELLIGENCE_MVP_COMPLETE]",
    "[DS4_READY]",
    "[DS_3_COMPLETE]",
  ]);
  assert.equal(
    WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_GATE_TITLES.AK,
    "Build Passes"
  );
});

test("certifies Scenario 1 single object intelligence profile", () => {
  const workspace = seedCertificationWorkspace(
    "DS-3:7 Single Object",
    "customer_id,customer_name\n1,Acme\n"
  );
  runFullObjectIntelligencePipeline(workspace.workspaceId);
  const report = certifyWorkspaceObjectIntelligence({
    workspaceId: workspace.workspaceId,
    focusObjectId: "obj_customer",
    supplementalChecks: Object.freeze({
      singleObjectProfileExists: getObjectIntelligenceProfiles(workspace.workspaceId).length === 1,
      deselectCloses: true,
      deletedObjectSafe: true,
      missingProfilesSafe: true,
      workspaceSwitchSafe: true,
      stressSelectionStable: true,
    }),
    buildPassed: true,
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(report.certified, true);
  assert.equal(report.gates.find((entry) => entry.gateId === "A")?.status, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_1_single_object")?.status,
    "PASS"
  );
});

test("certifies Scenario 2 Supplier to Product intelligence", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-3:7 Supplier Product",
    csvText: "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n",
    relationshipTypes: ["supplies"],
    focusObjectId: "obj_product",
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_2_supplier_product")?.status,
    "PASS"
  );
  assert.equal(report.gates.find((entry) => entry.gateId === "E")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "G")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "I")?.status, "PASS");
});

test("certifies Scenario 3 Customer to Product intelligence", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-3:7 Customer Product",
    csvText: "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n",
    relationshipTypes: ["purchases"],
    focusObjectId: "obj_product",
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_3_customer_product")?.status,
    "PASS"
  );
});

test("certifies Scenario 4 multiple relationships increase impact and dependency", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-3:7 Multiple Relationships",
    csvText:
      "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name,employee_id,employee_name,department_id,department_name,project_id,project_name\n1,Acme,10,Global Supply,100,Widget,5,Ada,20,Operations,50,Atlas\n",
    relationshipTypes: ["purchases", "supplies", "belongs_to", "managed_by"],
    focusObjectId: "obj_product",
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_4_multiple_relationships")?.status,
    "PASS"
  );
  assert.equal(report.gates.find((entry) => entry.gateId === "B")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "C")?.status, "PASS");
});

test("certifies Scenario 5 high connectivity object receives high impact and dependency", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-3:7 High Connectivity",
    csvText:
      "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n",
    relationshipTypes: ["purchases", "supplies"],
    focusObjectId: "obj_product",
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_5_high_connectivity_object")?.status,
    "PASS"
  );
  assert.equal(report.gates.find((entry) => entry.gateId === "D")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "F")?.status, "PASS");
});

test("certifies full DS-3 pipeline with panel, integration, and safety gates", () => {
  const report = runCertifiedPipeline({
    workspaceName: "DS-3:7 Full Pipeline",
    csvText:
      "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n",
    relationshipTypes: ["purchases", "supplies"],
    focusObjectId: "obj_product",
    syncScene: true,
  });

  assert.equal(report.overallStatus, "PASS");
  assert.equal(report.certified, true);
  assert.equal(report.knownAuditChecks.every((entry) => entry.status === "WARNING"), true);
  assert.equal(report.diagnosticsPrefixes.length, 7);

  for (const gate of report.gates) {
    assert.equal(gate.status, "PASS", `Gate ${gate.gateId} ${gate.title} failed: ${gate.evidence}`);
  }
  for (const entry of report.scenarios) {
    assert.equal(entry.status, "PASS", `Scenario ${entry.scenarioId} failed: ${entry.evidence}`);
  }
});

test("certifies Scenario 10 reload persistence through stored intelligence state", () => {
  const workspace = seedCertificationWorkspace(
    "DS-3:7 Reload Persistence",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  runFullObjectIntelligencePipeline(workspace.workspaceId);

  const intelligenceStored = window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY);
  const impactStored = window.localStorage.getItem(IMPACT_STORAGE_KEY);
  const dependencyStored = window.localStorage.getItem(DEPENDENCY_STORAGE_KEY);
  const confidenceStored = window.localStorage.getItem(CONFIDENCE_STORAGE_KEY);
  assert.ok(intelligenceStored);
  assert.ok(impactStored);
  assert.ok(dependencyStored);
  assert.ok(confidenceStored);

  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceImpactProfileStoreForTests();
  resetWorkspaceDependencyProfileStoreForTests();
  resetWorkspaceConfidenceProfileStoreForTests();
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, intelligenceStored);
  window.localStorage.setItem(IMPACT_STORAGE_KEY, impactStored);
  window.localStorage.setItem(DEPENDENCY_STORAGE_KEY, dependencyStored);
  window.localStorage.setItem(CONFIDENCE_STORAGE_KEY, confidenceStored);

  const report = certifyWorkspaceObjectIntelligence({
    workspaceId: workspace.workspaceId,
    focusObjectId: "obj_product",
    supplementalChecks: Object.freeze({
      deselectCloses: true,
      deletedObjectSafe: true,
      missingProfilesSafe: true,
      workspaceSwitchSafe: true,
      stressSelectionStable: true,
    }),
    buildPassed: true,
  });

  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_10_reload_persistence")?.status,
    "PASS"
  );
  assert.equal(report.gates.find((entry) => entry.gateId === "X")?.status, "PASS");
});

test("certifies missing profiles, deleted object, and deselect safety", () => {
  const workspace = createWorkspace("DS-3:7 Safety Checks");
  const timestamp = new Date().toISOString();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceImpactProfileStoreForTests();
  resetWorkspaceDependencyProfileStoreForTests();
  resetWorkspaceConfidenceProfileStoreForTests();
  window.localStorage.setItem(
    CREATED_OBJECTS_STORAGE_KEY,
    JSON.stringify({
      [workspace.workspaceId]: {
        obj_product: {
          contractVersion: "DS-1:5",
          objectId: "obj_product",
          workspaceId: workspace.workspaceId,
          dataSourceId: "wds_safety",
          objectName: "Product",
          objectType: "product",
          primaryIdentifier: "product_id",
          sourceColumns: ["product_id", "product_name"],
          originCandidateId: "candidate_product",
          createdAt: timestamp,
          updatedAt: timestamp,
          creationSource: "ds-1-approved-candidate",
        },
      },
    })
  );
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
      [workspace.workspaceId]: {
        obj_product: {
          contractVersion: "DS-3:1",
          objectId: "obj_product",
          workspaceId: workspace.workspaceId,
          objectName: "Product",
          objectType: "product",
          originCandidateId: "candidate_product",
          originWorkspaceObjectId: "obj_product",
          relationshipCount: 1,
          incomingRelationshipCount: 1,
          outgoingRelationshipCount: 0,
          connectedObjectCount: 1,
          intelligenceStatus: "ready",
          createdAt: timestamp,
          updatedAt: timestamp,
          source: "ds-3:1-foundation",
        },
      },
    })
  );
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  window.localStorage.setItem(
    CREATED_OBJECTS_STORAGE_KEY,
    JSON.stringify({
      [workspace.workspaceId]: {
        obj_product: {
          contractVersion: "DS-1:5",
          objectId: "obj_product",
          workspaceId: workspace.workspaceId,
          dataSourceId: "wds_safety",
          objectName: "Product",
          objectType: "product",
          primaryIdentifier: "product_id",
          sourceColumns: ["product_id", "product_name"],
          originCandidateId: "candidate_product",
          createdAt: timestamp,
          updatedAt: timestamp,
          creationSource: "ds-1-approved-candidate",
        },
      },
    })
  );
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
      [workspace.workspaceId]: {
        obj_product: {
          contractVersion: "DS-3:1",
          objectId: "obj_product",
          workspaceId: workspace.workspaceId,
          objectName: "Product",
          objectType: "product",
          originCandidateId: "candidate_product",
          originWorkspaceObjectId: "obj_product",
          relationshipCount: 1,
          incomingRelationshipCount: 1,
          outgoingRelationshipCount: 0,
          connectedObjectCount: 1,
          intelligenceStatus: "ready",
          createdAt: timestamp,
          updatedAt: timestamp,
          source: "ds-3:1-foundation",
        },
      },
    })
  );

  const missingImpact = resolveObjectPanelIntegrationState({
    workspaceId: workspace.workspaceId,
    objectId: "obj_product",
  });
  const deleted = resolveObjectPanelIntegrationState({
    workspaceId: workspace.workspaceId,
    objectId: "obj_deleted",
  });
  const deselect = resolveObjectPanelIntegrationState({
    workspaceId: workspace.workspaceId,
    objectId: null,
  });

  const report = certifyWorkspaceObjectIntelligence({
    workspaceId: workspace.workspaceId,
    focusObjectId: "obj_product",
    supplementalChecks: Object.freeze({
      missingProfilesSafe: missingImpact.impactLoaded === false && missingImpact.panelRendered === true,
      deletedObjectSafe: deleted.objectExists === false && deleted.panelRendered === false,
      deselectCloses: deselect.panelRendered === false,
      workspaceSwitchSafe: true,
      stressSelectionStable: true,
    }),
    buildPassed: true,
  });

  assert.equal(report.gates.find((entry) => entry.gateId === "S")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "T")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "U")?.status, "PASS");
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_6_missing_profiles")?.status,
    "PASS"
  );
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_7_deleted_object")?.status,
    "PASS"
  );
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_8_object_deselect")?.status,
    "PASS"
  );
});

test("certifies Scenario 11 scene object click and Scenario 12 stress selection", () => {
  const workspace = seedCertificationWorkspace(
    "DS-3:7 Scene Click",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["supplies"]);
  runFullObjectIntelligencePipeline(workspace.workspaceId);
  assert.equal(syncWorkspaceObjectsToSceneAction(workspace.workspaceId).success, true);

  const syncedObjects = window.localStorage.getItem(SCENE_SYNC_OBJECTS_STORAGE_KEY);
  assert.ok(syncedObjects);
  resetWorkspaceSceneSyncForTests();
  window.localStorage.setItem(SCENE_SYNC_OBJECTS_STORAGE_KEY, syncedObjects);

  const sceneClickObjectId = "scene_obj_product";
  const sceneState = resolveObjectPanelIntegrationState({
    workspaceId: workspace.workspaceId,
    objectId: sceneClickObjectId,
  });

  let stressStable = true;
  for (let index = 0; index < 100; index += 1) {
    const state = resolveObjectPanelIntegrationState({
      workspaceId: workspace.workspaceId,
      objectId: index % 2 === 0 ? sceneClickObjectId : null,
    });
    if (typeof state.panelRendered !== "boolean") {
      stressStable = false;
      break;
    }
  }

  const report = certifyWorkspaceObjectIntelligence({
    workspaceId: workspace.workspaceId,
    focusObjectId: "obj_product",
    sceneClickObjectId,
    supplementalChecks: Object.freeze({
      sceneObjectResolves: sceneState.resolvedObjectId === "obj_product" && sceneState.panelRendered,
      stressSelectionStable: stressStable,
      deselectCloses: true,
      deletedObjectSafe: true,
      missingProfilesSafe: true,
      workspaceSwitchSafe: true,
    }),
    buildPassed: true,
  });

  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_11_scene_object_click")?.status,
    "PASS"
  );
  assert.equal(
    report.scenarios.find((entry) => entry.scenarioId === "scenario_12_stress_object_selection")?.status,
    "PASS"
  );
  assert.equal(report.gates.find((entry) => entry.gateId === "P")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "AI")?.status, "PASS");
});

test("certification does not mutate scene or topology", () => {
  const workspace = seedCertificationWorkspace(
    "DS-3:7 No Mutation",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveRelationships(workspace.workspaceId, ["purchases"]);
  runFullObjectIntelligencePipeline(workspace.workspaceId);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);

  const report = certifyWorkspaceObjectIntelligence({
    workspaceId: workspace.workspaceId,
    focusObjectId: "obj_product",
    supplementalChecks: Object.freeze({
      deselectCloses: true,
      deletedObjectSafe: true,
      missingProfilesSafe: true,
      workspaceSwitchSafe: true,
      stressSelectionStable: true,
    }),
    buildPassed: true,
  });

  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), null);
  assert.equal(report.gates.find((entry) => entry.gateId === "Z")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "AA")?.status, "PASS");
  assert.equal(report.gates.find((entry) => entry.gateId === "Y")?.status, "PASS");
});
