/** Workspace-scoped atomic commit store for prepared RDI:2 imports. */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  CsvImportFlowState,
  CsvMappingReview,
  CsvParseResult,
  CsvPreparedImport,
  CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";
import { csvCanonicalSourceContextId } from "./csvRealDataVerticalSlice.ts";

export type CsvReimportMode = "new" | "replace" | "cancel";

export type CsvCommittedImport = Readonly<{
  workspaceId: WorkspaceId;
  sourceContextId: string;
  importId: string;
  committedAt: string;
  prepared: CsvPreparedImport;
}>;

export type CsvImportCommitResult = Readonly<{
  committed: boolean;
  reason:
    | "committed"
    | "replaced"
    | "cancelled"
    | "not_ready"
    | "workspace_mismatch"
    | "source_exists";
  previous: CsvCommittedImport | null;
  current: CsvCommittedImport | null;
}>;

export type CsvImportRemoveResult = Readonly<{
  removed: boolean;
  reason: "removed" | "not_found" | "workspace_mismatch" | "active_source";
  removedImport: CsvCommittedImport | null;
  historicalReference: CsvRemovedSourceReference | null;
}>;

/** Uncommitted review. Not Data Reality. Identity matches canonical CSV sourceContextId. */
export type CsvImportCandidate = Readonly<{
  workspaceId: WorkspaceId;
  candidateId: string;
  fileName: string;
  status: CsvImportFlowState;
  input: CsvVerticalSliceInput;
  parse: CsvParseResult | null;
  mapping: CsvMappingReview | null;
  prepared: CsvPreparedImport | null;
  error: string | null;
  replacementSourceContextId: string | null;
}>;

export type SaveCsvImportCandidateResult = Readonly<{
  saved: boolean;
  reason: "saved" | "pending_duplicate";
  candidate: CsvImportCandidate;
  existing: CsvImportCandidate | null;
}>;

export function csvImportCandidateId(workspaceId: WorkspaceId, fileName: string): string {
  return csvCanonicalSourceContextId(workspaceId, fileName);
}

export type CsvRemovedSourceReference = Readonly<{
  workspaceId: WorkspaceId;
  sourceId: string;
  importId: string;
  label: string;
  sourceType: "csv";
  snapshotRef: string | null;
  mappingId: string;
  removedAt: string;
  historical: true;
  suppliesCurrentReality: false;
  transfersSemanticConfirmation: false;
}>;

export type CsvStoreLifecycleKind = "commit" | "remove" | "save-candidate" | "discard" | "hydrate" | "clear";

type CsvImportListener = () => void;
const listeners = new Set<CsvImportListener>();
const persistHooks = new Set<() => void>();
let committedByWorkspace: Readonly<Record<WorkspaceId, Readonly<Record<string, CsvCommittedImport>>>> = Object.freeze({});
let removedByWorkspace: Readonly<Record<WorkspaceId, Readonly<Record<string, CsvRemovedSourceReference>>>> = Object.freeze({});
let pendingByWorkspace: Readonly<Record<WorkspaceId, Readonly<Record<string, CsvImportCandidate>>>> = Object.freeze({});
let version = 0;
let commitInvocationCount = 0;
let lastLifecycleKind: CsvStoreLifecycleKind | null = null;

function notify(kind: CsvStoreLifecycleKind): void {
  lastLifecycleKind = kind;
  version += 1;
  listeners.forEach((listener) => listener());
  if (kind !== "hydrate" && kind !== "clear") {
    persistHooks.forEach((hook) => hook());
  }
}

function publish(next: typeof committedByWorkspace, kind: CsvStoreLifecycleKind = "commit"): void {
  committedByWorkspace = Object.freeze(next);
  notify(kind);
}

function freezeWorkspaceMap<T>(entries: Readonly<Record<string, T>>): Readonly<Record<string, T>> {
  return Object.freeze({ ...entries });
}

