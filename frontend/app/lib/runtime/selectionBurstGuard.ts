/**
 * Module-level guard suppressing HUD drift measurement during rapid object selection.
 */

export const SELECTION_BURST_WINDOW_MS = 350;

let lastSelectionActivityAt = 0;
let lastBurstHudDriftSkipLoggedAt = 0;

export function markSelectionActivity(now = Date.now()): void {
  lastSelectionActivityAt = now;
}

export function isSelectionBurstActive(now = Date.now()): boolean {
  return now - lastSelectionActivityAt < SELECTION_BURST_WINDOW_MS;
}

/** Dev-only: emit at most one skip log per burst window. */
export function shouldLogSelectionBurstHudDriftSkip(now = Date.now()): boolean {
  if (!isSelectionBurstActive(now)) return false;
  if (now - lastBurstHudDriftSkipLoggedAt < SELECTION_BURST_WINDOW_MS) return false;
  lastBurstHudDriftSkipLoggedAt = now;
  return true;
}

export function resetSelectionBurstGuardForTests(): void {
  lastSelectionActivityAt = 0;
  lastBurstHudDriftSkipLoggedAt = 0;
}
