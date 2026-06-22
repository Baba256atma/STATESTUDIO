/**
 * DS-1:4 — Workspace object approval runtime.
 * Reads candidate objects via getCandidateObjects only — approval workflow only.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import { guardWorkspaceDataSourceAccess } from "./workspaceDataSourceIsolationGuard.ts";
import { resolveWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import {
  getCandidateObjects,
  listWorkspaceCandidateObjectProfiles,
} from "./workspaceCandidateObjectDiscoveryEngine.ts";
import type { WorkspaceCandidateObject } from "./workspaceCandidateObjectContract.ts";
import {
  NEXORA_OBJECT_APPROVAL_LOG_PREFIX,
  WORKSPACE_OBJECT_APPROVAL_TAGS,
  WORKSPACE_OBJECT_APPROVAL_VERSION,
  workspaceCandidateApprovalStateIsComplete,
  type WorkspaceCandidateApprovalAction,
  type WorkspaceCandidateApprovalMutationResult,
  type   WorkspaceCandidateApprovalState,
  type WorkspaceCandidateApprovalStatus,
  type WorkspaceDataSourceCandidateApprovalProfile,
  type WorkspaceObjectApprovalStore,
} from "./workspaceObjectApprovalContract.ts";

const STORAGE_KEY = "nexora.workspaceObjectApprovals.v2";

type ObjectApprovalListener = () => void;

const objectApprovalListeners = new Set<ObjectApprovalListener>();

let workspaceObjectApprovals: WorkspaceObjectApprovalStore = {};
let objectApprovalHydrated = false;
let objectApprovalVersion = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function emitNexoraObjectApprovalDiagnostic(
  message: string,
  payload: Readonly<{
    workspaceId: string;
    dataSourceId: string;
    candidateId: string;
    action: WorkspaceCandidateApprovalAction;
    oldStatus: WorkspaceCandidateApprovalStatus;
    newStatus: WorkspaceCandidateApprovalStatus;
  }> & Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("objectApproval", `${NEXORA_OBJECT_APPROVAL_LOG_PREFIX} ${message}`, {
    ...payload,
    tags: WORKSPACE_OBJECT_APPROVAL_TAGS,
    phase: "DS-1:4",
  });
}

function notifyObjectApprovalListeners(): void {
  objectApprovalVersion += 1;
  objectApprovalListeners.forEach((listener) => listener());
}

function normalizeStoredProfiles(raw: unknown): WorkspaceObjectApprovalStore {
  if (!raw || typeof raw !== "object") return {};

  const normalized: Record<
    WorkspaceId,
    Readonly<Record<string, WorkspaceDataSourceCandidateApprovalProfile>>
  > = {};
  for (const [workspaceId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const byDataSource: Record<string, { approvals: Record<string, WorkspaceCandidateApprovalState> }> =
        {};
      for (const record of value as WorkspaceCandidateApprovalState[]) {
        if (!record?.dataSourceId || !record?.candidateId) continue;
        const existing = byDataSource[record.dataSourceId] ?? { approvals: {} };
        existing.approvals[record.candidateId] = record;
        byDataSource[record.dataSourceId] = existing;
      }
      normalized[workspaceId] = Object.freeze(
        Object.fromEntries(
          Object.entries(byDataSource).map(([dataSourceId, profile]) => [
            dataSourceId,
            Object.freeze({
              contractVersion: WORKSPACE_OBJECT_APPROVAL_VERSION,
              workspaceId,
              dataSourceId,
              approvals: Object.freeze(profile.approvals),
              updatedAt: nowIso(),
            }),
          ])
        ) as Record<string, WorkspaceDataSourceCandidateApprovalProfile>
      );
      continue;
    }
    if (value && typeof value === "object") {
      normalized[workspaceId] = Object.freeze({
        ...(value as Record<string, WorkspaceDataSourceCandidateApprovalProfile>),
      });
    }
  }
  return Object.freeze(normalized);
}

function readStorage(): WorkspaceObjectApprovalStore {
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceObjectApprovals));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function hydrateObjectApprovalStore(): void {
  if (objectApprovalHydrated) return;
  objectApprovalHydrated = true;
  workspaceObjectApprovals = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function getDataSourceProfiles(
  workspaceId: WorkspaceId
): Readonly<Record<string, WorkspaceDataSourceCandidateApprovalProfile>> {
  return workspaceObjectApprovals[workspaceId] ?? Object.freeze({});
}

function freezeApprovalState(
  state: WorkspaceCandidateApprovalState
): WorkspaceCandidateApprovalState {
  return Object.freeze({
    ...state,
    sourceColumns: Object.freeze([...state.sourceColumns]),
  });
}

function commitApprovalChange(): void {
  writeStorage();
  notifyObjectApprovalListeners();
}

function guardApprovalRead(workspaceId: WorkspaceId, dataSourceId?: string | null): boolean {
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

function guardApprovalWrite(
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

function buildApprovalStateFromCandidate(
  candidate: WorkspaceCandidateObject,
  existing?: WorkspaceCandidateApprovalState | null
): WorkspaceCandidateApprovalState {
  const timestamp = nowIso();
  return freezeApprovalState(
    Object.freeze({
      contractVersion: WORKSPACE_OBJECT_APPROVAL_VERSION,
      workspaceId: candidate.workspaceId,
      dataSourceId: candidate.dataSourceId,
      candidateId: candidate.candidateId,
      objectName: existing?.objectName ?? candidate.objectName,
      originalObjectName: existing?.originalObjectName ?? candidate.objectName,
      status: existing?.status ?? "suggested",
      confidence: candidate.confidence,
      primaryIdentifier: candidate.primaryIdentifier,
      sourceColumns: Object.freeze([...candidate.sourceColumns]),
      sourceColumnCount: candidate.sourceColumns.length,
      reason: candidate.reason,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: existing?.updatedAt ?? timestamp,
    })
  );
}

export function syncApprovalStatesForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): readonly WorkspaceCandidateApprovalState[] {
  hydrateObjectApprovalStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return Object.freeze([]);
  if (!guardApprovalRead(trimmedWorkspaceId, trimmedDataSourceId)) return Object.freeze([]);

  const candidates = getCandidateObjects(trimmedWorkspaceId, trimmedDataSourceId);
  const existing = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId]?.approvals ?? {};
  const nextApprovals: Record<string, WorkspaceCandidateApprovalState> = {};

  for (const candidate of candidates) {
    nextApprovals[candidate.candidateId] = buildApprovalStateFromCandidate(
      candidate,
      existing[candidate.candidateId] ?? null
    );
  }

  const nextProfile = Object.freeze({
    contractVersion: WORKSPACE_OBJECT_APPROVAL_VERSION,
    workspaceId: trimmedWorkspaceId,
    dataSourceId: trimmedDataSourceId,
    approvals: Object.freeze(nextApprovals),
    updatedAt: nowIso(),
  });

  workspaceObjectApprovals = Object.freeze({
    ...workspaceObjectApprovals,
    [trimmedWorkspaceId]: Object.freeze({
      ...getDataSourceProfiles(trimmedWorkspaceId),
      [trimmedDataSourceId]: nextProfile,
    }),
  });
  commitApprovalChange();
  return Object.freeze(Object.values(nextApprovals).map(freezeApprovalState));
}

export function syncApprovalStatesForWorkspace(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceCandidateApprovalState[] {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);

  const profiles = listWorkspaceCandidateObjectProfiles(resolvedWorkspaceId);
  const synced: WorkspaceCandidateApprovalState[] = [];
  for (const profile of profiles) {
    synced.push(...syncApprovalStatesForDataSource(resolvedWorkspaceId, profile.dataSourceId));
  }
  return Object.freeze(synced.map(freezeApprovalState));
}

function findApprovalState(
  workspaceId: WorkspaceId,
  candidateId: string
): WorkspaceCandidateApprovalState | null {
  hydrateObjectApprovalStore();
  const trimmedCandidateId = candidateId.trim();
  for (const profile of Object.values(getDataSourceProfiles(workspaceId))) {
    const match = profile.approvals[trimmedCandidateId] ?? null;
    if (match) return freezeApprovalState(match);
  }
  return null;
}

function updateApprovalState(input: {
  workspaceId: WorkspaceId;
  dataSourceId: string;
  candidateId: string;
  action: WorkspaceCandidateApprovalAction;
  updater: (
    state: WorkspaceCandidateApprovalState
  ) => WorkspaceCandidateApprovalState;
}): WorkspaceCandidateApprovalMutationResult {
  syncApprovalStatesForDataSource(input.workspaceId, input.dataSourceId);

  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedDataSourceId = input.dataSourceId.trim();
  const trimmedCandidateId = input.candidateId.trim();
  const profile = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  const current = profile?.approvals[trimmedCandidateId] ?? null;

  if (!current) {
    return Object.freeze({
      success: false,
      state: null,
      reason: "approval_not_found",
    });
  }

  if (!guardApprovalWrite(trimmedWorkspaceId, trimmedDataSourceId, false)) {
    return Object.freeze({
      success: false,
      state: null,
      reason: "access_denied",
    });
  }

  const oldStatus = current.status;
  const next = freezeApprovalState(
    input.updater(Object.freeze({ ...current, updatedAt: nowIso() }))
  );

  if (!workspaceCandidateApprovalStateIsComplete(next)) {
    return Object.freeze({
      success: false,
      state: null,
      reason: "invalid_approval_state",
    });
  }

  workspaceObjectApprovals = Object.freeze({
    ...workspaceObjectApprovals,
    [trimmedWorkspaceId]: Object.freeze({
      ...getDataSourceProfiles(trimmedWorkspaceId),
      [trimmedDataSourceId]: Object.freeze({
        contractVersion: WORKSPACE_OBJECT_APPROVAL_VERSION,
        workspaceId: trimmedWorkspaceId,
        dataSourceId: trimmedDataSourceId,
        approvals: Object.freeze({
          ...(profile?.approvals ?? {}),
          [trimmedCandidateId]: next,
        }),
        updatedAt: next.updatedAt,
      }),
    }),
  });
  commitApprovalChange();

  emitNexoraObjectApprovalDiagnostic(`Candidate ${input.action}`, {
    workspaceId: trimmedWorkspaceId,
    dataSourceId: trimmedDataSourceId,
    candidateId: trimmedCandidateId,
    action: input.action,
    oldStatus,
    newStatus: next.status,
    objectName: next.objectName,
  });

  return Object.freeze({
    success: true,
    state: next,
    reason: input.action,
  });
}

export function approveCandidateObject(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  candidateId: string
): WorkspaceCandidateApprovalMutationResult {
  return updateApprovalState({
    workspaceId,
    dataSourceId,
    candidateId,
    action: "approve",
    updater: (state) => Object.freeze({ ...state, status: "approved" }),
  });
}

export function rejectCandidateObject(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  candidateId: string
): WorkspaceCandidateApprovalMutationResult {
  return updateApprovalState({
    workspaceId,
    dataSourceId,
    candidateId,
    action: "reject",
    updater: (state) => Object.freeze({ ...state, status: "rejected" }),
  });
}

export function renameCandidateObject(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  candidateId: string,
  newName: string
): WorkspaceCandidateApprovalMutationResult {
  const trimmedName = newName.trim();
  if (!trimmedName) {
    return Object.freeze({
      success: false,
      state: null,
      reason: "missing_name",
    });
  }

  return updateApprovalState({
    workspaceId,
    dataSourceId,
    candidateId,
    action: "rename",
    updater: (state) => Object.freeze({ ...state, objectName: trimmedName }),
  });
}

export function getCandidateApprovalStates(
  workspaceId: WorkspaceId,
  dataSourceId: string
): readonly WorkspaceCandidateApprovalState[] {
  hydrateObjectApprovalStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return Object.freeze([]);
  if (!guardApprovalRead(trimmedWorkspaceId, trimmedDataSourceId)) return Object.freeze([]);

  syncApprovalStatesForDataSource(trimmedWorkspaceId, trimmedDataSourceId);
  const profile = getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  if (!profile) return Object.freeze([]);
  return Object.freeze(Object.values(profile.approvals).map(freezeApprovalState));
}

export function getApprovedCandidates(
  workspaceId: WorkspaceId,
  dataSourceId?: string | null
): readonly WorkspaceCandidateApprovalState[] {
  hydrateObjectApprovalStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId || !guardApprovalRead(trimmedWorkspaceId)) return Object.freeze([]);

  syncApprovalStatesForWorkspace(trimmedWorkspaceId);
  const trimmedDataSourceId = dataSourceId?.trim() ?? null;
  const profiles = trimmedDataSourceId
    ? [getDataSourceProfiles(trimmedWorkspaceId)[trimmedDataSourceId]].filter(Boolean)
    : Object.values(getDataSourceProfiles(trimmedWorkspaceId));

  return Object.freeze(
    profiles
      .flatMap((profile) => Object.values(profile?.approvals ?? {}))
      .filter((state) => state.status === "approved")
      .map(freezeApprovalState)
  );
}

export function getCandidateApprovalState(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  candidateId: string
): WorkspaceCandidateApprovalState | null {
  return (
    getCandidateApprovalStates(workspaceId, dataSourceId).find(
      (state) => state.candidateId === candidateId.trim()
    ) ?? null
  );
}

export function removeWorkspaceObjectApprovalStatesForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): void {
  hydrateObjectApprovalStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return;

  const { [trimmedDataSourceId]: _removed, ...remaining } = getDataSourceProfiles(trimmedWorkspaceId);
  workspaceObjectApprovals = Object.freeze({
    ...workspaceObjectApprovals,
    [trimmedWorkspaceId]: Object.freeze(remaining),
  });
  commitApprovalChange();
}

export function subscribeWorkspaceObjectApprovalRegistry(
  listener: ObjectApprovalListener
): () => void {
  hydrateObjectApprovalStore();
  objectApprovalListeners.add(listener);
  return () => objectApprovalListeners.delete(listener);
}

export function getWorkspaceObjectApprovalRegistryVersion(): number {
  hydrateObjectApprovalStore();
  return objectApprovalVersion;
}

export function resetWorkspaceObjectApprovalStoreForTests(): void {
  workspaceObjectApprovals = {};
  objectApprovalHydrated = false;
  objectApprovalVersion = 0;
  objectApprovalListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("nexora.workspaceObjectApprovals.v1");
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function findCandidateApprovalStateById(
  workspaceId: WorkspaceId,
  candidateId: string
): WorkspaceCandidateApprovalState | null {
  syncApprovalStatesForWorkspace(workspaceId);
  return findApprovalState(workspaceId, candidateId);
}
