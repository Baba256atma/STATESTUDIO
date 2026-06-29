/**
 * APP-12:6 — Executive Recommendation Optimization Engine validation.
 */

import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_LIMITS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_MANDATORY_OPTIMIZATION_FIELDS,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import type {
  ExecutiveRecommendationOptimizationRequest,
  OptimizationDimension,
  RecommendationOptimization,
  RecommendationOptimizationProvenance,
  RecommendationOptimizationValidation,
  RecommendationOptimizationValidationIssue,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import { isRecommendationGovernanceEngineInitialized } from "./executiveRecommendationGovernanceEngine.ts";
import { validateRecommendationGovernanceRecord } from "./executiveRecommendationGovernanceEngineValidation.ts";
import type { RecommendationGovernance } from "./executiveRecommendationGovernanceEngineTypes.ts";
import { isRecommendationExplainabilityEngineInitialized } from "./executiveRecommendationExplainabilityEngine.ts";
import { isRecommendationEvaluationEngineInitialized } from "./executiveRecommendationEvaluationEngine.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import { isExecutiveRecommendationPlatformInitialized } from "./executiveRecommendationFoundation.ts";

function issue(code: string, message: string, field?: string): RecommendationOptimizationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: RecommendationOptimizationValidationIssue[]): RecommendationOptimizationValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateOptimizationIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isOptimizationDimensionKey(value: string): value is OptimizationDimension["dimensionKey"] {
  return (EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS as readonly string[]).includes(value);
}

export function validateFoundationCompatibilityForOptimizationEngine(
  foundationInitialized: boolean
): RecommendationOptimizationValidation {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-12:1 foundation is not initialized.")]);
  }
  return result([]);
}

export function validateGenerationEngineCompatibilityForOptimization(
  generationEngineInitialized: boolean
): RecommendationOptimizationValidation {
  if (!generationEngineInitialized) {
    return result([issue("generation_incompatible", "APP-12:2 generation engine is not initialized.")]);
  }
  return result([]);
}

export function validateEvaluationEngineCompatibilityForOptimization(
  evaluationEngineInitialized: boolean
): RecommendationOptimizationValidation {
  if (!evaluationEngineInitialized) {
    return result([issue("evaluation_incompatible", "APP-12:3 evaluation engine is not initialized.")]);
  }
  return result([]);
}

export function validateExplainabilityEngineCompatibilityForOptimization(
  explainabilityEngineInitialized: boolean
): RecommendationOptimizationValidation {
  if (!explainabilityEngineInitialized) {
    return result([issue("explainability_incompatible", "APP-12:4 explainability engine is not initialized.")]);
  }
  return result([]);
}

export function validateGovernanceEngineCompatibility(
  governanceEngineInitialized: boolean
): RecommendationOptimizationValidation {
  if (!governanceEngineInitialized) {
    return result([issue("governance_incompatible", "APP-12:5 governance engine is not initialized.")]);
  }
  return result([]);
}

export function validateOptimizationDependencies(): RecommendationOptimizationValidation {
  const foundation = validateFoundationCompatibilityForOptimizationEngine(
    isExecutiveRecommendationPlatformInitialized()
  );
  if (!foundation.valid) {
    return foundation;
  }
  const generation = validateGenerationEngineCompatibilityForOptimization(
    isRecommendationGenerationEngineInitialized()
  );
  if (!generation.valid) {
    return generation;
  }
  const evaluation = validateEvaluationEngineCompatibilityForOptimization(
    isRecommendationEvaluationEngineInitialized()
  );
  if (!evaluation.valid) {
    return evaluation;
  }
  const explainability = validateExplainabilityEngineCompatibilityForOptimization(
    isRecommendationExplainabilityEngineInitialized()
  );
  if (!explainability.valid) {
    return explainability;
  }
  return validateGovernanceEngineCompatibility(isRecommendationGovernanceEngineInitialized());
}

