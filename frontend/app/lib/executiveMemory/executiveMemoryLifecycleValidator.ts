/**
 * APP-4:10 — Executive Memory Lifecycle validator.
 */

import { hasExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  EXECUTIVE_MEMORY_LIFECYCLE_LIMITS,
  EXECUTIVE_MEMORY_LIFECYCLE_STATE_KEYS,
  EXECUTIVE_MEMORY_RETENTION_POLICY_TYPE_KEYS,
} from "./executiveMemoryLifecycleConstants.ts";
import {
  getExecutiveMemoryLifecycle,
  getExecutiveMemoryRetentionPolicyRecord,
  getExecutiveMemoryVersionRecords,
} from "./executiveMemoryLifecycleRegistry.ts";
import { isExecutiveMemoryLifecycleTransitionAllowed } from "./executiveMemoryLifecycleTransitions.ts";
import type {
  ExecutiveMemoryGovernanceState,
  ExecutiveMemoryLifecycle,
  ExecutiveMemoryMergeOperation,
  ExecutiveMemoryRetentionPolicy,
  ExecutiveMemorySplitOperation,
  ExecutiveMemorySupersedeOperation,
  ExecutiveMemoryVersionRecord,
  MergeExecutiveMemoriesInput,
  SplitExecutiveMemoryInput,
  SupersedeExecutiveMemoryInput,
} from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

export type ExecutiveMemoryLifecycleValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryLifecycleValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveMemoryLifecycleValidationIssue[];
  readOnly: true;
}>;

