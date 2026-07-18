/**
 * INT-1:2 — Parser Diagnostics.
 *
 * Immutable catalog of parser diagnostic codes and deterministic builders.
 * Diagnostics never carry stack traces, raw sensitive rows, or unbounded growth
 * beyond the caller-enforced diagnostic limit.
 *
 * Ownership: owned exclusively by INT-1:2.
 */

import type {
  ParserDiagnostic,
  ParserDiagnosticCategory,
  ParserDiagnosticSeverity,
} from "./csvParserTypes.ts";

export const PARSER_DIAGNOSTIC_CODES = Object.freeze({
  EMPTY_INPUT: "EMPTY_INPUT",
  UNSUPPORTED_ENCODING: "UNSUPPORTED_ENCODING",
  ENCODING_UNKNOWN: "ENCODING_UNKNOWN",
  DELIMITER_NOT_DETECTED: "DELIMITER_NOT_DETECTED",
  UNCLOSED_QUOTED_FIELD: "UNCLOSED_QUOTED_FIELD",
  DUPLICATE_HEADER: "DUPLICATE_HEADER",
  EMPTY_HEADER: "EMPTY_HEADER",
  ROW_TOO_SHORT: "ROW_TOO_SHORT",
  ROW_TOO_LONG: "ROW_TOO_LONG",
  FIELD_LIMIT_EXCEEDED: "FIELD_LIMIT_EXCEEDED",
  ROW_LIMIT_EXCEEDED: "ROW_LIMIT_EXCEEDED",
  COLUMN_LIMIT_EXCEEDED: "COLUMN_LIMIT_EXCEEDED",
  RECORD_LIMIT_EXCEEDED: "RECORD_LIMIT_EXCEEDED",
  INPUT_LIMIT_EXCEEDED: "INPUT_LIMIT_EXCEEDED",
  FORMULA_RISK: "FORMULA_RISK",
  PREVIEW_TRUNCATED: "PREVIEW_TRUNCATED",
  DIAGNOSTIC_LIMIT_REACHED: "DIAGNOSTIC_LIMIT_REACHED",
  INVALID_REQUEST: "INVALID_REQUEST",
  INVALID_PREVIEW_LIMIT: "INVALID_PREVIEW_LIMIT",
  FOUNDATION_REJECTED: "FOUNDATION_REJECTED",
  PARSE_BLOCKED: "PARSE_BLOCKED",
} as const);

interface CatalogEntry {
  readonly code: string;
  readonly category: ParserDiagnosticCategory;
  readonly defaultSeverity: ParserDiagnosticSeverity;
  readonly description: string;
  readonly recoverable: boolean;
}

const entry = (
  code: string,
  category: ParserDiagnosticCategory,
  defaultSeverity: ParserDiagnosticSeverity,
  description: string,
  recoverable: boolean,
): CatalogEntry => Object.freeze({ code, category, defaultSeverity, description, recoverable });

