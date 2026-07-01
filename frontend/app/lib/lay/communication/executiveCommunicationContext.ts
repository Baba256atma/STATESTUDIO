import type { ExecutiveCommunicationAudience, ExecutiveCommunicationContext, ExecutiveCommunicationInput } from "./executiveCommunicationTypes.ts";

export const EXECUTIVE_COMMUNICATION_AUDIENCES: readonly ExecutiveCommunicationAudience[] = Object.freeze([
  "CEO",
  "board",
  "operationsLeader",
  "financeLeader",
  "riskComplianceLeader",
  "teamLead",
]);

function sortedUnique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

export function normalizeExecutiveCommunicationContext(input: ExecutiveCommunicationInput): ExecutiveCommunicationContext {
  const visualMapIds = Object.freeze([
    input.visualReasoning.executiveMap.mapId,
    input.visualReasoning.causeEffectMap.mapId,
    input.visualReasoning.decisionMap.mapId,
    input.visualReasoning.tradeoffMap.mapId,
    input.visualReasoning.planMap.mapId,
  ].sort());
  const traceReferences = sortedUnique([
    input.reasoning.session.sessionId,
    input.judgment.session.sessionId,
    input.planning.session.sessionId,
    input.coaching.session.sessionId,
    input.thoughtPartner.session.sessionId,
    input.visualReasoning.session.sessionId,
    ...input.reasoning.chain.nodes.map((node) => node.id),
    ...input.judgment.judgment.priorities.map((priority) => priority.id),
    ...input.judgment.judgment.risks.map((risk) => risk.id),
    ...input.judgment.judgment.opportunities.map((opportunity) => opportunity.id),
    ...input.planning.goals.map((goal) => goal.goalId),
    ...input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId),
    ...input.thoughtPartner.counterpoints.map((counterpoint) => counterpoint.counterpointId),
    ...visualMapIds,
  ]);

  return Object.freeze({
    session: Object.freeze({
      sessionId: input.sessionId,
      phase: "LAY-8" as const,
      reasoningSessionId: input.reasoning.session.sessionId,
      judgmentSessionId: input.judgment.session.sessionId,
      planningSessionId: input.planning.session.sessionId,
      coachingSessionId: input.coaching.session.sessionId,
      thoughtPartnerSessionId: input.thoughtPartner.session.sessionId,
      visualReasoningSessionId: input.visualReasoning.session.sessionId,
    }),
    audienceIds: EXECUTIVE_COMMUNICATION_AUDIENCES,
    reasoningTraceIds: sortedUnique(input.reasoning.chain.nodes.map((node) => node.id)),
    priorityIds: sortedUnique(input.judgment.judgment.priorities.map((priority) => priority.id)),
    riskIds: sortedUnique(input.judgment.judgment.risks.map((risk) => risk.id)),
    opportunityIds: sortedUnique(input.judgment.judgment.opportunities.map((opportunity) => opportunity.id)),
    goalIds: sortedUnique(input.planning.goals.map((goal) => goal.goalId)),
    blindSpotIds: sortedUnique(input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId)),
    counterpointIds: sortedUnique(input.thoughtPartner.counterpoints.map((counterpoint) => counterpoint.counterpointId)),
    visualMapIds,
    traceReferences,
  });
}
