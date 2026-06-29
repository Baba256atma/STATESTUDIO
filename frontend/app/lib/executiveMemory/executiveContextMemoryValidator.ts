/**
 * APP-4:8 — Executive Context Memory validator.
 */

import { hasExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  EXECUTIVE_CONTEXT_MEMORY_LIMITS,
  EXECUTIVE_CONTEXT_MEMORY_REFERENCE_TYPE_KEYS,
  EXECUTIVE_CONTEXT_MEMORY_STATE_KEYS,
} from "./executiveContextMemoryConstants.ts";
import {
  isExecutiveContextWorkspaceRegistered,
} from "./executiveContextMemoryWorkspaceRegistry.ts";
import type { ExecutiveContextMemory } from "./executiveContextMemoryTypes.ts";

export type ExecutiveContextMemoryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveContextMemoryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveContextMemoryValidationIssue[];
  readOnly: true;
}>;

function issue(code: string, message: string, field?: string): ExecutiveContextMemoryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveContextMemoryValidationIssue[]): ExecutiveContextMemoryValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function hasDuplicates(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

function isIsoTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function isExecutiveContextMemoryReferenceType(value: string): boolean {
  return (EXECUTIVE_CONTEXT_MEMORY_REFERENCE_TYPE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveContextMemoryState(value: string): boolean {
  return (EXECUTIVE_CONTEXT_MEMORY_STATE_KEYS as readonly string[]).includes(value);
}

export function buildExecutiveContextMemorySignature(memory: ExecutiveContextMemory): string {
  return `${memory.workspaceId}|${memory.contextSnapshot.snapshotId}`;
}

export function validateExecutiveContextMemory(
  memory: ExecutiveContextMemory
): ExecutiveContextMemoryValidationResult {
  const issues: ExecutiveContextMemoryValidationIssue[] = [];

  if (memory.memoryId.trim().length === 0) {
    issues.push(issue("malformed_identifier", "Memory id must not be empty.", "memoryId"));
  }
  if (!isExecutiveContextMemoryState(memory.lifecycle)) {
    issues.push(issue("invalid_lifecycle", "Lifecycle state is invalid.", "lifecycle"));
  }
  if (!isIsoTimestamp(memory.createdAt) || !isIsoTimestamp(memory.updatedAt)) {
    issues.push(issue("validation_failure", "Timestamps must be valid ISO dates.", "createdAt"));
  }
  if (!isIsoTimestamp(memory.contextSnapshot.capturedAt)) {
    issues.push(issue("validation_failure", "Snapshot capturedAt must be valid.", "contextSnapshot.capturedAt"));
  }
  if (memory.metadata.title.length > EXECUTIVE_CONTEXT_MEMORY_LIMITS.maxTitleLength) {
    issues.push(issue("invalid_metadata", "Title exceeds maximum length.", "metadata.title"));
  }
  if (memory.metadata.summary.length > EXECUTIVE_CONTEXT_MEMORY_LIMITS.maxSummaryLength) {
    issues.push(issue("invalid_metadata", "Summary exceeds maximum length.", "metadata.summary"));
  }

  if (!isExecutiveContextWorkspaceRegistered(memory.workspaceId)) {
    issues.push(
      issue("unregistered_workspace", `Workspace is not registered: ${memory.workspaceId}.`, "workspaceId")
    );
  }

  if (memory.businessContext.contextId.trim().length === 0) {
    issues.push(issue("invalid_business_context", "Business context id must not be empty.", "businessContext.contextId"));
  }
  if (memory.businessContext.description.length > EXECUTIVE_CONTEXT_MEMORY_LIMITS.maxDescriptionLength) {
    issues.push(issue("invalid_business_context", "Business context description exceeds maximum.", "businessContext.description"));
  }

  if (hasDuplicates(memory.stakeholders.map((entry) => entry.stakeholderId))) {
    issues.push(issue("invalid_stakeholder", "Duplicate stakeholder ids detected.", "stakeholders"));
  }
  for (const stakeholder of memory.stakeholders) {
    if (stakeholder.stakeholderId.trim().length === 0 || stakeholder.name.trim().length === 0) {
      issues.push(issue("invalid_stakeholder", "Stakeholder id and name must not be empty.", "stakeholders"));
    }
  }

  if (hasDuplicates(memory.resourceContext.resources.map((entry) => entry.resourceId))) {
    issues.push(issue("invalid_resource", "Duplicate resource ids detected.", "resourceContext.resources"));
  }
  for (const resource of memory.resourceContext.resources) {
    if (resource.resourceId.trim().length === 0 || resource.label.trim().length === 0) {
      issues.push(issue("invalid_resource", "Resource id and label must not be empty.", "resourceContext.resources"));
    }
  }

  if (hasDuplicates(memory.externalContext.events.map((entry) => entry.eventId))) {
    issues.push(issue("validation_failure", "Duplicate external event ids detected.", "externalContext.events"));
  }
  for (const event of memory.externalContext.events) {
    if (event.eventId.trim().length === 0) {
      issues.push(issue("validation_failure", "External event id must not be empty.", "externalContext.events"));
    }
    if (!isIsoTimestamp(event.occurredAt)) {
      issues.push(issue("validation_failure", "External event occurredAt must be valid.", "externalContext.events"));
    }
  }

  if (hasDuplicates(memory.assumptions)) {
    issues.push(issue("validation_failure", "Duplicate assumptions detected.", "assumptions"));
  }
  if (hasDuplicates(memory.references.map((entry) => entry.referenceId))) {
    issues.push(issue("invalid_references", "Duplicate reference ids detected.", "references"));
  }

  for (const reference of memory.references) {
    if (!isExecutiveContextMemoryReferenceType(reference.referenceType)) {
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

  if (memory.stakeholders.length > EXECUTIVE_CONTEXT_MEMORY_LIMITS.maxStakeholders) {
    issues.push(issue("invalid_stakeholder", "Stakeholder count exceeds maximum.", "stakeholders"));
  }
  if (memory.resourceContext.resources.length > EXECUTIVE_CONTEXT_MEMORY_LIMITS.maxResources) {
    issues.push(issue("invalid_resource", "Resource count exceeds maximum.", "resourceContext.resources"));
  }
  if (memory.externalContext.events.length > EXECUTIVE_CONTEXT_MEMORY_LIMITS.maxExternalEvents) {
    issues.push(issue("validation_failure", "External event count exceeds maximum.", "externalContext.events"));
  }
  if (memory.assumptions.length > EXECUTIVE_CONTEXT_MEMORY_LIMITS.maxAssumptions) {
    issues.push(issue("validation_failure", "Assumption count exceeds maximum.", "assumptions"));
  }

  return result(issues);
}

export const ExecutiveContextMemoryValidator = Object.freeze({
  validateExecutiveContextMemory,
  buildExecutiveContextMemorySignature,
  isExecutiveContextMemoryReferenceType,
  isExecutiveContextMemoryState,
});
