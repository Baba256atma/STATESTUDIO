import type { DomainScenario } from "../domain/domainScenarioTypes.ts";

function name(scenario: DomainScenario): string {
  return scenario.title || scenario.id;
}

export function buildScenarioComparisonTitle(params: {
  scenarioA: DomainScenario;
  scenarioB: DomainScenario;
}): string {
  const domain = params.scenarioA.domainId === params.scenarioB.domainId ? params.scenarioA.domainId.replace(/_/g, " ") : "strategic";
  return `${domain} scenario comparison`;
}

export function buildScenarioComparisonSummary(params: {
  scenarioA: DomainScenario;
  scenarioB: DomainScenario;
  recommendedScenarioId?: string;
  stabilityDelta: number;
  fragilityDelta: number;
  propagationDelta: number;
}): string {
  const recommended =
    params.recommendedScenarioId === params.scenarioB.id
      ? params.scenarioB
      : params.recommendedScenarioId === params.scenarioA.id
        ? params.scenarioA
        : null;
  if (!recommended) {
    return `${name(params.scenarioA)} and ${name(params.scenarioB)} are close alternatives; compare assumptions before choosing.`;
  }
  const improvesFragility = params.recommendedScenarioId === params.scenarioB.id ? params.fragilityDelta < 0 : params.fragilityDelta > 0;
  const improvesPropagation = params.recommendedScenarioId === params.scenarioB.id ? params.propagationDelta < 0 : params.propagationDelta > 0;
  const improvesStability = params.recommendedScenarioId === params.scenarioB.id ? params.stabilityDelta > 0 : params.stabilityDelta < 0;
  const reasons = [
    improvesStability ? "improving operating stability" : null,
    improvesFragility ? "reducing fragility pressure" : null,
    improvesPropagation ? "limiting propagation exposure" : null,
  ].filter(Boolean);
  const reason = reasons.length ? reasons.join(", ") : "carrying the stronger current score";
  return `${name(recommended)} is the stronger advisory option by ${reason}.`;
}
