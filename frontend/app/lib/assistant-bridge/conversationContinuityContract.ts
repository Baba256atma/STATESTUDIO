/**
 * MRP:7:4 — Executive Conversation Continuity + Workspace-Aware Assistant contract.
 *
 * Assistant remembers context. Dashboard owns execution.
 * Awareness is read-only — no ownership transfer, no engine state.
 */

import type { DashboardMode } from "../dashboard/dashboardModeRuntimeContract.ts";
import { dashboardModeLabel } from "../dashboard/dashboardModeRuntimeContract.ts";
import type {
  DashboardContextRouteType,
  DashboardExecutiveContextSummary,
  DashboardWorkspaceStatus,
  WorkspaceCompletionStatus,
} from "./assistantContextSyncContract.ts";
import { consumeDashboardExecutiveContextSummary } from "./assistantContextSyncContract.ts";

/** Level 1 — object · Level 2 — workspace · Level 3 — route · Level 4 — intent */
export type AwarenessLevel = 1 | 2 | 3 | 4;

export type ExecutiveIntentKind =
  | "focus"
  | "analyze"
  | "compare"
  | "scenario"
  | "war_room"
  | "overview"
  | "unknown";

export type ConversationToneKind =
  | "focused"
  | "analytical"
  | "comparative"
  | "exploratory"
  | "operational"
  | "general";

export type WorkspaceLifecyclePhase = "none" | "open" | "active" | "exit" | "complete";

/** Reserved future workspace awareness — placeholder only. */
export const FUTURE_CONVERSATION_WORKSPACE_AWARENESS = Object.freeze([
  "risk",
  "timeline",
  "simulation",
  "decision_center",
  "recommendations",
] as const);

export type ExecutiveWorkspaceAwareness = Readonly<{
  currentObjectId: string | null;
  currentObjectName: string | null;
  currentWorkspace: DashboardMode;
  lastWorkspace: DashboardMode | null;
  lastAction: DashboardContextRouteType | null;
  currentDashboardMode: DashboardMode;
  workspaceStatus: DashboardWorkspaceStatus;
  lifecyclePhase: WorkspaceLifecyclePhase;
  awarenessLevel: AwarenessLevel;
  executiveIntent: ExecutiveIntentKind;
  conversationTone: ConversationToneKind;
  syncTimestamp: number;
  source: "assistant_continuity_runtime";
}>;

export type ExecutiveConversationContinuity = Readonly<{
  sessionId: string;
  awareness: ExecutiveWorkspaceAwareness;
  lastSyncSummary: DashboardExecutiveContextSummary | null;
  continuitySignature: string;
  updatedAt: number;
}>;

export type ConversationContinuityUpdateResult = Readonly<{
  accepted: boolean;
  continuity: ExecutiveConversationContinuity | null;
  reason: string;
  resetDetected: boolean;
}>;

const loggedBrakes = new Set<string>();

export function warnConversationContinuityBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[ConversationContinuity][Brake]", { message, ...detail });
}

export function resetConversationContinuityForTests(): void {
  loggedBrakes.clear();
}

export function resolveExecutiveIntentFromWorkspace(mode: DashboardMode): ExecutiveIntentKind {
  switch (mode) {
    case "focus":
      return "focus";
    case "analyze":
      return "analyze";
    case "compare":
      return "compare";
    case "scenario":
      return "scenario";
    case "war_room":
      return "war_room";
    case "overview":
      return "overview";
    default:
      return "unknown";
  }
}

export function resolveConversationToneFromIntent(intent: ExecutiveIntentKind): ConversationToneKind {
  switch (intent) {
    case "focus":
      return "focused";
    case "analyze":
      return "analytical";
    case "compare":
      return "comparative";
    case "scenario":
      return "exploratory";
    case "war_room":
      return "operational";
    case "overview":
      return "general";
    default:
      return "general";
  }
}

export function mapCompletionToLifecyclePhase(
  status: WorkspaceCompletionStatus
): WorkspaceLifecyclePhase {
  switch (status) {
    case "opened":
      return "open";
    case "active":
      return "active";
    case "returned_passive":
      return "exit";
    case "completed":
      return "complete";
    default:
      return "none";
  }
}

export function resolveAwarenessLevel(input: {
  objectId: string | null;
  workspace: DashboardMode;
  routeType: DashboardContextRouteType | null;
  intent: ExecutiveIntentKind;
}): AwarenessLevel {
  if (input.intent !== "unknown" && input.intent !== "overview") return 4;
  if (input.routeType) return 3;
  if (input.workspace !== "overview") return 2;
  if (input.objectId) return 1;
  return 1;
}

export function buildExecutiveWorkspaceAwareness(
  summary: DashboardExecutiveContextSummary
): ExecutiveWorkspaceAwareness {
  const executiveIntent = resolveExecutiveIntentFromWorkspace(summary.workspaceType);
  const conversationTone = resolveConversationToneFromIntent(executiveIntent);
  const awarenessLevel = resolveAwarenessLevel({
    objectId: summary.objectId,
    workspace: summary.workspaceType,
    routeType: summary.routeType,
    intent: executiveIntent,
  });

  return Object.freeze({
    currentObjectId: summary.objectId,
    currentObjectName: summary.objectName,
    currentWorkspace: summary.workspaceType,
    lastWorkspace: summary.lastWorkspaceType,
    lastAction: summary.lastRouteType ?? summary.routeType,
    currentDashboardMode: summary.currentDashboardMode,
    workspaceStatus: summary.workspaceStatus,
    lifecyclePhase: mapCompletionToLifecyclePhase(summary.completionStatus),
    awarenessLevel,
    executiveIntent,
    conversationTone,
    syncTimestamp: summary.executionTimestamp,
    source: "assistant_continuity_runtime",
  });
}

