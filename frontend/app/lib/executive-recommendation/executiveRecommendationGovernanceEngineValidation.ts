/**
 * APP-12:5 — Executive Recommendation Governance Engine validation.
 */

import {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_CONSTRAINT_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_LIMITS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_MANDATORY_GOVERNANCE_FIELDS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_POLICY_KEYS,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import type {
  ExecutiveRecommendationGovernanceRequest,
  GovernanceDimension,
  RecommendationGovernance,
  RecommendationGovernanceProvenance,
  RecommendationGovernanceValidation,
  RecommendationGovernanceValidationIssue,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import { isRecommendationEvaluationEngineInitialized } from "./executiveRecommendationEvaluationEngine.ts";
import { validateRecommendationExplanationRecord } from "./executiveRecommendationExplainabilityEngineValidation.ts";
import type { RecommendationExplanation } from "./executiveRecommendationExplainabilityEngineTypes.ts";
import { isRecommendationExplainabilityEngineInitialized } from "./executiveRecommendationExplainabilityEngine.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import { isExecutiveRecommendationPlatformInitialized } from "./executiveRecommendationFoundation.ts";

function issue(code: string, message: string, field?: string): RecommendationGovernanceValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: RecommendationGovernanceValidationIssue[]): RecommendationGovernanceValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateGovernanceIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isGovernanceDimensionKey(value: string): value is GovernanceDimension["dimensionKey"] {
  return (EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS as readonly string[]).includes(value);
}

export function validateFoundationCompatibilityForGovernanceEngine(
  foundationInitialized: boolean
): RecommendationGovernanceValidation {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-12:1 foundation is not initialized.")]);
  }
  return result([]);
}

export function validateGenerationEngineCompatibilityForGovernance(
  generationEngineInitialized: boolean
): RecommendationGovernanceValidation {
  if (!generationEngineInitialized) {
    return result([issue("generation_incompatible", "APP-12:2 generation engine is not initialized.")]);
  }
  return result([]);
}

export function validateEvaluationEngineCompatibilityForGovernance(
  evaluationEngineInitialized: boolean
): RecommendationGovernanceValidation {
  if (!evaluationEngineInitialized) {
    return result([issue("evaluation_incompatible", "APP-12:3 evaluation engine is not initialized.")]);
  }
  return result([]);
}

export function validateExplainabilityEngineCompatibility(
  explainabilityEngineInitialized: boolean
): RecommendationGovernanceValidation {
  if (!explainabilityEngineInitialized) {
    return result([issue("explainability_incompatible", "APP-12:4 explainability engine is not initialized.")]);
  }
  return result([]);
}

export function validateGovernanceDependencies(): RecommendationGovernanceValidation {
  const foundation = validateFoundationCompatibilityForGovernanceEngine(
    isExecutiveRecommendationPlatformInitialized()
  );
  if (!foundation.valid) {
    return foundation;
  }
  const generation = validateGenerationEngineCompatibilityForGovernance(
    isRecommendationGenerationEngineInitialized()
  );
  if (!generation.valid) {
    return generation;
  }
  const evaluation = validateEvaluationEngineCompatibilityForGovernance(
    isRecommendationEvaluationEngineInitialized()
  );
  if (!evaluation.valid) {
    return evaluation;
  }
  return validateExplainabilityEngineCompatibility(isRecommendationExplainabilityEngineInitialized());
}

export function validateRecommendationGovernanceProvenance(
  provenance: RecommendationGovernanceProvenance
): RecommendationGovernanceValidation {
  const issues: RecommendationGovernanceValidationIssue[] = [];
  if (!provenance.recommendationId.trim()) {
    issues.push(issue("missing_provenance", "recommendationId is required."));
  }
  if (!provenance.evaluationId.trim()) {
    issues.push(issue("missing_provenance", "evaluationId is required."));
  }
  if (!provenance.explanationId.trim()) {
    issues.push(issue("missing_provenance", "explanationId is required."));
  }
  if (!provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "workspaceId is required."));
  }
  if (provenance.sourcePlatforms.length === 0) {
    issues.push(issue("missing_provenance", "sourcePlatforms must not be empty."));
  }
  if (Object.keys(provenance.dependencyVersions).length === 0) {
    issues.push(issue("missing_provenance", "dependencyVersions must not be empty."));
  }
  if (provenance.generationVersion !== "APP-12/2") {
    issues.push(issue("invalid_provenance", "generationVersion mismatch."));
  }
  if (provenance.evaluationVersion !== "APP-12/3") {
    issues.push(issue("invalid_provenance", "evaluationVersion mismatch."));
  }
  if (provenance.explanationVersion !== "APP-12/4") {
    issues.push(issue("invalid_provenance", "explanationVersion mismatch."));
  }
  if (provenance.governanceVersion !== EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "governanceVersion mismatch."));
  }
  if (provenance.engineVersion !== EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch."));
  }
  if (provenance.foundationVersion !== "APP-12/1") {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch."));
  }
  return result(issues);
}

