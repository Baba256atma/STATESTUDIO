/**
 * HOSTED-MVP:3A — presentation phase for server data recovery.
 * Loading is not an empty workspace.
 */

export type HostedManagerDataPhase = "idle" | "loading" | "empty" | "ready" | "error";

const listeners = new Set<() => void>();
let phase: HostedManagerDataPhase = "idle";

export function subscribeHostedManagerDataPhase(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readHostedManagerDataPhase(): HostedManagerDataPhase {
  return phase;
}

export function setHostedManagerDataPhase(next: HostedManagerDataPhase): void {
  phase = next;
  listeners.forEach((listener) => listener());
}
