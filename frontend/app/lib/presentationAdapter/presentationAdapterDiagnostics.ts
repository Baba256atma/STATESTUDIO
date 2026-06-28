/**
 * PHASE-13 / PA-1 — Presentation Adapter diagnostics.
 * Adapter lifecycle events only — no business logic or registry access.
 */

import {
  PRESENTATION_ADAPTER_LOG_PREFIX,
  PRESENTATION_ADAPTER_SOURCE,
} from "./presentationAdapterContract.ts";
import type {
  PresentationAdapterDiagnosticEvent,
  PresentationAdapterDiagnosticEventType,
  PresentationAdapterDiagnosticLogEntry,
  PresentationAdapterWorkspaceId,
} from "./presentationAdapterTypes.ts";

const eventLog: PresentationAdapterDiagnosticEvent[] = [];
const diagnosticLog: PresentationAdapterDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordPresentationAdapterDiagnosticEvent(input: {
  type: PresentationAdapterDiagnosticEventType;
  adapterId?: string | null;
  workspaceId?: PresentationAdapterWorkspaceId | null;
  dashboardSessionId?: string | null;
  assistantSessionId?: string | null;
  eventId?: string | null;
}): PresentationAdapterDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    adapterId: input.adapterId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    dashboardSessionId: input.dashboardSessionId?.trim() || null,
    assistantSessionId: input.assistantSessionId?.trim() || null,
    eventId: input.eventId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordPresentationAdapterDiagnostic(input: {
  type: PresentationAdapterDiagnosticEventType;
  adapterId?: string | null;
  workspaceId?: PresentationAdapterWorkspaceId | null;
  dashboardSessionId?: string | null;
  assistantSessionId?: string | null;
  eventId?: string | null;
  message: string;
}): PresentationAdapterDiagnosticLogEntry {
  const entry = Object.freeze({
    adapterId: input.adapterId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    dashboardSessionId: input.dashboardSessionId?.trim() || null,
    assistantSessionId: input.assistantSessionId?.trim() || null,
    eventId: input.eventId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(PRESENTATION_ADAPTER_LOG_PREFIX, {
      source: PRESENTATION_ADAPTER_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getPresentationAdapterDiagnosticEvents(): readonly PresentationAdapterDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getPresentationAdapterDiagnosticsLog(): readonly PresentationAdapterDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetPresentationAdapterDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const PresentationAdapterDiagnostics = Object.freeze({
  recordPresentationAdapterDiagnosticEvent,
  recordPresentationAdapterDiagnostic,
  getPresentationAdapterDiagnosticEvents,
  getPresentationAdapterDiagnosticsLog,
  resetPresentationAdapterDiagnosticsForTests,
});