function issue(code: string, message: string, field?: string): ExecutiveMemoryLifecycleValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveMemoryLifecycleValidationIssue[]): ExecutiveMemoryLifecycleValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function isIsoTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function isExecutiveMemoryGovernanceState(value: string): value is ExecutiveMemoryGovernanceState {
  return (EXECUTIVE_MEMORY_LIFECYCLE_STATE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveMemoryRetentionPolicyType(value: string): boolean {
  return (EXECUTIVE_MEMORY_RETENTION_POLICY_TYPE_KEYS as readonly string[]).includes(value);
}

export function validateExecutiveMemoryLifecycleRecord(
  lifecycle: ExecutiveMemoryLifecycle
): ExecutiveMemoryLifecycleValidationResult {
  const issues: ExecutiveMemoryLifecycleValidationIssue[] = [];

  if (!isExecutiveMemoryGovernanceState(lifecycle.governanceState)) {
    issues.push(issue("validation_failure", "Invalid governance state.", "governanceState"));
  }
  if (!isIsoTimestamp(lifecycle.createdAt) || !isIsoTimestamp(lifecycle.updatedAt)) {
    issues.push(issue("validation_failure", "Lifecycle timestamps must be valid.", "createdAt"));
  }
  if (lifecycle.audit.author.length === 0) {
    issues.push(issue("validation_failure", "Audit author must not be empty.", "audit.author"));
  }
  if (!getExecutiveMemoryRetentionPolicyRecord(lifecycle.retentionPolicyId)) {
    issues.push(issue("invalid_retention_policy", "Retention policy not registered.", "retentionPolicyId"));
  }
  if (!hasExecutiveMemory(lifecycle.memoryId)) {
    issues.push(issue("memory_not_found", `Storage record not found: ${lifecycle.memoryId}.`, "memoryId"));
  }

  return result(issues);
}

export function validateExecutiveMemoryLifecycleTransition(input: {
  memoryId: ExecutiveMemoryId;
  toState: ExecutiveMemoryGovernanceState;
}): ExecutiveMemoryLifecycleValidationResult {
  const lifecycle = getExecutiveMemoryLifecycle(input.memoryId);
  if (!lifecycle) {
    return result([issue("memory_not_found", `Lifecycle not found: ${input.memoryId}.`, "memoryId")]);
  }
  if (!isExecutiveMemoryLifecycleTransitionAllowed(lifecycle.governanceState, input.toState)) {
    return result([
      issue(
        "invalid_transition",
        `Transition not allowed: ${lifecycle.governanceState} -> ${input.toState}.`,
        "governanceState"
      ),
    ]);
  }
  return result([]);
}

export function validateExecutiveMemoryVersionChain(
  canonicalMemoryId: ExecutiveMemoryId
): ExecutiveMemoryLifecycleValidationResult {
  const issues: ExecutiveMemoryLifecycleValidationIssue[] = [];
  const records = getExecutiveMemoryVersionRecords(canonicalMemoryId);
  const versionIds = new Set<string>();

  for (const version of records) {
    if (versionIds.has(version.versionId)) {
      issues.push(issue("invalid_version_chain", `Duplicate version id: ${version.versionId}.`, "versionId"));
    }
    versionIds.add(version.versionId);
    if (version.parentVersionId && !versionIds.has(version.parentVersionId)) {
      const parentExists = records.some((entry) => entry.versionId === version.parentVersionId);
      if (!parentExists && version !== records[0]) {
        issues.push(
          issue("invalid_version_chain", `Missing parent version: ${version.parentVersionId}.`, "parentVersionId")
        );
      }
    }
  }

  return result(issues);
}

export function validateExecutiveMemoryRetentionPolicy(
  policy: ExecutiveMemoryRetentionPolicy
): ExecutiveMemoryLifecycleValidationResult {
  const issues: ExecutiveMemoryLifecycleValidationIssue[] = [];
  if (!isExecutiveMemoryRetentionPolicyType(policy.policyType)) {
    issues.push(issue("invalid_retention_policy", "Invalid retention policy type.", "policyType"));
  }
  if (policy.policyType === "archive_after_period" && (policy.archiveAfterDays ?? 0) <= 0) {
    issues.push(issue("invalid_retention_policy", "archive_after_period requires archiveAfterDays.", "archiveAfterDays"));
  }
  if (policy.label.length > EXECUTIVE_MEMORY_LIFECYCLE_LIMITS.maxPolicyLabelLength) {
    issues.push(issue("invalid_retention_policy", "Policy label exceeds maximum length.", "label"));
  }
  return result(issues);
}

export function validateMergeExecutiveMemoriesInput(
  input: MergeExecutiveMemoriesInput
): ExecutiveMemoryLifecycleValidationResult {
  const issues: ExecutiveMemoryLifecycleValidationIssue[] = [];

  if (input.sourceMemoryIds.length < 2) {
    issues.push(issue("merge_conflict", "Merge requires at least two source memories.", "sourceMemoryIds"));
  }
  if (input.sourceMemoryIds.length > EXECUTIVE_MEMORY_LIFECYCLE_LIMITS.maxMergeSources) {
    issues.push(issue("merge_conflict", "Merge source count exceeds maximum.", "sourceMemoryIds"));
  }
  const uniqueSources = new Set(input.sourceMemoryIds);
  if (uniqueSources.size !== input.sourceMemoryIds.length) {
    issues.push(issue("merge_conflict", "Duplicate source memory ids.", "sourceMemoryIds"));
  }
  if (input.sourceMemoryIds.includes(input.mergedMemoryId)) {
    issues.push(issue("merge_conflict", "Merged memory id must not be in source list.", "mergedMemoryId"));
  }
  if (hasExecutiveMemory(input.mergedMemoryId)) {
    issues.push(issue("merge_conflict", `Merged memory id already exists: ${input.mergedMemoryId}.`, "mergedMemoryId"));
  }

  for (const memoryId of input.sourceMemoryIds) {
    if (!hasExecutiveMemory(memoryId)) {
      issues.push(issue("memory_not_found", `Source memory not found: ${memoryId}.`, "sourceMemoryIds"));
      continue;
    }
    const lifecycle = getExecutiveMemoryLifecycle(memoryId);
    if (!lifecycle) {
      issues.push(issue("merge_conflict", `Source memory not governed: ${memoryId}.`, "sourceMemoryIds"));
      continue;
    }
    if (lifecycle.governanceState !== "active" && lifecycle.governanceState !== "draft") {
      issues.push(issue("merge_conflict", `Source memory not mergeable: ${memoryId}.`, "sourceMemoryIds"));
    }
  }

  return result(issues);
}

export function validateSplitExecutiveMemoryInput(
  input: SplitExecutiveMemoryInput
): ExecutiveMemoryLifecycleValidationResult {
  const issues: ExecutiveMemoryLifecycleValidationIssue[] = [];

  if (input.targets.length < EXECUTIVE_MEMORY_LIFECYCLE_LIMITS.minSplitTargets) {
    issues.push(issue("split_failure", "Split requires at least two targets.", "targets"));
  }
  if (input.targets.length > EXECUTIVE_MEMORY_LIFECYCLE_LIMITS.maxSplitTargets) {
    issues.push(issue("split_failure", "Split target count exceeds maximum.", "targets"));
  }

  const targetIds = new Set<string>();
  for (const target of input.targets) {
    if (target.memoryId.trim().length === 0 || target.label.trim().length === 0) {
      issues.push(issue("split_failure", "Split target id and label must not be empty.", "targets"));
    }
    if (targetIds.has(target.memoryId)) {
      issues.push(issue("split_failure", `Duplicate split target id: ${target.memoryId}.`, "targets"));
    }
    targetIds.add(target.memoryId);
    if (hasExecutiveMemory(target.memoryId)) {
      issues.push(issue("split_failure", `Split target already exists: ${target.memoryId}.`, "targets"));
    }
  }

  if (!hasExecutiveMemory(input.sourceMemoryId)) {
    issues.push(issue("memory_not_found", `Source memory not found: ${input.sourceMemoryId}.`, "sourceMemoryId"));
  } else {
    const lifecycle = getExecutiveMemoryLifecycle(input.sourceMemoryId);
    if (!lifecycle) {
      issues.push(issue("split_failure", "Source memory must be governed before split.", "sourceMemoryId"));
    } else if (lifecycle.governanceState !== "active") {
      issues.push(issue("split_failure", "Only active memories can be split.", "sourceMemoryId"));
    }
  }

  return result(issues);
}

export function validateSupersedeExecutiveMemoryInput(
  input: SupersedeExecutiveMemoryInput
): ExecutiveMemoryLifecycleValidationResult {
  const issues: ExecutiveMemoryLifecycleValidationIssue[] = [];

  if (input.obsoleteMemoryId === input.replacementMemoryId) {
    issues.push(issue("supersede_conflict", "Obsolete and replacement ids must differ.", "replacementMemoryId"));
  }
  if (!hasExecutiveMemory(input.obsoleteMemoryId)) {
    issues.push(issue("memory_not_found", `Obsolete memory not found: ${input.obsoleteMemoryId}.`, "obsoleteMemoryId"));
  }
  if (!hasExecutiveMemory(input.replacementMemoryId)) {
    issues.push(
      issue("memory_not_found", `Replacement memory not found: ${input.replacementMemoryId}.`, "replacementMemoryId")
    );
  }

  const obsoleteLifecycle = getExecutiveMemoryLifecycle(input.obsoleteMemoryId);
  if (obsoleteLifecycle && obsoleteLifecycle.governanceState !== "active") {
    issues.push(issue("supersede_conflict", "Only active memories can be superseded.", "obsoleteMemoryId"));
  }

  return result(issues);
}

export function validateExecutiveMemoryVersionRecord(
  version: ExecutiveMemoryVersionRecord
): ExecutiveMemoryLifecycleValidationResult {
  const issues: ExecutiveMemoryLifecycleValidationIssue[] = [];
  if (version.author.length === 0) {
    issues.push(issue("validation_failure", "Version author must not be empty.", "author"));
  }
  if (!isIsoTimestamp(version.createdAt)) {
    issues.push(issue("validation_failure", "Version createdAt must be valid.", "createdAt"));
  }
  if (recordsExceedLimit(getExecutiveMemoryVersionRecords(version.canonicalMemoryId).length)) {
    issues.push(issue("validation_failure", "Version history exceeds maximum.", "versionId"));
  }
  return result(issues);
}

function recordsExceedLimit(count: number): boolean {
  return count >= EXECUTIVE_MEMORY_LIFECYCLE_LIMITS.maxVersionHistory;
}

export const ExecutiveMemoryLifecycleValidator = Object.freeze({
  validateExecutiveMemoryLifecycleRecord,
  validateExecutiveMemoryLifecycleTransition,
  validateExecutiveMemoryVersionChain,
  validateExecutiveMemoryRetentionPolicy,
  validateMergeExecutiveMemoriesInput,
  validateSplitExecutiveMemoryInput,
  validateSupersedeExecutiveMemoryInput,
  validateExecutiveMemoryVersionRecord,
  isExecutiveMemoryGovernanceState,
  isExecutiveMemoryRetentionPolicyType,
});
