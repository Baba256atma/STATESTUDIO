import type { ExecutiveConcessionCandidate, ExecutiveLeveragePoint, ExecutiveNegotiationContext } from "./executiveNegotiationTypes.ts";

export function mapExecutiveConcessions(
  leveragePoints: readonly ExecutiveLeveragePoint[],
  context: ExecutiveNegotiationContext
): readonly ExecutiveConcessionCandidate[] {
  return Object.freeze(
    leveragePoints.slice(0, Math.max(3, Math.min(6, leveragePoints.length))).map((leverage) =>
      Object.freeze({
        concessionId: `concession:${leverage.leverageId}`,
        candidate: `Possible concession candidate around ${leverage.sourceReference}`,
        boundary: context.constraintIds[0] ?? context.session.reasoningSessionId,
        sourceReference: leverage.leverageId,
        explanation: "Concession candidate is identified for analysis only and is not a recommendation.",
      })
    ).sort((left, right) => left.concessionId.localeCompare(right.concessionId))
  );
}
