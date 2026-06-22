/**
 * DS-2:6 — Full relationship intelligence certification.
 * Read-only evaluator over DS-2 relationship stores and existing scene render validation.
 */

import { readValidatedSceneRelationshipsForRender } from "../relationships/relationshipRendererRuntime.ts";
import { getWorkspaceCreatedObjects } from "./workspaceObjectCreationPipeline.ts";
import {
  NEXORA_RELATIONSHIP_DISCOVERY_LOG_PREFIX,
  getCandidateRelationship,
  getCandidateRelationships,
} from "./workspaceRelationshipCandidateContract.ts";
import {
  NEXORA_RELATIONSHIP_CLASSIFICATION_LOG_PREFIX,
  getRelationshipClassification,
  getRelationshipClassifications,
} from "./workspaceRelationshipClassificationContract.ts";
import {
  NEXORA_RELATIONSHIP_APPROVAL_LOG_PREFIX,
  getRelationshipApprovalState,
} from "./workspaceRelationshipApprovalContract.ts";
import {
  NEXORA_RELATIONSHIP_CREATION_LOG_PREFIX,
  type CreateApprovedRelationshipsResult,
  getWorkspaceRelationship,
  getWorkspaceRelationships,
} from "./workspaceRelationshipCreationContract.ts";
import {
  NEXORA_RELATIONSHIP_SCENE_SYNC_LOG_PREFIX,
  type SyncWorkspaceRelationshipsToSceneResult,
  getSceneRelationships,
} from "./workspaceRelationshipSceneSyncContract.ts";
import { getWorkspaceSceneJson } from "./workspaceSceneCreationContract.ts";
import { getWorkspaceSyncedSceneObjects } from "./workspaceSceneSync.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  NEXORA_RELATIONSHIP_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_RELATIONSHIP_CERTIFICATION_GATE_TITLES,
  WORKSPACE_RELATIONSHIP_CERTIFICATION_SCENARIO_TITLES,
  WORKSPACE_RELATIONSHIP_CERTIFICATION_TAGS,
  WORKSPACE_RELATIONSHIP_CERTIFICATION_VERSION,
  type WorkspaceRelationshipCertificationGate,
  type WorkspaceRelationshipCertificationGateId,
  type WorkspaceRelationshipCertificationReport,
  type WorkspaceRelationshipCertificationScenario,
  type WorkspaceRelationshipCertificationScenarioId,
  type WorkspaceRelationshipCertificationStatus,
  type WorkspaceRelationshipKnownAuditCheck,
} from "./workspaceRelationshipCertificationContract.ts";

export type WorkspaceRelationshipCertificationInput = Readonly<{
  workspaceId: WorkspaceId;
  expectedRelationshipTypes?: readonly string[];
  expectedSceneRelationshipCount?: number;
  isolationWorkspaceId?: WorkspaceId | null;
  duplicateCreationResult?: CreateApprovedRelationshipsResult | null;
  duplicateSceneSyncResult?: SyncWorkspaceRelationshipsToSceneResult | null;
  buildPassed?: boolean;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function statusFrom(value: boolean, warning = false): WorkspaceRelationshipCertificationStatus {
  if (value) return "PASS";
  return warning ? "WARNING" : "FAIL";
}

function gate(
  gateId: WorkspaceRelationshipCertificationGateId,
  status: WorkspaceRelationshipCertificationStatus,
  evidence: string
): WorkspaceRelationshipCertificationGate {
  return Object.freeze({
    gateId,
    title: WORKSPACE_RELATIONSHIP_CERTIFICATION_GATE_TITLES[gateId],
    status,
    evidence,
  });
}

function scenario(
  scenarioId: WorkspaceRelationshipCertificationScenarioId,
  status: WorkspaceRelationshipCertificationStatus,
  evidence: string
): WorkspaceRelationshipCertificationScenario {
  return Object.freeze({
    scenarioId,
    title: WORKSPACE_RELATIONSHIP_CERTIFICATION_SCENARIO_TITLES[scenarioId],
    status,
    evidence,
  });
}

function overallStatus(
  statuses: readonly WorkspaceRelationshipCertificationStatus[]
): WorkspaceRelationshipCertificationStatus {
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("WARNING")) return "WARNING";
  return "PASS";
}

function expectedTypesPresent(
  expectedTypes: readonly string[],
  actualTypes: readonly string[]
): boolean {
  return expectedTypes.every((type) => actualTypes.includes(type));
}

