/**
 * APP-12:5 — Executive Recommendation Governance Engine immutable registry.
 */

import {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_LIMITS,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import type {
  GovernanceId,
  RecommendationGovernance,
  RecommendationGovernanceEngineResult,
  RecommendationGovernanceRegistrySnapshot,
  RecommendationWorkspaceId,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import { validateRecommendationGovernanceRecord } from "./executiveRecommendationGovernanceEngineValidation.ts";

const governanceRegistry = new Map<GovernanceId, RecommendationGovernance>();
const workspaceIndex = new Map<RecommendationWorkspaceId, Set<GovernanceId>>();

function indexGovernance(governance: RecommendationGovernance): void {
  const ids = workspaceIndex.get(governance.provenance.workspaceId) ?? new Set<GovernanceId>();
  ids.add(governance.governanceId);
  workspaceIndex.set(governance.provenance.workspaceId, ids);
}

function unindexGovernance(governance: RecommendationGovernance): void {
  const ids = workspaceIndex.get(governance.provenance.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(governance.governanceId);
  if (ids.size === 0) {
    workspaceIndex.delete(governance.provenance.workspaceId);
  }
}

export function resetExecutiveRecommendationGovernanceEngineRegistryForTests(): void {
  governanceRegistry.clear();
  workspaceIndex.clear();
}

export function recommendationGovernanceExists(governanceId: GovernanceId): boolean {
  return governanceRegistry.has(governanceId);
}

export function registerRecommendationGovernance(
  governance: RecommendationGovernance
): RecommendationGovernanceEngineResult<RecommendationGovernance> {
  const validation = validateRecommendationGovernanceRecord(governance);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: "validation_failure",
        message: validation.issues.map((entry) => entry.message).join("; "),
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (governanceRegistry.has(governance.governanceId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate governance id: ${governance.governanceId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_governance",
        message: "Duplicate governance id.",
        field: "governanceId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (governanceRegistry.size >= EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_LIMITS.maxRegisteredGovernanceRecords) {
    return Object.freeze({
      success: false,
      reason: "Recommendation governance registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Recommendation governance registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  governanceRegistry.set(governance.governanceId, governance);
  indexGovernance(governance);
  return Object.freeze({
    success: true,
    reason: "Recommendation governance registered.",
    data: governance,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterRecommendationGovernance(
  governanceId: GovernanceId
): RecommendationGovernanceEngineResult<GovernanceId> {
  const existing = governanceRegistry.get(governanceId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Recommendation governance not found: ${governanceId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Recommendation governance not found.",
        field: "governanceId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  governanceRegistry.delete(governanceId);
  unindexGovernance(existing);
  return Object.freeze({
    success: true,
    reason: "Recommendation governance unregistered.",
    data: governanceId,
    error: null,
    readOnly: true as const,
  });
}

export function getRecommendationGovernance(governanceId: GovernanceId): RecommendationGovernance | null {
  return governanceRegistry.get(governanceId) ?? null;
}

export function getRecommendationGovernances(
  workspaceId?: RecommendationWorkspaceId
): readonly RecommendationGovernance[] {
  if (!workspaceId) {
    return Object.freeze(
      [...governanceRegistry.values()].sort((left, right) =>
        left.governanceId.localeCompare(right.governanceId)
      )
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((governanceId) => governanceRegistry.get(governanceId))
      .filter((entry): entry is RecommendationGovernance => entry !== undefined)
      .sort((left, right) => left.governanceId.localeCompare(right.governanceId))
  );
}

export function getRecommendationGovernanceRegistrySnapshot(): RecommendationGovernanceRegistrySnapshot {
  const governanceIds = Object.freeze([...governanceRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
    governanceCount: governanceRegistry.size,
    governanceIds,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationGovernanceEngineRegistry = Object.freeze({
  resetExecutiveRecommendationGovernanceEngineRegistryForTests,
  recommendationGovernanceExists,
  registerRecommendationGovernance,
  unregisterRecommendationGovernance,
  getRecommendationGovernance,
  getRecommendationGovernances,
  getRecommendationGovernanceRegistrySnapshot,
});
