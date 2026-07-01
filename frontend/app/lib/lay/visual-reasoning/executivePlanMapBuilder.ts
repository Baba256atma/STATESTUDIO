import type { ExecutivePlanMap, ExecutiveVisualEdge, ExecutiveVisualNode, ExecutiveVisualReasoningInput } from "./executiveVisualReasoningTypes.ts";

export function buildExecutivePlanMap(input: ExecutiveVisualReasoningInput): ExecutivePlanMap {
  const nodes: ExecutiveVisualNode[] = [
    ...input.planning.goals.map((goal) =>
      Object.freeze({
        id: `visual:goal:${goal.goalId}`,
        label: goal.label,
        category: "goal" as const,
        sourceLayer: "LAY-4" as const,
        sourceReference: goal.goalId,
        importance: goal.priorityOrder === 1 ? "high" as const : "medium" as const,
        explanation: `Goal traces to ${goal.sourceJudgmentId}.`,
      })
    ),
    ...input.planning.milestones.map((milestone) =>
      Object.freeze({
        id: `visual:milestone:${milestone.milestoneId}`,
        label: milestone.label,
        category: "milestone" as const,
        sourceLayer: "LAY-4" as const,
        sourceReference: milestone.milestoneId,
        importance: "medium" as const,
        explanation: `Milestone order ${milestone.logicalOrder} traces to ${milestone.sourceJudgmentId}.`,
      })
    ),
    ...input.planning.phases.map((phase) =>
      Object.freeze({
        id: `visual:phase:${phase.phaseId}`,
        label: phase.label,
        category: "phase" as const,
        sourceLayer: "LAY-4" as const,
        sourceReference: phase.phaseId,
        importance: phase.logicalOrder === 1 ? "high" as const : "medium" as const,
        explanation: `Phase order ${phase.logicalOrder} contains ${phase.milestoneIds.length} milestones.`,
      })
    ),
    ...input.planning.dependencies.map((dependency) =>
      Object.freeze({
        id: `visual:dependency:${dependency.dependencyId}`,
        label: dependency.dependencyType,
        category: "dependency" as const,
        sourceLayer: "LAY-4" as const,
        sourceReference: dependency.dependencyId,
        importance: dependency.dependencyType === "phase-to-phase" ? "high" as const : "medium" as const,
        explanation: dependency.explanation,
      })
    ),
  ];
  const edges: ExecutiveVisualEdge[] = input.planning.dependencies.map((dependency) =>
    Object.freeze({
      id: `visual-edge:plan:${dependency.dependencyId}`,
      from: nodeIdForPlanReference(dependency.fromId),
      to: nodeIdForPlanReference(dependency.toId),
      relationshipType: dependency.dependencyType === "phase-to-phase" ? "sequences" as const : "dependsOn" as const,
      sourceReference: dependency.dependencyId,
      explanation: dependency.explanation,
    })
  );

  return Object.freeze({
    mapId: `visual-map:plan:${input.planning.session.sessionId}`,
    mapType: "plan" as const,
    nodes: Object.freeze(nodes.sort((left, right) => left.id.localeCompare(right.id))),
    edges: Object.freeze(edges.sort((left, right) => left.id.localeCompare(right.id))),
  });
}

function nodeIdForPlanReference(reference: string): string {
  if (reference.startsWith("goal:")) {
    return `visual:goal:${reference}`;
  }
  if (reference.startsWith("milestone:")) {
    return `visual:milestone:${reference}`;
  }
  if (reference.startsWith("phase:")) {
    return `visual:phase:${reference}`;
  }
  return `visual:dependency:${reference}`;
}
