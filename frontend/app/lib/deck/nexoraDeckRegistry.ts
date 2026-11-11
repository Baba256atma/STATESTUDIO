/**
 * DECK-REGISTRY-NAVIGATION:1 — browser-local Deck registry.
 *
 * One registry, keyed by Workspace. This is local durability only.
 * It is not PostgreSQL persistence and it is not the Workspace registry.
 */
import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination, retainAuthorizedWorkspaceBuckets } from "../workspace/workspaceAuthorityFence.ts";
import {
  acceptDeckId,
  acceptDeckIdentitySet,
  acceptDeckRecord,
  acceptWorkspaceScopeId,
  NEXORA_EXECUTIVE_DECK_ID,
  type NexoraDeckKind,
  type NexoraDeckRecord,
} from "./nexoraDeckIdentityContract.ts";

export const NEXORA_DECK_REGISTRY_STORAGE_KEY = "nexora.deck.registry.v1" as const;
export const NEXORA_DECK_REGISTRY_SCHEMA_VERSION = 1 as const;
export const NEXORA_EXECUTIVE_DECK_NAME = "Executive" as const;
export const NEXORA_EXECUTIVE_DECK_NAME_POLICY = "fixed" as const;

export const NEXORA_DECK_REGISTRY_BOUNDARY = Object.freeze({
  storageKey: NEXORA_DECK_REGISTRY_STORAGE_KEY,
  schemaVersion: NEXORA_DECK_REGISTRY_SCHEMA_VERSION,
  workspaceRegistryKey: "nexora.workspace.registry.v1" as const,
  reusesWorkspaceRegistry: false as const,
  cloudDurability: false as const,
  databaseMigration: false as const,
  executiveNamePolicy: NEXORA_EXECUTIVE_DECK_NAME_POLICY,
});

export type NexoraDeckRegistryWorkspace = Readonly<{
  decks: readonly NexoraDeckRecord[];
  activeDeckId: string | null;
}>;

export type NexoraDeckRegistrySnapshot = Readonly<{
  schemaVersion: typeof NEXORA_DECK_REGISTRY_SCHEMA_VERSION;
  workspaces: Readonly<Record<string, NexoraDeckRegistryWorkspace>>;
}>;

export type NexoraDeckRegistryFailure =
  | "storage-unavailable"
  | "storage-failed"
  | "corrupt"
  | "unsupported-version"
  | "invalid-workspace"
  | "invalid-deck"
  | "duplicate-deck"
  | "invalid-name"
  | "invalid-kind"
  | "executive-protected"
  | "executive-missing"
  | "archived"
  | "revision-conflict";

export type NexoraDeckRegistryResult<T> =
  | Readonly<{ ok: true; value: T; snapshot: NexoraDeckRegistrySnapshot }>
  | Readonly<{ ok: false; reason: NexoraDeckRegistryFailure; snapshot: NexoraDeckRegistrySnapshot }>;

type Listener = () => void;

const listeners = new Set<Listener>();
let storageOverride: Storage | null | undefined;
let snapshot: NexoraDeckRegistrySnapshot = emptySnapshot();
let baseRaw: string | null = null;

