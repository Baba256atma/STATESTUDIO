import type {
  ExecutiveVisualEdge,
  ExecutiveVisualMap,
  ExecutiveVisualNode,
  ExecutiveVisualReasoningContext,
  ExecutiveVisualReasoningInput,
} from "./executiveVisualReasoningTypes.ts";

export function buildExecutiveVisualMap(
  input: ExecutiveVisualReasoningInput,
  context: ExecutiveVisualReasoningContext
): ExecutiveVisualMap {
  const nodes: ExecutiveVisualNode[] = [
    ...context.reasoningNodeIds.map((nodeId) =>
      Object.freeze({
        id: `visual:executive:reasoning:${nodeId}`,
        label: nodeId,
        category: "reasoning" as const,
        sourceLayer: "LAY-2" as const,
        sourceReference: nodeId,
        importance: "medium" as const,
        explanation: `Reasoning node ${nodeId} participates in the executive map.`,
      })
    ),
    ...context.priorityIds.map((priorityId) =>
      Object.freeze({
        id: `visual:executive:priority:${priorityId}`,
        label: priorityId,
        category: "priority" as const,
        sourceLayer: "LAY-3" as const,
        sourceReference: priorityId,
        importance: "high" as const,
        explanation: `Priority ${priorityId} anchors decision visual metadata.`,
      })
    ),
    ...context.goalIds.map((goalId) =>
      Object.freeze({
        id: `visual:executive:goal:${goalId}`,
        label: goalId,
        category: "goal" as const,
        sourceLayer: "LAY-4" as const,
        sourceReference: goalId,
        importance: "medium" as const,
        explanation: `Goal ${goalId} anchors plan visual metadata.`,
      })
    ),
    ...context.blindSpotIds.map((blindSpotId) =>
      Object.freeze({
        id: `visual:executive:blind-spot:${blindSpotId}`,
        label: blindSpotId,
        category: "blindSpot" as const,
        sourceLayer: "LAY-5" as const,
        sourceReference: blindSpotId,
        importance: "medium" as const,
        explanation: `Blind spot ${blindSpotId} adds coaching context.`,
      })
    ),
    ...context.counterpointIds.map((counterpointId) =>
      Object.freeze({
        id: `visual:executive:counterpoint:${counterpointId}`,
        label: counterpointId,
        category: "counterpoint" as const,
        sourceLayer: "LAY-6" as const,
        sourceReference: counterpointId,
        importance: "medium" as const,
        explanation: `Counterpoint ${counterpointId} adds thought-partner context.`,
      })
    ),
  ];
  const edges: ExecutiveVisualEdge[] = [
    ...context.priorityIds.map((priorityId, index) =>
      Object.freeze({
        id: `visual-edge:executive:reasoning-priority:${priorityId}`,
        from: `visual:executive:reasoning:${context.reasoningNodeIds[index % context.reasoningNodeIds.length]}`,
        to: `visual:executive:priority:${priorityId}`,
        relationshipType: "supports" as const,
        sourceReference: priorityId,
        explanation: `Reasoning context supports priority ${priorityId}.`,
      })
    ),
    ...input.planning.goals.map((goal) =>
      Object.freeze({
        id: `visual-edge:executive:priority-goal:${goal.goalId}`,
        from: `visual:executive:priority:${goal.sourceJudgmentId}`,
        to: `visual:executive:goal:${goal.goalId}`,
        relationshipType: "mapsTo" as const,
        sourceReference: goal.sourceJudgmentId,
        explanation: `Priority ${goal.sourceJudgmentId} maps to goal ${goal.goalId}.`,
      })
    ),
    ...(context.blindSpotIds.length > 0 ? context.counterpointIds.map((counterpointId, index) =>
      Object.freeze({
        id: `visual-edge:executive:blind-spot-counterpoint:${counterpointId}`,
        from: `visual:executive:blind-spot:${context.blindSpotIds[index % context.blindSpotIds.length]}`,
        to: `visual:executive:counterpoint:${counterpointId}`,
        relationshipType: "questions" as const,
        sourceReference: counterpointId,
        explanation: `Coaching blind spots and thought-partner counterpoints are visually linked.`,
      })
    ) : []),
  ];

  return Object.freeze({
    mapId: `visual-map:executive:${context.session.sessionId}`,
    mapType: "executive" as const,
    nodes: Object.freeze(nodes.sort((left, right) => left.id.localeCompare(right.id))),
    edges: Object.freeze(edges.sort((left, right) => left.id.localeCompare(right.id))),
  });
}
