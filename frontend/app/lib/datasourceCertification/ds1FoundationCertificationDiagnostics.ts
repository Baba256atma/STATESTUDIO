/**
 * PHASE-2 / DS1:7 — DS-1 Foundation Certification diagnostics.
 * Meta-certification lifecycle events only — no runtime execution.
 */

import {
  DS1_FOUNDATION_CERTIFICATION_SOURCE,
  NEXORA_DS1_FOUNDATION_LOG_PREFIX,
} from "./ds1FoundationCertificationContract.ts";
import type {
  Ds1FoundationDiagnosticEntry,
  Ds1FoundationEvent,
  Ds1FoundationEventType,
  Ds1FoundationLayerId,
} from "./ds1FoundationCertificationTypes.ts";

const eventLog: Ds1FoundationEvent[] = [];
const diagnosticLog: Ds1FoundationDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordDs1FoundationEvent(input: {
  type: Ds1FoundationEventType;
  layerId?: Ds1FoundationLayerId | null;
  gateId?: string | null;
}): Ds1FoundationEvent {
  const event = Object.freeze({
    type: input.type,
    layerId: input.layerId ?? null,
    gateId: input.gateId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordDs1FoundationDiagnostic(input: {
  type: Ds1FoundationEventType;
  layerId?: Ds1FoundationLayerId | null;
  gateId?: string | null;
  message: string;
}): Ds1FoundationDiagnosticEntry {
  const entry = Object.freeze({
    layerId: input.layerId ?? null,
    gateId: input.gateId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_DS1_FOUNDATION_LOG_PREFIX, {
      source: DS1_FOUNDATION_CERTIFICATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getDs1FoundationEvents(): readonly Ds1FoundationEvent[] {
  return Object.freeze([...eventLog]);
}

export function getDs1FoundationDiagnosticsLog(): readonly Ds1FoundationDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetDs1FoundationDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const Ds1FoundationDiagnostics = Object.freeze({
  recordDs1FoundationEvent,
  recordDs1FoundationDiagnostic,
  getDs1FoundationEvents,
  getDs1FoundationDiagnosticsLog,
  resetDs1FoundationDiagnosticsForTests,
});
