import type { ExecutiveThoughtPartnerContext, ExecutiveThoughtPartnerInput } from "./executiveThoughtPartnerTypes.ts";

function sortedUnique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

export function normalizeExecutiveThoughtPartnerContext(input: ExecutiveThoughtPartnerInput): ExecutiveThoughtPartnerContext {
  const traceReferences = sortedUnique([
    input.reasoning.session.sessionId,
    input.judgment.session.sessionId,
    input.planning.session.sessionId,
    input.coaching.session.sessionId,
    ...input.reasoning.components.assumptions.map((assumption) => assumption.id),
    ...input.reasoning.components.constraints.map((constraint) => constraint.id),
    ...input.judgment.judgment.priorities.map((priority) => priority.id),
    ...input.planning.goals.map((goal) => goal.goalId),
    ...input.coaching.questions.map((question) => question.questionId),
    ...input.coaching.challenges.map((challenge) => challenge.challengeId),
    ...input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId),
  ]);

  return Object.freeze({
    session: Object.freeze({
      sessionId: input.sessionId,
      phase: "LAY-6" as const,
      reasoningSessionId: input.reasoning.session.sessionId,
      judgmentSessionId: input.judgment.session.sessionId,
      planningSessionId: input.planning.session.sessionId,
      coachingSessionId: input.coaching.session.sessionId,
    }),
    assumptionIds: sortedUnique(input.reasoning.components.assumptions.map((assumption) => assumption.id)),
    constraintIds: sortedUnique(input.reasoning.components.constraints.map((constraint) => constraint.id)),
    priorityIds: sortedUnique(input.judgment.judgment.priorities.map((priority) => priority.id)),
    confidenceLevel: input.judgment.judgment.confidence.level,
    goalIds: sortedUnique(input.planning.goals.map((goal) => goal.goalId)),
    milestoneIds: sortedUnique(input.planning.milestones.map((milestone) => milestone.milestoneId)),
    coachingQuestionIds: sortedUnique(input.coaching.questions.map((question) => question.questionId)),
    challengeIds: sortedUnique(input.coaching.challenges.map((challenge) => challenge.challengeId)),
    blindSpotIds: sortedUnique(input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId)),
    traceReferences,
  });
}
