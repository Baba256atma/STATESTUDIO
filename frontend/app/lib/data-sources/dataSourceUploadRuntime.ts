import {
  normalizeDataSourceRecordCount,
  normalizeDataSourceTimestamp,
} from "./dataSourceRegistryContract.ts";
import { registerDataSource } from "./dataSourceRegistryRuntime.ts";
import {
  SUPPORTED_UPLOAD_EXTENSIONS,
  SUPPORTED_UPLOAD_MIME_TYPES,
  type DataSourceFileMetadata,
  type DataSourceFileValidationResult,
  type DataSourceUploadFileLike,
  type DataSourceUploadResult,
  type UploadableDataSourceType,
} from "./dataSourceUploadContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeFileName(fileName: unknown): string {
  return typeof fileName === "string" ? fileName.trim() : "";
}

function extensionFromFileName(fileName: string): string {
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

function sourceTypeFromExtension(extension: string): UploadableDataSourceType | null {
  for (const [sourceType, extensions] of Object.entries(SUPPORTED_UPLOAD_EXTENSIONS)) {
    if (extensions.includes(extension)) return sourceType as UploadableDataSourceType;
  }
  return null;
}

function sourceTypeFromMimeType(mimeType: string): UploadableDataSourceType | null {
  const normalized = mimeType.trim().toLowerCase();
  if (!normalized) return null;
  for (const [sourceType, mimeTypes] of Object.entries(SUPPORTED_UPLOAD_MIME_TYPES)) {
    if (mimeTypes.includes(normalized)) return sourceType as UploadableDataSourceType;
  }
  return null;
}

function sourceNameFromFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "").trim() || fileName || "Uploaded Source";
}

function countCsvRecords(text: string): number {
  const rows = text
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0);
  if (rows.length === 0) return 0;
  return Math.max(0, rows.length - 1);
}

function countJsonRecords(text: string): number {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (Array.isArray(parsed)) return parsed.length;
    if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      for (const key of ["records", "rows", "items", "data"]) {
        const value = record[key];
        if (Array.isArray(value)) return value.length;
      }
      return Object.keys(record).length > 0 ? 1 : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

async function readFileText(file: DataSourceUploadFileLike): Promise<string> {
  if (typeof file.text !== "function") return "";
  try {
    return await file.text();
  } catch {
    return "";
  }
}

export function validateFile(file: DataSourceUploadFileLike | null | undefined): DataSourceFileValidationResult {
  const fileName = normalizeFileName(file?.name);
  if (!fileName) {
    return Object.freeze({ valid: false, sourceType: null, reason: "missing_file_name" });
  }

  const extensionType = sourceTypeFromExtension(extensionFromFileName(fileName));
  const mimeType = typeof file?.type === "string" ? file.type : "";
  const mimeTypeSource = sourceTypeFromMimeType(mimeType);
  const sourceType = extensionType ?? mimeTypeSource;

  if (!sourceType) {
    return Object.freeze({ valid: false, sourceType: null, reason: "unsupported_file_type" });
  }

  if (extensionType && mimeTypeSource && extensionType !== mimeTypeSource) {
    return Object.freeze({ valid: false, sourceType: null, reason: "file_type_mismatch" });
  }

  return Object.freeze({ valid: true, sourceType, reason: "file_supported" });
}

export async function extractRecordCount(
  file: DataSourceUploadFileLike,
  sourceType?: UploadableDataSourceType | null
): Promise<number> {
  const resolvedType = sourceType ?? validateFile(file).sourceType;
  if (resolvedType === "excel") return 0;
  const text = await readFileText(file);
  if (resolvedType === "csv") return normalizeDataSourceRecordCount(countCsvRecords(text));
  if (resolvedType === "json") return normalizeDataSourceRecordCount(countJsonRecords(text));
  return 0;
}

export async function readSourceMetadata(
  file: DataSourceUploadFileLike
): Promise<DataSourceFileMetadata | null> {
  const validation = validateFile(file);
  if (!validation.valid || !validation.sourceType) return null;

  const timestamp = nowIso();
  const createdAt = normalizeDataSourceTimestamp(
    typeof file.lastModified === "number" ? new Date(file.lastModified).toISOString() : null,
    timestamp
  );
  const recordCount = await extractRecordCount(file, validation.sourceType);

  return Object.freeze({
    sourceName: sourceNameFromFileName(file.name),
    sourceType: validation.sourceType,
    sourceStatus: "registered",
    fileName: file.name,
    fileSize: typeof file.size === "number" && Number.isFinite(file.size) ? Math.max(0, file.size) : 0,
    mimeType: typeof file.type === "string" && file.type.trim() ? file.type.trim() : null,
    createdAt,
    updatedAt: timestamp,
    lastSyncAt: null,
    recordCount,
  });
}

export async function uploadDataSource(
  file: DataSourceUploadFileLike | null | undefined
): Promise<DataSourceUploadResult> {
  const validation = validateFile(file);
  if (!file || !validation.valid) {
    return Object.freeze({
      success: false,
      source: null,
      metadata: null,
      reason: validation.reason,
    });
  }

  const metadata = await readSourceMetadata(file);
  if (!metadata) {
    return Object.freeze({
      success: false,
      source: null,
      metadata: null,
      reason: "metadata_unavailable",
    });
  }

  const result = registerDataSource({
    sourceName: metadata.sourceName,
    sourceType: metadata.sourceType,
    sourceStatus: metadata.sourceStatus,
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
    lastSyncAt: metadata.lastSyncAt,
    recordCount: metadata.recordCount,
  });

  return Object.freeze({
    ...result,
    metadata,
  });
}

