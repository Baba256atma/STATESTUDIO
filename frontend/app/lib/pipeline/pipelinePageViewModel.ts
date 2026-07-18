/**
 * UI-PIPE-1:1 — Pipeline Page View Model (canonical public API surface).
 *
 * Builds UI-ready view models from parser results without mutating them, and
 * re-exports the six canonical runtime APIs for the Pipeline Page foundation.
 *
 * Ownership: owned exclusively by UI-PIPE-1.
 */

import type { ParserDiagnostic } from "../integrations/csvParserTypes.ts";
import { toHeaderStatus } from "./pipelinePageFormatters.ts";
import { buildPipelineParserRequest } from "./pipelinePageRequestBuilder.ts";
import {
  createPipelinePageInitialState,
  reducePipelinePageState,
} from "./pipelinePageState.ts";
import {
  canRunPipelinePreview,
  getPipelineStepStatuses,
} from "./pipelinePageSelectors.ts";
import type {
  PipelineColumnView,
  PipelineDiagnosticCounts,
  PipelinePageState,
  PipelinePageViewModel,
  PipelinePreviewRowView,
} from "./pipelinePageTypes.ts";

export {
  createPipelinePageInitialState,
  reducePipelinePageState,
  buildPipelineParserRequest,
  getPipelineStepStatuses,
  canRunPipelinePreview,
};

const countDiagnostics = (
  parserDiagnostics: readonly ParserDiagnostic[],
  uiCount: { blocking: number; error: number; warning: number; info: number },
): PipelineDiagnosticCounts => {
  let blocking = uiCount.blocking;
  let error = uiCount.error;
  let warning = uiCount.warning;
  let info = uiCount.info;
  for (const d of parserDiagnostics) {
    if (d.severity === "Blocking") {
      blocking += 1;
    } else if (d.severity === "Error") {
      error += 1;
    } else if (d.severity === "Warning") {
      warning += 1;
    } else {
      info += 1;
    }
  }
  return Object.freeze({
    blocking,
    error,
    warning,
    info,
    total: blocking + error + warning + info,
  });
};

/**
 * Convert parser + UI state into an immutable Pipeline Page view model.
 * Does not mutate the underlying parser result.
 */
export function buildPipelinePageViewModel(state: PipelinePageState): PipelinePageViewModel {
  const result = state.datasetResult;
  const dataset = result?.ok ? result.dataset : result && !result.ok ? result.partialPreview : null;
  const parserDiagnostics: readonly ParserDiagnostic[] = result
    ? result.ok
      ? result.diagnostics
      : result.diagnostics
    : Object.freeze([]);

  const uiCounts = {
    blocking: state.uiDiagnostics.filter((d) => d.severity === "Blocking").length,
    error: state.uiDiagnostics.filter((d) => d.severity === "Error").length,
    warning: state.uiDiagnostics.filter((d) => d.severity === "Warning").length,
    info: state.uiDiagnostics.filter((d) => d.severity === "Info").length,
  };

  const columns: readonly PipelineColumnView[] = dataset
    ? Object.freeze(
        dataset.columns.map((column) =>
          Object.freeze({
            index: column.index,
            displayName: column.displayName,
            key: column.key,
            primitiveType: column.primitiveType,
            sampleValues: column.sampleValues,
            emptyValueCount: column.emptyValueCount,
            formulaRiskCount: column.formulaRiskCount,
            isUnknown: column.primitiveType === "Unknown",
          }),
        ),
      )
    : Object.freeze([]);

  const previewRows: readonly PipelinePreviewRowView[] = dataset
    ? Object.freeze(
        dataset.previewRows.map((row) => {
          const formulaRiskFlags = Object.freeze(
            row.values.map((_, columnIndex) =>
              row.cellDiagnostics.some(
                (d) => d.code === "FORMULA_RISK" && d.columnIndex === columnIndex,
              ),
            ),
          );
          return Object.freeze({
            rowIndex: row.rowIndex,
            values: row.values,
            formulaRiskFlags,
            hasFormulaRisk: row.hasFormulaRisk,
          });
        }),
      )
    : Object.freeze([]);

  const diagnosticCounts = countDiagnostics(parserDiagnostics, uiCounts);
  const hasErrors = diagnosticCounts.blocking > 0 || diagnosticCounts.error > 0;
  const hasWarnings = diagnosticCounts.warning > 0;

  return Object.freeze({
    status: state.status,
    headerStatus: toHeaderStatus(state.status),
    datasetName: dataset?.datasetName ?? null,
    sourceMode: dataset?.sourceMode ?? null,
    encoding: dataset?.encoding ?? null,
    delimiter: dataset?.delimiter ?? null,
    columnCount: dataset?.columnCount ?? null,
    rowCountObserved: dataset?.rowCountObserved ?? null,
    rowCountPreviewed: dataset?.rowCountPreviewed ?? null,
    parseStatus: dataset?.parseStatus ?? null,
    truncated: dataset?.truncated ?? false,
    columns,
    previewRows,
    diagnostics: parserDiagnostics,
    uiDiagnostics: state.uiDiagnostics,
    diagnosticCounts,
    hasWarnings,
    hasErrors,
    inputMode: state.inputMode,
    isBusy: state.isBusy,
    canRun: canRunPipelinePreview(state),
    canReset: state.canReset,
    activeStep: state.activeStep,
    readiness: "ReadyForPreviewUse",
    nextPhase: "UI-PIPE-1:2 — Pipeline Preview Experience",
    dataset,
  });
}
