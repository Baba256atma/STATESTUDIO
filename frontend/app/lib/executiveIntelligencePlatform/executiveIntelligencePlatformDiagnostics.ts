/**
 * PHASE-10 / EIP-1 — Executive Intelligence Platform diagnostics.
 * Orchestration lifecycle events only — no reasoning logic.
 */

import {
  EXECUTIVE_INTELLIGENCE_PLATFORM_LOG_PREFIX,
  EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
} from "./executiveIntelligencePlatformContract.ts";
import type {
  ExecutiveIntelligenceDiagnosticEvent,
  ExecutiveIntelligenceDiagnosticEventType,
  ExecutiveIntelligenceDiagnosticLogEntry,
  ExecutiveIntelligenceWorkspaceId,
} from "./executiveIntelligencePlatformTypes.ts";

const eventLog: ExecutiveIntelligenceDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveIntelligenceDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveIntelligenceDiagnosticEvent(input: {
  type: ExecutiveIntelligenceDiagnosticEventType;
  intelligenceSessionId?: string | null;
  workspaceId?: ExecutiveIntelligenceWorkspaceId | null;
  requestId?: string | null;
  responseId?: string | null;
}): ExecutiveIntelligenceDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    intelligenceSessionId: input.intelligenceSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    requestId: input.requestId?.trim() || null,
    responseId: input.responseId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveIntelligenceDiagnostic(input: {
  type: ExecutiveIntelligenceDiagnosticEventType;
  intelligenceSessionId?: string | null;
  workspaceId?: ExecutiveIntelligenceWorkspaceId | null;
  requestId?: string | null;
  responseId?: string | null;
  message: string;
}): ExecutiveIntelligenceDiagnosticLogEntry {
  const entry = Object.freeze({
    intelligenceSessionId: input.intelligenceSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    requestId: input.requestId?.trim() || null,
    responseId: input.responseId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_INTELLIGENCE_PLATFORM_LOG_PREFIX, {
      source: EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveIntelligenceDiagnosticEvents(): readonly ExecutiveIntelligenceDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveIntelligenceDiagnosticsLog(): readonly ExecutiveIntelligenceDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveIntelligenceDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveIntelligencePlatformDiagnostics = Object.freeze({
  recordExecutiveIntelligenceDiagnosticEvent,
  recordExecutiveIntelligenceDiagnostic,
  getExecutiveIntelligenceDiagnosticEvents,
  getExecutiveIntelligenceDiagnosticsLog,
  resetExecutiveIntelligenceDiagnosticsForTests,
});
