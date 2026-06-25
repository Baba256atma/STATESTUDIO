/**
 * INT-2 — Assistant Diagnostics.
 * Development only — no production logging.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  ASSISTANT_INTELLIGENCE_TAGS,
  NEXORA_ASSISTANT_INTELLIGENCE_LOG_PREFIX,
  type AssistantIntelligenceDiagnostics,
  type AssistantIntelligenceEvent,
  type AssistantIntelligenceEventType,
} from "./assistantIntelligenceContract.ts";

const eventLog: AssistantIntelligenceEvent[] = [];
const diagnosticsLog: AssistantIntelligenceDiagnostics[] = [];

export function recordAssistantIntelligenceEvent(input: {
  type: AssistantIntelligenceEventType;
  assistantRequestId?: string | null;
  requestType?: AssistantIntelligenceEvent["requestType"];
  timeState?: AssistantIntelligenceEvent["timeState"];
}): AssistantIntelligenceEvent {
  const event = Object.freeze({
    type: input.type,
    assistantRequestId: input.assistantRequestId ?? null,
    requestType: input.requestType ?? null,
    timeState: input.timeState ?? null,
    timestamp: new Date().toISOString(),
  });
  eventLog.push(event);
  return event;
}

export function recordAssistantIntelligenceDiagnostics(
  entry: AssistantIntelligenceDiagnostics
): AssistantIntelligenceDiagnostics {
  diagnosticsLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    devDiagnosticLog("assistantIntelligence", NEXORA_ASSISTANT_INTELLIGENCE_LOG_PREFIX, {
      assistantRequestId: entry.assistantRequestId,
      conversationId: entry.conversationId,
      consumer: entry.consumer,
      workspace: entry.workspace,
      requestType: entry.requestType,
      contextVersion: entry.contextVersion,
      timeState: entry.timeState,
      runtimeDurationMs: entry.runtimeDurationMs,
      gatewayDurationMs: entry.gatewayDurationMs,
      responseDurationMs: entry.responseDurationMs,
      errorCode: entry.errorCode,
      tags: ASSISTANT_INTELLIGENCE_TAGS,
      phase: "INT-2",
    });
  }
  return entry;
}

export function getAssistantIntelligenceEvents(): readonly AssistantIntelligenceEvent[] {
  return Object.freeze([...eventLog]);
}

export function getAssistantIntelligenceDiagnosticsLog(): readonly AssistantIntelligenceDiagnostics[] {
  return Object.freeze([...diagnosticsLog]);
}

export function resetAssistantIntelligenceDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticsLog.length = 0;
}
