"use client";

import React from "react";
import {
  createCsvDatasetPreview,
} from "../../lib/integrations/csvDatasetPreviewPlatform";
import {
  validateCsvManualInputFoundationRequest,
} from "../../lib/integrations/csvManualInputFoundation";
import { formatBytes, formatInputModeLabel } from "../../lib/pipeline/pipelinePageFormatters";
import {
  buildPipelinePageViewModel,
  buildPipelineParserRequest,
  canRunPipelinePreview,
  createPipelinePageInitialState,
  getPipelineStepStatuses,
  reducePipelinePageState,
} from "../../lib/pipeline/pipelinePageViewModel";
import {
  buildPipelinePreviewViewModel,
  buildPipelineUnderstandingHandoff,
  createPipelinePreviewInitialState,
  reducePipelinePreviewState,
} from "../../lib/pipeline/pipelinePreviewViewModel";
import { createPipelineUnderstandingIntakePackage } from "../../lib/pipeline/pipelineUnderstandingPlatform";
import type {
  PipelinePageAction,
  PipelinePageState,
  PipelineUiDiagnostic,
} from "../../lib/pipeline/pipelinePageTypes";
import type { PipelinePreviewAction } from "../../lib/pipeline/pipelinePreviewTypes";
import type { PipelineUnderstandingIntakeResult } from "../../lib/pipeline/pipelineUnderstandingContractTypes";
import { nx } from "../ui/nexoraTheme";
import { PipelineColumnInspector } from "./PipelineColumnInspector";
import { PipelineColumnPreview } from "./PipelineColumnPreview";
import { PipelineDataPreview } from "./PipelineDataPreview";
import { PipelineDatasetSummary } from "./PipelineDatasetSummary";
import { PipelineDiagnosticFilters } from "./PipelineDiagnosticFilters";
import { PipelineDiagnosticsPanel } from "./PipelineDiagnosticsPanel";
import { PipelineFlow } from "./PipelineFlow";
import { PipelineHealthSummary } from "./PipelineHealthSummary";
import { PipelineInputPanel } from "./PipelineInputPanel";
import { PipelinePreviewPagination } from "./PipelinePreviewPagination";
import { PipelinePreviewToolbar } from "./PipelinePreviewToolbar";
import { PipelineUnderstandingHandoffPanel } from "./PipelineUnderstandingHandoff";

/**
 * UI-PIPE-1:1/1:2/1:3 — Pipeline Page with Preview Experience and DKL-3 contract handoff.
 *
 * Coordinates browser input, INT-1 validation/parsing, preview review, and
 * Pipeline-to-DKL-3 intake-package construction. Does not implement CSV parsing
 * inside React and does not execute DKL-3.
 */
