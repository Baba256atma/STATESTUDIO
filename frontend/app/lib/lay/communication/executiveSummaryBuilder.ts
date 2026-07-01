import type { ExecutiveCommunicationContext, ExecutiveCommunicationInput, ExecutiveSummary } from "./executiveCommunicationTypes.ts";

export function buildExecutiveSummary(input: ExecutiveCommunicationInput, context: ExecutiveCommunicationContext): ExecutiveSummary {
  const keyPoints = Object.freeze([
    ...input.judgment.judgment.priorities.map((priority) => `Priority ${priority.order}: ${priority.justification}`),
    ...input.thoughtPartner.tensionMap.slice(0, 2).map((tension) => `Tension: ${tension.leftPole} vs ${tension.rightPole}`),
    ...input.visualReasoning.visualExplanation.mapReasons.slice(0, 1),
  ].sort());

  return Object.freeze({
    summaryId: `summary:${context.session.sessionId}`,
    headline: "Board-style executive summary",
    keyPoints,
    rationalePoints: Object.freeze(input.judgment.rationale.whyThisJudgment.map((point) => point).sort()),
    traceReferences: context.traceReferences,
    explanation: "Summary exists to expose concise executive communication metadata without producing a rendered report.",
  });
}