export function buildContinuitySignature(awareness: ExecutiveWorkspaceAwareness): string {
  return [
    awareness.currentObjectId ?? "",
    awareness.currentWorkspace,
    awareness.lastWorkspace ?? "",
    awareness.lastAction ?? "",
    awareness.lifecyclePhase,
    awareness.awarenessLevel,
  ].join("|");
}

export function createInitialConversationContinuity(
  sessionId: string
): ExecutiveConversationContinuity {
  const awareness = Object.freeze({
    currentObjectId: null,
    currentObjectName: null,
    currentWorkspace: "overview" as DashboardMode,
    lastWorkspace: null,
    lastAction: null,
    currentDashboardMode: "overview" as DashboardMode,
    workspaceStatus: "inactive" as DashboardWorkspaceStatus,
    lifecyclePhase: "none" as WorkspaceLifecyclePhase,
    awarenessLevel: 1 as AwarenessLevel,
    executiveIntent: "overview" as ExecutiveIntentKind,
    conversationTone: "general" as ConversationToneKind,
    syncTimestamp: Date.now(),
    source: "assistant_continuity_runtime" as const,
  });

  return Object.freeze({
    sessionId,
    awareness,
    lastSyncSummary: null,
    continuitySignature: buildContinuitySignature(awareness),
    updatedAt: Date.now(),
  });
}

export function validateExecutiveWorkspaceAwareness(
  value: unknown
): { valid: boolean; awareness: ExecutiveWorkspaceAwareness | null; reason: string } {
  if (!value || typeof value !== "object") {
    warnConversationContinuityBrake("Invalid awareness state.");
    return Object.freeze({ valid: false, awareness: null, reason: "invalid_awareness_state" });
  }

  const record = value as Record<string, unknown>;
  if (record.source !== "assistant_continuity_runtime") {
    warnConversationContinuityBrake("Context ownership violation.", { source: record.source });
    return Object.freeze({ valid: false, awareness: null, reason: "context_ownership_violation" });
  }

  if (typeof record.currentWorkspace !== "string") {
    warnConversationContinuityBrake("Missing workspace context.");
    return Object.freeze({ valid: false, awareness: null, reason: "missing_workspace_context" });
  }

  return Object.freeze({
    valid: true,
    awareness: value as ExecutiveWorkspaceAwareness,
    reason: "validated",
  });
}

export function formatWorkspaceAwareResponse(
  awareness: ExecutiveWorkspaceAwareness | null
): string | null {
  if (!awareness) return null;

  const objectLabel = awareness.currentObjectName || awareness.currentObjectId;
  const modeLabel = dashboardModeLabel(awareness.currentWorkspace);
  const lastModeLabel = awareness.lastWorkspace
    ? dashboardModeLabel(awareness.lastWorkspace)
    : null;

  if (awareness.lifecyclePhase === "exit" && lastModeLabel && objectLabel) {
    return `You recently worked in ${lastModeLabel} for ${objectLabel}. Executive context is preserved.`;
  }

  if (awareness.lifecyclePhase === "active" || awareness.lifecyclePhase === "open") {
    return objectLabel
      ? `You are currently reviewing ${objectLabel} in ${modeLabel}.`
      : `You are currently working inside ${modeLabel}.`;
  }

  if (awareness.lastWorkspace && awareness.lastWorkspace !== awareness.currentWorkspace && objectLabel) {
    const lastLabel = dashboardModeLabel(awareness.lastWorkspace);
    return `You recently worked in ${lastLabel} for ${objectLabel}.`;
  }

  if (objectLabel) {
    return `Executive context: ${objectLabel} · ${modeLabel}`;
  }

  return `Executive context: ${modeLabel}`;
}

export function resolveWorkspaceAwarePromptHints(
  intent: ExecutiveIntentKind
): readonly string[] {
  switch (intent) {
    case "analyze":
      return Object.freeze([
        "What should I inspect next?",
        "Which signals matter most in this analysis?",
      ]);
    case "compare":
      return Object.freeze([
        "What differences should I focus on?",
        "Which option deserves closer review?",
      ]);
    case "scenario":
      return Object.freeze([
        "What variables should we explore?",
        "Which scenario path deserves inspection?",
      ]);
    case "war_room":
      return Object.freeze([
        "What operational priorities need attention?",
        "Which coordination gaps should we review?",
      ]);
    case "focus":
      return Object.freeze([
        "What should I examine in this focus view?",
        "Which details need closer attention?",
      ]);
    default:
      return Object.freeze(["What would you like to explore next?"]);
  }
}

export function buildConversationContinuityFromSyncSummary(
  prev: ExecutiveConversationContinuity,
  syncValue: unknown
): ConversationContinuityUpdateResult {
  const consumed = consumeDashboardExecutiveContextSummary(syncValue);
  if (!consumed.accepted || !consumed.summary) {
    warnConversationContinuityBrake("Invalid awareness state.", { reason: consumed.reason });
    return Object.freeze({
      accepted: false,
      continuity: prev,
      reason: consumed.reason,
      resetDetected: false,
    });
  }

  const summary = consumed.summary;
  if (!summary.objectId && !summary.objectName && summary.workspaceType !== "overview") {
    warnConversationContinuityBrake("Missing object context.", {
      workspace: summary.workspaceType,
    });
  }

  const awareness = buildExecutiveWorkspaceAwareness(summary);
  const continuitySignature = buildContinuitySignature(awareness);

  const next = Object.freeze({
    sessionId: prev.sessionId,
    awareness,
    lastSyncSummary: summary,
    continuitySignature,
    updatedAt: Date.now(),
  });

  return Object.freeze({
    accepted: true,
    continuity: next,
    reason: "awareness_merged",
    resetDetected: false,
  });
}
