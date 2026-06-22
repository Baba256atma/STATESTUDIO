/**
 * Legacy DS-1:3 bridge for DS-1:4 approval panel and certification harnesses.
 */

import type {
  CandidateObjectConfidence,
  CandidateObjectMutationResult,
  CandidateObjectProposal,
} from "./candidateObjectContract.ts";
import { CANDIDATE_OBJECT_VERSION } from "./candidateObjectContract.ts";
import type {
  DiscoverCandidateObjectsResult,
  WorkspaceCandidateObject,
  WorkspaceDataSourceCandidateObjectProfile,
} from "./workspaceCandidateObjectContract.ts";

function mapConfidenceToLegacy(confidence: number): CandidateObjectConfidence {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}

export function toLegacyCandidateObjectProposal(
  candidate: WorkspaceCandidateObject
): CandidateObjectProposal {
  return Object.freeze({
    contractVersion: CANDIDATE_OBJECT_VERSION,
    candidateId: candidate.candidateId,
    workspaceId: candidate.workspaceId,
    dataSourceId: candidate.dataSourceId,
    objectName: candidate.objectName,
    confidence: mapConfidenceToLegacy(candidate.confidence),
    sourceColumns: Object.freeze([...candidate.sourceColumns]),
    reason: candidate.reason,
    discoveredAt: candidate.discoveredAt,
    updatedAt: candidate.updatedAt,
  });
}

export function toLegacyCandidateObjectMutationResult(
  result: DiscoverCandidateObjectsResult
): CandidateObjectMutationResult {
  return Object.freeze({
    success: result.success,
    candidates: Object.freeze(result.candidates.map(toLegacyCandidateObjectProposal)),
    reason: result.reason,
    created: result.created,
  });
}

export function flattenCandidateProfiles(
  profiles: readonly WorkspaceDataSourceCandidateObjectProfile[]
): readonly CandidateObjectProposal[] {
  return Object.freeze(
    profiles.flatMap((profile) =>
      Object.values(profile.candidates).map(toLegacyCandidateObjectProposal)
    )
  );
}