export function validateRecommendationOptimizationProvenance(
  provenance: RecommendationOptimizationProvenance
): RecommendationOptimizationValidation {
  const issues: RecommendationOptimizationValidationIssue[] = [];
  if (!provenance.recommendationId.trim()) {
    issues.push(issue("missing_provenance", "recommendationId is required."));
  }
  if (!provenance.governanceId.trim()) {
    issues.push(issue("missing_provenance", "governanceId is required."));
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
  if (provenance.governanceVersion !== "APP-12/5") {
    issues.push(issue("invalid_provenance", "governanceVersion mismatch."));
  }
  if (provenance.optimizationVersion !== EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "optimizationVersion mismatch."));
  }
  if (provenance.engineVersion !== EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION) {
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
): RecommendationOptimizationValidationIssue[] {
  const issues: RecommendationOptimizationValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateOptimizationDimension(dimension: OptimizationDimension): RecommendationOptimizationValidation {
  const issues: RecommendationOptimizationValidationIssue[] = [];
  if (!isOptimizationDimensionKey(dimension.dimensionKey)) {
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

function buildExpectedOptimizationId(recommendationId: string): string {
  return `recommendation-optimization-${recommendationId}`;
}

export function validateRecommendationOptimizationRecord(
  optimization: RecommendationOptimization
): RecommendationOptimizationValidation {
  const issues = validateMandatoryFields(
    optimization as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_OPTIMIZATION_MANDATORY_OPTIMIZATION_FIELDS,
    "optimization"
  );
  if (optimization.dimensions.length !== EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_LIMITS.maxDimensionsPerOptimization) {
    issues.push(issue("dimension_count", "Expected 10 optimization dimensions."));
  }
  if (optimization.improvements.length === 0) {
    issues.push(issue("missing_improvements", "improvements must not be empty."));
  }
  if (optimization.optimizationEvidence.length === 0) {
    issues.push(issue("missing_evidence", "optimizationEvidence must not be empty."));
  }
  if (optimization.optimizationId !== buildExpectedOptimizationId(optimization.recommendationId)) {
    issues.push(issue("identity_mismatch", "optimizationId must match recommendationId pattern."));
  }
  if (optimization.variant.intentPreserved !== true || optimization.variant.governancePreserved !== true) {
    issues.push(issue("variant_integrity", "Variant must preserve intent and governance."));
  }
  const provenanceValidation = validateRecommendationOptimizationProvenance(optimization.provenance);
  if (!provenanceValidation.valid) {
    issues.push(...provenanceValidation.issues);
  }
  for (const dimension of optimization.dimensions) {
    const dimensionValidation = validateOptimizationDimension(dimension);
    if (!dimensionValidation.valid) {
      issues.push(...dimensionValidation.issues);
    }
  }
  if (optimization.profile.variantId !== optimization.variant.variantId) {
    issues.push(issue("profile_mismatch", "Profile variantId mismatch."));
  }
  return result(issues);
}

export function validateRecommendationOptimizations(
  optimizations: readonly RecommendationOptimization[]
): RecommendationOptimizationValidation {
  const issues: RecommendationOptimizationValidationIssue[] = [];
  const ids = optimizations.map((entry) => entry.optimizationId);
  if (hasDuplicateOptimizationIds(ids)) {
    issues.push(issue("duplicate_ids", "Duplicate optimization IDs detected."));
  }
  for (const optimization of optimizations) {
    const validation = validateRecommendationOptimizationRecord(optimization);
    if (!validation.valid) {
      issues.push(...validation.issues);
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendationOptimizationRequest(
  request: ExecutiveRecommendationOptimizationRequest
): RecommendationOptimizationValidation {
  const issues: RecommendationOptimizationValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!request.sessionLabel.trim()) {
    issues.push(issue("missing_field", "sessionLabel is required.", "sessionLabel"));
  }
  if (request.governanceRecords.length === 0) {
    issues.push(issue("missing_field", "governanceRecords must not be empty.", "governanceRecords"));
  }
  if (request.governanceRecords.length > EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_LIMITS.maxGovernanceRecordsPerRequest) {
    issues.push(issue("limit_exceeded", "Too many governance records."));
  }
  if (hasDuplicateOptimizationIds(request.governanceRecords.map((entry) => entry.recommendationId))) {
    issues.push(issue("duplicate_ids", "Duplicate recommendation IDs in request."));
  }
  for (const governance of request.governanceRecords) {
    const governanceValidation = validateRecommendationGovernanceRecord(governance);
    if (!governanceValidation.valid) {
      issues.push(...governanceValidation.issues);
    }
    if (governance.provenance.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Governance workspace mismatch.", "workspaceId"));
    }
  }
  return result(issues);
}

export function validateRecommendationOptimization(
  input: RecommendationOptimization | ExecutiveRecommendationOptimizationRequest
): RecommendationOptimizationValidation {
  if ("governanceRecords" in input) {
    return validateExecutiveRecommendationOptimizationRequest(input);
  }
  return validateRecommendationOptimizationRecord(input);
}

export function isGovernanceEligibleForOptimization(governance: RecommendationGovernance): boolean {
  return governance.summary.overallCompliance !== "non_compliant";
}
