import type { DomainScenario } from "./domainScenarioTypes.ts";
import type { DomainScenarioScore } from "./domainScenarioScoring.ts";

export type DomainScenarioComparison = {
  scenarioAId: string;
  scenarioBId: string;
  comparisonSummary: string;
  keyDifferences: string[];
  recommendation?: string;
};

function scoreFor(scores: DomainScenarioScore[] | undefined, scenarioId: string): DomainScenarioScore | null {
  return scores?.find((score) => score.scenarioId === scenarioId) ?? null;
}

function scenarioScore(scores: DomainScenarioScore[] | undefined, scenario: DomainScenario): number {
  return scoreFor(scores, scenario.id)?.overallScore ?? Math.round(scenario.confidence * 100);
}

function differenceSummary(a: DomainScenario, b: DomainScenario, aScore: number, bScore: number): string {
  if (aScore === bScore) return `${a.title} and ${b.title} are structurally close options.`;
  const winner = aScore > bScore ? a : b;
  const loser = aScore > bScore ? b : a;
  return `${winner.title} ranks above ${loser.title} on current deterministic scoring.`;
}

export function compareDomainScenarios(params: {
  scenarios: DomainScenario[];
  scores?: DomainScenarioScore[];
}): DomainScenarioComparison[] {
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios.slice(0, 4) : [];
  const comparisons: DomainScenarioComparison[] = [];

  for (let i = 0; i < scenarios.length; i += 1) {
    for (let j = i + 1; j < scenarios.length; j += 1) {
      const a = scenarios[i];
      const b = scenarios[j];
      const aScore = scenarioScore(params.scores, a);
      const bScore = scenarioScore(params.scores, b);
      const winner = aScore >= bScore ? a : b;
      comparisons.push({
        scenarioAId: a.id,
        scenarioBId: b.id,
        comparisonSummary: differenceSummary(a, b, aScore, bScore),
        keyDifferences: [
          `${a.title}: ${a.type}, ${a.severity} severity, confidence ${Math.round(a.confidence * 100)}%.`,
          `${b.title}: ${b.type}, ${b.severity} severity, confidence ${Math.round(b.confidence * 100)}%.`,
        ],
        recommendation: `Prefer ${winner.title} if current assumptions hold.`,
      });
    }
  }

  return comparisons;
}
