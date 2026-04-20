/**
 * R.3 — Roadmap phases in localStorage (max 200, dedupe by id).
 */

import { normalizeRoadmapPhase, sortRoadmapPhases, type NexoraRoadmapPhase } from "./nexoraRoadmapContract.ts";

const STORAGE_KEY = "nexora.roadmap.v1";
const MAX_PHASES = 200;

let lastPersistedJson: string | null = null;
let lastLoggedRoadmapJson: string | null = null;

function emitRoadmapUpdated(merged: readonly NexoraRoadmapPhase[], json: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (json === lastLoggedRoadmapJson) return;
  lastLoggedRoadmapJson = json;
  globalThis.console?.debug?.("[Nexora][Roadmap] updated", { count: merged.length });
}

/** Optional minimal seed so first open is not empty (local dev only). */
export const DEFAULT_ROADMAP_SEED: NexoraRoadmapPhase[] = [
  { id: "B.10", title: "Core baseline", status: "done", order: 10, parentId: null },
  { id: "B.10.e", title: "Sub-phase e", status: "done", order: 11, parentId: "B.10" },
  { id: "B.11", title: "Layer B.11", status: "done", order: 110, parentId: null },
  { id: "B.12", title: "Trust validation", status: "done", order: 12, parentId: null },
  { id: "B.14", title: "Audit record", status: "done", order: 14, parentId: null },
  { id: "B.15", title: "Run history", status: "done", order: 15, parentId: null },
  { id: "B.16", title: "Replay apply", status: "done", order: 16, parentId: null },
  { id: "B.17", title: "Import bundle", status: "done", order: 17, parentId: null },
  { id: "B.18", title: "Scenario builder", status: "done", order: 18, parentId: null },
  { id: "B.19", title: "Scenario memory", status: "done", order: 19, parentId: null },
  { id: "B.20", title: "Execution outcome tracking", status: "active", order: 20, parentId: null },
  {
    id: "B.21",
    title: "Adaptive / follow-on",
    status: "planned",
    order: 21,
    parentId: null,
    dependsOn: ["B.20"],
  },
];

function isValidPhase(x: unknown): x is NexoraRoadmapPhase {
  if (!x || typeof x !== "object") return false;
  const o = x as NexoraRoadmapPhase;
  return typeof o.id === "string" && Boolean(o.id.trim()) && typeof o.title === "string";
}

export function loadRoadmapPhases(): NexoraRoadmapPhase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    const out: NexoraRoadmapPhase[] = [];
    const seen = new Set<string>();
    for (const item of v) {
      if (!isValidPhase(item)) continue;
      const p = normalizeRoadmapPhase(item as NexoraRoadmapPhase);
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
    }
    return sortRoadmapPhases(out);
  } catch {
    return [];
  }
}

export function saveRoadmapPhases(phases: readonly NexoraRoadmapPhase[]): void {
  if (typeof window === "undefined") return;
  const byId = new Map<string, NexoraRoadmapPhase>();
  for (const p of phases) {
    const n = normalizeRoadmapPhase(p);
    byId.set(n.id, n);
  }
  const merged = sortRoadmapPhases([...byId.values()]).slice(0, MAX_PHASES);
  const json = JSON.stringify(merged);
  if (json === lastPersistedJson) return;
  let prevJson: string | null = null;
  try {
    prevJson = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    prevJson = null;
  }
  if (json === prevJson) {
    lastPersistedJson = json;
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, json);
  lastPersistedJson = json;
  emitRoadmapUpdated(merged, json);
}

export function upsertRoadmapPhase(phase: NexoraRoadmapPhase): void {
  const n = normalizeRoadmapPhase(phase);
  const rest = loadRoadmapPhases().filter((p) => p.id !== n.id);
  saveRoadmapPhases([n, ...rest]);
}

export function deleteRoadmapPhase(phaseId: string): void {
  const id = String(phaseId ?? "").trim();
  if (!id) return;
  saveRoadmapPhases(loadRoadmapPhases().filter((p) => p.id !== id));
}

export function clearRoadmapPhases(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  lastPersistedJson = null;
  const emptyJson = "[]";
  if (process.env.NODE_ENV !== "production" && emptyJson !== lastLoggedRoadmapJson) {
    lastLoggedRoadmapJson = emptyJson;
    globalThis.console?.debug?.("[Nexora][Roadmap] updated", { count: 0 });
  }
}

/** Seed default phases once if storage is empty (idempotent). */
export function seedDefaultRoadmapPhasesIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (loadRoadmapPhases().length > 0) return;
  saveRoadmapPhases(DEFAULT_ROADMAP_SEED.map((p) => normalizeRoadmapPhase(p)));
}
