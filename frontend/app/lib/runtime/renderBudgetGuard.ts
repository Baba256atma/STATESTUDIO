/**
 * Selection render budget guard — module-level dedupe (no React state).
 */

export const SELECTION_CASCADE_DEDUP_MS = 250;
export const PANEL_SELECTION_WRITE_DEDUP_MS = 250;
export const HEAVY_SELECTION_DEFER_MS = 150;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

let lastCascadeAt = 0;
let lastCascadeObjectId: string | null = null;
let lastCascadeReason = "";

let lastPanelWriteObjectId: string | null = null;
let lastPanelWriteAt = 0;

let pendingHeavySelectionId: string | null = null;
let heavySelectionTimer: ReturnType<typeof setTimeout> | null = null;

export function shouldAllowSelectionCascade(input: {
  selectedObjectId: string | null;
  previousSelectedObjectId: string | null;
  now?: number;
}): boolean {
  const now = input.now ?? Date.now();
  const nextId = input.selectedObjectId?.trim() || null;
  const prevId = input.previousSelectedObjectId?.trim() || null;

  if (!nextId) return true;
  if (nextId !== prevId) return true;

  return now - lastCascadeAt >= SELECTION_CASCADE_DEDUP_MS;
}

export function markSelectionCascade(input: {
  selectedObjectId: string | null;
  reason: string;
  now?: number;
}): void {
  lastCascadeAt = input.now ?? Date.now();
  lastCascadeObjectId = input.selectedObjectId?.trim() || null;
  lastCascadeReason = input.reason;
  void isDev();
}

export function shouldAllowPanelSelectionWrite(objectId: string | null, now = Date.now()): boolean {
  const normalized = objectId?.trim() || null;
  if (!normalized) return true;
  if (lastPanelWriteObjectId === normalized && now - lastPanelWriteAt < PANEL_SELECTION_WRITE_DEDUP_MS) {
    return false;
  }
  return true;
}

export function markPanelSelectionWrite(objectId: string | null, now = Date.now()): void {
  lastPanelWriteObjectId = objectId?.trim() || null;
  lastPanelWriteAt = now;
}

export function scheduleDebouncedHeavySelection(
  objectId: string,
  run: (id: string) => void,
  delayMs = HEAVY_SELECTION_DEFER_MS
): void {
  const normalized = objectId.trim();
  if (!normalized) return;
  pendingHeavySelectionId = normalized;
  if (heavySelectionTimer != null) {
    globalThis.clearTimeout?.(heavySelectionTimer);
    heavySelectionTimer = null;
  }
  heavySelectionTimer = globalThis.setTimeout?.(() => {
    heavySelectionTimer = null;
    const pendingId = pendingHeavySelectionId;
    pendingHeavySelectionId = null;
    if (pendingId) run(pendingId);
  }, delayMs) as ReturnType<typeof setTimeout> | null;
}

export function cancelDebouncedHeavySelection(): void {
  if (heavySelectionTimer != null) {
    globalThis.clearTimeout?.(heavySelectionTimer);
    heavySelectionTimer = null;
  }
  pendingHeavySelectionId = null;
}

export function getRenderBudgetGuardSnapshotForTests(): {
  lastCascadeObjectId: string | null;
  lastCascadeReason: string;
  lastPanelWriteObjectId: string | null;
  pendingHeavySelectionId: string | null;
} {
  return {
    lastCascadeObjectId,
    lastCascadeReason,
    lastPanelWriteObjectId,
    pendingHeavySelectionId,
  };
}

export function resetRenderBudgetGuardForTests(): void {
  lastCascadeAt = 0;
  lastCascadeObjectId = null;
  lastCascadeReason = "";
  lastPanelWriteObjectId = null;
  lastPanelWriteAt = 0;
  cancelDebouncedHeavySelection();
}
