/**
 * UI-PIPE-1:1 — Pipeline Page Types.
 *
 * Readonly UI contracts for the Pipeline Page foundation. Discriminated state,
 * input drafts, parse options, and view-model shapes. No runtime behavior.
 *
 * Ownership: owned exclusively by UI-PIPE-1.
 */

import type {
  CanonicalParsedDataset,
  CsvDatasetPreviewResult,
  DelimiterHint,
  ParserDiagnostic,
  ParseStatus,
  ProvisionalPrimitiveType,
} from "../integrations/csvParserTypes.ts";

export type PipelineInputMode = "CsvFile" | "CsvText" | "ManualTable";

export type PipelinePageStatus =
  | "Idle"
  | "InputReady"
  | "Validating"
  | "ReadingFile"
  | "Parsing"
  | "PreviewReady"
  | "PreviewWithWarnings"
  | "Failed";

export type PipelineHeaderStatus =
  | "No Input"
  | "Ready"
  | "Parsing"
  | "Preview Ready"
  | "Warnings"
  | "Failed";

export type PipelineStepId = "Input" | "Validate" | "Parse" | "Preview" | "Review";

export type PipelineStepStatus = "Pending" | "Active" | "Complete" | "Warning" | "Failed";

export type PreviewRowLimitOption = 10 | 25 | 50 | 100 | 200;

export interface PipelineIdentity {
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly developmentFallback: boolean;
}

export interface CsvFileDraft {
  readonly fileName: string;
  readonly fileSizeBytes: number;
  readonly mimeType: string;
  readonly lastModified: number;
  /** Caller-supplied content after browser read. Never a filesystem path. */
  readonly content: string | null;
}

export interface CsvTextDraft {
  readonly name: string;
  readonly content: string;
}

