/**
 * HOSTED-MVP:3A — browser client for server-owned manager data.
 * Responses hydrate the existing runtime. They do not become a second store.
 */

import type { CsvCommittedImport } from "../data-reality/csvRealDataImportStore.ts";
import {
  installAuthoritativeWorkspaceCsv,
  releaseWorkspaceCsvAuthority,
} from "../data-reality/csvRealDataImportStore.ts";
import type { CsvMappingReview, CsvPreparedImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export type HostedPendingReview = Readonly<{
  pendingId: string;
  prepared: CsvPreparedImport;
}>;

type SnapshotBody = {
  workspaceId?: string;
  sources?: CsvPreparedImport[];
  error?: string;
};

function committedFromPrepared(prepared: CsvPreparedImport, committedAt: string): CsvCommittedImport {
  return Object.freeze({
    workspaceId: prepared.workspaceId,
    sourceContextId: prepared.sourceContextId,
    importId: prepared.importId,
    committedAt,
    prepared,
  });
}

export function applyHostedManagerSnapshot(workspaceId: WorkspaceId, sources: readonly CsvPreparedImport[], committedAt: string): void {
  if (sources.length === 0) {
    releaseWorkspaceCsvAuthority(workspaceId);
    return;
  }
  installAuthoritativeWorkspaceCsv(sources.map((prepared) => committedFromPrepared(prepared, committedAt)));
}

export async function uploadHostedPendingCsv(workspaceId: string, fileName: string, csvText: string): Promise<HostedPendingReview> {
  const response = await fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}/data/pending`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fileName, csvText }),
  });
  const body = await response.json().catch(() => ({})) as { pendingId?: string; prepared?: CsvPreparedImport; error?: string };
  if (!response.ok || !body.pendingId || !body.prepared) {
    throw new Error(body.error ?? "invalid_csv");
  }
  return { pendingId: body.pendingId, prepared: body.prepared };
}

export async function acceptHostedPendingCsv(workspaceId: string, pendingId: string, mapping: CsvMappingReview): Promise<SnapshotBody> {
  const response = await fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}/data/pending/${encodeURIComponent(pendingId)}/accept`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ mapping }),
  });
  const body = await response.json().catch(() => ({})) as SnapshotBody;
  if (!response.ok || !body.sources) throw new Error(body.error ?? "invalid_csv");
  applyHostedManagerSnapshot(workspaceId as WorkspaceId, body.sources, new Date().toISOString());
  return body;
}

export async function loadHostedManagerSnapshot(workspaceId: string): Promise<"empty" | "ready"> {
  const response = await fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}/data/snapshot`, {
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({})) as SnapshotBody;
  if (!response.ok || !body.sources) throw new Error(body.error ?? "data_store_unavailable");
  applyHostedManagerSnapshot(workspaceId as WorkspaceId, body.sources, new Date().toISOString());
  return body.sources.length === 0 ? "empty" : "ready";
}

export async function discardHostedPendingReview(workspaceId: string, pendingId: string): Promise<void> {
  const response = await fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}/data/pending/${encodeURIComponent(pendingId)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? "pending_not_found");
  }
}

export async function removeHostedManagerSource(workspaceId: string, sourceId: string): Promise<void> {
  const response = await fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}/data/sources/${encodeURIComponent(sourceId)}`, {
    method: "DELETE",
  });
  const body = await response.json().catch(() => ({})) as SnapshotBody;
  if (!response.ok || !body.sources) throw new Error(body.error ?? "source_not_found");
  applyHostedManagerSnapshot(workspaceId as WorkspaceId, body.sources, new Date().toISOString());
}
