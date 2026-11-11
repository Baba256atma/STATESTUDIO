/**
 * NPA-T CANONICAL-OBJECT-MODEL:1
 *
 * Workspace-owned identity for organizational entities.
 * A Dataset remains a DATA_OBJECT through the existing source identity.
 * This registry does not copy Dataset rows and does not create relationships.
 *
 * Lookup is a single pass over the Workspace bucket. Five hundred records stay
 * in the registry. Stage and topology rendering keep their existing limits.
 */

import type { NexoraDecisionTheatreDataObject } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";
import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination } from "../workspace/workspaceAuthorityFence.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { workspaceMutationsBlocked } from "../workspace/workspaceDeletionGuard.ts";
import {
  archiveCanonicalRelationshipsById,
  listCanonicalRelationships,
} from "./canonicalRelationshipGraph.ts";
import {
  prepareCanonicalMutation,
  updateCanonicalMutation,
  listCanonicalMutations,
  canonicalMutationJournalStatus,
} from "./canonicalMutationJournal.ts";

export const canonicalObjectRegistryIdentity =
  "NPA-T CANONICAL-OBJECT-MODEL:1/WorkspaceCanonicalObjectRegistry" as const;

export const CANONICAL_OBJECT_STORAGE_KEY = "nexora.canonical-objects.v1" as const;
export const CANONICAL_OBJECT_SCHEMA_VERSION = 1 as const;
export const CANONICAL_OBJECT_REGISTRY_LIMIT = 500 as const;

export const CANONICAL_OBJECT_TYPES = Object.freeze([
  "ORGANIZATION_UNIT",
  "MACHINE",
  "PERSON_ROLE",
  "ACTIVITY",
  "RESOURCE",
  "PROJECT",
  "PRODUCT",
] as const);

export type CanonicalObjectType = (typeof CANONICAL_OBJECT_TYPES)[number];

export type CanonicalObjectProvenance =
  | "MANAGER_CREATED"
  | "VERIFIED_DATASET_MAPPING"
  | "MANAGER_APPROVED_PROPOSAL";

export type CanonicalObjectLifecycle = "ACTIVE" | "ARCHIVED" | "DELETED";

export type CanonicalObjectReconciliation =
  | "NONE"
  | "CURRENT"
  | "MISSING_FROM_SOURCE"
  | "PENDING_REVIEW";

export type CanonicalOrganizationalObject = Readonly<{
  schemaVersion: typeof CANONICAL_OBJECT_SCHEMA_VERSION;
  workspaceId: string;
  canonicalObjectId: string;
  objectType: CanonicalObjectType;
  displayName: string;
  attributes: Readonly<Record<string, string | number | boolean>>;
  provenance: CanonicalObjectProvenance;
  lifecycleStatus: CanonicalObjectLifecycle;
  reconciliationStatus: CanonicalObjectReconciliation;
  deckIds: readonly string[];
  sourceLinks: readonly CanonicalObjectSourceLink[];
  createdAt: string;
  updatedAt: string;
}>;

export type CanonicalObjectSourceLink = Readonly<{
  datasetId: string;
  objectType: CanonicalObjectType;
  sourceKey: string;
}>;

export type CanonicalObjectProposal = Readonly<{
  proposalId: string;
  workspaceId: string;
  objectType: CanonicalObjectType;
  displayName: string;
  attributes: Readonly<Record<string, string | number | boolean>>;
  sourceLink: CanonicalObjectSourceLink | null;
  state: "PROPOSED" | "REJECTED";
  createdAt: string;
}>;

export type CanonicalObjectMapping = Readonly<{
  mappingId: string;
  workspaceId: string;
  datasetId: string;
  objectType: CanonicalObjectType;
  sourceKeyColumn: string;
  displayNameColumn: string;
  attributeColumns: Readonly<Record<string, string>>;
  approvalState: "DRAFT" | "APPROVED";
}>;

export type CanonicalObjectFailure =
  | "storage-unavailable"
  | "storage-failed"
  | "corrupt"
  | "unsupported-version"
  | "invalid-workspace"
  | "protected-workspace"
  | "invalid-type"
  | "invalid-name"
  | "invalid-attribute"
  | "duplicate"
  | "missing"
  | "limit"
  | "conflict"
  | "partial-failure"
  | "recovery-required"
  | "deletion-in-progress"
  | "workspace-revoked"
  | "revision-conflict"
  | "coordination-required"
  | "coordination-unavailable";

export type CanonicalObjectResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; reason: CanonicalObjectFailure }>;

const ATTRIBUTE_KEYS: Readonly<Record<CanonicalObjectType, readonly string[]>> = Object.freeze({
  ORGANIZATION_UNIT: Object.freeze(["unitCode", "status"]),
  MACHINE: Object.freeze(["machineCode", "capacityPerHour", "status"]),
  PERSON_ROLE: Object.freeze(["roleCode", "status"]),
  ACTIVITY: Object.freeze(["estimatedDurationMinutes", "requiredOperators"]),
  RESOURCE: Object.freeze(["resourceCode", "quantity"]),
  PROJECT: Object.freeze(["projectCode", "status"]),
  PRODUCT: Object.freeze(["productCode", "status"]),
});

type WorkspaceBucket = Readonly<{
  nextNumber: number;
  objects: readonly CanonicalOrganizationalObject[];
  proposals: readonly CanonicalObjectProposal[];
  mappings: readonly CanonicalObjectMapping[];
}>;

type RegistrySnapshot = Readonly<{
  identity: typeof canonicalObjectRegistryIdentity;
  schemaVersion: typeof CANONICAL_OBJECT_SCHEMA_VERSION;
  workspaces: Readonly<Record<string, WorkspaceBucket>>;
}>;

type AuthorityState =
  | Readonly<{ status: "ready" | "empty"; snapshot: RegistrySnapshot }>
  | Readonly<{ status: "corrupt" | "unsupported-version" }>;

type Listener = () => void;
const listeners = new Set<Listener>();
let revision = 0;
let storageOverride: Storage | null | undefined;
let authority: AuthorityState = { status: "empty", snapshot: emptySnapshot() };
let hydrated = false;
let baseRaw: string | null = null;

