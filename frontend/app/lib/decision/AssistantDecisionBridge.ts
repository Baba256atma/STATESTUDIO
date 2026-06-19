/**
 * D:1 — Assistant Decision Bridge.
 *
 * Generates read-only Assistant explanations for recommendations, tradeoffs, and
 * reasoning. The bridge does not execute recommendations, mutate sources, route,
 * or change scene, topology, DS, or simulation state.
 */

import {
  ASSISTANT_DECISION_BINDING_DIAGNOSTIC,
  ASSISTANT_DECISION_BINDING_DIAGNOSTICS,
  DECISION_BINDING_VERSION,
  EMPTY_ASSISTANT_DECISION_BINDING_RESULT,
  type AssistantDecisionBindingResult,
  type AssistantDecisionBindingView,
  type AssistantDecisionExplanationView,
  type DecisionBindingBuildInput,
} from "./decisionBindingContract.ts";

export {
  type AssistantDecisionBindingResult,
  type AssistantDecisionBindingView,
  type AssistantDecisionExplanationView,
} from "./decisionBindingContract.ts";

let latestAssistantDecisionBindingResult: AssistantDecisionBindingResult =
  EMPTY_ASSISTANT_DECISION_BINDING_RESULT;

function freezeExplanation(
  input: Omit<AssistantDecisionExplanationView, "readOnly" | "mutation">
): AssistantDecisionExplanationView {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
  });
}

function recommendationExplanation(input: DecisionBindingBuildInput): AssistantDecisionExplanationView {
  const recommended = input.recommendation.recommendedOption;
  return freezeExplanation({
    explanationId: `assistant-decision:recommendation:${input.recommendation.recommendationId}`,
    kind: "recommendation",
    subjectId: recommended?.option.optionId ?? input.recommendation.recommendationId,
    title: recommended ? `Why ${recommended.option.label} is recommended` : "No recommendation available",
    explanation: recommended
      ? `${recommended.option.label} is recommended because ${input.explanation.whyRankedFirst} ${recommended.rationale}`
      : "No executive recommendation is available to explain.",
  });
}

function tradeoffExplanations(input: DecisionBindingBuildInput): readonly AssistantDecisionExplanationView[] {
  return Object.freeze(
    input.explanation.majorTradeoffs.map((tradeoff, index) =>
      freezeExplanation({
        explanationId: `assistant-decision:tradeoff:${input.recommendation.recommendationId}:${index + 1}`,
        kind: "tradeoff",
        subjectId: input.tradeoffProfile.profileId,
        title: `Tradeoff: ${tradeoff.split(":")[0]?.trim() ?? "Comparison"}`,
        explanation: tradeoff,
      })
    )
  );
}

function reasoningExplanation(input: DecisionBindingBuildInput): AssistantDecisionExplanationView {
  const parts = [
    input.explanation.explanation.rationale,
    ...input.explanation.whyAlternativesLower.map(
      (alternative) => `Alternative ranking note: ${alternative}`
    ),
    ...input.explanation.majorRisks.map((risk) => `Risk consideration: ${risk}`),
    ...input.explanation.expectedBenefits.map((benefit) => `Expected benefit: ${benefit}`),
  ];
  return freezeExplanation({
    explanationId: `assistant-decision:reasoning:${input.recommendation.recommendationId}`,
    kind: "reasoning",
    subjectId: input.explanation.explanation.explanationId,
    title: "Recommendation reasoning",
    explanation: parts.filter(Boolean).join(" "),
  });
}

function buildAssistantView(input: DecisionBindingBuildInput): AssistantDecisionBindingView | null {
  if (!input.recommendation.recommendedOption) return null;
  const recommendationExplanationView = recommendationExplanation(input);
  const tradeoffExplanationViews = tradeoffExplanations(input);
  const reasoningExplanationView = reasoningExplanation(input);
  return Object.freeze({
    recommendationId: input.recommendation.recommendationId,
    recommendationExplanation: recommendationExplanationView,
    tradeoffExplanations: tradeoffExplanationViews,
    reasoningExplanation: reasoningExplanationView,
    explanationCount:
      1 + tradeoffExplanationViews.length + 1,
    bindingReady: true as const,
    readOnly: true as const,
    actionExecution: false as const,
    mutation: false as const,
  });
}

export function explainDecisionRecommendation(
  input: DecisionBindingBuildInput
): AssistantDecisionBindingResult {
  const view = buildAssistantView(input);
  latestAssistantDecisionBindingResult = Object.freeze({
    version: DECISION_BINDING_VERSION,
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
    diagnostics: ASSISTANT_DECISION_BINDING_DIAGNOSTICS,
  });
  return latestAssistantDecisionBindingResult;
}

export function getAssistantDecisionBindingResult(): AssistantDecisionBindingResult {
  return latestAssistantDecisionBindingResult;
}

export function resetAssistantDecisionBindingForTests(): void {
  latestAssistantDecisionBindingResult = EMPTY_ASSISTANT_DECISION_BINDING_RESULT;
}

export const AssistantDecisionBridge = Object.freeze({
  explainDecisionRecommendation,
  getAssistantDecisionBindingResult,
  resetAssistantDecisionBindingForTests,
  diagnostic: ASSISTANT_DECISION_BINDING_DIAGNOSTIC,
  emptyResult: EMPTY_ASSISTANT_DECISION_BINDING_RESULT,
});
