/**
 * PHASE-2 / DS1:6 — Data Source Status diagnostics.
 * Observation lifecycle events only — no polling or runtime logic.
 */

import {
  DATA_SOURCE_STATUS_SOURCE,
  NEXORA_DATA_SOURCE_STATUS_LOG_PREFIX,
} from "./dataSourceStatusContract.ts";
import type {
  DataSourceStatusDiagnosticEntry,
  DataSourceStatusEvent,
  DataSourceStatusEventType,
  DataSourceStatusWorkspaceId,
} from "./dataSourceStatusTypes.ts";

const eventLog: DataSourceStatusEvent[] = [];
const diagnosticLog: DataSourceStatusDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordDataSourceStatusEvent(input: {
  type: DataSourceStatusEventType;
  statusSnapshotId?: string | null;
  workspaceId?: DataSourceStatusWorkspaceId | null;
}): DataSourceStatusEvent {
  const event = Object.freeze({
    type: input.type,
    statusSnapshotId: input.statusSnapshotId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordDataSourceStatusDiagnostic(input: {
  type: DataSourceStatusEventType;
  statusSnapshotId?: string | null;
  workspaceId?: DataSourceStatusWorkspaceId | null;
  message: string;
}): DataSourceStatusDiagnosticEntry {
  const entry = Object.freeze({
    statusSnapshotId: input.statusSnapshotId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_DATA_SOURCE_STATUS_LOG_PREFIX, {
      source: DATA_SOURCE_STATUS_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getDataSourceStatusEvents(): readonly DataSourceStatusEvent[] {
  return Object.freeze([...eventLog]);
}

export function getDataSourceStatusDiagnosticsLog(): readonly DataSourceStatusDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetDataSourceStatusDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const DataSourceStatusDiagnostics = Object.freeze({
  recordDataSourceStatusEvent,
  recordDataSourceStatusDiagnostic,
  getDataSourceStatusEvents,
  getDataSourceStatusDiagnosticsLog,
  resetDataSourceStatusDiagnosticsForTests,
});
