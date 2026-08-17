/** Workspace-scoped atomic commit store for prepared RDI:2 imports. */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type { CsvPreparedImport } from "./csvRealDataVerticalSlice.ts";

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
}>;

type CsvImportListener = () => void;
const listeners = new Set<CsvImportListener>();
let committedByWorkspace: Readonly<Record<WorkspaceId, Readonly<Record<string, CsvCommittedImport>>>> = Object.freeze({});
let version = 0;

function publish(next: typeof committedByWorkspace): void {
  committedByWorkspace = Object.freeze(next);
  version += 1;
  listeners.forEach((listener) => listener());
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
  publish({ ...committedByWorkspace, [input.expectedWorkspaceId]: workspaceImports });
  return Object.freeze({ committed: true, reason: existing ? "replaced" : "committed", previous: existing, current: committed });
}

/**
 * Remove an inactive historical source. Runtime ownership remains with the
 * shell, so callers must identify its active source explicitly; the store
 * refuses to delete that evidence silently.
 */
export function removeCsvRealDataImport(input: Readonly<{
  workspaceId: WorkspaceId;
  sourceContextId: string;
  activeSourceContextId: string | null;
}>): CsvImportRemoveResult {
  const existing = getCsvRealDataImport(input.workspaceId, input.sourceContextId);
  if (!existing) {
    return Object.freeze({ removed: false, reason: "not_found", removedImport: null });
  }
  if (existing.workspaceId !== input.workspaceId) {
    return Object.freeze({ removed: false, reason: "workspace_mismatch", removedImport: null });
  }
  if (input.activeSourceContextId === input.sourceContextId) {
    return Object.freeze({ removed: false, reason: "active_source", removedImport: null });
  }
  const workspaceImports = { ...(committedByWorkspace[input.workspaceId] ?? {}) };
  delete workspaceImports[input.sourceContextId];
  publish({
    ...committedByWorkspace,
    [input.workspaceId]: Object.freeze(workspaceImports),
  });
  return Object.freeze({ removed: true, reason: "removed", removedImport: existing });
}

export function resetCsvRealDataImportStoreForTests(): void {
  committedByWorkspace = Object.freeze({});
  version = 0;
  listeners.clear();
}
