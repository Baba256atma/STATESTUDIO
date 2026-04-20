/**
 * Pure helpers for decision snapshot key resolution (used by HomeScreen restore flow).
 */

import type { DecisionSnapshot } from "../lib/decision/decisionTypes";

export function parseDecisionSnapshotKey(snapshotKey: string): { id: string; ts: number | null } {
  const key = String(snapshotKey || "").trim();
  const parts = key.split(":");
  if (parts.length === 2) {
    const id = parts[0] ?? "";
    const ts = Number(parts[1]);
    return { id, ts: Number.isFinite(ts) ? ts : null };
  }
  return { id: key, ts: null };
}

export function pickDecisionSnapshotFromList(
  list: DecisionSnapshot[],
  id: string,
  ts: number | null
): DecisionSnapshot | null {
  const candidates = list.filter((s) => {
    if (!s) return false;
    if (ts !== null) return s.id === id && s.timestamp === ts;
    return s.id === id;
  });
  if (candidates.length === 0) return null;
  return candidates.reduce((best, cur) => (cur.timestamp > best.timestamp ? cur : best));
}
