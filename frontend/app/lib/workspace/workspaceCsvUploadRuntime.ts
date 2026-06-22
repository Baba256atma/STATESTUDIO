import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import {
  importWorkspaceDataSource,
  resolveWorkspaceDataSources,
} from "./workspaceDataSourceResolver.ts";
import type { WorkspaceDataSource } from "./workspaceDataSourceRegistry.ts";
import {
  resolveWorkspaceCsvUploadUserMessage,
  sourceNameFromCsvFileName,
  WORKSPACE_CSV_UPLOAD_TAGS,
  WORKSPACE_CSV_UPLOAD_VERSION,
  type WorkspaceCsvUploadErrorCode,
  type WorkspaceCsvUploadFileLike,
  type WorkspaceCsvUploadMetadata,
  type WorkspaceCsvUploadResult,
  type WorkspaceCsvUploadStatus,
  type WorkspaceCsvUploadStatusEntry,
} from "./workspaceCsvUploadContract.ts";
import { validateWorkspaceCsvFile } from "./workspaceCsvUploadValidation.ts";
import {
  discoverDataSourceSchema,
} from "./workspaceDataSourceSchemaResolver.ts";
import { updateOwnedWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";

const STATUS_STORAGE_KEY = "nexora.workspaceCsvUploadStatuses.v1";

type WorkspaceCsvUploadListener = () => void;

const workspaceCsvUploadListeners = new Set<WorkspaceCsvUploadListener>();

let workspaceCsvUploadStatuses: Record<WorkspaceId, readonly WorkspaceCsvUploadStatusEntry[]> = {};
let workspaceCsvUploadHydrated = false;
let workspaceCsvUploadVersion = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function emitCsvUploadDiagnostic(
  message: "Upload Started" | "Upload Success" | "Upload Failed",
  payload?: Record<string, unknown>
): void {
  if (!isDev()) return;
  devDiagnosticLog("csvUpload", `[CsvUpload] ${message}`, {
    ...payload,
    tags: WORKSPACE_CSV_UPLOAD_TAGS,
  });
}

function notifyWorkspaceCsvUploadListeners(): void {
  workspaceCsvUploadVersion += 1;
  workspaceCsvUploadListeners.forEach((listener) => listener());
}

function readStorage(): Record<WorkspaceId, readonly WorkspaceCsvUploadStatusEntry[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STATUS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, readonly WorkspaceCsvUploadStatusEntry[]>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(workspaceCsvUploadStatuses));
  } catch {
    // Status history remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceCsvUploadStore(): void {
  if (workspaceCsvUploadHydrated) return;
  workspaceCsvUploadHydrated = true;
  workspaceCsvUploadStatuses = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function buildUploadId(workspaceId: WorkspaceId, fileName: string, uploadTime: string): string {
  const slug = fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32) || "csv";
  return `csv_upload_${workspaceId}_${slug}_${Date.parse(uploadTime) || Date.now()}`;
}

function freezeStatusEntry(entry: WorkspaceCsvUploadStatusEntry): WorkspaceCsvUploadStatusEntry {
  return Object.freeze({ ...entry });
}

function appendStatusEntry(entry: WorkspaceCsvUploadStatusEntry): void {
  hydrateWorkspaceCsvUploadStore();
  const existing = workspaceCsvUploadStatuses[entry.workspaceId] ?? [];
  workspaceCsvUploadStatuses = {
    ...workspaceCsvUploadStatuses,
    [entry.workspaceId]: Object.freeze([...existing, freezeStatusEntry(entry)]),
  };
  writeStorage();
  notifyWorkspaceCsvUploadListeners();
}

function buildStatusEntry(input: {
  uploadId: string;
  workspaceId: WorkspaceId;
  status: WorkspaceCsvUploadStatus;
  metadata: WorkspaceCsvUploadMetadata | null;
  dataSourceId: string | null;
  errorCode: WorkspaceCsvUploadErrorCode | null;
  message: string;
  updatedAt: string;
}): WorkspaceCsvUploadStatusEntry {
  return Object.freeze({
    contractVersion: WORKSPACE_CSV_UPLOAD_VERSION,
    uploadId: input.uploadId,
    workspaceId: input.workspaceId,
    status: input.status,
    metadata: input.metadata,
    dataSourceId: input.dataSourceId,
    errorCode: input.errorCode,
    message: input.message,
    updatedAt: input.updatedAt,
  });
}

