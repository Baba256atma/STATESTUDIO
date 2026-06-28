/**
 * PHASE-3 / EMG-3 — Executive Model Pipeline Runtime diagnostics.
 * Runtime lifecycle events only — no domain engine logic.
 */

import {
  EXECUTIVE_MODEL_RUNTIME_LOG_PREFIX,
  EXECUTIVE_MODEL_RUNTIME_SOURCE,
} from "./executiveModelRuntimeContract.ts";
import type {
  RuntimeDiagnosticEvent,
  RuntimeDiagnosticEventType,
  RuntimeDiagnosticLogEntry,
  RuntimeWorkspaceId,
} from "./executiveModelRuntimeTypes.ts";

const eventLog: RuntimeDiagnosticEvent[] = [];
const diagnosticLog: RuntimeDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordRuntimeDiagnosticEvent(input: {
  type: RuntimeDiagnosticEventType;
  runtimeSessionId?: string | null;
  workspaceId?: RuntimeWorkspaceId | null;
}): RuntimeDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    runtimeSessionId: input.runtimeSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordRuntimeDiagnostic(input: {
  type: RuntimeDiagnosticEventType;
  runtimeSessionId?: string | null;
  workspaceId?: RuntimeWorkspaceId | null;
  message: string;
}): RuntimeDiagnosticLogEntry {
  const entry = Object.freeze({
    runtimeSessionId: input.runtimeSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_MODEL_RUNTIME_LOG_PREFIX, {
      source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getRuntimeDiagnosticEvents(): readonly RuntimeDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getRuntimeDiagnosticsLog(): readonly RuntimeDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetRuntimeDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveModelRuntimeDiagnostics = Object.freeze({
  recordRuntimeDiagnosticEvent,
  recordRuntimeDiagnostic,
  getRuntimeDiagnosticEvents,
  getRuntimeDiagnosticsLog,
  resetRuntimeDiagnosticsForTests,
});
