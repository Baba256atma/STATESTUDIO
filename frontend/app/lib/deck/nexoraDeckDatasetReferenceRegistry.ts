/**
 * SHARED-DATASET-DECK-REFERENCE:1
 *
 * Pointers from a Deck to a Workspace-owned Dataset.
 * CSV payloads stay in the existing CSV store. This registry does not copy them.
 * Browser localStorage is local durability only.
 */
import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination } from "../workspace/workspaceAuthorityFence.ts";
import { acceptDeckId, acceptWorkspaceScopeId } from "./nexoraDeckIdentityContract.ts";

export const NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY = "nexora.deck.dataset-references.v1" as const;
export const NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION = 1 as const;

export const NEXORA_DECK_DATASET_REFERENCE_BOUNDARY = Object.freeze({
  storageKey: NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY,
  schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
  copiesDatasetPayload: false as const,
  cloudDurability: false as const,
  databaseMigration: false as const,
  datasetAuthority: "csvRealDataImportStore.sourceContextId" as const,
});

export type DeckDatasetReference = Readonly<{
  workspaceId: string;
  deckId: string;
  datasetId: string;
  createdAt: string;
}>;

export type DeckDatasetReferenceSnapshot = Readonly<{
  schemaVersion: typeof NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION;
  references: readonly DeckDatasetReference[];
}>;

export type DeckDatasetReferenceFailure =
  | "storage-unavailable"
  | "storage-failed"
  | "corrupt"
  | "unsupported-version"
  | "invalid-workspace"
  | "invalid-deck"
  | "invalid-dataset"
  | "duplicate-reference"
  | "foreign-workspace"
  | "deck-archived"
  | "dataset-missing";

export type DeckDatasetReferenceResult<T> =
  | Readonly<{ ok: true; value: T; snapshot: DeckDatasetReferenceSnapshot }>
  | Readonly<{ ok: false; reason: DeckDatasetReferenceFailure; snapshot: DeckDatasetReferenceSnapshot }>;

type Listener = () => void;
const listeners = new Set<Listener>();
let storageOverride: Storage | null | undefined;
let snapshot: DeckDatasetReferenceSnapshot = emptySnapshot();

function emptySnapshot(): DeckDatasetReferenceSnapshot {
  return Object.freeze({
    schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
    references: Object.freeze([]),
  });
}

function nowIso(): string {
  return new Date().toISOString();
}

function registryStorage(): Storage | null {
  if (storageOverride !== undefined) return storageOverride;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function fail<T>(reason: DeckDatasetReferenceFailure): DeckDatasetReferenceResult<T> {
  return Object.freeze({ ok: false, reason, snapshot });
}

function persist(next: DeckDatasetReferenceSnapshot): DeckDatasetReferenceFailure | null {
  const storage = registryStorage();
  if (!storage) return "storage-unavailable";
  const encoded = JSON.stringify(next);
  try {
    storage.setItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY, encoded);
  } catch {
    return "storage-failed";
  }
  try {
    if (storage.getItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY) !== encoded) return "storage-failed";
  } catch {
    return "storage-failed";
  }
  return null;
}

function storedReferences(): readonly DeckDatasetReference[] {
  const storage = registryStorage();
  if (!storage) return snapshot.references;
  let raw: string | null = null;
  try {
    raw = storage.getItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY);
  } catch {
    return Object.freeze([]);
  }
  if (!raw) return Object.freeze([]);
  try {
    const parsed = JSON.parse(raw) as { references?: unknown };
    return Array.isArray(parsed.references) ? parsed.references as DeckDatasetReference[] : Object.freeze([]);
  } catch {
    return Object.freeze([]);
  }
}

