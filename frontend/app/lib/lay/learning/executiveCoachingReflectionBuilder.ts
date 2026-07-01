import type { ExecutiveCoachingReflection, ExecutiveLearningInput } from "./executiveLearningTypes.ts";

export function buildExecutiveCoachingReflection(input: ExecutiveLearningInput): ExecutiveCoachingReflection {
  return Object.freeze({
    reflectionId: `coaching-reflection:${input.coaching.session.sessionId}`,
    questionCount: input.coaching.questions.length,
    challengeCount: input.coaching.challenges.length,
    blindSpotCount: input.coaching.blindSpots.length,
    sourceReferences: Object.freeze([
      input.coaching.session.sessionId,
      ...input.coaching.questions.map((question) => question.questionId),
      ...input.coaching.challenges.map((challenge) => challenge.challengeId),
      ...input.coaching.blindSpots.map((blindSpot) => blindSpot.blindSpotId),
    ].sort()),
    explanation: "Coaching reflection summarizes coaching effectiveness signals without feedback mutation.",
  });
}
