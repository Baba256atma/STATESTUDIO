import type { DomainScenario } from "./domainScenarioTypes.ts";

export type DomainScenarioOverlayState = {
  scenarioSummaries: Array<{
    scenarioId: string;
    title: string;
    severity: DomainScenario["severity"];
    confidence: number;
    recommendedFocus?: string;
  }>;
  objectHighlights: Record<string, {
    scenarioIds: string[];
    highestSeverity: DomainScenario["severity"];
  }>;
};

function severityRank(severity: DomainScenario["severity"]): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

export function buildDomainScenarioOverlayState(params: {
  scenarios: DomainScenario[];
}): DomainScenarioOverlayState {
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
  const objectHighlights: DomainScenarioOverlayState["objectHighlights"] = {};

  for (const scenario of scenarios) {
    const affectedObjectIds = Array.from(new Set([...(scenario.affectedObjectIds ?? []), ...scenario.relatedObjectIds]));
    for (const objectId of affectedObjectIds) {
      const current = objectHighlights[objectId];
      objectHighlights[objectId] = {
        scenarioIds: Array.from(new Set([...(current?.scenarioIds ?? []), scenario.id])),
        highestSeverity: current && severityRank(current.highestSeverity) > severityRank(scenario.severity)
          ? current.highestSeverity
          : scenario.severity,
      };
    }
  }

  return {
    scenarioSummaries: scenarios.map((scenario) => ({
      scenarioId: scenario.id,
      title: scenario.title,
      severity: scenario.severity,
      confidence: scenario.confidence,
      recommendedFocus: scenario.recommendedFocus,
    })),
    objectHighlights,
  };
}