export function PipelinePage() {
  const [state, dispatch] = React.useReducer(
    reducePipelinePageState,
    undefined,
    createPipelinePageInitialState,
  );
  const [previewState, previewDispatch] = React.useReducer(
    reducePipelinePreviewState,
    undefined,
    createPipelinePreviewInitialState,
  );
  const [intakeResult, setIntakeResult] =
    React.useState<PipelineUnderstandingIntakeResult | null>(null);

  const viewModel = React.useMemo(() => buildPipelinePageViewModel(state), [state]);
  const preview = React.useMemo(
    () => buildPipelinePreviewViewModel(viewModel, previewState, state.identity),
    [viewModel, previewState, state.identity],
  );
  const steps = React.useMemo(
    () => getPipelineStepStatuses(state, preview.reviewStatus),
    [state, preview.reviewStatus],
  );
  const canRun = canRunPipelinePreview(state);

  const pageDispatch = React.useCallback((action: PipelinePageAction) => {
    if (action.type === "RESET") {
      previewDispatch({ type: "RESET" });
      setIntakeResult(null);
    }
    if (
      action.type === "SET_INPUT_MODE" ||
      action.type === "SET_CSV_TEXT_CONTENT" ||
      action.type === "SET_CSV_FILE_METADATA" ||
      action.type === "CLEAR_CSV_FILE" ||
      action.type === "CLEAR_CSV_TEXT"
    ) {
      previewDispatch({ type: "RESET" });
      setIntakeResult(null);
    }
    dispatch(action);
  }, []);

  const onSelectFile = React.useCallback(
    (file: File) => {
      const metadataResult = validateCsvManualInputFoundationRequest({
        tenantId: state.identity.tenantId,
        workspaceId: state.identity.workspaceId,
        sessionId: state.identity.sessionId,
        createdBy: "ui-pipe-1:1",
        input: {
          mode: "CsvFile",
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type || "text/csv",
          lastModified: file.lastModified,
          encodingHint: "UTF-8",
        },
      });

      if (metadataResult.outcome === "Failure") {
        pageDispatch({
          type: "RUN_FAILED",
          diagnostics: metadataResult.diagnostics.map((d) =>
            Object.freeze({
              diagnosticId: d.diagnosticId,
              code: d.code,
              severity:
                d.severity === "Blocking"
                  ? ("Blocking" as const)
                  : d.severity === "Error"
                    ? ("Error" as const)
                    : d.severity === "Warning"
                      ? ("Warning" as const)
                      : ("Info" as const),
              message: d.message,
              field: d.field,
            }),
          ),
        });
        return;
      }

      pageDispatch({
        type: "SET_CSV_FILE_METADATA",
        draft: {
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type || "text/csv",
          lastModified: file.lastModified,
          content: null,
        },
      });
    },
    [state.identity, pageDispatch],
  );

  const onRunPreview = React.useCallback(async () => {
    if (!canRunPipelinePreview(state)) {
      return;
    }

    pageDispatch({ type: "RUN_VALIDATING" });
    let workingState: PipelinePageState = reducePipelinePageState(state, { type: "RUN_VALIDATING" });

    if (workingState.inputMode === "CsvFile") {
      const fileDraft = workingState.inputDraft.csvFile;
      if (fileDraft === null) {
        pageDispatch({
          type: "RUN_FAILED",
          diagnostics: [
            uiDiagnostic("FILE_REQUIRED", "Select a CSV file before running preview.", "file"),
          ],
        });
        return;
      }

      if (fileDraft.content === null) {
        pageDispatch({ type: "RUN_READING_FILE" });
        const inputEl = document.getElementById("pipeline-csv-file") as HTMLInputElement | null;
        const file = inputEl?.files?.[0];
        if (!file) {
          pageDispatch({
            type: "RUN_FAILED",
            diagnostics: [
              uiDiagnostic("FILE_READ_FAILED", "Unable to read the selected file.", "file"),
            ],
          });
          return;
        }
        try {
          const content = await file.text();
          pageDispatch({ type: "SET_CSV_FILE_CONTENT", content });
          workingState = reducePipelinePageState(
            reducePipelinePageState(workingState, { type: "RUN_READING_FILE" }),
            { type: "SET_CSV_FILE_CONTENT", content },
          );
        } catch {
          pageDispatch({
            type: "RUN_FAILED",
            diagnostics: [
              uiDiagnostic("FILE_READ_FAILED", "Browser file read failed.", "file"),
            ],
          });
          return;
        }
      }
    }

    const built = buildPipelineParserRequest(workingState);
    if (!built.ok) {
      pageDispatch({ type: "RUN_FAILED", diagnostics: built.diagnostics });
      return;
    }

    pageDispatch({ type: "RUN_PARSING" });
    try {
      const result = createCsvDatasetPreview(built.request);
      setIntakeResult(null);
      if (result.ok) {
        pageDispatch({ type: "RUN_SUCCEEDED", result });
        previewDispatch({ type: "INITIALIZE_FROM_DATASET", dataset: result.dataset });
        if (result.diagnostics.some((d) => d.severity === "Blocking")) {
          previewDispatch({ type: "MARK_BLOCKED" });
        }
        queueMicrotask(() => {
          document.getElementById("pipeline-dataset-summary")?.focus();
        });
      } else {
        pageDispatch({
          type: "RUN_FAILED",
          result,
          diagnostics: result.diagnostics.map((d) =>
            Object.freeze({
              diagnosticId: d.diagnosticId,
              code: d.code,
              severity:
                d.severity === "Blocking"
                  ? ("Blocking" as const)
                  : d.severity === "Error"
                    ? ("Error" as const)
                    : d.severity === "Warning"
                      ? ("Warning" as const)
                      : ("Info" as const),
              message: d.message,
              field: d.field,
            }),
          ),
        });
        if (result.partialPreview) {
          previewDispatch({ type: "INITIALIZE_FROM_DATASET", dataset: result.partialPreview });
          previewDispatch({ type: "MARK_BLOCKED" });
        } else {
          previewDispatch({ type: "RESET" });
        }
        queueMicrotask(() => {
          document.getElementById("pipeline-diagnostics")?.focus();
        });
      }
    } catch {
      pageDispatch({
        type: "RUN_FAILED",
        diagnostics: [
          uiDiagnostic("PARSER_UNEXPECTED", "Unexpected parser failure. The page did not crash."),
        ],
      });
    }
  }, [state, pageDispatch]);

  const onConfirmPreview = React.useCallback(() => {
    if (!preview.canConfirm || viewModel.dataset === null) {
      return;
    }
    const formulaRiskCount = viewModel.columns.reduce((sum, c) => sum + c.formulaRiskCount, 0);
    const handoff = buildPipelineUnderstandingHandoff({
      identity: state.identity,
      dataset: viewModel.dataset,
      selectedColumnKeys: previewState.selectedColumnKeys,
      diagnosticCounts: viewModel.diagnosticCounts,
      formulaRiskCount,
    });
    if (handoff === null) {
      return;
    }
    previewDispatch({ type: "CONFIRM_PREVIEW", handoff });
    const confirmedBy = state.identity.developmentFallback
      ? "development-adapter:pipeline-preview"
      : `session:${state.identity.sessionId}`;
    const result = createPipelineUnderstandingIntakePackage({
      dataset: viewModel.dataset,
      handoff,
      confirmedBy,
    });
    setIntakeResult(result);
  }, [preview.canConfirm, viewModel, state.identity, previewState.selectedColumnKeys]);

  const columnKeys = viewModel.columns.map((c) => c.key);
  const blockingColumnIndexes = viewModel.diagnostics
    .filter((d) => d.severity === "Blocking" && d.columnIndex !== null)
    .map((d) => d.columnIndex as number);

  return (
    <div
      className="pipeline-page-root"
      aria-busy={state.isBusy}
      style={{
        minHeight: "100vh",
        background: nx.bgApp,
        color: nx.text,
        padding: "20px 24px 40px",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: `1px solid ${nx.border}`,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: nx.textStrong }}>Data Pipeline</h1>
          <p style={{ margin: "6px 0 0", color: nx.muted, fontSize: 14 }}>
            Import and preview organizational data before understanding and mapping.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: nx.textSoft }}>
            Mode: {formatInputModeLabel(state.inputMode)}
            {viewModel.datasetName ? ` · Dataset: ${viewModel.datasetName}` : ""}
            {state.inputDraft.csvFile
              ? ` · File: ${state.inputDraft.csvFile.fileName} (${formatBytes(state.inputDraft.csvFile.fileSizeBytes)})`
              : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span
            role="status"
            aria-live="polite"
            style={{
              border: `1px solid ${nx.border}`,
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              background: nx.chipSurface,
              color: nx.textStrong,
            }}
          >
            Status: {viewModel.headerStatus}
            {preview.reviewStatus === "ReadyForUnderstanding" ? " · Ready for Understanding" : ""}
          </span>
          <button
            type="button"
            onClick={() => pageDispatch({ type: "RESET" })}
            style={{
              border: `1px solid ${nx.border}`,
              background: nx.btnSecondaryBg,
              color: nx.btnSecondaryText,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <div
        className="pipeline-page-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <PipelineInputPanel
          state={state}
          dispatch={pageDispatch as (action: PipelinePageAction) => void}
          onSelectFile={onSelectFile}
          onRunPreview={() => {
            void onRunPreview();
          }}
          canRun={canRun}
          isBusy={state.isBusy}
        />

        <main
          aria-label="Pipeline preview workspace"
          style={{ display: "grid", gap: 14, minWidth: 0 }}
        >
          <PipelineFlow steps={steps} />
          <PipelineDatasetSummary viewModel={viewModel} />
          <PipelineHealthSummary preview={preview} />
          <PipelinePreviewToolbar
            preview={preview}
            dispatch={previewDispatch as (action: PipelinePreviewAction) => void}
          />

          <div
            className="pipeline-preview-columns-layout"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 280px)",
              gap: 12,
              alignItems: "start",
            }}
          >
            <PipelineColumnPreview
              columns={viewModel.columns}
              selectedColumnKeys={preview.selectedColumnKeys}
              focusedColumnKey={previewState.focusedColumnKey}
              blockingColumnIndexes={blockingColumnIndexes}
              sortColumnKey={preview.sort.columnKey}
              sortDirection={preview.sort.direction}
              onToggleColumn={(columnKey) =>
                previewDispatch({ type: "TOGGLE_COLUMN", columnKey, allKeys: columnKeys })
              }
              onFocusColumn={(columnKey) =>
                previewDispatch({ type: "FOCUS_COLUMN", columnKey })
              }
              onSelectAll={() =>
                previewDispatch({ type: "SELECT_ALL_COLUMNS", columnKeys })
              }
              onClearAll={() => previewDispatch({ type: "CLEAR_ALL_COLUMNS" })}
              onSortColumn={(columnKey, direction) =>
                previewDispatch({ type: "SET_SORT", columnKey, direction })
              }
            />
            <PipelineColumnInspector preview={preview} />
          </div>

          <PipelineDataPreview columns={viewModel.columns} rows={preview.visibleRows} />
          <PipelinePreviewPagination
            preview={preview}
            dispatch={previewDispatch as (action: PipelinePreviewAction) => void}
          />
          <PipelineDiagnosticFilters
            preview={preview}
            dispatch={previewDispatch as (action: PipelinePreviewAction) => void}
          />
          <PipelineDiagnosticsPanel
            viewModel={viewModel}
            visibleDiagnostics={preview.visibleDiagnostics}
          />
          <PipelineUnderstandingHandoffPanel
            preview={preview}
            onConfirm={onConfirmPreview}
            intakeResult={intakeResult}
          />
        </main>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .pipeline-page-layout {
            grid-template-columns: 1fr !important;
          }
          .pipeline-preview-columns-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <p style={{ marginTop: 20, fontSize: 12, color: nx.lowMuted }}>
        PipelinePreviewExperienceComplete · ReadyForUnderstandingConnection · Next: UI-PIPE-1:3 —
        Pipeline-to-DKL-3 Handoff Contract
        {state.identity.developmentFallback ? " · Development identity adapter active" : ""}
      </p>
    </div>
  );
}

function uiDiagnostic(
  code: string,
  message: string,
  field: string | null = null,
): PipelineUiDiagnostic {
  return Object.freeze({
    diagnosticId: `ui-${code}`,
    code,
    severity: "Error",
    message,
    field,
  });
}
