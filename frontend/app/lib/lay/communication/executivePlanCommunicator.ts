import type { ExecutiveCommunicationContext, ExecutiveCommunicationInput, ExecutivePlanCommunication } from "./executiveCommunicationTypes.ts";

export function buildExecutivePlanCommunication(
  input: ExecutiveCommunicationInput,
  context: ExecutiveCommunicationContext
): ExecutivePlanCommunication {
  return Object.freeze({
    planCommunicationId: `plan-communication:${context.session.sessionId}`,
    goalMessages: Object.freeze(input.planning.goals.map((goal) => `${goal.goalId}: ${goal.label}`).sort()),
    milestoneMessages: Object.freeze(input.planning.milestones.map((milestone) => `${milestone.milestoneId}: ${milestone.label}`).sort()),
    dependencyMessages: Object.freeze(input.planning.dependencies.map((dependency) => `${dependency.dependencyId}: ${dependency.explanation}`).sort()),
    sourceReferences: Object.freeze([
      input.planning.session.sessionId,
      input.visualReasoning.planMap.mapId,
      ...context.goalIds,
    ].sort()),
    explanation: "Plan communication exists to communicate logical plan metadata without scheduling or workflow execution.",
  });
}
