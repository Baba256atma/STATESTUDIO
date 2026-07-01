import type {
  ExecutiveCauseEffectMap,
  ExecutiveDecisionMap,
  ExecutivePlanMap,
  ExecutiveTradeoffMap,
  ExecutiveVisualExplanation,
  ExecutiveVisualMap,
  ExecutiveVisualReasoningSession,
} from "./executiveVisualReasoningTypes.ts";

export function buildExecutiveVisualExplanation(
  session: ExecutiveVisualReasoningSession,
  executiveMap: ExecutiveVisualMap,
  causeEffectMap: ExecutiveCauseEffectMap,
  decisionMap: ExecutiveDecisionMap,
  tradeoffMap: ExecutiveTradeoffMap,
  planMap: ExecutivePlanMap
): ExecutiveVisualExplanation {
  const maps = Object.freeze([executiveMap, causeEffectMap, decisionMap, tradeoffMap, planMap] as const);
  const mapReasons = Object.freeze(maps.map((map) => `${map.mapId}: ${map.mapType} visual metadata exists for consumer rendering layers.`));
  const nodeReasons = Object.freeze(maps.flatMap((map) => map.nodes.map((node) => `${node.id}: ${node.explanation}`)).sort());
  const edgeReasons = Object.freeze(maps.flatMap((map) => map.edges.map((edge) => `${edge.id}: ${edge.explanation}`)).sort());
  const traceReferences = Object.freeze([
    session.reasoningSessionId,
    session.judgmentSessionId,
    session.planningSessionId,
    session.coachingSessionId,
    session.thoughtPartnerSessionId,
    ...maps.flatMap((map) => map.nodes.map((node) => node.sourceReference)),
    ...maps.flatMap((map) => map.edges.map((edge) => edge.sourceReference)),
  ].sort());

  return Object.freeze({
    explanationId: `visual-explanation:${session.sessionId}`,
    mapReasons,
    nodeReasons,
    edgeReasons,
    traceReferences,
    narrative: [...mapReasons, ...nodeReasons, ...edgeReasons].join(" "),
  });
}
