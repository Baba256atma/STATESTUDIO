import type {
  ExecutiveAssumptionPattern,
  ExecutiveCoachingReflection,
  ExecutiveJudgmentReflection,
  ExecutiveLearningPattern,
  ExecutivePlanReflection,
  ExecutiveReusableLesson,
} from "./executiveLearningTypes.ts";

export function buildExecutiveLessons(
  patterns: readonly ExecutiveLearningPattern[],
  assumptionPatterns: readonly ExecutiveAssumptionPattern[],
  judgmentReflection: ExecutiveJudgmentReflection,
  planReflection: ExecutivePlanReflection,
  coachingReflection: ExecutiveCoachingReflection
): readonly ExecutiveReusableLesson[] {
  const lessons: ExecutiveReusableLesson[] = [
    ...patterns.slice(0, 6).map((pattern) =>
      Object.freeze({
        lessonId: `lesson:${pattern.patternId}`,
        lesson: `Reuse ${pattern.patternType} awareness in future executive analysis.`,
        sourceReferences: pattern.sourceReferences,
        memoryMutation: false as const,
        explanation: "Lesson is reusable metadata and does not update memory.",
      })
    ),
    ...assumptionPatterns.map((assumption) =>
      Object.freeze({
        lessonId: `lesson:${assumption.assumptionPatternId}`,
        lesson: `Track repeated assumption ${assumption.assumptionId} as future context.`,
        sourceReferences: assumption.sourceReferences,
        memoryMutation: false as const,
        explanation: "Assumption lesson remains metadata-only.",
      })
    ),
    Object.freeze({
      lessonId: `lesson:${judgmentReflection.reflectionId}`,
      lesson: `Judgment had ${judgmentReflection.priorityCount} priorities and ${judgmentReflection.riskCount} risks.`,
      sourceReferences: judgmentReflection.sourceReferences,
      memoryMutation: false as const,
      explanation: "Judgment lesson captures reflection metadata only.",
    }),
    Object.freeze({
      lessonId: `lesson:${planReflection.reflectionId}`,
      lesson: `Plan had ${planReflection.goalCount} goals and ${planReflection.dependencyCount} dependencies.`,
      sourceReferences: planReflection.sourceReferences,
      memoryMutation: false as const,
      explanation: "Plan lesson captures reflection metadata only.",
    }),
    Object.freeze({
      lessonId: `lesson:${coachingReflection.reflectionId}`,
      lesson: `Coaching surfaced ${coachingReflection.questionCount} questions and ${coachingReflection.blindSpotCount} blind spots.`,
      sourceReferences: coachingReflection.sourceReferences,
      memoryMutation: false as const,
      explanation: "Coaching lesson captures reflection metadata only.",
    }),
  ];

  return Object.freeze(lessons.sort((left, right) => left.lessonId.localeCompare(right.lessonId)));
}
