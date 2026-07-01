import type { ExecutiveNegotiationContext, ExecutiveNegotiationInput } from "./executiveNegotiationTypes.ts";

function sortedUnique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

export function normalizeExecutiveNegotiationContext(input: ExecutiveNegotiationInput): ExecutiveNegotiationContext {
  const stakeholderIds = sortedUnique(input.communication.audienceFrames.map((frame) => `stakeholder:${frame.audience}`));
  const traceReferences = sortedUnique([
    input.reasoning.session.sessionId,
    input.judgment.session.sessionId,
    input.planning.session.sessionId,
    input.coaching.session.sessionId,
    input.thoughtPartner.session.sessionId,
    input.visualReasoning.session.sessionId,
    input.communication.session.sessionId,
    ...input.judgment.judgment.priorities.map((priority) => priority.id),
    ...input.judgment.judgment.risks.map((risk) => risk.id),
    ...input.judgment.judgment.opportunities.map((opportunity) => opportunity.id),
    ...input.reasoning.components.constraints.map((constraint) => constraint.id),
    ...input.planning.goals.map((goal) => goal.goalId),
    ...input.communication.audienceFrames.map((frame) => frame.frameId),
    ...input.thoughtPartner.counterpoints.map((counterpoint) => counterpoint.counterpointId),
  ]);

  return Object.freeze({
    session: Object.freeze({
      sessionId: input.sessionId,
      phase: "LAY-9" as const,
      reasoningSessionId: input.reasoning.session.sessionId,
      judgmentSessionId: input.judgment.session.sessionId,
      planningSessionId: input.planning.session.sessionId,
      coachingSessionId: input.coaching.session.sessionId,
      thoughtPartnerSessionId: input.thoughtPartner.session.sessionId,
      visualReasoningSessionId: input.visualReasoning.session.sessionId,
      communicationSessionId: input.communication.session.sessionId,
    }),
    stakeholderIds,
    priorityIds: sortedUnique(input.judgment.judgment.priorities.map((priority) => priority.id)),
    riskIds: sortedUnique(input.judgment.judgment.risks.map((risk) => risk.id)),
    opportunityIds: sortedUnique(input.judgment.judgment.opportunities.map((opportunity) => opportunity.id)),
    constraintIds: sortedUnique(input.reasoning.components.constraints.map((constraint) => constraint.id)),
    goalIds: sortedUnique(input.planning.goals.map((goal) => goal.goalId)),
    audienceFrameIds: sortedUnique(input.communication.audienceFrames.map((frame) => frame.frameId)),
    counterpointIds: sortedUnique(input.thoughtPartner.counterpoints.map((counterpoint) => counterpoint.counterpointId)),
    traceReferences,
  });
}
