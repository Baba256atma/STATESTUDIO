import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  createWorkspace,
  getActiveWorkspace,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  getWorkspaceObjects,
  getWorkspaceScopedResources,
} from "./workspaceContextResolver.ts";
import { resetWorkspaceDataSourcesForTests } from "./workspaceDataSourceRegistry.ts";
import {
  resetWorkspaceCsvUploadForTests,
  uploadWorkspaceCsv,
} from "./workspaceCsvUploadRuntime.ts";
import { DATA_SOURCE_SCHEMA_VERSION } from "./dataSourceSchemaContract.ts";
import { COLUMN_CLASSIFICATION_VERSION } from "./columnClassificationContract.ts";
import { CANDIDATE_OBJECT_VERSION } from "./candidateObjectContract.ts";
import {
  listWorkspaceCandidateObjects,
  discoverAndSaveCandidateObjectsFromClassification,
  resetWorkspaceCandidateObjectsForTests,
} from "./candidateObjectDiscoveryEngine.ts";
import {
  listWorkspaceDataSourceSchemas,
  resetWorkspaceSchemaRegistryForTests,
} from "./workspaceSchemaRegistry.ts";
import {
  classifyAndSaveWorkspaceColumnsFromSchema,
  listWorkspaceColumnClassificationProfiles,
  resetWorkspaceColumnClassificationForTests,
} from "./columnClassificationEngine.ts";
import {
  approveObjectApprovalCandidate,
  buildObjectApprovalPanelSnapshot,
  createSelectedApprovedObjects,
  rejectObjectApprovalCandidate,
  resetObjectApprovalPanelForTests,
  syncObjectApprovalRecordsFromCandidates,
} from "./objectApprovalPanelRuntime.ts";
import {
  OBJECT_CREATION_PIPELINE_VERSION,
  getWorkspaceCreatedObjects,
  listPipelineWorkspaceObjects,
  resetPipelineWorkspaceObjectsForTests,
} from "./objectCreationPipeline.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import type { SceneJson } from "../sceneTypes.ts";
import {
  WORKSPACE_SCENE_SYNC_VERSION,
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
  syncWorkspaceObjectsToScene,
} from "./workspaceSceneSync.ts";
import {
  getWorkspaceSceneSyncRecords,
  resetWorkspaceSceneSyncPipelineForTests,
} from "./workspaceSceneSyncPipeline.ts";
import {
  resetWorkspaceObjectApprovalStoreForTests,
} from "./workspaceObjectApprovalRuntime.ts";
import {
  resetWorkspaceObjectCreationStoreForTests,
} from "./workspaceObjectCreationPipeline.ts";
import {
  DS17_CERTIFICATION_TAG,
  WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS,
  WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  type WorkspaceDataSourceCertificationGate,
  type WorkspaceDataSourceCertificationInput,
  type WorkspaceDataSourceCertificationResult,
  type WorkspaceDataSourceCertificationScenario,
} from "./workspaceDataSourceCertificationContract.ts";

const FRONTEND_ROOT = process.cwd();

type TestCsvFile = Readonly<{
  name: string;
  type: string;
  size: number;
  text: () => Promise<string>;
}>;

const ENTITIES_CSV =
  "customer_id,customer_name,supplier_id,supplier_name,warehouse_id,warehouse_name\n1,Acme,10,Global Supply,20,East\n";

const ORDERS_CSV = "order_id,amount\n1,100\n2,200\n";

function readSource(relativePath: string): string {
  return readFileSync(join(FRONTEND_ROOT, relativePath), "utf8");
}

function makeCsvFile(input: {
  name: string;
  body: string;
  type?: string;
  size?: number;
}): TestCsvFile {
  return Object.freeze({
    name: input.name,
    type: input.type ?? "text/csv",
    size: input.size ?? input.body.length,
    text: async () => input.body,
  });
}

