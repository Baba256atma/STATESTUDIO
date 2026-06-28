/**
 * PHASE-5 / DS3-INT-1 — Executive Relationship Model Integration diagnostics.
 * Integration lifecycle events only — no discovery logic.
 */

import {
  EXECUTIVE_RELATIONSHIP_INTEGRATION_LOG_PREFIX,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_SOURCE,
} from "./executiveRelationshipContract.ts";
import type {
  ExecutiveRelationshipDiagnosticEvent,
  ExecutiveRelationshipDiagnosticEventType,
  ExecutiveRelationshipDiagnosticLogEntry,
  ExecutiveRelationshipWorkspaceId,
} from "./executiveRelationshipTypes.ts";

const eventLog: ExecutiveRelationshipDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveRelationshipDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveRelationshipDiagnosticEvent(input: {
  type: ExecutiveRelationshipDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveRelationshipWorkspaceId | null;
  executiveRelationshipId?: string | null;
}): ExecutiveRelationshipDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveRelationshipId: input.executiveRelationshipId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveRelationshipDiagnostic(input: {
  type: ExecutiveRelationshipDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveRelationshipWorkspaceId | null;
  executiveRelationshipId?: string | null;
  message: string;
}): ExecutiveRelationshipDiagnosticLogEntry {
  const entry = Object.freeze({
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveRelationshipId: input.executiveRelationshipId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_RELATIONSHIP_INTEGRATION_LOG_PREFIX, {
      source: EXECUTIVE_RELATIONSHIP_INTEGRATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveRelationshipDiagnosticEvents(): readonly ExecutiveRelationshipDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveRelationshipDiagnosticsLog(): readonly ExecutiveRelationshipDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveRelationshipDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveRelationshipDiagnostics = Object.freeze({
  recordExecutiveRelationshipDiagnosticEvent,
  recordExecutiveRelationshipDiagnostic,
  getExecutiveRelationshipDiagnosticEvents,
  getExecutiveRelationshipDiagnosticsLog,
  resetExecutiveRelationshipDiagnosticsForTests,
});
