import type { ExecutiveCreativityContext, ExecutiveCreativityInput } from "./executiveCreativityTypes.ts";

function sortedUnique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

export function normalizeExecutiveCreativityContext(input: ExecutiveCreativityInput): ExecutiveCreativityContext {
  const weakAlternativeIds = sortedUnique(input.judgment.judgment.alternativeEvaluations.filter((alternative) => alternative.judgment !== "high").map((alternative) => alternative.alternativeId));
  const traceReferences = sortedUnique([
    input.reasoning.session.sessionId,
    input.judgment.session.sessionId,
    input.planning.session.sessionId,
    input.coaching.session.sessionId,
    input.thoughtPartner.session.sessionId,
    input.visualReasoning.session.sessionId,
    input.communication.session.sessionId,
    input.negotiation.session.sessionId,
    ...input.reasoning.components.assumptions.map((assumption) => assumption.id),
    ...input.reasoning.components.constraints.map((constraint) => constraint.id),
    ...input.thoughtPartner.tensionMap.map((tension) => tension.tensionId),
    ...input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId),
    ...input.judgment.judgment.risks.map((risk) => risk.id),
    ...input.judgment.judgment.opportunities.map((opportunity) => opportunity.id),
    ...input.negotiation.conflictZones.map((zone) => zone.conflictZoneId),
    ...weakAlternativeIds,
  ]);

  return Object.freeze({
    session: Object.freeze({
      sessionId: input.sessionId,
      phase: "LAY-10" as const,
      reasoningSessionId: input.reasoning.session.sessionId,
      judgmentSessionId: input.judgment.session.sessionId,
      planningSessionId: input.planning.session.sessionId,
      coachingSessionId: input.coaching.session.sessionId,
      thoughtPartnerSessionId: input.thoughtPartner.session.sessionId,
      visualReasoningSessionId: input.visualReasoning.session.sessionId,
      communicationSessionId: input.communication.session.sessionId,
      negotiationSessionId: input.negotiation.session.sessionId,
    }),
    assumptionIds: sortedUnique(input.reasoning.components.assumptions.map((assumption) => assumption.id)),
    constraintIds: sortedUnique(input.reasoning.components.constraints.map((constraint) => constraint.id)),
    tensionIds: sortedUnique(input.thoughtPartner.tensionMap.map((tension) => tension.tensionId)),
    blindSpotIds: sortedUnique(input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId)),
    riskIds: sortedUnique(input.judgment.judgment.risks.map((risk) => risk.id)),
    opportunityIds: sortedUnique(input.judgment.judgment.opportunities.map((opportunity) => opportunity.id)),
    conflictZoneIds: sortedUnique(input.negotiation.conflictZones.map((zone) => zone.conflictZoneId)),
    weakAlternativeIds,
    traceReferences,
  });
}
