/**
 * PHASE-3 / EMG-2 — Executive Model Generation Pipeline diagnostics.
 * Pipeline lifecycle events only — no runtime execution.
 */

import {
  EXECUTIVE_MODEL_PIPELINE_LOG_PREFIX,
  EXECUTIVE_MODEL_PIPELINE_SOURCE,
} from "./executiveModelPipelineContract.ts";
import type {
  PipelineDiagnosticEvent,
  PipelineDiagnosticEventType,
  PipelineDiagnosticLogEntry,
  PipelineWorkspaceId,
} from "./executiveModelPipelineTypes.ts";

const eventLog: PipelineDiagnosticEvent[] = [];
const diagnosticLog: PipelineDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordPipelineDiagnosticEvent(input: {
  type: PipelineDiagnosticEventType;
  executionSessionId?: string | null;
  workspaceId?: PipelineWorkspaceId | null;
}): PipelineDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    executionSessionId: input.executionSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordPipelineDiagnostic(input: {
  type: PipelineDiagnosticEventType;
  executionSessionId?: string | null;
  workspaceId?: PipelineWorkspaceId | null;
  message: string;
}): PipelineDiagnosticLogEntry {
  const entry = Object.freeze({
    executionSessionId: input.executionSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_MODEL_PIPELINE_LOG_PREFIX, {
      source: EXECUTIVE_MODEL_PIPELINE_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getPipelineDiagnosticEvents(): readonly PipelineDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getPipelineDiagnosticsLog(): readonly PipelineDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetPipelineDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveModelPipelineDiagnostics = Object.freeze({
  recordPipelineDiagnosticEvent,
  recordPipelineDiagnostic,
  getPipelineDiagnosticEvents,
  getPipelineDiagnosticsLog,
  resetPipelineDiagnosticsForTests,
});
