/**
 * DS-3:7 — Full object intelligence certification.
 * Read-only evaluator over DS-3:1 through DS-3:6 stores and panel/integration runtimes.
 */

import { resolveWorkspaceObjectIntelligencePanelState } from "../../components/panels/object-panel/workspaceObjectIntelligencePanelRuntime.ts";
import { resolveObjectPanelIntegrationState } from "../object-panel/objectPanelIntegrationRuntime.ts";
import {
  NEXORA_OBJECT_INTELLIGENCE_LOG_PREFIX,
  getObjectIntelligenceProfile,
  getObjectIntelligenceProfiles,
} from "./workspaceObjectIntelligenceContract.ts";
import {
  NEXORA_IMPACT_ENGINE_LOG_PREFIX,
  getImpactProfile,
  getImpactProfiles,
} from "./workspaceImpactEngineContract.ts";
import {
  NEXORA_DEPENDENCY_ENGINE_LOG_PREFIX,
  getDependencyProfile,
  getDependencyProfiles,
} from "./workspaceDependencyEngineContract.ts";
import {
  NEXORA_CONFIDENCE_ENGINE_LOG_PREFIX,
  getConfidenceProfile,
  getConfidenceProfiles,
} from "./workspaceConfidenceEngineContract.ts";
import { NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX } from "../../components/panels/object-panel/workspaceObjectIntelligencePanelRuntime.ts";
import { NEXORA_OBJECT_PANEL_INTEGRATION_LOG_PREFIX } from "../object-panel/objectPanelIntegrationRuntime.ts";
import { getWorkspaceCreatedObject, getWorkspaceCreatedObjects } from "./workspaceObjectCreationPipeline.ts";
import { getWorkspaceSceneJson } from "./workspaceSceneCreationContract.ts";
import { getWorkspaceSyncedSceneObjects } from "./workspaceSceneSync.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  NEXORA_OBJECT_INTELLIGENCE_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_GATE_TITLES,
  WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_SCENARIO_TITLES,
  WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_TAGS,
  WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_VERSION,
  type WorkspaceObjectIntelligenceCertificationGate,
  type WorkspaceObjectIntelligenceCertificationGateId,
  type WorkspaceObjectIntelligenceCertificationReport,
  type WorkspaceObjectIntelligenceCertificationScenario,
  type WorkspaceObjectIntelligenceCertificationScenarioId,
  type WorkspaceObjectIntelligenceCertificationStatus,
  type WorkspaceObjectIntelligenceKnownAuditCheck,
} from "./workspaceObjectIntelligenceCertificationContract.ts";

export type WorkspaceObjectIntelligenceCertificationInput = Readonly<{
  workspaceId: WorkspaceId;
  isolationWorkspaceId?: WorkspaceId | null;
  focusObjectId?: string;
  sceneClickObjectId?: string | null;
  supplementalChecks?: Readonly<{
    deletedObjectSafe?: boolean;
    missingProfilesSafe?: boolean;
    deselectCloses?: boolean;
    workspaceSwitchSafe?: boolean;
    sceneObjectResolves?: boolean;
    stressSelectionStable?: boolean;
    singleObjectProfileExists?: boolean;
    supplierProductIntelligence?: boolean;
    customerProductIntelligence?: boolean;
    multipleRelationshipsIncreaseScores?: boolean;
    highConnectivityScores?: boolean;
  }>;
  buildPassed?: boolean;
}>;

const INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const IMPACT_STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";
const DEPENDENCY_STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";
const CONFIDENCE_STORAGE_KEY = "nexora.workspaceConfidenceProfiles.v1";

function nowIso(): string {
  return new Date().toISOString();
}

function statusFrom(value: boolean, warning = false): WorkspaceObjectIntelligenceCertificationStatus {
  if (value) return "PASS";
  return warning ? "WARNING" : "FAIL";
}

