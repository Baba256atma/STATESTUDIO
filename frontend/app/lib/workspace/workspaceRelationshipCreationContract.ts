/**
 * DS-2:4 — Workspace relationship creation contract.
 * Creation only — relationship records only, with no scene, topology, or rendering writes.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  getApprovedRelationships,
  type WorkspaceRelationshipApprovalRecord,
} from "./workspaceRelationshipApprovalContract.ts";
import type {
  WorkspaceRelationshipCategory,
  WorkspaceRelationshipStrength,
} from "./workspaceRelationshipClassificationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_RELATIONSHIP_CREATION_VERSION = "DS-2:4" as const;

export const WORKSPACE_RELATIONSHIP_CREATION_TAGS = Object.freeze([
  "[DS24_RELATIONSHIP_CREATION]",
  "[WORKSPACE_RELATIONSHIPS_CREATED]",
  "[RELATIONSHIP_TRACEABILITY_ENABLED]",
  "[RELATIONSHIP_CREATION_PERSISTED]",
  "[DS25_READY]",
  "[DS_2_4_COMPLETE]",
] as const);

export const NEXORA_RELATIONSHIP_CREATION_LOG_PREFIX =
  "[NexoraRelationshipCreation]" as const;

export const WORKSPACE_RELATIONSHIP_CREATION_SOURCE = "ds-2:4-creation" as const;

export type WorkspaceRelationship = Readonly<{
  contractVersion: typeof WORKSPACE_RELATIONSHIP_CREATION_VERSION;
  relationshipId: string;
  workspaceId: WorkspaceId;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  relationshipCategory: WorkspaceRelationshipCategory;
  relationshipStrength: WorkspaceRelationshipStrength;
  confidence: number;
  createdAt: string;
  originCandidateRelationshipId: string;
  source: typeof WORKSPACE_RELATIONSHIP_CREATION_SOURCE;
}>;

export type WorkspaceRelationshipMap = Readonly<Record<string, WorkspaceRelationship>>;

export type WorkspaceRelationshipStore = Readonly<Record<WorkspaceId, WorkspaceRelationshipMap>>;

export type CreateApprovedRelationshipsResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  createdCount: number;
  duplicateCount: number;
  skippedCount: number;
  relationships: readonly WorkspaceRelationship[];
  reason: string;
  message: string;
}>;

type RelationshipCreationAction = "created" | "duplicate" | "skipped";

const STORAGE_KEY = "nexora.workspaceRelationships.v1";

const CANDIDATE_RELATIONSHIP_TYPES = Object.freeze([
  "belongs_to",
  "assigned_to",
  "managed_by",
  "reports_to",
  "depends_on",
  "related_to",
  "purchases",
  "contains",
  "supplies",
  "unknown",
  "owns",
] as const);

let workspaceRelationshipStore: WorkspaceRelationshipStore = {};
let workspaceRelationshipHydrated = false;
let workspaceRelationshipVersion = 0;

type WorkspaceRelationshipListener = () => void;

const workspaceRelationshipListeners = new Set<WorkspaceRelationshipListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "relationship"
  );
}

function freezeRelationship(relationship: WorkspaceRelationship): WorkspaceRelationship {
  return Object.freeze({ ...relationship });
}

function readStorage(): WorkspaceRelationshipStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceRelationshipStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceRelationshipStore));
  } catch {
    // Relationship creation remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceRelationshipStore(): void {
  if (workspaceRelationshipHydrated) return;
  workspaceRelationshipHydrated = true;
  workspaceRelationshipStore = readStorage();
}

function notifyWorkspaceRelationshipListeners(): void {
  workspaceRelationshipVersion += 1;
  workspaceRelationshipListeners.forEach((listener) => listener());
}

function commitWorkspaceRelationshipChange(): void {
  writeStorage();
  notifyWorkspaceRelationshipListeners();
}

function emitRelationshipCreationDiagnostic(input: {
  workspaceId: WorkspaceId;
  relationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  action: RelationshipCreationAction;
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("relationshipCreation", NEXORA_RELATIONSHIP_CREATION_LOG_PREFIX, {
    workspaceId: input.workspaceId,
    relationshipId: input.relationshipId,
    sourceObjectId: input.sourceObjectId,
    targetObjectId: input.targetObjectId,
    relationshipType: input.relationshipType,
    action: input.action,
    created: input.action === "created",
    duplicate: input.action === "duplicate",
    skipped: input.action === "skipped",
    tags: WORKSPACE_RELATIONSHIP_CREATION_TAGS,
    phase: "DS-2:4",
  });
}

function parseRelationshipObjectIds(candidateRelationshipId: string): {
  sourceObjectId: string;
  targetObjectId: string;
} | null {
  const idWithoutType =
    CANDIDATE_RELATIONSHIP_TYPES.reduce((current, relationshipType) => {
      const suffix = `_${relationshipType}`;
      return current.endsWith(suffix) ? current.slice(0, -1 * suffix.length) : current;
    }, candidateRelationshipId);
  const matches = [...idWithoutType.matchAll(/obj_[a-z0-9_]+?(?=_obj_|$)/g)].map(
    (match) => match[0]
  );
  const sourceObjectId = matches[0]?.trim() ?? "";
  const targetObjectId = matches[1]?.trim() ?? "";
  if (!sourceObjectId || !targetObjectId) return null;
  return Object.freeze({ sourceObjectId, targetObjectId });
}

function buildRelationshipId(input: {
  workspaceId: WorkspaceId;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
}): string {
  return [
    "wrel",
    slugify(input.workspaceId),
    slugify(input.sourceObjectId),
    slugify(input.targetObjectId),
    slugify(input.relationshipType),
  ].join("_");
}

function relationshipIdentity(relationship: Pick<WorkspaceRelationship, "sourceObjectId" | "targetObjectId" | "relationshipType">): string {
  return `${relationship.sourceObjectId}->${relationship.targetObjectId}:${relationship.relationshipType}`;
}

function buildRelationshipFromApproval(
  approval: WorkspaceRelationshipApprovalRecord,
  createdAt: string
): WorkspaceRelationship | null {
  const objectIds = parseRelationshipObjectIds(approval.candidateRelationshipId);
  if (!objectIds) return null;
  return freezeRelationship(
    Object.freeze({
      contractVersion: WORKSPACE_RELATIONSHIP_CREATION_VERSION,
      relationshipId: buildRelationshipId({
        workspaceId: approval.workspaceId,
        sourceObjectId: objectIds.sourceObjectId,
        targetObjectId: objectIds.targetObjectId,
        relationshipType: approval.relationshipType,
      }),
      workspaceId: approval.workspaceId,
      sourceObjectId: objectIds.sourceObjectId,
      targetObjectId: objectIds.targetObjectId,
      relationshipType: approval.relationshipType,
      relationshipCategory: approval.relationshipCategory,
      relationshipStrength: approval.relationshipStrength,
      confidence: approval.confidence,
      createdAt,
      originCandidateRelationshipId: approval.candidateRelationshipId,
      source: WORKSPACE_RELATIONSHIP_CREATION_SOURCE,
    })
  );
}

function workspaceRelationshipIsComplete(
  relationship: WorkspaceRelationship | null | undefined
): relationship is WorkspaceRelationship {
  if (!relationship || typeof relationship !== "object") return false;
  if (relationship.contractVersion !== WORKSPACE_RELATIONSHIP_CREATION_VERSION) return false;
  if (typeof relationship.relationshipId !== "string" || !relationship.relationshipId.trim()) return false;
  if (typeof relationship.workspaceId !== "string" || !relationship.workspaceId.trim()) return false;
  if (typeof relationship.sourceObjectId !== "string" || !relationship.sourceObjectId.trim()) return false;
  if (typeof relationship.targetObjectId !== "string" || !relationship.targetObjectId.trim()) return false;
  if (typeof relationship.relationshipType !== "string" || !relationship.relationshipType.trim()) return false;
  if (!Number.isFinite(relationship.confidence) || relationship.confidence < 0 || relationship.confidence > 1) return false;
  if (typeof relationship.createdAt !== "string" || !relationship.createdAt.trim()) return false;
  if (
    typeof relationship.originCandidateRelationshipId !== "string" ||
    !relationship.originCandidateRelationshipId.trim()
  ) {
    return false;
  }
  return relationship.source === WORKSPACE_RELATIONSHIP_CREATION_SOURCE;
}

export function createApprovedRelationships(
  workspaceId: WorkspaceId
): CreateApprovedRelationshipsResult {
  hydrateWorkspaceRelationshipStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      relationships: Object.freeze([]),
      reason: "missing_workspace",
      message: "Select a workspace before creating approved relationships.",
    });
  }

  const approvedRelationships = getApprovedRelationships(trimmedWorkspaceId);
  if (approvedRelationships.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      relationships: Object.freeze([]),
      reason: "no_approved_relationships",
      message: "Approve relationship candidates before creating workspace relationships.",
    });
  }

  const existingMap = workspaceRelationshipStore[trimmedWorkspaceId] ?? Object.freeze({});
  const nextMap: Record<string, WorkspaceRelationship> = { ...existingMap };
  const existingIdentities = new Set(Object.values(existingMap).map(relationshipIdentity));
  const relationships: WorkspaceRelationship[] = [];
  let createdCount = 0;
  let duplicateCount = 0;
  let skippedCount = 0;

  for (const approval of approvedRelationships) {
    const relationship = buildRelationshipFromApproval(approval, nowIso());
    if (!workspaceRelationshipIsComplete(relationship)) {
      skippedCount += 1;
      emitRelationshipCreationDiagnostic({
        workspaceId: trimmedWorkspaceId,
        relationshipId: approval.candidateRelationshipId,
        sourceObjectId: "unknown",
        targetObjectId: "unknown",
        relationshipType: approval.relationshipType,
        action: "skipped",
      });
      continue;
    }

    const identity = relationshipIdentity(relationship);
    if (existingIdentities.has(identity)) {
      duplicateCount += 1;
      const duplicate =
        Object.values(existingMap).find((entry) => relationshipIdentity(entry) === identity) ??
        relationship;
      relationships.push(freezeRelationship(duplicate));
      emitRelationshipCreationDiagnostic({
        workspaceId: trimmedWorkspaceId,
        relationshipId: duplicate.relationshipId,
        sourceObjectId: duplicate.sourceObjectId,
        targetObjectId: duplicate.targetObjectId,
        relationshipType: duplicate.relationshipType,
        action: "duplicate",
      });
      continue;
    }

    nextMap[relationship.relationshipId] = relationship;
    existingIdentities.add(identity);
    relationships.push(relationship);
    createdCount += 1;
    emitRelationshipCreationDiagnostic({
      workspaceId: trimmedWorkspaceId,
      relationshipId: relationship.relationshipId,
      sourceObjectId: relationship.sourceObjectId,
      targetObjectId: relationship.targetObjectId,
      relationshipType: relationship.relationshipType,
      action: "created",
    });
  }

  workspaceRelationshipStore = Object.freeze({
    ...workspaceRelationshipStore,
    [trimmedWorkspaceId]: Object.freeze(nextMap),
  });
  if (createdCount > 0) commitWorkspaceRelationshipChange();

  return Object.freeze({
    success: createdCount > 0 || duplicateCount > 0,
    workspaceId: trimmedWorkspaceId,
    createdCount,
    duplicateCount,
    skippedCount,
    relationships: Object.freeze(relationships.map(freezeRelationship)),
    reason: createdCount > 0 ? "created" : duplicateCount > 0 ? "duplicate" : "skipped",
    message:
      createdCount > 0
        ? `${createdCount} workspace relationship${createdCount === 1 ? "" : "s"} created.`
        : duplicateCount > 0
          ? `${duplicateCount} duplicate relationship${duplicateCount === 1 ? "" : "s"} skipped.`
          : "No workspace relationships were created.",
  });
}

export function getWorkspaceRelationships(
  workspaceId: WorkspaceId
): readonly WorkspaceRelationship[] {
  hydrateWorkspaceRelationshipStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceRelationshipStore[trimmedWorkspaceId] ?? {}).map(freezeRelationship)
  );
}

export function getWorkspaceRelationship(
  workspaceId: WorkspaceId,
  relationshipId: string
): WorkspaceRelationship | null {
  hydrateWorkspaceRelationshipStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedRelationshipId = relationshipId.trim();
  if (!trimmedWorkspaceId || !trimmedRelationshipId) return null;
  const match = workspaceRelationshipStore[trimmedWorkspaceId]?.[trimmedRelationshipId] ?? null;
  return match ? freezeRelationship(match) : null;
}

export function subscribeWorkspaceRelationshipCreationRegistry(
  listener: WorkspaceRelationshipListener
): () => void {
  hydrateWorkspaceRelationshipStore();
  workspaceRelationshipListeners.add(listener);
  return () => workspaceRelationshipListeners.delete(listener);
}

export function getWorkspaceRelationshipCreationRegistryVersion(): number {
  hydrateWorkspaceRelationshipStore();
  return workspaceRelationshipVersion;
}

export function resetWorkspaceRelationshipCreationStoreForTests(): void {
  workspaceRelationshipStore = {};
  workspaceRelationshipHydrated = false;
  workspaceRelationshipVersion = 0;
  workspaceRelationshipListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
