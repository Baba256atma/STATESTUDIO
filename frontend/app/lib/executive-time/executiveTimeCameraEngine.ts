/**
 * APP-1:3 — Executive Time Camera Engine.
 * Single authority for temporal navigation — consumes Context Engine read-only APIs.
 */

import { resolveCurrentContext, switchExecutiveTimeContext } from "./executiveTimeContextEngine.ts";
import { EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY } from "./executiveTimeContextMutationAuthority.ts";
import {
  buildExecutiveTimeCameraPosition,
  resolveBackwardContext,
  resolveDuplicateNavigationError,
  resolveForwardContext,
  validateExecutiveTimeCameraNavigationRequest,
} from "./executiveTimeCameraResolver.ts";
import type {
  ExecutiveTimeCameraHistoryEntry,
  ExecutiveTimeCameraHistorySnapshot,
  ExecutiveTimeCameraMoveRequest,
  ExecutiveTimeCameraNavigationRequest,
  ExecutiveTimeCameraNavigationResult,
  ExecutiveTimeCameraPosition,
} from "./executiveTimeCameraTypes.ts";
import type { ExecutiveTimeContextKey, ExecutiveTimeWorkspaceId } from "./executiveTimeTypes.ts";

type WorkspaceHistory = Readonly<{
  entries: ExecutiveTimeCameraHistoryEntry[];
  cursor: number;
}>;

const historyByWorkspace = new Map<ExecutiveTimeWorkspaceId, WorkspaceHistory>();
const latestPositionByWorkspace = new Map<ExecutiveTimeWorkspaceId, ExecutiveTimeCameraPosition>();

function nowIso(): string {
  return new Date().toISOString();
}

function failure(
  error: NonNullable<ExecutiveTimeCameraNavigationResult["error"]>
): ExecutiveTimeCameraNavigationResult {
  return Object.freeze({ success: false, position: null, error });
}

function success(position: ExecutiveTimeCameraPosition): ExecutiveTimeCameraNavigationResult {
  latestPositionByWorkspace.set(position.workspaceId, position);
  return Object.freeze({ success: true, position, error: null });
}

function getCurrentContextId(workspaceId: ExecutiveTimeWorkspaceId): ExecutiveTimeContextKey {
  return resolveCurrentContext({ workspaceId }).id;
}

function appendHistory(workspaceId: ExecutiveTimeWorkspaceId, position: ExecutiveTimeCameraPosition): void {
  const existing = historyByWorkspace.get(workspaceId);
  const baseEntries = existing ? existing.entries.slice(0, existing.cursor + 1) : [];
  const entry: ExecutiveTimeCameraHistoryEntry = Object.freeze({
    position,
    recordedAt: nowIso(),
  });
  const entries = Object.freeze([...baseEntries, entry]);
  historyByWorkspace.set(
    workspaceId,
    Object.freeze({
      entries,
      cursor: entries.length - 1,
    })
  );
}

function navigateToContext(
  input: ExecutiveTimeCameraMoveRequest
): ExecutiveTimeCameraNavigationResult {
  const validation = validateExecutiveTimeCameraNavigationRequest(input);
  if (!validation.valid) {
    return failure(validation.error!);
  }

  const workspaceId = input.workspaceId.trim();
  const previousContext = getCurrentContextId(workspaceId);
  const duplicateError = resolveDuplicateNavigationError(previousContext, input.contextId);
  if (duplicateError) {
    if (input.reason === "initialization" || input.reason === "restore" || input.replayFromHistory) {
      const position = buildExecutiveTimeCameraPosition({
        workspaceId,
        currentContext: previousContext,
        previousContext: null,
        navigationReason: input.reason ?? "initialization",
        navigationSource: input.source ?? "system",
      });
      if (!input.replayFromHistory && input.reason === "initialization") {
        appendHistory(workspaceId, position);
      }
      return success(position);
    }
    return failure(duplicateError);
  }

  const switchResult = switchExecutiveTimeContext({
    workspaceId,
    contextId: input.contextId,
    contextMetadata: Object.freeze({
      navigationSource: input.source ?? "user",
      navigationReason: input.reason ?? "manual_selection",
      mutatedBy: "executive-time-camera",
    }),
    mutationAuthority: EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY,
  });

  if (!switchResult.success) {
    return failure(Object.freeze({ code: "context_switch_failed", message: switchResult.reason }));
  }

  const position = buildExecutiveTimeCameraPosition({
    workspaceId,
    currentContext: switchResult.currentContextId,
    previousContext: switchResult.previousContextId,
    navigationReason: input.reason ?? "manual_selection",
    navigationSource: input.source ?? "user",
  });

  if (!input.replayFromHistory) {
    appendHistory(workspaceId, position);
  }

  return success(position);
}

export function resetExecutiveTimeCameraForTests(): void {
  historyByWorkspace.clear();
  latestPositionByWorkspace.clear();
}

export function moveToContext(input: ExecutiveTimeCameraMoveRequest): ExecutiveTimeCameraNavigationResult {
  return navigateToContext(input);
}