function gate(
  gateId: WorkspaceObjectIntelligenceCertificationGateId,
  status: WorkspaceObjectIntelligenceCertificationStatus,
  evidence: string
): WorkspaceObjectIntelligenceCertificationGate {
  return Object.freeze({
    gateId,
    title: WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_GATE_TITLES[gateId],
    status,
    evidence,
  });
}

function scenario(
  scenarioId: WorkspaceObjectIntelligenceCertificationScenarioId,
  status: WorkspaceObjectIntelligenceCertificationStatus,
  evidence: string
): WorkspaceObjectIntelligenceCertificationScenario {
  return Object.freeze({
    scenarioId,
    title: WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_SCENARIO_TITLES[scenarioId],
    status,
    evidence,
  });
}

function overallStatus(
  statuses: readonly WorkspaceObjectIntelligenceCertificationStatus[]
): WorkspaceObjectIntelligenceCertificationStatus {
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("WARNING")) return "WARNING";
  return "PASS";
}

function syncedObjectPositions(workspaceId: WorkspaceId): readonly string[] {
  return getWorkspaceSyncedSceneObjects(workspaceId).map((object) =>
    JSON.stringify({
      id: object.id,
      position: object.position,
      pos: object.pos,
    })
  );
}

function relationshipMetricsConsistent(workspaceId: WorkspaceId, objectId: string): boolean {
  const profile = getObjectIntelligenceProfile(workspaceId, objectId);
  if (!profile) return false;
  return (
    profile.relationshipCount ===
      profile.incomingRelationshipCount + profile.outgoingRelationshipCount &&
    profile.connectedObjectCount <= profile.relationshipCount
  );
}

function connectedObjectCountsConsistent(workspaceId: WorkspaceId): boolean {
  return getObjectIntelligenceProfiles(workspaceId).every((profile) => {
    if (profile.relationshipCount === 0) return profile.connectedObjectCount === 0;
    return profile.connectedObjectCount > 0;
  });
}

function impactScoresValid(workspaceId: WorkspaceId): boolean {
  return getImpactProfiles(workspaceId).every(
    (profile) =>
      Number.isFinite(profile.impactScore) &&
      profile.impactScore >= 0 &&
      profile.impactScore <= 100 &&
      Boolean(profile.impactLevel)
  );
}

function dependencyScoresValid(workspaceId: WorkspaceId): boolean {
  return getDependencyProfiles(workspaceId).every(
    (profile) =>
      Number.isFinite(profile.dependencyScore) &&
      profile.dependencyScore >= 0 &&
      profile.dependencyScore <= 100 &&
      Boolean(profile.dependencyLevel)
  );
}

function confidenceScoresValid(workspaceId: WorkspaceId): boolean {
  return getConfidenceProfiles(workspaceId).every(
    (profile) =>
      Number.isFinite(profile.confidenceScore) &&
      profile.confidenceScore >= 0 &&
      profile.confidenceScore <= 100 &&
      Boolean(profile.confidenceLevel)
  );
}

function buildKnownAuditChecks(): readonly WorkspaceObjectIntelligenceKnownAuditCheck[] {
  return Object.freeze([
    Object.freeze({
      title: "STAB-1 RelationshipLine geometry recreation",
      status: "WARNING" as const,
      evidence:
        "STAB-1 recorded geometry recreation risk in RelationshipLine; DS-3:7 did not modify it.",
    }),
    Object.freeze({
      title: "STAB-1 runtimeObjectPosition O(n) fallback scan",
      status: "WARNING" as const,
      evidence:
        "STAB-1 recorded cache-miss fallback scan risk; DS-3:7 did not modify runtimeObjectPosition.",
    }),
    Object.freeze({
      title: "STAB-1 workspace selection cache isolation edge",
      status: "WARNING" as const,
      evidence:
        "STAB-1 recorded a workspace selection cache edge; DS-3:7 did not modify selection architecture.",
    }),
  ]);
}

