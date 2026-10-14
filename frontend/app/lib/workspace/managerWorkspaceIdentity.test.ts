/**
 * NPA-T MWI:1 — isolation invariants I1–I6.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import { dataRealityFoundationIdentity } from "../data-reality/dataRealityFoundation.ts";
import { NEXORA_MVP_WORKSPACE_KINDS } from "../nex-mvp/nexoraMVPApplicationFoundation.ts";
import { nexoraMVPApplicationFoundationIdentity } from "../nex-mvp/nexoraMVPApplicationFoundation.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "../nmi/nmiContract.ts";
import { RMS_FOUNDATION_CONTRACT } from "../rms/rmsFoundationContract.ts";
import { sceneOrgSavedSceneCollectionAccessIdentity } from "../scene-org/sceneOrgSavedSceneCollectionAccess.ts";
import { csvRealDataImportDurabilityIdentity } from "../data-reality/csvRealDataImportDurability.ts";
import {
  DEMO_WORKSPACE_ID,
  LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS,
} from "./workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import {
  bindWorkflowMode,
  classifyWorkspaceIdentifier,
  createManagerWorkspace,
  MANAGER_WORKSPACE_AUTHORITY,
  MANAGER_WORKSPACE_IDENTITY,
  projectManagerWorkspace,
  resolveActiveManagerWorkspace,
  separateWorkflowIdentity,
} from "./managerWorkspaceIdentity.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
});

test.afterEach(() => {
  resetWorkspaceRegistryForTests();
});

test("I1 — a real manager workspace keeps a stable workspace id", () => {
  const created = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(created);
  assert.equal(created.kind, "BUSINESS");
  assert.equal(created.name, "BAHA Doors");
  assert.notEqual(created.workspaceId, "");
  assert.equal(isLegacy(created.workspaceId), false);

  const again = resolveActiveManagerWorkspace();
  assert.equal(again.managerWorkspace?.workspaceId, created.workspaceId);
  assert.equal(again.activeWorkspaceId, created.workspaceId);
  assert.equal(projectManagerWorkspace({
    workspaceId: created.workspaceId,
    workspaceName: created.name,
    status: "active",
    createdAt: "2026-10-12T00:00:00.000Z",
    updatedAt: "2026-10-12T00:00:00.000Z",
    lastOpenedAt: "2026-10-12T00:00:00.000Z",
    kind: "BUSINESS",
  })?.workspaceId, created.workspaceId);
});

test("I2 — changing cockpit workflow mode does not change the canonical workspace id", () => {
  const created = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(created);
  const before = getActiveWorkspaceId();

  for (const workflowMode of NEXORA_MVP_WORKSPACE_KINDS) {
    const bound: Readonly<{ workspaceId: string; workflowMode: typeof workflowMode }> =
      bindWorkflowMode({ workspaceId: created.workspaceId, workflowMode });
    assert.equal(bound.workspaceId, created.workspaceId);
    assert.equal(bound.workflowMode, workflowMode);
    setActiveWorkspace(workflowMode);
    assert.equal(getActiveWorkspaceId(), before);
    assert.equal(separateWorkflowIdentity(workflowMode).acceptedAsWorkspaceIdentity, false);
    assert.equal(separateWorkflowIdentity(workflowMode).workflowMode, workflowMode);
  }

  assert.equal(resolveActiveManagerWorkspace().managerWorkspace?.workspaceId, created.workspaceId);
});

test("I3 — two manager workspaces stay distinct in the same cockpit mode", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion Project", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  assert.notEqual(baha.workspaceId, factory.workspaceId);
  assert.equal(baha.kind, "BUSINESS");
  assert.equal(factory.kind, "PROJECT");

  const bahaDecision = bindWorkflowMode({ workspaceId: baha.workspaceId, workflowMode: "decision" as const });
  const factoryDecision = bindWorkflowMode({ workspaceId: factory.workspaceId, workflowMode: "decision" as const });
  assert.equal(bahaDecision.workflowMode, factoryDecision.workflowMode);
  assert.notEqual(bahaDecision.workspaceId, factoryDecision.workspaceId);
});

test("I4 — active workspace resolves through the existing registry only", () => {
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.parallelWorkspaceStore, false);
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.activeWorkspaceOwner, "workspaceRegistryStore.getActiveWorkspaceId");
  assert.equal(resolveActiveManagerWorkspace().activeWorkspaceId, getActiveWorkspaceId());
  assert.equal(resolveActiveManagerWorkspace().activeWorkspaceId, DEMO_WORKSPACE_ID);
  assert.equal(classifyWorkspaceIdentifier(DEMO_WORKSPACE_ID), "demo_test");
  assert.equal(resolveActiveManagerWorkspace().managerWorkspace, null);

  const created = createManagerWorkspace({ name: "Customer Delivery Improvement", kind: "PROJECT" });
  assert.ok(created);
  assert.equal(resolveActiveManagerWorkspace().activeWorkspaceId, getActiveWorkspaceId());
  assert.equal(resolveActiveManagerWorkspace().managerWorkspace?.workspaceId, getActiveWorkspaceId());
  assert.equal(classifyWorkspaceIdentifier(created.workspaceId), "manager_workspace");
});

test("I5 — workspace foundation does not replace NMI unified company or project truth", () => {
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.replacesNmiUnifiedCompanyProject, false);
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.parallelCompanyProjectModel, false);
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.ownsBusinessProjectTruth, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.ownsUnifiedManagementModelContracts, true);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.parallelContextClassifier, false);
  assert.equal(
    MANAGER_WORKSPACE_AUTHORITY.businessProjectTruthAuthority,
    "BCA:1/BusinessProjectContextFoundation",
  );
  assert.equal(NMI_AUTHORITY_BOUNDARY.businessProjectContext, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.unifiedModelAuthority, NMI_FOUNDATION_CONTRACT.identity);
});

test("I6 — existing Nexora authorities remain the owners of their domains", () => {
  assert.equal(MANAGER_WORKSPACE_IDENTITY, "MWI:1/ManagerWorkspaceIdentity");
  assert.deepEqual([...NEXORA_MVP_WORKSPACE_KINDS], [...LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS]);
  assert.equal(nexoraMVPApplicationFoundationIdentity.length > 0, true);
  assert.equal(dataRealityFoundationIdentity.length > 0, true);
  assert.equal(csvRealDataImportDurabilityIdentity, "DATA-UX:6/CsvRealDataImportDurability");
  assert.equal(sceneOrgSavedSceneCollectionAccessIdentity.length > 0, true);
  assert.equal(typeof RMS_FOUNDATION_CONTRACT.unifiedCompanyModel, "boolean");
  assert.equal(RMS_FOUNDATION_CONTRACT.unifiedCompanyModel, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.stage.length > 0, true);
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor.length > 0, true);
  assert.equal(NMI_AUTHORITY_BOUNDARY.rms.length > 0, true);
  assert.equal(NMI_AUTHORITY_BOUNDARY.scenarios.length > 0, true);
  assert.equal(NMI_AUTHORITY_BOUNDARY.decision.length > 0, true);
  assert.equal(NMI_AUTHORITY_BOUNDARY.execution.length > 0, true);
});

test("legacy cockpit identifiers are classified and cannot become the active workspace", () => {
  for (const identifier of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    assert.equal(classifyWorkspaceIdentifier(identifier), "legacy_workflow");
    assert.equal(separateWorkflowIdentity(identifier).workspaceId, null);
  }
  const before = getActiveWorkspaceId();
  setActiveWorkspace("overview");
  setActiveWorkspace("execution");
  assert.equal(getActiveWorkspaceId(), before);
});

function isLegacy(value: string): boolean {
  return (LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS as readonly string[]).includes(value);
}
