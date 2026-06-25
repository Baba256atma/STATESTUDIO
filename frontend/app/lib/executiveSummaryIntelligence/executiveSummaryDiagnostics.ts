/**
 * INT-3 — Executive Summary Diagnostics.
 * Development only — no production logging.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS,
  NEXORA_EXECUTIVE_SUMMARY_LOG_PREFIX,
  type ExecutiveSummaryIntelligenceDiagnostics,
  type ExecutiveSummaryIntelligenceEvent,
  type ExecutiveSummaryIntelligenceEventType,
} from "./executiveSummaryIntelligenceContract.ts";

const eventLog: ExecutiveSummaryIntelligenceEvent[] = [];
const diagnosticsLog: ExecutiveSummaryIntelligenceDiagnostics[] = [];

export function recordExecutiveSummaryEvent(input: {
  type: ExecutiveSummaryIntelligenceEventType;
  summaryRequestId?: string | null;
  timeState?: ExecutiveSummaryIntelligenceEvent["timeState"];
}): ExecutiveSummaryIntelligenceEvent {
  const event = Object.freeze({
    type: input.type,
    summaryRequestId: input.summaryRequestId ?? null,
    timeState: input.timeState ?? null,
    timestamp: new Date().toISOString(),
  });
  eventLog.push(event);
  return event;
}

export function recordExecutiveSummaryDiagnostics(
  entry: ExecutiveSummaryIntelligenceDiagnostics
): ExecutiveSummaryIntelligenceDiagnostics {
  diagnosticsLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    devDiagnosticLog("executiveSummaryIntelligence", NEXORA_EXECUTIVE_SUMMARY_LOG_PREFIX, {
      summaryRequestId: entry.summaryRequestId,
      consumer: entry.consumer,
      workspace: entry.workspace,
      contextVersion: entry.contextVersion,
      timeState: entry.timeState,
      runtimeDurationMs: entry.runtimeDurationMs,
      gatewayDurationMs: entry.gatewayDurationMs,
      summaryGenerationDurationMs: entry.summaryGenerationDurationMs,
      errorCode: entry.errorCode,
      tags: EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS,
      phase: "INT-3",
    });
  }
  return entry;
}

export function getExecutiveSummaryEvents(): readonly ExecutiveSummaryIntelligenceEvent[] {
  return Object.freeze([...eventLog]);
}

export function getExecutiveSummaryDiagnosticsLog(): readonly ExecutiveSummaryIntelligenceDiagnostics[] {
  return Object.freeze([...diagnosticsLog]);
}

export function resetExecutiveSummaryDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticsLog.length = 0;
}
