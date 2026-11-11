/**
 * NPA-T CANONICAL-RELATIONSHIP-GRAPH:1
 *
 * One Workspace-owned relationship authority.
 * Decks project authorized endpoints. Saved Scenes do not own these records.
 * Layout geometry, filenames, and topology templates do not create edges.
 */

import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination, retainAuthorizedWorkspaceBuckets } from "../workspace/workspaceAuthorityFence.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { canonicalTopologySupport } from "./canonicalTopologyEngine.ts";

export const canonicalRelationshipGraphIdentity =
  "NPA-T CANONICAL-RELATIONSHIP-GRAPH:1/WorkspaceCanonicalRelationshipGraph" as const;

export const CANONICAL_RELATIONSHIP_STORAGE_KEY = "nexora.canonical-relationships.v1" as const;
export const CANONICAL_RELATIONSHIP_SCHEMA_VERSION = 1 as const;

export const CANONICAL_RELATIONSHIP_TYPES = Object.freeze([
  "DEPENDS_ON",
  "REPORTS_TO",
  "SUPPLIES_TO",
  "MONITORS",
  "CONTAINS",
  "ASSOCIATED_WITH",
] as const);

export type CanonicalRelationshipType = (typeof CANONICAL_RELATIONSHIP_TYPES)[number];

export type CanonicalRelationshipDirection = "DIRECTED" | "UNDIRECTED";

export type CanonicalRelationshipOrigin =
  | "MANAGER_DECLARED"
  | "VERIFIED_IMPORT"
  | "SYSTEM_DERIVED";

export type CanonicalRelationshipStatus = "ACTIVE" | "ARCHIVED";

export type CanonicalRelationship = Readonly<{
  relationshipId: string;
  workspaceId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: CanonicalRelationshipType;
  direction: CanonicalRelationshipDirection;
  provenance: Readonly<{
    origin: CanonicalRelationshipOrigin;
    sourceReference?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  status: CanonicalRelationshipStatus;
}>;

export type CanonicalRelationshipSemantics = Readonly<{
  relationshipType: CanonicalRelationshipType;
  direction: CanonicalRelationshipDirection;
  selfLink: false;
  cycles: "allowed" | "forbidden";
  sameTypeDuplicates: false;
  differentTypeDuplicates: true;
  inverseStored: false;
  causal: false;
}>;

export const CANONICAL_RELATIONSHIP_SEMANTICS: Readonly<Record<CanonicalRelationshipType, CanonicalRelationshipSemantics>> = Object.freeze({
  DEPENDS_ON: Object.freeze({ relationshipType: "DEPENDS_ON" as const, direction: "DIRECTED" as const, selfLink: false as const, cycles: "allowed" as const, sameTypeDuplicates: false as const, differentTypeDuplicates: true as const, inverseStored: false as const, causal: false as const }),
  REPORTS_TO: Object.freeze({ relationshipType: "REPORTS_TO" as const, direction: "DIRECTED" as const, selfLink: false as const, cycles: "forbidden" as const, sameTypeDuplicates: false as const, differentTypeDuplicates: true as const, inverseStored: false as const, causal: false as const }),
  SUPPLIES_TO: Object.freeze({ relationshipType: "SUPPLIES_TO" as const, direction: "DIRECTED" as const, selfLink: false as const, cycles: "allowed" as const, sameTypeDuplicates: false as const, differentTypeDuplicates: true as const, inverseStored: false as const, causal: false as const }),
  MONITORS: Object.freeze({ relationshipType: "MONITORS" as const, direction: "DIRECTED" as const, selfLink: false as const, cycles: "allowed" as const, sameTypeDuplicates: false as const, differentTypeDuplicates: true as const, inverseStored: false as const, causal: false as const }),
  CONTAINS: Object.freeze({ relationshipType: "CONTAINS" as const, direction: "DIRECTED" as const, selfLink: false as const, cycles: "forbidden" as const, sameTypeDuplicates: false as const, differentTypeDuplicates: true as const, inverseStored: false as const, causal: false as const }),
  ASSOCIATED_WITH: Object.freeze({ relationshipType: "ASSOCIATED_WITH" as const, direction: "UNDIRECTED" as const, selfLink: false as const, cycles: "allowed" as const, sameTypeDuplicates: false as const, differentTypeDuplicates: true as const, inverseStored: false as const, causal: false as const }),
});

/**
 * Dataset deletion archives every relationship that names the removed object.
 * The record stays as history. Active projections omit it. Unrelated edges stay.
 */
export const CANONICAL_RELATIONSHIP_DELETION_POLICY = "archive-affected-edges" as const;

export type CanonicalRelationshipFailure =
  | "storage-unavailable"
  | "storage-failed"
  | "corrupt"
  | "unsupported-version"
  | "invalid-workspace"
  | "revision-conflict"
  | "invalid-endpoint"
  | "cross-workspace"
  | "self-link"
  | "duplicate"
  | "cycle"
  | "invalid-type"
  | "protected-workspace"
  | "missing";

export type CanonicalRelationshipResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; reason: CanonicalRelationshipFailure }>;

