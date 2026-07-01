import type { ExecutiveCreativityContext, ExecutiveOpportunityIdea } from "./executiveCreativityTypes.ts";

export function discoverExecutiveOpportunities(context: ExecutiveCreativityContext): readonly ExecutiveOpportunityIdea[] {
  const sources = [...context.opportunityIds, ...context.riskIds, ...context.blindSpotIds, ...context.tensionIds].sort();
  return Object.freeze(
    sources.slice(0, Math.max(3, Math.min(8, sources.length))).map((source) =>
      Object.freeze({
        opportunityIdeaId: `opportunity-idea:${source}`,
        sourceReference: source,
        idea: `Explore value hidden in ${source}.`,
        domainSpecific: false as const,
        explanation: "Opportunity idea is generic executive metadata for broad downstream use.",
      })
    ).sort((left, right) => left.opportunityIdeaId.localeCompare(right.opportunityIdeaId))
  );
}
