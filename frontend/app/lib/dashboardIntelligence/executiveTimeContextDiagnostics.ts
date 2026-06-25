/**
 * INT-1.3 — Executive Time Context diagnostics.
 * Development only — no production logging.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type { IntelligenceConsumerId } from "./singleIntelligenceSourceContract.ts";
import {
  EXECUTIVE_TIME_CONTEXT_TAGS,
  NEXORA_EXECUTIVE_TIME_CONTEXT_LOG_PREFIX,
  type ExecutiveTimeContextDiagnostics,
  type ExecutiveTimeContextEvent,
  type ExecutiveTimeContextEventType,
  type ExecutiveTimeContextValidationResult,
  type ExecutiveTimeContext,
} from "./executiveTimeContextContract.ts";

const eventLog: ExecutiveTimeContextEvent[] = [];
const diagnosticsLog: ExecutiveTimeContextDiagnostics[] = [];

export function recordExecutiveTimeContextEvent(input: {
  type: ExecutiveTimeContextEventType;
  timeContextId?: string | null;
  timeState?: ExecutiveTimeContext["timeState"] | null;
}): ExecutiveTimeContextEvent {
  const event = Object.freeze({
    type: input.type,
    timeContextId: input.timeContextId ?? null,
    timeState: input.timeState ?? null,
    timestamp: new Date().toISOString(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveTimeContextDiagnostics(
  entry: ExecutiveTimeContextDiagnostics
): ExecutiveTimeContextDiagnostics {
  diagnosticsLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    devDiagnosticLog("executiveTimeContext", NEXORA_EXECUTIVE_TIME_CONTEXT_LOG_PREFIX, {
      timeContextId: entry.timeContextId,
      consumer: entry.consumer,
      workspace: entry.workspace,
      timeState: entry.timeState,
      contextVersion: entry.contextVersion,
      valid: entry.validationResult.valid,
      executionTimeMs: entry.executionTimeMs,
      tags: EXECUTIVE_TIME_CONTEXT_TAGS,
      phase: "INT-1.3",
    });
  }
  return entry;
}

export function buildExecutiveTimeContextDiagnostics(input: {
  timeContext: ExecutiveTimeContext;
  consumer?: IntelligenceConsumerId | null;
  workspace?: WorkspaceId | null;
  validation: ExecutiveTimeContextValidationResult;
  executionTimeMs: number;
}): ExecutiveTimeContextDiagnostics {
  return Object.freeze({
    timeContextId: input.timeContext.timeContextId,
    consumer: input.consumer ?? null,
    workspace: input.workspace ?? null,
    timeState: input.timeContext.timeState,
    contextVersion: input.timeContext.version,
    timelinePosition: input.timeContext.timelinePosition,
    validationResult: input.validation,
    executionTimeMs: input.executionTimeMs,
    generatedAt: new Date().toISOString(),
  });
}

export function getExecutiveTimeContextEvents(): readonly ExecutiveTimeContextEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveTimeContextDiagnosticsLog(): readonly ExecutiveTimeContextDiagnostics[] {
  return Object.freeze([...diagnosticsLog]);
}

export function resetExecutiveTimeContextDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticsLog.length = 0;
}
