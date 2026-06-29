/**
 * APP-12:5 — Executive Recommendation Governance Engine deterministic pipeline.
 */

import { EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES } from "./executiveRecommendationGovernanceEngineConstants.ts";
import { buildRecommendationGovernanceProfilesFromExplanations } from "./executiveRecommendationGovernanceProfileBuilder.ts";
import { registerRecommendationGovernance } from "./executiveRecommendationGovernanceEngineRegistry.ts";
import type {
  ExecutiveRecommendationGovernanceRequest,
  RecommendationGovernance,
  RecommendationGovernanceResult,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import type { RecommendationExplanation } from "./executiveRecommendationExplainabilityEngineTypes.ts";
import {
  validateExecutiveRecommendationGovernanceRequest,
  validateGovernanceDependencies,
  validateRecommendationGovernanceRecord,
} from "./executiveRecommendationGovernanceEngineValidation.ts";

function emptyResult(
  request: ExecutiveRecommendationGovernanceRequest,
  reason: string,
  governanceTimestamp: string
): RecommendationGovernanceResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    governanceRecords: Object.freeze([]),
    profiles: Object.freeze([]),
    registeredGovernanceIds: Object.freeze([]),
    skippedExplanations: 0,
    pipelineStages: EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES,
    governanceTimestamp,
    readOnly: true as const,
  });
}

function sortExplanationsDeterministically(
  request: ExecutiveRecommendationGovernanceRequest
): readonly RecommendationExplanation[] {
  return Object.freeze(
    [...request.explanations].sort((left, right) =>
      left.recommendationId.localeCompare(right.recommendationId)
    )
  );
}

export function buildRecommendationGovernanceProfiles(
  request: ExecutiveRecommendationGovernanceRequest
): readonly RecommendationGovernance[] {
  const governanceTimestamp = request.governanceTimestamp ?? new Date(0).toISOString();
  const sorted = sortExplanationsDeterministically(request);
  return buildRecommendationGovernanceProfilesFromExplanations(sorted, governanceTimestamp);
}

export function validateExecutiveRecommendationGovernance(
  request: ExecutiveRecommendationGovernanceRequest
): RecommendationGovernanceResult {
  const governanceTimestamp = request.governanceTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateExecutiveRecommendationGovernanceRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      governanceTimestamp
    );
  }

  const dependencyValidation = validateGovernanceDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      governanceTimestamp
    );
  }

  const sorted = sortExplanationsDeterministically(request);
  const governanceRecords = buildRecommendationGovernanceProfilesFromExplanations(sorted, governanceTimestamp);
  const registeredGovernanceIds: string[] = [];
  let skippedExplanations = 0;

  for (const governance of governanceRecords) {
    const governanceValidation = validateRecommendationGovernanceRecord(governance);
    if (!governanceValidation.valid) {
      return emptyResult(
        request,
        `Governance validation failed: ${governanceValidation.issues.map((issue) => issue.message).join("; ")}`,
        governanceTimestamp
      );
    }
    const registration = registerRecommendationGovernance(governance);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_governance") {
        skippedExplanations += 1;
        continue;
      }
      return emptyResult(request, registration.reason, governanceTimestamp);
    }
    registeredGovernanceIds.push(governance.governanceId);
  }

  const registeredRecords = Object.freeze(
    registeredGovernanceIds
      .map((governanceId) => governanceRecords.find((entry) => entry.governanceId === governanceId))
      .filter((entry): entry is RecommendationGovernance => entry !== undefined)
      .sort((left, right) => left.governanceId.localeCompare(right.governanceId))
  );

  const profiles = Object.freeze(registeredRecords.map((entry) => entry.profile));

  return Object.freeze({
    success: registeredRecords.length > 0,
    reason:
      registeredRecords.length > 0
        ? `Validated governance for ${registeredRecords.length} executive recommendation(s) without modification.`
        : "No recommendation governance records were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    governanceRecords: registeredRecords,
    profiles,
    registeredGovernanceIds: Object.freeze(registeredGovernanceIds),
    skippedExplanations,
    pipelineStages: EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES,
    governanceTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationGovernancePipeline = Object.freeze({
  validateExecutiveRecommendationGovernance,
  buildRecommendationGovernanceProfiles,
  stages: EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES,
});
