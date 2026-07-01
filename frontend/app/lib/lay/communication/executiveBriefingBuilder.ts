import type { ExecutiveBriefing, ExecutiveCommunicationContext, ExecutiveCommunicationInput } from "./executiveCommunicationTypes.ts";

export function buildExecutiveBriefing(input: ExecutiveCommunicationInput, context: ExecutiveCommunicationContext): ExecutiveBriefing {
  return Object.freeze({
    briefingId: `briefing:${context.session.sessionId}`,
    title: "Executive briefing",
    situation: input.reasoning.session.input.situation,
    judgmentRationale: input.judgment.rationale.narrative,
    planOverview: input.planning.explanation.narrative,
    risks: Object.freeze(input.judgment.judgment.risks.map((risk) => `${risk.id}: ${risk.description}`).sort()),
    sourceReferences: Object.freeze([
      context.session.reasoningSessionId,
      context.session.judgmentSessionId,
      context.session.planningSessionId,
      context.session.coachingSessionId,
      context.session.thoughtPartnerSessionId,
      context.session.visualReasoningSessionId,
    ].sort()),
    explanation: "Briefing exists to combine situation, rationale, risk, and plan metadata for downstream consumers.",
  });
}