export interface ManualTableDraft {
  readonly name: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export interface PipelineInputDraft {
  readonly csvFile: CsvFileDraft | null;
  readonly csvText: CsvTextDraft;
  readonly manualTable: ManualTableDraft;
}

export interface PipelineParseOptions {
  readonly delimiter: DelimiterHint;
  readonly hasHeader: boolean;
  readonly previewRowLimit: PreviewRowLimitOption;
  readonly strictColumnCount: boolean;
}

export interface PipelineUiDiagnostic {
  readonly diagnosticId: string;
  readonly code: string;
  readonly severity: "Blocking" | "Error" | "Warning" | "Info";
  readonly message: string;
  readonly field: string | null;
}

export interface PipelinePageState {
  readonly status: PipelinePageStatus;
  readonly identity: PipelineIdentity;
  readonly inputMode: PipelineInputMode;
  readonly inputDraft: PipelineInputDraft;
  readonly parseOptions: PipelineParseOptions;
  readonly datasetResult: CsvDatasetPreviewResult | null;
  readonly uiDiagnostics: readonly PipelineUiDiagnostic[];
  readonly activeStep: PipelineStepId;
  readonly isBusy: boolean;
  readonly canRun: boolean;
  readonly canReset: boolean;
}

export type PipelinePageAction =
  | { readonly type: "SET_INPUT_MODE"; readonly mode: PipelineInputMode }
  | { readonly type: "SET_CSV_FILE_METADATA"; readonly draft: CsvFileDraft }
  | { readonly type: "SET_CSV_FILE_CONTENT"; readonly content: string }
  | { readonly type: "CLEAR_CSV_FILE" }
  | { readonly type: "SET_CSV_TEXT_NAME"; readonly name: string }
  | { readonly type: "SET_CSV_TEXT_CONTENT"; readonly content: string }
  | { readonly type: "CLEAR_CSV_TEXT" }
  | { readonly type: "SET_MANUAL_TABLE_NAME"; readonly name: string }
  | { readonly type: "SET_MANUAL_CELL"; readonly rowIndex: number; readonly columnIndex: number; readonly value: string }
  | { readonly type: "SET_MANUAL_COLUMN_NAME"; readonly columnIndex: number; readonly name: string }
  | { readonly type: "ADD_MANUAL_ROW" }
  | { readonly type: "REMOVE_MANUAL_ROW"; readonly rowIndex: number }
  | { readonly type: "ADD_MANUAL_COLUMN" }
  | { readonly type: "REMOVE_MANUAL_COLUMN"; readonly columnIndex: number }
  | { readonly type: "SET_DELIMITER"; readonly delimiter: DelimiterHint }
  | { readonly type: "SET_HAS_HEADER"; readonly hasHeader: boolean }
  | { readonly type: "SET_PREVIEW_ROW_LIMIT"; readonly previewRowLimit: PreviewRowLimitOption }
  | { readonly type: "SET_STRICT_COLUMN_COUNT"; readonly strictColumnCount: boolean }
  | { readonly type: "RUN_STARTED" }
  | { readonly type: "RUN_VALIDATING" }
  | { readonly type: "RUN_READING_FILE" }
  | { readonly type: "RUN_PARSING" }
  | { readonly type: "RUN_SUCCEEDED"; readonly result: CsvDatasetPreviewResult }
  | { readonly type: "RUN_FAILED"; readonly diagnostics: readonly PipelineUiDiagnostic[]; readonly result?: CsvDatasetPreviewResult | null }
  | { readonly type: "ADD_UI_DIAGNOSTIC"; readonly diagnostic: PipelineUiDiagnostic }
  | { readonly type: "RESET" };

export interface PipelineRequestBuildSuccess {
  readonly ok: true;
  readonly request: import("../integrations/csvParserTypes.ts").CsvParserRequest;
}

export interface PipelineRequestBuildFailure {
  readonly ok: false;
  readonly diagnostics: readonly PipelineUiDiagnostic[];
}

export type PipelineRequestBuildResult = PipelineRequestBuildSuccess | PipelineRequestBuildFailure;

export interface PipelineColumnView {
  readonly index: number;
  readonly displayName: string;
  readonly key: string;
  readonly primitiveType: ProvisionalPrimitiveType;
  readonly sampleValues: readonly string[];
  readonly emptyValueCount: number;
  readonly formulaRiskCount: number;
  readonly isUnknown: boolean;
}

export interface PipelinePreviewRowView {
  readonly rowIndex: number;
  readonly values: readonly string[];
  readonly formulaRiskFlags: readonly boolean[];
  readonly hasFormulaRisk: boolean;
}

export interface PipelineDiagnosticCounts {
  readonly blocking: number;
  readonly error: number;
  readonly warning: number;
  readonly info: number;
  readonly total: number;
}

export interface PipelinePageViewModel {
  readonly status: PipelinePageStatus;
  readonly headerStatus: PipelineHeaderStatus;
  readonly datasetName: string | null;
  readonly sourceMode: string | null;
  readonly encoding: string | null;
  readonly delimiter: string | null;
  readonly columnCount: number | null;
  readonly rowCountObserved: number | null;
  readonly rowCountPreviewed: number | null;
  readonly parseStatus: ParseStatus | null;
  readonly truncated: boolean;
  readonly columns: readonly PipelineColumnView[];
  readonly previewRows: readonly PipelinePreviewRowView[];
  readonly diagnostics: readonly ParserDiagnostic[];
  readonly uiDiagnostics: readonly PipelineUiDiagnostic[];
  readonly diagnosticCounts: PipelineDiagnosticCounts;
  readonly hasWarnings: boolean;
  readonly hasErrors: boolean;
  readonly inputMode: PipelineInputMode;
  readonly isBusy: boolean;
  readonly canRun: boolean;
  readonly canReset: boolean;
  readonly activeStep: PipelineStepId;
  readonly readiness: "ReadyForPreviewUse";
  readonly nextPhase: "UI-PIPE-1:2 — Pipeline Preview Experience";
  readonly dataset: CanonicalParsedDataset | null;
}

export interface PipelineStepView {
  readonly id: PipelineStepId;
  readonly label: string;
  readonly status: PipelineStepStatus;
}

export const PIPELINE_INPUT_MODES: readonly PipelineInputMode[] = Object.freeze([
  "CsvFile",
  "CsvText",
  "ManualTable",
]);

export const PIPELINE_DELIMITER_OPTIONS: readonly DelimiterHint[] = Object.freeze([
  "Auto",
  "Comma",
  "Semicolon",
  "Tab",
  "Pipe",
]);

export const PIPELINE_PREVIEW_ROW_LIMITS: readonly PreviewRowLimitOption[] = Object.freeze([
  10, 25, 50, 100, 200,
]);

export const PIPELINE_STEPS: readonly PipelineStepId[] = Object.freeze([
  "Input",
  "Validate",
  "Parse",
  "Preview",
  "Review",
]);

/** Development-only isolation identity when no runtime context exists. */
export const PIPELINE_DEVELOPMENT_IDENTITY: PipelineIdentity = Object.freeze({
  tenantId: "development-tenant",
  workspaceId: "development-workspace",
  sessionId: "pipeline-preview-session",
  developmentFallback: true,
});

export const INITIAL_MANUAL_COLUMNS: readonly string[] = Object.freeze(["Column 1", "Column 2"]);
export const INITIAL_MANUAL_ROWS: readonly (readonly string[])[] = Object.freeze([
  Object.freeze(["", ""]),
  Object.freeze(["", ""]),
  Object.freeze(["", ""]),
]);
