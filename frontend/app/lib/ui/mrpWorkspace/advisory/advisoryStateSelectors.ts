/**
 * MRP:5A:2 — Advisory recommendation runtime state selectors.
 */

import {
  ADVISORY_CONFIDENCE_LABELS,
  type AdvisoryConfidenceLevel,
  type AdvisoryRecommendationRuntime,
} from "./advisoryStateContract.ts";
import type { AdvisoryWorkspaceState } from "./advisoryWorkspaceStateContract.ts";

export function selectAdvisoryRecommendationId(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): string | null {
  return state.recommendationId;
}

export function selectAdvisoryRecommendationTitle(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): string | null {
  return state.recommendationTitle;
}

export function selectAdvisoryConfidence(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): AdvisoryConfidenceLevel {
  return state.confidence;
}

export function selectAdvisoryConfidenceLabel(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): string {
  return ADVISORY_CONFIDENCE_LABELS[state.confidence];
}

export function selectAdvisoryRationale(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): string | null {
  return state.rationale;
}

export function selectAdvisorySelectedObjectId(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): string | null {
  return state.selectedObjectId;
}

export function selectAdvisorySourceScenarioId(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): string | null {
  return state.sourceScenarioId;
}

export function selectAdvisorySourceDecisionId(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): string | null {
  return state.sourceDecisionId;
}

export function selectAdvisoryHasRecommendation(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): boolean {
  return state.recommendationId !== null;
}

export function selectAdvisoryHasScenarioReference(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): boolean {
  return state.sourceScenarioId !== null;
}

export function selectAdvisoryHasDecisionReference(
  state: AdvisoryWorkspaceState | AdvisoryRecommendationRuntime
): boolean {
  return state.sourceDecisionId !== null;
}

export function selectAdvisoryRecommendationRuntime(
  state: AdvisoryWorkspaceState
): AdvisoryRecommendationRuntime {
  return Object.freeze({
    recommendationId: state.recommendationId,
    recommendationTitle: state.recommendationTitle,
    confidence: state.confidence,
    rationale: state.rationale,
    selectedObjectId: state.selectedObjectId,
    sourceScenarioId: state.sourceScenarioId,
    sourceDecisionId: state.sourceDecisionId,
  });
}
