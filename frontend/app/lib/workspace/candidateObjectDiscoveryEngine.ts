/**
 * Legacy candidate object discovery facade — delegates to DS-1:3 workspace modules.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import type { WorkspaceColumnClassificationProfile } from "./columnClassificationContract.ts";
import {
  CANDIDATE_OBJECT_CONTRACT,
  CANDIDATE_OBJECT_VERSION,
  candidateObjectProposalIsComplete,
  type CandidateObjectMutationResult,
  type CandidateObjectProposal,
} from "./candidateObjectContract.ts";
import { WORKSPACE_CANDIDATE_OBJECT_TAGS } from "./workspaceCandidateObjectContract.ts";
import type { WorkspaceColumnClassification } from "./workspaceColumnClassificationContract.ts";
import { WORKSPACE_COLUMN_CLASSIFICATION_SOURCE } from "./workspaceColumnClassificationContract.ts";
import { getColumnClassifications } from "./workspaceColumnClassificationEngine.ts";
import {
  discoverCandidateObjects,
  discoverCandidateObjectsFromClassifications,
  getCandidateObject,
  getCandidateObjects,
  getWorkspaceCandidateObjectRegistryVersion as readWorkspaceCandidateObjectRegistryVersion,
  listWorkspaceCandidateObjectProfiles,
  removeWorkspaceCandidateObjectsForDataSource as removeWorkspaceCandidateObjectsForDataSourceFromStore,
  resetWorkspaceCandidateObjectStoreForTests,
  subscribeWorkspaceCandidateObjectRegistry as subscribeWorkspaceCandidateObjectRegistryFromStore,
} from "./workspaceCandidateObjectDiscoveryEngine.ts";
import {
  flattenCandidateProfiles,
  toLegacyCandidateObjectMutationResult,
  toLegacyCandidateObjectProposal,
} from "./workspaceCandidateObjectLegacyBridge.ts";

export {
  CANDIDATE_OBJECT_CONTRACT,
  CANDIDATE_OBJECT_VERSION,
  candidateObjectProposalIsComplete,
};

export { WORKSPACE_CANDIDATE_OBJECT_TAGS as CANDIDATE_OBJECT_TAGS };

export {
  discoverCandidateObjects,
  getCandidateObject,
  getCandidateObjects,
};

type CandidateObjectListener = () => void;

function mapLegacyConfidence(confidence: "high" | "medium" | "low"): number {
  if (confidence === "high") return 0.9;
  if (confidence === "medium") return 0.7;
  return 0.4;
}

function mapLegacyKindToBusinessRole(
  kind: WorkspaceColumnClassificationProfile["columns"][number]["classification"]
): WorkspaceColumnClassification["businessRole"] {
  switch (kind) {
    case "identifier":
      return "Identifier";
    case "name":
      return "Name";
    case "metric":
      return "Metric";
    case "category":
      return "Category";
    case "date":
      return "Date";
    case "status":
      return "Status";
    case "unknown":
    default:
      return "Unknown";
  }
}

function legacyProfileToClassifications(
  profile: WorkspaceColumnClassificationProfile,
  classifiedAt: string
): readonly WorkspaceColumnClassification[] {
  return Object.freeze(
    profile.columns.map((entry) =>
      Object.freeze({
        workspaceId: profile.workspaceId,
        dataSourceId: profile.dataSourceId,
        columnName: entry.columnName,
        detectedType: "unknown" as const,
        businessRole: mapLegacyKindToBusinessRole(entry.classification),
        confidence: mapLegacyConfidence(entry.confidence),
        reason: entry.signals[0] ?? "legacy_classification",
        classifiedAt,
        source: WORKSPACE_COLUMN_CLASSIFICATION_SOURCE,
      })
    )
  );
}

export function discoverCandidateObjectsFromClassification(
  profile: WorkspaceColumnClassificationProfile,
  discoveredAt?: string
): readonly CandidateObjectProposal[] {
  const stored = getColumnClassifications(profile.workspaceId, profile.dataSourceId);
  const classifications =
    stored.length > 0
      ? stored
      : legacyProfileToClassifications(profile, discoveredAt ?? profile.updatedAt);

  return discoverCandidateObjectsFromClassifications({
    workspaceId: profile.workspaceId,
    dataSourceId: profile.dataSourceId,
    classifications,
    discoveredAt,
  }).map(toLegacyCandidateObjectProposal);
}

export function subscribeWorkspaceCandidateObjectRegistry(
  listener: CandidateObjectListener
): () => void {
  return subscribeWorkspaceCandidateObjectRegistryFromStore(listener);
}

export function getWorkspaceCandidateObjectRegistryVersion(): number {
  return readWorkspaceCandidateObjectRegistryVersion();
}

export function listWorkspaceCandidateObjects(
  workspaceId?: WorkspaceId | null
): readonly CandidateObjectProposal[] {
  return flattenCandidateProfiles(listWorkspaceCandidateObjectProfiles(workspaceId));
}

export function listWorkspaceCandidateObjectsForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): readonly CandidateObjectProposal[] {
  return getCandidateObjects(workspaceId, dataSourceId).map(toLegacyCandidateObjectProposal);
}

export function getWorkspaceCandidateObject(
  workspaceId: WorkspaceId,
  candidateId: string
): CandidateObjectProposal | null {
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedCandidateId = candidateId.trim();
  if (!trimmedWorkspaceId || !trimmedCandidateId) return null;

  for (const profile of listWorkspaceCandidateObjectProfiles(trimmedWorkspaceId)) {
    const match = profile.candidates[trimmedCandidateId] ?? null;
    if (match) return toLegacyCandidateObjectProposal(match);
  }
  return null;
}

export function saveWorkspaceCandidateObjects(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  _candidates: readonly CandidateObjectProposal[]
): CandidateObjectMutationResult {
  return toLegacyCandidateObjectMutationResult(discoverCandidateObjects(workspaceId, dataSourceId));
}

export function discoverAndSaveCandidateObjectsFromClassification(
  profile: WorkspaceColumnClassificationProfile
): CandidateObjectMutationResult {
  const stored = getColumnClassifications(profile.workspaceId, profile.dataSourceId);
  const classifications =
    stored.length > 0 ? stored : legacyProfileToClassifications(profile, profile.updatedAt);

  return toLegacyCandidateObjectMutationResult(
    discoverCandidateObjects(profile.workspaceId, profile.dataSourceId, { classifications })
  );
}

export function removeWorkspaceCandidateObjectsForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): CandidateObjectMutationResult {
  return toLegacyCandidateObjectMutationResult(
    removeWorkspaceCandidateObjectsForDataSourceFromStore(workspaceId, dataSourceId)
  );
}

export function resetWorkspaceCandidateObjectsForTests(): void {
  resetWorkspaceCandidateObjectStoreForTests();
}

export type { CandidateObjectMutationResult, CandidateObjectProposal };
