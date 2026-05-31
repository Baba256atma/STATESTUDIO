/**
 * E2:69 — Detect repeating stabilization cycles (diagnostics only; no mutations).
 *
 * Observed idle churn sequence (pre-fix):
 *   PanelContractSalvaged → NEXORA_RIGHT_PANEL_WRITE → SceneParity → SceneHudDriftDetected → (repeat)
 *
 * Triggers:
 * - HudDrift: layout measurement / visibility / viewport / panel updates (SceneCanvas scene-activity)
 * - PanelSalvage: panel shared-data contract validation cache miss + re-salvage
 * - RightPanelWrite: authority commit with peek/commit guard mismatch
 * - SceneParity: scene vs visible-scene signature effect on panel/scene deps
 */

export type RuntimeCycleEventKind =
  | "HudDrift"
  | "PanelSalvage"
  | "RightPanelWrite"
  | "SceneParity";

export type RuntimeCycleEvent = {
  kind: RuntimeCycleEventKind;
  ts: number;
  signature: string;
  panelId?: string | null;
  source?: string | null;
};

type CycleDetectedPayload = {
  source: string;
  sequence: RuntimeCycleEventKind[];
  signatures: string[];
  affectedPanel: string | null;
  repeatCount: number;
  windowMs: number;
};

const WINDOW_MS = 2000;
const MIN_REPEAT_CYCLES = 4;

const recentEvents: RuntimeCycleEvent[] = [];
const emittedCycleKeys = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function trimEvents(now: number): void {
  const cutoff = now - WINDOW_MS;
  while (recentEvents.length > 0 && recentEvents[0]!.ts < cutoff) {
    recentEvents.shift();
  }
}

function sequenceKey(events: RuntimeCycleEvent[]): string {
  return events.map((e) => `${e.kind}:${e.signature}`).join("|");
}

function detectRepeatingCycles(now: number): void {
  if (recentEvents.length < MIN_REPEAT_CYCLES) return;

  const minLen = 2;
  for (let cycleLen = minLen; cycleLen <= Math.floor(recentEvents.length / MIN_REPEAT_CYCLES); cycleLen += 1) {
    const tail = recentEvents.slice(-cycleLen * MIN_REPEAT_CYCLES);
    if (tail.length < cycleLen * MIN_REPEAT_CYCLES) continue;

    const pattern = tail.slice(0, cycleLen);
    let repeats = 1;
    for (let i = cycleLen; i < tail.length; i += cycleLen) {
      const slice = tail.slice(i, i + cycleLen);
      if (slice.length < cycleLen) break;
      const matches = pattern.every(
        (event, idx) =>
          event.kind === slice[idx]!.kind && event.signature === slice[idx]!.signature
      );
      if (!matches) break;
      repeats += 1;
    }

    if (repeats >= MIN_REPEAT_CYCLES) {
      const key = sequenceKey(pattern);
      if (emittedCycleKeys.has(key)) return;

      emittedCycleKeys.add(key);
      const payload: CycleDetectedPayload = {
        source: pattern[0]?.source ?? "unknown",
        sequence: pattern.map((e) => e.kind),
        signatures: pattern.map((e) => e.signature),
        affectedPanel: pattern.find((e) => e.panelId)?.panelId ?? null,
        repeatCount: repeats,
        windowMs: WINDOW_MS,
      };
      globalThis.console?.warn?.("[Nexora][CycleDetected]", payload);
      return;
    }
  }
}

export function recordRuntimeCycleEvent(
  kind: RuntimeCycleEventKind,
  detail?: {
    signature?: string;
    panelId?: string | null;
    source?: string | null;
  }
): void {
  if (!isDev()) return;

  const now = Date.now();
  trimEvents(now);

  const event: RuntimeCycleEvent = {
    kind,
    ts: now,
    signature: detail?.signature ?? kind,
    panelId: detail?.panelId ?? null,
    source: detail?.source ?? null,
  };
  recentEvents.push(event);
  detectRepeatingCycles(now);
}

export function resetRuntimeCycleDetectorForTests(): void {
  recentEvents.length = 0;
  emittedCycleKeys.clear();
}

export function getRecentRuntimeCycleEvents(): readonly RuntimeCycleEvent[] {
  return recentEvents;
}
