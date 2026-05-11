import type { DomainScenario } from "./domainScenarioTypes.ts";

export function deriveScenarioHighlightHints(params: {
  scenario: DomainScenario;
}): {
  highlightedObjectIds: string[];
  highlightedEdgeIds?: string[];
} {
  const highlightedObjectIds = Array.from(new Set(params.scenario.relatedObjectIds)).filter(Boolean);
  const highlightedEdgeIds = Array.isArray(params.scenario.metadata?.relatedEdgeIds)
    ? params.scenario.metadata.relatedEdgeIds.map(String).filter(Boolean)
    : undefined;

  return {
    highlightedObjectIds,
    highlightedEdgeIds,
  };
}
