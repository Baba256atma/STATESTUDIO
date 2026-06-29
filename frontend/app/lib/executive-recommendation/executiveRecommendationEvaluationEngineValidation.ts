/**
 * APP-12:3 — Executive Recommendation Evaluation Engine validation.
 */

import {
  EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_LIMITS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_MANDATORY_EVALUATION_FIELDS,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import type {
  EvaluationDimension,
  ExecutiveRecommendationEvaluationRequest,
  RecommendationEvaluation,
  RecommendationEvaluationProvenance,
  RecommendationEvaluationValidation,
  RecommendationEvaluationValidationIssue,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import { validateRecommendationCandidate } from "./executiveRecommendationGenerationEngineValidation.ts";
import type { RecommendationCandidate } from "./executiveRecommendationGenerationEngineTypes.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import { isExecutiveRecommendationPlatformInitialized } from "./executiveRecommendationFoundation.ts";

function issue(code: string, message: string, field?: string): RecommendationEvaluationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: RecommendationEvaluationValidationIssue[]): RecommendationEvaluationValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateEvaluationIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isEvaluationDimensionKey(value: string): value is EvaluationDimension["dimensionKey"] {
  return (EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS as readonly string[]).includes(value);
}

export function validateFoundationCompatibilityForEvaluationEngine(
  foundationInitialized: boolean
): RecommendationEvaluationValidation {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-12:1 foundation is not initialized.")]);
  }
  return result([]);
}

export function validateGenerationEngineCompatibility(
  generationEngineInitialized: boolean
): RecommendationEvaluationValidation {
  if (!generationEngineInitialized) {
    return result([issue("generation_incompatible", "APP-12:2 generation engine is not initialized.")]);
  }
  return result([]);
}

export function validateEvaluationDependencies(): RecommendationEvaluationValidation {
  const foundation = validateFoundationCompatibilityForEvaluationEngine(isExecutiveRecommendationPlatformInitialized());
  if (!foundation.valid) {
    return foundation;
  }
  return validateGenerationEngineCompatibility(isRecommendationGenerationEngineInitialized());
}

export function validateRecommendationEvaluationProvenance(
  provenance: RecommendationEvaluationProvenance
): RecommendationEvaluationValidation {
  const issues: RecommendationEvaluationValidationIssue[] = [];
  if (!provenance.recommendationId.trim()) {
    issues.push(issue("missing_provenance", "recommendationId is required."));
  }
  if (provenance.originatingPlatforms.length === 0) {
    issues.push(issue("missing_provenance", "originatingPlatforms must not be empty."));
  }
  if (!provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "workspaceId is required."));
  }
  if (Object.keys(provenance.dependencyVersions).length === 0) {
    issues.push(issue("missing_provenance", "dependencyVersions must not be empty."));
  }
  if (provenance.generationVersion !== "APP-12/2") {
    issues.push(issue("invalid_provenance", "generationVersion mismatch."));
  }
  if (provenance.evaluationVersion !== EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "evaluationVersion mismatch."));
  }
  if (provenance.engineVersion !== EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION) {
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
): RecommendationEvaluationValidationIssue[] {
  const issues: RecommendationEvaluationValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateEvaluationDimension(dimension: EvaluationDimension): RecommendationEvaluationValidation {
  const issues: RecommendationEvaluationValidationIssue[] = [];
  if (!isEvaluationDimensionKey(dimension.dimensionKey)) {
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

export function validateRecommendationEvaluationRecord(
  evaluation: RecommendationEvaluation
): RecommendationEvaluationValidation {
  const issues = validateMandatoryFields(
    evaluation as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_EVALUATION_MANDATORY_EVALUATION_FIELDS,
    "evaluation"
  );
  if (evaluation.dimensions.length !== EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_LIMITS.maxDimensionsPerEvaluation) {
    issues.push(issue("dimension_count", "Expected 10 evaluation dimensions."));
  }
  if (evaluation.supportingEvidence.length === 0) {
    issues.push(issue("missing_evidence", "supportingEvidence must not be empty."));
  }
  if (evaluation.evaluationNotes.length === 0) {
    issues.push(issue("missing_notes", "evaluationNotes must not be empty."));
  }
  if (evaluation.evaluationId !== buildExpectedEvaluationId(evaluation.recommendationId)) {
    issues.push(issue("identity_mismatch", "evaluationId must match recommendationId pattern."));
  }
  const provenanceValidation = validateRecommendationEvaluationProvenance(evaluation.provenance);
  if (!provenanceValidation.valid) {
    issues.push(...provenanceValidation.issues);
  }
  for (const dimension of evaluation.dimensions) {
    const dimensionValidation = validateEvaluationDimension(dimension);
    if (!dimensionValidation.valid) {
      issues.push(...dimensionValidation.issues);
    }
  }
  if (evaluation.profile.recommendationId !== evaluation.recommendationId) {
    issues.push(issue("profile_mismatch", "Profile recommendationId mismatch."));
  }
  return result(issues);
}

function buildExpectedEvaluationId(recommendationId: string): string {
  return `recommendation-evaluation-${recommendationId}`;
}

export function validateRecommendationEvaluations(
  evaluations: readonly RecommendationEvaluation[]
): RecommendationEvaluationValidation {
  const issues: RecommendationEvaluationValidationIssue[] = [];
  const ids = evaluations.map((entry) => entry.evaluationId);
  if (hasDuplicateEvaluationIds(ids)) {
    issues.push(issue("duplicate_ids", "Duplicate evaluation IDs detected."));
  }
  for (const evaluation of evaluations) {
    const validation = validateRecommendationEvaluationRecord(evaluation);
    if (!validation.valid) {
      issues.push(...validation.issues);
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendationEvaluationRequest(
  request: ExecutiveRecommendationEvaluationRequest
): RecommendationEvaluationValidation {
  const issues: RecommendationEvaluationValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!request.sessionLabel.trim()) {
    issues.push(issue("missing_field", "sessionLabel is required.", "sessionLabel"));
  }
  if (request.candidates.length === 0) {
    issues.push(issue("missing_field", "candidates must not be empty.", "candidates"));
  }
  if (request.candidates.length > EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_LIMITS.maxCandidatesPerRequest) {
    issues.push(issue("limit_exceeded", "Too many candidates."));
  }
  if (hasDuplicateEvaluationIds(request.candidates.map((entry) => entry.recommendationId))) {
    issues.push(issue("duplicate_ids", "Duplicate recommendation IDs in request."));
  }
  for (const candidate of request.candidates) {
    const candidateValidation = validateRecommendationCandidate(candidate);
    if (!candidateValidation.valid) {
      issues.push(...candidateValidation.issues);
    }
    if (candidate.provenance.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Candidate workspace mismatch.", "workspaceId"));
    }
  }
  return result(issues);
}

export function validateRecommendationEvaluation(
  input: RecommendationEvaluation | ExecutiveRecommendationEvaluationRequest
): RecommendationEvaluationValidation {
  if ("candidates" in input) {
    return validateExecutiveRecommendationEvaluationRequest(input);
  }
  return validateRecommendationEvaluationRecord(input);
}
