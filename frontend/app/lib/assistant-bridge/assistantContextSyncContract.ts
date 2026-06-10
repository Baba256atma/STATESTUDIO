/**
 * MRP:7:3 — Dashboard ↔ Assistant context synchronization contract.
 *
 * Dashboard executes and publishes read-only context copies.
 * Assistant understands conversation continuity — never owns execution state.
 */

import type { DashboardMode } from "../dashboard/dashboardModeRuntimeContract.ts";
import { dashboardModeLabel } from "../dashboard/dashboardModeRuntimeContract.ts";

export type WorkspaceCompletionStatus =
  | "none"
  | "opened"
  | "active"
  | "returned_passive"
  | "completed";

export type DashboardContextRouteType =
  | "object_panel"
  | "assistant_bridge"
  | "dashboard_direct"
  | "return_passive";

export type DashboardWorkspaceStatus = "inactive" | "active";

/** Reserved for future workspace modes — placeholder only. */
export const FUTURE_EXECUTIVE_WORKSPACE_TYPES = Object.freeze([
  "risk",
  "timeline",
  "simulation",
  "recommendations",
  "decision_center",
] as const);

export type DashboardExecutiveContextSummary = Readonly<{
  workspaceType: DashboardMode;
  objectId: string | null;
  objectName: string | null;
  workspaceStatus: DashboardWorkspaceStatus;
  completionStatus: WorkspaceCompletionStatus;
  executionTimestamp: number;
  routeType: DashboardContextRouteType;
  currentDashboardMode: DashboardMode;
  lastWorkspaceType: DashboardMode | null;
  lastRouteType: DashboardContextRouteType | null;
  executiveFocusObjectId: string | null;
  lifecycleState: string | null;
  previousLifecycleState: string | null;
  lifecycleTransitionTimestamp: number | null;
  navigationPreviousWorkspaceId: string | null;
  navigationRecentPath: readonly string[];
  source: "dashboard_runtime";
}>;

export type BuildDashboardContextSummaryInput = Readonly<{
  dashboardMode: DashboardMode;
  dashboardRouteObjectId: string | null;
  dashboardRouteObjectName: string | null;
  selectedObjectId: string | null;
  selectedObjectName: string | null;
  completionStatus: WorkspaceCompletionStatus;
  routeType: DashboardContextRouteType;
  workspaceStatus?: DashboardWorkspaceStatus;
  lastWorkspaceType?: DashboardMode | null;
  lastRouteType?: DashboardContextRouteType | null;
  executionTimestamp?: number;
  lifecycleState?: string | null;
  previousLifecycleState?: string | null;
  lifecycleTransitionTimestamp?: number | null;
  navigationPreviousWorkspaceId?: string | null;
  navigationRecentPath?: readonly string[];
}>;

export type DashboardContextSummaryValidationResult = Readonly<{
  valid: boolean;
  summary: DashboardExecutiveContextSummary | null;
  reason: string;
}>;

export type AssistantContextConsumeResult = Readonly<{
  accepted: boolean;
  summary: DashboardExecutiveContextSummary | null;
  reason: string;
}>;

export const DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT = "nexora:dashboard-assistant-context-sync";

const loggedBrakes = new Set<string>();
let lastPublishedSignature: string | null = null;

export function warnAssistantContextSyncBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[AssistantContextSync][Brake]", { message, ...detail });
}

export function resetAssistantContextSyncForTests(): void {
  loggedBrakes.clear();
  lastPublishedSignature = null;
}

function resolveObjectFields(input: BuildDashboardContextSummaryInput): {
  objectId: string | null;
  objectName: string | null;
} {
  const objectId =
    input.dashboardRouteObjectId?.trim() || input.selectedObjectId?.trim() || null;
  const objectName =
    input.dashboardRouteObjectName?.trim() ||
    input.selectedObjectName?.trim() ||
    objectId;
  return { objectId, objectName };
}

function isDedicatedWorkspace(mode: DashboardMode): boolean {
  return mode !== "overview";
}

export function buildDashboardExecutiveContextSummary(
  input: BuildDashboardContextSummaryInput
): DashboardExecutiveContextSummary {
  const { objectId, objectName } = resolveObjectFields(input);
  const workspaceStatus =
    input.workspaceStatus ??
    (isDedicatedWorkspace(input.dashboardMode) ? "active" : "inactive");

  return Object.freeze({
    workspaceType: input.dashboardMode,
    objectId,
    objectName,
    workspaceStatus,
    completionStatus: input.completionStatus,
    executionTimestamp: input.executionTimestamp ?? Date.now(),
    routeType: input.routeType,
    currentDashboardMode: input.dashboardMode,
    lastWorkspaceType: input.lastWorkspaceType ?? input.dashboardMode,
    lastRouteType: input.lastRouteType ?? input.routeType,
    executiveFocusObjectId: objectId,
    lifecycleState: input.lifecycleState ?? null,
    previousLifecycleState: input.previousLifecycleState ?? null,
    lifecycleTransitionTimestamp: input.lifecycleTransitionTimestamp ?? null,
    navigationPreviousWorkspaceId: input.navigationPreviousWorkspaceId ?? null,
    navigationRecentPath: Object.freeze([...(input.navigationRecentPath ?? [])]),
    source: "dashboard_runtime",
  });
}

