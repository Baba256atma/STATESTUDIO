import type { SceneLoop } from "../sceneTypes";

export type DecisionSnapshot = {
  id: string;
  timestamp: number;
  projectId: string;
  loops: SceneLoop[];
  activeLoopId: string | null;
  note?: string;
  meta?: {
    chaosScore?: number;
    riskScore?: number;
  };
  /** Optional full scene + panel capture for shell snapshot / replay. */
  sceneJson?: unknown | null;
  selectedObjectId?: string | null;
  rightPanelView?: string | null;
  rightPanelOpen?: boolean;
};

export type DecisionStoreState = {
  version: number; // bump if schema changes
  snapshots: DecisionSnapshot[];
};

// -----------------------------
// Phase 2 — Step 2: Diff Engine
// -----------------------------

export type DecisionDiff = {
  keyA: string;
  keyB: string;
  timeA: number;
  timeB: number;

  loopIdsA: string[];
  loopIdsB: string[];
  loopsAdded: string[];
  loopsRemoved: string[];
  loopsCommon: string[];

  // Active loop changes
  activeLoopA: string | null;
  activeLoopB: string | null;
  activeLoopChanged: boolean;

  // Simple heuristic signals you can show in UI now
  stabilityHint: "more_stable" | "less_stable" | "unknown";
  summary: string;
};

function uniqueSorted(xs: string[]): string[] {
  return Array.from(new Set(xs)).sort();
}

function snapshotKey(s: DecisionSnapshot): string {
  return `${s.id}:${s.timestamp}`;
}

function getLoopIds(s: DecisionSnapshot): string[] {
  // Be defensive: SceneLoop might not always have a stable id field.
  const ids = (s.loops || [])
    .map((l: any) => (typeof l?.id === "string" ? l.id : typeof l?.loop_id === "string" ? l.loop_id : null))
    .filter((x): x is string => Boolean(x));
  return uniqueSorted(ids);
}

/**
 * Compare two decision snapshots and produce a UI-friendly diff.
 * Pure function: no React, no IO.
 */
export function compareDecisionSnapshots(a: DecisionSnapshot, b: DecisionSnapshot): DecisionDiff {
  const keyA = snapshotKey(a);
  const keyB = snapshotKey(b);

  const loopIdsA = getLoopIds(a);
  const loopIdsB = getLoopIds(b);

  const setA = new Set(loopIdsA);
  const setB = new Set(loopIdsB);

  const loopsAdded = loopIdsB.filter((id) => !setA.has(id));
  const loopsRemoved = loopIdsA.filter((id) => !setB.has(id));
  const loopsCommon = loopIdsA.filter((id) => setB.has(id));

  const activeLoopA = a.activeLoopId ?? null;
  const activeLoopB = b.activeLoopId ?? null;
  const activeLoopChanged = activeLoopA !== activeLoopB;

  // Minimal heuristic:
  // - fewer active loops is treated as "more stable" (can evolve later)
  const stabilityHint: DecisionDiff["stabilityHint"] =
    loopIdsB.length < loopIdsA.length ? "more_stable" : loopIdsB.length > loopIdsA.length ? "less_stable" : "unknown";

  const parts: string[] = [];
  if (loopsAdded.length) parts.push(`+${loopsAdded.length} loops`);
  if (loopsRemoved.length) parts.push(`-${loopsRemoved.length} loops`);
  if (activeLoopChanged) parts.push(`active loop changed`);

  const summary = parts.length ? parts.join(" · ") : "no structural changes";

  return {
    keyA,
    keyB,
    timeA: a.timestamp,
    timeB: b.timestamp,

    loopIdsA,
    loopIdsB,
    loopsAdded,
    loopsRemoved,
    loopsCommon,

    activeLoopA,
    activeLoopB,
    activeLoopChanged,

    stabilityHint,
    summary,
  };
}

// --- Deterministic Decision Assistant (scenario / recommendation support logic) ---
export * from "./decisionAssistantTypes.ts";
