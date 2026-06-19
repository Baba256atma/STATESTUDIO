/**
 * D:2:6 — Assistant Confidence Bridge.
 *
 * Generates read-only Assistant explanations for confidence level, supporting
 * evidence, and remaining uncertainty. The bridge does not execute decisions,
 * mutate sources, route, or change scene, topology, DS, or simulation state.
 */

import {
  ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC,
  ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTICS,
  DECISION_CONFIDENCE_BINDING_VERSION,
  EMPTY_ASSISTANT_CONFIDENCE_BINDING_RESULT,
  type AssistantConfidenceBindingResult,
  type AssistantConfidenceBindingView,
  type AssistantConfidenceExplanationView,
  type DecisionConfidenceBindingBuildInput,
} from "./decisionConfidenceBindingContract.ts";

export {
  type AssistantConfidenceBindingResult,
  type AssistantConfidenceBindingView,
  type AssistantConfidenceExplanationView,
} from "./decisionConfidenceBindingContract.ts";

let latestAssistantConfidenceBindingResult: AssistantConfidenceBindingResult =
  EMPTY_ASSISTANT_CONFIDENCE_BINDING_RESULT;

function freezeExplanation(
  input: Omit<AssistantConfidenceExplanationView, "readOnly" | "mutation">
): AssistantConfidenceExplanationView {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
  });
}

function confidenceLevelExplanation(
  input: DecisionConfidenceBindingBuildInput
): AssistantConfidenceExplanationView {
  const highOrLimited =
    input.explanation.whyConfidenceHigh || input.explanation.whyConfidenceLimited;

  return freezeExplanation({
    explanationId: `assistant-confidence:level:${input.recommendationId}`,
    kind: "confidence_level",
    subjectId: input.confidenceScore.scoreId,
    title:
      input.confidenceScore.confidenceLevel === "high"
        ? "Why confidence is high"
        : "Why confidence is limited",
    explanation: highOrLimited || input.explanation.explanation.summary,
  });
}

function supportingEvidenceExplanations(
  input: DecisionConfidenceBindingBuildInput
): readonly AssistantConfidenceExplanationView[] {
  return Object.freeze(
    input.explanation.supportingEvidence.map((evidence, index) =>
      freezeExplanation({
        explanationId: `assistant-confidence:evidence:${input.recommendationId}:${index + 1}`,
        kind: "supporting_evidence",
        subjectId: input.evidenceStrength.profileId,
        title: "Evidence supporting recommendation",
        explanation: evidence,
      })
    )
  );
}

function remainingUncertaintyExplanation(
  input: DecisionConfidenceBindingBuildInput
): AssistantConfidenceExplanationView {
  const uncertaintyText =
    input.explanation.weakeningUncertainty.length > 0
      ? input.explanation.weakeningUncertainty.join(" ")
      : "No material uncertainty remains beyond routine executive review.";

  return freezeExplanation({
    explanationId: `assistant-confidence:uncertainty:${input.recommendationId}`,
    kind: "remaining_uncertainty",
    subjectId: input.uncertainty.profileId,
    title: "Remaining uncertainty",
    explanation: uncertaintyText,
  });
}

function buildAssistantView(
  input: DecisionConfidenceBindingBuildInput
): AssistantConfidenceBindingView | null {
  if (!input.confidenceScore.recommendationId) return null;

  const confidenceLevelExplanationView = confidenceLevelExplanation(input);
  const supportingEvidenceExplanationViews = supportingEvidenceExplanations(input);
  const remainingUncertaintyExplanationView = remainingUncertaintyExplanation(input);

  return Object.freeze({
    recommendationId: input.recommendationId,
    confidenceLevelExplanation: confidenceLevelExplanationView,
    supportingEvidenceExplanations: supportingEvidenceExplanationViews,
    remainingUncertaintyExplanation: remainingUncertaintyExplanationView,
    explanationCount: 1 + supportingEvidenceExplanationViews.length + 1,
    bindingReady: true as const,
    readOnly: true as const,
    actionExecution: false as const,
    mutation: false as const,
  });
}

export function explainDecisionConfidence(
  input: DecisionConfidenceBindingBuildInput
): AssistantConfidenceBindingResult {
  const view = buildAssistantView(input);

  latestAssistantConfidenceBindingResult = Object.freeze({
    version: DECISION_CONFIDENCE_BINDING_VERSION,
    boundAt: input.boundAt,
    view,
    readOnly: true as const,
    actionExecution: false as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTICS,
  });

  return latestAssistantConfidenceBindingResult;
}

export function getAssistantConfidenceBindingResult(): AssistantConfidenceBindingResult {
  return latestAssistantConfidenceBindingResult;
}

export function resetAssistantConfidenceBindingForTests(): void {
  latestAssistantConfidenceBindingResult = EMPTY_ASSISTANT_CONFIDENCE_BINDING_RESULT;
}

export const AssistantConfidenceBridge = Object.freeze({
  explainDecisionConfidence,
  getAssistantConfidenceBindingResult,
  resetAssistantConfidenceBindingForTests,
  diagnostic: ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC,
  emptyResult: EMPTY_ASSISTANT_CONFIDENCE_BINDING_RESULT,
});
