/**
 * E2:72 — Memoized executive dashboard decision trace results.
 */

import type { DecisionTimelineViewEvent } from "../../governance/decisionTimelineModel";

export type ExecutiveDecisionTraceCacheEntry = {
  signature: string;
  traceResult: DecisionTimelineViewEvent[];
  computedAt: number;
};

let activeCacheEntry: ExecutiveDecisionTraceCacheEntry | null = null;

export function getExecutiveDecisionTraceCache(
  signature: string
): ExecutiveDecisionTraceCacheEntry | null {
  if (!activeCacheEntry || activeCacheEntry.signature !== signature) {
    return null;
  }
  return activeCacheEntry;
}

export function setExecutiveDecisionTraceCache(
  signature: string,
  traceResult: DecisionTimelineViewEvent[]
): ExecutiveDecisionTraceCacheEntry {
  activeCacheEntry = {
    signature,
    traceResult,
    computedAt: Date.now(),
  };
  return activeCacheEntry;
}

export function resetExecutiveDecisionTraceCacheForTests(): void {
  activeCacheEntry = null;
}
