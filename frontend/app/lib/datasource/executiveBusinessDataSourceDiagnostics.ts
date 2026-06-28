/**
 * PHASE-2 / DS1:1 — Executive Business Data Source diagnostics.
 * Lifecycle events for semantic contract traceability only.
 */

import {
  EXECUTIVE_BUSINESS_DATA_SOURCE_SOURCE,
  NEXORA_EXECUTIVE_BUSINESS_DATA_SOURCE_LOG_PREFIX,
} from "./executiveBusinessDataSourceContract.ts";
import type {
  ExecutiveBusinessDataSourceDiagnosticEntry,
  ExecutiveBusinessDataSourceEvent,
  ExecutiveBusinessDataSourceEventType,
  ExecutiveBusinessDataSourceWorkspaceId,
} from "./executiveBusinessDataSourceTypes.ts";

const eventLog: ExecutiveBusinessDataSourceEvent[] = [];
const diagnosticLog: ExecutiveBusinessDataSourceDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveBusinessDataSourceEvent(input: {
  type: ExecutiveBusinessDataSourceEventType;
  businessDataSourceId?: string | null;
  workspaceId?: ExecutiveBusinessDataSourceWorkspaceId | null;
}): ExecutiveBusinessDataSourceEvent {
  const event = Object.freeze({
    type: input.type,
    businessDataSourceId: input.businessDataSourceId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveBusinessDataSourceDiagnostic(input: {
  type: ExecutiveBusinessDataSourceEventType;
  businessDataSourceId?: string | null;
  workspaceId?: ExecutiveBusinessDataSourceWorkspaceId | null;
  message: string;
}): ExecutiveBusinessDataSourceDiagnosticEntry {
  const entry = Object.freeze({
    businessDataSourceId: input.businessDataSourceId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_EXECUTIVE_BUSINESS_DATA_SOURCE_LOG_PREFIX, {
      source: EXECUTIVE_BUSINESS_DATA_SOURCE_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveBusinessDataSourceEvents(): readonly ExecutiveBusinessDataSourceEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveBusinessDataSourceDiagnosticsLog(): readonly ExecutiveBusinessDataSourceDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveBusinessDataSourceDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveBusinessDataSourceDiagnostics = Object.freeze({
  recordExecutiveBusinessDataSourceEvent,
  recordExecutiveBusinessDataSourceDiagnostic,
  getExecutiveBusinessDataSourceEvents,
  getExecutiveBusinessDataSourceDiagnosticsLog,
  resetExecutiveBusinessDataSourceDiagnosticsForTests,
});
