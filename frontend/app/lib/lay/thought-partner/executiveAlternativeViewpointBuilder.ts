import type { ExecutiveAlternativeViewpoint, ExecutiveThoughtPartnerInput } from "./executiveThoughtPartnerTypes.ts";

export function buildExecutiveAlternativeViewpoints(input: ExecutiveThoughtPartnerInput): readonly ExecutiveAlternativeViewpoint[] {
  const alternativeViewpoints: ExecutiveAlternativeViewpoint[] = [
    ...input.reasoning.components.alternatives.map((alternative) =>
      Object.freeze({
        viewpointId: `viewpoint:reasoning:${alternative.id}`,
        viewpoint: alternative.pathLabel,
        whyItMatters: alternative.explanation,
        supportingSource: alternative.id,
        opposingSource: input.reasoning.components.tradeoffs[0]?.id ?? null,
        uncertaintyNote: "Reasoning alternatives are conversation positions, not recommendations.",
      })
    ),
    ...input.judgment.judgment.priorities.map((priority) =>
      Object.freeze({
        viewpointId: `viewpoint:priority:${priority.id}`,
        viewpoint: `View the situation through priority ${priority.id}.`,
        whyItMatters: priority.justification,
        supportingSource: priority.id,
        opposingSource: input.judgment.judgment.risks[0]?.id ?? null,
        uncertaintyNote: "Priority framing may shift if assumptions or constraints change.",
      })
    ),
    ...input.coaching.blindSpots.map((blindSpot) =>
      Object.freeze({
        viewpointId: `viewpoint:blind-spot:${blindSpot.blindSpotId}`,
        viewpoint: `View the situation from the ${blindSpot.category} blind spot.`,
        whyItMatters: blindSpot.description,
        supportingSource: blindSpot.blindSpotId,
        opposingSource: null,
        uncertaintyNote: "Blind spot viewpoints expose missing context rather than resolve it.",
      })
    ),
  ];

  return Object.freeze(alternativeViewpoints.sort((left, right) => left.viewpointId.localeCompare(right.viewpointId)));
}
