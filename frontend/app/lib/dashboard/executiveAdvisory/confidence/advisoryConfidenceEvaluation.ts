/**
 * Phase 5:3 — Advisory confidence domain evaluations.
 */

import type { ImpactDirection } from "../../dashboardVisualSignalContract.ts";
import type { AdvisoryContext } from "../aggregation/advisoryContextContract.ts";
import type {
  ConfidenceEvaluationInput,
  ConfidenceExplanationContract,
  EvidenceConsistencyEvaluation,
  EvidenceCoverageEvaluation,
  EvidenceFreshnessEvaluation,
  OverallAdvisoryConfidence,
  OverallAdvisoryConfidenceLevel,
  ReasoningStabilityEvaluation,
  ReasoningStabilityLevel,
  SourceDiversityEvaluation,
} from "./advisoryConfidenceContract.ts";

const COVERAGE_LABEL = Object.freeze({
  sparse: "Sparse Evidence",
  partial: "Partial Evidence",
  strong: "Strong Evidence",
});

const CONSISTENCY_LABEL = Object.freeze({
  conflicting: "Conflicting Signals",
  mixed: "Mixed Signals",
  consistent: "Consistent Signals",
});

const FRESHNESS_LABEL = Object.freeze({
  stale: "Stale",
  recent: "Recent",
  current: "Current",
});

const DIVERSITY_LABEL = Object.freeze({
  single_source: "Single Source",
  few_sources: "Few Sources",
  multiple_sources: "Multiple Sources",
});

const STABILITY_LABEL = Object.freeze({
  unstable: "Unstable",
  moderately_stable: "Moderately Stable",
  stable: "Stable",
});

const OVERALL_LABEL = Object.freeze({
  low: "Low Confidence",
  moderate: "Moderate Confidence",
  high: "High Confidence",
  very_high: "Very High Confidence",
});

export function evaluateEvidenceCoverage(context: AdvisoryContext): EvidenceCoverageEvaluation {
  const inputs = context.rankedInputs;
  const supportive = inputs.filter(
    (input) => input.confidence === "high" || input.confidence === "moderate"
  ).length;
  const ratio = supportive / Math.max(inputs.length, 1);
  const level = ratio >= 0.7 ? "strong" : ratio >= 0.4 ? "partial" : "sparse";

  return Object.freeze({
    level,
    label: COVERAGE_LABEL[level],
    summary: `${supportive} of ${inputs.length} advisory inputs carry supportive evidence`,
    signalCount: supportive,
  });
}

export function evaluateEvidenceConsistency(context: AdvisoryContext): EvidenceConsistencyEvaluation {
  const top = context.rankedInputs.slice(0, 6);
  const deteriorating = top.filter((input) => input.trend === "deteriorating").length;
  const improving = top.filter((input) => input.trend === "improving").length;

  const level =
    deteriorating >= 3 && improving >= 2
      ? "conflicting"
      : deteriorating >= 2 || improving >= 2
        ? "mixed"
        : "consistent";

  return Object.freeze({
    level,
    label: CONSISTENCY_LABEL[level],
    summary:
      level === "conflicting"
        ? "Intelligence surfaces emit competing directional signals"
        : level === "mixed"
          ? "Some alignment with notable signal variation"
          : "Supporting intelligence surfaces largely agree",
  });
}

export function evaluateEvidenceFreshness(
  context: AdvisoryContext,
  dashboardContext: string
): EvidenceFreshnessEvaluation {
  const ageMs = Date.now() - new Date(context.metadata.timestamp).getTime();
  const level =
    dashboardContext === "war_room" || dashboardContext === "timeline" || ageMs < 5000
      ? "current"
      : ageMs < 60_000
        ? "recent"
        : "stale";

  return Object.freeze({
    level,
    label: FRESHNESS_LABEL[level],
    summary:
      level === "current"
        ? "Advisory context reflects current intelligence state"
        : level === "recent"
          ? "Evidence is recent within the active session"
          : "Evidence may require refresh before executive action",
  });
}

export function evaluateSourceDiversity(context: AdvisoryContext): SourceDiversityEvaluation {
  const sources = [...new Set(context.rankedInputs.map((input) => input.source))];
  const level =
    sources.length >= 4 ? "multiple_sources" : sources.length >= 2 ? "few_sources" : "single_source";

  return Object.freeze({
    level,
    label: DIVERSITY_LABEL[level],
    summary: `${sources.length} intelligence domains contribute to advisory context`,
    supportingDomains: Object.freeze(sources),
  });
}

export function evaluateReasoningStability(
  context: AdvisoryContext,
  previousOverall: OverallAdvisoryConfidenceLevel | null
): ReasoningStabilityEvaluation {
  const currentProxy = context.metadata.confidence;
  let level: ReasoningStabilityLevel = "stable";
  let trend: ImpactDirection = "stable";

  if (previousOverall) {
    const order = ["low", "moderate", "high", "very_high"] as const;
    const prevIdx = order.indexOf(previousOverall);
    const currIdx = order.indexOf(
      currentProxy === "high" ? "high" : currentProxy === "low" ? "low" : "moderate"
    );
    const delta = Math.abs(prevIdx - currIdx);
    if (delta >= 2) {
      level = "unstable";
      trend = "deteriorating";
    } else if (delta === 1) {
      level = "moderately_stable";
      trend = currIdx > prevIdx ? "improving" : "deteriorating";
    }
  }

  return Object.freeze({
    level,
    label: STABILITY_LABEL[level],
    summary:
      level === "unstable"
        ? "Confidence shifted significantly since prior evaluation"
        : level === "moderately_stable"
          ? "Confidence shows moderate drift between updates"
          : "Confidence remains stable across recent updates",
    trend,
  });
}