function buildUploadResult(input: {
  success: boolean;
  status: WorkspaceCsvUploadStatus;
  uploadId: string;
  dataSource: WorkspaceDataSource | null;
  metadata: WorkspaceCsvUploadMetadata | null;
  errorCode: WorkspaceCsvUploadErrorCode | null;
  message: string;
  reason: string;
}): WorkspaceCsvUploadResult {
  return Object.freeze({
    success: input.success,
    status: input.status,
    uploadId: input.uploadId,
    dataSource: input.dataSource,
    metadata: input.metadata,
    errorCode: input.errorCode,
    message: input.message,
    reason: input.reason,
  });
}

export function subscribeWorkspaceCsvUploadStatuses(listener: WorkspaceCsvUploadListener): () => void {
  hydrateWorkspaceCsvUploadStore();
  workspaceCsvUploadListeners.add(listener);
  return () => workspaceCsvUploadListeners.delete(listener);
}

export function getWorkspaceCsvUploadStatusVersion(): number {
  hydrateWorkspaceCsvUploadStore();
  return workspaceCsvUploadVersion;
}

export function listWorkspaceCsvUploadStatuses(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceCsvUploadStatusEntry[] {
  hydrateWorkspaceCsvUploadStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);
  return Object.freeze((workspaceCsvUploadStatuses[resolvedWorkspaceId] ?? []).map(freezeStatusEntry));
}

export function getLatestWorkspaceCsvUploadStatus(
  workspaceId?: WorkspaceId | null
): WorkspaceCsvUploadStatusEntry | null {
  const entries = listWorkspaceCsvUploadStatuses(workspaceId);
  return entries.length > 0 ? entries[entries.length - 1] ?? null : null;
}

