import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  MAX_WORKSPACE_CSV_UPLOAD_BYTES,
  resolveWorkspaceCsvUploadUserMessage,
  sourceNameFromCsvFileName,
  type WorkspaceCsvUploadErrorCode,
  type WorkspaceCsvUploadFileLike,
  type WorkspaceCsvUploadMetadata,
  type WorkspaceCsvValidationResult,
} from "./workspaceCsvUploadContract.ts";

export type ParsedWorkspaceCsv = Readonly<{
  rowCount: number;
  columnCount: number;
  hasHeader: boolean;
}>;

function normalizeFileName(fileName: unknown): string {
  return typeof fileName === "string" ? fileName.trim() : "";
}

function extensionFromFileName(fileName: string): string {
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

function normalizeFileSize(file: WorkspaceCsvUploadFileLike): number {
  if (typeof file.size !== "number" || !Number.isFinite(file.size)) return 0;
  return Math.max(0, file.size);
}

function isCsvFile(file: WorkspaceCsvUploadFileLike): boolean {
  const fileName = normalizeFileName(file.name);
  if (extensionFromFileName(fileName) === ".csv") return true;
  const mimeType = typeof file.type === "string" ? file.type.trim().toLowerCase() : "";
  return mimeType === "text/csv" || mimeType === "application/csv";
}

function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }
    current += char;
  }

  if (inQuotes) {
    throw new Error("unclosed_quote");
  }

  fields.push(current);
  return fields;
}

export function parseWorkspaceCsvContent(text: string): ParsedWorkspaceCsv {
  const normalized = text.replace(/^\uFEFF/, "");
  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return Object.freeze({ rowCount: 0, columnCount: 0, hasHeader: false });
  }

  const headerFields = splitCsvLine(lines[0] ?? "");
  const columnCount = Math.max(headerFields.length, headerFields.filter((field) => field.trim().length > 0).length);
  const dataRows = lines.slice(1).filter((line) => line.replace(/,/g, "").trim().length > 0);

  for (const line of dataRows) {
    splitCsvLine(line);
  }

  return Object.freeze({
    rowCount: dataRows.length,
    columnCount,
    hasHeader: true,
  });
}

function buildValidationFailure(
  errorCode: WorkspaceCsvUploadErrorCode,
  reason: string
): WorkspaceCsvValidationResult {
  return Object.freeze({
    valid: false,
    errorCode,
    reason,
    message: resolveWorkspaceCsvUploadUserMessage(errorCode),
    metadata: null,
  });
}

function buildValidationSuccess(
  workspaceId: WorkspaceId,
  file: WorkspaceCsvUploadFileLike,
  parsed: ParsedWorkspaceCsv,
  uploadTime: string
): WorkspaceCsvValidationResult {
  const fileName = normalizeFileName(file.name);
  const metadata: WorkspaceCsvUploadMetadata = Object.freeze({
    fileName,
    fileSize: normalizeFileSize(file),
    rowCount: parsed.rowCount,
    columnCount: parsed.columnCount,
    uploadTime,
    workspaceId,
  });

  return Object.freeze({
    valid: true,
    errorCode: null,
    reason: "csv_valid",
    message: `${sourceNameFromCsvFileName(fileName)} is ready to register.`,
    metadata,
  });
}

export async function validateWorkspaceCsvFile(
  file: WorkspaceCsvUploadFileLike | null | undefined,
  workspaceId: WorkspaceId | null | undefined,
  uploadTime = new Date().toISOString()
): Promise<WorkspaceCsvValidationResult> {
  if (!workspaceId?.trim()) {
    return buildValidationFailure("missing_workspace", "missing_workspace");
  }

  if (!file) {
    return buildValidationFailure("invalid_csv", "missing_file");
  }

  const fileName = normalizeFileName(file.name);
  if (!fileName) {
    return buildValidationFailure("invalid_csv", "missing_file_name");
  }

  if (!isCsvFile(file)) {
    return buildValidationFailure("unsupported_file_type", "unsupported_file_type");
  }

  const fileSize = normalizeFileSize(file);
  if (fileSize > MAX_WORKSPACE_CSV_UPLOAD_BYTES) {
    return buildValidationFailure("oversized_csv", "oversized_csv");
  }

  if (typeof file.text !== "function") {
    return buildValidationFailure("read_failed", "missing_text_reader");
  }

  let text = "";
  try {
    text = await file.text();
  } catch {
    return buildValidationFailure("corrupted_csv", "read_failed");
  }

  if (!text.trim()) {
    return buildValidationFailure("empty_csv", "empty_content");
  }

  if (text.includes("\u0000")) {
    return buildValidationFailure("corrupted_csv", "binary_content");
  }

  let parsed: ParsedWorkspaceCsv;
  try {
    parsed = parseWorkspaceCsvContent(text);
  } catch {
    return buildValidationFailure("invalid_csv", "csv_parse_failed");
  }

  if (parsed.columnCount === 0) {
    return buildValidationFailure("invalid_csv", "missing_columns");
  }

  if (parsed.rowCount === 0) {
    return buildValidationFailure("empty_csv", "missing_data_rows");
  }

  return buildValidationSuccess(workspaceId, file, parsed, uploadTime);
}

export function validateWorkspaceCsvFileSize(
  file: WorkspaceCsvUploadFileLike | null | undefined
): WorkspaceCsvValidationResult {
  if (!file) {
    return buildValidationFailure("invalid_csv", "missing_file");
  }
  if (!isCsvFile(file)) {
    return buildValidationFailure("unsupported_file_type", "unsupported_file_type");
  }
  if (normalizeFileSize(file) > MAX_WORKSPACE_CSV_UPLOAD_BYTES) {
    return buildValidationFailure("oversized_csv", "oversized_csv");
  }
  return Object.freeze({
    valid: true,
    errorCode: null,
    reason: "size_ok",
    message: "CSV size is within platform limits.",
    metadata: null,
  });
}
