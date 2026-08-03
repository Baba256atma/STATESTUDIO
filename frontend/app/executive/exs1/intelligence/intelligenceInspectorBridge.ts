/**
 * Phase B — DevTools bridge for Intelligence inspector fields.
 */

export type IntelligenceInspectorSnapshot = {
  readonly recentCount: number;
  readonly queueCount: number;
  readonly topSignal: string | null;
  readonly priority: string;
  readonly recommendationType: string;
  readonly workspace: string;
  readonly packTitle: string;
};

let snapshot: IntelligenceInspectorSnapshot | null = null;
const listeners = new Set<() => void>();

export function publishIntelligenceInspectorSnapshot(
  next: IntelligenceInspectorSnapshot,
): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function getIntelligenceInspectorSnapshot(): IntelligenceInspectorSnapshot | null {
  return snapshot;
}

export function subscribeIntelligenceInspector(
  listener: () => void,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
