/**
 * MRP:12:5 — Executive Command Dock diagnostics.
 */

import type { AssistantCommandDockAction } from "./assistantCommandDockContract.ts";

let mountedLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceExecutiveCommandDockMounted(): void {
  if (!isDev() || mountedLogged) return;
  mountedLogged = true;
  globalThis.console?.log?.("[NexoraCommandDock]\nstatus=mounted");
}

export function traceExecutiveCommandDockAction(action: AssistantCommandDockAction): void {
  if (!isDev()) return;
  globalThis.console?.log?.(`[NexoraCommandDock]\naction=${action}`);
}

export function resetExecutiveCommandDockDiagnosticsForTests(): void {
  mountedLogged = false;
}
