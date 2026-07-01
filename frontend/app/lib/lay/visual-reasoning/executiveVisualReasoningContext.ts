import type { ExecutiveVisualReasoningContext, ExecutiveVisualReasoningInput } from "./executiveVisualReasoningTypes.ts";

function sortedUnique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

export function normalizeExecutiveVisualReasoningContext(input: ExecutiveVisualReasoningInput): ExecutiveVisualReasoningContext {
  const traceReferences = sortedUnique([
    input.reasoning.session.sessionId,
    input.judgment.session.sessionId,
    input.planning.session.sessionId,
    input.coaching.session.sessionId,
    input.thoughtPartner.session.sessionId,
    ...input.reasoning.chain.nodes.map((node) => node.id),
    ...input.judgment.judgment.priorities.map((priority) => priority.id),
    ...input.planning.goals.map((goal) => goal.goalId),
    ...input.planning.milestones.map((milestone) => milestone.milestoneId),
    ...input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId),
    ...input.thoughtPartner.counterpoints.map((counterpoint) => counterpoint.counterpointId),
    ...input.thoughtPartner.alternativeViewpoints.map((viewpoint) => viewpoint.viewpointId),
    ...input.thoughtPartner.tensionMap.map((tension) => tension.tensionId),
  ]);

  return Object.freeze({
    session: Object.freeze({
      sessionId: input.sessionId,
      phase: "LAY-7" as const,
      reasoningSessionId: input.reasoning.session.sessionId,
      judgmentSessionId: input.judgment.session.sessionId,
      planningSessionId: input.planning.session.sessionId,
      coachingSessionId: input.coaching.session.sessionId,
      thoughtPartnerSessionId: input.thoughtPartner.session.sessionId,
    }),
    reasoningNodeIds: sortedUnique(input.reasoning.chain.nodes.map((node) => node.id)),
    priorityIds: sortedUnique(input.judgment.judgment.priorities.map((priority) => priority.id)),
    confidenceLevel: input.judgment.judgment.confidence.level,
    goalIds: sortedUnique(input.planning.goals.map((goal) => goal.goalId)),
    milestoneIds: sortedUnique(input.planning.milestones.map((milestone) => milestone.milestoneId)),
    blindSpotIds: sortedUnique(input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId)),
    counterpointIds: sortedUnique(input.thoughtPartner.counterpoints.map((counterpoint) => counterpoint.counterpointId)),
    alternativeViewpointIds: sortedUnique(input.thoughtPartner.alternativeViewpoints.map((viewpoint) => viewpoint.viewpointId)),
    tensionIds: sortedUnique(input.thoughtPartner.tensionMap.map((tension) => tension.tensionId)),
    traceReferences,
  });
}