export function moveForward(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  const current = getCurrentContextId(input.workspaceId);
  const next = resolveForwardContext(current);
  if (!next) {
    return failure(Object.freeze({ code: "forward_blocked", message: "No forward context available." }));
  }
  return navigateToContext({
    ...input,
    contextId: next,
    reason: input.reason ?? "manual_selection",
    source: input.source ?? "user",
  });
}

export function moveBackward(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  const current = getCurrentContextId(input.workspaceId);
  const previous = resolveBackwardContext(current);
  if (!previous) {
    return failure(Object.freeze({ code: "backward_blocked", message: "No backward context available." }));
  }
  return navigateToContext({
    ...input,
    contextId: previous,
    reason: input.reason ?? "manual_selection",
    source: input.source ?? "user",
  });
}

export function jumpToToday(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  return navigateToContext({ ...input, contextId: "today", reason: input.reason ?? "shortcut", source: input.source ?? "user" });
}

export function jumpToCurrentQuarter(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  return navigateToContext({ ...input, contextId: "this_quarter", reason: input.reason ?? "shortcut", source: input.source ?? "user" });
}

export function jumpToCurrentYear(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  return navigateToContext({ ...input, contextId: "this_year", reason: input.reason ?? "shortcut", source: input.source ?? "user" });
}

export function jumpToFutureProjection(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  return navigateToContext({ ...input, contextId: "future_projection", reason: input.reason ?? "forecast", source: input.source ?? "user" });
}

export function jumpToPastReview(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  return navigateToContext({ ...input, contextId: "past_review", reason: input.reason ?? "review", source: input.source ?? "user" });
}

export function resetCamera(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  clearHistory(input.workspaceId);
  return navigateToContext({
    ...input,
    contextId: "now",
    reason: input.reason ?? "restore",
    source: input.source ?? "system",
  });
}

export function previous(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  const workspaceId = input.workspaceId.trim();
  const history = historyByWorkspace.get(workspaceId);
  if (!history || history.cursor <= 0) {
    return failure(Object.freeze({ code: "history_previous_blocked", message: "No previous camera history entry." }));
  }
  const nextCursor = history.cursor - 1;
  const entry = history.entries[nextCursor];
  historyByWorkspace.set(workspaceId, Object.freeze({ entries: history.entries, cursor: nextCursor }));
  return navigateToContext({
    workspaceId,
    contextId: entry.position.currentContext,
    source: entry.position.navigationSource,
    reason: entry.position.navigationReason,
    replayFromHistory: true,
  });
}

export function next(input: ExecutiveTimeCameraNavigationRequest): ExecutiveTimeCameraNavigationResult {
  const workspaceId = input.workspaceId.trim();
  const history = historyByWorkspace.get(workspaceId);
  if (!history || history.cursor >= history.entries.length - 1) {
    return failure(Object.freeze({ code: "history_next_blocked", message: "No next camera history entry." }));
  }
  const nextCursor = history.cursor + 1;
  const entry = history.entries[nextCursor];
  historyByWorkspace.set(workspaceId, Object.freeze({ entries: history.entries, cursor: nextCursor }));
  return navigateToContext({
    workspaceId,
    contextId: entry.position.currentContext,
    source: entry.position.navigationSource,
    reason: entry.position.navigationReason,
    replayFromHistory: true,
  });
}

export function clearHistory(workspaceId: ExecutiveTimeWorkspaceId): void {
  historyByWorkspace.delete(workspaceId.trim());
}

export function getHistory(workspaceId: ExecutiveTimeWorkspaceId): ExecutiveTimeCameraHistorySnapshot {
  const key = workspaceId.trim();
  const history = historyByWorkspace.get(key);
  if (!history) {
    return Object.freeze({
      workspaceId: key,
      entries: Object.freeze([]),
      cursor: -1,
      canPrevious: false,
      canNext: false,
    });
  }
  return Object.freeze({
    workspaceId: key,
    entries: Object.freeze([...history.entries]),
    cursor: history.cursor,
    canPrevious: history.cursor > 0,
    canNext: history.cursor < history.entries.length - 1,
  });
}

export function getExecutiveTimeCameraPosition(
  workspaceId: ExecutiveTimeWorkspaceId
): ExecutiveTimeCameraPosition | null {
  const latest = latestPositionByWorkspace.get(workspaceId.trim());
  if (latest) return latest;
  const current = resolveCurrentContext({ workspaceId });
  return buildExecutiveTimeCameraPosition({
    workspaceId: workspaceId.trim(),
    currentContext: current.id,
    previousContext: null,
    navigationReason: "initialization",
    navigationSource: "system",
  });
}

export const ExecutiveTimeCameraEngine = Object.freeze({
  moveToContext,
  moveForward,
  moveBackward,
  jumpToToday,
  jumpToCurrentQuarter,
  jumpToCurrentYear,
  jumpToFutureProjection,
  jumpToPastReview,
  resetCamera,
  previous,
  next,
  clearHistory,
  getHistory,
  getExecutiveTimeCameraPosition,
});
