/**
 * INT-1:1 — Import Diagnostics.
 *
 * A stable, immutable catalog of foundation diagnostic codes plus deterministic,
 * side-effect-free builders used internally by the INT-1 foundation modules.
 * Diagnostics are pure data: no stack traces, no raw input, no sensitive rows,
 * no logging, no clock, no randomness.
 *
 * Ownership: owned exclusively by INT-1.
 * Dependency rules: depends only on INT-1 foundation types.
 */

import type {
  DiagnosticCatalogEntry,
  DiagnosticCategory,
  DiagnosticSeverity,
  ImportDiagnostic,
} from "./csvManualInputFoundationTypes.ts";

const catalogEntry = (
  code: string,
  category: DiagnosticCategory,
  defaultSeverity: DiagnosticSeverity,
  description: string,
  recoverable: boolean,
): DiagnosticCatalogEntry =>
  Object.freeze({ code, category, defaultSeverity, description, recoverable });

const CATEGORIES: readonly DiagnosticCategory[] = Object.freeze([
  "Input",
  "Policy",
  "Encoding",
  "Delimiter",
  "Header",
  "Row",
  "Column",
  "Lifecycle",
  "RegistryReference",
  "Security",
]);

const SEVERITIES: readonly DiagnosticSeverity[] = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Blocking",
]);

/** Canonical diagnostic codes emitted by the INT-1 foundation. */
export const DIAGNOSTIC_CODES = Object.freeze({
  INPUT_TENANT_REQUIRED: "INPUT_TENANT_REQUIRED",
  INPUT_WORKSPACE_REQUIRED: "INPUT_WORKSPACE_REQUIRED",
  INPUT_SESSION_REQUIRED: "INPUT_SESSION_REQUIRED",
  INPUT_CREATED_BY_REQUIRED: "INPUT_CREATED_BY_REQUIRED",
  INPUT_MODE_UNRECOGNIZED: "INPUT_MODE_UNRECOGNIZED",
  INPUT_SOURCE_NAME_REQUIRED: "INPUT_SOURCE_NAME_REQUIRED",
  FILE_EXTENSION_UNSUPPORTED: "FILE_EXTENSION_UNSUPPORTED",
  FILE_MIME_UNSUPPORTED: "FILE_MIME_UNSUPPORTED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_TOO_SMALL: "FILE_TOO_SMALL",
  FILE_NAME_UNTRUSTED_PATH: "FILE_NAME_UNTRUSTED_PATH",
  TEXT_TOO_LARGE: "TEXT_TOO_LARGE",
  TEXT_TOO_SMALL: "TEXT_TOO_SMALL",
  TABLE_NO_COLUMNS: "TABLE_NO_COLUMNS",
  TABLE_TOO_MANY_COLUMNS: "TABLE_TOO_MANY_COLUMNS",
  TABLE_TOO_MANY_ROWS: "TABLE_TOO_MANY_ROWS",
  TABLE_CELL_TOO_LARGE: "TABLE_CELL_TOO_LARGE",
  LIFECYCLE_INVALID_START: "LIFECYCLE_INVALID_START",
  LIFECYCLE_INVALID_TRANSITION: "LIFECYCLE_INVALID_TRANSITION",
  REGISTRY_REFERENCE_MISSING: "REGISTRY_REFERENCE_MISSING",
} as const);

