/**
 * INT-1:2 — CSV Parser & Dataset Preview Types.
 *
 * Readonly contracts for deterministic CSV/manual-input parsing and syntactic
 * dataset preview. Primitive types are syntactic guesses only — never semantic
 * DKL-3 classifications. No runtime behavior.
 *
 * Ownership: owned exclusively by INT-1:2.
 */

import type {
  DelimiterHint,
  EncodingHint,
  ProvisionalPrimitiveType,
} from "./csvManualInputFoundationTypes.ts";

export type { DelimiterHint, EncodingHint, ProvisionalPrimitiveType };

/** Parser source modes. CsvFileContent is parser-specific (caller-supplied text/bytes). */
export type CsvParserSourceMode = "CsvText" | "CsvFileContent" | "ManualTable";

export type ParseStatus = "Parsed" | "ParsedWithWarnings" | "Rejected" | "Truncated";

export type ParserDiagnosticCategory =
  | "Input"
  | "Encoding"
  | "Delimiter"
  | "Quote"
  | "Header"
  | "RowWidth"
  | "Field"
  | "Limit"
  | "FormulaRisk"
  | "Preview"
  | "Lifecycle"
  | "Security";

export type ParserDiagnosticSeverity = "Info" | "Warning" | "Error" | "Blocking";

export interface ParserDiagnostic {
  readonly diagnosticId: string;
  readonly code: string;
  readonly category: ParserDiagnosticCategory;
  readonly severity: ParserDiagnosticSeverity;
  readonly message: string;
  readonly field: string | null;
  readonly rowIndex: number | null;
  readonly columnIndex: number | null;
  readonly recoverable: boolean;
}

/** Caller-supplied CSV file content (text or bytes). Never opened from a path. */
export interface CsvFileContentInput {
  readonly mode: "CsvFileContent";
  readonly sessionId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly fileName: string;
  readonly content: string | Uint8Array;
  readonly declaredEncoding: EncodingHint;
  readonly delimiterHint: DelimiterHint;
}

export interface CsvTextParserInput {
  readonly mode: "CsvText";
  readonly name: string;
  readonly content: string;
  readonly encodingHint: EncodingHint;
}

export interface ManualTableParserInput {
  readonly mode: "ManualTable";
  readonly name: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export type CsvParserInput =
  | CsvTextParserInput
  | CsvFileContentInput
  | ManualTableParserInput;

export interface CsvParserRequest {
  readonly sessionId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sourceMode: CsvParserSourceMode;
  readonly sourceName: string;
  readonly input: CsvParserInput;
  readonly encodingHint: EncodingHint;
  readonly delimiterHint: DelimiterHint;
  readonly hasHeader: boolean;
  readonly previewRowLimit: number;
  readonly strictColumnCount: boolean;
  readonly datasetId?: string;
  readonly createdBy?: string;
}

export interface CsvParserLimitsDescriptor {
  readonly maximumParsedRows: number;
  readonly maximumParsedColumns: number;
  readonly maximumFieldCharacterCount: number;
  readonly maximumRecordCharacterCount: number;
  readonly maximumInputCharacterCount: number;
  readonly maximumPreviewRows: number;
  readonly maximumDiagnosticCount: number;
  readonly minimumPreviewRows: number;
  readonly defaultPreviewRowLimit: number;
}

export interface NormalizedCsvInput {
  readonly sourceMode: CsvParserSourceMode;
  readonly sourceName: string;
  readonly text: string;
  readonly encoding: EncodingHint;
  readonly delimiterHint: DelimiterHint;
  readonly isManualTable: boolean;
  readonly manualColumns: readonly string[] | null;
  readonly manualRows: readonly (readonly string[])[] | null;
  readonly diagnostics: readonly ParserDiagnostic[];
}

export interface DelimiterDetectionResult {
  readonly delimiter: Exclude<DelimiterHint, "Auto">;
  readonly character: string;
  readonly confidence: "High" | "Medium" | "Low" | "None";
  readonly diagnostics: readonly ParserDiagnostic[];
}

export interface ParsedRecord {
  readonly fields: readonly string[];
  readonly recordIndex: number;
  readonly unclosedQuote: boolean;
  readonly diagnostics: readonly ParserDiagnostic[];
}

export interface RecordParseResult {
  readonly records: readonly ParsedRecord[];
  readonly truncated: boolean;
  readonly diagnostics: readonly ParserDiagnostic[];
  readonly blocked: boolean;
}

export interface ResolvedHeader {
  readonly index: number;
  readonly key: string;
  readonly originalName: string;
  readonly displayName: string;
}

export interface HeaderResolutionResult {
  readonly headers: readonly ResolvedHeader[];
  readonly dataStartIndex: number;
  readonly diagnostics: readonly ParserDiagnostic[];
}

export interface ParsedColumnPreview {
  readonly index: number;
  readonly key: string;
  readonly originalName: string;
  readonly displayName: string;
  readonly primitiveType: ProvisionalPrimitiveType;
  readonly sampleValues: readonly string[];
  readonly nonEmptySampleCount: number;
  readonly emptyValueCount: number;
  readonly formulaRiskCount: number;
  readonly diagnosticIds: readonly string[];
}

export interface ParsedPreviewRow {
  readonly rowIndex: number;
  readonly values: readonly string[];
  readonly cellDiagnostics: readonly ParserDiagnostic[];
  readonly hasFormulaRisk: boolean;
}

export interface CanonicalParsedDataset {
  readonly datasetId: string;
  readonly sessionId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly datasetName: string;
  readonly sourceMode: CsvParserSourceMode;
  readonly sourceRegistryId: string;
  readonly connectorRegistryId: string;
  readonly contentTypeRegistryId: string;
  readonly encoding: EncodingHint;
  readonly delimiter: DelimiterHint;
  readonly hasHeader: boolean;
  readonly columnCount: number;
  readonly rowCountObserved: number;
  readonly rowCountParsed: number;
  readonly rowCountPreviewed: number;
  readonly columns: readonly ParsedColumnPreview[];
  readonly previewRows: readonly ParsedPreviewRow[];
  readonly diagnostics: readonly ParserDiagnostic[];
  readonly truncated: boolean;
  readonly parseStatus: ParseStatus;
}

export interface CsvDatasetPreviewSuccess {
  readonly ok: true;
  readonly dataset: CanonicalParsedDataset;
  readonly diagnostics: readonly ParserDiagnostic[];
}

export interface CsvDatasetPreviewFailure {
  readonly ok: false;
  readonly failure: {
    readonly code: string;
    readonly message: string;
  };
  readonly diagnostics: readonly ParserDiagnostic[];
  readonly partialPreview: CanonicalParsedDataset | null;
}

export type CsvDatasetPreviewResult = CsvDatasetPreviewSuccess | CsvDatasetPreviewFailure;

export interface DelimiterCandidate {
  readonly name: Exclude<DelimiterHint, "Auto">;
  readonly character: string;
}

/** Canonical parser safety limits (MVP). Re-exported as CsvParserLimits by the platform. */
export const CsvParserLimitValues: CsvParserLimitsDescriptor = Object.freeze({
  maximumParsedRows: 100_000,
  maximumParsedColumns: 1_000,
  maximumFieldCharacterCount: 100_000,
  maximumRecordCharacterCount: 1_000_000,
  maximumInputCharacterCount: 10_000_000,
  maximumPreviewRows: 200,
  maximumDiagnosticCount: 500,
  minimumPreviewRows: 1,
  defaultPreviewRowLimit: 50,
});
