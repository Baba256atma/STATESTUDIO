/**
 * DS:1:2 — File Upload Runtime contract.
 *
 * Metadata only: no object generation, scenario generation, or AI analysis.
 */

import type {
  DataSourceRegistryEntry,
  DataSourceRegistryMutationResult,
  DataSourceType,
} from "./dataSourceRegistryContract.ts";

export const DS_1_2_FILE_UPLOAD_RUNTIME_TAG =
  "[DS:1:2_FILE_UPLOAD_RUNTIME]" as const;

export type UploadableDataSourceType = Extract<DataSourceType, "csv" | "excel" | "json">;

export type DataSourceUploadFileLike = Readonly<{
  name: string;
  size?: number;
  type?: string;
  lastModified?: number;
  text?: () => Promise<string>;
}>;

export type DataSourceFileValidationResult = Readonly<{
  valid: boolean;
  sourceType: UploadableDataSourceType | null;
  reason: string;
}>;

export type DataSourceFileMetadata = Readonly<{
  sourceName: string;
  sourceType: UploadableDataSourceType;
  sourceStatus: "registered";
  fileName: string;
  fileSize: number;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
  lastSyncAt: string | null;
  recordCount: number;
}>;

export type DataSourceUploadResult = DataSourceRegistryMutationResult & Readonly<{
  metadata: DataSourceFileMetadata | null;
  source: DataSourceRegistryEntry | null;
}>;

export const SUPPORTED_UPLOAD_EXTENSIONS: Readonly<Record<UploadableDataSourceType, readonly string[]>> =
  Object.freeze({
    csv: Object.freeze([".csv"]),
    excel: Object.freeze([".xlsx"]),
    json: Object.freeze([".json"]),
  });

export const SUPPORTED_UPLOAD_MIME_TYPES: Readonly<Record<UploadableDataSourceType, readonly string[]>> =
  Object.freeze({
    csv: Object.freeze(["text/csv", "application/csv", "application/vnd.ms-excel"]),
    excel: Object.freeze([
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]),
    json: Object.freeze(["application/json", "text/json"]),
  });