function emptySnapshot(): NexoraDeckRegistrySnapshot {
  return Object.freeze({
    schemaVersion: NEXORA_DECK_REGISTRY_SCHEMA_VERSION,
    workspaces: Object.freeze({}),
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

function bucketOf(workspaceId: string): NexoraDeckRegistryWorkspace {
  return snapshot.workspaces[workspaceId] ?? Object.freeze({ decks: Object.freeze([]), activeDeckId: null });
}

function withBucket(
  workspaceId: string,
  bucket: NexoraDeckRegistryWorkspace,
): NexoraDeckRegistrySnapshot {
  return Object.freeze({
    schemaVersion: NEXORA_DECK_REGISTRY_SCHEMA_VERSION,
    workspaces: Object.freeze({
      ...snapshot.workspaces,
      [workspaceId]: bucket,
    }),
  });
}

function persist(next: NexoraDeckRegistrySnapshot): NexoraDeckRegistryFailure | null {
  const storage = registryStorage();
  if (!storage) return "storage-unavailable";
  const encoded = JSON.stringify(next);
  try {
    storage.setItem(NEXORA_DECK_REGISTRY_STORAGE_KEY, encoded);
  } catch {
    return "storage-failed";
  }
  let stored: string | null = null;
  try {
    stored = storage.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY);
  } catch {
    return "storage-failed";
  }
  if (stored !== encoded) return "storage-failed";
  return null;
}

function storedWorkspaces(): Readonly<Record<string, NexoraDeckRegistryWorkspace>> {
  const storage = registryStorage();
  if (!storage) return snapshot.workspaces;
  let raw: string | null = null;
  try {
    raw = storage.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY);
  } catch {
    return {};
  }
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as { workspaces?: Record<string, NexoraDeckRegistryWorkspace> };
    return parsed.workspaces ?? {};
  } catch {
    return {};
  }
}

function commit(next: NexoraDeckRegistrySnapshot): NexoraDeckRegistryResult<NexoraDeckRegistrySnapshot> {
  if (requireWorkspaceMutationCoordination()) return fail("invalid-workspace");
  const fenced = retainAuthorizedWorkspaceBuckets(storedWorkspaces(), next.workspaces);
  if (!fenced.ok) return fail("invalid-workspace");
  const fencedSnapshot = Object.freeze({
    schemaVersion: NEXORA_DECK_REGISTRY_SCHEMA_VERSION,
    workspaces: Object.freeze(fenced.workspaces),
  });
  const storage = registryStorage();
  let raw: string | null = null;
  try {
    raw = storage?.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY) ?? null;
  } catch {
    return fail("storage-failed");
  }
  if (storage && raw !== baseRaw) {
    recoverDeckRegistryFromStorage();
    return fail("revision-conflict");
  }
  const failure = persist(fencedSnapshot);
  if (failure) return Object.freeze({ ok: false, reason: failure, snapshot });
  snapshot = fencedSnapshot;
  baseRaw = JSON.stringify(fencedSnapshot);
  emit();
  return Object.freeze({ ok: true, value: snapshot, snapshot });
}

function fail<T>(reason: NexoraDeckRegistryFailure): NexoraDeckRegistryResult<T> {
  return Object.freeze({ ok: false, reason, snapshot });
}

function slugDeckName(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return slug || "deck";
}

function nextDeckId(name: string, decks: readonly NexoraDeckRecord[]): string | null {
  let base = slugDeckName(name);
  if (base === NEXORA_EXECUTIVE_DECK_ID || acceptDeckId(base) == null) base = `${base}_deck`;
  let candidate = base;
  let suffix = 2;
  while (decks.some((deck) => deck.deckId === candidate) || acceptDeckId(candidate) == null) {
    candidate = `${base}_${suffix}`;
    suffix += 1;
    if (suffix > 1000) return null;
  }
  return candidate;
}

function activeIdFor(decks: readonly NexoraDeckRecord[], requested: string | null): string | null {
  const requestedDeck = decks.find((deck) => deck.deckId === requested);
  if (requestedDeck?.status === "ACTIVE") return requestedDeck.deckId;
  const executive = decks.find((deck) => deck.deckId === NEXORA_EXECUTIVE_DECK_ID && deck.kind === "EXECUTIVE" && deck.status === "ACTIVE");
  return executive?.deckId ?? null;
}

