/**
 * D:1 — Decision Explanation Builder.
 *
 * Template-driven builder that explains why a recommendation exists, why
 * alternatives rank lower, major tradeoffs, major risks, and expected benefits.
 * Produces read-only DecisionExplanation outputs without mutating sources.
 */

import {
  buildDecisionExplanation,
  type DecisionExplanation,
} from "./DecisionRecommendationContract.ts";
import {
  DECISION_EXPLANATION_BUILDER_DIAGNOSTICS,
  DECISION_EXPLANATION_BUILDER_VERSION,
  DECISION_EXPLANATION_TEMPLATES,
  EMPTY_DECISION_EXPLANATION_RESULT,
  type DecisionExplanationBuilderInput,
  type DecisionExplanationResult,
} from "./decisionExplanationBuilderContract.ts";
import type { AlternativeOption, ExecutiveRecommendation } from "./recommendationEngineContract.ts";
import type { TradeoffProfile } from "./tradeoffAnalysisEngineContract.ts";

export {
  D1_EXPLANATION_COMPLETE_TAG,
  DECISION_EXPLANATION_BUILDER_DIAGNOSTICS,
  DECISION_EXPLANATION_BUILDER_VERSION,
  DECISION_EXPLANATION_DIAGNOSTIC,
  DECISION_EXPLANATION_READY_DIAGNOSTIC,
  DECISION_EXPLANATION_TEMPLATES,
  EMPTY_DECISION_EXPLANATION_RESULT,
  type DecisionExplanationBuilderInput,
  type DecisionExplanationResult,
} from "./decisionExplanationBuilderContract.ts";

let latestDecisionExplanationResult: DecisionExplanationResult = EMPTY_DECISION_EXPLANATION_RESULT;

function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
}

function scoreDimensionValue(
  recommendation: ExecutiveRecommendation,
  optionId: string,
  dimensionId: string
): number | null {
  const recommended =
    recommendation.recommendedOption?.option.optionId === optionId
      ? recommendation.recommendedOption.score
      : recommendation.alternativeOptions.find((option) => option.option.optionId === optionId)?.score;
  if (!recommended) return null;
  return recommended.dimensions.find((dimension) => dimension.dimensionId === dimensionId)?.value ?? null;
}

function tradeoffAxisValue(tradeoffProfile: TradeoffProfile, optionId: string, dimensionId: string): number | null {
  const profile = tradeoffProfile.optionProfiles.find((entry) => entry.optionId === optionId);
  return profile?.axes.find((axis) => axis.dimensionId === dimensionId)?.value ?? null;
}

function buildWhyRankedFirst(recommendation: ExecutiveRecommendation): string {
  const recommended = recommendation.recommendedOption;
  if (!recommended) {
    return "No recommended option is available to explain.";
  }
  return fillTemplate(DECISION_EXPLANATION_TEMPLATES.whyRankedFirst, {
    optionLabel: recommended.option.label,
    compositeScore: recommended.compositeScore,
    decisionScore: recommended.score.value,
    confidence: recommended.score.confidence,
  });
}

function buildWhyAlternativesLower(recommendation: ExecutiveRecommendation): readonly string[] {
  const recommendedScore = recommendation.recommendedOption?.compositeScore ?? 0;
  return Object.freeze(
    recommendation.alternativeOptions.map((alternative: AlternativeOption) =>
      fillTemplate(DECISION_EXPLANATION_TEMPLATES.whyAlternativeLower, {
        optionLabel: alternative.option.label,
        rank: alternative.rank,
        compositeScore: alternative.compositeScore,
        delta: Math.max(0, recommendedScore - alternative.compositeScore),
      })
    )
  );
}

