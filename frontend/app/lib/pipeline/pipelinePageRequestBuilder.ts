/**
 * UI-PIPE-1:1 — Pipeline Page Request Builder.
 *
 * Pure translation from Pipeline Page UI state into an INT-1:2 parser request.
 * Never mutates state. Never throws for ordinary incomplete form state.
 *
 * Ownership: owned exclusively by UI-PIPE-1.
 */

import type { CsvParserRequest } from "../integrations/csvParserTypes.ts";
import type {
  PipelinePageState,
  PipelineRequestBuildResult,
  PipelineUiDiagnostic,
} from "./pipelinePageTypes.ts";

const fail = (...diagnostics: PipelineUiDiagnostic[]): PipelineRequestBuildResult =>
  Object.freeze({
    ok: false,
    diagnostics: Object.freeze(diagnostics),
  });

const diagnostic = (
  code: string,
  message: string,
  field: string | null = null,
): PipelineUiDiagnostic =>
  Object.freeze({
    diagnosticId: `ui-${code}`,
    code,
    severity: "Error",
    message,
    field,
  });

/**
 * Build an INT-1:2 parser request from UI state.
 * Preserves tenant/workspace/session identity exactly.
 */
export function buildPipelineParserRequest(
  state: PipelinePageState,
): PipelineRequestBuildResult {
  const { identity, inputMode, inputDraft, parseOptions } = state;

  if (!identity.tenantId.trim() || !identity.workspaceId.trim() || !identity.sessionId.trim()) {
    return fail(diagnostic("IDENTITY_REQUIRED", "Tenant, workspace, and session ids are required."));
  }

  if (inputMode === "CsvFile") {
    const file = inputDraft.csvFile;
    if (file === null) {
      return fail(diagnostic("FILE_REQUIRED", "Select a CSV file before running preview.", "file"));
    }
    if (file.content === null || file.content.length === 0) {
      return fail(
        diagnostic("FILE_CONTENT_REQUIRED", "File content has not been read yet.", "file"),
      );
    }
    const request: CsvParserRequest = Object.freeze({
      sessionId: identity.sessionId,
      tenantId: identity.tenantId,
      workspaceId: identity.workspaceId,
      sourceMode: "CsvFileContent",
      sourceName: file.fileName,
      encodingHint: "UTF-8",
      delimiterHint: parseOptions.delimiter,
      hasHeader: parseOptions.hasHeader,
      previewRowLimit: parseOptions.previewRowLimit,
      strictColumnCount: parseOptions.strictColumnCount,
      createdBy: "ui-pipe-1:1",
      input: Object.freeze({
        mode: "CsvFileContent" as const,
        sessionId: identity.sessionId,
        tenantId: identity.tenantId,
        workspaceId: identity.workspaceId,
        fileName: file.fileName,
        content: file.content,
        declaredEncoding: "UTF-8" as const,
        delimiterHint: parseOptions.delimiter,
      }),
    });
    return Object.freeze({ ok: true, request });
  }

  if (inputMode === "CsvText") {
    const text = inputDraft.csvText;
    if (!text.name.trim()) {
      return fail(diagnostic("NAME_REQUIRED", "Dataset name is required.", "name"));
    }
    if (!text.content.trim()) {
      return fail(diagnostic("CONTENT_REQUIRED", "CSV text is required.", "content"));
    }
    const request: CsvParserRequest = Object.freeze({
      sessionId: identity.sessionId,
      tenantId: identity.tenantId,
      workspaceId: identity.workspaceId,
      sourceMode: "CsvText",
      sourceName: text.name,
      encodingHint: "UTF-8",
      delimiterHint: parseOptions.delimiter,
      hasHeader: parseOptions.hasHeader,
      previewRowLimit: parseOptions.previewRowLimit,
      strictColumnCount: parseOptions.strictColumnCount,
      createdBy: "ui-pipe-1:1",
      input: Object.freeze({
        mode: "CsvText" as const,
        name: text.name,
        content: text.content,
        encodingHint: "UTF-8" as const,
      }),
    });
    return Object.freeze({ ok: true, request });
  }

  const table = inputDraft.manualTable;
  if (!table.name.trim()) {
    return fail(diagnostic("NAME_REQUIRED", "Table name is required.", "name"));
  }
  if (table.columns.length === 0) {
    return fail(diagnostic("COLUMNS_REQUIRED", "At least one column is required.", "columns"));
  }
  if (table.columns.some((c) => !c.trim())) {
    return fail(diagnostic("COLUMN_NAME_REQUIRED", "Column names must be non-empty.", "columns"));
  }
  const request: CsvParserRequest = Object.freeze({
    sessionId: identity.sessionId,
    tenantId: identity.tenantId,
    workspaceId: identity.workspaceId,
    sourceMode: "ManualTable",
    sourceName: table.name,
    encodingHint: "UTF-8",
    delimiterHint: "Comma",
    hasHeader: true,
    previewRowLimit: parseOptions.previewRowLimit,
    strictColumnCount: parseOptions.strictColumnCount,
    createdBy: "ui-pipe-1:1",
    input: Object.freeze({
      mode: "ManualTable" as const,
      name: table.name,
      columns: Object.freeze([...table.columns]),
      rows: Object.freeze(table.rows.map((row) => Object.freeze([...row]))),
    }),
  });
  return Object.freeze({ ok: true, request });
}
