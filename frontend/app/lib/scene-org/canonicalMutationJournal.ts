/**
 * NPA-T CANONICAL-DATASET-ENTITY-PIPELINE:1
 *
 * Coordination record for operations that touch more than one canonical store.
 * localStorage writes are not one atomic transaction. This journal makes a
 * partial operation detectable and resumable. It does not own objects or edges.
 */

export const canonicalMutationJournalIdentity =
  "NPA-T CANONICAL-DATASET-ENTITY-PIPELINE:1/CanonicalMutationJournal" as const;

export const CANONICAL_MUTATION_JOURNAL_KEY = "nexora.canonical-operation-journal.v1" as const;
import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination } from "../workspace/workspaceAuthorityFence.ts";

export const CANONICAL_MUTATION_JOURNAL_SCHEMA = 1 as const;

export type CanonicalMutationStatus =
  | "PREPARED"
  | "APPLYING"
  | "COMMITTED"
  | "RECOVERY_REQUIRED"
  | "RECOVERED";

export type CanonicalMutationOperation = Readonly<{
  operationId: string;
  kind: "archive-object" | "delete-object" | "detach-dataset" | "link-source";
  workspaceId: string;
  canonicalObjectId: string | null;
  datasetId: string | null;
  sourceKey: string | null;
  relationshipIds: readonly string[];
  status: CanonicalMutationStatus;
}>;

type JournalSnapshot = Readonly<{
  identity: typeof canonicalMutationJournalIdentity;
  schemaVersion: typeof CANONICAL_MUTATION_JOURNAL_SCHEMA;
  operations: readonly CanonicalMutationOperation[];
}>;

type JournalState =
  | Readonly<{ status: "ready" | "empty"; snapshot: JournalSnapshot }>
  | Readonly<{ status: "corrupt" | "unsupported-version" }>;

let storageOverride: Storage | null | undefined;
let state: JournalState = { status: "empty", snapshot: emptyJournal() };
let hydrated = false;
let baseRaw: string | null = null;

function emptyJournal(): JournalSnapshot {
  return Object.freeze({
    identity: canonicalMutationJournalIdentity,
    schemaVersion: CANONICAL_MUTATION_JOURNAL_SCHEMA,
    operations: Object.freeze([]),
  });
}

function storage(): Storage | null {
  if (storageOverride !== undefined) return storageOverride;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function parseOperation(value: unknown): CanonicalMutationOperation | null {
  if (!isRecord(value)) return null;
  if (typeof value.operationId !== "string" || value.operationId.length === 0) return null;
  if (value.kind !== "archive-object" && value.kind !== "delete-object" && value.kind !== "detach-dataset" && value.kind !== "link-source") return null;
  if (value.sourceKey != null && typeof value.sourceKey !== "string") return null;
  if (typeof value.workspaceId !== "string") return null;
  if (value.canonicalObjectId != null && typeof value.canonicalObjectId !== "string") return null;
  if (value.datasetId != null && typeof value.datasetId !== "string") return null;
  if (!Array.isArray(value.relationshipIds) || value.relationshipIds.some((id) => typeof id !== "string")) return null;
  if (
    value.status !== "PREPARED" &&
    value.status !== "APPLYING" &&
    value.status !== "COMMITTED" &&
    value.status !== "RECOVERY_REQUIRED" &&
    value.status !== "RECOVERED"
  ) return null;
  return Object.freeze({
    operationId: value.operationId,
    kind: value.kind,
    workspaceId: value.workspaceId,
    canonicalObjectId: typeof value.canonicalObjectId === "string" ? value.canonicalObjectId : null,
    datasetId: typeof value.datasetId === "string" ? value.datasetId : null,
    sourceKey: typeof value.sourceKey === "string" ? value.sourceKey : null,
    relationshipIds: Object.freeze([...value.relationshipIds]),
    status: value.status,
  });
}

function parseJournal(raw: string): JournalState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "corrupt" };
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.operations)) return { status: "corrupt" };
  if (parsed.identity !== canonicalMutationJournalIdentity) return { status: "corrupt" };
  if (parsed.schemaVersion !== CANONICAL_MUTATION_JOURNAL_SCHEMA) return { status: "unsupported-version" };
  const operations: CanonicalMutationOperation[] = [];
  const seen = new Set<string>();
  for (const entry of parsed.operations) {
    const operation = parseOperation(entry);
    if (!operation || seen.has(operation.operationId)) return { status: "corrupt" };
    seen.add(operation.operationId);
    operations.push(operation);
  }
  return {
    status: operations.length === 0 ? "empty" : "ready",
    snapshot: Object.freeze({
      identity: canonicalMutationJournalIdentity,
      schemaVersion: CANONICAL_MUTATION_JOURNAL_SCHEMA,
      operations: Object.freeze(operations),
    }),
  };
}

function hydrate(): void {
  if (hydrated) return;
  hydrated = true;
  const current = storage();
  const raw = current?.getItem(CANONICAL_MUTATION_JOURNAL_KEY) ?? null;
  baseRaw = raw;
  if (raw == null) {
    state = { status: "empty", snapshot: emptyJournal() };
    return;
  }
  state = parseJournal(raw);
}

