/**
 * APP-4:11 — Executive Assistant Memory access validator (read-only permissions).
 */

import { getExecutiveMemoryById as getStoredExecutiveMemoryById } from "./executiveMemoryRetrievalEngine.ts";
import { getExecutiveMemoryLifecycle } from "./executiveMemoryLifecycleRegistry.ts";
import { EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_LIMITS } from "./executiveAssistantMemoryIntegrationConstants.ts";
import { getAssistantRetrievalProfile } from "./executiveAssistantMemoryIntegrationProfileRegistry.ts";
import type {
  ExecutiveAssistantMemoryAccessResult,
  ExecutiveAssistantMemoryRequest,
} from "./executiveAssistantMemoryIntegrationTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryGovernanceState } from "./executiveMemoryLifecycleTypes.ts";

export type ExecutiveAssistantMemoryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantMemoryValidationIssue[];
  readOnly: true;
}>;

function issue(code: string, message: string, field?: string): ExecutiveAssistantMemoryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveAssistantMemoryValidationIssue[]): ExecutiveAssistantMemoryValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function evaluateExecutiveAssistantMemoryPermission(input: {
  memoryId: ExecutiveMemoryId;
  allowArchived?: boolean;
  allowLocked?: boolean;
  includeSuperseded?: boolean;
}): ExecutiveAssistantMemoryAccessResult {
  const stored = getStoredExecutiveMemoryById(input.memoryId);
  if (!stored.success || !stored.data) {
    return Object.freeze({
      allowed: false,
      permission: "read_denied",
      reason: `Memory not found: ${input.memoryId}.`,
      readOnly: true as const,
    });
  }

  const governance = getExecutiveMemoryLifecycle(input.memoryId);
  const storageLifecycle = stored.data.lifecycle;

  if (governance?.governanceState === "locked") {
    if (!input.allowLocked) {
      return Object.freeze({
        allowed: false,
        permission: "locked_access",
        reason: "Memory is locked and requires explicit locked access permission.",
        readOnly: true as const,
      });
    }
  }

  if (governance?.governanceState === "merged" || governance?.governanceState === "split") {
    return Object.freeze({
      allowed: false,
      permission: "read_denied",
      reason: `Memory governance state prevents assistant access: ${governance.governanceState}.`,
      readOnly: true as const,
    });
  }

  if (governance?.governanceState === "superseded" && !input.includeSuperseded) {
    return Object.freeze({
      allowed: false,
      permission: "lifecycle_restricted",
      reason: "Superseded memory requires includeSuperseded permission.",
      readOnly: true as const,
    });
  }

  if (storageLifecycle === "archived" || governance?.governanceState === "archived") {
    if (input.allowArchived === false) {
      return Object.freeze({
        allowed: false,
        permission: "lifecycle_restricted",
        reason: "Archived memory access is not allowed for this request.",
        readOnly: true as const,
      });
    }
    return Object.freeze({
      allowed: true,
      permission: "archived_access",
      reason: "Archived memory read permitted.",
      readOnly: true as const,
    });
  }

  return Object.freeze({
    allowed: true,
    permission: "read_allowed",
    reason: "Memory read permitted.",
    readOnly: true as const,
  });
}

export function validateAssistantMemoryAccess(
  request: ExecutiveAssistantMemoryRequest
): ExecutiveAssistantMemoryValidationResult {
  const issues: ExecutiveAssistantMemoryValidationIssue[] = [];

  if (request.retrievalProfileId && !getAssistantRetrievalProfile(request.retrievalProfileId)) {
    issues.push(
      issue("invalid_profile", `Retrieval profile not found: ${request.retrievalProfileId}.`, "retrievalProfileId")
    );
  }

  if (request.limit !== undefined && (request.limit < 1 || request.limit > EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_LIMITS.maxResults)) {
    issues.push(issue("invalid_request", "limit is out of supported range.", "limit"));
  }

  const hasFilter = Boolean(
    request.recordId ||
      request.workspaceId ||
      request.intentId ||
      request.scenarioId ||
      request.decisionId ||
      request.contextId ||
      request.goalId ||
      request.category
  );
  if (!hasFilter) {
    issues.push(issue("invalid_request", "At least one retrieval filter is required.", "recordId"));
  }

  if (request.recordId) {
    const access = evaluateExecutiveAssistantMemoryPermission({
      memoryId: request.recordId,
      allowArchived: request.allowArchived,
      allowLocked: request.allowLocked,
      includeSuperseded: request.includeSuperseded,
    });
    if (!access.allowed) {
      issues.push(issue("access_denied", access.reason, "recordId"));
    }
  }

  return result(issues);
}

export function mapGovernanceStateLabel(state: ExecutiveMemoryGovernanceState | null): string {
  return state ?? "ungoverned";
}

export const ExecutiveAssistantMemoryAccessValidator = Object.freeze({
  validateAssistantMemoryAccess,
  evaluateExecutiveAssistantMemoryPermission,
  mapGovernanceStateLabel,
});
