/**
 * D7:1:8 — Replay-safe war-room session history.
 */

import type {
  WarRoomComparisonHistoryEntry,
  WarRoomInterventionHistoryEntry,
  WarRoomSessionHistory,
  WarRoomSessionHistoryEntry,
  WarRoomSessionHistoryEventKind,
  WarRoomSyncRecord,
} from "./warRoomTypes.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function historyCreatedAt(tick = 0): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function createEmptyWarRoomSessionHistory(sessionId: string): WarRoomSessionHistory {
  return Object.freeze({
    sessionId,
    entries: Object.freeze([]),
    interventionSequence: Object.freeze([]),
    comparisonHistory: Object.freeze([]),
    syncHistory: Object.freeze([]),
    fingerprint: stableStringify({ sessionId, entries: [] }),
  });
}

export function appendWarRoomHistoryEntry(
  history: WarRoomSessionHistory,
  entry: Omit<WarRoomSessionHistoryEntry, "createdAt"> & { createdAt?: string }
): WarRoomSessionHistory {
  const createdAt = entry.createdAt ?? historyCreatedAt(entry.tick ?? 0);
  const entries = Object.freeze([
    ...history.entries,
    Object.freeze({ ...entry, createdAt }),
  ]);
  return freezeWarRoomSessionHistory({
    ...history,
    entries,
  });
}

export function appendInterventionHistory(
  history: WarRoomSessionHistory,
  item: WarRoomInterventionHistoryEntry
): WarRoomSessionHistory {
  const interventionSequence = Object.freeze([...history.interventionSequence, Object.freeze(item)]);
  return freezeWarRoomSessionHistory({ ...history, interventionSequence });
}

export function appendComparisonHistory(
  history: WarRoomSessionHistory,
  item: WarRoomComparisonHistoryEntry
): WarRoomSessionHistory {
  const comparisonHistory = Object.freeze([...history.comparisonHistory, Object.freeze(item)]);
  return freezeWarRoomSessionHistory({ ...history, comparisonHistory });
}

export function appendSyncHistory(
  history: WarRoomSessionHistory,
  item: WarRoomSyncRecord
): WarRoomSessionHistory {
  const syncHistory = Object.freeze([...history.syncHistory, Object.freeze(item)]);
  return freezeWarRoomSessionHistory({ ...history, syncHistory });
}

export function recordWarRoomEvent(
  history: WarRoomSessionHistory,
  kind: WarRoomSessionHistoryEventKind,
  summary: string,
  partial?: Pick<WarRoomSessionHistoryEntry, "tick" | "scenarioId">
): WarRoomSessionHistory {
  const eventId = `${kind}::${history.entries.length}`;
  return appendWarRoomHistoryEntry(history, {
    eventId,
    kind,
    summary,
    tick: partial?.tick,
    scenarioId: partial?.scenarioId,
  });
}

export function freezeWarRoomSessionHistory(history: WarRoomSessionHistory): WarRoomSessionHistory {
  const fingerprint = stableStringify({
    sessionId: history.sessionId,
    entries: history.entries.map((e) => e.eventId),
    interventions: history.interventionSequence.map((i) => i.fingerprint),
    comparisons: history.comparisonHistory.map((c) => c.fingerprint),
    sync: history.syncHistory.map((s) => s.syncTick),
  });
  return Object.freeze({
    ...history,
    entries: Object.freeze([...history.entries]),
    interventionSequence: Object.freeze([...history.interventionSequence]),
    comparisonHistory: Object.freeze([...history.comparisonHistory]),
    syncHistory: Object.freeze([...history.syncHistory]),
    fingerprint,
  });
}
