/**
 * APP-12:5 — Executive Recommendation Governance dimension evaluator.
 */

import {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import type {
  GovernanceCompliance,
  GovernanceDimension,
  GovernanceDimensionKey,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import type { RecommendationExplanation } from "./executiveRecommendationExplainabilityEngineTypes.ts";

function complianceFromCondition(compliant: boolean, partial: boolean): GovernanceCompliance {
  if (compliant) {
    return "compliant";
  }
  if (partial) {
    return "partial";
  }
  return "non_compliant";
}

function sectionContent(explanation: RecommendationExplanation, sectionKey: string): string {
  return explanation.sections.find((entry) => entry.sectionKey === sectionKey)?.content ?? "";
}

function evaluateExecutivePolicyCompliance(explanation: RecommendationExplanation): GovernanceDimension {
  const governed = explanation.readOnly === true && explanation.version === "APP-12/4";
  const partial = explanation.sections.length >= 8;
  return Object.freeze({
    dimensionKey: "executive_policy_compliance" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.executive_policy_compliance,
    compliance: complianceFromCondition(governed, partial),
    rationale: governed
      ? "Explanation is immutable and versioned per executive governance policy."
      : "Executive policy markers are incomplete on explanation record.",
    evidenceIds: Object.freeze([`governance-policy-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateStrategicAlignment(explanation: RecommendationExplanation): GovernanceDimension {
  const content = sectionContent(explanation, "strategy_rationale");
  const aligned = content.length >= 20 && !content.includes("invalid");
  const partial = content.length >= 5;
  return Object.freeze({
    dimensionKey: "strategic_alignment" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.strategic_alignment,
    compliance: complianceFromCondition(aligned, partial),
    rationale: aligned
      ? "Strategy rationale section satisfies strategic alignment governance rules."
      : "Strategy rationale section does not fully satisfy alignment rules.",
    evidenceIds: Object.freeze([`governance-strategy-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateRiskConstraintCompliance(explanation: RecommendationExplanation): GovernanceDimension {
  const content = sectionContent(explanation, "risk_considerations");
  const compliant = content.includes("Risk awareness") || content.includes("risk");
  const partial = content.length >= 10;
  return Object.freeze({
    dimensionKey: "risk_constraint_compliance" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.risk_constraint_compliance,
    compliance: complianceFromCondition(compliant, partial),
    rationale: compliant
      ? "Risk considerations section documents risk constraint validation."
      : "Risk constraint documentation is insufficient.",
    evidenceIds: Object.freeze([`governance-risk-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateTimelineConstraintCompliance(explanation: RecommendationExplanation): GovernanceDimension {
  const content = sectionContent(explanation, "timeline_context");
  const compliant = content.includes("Timeline") || content.includes("timeline");
  const partial = content.length >= 10;
  return Object.freeze({
    dimensionKey: "timeline_constraint_compliance" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.timeline_constraint_compliance,
    compliance: complianceFromCondition(compliant, partial),
    rationale: compliant
      ? "Timeline context section satisfies timeline constraint governance."
      : "Timeline constraint documentation is insufficient.",
    evidenceIds: Object.freeze([`governance-timeline-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateBusinessConstraintCompliance(explanation: RecommendationExplanation): GovernanceDimension {
  const content = sectionContent(explanation, "business_context");
  const compliant = content.length >= 20;
  const partial = content.length >= 5;
  return Object.freeze({
    dimensionKey: "business_constraint_compliance" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.business_constraint_compliance,
    compliance: complianceFromCondition(compliant, partial),
    rationale: `Business context section length ${content.length} evaluated against governance threshold.`,
    evidenceIds: Object.freeze([`governance-business-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateResourceConstraintCompliance(explanation: RecommendationExplanation): GovernanceDimension {
  const deps = Object.keys(explanation.provenance.dependencyVersions);
  const hasResource = deps.some((entry) => entry === "DS" || entry.includes("APP-"));
  const compliant = deps.length >= 3 && hasResource;
  const partial = deps.length >= 1;
  return Object.freeze({
    dimensionKey: "resource_constraint_compliance" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.resource_constraint_compliance,
    compliance: complianceFromCondition(compliant, partial),
    rationale: compliant
      ? "Dependency references satisfy resource constraint governance."
      : "Resource constraint dependency coverage is insufficient.",
    evidenceIds: Object.freeze([`governance-resource-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateDependencyCompliance(explanation: RecommendationExplanation): GovernanceDimension {
  const count = Object.keys(explanation.provenance.dependencyVersions).length;
  const compliant = count >= 4;
  const partial = count >= 2;
  return Object.freeze({
    dimensionKey: "dependency_compliance" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.dependency_compliance,
    compliance: complianceFromCondition(compliant, partial),
    rationale: `Explanation references ${count} dependency version(s) for governance validation.`,
    evidenceIds: Object.freeze([`governance-dependency-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateWorkspaceGovernance(explanation: RecommendationExplanation): GovernanceDimension {
  const workspaceId = explanation.provenance.workspaceId.trim();
  const compliant = workspaceId.length >= 3 && explanation.sourcePlatforms.length > 0;
  const partial = workspaceId.length > 0;
  return Object.freeze({
    dimensionKey: "workspace_governance" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.workspace_governance,
    compliance: complianceFromCondition(compliant, partial),
    rationale: compliant
      ? `Workspace ${workspaceId} governance markers are present with source platforms.`
      : "Workspace governance markers are incomplete.",
    evidenceIds: Object.freeze([`governance-workspace-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateProvenanceIntegrity(explanation: RecommendationExplanation): GovernanceDimension {
  const provenance = explanation.provenance;
  const compliant =
    provenance.recommendationId === explanation.recommendationId &&
    provenance.evaluationId === explanation.evaluationId &&
    provenance.generationVersion === "APP-12/2" &&
    provenance.evaluationVersion === "APP-12/3" &&
    provenance.explanationVersion === "APP-12/4";
  const partial = provenance.sourcePlatforms.length > 0;
  return Object.freeze({
    dimensionKey: "provenance_integrity" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.provenance_integrity,
    compliance: complianceFromCondition(compliant, partial),
    rationale: compliant
      ? "Provenance chain is complete across generation, evaluation, and explanation phases."
      : "Provenance chain has gaps for governance validation.",
    evidenceIds: Object.freeze([`governance-provenance-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateGovernanceCompleteness(explanation: RecommendationExplanation): GovernanceDimension {
  const complete =
    explanation.sections.length === 10 &&
    explanation.evidenceReferences.length >= 10 &&
    explanation.summary.narrative.includes("No black-box");
  const partial = explanation.sections.length >= 5;
  return Object.freeze({
    dimensionKey: "governance_completeness" as const,
    label: EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS.governance_completeness,
    compliance: complianceFromCondition(complete, partial),
    rationale: complete
      ? "All explanation sections and evidence references satisfy governance completeness."
      : "Governance completeness requirements are partially satisfied.",
    evidenceIds: Object.freeze([`governance-completeness-${explanation.recommendationId}`]),
    readOnly: true as const,
  });
}

const DIMENSION_EVALUATORS: Readonly<
  Record<GovernanceDimensionKey, (explanation: RecommendationExplanation) => GovernanceDimension>
> = Object.freeze({
  executive_policy_compliance: evaluateExecutivePolicyCompliance,
  strategic_alignment: evaluateStrategicAlignment,
  risk_constraint_compliance: evaluateRiskConstraintCompliance,
  timeline_constraint_compliance: evaluateTimelineConstraintCompliance,
  business_constraint_compliance: evaluateBusinessConstraintCompliance,
  resource_constraint_compliance: evaluateResourceConstraintCompliance,
  dependency_compliance: evaluateDependencyCompliance,
  workspace_governance: evaluateWorkspaceGovernance,
  provenance_integrity: evaluateProvenanceIntegrity,
  governance_completeness: evaluateGovernanceCompleteness,
});

export function evaluateGovernanceDimension(
  explanation: RecommendationExplanation,
  dimensionKey: GovernanceDimensionKey
): GovernanceDimension {
  return DIMENSION_EVALUATORS[dimensionKey](explanation);
}

export function evaluateAllGovernanceDimensions(
  explanation: RecommendationExplanation
): readonly GovernanceDimension[] {
  return Object.freeze(
    EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS.map((key) => evaluateGovernanceDimension(explanation, key))
  );
}

export const ExecutiveRecommendationGovernanceDimensionEvaluator = Object.freeze({
  evaluateGovernanceDimension,
  evaluateAllGovernanceDimensions,
});
