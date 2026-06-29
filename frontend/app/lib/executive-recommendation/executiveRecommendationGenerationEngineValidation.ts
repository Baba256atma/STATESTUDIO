/**
 * APP-12:2 — Executive Recommendation Generation Engine validation.
 */

import { EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS } from "./executiveRecommendationConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_CERTIFIED_SOURCE_APPS,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_LIMITS,
  EXECUTIVE_RECOMMENDATION_GENERATION_MANDATORY_CANDIDATE_FIELDS,
  EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import { isExecutiveRecommendationDomain } from "./executiveRecommendationValidation.ts";
import type {
  CertifiedRecommendationSourceRecordInput,
  ExecutiveRecommendation,
  ExecutiveRecommendationGenerationRequest,
  RecommendationCandidate,
  RecommendationCandidateProvenance,
  RecommendationSourceReference,
  RecommendationValidationIssue,
  RecommendationValidationResult,
} from "./executiveRecommendationGenerationEngineTypes.ts";

function issue(code: string, message: string, field?: string): RecommendationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: RecommendationValidationIssue[]): RecommendationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateFoundationCompatibilityForEngine(
  foundationInitialized: boolean
): RecommendationValidationResult {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-12:1 foundation is not initialized.")]);
  }
  return result([]);
}

export function validateCertifiedRecommendationSourceRecordInput(
  record: CertifiedRecommendationSourceRecordInput
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (!record.sourceId.trim()) {
    issues.push(issue("missing_field", "sourceId is required.", "sourceId"));
  }
  if (!record.providerId.trim() || !(record.providerId in EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP)) {
    issues.push(issue("invalid_provider", "Unknown or missing providerId.", "providerId"));
  }
  if (!isExecutiveRecommendationDomain(record.domain)) {
    issues.push(issue("invalid_domain", "Invalid recommendation domain.", "domain"));
  }
  if (!record.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!record.recordId.trim()) {
    issues.push(issue("missing_field", "recordId is required.", "recordId"));
  }
  if (!record.summary.trim()) {
    issues.push(issue("missing_field", "summary is required.", "summary"));
  }
  if (!record.businessContext.trim()) {
    issues.push(issue("missing_field", "businessContext is required.", "businessContext"));
  }
  if (record.sourceApps.length === 0) {
    issues.push(issue("missing_field", "sourceApps must not be empty.", "sourceApps"));
  }
  const mapping = EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP[record.providerId];
  if (mapping && mapping.platformId !== record.platformId) {
    issues.push(issue("platform_mismatch", "platformId does not match provider mapping.", "platformId"));
  }
  if (mapping && mapping.defaultAppId !== record.appId) {
    issues.push(issue("app_mismatch", "appId does not match provider mapping.", "appId"));
  }
  return result(issues);
}

export function validateRecommendationSourceReference(
  reference: RecommendationSourceReference
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (!reference.sourceId.trim()) {
    issues.push(issue("missing_field", "sourceId is required.", "sourceId"));
  }
  if (!reference.providerId.trim()) {
    issues.push(issue("missing_field", "providerId is required.", "providerId"));
  }
  if (!isExecutiveRecommendationDomain(reference.category)) {
    issues.push(issue("invalid_domain", "Invalid category.", "category"));
  }
  return result(issues);
}

