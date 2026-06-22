import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import {
  importWorkspaceDataSource,
  removeOwnedWorkspaceDataSource,
  resolveWorkspaceDataSource,
  resolveWorkspaceDataSources,
  updateOwnedWorkspaceDataSource,
} from "./workspaceDataSourceResolver.ts";
import { removeWorkspaceDataSourceSchemaProfile } from "./workspaceDataSourceSchemaResolver.ts";
import type {
  WorkspaceDataSource,
  WorkspaceDataSourceStatus,
} from "./workspaceDataSourceRegistry.ts";

export const WORKSPACE_DATA_SOURCE_PANEL_VERSION = "NW-B:9-3" as const;

export const WORKSPACE_DATA_SOURCE_PANEL_TAGS = Object.freeze([
  "NWB93",
  "DATA_SOURCE_PANEL",
  "WORKSPACE_DATA_MANAGEMENT",
] as const);

export type WorkspaceDataSourcePanelRow = Readonly<{
  dataSourceId: string;
  workspaceId: WorkspaceId;
  displayName: string;
  fileName: string;
  type: WorkspaceDataSource["type"];
  status: WorkspaceDataSourceStatus;
  statusLabel: string;
  rowCount: number | null;
  columnCount: number | null;
  fileSize: number | null;
  uploadTime: string | null;
  updatedAt: string;
}>;

export type WorkspaceDataSourcePanelSnapshot = Readonly<{
  contractVersion: typeof WORKSPACE_DATA_SOURCE_PANEL_VERSION;
  workspaceId: WorkspaceId | null;
  rows: readonly WorkspaceDataSourcePanelRow[];
  selectedDataSourceId: string | null;
  selectedSource: WorkspaceDataSourcePanelRow | null;
}>;

export type WorkspaceDataSourcePanelActionResult = Readonly<{
  success: boolean;
  snapshot: WorkspaceDataSourcePanelSnapshot;
  message: string;
  reason: string;
}>;

const STATUS_LABELS: Readonly<Record<WorkspaceDataSourceStatus, string>> = Object.freeze({
  empty: "Empty",
  connected: "Connected",
  processing: "Processing",
  error: "Error",
});

const panelSelectionByWorkspace: Record<WorkspaceId, string | null> = {};

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function emitDataSourcePanelDiagnostic(
  message: "Opened" | "Closed" | "Source Selected" | "Source Removed",
  payload?: Record<string, unknown>
): void {
  if (!isDev()) return;
  devDiagnosticLog("dataSourcePanel", `[DataSourcePanel] ${message}`, {
    ...payload,
    tags: WORKSPACE_DATA_SOURCE_PANEL_TAGS,
  });
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function displayFileName(source: WorkspaceDataSource): string {
  const metadataName = source.metadata?.fileName?.trim();
  if (metadataName) return metadataName;
  if (source.type === "csv" && !source.name.toLowerCase().endsWith(".csv")) {
    return `${source.name}.csv`;
  }
  return source.name;
}

function toPanelRow(source: WorkspaceDataSource): WorkspaceDataSourcePanelRow {
  return Object.freeze({
    dataSourceId: source.dataSourceId,
    workspaceId: source.workspaceId,
    displayName: source.name,
    fileName: displayFileName(source),
    type: source.type,
    status: source.status,
    statusLabel: STATUS_LABELS[source.status] ?? source.status,
    rowCount: source.metadata?.rowCount ?? null,
    columnCount: source.metadata?.columnCount ?? null,
    fileSize: source.metadata?.fileSize ?? null,
    uploadTime: source.metadata?.uploadTime ?? source.createdAt,
    updatedAt: source.updatedAt,
  });
}

export function buildWorkspaceDataSourcePanelSnapshot(
  workspaceId?: WorkspaceId | null,
  selectedDataSourceId?: string | null
): WorkspaceDataSourcePanelSnapshot {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) {
    return Object.freeze({
      contractVersion: WORKSPACE_DATA_SOURCE_PANEL_VERSION,
      workspaceId: null,
      rows: Object.freeze([]),
      selectedDataSourceId: null,
      selectedSource: null,
    });
  }

  const rows = resolveWorkspaceDataSources(resolvedWorkspaceId).map(toPanelRow);
  const storedSelection = selectedDataSourceId ?? panelSelectionByWorkspace[resolvedWorkspaceId] ?? null;
  const selectedSource =
    storedSelection && rows.some((row) => row.dataSourceId === storedSelection)
      ? rows.find((row) => row.dataSourceId === storedSelection) ?? null
      : rows[0] ?? null;

  panelSelectionByWorkspace[resolvedWorkspaceId] = selectedSource?.dataSourceId ?? null;

  return Object.freeze({
    contractVersion: WORKSPACE_DATA_SOURCE_PANEL_VERSION,
    workspaceId: resolvedWorkspaceId,
    rows,
    selectedDataSourceId: selectedSource?.dataSourceId ?? null,
    selectedSource,
  });
}

export function notifyWorkspaceDataSourcePanelOpened(workspaceId?: WorkspaceId | null): void {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  emitDataSourcePanelDiagnostic("Opened", { workspaceId: resolvedWorkspaceId });
}

