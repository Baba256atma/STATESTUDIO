import { resolveManagerRecordWorkspaceId } from "../../workspace/liveManagerDataWorkspaceGuard.ts";
import type { DecisionMemoryEntry } from "./decisionMemoryTypes";

const DEFAULT_LIMIT = 30;
const STORAGE_PREFIX = "nexora.decisionMemory.";

export type DecisionMemoryStorage = Pick<Storage, "getItem" | "setItem" | "key"> & { readonly length: number };

function browserStorage(): DecisionMemoryStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function key(workspaceId?: string | null, projectId?: string | null): string | null {
  const owner = resolveManagerRecordWorkspaceId(workspaceId);
  if (!owner) return null;
  return `${STORAGE_PREFIX}${owner}.${String(projectId || "default_project")}`;
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
  projectId?: string | null,
  storage: DecisionMemoryStorage | null = browserStorage(),
): DecisionMemoryEntry[] {
  const storageKey = key(workspaceId, projectId);
  if (!storage || !storageKey) return [];
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadOrgScopedDecisionMemoryEntries(
  workspaceId?: string | null,
  storage: DecisionMemoryStorage | null = browserStorage(),
): DecisionMemoryEntry[] {
  const owner = resolveManagerRecordWorkspaceId(workspaceId);
  if (!storage || !owner) return [];
  try {
    const scope = `${STORAGE_PREFIX}${owner}.`;
    const collected: DecisionMemoryEntry[] = [];
    for (let index = 0; index < storage.length; index += 1) {
      const storageKey = storage.key(index);
      if (!storageKey || !storageKey.startsWith(scope)) continue;
      const raw = storage.getItem(storageKey);
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
  entries: DecisionMemoryEntry[],
  storage: DecisionMemoryStorage | null = browserStorage(),
) {
  const storageKey = key(workspaceId, projectId);
  const next = pruneDecisionMemoryEntries(entries);
  if (!storage || !storageKey) return next;
  try {
    storage.setItem(storageKey, JSON.stringify(next));
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
  storage?: DecisionMemoryStorage | null;
}): DecisionMemoryEntry[] {
  const owner = resolveManagerRecordWorkspaceId(params.workspaceId);
  const entry = params.entry;
  const current =
    params.existing ?? loadDecisionMemoryEntries(params.workspaceId, params.projectId, params.storage);

  if (!entry || !owner) {
    return pruneDecisionMemoryEntries(current, params.limit ?? DEFAULT_LIMIT);
  }
  const entryOwner = entry.workspace_id?.trim() ?? "";
  if (
    entryOwner &&
    entryOwner !== "default_workspace" &&
    entryOwner !== owner
  ) {
    return current;
  }
  const stamped = entryOwner && entryOwner !== "default_workspace"
    ? entry
    : { ...entry, workspace_id: owner };

  const nextSignature = signature(stamped);
  const deduped = current.filter((candidate) => signature(candidate) !== nextSignature);
  const next = pruneDecisionMemoryEntries([stamped, ...deduped], params.limit ?? DEFAULT_LIMIT);
  saveDecisionMemoryEntries(params.workspaceId, params.projectId, next, params.storage);
  return next;
}
