import type { DomainScenario } from "../domain/domainScenarioTypes.ts";

function scenarioName(scenario: DomainScenario): string {
  return scenario.title || scenario.id;
}

function addUnique(items: string[], item: string): void {
  if (!items.includes(item)) items.push(item);
}

export function deriveScenarioTradeoffs(params: {
  scenarioA: DomainScenario;
  scenarioB: DomainScenario;
  stabilityDelta: number;
  fragilityDelta: number;
  propagationDelta: number;
  confidenceDelta: number;
}): string[] {
  const tradeoffs: string[] = [];
  const a = scenarioName(params.scenarioA);
  const b = scenarioName(params.scenarioB);

  if (params.stabilityDelta >= 8) addUnique(tradeoffs, `${b} improves operating stability versus ${a}.`);
  if (params.stabilityDelta <= -8) addUnique(tradeoffs, `${a} preserves stronger operating stability than ${b}.`);
  if (params.fragilityDelta <= -8) addUnique(tradeoffs, `${b} reduces fragility pressure across affected objects.`);
  if (params.fragilityDelta >= 8) addUnique(tradeoffs, `${b} increases fragility exposure and needs stronger controls.`);
  if (params.propagationDelta <= -8) addUnique(tradeoffs, `${b} limits propagation exposure across fewer operational nodes.`);
  if (params.propagationDelta >= 8) addUnique(tradeoffs, `${b} spreads risk across a wider dependency path.`);
  if (params.confidenceDelta >= 8) addUnique(tradeoffs, `${b} carries stronger confidence under current assumptions.`);
  if (params.confidenceDelta <= -8) addUnique(tradeoffs, `${a} has stronger confidence under current assumptions.`);

  if (params.scenarioA.type !== params.scenarioB.type) {
    addUnique(tradeoffs, `${a} emphasizes ${String(params.scenarioA.type).replace(/_/g, " ")} while ${b} emphasizes ${String(params.scenarioB.type).replace(/_/g, " ")}.`);
  }

  return tradeoffs.slice(0, 4);
}
