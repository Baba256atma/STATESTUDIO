/**
 * Legacy object creation pipeline facade — delegates to DS-1:5 workspace modules.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import type { CandidateObjectConfidence } from "./candidateObjectContract.ts";
import type {
  ApprovedWorkspaceObjectRecord,
  ObjectApprovalRecord,
} from "./objectApprovalContract.ts";
import {
  WORKSPACE_OBJECT_CREATION_TAGS,
  WORKSPACE_OBJECT_CREATION_VERSION,
  buildWorkspaceCreatedObjectId,
} from "./workspaceObjectCreationContract.ts";
import {
  createWorkspaceObjectsFromAllApprovedCandidates,
  createWorkspaceObjectsFromApprovedCandidates,
  getWorkspaceCreatedObjectByCandidateId,
  getWorkspaceCreatedObjects,
  getWorkspaceCreatedObject as readWorkspaceCreatedObject,
  removeWorkspaceCreatedObjectsForDataSource,
  resetWorkspaceObjectCreationStoreForTests,
  subscribeWorkspaceObjectCreationRegistry,
  getWorkspaceObjectCreationRegistryVersion,
} from "./workspaceObjectCreationPipeline.ts";
import { toLegacyPipelineWorkspaceObject } from "./workspaceObjectCreationLegacyBridge.ts";
import { getApprovedCandidates } from "./workspaceObjectApprovalRuntime.ts";

export const OBJECT_CREATION_PIPELINE_VERSION = WORKSPACE_OBJECT_CREATION_VERSION;

export { WORKSPACE_OBJECT_CREATION_TAGS as OBJECT_CREATION_PIPELINE_TAGS };

export type PipelineWorkspaceObject = ReturnType<typeof toLegacyPipelineWorkspaceObject>;

export type ObjectCreationPipelineInput = Readonly<{
  workspaceId: WorkspaceId;
  candidateId: string;
  approvedObjectId: string;
  objectName: string;
  confidence: CandidateObjectConfidence;
  sourceColumns: readonly string[];
  dataSourceId: string;
}>;

export type ObjectCreationPipelineResult = Readonly<{
  success: boolean;
  object: PipelineWorkspaceObject | null;
  reason: string;
  created: boolean;
}>;

export type ObjectCreationPipelineRunResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  createdCount: number;
  updatedCount: number;
  objects: readonly PipelineWorkspaceObject[];
  reason: string;
  message: string;
}>;

function mapLegacyConfidenceToScore(confidence: CandidateObjectConfidence): number {
  if (confidence === "high") return 0.9;
  if (confidence === "medium") return 0.7;
  return 0.4;
}

function toPipelineObject(
  object: ReturnType<typeof getWorkspaceCreatedObjects>[number],
  confidence = 0.7
): PipelineWorkspaceObject {
  return toLegacyPipelineWorkspaceObject(object, confidence);
}

export function buildPipelineWorkspaceObjectId(input: {
  workspaceId: WorkspaceId;
  candidateId: string;
  objectName?: string;
}): string {
  void input.workspaceId;
  void input.candidateId;
  if (input.objectName?.trim()) {
    return buildWorkspaceCreatedObjectId(input.objectName);
  }
  return buildWorkspaceCreatedObjectId("entity");
}

export function pipelineWorkspaceObjectIsComplete(
  object: PipelineWorkspaceObject | null | undefined
): object is PipelineWorkspaceObject {
  if (!object || typeof object !== "object") return false;
  return (
    object.contractVersion === OBJECT_CREATION_PIPELINE_VERSION &&
    typeof object.workspaceId === "string" &&
    object.workspaceId.trim().length > 0 &&
    typeof object.objectId === "string" &&
    typeof object.objectName === "string" &&
    typeof object.confidence === "string" &&
    Array.isArray(object.sourceColumns) &&
    typeof object.candidateId === "string" &&
    typeof object.dataSourceId === "string"
  );
}

export function subscribePipelineWorkspaceObjectRegistry(
  listener: () => void
): () => void {
  return subscribeWorkspaceObjectCreationRegistry(listener);
}

export function getPipelineWorkspaceObjectRegistryVersion(): number {
  return getWorkspaceObjectCreationRegistryVersion();
}

export function listPipelineWorkspaceObjects(
  workspaceId?: WorkspaceId | null
): readonly PipelineWorkspaceObject[] {
  const trimmedWorkspaceId = workspaceId?.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(getWorkspaceCreatedObjects(trimmedWorkspaceId).map((object) => toPipelineObject(object)));
}

export function getPipelineWorkspaceObject(
  workspaceId: WorkspaceId,
  objectId: string
): PipelineWorkspaceObject | null {
  const object = readWorkspaceCreatedObject(workspaceId, objectId);
  return object ? toPipelineObject(object) : null;
}

export function getPipelineWorkspaceObjectByCandidateId(
  workspaceId: WorkspaceId,
  candidateId: string
): PipelineWorkspaceObject | null {
  const object = getWorkspaceCreatedObjectByCandidateId(workspaceId, candidateId);
  return object ? toPipelineObject(object) : null;
}

export function createWorkspaceObjectFromApprovedCandidate(
  input: ObjectCreationPipelineInput
): ObjectCreationPipelineResult {
  const existing = getWorkspaceCreatedObjectByCandidateId(input.workspaceId, input.candidateId);
  if (existing) {
    return Object.freeze({
      success: true,
      object: toPipelineObject(existing, mapLegacyConfidenceToScore(input.confidence)),
      reason: "duplicate",
      created: false,
    });
  }

  const batch = createWorkspaceObjectsFromApprovedCandidates(input.workspaceId, input.dataSourceId);
  const created = batch.objects.find((object) => object.originCandidateId === input.candidateId) ?? null;
  if (!created) {
    return Object.freeze({
      success: false,
      object: null,
      reason: batch.reason,
      created: false,
    });
  }

  return Object.freeze({
    success: true,
    object: toPipelineObject(created, mapLegacyConfidenceToScore(input.confidence)),
    reason: batch.createdCount > 0 ? "created" : batch.reason,
    created: batch.createdCount > 0,
  });
}

export function runObjectCreationPipelineFromInputs(
  inputs: readonly ObjectCreationPipelineInput[]
): ObjectCreationPipelineRunResult {
  if (inputs.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      createdCount: 0,
      updatedCount: 0,
      objects: Object.freeze([]),
      reason: "missing_inputs",
      message: "No approved candidates were provided for creation.",
    });
  }

  const workspaceId = inputs[0]?.workspaceId ?? null;
  if (!workspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      createdCount: 0,
      updatedCount: 0,
      objects: Object.freeze([]),
      reason: "missing_workspace",
      message: "No workspace was provided for object creation.",
    });
  }

  const dataSourceIds = [...new Set(inputs.map((input) => input.dataSourceId.trim()).filter(Boolean))];
  let createdCount = 0;
  let duplicateCount = 0;
  const objects: PipelineWorkspaceObject[] = [];

  for (const dataSourceId of dataSourceIds) {
    const batch = createWorkspaceObjectsFromApprovedCandidates(workspaceId, dataSourceId);
    createdCount += batch.createdCount;
    duplicateCount += batch.duplicateCount;
    for (const object of batch.objects) {
      const input = inputs.find((entry) => entry.candidateId === object.originCandidateId);
      objects.push(toPipelineObject(object, mapLegacyConfidenceToScore(input?.confidence ?? "medium")));
    }
  }

  if (objects.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId,
      createdCount: 0,
      updatedCount: 0,
      objects: Object.freeze([]),
      reason: "creation_failed",
      message: "Unable to create workspace objects from approved candidates.",
    });
  }

  const message =
    createdCount > 0
      ? `${createdCount} workspace object${createdCount === 1 ? "" : "s"} created${
          duplicateCount > 0 ? `, ${duplicateCount} duplicate${duplicateCount === 1 ? "" : "s"} skipped` : ""
        }.`
      : `${duplicateCount} duplicate object${duplicateCount === 1 ? "" : "s"} skipped.`;

  return Object.freeze({
    success: createdCount > 0 || duplicateCount > 0,
    workspaceId,
    createdCount,
    updatedCount: duplicateCount,
    objects: Object.freeze(objects),
    reason: createdCount > 0 ? "created" : "duplicate",
    message,
  });
}

export function runObjectCreationPipelineFromApprovalRecords(
  records: readonly ObjectApprovalRecord[]
): ObjectCreationPipelineRunResult {
  const approved = records.filter((record) => record.status === "approved");
  if (approved.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: records[0]?.workspaceId ?? null,
      createdCount: 0,
      updatedCount: 0,
      objects: Object.freeze([]),
      reason: "no_approved_records",
      message: "No approved candidates were provided for creation.",
    });
  }

  const workspaceId = approved[0]!.workspaceId;
  const batch = createWorkspaceObjectsFromAllApprovedCandidates(workspaceId);
  const confidenceByCandidateId = new Map(approved.map((record) => [record.candidateId, record.confidence]));

  return Object.freeze({
    success: batch.success,
    workspaceId: batch.workspaceId,
    createdCount: batch.createdCount,
    updatedCount: batch.duplicateCount,
    objects: Object.freeze(
      batch.objects.map((object) =>
        toPipelineObject(object, mapLegacyConfidenceToScore(confidenceByCandidateId.get(object.originCandidateId) ?? "medium"))
      )
    ),
    reason: batch.reason,
    message: batch.message,
  });
}

export function runObjectCreationPipelineFromQueuedCandidates(input: {
  queued: readonly ApprovedWorkspaceObjectRecord[];
  approvals: readonly ObjectApprovalRecord[];
}): ObjectCreationPipelineRunResult {
  void input.queued;
  const approved = input.approvals.filter((record) => record.status === "approved");
  return runObjectCreationPipelineFromApprovalRecords(approved);
}

export function runObjectCreationPipeline(
  workspaceId?: WorkspaceId | null
): ObjectCreationPipelineRunResult {
  const trimmedWorkspaceId = workspaceId?.trim() ?? null;
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      createdCount: 0,
      updatedCount: 0,
      objects: Object.freeze([]),
      reason: "missing_workspace",
      message: "Select a workspace to create approved objects.",
    });
  }

  const batch = createWorkspaceObjectsFromAllApprovedCandidates(trimmedWorkspaceId);
  return Object.freeze({
    success: batch.success,
    workspaceId: batch.workspaceId,
    createdCount: batch.createdCount,
    updatedCount: batch.duplicateCount,
    objects: Object.freeze(batch.objects.map((object) => toPipelineObject(object))),
    reason: batch.reason,
    message: batch.message,
  });
}

export function removePipelineWorkspaceObjectsForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): readonly PipelineWorkspaceObject[] {
  return Object.freeze(
    removeWorkspaceCreatedObjectsForDataSource(workspaceId, dataSourceId).map((object) => toPipelineObject(object))
  );
}

export function resetPipelineWorkspaceObjectsForTests(): void {
  resetWorkspaceObjectCreationStoreForTests();
}

export {
  createWorkspaceObjectsFromApprovedCandidates,
  createWorkspaceObjectsFromAllApprovedCandidates,
  getWorkspaceCreatedObjects,
  getApprovedCandidates,
};
