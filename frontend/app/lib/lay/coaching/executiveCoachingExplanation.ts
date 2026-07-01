import type {
  ExecutiveAssumptionChallenge,
  ExecutiveBlindSpot,
  ExecutiveCoachingExplanation,
  ExecutiveCoachingQuestion,
  ExecutiveCoachingSession,
} from "./executiveCoachingTypes.ts";

export function buildExecutiveCoachingExplanation(
  session: ExecutiveCoachingSession,
  questions: readonly ExecutiveCoachingQuestion[],
  challenges: readonly ExecutiveAssumptionChallenge[],
  blindSpots: readonly ExecutiveBlindSpot[]
): ExecutiveCoachingExplanation {
  const questionReasons = Object.freeze(questions.map((question) => `${question.questionId}: ${question.coachingIntent}`));
  const challengeReasons = Object.freeze(challenges.map((challenge) => `${challenge.challengeId}: ${challenge.reasonForChallenge}`));
  const blindSpotReasons = Object.freeze(blindSpots.map((blindSpot) => `${blindSpot.blindSpotId}: ${blindSpot.description}`));
  const traceReferences = Object.freeze([
    session.reasoningSessionId,
    session.judgmentSessionId,
    session.planningSessionId,
    ...questions.map((question) => question.sourceId),
    ...challenges.map((challenge) => challenge.challengedAssumptionId),
    ...blindSpots.map((blindSpot) => blindSpot.traceReference),
  ].sort());

  return Object.freeze({
    explanationId: `coaching-explanation:${session.sessionId}`,
    questionReasons,
    challengeReasons,
    blindSpotReasons,
    traceReferences,
    narrative: [...questionReasons, ...challengeReasons, ...blindSpotReasons].join(" "),
  });
}