function commit(next: DeckDatasetReferenceSnapshot): DeckDatasetReferenceResult<DeckDatasetReferenceSnapshot> {
  if (requireWorkspaceMutationCoordination()) return fail("invalid-workspace");
  const stored = new Set(storedReferences().map((reference) => `${reference.workspaceId}\0${reference.deckId}\0${reference.datasetId}`));
  const references = next.references.filter((reference) => {
    if (evaluateWorkspaceAuthority(reference.workspaceId).ok) return true;
    return stored.has(`${reference.workspaceId}\0${reference.deckId}\0${reference.datasetId}`);
  });
  const fenced = Object.freeze({
    schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
    references: Object.freeze(references),
  });
  const failure = persist(fenced);
  if (failure) return fail(failure);
  snapshot = fenced;
  emit();
  return Object.freeze({ ok: true, value: snapshot, snapshot });
}

function sameReference(reference: DeckDatasetReference, workspaceId: string, deckId: string, datasetId: string): boolean {
  return reference.workspaceId === workspaceId && reference.deckId === deckId && reference.datasetId === datasetId;
}

function acceptReference(value: unknown): DeckDatasetReference | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<DeckDatasetReference>;
  const workspaceId = acceptWorkspaceScopeId(candidate.workspaceId);
  const deckId = acceptDeckId(candidate.deckId);
  const datasetId = typeof candidate.datasetId === "string" ? candidate.datasetId.trim() : "";
  const createdAt = typeof candidate.createdAt === "string" ? candidate.createdAt.trim() : "";
  if (!workspaceId || !deckId || datasetId.length === 0 || createdAt.length === 0) return null;
  if ("prepared" in candidate || "rows" in candidate) return null;
  return Object.freeze({ workspaceId, deckId, datasetId, createdAt });
}

function parseSnapshot(raw: string): DeckDatasetReferenceSnapshot | DeckDatasetReferenceFailure {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return "corrupt";
  }
  if (!parsed || typeof parsed !== "object") return "corrupt";
  const candidate = parsed as { schemaVersion?: unknown; references?: unknown };
  if (candidate.schemaVersion !== NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION) {
    return typeof candidate.schemaVersion === "number" ? "unsupported-version" : "corrupt";
  }
  if (!Array.isArray(candidate.references)) return "corrupt";
  const references: DeckDatasetReference[] = [];
  const seen = new Set<string>();
  for (const entry of candidate.references) {
    const reference = acceptReference(entry);
    if (!reference) return "corrupt";
    const key = `${reference.workspaceId}\0${reference.deckId}\0${reference.datasetId}`;
    if (seen.has(key)) return "corrupt";
    seen.add(key);
    references.push(reference);
  }
  return Object.freeze({
    schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
    references: Object.freeze(references),
  });
}

export function subscribeDeckDatasetReferences(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDeckDatasetReferenceSnapshot(): DeckDatasetReferenceSnapshot {
  return snapshot;
}

export function recoverDeckDatasetReferencesFromStorage(): DeckDatasetReferenceResult<DeckDatasetReferenceSnapshot> {
  const storage = registryStorage();
  if (!storage) return fail("storage-unavailable");
  let raw: string | null = null;
  try {
    raw = storage.getItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY);
  } catch {
    return fail("storage-failed");
  }
  if (raw == null) return Object.freeze({ ok: true, value: snapshot, snapshot });
  const parsed = parseSnapshot(raw);
  if (typeof parsed === "string") return fail(parsed);
  snapshot = parsed;
  emit();
  return Object.freeze({ ok: true, value: snapshot, snapshot });
}

export function listDeckDatasetReferences(workspaceId: string, deckId: string): readonly DeckDatasetReference[] {
  const acceptedWorkspace = acceptWorkspaceScopeId(workspaceId);
  const acceptedDeck = acceptDeckId(deckId);
  if (!acceptedWorkspace || !acceptedDeck) return Object.freeze([]);
  return Object.freeze(snapshot.references.filter((reference) => reference.workspaceId === acceptedWorkspace && reference.deckId === acceptedDeck));
}

export function listDatasetDeckReferences(workspaceId: string, datasetId: string): readonly DeckDatasetReference[] {
  const acceptedWorkspace = acceptWorkspaceScopeId(workspaceId);
  if (!acceptedWorkspace || datasetId.trim().length === 0) return Object.freeze([]);
  return Object.freeze(snapshot.references.filter((reference) => reference.workspaceId === acceptedWorkspace && reference.datasetId === datasetId));
}

