import type { TypeCScenarioComparison } from "./typeCScenarioComparison.ts";

export type TypeCDecisionRecommendation = {
  recommendedScenarioId: string | null;
  reasoning: string;
  tradeoff: string;
  riskWarning: string;
  nextAction: string;
  confidence: number;
};

type ComparisonRow = TypeCScenarioComparison["rows"][number];

function riskScore(riskLevel: ComparisonRow["riskLevel"]): number {
  if (riskLevel === "high") return 3;
  if (riskLevel === "medium") return 2;
  return 1;
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0.3;
  return Math.min(0.95, Math.max(0.3, Number(value.toFixed(2))));
}

function pickFallbackBest(rows: ComparisonRow[]): ComparisonRow | null {
  return (
    [...rows].sort(
      (left, right) =>
        riskScore(left.riskLevel) - riskScore(right.riskLevel) ||
        left.affectedCount - right.affectedCount ||
        left.pathCount - right.pathCount ||
        right.confidence - left.confidence ||
        left.scenarioId.localeCompare(right.scenarioId)
    )[0] ?? null
  );
}

function confidenceFor(best: ComparisonRow | null, rows: ComparisonRow[]): number {
  if (!best || rows.length === 0) return 0.3;
  if (rows.length === 1) return clampConfidence(Math.min(0.62, best.confidence));

  const alternatives = rows.filter((row) => row.scenarioId !== best.scenarioId);
  const nearestAlternativeRisk = Math.min(...alternatives.map((row) => riskScore(row.riskLevel)));
  const riskGap = nearestAlternativeRisk - riskScore(best.riskLevel);
  const scopeAdvantage = alternatives.some(
    (row) => best.affectedCount < row.affectedCount || best.pathCount < row.pathCount
  );

  if (riskGap > 0 && scopeAdvantage) return clampConfidence(Math.max(0.8, best.confidence));
  if (riskGap > 0 || scopeAdvantage) return clampConfidence(Math.max(0.62, best.confidence * 0.9));
  return clampConfidence(Math.min(0.49, best.confidence * 0.75));
}

function riskWarningFor(row: ComparisonRow | null): string {
  if (!row) return "No scenario is structured enough to evaluate risk.";
  if (row.riskLevel === "high") return "Recommended scenario still carries high propagation risk.";
  if (row.riskLevel === "medium") return "Even the best option still carries medium propagation risk.";
  if (row.pathCount > 0) return "Low-risk scenario still has visible dependency paths.";
  return "Risk appears contained, but assumptions should be validated before execution.";
}

export function buildTypeCDecisionRecommendation(input: {
  comparison: TypeCScenarioComparison;
}): TypeCDecisionRecommendation {
  try {
    const rows = Array.isArray(input.comparison?.rows) ? input.comparison.rows : [];
    if (!rows.length) {
      return {
        recommendedScenarioId: null,
        reasoning: "No comparable scenario simulations are available yet.",
        tradeoff: "Decision quality is limited until alternatives are visible.",
        riskWarning: "No scenario is structured enough to evaluate risk.",
        nextAction: "Create or compare scenario simulations before choosing a direction.",
        confidence: 0.3,
      };
    }

    const best =
      rows.find((row) => row.scenarioId === input.comparison.bestOptionId) ?? pickFallbackBest(rows);
    const highestRisk = rows.find((row) => row.scenarioId === input.comparison.highestRiskScenarioId);
    const confidence = confidenceFor(best, rows);

    return {
      recommendedScenarioId: best?.scenarioId ?? null,
      reasoning: best
        ? `${best.title} has lower structural risk with ${best.affectedCount} affected node${
            best.affectedCount === 1 ? "" : "s"
          } and ${best.pathCount} propagation path${best.pathCount === 1 ? "" : "s"}.`
        : "No comparable scenario simulations are available yet.",
      tradeoff: best?.tradeoff ?? "Decision quality is limited until alternatives are visible.",
      riskWarning:
        highestRisk && best && highestRisk.scenarioId !== best.scenarioId
          ? `${riskWarningFor(best)} Watch ${highestRisk.title} as the highest-risk alternative.`
          : riskWarningFor(best),
      nextAction: best
        ? "Open War Room and validate assumptions before execution."
        : "Create or compare scenario simulations before choosing a direction.",
      confidence,
    };
  } catch {
    return {
      recommendedScenarioId: null,
      reasoning: "No comparable scenario simulations are available yet.",
      tradeoff: "Decision quality is limited until alternatives are visible.",
      riskWarning: "No scenario is structured enough to evaluate risk.",
      nextAction: "Create or compare scenario simulations before choosing a direction.",
      confidence: 0.3,
    };
  }
}
