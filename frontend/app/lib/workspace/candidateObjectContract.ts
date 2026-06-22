import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const CANDIDATE_OBJECT_VERSION = "DS-1:3" as const;

export { WORKSPACE_CANDIDATE_OBJECT_TAGS as CANDIDATE_OBJECT_TAGS } from "./workspaceCandidateObjectContract.ts";

export type CandidateObjectConfidence = "high" | "medium" | "low";

export type CandidateObjectProposal = Readonly<{
  contractVersion: typeof CANDIDATE_OBJECT_VERSION;
  candidateId: string;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  objectName: string;
  confidence: CandidateObjectConfidence;
  sourceColumns: readonly string[];
  reason: string;
  discoveredAt: string;
  updatedAt: string;
}>;

export type CandidateObjectContract = Readonly<{
  contractVersion: typeof CANDIDATE_OBJECT_VERSION;
  requiredFields: readonly [
    "candidateId",
    "workspaceId",
    "objectName",
    "confidence",
    "sourceColumns",
    "reason",
  ];
}>;

export const CANDIDATE_OBJECT_CONTRACT: CandidateObjectContract = Object.freeze({
  contractVersion: CANDIDATE_OBJECT_VERSION,
  requiredFields: Object.freeze([
    "candidateId",
    "workspaceId",
    "objectName",
    "confidence",
    "sourceColumns",
    "reason",
  ] as const),
});

export type CandidateObjectMutationResult = Readonly<{
  success: boolean;
  candidates: readonly CandidateObjectProposal[];
  reason: string;
  created: boolean;
}>;

export function candidateObjectProposalIsComplete(
  candidate: CandidateObjectProposal | null | undefined
): candidate is CandidateObjectProposal {
  if (!candidate || typeof candidate !== "object") return false;
  return (
    candidate.contractVersion === CANDIDATE_OBJECT_VERSION &&
    typeof candidate.candidateId === "string" &&
    candidate.candidateId.trim().length > 0 &&
    typeof candidate.workspaceId === "string" &&
    candidate.workspaceId.trim().length > 0 &&
    typeof candidate.dataSourceId === "string" &&
    candidate.dataSourceId.trim().length > 0 &&
    typeof candidate.objectName === "string" &&
    candidate.objectName.trim().length > 0 &&
    (candidate.confidence === "high" ||
      candidate.confidence === "medium" ||
      candidate.confidence === "low") &&
    Array.isArray(candidate.sourceColumns) &&
    candidate.sourceColumns.length > 0 &&
    typeof candidate.reason === "string" &&
    candidate.reason.trim().length > 0
  );
}

export function buildCandidateObjectId(input: {
  workspaceId: WorkspaceId;
  dataSourceId: string;
  entityToken: string;
}): string {
  const token = input.entityToken
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `cand_${input.workspaceId}_${input.dataSourceId}_${token || "entity"}`;
}
