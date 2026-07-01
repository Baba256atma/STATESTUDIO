import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutiveGoal, ExecutivePhase, ExecutiveResource } from "./executivePlanningTypes.ts";

export function buildExecutiveGoals(judgment: ExecutiveJudgmentResult): readonly ExecutiveGoal[] {
  return Object.freeze(
    judgment.judgment.priorities.map((priority) =>
      Object.freeze({
        goalId: `goal:${priority.subjectId}`,
        label: `Structure execution strategy for ${priority.subjectId}`,
        sourceJudgmentId: priority.id,
        priorityOrder: priority.order,
        rationaleReference: judgment.rationale.rationaleId,
      })
    )
  );
}

export function buildExecutivePhases(goals: readonly ExecutiveGoal[]): readonly ExecutivePhase[] {
  return Object.freeze(
    goals.map((goal) =>
      Object.freeze({
        phaseId: `phase:${goal.goalId}`,
        label: `Logical phase for ${goal.label}`,
        logicalOrder: goal.priorityOrder,
        milestoneIds: Object.freeze([`milestone:${goal.goalId}:define`, `milestone:${goal.goalId}:align`]),
        sourceJudgmentId: goal.sourceJudgmentId,
      })
    )
  );
}

export function buildExecutiveResources(goals: readonly ExecutiveGoal[]): readonly ExecutiveResource[] {
  return Object.freeze(
    goals.flatMap((goal) => [
      Object.freeze({
        resourceId: `resource:${goal.goalId}:attention`,
        label: `Executive attention for ${goal.goalId}`,
        resourceType: "attention" as const,
        linkedGoalId: goal.goalId,
        allocationMode: "logical-only" as const,
      }),
      Object.freeze({
        resourceId: `resource:${goal.goalId}:coordination`,
        label: `Coordination structure for ${goal.goalId}`,
        resourceType: "coordination" as const,
        linkedGoalId: goal.goalId,
        allocationMode: "logical-only" as const,
      }),
    ])
  );
}
