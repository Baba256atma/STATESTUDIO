/**
 * D.1 — Dev task contract (JSON-safe, no UI formatting).
 */

export type NexoraDevTask = {
  id: string;
  title: string;
  detail?: string;
  status: "open" | "in_progress" | "done" | "deferred";
  priority: "low" | "medium" | "high";
  tag?: string;
  phase?: string;
  dependsOn?: string[];
  createdAt: number;
  updatedAt: number;
};

const PRIORITY_ORDER: Record<NexoraDevTask["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const STATUS_ORDER: Record<NexoraDevTask["status"], number> = {
  open: 0,
  in_progress: 1,
  deferred: 2,
  done: 3,
};

let idSeq = 0;

/** Unique id for a new task (monotonic in-session; stable enough for local dev). */
export function newDevTaskId(): string {
  idSeq = (idSeq + 1) >>> 0;
  return `nexora-dev-${Date.now().toString(36)}-${idSeq.toString(36)}`;
}

function trimStr(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

function normStatus(s: unknown): NexoraDevTask["status"] {
  const v = trimStr(s).toLowerCase();
  if (v === "in_progress" || v === "in progress") return "in_progress";
  if (v === "done" || v === "deferred" || v === "open") return v as NexoraDevTask["status"];
  return "open";
}

function normPriority(p: unknown): NexoraDevTask["priority"] {
  const v = trimStr(p).toLowerCase();
  if (v === "high" || v === "low") return v;
  return "medium";
}

/** Normalize unknown / partial input into a valid task (deterministic field coercion). */
export function normalizeDevTask(partial: Partial<NexoraDevTask> & Pick<NexoraDevTask, "id" | "title">): NexoraDevTask {
  const now = Date.now();
  const title = trimStr(partial.title) || "(untitled)";
  const deps = Array.isArray(partial.dependsOn)
    ? [...new Set(partial.dependsOn.map((x) => trimStr(x)).filter(Boolean))].sort()
    : undefined;
  const createdAt =
    typeof partial.createdAt === "number" && Number.isFinite(partial.createdAt) ? partial.createdAt : now;
  const updatedAt =
    typeof partial.updatedAt === "number" && Number.isFinite(partial.updatedAt) ? partial.updatedAt : now;
  const detailRaw = trimStr(partial.detail);
  const tagRaw = trimStr(partial.tag);
  const phaseRaw = trimStr(partial.phase);
  return {
    id: trimStr(partial.id) || newDevTaskId(),
    title,
    ...(detailRaw ? { detail: detailRaw } : {}),
    status: normStatus(partial.status),
    priority: normPriority(partial.priority),
    ...(tagRaw ? { tag: tagRaw } : {}),
    ...(phaseRaw ? { phase: phaseRaw } : {}),
    ...(deps?.length ? { dependsOn: deps } : {}),
    createdAt,
    updatedAt,
  };
}

/**
 * Stable sort: priority (high first), then status (open first), then newest updatedAt, then id.
 */
export function sortDevTasks(tasks: readonly NexoraDevTask[]): NexoraDevTask[] {
  return [...tasks].sort((a, b) => {
    const dp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (dp !== 0) return dp;
    const ds = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (ds !== 0) return ds;
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    return a.id.localeCompare(b.id);
  });
}
