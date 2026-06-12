/**
 * MRP:12:9A — Timeline HUD hydration-safe time snapshot contract.
 */

import { formatNexoraTimelineTime } from "./nexoraTimeFormat.ts";

export const TIMELINE_EMPTY_TIME_LABEL = "—";

const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T/;

let stableSnapshotLogged = false;
let fallbackLabelLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function isIsoTimelineTimestamp(value: string): boolean {
  return ISO_TIMESTAMP_PATTERN.test(value.trim());
}

export function isStableSemanticTimelineLabel(value: string | null | undefined): boolean {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  return !isIsoTimelineTimestamp(trimmed);
}

export function traceTimelineHydrationStableSnapshot(): void {
  if (!isDev() || stableSnapshotLogged) return;
  stableSnapshotLogged = true;
  globalThis.console?.log?.("[NexoraTimelineHydration] stableTimeSnapshot=true");
}

export function traceTimelineHydrationFallbackLabel(label = TIMELINE_EMPTY_TIME_LABEL): void {
  if (!isDev() || fallbackLabelLogged) return;
  fallbackLabelLogged = true;
  globalThis.console?.log?.(`[NexoraTimelineHydration] fallbackTimeLabel=${label}`);
}

export function resolveHydrationSafeTimelineTime(input: {
  eventTime?: string | null;
  fallbackTime?: string | null;
  hydrated?: boolean;
}): string {
  const eventTime = input.eventTime?.trim() ?? "";
  const fallbackTime = input.fallbackTime?.trim() ?? "";
  const hydrated = input.hydrated === true;

  if (eventTime && isStableSemanticTimelineLabel(eventTime)) {
    traceTimelineHydrationStableSnapshot();
    return eventTime;
  }

  if (!hydrated) {
    traceTimelineHydrationStableSnapshot();
    traceTimelineHydrationFallbackLabel(TIMELINE_EMPTY_TIME_LABEL);
    return TIMELINE_EMPTY_TIME_LABEL;
  }

  if (fallbackTime) {
    return fallbackTime;
  }

  if (eventTime && isIsoTimelineTimestamp(eventTime)) {
    return formatNexoraTimelineTime(eventTime) || TIMELINE_EMPTY_TIME_LABEL;
  }

  if (eventTime) {
    return eventTime;
  }

  return TIMELINE_EMPTY_TIME_LABEL;
}

export function resetTimelineHydrationSafeTimeForTests(): void {
  stableSnapshotLogged = false;
  fallbackLabelLogged = false;
}
