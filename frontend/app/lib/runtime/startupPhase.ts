/**
 * E2:79 — Startup phase runtime (distinguish bootstrap reconciliation from idle activity).
 */

export const STARTUP_WINDOW_MS = 3000;

let startedAt = Date.now();
let startupCompleted = false;
let hydrationComplete = false;
let sceneStable = false;
let panelStable = false;

function maybeCompleteStartup(): void {
  if (startupCompleted) return;
  if (hydrationComplete && sceneStable && panelStable) {
    markStartupCompleted();
  }
}

export function isStartupPhase(): boolean {
  if (startupCompleted) return false;
  if (Date.now() - startedAt >= STARTUP_WINDOW_MS) {
    markStartupCompleted();
    return false;
  }
  return true;
}

export function markHydrationComplete(): void {
  hydrationComplete = true;
  maybeCompleteStartup();
}

export function markSceneStable(): void {
  sceneStable = true;
  maybeCompleteStartup();
}

export function markPanelStable(): void {
  panelStable = true;
  maybeCompleteStartup();
}

export function markStartupCompleted(): void {
  startupCompleted = true;
}

export function resetStartupPhaseForTests(): void {
  startedAt = Date.now();
  startupCompleted = false;
  hydrationComplete = false;
  sceneStable = false;
  panelStable = false;
}
