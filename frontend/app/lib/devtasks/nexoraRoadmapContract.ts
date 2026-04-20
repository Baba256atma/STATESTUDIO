/**
 * R.1 — Roadmap phase contract (JSON-safe, deterministic).
 */

export type NexoraRoadmapPhase = {
  id: string;
  title: string;
  status: "planned" | "active" | "done" | "blocked";
  parentId?: string | null;
  order: number;
  description?: string;
  dependsOn?: string[];
};

export type NexoraRoadmapViewModel = {
  phases: NexoraRoadmapPhase[];
};

const STATUS_ORDER: Record<NexoraRoadmapPhase["status"], number> = {
  blocked: 0,
  active: 1,
  planned: 2,
  done: 3,
};

function trimStr(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

function normStatus(s: unknown): NexoraRoadmapPhase["status"] {
  const v = trimStr(s).toLowerCase();
  if (v === "planned" || v === "active" || v === "done" || v === "blocked") return v;
  return "planned";
}

/** Coerce partial input into a valid phase row. */
export function normalizeRoadmapPhase(
  partial: Partial<NexoraRoadmapPhase> & Pick<NexoraRoadmapPhase, "id" | "title">
): NexoraRoadmapPhase {
  const id = trimStr(partial.id);
  const title = trimStr(partial.title) || "(untitled phase)";
  const parentRaw = trimStr(partial.parentId);
  const deps = Array.isArray(partial.dependsOn)
    ? [...new Set(partial.dependsOn.map((x) => trimStr(x)).filter(Boolean))].sort()
    : undefined;
  const desc = trimStr(partial.description);
  const order = typeof partial.order === "number" && Number.isFinite(partial.order) ? partial.order : 0;
  return {
    id,
    title,
    status: normStatus(partial.status),
    ...(parentRaw ? { parentId: parentRaw } : { parentId: null }),
    order,
    ...(desc ? { description: desc } : {}),
    ...(deps?.length ? { dependsOn: deps } : {}),
  };
}

/**
 * Stable sort: parent tree walk (roots first by order, then DFS children), then orphan append.
 */
export function sortRoadmapPhases(phases: readonly NexoraRoadmapPhase[]): NexoraRoadmapPhase[] {
  const list = phases.map((p) => normalizeRoadmapPhase(p as NexoraRoadmapPhase));
  const byId = new Map(list.map((p) => [p.id, p]));
  const out: NexoraRoadmapPhase[] = [];
  const seen = new Set<string>();

  const cmp = (a: NexoraRoadmapPhase, b: NexoraRoadmapPhase) =>
    a.order !== b.order ? a.order - b.order : a.id.localeCompare(b.id);

  const visit = (parentKey: string | null) => {
    const kids = list
      .filter((p) => {
        const pid = p.parentId?.trim() || null;
        return pid === parentKey;
      })
      .sort(cmp);
    for (const k of kids) {
      if (seen.has(k.id)) continue;
      seen.add(k.id);
      out.push(k);
      visit(k.id);
    }
  };

  visit(null);

  for (const p of [...list].sort(cmp)) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  }

  return out;
}

/** Group children by parent id; key `__root__` for phases with null / missing parent. */
export function groupPhasesByParent(phases: readonly NexoraRoadmapPhase[]): Map<string, NexoraRoadmapPhase[]> {
  const norm = phases.map((p) => normalizeRoadmapPhase(p as NexoraRoadmapPhase));
  const m = new Map<string, NexoraRoadmapPhase[]>();
  for (const p of norm) {
    const key = p.parentId?.trim() || "__root__";
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(p);
  }
  for (const arr of m.values()) {
    arr.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  }
  return m;
}

/** Flat list with stable ordering for compact UI (status hint, then sortRoadmapPhases). */
export function flattenPhasesForDisplay(phases: readonly NexoraRoadmapPhase[]): NexoraRoadmapPhase[] {
  const sorted = sortRoadmapPhases(phases);
  return [...sorted].sort((a, b) => {
    const ds = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (ds !== 0) return ds;
    return sorted.indexOf(a) - sorted.indexOf(b);
  });
}
