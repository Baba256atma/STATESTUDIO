/**
 * PHASE-6 / DS4-INT-1 — Executive KPI Model Integration diagnostics.
 * Integration lifecycle events only — no calculation logic.
 */

import {
  EXECUTIVE_KPI_INTEGRATION_LOG_PREFIX,
  EXECUTIVE_KPI_INTEGRATION_SOURCE,
} from "./executiveKpiContract.ts";
import type {
  ExecutiveKpiDiagnosticEvent,
  ExecutiveKpiDiagnosticEventType,
  ExecutiveKpiDiagnosticLogEntry,
  ExecutiveKpiWorkspaceId,
} from "./executiveKpiTypes.ts";

const eventLog: ExecutiveKpiDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveKpiDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveKpiDiagnosticEvent(input: {
  type: ExecutiveKpiDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveKpiWorkspaceId | null;
  executiveKpiId?: string | null;
}): ExecutiveKpiDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveKpiId: input.executiveKpiId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveKpiDiagnostic(input: {
  type: ExecutiveKpiDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveKpiWorkspaceId | null;
  executiveKpiId?: string | null;
  message: string;
}): ExecutiveKpiDiagnosticLogEntry {
  const entry = Object.freeze({
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveKpiId: input.executiveKpiId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_KPI_INTEGRATION_LOG_PREFIX, {
      source: EXECUTIVE_KPI_INTEGRATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveKpiDiagnosticEvents(): readonly ExecutiveKpiDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveKpiDiagnosticsLog(): readonly ExecutiveKpiDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveKpiDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveKpiDiagnostics = Object.freeze({
  recordExecutiveKpiDiagnosticEvent,
  recordExecutiveKpiDiagnostic,
  getExecutiveKpiDiagnosticEvents,
  getExecutiveKpiDiagnosticsLog,
  resetExecutiveKpiDiagnosticsForTests,
});
