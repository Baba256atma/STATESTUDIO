/**
 * INT-4 — Object Panel Diagnostics.
 * Development only — no production logging.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  OBJECT_PANEL_INTELLIGENCE_TAGS,
  NEXORA_OBJECT_PANEL_LOG_PREFIX,
  type ObjectPanelIntelligenceDiagnostics,
  type ObjectPanelIntelligenceEvent,
  type ObjectPanelIntelligenceEventType,
} from "./objectPanelIntelligenceContract.ts";

const eventLog: ObjectPanelIntelligenceEvent[] = [];
const diagnosticsLog: ObjectPanelIntelligenceDiagnostics[] = [];

export function recordObjectPanelEvent(input: {
  type: ObjectPanelIntelligenceEventType;
  objectPanelRequestId?: string | null;
  selectedObjectId?: string | null;
  timeState?: ObjectPanelIntelligenceEvent["timeState"];
}): ObjectPanelIntelligenceEvent {
  const event = Object.freeze({
    type: input.type,
    objectPanelRequestId: input.objectPanelRequestId ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    timeState: input.timeState ?? null,
    timestamp: new Date().toISOString(),
  });
  eventLog.push(event);
  return event;
}

export function recordObjectPanelDiagnostics(
  entry: ObjectPanelIntelligenceDiagnostics
): ObjectPanelIntelligenceDiagnostics {
  diagnosticsLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    devDiagnosticLog("objectPanelIntelligence", NEXORA_OBJECT_PANEL_LOG_PREFIX, {
      objectPanelRequestId: entry.objectPanelRequestId,
      selectedObjectId: entry.selectedObjectId,
      consumer: entry.consumer,
      workspace: entry.workspace,
      contextVersion: entry.contextVersion,
      timeState: entry.timeState,
      runtimeDurationMs: entry.runtimeDurationMs,
      gatewayDurationMs: entry.gatewayDurationMs,
      responseDurationMs: entry.responseDurationMs,
      selectionChanged: entry.selectionChanged,
      errorCode: entry.errorCode,
      tags: OBJECT_PANEL_INTELLIGENCE_TAGS,
      phase: "INT-4",
    });
  }
  return entry;
}

export function getObjectPanelEvents(): readonly ObjectPanelIntelligenceEvent[] {
  return Object.freeze([...eventLog]);
}

export function getObjectPanelDiagnosticsLog(): readonly ObjectPanelIntelligenceDiagnostics[] {
  return Object.freeze([...diagnosticsLog]);
}

export function resetObjectPanelDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticsLog.length = 0;
}
