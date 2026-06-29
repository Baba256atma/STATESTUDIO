/**
 * APP-4:6 — Executive Scenario Memory validator.
 */

import { hasExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  EXECUTIVE_SCENARIO_MEMORY_LIMITS,
  EXECUTIVE_SCENARIO_MEMORY_REFERENCE_TYPE_KEYS,
  EXECUTIVE_SCENARIO_MEMORY_STATE_KEYS,
} from "./executiveScenarioMemoryConstants.ts";
import {
  getExecutiveScenarioTarget,
  isExecutiveScenarioTargetRegistered,
} from "./executiveScenarioMemoryScenarioRegistry.ts";
import type { ExecutiveScenarioMemory } from "./executiveScenarioMemoryTypes.ts";

export type ExecutiveScenarioMemoryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveScenarioMemoryValidationIssue[];
  readOnly: true;
}>;

function issue(code: string, message: string, field?: string): ExecutiveScenarioMemoryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveScenarioMemoryValidationIssue[]): ExecutiveScenarioMemoryValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function hasDuplicates(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

function isIsoTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function isExecutiveScenarioMemoryReferenceType(value: string): boolean {
  return (EXECUTIVE_SCENARIO_MEMORY_REFERENCE_TYPE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveScenarioMemoryState(value: string): boolean {
  return (EXECUTIVE_SCENARIO_MEMORY_STATE_KEYS as readonly string[]).includes(value);
}

export function buildExecutiveScenarioMemorySignature(memory: ExecutiveScenarioMemory): string {
  return `${memory.scenarioId}|${memory.workspaceId}`;
}

export function validateExecutiveScenarioMemory(
  memory: ExecutiveScenarioMemory
): ExecutiveScenarioMemoryValidationResult {
  const issues: ExecutiveScenarioMemoryValidationIssue[] = [];

  if (memory.memoryId.trim().length === 0) {
    issues.push(issue("malformed_identifier", "Memory id must not be empty.", "memoryId"));
  }
  if (!isExecutiveScenarioMemoryState(memory.lifecycle)) {
    issues.push(issue("invalid_lifecycle", "Lifecycle state is invalid.", "lifecycle"));
  }
  if (!isIsoTimestamp(memory.createdAt) || !isIsoTimestamp(memory.updatedAt)) {
    issues.push(issue("validation_failure", "Timestamps must be valid ISO dates.", "createdAt"));
  }
  if (memory.metadata.title.length > EXECUTIVE_SCENARIO_MEMORY_LIMITS.maxTitleLength) {
    issues.push(issue("invalid_metadata", "Title exceeds maximum length.", "metadata.title"));
  }
  if (memory.metadata.summary.length > EXECUTIVE_SCENARIO_MEMORY_LIMITS.maxSummaryLength) {
    issues.push(issue("invalid_metadata", "Summary exceeds maximum length.", "metadata.summary"));
  }

  if (!isExecutiveScenarioTargetRegistered(memory.scenarioId)) {
    issues.push(issue("missing_scenario", `Scenario is not registered: ${memory.scenarioId}.`, "scenarioId"));
  } else {
    const target = getExecutiveScenarioTarget(memory.scenarioId);
    if (target && target.workspaceId !== memory.workspaceId) {
      issues.push(issue("workspace_mismatch", "Workspace must match registered scenario workspace.", "workspaceId"));
    }
  }

  if (hasDuplicates(memory.evidence.map((entry) => entry.evidenceId))) {
    issues.push(issue("validation_failure", "Duplicate evidence ids detected.", "evidence"));
  }
  if (hasDuplicates(memory.references.map((entry) => entry.referenceId))) {
    issues.push(issue("invalid_references", "Duplicate reference ids detected.", "references"));
  }
  if (hasDuplicates(memory.assumptions.map((entry) => entry.assumptionId))) {
    issues.push(issue("validation_failure", "Duplicate assumption ids detected.", "assumptions"));
  }
  if (hasDuplicates(memory.outcomes.map((entry) => entry.outcomeId))) {
    issues.push(issue("validation_failure", "Duplicate outcome ids detected.", "outcomes"));
  }

  for (const reference of memory.references) {
    if (!isExecutiveScenarioMemoryReferenceType(reference.referenceType)) {
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

  if (memory.assumptions.length > EXECUTIVE_SCENARIO_MEMORY_LIMITS.maxAssumptions) {
    issues.push(issue("validation_failure", "Assumption count exceeds maximum.", "assumptions"));
  }
  if (memory.outcomes.length > EXECUTIVE_SCENARIO_MEMORY_LIMITS.maxOutcomes) {
    issues.push(issue("validation_failure", "Outcome count exceeds maximum.", "outcomes"));
  }
  if (memory.evidence.length > EXECUTIVE_SCENARIO_MEMORY_LIMITS.maxEvidence) {
    issues.push(issue("validation_failure", "Evidence count exceeds maximum.", "evidence"));
  }

  return result(issues);
}

export const ExecutiveScenarioMemoryValidator = Object.freeze({
  validateExecutiveScenarioMemory,
  buildExecutiveScenarioMemorySignature,
  isExecutiveScenarioMemoryReferenceType,
  isExecutiveScenarioMemoryState,
});
