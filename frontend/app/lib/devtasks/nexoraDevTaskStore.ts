/**
 * D.2 — Dev tasks in localStorage (max 100, dedupe by id).
 */

import { normalizeDevTask, sortDevTasks, type NexoraDevTask } from "./nexoraDevTaskContract.ts";

const STORAGE_KEY = "nexora.devTasks.v1";
const MAX_TASKS = 100;

let lastPersistedJson: string | null = null;
/** Dedupes consecutive identical `[Nexora][DevTasks] updated` lines (no spam). */
let lastLoggedPersistJson: string | null = null;

function isValidTask(x: unknown): x is NexoraDevTask {
  if (!x || typeof x !== "object") return false;
  const o = x as NexoraDevTask;
  return (
    typeof o.id === "string" &&
    Boolean(o.id.trim()) &&
    typeof o.title === "string" &&
    typeof o.createdAt === "number" &&
    Number.isFinite(o.createdAt) &&
    typeof o.updatedAt === "number" &&
    Number.isFinite(o.updatedAt)
  );
}

export function loadDevTasks(): NexoraDevTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    const out: NexoraDevTask[] = [];
    const seen = new Set<string>();
    for (const item of v) {
      if (!isValidTask(item)) continue;
      const t = normalizeDevTask(item as NexoraDevTask);
      if (seen.has(t.id)) continue;
      seen.add(t.id);
      out.push(t);
    }
    return sortDevTasks(out);
  } catch {
    return [];
  }
}

export function saveDevTasks(tasks: readonly NexoraDevTask[]): void {
  if (typeof window === "undefined") return;
  const byId = new Map<string, NexoraDevTask>();
  for (const t of tasks) {
    const n = normalizeDevTask(t);
    byId.set(n.id, n);
  }
  const merged = sortDevTasks([...byId.values()]).slice(0, MAX_TASKS);
  const json = JSON.stringify(merged);
  if (json === lastPersistedJson) return;
  const prevJson =
    typeof window !== "undefined" ? (() => {
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })() : null;
  if (json === prevJson) {
    lastPersistedJson = json;
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, json);
  lastPersistedJson = json;
  if (process.env.NODE_ENV !== "production" && json !== lastLoggedPersistJson) {
    lastLoggedPersistJson = json;
    globalThis.console?.debug?.("[Nexora][DevTasks] updated", { count: merged.length });
  }
}

export function appendDevTask(task: NexoraDevTask): void {
  const n = normalizeDevTask(task);
  const prev = loadDevTasks().filter((t) => t.id !== n.id);
  saveDevTasks([n, ...prev]);
}

export function updateDevTask(taskId: string, patch: Partial<Omit<NexoraDevTask, "id" | "createdAt">>): void {
  const id = String(taskId ?? "").trim();
  if (!id) return;
  const all = loadDevTasks();
  const idx = all.findIndex((t) => t.id === id);
  if (idx < 0) return;
  const cur = all[idx]!;
  const next: NexoraDevTask = normalizeDevTask({
    ...cur,
    ...patch,
    id: cur.id,
    createdAt: cur.createdAt,
    updatedAt: Date.now(),
  });
  const rest = all.filter((t) => t.id !== id);
  saveDevTasks([next, ...rest]);
}

export function deleteDevTask(taskId: string): void {
  const id = String(taskId ?? "").trim();
  if (!id) return;
  saveDevTasks(loadDevTasks().filter((t) => t.id !== id));
}

export function clearDevTasks(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  lastPersistedJson = null;
  const emptyJson = "[]";
  if (process.env.NODE_ENV !== "production" && emptyJson !== lastLoggedPersistJson) {
    lastLoggedPersistJson = emptyJson;
    globalThis.console?.debug?.("[Nexora][DevTasks] updated", { count: 0 });
  }
}
