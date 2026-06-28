/**
 * PHASE-3 / EMG-1 — Executive Model Generation diagnostics.
 * Generation lifecycle events only — no runtime execution.
 */

import {
  EXECUTIVE_MODEL_GENERATION_SOURCE,
  NEXORA_EXECUTIVE_MODEL_LOG_PREFIX,
} from "./executiveModelGenerationContract.ts";
import type {
  ExecutiveModelGenerationDiagnosticEntry,
  ExecutiveModelGenerationEvent,
  ExecutiveModelGenerationEventType,
  ExecutiveModelWorkspaceId,
} from "./executiveModelGenerationTypes.ts";

const eventLog: ExecutiveModelGenerationEvent[] = [];
const diagnosticLog: ExecutiveModelGenerationDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveModelGenerationEvent(input: {
  type: ExecutiveModelGenerationEventType;
  executiveModelId?: string | null;
  workspaceId?: ExecutiveModelWorkspaceId | null;
}): ExecutiveModelGenerationEvent {
  const event = Object.freeze({
    type: input.type,
    executiveModelId: input.executiveModelId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveModelGenerationDiagnostic(input: {
  type: ExecutiveModelGenerationEventType;
  executiveModelId?: string | null;
  workspaceId?: ExecutiveModelWorkspaceId | null;
  message: string;
}): ExecutiveModelGenerationDiagnosticEntry {
  const entry = Object.freeze({
    executiveModelId: input.executiveModelId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_EXECUTIVE_MODEL_LOG_PREFIX, {
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveModelGenerationEvents(): readonly ExecutiveModelGenerationEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveModelGenerationDiagnosticsLog(): readonly ExecutiveModelGenerationDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveModelGenerationDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveModelGenerationDiagnostics = Object.freeze({
  recordExecutiveModelGenerationEvent,
  recordExecutiveModelGenerationDiagnostic,
  getExecutiveModelGenerationEvents,
  getExecutiveModelGenerationDiagnosticsLog,
  resetExecutiveModelGenerationDiagnosticsForTests,
});
