/**
 * Phase D — DevTools bridge for Simulation inspector fields.
 */

export type SimulationInspectorSnapshot = {
  readonly activeScenario: string | null;
  readonly status: string | null;
  readonly sessionCount: number;
  readonly overlayActive: boolean;
  readonly lastRisk: string | null;
  readonly decisionCandidateId: string | null;
};

let snapshot: SimulationInspectorSnapshot | null = null;
const listeners = new Set<() => void>();

export function publishSimulationInspectorSnapshot(
  next: SimulationInspectorSnapshot,
): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function getSimulationInspectorSnapshot(): SimulationInspectorSnapshot | null {
  return snapshot;
}

export function subscribeSimulationInspector(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