export async function uploadWorkspaceCsv(
  file: WorkspaceCsvUploadFileLike | null | undefined,
  workspaceId?: WorkspaceId | null
): Promise<WorkspaceCsvUploadResult> {
  hydrateWorkspaceCsvUploadStore();

  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  const uploadTime = nowIso();
  const uploadId = buildUploadId(resolvedWorkspaceId ?? "unknown", file?.name ?? "upload.csv", uploadTime);

  if (!resolvedWorkspaceId) {
    const message = resolveWorkspaceCsvUploadUserMessage("missing_workspace");
    appendStatusEntry(
      buildStatusEntry({
        uploadId,
        workspaceId: "unknown",
        status: "failed",
        metadata: null,
        dataSourceId: null,
        errorCode: "missing_workspace",
        message,
        updatedAt: uploadTime,
      })
    );
    emitCsvUploadDiagnostic("Upload Failed", { uploadId, reason: "missing_workspace" });
    return buildUploadResult({
      success: false,
      status: "failed",
      uploadId,
      dataSource: null,
      metadata: null,
      errorCode: "missing_workspace",
      message,
      reason: "missing_workspace",
    });
  }

  emitCsvUploadDiagnostic("Upload Started", {
    uploadId,
    workspaceId: resolvedWorkspaceId,
    fileName: file?.name ?? null,
  });

  appendStatusEntry(
    buildStatusEntry({
      uploadId,
      workspaceId: resolvedWorkspaceId,
      status: "validating",
      metadata: null,
      dataSourceId: null,
      errorCode: null,
      message: "Validating CSV upload...",
      updatedAt: uploadTime,
    })
  );

  const validation = await validateWorkspaceCsvFile(file, resolvedWorkspaceId, uploadTime);
  if (!validation.valid || !validation.metadata) {
    appendStatusEntry(
      buildStatusEntry({
        uploadId,
        workspaceId: resolvedWorkspaceId,
        status: "failed",
        metadata: validation.metadata,
        dataSourceId: null,
        errorCode: validation.errorCode,
        message: validation.message,
        updatedAt: nowIso(),
      })
    );
    emitCsvUploadDiagnostic("Upload Failed", {
      uploadId,
      workspaceId: resolvedWorkspaceId,
      errorCode: validation.errorCode,
      reason: validation.reason,
    });
    return buildUploadResult({
      success: false,
      status: "failed",
      uploadId,
      dataSource: null,
      metadata: validation.metadata,
      errorCode: validation.errorCode,
      message: validation.message,
      reason: validation.reason,
    });
  }

  appendStatusEntry(
    buildStatusEntry({
      uploadId,
      workspaceId: resolvedWorkspaceId,
      status: "registering",
      metadata: validation.metadata,
      dataSourceId: null,
      errorCode: null,
      message: "Registering CSV in workspace...",
      updatedAt: nowIso(),
    })
  );

  const registration = importWorkspaceDataSource({
    workspaceId: resolvedWorkspaceId,
    name: sourceNameFromCsvFileName(validation.metadata.fileName),
    type: "csv",
    status: "connected",
    createdAt: validation.metadata.uploadTime,
    updatedAt: validation.metadata.uploadTime,
    metadata: Object.freeze({
      fileName: validation.metadata.fileName,
      fileSize: validation.metadata.fileSize,
      rowCount: validation.metadata.rowCount,
      columnCount: validation.metadata.columnCount,
      uploadTime: validation.metadata.uploadTime,
    }),
  });

  if (!registration.success || !registration.dataSource) {
    const message = resolveWorkspaceCsvUploadUserMessage("registration_failed");
    appendStatusEntry(
      buildStatusEntry({
        uploadId,
        workspaceId: resolvedWorkspaceId,
        status: "failed",
        metadata: validation.metadata,
        dataSourceId: null,
        errorCode: "registration_failed",
        message,
        updatedAt: nowIso(),
      })
    );
    emitCsvUploadDiagnostic("Upload Failed", {
      uploadId,
      workspaceId: resolvedWorkspaceId,
      reason: registration.reason,
    });
    return buildUploadResult({
      success: false,
      status: "failed",
      uploadId,
      dataSource: null,
      metadata: validation.metadata,
      errorCode: "registration_failed",
      message,
      reason: registration.reason,
    });
  }

  const successMessage = `${registration.dataSource.name} uploaded with ${validation.metadata.rowCount} rows and ${validation.metadata.columnCount} columns.`;
  appendStatusEntry(
    buildStatusEntry({
      uploadId,
      workspaceId: resolvedWorkspaceId,
      status: "success",
      metadata: validation.metadata,
      dataSourceId: registration.dataSource.dataSourceId,
      errorCode: null,
      message: successMessage,
      updatedAt: nowIso(),
    })
  );
  emitCsvUploadDiagnostic("Upload Success", {
    uploadId,
    workspaceId: resolvedWorkspaceId,
    dataSourceId: registration.dataSource.dataSourceId,
    rowCount: validation.metadata.rowCount,
    columnCount: validation.metadata.columnCount,
  });

  if (typeof file?.text === "function") {
    try {
      const csvText = await file.text();
      updateOwnedWorkspaceDataSource({
        workspaceId: resolvedWorkspaceId,
        dataSourceId: registration.dataSource.dataSourceId,
        metadata: Object.freeze({
          ...(registration.dataSource.metadata ?? {}),
          fileName: validation.metadata.fileName,
          fileSize: validation.metadata.fileSize,
          rowCount: validation.metadata.rowCount,
          columnCount: validation.metadata.columnCount,
          uploadTime: validation.metadata.uploadTime,
          csvText,
        }),
      });
      discoverDataSourceSchema(resolvedWorkspaceId, registration.dataSource.dataSourceId);
    } catch {
      // Schema discovery is best-effort and must not fail the upload path.
    }
  }

  return buildUploadResult({
    success: true,
    status: "success",
    uploadId,
    dataSource: registration.dataSource,
    metadata: validation.metadata,
    errorCode: null,
    message: successMessage,
    reason: "uploaded",
  });
}

export function getWorkspaceCsvDataSources(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceDataSource[] {
  return resolveWorkspaceDataSources(workspaceId).filter((source) => source.type === "csv");
}

export function resetWorkspaceCsvUploadForTests(): void {
  workspaceCsvUploadStatuses = {};
  workspaceCsvUploadHydrated = false;
  workspaceCsvUploadVersion = 0;
  workspaceCsvUploadListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STATUS_STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
