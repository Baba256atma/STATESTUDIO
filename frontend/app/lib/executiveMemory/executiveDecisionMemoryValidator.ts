/**
 * APP-4:7 — Executive Decision Memory validator.
 */

import { hasExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  EXECUTIVE_DECISION_MEMORY_CONFIDENCE_LEVEL_KEYS,
  EXECUTIVE_DECISION_MEMORY_LIMITS,
  EXECUTIVE_DECISION_MEMORY_REFERENCE_TYPE_KEYS,
  EXECUTIVE_DECISION_MEMORY_STATE_KEYS,
} from "./executiveDecisionMemoryConstants.ts";
import {
  getExecutiveDecisionTarget,
  isExecutiveDecisionTargetRegistered,
} from "./executiveDecisionMemoryDecisionRegistry.ts";
import type { ExecutiveDecisionMemory } from "./executiveDecisionMemoryTypes.ts";

export type ExecutiveDecisionMemoryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveDecisionMemoryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveDecisionMemoryValidationIssue[];
  readOnly: true;
}>;

function issue(code: string, message: string, field?: string): ExecutiveDecisionMemoryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveDecisionMemoryValidationIssue[]): ExecutiveDecisionMemoryValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function hasDuplicates(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

function isIsoTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function isExecutiveDecisionMemoryReferenceType(value: string): boolean {
  return (EXECUTIVE_DECISION_MEMORY_REFERENCE_TYPE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveDecisionMemoryState(value: string): boolean {
  return (EXECUTIVE_DECISION_MEMORY_STATE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveDecisionConfidenceLevel(value: string): boolean {
  return (EXECUTIVE_DECISION_MEMORY_CONFIDENCE_LEVEL_KEYS as readonly string[]).includes(value);
}

export function buildExecutiveDecisionMemorySignature(memory: ExecutiveDecisionMemory): string {
  return `${memory.decisionId}|${memory.workspaceId}`;
}

export function validateExecutiveDecisionMemory(
  memory: ExecutiveDecisionMemory
): ExecutiveDecisionMemoryValidationResult {
  const issues: ExecutiveDecisionMemoryValidationIssue[] = [];

  if (memory.memoryId.trim().length === 0) {
    issues.push(issue("malformed_identifier", "Memory id must not be empty.", "memoryId"));
  }
  if (!isExecutiveDecisionMemoryState(memory.lifecycle)) {
    issues.push(issue("invalid_lifecycle", "Lifecycle state is invalid.", "lifecycle"));
  }
  if (!isIsoTimestamp(memory.createdAt) || !isIsoTimestamp(memory.updatedAt)) {
    issues.push(issue("validation_failure", "Timestamps must be valid ISO dates.", "createdAt"));
  }
  if (!isIsoTimestamp(memory.rationale.decidedAt)) {
    issues.push(issue("validation_failure", "Rationale decidedAt must be valid.", "rationale.decidedAt"));
  }
  if (memory.metadata.title.length > EXECUTIVE_DECISION_MEMORY_LIMITS.maxTitleLength) {
    issues.push(issue("invalid_metadata", "Title exceeds maximum length.", "metadata.title"));
  }
  if (memory.rationale.explanation.length > EXECUTIVE_DECISION_MEMORY_LIMITS.maxRationaleLength) {
    issues.push(issue("validation_failure", "Rationale explanation exceeds maximum length.", "rationale.explanation"));
  }

  if (!isExecutiveDecisionTargetRegistered(memory.decisionId)) {
    issues.push(issue("missing_decision", `Decision is not registered: ${memory.decisionId}.`, "decisionId"));
  } else {
    const target = getExecutiveDecisionTarget(memory.decisionId);
    if (target && target.workspaceId !== memory.workspaceId) {
      issues.push(issue("workspace_mismatch", "Workspace must match registered decision workspace.", "workspaceId"));
    }
  }

  if (
    memory.confidence.score !== null &&
    (memory.confidence.score < EXECUTIVE_DECISION_MEMORY_LIMITS.minConfidenceScore ||
      memory.confidence.score > EXECUTIVE_DECISION_MEMORY_LIMITS.maxConfidenceScore)
  ) {
    issues.push(issue("invalid_confidence", "Confidence score must be between 0 and 1.", "confidence.score"));
  }
  if (!isExecutiveDecisionConfidenceLevel(memory.confidence.level)) {
    issues.push(issue("invalid_confidence", "Confidence level is invalid.", "confidence.level"));
  }

  if (hasDuplicates(memory.evidence.map((entry) => entry.evidenceId))) {
    issues.push(issue("validation_failure", "Duplicate evidence ids detected.", "evidence"));
  }
  if (hasDuplicates(memory.references.map((entry) => entry.referenceId))) {
    issues.push(issue("invalid_references", "Duplicate reference ids detected.", "references"));
  }
  if (hasDuplicates(memory.alternatives.map((entry) => entry.alternativeId))) {
    issues.push(issue("validation_failure", "Duplicate alternative ids detected.", "alternatives"));
  }
  if (hasDuplicates(memory.expectedOutcomes.map((entry) => entry.outcomeId))) {
    issues.push(issue("validation_failure", "Duplicate expected outcome ids detected.", "expectedOutcomes"));
  }
  if (hasDuplicates(memory.actualOutcomes.map((entry) => entry.outcomeId))) {
    issues.push(issue("validation_failure", "Duplicate actual outcome ids detected.", "actualOutcomes"));
  }

  for (const reference of memory.references) {
    if (!isExecutiveDecisionMemoryReferenceType(reference.referenceType)) {
      issues.push(issue("invalid_references", `Invalid reference type: ${reference.referenceType}.`, "references"));
    }
  }

  for (const executiveMemoryId of memory.executiveMemoryIds) {
    if (!hasExecutiveMemory(executiveMemoryId)) {
      issues.push(
        issue("invalid_references", `Executive memory not found: ${executiveMemoryId}.`, "executiveMemoryIds")
      );
    }
  }

  if (memory.evidence.length > EXECUTIVE_DECISION_MEMORY_LIMITS.maxEvidence) {
    issues.push(issue("validation_failure", "Evidence count exceeds maximum.", "evidence"));
  }
  if (memory.alternatives.length > EXECUTIVE_DECISION_MEMORY_LIMITS.maxAlternatives) {
    issues.push(issue("validation_failure", "Alternative count exceeds maximum.", "alternatives"));
  }

  return result(issues);
}

export const ExecutiveDecisionMemoryValidator = Object.freeze({
  validateExecutiveDecisionMemory,
  buildExecutiveDecisionMemorySignature,
  isExecutiveDecisionMemoryReferenceType,
  isExecutiveDecisionMemoryState,
  isExecutiveDecisionConfidenceLevel,
});
