/**
 * APP-12:4 — Executive Recommendation Explainability Engine validation.
 */

import {
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_LIMITS,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_MANDATORY_EXPLANATION_FIELDS,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import type {
  ExecutiveRecommendationExplainabilityRequest,
  ExplanationSection,
  ExplanationValidationIssue,
  ExplanationValidationResult,
  RecommendationExplanation,
  RecommendationExplanationProvenance,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import { isRecommendationEvaluationEngineInitialized } from "./executiveRecommendationEvaluationEngine.ts";
import { validateRecommendationEvaluationRecord } from "./executiveRecommendationEvaluationEngineValidation.ts";
import type { RecommendationEvaluation } from "./executiveRecommendationEvaluationEngineTypes.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import { isExecutiveRecommendationPlatformInitialized } from "./executiveRecommendationFoundation.ts";

function issue(code: string, message: string, field?: string): ExplanationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExplanationValidationIssue[]): ExplanationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateExplanationIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isExplanationSectionKey(value: string): value is ExplanationSection["sectionKey"] {
  return (EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS as readonly string[]).includes(value);
}

export function validateFoundationCompatibilityForExplainabilityEngine(
  foundationInitialized: boolean
): ExplanationValidationResult {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-12:1 foundation is not initialized.")]);
  }
  return result([]);
}

export function validateGenerationEngineCompatibilityForExplainability(
  generationEngineInitialized: boolean
): ExplanationValidationResult {
  if (!generationEngineInitialized) {
    return result([issue("generation_incompatible", "APP-12:2 generation engine is not initialized.")]);
  }
  return result([]);
}

export function validateEvaluationEngineCompatibility(
  evaluationEngineInitialized: boolean
): ExplanationValidationResult {
  if (!evaluationEngineInitialized) {
    return result([issue("evaluation_incompatible", "APP-12:3 evaluation engine is not initialized.")]);
  }
  return result([]);
}

export function validateExplainabilityDependencies(): ExplanationValidationResult {
  const foundation = validateFoundationCompatibilityForExplainabilityEngine(
    isExecutiveRecommendationPlatformInitialized()
  );
  if (!foundation.valid) {
    return foundation;
  }
  const generation = validateGenerationEngineCompatibilityForExplainability(
    isRecommendationGenerationEngineInitialized()
  );
  if (!generation.valid) {
    return generation;
  }
  return validateEvaluationEngineCompatibility(isRecommendationEvaluationEngineInitialized());
}

export function validateRecommendationExplanationProvenance(
  provenance: RecommendationExplanationProvenance
): ExplanationValidationResult {
  const issues: ExplanationValidationIssue[] = [];
  if (!provenance.recommendationId.trim()) {
    issues.push(issue("missing_provenance", "recommendationId is required."));
  }
  if (!provenance.evaluationId.trim()) {
    issues.push(issue("missing_provenance", "evaluationId is required."));
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
  if (provenance.explanationVersion !== EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "explanationVersion mismatch."));
  }
  if (provenance.engineVersion !== EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION) {
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
): ExplanationValidationIssue[] {
  const issues: ExplanationValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateExplanationSection(section: ExplanationSection): ExplanationValidationResult {
  const issues: ExplanationValidationIssue[] = [];
  if (!isExplanationSectionKey(section.sectionKey)) {
    issues.push(issue("invalid_section", "Invalid section key.", "sectionKey"));
  }
  if (!section.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!section.content.trim()) {
    issues.push(issue("missing_field", "content is required.", "content"));
  }
  return result(issues);
}

function buildExpectedExplanationId(recommendationId: string): string {
  return `recommendation-explanation-${recommendationId}`;
}

export function validateRecommendationExplanationRecord(
  explanation: RecommendationExplanation
): ExplanationValidationResult {
  const issues = validateMandatoryFields(
    explanation as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_MANDATORY_EXPLANATION_FIELDS,
    "explanation"
  );
  if (explanation.sections.length !== EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_LIMITS.maxSectionsPerExplanation) {
    issues.push(issue("section_count", "Expected 10 explanation sections."));
  }
  if (explanation.evidenceReferences.length === 0) {
    issues.push(issue("missing_evidence", "evidenceReferences must not be empty."));
  }
  if (explanation.sourcePlatforms.length === 0) {
    issues.push(issue("missing_platforms", "sourcePlatforms must not be empty."));
  }
  if (explanation.explanationId !== buildExpectedExplanationId(explanation.recommendationId)) {
    issues.push(issue("identity_mismatch", "explanationId must match recommendationId pattern."));
  }
  const provenanceValidation = validateRecommendationExplanationProvenance(explanation.provenance);
  if (!provenanceValidation.valid) {
    issues.push(...provenanceValidation.issues);
  }
  for (const section of explanation.sections) {
    const sectionValidation = validateExplanationSection(section);
    if (!sectionValidation.valid) {
      issues.push(...sectionValidation.issues);
    }
  }
  if (explanation.profile.evaluationId !== explanation.evaluationId) {
    issues.push(issue("profile_mismatch", "Profile evaluationId mismatch."));
  }
  return result(issues);
}

export function validateRecommendationExplanations(
  explanations: readonly RecommendationExplanation[]
): ExplanationValidationResult {
  const issues: ExplanationValidationIssue[] = [];
  const ids = explanations.map((entry) => entry.explanationId);
  if (hasDuplicateExplanationIds(ids)) {
    issues.push(issue("duplicate_ids", "Duplicate explanation IDs detected."));
  }
  for (const explanation of explanations) {
    const validation = validateRecommendationExplanationRecord(explanation);
    if (!validation.valid) {
      issues.push(...validation.issues);
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendationExplainabilityRequest(
  request: ExecutiveRecommendationExplainabilityRequest
): ExplanationValidationResult {
  const issues: ExplanationValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!request.sessionLabel.trim()) {
    issues.push(issue("missing_field", "sessionLabel is required.", "sessionLabel"));
  }
  if (request.evaluations.length === 0) {
    issues.push(issue("missing_field", "evaluations must not be empty.", "evaluations"));
  }
  if (request.evaluations.length > EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_LIMITS.maxEvaluationsPerRequest) {
    issues.push(issue("limit_exceeded", "Too many evaluations."));
  }
  if (hasDuplicateExplanationIds(request.evaluations.map((entry) => entry.recommendationId))) {
    issues.push(issue("duplicate_ids", "Duplicate recommendation IDs in request."));
  }
  for (const evaluation of request.evaluations) {
    const evaluationValidation = validateRecommendationEvaluationRecord(evaluation);
    if (!evaluationValidation.valid) {
      issues.push(...evaluationValidation.issues);
    }
    if (evaluation.provenance.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Evaluation workspace mismatch.", "workspaceId"));
    }
  }
  return result(issues);
}

export function validateRecommendationExplanation(
  input: RecommendationExplanation | ExecutiveRecommendationExplainabilityRequest
): ExplanationValidationResult {
  if ("evaluations" in input) {
    return validateExecutiveRecommendationExplainabilityRequest(input);
  }
  return validateRecommendationExplanationRecord(input);
}