function validateMandatoryFields(
  record: Record<string, unknown>,
  fields: readonly string[],
  prefix: string
): RecommendationGovernanceValidationIssue[] {
  const issues: RecommendationGovernanceValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateGovernanceDimension(dimension: GovernanceDimension): RecommendationGovernanceValidation {
  const issues: RecommendationGovernanceValidationIssue[] = [];
  if (!isGovernanceDimensionKey(dimension.dimensionKey)) {
    issues.push(issue("invalid_dimension", "Invalid dimension key.", "dimensionKey"));
  }
  if (!dimension.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!dimension.rationale.trim()) {
    issues.push(issue("missing_field", "rationale is required.", "rationale"));
  }
  return result(issues);
}

function buildExpectedGovernanceId(recommendationId: string): string {
  return `recommendation-governance-${recommendationId}`;
}

export function validateRecommendationGovernanceRecord(
  governance: RecommendationGovernance
): RecommendationGovernanceValidation {
  const issues = validateMandatoryFields(
    governance as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_GOVERNANCE_MANDATORY_GOVERNANCE_FIELDS,
    "governance"
  );
  if (governance.dimensions.length !== EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_LIMITS.maxDimensionsPerGovernance) {
    issues.push(issue("dimension_count", "Expected 10 governance dimensions."));
  }
  if (governance.constraintResults.length !== EXECUTIVE_RECOMMENDATION_GOVERNANCE_CONSTRAINT_KEYS.length) {
    issues.push(issue("constraint_count", "Expected 4 constraint results."));
  }
  if (governance.policyResults.length !== EXECUTIVE_RECOMMENDATION_GOVERNANCE_POLICY_KEYS.length) {
    issues.push(issue("policy_count", "Expected 4 policy results."));
  }
  if (governance.governanceEvidence.length === 0) {
    issues.push(issue("missing_evidence", "governanceEvidence must not be empty."));
  }
  if (governance.governanceId !== buildExpectedGovernanceId(governance.recommendationId)) {
    issues.push(issue("identity_mismatch", "governanceId must match recommendationId pattern."));
  }
  const provenanceValidation = validateRecommendationGovernanceProvenance(governance.provenance);
  if (!provenanceValidation.valid) {
    issues.push(...provenanceValidation.issues);
  }
  for (const dimension of governance.dimensions) {
    const dimensionValidation = validateGovernanceDimension(dimension);
    if (!dimensionValidation.valid) {
      issues.push(...dimensionValidation.issues);
    }
  }
  if (governance.profile.explanationId !== governance.explanationId) {
    issues.push(issue("profile_mismatch", "Profile explanationId mismatch."));
  }
  return result(issues);
}

export function validateRecommendationGovernances(
  governanceRecords: readonly RecommendationGovernance[]
): RecommendationGovernanceValidation {
  const issues: RecommendationGovernanceValidationIssue[] = [];
  const ids = governanceRecords.map((entry) => entry.governanceId);
  if (hasDuplicateGovernanceIds(ids)) {
    issues.push(issue("duplicate_ids", "Duplicate governance IDs detected."));
  }
  for (const governance of governanceRecords) {
    const validation = validateRecommendationGovernanceRecord(governance);
    if (!validation.valid) {
      issues.push(...validation.issues);
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendationGovernanceRequest(
  request: ExecutiveRecommendationGovernanceRequest
): RecommendationGovernanceValidation {
  const issues: RecommendationGovernanceValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!request.sessionLabel.trim()) {
    issues.push(issue("missing_field", "sessionLabel is required.", "sessionLabel"));
  }
  if (request.explanations.length === 0) {
    issues.push(issue("missing_field", "explanations must not be empty.", "explanations"));
  }
  if (request.explanations.length > EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_LIMITS.maxExplanationsPerRequest) {
    issues.push(issue("limit_exceeded", "Too many explanations."));
  }
  if (hasDuplicateGovernanceIds(request.explanations.map((entry) => entry.recommendationId))) {
    issues.push(issue("duplicate_ids", "Duplicate recommendation IDs in request."));
  }
  for (const explanation of request.explanations) {
    const explanationValidation = validateRecommendationExplanationRecord(explanation);
    if (!explanationValidation.valid) {
      issues.push(...explanationValidation.issues);
    }
    if (explanation.provenance.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Explanation workspace mismatch.", "workspaceId"));
    }
  }
  return result(issues);
}

export function validateRecommendationGovernance(
  input: RecommendationGovernance | ExecutiveRecommendationGovernanceRequest
): RecommendationGovernanceValidation {
  if ("explanations" in input) {
    return validateExecutiveRecommendationGovernanceRequest(input);
  }
  return validateRecommendationGovernanceRecord(input);
}
