import type { ExecutiveCommunicationContext, ExecutiveCommunicationInput, ExecutiveRiskCommunication } from "./executiveCommunicationTypes.ts";

export function buildExecutiveRiskCommunication(
  input: ExecutiveCommunicationInput,
  context: ExecutiveCommunicationContext
): ExecutiveRiskCommunication {
  return Object.freeze({
    riskCommunicationId: `risk-communication:${context.session.sessionId}`,
    riskStatements: Object.freeze(input.judgment.judgment.risks.map((risk) => `${risk.id}: ${risk.description}`).sort()),
    opportunityBalance: Object.freeze(input.judgment.judgment.opportunities.map((opportunity) => `${opportunity.id}: ${opportunity.description}`).sort()),
    blindSpotNotes: Object.freeze(input.coaching.blindSpots.map((blindSpot) => `${blindSpot.blindSpotId}: ${blindSpot.description}`).sort()),
    sourceReferences: Object.freeze([
      ...context.riskIds,
      ...context.opportunityIds,
      ...context.blindSpotIds,
      input.visualReasoning.tradeoffMap.mapId,
    ].sort()),
    explanation: "Risk communication exists to preserve risk, opportunity, and blind spot metadata for downstream briefings.",
  });
}
