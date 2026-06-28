/**
 * PHASE-2 / DS1:4 — Input / Data Source Center diagnostics.
 * Request lifecycle events only — no runtime or execution logic.
 */

import {
  INPUT_DATA_SOURCE_CENTER_SOURCE,
  NEXORA_INPUT_DATA_SOURCE_CENTER_LOG_PREFIX,
} from "./inputDataSourceCenterContract.ts";
import type {
  InputCenterDiagnosticEntry,
  InputCenterEvent,
  InputCenterEventType,
  InputCenterWorkspaceId,
} from "./inputDataSourceCenterTypes.ts";

const eventLog: InputCenterEvent[] = [];
const diagnosticLog: InputCenterDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordInputCenterEvent(input: {
  type: InputCenterEventType;
  requestId?: string | null;
  workspaceId?: InputCenterWorkspaceId | null;
}): InputCenterEvent {
  const event = Object.freeze({
    type: input.type,
    requestId: input.requestId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordInputCenterDiagnostic(input: {
  type: InputCenterEventType;
  requestId?: string | null;
  workspaceId?: InputCenterWorkspaceId | null;
  message: string;
}): InputCenterDiagnosticEntry {
  const entry = Object.freeze({
    requestId: input.requestId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_INPUT_DATA_SOURCE_CENTER_LOG_PREFIX, {
      source: INPUT_DATA_SOURCE_CENTER_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getInputCenterEvents(): readonly InputCenterEvent[] {
  return Object.freeze([...eventLog]);
}

export function getInputCenterDiagnosticsLog(): readonly InputCenterDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetInputCenterDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const InputDataSourceCenterDiagnostics = Object.freeze({
  recordInputCenterEvent,
  recordInputCenterDiagnostic,
  getInputCenterEvents,
  getInputCenterDiagnosticsLog,
  resetInputCenterDiagnosticsForTests,
});
