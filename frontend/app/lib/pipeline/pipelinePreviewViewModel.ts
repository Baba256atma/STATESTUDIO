/**
 * UI-PIPE-1:2 — Pipeline Preview View Model (canonical public API surface).
 *
 * Builds the preview-experience view model and re-exports the seven canonical
 * runtime APIs. Ownership: owned exclusively by UI-PIPE-1:2.
 */

import { buildPipelineUnderstandingHandoff } from "./pipelinePreviewHandoff.ts";
import {
  canConfirmPipelinePreview,
  confirmDisabledReason,
  derivePipelineHealthState,
  paginateRows,
  selectVisiblePipelineDiagnostics,
  selectVisiblePipelinePreviewRows,
} from "./pipelinePreviewSelectors.ts";
import {
  createPipelinePreviewInitialState,
  reducePipelinePreviewState,
} from "./pipelinePreviewState.ts";
import type { PipelineIdentity, PipelinePageViewModel } from "./pipelinePageTypes.ts";
import type {
  PipelineHealthState,
  PipelinePreviewState,
  PipelinePreviewViewModel,
} from "./pipelinePreviewTypes.ts";

export {
  createPipelinePreviewInitialState,
  reducePipelinePreviewState,
  selectVisiblePipelinePreviewRows,
  selectVisiblePipelineDiagnostics,
  buildPipelineUnderstandingHandoff,
  canConfirmPipelinePreview,
};

const healthForFormula = (
  pageViewModel: PipelinePageViewModel,
  base: PipelineHealthState,
): PipelineHealthState => {
  if (pageViewModel.dataset === null) {
    return "Unknown";
  }
  const formulaRisk = pageViewModel.columns.reduce((sum, c) => sum + c.formulaRiskCount, 0);
  if (base === "Blocked") {
    return "Blocked";
  }
  if (formulaRisk > 0) {
    return "Attention";
  }
  return base;
};

/**
 * Build an immutable preview-experience view model from page + preview state.
 * Does not mutate parser results.
 */
export function buildPipelinePreviewViewModel(
  pageViewModel: PipelinePageViewModel,
  previewState: PipelinePreviewState,
  identity: PipelineIdentity,
): PipelinePreviewViewModel {
  const rows = pageViewModel.previewRows;
  const columns = pageViewModel.columns;
  const allDiagnostics = pageViewModel.diagnostics;

  const filteredRows = selectVisiblePipelinePreviewRows(
    rows,
    columns,
    previewState,
    allDiagnostics,
  );
  const visibleDiagnostics = selectVisiblePipelineDiagnostics(allDiagnostics, previewState);
  const { pageRows, totalPages, safePage } = paginateRows(
    filteredRows,
    previewState.currentPage,
    previewState.pageSize,
  );

  const healthState = derivePipelineHealthState(pageViewModel);

  const focused =
    previewState.focusedColumnKey === null
      ? null
      : columns.find((c) => c.key === previewState.focusedColumnKey) ?? null;

  const focusedColumn =
    focused === undefined || focused === null
      ? null
      : Object.freeze({
          column: focused,
          relatedDiagnostics: Object.freeze(
            allDiagnostics.filter((d) => d.columnIndex === focused.index),
          ),
          selectedForUnderstanding: previewState.selectedColumnKeys.includes(focused.key),
        });

  let emptyKind: PipelinePreviewViewModel["emptyState"]["kind"] = null;
  let emptyMessage: string | null = null;
  if (pageViewModel.dataset === null) {
    emptyKind = "NoPreview";
    emptyMessage = "Run preview to inspect dataset rows.";
  } else if (filteredRows.length === 0 && rows.length > 0) {
    emptyKind = "NoMatchingRows";
    emptyMessage = "No preview rows match the current search and filters.";
  } else if (visibleDiagnostics.length === 0 && allDiagnostics.length > 0) {
    emptyKind = "NoMatchingDiagnostics";
    emptyMessage = "No diagnostics match the current severity and category filters.";
  }

  const canConfirm = canConfirmPipelinePreview(pageViewModel, previewState);
  const reviewStatus =
    pageViewModel.diagnosticCounts.blocking > 0 && pageViewModel.dataset !== null
      ? ("Blocked" as const)
      : previewState.reviewStatus === "ReadyForUnderstanding"
        ? ("ReadyForUnderstanding" as const)
        : pageViewModel.dataset !== null
          ? previewState.reviewStatus === "NotStarted"
            ? ("Reviewing" as const)
            : previewState.reviewStatus
          : ("NotStarted" as const);

  return Object.freeze({
    visibleRows: pageRows,
    visibleDiagnostics,
    diagnosticCounts: pageViewModel.diagnosticCounts,
    filteredRowCount: filteredRows.length,
    totalPreviewRowCount: rows.length,
    selectedColumnCount: previewState.selectedColumnKeys.length,
    selectedColumnKeys: previewState.selectedColumnKeys,
    focusedColumn,
    healthState,
    healthLabels: Object.freeze({
      parseHealth: healthState,
      columnConsistency:
        pageViewModel.diagnostics.some((d) => d.category === "RowWidth") && healthState !== "Blocked"
          ? ("Attention" as const)
          : healthState,
      diagnosticSummary: healthState,
      formulaRisk: healthForFormula(pageViewModel, healthState),
      previewCoverage:
        pageViewModel.dataset === null
          ? ("Unknown" as const)
          : pageViewModel.truncated
            ? ("Attention" as const)
            : ("Healthy" as const),
      understandingReadiness:
        reviewStatus === "ReadyForUnderstanding"
          ? ("Healthy" as const)
          : reviewStatus === "Blocked"
            ? ("Blocked" as const)
            : pageViewModel.dataset === null
              ? ("Unknown" as const)
              : ("Attention" as const),
    }),
    reviewStatus,
    canConfirm,
    confirmDisabledReason: confirmDisabledReason(pageViewModel, previewState),
    handoff: previewState.handoff,
    pagination: Object.freeze({
      currentPage: safePage,
      pageSize: previewState.pageSize,
      totalPages,
      totalItems: filteredRows.length,
      canPrevious: safePage > 1,
      canNext: safePage < totalPages,
    }),
    sort: previewState.sortConfiguration,
    emptyState: Object.freeze({
      kind: emptyKind,
      message: emptyMessage,
    }),
    searchQuery: previewState.searchQuery,
    showOnlyRowsWithDiagnostics: previewState.showOnlyRowsWithDiagnostics,
    showOnlyRowsWithFormulaRisk: previewState.showOnlyRowsWithFormulaRisk,
    diagnosticSeverities: previewState.diagnosticSeverities,
    diagnosticCategories: previewState.diagnosticCategories,
    readiness: "ReadyForUnderstandingConnection",
    nextPhase: "UI-PIPE-1:3 — Pipeline-to-DKL-3 Handoff Contract",
    pageViewModel,
    identity: Object.freeze({ ...identity }),
  });
}