function buildMajorTradeoffs(
  recommendation: ExecutiveRecommendation,
  tradeoffProfile: TradeoffProfile
): readonly string[] {
  const recommendedId = recommendation.recommendedOption?.option.optionId;
  const comparisons =
    tradeoffProfile.primaryComparison != null
      ? [tradeoffProfile.primaryComparison]
      : tradeoffProfile.comparisons;

  const tradeoffs = comparisons.flatMap((comparison) =>
    comparison.dimensions
      .filter((dimension) => Math.abs(dimension.delta) >= 3)
      .map((dimension) =>
        fillTemplate(DECISION_EXPLANATION_TEMPLATES.majorTradeoff, {
          dimensionLabel: dimension.label,
          favoredOptionId:
            dimension.favoredOptionId === "neutral"
              ? "neither option"
              : dimension.favoredOptionId === recommendedId
                ? "the recommended option"
                : dimension.favoredOptionId,
          summary: dimension.summary,
        })
      )
  );

  return Object.freeze(tradeoffs.slice(0, 5));
}

function buildMajorRisks(
  recommendation: ExecutiveRecommendation,
  tradeoffProfile: TradeoffProfile
): readonly string[] {
  const recommended = recommendation.recommendedOption;
  if (!recommended) return Object.freeze([]);

  const risks: string[] = [];
  const riskScore = scoreDimensionValue(recommendation, recommended.option.optionId, "risk");
  if (riskScore != null && riskScore < 60) {
    risks.push(
      fillTemplate(DECISION_EXPLANATION_TEMPLATES.majorRisk, {
        optionLabel: recommended.option.label,
        dimensionLabel: "risk",
        value: riskScore,
      })
    );
  }

  const costAxis = tradeoffAxisValue(tradeoffProfile, recommended.option.optionId, "cost");
  if (costAxis != null && costAxis >= 60) {
    risks.push(
      fillTemplate(DECISION_EXPLANATION_TEMPLATES.majorRisk, {
        optionLabel: recommended.option.label,
        dimensionLabel: "cost",
        value: costAxis,
      })
    );
  }

  const pressureAxis = tradeoffAxisValue(tradeoffProfile, recommended.option.optionId, "pressureReduction");
  if (pressureAxis != null && pressureAxis < 50) {
    risks.push(
      fillTemplate(DECISION_EXPLANATION_TEMPLATES.majorRisk, {
        optionLabel: recommended.option.label,
        dimensionLabel: "pressure reduction",
        value: pressureAxis,
      })
    );
  }

  return Object.freeze(risks.slice(0, 4));
}

function buildExpectedBenefits(
  recommendation: ExecutiveRecommendation,
  tradeoffProfile: TradeoffProfile
): readonly string[] {
  const recommended = recommendation.recommendedOption;
  if (!recommended) return Object.freeze([]);

  const benefits: string[] = [];
  const benefitAxis = tradeoffAxisValue(tradeoffProfile, recommended.option.optionId, "benefit");
  if (benefitAxis != null) {
    benefits.push(
      fillTemplate(DECISION_EXPLANATION_TEMPLATES.expectedBenefit, {
        optionLabel: recommended.option.label,
        dimensionLabel: "benefit",
        value: benefitAxis,
      })
    );
  }

  const kpiImpact = tradeoffAxisValue(tradeoffProfile, recommended.option.optionId, "kpiImpact");
  if (kpiImpact != null) {
    benefits.push(
      fillTemplate(DECISION_EXPLANATION_TEMPLATES.expectedBenefit, {
        optionLabel: recommended.option.label,
        dimensionLabel: "KPI impact",
        value: kpiImpact,
      })
    );
  }

  const impactScore = scoreDimensionValue(recommendation, recommended.option.optionId, "impact");
  if (impactScore != null && impactScore >= 60) {
    benefits.push(
      fillTemplate(DECISION_EXPLANATION_TEMPLATES.expectedBenefit, {
        optionLabel: recommended.option.label,
        dimensionLabel: "impact",
        value: impactScore,
      })
    );
  }

  return Object.freeze(benefits.slice(0, 4));
}

