/**
 * DS-2:1 — Workspace relationship candidate discovery.
 * Discovery only — no relationship creation, scene mutation, topology mutation, or rendering sync.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getWorkspaceCreatedObjects } from "./workspaceObjectCreationPipeline.ts";
import type { WorkspaceCreatedObject } from "./workspaceObjectCreationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_RELATIONSHIP_CANDIDATE_VERSION = "DS-2:1" as const;

export const WORKSPACE_RELATIONSHIP_CANDIDATE_TAGS = Object.freeze([
  "[DS21_RELATIONSHIP_DISCOVERY]",
  "[RELATIONSHIP_CANDIDATES_READY]",
  "[RELATIONSHIP_DIRECTION_ENGINE]",
  "[RELATIONSHIP_DISCOVERY_PERSISTED]",
  "[DS22_READY]",
  "[DS_2_1_COMPLETE]",
] as const);

export const NEXORA_RELATIONSHIP_DISCOVERY_LOG_PREFIX =
  "[NexoraRelationshipDiscovery]" as const;

export type WorkspaceRelationshipCandidateStatus = "suggested" | "approved" | "rejected";

export type WorkspaceRelationshipCandidateType =
  | "owns"
  | "contains"
  | "belongs_to"
  | "supplies"
  | "purchases"
  | "depends_on"
  | "reports_to"
  | "assigned_to"
  | "managed_by"
  | "related_to"
  | "unknown";

export type WorkspaceRelationshipCandidateDirection = "source_to_target";

export type WorkspaceRelationshipCandidate = Readonly<{
  contractVersion: typeof WORKSPACE_RELATIONSHIP_CANDIDATE_VERSION;
  candidateRelationshipId: string;
  workspaceId: WorkspaceId;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: WorkspaceRelationshipCandidateType;
  confidence: number;
  reason: string;
  direction: WorkspaceRelationshipCandidateDirection;
  discoveredAt: string;
  status: WorkspaceRelationshipCandidateStatus;
}>;

export type WorkspaceRelationshipCandidateMap = Readonly<
  Record<string, WorkspaceRelationshipCandidate>
>;

export type WorkspaceRelationshipCandidateStore = Readonly<
  Record<WorkspaceId, WorkspaceRelationshipCandidateMap>
>;

export type DiscoverCandidateRelationshipsResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  candidates: readonly WorkspaceRelationshipCandidate[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = "nexora.workspaceRelationshipCandidates.v1";

const RELATIONSHIP_RULES = Object.freeze([
  rule("supplier", "product", "supplies", 0.8, "Supplier objects supply product objects."),
  rule("customer", "product", "purchases", 0.75, "Customer objects purchase product objects."),
  rule("employee", "department", "belongs_to", 0.85, "Employee objects belong to department objects."),
  rule("project", "department", "managed_by", 0.7, "Project objects are managed by department objects."),
  rule("employee", "project", "assigned_to", 0.72, "Employee objects can be assigned to project objects."),
  rule("employee", "manager", "reports_to", 0.76, "Employee objects report to manager objects."),
] as const);

let relationshipCandidateStore: WorkspaceRelationshipCandidateStore = {};
let relationshipCandidateHydrated = false;
let relationshipCandidateVersion = 0;

type RelationshipCandidateListener = () => void;

const relationshipCandidateListeners = new Set<RelationshipCandidateListener>();

function rule(
  sourceType: string,
  targetType: string,
  relationshipType: WorkspaceRelationshipCandidateType,
  baseConfidence: number,
  reason: string
) {
  return Object.freeze({ sourceType, targetType, relationshipType, baseConfidence, reason });
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeToken(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (normalized.endsWith("ies")) return `${normalized.slice(0, -3)}y`;
  if (normalized.endsWith("s")) return normalized.slice(0, -1);
  return normalized;
}

function objectToken(object: WorkspaceCreatedObject): string {
  return normalizeToken(object.objectType || object.objectName);
}

function buildCandidateRelationshipId(input: {
  workspaceId: WorkspaceId;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: WorkspaceRelationshipCandidateType;
}): string {
  return [
    "relcand",
    normalizeToken(input.workspaceId),
    normalizeToken(input.sourceObjectId),
    normalizeToken(input.targetObjectId),
    input.relationshipType,
  ].join("_");
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function hasIdentifierColumn(object: WorkspaceCreatedObject): boolean {
  return Boolean(
    object.primaryIdentifier ||
      object.sourceColumns.some((column) => /(^|_)id$|identifier|uuid|key/i.test(column))
  );
}

function hasNameColumn(object: WorkspaceCreatedObject): boolean {
  return object.sourceColumns.some((column) => /(^|_)name$|title|label/i.test(column));
}

function columnFamilyOverlap(
  source: WorkspaceCreatedObject,
  target: WorkspaceCreatedObject
): number {
  const sourceFamilies = new Set(source.sourceColumns.map((column) => normalizeToken(column.split("_")[0] ?? column)));
  const targetFamilies = new Set(target.sourceColumns.map((column) => normalizeToken(column.split("_")[0] ?? column)));
  let overlap = 0;
  for (const family of sourceFamilies) {
    if (targetFamilies.has(family)) overlap += 1;
  }
  return overlap;
}

function scoreCandidate(input: {
  source: WorkspaceCreatedObject;
  target: WorkspaceCreatedObject;
  baseConfidence: number;
  strongRule: boolean;
}): number {
  const sameDataSource = input.source.dataSourceId === input.target.dataSourceId ? 0.01 : 0;
  const sourceQuality = hasIdentifierColumn(input.source) || hasNameColumn(input.source) ? 0.01 : 0;
  const targetQuality = hasIdentifierColumn(input.target) || hasNameColumn(input.target) ? 0.01 : 0;
  const lineageSignal = input.source.originCandidateId && input.target.originCandidateId ? 0.01 : 0;
  const overlap = Math.min(0.01, columnFamilyOverlap(input.source, input.target) * 0.01);
  const ruleSignal = input.strongRule ? 0 : 0;
  return clampConfidence(
    input.baseConfidence + sameDataSource + sourceQuality + targetQuality + lineageSignal + overlap + ruleSignal
  );
}

function findDirectionalRule(source: WorkspaceCreatedObject, target: WorkspaceCreatedObject) {
  const sourceType = objectToken(source);
  const targetType = objectToken(target);
  return (
    RELATIONSHIP_RULES.find(
      (entry) => entry.sourceType === sourceType && entry.targetType === targetType
    ) ?? null
  );
}

function inferRelationshipCandidate(input: {
  workspaceId: WorkspaceId;
  source: WorkspaceCreatedObject;
  target: WorkspaceCreatedObject;
  discoveredAt: string;
  existingStatus?: WorkspaceRelationshipCandidateStatus;
}): WorkspaceRelationshipCandidate {
  const ruleMatch = findDirectionalRule(input.source, input.target);
  const sameDataSource = input.source.dataSourceId === input.target.dataSourceId;
  const relationshipType = ruleMatch?.relationshipType ?? (sameDataSource ? "related_to" : "unknown");
  const baseConfidence = ruleMatch?.baseConfidence ?? (sameDataSource ? 0.43 : 0.28);
  const confidence = scoreCandidate({
    source: input.source,
    target: input.target,
    baseConfidence,
    strongRule: Boolean(ruleMatch),
  });
  const reason =
    ruleMatch?.reason ??
    (sameDataSource
      ? "Objects share source dataset context but no stronger deterministic rule matched."
      : "Objects do not share enough lineage or naming context for a deterministic relationship type.");

  return Object.freeze({
    contractVersion: WORKSPACE_RELATIONSHIP_CANDIDATE_VERSION,
    candidateRelationshipId: buildCandidateRelationshipId({
      workspaceId: input.workspaceId,
      sourceObjectId: input.source.objectId,
      targetObjectId: input.target.objectId,
      relationshipType,
    }),
    workspaceId: input.workspaceId,
    sourceObjectId: input.source.objectId,
    targetObjectId: input.target.objectId,
    relationshipType,
    confidence,
    reason,
    direction: "source_to_target",
    discoveredAt: input.discoveredAt,
    status: input.existingStatus ?? "suggested",
  });
}

function freezeCandidate(candidate: WorkspaceRelationshipCandidate): WorkspaceRelationshipCandidate {
  return Object.freeze({ ...candidate });
}

function readStorage(): WorkspaceRelationshipCandidateStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceRelationshipCandidateStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(relationshipCandidateStore));
  } catch {
    // Candidate discovery remains available in-memory if storage is unavailable.
  }
}

function hydrateRelationshipCandidateStore(): void {
  if (relationshipCandidateHydrated) return;
  relationshipCandidateHydrated = true;
  relationshipCandidateStore = readStorage();
}

function notifyRelationshipCandidateListeners(): void {
  relationshipCandidateVersion += 1;
  relationshipCandidateListeners.forEach((listener) => listener());
}

function commitRelationshipCandidateChange(): void {
  writeStorage();
  notifyRelationshipCandidateListeners();
}

function emitRelationshipCandidateDiagnostic(candidate: WorkspaceRelationshipCandidate): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("relationshipCandidateDiscovery", NEXORA_RELATIONSHIP_DISCOVERY_LOG_PREFIX, {
    workspaceId: candidate.workspaceId,
    sourceObjectId: candidate.sourceObjectId,
    targetObjectId: candidate.targetObjectId,
    relationshipType: candidate.relationshipType,
    confidence: candidate.confidence,
    candidateRelationshipId: candidate.candidateRelationshipId,
    tags: WORKSPACE_RELATIONSHIP_CANDIDATE_TAGS,
    phase: "DS-2:1",
  });
}

function discoverFromCreatedObjects(
  workspaceId: WorkspaceId,
  objects: readonly WorkspaceCreatedObject[],
  discoveredAt: string,
  existingMap: WorkspaceRelationshipCandidateMap
): readonly WorkspaceRelationshipCandidate[] {
  const candidates: WorkspaceRelationshipCandidate[] = [];
  for (let sourceIndex = 0; sourceIndex < objects.length; sourceIndex += 1) {
    for (let targetIndex = 0; targetIndex < objects.length; targetIndex += 1) {
      if (sourceIndex === targetIndex) continue;
      const source = objects[sourceIndex];
      const target = objects[targetIndex];
      if (!source || !target) continue;
      const probeType = findDirectionalRule(source, target)?.relationshipType;
      const hasReverseRule = Boolean(findDirectionalRule(target, source));
      if (!probeType && hasReverseRule) continue;
      if (!probeType && source.objectId > target.objectId) continue;

      const candidateId = buildCandidateRelationshipId({
        workspaceId,
        sourceObjectId: source.objectId,
        targetObjectId: target.objectId,
        relationshipType: probeType ?? (source.dataSourceId === target.dataSourceId ? "related_to" : "unknown"),
      });
      candidates.push(
        inferRelationshipCandidate({
          workspaceId,
          source,
          target,
          discoveredAt,
          existingStatus: existingMap[candidateId]?.status,
        })
      );
    }
  }
  return Object.freeze(candidates);
}

export function discoverCandidateRelationships(
  workspaceId: WorkspaceId
): DiscoverCandidateRelationshipsResult {
  hydrateRelationshipCandidateStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      candidates: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before discovering relationship candidates.",
    });
  }

  const objects = getWorkspaceCreatedObjects(trimmedWorkspaceId);
  if (objects.length < 2) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      candidates: Object.freeze([]),
      created: false,
      reason: "insufficient_objects",
      message: "At least two workspace objects are required to discover relationship candidates.",
    });
  }

  const existingMap = relationshipCandidateStore[trimmedWorkspaceId] ?? Object.freeze({});
  const candidates = discoverFromCreatedObjects(
    trimmedWorkspaceId,
    objects,
    nowIso(),
    existingMap
  );
  const nextMap = Object.freeze(
    Object.fromEntries(candidates.map((candidate) => [candidate.candidateRelationshipId, candidate]))
  );

  relationshipCandidateStore = Object.freeze({
    ...relationshipCandidateStore,
    [trimmedWorkspaceId]: nextMap,
  });
  commitRelationshipCandidateChange();
  candidates.forEach(emitRelationshipCandidateDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    candidates: Object.freeze(candidates.map(freezeCandidate)),
    created: true,
    reason: "discovered",
    message: `${candidates.length} relationship candidate${candidates.length === 1 ? "" : "s"} discovered.`,
  });
}

export function getCandidateRelationships(
  workspaceId: WorkspaceId
): readonly WorkspaceRelationshipCandidate[] {
  hydrateRelationshipCandidateStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(relationshipCandidateStore[trimmedWorkspaceId] ?? {}).map(freezeCandidate)
  );
}

export function getCandidateRelationship(
  workspaceId: WorkspaceId,
  candidateRelationshipId: string
): WorkspaceRelationshipCandidate | null {
  hydrateRelationshipCandidateStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedCandidateRelationshipId = candidateRelationshipId.trim();
  if (!trimmedWorkspaceId || !trimmedCandidateRelationshipId) return null;
  const match =
    relationshipCandidateStore[trimmedWorkspaceId]?.[trimmedCandidateRelationshipId] ?? null;
  return match ? freezeCandidate(match) : null;
}

export function subscribeWorkspaceRelationshipCandidateRegistry(
  listener: RelationshipCandidateListener
): () => void {
  hydrateRelationshipCandidateStore();
  relationshipCandidateListeners.add(listener);
  return () => relationshipCandidateListeners.delete(listener);
}

export function getWorkspaceRelationshipCandidateRegistryVersion(): number {
  hydrateRelationshipCandidateStore();
  return relationshipCandidateVersion;
}

export function resetWorkspaceRelationshipCandidateStoreForTests(): void {
  relationshipCandidateStore = {};
  relationshipCandidateHydrated = false;
  relationshipCandidateVersion = 0;
  relationshipCandidateListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
