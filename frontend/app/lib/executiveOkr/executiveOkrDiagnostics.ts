/**
 * PHASE-9 / OKR-INT-1 — Executive OKR Integration diagnostics.
 * Integration lifecycle events only — no calculation logic.
 */

import {
  EXECUTIVE_OKR_INTEGRATION_LOG_PREFIX,
  EXECUTIVE_OKR_INTEGRATION_SOURCE,
} from "./executiveOkrContract.ts";
import type {
  ExecutiveOkrDiagnosticEvent,
  ExecutiveOkrDiagnosticEventType,
  ExecutiveOkrDiagnosticLogEntry,
  ExecutiveOkrWorkspaceId,
} from "./executiveOkrTypes.ts";

const eventLog: ExecutiveOkrDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveOkrDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveOkrDiagnosticEvent(input: {
  type: ExecutiveOkrDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveOkrWorkspaceId | null;
  executiveObjectiveId?: string | null;
  executiveKeyResultId?: string | null;
}): ExecutiveOkrDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveObjectiveId: input.executiveObjectiveId?.trim() || null,
    executiveKeyResultId: input.executiveKeyResultId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveOkrDiagnostic(input: {
  type: ExecutiveOkrDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveOkrWorkspaceId | null;
  executiveObjectiveId?: string | null;
  executiveKeyResultId?: string | null;
  message: string;
}): ExecutiveOkrDiagnosticLogEntry {
  const entry = Object.freeze({
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveObjectiveId: input.executiveObjectiveId?.trim() || null,
    executiveKeyResultId: input.executiveKeyResultId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_OKR_INTEGRATION_LOG_PREFIX, {
      source: EXECUTIVE_OKR_INTEGRATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveOkrDiagnosticEvents(): readonly ExecutiveOkrDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveOkrDiagnosticsLog(): readonly ExecutiveOkrDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveOkrDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveOkrDiagnostics = Object.freeze({
  recordExecutiveOkrDiagnosticEvent,
  recordExecutiveOkrDiagnostic,
  getExecutiveOkrDiagnosticEvents,
  getExecutiveOkrDiagnosticsLog,
  resetExecutiveOkrDiagnosticsForTests,
});