function buildEvidenceIds(input: {
  explanationId: string;
  recommendation: ExecutiveRecommendation;
  majorTradeoffs: readonly string[];
  majorRisks: readonly string[];
  expectedBenefits: readonly string[];
}): readonly string[] {
  const recommendedId = input.recommendation.recommendedOption?.option.optionId ?? "none";
  return Object.freeze([
    input.explanationId,
    `rank:1`,
    `option:${recommendedId}`,
    ...(input.majorTradeoffs.length > 0 ? ["tradeoff:major"] : []),
    ...(input.majorRisks.length > 0 ? ["risk:major"] : []),
    ...(input.expectedBenefits.length > 0 ? ["benefit:expected"] : []),
  ]);
}

function buildCanonicalExplanation(input: {
  explanationId: string;
  recommendation: ExecutiveRecommendation;
  whyRankedFirst: string;
  whyAlternativesLower: readonly string[];
  majorTradeoffs: readonly string[];
  majorRisks: readonly string[];
  expectedBenefits: readonly string[];
}): DecisionExplanation {
  const recommended = input.recommendation.recommendedOption;
  const rationaleParts = [
    fillTemplate(DECISION_EXPLANATION_TEMPLATES.rationaleSummary, {
      optionLabel: recommended?.option.label ?? "No option",
    }),
    input.whyRankedFirst,
    ...input.whyAlternativesLower,
    ...input.majorTradeoffs,
    ...input.majorRisks,
    ...input.expectedBenefits,
  ];

  return buildDecisionExplanation({
    explanationId: input.explanationId,
    optionId: recommended?.option.optionId ?? "",
    rationale: rationaleParts.filter(Boolean).join(" "),
    evidenceIds: buildEvidenceIds({
      explanationId: input.explanationId,
      recommendation: input.recommendation,
      majorTradeoffs: input.majorTradeoffs,
      majorRisks: input.majorRisks,
      expectedBenefits: input.expectedBenefits,
    }),
    tradeoffSummary:
      input.majorTradeoffs.length > 0
        ? input.majorTradeoffs.join(" ")
        : "No material tradeoff separation was identified.",
  });
}

export function buildDecisionExplanationResult(
  input: DecisionExplanationBuilderInput
): DecisionExplanationResult {
  const whyRankedFirst = buildWhyRankedFirst(input.recommendation);
  const whyAlternativesLower = buildWhyAlternativesLower(input.recommendation);
  const majorTradeoffs = buildMajorTradeoffs(input.recommendation, input.tradeoffProfile);
  const majorRisks = buildMajorRisks(input.recommendation, input.tradeoffProfile);
  const expectedBenefits = buildExpectedBenefits(input.recommendation, input.tradeoffProfile);
  const explanation = buildCanonicalExplanation({
    explanationId: input.explanationId,
    recommendation: input.recommendation,
    whyRankedFirst,
    whyAlternativesLower,
    majorTradeoffs,
    majorRisks,
    expectedBenefits,
  });

  latestDecisionExplanationResult = Object.freeze({
    version: DECISION_EXPLANATION_BUILDER_VERSION,
    generatedAt: input.generatedAt,
    recommendationId: input.recommendation.recommendationId,
    explanation,
    whyRankedFirst,
    whyAlternativesLower,
    majorTradeoffs,
    majorRisks,
    expectedBenefits,
    templateDriven: true as const,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: DECISION_EXPLANATION_BUILDER_DIAGNOSTICS,
  });

  return latestDecisionExplanationResult;
}

export function getDecisionExplanationResult(): DecisionExplanationResult {
  return latestDecisionExplanationResult;
}

export function resetDecisionExplanationBuilderForTests(): void {
  latestDecisionExplanationResult = EMPTY_DECISION_EXPLANATION_RESULT;
}

export const DecisionExplanationBuilder = Object.freeze({
  buildDecisionExplanationResult,
  getDecisionExplanationResult,
  resetDecisionExplanationBuilderForTests,
  diagnostics: DECISION_EXPLANATION_BUILDER_DIAGNOSTICS,
  templates: DECISION_EXPLANATION_TEMPLATES,
  emptyResult: EMPTY_DECISION_EXPLANATION_RESULT,
});