const CATALOG: readonly CatalogEntry[] = Object.freeze([
  entry(PARSER_DIAGNOSTIC_CODES.EMPTY_INPUT, "Input", "Blocking", "Input content is empty.", false),
  entry(PARSER_DIAGNOSTIC_CODES.UNSUPPORTED_ENCODING, "Encoding", "Blocking", "The declared or detected encoding is unsupported.", false),
  entry(PARSER_DIAGNOSTIC_CODES.ENCODING_UNKNOWN, "Encoding", "Warning", "Encoding could not be confidently resolved; UTF-8 was assumed.", true),
  entry(PARSER_DIAGNOSTIC_CODES.DELIMITER_NOT_DETECTED, "Delimiter", "Error", "Automatic delimiter detection confidence was insufficient.", true),
  entry(PARSER_DIAGNOSTIC_CODES.UNCLOSED_QUOTED_FIELD, "Quote", "Error", "A quoted field was not closed before end of input.", true),
  entry(PARSER_DIAGNOSTIC_CODES.DUPLICATE_HEADER, "Header", "Warning", "A duplicate header name was resolved to a unique internal key.", true),
  entry(PARSER_DIAGNOSTIC_CODES.EMPTY_HEADER, "Header", "Warning", "An empty header was replaced with a deterministic placeholder.", true),
  entry(PARSER_DIAGNOSTIC_CODES.ROW_TOO_SHORT, "RowWidth", "Warning", "A row had fewer fields than expected and was padded.", true),
  entry(PARSER_DIAGNOSTIC_CODES.ROW_TOO_LONG, "RowWidth", "Error", "A row had more fields than expected.", true),
  entry(PARSER_DIAGNOSTIC_CODES.FIELD_LIMIT_EXCEEDED, "Limit", "Blocking", "A field exceeded the maximum field character count.", false),
  entry(PARSER_DIAGNOSTIC_CODES.ROW_LIMIT_EXCEEDED, "Limit", "Warning", "Parsing stopped after reaching the maximum parsed row count.", true),
  entry(PARSER_DIAGNOSTIC_CODES.COLUMN_LIMIT_EXCEEDED, "Limit", "Blocking", "A record exceeded the maximum column count.", false),
  entry(PARSER_DIAGNOSTIC_CODES.RECORD_LIMIT_EXCEEDED, "Limit", "Blocking", "A record exceeded the maximum record character count.", false),
  entry(PARSER_DIAGNOSTIC_CODES.INPUT_LIMIT_EXCEEDED, "Limit", "Blocking", "Input exceeded the maximum input character count.", false),
  entry(PARSER_DIAGNOSTIC_CODES.FORMULA_RISK, "FormulaRisk", "Warning", "A field begins with a spreadsheet formula prefix.", true),
  entry(PARSER_DIAGNOSTIC_CODES.PREVIEW_TRUNCATED, "Preview", "Info", "Preview rows were truncated to the configured preview limit.", true),
  entry(PARSER_DIAGNOSTIC_CODES.DIAGNOSTIC_LIMIT_REACHED, "Limit", "Warning", "Further diagnostics were suppressed after reaching the diagnostic limit.", true),
  entry(PARSER_DIAGNOSTIC_CODES.INVALID_REQUEST, "Input", "Blocking", "The parser request failed foundation-level validation.", false),
  entry(PARSER_DIAGNOSTIC_CODES.INVALID_PREVIEW_LIMIT, "Limit", "Blocking", "previewRowLimit is outside the allowed safe range.", false),
  entry(PARSER_DIAGNOSTIC_CODES.FOUNDATION_REJECTED, "Security", "Blocking", "INT-1:1 foundation validation rejected the request.", false),
  entry(PARSER_DIAGNOSTIC_CODES.PARSE_BLOCKED, "Input", "Blocking", "Parsing was blocked by a policy or safety limit.", false),
]);

const BY_CODE: ReadonlyMap<string, CatalogEntry> = new Map(CATALOG.map((e) => [e.code, e]));

export const CsvParserDiagnosticCatalog = Object.freeze({
  categories: Object.freeze([
    "Input",
    "Encoding",
    "Delimiter",
    "Quote",
    "Header",
    "RowWidth",
    "Field",
    "Limit",
    "FormulaRisk",
    "Preview",
    "Lifecycle",
    "Security",
  ] as const),
  codes: CATALOG,
  getByCode: (code: string): CatalogEntry | undefined => BY_CODE.get(code),
});

export interface ParserDiagnosticLocation {
  readonly field?: string;
  readonly rowIndex?: number;
  readonly columnIndex?: number;
  readonly severity?: ParserDiagnosticSeverity;
  readonly message?: string;
}

export const buildParserDiagnostic = (
  code: string,
  location: ParserDiagnosticLocation = {},
): ParserDiagnostic => {
  const catalog = BY_CODE.get(code);
  const field = location.field ?? null;
  const rowIndex = location.rowIndex ?? null;
  const columnIndex = location.columnIndex ?? null;
  const idSuffix = [field, rowIndex, columnIndex]
    .filter((part): part is string | number => part !== null)
    .join(":");
  return Object.freeze({
    diagnosticId: idSuffix.length > 0 ? `int1-2-${code}-${idSuffix}` : `int1-2-${code}`,
    code,
    category: catalog?.category ?? "Input",
    severity: location.severity ?? catalog?.defaultSeverity ?? "Error",
    message: location.message ?? catalog?.description ?? code,
    field,
    rowIndex,
    columnIndex,
    recoverable: catalog?.recoverable ?? false,
  });
};

export const isBlockingParserDiagnostic = (d: ParserDiagnostic): boolean =>
  d.severity === "Blocking" || (d.severity === "Error" && !d.recoverable);

export const appendBoundedDiagnostics = (
  target: ParserDiagnostic[],
  incoming: readonly ParserDiagnostic[],
  maximum: number,
): boolean => {
  let truncated = false;
  for (const diagnostic of incoming) {
    if (target.length >= maximum) {
      if (!truncated) {
        target.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.DIAGNOSTIC_LIMIT_REACHED));
        truncated = true;
      }
      break;
    }
    target.push(diagnostic);
  }
  return truncated;
};