type WorkspaceBucket = Readonly<{ relationships: readonly CanonicalRelationship[] }>;

type GraphSnapshot = Readonly<{
  identity: typeof canonicalRelationshipGraphIdentity;
  schemaVersion: typeof CANONICAL_RELATIONSHIP_SCHEMA_VERSION;
  workspaces: Readonly<Record<string, WorkspaceBucket>>;
}>;

type AuthorityState =
  | Readonly<{ status: "ready" | "empty"; snapshot: GraphSnapshot }>
  | Readonly<{ status: "corrupt" | "unsupported-version" }>;

type Listener = () => void;

const listeners = new Set<Listener>();
let revision = 0;
let storageOverride: Storage | null | undefined;
let authority: AuthorityState = { status: "empty", snapshot: emptySnapshot() };
let hydrated = false;
let baseRaw: string | null = null;

function emptySnapshot(): GraphSnapshot {
  return Object.freeze({
    identity: canonicalRelationshipGraphIdentity,
    schemaVersion: CANONICAL_RELATIONSHIP_SCHEMA_VERSION,
    workspaces: Object.freeze({}),
  });
}

function nowIso(): string {
  return new Date().toISOString();
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

function emit(): void {
  revision += 1;
  for (const listener of listeners) listener();
}

export function canonicalRelationshipRevision(): number {
  hydrate();
  return revision;
}

export function canonicalDataObjectId(workspaceId: string, sourceContextId: string): string {
  return `data-source:${encodeURIComponent(workspaceId)}:${encodeURIComponent(sourceContextId)}`;
}

function endpointOwnedBy(workspaceId: string, objectId: string): boolean {
  const encoded = `${encodeURIComponent(workspaceId)}:`;
  return objectId.startsWith(`data-source:${encoded}`) || objectId.startsWith(`org:${encoded}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function parseRelationship(value: unknown, workspaceId: string): CanonicalRelationship | null {
  if (!isRecord(value)) return null;
  if (typeof value.relationshipId !== "string" || value.relationshipId.trim().length === 0) return null;
  if (value.workspaceId !== workspaceId) return null;
  if (typeof value.sourceObjectId !== "string" || typeof value.targetObjectId !== "string") return null;
  if (!CANONICAL_RELATIONSHIP_TYPES.includes(value.relationshipType as CanonicalRelationshipType)) return null;
  const semantics = CANONICAL_RELATIONSHIP_SEMANTICS[value.relationshipType as CanonicalRelationshipType];
  if (value.direction !== semantics.direction) return null;
  if (value.status !== "ACTIVE" && value.status !== "ARCHIVED") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  if (!isRecord(value.provenance)) return null;
  if (
    value.provenance.origin !== "MANAGER_DECLARED" &&
    value.provenance.origin !== "VERIFIED_IMPORT" &&
    value.provenance.origin !== "SYSTEM_DERIVED"
  ) return null;
  if (value.provenance.sourceReference != null && typeof value.provenance.sourceReference !== "string") return null;
  return Object.freeze({
    relationshipId: value.relationshipId,
    workspaceId,
    sourceObjectId: value.sourceObjectId,
    targetObjectId: value.targetObjectId,
    relationshipType: value.relationshipType as CanonicalRelationshipType,
    direction: semantics.direction,
    provenance: Object.freeze({
      origin: value.provenance.origin,
      ...(typeof value.provenance.sourceReference === "string"
        ? { sourceReference: value.provenance.sourceReference }
        : {}),
    }),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    status: value.status,
  });
}

function parseSnapshot(raw: string): AuthorityState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "corrupt" };
  }
  if (!isRecord(parsed)) return { status: "corrupt" };
  if (parsed.identity !== canonicalRelationshipGraphIdentity) return { status: "corrupt" };
  if (parsed.schemaVersion !== CANONICAL_RELATIONSHIP_SCHEMA_VERSION) {
    return { status: "unsupported-version" };
  }
  if (!isRecord(parsed.workspaces)) return { status: "corrupt" };
  const workspaces: Record<string, WorkspaceBucket> = {};
  const seen = new Set<string>();
  for (const [workspaceId, bucket] of Object.entries(parsed.workspaces)) {
    if (!isRecord(bucket) || !Array.isArray(bucket.relationships)) return { status: "corrupt" };
    const relationships: CanonicalRelationship[] = [];
    for (const entry of bucket.relationships) {
      const relationship = parseRelationship(entry, workspaceId);
      if (!relationship || seen.has(relationship.relationshipId)) return { status: "corrupt" };
      seen.add(relationship.relationshipId);
      relationships.push(relationship);
    }
    workspaces[workspaceId] = Object.freeze({ relationships: Object.freeze(relationships) });
  }
  return {
    status: Object.keys(workspaces).length === 0 ? "empty" : "ready",
    snapshot: Object.freeze({
      identity: canonicalRelationshipGraphIdentity,
      schemaVersion: CANONICAL_RELATIONSHIP_SCHEMA_VERSION,
      workspaces: Object.freeze(workspaces),
    }),
  };
}

function hydrate(): void {
  if (hydrated) return;
  hydrated = true;
  const current = storage();
  if (!current) return;
  let raw: string | null = null;
  try {
    raw = current.getItem(CANONICAL_RELATIONSHIP_STORAGE_KEY);
  } catch {
    authority = { status: "corrupt" };
    return;
  }
  baseRaw = raw;
  if (raw == null) {
    authority = { status: "empty", snapshot: emptySnapshot() };
    return;
  }
  authority = parseSnapshot(raw);
}

function persist(next: GraphSnapshot): CanonicalRelationshipFailure | null {
  const current = storage();
  if (!current) return "storage-unavailable";
  const encoded = JSON.stringify(next);
  try {
    current.setItem(CANONICAL_RELATIONSHIP_STORAGE_KEY, encoded);
    if (current.getItem(CANONICAL_RELATIONSHIP_STORAGE_KEY) !== encoded) return "storage-failed";
  } catch {
    return "storage-failed";
  }
  return null;
}

function storedWorkspaceBuckets(): Readonly<Record<string, WorkspaceBucket>> {
  const current = storage();
  if (!current) return authority.status === "ready" || authority.status === "empty" ? authority.snapshot.workspaces : {};
  let raw: string | null = null;
  try {
    raw = current.getItem(CANONICAL_RELATIONSHIP_STORAGE_KEY);
  } catch {
    return {};
  }
  if (raw == null) return {};
  const parsed = parseSnapshot(raw);
  return parsed.status === "ready" || parsed.status === "empty" ? parsed.snapshot.workspaces : {};
}

function workspaceAuthorityFailure(workspaceId: string): CanonicalRelationshipFailure | null {
  if (workspaceId.trim().length === 0) return "invalid-workspace";
  if (isProtectedDemoWorkspaceId(workspaceId)) return "protected-workspace";
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return "invalid-workspace";
  return null;
}

function commit(next: GraphSnapshot): CanonicalRelationshipFailure | null {
  if (requireWorkspaceMutationCoordination()) return "invalid-workspace";
  hydrate();
  if (authority.status === "corrupt" || authority.status === "unsupported-version") {
    return authority.status === "corrupt" ? "corrupt" : "unsupported-version";
  }
  const fenced = retainAuthorizedWorkspaceBuckets(storedWorkspaceBuckets(), next.workspaces);
  if (!fenced.ok) return "invalid-workspace";
  const fencedSnapshot = Object.freeze({ ...next, workspaces: Object.freeze(fenced.workspaces) });
  const current = storage();
  let raw: string | null = null;
  try {
    raw = current?.getItem(CANONICAL_RELATIONSHIP_STORAGE_KEY) ?? null;
  } catch {
    return "storage-failed";
  }
  if (current && raw !== baseRaw) {
    hydrated = false;
    hydrate();
    return "revision-conflict";
  }
  const failure = persist(fencedSnapshot);
  if (failure) return failure;
  authority = {
    status: Object.keys(fencedSnapshot.workspaces).length === 0 ? "empty" : "ready",
    snapshot: fencedSnapshot,
  };
  baseRaw = JSON.stringify(fencedSnapshot);
  emit();
  return null;
}

function bucket(workspaceId: string): readonly CanonicalRelationship[] {
  hydrate();
  if (authority.status !== "ready" && authority.status !== "empty") return Object.freeze([]);
  return authority.snapshot.workspaces[workspaceId]?.relationships ?? Object.freeze([]);
}

function replaceWorkspace(
  workspaceId: string,
  relationships: readonly CanonicalRelationship[],
): GraphSnapshot {
  hydrate();
  const current = authority.status === "ready" || authority.status === "empty"
    ? authority.snapshot.workspaces
    : {};
  const workspaces = { ...current };
  if (relationships.length === 0) delete workspaces[workspaceId];
  else workspaces[workspaceId] = Object.freeze({ relationships: Object.freeze(relationships) });
  return Object.freeze({
    identity: canonicalRelationshipGraphIdentity,
    schemaVersion: CANONICAL_RELATIONSHIP_SCHEMA_VERSION,
    workspaces: Object.freeze(workspaces),
  });
}

function orderedEndpoints(
  type: CanonicalRelationshipType,
  sourceObjectId: string,
  targetObjectId: string,
): { sourceObjectId: string; targetObjectId: string } {
  if (CANONICAL_RELATIONSHIP_SEMANTICS[type].direction === "DIRECTED") {
    return { sourceObjectId, targetObjectId };
  }
  return sourceObjectId <= targetObjectId
    ? { sourceObjectId, targetObjectId }
    : { sourceObjectId: targetObjectId, targetObjectId: sourceObjectId };
}

function introducesCycle(
  relationships: readonly CanonicalRelationship[],
  type: CanonicalRelationshipType,
  sourceObjectId: string,
  targetObjectId: string,
  ignoreId?: string,
): boolean {
  if (CANONICAL_RELATIONSHIP_SEMANTICS[type].cycles === "allowed") return false;
  const outgoing = new Map<string, string[]>();
  for (const relationship of relationships) {
    if (relationship.status !== "ACTIVE" || relationship.relationshipType !== type) continue;
    if (relationship.relationshipId === ignoreId) continue;
    const next = outgoing.get(relationship.sourceObjectId) ?? [];
    next.push(relationship.targetObjectId);
    outgoing.set(relationship.sourceObjectId, next);
  }
  const seen = new Set<string>();
  const stack = [targetObjectId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === sourceObjectId) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    stack.push(...(outgoing.get(current) ?? []));
  }
  return false;
}

function nextRelationshipId(workspaceId: string, relationships: readonly CanonicalRelationship[]): string {
  const prefix = `cr:${workspaceId}:`;
  let max = 0;
  for (const relationship of relationships) {
    if (!relationship.relationshipId.startsWith(prefix)) continue;
    const value = Number(relationship.relationshipId.slice(prefix.length));
    if (Number.isInteger(value)) max = Math.max(max, value);
  }
  return `${prefix}${max + 1}`;
}

export function subscribeCanonicalRelationships(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function canonicalRelationshipAuthorityStatus(): "ready" | "empty" | "corrupt" | "unsupported-version" {
  hydrate();
  return authority.status;
}

export function listCanonicalRelationships(workspaceId: string): readonly CanonicalRelationship[] {
  if (authorityBlocked()) return Object.freeze([]);
  return bucket(workspaceId);
}

function authorityBlocked(): boolean {
  hydrate();
  return authority.status === "corrupt" || authority.status === "unsupported-version";
}

export function declareCanonicalRelationship(input: {
  readonly workspaceId: string;
  readonly sourceObjectId: string;
  readonly targetObjectId: string;
  readonly relationshipType: CanonicalRelationshipType;
  readonly knownObjectIds: readonly string[];
  readonly provenance?: CanonicalRelationship["provenance"];
  readonly now?: string;
}): CanonicalRelationshipResult<CanonicalRelationship> {
  hydrate();
  if (authority.status === "corrupt") return { ok: false, reason: "corrupt" };
  if (authority.status === "unsupported-version") return { ok: false, reason: "unsupported-version" };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAuthorityFailure(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  if (!CANONICAL_RELATIONSHIP_TYPES.includes(input.relationshipType)) {
    return { ok: false, reason: "invalid-type" };
  }
  const endpoints = orderedEndpoints(input.relationshipType, input.sourceObjectId, input.targetObjectId);
  if (endpoints.sourceObjectId === endpoints.targetObjectId) return { ok: false, reason: "self-link" };
  if (!endpointOwnedBy(workspaceId, endpoints.sourceObjectId) || !endpointOwnedBy(workspaceId, endpoints.targetObjectId)) {
    return { ok: false, reason: "cross-workspace" };
  }
  const known = new Set(input.knownObjectIds);
  if (!known.has(endpoints.sourceObjectId) || !known.has(endpoints.targetObjectId)) {
    return { ok: false, reason: "invalid-endpoint" };
  }
  const current = bucket(workspaceId);
  if (current.some((relationship) =>
    relationship.sourceObjectId === endpoints.sourceObjectId &&
    relationship.targetObjectId === endpoints.targetObjectId &&
    relationship.relationshipType === input.relationshipType
  )) {
    return { ok: false, reason: "duplicate" };
  }
  if (introducesCycle(current, input.relationshipType, endpoints.sourceObjectId, endpoints.targetObjectId)) {
    return { ok: false, reason: "cycle" };
  }
  const timestamp = input.now ?? nowIso();
  const created = Object.freeze({
    relationshipId: nextRelationshipId(workspaceId, current),
    workspaceId,
    sourceObjectId: endpoints.sourceObjectId,
    targetObjectId: endpoints.targetObjectId,
    relationshipType: input.relationshipType,
    direction: CANONICAL_RELATIONSHIP_SEMANTICS[input.relationshipType].direction,
    provenance: Object.freeze(input.provenance ?? { origin: "MANAGER_DECLARED" as const }),
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "ACTIVE" as const,
  });
  const failure = commit(replaceWorkspace(workspaceId, Object.freeze([...current, created])));
  if (failure) return { ok: false, reason: failure };
  return { ok: true, value: created };
}

export function editCanonicalRelationshipType(input: {
  readonly workspaceId: string;
  readonly relationshipId: string;
  readonly relationshipType: CanonicalRelationshipType;
  readonly now?: string;
}): CanonicalRelationshipResult<CanonicalRelationship> {
  hydrate();
  if (authorityBlocked()) return { ok: false, reason: authority.status === "corrupt" ? "corrupt" : "unsupported-version" };
  const rejected = workspaceAuthorityFailure(input.workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = [...bucket(input.workspaceId)];
  const index = current.findIndex((relationship) => relationship.relationshipId === input.relationshipId);
  const existing = current[index];
  if (!existing) return { ok: false, reason: "missing" };
  const endpoints = orderedEndpoints(input.relationshipType, existing.sourceObjectId, existing.targetObjectId);
  if (endpoints.sourceObjectId === endpoints.targetObjectId) return { ok: false, reason: "self-link" };
  if (current.some((relationship, relationshipIndex) =>
    relationshipIndex !== index &&
    relationship.sourceObjectId === endpoints.sourceObjectId &&
    relationship.targetObjectId === endpoints.targetObjectId &&
    relationship.relationshipType === input.relationshipType
  )) {
    return { ok: false, reason: "duplicate" };
  }
  if (introducesCycle(current, input.relationshipType, endpoints.sourceObjectId, endpoints.targetObjectId, existing.relationshipId)) {
    return { ok: false, reason: "cycle" };
  }
  const updated = Object.freeze({
    ...existing,
    ...endpoints,
    relationshipType: input.relationshipType,
    direction: CANONICAL_RELATIONSHIP_SEMANTICS[input.relationshipType].direction,
    updatedAt: input.now ?? nowIso(),
  });
  current[index] = updated;
  const failure = commit(replaceWorkspace(input.workspaceId, current));
  if (failure) return { ok: false, reason: failure };
  return { ok: true, value: updated };
}

function setStatus(
  workspaceId: string,
  relationshipId: string,
  status: CanonicalRelationshipStatus,
  now?: string,
): CanonicalRelationshipResult<CanonicalRelationship> {
  hydrate();
  if (authorityBlocked()) return { ok: false, reason: authority.status === "corrupt" ? "corrupt" : "unsupported-version" };
  const rejected = workspaceAuthorityFailure(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = [...bucket(workspaceId)];
  const index = current.findIndex((relationship) => relationship.relationshipId === relationshipId);
  const existing = current[index];
  if (!existing) return { ok: false, reason: "missing" };
  if (status === "ACTIVE" && introducesCycle(current, existing.relationshipType, existing.sourceObjectId, existing.targetObjectId, existing.relationshipId)) {
    return { ok: false, reason: "cycle" };
  }
  const updated = Object.freeze({ ...existing, status, updatedAt: now ?? nowIso() });
  current[index] = updated;
  const failure = commit(replaceWorkspace(workspaceId, current));
  if (failure) return { ok: false, reason: failure };
  return { ok: true, value: updated };
}

export function archiveCanonicalRelationship(workspaceId: string, relationshipId: string, now?: string) {
  return setStatus(workspaceId, relationshipId, "ARCHIVED", now);
}

export function restoreCanonicalRelationship(workspaceId: string, relationshipId: string, now?: string) {
  return setStatus(workspaceId, relationshipId, "ACTIVE", now);
}

export function deleteCanonicalRelationship(workspaceId: string, relationshipId: string): CanonicalRelationshipResult<null> {
  hydrate();
  if (authorityBlocked()) return { ok: false, reason: authority.status === "corrupt" ? "corrupt" : "unsupported-version" };
  const rejected = workspaceAuthorityFailure(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  if (!current.some((relationship) => relationship.relationshipId === relationshipId)) {
    return { ok: false, reason: "missing" };
  }
  const failure = commit(replaceWorkspace(
    workspaceId,
    current.filter((relationship) => relationship.relationshipId !== relationshipId),
  ));
  if (failure) return { ok: false, reason: failure };
  return { ok: true, value: null };
}

export function archiveCanonicalRelationshipsById(
  workspaceId: string,
  relationshipIds: readonly string[],
  now?: string,
): CanonicalRelationshipResult<number> {
  hydrate();
  if (authorityBlocked()) return { ok: false, reason: authority.status === "corrupt" ? "corrupt" : "unsupported-version" };
  const wanted = new Set(relationshipIds);
  const timestamp = now ?? nowIso();
  let count = 0;
  const next = bucket(workspaceId).map((relationship) => {
    if (!wanted.has(relationship.relationshipId) || relationship.status !== "ACTIVE") return relationship;
    count += 1;
    return Object.freeze({ ...relationship, status: "ARCHIVED" as const, updatedAt: timestamp });
  });
  if (count === 0) return { ok: true, value: 0 };
  const failure = commit(replaceWorkspace(workspaceId, next));
  if (failure) return { ok: false, reason: failure };
  return { ok: true, value: count };
}

export function archiveRelationshipsForRemovedObject(workspaceId: string, objectId: string, now?: string): CanonicalRelationshipResult<number> {
  hydrate();
  if (authorityBlocked()) return { ok: false, reason: authority.status === "corrupt" ? "corrupt" : "unsupported-version" };
  const timestamp = now ?? nowIso();
  const current = bucket(workspaceId);
  let count = 0;
  const next = current.map((relationship) => {
    if (relationship.status !== "ACTIVE") return relationship;
    if (relationship.sourceObjectId !== objectId && relationship.targetObjectId !== objectId) return relationship;
    count += 1;
    return Object.freeze({ ...relationship, status: "ARCHIVED" as const, updatedAt: timestamp });
  });
  if (count === 0) return { ok: true, value: 0 };
  const failure = commit(replaceWorkspace(workspaceId, next));
  if (failure) return { ok: false, reason: failure };
  return { ok: true, value: count };
}

export function forgetWorkspaceCanonicalRelationships(workspaceId: string): CanonicalRelationshipResult<null> {
  hydrate();
  if (authorityBlocked()) return { ok: false, reason: authority.status === "corrupt" ? "corrupt" : "unsupported-version" };
  if (!bucket(workspaceId).length) return { ok: true, value: null };
  const failure = commit(replaceWorkspace(workspaceId, []));
  if (failure) return { ok: false, reason: failure };
  return { ok: true, value: null };
}

export type DeckRelationshipGraph = Readonly<{
  workspaceId: string;
  deckId: string;
  authorityStatus: "ready" | "empty" | "corrupt" | "unsupported-version";
  relationships: readonly CanonicalRelationship[];
  hiddenRelationshipIds: readonly string[];
  archivedRelationshipIds: readonly string[];
}>;

export function resolveDeckRelationshipGraph(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly authorizedObjectIds: readonly string[];
}): DeckRelationshipGraph {
  hydrate();
  if (authority.status === "corrupt" || authority.status === "unsupported-version") {
    return Object.freeze({
      workspaceId: input.workspaceId,
      deckId: input.deckId,
      authorityStatus: authority.status,
      relationships: Object.freeze([]),
      hiddenRelationshipIds: Object.freeze([]),
      archivedRelationshipIds: Object.freeze([]),
    });
  }
  const authorized = new Set(input.authorizedObjectIds);
  const relationships: CanonicalRelationship[] = [];
  const hidden: string[] = [];
  const archived: string[] = [];
  for (const relationship of bucket(input.workspaceId)) {
    if (relationship.status !== "ACTIVE") {
      archived.push(relationship.relationshipId);
      continue;
    }
    if (!authorized.has(relationship.sourceObjectId) || !authorized.has(relationship.targetObjectId)) {
      hidden.push(relationship.relationshipId);
      continue;
    }
    relationships.push(relationship);
  }
  const storedCount = bucket(input.workspaceId).length;
  return Object.freeze({
    workspaceId: input.workspaceId,
    deckId: input.deckId,
    authorityStatus: storedCount > 0 ? "ready" as const : authority.status,
    relationships: Object.freeze(relationships),
    hiddenRelationshipIds: Object.freeze(hidden),
    archivedRelationshipIds: Object.freeze(archived),
  });
}

/** Topology recognition reads this graph and does not create a second one. */
export function assessCanonicalTopologySupport(): ReturnType<typeof canonicalTopologySupport> {
  return canonicalTopologySupport();
}

export function readCanonicalRelationshipGraph(workspaceId: string): Readonly<{
  workspaceId: string;
  authorityStatus: ReturnType<typeof canonicalRelationshipAuthorityStatus>;
  relationships: readonly CanonicalRelationship[];
  causalClaims: false;
  simulation: false;
}> {
  return Object.freeze({
    workspaceId,
    authorityStatus: canonicalRelationshipAuthorityStatus(),
    relationships: listCanonicalRelationships(workspaceId),
    causalClaims: false as const,
    simulation: false as const,
  });
}

export function resetCanonicalRelationshipsForTests(nextStorage?: Storage | null): void {
  storageOverride = nextStorage === undefined ? undefined : nextStorage;
  authority = { status: "empty", snapshot: emptySnapshot() };
  hydrated = false;
  baseRaw = null;
}
