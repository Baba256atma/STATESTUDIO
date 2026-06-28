/**
 * PHASE-8 / DS6-INT-1 — Executive Scenario Model Integration diagnostics.
 * Integration lifecycle events only — no simulation logic.
 */

import {
  EXECUTIVE_SCENARIO_INTEGRATION_LOG_PREFIX,
  EXECUTIVE_SCENARIO_INTEGRATION_SOURCE,
} from "./executiveScenarioContract.ts";
import type {
  ExecutiveScenarioDiagnosticEvent,
  ExecutiveScenarioDiagnosticEventType,
  ExecutiveScenarioDiagnosticLogEntry,
  ExecutiveScenarioWorkspaceId,
} from "./executiveScenarioTypes.ts";

const eventLog: ExecutiveScenarioDiagnosticEvent[] = [];
const diagnosticLog: ExecutiveScenarioDiagnosticLogEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordExecutiveScenarioDiagnosticEvent(input: {
  type: ExecutiveScenarioDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveScenarioWorkspaceId | null;
  executiveScenarioId?: string | null;
}): ExecutiveScenarioDiagnosticEvent {
  const event = Object.freeze({
    type: input.type,
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveScenarioId: input.executiveScenarioId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveScenarioDiagnostic(input: {
  type: ExecutiveScenarioDiagnosticEventType;
  integrationSessionId?: string | null;
  workspaceId?: ExecutiveScenarioWorkspaceId | null;
  executiveScenarioId?: string | null;
  message: string;
}): ExecutiveScenarioDiagnosticLogEntry {
  const entry = Object.freeze({
    integrationSessionId: input.integrationSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    executiveScenarioId: input.executiveScenarioId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(EXECUTIVE_SCENARIO_INTEGRATION_LOG_PREFIX, {
      source: EXECUTIVE_SCENARIO_INTEGRATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getExecutiveScenarioDiagnosticEvents(): readonly ExecutiveScenarioDiagnosticEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveScenarioDiagnosticsLog(): readonly ExecutiveScenarioDiagnosticLogEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetExecutiveScenarioDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ExecutiveScenarioDiagnostics = Object.freeze({
  recordExecutiveScenarioDiagnosticEvent,
  recordExecutiveScenarioDiagnostic,
  getExecutiveScenarioDiagnosticEvents,
  getExecutiveScenarioDiagnosticsLog,
  resetExecutiveScenarioDiagnosticsForTests,
});