function parseSnapshot(raw: string): NexoraDeckRegistrySnapshot | NexoraDeckRegistryFailure {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return "corrupt";
  }
  if (!parsed || typeof parsed !== "object") return "corrupt";
  const candidate = parsed as { schemaVersion?: unknown; workspaces?: unknown };
  if (candidate.schemaVersion !== NEXORA_DECK_REGISTRY_SCHEMA_VERSION) {
    return typeof candidate.schemaVersion === "number" ? "unsupported-version" : "corrupt";
  }
  if (!candidate.workspaces || typeof candidate.workspaces !== "object" || Array.isArray(candidate.workspaces)) {
    return "corrupt";
  }
  const workspaces: Record<string, NexoraDeckRegistryWorkspace> = {};
  for (const [workspaceId, value] of Object.entries(candidate.workspaces)) {
    const acceptedWorkspace = acceptWorkspaceScopeId(workspaceId);
    if (!acceptedWorkspace || acceptedWorkspace !== workspaceId || !value || typeof value !== "object") return "corrupt";
    const bucket = value as { decks?: unknown; activeDeckId?: unknown };
    if (!Array.isArray(bucket.decks)) return "corrupt";
    const decks: NexoraDeckRecord[] = [];
    for (const entry of bucket.decks) {
      const record = acceptDeckRecord(entry);
      if (!record || record.workspaceId !== workspaceId) return "corrupt";
      if (record.deckId === NEXORA_EXECUTIVE_DECK_ID && (record.kind !== "EXECUTIVE" || record.name !== NEXORA_EXECUTIVE_DECK_NAME)) {
        return "corrupt";
      }
      decks.push(record);
    }
    if (acceptDeckIdentitySet(decks) == null) return "corrupt";
    const activeDeckId = bucket.activeDeckId == null ? null : acceptDeckId(bucket.activeDeckId);
    if (bucket.activeDeckId != null && activeDeckId == null) return "corrupt";
    const resolved = activeIdFor(decks, activeDeckId);
    if (activeDeckId != null && resolved !== activeDeckId) return "corrupt";
    workspaces[workspaceId] = Object.freeze({
      decks: Object.freeze(decks),
      activeDeckId: resolved,
    });
  }
  return Object.freeze({
    schemaVersion: NEXORA_DECK_REGISTRY_SCHEMA_VERSION,
    workspaces: Object.freeze(workspaces),
  });
}

export function subscribeDeckRegistry(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDeckRegistrySnapshot(): NexoraDeckRegistrySnapshot {
  return snapshot;
}

export function recoverDeckRegistryFromStorage(): NexoraDeckRegistryResult<NexoraDeckRegistrySnapshot> {
  const storage = registryStorage();
  if (!storage) return fail("storage-unavailable");
  let raw: string | null = null;
  try {
    raw = storage.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY);
  } catch {
    return fail("storage-failed");
  }
  baseRaw = raw;
  if (raw == null) return Object.freeze({ ok: true, value: snapshot, snapshot });
  const parsed = parseSnapshot(raw);
  if (typeof parsed === "string") return fail(parsed);
  snapshot = parsed;
  emit();
  return Object.freeze({ ok: true, value: snapshot, snapshot });
}

export function listWorkspaceDecks(workspaceId: string): readonly NexoraDeckRecord[] {
  const accepted = acceptWorkspaceScopeId(workspaceId);
  if (!accepted) return Object.freeze([]);
  return bucketOf(accepted).decks;
}

export function readActiveDeckId(workspaceId: string): string | null {
  const accepted = acceptWorkspaceScopeId(workspaceId);
  if (!accepted) return null;
  return bucketOf(accepted).activeDeckId;
}