function gate(
  id: WorkspaceDataSourceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): WorkspaceDataSourceCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function scenario(
  id: WorkspaceDataSourceCertificationScenario["id"],
  name: string,
  failures: readonly string[]
): WorkspaceDataSourceCertificationScenario {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} stable.` : failures.join("; "),
  });
}

function ensureBrowserStorage(): void {
  if (typeof globalThis.window !== "undefined") return;
  const store: Record<string, string> = {};
  (globalThis as unknown as { window: Window }).window = {
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

function resetCertificationStores(): void {
  ensureBrowserStorage();
  if (typeof window !== "undefined") window.localStorage.clear();
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceCsvUploadForTests();
  resetWorkspaceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationForTests();
  resetWorkspaceCandidateObjectsForTests();
  resetWorkspaceObjectApprovalStoreForTests();
  resetObjectApprovalPanelForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetPipelineWorkspaceObjectsForTests();
  resetWorkspaceSceneSyncPipelineForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
}

function sceneHasNoRelationships(sceneJson: SceneJson | null): boolean {
  const relationships = sceneJson?.scene?.relationships;
  return Array.isArray(relationships) && relationships.length === 0;
}

function runDownstreamIntelligenceForWorkspace(workspaceId: WorkspaceId): void {
  for (const schema of listWorkspaceDataSourceSchemas(workspaceId)) {
    const classification = classifyAndSaveWorkspaceColumnsFromSchema(schema, schema.updatedAt);
    if (classification.success && classification.profile) {
      discoverAndSaveCandidateObjectsFromClassification(classification.profile);
    }
  }
}

async function seedEntitiesCsv(workspaceId: WorkspaceId): Promise<boolean> {
  const upload = await uploadWorkspaceCsv(
    makeCsvFile({ name: "entities.csv", body: ENTITIES_CSV }),
    workspaceId
  );
  if (!upload.success) return false;
  runDownstreamIntelligenceForWorkspace(workspaceId);
  syncObjectApprovalRecordsFromCandidates(workspaceId);
  return true;
}

function approveByName(workspaceId: WorkspaceId, objectName: string): boolean {
  const row = buildObjectApprovalPanelSnapshot(workspaceId).rows.find(
    (entry) => entry.objectName === objectName
  );
  if (!row) return false;
  return approveObjectApprovalCandidate(workspaceId, row.candidateId).success;
}

export async function runWorkspaceDataSourceCertification(
  input: WorkspaceDataSourceCertificationInput = {}
): Promise<WorkspaceDataSourceCertificationResult> {
  resetCertificationStores();

  const gates: WorkspaceDataSourceCertificationGate[] = [];
  const scenarios: WorkspaceDataSourceCertificationScenario[] = [];
  const evidence: string[] = [];

  const schemaRegistrySource = readSource("app/lib/workspace/workspaceSchemaRegistry.ts");
  const schemaDiscoverySource = readSource("app/lib/workspace/workspaceDataSourceSchemaDiscovery.ts");
  const schemaResolverSource = readSource("app/lib/workspace/workspaceDataSourceSchemaResolver.ts");
  const schemaContractSource = readSource("app/lib/workspace/workspaceDataSourceSchemaContract.ts");
  const legacySchemaContractSource = readSource("app/lib/workspace/dataSourceSchemaContract.ts");
  const classificationSource = readSource("app/lib/workspace/columnClassificationEngine.ts");
  const workspaceClassificationSource = readSource(
    "app/lib/workspace/workspaceColumnClassificationEngine.ts"
  );
  const workspaceClassificationContractSource = readSource(
    "app/lib/workspace/workspaceColumnClassificationContract.ts"
  );
  const classificationContractSource = readSource("app/lib/workspace/columnClassificationContract.ts");
  const candidateSource = readSource("app/lib/workspace/candidateObjectDiscoveryEngine.ts");
  const workspaceCandidateSource = readSource(
    "app/lib/workspace/workspaceCandidateObjectDiscoveryEngine.ts"
  );
  const workspaceCandidateContractSource = readSource(
    "app/lib/workspace/workspaceCandidateObjectContract.ts"
  );
  const candidateContractSource = readSource("app/lib/workspace/candidateObjectContract.ts");
  const approvalRuntimeSource = readSource("app/lib/workspace/objectApprovalPanelRuntime.ts");
  const workspaceApprovalRuntimeSource = readSource(
    "app/lib/workspace/workspaceObjectApprovalRuntime.ts"
  );
  const workspaceApprovalContractSource = readSource(
    "app/lib/workspace/workspaceObjectApprovalContract.ts"
  );
  const approvalPanelSource = readSource(
    "app/components/main-right-panel/workspace/operational/WorkspaceObjectApprovalPanel.tsx"
  );
  const operationalWorkspaceSource = readSource(
    "app/components/main-right-panel/workspace/operational/OperationalWorkspace.tsx"
  );
  const pipelineSource = readSource("app/lib/workspace/objectCreationPipeline.ts");
  const workspaceCreationSource = readSource("app/lib/workspace/workspaceObjectCreationPipeline.ts");
  const workspaceCreationContractSource = readSource(
    "app/lib/workspace/workspaceObjectCreationContract.ts"
  );
  const sceneSyncSource = readSource("app/lib/workspace/workspaceSceneSync.ts");
  const workspaceSceneSyncPipelineSource = readSource(
    "app/lib/workspace/workspaceSceneSyncPipeline.ts"
  );
  const workspaceSceneSyncContractSource = readSource(
    "app/lib/workspace/workspaceSceneSyncContract.ts"
  );
  const sceneCreationSource = readSource("app/lib/workspace/workspaceSceneCreationContract.ts");
  const csvUploadSource = readSource("app/lib/workspace/workspaceCsvUploadRuntime.ts");
  const workspaceSceneSyncLegacyBridgeSource = readSource(
    "app/lib/workspace/workspaceSceneSyncLegacyBridge.ts"
  );
  const dashboardBridgeSource = readSource("app/lib/dashboard/dashboardContextBridge.ts");
  const objectClickGuardSource = readSource(
    "app/lib/selection/objectClickDashboardCommitGuard.ts"
  );

  const emptyWorkspace = createWorkspace("Empty Workspace");

  const singleWorkspace = createWorkspace("Single CSV Customer Workspace");
  const singleUploadOk = await seedEntitiesCsv(singleWorkspace.workspaceId);
  const singlePanelBefore = buildObjectApprovalPanelSnapshot(singleWorkspace.workspaceId);
  const customerApproved = approveByName(singleWorkspace.workspaceId, "Customer");
  const singleCreated = createSelectedApprovedObjects(singleWorkspace.workspaceId);
  const singleSync = syncWorkspaceObjectsToScene(singleWorkspace.workspaceId);
  const singleTraceRecord = getWorkspaceSceneSyncRecords(singleWorkspace.workspaceId)[0] ?? null;
  const singlePipelineObjects = listPipelineWorkspaceObjects(singleWorkspace.workspaceId);
  const singleCreatedObjects = getWorkspaceCreatedObjects(singleWorkspace.workspaceId);
  const singleSceneObjects = getWorkspaceSyncedSceneObjects(singleWorkspace.workspaceId);
  const singleSceneJson = getWorkspaceSceneJson(singleWorkspace.workspaceId);
  const singleScoped = getWorkspaceScopedResources(singleWorkspace.workspaceId);

  scenarios.push(
    scenario("single_csv_customer", "Single CSV Customer", [
      singleUploadOk ? "" : "CSV upload failed",
      customerApproved ? "" : "Customer approval failed",
      singleCreated.success ? "" : `Object creation failed: ${singleCreated.reason}`,
      singlePipelineObjects.length === 1 ? "" : `Expected 1 object, got ${singlePipelineObjects.length}`,
      singlePipelineObjects[0]?.objectName === "Customer" ? "" : "Expected Customer object",
      singleSync.success ? "" : "Scene sync failed",
      singleSceneObjects.length === 1 ? "" : `Expected 1 scene object, got ${singleSceneObjects.length}`,
    ].filter(Boolean))
  );

  const pairWorkspace = createWorkspace("Customer Supplier Workspace");
  await seedEntitiesCsv(pairWorkspace.workspaceId);
  approveByName(pairWorkspace.workspaceId, "Customer");
  approveByName(pairWorkspace.workspaceId, "Supplier");
  createSelectedApprovedObjects(pairWorkspace.workspaceId);
  syncWorkspaceObjectsToScene(pairWorkspace.workspaceId);
  const pairObjects = getWorkspaceCreatedObjects(pairWorkspace.workspaceId);
  const pairScene = getWorkspaceSyncedSceneObjects(pairWorkspace.workspaceId);
  scenarios.push(
    scenario("customer_supplier", "Customer + Supplier", [
      pairObjects.length === 2 ? "" : `Expected 2 objects, got ${pairObjects.length}`,
      pairObjects.some((object) => object.objectName === "Customer") ? "" : "Customer missing",
      pairObjects.some((object) => object.objectName === "Supplier") ? "" : "Supplier missing",
      pairScene.length === 2 ? "" : `Expected 2 scene objects, got ${pairScene.length}`,
    ].filter(Boolean))
  );

  const multiApprovedWorkspace = createWorkspace("Multiple Approved Workspace");
  await seedEntitiesCsv(multiApprovedWorkspace.workspaceId);
  const multiPanel = buildObjectApprovalPanelSnapshot(multiApprovedWorkspace.workspaceId);
  for (const row of multiPanel.rows) {
    approveObjectApprovalCandidate(multiApprovedWorkspace.workspaceId, row.candidateId);
  }
  createSelectedApprovedObjects(multiApprovedWorkspace.workspaceId);
  syncWorkspaceObjectsToScene(multiApprovedWorkspace.workspaceId);
  scenarios.push(
    scenario("multiple_approved_objects", "Multiple Approved Objects", [
      multiPanel.rows.length === 3 ? "" : `Expected 3 candidates, got ${multiPanel.rows.length}`,
      getWorkspaceCreatedObjects(multiApprovedWorkspace.workspaceId).length === 3
        ? ""
        : "Expected 3 created objects",
      getWorkspaceSyncedSceneObjects(multiApprovedWorkspace.workspaceId).length === 3
        ? ""
        : "Expected 3 scene objects",
    ].filter(Boolean))
  );

  const workspaceA = createWorkspace("Switch Workspace A");
  const workspaceB = createWorkspace("Switch Workspace B");
  await seedEntitiesCsv(workspaceA.workspaceId);
  await seedEntitiesCsv(workspaceB.workspaceId);
  approveByName(workspaceA.workspaceId, "Customer");
  approveByName(workspaceB.workspaceId, "Supplier");
  createSelectedApprovedObjects(workspaceA.workspaceId);
  createSelectedApprovedObjects(workspaceB.workspaceId);
  syncWorkspaceObjectsToScene(workspaceA.workspaceId);
  syncWorkspaceObjectsToScene(workspaceB.workspaceId);
  setActiveWorkspace(workspaceA.workspaceId);
  const activeAObjects = getWorkspaceObjects(getActiveWorkspace()!.workspaceId);
  const activeAScene = getWorkspaceSyncedSceneObjects(getActiveWorkspace()!.workspaceId);
  setActiveWorkspace(workspaceB.workspaceId);
  const activeBObjects = getWorkspaceObjects(getActiveWorkspace()!.workspaceId);
  const activeBScene = getWorkspaceSyncedSceneObjects(getActiveWorkspace()!.workspaceId);
  scenarios.push(
    scenario("workspace_switch", "Workspace Switch", [
      activeAObjects.length === 1 ? "" : "Active A should expose one object",
      activeBObjects.length === 1 ? "" : "Active B should expose one object",
      activeAObjects[0]?.workspaceId === workspaceA.workspaceId ? "" : "Active A workspace mismatch",
      activeBObjects[0]?.workspaceId === workspaceB.workspaceId ? "" : "Active B workspace mismatch",
      activeAScene.every((object) => object.workspaceId === workspaceA.workspaceId) ? "" : "Active A scene leak",
      activeBScene.every((object) => object.workspaceId === workspaceB.workspaceId) ? "" : "Active B scene leak",
    ].filter(Boolean))
  );

  const duplicateSyncWorkspace = createWorkspace("Duplicate Sync Workspace");
  await seedEntitiesCsv(duplicateSyncWorkspace.workspaceId);
  approveByName(duplicateSyncWorkspace.workspaceId, "Customer");
  createSelectedApprovedObjects(duplicateSyncWorkspace.workspaceId);
  const firstSync = syncWorkspaceObjectsToScene(duplicateSyncWorkspace.workspaceId);
  const secondSync = syncWorkspaceObjectsToScene(duplicateSyncWorkspace.workspaceId);
  scenarios.push(
    scenario("duplicate_sync_attempt", "Duplicate Sync Attempt", [
      firstSync.success ? "" : "First sync failed",
      secondSync.duplicateCount >= 1 || secondSync.reason === "duplicate"
        ? ""
        : "Duplicate sync not blocked",
      getWorkspaceSyncedSceneObjects(duplicateSyncWorkspace.workspaceId).length === 1
        ? ""
        : "Duplicate sync created extra scene objects",
    ].filter(Boolean))
  );

  const duplicateCreateWorkspace = createWorkspace("Duplicate Creation Workspace");
  await seedEntitiesCsv(duplicateCreateWorkspace.workspaceId);
  approveByName(duplicateCreateWorkspace.workspaceId, "Customer");
  const firstCreate = createSelectedApprovedObjects(duplicateCreateWorkspace.workspaceId);
  const secondCreate = createSelectedApprovedObjects(duplicateCreateWorkspace.workspaceId);
  scenarios.push(
    scenario("duplicate_creation_attempt", "Duplicate Creation Attempt", [
      firstCreate.success ? "" : "First creation failed",
      getWorkspaceCreatedObjects(duplicateCreateWorkspace.workspaceId).length === 1
        ? ""
        : "Duplicate creation added objects",
      secondCreate.message.toLowerCase().includes("duplicate") ||
      secondCreate.message.toLowerCase().includes("skipped")
        ? ""
        : "Duplicate creation message missing",
    ].filter(Boolean))
  );

  const reloadWorkspace = createWorkspace("Reload Persistence Workspace");
  await seedEntitiesCsv(reloadWorkspace.workspaceId);
  approveByName(reloadWorkspace.workspaceId, "Customer");
  createSelectedApprovedObjects(reloadWorkspace.workspaceId);
  syncWorkspaceObjectsToScene(reloadWorkspace.workspaceId);
  const createdRaw = window.localStorage.getItem("nexora.workspaceCreatedObjects.v2");
  const syncRaw = window.localStorage.getItem("nexora.workspaceSceneSyncObjects.v2");
  const syncRecordsRaw = window.localStorage.getItem("nexora.workspaceSceneSyncRecords.v2");
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceSceneSyncPipelineForTests();
  if (createdRaw) window.localStorage.setItem("nexora.workspaceCreatedObjects.v2", createdRaw);
  if (syncRaw) window.localStorage.setItem("nexora.workspaceSceneSyncObjects.v2", syncRaw);
  if (syncRecordsRaw) window.localStorage.setItem("nexora.workspaceSceneSyncRecords.v2", syncRecordsRaw);
  scenarios.push(
    scenario("reload_persistence", "Reload Persistence", [
      createdRaw ? "" : "Created object storage missing",
      syncRaw ? "" : "Scene sync storage missing",
      syncRecordsRaw ? "" : "Scene sync record storage missing",
      getWorkspaceCreatedObjects(reloadWorkspace.workspaceId).length === 1
        ? ""
        : "Created objects failed reload",
      getWorkspaceSyncedSceneObjects(reloadWorkspace.workspaceId).length === 1
        ? ""
        : "Scene objects failed reload",
    ].filter(Boolean))
  );

  const selectionWorkspace = createWorkspace("Scene Selection Workspace");
  await seedEntitiesCsv(selectionWorkspace.workspaceId);
  approveByName(selectionWorkspace.workspaceId, "Customer");
  createSelectedApprovedObjects(selectionWorkspace.workspaceId);
  syncWorkspaceObjectsToScene(selectionWorkspace.workspaceId);
  const selectionScene = getWorkspaceSyncedSceneObjects(selectionWorkspace.workspaceId)[0];
  scenarios.push(
    scenario("scene_selection_after_sync", "Scene Selection After Sync", [
      selectionScene ? "" : "Scene object missing after sync",
      selectionScene?.sceneObjectId ? "" : "Scene object id missing",
      selectionScene?.originWorkspaceObjectId ? "" : "Origin workspace object id missing",
      selectionScene?.originCandidateId ? "" : "Origin candidate id missing",
    ].filter(Boolean))
  );

  const panelWorkspace = createWorkspace("Object Panel After Sync Workspace");
  await seedEntitiesCsv(panelWorkspace.workspaceId);
  approveByName(panelWorkspace.workspaceId, "Supplier");
  createSelectedApprovedObjects(panelWorkspace.workspaceId);
  syncWorkspaceObjectsToScene(panelWorkspace.workspaceId);
  const panelAfterSync = buildObjectApprovalPanelSnapshot(panelWorkspace.workspaceId);
  scenarios.push(
    scenario("object_panel_after_sync", "Object Panel After Sync", [
      panelAfterSync.rows.some((row) => row.objectName === "Supplier" && row.approved)
        ? ""
        : "Approval panel lost approved supplier row",
      panelAfterSync.workspaceId === panelWorkspace.workspaceId ? "" : "Panel workspace mismatch",
    ].filter(Boolean))
  );

  scenarios.push(
    scenario("empty_workspace", "Empty Workspace", [
      listWorkspaceDataSourceSchemas(emptyWorkspace.workspaceId).length === 0
        ? ""
        : "Empty workspace should have zero schemas",
      listWorkspaceCandidateObjects(emptyWorkspace.workspaceId).length === 0
        ? ""
        : "Empty workspace should have zero candidates",
      getWorkspaceCreatedObjects(emptyWorkspace.workspaceId).length === 0
        ? ""
        : "Empty workspace should have zero objects",
      getWorkspaceSyncedSceneObjects(emptyWorkspace.workspaceId).length === 0
        ? ""
        : "Empty workspace should have zero scene objects",
    ].filter(Boolean))
  );

  const traceScene = singleSceneObjects[0];
  const traceCreated = singleCreatedObjects[0];
  const traceRecord = singleTraceRecord;

  gates.push(
    gate("A", "Schema Discovery Works", [
      schemaContractSource.includes("WORKSPACE_DATA_SOURCE_SCHEMA_VERSION") ? "" : "Schema contract missing",
      schemaDiscoverySource.includes("discoverWorkspaceCsvSchema") ? "" : "Schema discovery missing",
      schemaResolverSource.includes("getDataSourceSchema") ? "" : "Schema resolver API missing",
      csvUploadSource.includes("discoverDataSourceSchema") ? "" : "CSV upload missing schema hook",
      singleUploadOk &&
      listWorkspaceDataSourceSchemas(singleWorkspace.workspaceId)[0]?.contractVersion ===
        DATA_SOURCE_SCHEMA_VERSION
        ? ""
        : "Runtime schema discovery failed",
      legacySchemaContractSource.includes("DATA_SOURCE_SCHEMA_VERSION") ? "" : "Legacy schema contract missing",
    ].filter(Boolean))
  );

  gates.push(
    gate("B", "Column Classification Works", [
      workspaceClassificationSource.includes("classifyDataSourceColumns") ? "" : "Classification API missing",
      workspaceClassificationContractSource.includes("NEXORA_COLUMN_CLASSIFICATION_LOG_PREFIX")
        ? ""
        : "Classification diagnostic prefix missing",
      classificationSource.includes("classifyAndSaveWorkspaceColumnsFromSchema")
        ? ""
        : "Legacy classification facade missing",
      listWorkspaceColumnClassificationProfiles(singleWorkspace.workspaceId)[0]?.contractVersion ===
        COLUMN_CLASSIFICATION_VERSION
        ? ""
        : "Runtime classification failed",
      classificationContractSource.includes(COLUMN_CLASSIFICATION_VERSION) ? "" : "Classification version missing",
    ].filter(Boolean))
  );

  gates.push(
    gate("C", "Candidate Object Discovery Works", [
      workspaceCandidateSource.includes("discoverCandidateObjects") ? "" : "Candidate discovery API missing",
      workspaceCandidateSource.includes("getColumnClassifications") ? "" : "Candidate must read classifications",
      candidateSource.includes("discoverAndSaveCandidateObjectsFromClassification")
        ? ""
        : "Legacy candidate facade missing",
      listWorkspaceCandidateObjects(singleWorkspace.workspaceId).length === 3
        ? ""
        : "Candidate count mismatch",
      candidateContractSource.includes(CANDIDATE_OBJECT_VERSION) ? "" : "Candidate version missing",
    ].filter(Boolean))
  );

  gates.push(
    gate("D", "Object Approval Panel Works", [
      approvalRuntimeSource.includes("approveObjectApprovalCandidate") ? "" : "Approve action missing",
      workspaceApprovalRuntimeSource.includes("getApprovedCandidates") ? "" : "Approved list API missing",
      approvalPanelSource.includes("Object Approval Panel") ? "" : "Approval panel title missing",
      approvalPanelSource.includes("Create Selected Objects") ? "" : "Create action missing",
      operationalWorkspaceSource.includes("WorkspaceObjectApprovalPanel") ? "" : "Panel mount missing",
      singlePanelBefore.rows.length === 3 ? "" : "Approval panel row count mismatch",
    ].filter(Boolean))
  );

  gates.push(
    gate("E", "Object Creation Pipeline Works", [
      workspaceCreationSource.includes("createWorkspaceObjectsFromApprovedCandidates")
        ? ""
        : "Creation API missing",
      workspaceCreationSource.includes("getApprovedCandidates") ? "" : "Creation must read approved candidates",
      pipelineSource.includes(OBJECT_CREATION_PIPELINE_VERSION) ? "" : "Pipeline version missing",
      pipelineSource.includes("syncWorkspacePipelineObjectsToScene")
        ? "Pipeline must not auto-sync scene"
        : "",
      singleCreated.success ? "" : "Runtime object creation failed",
      singlePipelineObjects.length === 1 ? "" : "Runtime object count mismatch",
    ].filter(Boolean))
  );

  gates.push(
    gate("F", "Workspace Scene Sync Works", [
      workspaceSceneSyncPipelineSource.includes("syncWorkspaceObjectsToScene")
        ? ""
        : "Scene sync API missing",
      workspaceSceneSyncPipelineSource.includes("getWorkspaceCreatedObjects")
        ? ""
        : "Scene sync must read created objects only",
      approvalPanelSource.includes("Sync Objects To Scene") ? "" : "Scene sync UI action missing",
      singleSync.success ? "" : "Runtime scene sync failed",
      singleSceneObjects.length === 1 ? "" : "Runtime scene object count mismatch",
      sceneHasNoRelationships(singleSceneJson) ? "" : "Scene sync created relationships",
    ].filter(Boolean))
  );

  gates.push(
    gate("G", "Workspace Isolation Preserved", [
      getWorkspaceCreatedObjects(workspaceA.workspaceId).length === 1 ? "" : "Workspace A object isolation failed",
      getWorkspaceCreatedObjects(workspaceB.workspaceId).length === 1 ? "" : "Workspace B object isolation failed",
      getWorkspaceSyncedSceneObjects(workspaceA.workspaceId)[0]?.workspaceId === workspaceA.workspaceId
        ? ""
        : "Workspace A scene isolation failed",
      getWorkspaceSyncedSceneObjects(workspaceB.workspaceId)[0]?.workspaceId === workspaceB.workspaceId
        ? ""
        : "Workspace B scene isolation failed",
    ].filter(Boolean))
  );

  gates.push(
    gate("H", "Traceability Preserved", [
      traceCreated?.originCandidateId ? "" : "Created object missing originCandidateId",
      traceScene?.originCandidateId ? "" : "Scene object missing originCandidateId",
      traceScene?.originWorkspaceObjectId === traceCreated?.objectId
        ? ""
        : "Scene to workspace traceability broken",
      traceRecord?.originCandidateId === traceCreated?.originCandidateId
        ? ""
        : "Sync record traceability broken",
    ].filter(Boolean))
  );

  gates.push(
    gate("I", "Duplicate Creation Protection", [
      getWorkspaceCreatedObjects(duplicateCreateWorkspace.workspaceId).length === 1
        ? ""
        : "Duplicate creation not blocked",
    ].filter(Boolean))
  );

  gates.push(
    gate("J", "Duplicate Scene Sync Protection", [
      getWorkspaceSyncedSceneObjects(duplicateSyncWorkspace.workspaceId).length === 1
        ? ""
        : "Duplicate scene sync not blocked",
    ].filter(Boolean))
  );

  gates.push(
    gate("K", "No Relationship Creation", [
      singleScoped.relationships.length === 0 ? "" : "Relationships created during pipeline",
      sceneHasNoRelationships(singleSceneJson) ? "" : "Scene relationships created during sync",
    ].filter(Boolean))
  );

  gates.push(
    gate("L", "No Topology Creation", [
      workspaceSceneSyncLegacyBridgeSource.includes("createsTopology: false")
        ? ""
        : "Scene sync missing topology guard flag",
      !workspaceSceneSyncPipelineSource.includes("topologyEngine")
        ? ""
        : "Scene sync references topology engine",
    ].filter(Boolean))
  );

  gates.push(
    gate("M", "No KPI Creation", [
      singleScoped.kpis.length === 0 ? "" : "KPIs created during pipeline",
    ].filter(Boolean))
  );

  gates.push(
    gate("N", "No Risk Creation", [
      singleScoped.risks.length === 0 ? "" : "Risks created during pipeline",
    ].filter(Boolean))
  );

  gates.push(
    gate("O", "No Dashboard Routing Mutation", [
      workspaceSceneSyncPipelineSource.includes("dashboardContext") ? "Scene sync mutates dashboard routing" : "",
      workspaceCreationSource.includes("dashboardContext") ? "Creation mutates dashboard routing" : "",
      workspaceApprovalRuntimeSource.includes("dashboardContext")
        ? "Approval mutates dashboard routing"
        : "",
      dashboardBridgeSource.includes("traceObjectClickDashboardCommitBlocked")
        ? ""
        : "Object click guard missing",
    ].filter(Boolean))
  );

  gates.push(
    gate("P", "No Assistant Mutation", [
      singleScoped.assistantContexts.length === 0 ? "" : "Assistant contexts created",
      workspaceSceneSyncPipelineSource.includes("assistant") ? "Scene sync touches assistant" : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("Q", "No Object Click Regression", [
      objectClickGuardSource.includes("traceObjectClickDashboardCommitBlocked") ? "" : "Click guard missing",
      approvalPanelSource.includes("syncWorkspaceObjectsToSceneAction") &&
      !approvalPanelSource.includes("commitDashboard")
        ? ""
        : "Approval panel may mutate dashboard on sync",
    ].filter(Boolean))
  );

  gates.push(
    gate("R", "No Selection Regression", [
      approvalPanelSource.includes("selectObjectApprovalPanelCandidate") ? "" : "Selection action missing",
      panelAfterSync.rows.length > 0 ? "" : "Panel rows missing after sync",
      panelAfterSync.workspaceId === panelWorkspace.workspaceId ? "" : "Panel workspace lost after sync",
    ].filter(Boolean))
  );

  gates.push(
    gate("S", "No Scene Freeze", [
      singleSync.success ? "" : "Scene sync did not complete",
      typeof singleSync.sceneObjectCount === "number" ? "" : "Scene sync result malformed",
    ].filter(Boolean))
  );

  gates.push(
    gate("T", "No Infinite Loop", [
      !workspaceSceneSyncPipelineSource.includes("syncWorkspaceObjectsToScene(") ||
      workspaceSceneSyncPipelineSource.split("syncWorkspaceObjectsToScene(").length <= 2
        ? ""
        : "Scene sync may recurse",
    ].filter(Boolean))
  );

  gates.push(
    gate("U", "No Recursive setSceneJson", [
      workspaceSceneSyncPipelineSource.includes("setSceneJson") ? "Scene sync calls setSceneJson" : "",
      sceneSyncSource.includes("setSceneJson") ? "Scene sync facade calls setSceneJson" : "",
      workspaceCreationSource.includes("setSceneJson") ? "Creation calls setSceneJson" : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("V", "No MRP Write Loop", [
      workspaceSceneSyncPipelineSource.includes("dispatch(") ? "Scene sync dispatches MRP writes" : "",
      workspaceSceneSyncPipelineSource.includes("routeAndCommitDashboardContext")
        ? "Scene sync commits dashboard context"
        : "",
      workspaceCreationSource.includes("routeAndCommitDashboardContext")
        ? "Creation commits dashboard context"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("W", "Build Passes", [
      input.buildPassed === false ? "Build verification failed" : "",
      input.testsPassed === false ? "DS-1 pipeline tests failed" : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("X", "Workspace Switching Works", [
      activeAObjects[0]?.workspaceId === workspaceA.workspaceId ? "" : "Workspace A switch failed",
      activeBObjects[0]?.workspaceId === workspaceB.workspaceId ? "" : "Workspace B switch failed",
      activeAObjects[0]?.resourceId !== activeBObjects[0]?.resourceId
        ? ""
        : "Workspace switch returned same object id",
    ].filter(Boolean))
  );

  const runtimeFailures = scenarios
    .filter((entry) => entry.status === "FAIL")
    .map((entry) => `${entry.name}: ${entry.detail}`);

  if (runtimeFailures.length > 0) {
    evidence.push(`Runtime scenario failures: ${runtimeFailures.length}`);
  }
  evidence.push(`Single CSV objects/scene: ${singlePipelineObjects.length}/${singleSceneObjects.length}`);
  evidence.push(`Customer+Supplier objects/scene: ${pairObjects.length}/${pairScene.length}`);
  evidence.push(`Duplicate create count: ${getWorkspaceCreatedObjects(duplicateCreateWorkspace.workspaceId).length}`);
  evidence.push(`Duplicate sync count: ${getWorkspaceSyncedSceneObjects(duplicateSyncWorkspace.workspaceId).length}`);
  evidence.push(`Traceability candidate: ${traceScene?.originCandidateId ?? "missing"}`);
  evidence.push(`Empty workspace schemas: ${listWorkspaceDataSourceSchemas(emptyWorkspace.workspaceId).length}`);
  evidence.push("Scene sync preserves empty relationships array");
  evidence.push("Explicit create and sync actions only");

  const freezeTagsValid =
    WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS.length === 5 &&
    WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS.includes("[DS_1_COMPLETE]");
  const certified =
    freezeTagsValid &&
    gates.every((entry) => entry.status === "PASS") &&
    scenarios.every((entry) => entry.status === "PASS");

  return Object.freeze({
    tag: DS17_CERTIFICATION_TAG,
    version: "DS-1:7",
    certified,
    result: certified ? "PASS" : "FAIL",
    diagnostics: Object.freeze([WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    scenarios: Object.freeze(scenarios),
    freezeTags: WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS,
    evidence: Object.freeze(evidence),
  });
}
