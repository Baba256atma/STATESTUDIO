/**
 * APP-12:3 — Executive Recommendation Evaluation dimension evaluator.
 */

import {
  EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import type {
  EvaluationDimension,
  EvaluationDimensionKey,
  EvaluationReadiness,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { RecommendationCandidate } from "./executiveRecommendationGenerationEngineTypes.ts";

function readinessFromCondition(passed: boolean, partial: boolean): EvaluationReadiness {
  if (passed) {
    return "complete";
  }
  if (partial) {
    return "partial";
  }
  return "insufficient";
}

function evaluateEvidenceCompleteness(candidate: RecommendationCandidate): EvaluationDimension {
  const count = candidate.supportingEvidence.length;
  const readiness = readinessFromCondition(count >= 3, count >= 1);
  return Object.freeze({
    dimensionKey: "evidence_completeness" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.evidence_completeness,
    readiness,
    rationale: `Candidate has ${count} supporting evidence item(s); minimum 3 required for complete readiness.`,
    evidenceIds: Object.freeze(
      candidate.supportingEvidence.slice(0, 3).map((entry) => entry.evidenceId)
    ),
    readOnly: true as const,
  });
}

function evaluateProvenanceIntegrity(candidate: RecommendationCandidate): EvaluationDimension {
  const provenance = candidate.provenance;
  const complete =
    provenance.originatingPlatforms.length > 0 &&
    provenance.sourceRecordIds.length > 0 &&
    provenance.workspaceId.trim().length > 0 &&
    Object.keys(provenance.dependencyVersions).length > 0 &&
    provenance.generationVersion === "APP-12/2" &&
    provenance.foundationVersion === "APP-12/1";
  const partial = provenance.originatingPlatforms.length > 0 && provenance.workspaceId.trim().length > 0;
  return Object.freeze({
    dimensionKey: "provenance_integrity" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.provenance_integrity,
    readiness: readinessFromCondition(complete, partial),
    rationale: complete
      ? "Provenance chain is complete with platforms, records, workspace, and dependency versions."
      : "Provenance chain is incomplete or missing required version markers.",
    evidenceIds: Object.freeze([`evaluation-provenance-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateBusinessContextCoverage(candidate: RecommendationCandidate): EvaluationDimension {
  const length = candidate.businessContext.trim().length;
  const readiness = readinessFromCondition(length >= 20, length >= 5);
  return Object.freeze({
    dimensionKey: "business_context_coverage" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.business_context_coverage,
    readiness,
    rationale: `Business context length is ${length} characters; 20+ required for complete coverage.`,
    evidenceIds: Object.freeze([`evaluation-context-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateStrategyAlignment(candidate: RecommendationCandidate): EvaluationDimension {
  const strategic =
    candidate.category === "strategic" ||
    candidate.reasoning.evaluatedRules.some((rule) => rule.includes("domain") || rule.includes("strategy"));
  const partial = candidate.category === "mixed" || candidate.category === "scenario";
  return Object.freeze({
    dimensionKey: "strategy_alignment" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.strategy_alignment,
    readiness: readinessFromCondition(strategic, partial),
    rationale: strategic
      ? `Category ${candidate.category} aligns with strategic evaluation criteria.`
      : `Category ${candidate.category} has limited strategic alignment signals.`,
    evidenceIds: Object.freeze([`evaluation-strategy-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateRiskAwareness(candidate: RecommendationCandidate): EvaluationDimension {
  const riskSignals =
    candidate.category === "risk" ||
    candidate.supportingEvidence.some((entry) => entry.signal.includes("risk") || entry.rationale.includes("risk"));
  const partial = candidate.sourceReferences.some((ref) => ref.appId === "APP-8" || ref.appId === "APP-9");
  return Object.freeze({
    dimensionKey: "risk_awareness" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.risk_awareness,
    readiness: readinessFromCondition(riskSignals, partial),
    rationale: riskSignals
      ? "Risk-related category or evidence signals are present."
      : "Limited risk awareness signals detected in candidate evidence.",
    evidenceIds: Object.freeze([`evaluation-risk-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateTimelineConsistency(candidate: RecommendationCandidate): EvaluationDimension {
  const timeline =
    candidate.category === "timeline" ||
    candidate.sourceReferences.some((ref) => ref.appId === "APP-5" || ref.appId === "APP-6" || ref.appId === "APP-7");
  const partial = candidate.supportingEvidence.some((entry) => entry.signal.includes("dependency"));
  return Object.freeze({
    dimensionKey: "timeline_consistency" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.timeline_consistency,
    readiness: readinessFromCondition(timeline, partial),
    rationale: timeline
      ? "Timeline category or timeline platform references are present."
      : "Timeline consistency signals are limited.",
    evidenceIds: Object.freeze([`evaluation-timeline-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateConfidenceAvailability(candidate: RecommendationCandidate): EvaluationDimension {
  const hasConfidence = Object.keys(candidate.provenance.dependencyVersions).includes("APP-9");
  const partial = candidate.sourceReferences.some((ref) => ref.appId === "APP-9");
  return Object.freeze({
    dimensionKey: "confidence_availability" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.confidence_availability,
    readiness: readinessFromCondition(hasConfidence, partial),
    rationale: hasConfidence
      ? "APP-9 confidence evolution dependency is referenced in provenance."
      : "Confidence evolution dependency is not referenced.",
    evidenceIds: Object.freeze([`evaluation-confidence-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateDependencyCompleteness(candidate: RecommendationCandidate): EvaluationDimension {
  const count = Object.keys(candidate.provenance.dependencyVersions).length;
  const readiness = readinessFromCondition(count >= 3, count >= 1);
  return Object.freeze({
    dimensionKey: "dependency_completeness" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.dependency_completeness,
    readiness,
    rationale: `Candidate references ${count} dependency version(s); 3+ required for complete readiness.`,
    evidenceIds: Object.freeze([`evaluation-dependency-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateExplainabilityCoverage(candidate: RecommendationCandidate): EvaluationDimension {
  const ruleCount = candidate.reasoning.evaluatedRules.length;
  const readiness = readinessFromCondition(ruleCount >= 4, ruleCount >= 2);
  return Object.freeze({
    dimensionKey: "explainability_coverage" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.explainability_coverage,
    readiness,
    rationale: `Reasoning includes ${ruleCount} evaluated rule(s); 4+ required for complete explainability.`,
    evidenceIds: Object.freeze([candidate.reasoning.reasoningId]),
    readOnly: true as const,
  });
}

function evaluateGovernanceReadiness(candidate: RecommendationCandidate): EvaluationDimension {
  const governed =
    candidate.readOnly === true &&
    candidate.version === "APP-12/2" &&
    candidate.reasoning.approach === "deterministic_evidence_synthesis";
  const partial = candidate.readOnly === true;
  return Object.freeze({
    dimensionKey: "governance_readiness" as const,
    label: EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS.governance_readiness,
    readiness: readinessFromCondition(governed, partial),
    rationale: governed
      ? "Candidate is immutable, versioned, and uses deterministic evidence synthesis."
      : "Governance markers are partially satisfied.",
    evidenceIds: Object.freeze([`evaluation-governance-${candidate.recommendationId}`]),
    readOnly: true as const,
  });
}

const DIMENSION_EVALUATORS: Readonly<
  Record<EvaluationDimensionKey, (candidate: RecommendationCandidate) => EvaluationDimension>
> = Object.freeze({
  evidence_completeness: evaluateEvidenceCompleteness,
  provenance_integrity: evaluateProvenanceIntegrity,
  business_context_coverage: evaluateBusinessContextCoverage,
  strategy_alignment: evaluateStrategyAlignment,
  risk_awareness: evaluateRiskAwareness,
  timeline_consistency: evaluateTimelineConsistency,
  confidence_availability: evaluateConfidenceAvailability,
  dependency_completeness: evaluateDependencyCompleteness,
  explainability_coverage: evaluateExplainabilityCoverage,
  governance_readiness: evaluateGovernanceReadiness,
});

export function evaluateRecommendationDimension(
  candidate: RecommendationCandidate,
  dimensionKey: EvaluationDimensionKey
): EvaluationDimension {
  return DIMENSION_EVALUATORS[dimensionKey](candidate);
}

export function evaluateAllRecommendationDimensions(
  candidate: RecommendationCandidate
): readonly EvaluationDimension[] {
  return Object.freeze(
    EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS.map((key) => evaluateRecommendationDimension(candidate, key))
  );
}

export const ExecutiveRecommendationEvaluationDimensionEvaluator = Object.freeze({
  evaluateRecommendationDimension,
  evaluateAllRecommendationDimensions,
});
