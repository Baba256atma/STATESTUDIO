import type { DomainScenario, DomainScenarioImpact } from "../domain/domainScenarioTypes.ts";
import type { ScenarioComparisonMetric } from "./scenarioCompareTypes.ts";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

function severityPressure(severity: DomainScenario["severity"]): number {
  if (severity === "critical") return 88;
  if (severity === "high") return 70;
  if (severity === "medium") return 46;
  return 22;
}

function impactMagnitude(impacts: DomainScenarioImpact[], category: DomainScenarioImpact["category"], direction?: DomainScenarioImpact["direction"]): number {
  return impacts
    .filter((impact) => impact.category === category && (!direction || impact.direction === direction))
    .reduce((sum, impact) => sum + impact.magnitude, 0);
}

export function measureScenarioForComparison(scenario: DomainScenario): ScenarioComparisonMetric {
  const metadata = asRecord(scenario.metadata);
  const affectedCount = new Set([...(scenario.affectedObjectIds ?? []), ...scenario.relatedObjectIds]).size;
  const metadataFragility = typeof metadata.fragilityScore === "number" ? metadata.fragilityScore : 0;
  const metadataReach = typeof metadata.propagationReach === "number" ? metadata.propagationReach : 0;
  const relationshipStrength = typeof metadata.relationshipStrength === "number" ? metadata.relationshipStrength : 0.5;
  const riskIncrease = impactMagnitude(scenario.impacts, "risk", "increase");
  const riskDecrease = impactMagnitude(scenario.impacts, "risk", "decrease");
  const stabilityIncrease = impactMagnitude(scenario.impacts, "stability", "increase");
  const stabilityDecrease = impactMagnitude(scenario.impacts, "stability", "decrease");
  const confidenceIncrease = impactMagnitude(scenario.impacts, "confidence", "increase");
  const confidenceDecrease = impactMagnitude(scenario.impacts, "confidence", "decrease");
  const timelineIncrease = impactMagnitude(scenario.impacts, "timeline", "increase");
  const costIncrease = impactMagnitude(scenario.impacts, "cost", "increase");

  const fragilityScore = clampScore(
    severityPressure(scenario.severity) * 0.48 +
      metadataFragility * 0.28 +
      affectedCount * 4 +
      riskIncrease * 0.22 -
      riskDecrease * 0.18
  );
  const propagationScore = clampScore(
    metadataReach * 12 +
      affectedCount * 7 +
      relationshipStrength * 16 +
      timelineIncrease * 0.2 +
      riskIncrease * 0.18
  );
  const stabilityScore = clampScore(
    52 +
      stabilityIncrease * 0.34 +
      riskDecrease * 0.26 +
      confidenceIncrease * 0.16 -
      stabilityDecrease * 0.32 -
      riskIncrease * 0.28 -
      fragilityScore * 0.12 -
      costIncrease * 0.08
  );
  const confidenceScore = clampScore(scenario.confidence * 100 - confidenceDecrease * 0.12 + confidenceIncrease * 0.08);

  return {
    scenarioId: scenario.id,
    stabilityScore,
    fragilityScore,
    propagationScore,
    confidenceScore,
    dependencyDensity: affectedCount,
  };
}

export function compareScenarioScores(params: {
  scenarioA: DomainScenario;
  scenarioB: DomainScenario;
}): {
  scenarioAMetrics: ScenarioComparisonMetric;
  scenarioBMetrics: ScenarioComparisonMetric;
  stabilityDelta: number;
  fragilityDelta: number;
  propagationDelta: number;
  confidenceDelta: number;
} {
  const scenarioAMetrics = measureScenarioForComparison(params.scenarioA);
  const scenarioBMetrics = measureScenarioForComparison(params.scenarioB);
  return {
    scenarioAMetrics,
    scenarioBMetrics,
    stabilityDelta: scenarioBMetrics.stabilityScore - scenarioAMetrics.stabilityScore,
    fragilityDelta: scenarioBMetrics.fragilityScore - scenarioAMetrics.fragilityScore,
    propagationDelta: scenarioBMetrics.propagationScore - scenarioAMetrics.propagationScore,
    confidenceDelta: scenarioBMetrics.confidenceScore - scenarioAMetrics.confidenceScore,
  };
}
