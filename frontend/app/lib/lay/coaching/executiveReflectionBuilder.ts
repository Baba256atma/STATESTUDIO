import type {
  ExecutiveCoachingContext,
  ExecutiveCoachingInput,
  ExecutiveDecisionQualityPrompt,
  ExecutivePlanReviewPrompt,
  ExecutiveReflectionPrompt,
} from "./executiveCoachingTypes.ts";

export function buildExecutiveReflectionPrompts(context: ExecutiveCoachingContext): readonly ExecutiveReflectionPrompt[] {
  return Object.freeze(
    context.assumptionIds.map((assumptionId) =>
      Object.freeze({
        promptId: `reflection:${assumptionId}`,
        prompt: `Reflect on how ${assumptionId} shapes the judgment and plan.`,
        sourceId: assumptionId,
        traceReference: assumptionId,
      })
    )
  );
}

export function buildExecutiveDecisionQualityPrompts(input: ExecutiveCoachingInput): readonly ExecutiveDecisionQualityPrompt[] {
  return Object.freeze(
    input.judgment.judgment.priorities.map((priority) =>
      Object.freeze({
        promptId: `decision-quality:${priority.id}`,
        prompt: `What evidence would improve confidence in priority ${priority.id}?`,
        sourceId: priority.id,
        traceReference: input.judgment.session.sessionId,
      })
    )
  );
}

export function buildExecutivePlanReviewPrompts(input: ExecutiveCoachingInput): readonly ExecutivePlanReviewPrompt[] {
  return Object.freeze(
    input.planning.goals.map((goal) =>
      Object.freeze({
        promptId: `plan-review:${goal.goalId}`,
        prompt: `Which dependency or milestone could weaken goal ${goal.goalId}?`,
        sourceId: goal.goalId,
        traceReference: input.planning.session.sessionId,
      })
    )
  );
}
