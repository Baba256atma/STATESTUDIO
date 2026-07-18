/**
 * UI-PIPE-1:2 — Pipeline Preview Experience Types.
 *
 * Readonly contracts for search, filters, column selection, pagination, sorting,
 * review status, and understanding handoff. No runtime behavior.
 *
 * Ownership: owned exclusively by UI-PIPE-1:2.
 */

import type {
  CanonicalParsedDataset,
  ParserDiagnostic,
  ParserDiagnosticCategory,
  ParserDiagnosticSeverity,
  ParseStatus,
} from "../integrations/csvParserTypes.ts";
import type {
  PipelineColumnView,
  PipelineDiagnosticCounts,
  PipelineIdentity,
  PipelinePageViewModel,
  PipelinePreviewRowView,
} from "./pipelinePageTypes.ts";

export type PipelineReviewStatus =
  | "NotStarted"
  | "Reviewing"
  | "ReadyForUnderstanding"
  | "Blocked";

export type PipelineHealthState = "Healthy" | "Attention" | "Blocked" | "Unknown";

export type PipelineRowFilterMode = "AllRows" | "RowsWithDiagnostics" | "RowsWithFormulaRisk";

export type PipelineSortDirection = "Ascending" | "Descending" | "None";

export type PipelinePreviewPageSize = 10 | 25 | 50 | 100;

export interface PipelineSortConfiguration {
  readonly columnKey: string | null;
  readonly direction: PipelineSortDirection;
}

export interface PipelinePreviewState {
  readonly searchQuery: string;
  readonly selectedColumnKeys: readonly string[];
  readonly focusedColumnKey: string | null;
  readonly diagnosticSeverities: readonly ParserDiagnosticSeverity[];
  readonly diagnosticCategories: readonly ParserDiagnosticCategory[];
  readonly showOnlyRowsWithDiagnostics: boolean;
  readonly showOnlyRowsWithFormulaRisk: boolean;
  readonly currentPage: number;
  readonly pageSize: PipelinePreviewPageSize;
  readonly sortConfiguration: PipelineSortConfiguration;
  readonly reviewStatus: PipelineReviewStatus;
  readonly handoff: PipelineUnderstandingHandoff | null;
  readonly initializedForDatasetId: string | null;
}

export type PipelinePreviewAction =
  | { readonly type: "INITIALIZE_FROM_DATASET"; readonly dataset: CanonicalParsedDataset }
  | { readonly type: "SET_SEARCH_QUERY"; readonly searchQuery: string }
  | { readonly type: "SET_ROW_FILTER_DIAGNOSTICS"; readonly enabled: boolean }
  | { readonly type: "SET_ROW_FILTER_FORMULA_RISK"; readonly enabled: boolean }
  | { readonly type: "TOGGLE_SEVERITY"; readonly severity: ParserDiagnosticSeverity }
  | { readonly type: "TOGGLE_CATEGORY"; readonly category: ParserDiagnosticCategory }
  | { readonly type: "RESET_DIAGNOSTIC_FILTERS" }
  | { readonly type: "SELECT_ALL_COLUMNS"; readonly columnKeys: readonly string[] }
  | { readonly type: "CLEAR_ALL_COLUMNS" }
  | { readonly type: "TOGGLE_COLUMN"; readonly columnKey: string; readonly allKeys: readonly string[] }
  | { readonly type: "FOCUS_COLUMN"; readonly columnKey: string | null }
  | { readonly type: "SET_PAGE"; readonly page: number }
  | { readonly type: "SET_PAGE_SIZE"; readonly pageSize: PipelinePreviewPageSize }
  | { readonly type: "SET_SORT"; readonly columnKey: string; readonly direction: PipelineSortDirection }
  | { readonly type: "CONFIRM_PREVIEW"; readonly handoff: PipelineUnderstandingHandoff }
  | { readonly type: "MARK_BLOCKED" }
  | { readonly type: "RESET" };

export interface PipelineUnderstandingHandoff {
  readonly handoffId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly datasetId: string;
  readonly datasetName: string;
  readonly sourceMode: string;
  readonly sourceRegistryId: string;
  readonly selectedColumnKeys: readonly string[];
  readonly columnCount: number;
  readonly selectedColumnCount: number;
  readonly rowCountObserved: number;
  readonly rowCountPreviewed: number;
  readonly parseStatus: ParseStatus;
  readonly diagnosticCounts: PipelineDiagnosticCounts;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly formulaRiskCount: number;
  readonly reviewStatus: "ReadyForUnderstanding";
  readonly readyForUnderstanding: true;
  readonly nextPlatform: "DKL-3";
}

export interface PipelinePaginationView {
  readonly currentPage: number;
  readonly pageSize: PipelinePreviewPageSize;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly canPrevious: boolean;
  readonly canNext: boolean;
}

export interface PipelineFocusedColumnView {
  readonly column: PipelineColumnView;
  readonly relatedDiagnostics: readonly ParserDiagnostic[];
  readonly selectedForUnderstanding: boolean;
}

export interface PipelinePreviewEmptyState {
  readonly kind: "NoPreview" | "NoMatchingRows" | "NoMatchingDiagnostics" | null;
  readonly message: string | null;
}

export interface PipelinePreviewViewModel {
  readonly visibleRows: readonly PipelinePreviewRowView[];
  readonly visibleDiagnostics: readonly ParserDiagnostic[];
  readonly diagnosticCounts: PipelineDiagnosticCounts;
  readonly filteredRowCount: number;
  readonly totalPreviewRowCount: number;
  readonly selectedColumnCount: number;
  readonly selectedColumnKeys: readonly string[];
  readonly focusedColumn: PipelineFocusedColumnView | null;
  readonly healthState: PipelineHealthState;
  readonly healthLabels: Readonly<{
    parseHealth: PipelineHealthState;
    columnConsistency: PipelineHealthState;
    diagnosticSummary: PipelineHealthState;
    formulaRisk: PipelineHealthState;
    previewCoverage: PipelineHealthState;
    understandingReadiness: PipelineHealthState;
  }>;
  readonly reviewStatus: PipelineReviewStatus;
  readonly canConfirm: boolean;
  readonly confirmDisabledReason: string | null;
  readonly handoff: PipelineUnderstandingHandoff | null;
  readonly pagination: PipelinePaginationView;
  readonly sort: PipelineSortConfiguration;
  readonly emptyState: PipelinePreviewEmptyState;
  readonly searchQuery: string;
  readonly showOnlyRowsWithDiagnostics: boolean;
  readonly showOnlyRowsWithFormulaRisk: boolean;
  readonly diagnosticSeverities: readonly ParserDiagnosticSeverity[];
  readonly diagnosticCategories: readonly ParserDiagnosticCategory[];
  readonly readiness: "ReadyForUnderstandingConnection";
  readonly nextPhase: "UI-PIPE-1:3 — Pipeline-to-DKL-3 Handoff Contract";
  readonly pageViewModel: PipelinePageViewModel;
  readonly identity: PipelineIdentity;
}

export const ALL_DIAGNOSTIC_SEVERITIES: readonly ParserDiagnosticSeverity[] = Object.freeze([
  "Blocking",
  "Error",
  "Warning",
  "Info",
]);

export const ALL_DIAGNOSTIC_CATEGORIES: readonly ParserDiagnosticCategory[] = Object.freeze([
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
]);

export const PIPELINE_PREVIEW_PAGE_SIZES: readonly PipelinePreviewPageSize[] = Object.freeze([
  10, 25, 50, 100,
]);
