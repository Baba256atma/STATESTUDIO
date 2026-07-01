import type { ExecutiveTradeoffMap, ExecutiveVisualEdge, ExecutiveVisualNode, ExecutiveVisualReasoningInput } from "./executiveVisualReasoningTypes.ts";

export function buildExecutiveTradeoffMap(input: ExecutiveVisualReasoningInput): ExecutiveTradeoffMap {
  const nodes: ExecutiveVisualNode[] = [
    ...input.reasoning.components.tradeoffs.map((tradeoff) =>
      Object.freeze({
        id: `visual:tradeoff:${tradeoff.id}`,
        label: `${tradeoff.left} vs ${tradeoff.right}`,
        category: "tradeoff" as const,
        sourceLayer: "LAY-2" as const,
        sourceReference: tradeoff.id,
        importance: "high" as const,
        explanation: tradeoff.tension,
      })
    ),
    ...input.reasoning.components.constraints.map((constraint) =>
      Object.freeze({
        id: `visual:constraint:${constraint.id}`,
        label: constraint.statement,
        category: "constraint" as const,
        sourceLayer: "LAY-2" as const,
        sourceReference: constraint.id,
        importance: "medium" as const,
        explanation: constraint.consequence,
      })
    ),
    ...input.judgment.judgment.risks.map((risk) =>
      Object.freeze({
        id: `visual:risk:${risk.id}`,
        label: risk.description,
        category: "risk" as const,
        sourceLayer: "LAY-3" as const,
        sourceReference: risk.id,
        importance: "medium" as const,
        explanation: risk.evidenceReference,
      })
    ),
    ...input.judgment.judgment.opportunities.map((opportunity) =>
      Object.freeze({
        id: `visual:opportunity:${opportunity.id}`,
        label: opportunity.description,
        category: "opportunity" as const,
        sourceLayer: "LAY-3" as const,
        sourceReference: opportunity.id,
        importance: "medium" as const,
        explanation: opportunity.evidenceReference,
      })
    ),
    ...input.thoughtPartner.tensionMap.map((tension) =>
      Object.freeze({
        id: `visual:tension:${tension.tensionId}`,
        label: `${tension.leftPole} vs ${tension.rightPole}`,
        category: "tension" as const,
        sourceLayer: "LAY-6" as const,
        sourceReference: tension.tensionId,
        importance: "high" as const,
        explanation: `Tension ${tension.tensionName} is traceable to ${tension.sourceReference}.`,
      })
    ),
  ];
  const edges: ExecutiveVisualEdge[] = [
    ...input.thoughtPartner.tensionMap.map((tension) =>
      Object.freeze({
        id: `visual-edge:tension-source:${tension.tensionId}`,
        from: `visual:tension:${tension.tensionId}`,
        to: input.reasoning.components.tradeoffs[0] ? `visual:tradeoff:${input.reasoning.components.tradeoffs[0].id}` : `visual:tension:${tension.tensionId}`,
        relationshipType: "balances" as const,
        sourceReference: tension.sourceReference,
        explanation: `Tension ${tension.tensionId} balances executive poles.`,
      })
    ),
  ];

  return Object.freeze({
    mapId: `visual-map:tradeoff:${input.reasoning.session.sessionId}`,
    mapType: "tradeoff" as const,
    nodes: Object.freeze(nodes.sort((left, right) => left.id.localeCompare(right.id))),
    edges: Object.freeze(edges.sort((left, right) => left.id.localeCompare(right.id))),
  });
}