export function ensureExecutiveDeck(workspaceId: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  const accepted = acceptWorkspaceScopeId(workspaceId);
  if (!accepted) return fail("invalid-workspace");
  const current = bucketOf(accepted);
  const existing = current.decks.find((deck) => deck.deckId === NEXORA_EXECUTIVE_DECK_ID);
  if (existing?.kind === "EXECUTIVE" && existing.status === "ACTIVE" && existing.name === NEXORA_EXECUTIVE_DECK_NAME) {
    const activeDeckId = activeIdFor(current.decks, current.activeDeckId);
    if (activeDeckId === current.activeDeckId) {
      return Object.freeze({ ok: true, value: existing, snapshot });
    }
    const committed = commit(withBucket(accepted, Object.freeze({ decks: current.decks, activeDeckId })));
    if (!committed.ok) return committed;
    return Object.freeze({ ok: true, value: existing, snapshot });
  }
  if (existing) return fail("corrupt");
  const timestamp = nowIso();
  const created = acceptDeckRecord({
    workspaceId: accepted,
    deckId: NEXORA_EXECUTIVE_DECK_ID,
    name: NEXORA_EXECUTIVE_DECK_NAME,
    kind: "EXECUTIVE",
    status: "ACTIVE",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  if (!created) return fail("invalid-deck");
  const decks = Object.freeze([created, ...current.decks]);
  const committed = commit(withBucket(accepted, Object.freeze({
    decks,
    activeDeckId: activeIdFor(decks, current.activeDeckId ?? created.deckId),
  })));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: created, snapshot });
}

export function createDeck(input: {
  readonly workspaceId: string;
  readonly name: string;
  readonly kind: NexoraDeckKind;
}): NexoraDeckRegistryResult<NexoraDeckRecord> {
  const workspaceId = acceptWorkspaceScopeId(input.workspaceId);
  if (!workspaceId) return fail("invalid-workspace");
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return fail("invalid-workspace");
  if (input.kind !== "DEPARTMENT" && input.kind !== "FUNCTIONAL") return fail("invalid-kind");
  if (typeof input.name !== "string" || input.name.trim().length === 0) return fail("invalid-name");
  const current = bucketOf(workspaceId);
  const deckId = nextDeckId(input.name, current.decks);
  if (!deckId) return fail("invalid-deck");
  const timestamp = nowIso();
  const created = acceptDeckRecord({
    workspaceId,
    deckId,
    name: input.name.trim(),
    kind: input.kind,
    status: "ACTIVE",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  if (!created || acceptDeckIdentitySet([...current.decks, created]) == null) return fail("duplicate-deck");
  const decks = Object.freeze([...current.decks, created]);
  const committed = commit(withBucket(workspaceId, Object.freeze({
    decks,
    activeDeckId: current.activeDeckId,
  })));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: created, snapshot });
}

export function renameDeck(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly name: string;
}): NexoraDeckRegistryResult<NexoraDeckRecord> {
  const workspaceId = acceptWorkspaceScopeId(input.workspaceId);
  const deckId = acceptDeckId(input.deckId);
  if (!workspaceId) return fail("invalid-workspace");
  if (!deckId) return fail("invalid-deck");
  if (deckId === NEXORA_EXECUTIVE_DECK_ID) return fail("executive-protected");
  if (typeof input.name !== "string" || input.name.trim().length === 0) return fail("invalid-name");
  const current = bucketOf(workspaceId);
  const index = current.decks.findIndex((deck) => deck.deckId === deckId);
  const previous = current.decks[index];
  if (!previous) return fail("invalid-deck");
  const renamed = acceptDeckRecord({
    ...previous,
    name: input.name.trim(),
    updatedAt: nowIso(),
  });
  if (!renamed || renamed.deckId !== previous.deckId || renamed.createdAt !== previous.createdAt) return fail("invalid-deck");
  const decks = current.decks.map((deck, deckIndex) => (deckIndex === index ? renamed : deck));
  const committed = commit(withBucket(workspaceId, Object.freeze({ decks: Object.freeze(decks), activeDeckId: current.activeDeckId })));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: renamed, snapshot });
}