export function subscribeCsvRealDataImports(listener: CsvImportListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCsvRealDataImportVersion(): number {
  return version;
}

export function listCsvRealDataImports(workspaceId: WorkspaceId): readonly CsvCommittedImport[] {
  const imports = Object.values(committedByWorkspace[workspaceId] ?? {});
  return Object.freeze([...imports].sort((a, b) => a.sourceContextId.localeCompare(b.sourceContextId)));
}

export function getCsvRealDataImport(
  workspaceId: WorkspaceId,
  sourceContextId: string,
): CsvCommittedImport | null {
  return committedByWorkspace[workspaceId]?.[sourceContextId] ?? null;
}

export function listCsvRemovedSourceReferences(workspaceId: WorkspaceId): readonly CsvRemovedSourceReference[] {
  const refs = Object.values(removedByWorkspace[workspaceId] ?? {});
  return Object.freeze([...refs].sort((a, b) => a.sourceId.localeCompare(b.sourceId)));
}

export function getCsvRemovedSourceReference(
  workspaceId: WorkspaceId,
  sourceId: string,
): CsvRemovedSourceReference | null {
  return removedByWorkspace[workspaceId]?.[sourceId] ?? null;
}

export function listCsvImportCandidates(workspaceId: WorkspaceId): readonly CsvImportCandidate[] {
  const candidates = Object.values(pendingByWorkspace[workspaceId] ?? {}).filter((entry) => !entry.replacementSourceContextId);
  return Object.freeze([...candidates].sort((a, b) => a.candidateId.localeCompare(b.candidateId)));
}

export function getCsvImportCandidate(workspaceId: WorkspaceId, candidateId: string): CsvImportCandidate | null {
  return pendingByWorkspace[workspaceId]?.[candidateId] ?? null;
}

export function saveCsvImportCandidate(
  candidate: CsvImportCandidate,
  options?: Readonly<{ replaceCandidateId?: string | null }>,
): SaveCsvImportCandidateResult {
  const current = pendingByWorkspace[candidate.workspaceId] ?? {};
  const occupant = current[candidate.candidateId] ?? null;
  if (occupant && occupant.input.importId !== candidate.input.importId && options?.replaceCandidateId !== candidate.candidateId) {
    return Object.freeze({ saved: false, reason: "pending_duplicate", candidate, existing: occupant });
  }
  const workspace = { ...current };
  if (options?.replaceCandidateId && options.replaceCandidateId !== candidate.candidateId) {
    delete workspace[options.replaceCandidateId];
  }
  workspace[candidate.candidateId] = Object.freeze(candidate);
  pendingByWorkspace = Object.freeze({
    ...pendingByWorkspace,
    [candidate.workspaceId]: Object.freeze(workspace),
  });
  notify("save-candidate");
  return Object.freeze({ saved: true, reason: "saved", candidate, existing: occupant });
}

export function discardCsvImportCandidate(workspaceId: WorkspaceId, candidateId: string): CsvImportCandidate | null {
  const workspace = { ...(pendingByWorkspace[workspaceId] ?? {}) };
  const existing = workspace[candidateId] ?? null;
  if (!existing) return null;
  delete workspace[candidateId];
  pendingByWorkspace = Object.freeze({
    ...pendingByWorkspace,
    [workspaceId]: Object.freeze(workspace),
  });
  notify("discard");
  return existing;
}

/**
 * Prepare happens outside this function. Publication is one assignment after
 * every guard succeeds, so an invalid/failed replacement preserves prior truth.
 */
export function commitPreparedCsvRealDataImport(input: Readonly<{
  prepared: CsvPreparedImport;
  expectedWorkspaceId: WorkspaceId;
  mode: CsvReimportMode;
  committedAt: string;
}>): CsvImportCommitResult {
  const existing = getCsvRealDataImport(input.expectedWorkspaceId, input.prepared.sourceContextId);
  if (input.mode === "cancel") {
    return Object.freeze({ committed: false, reason: "cancelled", previous: existing, current: existing });
  }
  if (!input.prepared.ready || !input.prepared.handoff || !input.prepared.dataReality || !input.prepared.runtime || !input.prepared.advisor) {
    return Object.freeze({ committed: false, reason: "not_ready", previous: existing, current: existing });
  }
  if (input.prepared.workspaceId !== input.expectedWorkspaceId || input.prepared.handoff.workspaceId !== input.expectedWorkspaceId) {
    return Object.freeze({ committed: false, reason: "workspace_mismatch", previous: existing, current: existing });
  }
  if (existing && input.mode === "new") {
    return Object.freeze({ committed: false, reason: "source_exists", previous: existing, current: existing });
  }

  const committed: CsvCommittedImport = Object.freeze({
    workspaceId: input.expectedWorkspaceId,
    sourceContextId: input.prepared.sourceContextId,
    importId: input.prepared.importId,
    committedAt: input.committedAt,
    prepared: input.prepared,
  });
  const workspaceImports = Object.freeze({
    ...(committedByWorkspace[input.expectedWorkspaceId] ?? {}),
    [input.prepared.sourceContextId]: committed,
  });
  const workspacePending = { ...(pendingByWorkspace[input.expectedWorkspaceId] ?? {}) };
  delete workspacePending[input.prepared.sourceContextId];
  pendingByWorkspace = Object.freeze({
    ...pendingByWorkspace,
    [input.expectedWorkspaceId]: Object.freeze(workspacePending),
  });
  commitInvocationCount += 1;
  publish({ ...committedByWorkspace, [input.expectedWorkspaceId]: workspaceImports }, "commit");
  return Object.freeze({ committed: true, reason: existing ? "replaced" : "committed", previous: existing, current: committed });
}

/**
 * Remove a committed source after DATA-UX:5 review. The store is the only
 * lifecycle writer. Active sources stay refused unless the manager already
 * confirmed destructive removal. Historical references are not active sources.
 */
export function removeCsvRealDataImport(input: Readonly<{
  workspaceId: WorkspaceId;
  sourceContextId: string;
  activeSourceContextId: string | null;
  confirmedActiveRemoval?: boolean;
  removedAt?: string;
}>): CsvImportRemoveResult {
  const existing = getCsvRealDataImport(input.workspaceId, input.sourceContextId);
  if (!existing) {
    return Object.freeze({
      removed: false,
      reason: "not_found",
      removedImport: null,
      historicalReference: null,
    });
  }
  if (existing.workspaceId !== input.workspaceId) {
    return Object.freeze({
      removed: false,
      reason: "workspace_mismatch",
      removedImport: null,
      historicalReference: null,
    });
  }
  if (
    input.activeSourceContextId === input.sourceContextId &&
    input.confirmedActiveRemoval !== true
  ) {
    return Object.freeze({
      removed: false,
      reason: "active_source",
      removedImport: existing,
      historicalReference: null,
    });
  }
  const historicalReference: CsvRemovedSourceReference = Object.freeze({
    workspaceId: existing.workspaceId,
    sourceId: existing.sourceContextId,
    importId: existing.importId,
    label: existing.prepared.fileName,
    sourceType: "csv" as const,
    snapshotRef: existing.prepared.handoff?.sourceSnapshotId ?? existing.prepared.snapshot?.snapshotId ?? null,
    mappingId: existing.prepared.mapping.mappingId,
    removedAt: input.removedAt ?? existing.committedAt,
    historical: true as const,
    suppliesCurrentReality: false as const,
    transfersSemanticConfirmation: false as const,
  });
  const workspaceImports = { ...(committedByWorkspace[input.workspaceId] ?? {}) };
  delete workspaceImports[input.sourceContextId];
  const workspaceHistory = Object.freeze({
    ...(removedByWorkspace[input.workspaceId] ?? {}),
    [input.sourceContextId]: historicalReference,
  });
  committedByWorkspace = Object.freeze({
    ...committedByWorkspace,
    [input.workspaceId]: Object.freeze(workspaceImports),
  });
  removedByWorkspace = Object.freeze({
    ...removedByWorkspace,
    [input.workspaceId]: workspaceHistory,
  });
  notify("remove");
  return Object.freeze({
    removed: true,
    reason: "removed",
    removedImport: existing,
    historicalReference,
  });
}

export function getCsvRealDataImportCommitInvocationCount(): number {
  return commitInvocationCount;
}

export function getCsvRealDataImportLastLifecycleKind(): CsvStoreLifecycleKind | null {
  return lastLifecycleKind;
}

export function registerCsvDurabilityPersistHook(hook: () => void): () => void {
  persistHooks.add(hook);
  return () => persistHooks.delete(hook);
}

export type CsvRealDataImportExportedState = Readonly<{
  committed: readonly CsvCommittedImport[];
  pending: readonly CsvImportCandidate[];
  removed: readonly CsvRemovedSourceReference[];
}>;

export function exportCsvRealDataImportState(): CsvRealDataImportExportedState {
  return Object.freeze({
    committed: Object.freeze(Object.values(committedByWorkspace).flatMap((workspace) => Object.values(workspace))),
    pending: Object.freeze(Object.values(pendingByWorkspace).flatMap((workspace) => Object.values(workspace))),
    removed: Object.freeze(Object.values(removedByWorkspace).flatMap((workspace) => Object.values(workspace))),
  });
}

function groupByWorkspace<T extends { workspaceId: WorkspaceId }>(
  records: readonly T[],
  keyOf: (record: T) => string,
): Readonly<Record<WorkspaceId, Readonly<Record<string, T>>>> {
  const next: Record<string, Record<string, T>> = {};
  for (const record of records) {
    next[record.workspaceId] ??= {};
    next[record.workspaceId]![keyOf(record)] = record;
  }
  return Object.freeze(Object.fromEntries(
    Object.entries(next).map(([workspaceId, values]) => [workspaceId, freezeWorkspaceMap(values)]),
  ));
}

export function hydrateCsvRealDataImportState(input: CsvRealDataImportExportedState): void {
  committedByWorkspace = groupByWorkspace(input.committed, (entry) => entry.sourceContextId);
  pendingByWorkspace = groupByWorkspace(input.pending, (entry) => entry.candidateId);
  removedByWorkspace = groupByWorkspace(input.removed, (entry) => entry.sourceId);
  notify("hydrate");
}

export function clearCsvRealDataImportStore(): void {
  committedByWorkspace = Object.freeze({});
  removedByWorkspace = Object.freeze({});
  pendingByWorkspace = Object.freeze({});
  notify("clear");
}

export function resetCsvRealDataImportStoreForTests(): void {
  committedByWorkspace = Object.freeze({});
  removedByWorkspace = Object.freeze({});
  pendingByWorkspace = Object.freeze({});
  version = 0;
  commitInvocationCount = 0;
  lastLifecycleKind = null;
  listeners.clear();
  persistHooks.clear();
}
