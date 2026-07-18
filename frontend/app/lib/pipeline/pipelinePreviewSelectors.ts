/**
 * UI-PIPE-1:2 — Pipeline Preview Selectors.
 *
 * Pure selectors for visible rows, visible diagnostics, health, and confirmation.
 * Ownership: owned exclusively by UI-PIPE-1:2.
 */

import type { ParserDiagnostic } from "../integrations/csvParserTypes.ts";
import type {
  PipelineColumnView,
  PipelinePageViewModel,
  PipelinePreviewRowView,
} from "./pipelinePageTypes.ts";
import type {
  PipelineHealthState,
  PipelinePreviewState,
  PipelineSortConfiguration,
} from "./pipelinePreviewTypes.ts";

const compareStrings = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
};

/** Filter and sort preview rows without mutating the source collection. */
export function selectVisiblePipelinePreviewRows(
  rows: readonly PipelinePreviewRowView[],
  columns: readonly PipelineColumnView[],
  previewState: PipelinePreviewState,
  allDiagnostics: readonly ParserDiagnostic[],
): readonly PipelinePreviewRowView[] {
  const query = previewState.searchQuery.trim().toLowerCase();
  let filtered = rows;

  if (previewState.showOnlyRowsWithFormulaRisk) {
    filtered = filtered.filter((row) => row.hasFormulaRisk);
  }

  if (previewState.showOnlyRowsWithDiagnostics) {
    const rowsWithDiagnostics = new Set(
      allDiagnostics
        .filter((d) => d.rowIndex !== null)
        .map((d) => d.rowIndex as number),
    );
    filtered = filtered.filter(
      (row) => row.hasFormulaRisk || rowsWithDiagnostics.has(row.rowIndex),
    );
  }

  if (query.length > 0) {
    filtered = filtered.filter((row) =>
      row.values.some((value) => value.toLowerCase().includes(query)),
    );
  }

  const sorted = sortRows(filtered, columns, previewState.sortConfiguration);
  return Object.freeze([...sorted]);
}

const sortRows = (
  rows: readonly PipelinePreviewRowView[],
  columns: readonly PipelineColumnView[],
  sort: PipelineSortConfiguration,
): readonly PipelinePreviewRowView[] => {
  if (sort.direction === "None" || sort.columnKey === null) {
    return rows;
  }
  const columnIndex = columns.findIndex((c) => c.key === sort.columnKey);
  if (columnIndex < 0) {
    return rows;
  }

  const decorated = rows.map((row, index) => ({ row, index }));
  decorated.sort((a, b) => {
    const av = a.row.values[columnIndex] ?? "";
    const bv = b.row.values[columnIndex] ?? "";
    const aEmpty = av.length === 0;
    const bEmpty = bv.length === 0;
    if (aEmpty && bEmpty) {
      return a.index - b.index;
    }
    if (aEmpty) {
      return 1;
    }
    if (bEmpty) {
      return -1;
    }
    const cmp = compareStrings(av, bv);
    const directed = sort.direction === "Ascending" ? cmp : -cmp;
    return directed === 0 ? a.index - b.index : directed;
  });
  return decorated.map((d) => d.row);
};

/** Filter diagnostics for display. Full counts remain elsewhere. */
export function selectVisiblePipelineDiagnostics(
  diagnostics: readonly ParserDiagnostic[],
  previewState: PipelinePreviewState,
): readonly ParserDiagnostic[] {
  return Object.freeze(
    diagnostics.filter(
      (d) =>
        previewState.diagnosticSeverities.includes(d.severity) &&
        previewState.diagnosticCategories.includes(d.category),
    ),
  );
}

export function derivePipelineHealthState(
  pageViewModel: PipelinePageViewModel,
): PipelineHealthState {
  if (pageViewModel.dataset === null) {
    return "Unknown";
  }
  if (pageViewModel.diagnosticCounts.blocking > 0) {
    return "Blocked";
  }
  if (pageViewModel.diagnosticCounts.error > 0 || pageViewModel.diagnosticCounts.warning > 0) {
    return "Attention";
  }
  return "Healthy";
}

export function canConfirmPipelinePreview(
  pageViewModel: PipelinePageViewModel,
  previewState: PipelinePreviewState,
): boolean {
  if (pageViewModel.dataset === null) {
    return false;
  }
  if (!pageViewModel.dataset || pageViewModel.status === "Failed") {
    // Successful preview required: dataset present from ok result.
  }
  const result = pageViewModel; // dataset from successful path
  if (result.dataset === null) {
    return false;
  }
  // Must come from a successful parser result (PreviewReady / PreviewWithWarnings).
  if (
    pageViewModel.status !== "PreviewReady" &&
    pageViewModel.status !== "PreviewWithWarnings"
  ) {
    return false;
  }
  if (pageViewModel.diagnosticCounts.blocking > 0) {
    return false;
  }
  if (previewState.selectedColumnKeys.length === 0) {
    return false;
  }
  if (previewState.reviewStatus === "ReadyForUnderstanding") {
    return false;
  }
  return true;
}

export function confirmDisabledReason(
  pageViewModel: PipelinePageViewModel,
  previewState: PipelinePreviewState,
): string | null {
  if (pageViewModel.dataset === null) {
    return "Run a successful preview before confirming.";
  }
  if (
    pageViewModel.status !== "PreviewReady" &&
    pageViewModel.status !== "PreviewWithWarnings"
  ) {
    return "A successful parser preview is required.";
  }
  if (pageViewModel.diagnosticCounts.blocking > 0) {
    return "Blocking diagnostics must be resolved before confirmation.";
  }
  if (previewState.selectedColumnKeys.length === 0) {
    return "Select at least one column for understanding.";
  }
  if (previewState.reviewStatus === "ReadyForUnderstanding") {
    return "Preview already confirmed.";
  }
  return null;
}

export function paginateRows<T>(
  rows: readonly T[],
  currentPage: number,
  pageSize: number,
): { readonly pageRows: readonly T[]; readonly totalPages: number; readonly safePage: number } {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize) || 1);
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    pageRows: Object.freeze(rows.slice(start, start + pageSize)),
    totalPages,
    safePage,
  };
}
