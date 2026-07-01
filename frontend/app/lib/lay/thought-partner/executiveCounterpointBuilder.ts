import type { ExecutiveCounterpoint, ExecutiveThoughtPartnerContext, ExecutiveThoughtPartnerInput } from "./executiveThoughtPartnerTypes.ts";

export function buildExecutiveCounterpoints(
  input: ExecutiveThoughtPartnerInput,
  context: ExecutiveThoughtPartnerContext
): readonly ExecutiveCounterpoint[] {
  const counterpoints: ExecutiveCounterpoint[] = [
    ...context.assumptionIds.map((assumptionId) =>
      Object.freeze({
        counterpointId: `counterpoint:assumption:${assumptionId}`,
        statement: `What if ${assumptionId} is weaker than the current reasoning implies?`,
        reason: "Assumptions can narrow the executive frame if left untested.",
        sourceReference: assumptionId,
        executiveRelevance: "Protects judgment quality before downstream planning is consumed.",
      })
    ),
    ...context.constraintIds.map((constraintId) =>
      Object.freeze({
        counterpointId: `counterpoint:constraint:${constraintId}`,
        statement: `What if ${constraintId} is negotiable or incorrectly framed?`,
        reason: "Constraints may over-shape the perceived option space.",
        sourceReference: constraintId,
        executiveRelevance: "Keeps strategic latitude visible without making a recommendation.",
      })
    ),
    ...input.planning.dependencies
      .filter((dependency) => dependency.dependencyType === "phase-to-phase")
      .map((dependency) =>
        Object.freeze({
          counterpointId: `counterpoint:dependency:${dependency.dependencyId}`,
          statement: `What if dependency ${dependency.dependencyId} fails earlier than expected?`,
          reason: "Fragile dependencies can distort confidence in the plan sequence.",
          sourceReference: dependency.dependencyId,
          executiveRelevance: "Surfaces execution tension without executing or rescheduling work.",
        })
      ),
    ...input.coaching.challenges.map((challenge) =>
      Object.freeze({
        counterpointId: `counterpoint:challenge:${challenge.challengeId}`,
        statement: challenge.reasonForChallenge,
        reason: "Coaching challenges expose places where the executive frame deserves pressure-testing.",
        sourceReference: challenge.challengeId,
        executiveRelevance: challenge.coachingIntent,
      })
    ),
  ];

  if (input.judgment.judgment.confidence.level !== "high") {
    counterpoints.push(Object.freeze({
      counterpointId: `counterpoint:confidence:${input.judgment.judgment.confidence.level}`,
      statement: `What if ${input.judgment.judgment.confidence.level} confidence is not sufficient for this conversation path?`,
      reason: "Confidence limitations should remain visible in executive dialogue.",
      sourceReference: input.judgment.session.sessionId,
      executiveRelevance: "Keeps the thought partner from over-resolving uncertainty.",
    }));
  }

  return Object.freeze(counterpoints.sort((left, right) => left.counterpointId.localeCompare(right.counterpointId)));
}