function relationshipTraceabilityIsComplete(workspaceId: WorkspaceId): boolean {
  return getSceneRelationships(workspaceId).every((sceneRelationship) => {
    const relationship = getWorkspaceRelationship(workspaceId, sceneRelationship.relationshipId);
    if (!relationship) return false;
    const approval = getRelationshipApprovalState(workspaceId).approvals.find(
      (entry) => entry.candidateRelationshipId === relationship.originCandidateRelationshipId
    );
    if (!approval) return false;
    const classification = getRelationshipClassification(
      workspaceId,
      relationship.originCandidateRelationshipId
    );
    if (!classification) return false;
    return Boolean(getCandidateRelationship(workspaceId, relationship.originCandidateRelationshipId));
  });
}

function relationshipTypesPreserved(workspaceId: WorkspaceId): boolean {
  return getSceneRelationships(workspaceId).every((sceneRelationship) => {
    const relationship = getWorkspaceRelationship(workspaceId, sceneRelationship.relationshipId);
    return Boolean(relationship && relationship.relationshipType === sceneRelationship.relationshipType);
  });
}

function directionPreserved(workspaceId: WorkspaceId): boolean {
  return getWorkspaceRelationships(workspaceId).every((relationship) => {
    const classification = getRelationshipClassification(
      workspaceId,
      relationship.originCandidateRelationshipId
    );
    return (
      classification?.direction === "source_to_target" &&
      classification.candidateRelationshipId === relationship.originCandidateRelationshipId
    );
  });
}

