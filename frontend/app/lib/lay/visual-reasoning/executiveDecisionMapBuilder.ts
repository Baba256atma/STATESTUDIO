import type { ExecutiveDecisionMap, ExecutiveVisualEdge, ExecutiveVisualNode, ExecutiveVisualReasoningInput } from "./executiveVisualReasoningTypes.ts";

export function buildExecutiveDecisionMap(input: ExecutiveVisualReasoningInput): ExecutiveDecisionMap {
  const confidenceNode: ExecutiveVisualNode = Object.freeze({
    id: `visual:confidence:${input.judgment.judgment.confidence.level}`,
    label: `Confidence: ${input.judgment.judgment.confidence.level}`,
    category: "confidence" as const,
    sourceLayer: "LAY-3" as const,
    sourceReference: input.judgment.session.sessionId,
    importance: input.judgment.judgment.confidence.level === "high" ? "high" as const : "medium" as const,
    explanation: input.judgment.judgment.confidence.justification,
  });
  const rationaleNode: ExecutiveVisualNode = Object.freeze({
    id: `visual:rationale:${input.judgment.rationale.rationaleId}`,
    label: "Executive rationale",
    category: "rationale" as const,
    sourceLayer: "LAY-3" as const,
    sourceReference: input.judgment.rationale.rationaleId,
    importance: "high" as const,
    explanation: input.judgment.rationale.narrative,
  });
  const nodes: ExecutiveVisualNode[] = [
    confidenceNode,
    rationaleNode,
    ...input.judgment.judgment.priorities.map((priority) =>
      Object.freeze({
        id: `visual:priority:${priority.id}`,
        label: `Priority ${priority.order}`,
        category: "priority" as const,
        sourceLayer: "LAY-3" as const,
        sourceReference: priority.id,
        importance: priority.order === 1 ? "high" as const : "medium" as const,
        explanation: priority.justification,
      })
    ),
    ...input.judgment.judgment.alternativeEvaluations.map((alternative) =>
      Object.freeze({
        id: `visual:alternative:${alternative.alternativeId}`,
        label: alternative.pathLabel,
        category: "alternative" as const,
        sourceLayer: "LAY-3" as const,
        sourceReference: alternative.alternativeId,
        importance: alternative.judgment === "high" ? "high" as const : "medium" as const,
        explanation: alternative.justification,
      })
    ),
  ];
  const edges: ExecutiveVisualEdge[] = [
    ...input.judgment.judgment.priorities.map((priority) =>
      Object.freeze({
        id: `visual-edge:priority-rationale:${priority.id}`,
        from: `visual:priority:${priority.id}`,
        to: rationaleNode.id,
        relationshipType: "supports" as const,
        sourceReference: priority.id,
        explanation: `Priority ${priority.id} supports the rationale.`,
      })
    ),
    ...input.judgment.judgment.alternativeEvaluations.map((alternative) =>
      Object.freeze({
        id: `visual-edge:alternative-confidence:${alternative.alternativeId}`,
        from: `visual:alternative:${alternative.alternativeId}`,
        to: confidenceNode.id,
        relationshipType: "mapsTo" as const,
        sourceReference: alternative.alternativeId,
        explanation: `Alternative ${alternative.alternativeId} contributes to confidence metadata.`,
      })
    ),
  ];

  return Object.freeze({
    mapId: `visual-map:decision:${input.judgment.session.sessionId}`,
    mapType: "decision" as const,
    nodes: Object.freeze(nodes.sort((left, right) => left.id.localeCompare(right.id))),
    edges: Object.freeze(edges.sort((left, right) => left.id.localeCompare(right.id))),
  });
}