export function validateDashboardExecutiveContextSummary(
  value: unknown
): DashboardContextSummaryValidationResult {
  if (!value || typeof value !== "object") {
    warnAssistantContextSyncBrake("Invalid context payload.");
    return Object.freeze({ valid: false, summary: null, reason: "invalid_context_payload" });
  }

  const record = value as Record<string, unknown>;
  if (record.source !== "dashboard_runtime") {
    warnAssistantContextSyncBrake("Invalid synchronization contract.", { source: record.source });
    return Object.freeze({ valid: false, summary: null, reason: "invalid_sync_contract" });
  }

  const dashboardMode = typeof record.currentDashboardMode === "string"
    ? record.currentDashboardMode
    : typeof record.workspaceType === "string"
      ? record.workspaceType
      : null;

  if (!dashboardMode) {
    warnAssistantContextSyncBrake("Missing dashboard state.");
    return Object.freeze({ valid: false, summary: null, reason: "missing_dashboard_state" });
  }

  const completionStatus = record.completionStatus;
  if (typeof completionStatus !== "string") {
    warnAssistantContextSyncBrake("Missing completion summary.");
    return Object.freeze({ valid: false, summary: null, reason: "missing_completion_summary" });
  }

  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: dashboardMode as DashboardMode,
    dashboardRouteObjectId: typeof record.objectId === "string" ? record.objectId : null,
    dashboardRouteObjectName: typeof record.objectName === "string" ? record.objectName : null,
    selectedObjectId: typeof record.objectId === "string" ? record.objectId : null,
    selectedObjectName: typeof record.objectName === "string" ? record.objectName : null,
    completionStatus: completionStatus as WorkspaceCompletionStatus,
    routeType: (record.routeType as DashboardContextRouteType) ?? "dashboard_direct",
    workspaceStatus: record.workspaceStatus as DashboardWorkspaceStatus | undefined,
    lastWorkspaceType: (record.lastWorkspaceType as DashboardMode | null) ?? null,
    lastRouteType: (record.lastRouteType as DashboardContextRouteType | null) ?? null,
    executionTimestamp:
      typeof record.executionTimestamp === "number" ? record.executionTimestamp : Date.now(),
    lifecycleState: typeof record.lifecycleState === "string" ? record.lifecycleState : null,
    previousLifecycleState:
      typeof record.previousLifecycleState === "string" ? record.previousLifecycleState : null,
    lifecycleTransitionTimestamp:
      typeof record.lifecycleTransitionTimestamp === "number"
        ? record.lifecycleTransitionTimestamp
        : null,
    navigationPreviousWorkspaceId:
      typeof record.navigationPreviousWorkspaceId === "string"
        ? record.navigationPreviousWorkspaceId
        : null,
    navigationRecentPath: Array.isArray(record.navigationRecentPath)
      ? record.navigationRecentPath.filter((v): v is string => typeof v === "string")
      : [],
  });

  return Object.freeze({ valid: true, summary, reason: "validated" });
}

export function buildContextSummarySignature(summary: DashboardExecutiveContextSummary): string {
  return [
    summary.workspaceType,
    summary.objectId ?? "",
    summary.completionStatus,
    summary.routeType,
    summary.currentDashboardMode,
    summary.workspaceStatus,
  ].join("|");
}

export function publishDashboardExecutiveContextSummary(
  input: BuildDashboardContextSummaryInput,
  options: { force?: boolean } = {}
): DashboardExecutiveContextSummary | null {
  if (typeof window === "undefined") {
    warnAssistantContextSyncBrake("Missing dashboard state.");
    return null;
  }

  const summary = buildDashboardExecutiveContextSummary(input);
  const validation = validateDashboardExecutiveContextSummary(summary);
  if (!validation.valid || !validation.summary) {
    return null;
  }

  const signature = buildContextSummarySignature(validation.summary);
  if (!options.force && signature === lastPublishedSignature) {
    return validation.summary;
  }
  lastPublishedSignature = signature;

  window.dispatchEvent(
    new CustomEvent(DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT, {
      detail: validation.summary,
    })
  );

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[AssistantContextSync][Publish]", validation.summary);
  }

  return validation.summary;
}

export function consumeDashboardExecutiveContextSummary(
  value: unknown
): AssistantContextConsumeResult {
  const validation = validateDashboardExecutiveContextSummary(value);
  if (!validation.valid || !validation.summary) {
    return Object.freeze({
      accepted: false,
      summary: null,
      reason: validation.reason,
    });
  }

  return Object.freeze({
    accepted: true,
    summary: validation.summary,
    reason: "consumed_read_only_copy",
  });
}

export function formatExecutiveContinuityMessage(
  summary: DashboardExecutiveContextSummary | null
): string | null {
  if (!summary) return null;

  const modeLabel = dashboardModeLabel(summary.workspaceType);
  const objectLabel = summary.objectName || summary.objectId;

  switch (summary.completionStatus) {
    case "returned_passive":
      return objectLabel
        ? `You returned from the ${modeLabel} workspace for ${objectLabel}. Executive context remains available.`
        : `You returned from the ${modeLabel} workspace. Executive context remains available.`;
    case "opened":
    case "active":
      return objectLabel
        ? `The ${modeLabel} workspace is active for ${objectLabel}. You may continue here without repeating context.`
        : `The ${modeLabel} workspace is active. You may continue here without repeating context.`;
    case "completed":
      return objectLabel
        ? `The ${modeLabel} workspace session for ${objectLabel} completed.`
        : `The ${modeLabel} workspace session completed.`;
    default:
      return objectLabel
        ? `Executive context: ${objectLabel} · ${modeLabel}`
        : `Executive context: ${modeLabel}`;
  }
}
