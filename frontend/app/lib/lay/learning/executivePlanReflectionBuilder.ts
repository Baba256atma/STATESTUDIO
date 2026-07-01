import type { ExecutiveLearningInput, ExecutivePlanReflection } from "./executiveLearningTypes.ts";

export function buildExecutivePlanReflection(input: ExecutiveLearningInput): ExecutivePlanReflection {
  return Object.freeze({
    reflectionId: `plan-reflection:${input.planning.session.sessionId}`,
    goalCount: input.planning.goals.length,
    milestoneCount: input.planning.milestones.length,
    dependencyCount: input.planning.dependencies.length,
    sourceReferences: Object.freeze([
      input.planning.session.sessionId,
      ...input.planning.goals.map((goal) => goal.goalId),
      ...input.planning.milestones.map((milestone) => milestone.milestoneId),
      ...input.planning.dependencies.map((dependency) => dependency.dependencyId),
    ].sort()),
    explanation: "Plan reflection summarizes planning quality signals as metadata only.",
  });
}
