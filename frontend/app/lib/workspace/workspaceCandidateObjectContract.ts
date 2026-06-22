/**
 * DS-1:3 — Workspace candidate object discovery contract.
 * Discovery only — no workspace objects, scene nodes, or relationships.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_CANDIDATE_OBJECT_VERSION = "DS-1:3" as const;

export const WORKSPACE_CANDIDATE_OBJECT_TAGS = Object.freeze([
  "[DS13_CANDIDATE_OBJECT_DISCOVERY]",
  "[CANDIDATE_OBJECTS_READY]",
  "[OBJECT_GROUPING_ENGINE]",
  "[OBJECT_DISCOVERY_PERSISTED]",
  "[DS14_READY]",
  "[DS_1_3_COMPLETE]",
] as const);

export const NEXORA_CANDIDATE_DISCOVERY_LOG_PREFIX = "[NexoraCandidateDiscovery]" as const;

export type WorkspaceCandidateObjectStatus = "suggested" | "approved" | "rejected";

export type WorkspaceCandidateObjectType = "prefixed_entity" | "generic_entity";

export type WorkspaceCandidateObject = Readonly<{
  contractVersion: typeof WORKSPACE_CANDIDATE_OBJECT_VERSION;
  candidateId: string;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  objectName: string;
  confidence: number;
  reason: string;
  sourceColumns: readonly string[];
  primaryIdentifier: string | null;
  candidateType: WorkspaceCandidateObjectType;
  discoveredAt: string;
  updatedAt: string;
  status: WorkspaceCandidateObjectStatus;
}>;

export type WorkspaceCandidateObjectMap = Readonly<Record<string, WorkspaceCandidateObject>>;

export type WorkspaceDataSourceCandidateObjectProfile = Readonly<{
  contractVersion: typeof WORKSPACE_CANDIDATE_OBJECT_VERSION;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  candidates: WorkspaceCandidateObjectMap;
  discoveredAt: string;
  updatedAt: string;
}>;

export type WorkspaceCandidateObjectStore = Readonly<
  Record<WorkspaceId, Readonly<Record<string, WorkspaceDataSourceCandidateObjectProfile>>>
>;

export type DiscoverCandidateObjectsResult = Readonly<{
  success: boolean;
  candidates: readonly WorkspaceCandidateObject[];
  reason: string;
  created: boolean;
}>;

export const WORKSPACE_CANDIDATE_OBJECT_STATUSES: readonly WorkspaceCandidateObjectStatus[] =
  Object.freeze(["suggested", "approved", "rejected"]);

export function buildWorkspaceCandidateObjectId(input: {
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

export function workspaceCandidateObjectIsComplete(
  candidate: WorkspaceCandidateObject | null | undefined
): candidate is WorkspaceCandidateObject {
  if (!candidate || typeof candidate !== "object") return false;
  if (candidate.contractVersion !== WORKSPACE_CANDIDATE_OBJECT_VERSION) return false;
  if (typeof candidate.candidateId !== "string" || !candidate.candidateId.trim()) return false;
  if (typeof candidate.workspaceId !== "string" || !candidate.workspaceId.trim()) return false;
  if (typeof candidate.dataSourceId !== "string" || !candidate.dataSourceId.trim()) return false;
  if (typeof candidate.objectName !== "string" || !candidate.objectName.trim()) return false;
  if (!Number.isFinite(candidate.confidence) || candidate.confidence < 0 || candidate.confidence > 1) {
    return false;
  }
  if (typeof candidate.reason !== "string" || !candidate.reason.trim()) return false;
  if (!Array.isArray(candidate.sourceColumns) || candidate.sourceColumns.length === 0) return false;
  if (typeof candidate.discoveredAt !== "string" || !candidate.discoveredAt.trim()) return false;
  if (typeof candidate.updatedAt !== "string" || !candidate.updatedAt.trim()) return false;
  if (!WORKSPACE_CANDIDATE_OBJECT_STATUSES.includes(candidate.status)) return false;
  return candidate.candidateType === "prefixed_entity" || candidate.candidateType === "generic_entity";
}

export function workspaceDataSourceCandidateObjectProfileIsComplete(
  profile: WorkspaceDataSourceCandidateObjectProfile | null | undefined
): profile is WorkspaceDataSourceCandidateObjectProfile {
  if (!profile || typeof profile !== "object") return false;
  if (profile.contractVersion !== WORKSPACE_CANDIDATE_OBJECT_VERSION) return false;
  if (typeof profile.workspaceId !== "string" || !profile.workspaceId.trim()) return false;
  if (typeof profile.dataSourceId !== "string" || !profile.dataSourceId.trim()) return false;
  if (!profile.candidates || typeof profile.candidates !== "object") return false;
  return Object.values(profile.candidates).every(workspaceCandidateObjectIsComplete);
}
