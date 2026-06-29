/**
 * APP-1:2 — Executive Time Context Engine.
 * Temporal perspective metadata — switching updates store only, no downstream refresh.
 */

import {
  getExecutiveTimeContextStoreRecord,
  setExecutiveTimeContextStoreRecord,
  updateExecutiveTimeContextCustomRange,
} from "./executiveTimeContextStore.ts";
import {
  isExecutiveTimeContextMutationAuthorized,
  type ExecutiveTimeContextMutationAuthority,
} from "./executiveTimeContextMutationAuthority.ts";
import {
  getDefaultContext,
  isValidContext,
  listContexts,
  normalizeContext,
  resolveContext,
  resolveContextMetadata,
  validateExecutiveTimeContextInput,
} from "./executiveTimeContextResolver.ts";
import type {
  ExecutiveTimeContextKey,
  ExecutiveTimeContextObject,
  ExecutiveTimeContextSwitchResult,
  ExecutiveTimeCustomRange,
  ExecutiveTimeWorkspaceId,
} from "./executiveTimeTypes.ts";

export function resolveCurrentContext(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  anchorDate?: string;
}): ExecutiveTimeContextObject {
  const record = getExecutiveTimeContextStoreRecord(input.workspaceId);
  return normalizeContext({
    contextId: record.currentContextId,
    anchorDate: input.anchorDate,
    customRange: record.customRange,
  });
}

export function switchExecutiveTimeContext(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  contextId: ExecutiveTimeContextKey;
  customRange?: ExecutiveTimeCustomRange | null;
  contextMetadata?: Readonly<Record<string, unknown>>;
  mutationAuthority: ExecutiveTimeContextMutationAuthority;
}): ExecutiveTimeContextSwitchResult {
  const workspaceId = input.workspaceId.trim();
  if (!isExecutiveTimeContextMutationAuthorized(input.mutationAuthority)) {
    const current = getExecutiveTimeContextStoreRecord(workspaceId);
    return Object.freeze({
      success: false,
      previousContextId: current.currentContextId,
      currentContextId: current.currentContextId,
      workspaceId,
      updatedAt: current.updatedAt,
      reason: "Context mutation rejected: Executive Time Camera authority required.",
    });
  }
  const validation = validateExecutiveTimeContextInput({
    contextId: input.contextId,
    customRange: input.customRange ?? null,
  });
  if (!validation.valid || !isValidContext(input.contextId)) {
    const current = getExecutiveTimeContextStoreRecord(workspaceId);
    return Object.freeze({
      success: false,
      previousContextId: current.currentContextId,
      currentContextId: current.currentContextId,
      workspaceId,
      updatedAt: current.updatedAt,
      reason: validation.issues[0]?.message ?? "Invalid context switch request.",
    });
  }

  const previous = getExecutiveTimeContextStoreRecord(workspaceId);
  const next = setExecutiveTimeContextStoreRecord({
    workspaceId,
    currentContextId: input.contextId,
    customRange: input.contextId === "custom_range" ? input.customRange ?? null : null,
    contextMetadata: Object.freeze({
      ...previous.contextMetadata,
      ...(input.contextMetadata ?? {}),
      lastSwitchReason: "context-engine",
    }),
  });

  return Object.freeze({
    success: true,
    previousContextId: previous.currentContextId,
    currentContextId: next.currentContextId,
    workspaceId,
    updatedAt: next.updatedAt,
    reason: `Switched from ${previous.currentContextId} to ${next.currentContextId}.`,
  });
}

export function setExecutiveTimeCustomRange(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  customRange: ExecutiveTimeCustomRange;
  mutationAuthority: ExecutiveTimeContextMutationAuthority;
}): ExecutiveTimeContextSwitchResult {
  const validation = validateExecutiveTimeContextInput({
    contextId: "custom_range",
    customRange: input.customRange,
  });
  if (!validation.valid) {
    const current = getExecutiveTimeContextStoreRecord(input.workspaceId);
    return Object.freeze({
      success: false,
      previousContextId: current.currentContextId,
      currentContextId: current.currentContextId,
      workspaceId: input.workspaceId,
      updatedAt: current.updatedAt,
      reason: validation.issues[0]?.message ?? "Invalid custom range.",
    });
  }

  updateExecutiveTimeContextCustomRange({
    workspaceId: input.workspaceId,
    customRange: input.customRange,
  });
  return switchExecutiveTimeContext({
    workspaceId: input.workspaceId,
    contextId: "custom_range",
    customRange: input.customRange,
    contextMetadata: Object.freeze({ customRangeApplied: true }),
    mutationAuthority: input.mutationAuthority,
  });
}

export const ExecutiveTimeContextEngine = Object.freeze({
  resolveCurrentContext,
  resolveContext,
  getDefaultContext,
  listContexts,
  isValidContext,
  normalizeContext,
  resolveContextMetadata,
  switchExecutiveTimeContext,
  setExecutiveTimeCustomRange,
});
