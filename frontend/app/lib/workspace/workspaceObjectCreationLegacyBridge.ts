/**
 * Legacy DS-1:5 bridge for pipeline facade and context resolver compatibility.
 */

import type { CandidateObjectConfidence } from "./candidateObjectContract.ts";
import type { WorkspaceCreatedObject } from "./workspaceObjectCreationContract.ts";

export type LegacyPipelineWorkspaceObject = Readonly<{
  contractVersion: "DS-1:5";
  workspaceId: string;
  objectId: string;
  objectName: string;
  confidence: CandidateObjectConfidence;
  sourceColumns: readonly string[];
  candidateId: string;
  dataSourceId: string;
  approvedObjectId: string;
  createdAt: string;
  updatedAt: string;
}>;

function mapConfidenceToLegacy(confidence: number): CandidateObjectConfidence {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}

export function toLegacyPipelineWorkspaceObject(
  object: WorkspaceCreatedObject,
  confidence = 0.7
): LegacyPipelineWorkspaceObject {
  return Object.freeze({
    contractVersion: "DS-1:5",
    workspaceId: object.workspaceId,
    objectId: object.objectId,
    objectName: object.objectName,
    confidence: mapConfidenceToLegacy(confidence),
    sourceColumns: Object.freeze([...object.sourceColumns]),
    candidateId: object.originCandidateId,
    dataSourceId: object.dataSourceId,
    approvedObjectId: `appr_${object.workspaceId}_${object.originCandidateId}`,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
  });
}
