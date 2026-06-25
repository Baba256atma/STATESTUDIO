/**
 * INT-1.2 — Intelligence Context diagnostics.
 * Development diagnostics only — no production logging.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type {
  IntelligenceContextDiagnostics,
  IntelligenceContextEvent,
  IntelligenceContextEventType,
  IntelligenceContextValidationResult,
  UnifiedIntelligenceContext,
} from "./intelligenceContextContract.ts";
import {
  INTELLIGENCE_CONTEXT_TAGS,
  NEXORA_INTELLIGENCE_CONTEXT_LOG_PREFIX,
} from "./intelligenceContextContract.ts";

const eventLog: IntelligenceContextEvent[] = [];
const diagnosticsLog: IntelligenceContextDiagnostics[] = [];

export function recordIntelligenceContextEvent(input: {
  type: IntelligenceContextEventType;
  contextId?: string | null;
  consumer?: UnifiedIntelligenceContext["consumer"] | null;
  workspace?: UnifiedIntelligenceContext["workspace"] | null;
}): IntelligenceContextEvent {
  const event = Object.freeze({
    type: input.type,
    contextId: input.contextId ?? null,
    consumer: input.consumer ?? null,
    workspace: input.workspace ?? null,
    timestamp: new Date().toISOString(),
  });
  eventLog.push(event);
  return event;
}

export function recordIntelligenceContextDiagnostics(
  entry: IntelligenceContextDiagnostics
): IntelligenceContextDiagnostics {
  diagnosticsLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    devDiagnosticLog("intelligenceContext", NEXORA_INTELLIGENCE_CONTEXT_LOG_PREFIX, {
      contextId: entry.contextId,
      consumer: entry.consumer,
      workspace: entry.workspace,
      panel: entry.panel,
      dashboardMode: entry.dashboardMode,
      viewMode: entry.viewMode,
      selectedObject: entry.selectedObject,
      selectedScenario: entry.selectedScenario,
      contextVersion: entry.contextVersion,
      valid: entry.validationResult.valid,
      executionTimeMs: entry.executionTimeMs,
      tags: INTELLIGENCE_CONTEXT_TAGS,
      phase: "INT-1.2",
    });
  }
  return entry;
}

export function buildIntelligenceContextDiagnostics(input: {
  context: UnifiedIntelligenceContext;
  validation: IntelligenceContextValidationResult;
  executionTimeMs: number;
}): IntelligenceContextDiagnostics {
  return Object.freeze({
    contextId: input.context.contextId,
    consumer: input.context.consumer,
    workspace: input.context.workspace,
    panel: input.context.panel,
    dashboardMode: input.context.dashboardMode,
    viewMode: input.context.viewMode,
    selectedObject: input.context.selectedObject,
    selectedScenario: input.context.selectedScenario,
    selectedRelationship: input.context.selectedRelationship,
    selectedKpi: input.context.selectedKpi,
    selectedRisk: input.context.selectedRisk,
    timelinePosition: input.context.timelinePosition,
    contextVersion: input.context.contractVersion,
    validationResult: input.validation,
    executionTimeMs: input.executionTimeMs,
    generatedAt: new Date().toISOString(),
  });
}

export function getIntelligenceContextEvents(): readonly IntelligenceContextEvent[] {
  return Object.freeze([...eventLog]);
}

export function getIntelligenceContextDiagnosticsLog(): readonly IntelligenceContextDiagnostics[] {
  return Object.freeze([...diagnosticsLog]);
}

export function resetIntelligenceContextDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticsLog.length = 0;
}
