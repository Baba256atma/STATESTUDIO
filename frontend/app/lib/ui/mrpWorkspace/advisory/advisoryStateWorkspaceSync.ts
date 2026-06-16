/**
 * MRP:5A:2 — Map Advisory recommendation runtime into workspace card snapshots.
 */

import { MRP_ADVISORY_RUNTIME_TAG } from "./advisoryStateContract.ts";
import {
  selectAdvisoryConfidenceLabel,
  selectAdvisoryHasRecommendation,
  selectAdvisoryHasScenarioReference,
  selectAdvisoryRationale,
  selectAdvisoryRecommendationId,
  selectAdvisoryRecommendationTitle,
  selectAdvisorySourceDecisionId,
  selectAdvisorySourceScenarioId,
} from "./advisoryStateSelectors.ts";
import type { AdvisoryFieldSnapshot } from "./advisoryWorkspaceStateContract.ts";
import type { AdvisoryWorkspaceState } from "./advisoryWorkspaceStateContract.ts";

export function buildAdvisoryWorkspaceSnapshotsFromRuntime(
  state: AdvisoryWorkspaceState
): Readonly<{
  executiveRecommendation: AdvisoryFieldSnapshot;
  recommendationDrivers: AdvisoryFieldSnapshot;
  confidenceSummary: AdvisoryFieldSnapshot;
  assumptions: AdvisoryFieldSnapshot;
  alternativeRecommendations: AdvisoryFieldSnapshot;
}> {
  const recommendationId = selectAdvisoryRecommendationId(state);
  const title = selectAdvisoryRecommendationTitle(state);
  const confidenceLabel = selectAdvisoryConfidenceLabel(state);
  const rationale = selectAdvisoryRationale(state);
  const scenarioId = selectAdvisorySourceScenarioId(state);
  const decisionId = selectAdvisorySourceDecisionId(state);
  const hasRecommendation = selectAdvisoryHasRecommendation(state);

  const executiveRecommendation = Object.freeze({
    headline: title ?? "No executive recommendation",
    detail: hasRecommendation
      ? `${MRP_ADVISORY_RUNTIME_TAG} ${recommendationId} — Advisory owns recommendation only.`
      : `${MRP_ADVISORY_RUNTIME_TAG} Awaiting object context to generate recommendation.`,
  });

  const recommendationDrivers = Object.freeze({
    headline: hasRecommendation ? "Recommendation drivers active" : "No recommendation drivers",
    detail: rationale ?? `${MRP_ADVISORY_RUNTIME_TAG} Recommendation drivers pending selection.`,
  });

  const confidenceSummary = Object.freeze({
    headline: hasRecommendation ? `${confidenceLabel} confidence` : "Confidence not evaluated",
    detail: `${MRP_ADVISORY_RUNTIME_TAG} Confidence level ${state.confidence} — recommendation surface only.`,
  });

  const assumptions = Object.freeze({
    headline: selectAdvisoryHasScenarioReference(state)
      ? "Scenario-linked assumptions"
      : "General assumptions",
    detail: scenarioId
      ? `${MRP_ADVISORY_RUNTIME_TAG} Scenario reference ${scenarioId} — consume-only, no Scenario ownership.`
      : `${MRP_ADVISORY_RUNTIME_TAG} Assumptions pending scenario linkage.`,
  });

  const alternativeRecommendations = Object.freeze({
    headline: decisionId ? "Alternatives under review" : "Alternative recommendations",
    detail: decisionId
      ? `${MRP_ADVISORY_RUNTIME_TAG} Decision reference ${decisionId} — Advisory recommends, War Room commits.`
      : `${MRP_ADVISORY_RUNTIME_TAG} Alternative recommendation slots ready — no approval ownership.`,
  });

  return Object.freeze({
    executiveRecommendation,
    recommendationDrivers,
    confidenceSummary,
    assumptions,
    alternativeRecommendations,
  });
}
