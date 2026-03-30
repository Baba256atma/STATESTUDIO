import type { DecisionMemoryEntry } from "./decisionMemoryTypes";

const DEFAULT_LIMIT = 30;
const STORAGE_PREFIX = "nexora.decisionMemory.";

function key(workspaceId?: string | null, projectId?: string | null) {
  return `${STORAGE_PREFIX}${String(workspaceId || "default_workspace")}.${String(projectId || "default_project")}`;
}

function signature(entry: DecisionMemoryEntry) {
  return [
    entry.workspace_id ?? "",
    entry.project_id ?? "",
    entry.title,
    entry.recommendation_action ?? "",
    entry.situation_summary ?? "",
    entry.impact_summary ?? "",
    entry.compare_summary ?? "",
    entry.snapshot_ref?.scenario_id ?? "",
  ]
    .join("|")
    .toLowerCase();
}

export function loadDecisionMemoryEntries(
  workspaceId?: string | null,
  projectId?: string | null
): DecisionMemoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(workspaceId, projectId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadOrgScopedDecisionMemoryEntries(
  workspaceId?: string | null
): DecisionMemoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const scope = `${STORAGE_PREFIX}${String(workspaceId || "default_workspace")}.`;
    const collected: DecisionMemoryEntry[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const storageKey = window.localStorage.key(index);
      if (!storageKey || !storageKey.startsWith(scope)) continue;
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;
      collected.push(...parsed);
    }
    return pruneDecisionMemoryEntries(
      collected.filter((entry): entry is DecisionMemoryEntry => Boolean(entry?.id)),
      DEFAULT_LIMIT * 4
    );
  } catch {
    return [];
  }
}

export function saveDecisionMemoryEntries(
  workspaceId: string | null | undefined,
  projectId: string | null | undefined,
  entries: DecisionMemoryEntry[]
) {
  if (typeof window === "undefined") return entries;
  const next = pruneDecisionMemoryEntries(entries);
  try {
    window.localStorage.setItem(key(workspaceId, projectId), JSON.stringify(next));
  } catch {
    return next;
  }
  return next;
}

export function pruneDecisionMemoryEntries(
  entries: DecisionMemoryEntry[],
  limit = DEFAULT_LIMIT
): DecisionMemoryEntry[] {
  return [...entries]
    .sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0))
    .slice(0, limit);
}

export function appendDecisionMemoryEntry(params: {
  workspaceId?: string | null;
  projectId?: string | null;
  entry: DecisionMemoryEntry | null;
  existing?: DecisionMemoryEntry[];
  limit?: number;
}): DecisionMemoryEntry[] {
  const entry = params.entry;
  const current =
    params.existing ?? loadDecisionMemoryEntries(params.workspaceId, params.projectId);

  if (!entry) {
    return pruneDecisionMemoryEntries(current, params.limit ?? DEFAULT_LIMIT);
  }

  const nextSignature = signature(entry);
  const deduped = current.filter((candidate) => signature(candidate) !== nextSignature);
  const next = pruneDecisionMemoryEntries([entry, ...deduped], params.limit ?? DEFAULT_LIMIT);
  saveDecisionMemoryEntries(params.workspaceId, params.projectId, next);
  return next;
}
