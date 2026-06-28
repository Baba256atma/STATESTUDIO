/**
 * PHASE-1 / STAGE-ARCH-2 — Stage architecture diagnostics.
 * Lifecycle and boundary events for stage workflow traceability.
 */

import {
  NEXORA_STAGE_ARCHITECTURE_LOG_PREFIX,
  STAGE_ARCHITECTURE_SOURCE,
} from "./stageArchitectureContract.ts";
import type {
  StageArchitectureDiagnosticEntry,
  StageArchitectureEvent,
  StageArchitectureEventType,
  StageLifecyclePhase,
} from "./stageArchitectureTypes.ts";

const eventLog: StageArchitectureEvent[] = [];
const diagnosticLog: StageArchitectureDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordStageArchitectureEvent(input: {
  type: StageArchitectureEventType;
  stageId?: string | null;
  lifecycle?: StageLifecyclePhase | null;
}): StageArchitectureEvent {
  const event = Object.freeze({
    type: input.type,
    stageId: input.stageId?.trim() || null,
    lifecycle: input.lifecycle ?? null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordStageArchitectureDiagnostic(input: {
  stageId?: string | null;
  event: StageArchitectureEventType;
  message: string;
}): StageArchitectureDiagnosticEntry {
  const entry = Object.freeze({
    stageId: input.stageId?.trim() || null,
    event: input.event,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_STAGE_ARCHITECTURE_LOG_PREFIX, {
      source: STAGE_ARCHITECTURE_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getStageArchitectureEvents(): readonly StageArchitectureEvent[] {
  return Object.freeze([...eventLog]);
}

export function getStageArchitectureDiagnosticsLog(): readonly StageArchitectureDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetStageArchitectureDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const StageArchitectureDiagnostics = Object.freeze({
  recordStageArchitectureEvent,
  recordStageArchitectureDiagnostic,
  getStageArchitectureEvents,
  getStageArchitectureDiagnosticsLog,
  resetStageArchitectureDiagnosticsForTests,
});
