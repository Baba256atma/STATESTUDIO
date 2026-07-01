import type { ExecutiveTensionMap, ExecutiveThoughtPartnerInput } from "./executiveThoughtPartnerTypes.ts";

export function buildExecutiveTensionMap(input: ExecutiveThoughtPartnerInput): readonly ExecutiveTensionMap[] {
  const sourceReference = input.reasoning.components.tradeoffs[0]?.id ?? input.judgment.session.sessionId;
  const phaseDependency = input.planning.dependencies.find((dependency) => dependency.dependencyType === "phase-to-phase")?.dependencyId ?? input.planning.session.sessionId;
  const riskReference = input.judgment.judgment.risks[0]?.id ?? input.judgment.session.sessionId;
  const opportunityReference = input.judgment.judgment.opportunities[0]?.id ?? input.judgment.session.sessionId;

  return Object.freeze([
    Object.freeze({
      tensionId: "tension:speed-vs-accuracy",
      tensionName: "speed-vs-accuracy" as const,
      leftPole: "speed",
      rightPole: "accuracy",
      sourceReference: phaseDependency,
      traceReferences: Object.freeze([phaseDependency, input.planning.session.sessionId]),
    }),
    Object.freeze({
      tensionId: "tension:cost-vs-quality",
      tensionName: "cost-vs-quality" as const,
      leftPole: "cost",
      rightPole: "quality",
      sourceReference,
      traceReferences: Object.freeze([sourceReference, input.reasoning.session.sessionId]),
    }),
    Object.freeze({
      tensionId: "tension:risk-vs-opportunity",
      tensionName: "risk-vs-opportunity" as const,
      leftPole: "risk",
      rightPole: "opportunity",
      sourceReference: riskReference,
      traceReferences: Object.freeze([riskReference, opportunityReference]),
    }),
    Object.freeze({
      tensionId: "tension:short-term-vs-long-term",
      tensionName: "short-term-vs-long-term" as const,
      leftPole: "short-term",
      rightPole: "long-term",
      sourceReference: input.planning.timeline.timelineId,
      traceReferences: Object.freeze([input.planning.timeline.timelineId, input.planning.session.sessionId]),
    }),
    Object.freeze({
      tensionId: "tension:control-vs-flexibility",
      tensionName: "control-vs-flexibility" as const,
      leftPole: "control",
      rightPole: "flexibility",
      sourceReference: input.reasoning.components.constraints[0]?.id ?? input.reasoning.session.sessionId,
      traceReferences: Object.freeze([input.reasoning.components.constraints[0]?.id ?? input.reasoning.session.sessionId]),
    }),
    Object.freeze({
      tensionId: "tension:growth-vs-stability",
      tensionName: "growth-vs-stability" as const,
      leftPole: "growth",
      rightPole: "stability",
      sourceReference: input.coaching.blindSpots[0]?.blindSpotId ?? input.coaching.session.sessionId,
      traceReferences: Object.freeze([input.coaching.blindSpots[0]?.blindSpotId ?? input.coaching.session.sessionId]),
    }),
  ].sort((left, right) => left.tensionId.localeCompare(right.tensionId)));
}
