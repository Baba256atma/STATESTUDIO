import type { ExecutiveCauseEffectMap, ExecutiveVisualEdge, ExecutiveVisualNode, ExecutiveVisualReasoningInput } from "./executiveVisualReasoningTypes.ts";

export function buildExecutiveCauseEffectMap(input: ExecutiveVisualReasoningInput): ExecutiveCauseEffectMap {
  const nodes: ExecutiveVisualNode[] = input.reasoning.chain.nodes.map((node) =>
    Object.freeze({
      id: `visual:reasoning-node:${node.id}`,
      label: node.step,
      category: node.parentId === null ? "cause" as const : "effect" as const,
      sourceLayer: "LAY-2" as const,
      sourceReference: node.id,
      importance: node.parentId === null ? "high" as const : "medium" as const,
      explanation: node.explanation,
    })
  );
  const edges: ExecutiveVisualEdge[] = input.reasoning.chain.nodes
    .filter((node) => node.parentId !== null)
    .map((node) =>
      Object.freeze({
        id: `visual-edge:cause-effect:${node.parentId}:${node.id}`,
        from: `visual:reasoning-node:${node.parentId}`,
        to: `visual:reasoning-node:${node.id}`,
        relationshipType: "causes" as const,
        sourceReference: node.evidenceReference,
        explanation: `Reasoning step ${node.parentId} leads to ${node.id}.`,
      })
    );

  return Object.freeze({
    mapId: `visual-map:cause-effect:${input.reasoning.session.sessionId}`,
    mapType: "cause-effect" as const,
    nodes: Object.freeze(nodes.sort((left, right) => left.id.localeCompare(right.id))),
    edges: Object.freeze(edges.sort((left, right) => left.id.localeCompare(right.id))),
  });
}