function persist(next: JournalSnapshot): "storage-failed" | "corrupt" | "unsupported-version" | "revision-conflict" | null {
  const current = storage();
  const raw = current?.getItem(CANONICAL_MUTATION_JOURNAL_KEY) ?? null;
  if (current && raw !== baseRaw) {
    hydrated = false;
    hydrate();
    return "revision-conflict";
  }
  if (!current) return "storage-failed";
  const encoded = JSON.stringify(next);
  try {
    current.setItem(CANONICAL_MUTATION_JOURNAL_KEY, encoded);
    if (current.getItem(CANONICAL_MUTATION_JOURNAL_KEY) !== encoded) return "storage-failed";
  } catch {
    return "storage-failed";
  }
  baseRaw = encoded;
  state = { status: next.operations.length === 0 ? "empty" : "ready", snapshot: next };
  return null;
}

export function canonicalMutationJournalStatus(): JournalState["status"] {
  hydrate();
  return state.status;
}

export function listCanonicalMutations(): readonly CanonicalMutationOperation[] {
  hydrate();
  if (state.status !== "ready" && state.status !== "empty") return Object.freeze([]);
  return state.snapshot.operations;
}

function reloadJournal(): "corrupt" | "unsupported-version" | null {
  const raw = storage()?.getItem(CANONICAL_MUTATION_JOURNAL_KEY) ?? null;
  if (hydrated && raw === baseRaw) return null;
  hydrated = false;
  baseRaw = null;
  hydrate();
  baseRaw = raw;
  if (state.status === "corrupt" || state.status === "unsupported-version") return state.status;
  return null;
}

export function prepareCanonicalMutation(operation: CanonicalMutationOperation): "ok" | "corrupt" | "unsupported-version" | "storage-failed" | "duplicate" | "revision-conflict" | "coordination-required" | "coordination-unavailable" | "invalid-workspace" {
  const gate = requireWorkspaceMutationCoordination();
  if (gate) return gate;
  const reloaded = reloadJournal();
  if (reloaded) return reloaded;
  if (state.status !== "ready" && state.status !== "empty") return "corrupt";
  if (!evaluateWorkspaceAuthority(operation.workspaceId).ok) return "invalid-workspace";
  if (state.snapshot.operations.some((entry) => entry.operationId === operation.operationId)) return "duplicate";
  const failure = persist(Object.freeze({
    ...state.snapshot,
    operations: Object.freeze([...state.snapshot.operations, operation]),
  }));
  if (failure === "revision-conflict") {
    const again = reloadJournal();
    if (again) return again;
    if (state.status !== "ready" && state.status !== "empty") return "corrupt";
    if (state.snapshot.operations.some((entry) => entry.operationId === operation.operationId)) return "duplicate";
    const retry = persist(Object.freeze({
      ...state.snapshot,
      operations: Object.freeze([...state.snapshot.operations, operation]),
    }));
    return retry ?? "ok";
  }
  return failure ?? "ok";
}

export function updateCanonicalMutation(
  operationId: string,
  status: CanonicalMutationStatus,
): "ok" | "missing" | "corrupt" | "unsupported-version" | "storage-failed" | "revision-conflict" | "coordination-required" | "coordination-unavailable" {
  const gate = requireWorkspaceMutationCoordination();
  if (gate) return gate;
  const reloaded = reloadJournal();
  if (reloaded) return reloaded;
  if (state.status !== "ready" && state.status !== "empty") return "corrupt";
  if (!state.snapshot.operations.some((entry) => entry.operationId === operationId)) return "missing";
  const failure = persist(Object.freeze({
    ...state.snapshot,
    operations: Object.freeze(state.snapshot.operations.map((entry) =>
      entry.operationId === operationId ? Object.freeze({ ...entry, status }) : entry)),
  }));
  return failure ?? "ok";
}

export function forgetWorkspaceCanonicalMutations(
  workspaceId: string,
): "ok" | "corrupt" | "unsupported-version" | "storage-failed" | "revision-conflict" | "coordination-required" | "coordination-unavailable" {
  const gate = requireWorkspaceMutationCoordination();
  if (gate) return gate;
  const reloaded = reloadJournal();
  if (reloaded) return reloaded;
  if (state.status !== "ready" && state.status !== "empty") return "corrupt";
  const operations = state.snapshot.operations.filter((entry) => entry.workspaceId !== workspaceId);
  if (operations.length === state.snapshot.operations.length) return "ok";
  const failure = persist(Object.freeze({
    ...state.snapshot,
    operations: Object.freeze(operations),
  }));
  return failure ?? "ok";
}

export function resetCanonicalMutationJournalForTests(nextStorage?: Storage | null): void {
  storageOverride = nextStorage === undefined ? undefined : nextStorage;
  state = { status: "empty", snapshot: emptyJournal() };
  hydrated = false;
  baseRaw = null;
}
