/**
 * PHASE-11 / EDI-1 — Executive Dashboard Intelligence diagnostics.
 * Presentation lifecycle events only — no rendering logic.
 */

import {
  EXECUTIVE_DASHBOARD_LOG_PREFIX,
  EXECUTIVE_DASHBOARD_SOURCE,
} from "./executiveDashboardContract.ts";
import type {
  ExecutiveDashboardDiagnosticEvent,
  ExecutiveDashboardDiagnosticEventType,
  ExecutiveDashboardDiagnosticLogEntry,
  ExecutiveDashboardWorkspaceId,
} from "./executiveDashboardTypes.ts";

const eventLog: ExecutiveDashboardDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveDashboardDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveDashboardDiagnosticEvent(input: {
  type: ExecutiveDashboardDiagnosticEventType;
  dashboardSessionId?: string | null;
  workspaceId?: ExecutiveDashboardWorkspaceId | null;
  requestId?: string | null;
  responseId?: string | null;
}): ExecutiveDashboardDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    dashboardSessionId: input.dashboardSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    requestId: input.requestId?.trim() || null,
    responseId: input.responseId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveDashboardDiagnostic(input: {
  type: ExecutiveDashboardDiagnosticEventType;
  dashboardSessionId?: string | null;
  workspaceId?: ExecutiveDashboardWorkspaceId | null;
  requestId?: string | null;
  responseId?: string | null;
  message: string;
}): ExecutiveDashboardDiagnosticLogEntry {
  const entry = Object.freeze({
    dashboardSessionId: input.dashboardSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    requestId: input.requestId?.trim() || null,
    responseId: input.responseId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_DASHBOARD_LOG_PREFIX, {
      source: EXECUTIVE_DASHBOARD_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveDashboardDiagnosticEvents(): readonly ExecutiveDashboardDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveDashboardDiagnosticsLog(): readonly ExecutiveDashboardDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveDashboardDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveDashboardDiagnostics = Object.freeze({
  recordExecutiveDashboardDiagnosticEvent,
  recordExecutiveDashboardDiagnostic,
  getExecutiveDashboardDiagnosticEvents,
  getExecutiveDashboardDiagnosticsLog,
  resetExecutiveDashboardDiagnosticsForTests,
});
