import type { ExecutiveCreativityContext, ExecutiveReframe } from "./executiveCreativityTypes.ts";

function reframe(sourceType: ExecutiveReframe["sourceType"], sourceReference: string, text: string): ExecutiveReframe {
  return Object.freeze({
    reframeId: `reframe:${sourceType}:${sourceReference}`,
    sourceType,
    sourceReference,
    reframe: text,
    explanation: `Reframe exists because ${sourceReference} can be viewed as creative input rather than a fixed conclusion.`,
  });
}

export function buildExecutiveReframes(context: ExecutiveCreativityContext): readonly ExecutiveReframe[] {
  return Object.freeze([
    ...context.assumptionIds.map((id) => reframe("assumption", id, `Treat ${id} as a variable to explore.`)),
    ...context.constraintIds.map((id) => reframe("constraint", id, `Treat ${id} as a design boundary.`)),
    ...context.tensionIds.map((id) => reframe("tension", id, `Use ${id} as a source of new strategic contrast.`)),
    ...context.blindSpotIds.map((id) => reframe("blindSpot", id, `Use ${id} to search for missing context.`)),
    ...context.riskIds.map((id) => reframe("risk", id, `Treat ${id} as a signal for resilient options.`)),
    ...context.opportunityIds.map((id) => reframe("opportunity", id, `Expand ${id} into possible value paths.`)),
    ...context.conflictZoneIds.map((id) => reframe("conflict", id, `Treat ${id} as a creative alignment question.`)),
    ...context.weakAlternativeIds.map((id) => reframe("alternative", id, `Rework ${id} instead of selecting it.`)),
  ].sort((left, right) => left.reframeId.localeCompare(right.reframeId)));
}
