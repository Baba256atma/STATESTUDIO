import type { ExecutiveCoachingContext, ExecutiveCoachingInput } from "./executiveCoachingTypes.ts";

function sorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...values].sort());
}

export function normalizeExecutiveCoachingContext(input: ExecutiveCoachingInput): ExecutiveCoachingContext {
  const session = Object.freeze({
    sessionId: input.sessionId.trim(),
    phase: "LAY-5" as const,
    reasoningSessionId: input.reasoning.session.sessionId,
    judgmentSessionId: input.judgment.session.sessionId,
    planningSessionId: input.planning.session.sessionId,
  });
  const assumptionIds = sorted(input.reasoning.components.assumptions.map((assumption) => assumption.id));
  const constraintIds = sorted(input.reasoning.components.constraints.map((constraint) => constraint.id));
  const priorityIds = sorted(input.judgment.judgment.priorities.map((priority) => priority.id));
  const goalIds = sorted(input.planning.goals.map((goal) => goal.goalId));
  const milestoneIds = sorted(input.planning.milestones.map((milestone) => milestone.milestoneId));
  const dependencyIds = sorted(input.planning.dependencies.map((dependency) => dependency.dependencyId));

  return Object.freeze({
    session,
    assumptionIds,
    constraintIds,
    priorityIds,
    confidenceLevel: input.judgment.judgment.confidence.level,
    goalIds,
    milestoneIds,
    dependencyIds,
    traceReferences: sorted([
      input.reasoning.session.sessionId,
      input.judgment.session.sessionId,
      input.planning.session.sessionId,
      ...assumptionIds,
      ...constraintIds,
      ...priorityIds,
      ...goalIds,
      ...milestoneIds,
      ...dependencyIds,
    ]),
  });
}
