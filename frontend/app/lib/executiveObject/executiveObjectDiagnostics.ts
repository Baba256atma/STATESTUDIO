/**
 * PHASE-4 / DS2-INT-1 — Executive Object Model Integration diagnostics.
 * Integration lifecycle events only — no domain engine logic.
 */

import {
  EXECUTIVE_OBJECT_INTEGRATION_LOG_PREFIX,
  EXECUTIVE_OBJECT_INTEGRATION_SOURCE,
} from "./executiveObjectContract.ts";
import type {
  ExecutiveObjectDiagnosticEvent,
  ExecutiveObjectDiagnosticEventType,
  ExecutiveObjectDiagnosticLogEntry,
  ExecutiveObjectWorkspaceId,
} from "./executiveObjectTypes.ts";

const eventLog: ExecutiveObjectDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveObjectDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveObjectDiagnosticEvent(input: {
  type: ExecutiveObjectDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveObjectWorkspaceId | null;
  executiveObjectId?: string | null;
}): ExecutiveObjectDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveObjectId: input.executiveObjectId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveObjectDiagnostic(input: {
  type: ExecutiveObjectDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveObjectWorkspaceId | null;
  executiveObjectId?: string | null;
  message: string;
}): ExecutiveObjectDiagnosticLogEntry {
  const entry = Object.freeze({
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveObjectId: input.executiveObjectId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_OBJECT_INTEGRATION_LOG_PREFIX, {
      source: EXECUTIVE_OBJECT_INTEGRATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveObjectDiagnosticEvents(): readonly ExecutiveObjectDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveObjectDiagnosticsLog(): readonly ExecutiveObjectDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveObjectDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveObjectDiagnostics = Object.freeze({
  recordExecutiveObjectDiagnosticEvent,
  recordExecutiveObjectDiagnostic,
  getExecutiveObjectDiagnosticEvents,
  getExecutiveObjectDiagnosticsLog,
  resetExecutiveObjectDiagnosticsForTests,
});