function domainScore(level: string): number {
  const scores: Record<string, number> = {
    sparse: 1,
    partial: 2,
    strong: 3,
    conflicting: 1,
    mixed: 2,
    consistent: 3,
    stale: 1,
    recent: 2,
    current: 3,
    single_source: 1,
    few_sources: 2,
    multiple_sources: 3,
    unstable: 1,
    moderately_stable: 2,
    stable: 3,
  };
  return scores[level] ?? 2;
}

export function aggregateOverallConfidence(input: {
  coverage: EvidenceCoverageEvaluation;
  consistency: EvidenceConsistencyEvaluation;
  freshness: EvidenceFreshnessEvaluation;
  diversity: SourceDiversityEvaluation;
  stability: ReasoningStabilityEvaluation;
}): OverallAdvisoryConfidence {
  const total =
    domainScore(input.coverage.level) +
    domainScore(input.consistency.level) +
    domainScore(input.freshness.level) +
    domainScore(input.diversity.level) +
    domainScore(input.stability.level);

  const level: OverallAdvisoryConfidenceLevel =
    total >= 14 ? "very_high" : total >= 11 ? "high" : total >= 8 ? "moderate" : "low";

  const trend: ImpactDirection =
    input.stability.trend === "improving"
      ? "improving"
      : input.stability.trend === "deteriorating" || input.consistency.level === "conflicting"
        ? "deteriorating"
        : "stable";

  return Object.freeze({
    level,
    label: OVERALL_LABEL[level],
    trend,
    summary: "Overall confidence reflects strength of supporting evidence — not prediction accuracy",
  });
}

export function buildConfidenceExplanation(
  context: AdvisoryContext,
  evaluation: {
    coverage: EvidenceCoverageEvaluation;
    consistency: EvidenceConsistencyEvaluation;
    freshness: EvidenceFreshnessEvaluation;
    diversity: SourceDiversityEvaluation;
    stability: ReasoningStabilityEvaluation;
    overall: OverallAdvisoryConfidence;
  }
): ConfidenceExplanationContract {
  const drivers: string[] = [];
  const limiters: string[] = [];
  const missing: string[] = [];
  const supporting: string[] = [];

  if (evaluation.coverage.level === "strong") drivers.push("Strong evidence coverage across advisory inputs");
  if (evaluation.consistency.level === "consistent") drivers.push("Consistent signals across intelligence surfaces");
  if (evaluation.diversity.level === "multiple_sources") drivers.push("Multiple intelligence domains validate context");
  if (evaluation.freshness.level === "current") drivers.push("Current intelligence freshness");

  if (evaluation.coverage.level === "sparse") limiters.push("Sparse evidence coverage");
  if (evaluation.consistency.level === "conflicting") limiters.push("Conflicting intelligence signals");
  if (evaluation.stability.level === "unstable") limiters.push("Unstable confidence between updates");
  if (context.risk.confidence.confidence === "low") limiters.push("Low risk confidence");

  context.rankedInputs.slice(0, 3).forEach((input) => {
    supporting.push(`${input.label}: ${input.explanation}`);
  });

  if (evaluation.coverage.level === "sparse") {
    missing.push("Additional operational and scenario validation recommended");
  }
  if (evaluation.diversity.level === "single_source") {
    missing.push("Cross-surface intelligence validation incomplete");
  }

  return Object.freeze({
    confidenceDrivers: Object.freeze(drivers),
    confidenceLimiters: Object.freeze(limiters),
    missingEvidence: Object.freeze(missing),
    supportingEvidence: Object.freeze(supporting),
    summary: `Confidence ${evaluation.overall.label} — ${drivers[0] ?? limiters[0] ?? "evaluate supporting evidence"}`,
  });
}

export function evaluateAdvisoryConfidence(
  input: ConfidenceEvaluationInput,
  previousOverall: OverallAdvisoryConfidenceLevel | null
) {
  const coverage = evaluateEvidenceCoverage(input.advisoryContext);
  const consistency = evaluateEvidenceConsistency(input.advisoryContext);
  const freshness = evaluateEvidenceFreshness(input.advisoryContext, input.dashboardContext);
  const diversity = evaluateSourceDiversity(input.advisoryContext);
  const stability = evaluateReasoningStability(input.advisoryContext, previousOverall);
  const overall = aggregateOverallConfidence({ coverage, consistency, freshness, diversity, stability });
  const explanation = buildConfidenceExplanation(input.advisoryContext, {
    coverage,
    consistency,
    freshness,
    diversity,
    stability,
    overall,
  });

  return Object.freeze({
    coverage,
    consistency,
    freshness,
    diversity,
    stability,
    overall,
    explanation,
  });
}
