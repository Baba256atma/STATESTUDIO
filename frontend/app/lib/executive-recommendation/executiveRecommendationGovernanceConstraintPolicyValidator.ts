/**
 * APP-12:5 — Executive Recommendation Governance constraint and policy validators.
 */

import {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_CONSTRAINT_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_POLICY_KEYS,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import type {
  GovernanceDimension,
  RecommendationConstraint,
  RecommendationPolicy,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import type { RecommendationExplanation } from "./executiveRecommendationExplainabilityEngineTypes.ts";

function findDimension(
  dimensions: readonly GovernanceDimension[],
  key: string
): GovernanceDimension | undefined {
  return dimensions.find((entry) => entry.dimensionKey === key);
}

export function validateRecommendationConstraints(
  explanation: RecommendationExplanation,
  dimensions: readonly GovernanceDimension[]
): readonly RecommendationConstraint[] {
  const risk = findDimension(dimensions, "risk_constraint_compliance");
  const timeline = findDimension(dimensions, "timeline_constraint_compliance");
  const business = findDimension(dimensions, "business_constraint_compliance");
  const resource = findDimension(dimensions, "resource_constraint_compliance");

  return Object.freeze(
    EXECUTIVE_RECOMMENDATION_GOVERNANCE_CONSTRAINT_KEYS.map((constraintKey) => {
      const mapping: Record<string, GovernanceDimension | undefined> = {
        risk_limit: risk,
        timeline_limit: timeline,
        business_boundary: business,
        resource_boundary: resource,
      };
      const dimension = mapping[constraintKey];
      const compliant = dimension?.compliance === "compliant";
      return Object.freeze({
        constraintId: `constraint-${constraintKey}-${explanation.recommendationId}`,
        constraintKey,
        compliant: compliant === true,
        rationale: dimension?.rationale ?? `No governance dimension mapped for ${constraintKey}.`,
        readOnly: true as const,
      });
    })
  );
}

export function validateRecommendationPolicies(
  explanation: RecommendationExplanation,
  dimensions: readonly GovernanceDimension[]
): readonly RecommendationPolicy[] {
  const executive = findDimension(dimensions, "executive_policy_compliance");
  const workspace = findDimension(dimensions, "workspace_governance");
  const dependency = findDimension(dimensions, "dependency_compliance");
  const provenance = findDimension(dimensions, "provenance_integrity");

  return Object.freeze(
    EXECUTIVE_RECOMMENDATION_GOVERNANCE_POLICY_KEYS.map((policyKey) => {
      const mapping: Record<string, GovernanceDimension | undefined> = {
        executive_policy: executive,
        workspace_policy: workspace,
        dependency_policy: dependency,
        provenance_policy: provenance,
      };
      const dimension = mapping[policyKey];
      const compliant = dimension?.compliance === "compliant" || dimension?.compliance === "partial";
      return Object.freeze({
        policyId: `policy-${policyKey}-${explanation.recommendationId}`,
        policyKey,
        compliant: compliant === true,
        rationale: dimension?.rationale ?? `No governance dimension mapped for ${policyKey}.`,
        readOnly: true as const,
      });
    })
  );
}

export const ExecutiveRecommendationGovernanceConstraintPolicyValidator = Object.freeze({
  validateRecommendationConstraints,
  validateRecommendationPolicies,
});