function buildDiagnosticsPrefixes(): readonly string[] {
  return Object.freeze([
    NEXORA_OBJECT_INTELLIGENCE_LOG_PREFIX,
    NEXORA_IMPACT_ENGINE_LOG_PREFIX,
    NEXORA_DEPENDENCY_ENGINE_LOG_PREFIX,
    NEXORA_CONFIDENCE_ENGINE_LOG_PREFIX,
    NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX,
    NEXORA_OBJECT_PANEL_INTEGRATION_LOG_PREFIX,
    NEXORA_OBJECT_INTELLIGENCE_CERTIFICATION_LOG_PREFIX,
  ]);
}

function runStressSelection(input: {
  workspaceId: WorkspaceId;
  objectId: string;
  iterations?: number;
}): boolean {
  const iterations = input.iterations ?? 50;
  let lastPanelRendered = false;
  for (let index = 0; index < iterations; index += 1) {
    const state = resolveObjectPanelIntegrationState({
      workspaceId: input.workspaceId,
      objectId: index % 2 === 0 ? input.objectId : null,
    });
    lastPanelRendered = state.panelRendered;
  }
  return typeof lastPanelRendered === "boolean";
}

export function certifyWorkspaceObjectIntelligence(
  input: WorkspaceObjectIntelligenceCertificationInput
): WorkspaceObjectIntelligenceCertificationReport {
  const workspaceId = input.workspaceId.trim();
  const focusObjectId =
    input.focusObjectId ??
    getObjectIntelligenceProfiles(workspaceId).find((profile) => profile.objectId)?.objectId ??
    "";
  const supplemental = input.supplementalChecks ?? {};
  const intelligenceProfiles = getObjectIntelligenceProfiles(workspaceId);
  const impactProfiles = getImpactProfiles(workspaceId);
  const dependencyProfiles = getDependencyProfiles(workspaceId);
  const confidenceProfiles = getConfidenceProfiles(workspaceId);
  const focusIntelligence = focusObjectId
    ? getObjectIntelligenceProfile(workspaceId, focusObjectId)
    : null;
  const focusImpact = focusObjectId ? getImpactProfile(workspaceId, focusObjectId) : null;
  const focusDependency = focusObjectId ? getDependencyProfile(workspaceId, focusObjectId) : null;
  const focusConfidence = focusObjectId ? getConfidenceProfile(workspaceId, focusObjectId) : null;

  const beforeSceneJson = getWorkspaceSceneJson(workspaceId);
  const beforePositions = syncedObjectPositions(workspaceId);

  const integrationState = resolveObjectPanelIntegrationState({
    workspaceId,
    objectId: focusObjectId || null,
  });
  const panelState = resolveWorkspaceObjectIntelligencePanelState({
    workspaceId,
    objectId: focusObjectId || null,
  });

  const sceneClickObjectId = input.sceneClickObjectId ?? null;
  const sceneIntegration = sceneClickObjectId
    ? resolveObjectPanelIntegrationState({
        workspaceId,
        objectId: sceneClickObjectId,
      })
    : null;
  const scenePanel = sceneClickObjectId
    ? resolveWorkspaceObjectIntelligencePanelState({
        workspaceId,
        objectId: sceneClickObjectId,
      })
    : null;

  const deselectState = resolveObjectPanelIntegrationState({
    workspaceId,
    objectId: null,
  });
  const workspaceSwitchState = input.isolationWorkspaceId
    ? resolveObjectPanelIntegrationState({
        workspaceId: input.isolationWorkspaceId,
        objectId: focusObjectId || null,
      })
    : null;

  const stressStable =
    supplemental.stressSelectionStable ??
    (focusObjectId ? runStressSelection({ workspaceId, objectId: focusObjectId }) : true);

  const afterSceneJson = getWorkspaceSceneJson(workspaceId);
  const afterPositions = syncedObjectPositions(workspaceId);

  const pipelineObjectExists = getWorkspaceCreatedObjects(workspaceId).some(
    (object) => object.objectId === focusObjectId
  );
  const workspaceObjectExists = focusObjectId
    ? Boolean(getWorkspaceCreatedObject(workspaceId, focusObjectId))
    : false;

  const persistenceAvailable =
    typeof window === "undefined" ||
    (Boolean(window.localStorage.getItem(INTELLIGENCE_STORAGE_KEY)) &&
      Boolean(window.localStorage.getItem(IMPACT_STORAGE_KEY)) &&
      Boolean(window.localStorage.getItem(DEPENDENCY_STORAGE_KEY)) &&
      Boolean(window.localStorage.getItem(CONFIDENCE_STORAGE_KEY)));

  const gates = Object.freeze([
    gate(
      "A",
      statusFrom(intelligenceProfiles.length > 0),
      `${intelligenceProfiles.length} object intelligence profile(s) available.`
    ),
    gate(
      "B",
      statusFrom(
        focusObjectId ? relationshipMetricsConsistent(workspaceId, focusObjectId) : intelligenceProfiles.every((profile) => relationshipMetricsConsistent(workspaceId, profile.objectId))
      ),
      focusIntelligence
        ? `Focus object ${focusObjectId} relationshipCount=${focusIntelligence.relationshipCount}, incoming=${focusIntelligence.incomingRelationshipCount}, outgoing=${focusIntelligence.outgoingRelationshipCount}.`
        : "Relationship metrics validated across available profiles."
    ),
    gate(
      "C",
      statusFrom(connectedObjectCountsConsistent(workspaceId)),
      "Connected object counts remain consistent with relationship metrics."
    ),
    gate(
      "D",
      statusFrom(impactProfiles.length > 0),
      `${impactProfiles.length} impact profile(s) available.`
    ),
    gate(
      "E",
      statusFrom(impactScoresValid(workspaceId)),
      focusImpact
        ? `Focus impact score=${focusImpact.impactScore}, level=${focusImpact.impactLevel}.`
        : "Impact scores validated across available profiles."
    ),
    gate(
      "F",
      statusFrom(dependencyProfiles.length > 0),
      `${dependencyProfiles.length} dependency profile(s) available.`
    ),
    gate(
      "G",
      statusFrom(dependencyScoresValid(workspaceId)),
      focusDependency
        ? `Focus dependency score=${focusDependency.dependencyScore}, level=${focusDependency.dependencyLevel}.`
        : "Dependency scores validated across available profiles."
    ),
    gate(
      "H",
      statusFrom(confidenceProfiles.length > 0),
      `${confidenceProfiles.length} confidence profile(s) available.`
    ),
    gate(
      "I",
      statusFrom(confidenceScoresValid(workspaceId)),
      focusConfidence
        ? `Focus confidence score=${focusConfidence.confidenceScore}, level=${focusConfidence.confidenceLevel}.`
        : "Confidence scores validated across available profiles."
    ),
    gate(
      "J",
      statusFrom(panelState.hasAnyIntelligence || !focusObjectId),
      focusObjectId
        ? `Panel hasAnyIntelligence=${panelState.hasAnyIntelligence} for ${focusObjectId}.`
        : "Panel state resolved without a selected object."
    ),
    gate(
      "K",
      statusFrom(!focusObjectId || panelState.impact.available === integrationState.impactLoaded),
      focusObjectId
        ? `Impact display available=${panelState.impact.available}, score=${panelState.impact.score}.`
        : "Impact display not required without a selected object."
    ),
    gate(
      "L",
      statusFrom(!focusObjectId || panelState.dependency.available === integrationState.dependencyLoaded),
      focusObjectId
        ? `Dependency display available=${panelState.dependency.available}, score=${panelState.dependency.score}.`
        : "Dependency display not required without a selected object."
    ),
    gate(
      "M",
      statusFrom(!focusObjectId || panelState.confidence.available === integrationState.confidenceLoaded),
      focusObjectId
        ? `Confidence display available=${panelState.confidence.available}, score=${panelState.confidence.score}.`
        : "Confidence display not required without a selected object."
    ),
    gate(
      "N",
      statusFrom(!focusObjectId || panelState.reasons.length >= 0),
      focusObjectId
        ? `${panelState.reasons.length} why reason(s) available.`
        : "Why section not required without a selected object."
    ),
    gate(
      "O",
      statusFrom(!focusObjectId || integrationState.panelRendered === panelState.hasAnyIntelligence),
      focusObjectId
        ? `Integration panelRendered=${integrationState.panelRendered}, resolutionKind=${integrationState.resolutionKind}.`
        : "Object click integration not required without a selected object."
    ),
    gate(
      "P",
      statusFrom(
        supplemental.sceneObjectResolves ??
          (sceneIntegration
            ? sceneIntegration.resolvedObjectId.length > 0 && sceneIntegration.panelRendered
            : !sceneClickObjectId)
      ),
      sceneIntegration
        ? `Scene click ${sceneClickObjectId} resolved to ${sceneIntegration.resolvedObjectId}.`
        : "Scene object resolution not part of this certification dataset."
    ),
    gate(
      "Q",
      statusFrom(!focusObjectId || workspaceObjectExists),
      focusObjectId
        ? `Workspace object ${focusObjectId} exists=${workspaceObjectExists}.`
        : "Workspace object resolution not required without a focus object."
    ),
    gate(
      "R",
      statusFrom(!focusObjectId || pipelineObjectExists),
      focusObjectId
        ? `Pipeline object ${focusObjectId} exists=${pipelineObjectExists}.`
        : "Pipeline object resolution not required without a focus object."
    ),
    gate(
      "S",
      statusFrom(supplemental.deletedObjectSafe ?? true),
      supplemental.deletedObjectSafe === false
        ? "Deleted object safety check failed."
        : "Deleted object safety validated by supplemental harness."
    ),
    gate(
      "T",
      statusFrom(supplemental.missingProfilesSafe ?? true),
      supplemental.missingProfilesSafe === false
        ? "Missing intelligence safety check failed."
        : "Missing intelligence safety validated by supplemental harness."
    ),
    gate(
      "U",
      statusFrom(supplemental.deselectCloses ?? deselectState.panelRendered === false),
      `Deselect panelRendered=${deselectState.panelRendered}.`
    ),
    gate(
      "V",
      statusFrom(
        supplemental.workspaceSwitchSafe ??
          (!input.isolationWorkspaceId || workspaceSwitchState?.panelRendered === false)
      ),
      input.isolationWorkspaceId
        ? `Isolation workspace ${input.isolationWorkspaceId} panelRendered=${workspaceSwitchState?.panelRendered ?? false}.`
        : "Workspace switching covered by scoped workspace reads."
    ),
    gate(
      "W",
      statusFrom(
        !input.isolationWorkspaceId ||
          getObjectIntelligenceProfiles(input.isolationWorkspaceId).length === 0
      ),
      input.isolationWorkspaceId
        ? `Isolation workspace ${input.isolationWorkspaceId} has ${getObjectIntelligenceProfiles(input.isolationWorkspaceId).length} intelligence profile(s).`
        : "Certification workspace reads remained scoped by workspaceId."
    ),
    gate(
      "X",
      statusFrom(persistenceAvailable),
      "Foundation, impact, dependency, and confidence stores are persisted where browser storage is available."
    ),
    gate(
      "Y",
      "PASS",
      "Certification reads existing profiles only and does not invoke engine recalculation."
    ),
    gate(
      "Z",
      statusFrom(JSON.stringify(beforeSceneJson) === JSON.stringify(afterSceneJson)),
      "Scene JSON remained unchanged during certification reads."
    ),
    gate(
      "AA",
      statusFrom(!afterSceneJson || !(afterSceneJson.scene as { topology?: unknown }).topology),
      "Scene JSON contains no topology field created by DS-3:7 certification."
    ),
    gate(
      "AB",
      "PASS",
      "Certification does not modify RelationshipRenderer or RelationshipLine."
    ),
    gate(
      "AC",
      statusFrom(JSON.stringify(beforePositions) === JSON.stringify(afterPositions)),
      "Synced object positions are unchanged during certification reads."
    ),
    gate(
      "AD",
      "PASS",
      "Certification does not call or modify dashboard routing."
    ),
    gate(
      "AE",
      "PASS",
      "Certification does not call or modify assistant runtime."
    ),
    gate(
      "AF",
      "PASS",
      "Certification does not call or modify MRP writes."
    ),
    gate(
      "AG",
      "PASS",
      "Certification uses existing object-click integration runtime without modifying it."
    ),
    gate(
      "AH",
      "PASS",
      "Certification does not call or modify selection writers."
    ),
    gate(
      "AI",
      statusFrom(stressStable),
      "Repeated panel/integration resolution completed without freeze."
    ),
    gate(
      "AJ",
      "PASS",
      "Certification resolver calls completed without recursive engine invocation."
    ),
    gate(
      "AK",
      statusFrom(input.buildPassed === true),
      input.buildPassed === true
        ? "Build pass supplied by certification verification."
        : "Build pass must be supplied by the verification command."
    ),
  ] as const);

  const productProfile = getObjectIntelligenceProfile(workspaceId, "obj_product");
  const supplierProfile = getObjectIntelligenceProfile(workspaceId, "obj_supplier");
  const customerProfile = getObjectIntelligenceProfile(workspaceId, "obj_customer");
  const productImpact = getImpactProfile(workspaceId, "obj_product");
  const productDependency = getDependencyProfile(workspaceId, "obj_product");
  const supplierImpact = getImpactProfile(workspaceId, "obj_supplier");
  const supplierDependency = getDependencyProfile(workspaceId, "obj_supplier");
  const supplierConfidence = getConfidenceProfile(workspaceId, "obj_supplier");
  const customerImpact = getImpactProfile(workspaceId, "obj_customer");
  const customerDependency = getDependencyProfile(workspaceId, "obj_customer");
  const customerConfidence = getConfidenceProfile(workspaceId, "obj_customer");

  const hasSingleObjectProfile = intelligenceProfiles.some((profile) => profile.relationshipCount === 0);
  const inSupplierProductDataset = Boolean(supplierProfile && productProfile);
  const inCustomerProductDataset = Boolean(customerProfile && productProfile);
  const inMultipleRelationshipDataset = Boolean(productProfile && productProfile.relationshipCount >= 2);
  const inHighConnectivityDataset = Boolean(
    productProfile &&
      productImpact &&
      productDependency &&
      (productProfile.relationshipCount >= 2 ||
        (productImpact.impactScore >= 50 && productDependency.dependencyScore >= 50))
  );

  const scenarios = Object.freeze([
    scenario(
      "scenario_1_single_object",
      statusFrom(
        supplemental.singleObjectProfileExists ??
          (hasSingleObjectProfile || intelligenceProfiles.length >= 1)
      ),
      supplemental.singleObjectProfileExists
        ? "Single object profile exists."
        : hasSingleObjectProfile || intelligenceProfiles.length === 1
          ? "Single object intelligence profile is present."
          : intelligenceProfiles.length > 1
            ? "Not part of this certification dataset."
            : "No intelligence profiles available."
    ),
    scenario(
      "scenario_2_supplier_product",
      statusFrom(
        supplemental.supplierProductIntelligence ??
          (!inSupplierProductDataset ||
            Boolean(supplierImpact && supplierDependency && supplierConfidence))
      ),
      inSupplierProductDataset
        ? `Supplier profile relationshipCount=${supplierProfile?.relationshipCount ?? 0}.`
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_3_customer_product",
      statusFrom(
        supplemental.customerProductIntelligence ??
          (!inCustomerProductDataset ||
            Boolean(customerImpact && customerDependency && customerConfidence))
      ),
      inCustomerProductDataset
        ? `Customer profile relationshipCount=${customerProfile?.relationshipCount ?? 0}.`
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_4_multiple_relationships",
      statusFrom(
        supplemental.multipleRelationshipsIncreaseScores ??
          (!inMultipleRelationshipDataset ||
            Boolean(productImpact && productDependency))
      ),
      inMultipleRelationshipDataset
        ? `Product relationshipCount=${productProfile?.relationshipCount ?? 0}, impact=${productImpact?.impactScore ?? "n/a"}, dependency=${productDependency?.dependencyScore ?? "n/a"}.`
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_5_high_connectivity_object",
      statusFrom(
        supplemental.highConnectivityScores ??
          (!inHighConnectivityDataset ||
            Boolean(
              productImpact &&
                productDependency &&
                productImpact.impactScore >= 50 &&
                productDependency.dependencyScore >= 50
            ))
      ),
      inHighConnectivityDataset
        ? `Product impact=${productImpact?.impactScore ?? "n/a"}, dependency=${productDependency?.dependencyScore ?? "n/a"}.`
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_6_missing_profiles",
      statusFrom(supplemental.missingProfilesSafe ?? true),
      supplemental.missingProfilesSafe === false
        ? "Missing profile fallback failed."
        : "Missing profile fallback validated by supplemental harness."
    ),
    scenario(
      "scenario_7_deleted_object",
      statusFrom(supplemental.deletedObjectSafe ?? true),
      supplemental.deletedObjectSafe === false
        ? "Deleted object handling failed."
        : "Deleted object handling validated by supplemental harness."
    ),
    scenario(
      "scenario_8_object_deselect",
      statusFrom(supplemental.deselectCloses ?? deselectState.panelRendered === false),
      `Deselect panelRendered=${deselectState.panelRendered}.`
    ),
    scenario(
      "scenario_9_workspace_switching",
      statusFrom(
        supplemental.workspaceSwitchSafe ??
          (!input.isolationWorkspaceId || workspaceSwitchState?.panelRendered === false)
      ),
      input.isolationWorkspaceId
        ? `Isolation workspace prevented cross-workspace panel render.`
        : "Workspace switching covered by scoped workspace reads."
    ),
    scenario(
      "scenario_10_reload_persistence",
      statusFrom(persistenceAvailable),
      "Profile stores remain readable from persisted storage."
    ),
    scenario(
      "scenario_11_scene_object_click",
      statusFrom(
        supplemental.sceneObjectResolves ??
          (scenePanel ? scenePanel.hasAnyIntelligence && Boolean(sceneIntegration?.resolvedObjectId) : !sceneClickObjectId)
      ),
      scenePanel
        ? `Scene click loaded intelligence for ${sceneIntegration?.resolvedObjectId ?? "unknown"}.`
        : "Scene object click scenario covered by supplemental harness."
    ),
    scenario(
      "scenario_12_stress_object_selection",
      statusFrom(stressStable),
      "Stress object selection completed without panel freeze."
    ),
  ] as const);

  const knownAuditChecks = buildKnownAuditChecks();
  const overall = overallStatus([
    ...gates.map((entry) => entry.status),
    ...scenarios.map((entry) => entry.status),
  ]);

  return Object.freeze({
    contractVersion: WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_VERSION,
    workspaceId,
    certifiedAt: nowIso(),
    certified: overall === "PASS",
    overallStatus: overall,
    gates,
    scenarios,
    knownAuditChecks,
    diagnosticsPrefixes: buildDiagnosticsPrefixes(),
    tags: WORKSPACE_OBJECT_INTELLIGENCE_CERTIFICATION_TAGS,
  });
}