export function archiveDeck(workspaceIdInput: string, deckIdInput: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  const workspaceId = acceptWorkspaceScopeId(workspaceIdInput);
  const deckId = acceptDeckId(deckIdInput);
  if (!workspaceId) return fail("invalid-workspace");
  if (!deckId) return fail("invalid-deck");
  if (deckId === NEXORA_EXECUTIVE_DECK_ID) return fail("executive-protected");
  const current = bucketOf(workspaceId);
  const previous = current.decks.find((deck) => deck.deckId === deckId);
  if (!previous) return fail("invalid-deck");
  if (!current.decks.some((deck) => deck.deckId === NEXORA_EXECUTIVE_DECK_ID && deck.status === "ACTIVE")) {
    return fail("executive-missing");
  }
  const archived = acceptDeckRecord({ ...previous, status: "ARCHIVED", updatedAt: nowIso() });
  if (!archived) return fail("invalid-deck");
  const decks = current.decks.map((deck) => (deck.deckId === deckId ? archived : deck));
  const activeDeckId = current.activeDeckId === deckId ? NEXORA_EXECUTIVE_DECK_ID : current.activeDeckId;
  const committed = commit(withBucket(workspaceId, Object.freeze({ decks: Object.freeze(decks), activeDeckId })));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: archived, snapshot });
}

export function restoreDeck(workspaceIdInput: string, deckIdInput: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  const workspaceId = acceptWorkspaceScopeId(workspaceIdInput);
  const deckId = acceptDeckId(deckIdInput);
  if (!workspaceId) return fail("invalid-workspace");
  if (!deckId) return fail("invalid-deck");
  const current = bucketOf(workspaceId);
  const previous = current.decks.find((deck) => deck.deckId === deckId);
  if (!previous) return fail("invalid-deck");
  const restored = acceptDeckRecord({ ...previous, status: "ACTIVE", updatedAt: nowIso() });
  if (!restored) return fail("invalid-deck");
  const decks = current.decks.map((deck) => (deck.deckId === deckId ? restored : deck));
  if (acceptDeckIdentitySet(decks) == null) return fail("duplicate-deck");
  const committed = commit(withBucket(workspaceId, Object.freeze({ decks: Object.freeze(decks), activeDeckId: current.activeDeckId })));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: restored, snapshot });
}

export function selectDeck(workspaceIdInput: string, deckIdInput: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  const workspaceId = acceptWorkspaceScopeId(workspaceIdInput);
  const deckId = acceptDeckId(deckIdInput);
  if (!workspaceId) return fail("invalid-workspace");
  if (!deckId) return fail("invalid-deck");
  const current = bucketOf(workspaceId);
  const selected = current.decks.find((deck) => deck.deckId === deckId);
  if (!selected) return fail("invalid-deck");
  if (selected.status !== "ACTIVE") return fail("archived");
  const committed = commit(withBucket(workspaceId, Object.freeze({ decks: current.decks, activeDeckId: selected.deckId })));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: selected, snapshot });
}

export function forgetWorkspaceDecks(workspaceIdInput: string): NexoraDeckRegistryResult<null> {
  const workspaceId = acceptWorkspaceScopeId(workspaceIdInput);
  if (!workspaceId || !snapshot.workspaces[workspaceId]) return Object.freeze({ ok: true, value: null, snapshot });
  const workspaces = { ...snapshot.workspaces };
  delete workspaces[workspaceId];
  const committed = commit(Object.freeze({
    schemaVersion: NEXORA_DECK_REGISTRY_SCHEMA_VERSION,
    workspaces: Object.freeze(workspaces),
  }));
  if (!committed.ok) return committed;
  return Object.freeze({ ok: true, value: null, snapshot: committed.snapshot });
}

export function setDeckRegistryStorageForTests(storage: Storage | null): void {
  storageOverride = storage;
  baseRaw = null;
}

export function resetDeckRegistryForTests(): void {
  snapshot = emptySnapshot();
  baseRaw = null;
  listeners.clear();
  try {
    registryStorage()?.removeItem(NEXORA_DECK_REGISTRY_STORAGE_KEY);
  } catch {
    // The in-memory snapshot is already empty.
  }
}
