/**
 * PHASE-7 / DS5-INT-1 — Executive Risk Model Integration diagnostics.
 * Integration lifecycle events only — no scoring logic.
 */

import {
  EXECUTIVE_RISK_INTEGRATION_LOG_PREFIX,
  EXECUTIVE_RISK_INTEGRATION_SOURCE,
} from "./executiveRiskContract.ts";
import type {
  ExecutiveRiskDiagnosticEvent,
  ExecutiveRiskDiagnosticEventType,
  ExecutiveRiskDiagnosticLogEntry,
  ExecutiveRiskWorkspaceId,
} from "./executiveRiskTypes.ts";

const eventLog: ExecutiveRiskDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveRiskDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveRiskDiagnosticEvent(input: {
  type: ExecutiveRiskDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveRiskWorkspaceId | null;
  executiveRiskId?: string | null;
}): ExecutiveRiskDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveRiskId: input.executiveRiskId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveRiskDiagnostic(input: {
  type: ExecutiveRiskDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveRiskWorkspaceId | null;
  executiveRiskId?: string | null;
  message: string;
}): ExecutiveRiskDiagnosticLogEntry {
  const entry = Object.freeze({
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveRiskId: input.executiveRiskId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_RISK_INTEGRATION_LOG_PREFIX, {
      source: EXECUTIVE_RISK_INTEGRATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveRiskDiagnosticEvents(): readonly ExecutiveRiskDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveRiskDiagnosticsLog(): readonly ExecutiveRiskDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveRiskDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveRiskDiagnostics = Object.freeze({
  recordExecutiveRiskDiagnosticEvent,
  recordExecutiveRiskDiagnostic,
  getExecutiveRiskDiagnosticEvents,
  getExecutiveRiskDiagnosticsLog,
  resetExecutiveRiskDiagnosticsForTests,
});
