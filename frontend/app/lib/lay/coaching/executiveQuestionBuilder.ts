import type { ExecutiveCoachingContext, ExecutiveCoachingInput, ExecutiveCoachingQuestion } from "./executiveCoachingTypes.ts";

export function buildExecutiveClarifyingQuestions(
  input: ExecutiveCoachingInput,
  context: ExecutiveCoachingContext
): readonly ExecutiveCoachingQuestion[] {
  const weakEvidence = input.reasoning.chain.nodes.filter((node) => node.evidenceReference.trim().length === 0);
  const questions: ExecutiveCoachingQuestion[] = [
    ...context.assumptionIds.map((assumptionId) =>
      Object.freeze({
        questionId: `question:assumption:${assumptionId}`,
        prompt: `What would change if ${assumptionId} is not true?`,
        sourceType: "assumption" as const,
        sourceId: assumptionId,
        coachingIntent: "Clarify assumption strength before relying on the plan.",
      })
    ),
    ...context.constraintIds.map((constraintId) =>
      Object.freeze({
        questionId: `question:constraint:${constraintId}`,
        prompt: `What makes ${constraintId} binding rather than flexible?`,
        sourceType: "constraint" as const,
        sourceId: constraintId,
        coachingIntent: "Clarify constraint certainty.",
      })
    ),
    ...weakEvidence.map((node) =>
      Object.freeze({
        questionId: `question:evidence:${node.id}`,
        prompt: `What evidence supports reasoning step ${node.id}?`,
        sourceType: "evidence" as const,
        sourceId: node.id,
        coachingIntent: "Clarify weak evidence.",
      })
    ),
    ...input.planning.goals.map((goal) =>
      Object.freeze({
        questionId: `question:goal:${goal.goalId}`,
        prompt: `What outcome would make ${goal.goalId} visibly complete?`,
        sourceType: "goal" as const,
        sourceId: goal.goalId,
        coachingIntent: "Clarify goal completion.",
      })
    ),
    ...input.planning.dependencies.map((dependency) =>
      Object.freeze({
        questionId: `question:dependency:${dependency.dependencyId}`,
        prompt: `What could break dependency ${dependency.dependencyId}?`,
        sourceType: "dependency" as const,
        sourceId: dependency.dependencyId,
        coachingIntent: "Clarify unresolved dependency fragility.",
      })
    ),
  ];

  return Object.freeze(questions.sort((left, right) => left.questionId.localeCompare(right.questionId)));
}