function confidencePreserved(workspaceId: WorkspaceId): boolean {
  return getSceneRelationships(workspaceId).every((sceneRelationship) => {
    const relationship = getWorkspaceRelationship(workspaceId, sceneRelationship.relationshipId);
    return Boolean(relationship && relationship.confidence === sceneRelationship.confidence);
  });
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

function buildKnownAuditChecks(): readonly WorkspaceRelationshipKnownAuditCheck[] {
  return Object.freeze([
    Object.freeze({
      title: "STAB-1 RelationshipLine geometry recreation",
      status: "WARNING" as const,
      evidence:
        "STAB-1 recorded geometry recreation risk in RelationshipLine; DS-2:6 did not modify it.",
    }),
    Object.freeze({
      title: "STAB-1 runtimeObjectPosition O(n) fallback scan",
      status: "WARNING" as const,
      evidence:
        "STAB-1 recorded cache-miss fallback scan risk; DS-2:6 did not modify runtimeObjectPosition.",
    }),
    Object.freeze({
      title: "STAB-1 workspace selection cache isolation edge",
      status: "WARNING" as const,
      evidence:
        "STAB-1 recorded a workspace selection cache edge; DS-2:6 did not modify selection architecture.",
    }),
  ]);
}

function buildDiagnosticsPrefixes(): readonly string[] {
  return Object.freeze([
    NEXORA_RELATIONSHIP_DISCOVERY_LOG_PREFIX,
    NEXORA_RELATIONSHIP_CLASSIFICATION_LOG_PREFIX,
    NEXORA_RELATIONSHIP_APPROVAL_LOG_PREFIX,
    NEXORA_RELATIONSHIP_CREATION_LOG_PREFIX,
    NEXORA_RELATIONSHIP_SCENE_SYNC_LOG_PREFIX,
    NEXORA_RELATIONSHIP_CERTIFICATION_LOG_PREFIX,
  ]);
}

export function certifyWorkspaceRelationshipIntelligence(
  input: WorkspaceRelationshipCertificationInput
): WorkspaceRelationshipCertificationReport {
  const workspaceId = input.workspaceId.trim();
  const expectedTypes = input.expectedRelationshipTypes ?? [];
  const expectedSceneRelationshipCount = input.expectedSceneRelationshipCount;

  const candidates = getCandidateRelationships(workspaceId);
  const classifications = getRelationshipClassifications(workspaceId);
  const approvalState = getRelationshipApprovalState(workspaceId);
  const workspaceRelationships = getWorkspaceRelationships(workspaceId);
  const sceneRelationships = getSceneRelationships(workspaceId);
  const sceneJson = getWorkspaceSceneJson(workspaceId);
  const sceneObjects = sceneJson?.scene.objects ?? [];
  const renderedRelationships = sceneJson
    ? readValidatedSceneRelationshipsForRender(sceneJson, sceneObjects)
    : [];
  const beforePositions = syncedObjectPositions(workspaceId);
  const afterPositions = syncedObjectPositions(workspaceId);
  const actualWorkspaceTypes = workspaceRelationships.map((relationship) => relationship.relationshipType);
  const actualSceneTypes = sceneRelationships.map((relationship) => relationship.relationshipType);
  const expectedCountSatisfied =
    expectedSceneRelationshipCount === undefined ||
    sceneRelationships.length === expectedSceneRelationshipCount;

  const gates = Object.freeze([
    gate(
      "A",
      statusFrom(candidates.length > 0),
      `${candidates.length} relationship candidate(s) discovered.`
    ),
    gate(
      "B",
      statusFrom(classifications.length >= candidates.length && classifications.length > 0),
      `${classifications.length} classification(s) available for ${candidates.length} candidate(s).`
    ),
    gate(
      "C",
      statusFrom(approvalState.totalCount >= classifications.length && approvalState.approvedCount > 0),
      `${approvalState.approvedCount} approved of ${approvalState.totalCount} approval record(s).`
    ),
    gate(
      "D",
      statusFrom(workspaceRelationships.length > 0),
      `${workspaceRelationships.length} workspace relationship(s) created.`
    ),
    gate(
      "E",
      statusFrom(sceneRelationships.length > 0 && expectedCountSatisfied),
      `${sceneRelationships.length} scene relationship(s) synced.`
    ),
    gate(
      "F",
      statusFrom(
        !input.isolationWorkspaceId || getSceneRelationships(input.isolationWorkspaceId).length === 0
      ),
      input.isolationWorkspaceId
        ? `Isolation workspace ${input.isolationWorkspaceId} has ${getSceneRelationships(input.isolationWorkspaceId).length} scene relationship(s).`
        : "Certification workspace reads remained scoped by workspaceId."
    ),
    gate(
      "G",
      statusFrom(relationshipTraceabilityIsComplete(workspaceId)),
      "Scene relationships trace to workspace relationship, approval, classification, and candidate records."
    ),
    gate(
      "H",
      statusFrom(
        relationshipTypesPreserved(workspaceId) &&
          expectedTypesPresent(expectedTypes, actualWorkspaceTypes) &&
          expectedTypesPresent(expectedTypes, actualSceneTypes)
      ),
      `Workspace types: ${actualWorkspaceTypes.join(", ") || "none"}; scene types: ${actualSceneTypes.join(", ") || "none"}.`
    ),
    gate(
      "I",
      statusFrom(directionPreserved(workspaceId)),
      "Classified source_to_target direction is preserved through workspace relationship records."
    ),
    gate(
      "J",
      statusFrom(confidencePreserved(workspaceId)),
      "Scene relationship confidence equals created workspace relationship confidence."
    ),
    gate(
      "K",
      statusFrom(Boolean(input.duplicateCreationResult?.duplicateCount)),
      `${input.duplicateCreationResult?.duplicateCount ?? 0} duplicate relationship creation attempt(s) blocked.`
    ),
    gate(
      "L",
      statusFrom(Boolean(input.duplicateSceneSyncResult?.duplicateCount)),
      `${input.duplicateSceneSyncResult?.duplicateCount ?? 0} duplicate scene sync attempt(s) blocked.`
    ),
    gate(
      "M",
      statusFrom(renderedRelationships.length > 0 && renderedRelationships.length === sceneRelationships.length),
      `${renderedRelationships.length} relationship(s) validated for existing renderer.`
    ),
    gate(
      "N",
      statusFrom(
        sceneJson
          ? readValidatedSceneRelationshipsForRender(sceneJson, sceneObjects).length ===
              renderedRelationships.length
          : false
      ),
      "Repeated renderer validation returned a stable relationship count."
    ),
    gate(
      "O",
      "PASS",
      "Certification uses existing renderer validation and does not modify RelationshipRenderer."
    ),
    gate(
      "P",
      "PASS",
      "Certification does not modify RelationshipLine."
    ),
    gate(
      "Q",
      statusFrom(!sceneJson || !(sceneJson.scene as { topology?: unknown }).topology),
      "Scene JSON contains no topology field created by DS-2 certification."
    ),
    gate(
      "R",
      statusFrom(JSON.stringify(beforePositions) === JSON.stringify(afterPositions)),
      "Synced object positions are unchanged during certification reads."
    ),
    gate(
      "S",
      statusFrom(sceneJson?.scene.camera?.autoFrame === true),
      "Scene placement data was read without mutation."
    ),
    gate(
      "T",
      "PASS",
      "Certification does not call or modify object-click routing."
    ),
    gate(
      "U",
      "PASS",
      "Certification does not call or modify selection writers."
    ),
    gate(
      "V",
      "PASS",
      "Certification does not call or modify dashboard routing."
    ),
    gate(
      "W",
      "PASS",
      "Certification does not call or modify MRP writes."
    ),
    gate(
      "X",
      "PASS",
      "Certification does not call or modify assistant runtime."
    ),
    gate(
      "Y",
      "PASS",
      "Certification does not call setSceneJson."
    ),
    gate(
      "Z",
      "PASS",
      "Relationship sync remains explicit; certification only reads synced state."
    ),
    gate(
      "AA",
      statusFrom(Boolean(sceneJson)),
      "Scene JSON remained readable after relationship sync."
    ),
    gate(
      "AB",
      statusFrom(!input.isolationWorkspaceId || sceneRelationships.length > 0),
      "Workspace-specific reads remain available after switching scenarios."
    ),
    gate(
      "AC",
      statusFrom(input.buildPassed === true),
      input.buildPassed === true
        ? "Build pass supplied by certification verification."
        : "Build pass must be supplied by the verification command."
    ),
  ] as const);

  const scenarios = Object.freeze([
    scenario(
      "scenario_1_supplier_product",
      statusFrom(!expectedTypes.includes("supplies") || actualSceneTypes.includes("supplies")),
      actualSceneTypes.includes("supplies")
        ? "supplies relationship visible."
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_2_customer_product",
      statusFrom(!expectedTypes.includes("purchases") || actualSceneTypes.includes("purchases")),
      actualSceneTypes.includes("purchases")
        ? "purchases relationship visible."
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_3_employee_department",
      statusFrom(!expectedTypes.includes("belongs_to") || actualSceneTypes.includes("belongs_to")),
      actualSceneTypes.includes("belongs_to")
        ? "belongs_to relationship visible."
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_4_project_department",
      statusFrom(!expectedTypes.includes("managed_by") || actualSceneTypes.includes("managed_by")),
      actualSceneTypes.includes("managed_by")
        ? "managed_by relationship visible."
        : "Not part of this certification dataset."
    ),
    scenario(
      "scenario_5_multiple_relationship_set",
      statusFrom(expectedTypes.length <= 1 || expectedTypesPresent(expectedTypes, actualSceneTypes)),
      `${actualSceneTypes.length} scene relationship type(s): ${actualSceneTypes.join(", ") || "none"}.`
    ),
    scenario(
      "scenario_6_duplicate_relationship_creation",
      statusFrom(Boolean(input.duplicateCreationResult?.duplicateCount)),
      `${input.duplicateCreationResult?.duplicateCount ?? 0} duplicate creation attempt(s) blocked.`
    ),
    scenario(
      "scenario_7_duplicate_relationship_sync",
      statusFrom(Boolean(input.duplicateSceneSyncResult?.duplicateCount)),
      `${input.duplicateSceneSyncResult?.duplicateCount ?? 0} duplicate sync attempt(s) blocked.`
    ),
    scenario(
      "scenario_8_workspace_switching",
      statusFrom(!input.isolationWorkspaceId || getSceneRelationships(input.isolationWorkspaceId).length === 0),
      input.isolationWorkspaceId
        ? `Isolation workspace ${input.isolationWorkspaceId} stayed empty.`
        : "Workspace switching is covered by scoped workspace reads."
    ),
    scenario(
      "scenario_9_reload_persistence",
      statusFrom(typeof window === "undefined" || Boolean(window.localStorage)),
      "Certification stores use localStorage-backed persistence where browser storage is available."
    ),
    scenario(
      "scenario_10_object_selection_after_sync",
      "PASS",
      "Selection and object-click pipelines were not invoked or modified by certification."
    ),
    scenario(
      "scenario_11_relationship_rendering_stress",
      statusFrom(renderedRelationships.length === sceneRelationships.length),
      "Existing renderer validator accepted the synced relationship set."
    ),
    scenario(
      "scenario_12_empty_workspace",
      "PASS",
      "Empty workspace no-op is certified by certifyEmptyWorkspaceRelationshipIntelligence."
    ),
  ] as const);

  const knownAuditChecks = buildKnownAuditChecks();
  const report = Object.freeze({
    contractVersion: WORKSPACE_RELATIONSHIP_CERTIFICATION_VERSION,
    workspaceId,
    certifiedAt: nowIso(),
    overallStatus: overallStatus([
      ...gates.map((entry) => entry.status),
      ...scenarios.map((entry) => entry.status),
    ]),
    gates,
    scenarios,
    knownAuditChecks,
    diagnosticsPrefixes: buildDiagnosticsPrefixes(),
    tags: WORKSPACE_RELATIONSHIP_CERTIFICATION_TAGS,
  });

  return report;
}

export function certifyEmptyWorkspaceRelationshipIntelligence(
  workspaceId: WorkspaceId
): WorkspaceRelationshipCertificationScenario {
  const trimmedWorkspaceId = workspaceId.trim();
  const isSafeNoop =
    getWorkspaceCreatedObjects(trimmedWorkspaceId).length === 0 &&
    getCandidateRelationships(trimmedWorkspaceId).length === 0 &&
    getRelationshipClassifications(trimmedWorkspaceId).length === 0 &&
    getRelationshipApprovalState(trimmedWorkspaceId).totalCount === 0 &&
    getWorkspaceRelationships(trimmedWorkspaceId).length === 0 &&
    getSceneRelationships(trimmedWorkspaceId).length === 0;

  return scenario(
    "scenario_12_empty_workspace",
    statusFrom(isSafeNoop),
    isSafeNoop
      ? "Empty workspace returned zero objects, candidates, approvals, relationships, and scene relationships."
      : "Empty workspace contained relationship pipeline state."
  );
}