export function notifyWorkspaceDataSourcePanelClosed(workspaceId?: WorkspaceId | null): void {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  emitDataSourcePanelDiagnostic("Closed", { workspaceId: resolvedWorkspaceId });
}

export function selectWorkspaceDataSourcePanelSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourcePanelActionResult {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      snapshot: buildWorkspaceDataSourcePanelSnapshot(),
      message: "Select a workspace to manage data sources.",
      reason: "missing_workspace",
    });
  }

  const source = resolveWorkspaceDataSource(resolvedWorkspaceId, dataSourceId);
  if (!source || source.workspaceId !== resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      snapshot: buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId),
      message: "That data source is not available in this workspace.",
      reason: "source_not_found",
    });
  }

  panelSelectionByWorkspace[resolvedWorkspaceId] = source.dataSourceId;
  emitDataSourcePanelDiagnostic("Source Selected", {
    workspaceId: resolvedWorkspaceId,
    dataSourceId: source.dataSourceId,
    fileName: displayFileName(source),
  });

  const snapshot = buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId, source.dataSourceId);
  return Object.freeze({
    success: true,
    snapshot,
    message: `${displayFileName(source)} selected.`,
    reason: "selected",
  });
}

export function removeWorkspaceDataSourcePanelSource(
  workspaceId: WorkspaceId,
  dataSourceId?: string | null
): WorkspaceDataSourcePanelActionResult {
  const snapshot = buildWorkspaceDataSourcePanelSnapshot(workspaceId);
  const resolvedWorkspaceId = snapshot.workspaceId;
  if (!resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      snapshot,
      message: "Select a workspace to manage data sources.",
      reason: "missing_workspace",
    });
  }

  const targetId = (dataSourceId ?? snapshot.selectedDataSourceId)?.trim();
  if (!targetId) {
    return Object.freeze({
      success: false,
      snapshot,
      message: "Select a data source to remove.",
      reason: "missing_selection",
    });
  }

  const existing = resolveWorkspaceDataSource(resolvedWorkspaceId, targetId);
  if (!existing || existing.workspaceId !== resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      snapshot: buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId),
      message: "That data source is not available in this workspace.",
      reason: "source_not_found",
    });
  }

  const removed = removeOwnedWorkspaceDataSource(resolvedWorkspaceId, targetId);
  if (!removed.success) {
    return Object.freeze({
      success: false,
      snapshot: buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId),
      message: "Unable to remove the selected data source.",
      reason: removed.reason,
    });
  }

  removeWorkspaceDataSourceSchemaProfile(resolvedWorkspaceId, targetId);

  panelSelectionByWorkspace[resolvedWorkspaceId] = null;
  emitDataSourcePanelDiagnostic("Source Removed", {
    workspaceId: resolvedWorkspaceId,
    dataSourceId: targetId,
    fileName: displayFileName(existing),
  });

  const nextSnapshot = buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId, null);
  return Object.freeze({
    success: true,
    snapshot: nextSnapshot,
    message: `${displayFileName(existing)} removed from this workspace.`,
    reason: "removed",
  });
}

export function refreshWorkspaceDataSourcePanelMetadata(
  workspaceId: WorkspaceId,
  dataSourceId?: string | null
): WorkspaceDataSourcePanelActionResult {
  const snapshot = buildWorkspaceDataSourcePanelSnapshot(workspaceId);
  const resolvedWorkspaceId = snapshot.workspaceId;
  if (!resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      snapshot,
      message: "Select a workspace to manage data sources.",
      reason: "missing_workspace",
    });
  }

  const targetId = (dataSourceId ?? snapshot.selectedDataSourceId)?.trim();
  if (!targetId) {
    return Object.freeze({
      success: false,
      snapshot,
      message: "Select a data source to refresh.",
      reason: "missing_selection",
    });
  }

  const existing = resolveWorkspaceDataSource(resolvedWorkspaceId, targetId);
  if (!existing || existing.workspaceId !== resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      snapshot: buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId),
      message: "That data source is not available in this workspace.",
      reason: "source_not_found",
    });
  }

  const refreshedAt = new Date().toISOString();
  const updated = updateOwnedWorkspaceDataSource({
    workspaceId: resolvedWorkspaceId,
    dataSourceId: targetId,
    updatedAt: refreshedAt,
    metadata: existing.metadata
      ? Object.freeze({
          ...existing.metadata,
          uploadTime: existing.metadata.uploadTime ?? refreshedAt,
        })
      : undefined,
  });

  if (!updated.success || !updated.dataSource) {
    return Object.freeze({
      success: false,
      snapshot: buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId, targetId),
      message: "Unable to refresh data source metadata.",
      reason: updated.reason,
    });
  }

  const nextSnapshot = buildWorkspaceDataSourcePanelSnapshot(resolvedWorkspaceId, targetId);
  return Object.freeze({
    success: true,
    snapshot: nextSnapshot,
    message: `${displayFileName(existing)} metadata refreshed.`,
    reason: "refreshed",
  });
}

export function resetWorkspaceDataSourcePanelForTests(): void {
  for (const key of Object.keys(panelSelectionByWorkspace)) {
    delete panelSelectionByWorkspace[key];
  }
}
