/**
 * APP-10:1 — Cross-Scenario Learning Platform validation.
 */

import {
  CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS,
  CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_CANDIDATE_FIELDS,
  CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_CONTEXT_FIELDS,
  CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_SESSION_FIELDS,
  CROSS_SCENARIO_LEARNING_MANDATORY_SCENARIO_SNAPSHOT_FIELDS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_ID,
  CROSS_SCENARIO_LEARNING_RESERVED_SESSION_IDS,
  CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
} from "./crossScenarioLearningConstants.ts";
import type {
  CrossScenarioLearningPlatformIdentity,
  CrossScenarioLearningValidationIssue,
  CrossScenarioLearningValidationResult,
  LearningCandidate,
  LearningCandidateRegistrationInput,
  LearningContext,
  LearningMetadataExtensionRegistration,
  LearningSession,
  LearningSessionRegistrationInput,
  LearningSessionStatus,
  LearningSourceType,
  LearningCandidateStatus,
  LearningWorkspaceId,
  ScenarioSnapshot,
} from "./crossScenarioLearningTypes.ts";

function issue(code: string, message: string, field?: string): CrossScenarioLearningValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: CrossScenarioLearningValidationIssue[]): CrossScenarioLearningValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isLearningSourceType(value: string): value is LearningSourceType {
  return (CROSS_SCENARIO_LEARNING_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isLearningSessionStatus(value: string): value is LearningSessionStatus {
  return (CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS as readonly string[]).includes(value);
}

export function isLearningCandidateStatus(value: string): value is LearningCandidateStatus {
  return (CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS as readonly string[]).includes(value);
}

export function isReservedLearningSessionId(sessionId: string): boolean {
  return (CROSS_SCENARIO_LEARNING_RESERVED_SESSION_IDS as readonly string[]).includes(sessionId);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validatePlatformIdentity(
  identity: CrossScenarioLearningPlatformIdentity
): CrossScenarioLearningValidationResult {
  const issues: CrossScenarioLearningValidationIssue[] = [];
  if (identity.appId !== "APP-10") {
    issues.push(issue("invalid_identity", "appId must be APP-10.", "appId"));
  }
  if (identity.platformId !== CROSS_SCENARIO_LEARNING_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  return result(issues);
}

export function validateVersionCompatibility(version: string): CrossScenarioLearningValidationResult {
  if (version !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    return result([
      issue(
        "version_incompatible",
        `Version ${version} is not compatible with ${CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION}.`,
        "version"
      ),
    ]);
  }
  return result([]);
}

export function validateWorkspaceIsolation(
  workspaceId: LearningWorkspaceId,
  recordWorkspaceId: LearningWorkspaceId
): CrossScenarioLearningValidationResult {
  const issues: CrossScenarioLearningValidationIssue[] = [];
  if (!workspaceId.trim() || !recordWorkspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required for isolation validation.", "workspaceId"));
  } else if (workspaceId !== recordWorkspaceId) {
    issues.push(issue("workspace_isolation", "Workspace isolation violation.", "workspaceId"));
  }
  return result(issues);
}

export function validateSessionIdentity(sessionId: string): CrossScenarioLearningValidationResult {
  const issues: CrossScenarioLearningValidationIssue[] = [];
  if (!sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  } else if (!/^cross-scenario-learning-[a-z0-9-]+$/.test(sessionId)) {
    issues.push(issue("invalid_identity", "sessionId must match cross-scenario-learning-* pattern.", "sessionId"));
  } else if (isReservedLearningSessionId(sessionId)) {
    issues.push(issue("reserved_identity", "sessionId is reserved.", "sessionId"));
  }
  return result(issues);
}

function validateMandatoryFields(
  record: Record<string, unknown>,
  mandatoryFields: readonly string[]
): CrossScenarioLearningValidationIssue[] {
  const issues: CrossScenarioLearningValidationIssue[] = [];
  for (const field of mandatoryFields) {
    const value = record[field];
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  return issues;
}

export function validateScenarioSnapshotContractShape(
  snapshot: ScenarioSnapshot
): CrossScenarioLearningValidationResult {
  const issues = validateMandatoryFields(
    snapshot as unknown as Record<string, unknown>,
    CROSS_SCENARIO_LEARNING_MANDATORY_SCENARIO_SNAPSHOT_FIELDS
  );
  if (!isLearningSourceType(snapshot.sourceType)) {
    issues.push(issue("invalid_source", "sourceType is invalid.", "sourceType"));
  }
  if (snapshot.version !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (snapshot.readOnly !== true) {
    issues.push(issue("invalid_contract", "ScenarioSnapshot must be read-only.", "readOnly"));
  }
  return result(issues);
}

export function validateLearningCandidateContractShape(
  candidate: LearningCandidate
): CrossScenarioLearningValidationResult {
  const issues = validateMandatoryFields(
    candidate as unknown as Record<string, unknown>,
    CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_CANDIDATE_FIELDS
  );
  if (!isLearningSourceType(candidate.sourceType)) {
    issues.push(issue("invalid_source", "sourceType is invalid.", "sourceType"));
  }
  if (!isLearningCandidateStatus(candidate.status)) {
    issues.push(issue("invalid_status", "status is invalid.", "status"));
  }
  if (candidate.version !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  return result(issues);
}

export function validateLearningContextContractShape(
  context: LearningContext
): CrossScenarioLearningValidationResult {
  const issues = validateMandatoryFields(
    context as unknown as Record<string, unknown>,
    CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_CONTEXT_FIELDS
  );
  if (context.sourceTypes.length === 0) {
    issues.push(issue("missing_field", "sourceTypes must not be empty.", "sourceTypes"));
  }
  for (const sourceType of context.sourceTypes) {
    if (!isLearningSourceType(sourceType)) {
      issues.push(issue("invalid_source", `Invalid sourceType: ${sourceType}.`, "sourceTypes"));
    }
  }
  if (context.version !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  return result(issues);
}

export function validateLearningSessionContractShape(
  session: LearningSession
): CrossScenarioLearningValidationResult {
  const issues = validateMandatoryFields(
    session as unknown as Record<string, unknown>,
    CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_SESSION_FIELDS
  );
  if (!isLearningSessionStatus(session.status)) {
    issues.push(issue("invalid_status", "status is invalid.", "status"));
  }
  if (session.sourceTypes.length === 0) {
    issues.push(issue("missing_field", "sourceTypes must not be empty.", "sourceTypes"));
  }
  if (session.sourceTypes.length > CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS.maxSourceTypesPerSession) {
    issues.push(issue("limit_exceeded", "sourceTypes exceeds session limit.", "sourceTypes"));
  }
  if (session.version !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  return result(issues);
}

export function validateLearningSessionRegistration(
  input: LearningSessionRegistrationInput
): CrossScenarioLearningValidationResult {
  const issues: CrossScenarioLearningValidationIssue[] = [];
  issues.push(...validateSessionIdentity(input.sessionId).issues);
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.label.trim() || input.label.length > CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS.maxSessionLabelLength) {
    issues.push(issue("invalid_field", "label is required and must be within limits.", "label"));
  }
  if (
    !input.description.trim() ||
    input.description.length > CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS.maxSessionDescriptionLength
  ) {
    issues.push(issue("invalid_field", "description is required and must be within limits.", "description"));
  }
  if (input.sourceTypes.length === 0) {
    issues.push(issue("missing_field", "sourceTypes must not be empty.", "sourceTypes"));
  }
  for (const sourceType of input.sourceTypes) {
    if (!isLearningSourceType(sourceType)) {
      issues.push(issue("invalid_source", `Invalid sourceType: ${sourceType}.`, "sourceTypes"));
    }
  }
  return result(issues);
}

export function validateLearningCandidateRegistration(
  input: LearningCandidateRegistrationInput
): CrossScenarioLearningValidationResult {
  const issues: CrossScenarioLearningValidationIssue[] = [];
  if (!input.candidateId.trim()) {
    issues.push(issue("missing_field", "candidateId is required.", "candidateId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!input.snapshotId.trim()) {
    issues.push(issue("missing_field", "snapshotId is required.", "snapshotId"));
  }
  if (!isLearningSourceType(input.sourceType)) {
    issues.push(issue("invalid_source", "sourceType is invalid.", "sourceType"));
  }
  if (!input.label.trim() || input.label.length > CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS.maxCandidateLabelLength) {
    issues.push(issue("invalid_field", "label is required and must be within limits.", "label"));
  }
  if (
    !input.description.trim() ||
    input.description.length > CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS.maxCandidateDescriptionLength
  ) {
    issues.push(issue("invalid_field", "description is required and must be within limits.", "description"));
  }
  return result(issues);
}

export function validateMetadataExtensionRegistration(
  input: LearningMetadataExtensionRegistration
): CrossScenarioLearningValidationResult {
  const issues: CrossScenarioLearningValidationIssue[] = [];
  if (!input.extensionId.trim()) {
    issues.push(issue("missing_field", "extensionId is required.", "extensionId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}
