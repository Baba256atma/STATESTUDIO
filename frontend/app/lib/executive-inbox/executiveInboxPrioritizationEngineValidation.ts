/**
 * APP-11:3 — Executive Inbox Prioritization Engine validation.
 */

import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { isExecutiveInboxAggregationInitialized } from "./executiveInboxAggregationEngine.ts";
import { EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { isExecutiveInboxPlatformInitialized } from "./executiveInboxFoundation.ts";
import { validateExecutiveInboxItem } from "./executiveInboxAggregationEngineValidation.ts";
import {
  EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_LIMITS,
  EXECUTIVE_INBOX_PRIORITIZATION_MANDATORY_PRIORITY_FIELDS,
  EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS,
  EXECUTIVE_INBOX_PRIORITY_LEVEL_KEYS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import type {
  ExecutiveInboxPrioritizationRequest,
  ExecutiveInboxPriority,
  ExecutivePriorityProfile,
  ExecutivePriorityProvenance,
  PriorityCalculation,
  PriorityDimension,
  PriorityEvidence,
  PriorityLearningResult,
  PriorityValidationIssue,
  PriorityValidationResult,
} from "./executiveInboxPrioritizationEngineTypes.ts";

function issue(code: string, message: string, field?: string): PriorityValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: PriorityValidationIssue[]): PriorityValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isPriorityDimensionKey(value: string): value is PriorityDimension["dimensionKey"] {
  return (EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS as readonly string[]).includes(value);
}

export function isPriorityLevel(value: string): value is ExecutiveInboxPriority["priorityLevel"] {
  return (EXECUTIVE_INBOX_PRIORITY_LEVEL_KEYS as readonly string[]).includes(value);
}

export function validateExecutivePriorityProvenance(
  provenance: ExecutivePriorityProvenance
): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!provenance.itemId.trim()) {
    issues.push(issue("missing_provenance", "itemId is required.", "provenance.itemId"));
  }
  if (!provenance.originatingPlatform.trim()) {
    issues.push(issue("missing_provenance", "originatingPlatform is required.", "provenance.originatingPlatform"));
  }
  if (!provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "workspaceId is required.", "provenance.workspaceId"));
  }
  if (!provenance.aggregationVersion.trim()) {
    issues.push(issue("missing_provenance", "aggregationVersion is required.", "provenance.aggregationVersion"));
  }
  if (provenance.engineVersion !== EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.calculationVersion !== EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION) {
    issues.push(issue("invalid_provenance", "calculationVersion mismatch.", "provenance.calculationVersion"));
  }
  if (provenance.foundationVersion !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch.", "provenance.foundationVersion"));
  }
  return result(issues);
}

export function validatePriorityDimension(dimension: PriorityDimension): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!isPriorityDimensionKey(dimension.dimensionKey)) {
    issues.push(issue("invalid_dimension", "dimensionKey is invalid.", "dimensionKey"));
  }
  if (dimension.score < 0 || dimension.score > 100) {
    issues.push(issue("invalid_score", "score must be between 0 and 100.", "score"));
  }
  if (dimension.weight < 0) {
    issues.push(issue("invalid_weight", "weight must be non-negative.", "weight"));
  }
  return result(issues);
}

export function validatePriorityEvidence(evidence: PriorityEvidence): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!evidence.evidenceId.trim()) {
    issues.push(issue("missing_field", "evidenceId is required.", "evidenceId"));
  }
  if (!isPriorityDimensionKey(evidence.dimensionKey)) {
    issues.push(issue("invalid_dimension", "dimensionKey is invalid.", "dimensionKey"));
  }
  if (!evidence.rationale.trim()) {
    issues.push(issue("missing_field", "rationale is required.", "rationale"));
  }
  return result(issues);
}

export function validatePriorityCalculation(calculation: PriorityCalculation): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!calculation.calculationId.trim()) {
    issues.push(issue("missing_field", "calculationId is required.", "calculationId"));
  }
  if (calculation.weightedScore < 0 || calculation.weightedScore > 100) {
    issues.push(issue("invalid_score", "weightedScore must be between 0 and 100.", "weightedScore"));
  }
  if (!isPriorityLevel(calculation.priorityLevel)) {
    issues.push(issue("invalid_level", "priorityLevel is invalid.", "priorityLevel"));
  }
  if (calculation.calculationVersion !== EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION) {
    issues.push(issue("invalid_version", "calculationVersion mismatch.", "calculationVersion"));
  }
  for (const dimension of calculation.dimensions) {
    issues.push(...validatePriorityDimension(dimension).issues);
  }
  return result(issues);
}

