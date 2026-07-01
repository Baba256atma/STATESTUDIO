import type { ExecutiveGoal, ExecutiveMilestone } from "./executivePlanningTypes.ts";

export function buildExecutiveMilestones(goals: readonly ExecutiveGoal[]): readonly ExecutiveMilestone[] {
  return Object.freeze(
    goals.flatMap((goal) => [
      Object.freeze({
        milestoneId: `milestone:${goal.goalId}:define`,
        goalId: goal.goalId,
        label: `Define strategic intent for ${goal.goalId}`,
        logicalOrder: goal.priorityOrder * 2 - 1,
        sourceJudgmentId: goal.sourceJudgmentId,
      }),
      Object.freeze({
        milestoneId: `milestone:${goal.goalId}:align`,
        goalId: goal.goalId,
        label: `Align dependencies and resources for ${goal.goalId}`,
        logicalOrder: goal.priorityOrder * 2,
        sourceJudgmentId: goal.sourceJudgmentId,
      }),
    ])
  );
}
