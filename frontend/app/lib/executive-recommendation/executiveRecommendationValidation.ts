/**
 * APP-12:1 — Executive Recommendation Platform validation.
 */

import {
  EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS,
  EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
  EXECUTIVE_RECOMMENDATION_MANDATORY_CANDIDATE_FIELDS,
  EXECUTIVE_RECOMMENDATION_MANDATORY_CONTEXT_FIELDS,
  EXECUTIVE_RECOMMENDATION_MANDATORY_REQUEST_FIELDS,
  EXECUTIVE_RECOMMENDATION_MANDATORY_SESSION_FIELDS,
  EXECUTIVE_RECOMMENDATION_MANDATORY_SOURCE_PROVIDER_FIELDS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_ID,
  EXECUTIVE_RECOMMENDATION_RESERVED_SESSION_IDS,
  EXECUTIVE_RECOMMENDATION_RESERVED_METADATA_KEYS,
  EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS,
  EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY,
} from "./executiveRecommendationConstants.ts";
import type {
  ExecutiveRecommendationCandidate,
  ExecutiveRecommendationCandidateRegistrationInput,
  ExecutiveRecommendationCandidateStatus,
  ExecutiveRecommendationContext,
  ExecutiveRecommendationDomainKey,
  ExecutiveRecommendationMetadataExtensionRegistration,
  ExecutiveRecommendationPlatformIdentity,
  ExecutiveRecommendationRequest,
  ExecutiveRecommendationSession,
  ExecutiveRecommendationSessionRegistrationInput,
  ExecutiveRecommendationSessionStatus,
  ExecutiveRecommendationSourceProvider,
  ExecutiveRecommendationValidationIssue,
  ExecutiveRecommendationValidationResult,
  ExecutiveRecommendationWorkspaceId,
} from "./executiveRecommendationTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveRecommendationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveRecommendationValidationIssue[]): ExecutiveRecommendationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isExecutiveRecommendationDomain(value: string): value is ExecutiveRecommendationDomainKey {
  return (EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS as readonly string[]).includes(value);
}

export function isExecutiveRecommendationSessionStatus(value: string): value is ExecutiveRecommendationSessionStatus {
  return (EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS as readonly string[]).includes(value);
}

export function isExecutiveRecommendationCandidateStatus(value: string): value is ExecutiveRecommendationCandidateStatus {
  return (EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS as readonly string[]).includes(value);
}

export function isReservedExecutiveRecommendationSessionId(sessionId: string): boolean {
  return (EXECUTIVE_RECOMMENDATION_RESERVED_SESSION_IDS as readonly string[]).includes(sessionId);
}

