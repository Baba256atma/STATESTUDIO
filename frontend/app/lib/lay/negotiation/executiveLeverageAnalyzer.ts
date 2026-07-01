import type { ExecutiveLeveragePoint, ExecutiveNegotiationContext, ExecutiveNegotiationInput } from "./executiveNegotiationTypes.ts";

export function analyzeExecutiveLeverage(input: ExecutiveNegotiationInput, context: ExecutiveNegotiationContext): readonly ExecutiveLeveragePoint[] {
  const leverage: ExecutiveLeveragePoint[] = [
    ...input.reasoning.chain.nodes.slice(0, 2).map((node) =>
      Object.freeze({
        leverageId: `leverage:reasoning:${node.id}`,
        leverageType: "reasoning" as const,
        sourceReference: node.id,
        leverageStatement: node.explanation,
        explanation: "Reasoning structure can be used as negotiation context without choosing a path.",
      })
    ),
    ...input.judgment.judgment.risks.map((risk) =>
      Object.freeze({
        leverageId: `leverage:risk:${risk.id}`,
        leverageType: "risk" as const,
        sourceReference: risk.id,
        leverageStatement: risk.description,
        explanation: "Risk metadata can shape negotiation awareness as structured context only.",
      })
    ),
    ...input.judgment.judgment.opportunities.map((opportunity) =>
      Object.freeze({
        leverageId: `leverage:opportunity:${opportunity.id}`,
        leverageType: "opportunity" as const,
        sourceReference: opportunity.id,
        leverageStatement: opportunity.description,
        explanation: "Opportunity metadata can shape possible value framing.",
      })
    ),
    ...context.constraintIds.map((constraintId) =>
      Object.freeze({
        leverageId: `leverage:constraint:${constraintId}`,
        leverageType: "constraint" as const,
        sourceReference: constraintId,
        leverageStatement: `Constraint ${constraintId} shapes negotiation boundaries.`,
        explanation: "Constraint leverage is metadata-only and does not draft terms.",
      })
    ),
    Object.freeze({
      leverageId: `leverage:confidence:${input.judgment.judgment.confidence.level}`,
      leverageType: "confidence" as const,
      sourceReference: input.judgment.session.sessionId,
      leverageStatement: `Confidence level is ${input.judgment.judgment.confidence.level}.`,
      explanation: "Confidence metadata identifies uncertainty posture without scoring a negotiation.",
    }),
    ...context.goalIds.slice(0, 2).map((goalId) =>
      Object.freeze({
        leverageId: `leverage:plan:${goalId}`,
        leverageType: "plan" as const,
        sourceReference: goalId,
        leverageStatement: `Plan goal ${goalId} can anchor negotiation path metadata.`,
        explanation: "Plan leverage preserves traceability to logical goals without execution.",
      })
    ),
    ...context.audienceFrameIds.slice(0, 2).map((frameId) =>
      Object.freeze({
        leverageId: `leverage:communication:${frameId}`,
        leverageType: "communication" as const,
        sourceReference: frameId,
        leverageStatement: `Audience frame ${frameId} can shape communication posture.`,
        explanation: "Communication leverage stays metadata-only and sends no messages.",
      })
    ),
  ];

  return Object.freeze(leverage.sort((left, right) => left.leverageId.localeCompare(right.leverageId)));
}
