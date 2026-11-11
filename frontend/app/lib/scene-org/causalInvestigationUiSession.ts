/**
 * NexoCause view selection for the active Workspace and Deck.
 * Identities only. Dataset values are never stored here.
 */

export type CausalInvestigationUiSelection = Readonly<{
  investigationId: string;
  hypothesisId: string | null;
  canonicalObjectId: string | null;
}>;

type SelectionMap = Readonly<Record<string, CausalInvestigationUiSelection>>;

export const CAUSAL_INVESTIGATION_UI_SELECTION_KEY = "nexora.causal-investigation.ui-selection.v1" as const;

const EMPTY: SelectionMap = Object.freeze({});
let storageOverride: Storage | null | undefined;
let map: SelectionMap = EMPTY;
let serverMap: SelectionMap = EMPTY;
const listeners = new Set<() => void>();

function restoreBrowserSelection(): void {
  if (typeof window === "undefined" || storageOverride !== undefined) return;
  map = load();
}

restoreBrowserSelection();

function scopeKey(workspaceId: string, deckId: string): string {
  return `${workspaceId}\n${deckId}`;
}

function storage(): Storage | null {
  if (storageOverride !== undefined) return storageOverride;
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function identity(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (text.length === 0 || text.length > 180 || /\s/.test(text)) return null;
  return text;
}

function parseEntry(value: unknown): CausalInvestigationUiSelection | null {
  if (value == null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some((key) => !["investigationId", "hypothesisId", "canonicalObjectId"].includes(key))) {
    return null;
  }
  const investigationId = identity(record.investigationId);
  if (!investigationId) return null;
  const hypothesisId = record.hypothesisId == null ? null : identity(record.hypothesisId);
  const canonicalObjectId = record.canonicalObjectId == null ? null : identity(record.canonicalObjectId);
  if (record.hypothesisId != null && hypothesisId == null) return null;
  if (record.canonicalObjectId != null && canonicalObjectId == null) return null;
  return Object.freeze({ investigationId, hypothesisId, canonicalObjectId });
}

function load(): SelectionMap {
  const current = storage();
  if (!current) return EMPTY;
  try {
    const raw = current.getItem(CAUSAL_INVESTIGATION_UI_SELECTION_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) return EMPTY;
    const next: Record<string, CausalInvestigationUiSelection> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const entry = parseEntry(value);
      if (entry && key.includes("\n")) next[key] = entry;
    }
    return Object.freeze(next);
  } catch {
    return EMPTY;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(next: SelectionMap): void {
  map = next;
  if (storageOverride !== undefined) serverMap = next;
  const current = storage();
  if (current) {
    try {
      current.setItem(CAUSAL_INVESTIGATION_UI_SELECTION_KEY, JSON.stringify(next));
    } catch {
      // Selection remains in memory for this view. Canonical investigations are unchanged.
    }
  }
  emit();
}

export function subscribeCausalInvestigationUiSelection(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCausalInvestigationUiSelectionSnapshot(): SelectionMap {
  return map;
}

export function getCausalInvestigationUiSelectionServerSnapshot(): SelectionMap {
  return serverMap;
}

export function forgetWorkspaceCausalInvestigationUiSelection(workspaceId: string): void {
  const prefix = `${workspaceId}\n`;
  const next: Record<string, CausalInvestigationUiSelection> = {};
  for (const [key, value] of Object.entries(map)) {
    if (!key.startsWith(prefix)) next[key] = value;
  }
  persist(Object.freeze(next));
}

export function readCausalInvestigationUiSelection(
  workspaceId: string,
  deckId: string,
): CausalInvestigationUiSelection | null {
  return map[scopeKey(workspaceId, deckId)] ?? null;
}

export function publishCausalInvestigationUiSelection(
  workspaceId: string,
  deckId: string,
  selection: CausalInvestigationUiSelection | null,
): void {
  const key = scopeKey(workspaceId, deckId);
  if (selection == null) {
    if (!(key in map)) return;
    const next = { ...map };
    delete next[key];
    persist(Object.freeze(next));
    return;
  }
  const entry = parseEntry(selection);
  if (!entry) return;
  if (
    map[key]?.investigationId === entry.investigationId
    && map[key]?.hypothesisId === entry.hypothesisId
    && map[key]?.canonicalObjectId === entry.canonicalObjectId
  ) {
    return;
  }
  persist(Object.freeze({ ...map, [key]: entry }));
}

export function setCausalInvestigationUiStorageForTests(next: Storage | null): void {
  storageOverride = next;
  map = load();
  serverMap = map;
  emit();
}

export function resetCausalInvestigationUiSessionForTests(): void {
  storageOverride = undefined;
  map = EMPTY;
  serverMap = EMPTY;
  emit();
}
