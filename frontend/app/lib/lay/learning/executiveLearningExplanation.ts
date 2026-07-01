import type {
  ExecutiveAssumptionPattern,
  ExecutiveCoachingReflection,
  ExecutiveJudgmentReflection,
  ExecutiveLearningExplanation,
  ExecutiveLearningPattern,
  ExecutiveLearningSession,
  ExecutivePlanReflection,
  ExecutiveReusableLesson,
} from "./executiveLearningTypes.ts";

export function buildExecutiveLearningExplanation(
  session: ExecutiveLearningSession,
  patterns: readonly ExecutiveLearningPattern[],
  assumptionPatterns: readonly ExecutiveAssumptionPattern[],
  judgmentReflection: ExecutiveJudgmentReflection,
  planReflection: ExecutivePlanReflection,
  coachingReflection: ExecutiveCoachingReflection,
  lessons: readonly ExecutiveReusableLesson[]
): ExecutiveLearningExplanation {
  const patternReasons = Object.freeze(patterns.map((pattern) => `${pattern.patternId}: ${pattern.explanation}`));
  const assumptionReasons = Object.freeze(assumptionPatterns.map((pattern) => `${pattern.assumptionPatternId}: ${pattern.explanation}`));
  const reflectionReasons = Object.freeze([
    `${judgmentReflection.reflectionId}: ${judgmentReflection.explanation}`,
    `${planReflection.reflectionId}: ${planReflection.explanation}`,
    `${coachingReflection.reflectionId}: ${coachingReflection.explanation}`,
  ]);
  const lessonReasons = Object.freeze(lessons.map((lesson) => `${lesson.lessonId}: ${lesson.explanation}`));
  const traceReferences = Object.freeze([
    session.reasoningSessionId,
    session.judgmentSessionId,
    session.planningSessionId,
    session.coachingSessionId,
    session.thoughtPartnerSessionId,
    session.visualReasoningSessionId,
    session.communicationSessionId,
    session.negotiationSessionId,
    session.creativitySessionId,
    ...patterns.flatMap((pattern) => pattern.sourceReferences),
    ...assumptionPatterns.flatMap((pattern) => pattern.sourceReferences),
    ...judgmentReflection.sourceReferences,
    ...planReflection.sourceReferences,
    ...coachingReflection.sourceReferences,
    ...lessons.flatMap((lesson) => lesson.sourceReferences),
  ].sort());

  return Object.freeze({
    explanationId: `learning-explanation:${session.sessionId}`,
    patternReasons,
    assumptionReasons,
    reflectionReasons,
    lessonReasons,
    traceReferences,
    narrative: [...patternReasons, ...assumptionReasons, ...reflectionReasons, ...lessonReasons].join(" "),
  });
}
