import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import {
  buildScenarioComparisonSummary,
  buildScenarioComparisonTitle,
} from "./scenarioComparisonNarratives.ts";
import { compareScenarioScores } from "./compareScenarioScores.ts";
import { deriveScenarioTradeoffs } from "./deriveScenarioTradeoffs.ts";
import type { ScenarioComparison } from "./scenarioCompareTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_COMPARISONS = 6;

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function recommendationFor(params: {
  scenarioA: DomainScenario;
  scenarioB: DomainScenario;
  stabilityDelta: number;
  fragilityDelta: number;
  propagationDelta: number;
  confidenceDelta: number;
}): string | undefined {
  const bAdvantage =
    params.stabilityDelta * 0.34 -
    params.fragilityDelta * 0.28 -
    params.propagationDelta * 0.24 +
    params.confidenceDelta * 0.14;
  if (bAdvantage >= 6) return params.scenarioB.id;
  if (bAdvantage <= -6) return params.scenarioA.id;
  if (Math.abs(params.confidenceDelta) >= 12) {
    return params.confidenceDelta > 0 ? params.scenarioB.id : params.scenarioA.id;
  }
  return undefined;
}

function comparePair(scenarioA: DomainScenario, scenarioB: DomainScenario): ScenarioComparison {
  const scores = compareScenarioScores({ scenarioA, scenarioB });
  const recommendedScenarioId = recommendationFor({
    scenarioA,
    scenarioB,
    stabilityDelta: scores.stabilityDelta,
    fragilityDelta: scores.fragilityDelta,
    propagationDelta: scores.propagationDelta,
    confidenceDelta: scores.confidenceDelta,
  });
  return {
    id: `scenario_compare_${normalizeIdPart(scenarioA.id)}_${normalizeIdPart(scenarioB.id)}`,
    scenarioAId: scenarioA.id,
    scenarioBId: scenarioB.id,
    comparisonTitle: buildScenarioComparisonTitle({ scenarioA, scenarioB }),
    executiveSummary: buildScenarioComparisonSummary({
      scenarioA,
      scenarioB,
      recommendedScenarioId,
      stabilityDelta: scores.stabilityDelta,
      fragilityDelta: scores.fragilityDelta,
      propagationDelta: scores.propagationDelta,
    }),
    stabilityDelta: scores.stabilityDelta,
    fragilityDelta: scores.fragilityDelta,
    propagationDelta: scores.propagationDelta,
    confidenceDelta: scores.confidenceDelta,
    recommendedScenarioId,
    tradeoffs: deriveScenarioTradeoffs({
      scenarioA,
      scenarioB,
      stabilityDelta: scores.stabilityDelta,
      fragilityDelta: scores.fragilityDelta,
      propagationDelta: scores.propagationDelta,
      confidenceDelta: scores.confidenceDelta,
    }),
    createdAt: DETERMINISTIC_CREATED_AT,
  };
}

function comparisonStrength(comparison: ScenarioComparison): number {
  return Math.abs(comparison.stabilityDelta) +
    Math.abs(comparison.fragilityDelta) +
    Math.abs(comparison.propagationDelta) +
    Math.abs(comparison.confidenceDelta) * 0.5;
}

function logComparison(comparison: ScenarioComparison): void {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][ScenarioComparisonDerived]", {
    scenarioAId: comparison.scenarioAId,
    scenarioBId: comparison.scenarioBId,
    recommendation: comparison.recommendedScenarioId ?? null,
    stabilityDelta: comparison.stabilityDelta,
    fragilityDelta: comparison.fragilityDelta,
    propagationDelta: comparison.propagationDelta,
  });
}

export function deriveScenarioComparison(params: {
  scenarioA: DomainScenario;
  scenarioB: DomainScenario;
}): ScenarioComparison {
  const comparison = comparePair(params.scenarioA, params.scenarioB);
  logComparison(comparison);
  return comparison;
}

export function deriveScenarioComparisons(params: {
  scenarios: DomainScenario[];
}): ScenarioComparison[] {
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios.slice(0, 5) : [];
  const comparisons: ScenarioComparison[] = [];

  for (let index = 0; index < scenarios.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < scenarios.length; nextIndex += 1) {
      comparisons.push(comparePair(scenarios[index], scenarios[nextIndex]));
    }
  }

  const sorted = comparisons
    .sort((left, right) => {
      const strengthDelta = comparisonStrength(right) - comparisonStrength(left);
      if (strengthDelta !== 0) return strengthDelta;
      return left.id.localeCompare(right.id);
    })
    .slice(0, MAX_COMPARISONS);
  for (const comparison of sorted) logComparison(comparison);
  return sorted;
}
