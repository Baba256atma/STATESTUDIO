/**
 * D:2:6 — Dashboard Confidence Binding.
 *
 * Exposes confidence score, confidence level, evidence strength, and uncertainty
 * warnings to Dashboard surfaces. Read-only presentation binding with no execution
 * authority.
 */

import {
  DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC,
  DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTICS,
  DECISION_CONFIDENCE_BINDING_VERSION,
  EMPTY_DASHBOARD_CONFIDENCE_BINDING_RESULT,
  type DashboardConfidenceBindingResult,
  type DashboardConfidenceBindingView,
  type DashboardUncertaintyWarningView,
  type DecisionConfidenceBindingBuildInput,
} from "./decisionConfidenceBindingContract.ts";

export {
  ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC,
  D2_CONFIDENCE_BINDING_COMPLETE_TAG,
  DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC,
  DECISION_CONFIDENCE_BINDING_DIAGNOSTICS,
  DECISION_CONFIDENCE_BINDING_VERSION,
  EMPTY_DASHBOARD_CONFIDENCE_BINDING_RESULT,
  type DashboardConfidenceBindingResult,
  type DashboardConfidenceBindingView,
  type DecisionConfidenceBindingBuildInput,
} from "./decisionConfidenceBindingContract.ts";

let latestDashboardConfidenceBindingResult: DashboardConfidenceBindingResult =
  EMPTY_DASHBOARD_CONFIDENCE_BINDING_RESULT;

function buildUncertaintyWarnings(
  input: DecisionConfidenceBindingBuildInput
): readonly DashboardUncertaintyWarningView[] {
  return Object.freeze(
    input.uncertainty.findings.slice(0, 6).map((finding) =>
      Object.freeze({
        warningId: finding.findingId,
        label: finding.label,
        severity: finding.severity,
        detail: finding.detail,
        readOnly: true as const,
        mutation: false as const,
      })
    )
  );
}

function buildDashboardView(
  input: DecisionConfidenceBindingBuildInput
): DashboardConfidenceBindingView | null {
  if (!input.confidenceScore.recommendationId) return null;

  const uncertaintyWarnings = buildUncertaintyWarnings(input);

  return Object.freeze({
    recommendationId: input.recommendationId,
    optionId: input.optionId,
    optionLabel: input.optionLabel,
    confidenceScore: input.confidenceScore.confidenceScore,
    confidenceLevel: input.confidenceScore.confidenceLevel,
    confidenceLabel: input.confidenceScore.confidenceLabel,
    evidenceStrength: input.evidenceStrength.strengthScore,
    evidenceCount: input.evidenceStrength.evidenceCount,
    uncertaintyWarnings,
    uncertaintyWarningCount: uncertaintyWarnings.length,
    bindingStatus: "bound" as const,
    bindingReady: true as const,
    readOnly: true as const,
    executesDecisions: false as const,
    mutation: false as const,
  });
}

export function resolveDashboardConfidenceBinding(
  input: DecisionConfidenceBindingBuildInput
): DashboardConfidenceBindingResult {
  const view = buildDashboardView(input);

  latestDashboardConfidenceBindingResult = Object.freeze({
    version: DECISION_CONFIDENCE_BINDING_VERSION,
    boundAt: input.boundAt,
    view,
    bindingStatus: view ? ("bound" as const) : ("missing_confidence" as const),
    readOnly: true as const,
    executesDecisions: false as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTICS,
  });

  return latestDashboardConfidenceBindingResult;
}

export function getDashboardConfidenceBindingResult(): DashboardConfidenceBindingResult {
  return latestDashboardConfidenceBindingResult;
}

export function resetDashboardConfidenceBindingForTests(): void {
  latestDashboardConfidenceBindingResult = EMPTY_DASHBOARD_CONFIDENCE_BINDING_RESULT;
}

export const DashboardConfidenceBinding = Object.freeze({
  resolveDashboardConfidenceBinding,
  getDashboardConfidenceBindingResult,
  resetDashboardConfidenceBindingForTests,
  diagnostic: DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC,
  emptyResult: EMPTY_DASHBOARD_CONFIDENCE_BINDING_RESULT,
});
