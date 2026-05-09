import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "./typeCScenarioSimulation.ts";

export type TypeCScenarioComparison = {
  id: string;
  scenarioIds: string[];
  bestOptionId?: string | null;
  highestRiskScenarioId?: string | null;
  summary: string;
  rows: {
    scenarioId: string;
    title: string;
    riskLevel: "low" | "medium" | "high";
    affectedCount: number;
    pathCount: number;
    confidence: number;
    tradeoff: string;
  }[];
};

const MAX_ROWS = 5;

function riskScore(riskLevel: TypeCScenarioComparison["rows"][number]["riskLevel"]): number {
  if (riskLevel === "high") return 3;
  if (riskLevel === "medium") return 2;
  return 1;
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function tradeoffFor(input: {
  riskLevel: TypeCScenarioComparison["rows"][number]["riskLevel"];
  affectedCount: number;
  pathCount: number;
  confidence: number;
}): string {
  if (input.riskLevel === "high") return "High impact visibility, but more propagation risk.";
  if (input.riskLevel === "medium") return "Moderate risk with enough structure to inspect.";
  if (input.confidence < 0.5) return "Lower risk, but weak scenario confidence.";
  if (input.affectedCount <= 1 || input.pathCount === 0) return "Contained scope, but limited propagation detail.";
  return "Lower-risk option with manageable scope.";
}

function comparisonId(rows: TypeCScenarioComparison["rows"]): string {
  if (!rows.length) return "typec_compare_empty";
  return `typec_compare_${rows.map((row) => row.scenarioId).join("_")}`;
}

export function compareTypeCScenarioSimulations(input: {
  scenarios: TypeCScenarioDraft[];
  simulations: TypeCScenarioSimulation[];
}): TypeCScenarioComparison {
  try {
    const scenarioById = new Map(input.scenarios.map((scenario) => [scenario.id, scenario]));
    const rows = input.simulations
      .map((simulation) => {
        const scenario = scenarioById.get(simulation.scenarioId);
        if (!scenario) return null;
        const affectedCount = simulation.affectedObjectIds.length;
        const pathCount = simulation.propagationPaths.length;
        const riskLevel = simulation.riskLevel;
        const confidence = clampConfidence(scenario.confidence);
        return {
          scenarioId: scenario.id,
          title: scenario.title,
          riskLevel,
          affectedCount,
          pathCount,
          confidence,
          tradeoff: tradeoffFor({ riskLevel, affectedCount, pathCount, confidence }),
        };
      })
      .filter((row): row is TypeCScenarioComparison["rows"][number] => row !== null)
      .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
      .slice(0, MAX_ROWS);

    const byLowestRisk = [...rows].sort(
      (left, right) =>
        riskScore(left.riskLevel) - riskScore(right.riskLevel) ||
        left.affectedCount - right.affectedCount ||
        left.pathCount - right.pathCount ||
        right.confidence - left.confidence ||
        left.scenarioId.localeCompare(right.scenarioId)
    );
    const byHighestRisk = [...rows].sort(
      (left, right) =>
        riskScore(right.riskLevel) - riskScore(left.riskLevel) ||
        right.affectedCount - left.affectedCount ||
        right.pathCount - left.pathCount ||
        right.confidence - left.confidence ||
        left.scenarioId.localeCompare(right.scenarioId)
    );

    const bestOptionId = byLowestRisk[0]?.scenarioId ?? null;
    const highestRiskScenarioId = byHighestRisk[0]?.scenarioId ?? null;
    const summary = rows.length
      ? `Compared ${rows.length} scenario${rows.length === 1 ? "" : "s"}. Best structural option: ${
          bestOptionId ?? "none"
        }. Highest risk: ${highestRiskScenarioId ?? "none"}.`
      : "No scenario simulations available to compare.";

    return {
      id: comparisonId(rows),
      scenarioIds: rows.map((row) => row.scenarioId),
      bestOptionId,
      highestRiskScenarioId,
      summary,
      rows,
    };
  } catch {
    return {
      id: "typec_compare_empty",
      scenarioIds: [],
      bestOptionId: null,
      highestRiskScenarioId: null,
      summary: "No scenario simulations available to compare.",
      rows: [],
    };
  }
}
