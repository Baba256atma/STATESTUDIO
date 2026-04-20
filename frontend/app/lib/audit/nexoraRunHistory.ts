/**
 * B.15.c — Lightweight recent run history (localStorage, no backend).
 */

import type { NexoraAuditRecord } from "./nexoraAuditContract.ts";
import type { NexoraReplaySnapshot } from "../../screens/nexoraReplaySnapshot.ts";

const STORAGE_KEY = "nexora.runHistory.v1";
const MAX_ENTRIES = 15;

export type NexoraRunHistoryEntry = {
  savedAt: number;
  record: NexoraAuditRecord;
  replaySnapshot: NexoraReplaySnapshot;
};

function safeParse(raw: string | null): NexoraRunHistoryEntry[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter(isValidEntry);
  } catch {
    return [];
  }
}

function isValidEntry(x: unknown): x is NexoraRunHistoryEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.savedAt === "number" &&
    o.record &&
    typeof o.record === "object" &&
    typeof (o.record as NexoraAuditRecord).runId === "string" &&
    o.replaySnapshot &&
    typeof o.replaySnapshot === "object"
  );
}

export function loadNexoraRunHistory(): NexoraRunHistoryEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function clearNexoraRunHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Newest first; skips duplicate runId; caps at MAX_ENTRIES. */
export function appendNexoraRunHistory(entry: NexoraRunHistoryEntry): void {
  if (typeof window === "undefined") return;
  const prev = loadNexoraRunHistory().filter((e) => e.record.runId !== entry.record.runId);
  prev.unshift(entry);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prev.slice(0, MAX_ENTRIES)));
}
