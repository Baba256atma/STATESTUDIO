/**
 * DS-1:3 — Workspace candidate object discovery engine.
 * Reads DS-1:2 classifications via getColumnClassifications only — discovery only.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import { guardWorkspaceDataSourceAccess } from "./workspaceDataSourceIsolationGuard.ts";
import { resolveWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import { getColumnClassifications } from "./workspaceColumnClassificationEngine.ts";
import type { WorkspaceColumnClassification } from "./workspaceColumnClassificationContract.ts";
import {
  buildWorkspaceCandidateObjectId,
  NEXORA_CANDIDATE_DISCOVERY_LOG_PREFIX,
  WORKSPACE_CANDIDATE_OBJECT_TAGS,
  WORKSPACE_CANDIDATE_OBJECT_VERSION,
  workspaceCandidateObjectIsComplete,
  workspaceDataSourceCandidateObjectProfileIsComplete,
  type DiscoverCandidateObjectsResult,
  type WorkspaceCandidateObject,
  type WorkspaceCandidateObjectStore,
  type WorkspaceCandidateObjectType,
  type WorkspaceDataSourceCandidateObjectProfile,
} from "./workspaceCandidateObjectContract.ts";

const STORAGE_KEY = "nexora.workspaceCandidateObjects.v2";

type CandidateObjectListener = () => void;

const candidateObjectListeners = new Set<CandidateObjectListener>();

let workspaceCandidateObjects: WorkspaceCandidateObjectStore = {};
let candidateObjectHydrated = false;
let candidateObjectVersion = 0;
let candidateObjectUpdatedAt: string | null = null;

const PREFIX_SUFFIX_PATTERN =
  /^([a-z0-9]+)_(id|name|status|region|department|category|type|code|key|email|phone|date|stage|state|city|country|title|label)$/;

function nowIso(): string {
  return new Date().toISOString();
}

function emitCandidateDiscoveryDiagnostic(
  message: string,
  payload: Readonly<{
    workspaceId: string;
    dataSourceId: string;
    candidateId: string;
    objectName: string;
    confidence: number;
    sourceColumns: readonly string[];
  }> & Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("candidateObject", `${NEXORA_CANDIDATE_DISCOVERY_LOG_PREFIX} ${message}`, {
    ...payload,
    tags: WORKSPACE_CANDIDATE_OBJECT_TAGS,
    phase: "DS-1:3",
  });
}

function notifyCandidateObjectListeners(): void {
  candidateObjectVersion += 1;
  candidateObjectListeners.forEach((listener) => listener());
}

function normalizeStoredProfiles(raw: unknown): WorkspaceCandidateObjectStore {
  if (!raw || typeof raw !== "object") return {};

  const normalized: Record<
    WorkspaceId,
    Readonly<Record<string, WorkspaceDataSourceCandidateObjectProfile>>
  > = {};

  for (const [workspaceId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const byDataSource: Record<string, WorkspaceDataSourceCandidateObjectProfile> = {};
      for (const candidate of value as WorkspaceCandidateObject[]) {
        if (!candidate?.dataSourceId || !candidate?.candidateId) continue;
        const existing = byDataSource[candidate.dataSourceId] ?? {
          contractVersion: WORKSPACE_CANDIDATE_OBJECT_VERSION,
          workspaceId,
          dataSourceId: candidate.dataSourceId,
          candidates: {},
          discoveredAt: candidate.discoveredAt,
          updatedAt: candidate.updatedAt,
        };
        byDataSource[candidate.dataSourceId] = Object.freeze({
          ...existing,
          candidates: Object.freeze({
            ...existing.candidates,
            [candidate.candidateId]: candidate,
          }),
        });
      }
      normalized[workspaceId] = Object.freeze(byDataSource);
      continue;
    }
    if (value && typeof value === "object") {
      normalized[workspaceId] = Object.freeze({
        ...(value as Record<string, WorkspaceDataSourceCandidateObjectProfile>),
      });
    }
  }
  return Object.freeze(normalized);
}

function readStorage(): WorkspaceCandidateObjectStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return normalizeStoredProfiles(JSON.parse(raw));
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceCandidateObjects));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function hydrateCandidateObjectStore(): void {
  if (candidateObjectHydrated) return;
  candidateObjectHydrated = true;
  workspaceCandidateObjects = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function normalizeColumnToken(columnName: string): string {
  return columnName
    .trim()
    .toLowerCase()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function extractColumnPrefix(columnName: string): string | null {
  const token = normalizeColumnToken(columnName);
  if (!token) return null;

  const suffixMatch = token.match(PREFIX_SUFFIX_PATTERN);
  if (suffixMatch?.[1]) return suffixMatch[1];

  if (token.endsWith("_id")) return token.slice(0, -3) || null;
  if (token.endsWith("_name")) return token.slice(0, -5) || null;
  if (token.endsWith("_key")) return token.slice(0, -4) || null;
  if (token.endsWith("_code")) return token.slice(0, -5) || null;

  const parts = token.split("_").filter(Boolean);
  if (parts.length >= 2) return parts[0] ?? null;
  return null;
}

function toObjectName(entityToken: string): string {
  if (entityToken === "generic_business_entity") return "Business Entity";
  return entityToken
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isIdentifierRole(role: WorkspaceColumnClassification["businessRole"]): boolean {
  return role === "Identifier";
}

function isNameRole(role: WorkspaceColumnClassification["businessRole"]): boolean {
  return role === "Name";
}

function isSupportingRole(role: WorkspaceColumnClassification["businessRole"]): boolean {
  return (
    role === "Status" ||
    role === "Category" ||
    role === "Location" ||
    role === "Date" ||
    role === "Boolean" ||
    role === "Text"
  );
}

function calculateCandidateConfidence(input: {
  classifications: readonly WorkspaceColumnClassification[];
  candidateType: WorkspaceCandidateObjectType;
}): number {
  const hasIdentifier = input.classifications.some((entry) => isIdentifierRole(entry.businessRole));
  const hasName = input.classifications.some((entry) => isNameRole(entry.businessRole));
  const supportingCount = input.classifications.filter((entry) => isSupportingRole(entry.businessRole)).length;

  let score = 0.2;
  if (hasIdentifier) score += 0.4;
  if (hasName) score += 0.35;
  if (hasIdentifier && hasName) score += 0.1;
  score += Math.min(0.15, supportingCount * 0.05);
  if (input.candidateType === "generic_entity") score = Math.min(score, 0.68);
  return Number(Math.min(1, Math.max(0.2, score)).toFixed(2));
}

function buildCandidateReason(input: {
  objectName: string;
  primaryIdentifier: string | null;
  sourceColumns: readonly string[];
  candidateType: WorkspaceCandidateObjectType;
}): string {
  if (input.candidateType === "generic_entity") {
    return `Classification clustering grouped ${input.sourceColumns.join(", ")} into a generic ${input.objectName} candidate.`;
  }
  if (input.primaryIdentifier) {
    return `Prefix grouping matched ${input.sourceColumns.join(", ")} with primary identifier \`${input.primaryIdentifier}\` to suggest ${input.objectName}.`;
  }
  return `Prefix grouping matched related columns ${input.sourceColumns.join(", ")} to suggest ${input.objectName}.`;
}

function groupClassificationsByPrefix(
  classifications: readonly WorkspaceColumnClassification[]
): Map<string, WorkspaceColumnClassification[]> {
  const groups = new Map<string, WorkspaceColumnClassification[]>();

  for (const classification of classifications) {
    const prefix = extractColumnPrefix(classification.columnName);
    if (!prefix) continue;
    const existing = groups.get(prefix) ?? [];
    existing.push(classification);
    groups.set(prefix, existing);
  }

  return groups;
}

function resolvePrimaryIdentifier(
  classifications: readonly WorkspaceColumnClassification[]
): string | null {
  const identifier = classifications.find((entry) => isIdentifierRole(entry.businessRole));
  if (identifier) return identifier.columnName;
  const idLike = classifications.find((entry) => normalizeColumnToken(entry.columnName).endsWith("_id"));
  return idLike?.columnName ?? null;
}

function freezeCandidate(candidate: WorkspaceCandidateObject): WorkspaceCandidateObject {
  return Object.freeze({
    ...candidate,
    sourceColumns: Object.freeze([...candidate.sourceColumns]),
  });
}

function getDataSourceProfiles(
  workspaceId: WorkspaceId
): Readonly<Record<string, WorkspaceDataSourceCandidateObjectProfile>> {
  return workspaceCandidateObjects[workspaceId] ?? Object.freeze({});
}

function commitCandidateChange(timestamp = nowIso()): void {
  candidateObjectUpdatedAt = timestamp;
  writeStorage();
  notifyCandidateObjectListeners();
}

function guardCandidateRead(workspaceId: WorkspaceId, dataSourceId?: string | null): boolean {
  const trimmedDataSourceId = dataSourceId?.trim() ?? null;
  if (!trimmedDataSourceId) {
    return guardWorkspaceDataSourceAccess({ action: "read", workspaceId }).allowed;
  }

  const dataSource = resolveWorkspaceDataSource(workspaceId, trimmedDataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: "read",
      workspaceId,
      dataSource,
      dataSourceId: trimmedDataSourceId,
    }).allowed;
  }

  return guardWorkspaceDataSourceAccess({ action: "read", workspaceId }).allowed;
}

function guardCandidateWrite(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  isCreate: boolean
): boolean {
  const dataSource = resolveWorkspaceDataSource(workspaceId, dataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: isCreate ? "import" : "update",
      workspaceId,
      dataSource,
      dataSourceId,
    }).allowed;
  }

  return guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
    dataSourceId,
  }).allowed;
}

export function discoverCandidateObjectsFromClassifications(input: {
  workspaceId: WorkspaceId;
  dataSourceId: string;
  classifications: readonly WorkspaceColumnClassification[];
  discoveredAt?: string;
}): readonly WorkspaceCandidateObject[] {
  const timestamp = input.discoveredAt ?? nowIso();
  const prefixGroups = groupClassificationsByPrefix(input.classifications);
  const candidates: WorkspaceCandidateObject[] = [];
  const usedColumns = new Set<string>();

  for (const [prefix, group] of prefixGroups.entries()) {
    const hasIdentifier = group.some((entry) => isIdentifierRole(entry.businessRole));
    const hasName = group.some((entry) => isNameRole(entry.businessRole));
    if (group.length < 2 && !hasIdentifier && !hasName) continue;

    const sourceColumns = Object.freeze(
      group.map((entry) => entry.columnName).sort((left, right) => left.localeCompare(right))
    );
    for (const columnName of sourceColumns) usedColumns.add(columnName);

    const primaryIdentifier = resolvePrimaryIdentifier(group);
    const objectName = toObjectName(prefix);
    const candidateType: WorkspaceCandidateObjectType = "prefixed_entity";
    const confidence = calculateCandidateConfidence({ classifications: group, candidateType });
    const candidateId = buildWorkspaceCandidateObjectId({
      workspaceId: input.workspaceId,
      dataSourceId: input.dataSourceId,
      entityToken: prefix,
    });

    candidates.push(
      freezeCandidate(
        Object.freeze({
          contractVersion: WORKSPACE_CANDIDATE_OBJECT_VERSION,
          candidateId,
          workspaceId: input.workspaceId,
          dataSourceId: input.dataSourceId,
          objectName,
          confidence,
          reason: buildCandidateReason({
            objectName,
            primaryIdentifier,
            sourceColumns,
            candidateType,
          }),
          sourceColumns,
          primaryIdentifier,
          candidateType,
          discoveredAt: timestamp,
          updatedAt: timestamp,
          status: "suggested",
        })
      )
    );
  }

  if (candidates.length === 0) {
    const remaining = input.classifications.filter((entry) => !usedColumns.has(entry.columnName));
    const identifiers = remaining.filter((entry) => isIdentifierRole(entry.businessRole));
    const names = remaining.filter((entry) => isNameRole(entry.businessRole));
    const statuses = remaining.filter((entry) => entry.businessRole === "Status");
    const cluster = Object.freeze([
      ...identifiers.slice(0, 1),
      ...names.slice(0, 1),
      ...statuses.slice(0, 1),
    ]);

    if (cluster.length >= 2 || identifiers.length > 0) {
      const sourceColumns = Object.freeze(
        [...new Set(cluster.map((entry) => entry.columnName))].sort((left, right) =>
          left.localeCompare(right)
        )
      );
      const candidateType: WorkspaceCandidateObjectType = "generic_entity";
      const objectName = "Business Entity";
      const confidence = calculateCandidateConfidence({ classifications: cluster, candidateType });
      candidates.push(
        freezeCandidate(
          Object.freeze({
            contractVersion: WORKSPACE_CANDIDATE_OBJECT_VERSION,
            candidateId: buildWorkspaceCandidateObjectId({
              workspaceId: input.workspaceId,
              dataSourceId: input.dataSourceId,
              entityToken: "generic_business_entity",
            }),
            workspaceId: input.workspaceId,
            dataSourceId: input.dataSourceId,
            objectName,
            confidence,
            reason: buildCandidateReason({
              objectName,
              primaryIdentifier: resolvePrimaryIdentifier(cluster),
              sourceColumns,
              candidateType,
            }),
            sourceColumns,
            primaryIdentifier: resolvePrimaryIdentifier(cluster),
            candidateType,
            discoveredAt: timestamp,
            updatedAt: timestamp,
            status: "suggested",
          })
        )
      );
    }
  }

  return Object.freeze(candidates);
}

export function discoverCandidateObjects(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  options?: { classifications?: readonly WorkspaceColumnClassification[] }
): DiscoverCandidateObjectsResult {
  hydrateCandidateObjectStore();

  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({
      success: false,
      candidates: Object.freeze([]),
      reason: "missing_identifier",
      created: false,
    });
  }

  const current = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  if (!guardCandidateWrite(trimmedWorkspaceId, trimmedDataSourceId, !current)) {
    return Object.freeze({
      success: false,
      candidates: Object.freeze([]),
      reason: "access_denied",
      created: false,
    });
  }

  const classifications =
    options?.classifications ??
    getColumnClassifications(trimmedWorkspaceId, trimmedDataSourceId);
  if (classifications.length === 0) {
    return Object.freeze({
      success: false,
      candidates: Object.freeze([]),
      reason: "classifications_not_found",
      created: false,
    });
  }

  const timestamp = nowIso();
  const discovered = discoverCandidateObjectsFromClassifications({
    workspaceId: trimmedWorkspaceId,
    dataSourceId: trimmedDataSourceId,
    classifications,
    discoveredAt: timestamp,
  });

  const candidatesMap: Record<string, WorkspaceCandidateObject> = {};
  for (const candidate of discovered) {
    candidatesMap[candidate.candidateId] = candidate;
    emitCandidateDiscoveryDiagnostic("Candidate Discovered", {
      workspaceId: trimmedWorkspaceId,
      dataSourceId: trimmedDataSourceId,
      candidateId: candidate.candidateId,
      objectName: candidate.objectName,
      confidence: candidate.confidence,
      sourceColumns: candidate.sourceColumns,
      reason: candidate.reason,
      primaryIdentifier: candidate.primaryIdentifier,
    });
  }

  const nextProfile = Object.freeze({
    contractVersion: WORKSPACE_CANDIDATE_OBJECT_VERSION,
    workspaceId: trimmedWorkspaceId,
    dataSourceId: trimmedDataSourceId,
    candidates: Object.freeze(candidatesMap),
    discoveredAt: current?.discoveredAt ?? timestamp,
    updatedAt: timestamp,
  });

  if (!workspaceDataSourceCandidateObjectProfileIsComplete(nextProfile)) {
    return Object.freeze({
      success: false,
      candidates: Object.freeze([]),
      reason: "invalid_candidate_profile",
      created: false,
    });
  }

  workspaceCandidateObjects = Object.freeze({
    ...workspaceCandidateObjects,
    [trimmedWorkspaceId]: Object.freeze({
      ...getDataSourceProfiles(trimmedWorkspaceId),
      [trimmedDataSourceId]: nextProfile,
    }),
  });
  commitCandidateChange(timestamp);

  return Object.freeze({
    success: true,
    candidates: discovered,
    reason: current ? "updated" : "created",
    created: !current,
  });
}

export function getCandidateObjects(
  workspaceId: WorkspaceId,
  dataSourceId: string
): readonly WorkspaceCandidateObject[] {
  hydrateCandidateObjectStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return Object.freeze([]);
  if (!guardCandidateRead(trimmedWorkspaceId, trimmedDataSourceId)) return Object.freeze([]);

  const profile = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  if (!profile) return Object.freeze([]);
  return Object.freeze(Object.values(profile.candidates).map(freezeCandidate));
}

export function getCandidateObject(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  candidateId: string
): WorkspaceCandidateObject | null {
  hydrateCandidateObjectStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  const trimmedCandidateId = candidateId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId || !trimmedCandidateId) return null;
  if (!guardCandidateRead(trimmedWorkspaceId, trimmedDataSourceId)) return null;

  const match =
    getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId]?.candidates[trimmedCandidateId] ??
    null;
  return match ? freezeCandidate(match) : null;
}

export function removeWorkspaceCandidateObjectsForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): DiscoverCandidateObjectsResult {
  hydrateCandidateObjectStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({
      success: false,
      candidates: Object.freeze([]),
      reason: "missing_identifier",
      created: false,
    });
  }

  const current = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  if (!current) {
    return Object.freeze({
      success: false,
      candidates: Object.freeze([]),
      reason: "candidates_not_found",
      created: false,
    });
  }

  const { [trimmedDataSourceId]: _removed, ...remaining } = getDataSourceProfiles(trimmedWorkspaceId);
  workspaceCandidateObjects = Object.freeze({
    ...workspaceCandidateObjects,
    [trimmedWorkspaceId]: Object.freeze(remaining),
  });
  commitCandidateChange();

  return Object.freeze({
    success: true,
    candidates: Object.freeze(Object.values(current.candidates).map(freezeCandidate)),
    reason: "removed",
    created: false,
  });
}

export function resetWorkspaceCandidateObjectStoreForTests(): void {
  workspaceCandidateObjects = {};
  candidateObjectHydrated = false;
  candidateObjectVersion = 0;
  candidateObjectUpdatedAt = null;
  candidateObjectListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("nexora.workspaceCandidateObjects.v1");
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function getWorkspaceCandidateObjectRegistryVersion(): number {
  hydrateCandidateObjectStore();
  return candidateObjectVersion;
}

export function listWorkspaceCandidateObjectProfiles(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceDataSourceCandidateObjectProfile[] {
  hydrateCandidateObjectStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId || !guardCandidateRead(resolvedWorkspaceId)) return Object.freeze([]);
  return Object.freeze(Object.values(getDataSourceProfiles(resolvedWorkspaceId)));
}

export function subscribeWorkspaceCandidateObjectRegistry(
  listener: CandidateObjectListener
): () => void {
  hydrateCandidateObjectStore();
  candidateObjectListeners.add(listener);
  return () => candidateObjectListeners.delete(listener);
}