export function assignDatasetReference(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly datasetId: string;
}): DeckDatasetReferenceResult<DeckDatasetReference> {
  const workspaceId = acceptWorkspaceScopeId(input.workspaceId);
  const deckId = acceptDeckId(input.deckId);
  const datasetId = input.datasetId.trim();
  if (!workspaceId) return fail("invalid-workspace");
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return fail("invalid-workspace");
  if (!deckId) return fail("invalid-deck");
  if (datasetId.length === 0) return fail("invalid-dataset");
  if (snapshot.references.some((reference) => sameReference(reference, workspaceId, deckId, datasetId))) {
    return fail("duplicate-reference");
  }
  const reference = Object.freeze({ workspaceId, deckId, datasetId, createdAt: nowIso() });
  const committed = commit(Object.freeze({
    schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
    references: Object.freeze([...snapshot.references, reference]),
  }));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: reference, snapshot });
}

export function removeDatasetReference(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly datasetId: string;
}): DeckDatasetReferenceResult<DeckDatasetReference | null> {
  const workspaceId = acceptWorkspaceScopeId(input.workspaceId);
  const deckId = acceptDeckId(input.deckId);
  const datasetId = input.datasetId.trim();
  if (!workspaceId || !deckId || datasetId.length === 0) return fail("invalid-dataset");
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return fail("invalid-workspace");
  const existing = snapshot.references.find((reference) => sameReference(reference, workspaceId, deckId, datasetId)) ?? null;
  if (!existing) return Object.freeze({ ok: true, value: null, snapshot });
  const committed = commit(Object.freeze({
    schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
    references: Object.freeze(snapshot.references.filter((reference) => !sameReference(reference, workspaceId, deckId, datasetId))),
  }));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: existing, snapshot });
}

export function dropDatasetReferences(workspaceIdInput: string, datasetId: string): DeckDatasetReferenceResult<number> {
  const workspaceId = acceptWorkspaceScopeId(workspaceIdInput);
  if (!workspaceId || datasetId.trim().length === 0) return fail("invalid-dataset");
  const remaining = snapshot.references.filter((reference) => reference.workspaceId !== workspaceId || reference.datasetId !== datasetId);
  const removed = snapshot.references.length - remaining.length;
  if (removed === 0) return Object.freeze({ ok: true, value: 0, snapshot });
  const committed = commit(Object.freeze({
    schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
    references: Object.freeze(remaining),
  }));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: removed, snapshot });
}

export function countWorkspaceDatasetReferences(workspaceIdInput: string): number {
  const workspaceId = acceptWorkspaceScopeId(workspaceIdInput);
  if (!workspaceId) return 0;
  return snapshot.references.filter((reference) => reference.workspaceId === workspaceId).length;
}

export function forgetWorkspaceDatasetReferences(workspaceIdInput: string): DeckDatasetReferenceResult<null> {
  const workspaceId = acceptWorkspaceScopeId(workspaceIdInput);
  if (!workspaceId) return fail("invalid-workspace");
  const remaining = snapshot.references.filter((reference) => reference.workspaceId !== workspaceId);
  if (remaining.length === snapshot.references.length) return Object.freeze({ ok: true, value: null, snapshot });
  const committed = commit(Object.freeze({
    schemaVersion: NEXORA_DECK_DATASET_REFERENCE_SCHEMA_VERSION,
    references: Object.freeze(remaining),
  }));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: null, snapshot });
}

export function setDeckDatasetReferenceStorageForTests(storage: Storage | null): void {
  storageOverride = storage;
}

export function resetDeckDatasetReferencesForTests(): void {
  snapshot = emptySnapshot();
  listeners.clear();
  try {
    registryStorage()?.removeItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY);
  } catch {
    // The in-memory snapshot is already empty.
  }
}
