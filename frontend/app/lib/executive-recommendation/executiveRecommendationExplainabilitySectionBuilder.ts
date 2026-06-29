/**
 * APP-12:4 — Executive Recommendation Explainability section builder.
 */

import {
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_LABELS,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import type {
  ExplanationSection,
  ExplanationSectionKey,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import type { RecommendationEvaluation } from "./executiveRecommendationEvaluationEngineTypes.ts";

function findDimensionRationale(evaluation: RecommendationEvaluation, dimensionKey: string): string {
  const dimension = evaluation.dimensions.find((entry) => entry.dimensionKey === dimensionKey);
  return dimension?.rationale ?? "No dimension rationale available.";
}

function findDimensionReadiness(evaluation: RecommendationEvaluation, dimensionKey: string): string {
  const dimension = evaluation.dimensions.find((entry) => entry.dimensionKey === dimensionKey);
  return dimension?.readiness ?? "unknown";
}

function buildSection(
  evaluation: RecommendationEvaluation,
  sectionKey: ExplanationSectionKey,
  content: string,
  evidenceIds: readonly string[]
): ExplanationSection {
  return Object.freeze({
    sectionKey,
    label: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_LABELS[sectionKey],
    content,
    evidenceIds: Object.freeze([...evidenceIds]),
    readOnly: true as const,
  });
}

function buildExecutiveSummarySection(evaluation: RecommendationEvaluation): ExplanationSection {
  const content = [
    `Recommendation ${evaluation.recommendationId} was generated from certified Nexora knowledge.`,
    evaluation.summary.narrative,
    `Evaluation readiness: ${evaluation.summary.overallReadiness}.`,
  ].join(" ");
  return buildSection(evaluation, "executive_summary", content, [
    evaluation.summary.summaryId,
    `explanation-executive-${evaluation.recommendationId}`,
  ]);
}

function buildBusinessContextSection(evaluation: RecommendationEvaluation): ExplanationSection {
  const rationale = findDimensionRationale(evaluation, "business_context_coverage");
  const content = `Business context coverage is ${findDimensionReadiness(evaluation, "business_context_coverage")}. ${rationale}`;
  return buildSection(evaluation, "business_context", content, [`explanation-business-${evaluation.recommendationId}`]);
}

function buildSupportingEvidenceSection(evaluation: RecommendationEvaluation): ExplanationSection {
  const evidenceLines = evaluation.supportingEvidence.map(
    (entry) => `- ${entry.signal}: ${entry.rationale}`
  );
  const content = `Supporting evidence (${evaluation.supportingEvidence.length} items):\n${evidenceLines.join("\n")}`;
  return buildSection(
    evaluation,
    "supporting_evidence",
    content,
    evaluation.supportingEvidence.map((entry) => entry.evidenceId)
  );
}

function buildStrategyRationaleSection(evaluation: RecommendationEvaluation): ExplanationSection {
  const rationale = findDimensionRationale(evaluation, "strategy_alignment");
  const assumptions = evaluation.evaluationNotes.filter((note) => note.includes("Category") || note.includes("Engine"));
  const content = [
    `Strategy alignment is ${findDimensionReadiness(evaluation, "strategy_alignment")}. ${rationale}`,
    assumptions.length > 0 ? `Assumptions: ${assumptions.join(" ")}` : "Assumptions: deterministic evidence synthesis without ML inference.",
  ].join(" ");
  return buildSection(evaluation, "strategy_rationale", content, [`explanation-strategy-${evaluation.recommendationId}`]);
}

function buildRiskConsiderationsSection(evaluation: RecommendationEvaluation): ExplanationSection {
  const rationale = findDimensionRationale(evaluation, "risk_awareness");
  const content = `Risk awareness is ${findDimensionReadiness(evaluation, "risk_awareness")}. ${rationale}`;
  return buildSection(evaluation, "risk_considerations", content, [`explanation-risk-${evaluation.recommendationId}`]);
}

function buildTimelineContextSection(evaluation: RecommendationEvaluation): ExplanationSection {
  const rationale = findDimensionRationale(evaluation, "timeline_consistency");
  const content = `Timeline consistency is ${findDimensionReadiness(evaluation, "timeline_consistency")}. ${rationale}`;
  return buildSection(evaluation, "timeline_context", content, [`explanation-timeline-${evaluation.recommendationId}`]);
}

function buildHistoricalLearningSection(evaluation: RecommendationEvaluation): ExplanationSection {
  const deps = Object.keys(evaluation.provenance.dependencyVersions);
  const learningApps = deps.filter((appId) => appId === "APP-10" || appId.startsWith("APP-"));
  const content = `Historical and cross-scenario knowledge referenced via dependencies: ${learningApps.join(", ") || "none"}. Cross-scenario learning (APP-10) ${deps.includes("APP-10") ? "is" : "is not"} referenced in provenance.`;
  return buildSection(evaluation, "historical_learning_references", content, [`explanation-history-${evaluation.recommendationId}`]);
}

function buildConfidenceContextSection(evaluation: RecommendationEvaluation): ExplanationSection {
  const rationale = findDimensionRationale(evaluation, "confidence_availability");
  const content = `Confidence availability is ${findDimensionReadiness(evaluation, "confidence_availability")}. ${rationale}`;
  return buildSection(evaluation, "confidence_context", content, [`explanation-confidence-${evaluation.recommendationId}`]);
}

function buildDependencySummarySection(evaluation: RecommendationEvaluation): ExplanationSection {
  const deps = Object.entries(evaluation.provenance.dependencyVersions)
    .map(([appId, version]) => `${appId}@${version}`)
    .join(", ");
  const rationale = findDimensionRationale(evaluation, "dependency_completeness");
  const content = `Dependencies (${Object.keys(evaluation.provenance.dependencyVersions).length}): ${deps}. ${rationale}`;
  return buildSection(evaluation, "dependency_summary", content, [`explanation-dependency-${evaluation.recommendationId}`]);
}

function buildProvenanceSummarySection(evaluation: RecommendationEvaluation): ExplanationSection {
  const content = [
    `Recommendation ID: ${evaluation.provenance.recommendationId}.`,
    `Workspace: ${evaluation.provenance.workspaceId}.`,
    `Platforms: ${evaluation.provenance.originatingPlatforms.join(", ")}.`,
    `Generation: ${evaluation.provenance.generationVersion}, Evaluation: ${evaluation.provenance.evaluationVersion}, Foundation: ${evaluation.provenance.foundationVersion}.`,
  ].join(" ");
  return buildSection(evaluation, "provenance_summary", content, [`explanation-provenance-${evaluation.recommendationId}`]);
}

const SECTION_BUILDERS: Readonly<
  Record<ExplanationSectionKey, (evaluation: RecommendationEvaluation) => ExplanationSection>
> = Object.freeze({
  executive_summary: buildExecutiveSummarySection,
  business_context: buildBusinessContextSection,
  supporting_evidence: buildSupportingEvidenceSection,
  strategy_rationale: buildStrategyRationaleSection,
  risk_considerations: buildRiskConsiderationsSection,
  timeline_context: buildTimelineContextSection,
  historical_learning_references: buildHistoricalLearningSection,
  confidence_context: buildConfidenceContextSection,
  dependency_summary: buildDependencySummarySection,
  provenance_summary: buildProvenanceSummarySection,
});

export function buildExplanationSection(
  evaluation: RecommendationEvaluation,
  sectionKey: ExplanationSectionKey
): ExplanationSection {
  return SECTION_BUILDERS[sectionKey](evaluation);
}

export function buildAllExplanationSections(
  evaluation: RecommendationEvaluation
): readonly ExplanationSection[] {
  return Object.freeze(
    EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS.map((key) => buildExplanationSection(evaluation, key))
  );
}

export const ExecutiveRecommendationExplainabilitySectionBuilder = Object.freeze({
  buildExplanationSection,
  buildAllExplanationSections,
});
