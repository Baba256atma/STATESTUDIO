import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";

export type DecisionConfidenceModel = {
  overall_score: number;
  level: "low" | "medium" | "high";
  drivers: Array<{
    label: string;
    impact: "positive" | "negative";
    note: string;
  }>;
  assumptions: string[];
  uncertainties: string[];
  risk_flags: Array<{
    label: string;
    severity: "low" | "medium" | "high";
  }>;
  explanation: string;
};

type BuildDecisionConfidenceModelInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: any | null;
  decisionResult?: any | null;
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

function uniqueStrings(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function average(values: number[]) {
  if (!values.length) return 0.6;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildDecisionConfidenceModel(
  input: BuildDecisionConfidenceModelInput
): DecisionConfidenceModel {
  const responseData = input.responseData ?? null;
  const recommendation = input.canonicalRecommendation ?? responseData?.canonical_recommendation ?? null;
  const recScore = Number(recommendation?.confidence?.score);
  const simulationScore = Number(
    responseData?.decision_simulation?.confidence ??
      responseData?.executive_insight?.confidence?.score
  );
  const trustScores = Array.isArray(responseData?.trust_provenance)
    ? responseData.trust_provenance
        .map((entry: any) => Number(entry?.confidence))
        .filter((value: number) => Number.isFinite(value))
    : [];
  const comparisonItems = Array.isArray(input.decisionResult?.comparison)
    ? input.decisionResult.comparison
    : [];
  const scoreSpread =
    comparisonItems.length >= 2
      ? Math.abs(Number(comparisonItems[0]?.score ?? 0) - Number(comparisonItems[1]?.score ?? 0))
      : null;
  const comparisonSignal =
    typeof scoreSpread === "number"
      ? clamp01(0.45 + Math.min(0.35, scoreSpread))
      : null;

  const overallScore = clamp01(
    average(
      [recScore, simulationScore, comparisonSignal, ...trustScores].filter((value) =>
        Number.isFinite(value)
      ) as number[]
    )
  );

  const level: DecisionConfidenceModel["level"] =
    overallScore > 0.75 ? "high" : overallScore >= 0.45 ? "medium" : "low";

  const drivers: DecisionConfidenceModel["drivers"] = [];
  if (Number.isFinite(recScore) && recScore >= 0.72) {
    drivers.push({
      label: "Recommendation alignment",
      impact: "positive",
      note: "The recommended move remains internally consistent across the current decision layers.",
    });
  }
  if (Number.isFinite(simulationScore) && simulationScore >= 0.72) {
    drivers.push({
      label: "Stable simulation signal",
      impact: "positive",
      note: "Simulation output supports the recommended move with limited instability in the projected outcome.",
    });
  }
  if (typeof scoreSpread === "number" && scoreSpread >= 0.12) {
    drivers.push({
      label: "Clear option separation",
      impact: "positive",
      note: "The leading option is meaningfully stronger than the nearest alternative.",
    });
  }
  if (typeof scoreSpread === "number" && scoreSpread < 0.08) {
    drivers.push({
      label: "Tight comparison spread",
      impact: "negative",
      note: "Alternatives remain close, so the current recommendation is directionally helpful but not dominant.",
    });
  }
  if (Array.isArray(responseData?.executive_insight?.confidence?.uncertainty_notes) && responseData.executive_insight.confidence.uncertainty_notes.length) {
    drivers.push({
      label: "Uncertainty remains",
      impact: "negative",
      note: text(responseData.executive_insight.confidence.uncertainty_notes[0]) || "Important variables remain uncertain.",
    });
  }
  if (Array.isArray(responseData?.trust_provenance) && responseData.trust_provenance.some((entry: any) => Array.isArray(entry?.uncertainty_notes) && entry.uncertainty_notes.length)) {
    drivers.push({
      label: "Mixed evidence quality",
      impact: "negative",
      note: "Some recommendation inputs still carry unresolved uncertainty or incomplete source coverage.",
    });
  }

  const assumptions = uniqueStrings([
    ...(Array.isArray(recommendation?.reasoning?.key_drivers)
      ? recommendation.reasoning.key_drivers.map((driver) => `${String(driver).replace(/_/g, " ")} remains directionally stable.`)
      : []),
    responseData?.executive_summary_surface?.what_to_do
      ? "Current operating constraints remain materially similar through execution."
      : null,
    responseData?.decision_simulation?.scenario?.name
      ? `The ${text(responseData.decision_simulation.scenario.name)} scenario remains the right frame for action.`
      : null,
    responseData?.risk_propagation?.summary
      ? "Downstream dependencies behave broadly in line with the current propagation map."
      : null,
  ], 4);

  const uncertainties = uniqueStrings([
    ...(Array.isArray(responseData?.executive_insight?.confidence?.uncertainty_notes)
      ? responseData.executive_insight.confidence.uncertainty_notes
      : []),
    ...(Array.isArray(responseData?.trust_provenance)
      ? responseData.trust_provenance.flatMap((entry: any) => entry?.uncertainty_notes ?? [])
      : []),
    scoreSpread !== null && scoreSpread < 0.08
      ? "Alternative paths remain close enough that small changes could shift the recommendation."
      : null,
    responseData?.strategy_kpi?.summary
      ? "Strategic KPI impact remains directional rather than fully quantified."
      : null,
  ], 4);

  const rawRiskFlags = uniqueStrings([
    responseData?.risk_propagation?.summary,
    responseData?.strategy_kpi?.summary,
    responseData?.executive_summary_surface?.why_it_matters,
    recommendation?.reasoning?.risk_summary,
  ], 4);
  const risk_flags: DecisionConfidenceModel["risk_flags"] = rawRiskFlags.map((label, index) => ({
    label,
    severity:
      /critical|severe|fragility|downstream/i.test(label)
        ? "high"
        : /risk|pressure|constraint|cost/i.test(label) || index === 0
        ? "medium"
        : "low",
  }));

  const explanation =
    level === "high"
      ? "This recommendation has high confidence. The decision signal is consistent across the current recommendation and simulation layers, with limited visible uncertainty."
      : level === "medium"
      ? "This recommendation has moderate confidence. It is directionally supported, but some assumptions and alternative paths still deserve review before committing."
      : "Confidence is limited. The current recommendation is useful as guidance, but the decision remains sensitive to uncertainty and should be stress-tested before acting.";

  return {
    overall_score: overallScore,
    level,
    drivers: drivers.slice(0, 5),
    assumptions: assumptions.length
      ? assumptions
      : ["Confidence is limited due to insufficient data. Use Compare or Simulation to strengthen decision clarity."],
    uncertainties,
    risk_flags,
    explanation,
  };
}
