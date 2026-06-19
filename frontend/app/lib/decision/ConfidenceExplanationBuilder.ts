/**
 * D:2:5 — Confidence Explanation Builder.
 *
 * Template-driven builder that explains why confidence is high, medium, low, or
 * insufficient, which evidence supports it, which uncertainty weakens it, and
 * what data would improve confidence. Produces read-only outputs without
 * mutating source systems.
 */

import {
  buildDecisionConfidenceExplanation,
  type DecisionConfidenceExplanation,
} from "./DecisionConfidenceContract.ts";
import {
  CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTICS,
  CONFIDENCE_EXPLANATION_BUILDER_VERSION,
  CONFIDENCE_EXPLANATION_TEMPLATES,
  EMPTY_CONFIDENCE_EXPLANATION_RESULT,
  type ConfidenceExplanationBuilderInput,
  type ConfidenceExplanationResult,
} from "./confidenceExplanationBuilderContract.ts";
import type { UncertaintyDetectionCategoryId } from "./uncertaintyDetectionEngineContract.ts";

export {
  CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTIC,
  CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTICS,
  CONFIDENCE_EXPLANATION_BUILDER_VERSION,
  CONFIDENCE_EXPLANATION_READY_DIAGNOSTIC,
  CONFIDENCE_EXPLANATION_TEMPLATES,
  D2_CONFIDENCE_EXPLANATION_COMPLETE_TAG,
  EMPTY_CONFIDENCE_EXPLANATION_RESULT,
  type ConfidenceExplanationBuilderInput,
  type ConfidenceExplanationResult,
} from "./confidenceExplanationBuilderContract.ts";

let latestConfidenceExplanationResult: ConfidenceExplanationResult =
  EMPTY_CONFIDENCE_EXPLANATION_RESULT;

const DATA_IMPROVEMENT_BY_CATEGORY: Readonly<Record<UncertaintyDetectionCategoryId, string>> =
  Object.freeze({
    missingData: "decision input and DS intelligence",
    conflictingSignals: "consistent cross-source signal alignment",
    lowSimulationConfidence: "scenario simulation confidence",
    weakKpiEvidence: "KPI intelligence profiles",
    weakRiskEvidence: "risk intelligence profiles",
    scenarioDisagreement: "aligned scenario comparison coverage",
  });

function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
}

function summarizePositiveDrivers(input: ConfidenceExplanationBuilderInput): string {
  const drivers = input.confidenceScore.confidenceDrivers
    .filter((driver) => driver.impact === "positive")
    .map((driver) => `${driver.label.toLowerCase()} (${driver.contribution})`)
    .slice(0, 3);

  if (drivers.length === 0) {
    return `evidence strength remains at ${input.evidenceStrength.strengthScore}`;
  }

  return drivers.join(", ");
}

function summarizeLimitations(input: ConfidenceExplanationBuilderInput): string {
  const negativeDrivers = input.confidenceScore.confidenceDrivers
    .filter((driver) => driver.impact === "negative")
    .map((driver) => driver.label.toLowerCase())
    .slice(0, 2);
  const topUncertainty = input.uncertainty.findings[0];

  if (topUncertainty) {
    return `${topUncertainty.label.toLowerCase()} (${topUncertainty.severity})${negativeDrivers.length > 0 ? ` and ${negativeDrivers.join(", ")}` : ""}`;
  }

  if (negativeDrivers.length > 0) {
    return negativeDrivers.join(", ");
  }

  return `evidence strength remains limited at ${input.evidenceStrength.strengthScore}`;
}

function buildWhyConfidenceHigh(input: ConfidenceExplanationBuilderInput): string {
  if (input.confidenceScore.confidenceLevel !== "high") {
    return "";
  }

  return fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.whyHighConfidence, {
    confidenceLabel: input.confidenceScore.confidenceLabel,
    confidenceScore: input.confidenceScore.confidenceScore,
    driverSummary: summarizePositiveDrivers(input),
  });
}

function buildWhyConfidenceLimited(input: ConfidenceExplanationBuilderInput): string {
  if (input.confidenceScore.confidenceLevel === "high") {
    return CONFIDENCE_EXPLANATION_TEMPLATES.noMaterialLimitation;
  }

  if (input.confidenceScore.confidenceLevel === "insufficient_evidence") {
    return fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.whyInsufficientEvidence, {
      confidenceScore: input.confidenceScore.confidenceScore,
      evidenceCount: input.evidenceStrength.evidenceCount,
    });
  }

  return fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.whyLimitedConfidence, {
    confidenceLabel: input.confidenceScore.confidenceLabel,
    confidenceScore: input.confidenceScore.confidenceScore,
    limitationSummary: summarizeLimitations(input),
  });
}