const CATALOG_ENTRIES: readonly DiagnosticCatalogEntry[] = Object.freeze([
  catalogEntry(DIAGNOSTIC_CODES.INPUT_TENANT_REQUIRED, "Security", "Blocking", "A tenant id is required to preserve isolation boundaries.", false),
  catalogEntry(DIAGNOSTIC_CODES.INPUT_WORKSPACE_REQUIRED, "Security", "Blocking", "A workspace id is required to preserve isolation boundaries.", false),
  catalogEntry(DIAGNOSTIC_CODES.INPUT_SESSION_REQUIRED, "Input", "Blocking", "A session id must be supplied by the caller.", false),
  catalogEntry(DIAGNOSTIC_CODES.INPUT_CREATED_BY_REQUIRED, "Input", "Error", "A createdBy actor is required.", false),
  catalogEntry(DIAGNOSTIC_CODES.INPUT_MODE_UNRECOGNIZED, "Input", "Blocking", "The input mode is not one of the recognized INT-1 modes.", false),
  catalogEntry(DIAGNOSTIC_CODES.INPUT_SOURCE_NAME_REQUIRED, "Input", "Error", "A source name is required.", false),
  catalogEntry(DIAGNOSTIC_CODES.FILE_EXTENSION_UNSUPPORTED, "Policy", "Error", "The file extension is not supported.", true),
  catalogEntry(DIAGNOSTIC_CODES.FILE_MIME_UNSUPPORTED, "Policy", "Error", "The declared MIME type is not supported.", true),
  catalogEntry(DIAGNOSTIC_CODES.FILE_TOO_LARGE, "Policy", "Blocking", "The declared file size exceeds the maximum allowed.", false),
  catalogEntry(DIAGNOSTIC_CODES.FILE_TOO_SMALL, "Policy", "Error", "The declared file size is below the minimum allowed.", true),
  catalogEntry(DIAGNOSTIC_CODES.FILE_NAME_UNTRUSTED_PATH, "Security", "Warning", "The filename contains path-like characters and is treated as display metadata only.", true),
  catalogEntry(DIAGNOSTIC_CODES.TEXT_TOO_LARGE, "Policy", "Blocking", "The pasted CSV text exceeds the maximum character count.", false),
  catalogEntry(DIAGNOSTIC_CODES.TEXT_TOO_SMALL, "Policy", "Error", "The pasted CSV text is below the minimum character count.", true),
  catalogEntry(DIAGNOSTIC_CODES.TABLE_NO_COLUMNS, "Policy", "Error", "The manual table declares no columns.", true),
  catalogEntry(DIAGNOSTIC_CODES.TABLE_TOO_MANY_COLUMNS, "Policy", "Blocking", "The manual table exceeds the maximum column count.", false),
  catalogEntry(DIAGNOSTIC_CODES.TABLE_TOO_MANY_ROWS, "Policy", "Blocking", "The manual table exceeds the maximum row count.", false),
  catalogEntry(DIAGNOSTIC_CODES.TABLE_CELL_TOO_LARGE, "Policy", "Error", "A manual-table cell exceeds the maximum cell character count.", true),
  catalogEntry(DIAGNOSTIC_CODES.LIFECYCLE_INVALID_START, "Lifecycle", "Error", "The starting lifecycle state must be Created.", true),
  catalogEntry(DIAGNOSTIC_CODES.LIFECYCLE_INVALID_TRANSITION, "Lifecycle", "Error", "The requested lifecycle transition is not allowed.", true),
  catalogEntry(DIAGNOSTIC_CODES.REGISTRY_REFERENCE_MISSING, "RegistryReference", "Blocking", "A required DKL-2 registry reference could not be resolved.", false),
]);

const CATALOG_BY_CODE: ReadonlyMap<string, DiagnosticCatalogEntry> = new Map(
  CATALOG_ENTRIES.map((entry) => [entry.code, entry]),
);

/** The immutable INT-1 diagnostic catalog (categories, severities, codes). */
export const CsvManualInputDiagnosticCatalog = Object.freeze({
  categories: CATEGORIES,
  severities: SEVERITIES,
  codes: CATALOG_ENTRIES,
  getByCode: (code: string): DiagnosticCatalogEntry | undefined => CATALOG_BY_CODE.get(code),
});

export interface DiagnosticLocation {
  readonly field?: string;
  readonly rowIndex?: number;
  readonly columnIndex?: number;
  readonly severity?: DiagnosticSeverity;
  readonly message?: string;
}

/**
 * Build a frozen diagnostic from a catalog code. Deterministic: the diagnosticId
 * is derived only from the code and any supplied location — never from a clock
 * or random source.
 */
export const buildDiagnostic = (
  code: string,
  location: DiagnosticLocation = {},
): ImportDiagnostic => {
  const entry = CATALOG_BY_CODE.get(code);
  const category: DiagnosticCategory = entry?.category ?? "Input";
  const severity: DiagnosticSeverity = location.severity ?? entry?.defaultSeverity ?? "Error";
  const recoverable = entry?.recoverable ?? false;
  const field = location.field ?? null;
  const rowIndex = location.rowIndex ?? null;
  const columnIndex = location.columnIndex ?? null;
  const idSuffix = [field, rowIndex, columnIndex]
    .filter((part): part is string | number => part !== null)
    .join(":");
  const diagnosticId = idSuffix.length > 0 ? `int1-${code}-${idSuffix}` : `int1-${code}`;
  return Object.freeze({
    diagnosticId,
    code,
    category,
    severity,
    message: location.message ?? entry?.description ?? code,
    field,
    rowIndex,
    columnIndex,
    recoverable,
  });
};

/** True when any diagnostic blocks acceptance (Error or Blocking severity). */
export const hasBlockingDiagnostic = (diagnostics: readonly ImportDiagnostic[]): boolean =>
  diagnostics.some((d) => d.severity === "Error" || d.severity === "Blocking");
