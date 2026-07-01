import type { ExecutiveDependency, ExecutiveGoal, ExecutiveMilestone, ExecutivePhase } from "./executivePlanningTypes.ts";

export function buildExecutiveDependencies(
  goals: readonly ExecutiveGoal[],
  milestones: readonly ExecutiveMilestone[],
  phases: readonly ExecutivePhase[]
): readonly ExecutiveDependency[] {
  const goalDependencies = goals.map((goal) =>
    Object.freeze({
      dependencyId: `dependency:${goal.goalId}:first-milestone`,
      fromId: goal.goalId,
      toId: `milestone:${goal.goalId}:define`,
      dependencyType: "goal-to-milestone" as const,
      explanation: `${goal.goalId} starts with its definition milestone.`,
    })
  );
  const milestoneDependencies = goals.map((goal) =>
    Object.freeze({
      dependencyId: `dependency:${goal.goalId}:define-to-align`,
      fromId: `milestone:${goal.goalId}:define`,
      toId: `milestone:${goal.goalId}:align`,
      dependencyType: "milestone-to-milestone" as const,
      explanation: `Definition precedes alignment for ${goal.goalId}.`,
    })
  );
  const phaseDependencies = phases.slice(1).map((phase, index) =>
    Object.freeze({
      dependencyId: `dependency:${phases[index].phaseId}:${phase.phaseId}`,
      fromId: phases[index].phaseId,
      toId: phase.phaseId,
      dependencyType: "phase-to-phase" as const,
      explanation: `${phases[index].phaseId} logically precedes ${phase.phaseId}.`,
    })
  );
  const knownIds = new Set([
    ...goals.map((goal) => goal.goalId),
    ...milestones.map((milestone) => milestone.milestoneId),
    ...phases.map((phase) => phase.phaseId),
  ]);

  return Object.freeze(
    [...goalDependencies, ...milestoneDependencies, ...phaseDependencies]
      .filter((dependency) => knownIds.has(dependency.fromId) && knownIds.has(dependency.toId))
      .sort((left, right) => left.dependencyId.localeCompare(right.dependencyId))
  );
}