function buildSupportingEvidence(input: ConfidenceExplanationBuilderInput): readonly string[] {
  const lines: string[] = [];

  for (const driver of input.confidenceScore.confidenceDrivers) {
    if (driver.impact !== "positive" && driver.contribution < 10) continue;
    lines.push(
      fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.supportingEvidence, {
        label: driver.label,
        contribution: driver.contribution,
      })
    );
  }

  const dimensions = input.evidenceStrengthScore?.dimensions ?? [];
  for (const dimension of dimensions.filter((entry) => entry.value >= 60).slice(0, 3)) {
    lines.push(
      fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.supportingEvidenceDimension, {
        label: dimension.label,
        value: dimension.value,
      })
    );
  }

  for (const evidenceId of (input.decisionExplanation?.evidenceIds ?? []).slice(0, 3)) {
    lines.push(
      fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.supportingEvidence, {
        label: `Linked evidence ${evidenceId}`,
        contribution: Math.max(5, Math.round(input.evidenceStrength.strengthScore / 10)),
      })
    );
  }

  if (lines.length === 0) {
    lines.push(
      fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.supportingEvidence, {
        label: "Aggregate evidence strength",
        contribution: input.evidenceStrength.strengthScore,
      })
    );
  }

  return Object.freeze(lines.slice(0, 6));
}

function buildWeakeningUncertainty(input: ConfidenceExplanationBuilderInput): readonly string[] {
  if (input.uncertainty.findingCount === 0) {
    return Object.freeze([]);
  }

  return Object.freeze(
    input.uncertainty.findings.slice(0, 5).map((finding) =>
      fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.weakeningUncertainty, {
        uncertaintyLabel: finding.label,
        detail: finding.detail,
        severity: finding.severity,
      })
    )
  );
}

function buildDataImprovements(input: ConfidenceExplanationBuilderInput): readonly string[] {
  const categories = input.uncertainty.detectedCategories.length
    ? input.uncertainty.detectedCategories
    : (["missingData"] as const);

  const improvements = categories.map((categoryId) =>
    fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.dataImprovement, {
      dataCategory: DATA_IMPROVEMENT_BY_CATEGORY[categoryId],
    })
  );

  if (input.evidenceStrength.evidenceCount < 2) {
    improvements.push(
      fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.dataImprovement, {
        dataCategory: "linked recommendation evidence",
      })
    );
  }

  return Object.freeze(Array.from(new Set(improvements)).slice(0, 5));
}

function buildCanonicalExplanation(input: {
  builderInput: ConfidenceExplanationBuilderInput;
  whyConfidenceHigh: string;
  whyConfidenceLimited: string;
  supportingEvidence: readonly string[];
  weakeningUncertainty: readonly string[];
  dataImprovements: readonly string[];
}): DecisionConfidenceExplanation {
  const summaryParts = [
    fillTemplate(CONFIDENCE_EXPLANATION_TEMPLATES.rationaleSummary, {
      recommendationId: input.builderInput.recommendationId,
    }),
    input.whyConfidenceHigh,
    input.whyConfidenceLimited,
  ].filter(Boolean);

  return buildDecisionConfidenceExplanation({
    explanationId: input.builderInput.explanationId,
    confidenceLevel: input.builderInput.confidenceScore.confidenceLevel,
    summary: summaryParts.join(" "),
    evidenceSummary:
      input.supportingEvidence.length > 0
        ? input.supportingEvidence.join(" ")
        : "No supporting evidence narrative was generated.",
    uncertaintySummary:
      input.weakeningUncertainty.length > 0
        ? input.weakeningUncertainty.join(" ")
        : "No material uncertainty findings were detected.",
    evidenceIds: Object.freeze([
      input.builderInput.explanationId,
      ...((input.builderInput.decisionExplanation?.evidenceIds ?? []).slice(0, 4)),
      ...(input.supportingEvidence.length > 0 ? ["confidence:evidence"] : []),
    ]),
    uncertaintyFactorIds: Object.freeze(
      input.builderInput.uncertainty.findings.slice(0, 5).map((finding) => finding.findingId)
    ),
  });
}

export function buildConfidenceExplanationResult(
  input: ConfidenceExplanationBuilderInput
): ConfidenceExplanationResult {
  const whyConfidenceHigh = buildWhyConfidenceHigh(input);
  const whyConfidenceLimited = buildWhyConfidenceLimited(input);
  const supportingEvidence = buildSupportingEvidence(input);
  const weakeningUncertainty = buildWeakeningUncertainty(input);
  const dataImprovements = buildDataImprovements(input);
  const explanation = buildCanonicalExplanation({
    builderInput: input,
    whyConfidenceHigh,
    whyConfidenceLimited,
    supportingEvidence,
    weakeningUncertainty,
    dataImprovements,
  });

  latestConfidenceExplanationResult = Object.freeze({
    version: CONFIDENCE_EXPLANATION_BUILDER_VERSION,
    generatedAt: input.generatedAt,
    recommendationId: input.recommendationId,
    explanation,
    whyConfidenceHigh,
    whyConfidenceLimited,
    supportingEvidence,
    weakeningUncertainty,
    dataImprovements,
    templateDriven: true as const,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTICS,
  });

  return latestConfidenceExplanationResult;
}

export function getConfidenceExplanationResult(): ConfidenceExplanationResult {
  return latestConfidenceExplanationResult;
}

export function resetConfidenceExplanationBuilderForTests(): void {
  latestConfidenceExplanationResult = EMPTY_CONFIDENCE_EXPLANATION_RESULT;
}

export const ConfidenceExplanationBuilder = Object.freeze({
  buildConfidenceExplanationResult,
  getConfidenceExplanationResult,
  resetConfidenceExplanationBuilderForTests,
  diagnostics: CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTICS,
  templates: CONFIDENCE_EXPLANATION_TEMPLATES,
  emptyResult: EMPTY_CONFIDENCE_EXPLANATION_RESULT,
});