export function validateRecommendationCandidateProvenance(
  provenance: RecommendationCandidateProvenance
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (provenance.originatingPlatforms.length === 0) {
    issues.push(issue("missing_provenance", "originatingPlatforms must not be empty."));
  }
  if (provenance.sourceRecordIds.length === 0) {
    issues.push(issue("missing_provenance", "sourceRecordIds must not be empty."));
  }
  if (!provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "workspaceId is required."));
  }
  if (Object.keys(provenance.dependencyVersions).length === 0) {
    issues.push(issue("missing_provenance", "dependencyVersions must not be empty."));
  }
  if (provenance.generationVersion !== EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "generationVersion mismatch."));
  }
  if (provenance.engineVersion !== EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION) {
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
): RecommendationValidationIssue[] {
  const issues: RecommendationValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateRecommendationCandidate(candidate: RecommendationCandidate): RecommendationValidationResult {
  const issues = validateMandatoryFields(
    candidate as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_GENERATION_MANDATORY_CANDIDATE_FIELDS,
    "candidate"
  );
  if (!isExecutiveRecommendationDomain(candidate.category)) {
    issues.push(issue("invalid_category", "Invalid recommendation category.", "category"));
  }
  if (candidate.supportingEvidence.length === 0) {
    issues.push(issue("missing_evidence", "supportingEvidence must not be empty."));
  }
  if (candidate.sourceReferences.length === 0) {
    issues.push(issue("missing_references", "sourceReferences must not be empty."));
  }
  const provenanceValidation = validateRecommendationCandidateProvenance(candidate.provenance);
  if (!provenanceValidation.valid) {
    issues.push(...provenanceValidation.issues);
  }
  for (const reference of candidate.sourceReferences) {
    const referenceValidation = validateRecommendationSourceReference(reference);
    if (!referenceValidation.valid) {
      issues.push(...referenceValidation.issues);
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendation(
  recommendation: ExecutiveRecommendation
): RecommendationValidationResult {
  const candidateValidation = validateRecommendationCandidate(recommendation.candidate);
  if (!candidateValidation.valid) {
    return candidateValidation;
  }
  if (recommendation.recommendationId !== recommendation.candidate.recommendationId) {
    return result([issue("identity_mismatch", "recommendationId must match candidate.")]);
  }
  return result([]);
}

export function validateRecommendationCandidates(
  candidates: readonly RecommendationCandidate[]
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  const ids = candidates.map((entry) => entry.recommendationId);
  if (hasDuplicateIds(ids)) {
    issues.push(issue("duplicate_ids", "Duplicate recommendation IDs detected."));
  }
  for (const candidate of candidates) {
    const validation = validateRecommendationCandidate(candidate);
    if (!validation.valid) {
      issues.push(...validation.issues);
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendationGenerationRequest(
  request: ExecutiveRecommendationGenerationRequest
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!request.sessionLabel.trim()) {
    issues.push(issue("missing_field", "sessionLabel is required.", "sessionLabel"));
  }
  if (request.sourceRecords.length === 0) {
    issues.push(issue("missing_field", "sourceRecords must not be empty.", "sourceRecords"));
  }
  if (request.sourceRecords.length > EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_LIMITS.maxSourceRecords) {
    issues.push(issue("limit_exceeded", "Too many source records."));
  }
  if (hasDuplicateIds(request.sourceRecords.map((entry) => entry.sourceId))) {
    issues.push(issue("duplicate_ids", "Duplicate source IDs in request."));
  }
  for (const record of request.sourceRecords) {
    const recordValidation = validateCertifiedRecommendationSourceRecordInput(record);
    if (!recordValidation.valid) {
      issues.push(...recordValidation.issues);
    }
    if (record.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Source record workspace mismatch.", "workspaceId"));
    }
  }
  return result(issues);
}

export function validateRecommendationGeneration(
  request: ExecutiveRecommendationGenerationRequest
): RecommendationValidationResult {
  return validateExecutiveRecommendationGenerationRequest(request);
}

export function validateGenerationDependencies(): RecommendationValidationResult {
  const missing = EXECUTIVE_RECOMMENDATION_GENERATION_CERTIFIED_SOURCE_APPS.filter(
    (appId) => !Object.values(EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP).some(
      (entry) => entry.defaultAppId === appId
    ) && appId !== "DS" && appId !== "INT"
  );
  if (missing.length > 0 && EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS.length !== 10) {
    return result([issue("dependency_gap", "Certified source provider coverage incomplete.")]);
  }
  return result([]);
}

export function validateExecutiveRecommendations(
  recommendations: readonly ExecutiveRecommendation[]
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (hasDuplicateIds(recommendations.map((entry) => entry.recommendationId))) {
    issues.push(issue("duplicate_ids", "Generated recommendations contain duplicate IDs."));
  }
  for (const recommendation of recommendations) {
    const validation = validateExecutiveRecommendation(recommendation);
    if (!validation.valid) {
      issues.push(...validation.issues);
    }
  }
  return result(issues);
}
