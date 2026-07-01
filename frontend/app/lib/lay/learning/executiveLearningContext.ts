import type { ExecutiveLearningContext, ExecutiveLearningInput } from "./executiveLearningTypes.ts";

function sortedUnique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

export function normalizeExecutiveLearningContext(input: ExecutiveLearningInput): ExecutiveLearningContext {
  const traceReferences = sortedUnique([
    input.reasoning.session.sessionId,
    input.judgment.session.sessionId,
    input.planning.session.sessionId,
    input.coaching.session.sessionId,
    input.thoughtPartner.session.sessionId,
    input.visualReasoning.session.sessionId,
    input.communication.session.sessionId,
    input.negotiation.session.sessionId,
    input.creativity.session.sessionId,
    ...input.reasoning.components.assumptions.map((assumption) => assumption.id),
    ...input.reasoning.components.constraints.map((constraint) => constraint.id),
    ...input.judgment.judgment.risks.map((risk) => risk.id),
    ...input.thoughtPartner.tensionMap.map((tension) => tension.tensionId),
    ...input.judgment.judgment.priorities.map((priority) => priority.id),
    ...input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId),
    ...input.negotiation.conflictZones.map((zone) => zone.conflictZoneId),
    ...input.creativity.reframes.map((reframe) => reframe.reframeId),
  ]);

  return Object.freeze({
    session: Object.freeze({
      sessionId: input.sessionId,
      phase: "LAY-11" as const,
      reasoningSessionId: input.reasoning.session.sessionId,
      judgmentSessionId: input.judgment.session.sessionId,
      planningSessionId: input.planning.session.sessionId,
      coachingSessionId: input.coaching.session.sessionId,
      thoughtPartnerSessionId: input.thoughtPartner.session.sessionId,
      visualReasoningSessionId: input.visualReasoning.session.sessionId,
      communicationSessionId: input.communication.session.sessionId,
      negotiationSessionId: input.negotiation.session.sessionId,
      creativitySessionId: input.creativity.session.sessionId,
    }),
    assumptionIds: sortedUnique(input.reasoning.components.assumptions.map((assumption) => assumption.id)),
    constraintIds: sortedUnique(input.reasoning.components.constraints.map((constraint) => constraint.id)),
    riskIds: sortedUnique(input.judgment.judgment.risks.map((risk) => risk.id)),
    tensionIds: sortedUnique(input.thoughtPartner.tensionMap.map((tension) => tension.tensionId)),
    priorityIds: sortedUnique(input.judgment.judgment.priorities.map((priority) => priority.id)),
    blindSpotIds: sortedUnique(input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId)),
    conflictZoneIds: sortedUnique(input.negotiation.conflictZones.map((zone) => zone.conflictZoneId)),
    reframeIds: sortedUnique(input.creativity.reframes.map((reframe) => reframe.reframeId)),
    traceReferences,
  });
}
