/**
 * PHASE-12 / EAI-1 — Executive Assistant Intelligence diagnostics.
 * Conversation lifecycle events only — no LLM or reasoning logic.
 */

import {
  EXECUTIVE_ASSISTANT_LOG_PREFIX,
  EXECUTIVE_ASSISTANT_SOURCE,
} from "./executiveAssistantContract.ts";
import type {
  ExecutiveAssistantDiagnosticEvent,
  ExecutiveAssistantDiagnosticEventType,
  ExecutiveAssistantDiagnosticLogEntry,
  ExecutiveAssistantWorkspaceId,
} from "./executiveAssistantTypes.ts";

const eventLog: ExecutiveAssistantDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveAssistantDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveAssistantDiagnosticEvent(input: {
  type: ExecutiveAssistantDiagnosticEventType;
  assistantSessionId?: string | null;
  workspaceId?: ExecutiveAssistantWorkspaceId | null;
  requestId?: string | null;
  responseId?: string | null;
}): ExecutiveAssistantDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    assistantSessionId: input.assistantSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    requestId: input.requestId?.trim() || null,
    responseId: input.responseId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveAssistantDiagnostic(input: {
  type: ExecutiveAssistantDiagnosticEventType;
  assistantSessionId?: string | null;
  workspaceId?: ExecutiveAssistantWorkspaceId | null;
  requestId?: string | null;
  responseId?: string | null;
  message: string;
}): ExecutiveAssistantDiagnosticLogEntry {
  const entry = Object.freeze({
    assistantSessionId: input.assistantSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    requestId: input.requestId?.trim() || null,
    responseId: input.responseId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_ASSISTANT_LOG_PREFIX, {
      source: EXECUTIVE_ASSISTANT_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveAssistantDiagnosticEvents(): readonly ExecutiveAssistantDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveAssistantDiagnosticsLog(): readonly ExecutiveAssistantDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveAssistantDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveAssistantDiagnostics = Object.freeze({
  recordExecutiveAssistantDiagnosticEvent,
  recordExecutiveAssistantDiagnostic,
  getExecutiveAssistantDiagnosticEvents,
  getExecutiveAssistantDiagnosticsLog,
  resetExecutiveAssistantDiagnosticsForTests,
});