function emptySnapshot(): RegistrySnapshot {
  return Object.freeze({
    identity: canonicalObjectRegistryIdentity,
    schemaVersion: CANONICAL_OBJECT_SCHEMA_VERSION,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function canonicalObjectRevision(): number {
  hydrate();
  return revision;
}

export function subscribeCanonicalObjects(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function canonicalObjectAuthorityStatus(): "ready" | "empty" | "corrupt" | "unsupported-version" {
  hydrate();
  return authority.status;
}

export function canonicalObjectAttributeKeys(objectType: CanonicalObjectType): readonly string[] {
  return ATTRIBUTE_KEYS[objectType];
}

export function validateCanonicalObjectAttributes(
  objectType: CanonicalObjectType,
  value: unknown,
): CanonicalObjectResult<Readonly<Record<string, string | number | boolean>>> {
  if (!isRecord(value)) return { ok: false, reason: "invalid-attribute" };
  const allowed = new Set(ATTRIBUTE_KEYS[objectType]);
  const attributes: Record<string, string | number | boolean> = {};
  const entries = Object.entries(value);
  if (entries.length > allowed.size) return { ok: false, reason: "invalid-attribute" };
  for (const [key, entry] of entries) {
    if (!allowed.has(key)) return { ok: false, reason: "invalid-attribute" };
    if (typeof entry === "string") {
      if (entry.length > 120 || /[\u0000-\u001f]/.test(entry)) return { ok: false, reason: "invalid-attribute" };
      attributes[key] = entry;
    } else if (typeof entry === "number") {
      if (!Number.isFinite(entry)) return { ok: false, reason: "invalid-attribute" };
      attributes[key] = entry;
    } else if (typeof entry === "boolean") {
      attributes[key] = entry;
    } else {
      return { ok: false, reason: "invalid-attribute" };
    }
  }
  if (JSON.stringify(attributes).length > 2000) return { ok: false, reason: "invalid-attribute" };
  return { ok: true, value: Object.freeze(attributes) };
}

function validName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 80 && !/[\u0000-\u001f]/.test(value);
}

function workspaceAllowed(workspaceId: string): CanonicalObjectFailure | null {
  if (workspaceId.trim().length === 0) return "invalid-workspace";
  if (isProtectedDemoWorkspaceId(workspaceId)) return "protected-workspace";
  const verdict = evaluateWorkspaceAuthority(workspaceId);
  if (!verdict.ok) return verdict.reason;
  return null;
}

function parseLink(value: unknown): CanonicalObjectSourceLink | null {
  if (!isRecord(value)) return null;
  if (typeof value.datasetId !== "string" || typeof value.sourceKey !== "string") return null;
  if (!CANONICAL_OBJECT_TYPES.includes(value.objectType as CanonicalObjectType)) return null;
  if (value.sourceKey.trim().length === 0) return null;
  return Object.freeze({
    datasetId: value.datasetId,
    objectType: value.objectType as CanonicalObjectType,
    sourceKey: value.sourceKey,
  });
}

function parseObject(value: unknown, workspaceId: string): CanonicalOrganizationalObject | null {
  if (!isRecord(value)) return null;
  if (value.schemaVersion !== CANONICAL_OBJECT_SCHEMA_VERSION) return null;
  if (value.workspaceId !== workspaceId) return null;
  if (typeof value.canonicalObjectId !== "string" || !value.canonicalObjectId.startsWith(`org:${encodeURIComponent(workspaceId)}:`)) return null;
  if (!CANONICAL_OBJECT_TYPES.includes(value.objectType as CanonicalObjectType)) return null;
  if (!validName(value.displayName)) return null;
  const attributes = validateCanonicalObjectAttributes(value.objectType as CanonicalObjectType, value.attributes);
  if (!attributes.ok) return null;
  if (
    value.provenance !== "MANAGER_CREATED" &&
    value.provenance !== "VERIFIED_DATASET_MAPPING" &&
    value.provenance !== "MANAGER_APPROVED_PROPOSAL"
  ) return null;
  if (value.lifecycleStatus !== "ACTIVE" && value.lifecycleStatus !== "ARCHIVED" && value.lifecycleStatus !== "DELETED") return null;
  if (
    value.reconciliationStatus !== "NONE" &&
    value.reconciliationStatus !== "CURRENT" &&
    value.reconciliationStatus !== "MISSING_FROM_SOURCE" &&
    value.reconciliationStatus !== "PENDING_REVIEW"
  ) return null;
  if (!Array.isArray(value.deckIds) || value.deckIds.some((id) => typeof id !== "string")) return null;
  if (!Array.isArray(value.sourceLinks)) return null;
  const sourceLinks: CanonicalObjectSourceLink[] = [];
  for (const link of value.sourceLinks) {
    const parsed = parseLink(link);
    if (!parsed) return null;
    sourceLinks.push(parsed);
  }
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  return Object.freeze({
    schemaVersion: CANONICAL_OBJECT_SCHEMA_VERSION,
    workspaceId,
    canonicalObjectId: value.canonicalObjectId,
    objectType: value.objectType as CanonicalObjectType,
    displayName: value.displayName.trim(),
    attributes: attributes.value,
    provenance: value.provenance,
    lifecycleStatus: value.lifecycleStatus,
    reconciliationStatus: value.reconciliationStatus,
    deckIds: Object.freeze([...value.deckIds]),
    sourceLinks: Object.freeze(sourceLinks),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
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
  if (parsed.identity !== canonicalObjectRegistryIdentity) return { status: "corrupt" };
  if (parsed.schemaVersion !== CANONICAL_OBJECT_SCHEMA_VERSION) return { status: "unsupported-version" };
  if (!isRecord(parsed.workspaces)) return { status: "corrupt" };
  const workspaces: Record<string, WorkspaceBucket> = {};
  const seen = new Set<string>();
  for (const [workspaceId, bucket] of Object.entries(parsed.workspaces)) {
    if (!isRecord(bucket) || typeof bucket.nextNumber !== "number" || !Array.isArray(bucket.objects)) return { status: "corrupt" };
    const objects: CanonicalOrganizationalObject[] = [];
    for (const entry of bucket.objects) {
      const object = parseObject(entry, workspaceId);
      if (!object || seen.has(object.canonicalObjectId)) return { status: "corrupt" };
      seen.add(object.canonicalObjectId);
      objects.push(object);
    }
    const proposals: CanonicalObjectProposal[] = [];
    if (bucket.proposals != null && !Array.isArray(bucket.proposals)) return { status: "corrupt" };
    for (const entry of bucket.proposals ?? []) {
      if (!isRecord(entry) || entry.workspaceId !== workspaceId || typeof entry.proposalId !== "string") return { status: "corrupt" };
      if (!CANONICAL_OBJECT_TYPES.includes(entry.objectType as CanonicalObjectType) || !validName(entry.displayName)) return { status: "corrupt" };
      if (entry.state !== "PROPOSED" && entry.state !== "REJECTED") return { status: "corrupt" };
      const attributes = validateCanonicalObjectAttributes(entry.objectType as CanonicalObjectType, entry.attributes);
      if (!attributes.ok) return { status: "corrupt" };
      proposals.push(Object.freeze({
        proposalId: entry.proposalId,
        workspaceId,
        objectType: entry.objectType as CanonicalObjectType,
        displayName: entry.displayName.trim(),
        attributes: attributes.value,
        sourceLink: null,
        state: entry.state,
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : "",
      }));
    }
    workspaces[workspaceId] = Object.freeze({
      nextNumber: bucket.nextNumber,
      objects: Object.freeze(objects),
      proposals: Object.freeze(proposals),
      mappings: Object.freeze([]),
    });
  }
  return {
    status: Object.keys(workspaces).length === 0 ? "empty" : "ready",
    snapshot: Object.freeze({
      identity: canonicalObjectRegistryIdentity,
      schemaVersion: CANONICAL_OBJECT_SCHEMA_VERSION,
      workspaces: Object.freeze(workspaces),
    }),
  };
}

function refreshFromStorage(): void {
  const raw = storage()?.getItem(CANONICAL_OBJECT_STORAGE_KEY) ?? null;
  if (hydrated && raw === baseRaw) return;
  hydrated = false;
  hydrate();
}

function hydrate(): void {
  if (hydrated) return;
  hydrated = true;
  const current = storage();
  if (!current) {
    baseRaw = null;
    return;
  }
  const raw = current.getItem(CANONICAL_OBJECT_STORAGE_KEY);
  baseRaw = raw;
  if (raw == null) {
    authority = { status: "empty", snapshot: emptySnapshot() };
    return;
  }
  authority = parseSnapshot(raw);
}

function persist(next: RegistrySnapshot): CanonicalObjectFailure | null {
  const current = storage();
  if (!current) return "storage-unavailable";
  const encoded = JSON.stringify(next);
  try {
    current.setItem(CANONICAL_OBJECT_STORAGE_KEY, encoded);
    if (current.getItem(CANONICAL_OBJECT_STORAGE_KEY) !== encoded) return "storage-failed";
  } catch {
    return "storage-failed";
  }
  return null;
}

function commit(next: RegistrySnapshot, cleanup = false): CanonicalObjectFailure | null {
  const gate = requireWorkspaceMutationCoordination();
  if (gate) return gate;
  refreshFromStorage();
  if (authority.status === "corrupt" || authority.status === "unsupported-version") {
    return authority.status === "corrupt" ? "corrupt" : "unsupported-version";
  }
  const currentStorage = storage();
  const raw = currentStorage?.getItem(CANONICAL_OBJECT_STORAGE_KEY) ?? null;
  if (currentStorage && raw !== baseRaw) {
    hydrated = false;
    hydrate();
    return "revision-conflict";
  }
  if (!cleanup) {
    const current = authority.status === "ready" || authority.status === "empty" ? authority.snapshot : emptySnapshot();
    for (const workspaceId of Object.keys(next.workspaces)) {
      if (JSON.stringify(current.workspaces[workspaceId]) === JSON.stringify(next.workspaces[workspaceId])) continue;
      if (isProtectedDemoWorkspaceId(workspaceId)) return "protected-workspace";
      const verdict = evaluateWorkspaceAuthority(workspaceId);
      if (!verdict.ok) return verdict.reason;
    }
  }
  const failure = persist(next);
  if (failure) return failure;
  baseRaw = currentStorage?.getItem(CANONICAL_OBJECT_STORAGE_KEY) ?? null;
  authority = {
    status: Object.keys(next.workspaces).length === 0 ? "empty" : "ready",
    snapshot: next,
  };
  emit();
  return null;
}

function bucket(workspaceId: string): WorkspaceBucket {
  refreshFromStorage();
  if (authority.status !== "ready" && authority.status !== "empty") {
    return Object.freeze({ nextNumber: 1, objects: Object.freeze([]), proposals: Object.freeze([]), mappings: Object.freeze([]) });
  }
  return authority.snapshot.workspaces[workspaceId] ?? Object.freeze({
    nextNumber: 1,
    objects: Object.freeze([]),
    proposals: Object.freeze([]),
    mappings: Object.freeze([]),
  });
}

function replaceWorkspace(workspaceId: string, nextBucket: WorkspaceBucket): RegistrySnapshot {
  const current = authority.status === "ready" || authority.status === "empty" ? authority.snapshot : emptySnapshot();
  return Object.freeze({
    ...current,
    workspaces: Object.freeze({ ...current.workspaces, [workspaceId]: nextBucket }),
  });
}

function blocked(): CanonicalObjectFailure | null {
  refreshFromStorage();
  if (authority.status === "corrupt") return "corrupt";
  if (authority.status === "unsupported-version") return "unsupported-version";
  return null;
}

export function listCanonicalObjectWorkspaceIds(): readonly string[] {
  refreshFromStorage();
  if (authority.status !== "ready" && authority.status !== "empty") return Object.freeze([]);
  return Object.freeze(Object.keys(authority.snapshot.workspaces));
}

export function listCanonicalObjects(workspaceId: string): readonly CanonicalOrganizationalObject[] {
  return bucket(workspaceId).objects;
}

export function getCanonicalObject(workspaceId: string, canonicalObjectId: string): CanonicalOrganizationalObject | null {
  return bucket(workspaceId).objects.find((object) => object.canonicalObjectId === canonicalObjectId) ?? null;
}

export function listDeckCanonicalObjects(workspaceId: string, deckId: string): readonly CanonicalOrganizationalObject[] {
  return Object.freeze(bucket(workspaceId).objects.filter((object) =>
    object.lifecycleStatus === "ACTIVE" && object.deckIds.includes(deckId)));
}

function sourceIdentity(link: CanonicalObjectSourceLink): string {
  return `${link.datasetId}\0${link.objectType}\0${link.sourceKey}`;
}

export function createCanonicalObject(input: {
  readonly workspaceId: string;
  readonly objectType: CanonicalObjectType;
  readonly displayName: string;
  readonly attributes?: Readonly<Record<string, unknown>>;
  readonly deckId?: string | null;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  const workspaceId = input.workspaceId.trim();
  if (!CANONICAL_OBJECT_TYPES.includes(input.objectType)) return { ok: false, reason: "invalid-type" };
  if (!validName(input.displayName)) return { ok: false, reason: "invalid-name" };
  const attributes = validateCanonicalObjectAttributes(input.objectType, input.attributes ?? {});
  if (!attributes.ok) return attributes;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const failure = blocked();
    if (failure) return { ok: false, reason: failure };
    const rejected = workspaceAllowed(workspaceId);
    if (rejected) return { ok: false, reason: rejected };
    if (workspaceMutationsBlocked(workspaceId)) return { ok: false, reason: "deletion-in-progress" };
    const current = bucket(workspaceId);
    if (current.objects.length >= CANONICAL_OBJECT_REGISTRY_LIMIT) return { ok: false, reason: "limit" };
    const timestamp = input.now ?? nowIso();
    const created = Object.freeze({
      schemaVersion: CANONICAL_OBJECT_SCHEMA_VERSION,
      workspaceId,
      canonicalObjectId: `org:${encodeURIComponent(workspaceId)}:o${current.nextNumber}`,
      objectType: input.objectType,
      displayName: input.displayName.trim(),
      attributes: attributes.value,
      provenance: "MANAGER_CREATED" as const,
      lifecycleStatus: "ACTIVE" as const,
      reconciliationStatus: "NONE" as const,
      deckIds: Object.freeze(input.deckId ? [input.deckId] : []),
      sourceLinks: Object.freeze([]),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const write = commit(replaceWorkspace(workspaceId, Object.freeze({
      ...current,
      nextNumber: current.nextNumber + 1,
      objects: Object.freeze([...current.objects, created]),
    })));
    if (write === "revision-conflict") continue;
    if (write) return { ok: false, reason: write };
    return { ok: true, value: created };
  }
  return { ok: false, reason: "revision-conflict" };
}

function updateObject(
  workspaceId: string,
  canonicalObjectId: string,
  change: (object: CanonicalOrganizationalObject, timestamp: string) => CanonicalOrganizationalObject | CanonicalObjectFailure,
  now?: string,
): CanonicalObjectResult<CanonicalOrganizationalObject> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const failure = blocked();
    if (failure) return { ok: false, reason: failure };
    const rejected = workspaceAllowed(workspaceId);
    if (rejected) return { ok: false, reason: rejected };
    if (workspaceMutationsBlocked(workspaceId)) return { ok: false, reason: "deletion-in-progress" };
    const current = bucket(workspaceId);
    const object = current.objects.find((entry) => entry.canonicalObjectId === canonicalObjectId);
    if (!object || object.lifecycleStatus === "DELETED") return { ok: false, reason: "missing" };
    const timestamp = now ?? nowIso();
    const next = change(object, timestamp);
    if (typeof next === "string") return { ok: false, reason: next };
    const write = commit(replaceWorkspace(workspaceId, Object.freeze({
      ...current,
      objects: Object.freeze(current.objects.map((entry) => entry.canonicalObjectId === canonicalObjectId ? next : entry)),
    })));
    if (write === "revision-conflict") continue;
    if (write) return { ok: false, reason: write };
    return { ok: true, value: next };
  }
  return { ok: false, reason: "revision-conflict" };
}

export function renameCanonicalObject(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly displayName: string;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  if (!validName(input.displayName)) return { ok: false, reason: "invalid-name" };
  return updateObject(input.workspaceId, input.canonicalObjectId, (object, timestamp) => Object.freeze({
    ...object,
    displayName: input.displayName.trim(),
    updatedAt: timestamp,
  }), input.now);
}

export function updateCanonicalObjectAttributes(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly attributes: Readonly<Record<string, unknown>>;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  const current = getCanonicalObject(input.workspaceId, input.canonicalObjectId);
  if (!current) return { ok: false, reason: blocked() ?? "missing" };
  const attributes = validateCanonicalObjectAttributes(current.objectType, input.attributes);
  if (!attributes.ok) return attributes;
  return updateObject(input.workspaceId, input.canonicalObjectId, (object, timestamp) => Object.freeze({
    ...object,
    attributes: attributes.value,
    updatedAt: timestamp,
  }), input.now);
}

function incidentRelationshipIds(workspaceId: string, canonicalObjectId: string): readonly string[] {
  return listCanonicalRelationships(workspaceId)
    .filter((relationship) =>
      relationship.status === "ACTIVE" &&
      (relationship.sourceObjectId === canonicalObjectId || relationship.targetObjectId === canonicalObjectId))
    .map((relationship) => relationship.relationshipId);
}

function coordinateObjectLifecycle(input: {
  readonly kind: "archive-object" | "delete-object";
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  const operationId = `${input.kind}:${input.workspaceId}:${input.canonicalObjectId}:${input.now ?? Date.now()}`;
  const prepared = prepareCanonicalMutation(Object.freeze({
    operationId,
    kind: input.kind,
    workspaceId: input.workspaceId,
    canonicalObjectId: input.canonicalObjectId,
    datasetId: null,
    sourceKey: null,
    relationshipIds: incidentRelationshipIds(input.workspaceId, input.canonicalObjectId),
    status: "PREPARED" as const,
  }));
  if (prepared !== "ok") return { ok: false, reason: prepared === "duplicate" ? "duplicate" : prepared === "storage-failed" ? "storage-failed" : "corrupt" };
  if (updateCanonicalMutation(operationId, "APPLYING") !== "ok") {
    return { ok: false, reason: "recovery-required" as CanonicalObjectFailure };
  }
  const changed = updateObject(input.workspaceId, input.canonicalObjectId, (object, timestamp) => {
    if (input.kind === "archive-object" && object.lifecycleStatus !== "ACTIVE") return "missing";
    return Object.freeze({
      ...object,
      lifecycleStatus: input.kind === "archive-object" ? "ARCHIVED" as const : "DELETED" as const,
      deckIds: input.kind === "delete-object" ? Object.freeze([]) : object.deckIds,
      updatedAt: timestamp,
    });
  }, input.now);
  if (!changed.ok) {
    updateCanonicalMutation(operationId, "RECOVERY_REQUIRED");
    return changed;
  }
  const relationships = archiveCanonicalRelationshipsById(
    input.workspaceId,
    incidentRelationshipIds(input.workspaceId, input.canonicalObjectId).length > 0
      ? listCanonicalMutations().find((entry) => entry.operationId === operationId)?.relationshipIds ?? []
      : listCanonicalMutations().find((entry) => entry.operationId === operationId)?.relationshipIds ?? [],
    input.now,
  );
  if (!relationships.ok) {
    updateCanonicalMutation(operationId, "RECOVERY_REQUIRED");
    return { ok: false, reason: "recovery-required" as CanonicalObjectFailure };
  }
  updateCanonicalMutation(operationId, "COMMITTED");
  return changed;
}

export function archiveCanonicalObject(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  return coordinateObjectLifecycle({ ...input, kind: "archive-object" });
}

export function restoreCanonicalObject(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  return updateObject(input.workspaceId, input.canonicalObjectId, (object, timestamp) => {
    if (object.lifecycleStatus !== "ARCHIVED") return "missing";
    return Object.freeze({ ...object, lifecycleStatus: "ACTIVE" as const, updatedAt: timestamp });
  }, input.now);
}

export function deleteCanonicalObject(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  return coordinateObjectLifecycle({ ...input, kind: "delete-object" });
}

export function detachCanonicalDatasetSource(input: {
  readonly workspaceId: string;
  readonly datasetId: string;
  readonly now?: string;
}): CanonicalObjectResult<number> {
  const operationId = `detach-dataset:${input.workspaceId}:${input.datasetId}:${input.now ?? Date.now()}`;
  const prepared = prepareCanonicalMutation(Object.freeze({
    operationId,
    kind: "detach-dataset" as const,
    workspaceId: input.workspaceId,
    canonicalObjectId: null,
    datasetId: input.datasetId,
    sourceKey: null,
    relationshipIds: Object.freeze([]),
    status: "PREPARED" as const,
  }));
  if (prepared !== "ok") return { ok: false, reason: prepared === "storage-failed" ? "storage-failed" : "corrupt" };
  updateCanonicalMutation(operationId, "APPLYING");
  const applied = applyDatasetDetachment(input.workspaceId, input.datasetId, input.now);
  if (!applied.ok) {
    updateCanonicalMutation(operationId, "RECOVERY_REQUIRED");
    return applied;
  }
  updateCanonicalMutation(operationId, "COMMITTED");
  return applied;
}

function applyDatasetDetachment(workspaceId: string, datasetId: string, now?: string): CanonicalObjectResult<number> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const current = bucket(workspaceId);
  const timestamp = now ?? nowIso();
  let count = 0;
  const objects = current.objects.map((object) => {
    if (!object.sourceLinks.some((link) => link.datasetId === datasetId)) return object;
    count += 1;
    const sourceLinks = object.sourceLinks.filter((link) => link.datasetId !== datasetId);
    return Object.freeze({
      ...object,
      sourceLinks: Object.freeze(sourceLinks),
      reconciliationStatus: sourceLinks.length === 0 ? "MISSING_FROM_SOURCE" as const : object.reconciliationStatus,
      updatedAt: timestamp,
    });
  });
  if (count === 0) return { ok: true, value: 0 };
  const write = commit(replaceWorkspace(workspaceId, Object.freeze({ ...current, objects: Object.freeze(objects) })));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: count };
}

export function recoverCanonicalMutations(): CanonicalObjectResult<number> {
  const gate = requireWorkspaceMutationCoordination();
  if (gate) return { ok: false, reason: gate };
  if (canonicalMutationJournalStatus() === "corrupt" || canonicalMutationJournalStatus() === "unsupported-version") {
    return { ok: false, reason: "corrupt" };
  }
  let recovered = 0;
  for (const operation of listCanonicalMutations()) {
    if (operation.status !== "APPLYING" && operation.status !== "RECOVERY_REQUIRED" && operation.status !== "PREPARED") continue;
    if (!evaluateWorkspaceAuthority(operation.workspaceId).ok) continue;
    updateCanonicalMutation(operation.operationId, "APPLYING");
    if (operation.kind === "link-source" && operation.canonicalObjectId && operation.datasetId && operation.sourceKey) {
      const object = getCanonicalObject(operation.workspaceId, operation.canonicalObjectId);
      const alreadyLinked = object?.sourceLinks.some((link) =>
        link.datasetId === operation.datasetId && link.sourceKey === operation.sourceKey);
      if (object && !alreadyLinked && object.lifecycleStatus !== "DELETED") {
        const link = Object.freeze({
          datasetId: operation.datasetId,
          objectType: object.objectType,
          sourceKey: operation.sourceKey,
        });
        const owner = bucket(operation.workspaceId).objects.find((entry) =>
          entry.canonicalObjectId !== object.canonicalObjectId &&
          entry.sourceLinks.some((item) => sourceIdentity(item) === sourceIdentity(link)));
        if (owner) {
          updateCanonicalMutation(operation.operationId, "RECOVERY_REQUIRED");
          return { ok: false, reason: "recovery-required" };
        }
        const linked = updateObject(operation.workspaceId, operation.canonicalObjectId, (current, timestamp) => Object.freeze({
          ...current,
          sourceLinks: Object.freeze([...current.sourceLinks, link]),
          updatedAt: timestamp,
        }));
        if (!linked.ok) {
          updateCanonicalMutation(operation.operationId, "RECOVERY_REQUIRED");
          return { ok: false, reason: "recovery-required" };
        }
      }
    } else if (operation.kind === "detach-dataset" && operation.datasetId) {
      const detached = applyDatasetDetachment(operation.workspaceId, operation.datasetId);
      if (!detached.ok) {
        updateCanonicalMutation(operation.operationId, "RECOVERY_REQUIRED");
        return { ok: false, reason: "recovery-required" };
      }
    } else if (operation.canonicalObjectId) {
      const object = getCanonicalObject(operation.workspaceId, operation.canonicalObjectId);
      if (object && object.lifecycleStatus === "ACTIVE") {
        const changed = updateObject(operation.workspaceId, operation.canonicalObjectId, (current, timestamp) => Object.freeze({
          ...current,
          lifecycleStatus: operation.kind === "delete-object" ? "DELETED" as const : "ARCHIVED" as const,
          deckIds: operation.kind === "delete-object" ? Object.freeze([]) : current.deckIds,
          updatedAt: timestamp,
        }));
        if (!changed.ok) {
          updateCanonicalMutation(operation.operationId, "RECOVERY_REQUIRED");
          return { ok: false, reason: "recovery-required" };
        }
      }
      const relationships = archiveCanonicalRelationshipsById(operation.workspaceId, operation.relationshipIds);
      if (!relationships.ok) {
        updateCanonicalMutation(operation.operationId, "RECOVERY_REQUIRED");
        return { ok: false, reason: "recovery-required" };
      }
    }
    updateCanonicalMutation(operation.operationId, "RECOVERED");
    recovered += 1;
  }
  return { ok: true, value: recovered };
}

export function assignCanonicalObjectToDeck(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly deckId: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  if (input.deckId.trim().length === 0) return { ok: false, reason: "invalid-attribute" };
  return updateObject(input.workspaceId, input.canonicalObjectId, (object, timestamp) => {
    if (object.lifecycleStatus !== "ACTIVE") return "missing";
    if (object.deckIds.includes(input.deckId)) return object;
    return Object.freeze({ ...object, deckIds: Object.freeze([...object.deckIds, input.deckId]), updatedAt: timestamp });
  });
}

export function removeCanonicalObjectFromDeck(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly deckId: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  return updateObject(input.workspaceId, input.canonicalObjectId, (object, timestamp) => Object.freeze({
    ...object,
    deckIds: Object.freeze(object.deckIds.filter((id) => id !== input.deckId)),
    updatedAt: timestamp,
  }));
}

export type DatasetEntityPreview = Readonly<{
  unchanged: readonly string[];
  updates: readonly { readonly canonicalObjectId: string; readonly sourceKey: string; readonly displayName: string }[];
  proposed: readonly { readonly sourceKey: string; readonly displayName: string; readonly attributes: Readonly<Record<string, string | number | boolean>> }[];
  missing: readonly { readonly canonicalObjectId: string; readonly sourceKey: string }[];
  conflicts: readonly string[];
  rejectedRows: readonly string[];
  syntheticObjects: false;
}>;

function columnValue(row: Readonly<Record<string, string>>, column: string): string {
  return (row[column] ?? "").trim();
}

export function previewDatasetEntities(input: {
  readonly workspaceId: string;
  readonly datasetId: string;
  readonly objectType: CanonicalObjectType;
  readonly sourceKeyColumn: string;
  readonly displayNameColumn: string;
  readonly attributeColumns?: Readonly<Record<string, string>>;
  readonly rows: readonly Readonly<Record<string, string>>[];
}): CanonicalObjectResult<DatasetEntityPreview> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  if (!CANONICAL_OBJECT_TYPES.includes(input.objectType)) return { ok: false, reason: "invalid-type" };
  const seen = new Set<string>();
  const rejectedRows: string[] = [];
  const parsed: { sourceKey: string; displayName: string; attributes: Readonly<Record<string, string | number | boolean>> }[] = [];
  input.rows.forEach((row, index) => {
    const sourceKey = columnValue(row, input.sourceKeyColumn);
    const displayName = columnValue(row, input.displayNameColumn);
    if (sourceKey.length === 0 || !validName(displayName)) {
      rejectedRows.push(`row ${index + 1}`);
      return;
    }
    if (seen.has(sourceKey)) {
      rejectedRows.push(`duplicate ${sourceKey}`);
      return;
    }
    seen.add(sourceKey);
    const raw: Record<string, unknown> = {};
    for (const [column, attribute] of Object.entries(input.attributeColumns ?? {})) {
      const value = columnValue(row, column);
      if (value.length === 0) continue;
      raw[attribute] = /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value;
    }
    const attributes = validateCanonicalObjectAttributes(input.objectType, raw);
    if (!attributes.ok) {
      rejectedRows.push(`attributes ${sourceKey}`);
      return;
    }
    parsed.push({ sourceKey, displayName, attributes: attributes.value });
  });
  const objects = bucket(input.workspaceId).objects.filter((object) =>
    object.sourceLinks.some((link) => link.datasetId === input.datasetId && link.objectType === input.objectType));
  const byKey = new Map<string, CanonicalOrganizationalObject>();
  for (const object of objects) {
    for (const link of object.sourceLinks) {
      if (link.datasetId === input.datasetId && link.objectType === input.objectType) byKey.set(link.sourceKey, object);
    }
  }
  const unchanged: string[] = [];
  const updates: { canonicalObjectId: string; sourceKey: string; displayName: string }[] = [];
  const proposed: DatasetEntityPreview["proposed"][number][] = [];
  const conflicts: string[] = [];
  for (const row of parsed) {
    const existing = byKey.get(row.sourceKey);
    if (!existing) {
      proposed.push(row);
      continue;
    }
    if (existing.lifecycleStatus === "DELETED") {
      conflicts.push(`${row.sourceKey} belongs to a deleted object and was not recreated`);
      continue;
    }
    const nameChanged = existing.displayName !== row.displayName;
    const attributesChanged = JSON.stringify(existing.attributes) !== JSON.stringify(row.attributes);
    if (!nameChanged && !attributesChanged) unchanged.push(existing.canonicalObjectId);
    else updates.push({ canonicalObjectId: existing.canonicalObjectId, sourceKey: row.sourceKey, displayName: row.displayName });
  }
  const present = new Set(parsed.map((row) => row.sourceKey));
  const missing = [...byKey.entries()]
    .filter(([sourceKey, object]) => !present.has(sourceKey) && object.lifecycleStatus !== "DELETED")
    .map(([sourceKey, object]) => ({ canonicalObjectId: object.canonicalObjectId, sourceKey }));
  return {
    ok: true,
    value: Object.freeze({
      unchanged: Object.freeze(unchanged),
      updates: Object.freeze(updates),
      proposed: Object.freeze(proposed),
      missing: Object.freeze(missing),
      conflicts: Object.freeze(conflicts),
      rejectedRows: Object.freeze(rejectedRows),
      syntheticObjects: false as const,
    }),
  };
}

export function applyDatasetReconciliation(input: {
  readonly workspaceId: string;
  readonly datasetId: string;
  readonly objectType: CanonicalObjectType;
  readonly sourceKeyColumn: string;
  readonly displayNameColumn: string;
  readonly attributeColumns?: Readonly<Record<string, string>>;
  readonly rows: readonly Readonly<Record<string, string>>[];
  readonly deckId?: string | null;
  readonly createProposed?: boolean;
  readonly updateExisting?: boolean;
  readonly now?: string;
}): CanonicalObjectResult<DatasetEntityPreview> {
  const preview = previewDatasetEntities(input);
  if (!preview.ok) return preview;
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  let current = bucket(workspaceId);
  const timestamp = input.now ?? nowIso();
  let objects = [...current.objects];
  if (input.updateExisting) {
    objects = objects.map((object) => {
      const update = preview.value.updates.find((entry) => entry.canonicalObjectId === object.canonicalObjectId);
      const missing = preview.value.missing.find((entry) => entry.canonicalObjectId === object.canonicalObjectId);
      if (!update && !missing) return object;
      const row = input.rows.find((entry) => columnValue(entry, input.sourceKeyColumn) === update?.sourceKey);
      const raw: Record<string, unknown> = {};
      if (row && update) {
        for (const [column, attribute] of Object.entries(input.attributeColumns ?? {})) {
          const value = columnValue(row, column);
          if (value.length === 0) continue;
          raw[attribute] = /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value;
        }
      }
      const attributes = update ? validateCanonicalObjectAttributes(input.objectType, raw) : null;
      const otherSources = object.sourceLinks.some((link) => link.datasetId !== input.datasetId);
      const nextAttributes = { ...object.attributes };
      if (attributes?.ok) {
        for (const [key, value] of Object.entries(attributes.value)) {
          const currentValue = object.attributes[key];
          if (otherSources && currentValue !== undefined && currentValue !== value) continue;
          nextAttributes[key] = value;
        }
      }
      return Object.freeze({
        ...object,
        displayName: update?.displayName ?? object.displayName,
        attributes: Object.freeze(nextAttributes),
        reconciliationStatus: missing
          ? (otherSources ? "PENDING_REVIEW" as const : "MISSING_FROM_SOURCE" as const)
          : "CURRENT" as const,
        updatedAt: timestamp,
      });
    });
  }
  if (input.createProposed) {
    for (const proposal of preview.value.proposed) {
      if (objects.length >= CANONICAL_OBJECT_REGISTRY_LIMIT) return { ok: false, reason: "limit" };
      const created = Object.freeze({
        schemaVersion: CANONICAL_OBJECT_SCHEMA_VERSION,
        workspaceId,
        canonicalObjectId: `org:${encodeURIComponent(workspaceId)}:o${current.nextNumber}`,
        objectType: input.objectType,
        displayName: proposal.displayName,
        attributes: proposal.attributes,
        provenance: "VERIFIED_DATASET_MAPPING" as const,
        lifecycleStatus: "ACTIVE" as const,
        reconciliationStatus: "CURRENT" as const,
        deckIds: Object.freeze(input.deckId ? [input.deckId] : []),
        sourceLinks: Object.freeze([Object.freeze({
          datasetId: input.datasetId,
          objectType: input.objectType,
          sourceKey: proposal.sourceKey,
        })]),
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      current = Object.freeze({ ...current, nextNumber: current.nextNumber + 1 });
      objects.push(created);
    }
  }
  const write = commit(replaceWorkspace(workspaceId, Object.freeze({ ...current, objects: Object.freeze(objects) })));
  if (write) return { ok: false, reason: write };
  return preview;
}

export function associateCanonicalObjectSource(input: {
  readonly workspaceId: string;
  readonly canonicalObjectId: string;
  readonly datasetId: string;
  readonly sourceKey: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  const sourceKey = input.sourceKey.trim();
  if (sourceKey.length === 0 || input.datasetId.trim().length === 0) return { ok: false, reason: "invalid-attribute" };
  const objects = bucket(input.workspaceId).objects;
  const object = objects.find((entry) => entry.canonicalObjectId === input.canonicalObjectId);
  if (!object || object.lifecycleStatus === "DELETED") return { ok: false, reason: blocked() ?? "missing" };
  const link = Object.freeze({ datasetId: input.datasetId, objectType: object.objectType, sourceKey });
  const owner = objects.find((entry) => entry.sourceLinks.some((item) => sourceIdentity(item) === sourceIdentity(link)));
  if (owner && owner.canonicalObjectId !== object.canonicalObjectId) return { ok: false, reason: "conflict" };
  if (owner) return { ok: true, value: owner };
  const operationId = `link-source:${input.workspaceId}:${input.canonicalObjectId}:${input.datasetId}:${sourceKey}:${Date.now()}`;
  const prepared = prepareCanonicalMutation(Object.freeze({
    operationId,
    kind: "link-source" as const,
    workspaceId: input.workspaceId,
    canonicalObjectId: input.canonicalObjectId,
    datasetId: input.datasetId,
    sourceKey,
    relationshipIds: Object.freeze([]),
    status: "PREPARED" as const,
  }));
  if (prepared !== "ok") return { ok: false, reason: prepared === "storage-failed" ? "storage-failed" : "corrupt" };
  updateCanonicalMutation(operationId, "APPLYING");
  const linked = updateObject(input.workspaceId, input.canonicalObjectId, (current, timestamp) => Object.freeze({
    ...current,
    sourceLinks: Object.freeze([...current.sourceLinks, link]),
    updatedAt: timestamp,
  }));
  if (!linked.ok) {
    updateCanonicalMutation(operationId, "RECOVERY_REQUIRED");
    return linked;
  }
  updateCanonicalMutation(operationId, "COMMITTED");
  return linked;
}

export function proposeCanonicalObject(input: {
  readonly workspaceId: string;
  readonly objectType: CanonicalObjectType;
  readonly displayName: string;
  readonly attributes?: Readonly<Record<string, unknown>>;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalObjectProposal> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  if (!validName(input.displayName)) return { ok: false, reason: "invalid-name" };
  const attributes = validateCanonicalObjectAttributes(input.objectType, input.attributes ?? {});
  if (!attributes.ok) return attributes;
  const current = bucket(workspaceId);
  const proposal = Object.freeze({
    proposalId: `proposal:${encodeURIComponent(workspaceId)}:p${current.proposals.length + 1}`,
    workspaceId,
    objectType: input.objectType,
    displayName: input.displayName.trim(),
    attributes: attributes.value,
    sourceLink: null,
    state: "PROPOSED" as const,
    createdAt: input.now ?? nowIso(),
  });
  const write = commit(replaceWorkspace(workspaceId, Object.freeze({
    ...current,
    proposals: Object.freeze([...current.proposals, proposal]),
  })));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: proposal };
}

export function rejectCanonicalObjectProposal(workspaceId: string, proposalId: string): CanonicalObjectResult<CanonicalObjectProposal> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const current = bucket(workspaceId);
  const proposal = current.proposals.find((entry) => entry.proposalId === proposalId);
  if (!proposal || proposal.state !== "PROPOSED") return { ok: false, reason: "missing" };
  const next = Object.freeze({ ...proposal, state: "REJECTED" as const });
  const write = commit(replaceWorkspace(workspaceId, Object.freeze({
    ...current,
    proposals: Object.freeze(current.proposals.map((entry) => entry.proposalId === proposalId ? next : entry)),
  })));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function approveCanonicalObjectProposal(input: {
  readonly workspaceId: string;
  readonly proposalId: string;
  readonly deckId?: string | null;
  readonly now?: string;
}): CanonicalObjectResult<CanonicalOrganizationalObject> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const current = bucket(input.workspaceId);
  const proposal = current.proposals.find((entry) => entry.proposalId === input.proposalId);
  if (!proposal || proposal.state !== "PROPOSED") return { ok: false, reason: "missing" };
  if (current.objects.length >= CANONICAL_OBJECT_REGISTRY_LIMIT) return { ok: false, reason: "limit" };
  const timestamp = input.now ?? nowIso();
  const created = Object.freeze({
    schemaVersion: CANONICAL_OBJECT_SCHEMA_VERSION,
    workspaceId: input.workspaceId,
    canonicalObjectId: `org:${encodeURIComponent(input.workspaceId)}:o${current.nextNumber}`,
    objectType: proposal.objectType,
    displayName: proposal.displayName,
    attributes: proposal.attributes,
    provenance: "MANAGER_APPROVED_PROPOSAL" as const,
    lifecycleStatus: "ACTIVE" as const,
    reconciliationStatus: "NONE" as const,
    deckIds: Object.freeze(input.deckId ? [input.deckId] : []),
    sourceLinks: Object.freeze([]),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  const write = commit(replaceWorkspace(input.workspaceId, Object.freeze({
    ...current,
    nextNumber: current.nextNumber + 1,
    objects: Object.freeze([...current.objects, created]),
    proposals: Object.freeze(current.proposals.filter((entry) => entry.proposalId !== proposal.proposalId)),
  })));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: created };
}

export function forgetWorkspaceCanonicalObjects(workspaceId: string): CanonicalObjectResult<null> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  if (!authority || (authority.status !== "ready" && authority.status !== "empty")) return { ok: false, reason: "corrupt" };
  if (!authority.snapshot.workspaces[workspaceId]) return { ok: true, value: null };
  const workspaces = { ...authority.snapshot.workspaces };
  delete workspaces[workspaceId];
  const write = commit(Object.freeze({ ...authority.snapshot, workspaces: Object.freeze(workspaces) }), true);
  if (write) return { ok: false, reason: write };
  return { ok: true, value: null };
}

export function presentCanonicalObjectForStage(object: CanonicalOrganizationalObject): NexoraDecisionTheatreDataObject {
  return Object.freeze({
    visualFamily: "DATA_OBJECT" as const,
    id: object.canonicalObjectId,
    label: object.displayName,
    sourceType: "organizational-object" as const,
    workspaceId: object.workspaceId,
    sourceId: object.canonicalObjectId,
    sourceSnapshotRef: canonicalObjectRegistryIdentity,
    dataRealityRef: "organizational-object",
    provenanceRef: object.provenance,
    validationState: "valid" as const,
    understandingState: "validated-mapping" as const,
    recordCount: 0,
    columnCount: Object.keys(object.attributes).length,
    confirmedFieldCount: Object.keys(object.attributes).length,
    unresolvedFieldCount: 0,
    updatedAt: object.updatedAt,
    authoritativeSource: canonicalObjectRegistryIdentity,
    projectionAuthority: "DATA-UX:1/DecisionTheatreDataObjectProjection" as const,
    stageCompatibility: Object.freeze({
      participantId: object.canonicalObjectId,
      visualFamily: "DATA_OBJECT" as const,
      rendererRequired: true as const,
      navigationEligible: false as const,
      inspectionEligible: true as const,
    }),
    directorCompatibility: Object.freeze({
      id: object.canonicalObjectId,
      label: object.displayName,
      kind: object.objectType,
    }),
    relationships: Object.freeze([]),
    semanticSafety: Object.freeze({
      isEvidence: false as const,
      impliesCausality: false as const,
      createsBusinessTruth: false as const,
      ambiguityRequiresClarification: false as const,
    }),
    writes: Object.freeze({
      dataReality: false as const,
      sourceSnapshot: false as const,
      evidence: false as const,
      stage: false as const,
      director: false as const,
      advisor: false as const,
    }),
    organizational: Object.freeze({
      objectType: object.objectType,
      lifecycleStatus: object.lifecycleStatus === "ARCHIVED" ? "ARCHIVED" as const : "ACTIVE" as const,
      provenance: object.provenance,
      attributes: object.attributes,
      deckIds: object.deckIds,
      reconciliationStatus: object.reconciliationStatus,
      sourceDatasetIds: Object.freeze([...new Set(object.sourceLinks.map((link) => link.datasetId))]),
      sourceAssociations: Object.freeze(object.sourceLinks.map((link) => `${link.datasetId}/${link.sourceKey}`)),
    }),
  });
}

export function resetCanonicalObjectsForTests(nextStorage?: Storage | null): void {
  storageOverride = nextStorage === undefined ? undefined : nextStorage;
  authority = { status: "empty", snapshot: emptySnapshot() };
  hydrated = false;
  baseRaw = null;
  revision = 0;
}
