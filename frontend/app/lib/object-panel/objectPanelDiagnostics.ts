/**
 * MRP:12:1 — Object Panel visual refinement diagnostics.
 */

export type ObjectPanelVisualPhase =
  | "header"
  | "summary"
  | "signals"
  | "insights"
  | "relationships"
  | "actions";

const loggedPhases = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceObjectPanelPhase(phase: ObjectPanelVisualPhase): void {
  if (!isDev()) return;
  const key = phase;
  if (loggedPhases.has(key)) return;
  loggedPhases.add(key);
  globalThis.console?.log?.(`[NexoraObjectPanel]\nphase=${phase}\nstatus=mounted`);
}

export function resetObjectPanelDiagnosticsForTests(): void {
  loggedPhases.clear();
}
