/**
 * Sprint 5 — DevTools bridge for Advisor inspector fields (outside Runtime Store).
 */

import type { AdvisorInspectorSnapshot } from "./ExecutiveAdvisorTypes";

let snapshot: AdvisorInspectorSnapshot | null = null;
const listeners = new Set<() => void>();

export function publishAdvisorInspectorSnapshot(
  next: AdvisorInspectorSnapshot,
): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function getAdvisorInspectorSnapshot(): AdvisorInspectorSnapshot | null {
  return snapshot;
}

export function subscribeAdvisorInspector(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