export function isRegisteredSourceProviderId(providerId: string): boolean {
  return EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY.some((entry) => entry.providerId === providerId);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validatePlatformIdentity(
  identity: ExecutiveRecommendationPlatformIdentity
): ExecutiveRecommendationValidationResult {
  const issues: ExecutiveRecommendationValidationIssue[] = [];
  if (identity.appId !== "APP-12") {
    issues.push(issue("invalid_identity", "appId must be APP-12.", "appId"));
  }
  if (identity.platformId !== EXECUTIVE_RECOMMENDATION_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  return result(issues);
}

export function validateVersionCompatibility(version: string): ExecutiveRecommendationValidationResult {
  if (version !== EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION) {
    return result([issue("invalid_version", "Unsupported contract version.", "version")]);
  }
  return result([]);
}

export function validateSessionIdentity(sessionId: string): ExecutiveRecommendationValidationResult {
  const issues: ExecutiveRecommendationValidationIssue[] = [];
  if (!sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (isReservedExecutiveRecommendationSessionId(sessionId)) {
    issues.push(issue("reserved_session", "sessionId is reserved.", "sessionId"));
  }
  return result(issues);
}

export function validateWorkspaceIsolation(
  leftWorkspaceId: ExecutiveRecommendationWorkspaceId,
  rightWorkspaceId: ExecutiveRecommendationWorkspaceId
): ExecutiveRecommendationValidationResult {
  if (leftWorkspaceId !== rightWorkspaceId) {
    return result([issue("workspace_isolation", "Workspace isolation violation.", "workspaceId")]);
  }
  return result([]);
}

function validateMandatoryFields(
  record: Record<string, unknown>,
  fields: readonly string[],
  prefix: string
): ExecutiveRecommendationValidationIssue[] {
  const issues: ExecutiveRecommendationValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateExecutiveRecommendationRequestContractShape(
  request: ExecutiveRecommendationRequest
): ExecutiveRecommendationValidationResult {
  const issues = validateMandatoryFields(
    request as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_MANDATORY_REQUEST_FIELDS,
    "request"
  );
  if (!isExecutiveRecommendationDomain(request.domain)) {
    issues.push(issue("invalid_domain", "Invalid recommendation domain.", "domain"));
  }
  if (request.version !== EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Request version mismatch.", "version"));
  }
  return result(issues);
}

export function validateExecutiveRecommendationContextContractShape(
  context: ExecutiveRecommendationContext
): ExecutiveRecommendationValidationResult {
  const issues = validateMandatoryFields(
    context as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_MANDATORY_CONTEXT_FIELDS,
    "context"
  );
  if (context.domains.some((entry) => !isExecutiveRecommendationDomain(entry))) {
    issues.push(issue("invalid_domain", "Invalid recommendation domain in context.", "domains"));
  }
  if (hasDuplicateIds([...context.domains])) {
    issues.push(issue("duplicate_domain", "Duplicate domains in context.", "domains"));
  }
  return result(issues);
}

export function validateExecutiveRecommendationCandidateContractShape(
  candidate: ExecutiveRecommendationCandidate
): ExecutiveRecommendationValidationResult {
  const issues = validateMandatoryFields(
    candidate as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_MANDATORY_CANDIDATE_FIELDS,
    "candidate"
  );
  if (!isExecutiveRecommendationDomain(candidate.domain)) {
    issues.push(issue("invalid_domain", "Invalid recommendation domain.", "domain"));
  }
  if (!isExecutiveRecommendationCandidateStatus(candidate.status)) {
    issues.push(issue("invalid_status", "Invalid candidate status.", "status"));
  }
  if (!isRegisteredSourceProviderId(candidate.sourceProviderId)) {
    issues.push(issue("invalid_provider", "Unknown source provider.", "sourceProviderId"));
  }
  return result(issues);
}

export function validateExecutiveRecommendationSessionContractShape(
  session: ExecutiveRecommendationSession
): ExecutiveRecommendationValidationResult {
  const issues = validateMandatoryFields(
    session as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_MANDATORY_SESSION_FIELDS,
    "session"
  );
  if (session.domains.some((entry) => !isExecutiveRecommendationDomain(entry))) {
    issues.push(issue("invalid_domain", "Invalid recommendation domain in session.", "domains"));
  }
  if (!isExecutiveRecommendationSessionStatus(session.status)) {
    issues.push(issue("invalid_status", "Invalid session status.", "status"));
  }
  return result(issues);
}

export function validateExecutiveRecommendationSourceProviderContractShape(
  provider: ExecutiveRecommendationSourceProvider
): ExecutiveRecommendationValidationResult {
  const issues = validateMandatoryFields(
    provider as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_MANDATORY_SOURCE_PROVIDER_FIELDS,
    "provider"
  );
  if (provider.consumerOnly !== true) {
    issues.push(issue("invalid_provider", "Source provider must be consumer-only.", "consumerOnly"));
  }
  return result(issues);
}

export function validateExecutiveRecommendationSessionRegistration(
  input: ExecutiveRecommendationSessionRegistrationInput
): ExecutiveRecommendationValidationResult {
  const issues: ExecutiveRecommendationValidationIssue[] = [];
  if (!input.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.label.trim() || input.label.length > EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS.maxSessionLabelLength) {
    issues.push(issue("invalid_label", "Session label is invalid.", "label"));
  }
  if (
    !input.description.trim() ||
    input.description.length > EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS.maxSessionDescriptionLength
  ) {
    issues.push(issue("invalid_description", "Session description is invalid.", "description"));
  }
  if (input.domains.length === 0) {
    issues.push(issue("missing_field", "At least one domain is required.", "domains"));
  }
  if (input.domains.length > EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS.maxDomainsPerSession) {
    issues.push(issue("invalid_domains", "Too many domains for session.", "domains"));
  }
  if (input.domains.some((entry) => !isExecutiveRecommendationDomain(entry))) {
    issues.push(issue("invalid_domain", "Invalid recommendation domain.", "domains"));
  }
  if (hasDuplicateIds([...input.domains])) {
    issues.push(issue("duplicate_domain", "Duplicate domains in session registration.", "domains"));
  }
  if (isReservedExecutiveRecommendationSessionId(input.sessionId)) {
    issues.push(issue("reserved_session", "sessionId is reserved.", "sessionId"));
  }
  return result(issues);
}

export function validateExecutiveRecommendationCandidateRegistration(
  input: ExecutiveRecommendationCandidateRegistrationInput
): ExecutiveRecommendationValidationResult {
  const issues: ExecutiveRecommendationValidationIssue[] = [];
  if (!input.candidateId.trim()) {
    issues.push(issue("missing_field", "candidateId is required.", "candidateId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!isExecutiveRecommendationDomain(input.domain)) {
    issues.push(issue("invalid_domain", "Invalid recommendation domain.", "domain"));
  }
  if (!isRegisteredSourceProviderId(input.sourceProviderId)) {
    issues.push(issue("invalid_provider", "Unknown source provider.", "sourceProviderId"));
  }
  if (!input.sourceReferenceId.trim()) {
    issues.push(issue("missing_field", "sourceReferenceId is required.", "sourceReferenceId"));
  }
  if (!input.label.trim() || input.label.length > EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS.maxCandidateLabelLength) {
    issues.push(issue("invalid_label", "Candidate label is invalid.", "label"));
  }
  if (
    !input.description.trim() ||
    input.description.length > EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS.maxCandidateDescriptionLength
  ) {
    issues.push(issue("invalid_description", "Candidate description is invalid.", "description"));
  }
  return result(issues);
}

export function validateMetadataExtensionRegistration(
  input: ExecutiveRecommendationMetadataExtensionRegistration
): ExecutiveRecommendationValidationResult {
  const issues: ExecutiveRecommendationValidationIssue[] = [];
  if (!input.extensionId.trim()) {
    issues.push(issue("missing_field", "extensionId is required.", "extensionId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (
    (EXECUTIVE_RECOMMENDATION_RESERVED_METADATA_KEYS as readonly string[]).includes(input.extensionId) ||
    input.extensionId.startsWith("executive-recommendation-reserved")
  ) {
    issues.push(issue("reserved_extension", "extensionId is reserved.", "extensionId"));
  }
  return result(issues);
}
