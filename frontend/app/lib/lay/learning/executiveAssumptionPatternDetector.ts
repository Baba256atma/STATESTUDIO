import type { ExecutiveAssumptionPattern, ExecutiveLearningInput } from "./executiveLearningTypes.ts";

export function detectExecutiveAssumptionPatterns(input: ExecutiveLearningInput): readonly ExecutiveAssumptionPattern[] {
  return Object.freeze(
    input.reasoning.components.assumptions.map((assumption) => {
      const sourceReferences = Object.freeze([
        assumption.id,
        ...input.coaching.questions.filter((question) => question.sourceId === assumption.id).map((question) => question.questionId),
        ...input.creativity.reframes.filter((reframe) => reframe.sourceReference === assumption.id).map((reframe) => reframe.reframeId),
      ].sort());
      return Object.freeze({
        assumptionPatternId: `assumption-pattern:${assumption.id}`,
        assumptionId: assumption.id,
        occurrenceCount: sourceReferences.length,
        sourceReferences,
        explanation: "Assumption pattern captures repeated references without changing memory.",
      });
    }).sort((left, right) => left.assumptionPatternId.localeCompare(right.assumptionPatternId))
  );
}
