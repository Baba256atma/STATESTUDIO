/**
 * NW-B:9-2 — Workspace CSV upload contract.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import type { WorkspaceDataSource } from "./workspaceDataSourceRegistry.ts";

export const WORKSPACE_CSV_UPLOAD_VERSION = "NW-B:9-2" as const;

export const WORKSPACE_CSV_UPLOAD_TAGS = Object.freeze([
  "NWB92",
  "CSV_UPLOAD_MANAGER",
  "CSV_REGISTRATION_ACTIVE",
] as const);

/** Platform CSV limit aligned with backend csv_connector safety cap (2 MiB). */
export const MAX_WORKSPACE_CSV_UPLOAD_BYTES = 2 * 1024 * 1024;

export type WorkspaceCsvUploadFileLike = Readonly<{
  name: string;
  size?: number;
  type?: string;
  lastModified?: number;
  text?: () => Promise<string>;
}>;

export type WorkspaceCsvUploadErrorCode =
  | "invalid_csv"
  | "corrupted_csv"
  | "empty_csv"
  | "oversized_csv"
  | "unsupported_file_type"
  | "missing_workspace"
  | "read_failed"
  | "registration_failed";

export type WorkspaceCsvUploadStatus =
  | "idle"
  | "validating"
  | "registering"
  | "success"
  | "failed";

export type WorkspaceCsvUploadMetadata = Readonly<{
  fileName: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  uploadTime: string;
  workspaceId: WorkspaceId;
}>;

export type WorkspaceCsvValidationResult = Readonly<{
  valid: boolean;
  errorCode: WorkspaceCsvUploadErrorCode | null;
  reason: string;
  message: string;
  metadata: WorkspaceCsvUploadMetadata | null;
}>;

export type WorkspaceCsvUploadStatusEntry = Readonly<{
  contractVersion: typeof WORKSPACE_CSV_UPLOAD_VERSION;
  uploadId: string;
  workspaceId: WorkspaceId;
  status: WorkspaceCsvUploadStatus;
  metadata: WorkspaceCsvUploadMetadata | null;
  dataSourceId: string | null;
  errorCode: WorkspaceCsvUploadErrorCode | null;
  message: string;
  updatedAt: string;
}>;

export type WorkspaceCsvUploadResult = Readonly<{
  success: boolean;
  status: WorkspaceCsvUploadStatus;
  uploadId: string;
  dataSource: WorkspaceDataSource | null;
  metadata: WorkspaceCsvUploadMetadata | null;
  errorCode: WorkspaceCsvUploadErrorCode | null;
  message: string;
  reason: string;
}>;

export const WORKSPACE_CSV_UPLOAD_USER_MESSAGES: Readonly<
  Record<WorkspaceCsvUploadErrorCode, string>
> = Object.freeze({
  invalid_csv: "This file is not a valid CSV. Check the format and try again.",
  corrupted_csv: "This CSV appears corrupted or unreadable. Try exporting a fresh copy.",
  empty_csv: "This CSV is empty. Add column headers and at least one data row.",
  oversized_csv: "This CSV exceeds the platform upload limit of 2 MB.",
  unsupported_file_type: "Only .csv files are supported for this upload.",
  missing_workspace: "Select a workspace before uploading a CSV.",
  read_failed: "The CSV could not be read. Try again or choose a different file.",
  registration_failed: "The CSV validated but could not be registered to this workspace.",
});

export function resolveWorkspaceCsvUploadUserMessage(
  errorCode: WorkspaceCsvUploadErrorCode | null | undefined,
  fallback = "CSV upload failed. Try again."
): string {
  if (!errorCode) return fallback;
  return WORKSPACE_CSV_UPLOAD_USER_MESSAGES[errorCode] ?? fallback;
}

export function sourceNameFromCsvFileName(fileName: string): string {
  const trimmed = fileName.trim();
  if (!trimmed) return "Uploaded CSV";
  return trimmed.replace(/\.[^.]+$/, "").trim() || trimmed;
}