export function validateExecutivePriorityProfile(profile: ExecutivePriorityProfile): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!profile.profileId.trim() || !profile.itemId.trim() || !profile.workspaceId.trim()) {
    issues.push(issue("invalid_profile", "Profile identity is incomplete.", "profile"));
  }
  if (!isPriorityLevel(profile.priorityLevel)) {
    issues.push(issue("invalid_level", "priorityLevel is invalid.", "priorityLevel"));
  }
  if (!profile.explanation.trim() || profile.explanation.length > EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_LIMITS.maxExplanationLength) {
    issues.push(issue("invalid_explanation", "explanation is invalid.", "explanation"));
  }
  if (profile.evidence.length > EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_LIMITS.maxEvidenceEntries) {
    issues.push(issue("limit_exceeded", "evidence exceeds limit.", "evidence"));
  }
  for (const entry of profile.evidence) {
    issues.push(...validatePriorityEvidence(entry).issues);
  }
  issues.push(...validateExecutivePriorityProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutivePriority(priority: ExecutiveInboxPriority): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  for (const field of EXECUTIVE_INBOX_PRIORITIZATION_MANDATORY_PRIORITY_FIELDS) {
    if (!(field in priority) || priority[field as keyof ExecutiveInboxPriority] === undefined) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (priority.version !== EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (priority.engineVersion !== EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "engineVersion mismatch.", "engineVersion"));
  }
  if (priority.readOnly !== true) {
    issues.push(issue("invalid_priority", "Priority must be read-only.", "readOnly"));
  }
  if (!isPriorityLevel(priority.priorityLevel)) {
    issues.push(issue("invalid_level", "priorityLevel is invalid.", "priorityLevel"));
  }
  issues.push(...validateExecutivePriorityProfile(priority.profile).issues);
  issues.push(...validatePriorityCalculation(priority.calculation).issues);
  issues.push(...validateExecutivePriorityProvenance(priority.provenance).issues);
  return result(issues);
}

export function validateExecutivePriorities(priorities: readonly ExecutiveInboxPriority[]): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (hasDuplicateIds(priorities.map((entry) => entry.priorityId))) {
    issues.push(issue("duplicate_priorities", "Priorities contain duplicate IDs.", "priorities"));
  }
  for (const priority of priorities) {
    issues.push(...validateExecutivePriority(priority).issues);
  }
  return result(issues);
}

export function validateExecutiveInboxPrioritizationRequest(
  request: ExecutiveInboxPrioritizationRequest
): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (request.items.length === 0) {
    issues.push(issue("missing_field", "items must not be empty.", "items"));
  }
  if (request.items.length > EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_LIMITS.maxInboxItems) {
    issues.push(issue("limit_exceeded", "items exceeds limit.", "items"));
  }
  if (hasDuplicateIds(request.items.map((entry) => entry.item.itemId))) {
    issues.push(issue("duplicate_items", "items contain duplicate itemIds.", "items"));
  }
  for (const input of request.items) {
    issues.push(...validateExecutiveInboxItem(input.item).issues);
    if (input.item.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", `Workspace mismatch for item ${input.item.itemId}.`, "workspaceId"));
    }
    if (input.item.provenance.aggregationVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
      issues.push(issue("invalid_dependency", "Item aggregation version incompatible.", "aggregationVersion"));
    }
    for (const override of input.dimensionOverrides ?? []) {
      if (!isPriorityDimensionKey(override.dimensionKey)) {
        issues.push(issue("invalid_dimension", "dimension override key invalid.", "dimensionOverrides"));
      }
      if (override.score < 0 || override.score > 100) {
        issues.push(issue("invalid_score", "dimension override score invalid.", "dimensionOverrides"));
      }
    }
  }
  return result(issues);
}

export function validatePrioritizationDependencies(): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!isExecutiveInboxPlatformInitialized()) {
    issues.push(issue("foundation_incompatible", "APP-11:1 foundation is not initialized.", "foundation"));
  }
  if (!isExecutiveInboxAggregationInitialized()) {
    issues.push(issue("aggregation_incompatible", "APP-11:2 aggregation engine is not initialized.", "aggregation"));
  }
  return result(issues);
}

export function validatePriorityLearningResult(learning: PriorityLearningResult): PriorityValidationResult {
  const issues: PriorityValidationIssue[] = [];
  if (!learning.learningId.trim() || !learning.itemId.trim()) {
    issues.push(issue("invalid_learning", "Learning result identity incomplete.", "learning"));
  }
  if (learning.deterministic !== true) {
    issues.push(issue("invalid_learning", "Learning result must be deterministic.", "deterministic"));
  }
  return result(issues);
}
