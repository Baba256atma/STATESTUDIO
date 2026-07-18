/**
 * UI-PIPE-1:1 — Pipeline Page State.
 *
 * Pure initial state and reducer for the Pipeline Page workflow. Preserves
 * tenant/workspace/session identity across resets. No I/O, no clock, no random ids.
 *
 * Ownership: owned exclusively by UI-PIPE-1.
 */

import { CsvManualInputPolicies } from "../integrations/csvManualInputFoundation.ts";
import {
  INITIAL_MANUAL_COLUMNS,
  INITIAL_MANUAL_ROWS,
  PIPELINE_DEVELOPMENT_IDENTITY,
  type ManualTableDraft,
  type PipelineIdentity,
  type PipelineInputDraft,
  type PipelinePageAction,
  type PipelinePageState,
  type PipelineParseOptions,
} from "./pipelinePageTypes.ts";

const createEmptyInputDraft = (): PipelineInputDraft =>
  Object.freeze({
    csvFile: null,
    csvText: Object.freeze({ name: "pasted.csv", content: "" }),
    manualTable: Object.freeze({
      name: "manual-table",
      columns: INITIAL_MANUAL_COLUMNS,
      rows: INITIAL_MANUAL_ROWS,
    }),
  });

const createDefaultParseOptions = (): PipelineParseOptions =>
  Object.freeze({
    delimiter: "Auto",
    hasHeader: true,
    previewRowLimit: 50,
    strictColumnCount: false,
  });

const deriveCanRun = (
  mode: PipelinePageState["inputMode"],
  draft: PipelineInputDraft,
  isBusy: boolean,
): boolean => {
  if (isBusy) {
    return false;
  }
  if (mode === "CsvFile") {
    return draft.csvFile !== null && draft.csvFile.fileName.trim().length > 0;
  }
  if (mode === "CsvText") {
    return (
      draft.csvText.name.trim().length > 0 && draft.csvText.content.trim().length > 0
    );
  }
  return (
    draft.manualTable.name.trim().length > 0 &&
    draft.manualTable.columns.length > 0 &&
    draft.manualTable.columns.every((c) => c.trim().length > 0)
  );
};

const deriveStatus = (
  mode: PipelinePageState["inputMode"],
  draft: PipelineInputDraft,
  hasResult: boolean,
  failed: boolean,
  warnings: boolean,
): PipelinePageState["status"] => {
  if (failed) {
    return "Failed";
  }
  if (hasResult && warnings) {
    return "PreviewWithWarnings";
  }
  if (hasResult) {
    return "PreviewReady";
  }
  if (deriveCanRun(mode, draft, false)) {
    return "InputReady";
  }
  return "Idle";
};

const deriveActiveStep = (
  status: PipelinePageState["status"],
): PipelinePageState["activeStep"] => {
  switch (status) {
    case "Idle":
      return "Input";
    case "InputReady":
      return "Input";
    case "Validating":
      return "Validate";
    case "ReadingFile":
      return "Validate";
    case "Parsing":
      return "Parse";
    case "PreviewReady":
      return "Preview";
    case "PreviewWithWarnings":
      return "Review";
    case "Failed":
      return "Review";
  }
};

const finalize = (
  partial: Omit<PipelinePageState, "canRun" | "canReset" | "activeStep"> & {
    readonly activeStep?: PipelinePageState["activeStep"];
  },
): PipelinePageState => {
  const canRun = deriveCanRun(partial.inputMode, partial.inputDraft, partial.isBusy);
  const status =
    partial.status === "Validating" ||
    partial.status === "ReadingFile" ||
    partial.status === "Parsing"
      ? partial.status
      : deriveStatus(
          partial.inputMode,
          partial.inputDraft,
          partial.datasetResult !== null && partial.datasetResult.ok,
          partial.status === "Failed" ||
            (partial.datasetResult !== null && !partial.datasetResult.ok),
          partial.datasetResult?.ok === true &&
            (partial.datasetResult.dataset.parseStatus === "ParsedWithWarnings" ||
              partial.datasetResult.diagnostics.some(
                (d) => d.severity === "Warning" || d.severity === "Error",
              )),
        );
  return Object.freeze({
    ...partial,
    status,
    activeStep: partial.activeStep ?? deriveActiveStep(status),
    canRun,
    canReset: true,
  });
};

const clampManualTable = (table: ManualTableDraft): ManualTableDraft | { error: string } => {
  const maxCols = CsvManualInputPolicies.manualTable.maximumColumns;
  const maxRows = CsvManualInputPolicies.manualTable.maximumRows;
  if (table.columns.length > maxCols) {
    return { error: `Manual table exceeds maximum of ${maxCols} columns.` };
  }
  if (table.rows.length > maxRows) {
    return { error: `Manual table exceeds maximum of ${maxRows} rows.` };
  }
  return table;
};

/**
 * Create the canonical initial Pipeline Page state.
 * Identity defaults to the development adapter unless an override is supplied.
 */
export function createPipelinePageInitialState(
  identity: PipelineIdentity = PIPELINE_DEVELOPMENT_IDENTITY,
): PipelinePageState {
  return finalize({
    status: "Idle",
    identity: Object.freeze({ ...identity }),
    inputMode: "CsvText",
    inputDraft: createEmptyInputDraft(),
    parseOptions: createDefaultParseOptions(),
    datasetResult: null,
    uiDiagnostics: Object.freeze([]),
    activeStep: "Input",
    isBusy: false,
  });
}

/** Pure Pipeline Page reducer. Never mutates prior state. */
export function reducePipelinePageState(
  state: PipelinePageState,
  action: PipelinePageAction,
): PipelinePageState {
  switch (action.type) {
    case "SET_INPUT_MODE": {
      if (action.mode === state.inputMode) {
        return state;
      }
      return finalize({
        ...state,
        inputMode: action.mode,
        datasetResult: null,
        uiDiagnostics: Object.freeze([]),
        status: "Idle",
        isBusy: false,
        // Preserve identity; clear incompatible drafts by resetting mode-specific fields
        // while keeping other modes' drafts intact for potential return.
        inputDraft: state.inputDraft,
      });
    }
    case "SET_CSV_FILE_METADATA":
      return finalize({
        ...state,
        datasetResult: null,
        uiDiagnostics: Object.freeze([]),
        inputDraft: Object.freeze({
          ...state.inputDraft,
          csvFile: Object.freeze({ ...action.draft, content: null }),
        }),
        status: "InputReady",
      });
    case "SET_CSV_FILE_CONTENT":
      if (state.inputDraft.csvFile === null) {
        return state;
      }
      return finalize({
        ...state,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          csvFile: Object.freeze({ ...state.inputDraft.csvFile, content: action.content }),
        }),
      });
    case "CLEAR_CSV_FILE":
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({ ...state.inputDraft, csvFile: null }),
        status: "Idle",
      });
    case "SET_CSV_TEXT_NAME":
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          csvText: Object.freeze({ ...state.inputDraft.csvText, name: action.name }),
        }),
      });
    case "SET_CSV_TEXT_CONTENT":
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          csvText: Object.freeze({ ...state.inputDraft.csvText, content: action.content }),
        }),
      });
    case "CLEAR_CSV_TEXT":
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          csvText: Object.freeze({ name: state.inputDraft.csvText.name, content: "" }),
        }),
      });
    case "SET_MANUAL_TABLE_NAME":
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          manualTable: Object.freeze({
            ...state.inputDraft.manualTable,
            name: action.name,
          }),
        }),
      });
    case "SET_MANUAL_CELL": {
      const table = state.inputDraft.manualTable;
      if (
        action.rowIndex < 0 ||
        action.rowIndex >= table.rows.length ||
        action.columnIndex < 0 ||
        action.columnIndex >= table.columns.length
      ) {
        return state;
      }
      const rows = table.rows.map((row, ri) =>
        ri === action.rowIndex
          ? Object.freeze(row.map((cell, ci) => (ci === action.columnIndex ? action.value : cell)))
          : row,
      );
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          manualTable: Object.freeze({ ...table, rows: Object.freeze(rows) }),
        }),
      });
    }
    case "SET_MANUAL_COLUMN_NAME": {
      const table = state.inputDraft.manualTable;
      if (action.columnIndex < 0 || action.columnIndex >= table.columns.length) {
        return state;
      }
      const columns = table.columns.map((name, i) =>
        i === action.columnIndex ? action.name : name,
      );
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          manualTable: Object.freeze({ ...table, columns: Object.freeze(columns) }),
        }),
      });
    }
    case "ADD_MANUAL_ROW": {
      const table = state.inputDraft.manualTable;
      const next: ManualTableDraft = Object.freeze({
        ...table,
        rows: Object.freeze([
          ...table.rows,
          Object.freeze(table.columns.map(() => "")),
        ]),
      });
      const clamped = clampManualTable(next);
      if ("error" in clamped) {
        return finalize({
          ...state,
          uiDiagnostics: Object.freeze([
            ...state.uiDiagnostics,
            Object.freeze({
              diagnosticId: "ui-manual-row-limit",
              code: "MANUAL_ROW_LIMIT",
              severity: "Error" as const,
              message: clamped.error,
              field: "rows",
            }),
          ]),
        });
      }
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({ ...state.inputDraft, manualTable: clamped }),
      });
    }
    case "REMOVE_MANUAL_ROW": {
      const table = state.inputDraft.manualTable;
      if (table.rows.length <= 1 || action.rowIndex < 0 || action.rowIndex >= table.rows.length) {
        return state;
      }
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          manualTable: Object.freeze({
            ...table,
            rows: Object.freeze(table.rows.filter((_, i) => i !== action.rowIndex)),
          }),
        }),
      });
    }
    case "ADD_MANUAL_COLUMN": {
      const table = state.inputDraft.manualTable;
      const nextName = `Column ${table.columns.length + 1}`;
      const next: ManualTableDraft = Object.freeze({
        ...table,
        columns: Object.freeze([...table.columns, nextName]),
        rows: Object.freeze(table.rows.map((row) => Object.freeze([...row, ""]))),
      });
      const clamped = clampManualTable(next);
      if ("error" in clamped) {
        return finalize({
          ...state,
          uiDiagnostics: Object.freeze([
            ...state.uiDiagnostics,
            Object.freeze({
              diagnosticId: "ui-manual-col-limit",
              code: "MANUAL_COLUMN_LIMIT",
              severity: "Error" as const,
              message: clamped.error,
              field: "columns",
            }),
          ]),
        });
      }
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({ ...state.inputDraft, manualTable: clamped }),
      });
    }
    case "REMOVE_MANUAL_COLUMN": {
      const table = state.inputDraft.manualTable;
      if (
        table.columns.length <= 1 ||
        action.columnIndex < 0 ||
        action.columnIndex >= table.columns.length
      ) {
        return state;
      }
      return finalize({
        ...state,
        datasetResult: null,
        inputDraft: Object.freeze({
          ...state.inputDraft,
          manualTable: Object.freeze({
            ...table,
            columns: Object.freeze(table.columns.filter((_, i) => i !== action.columnIndex)),
            rows: Object.freeze(
              table.rows.map((row) =>
                Object.freeze(row.filter((_, i) => i !== action.columnIndex)),
              ),
            ),
          }),
        }),
      });
    }
    case "SET_DELIMITER":
      return finalize({
        ...state,
        datasetResult: null,
        parseOptions: Object.freeze({ ...state.parseOptions, delimiter: action.delimiter }),
      });
    case "SET_HAS_HEADER":
      return finalize({
        ...state,
        datasetResult: null,
        parseOptions: Object.freeze({ ...state.parseOptions, hasHeader: action.hasHeader }),
      });
    case "SET_PREVIEW_ROW_LIMIT":
      return finalize({
        ...state,
        datasetResult: null,
        parseOptions: Object.freeze({
          ...state.parseOptions,
          previewRowLimit: action.previewRowLimit,
        }),
      });
    case "SET_STRICT_COLUMN_COUNT":
      return finalize({
        ...state,
        datasetResult: null,
        parseOptions: Object.freeze({
          ...state.parseOptions,
          strictColumnCount: action.strictColumnCount,
        }),
      });
    case "RUN_STARTED":
    case "RUN_VALIDATING":
      return finalize({
        ...state,
        status: "Validating",
        isBusy: true,
        activeStep: "Validate",
        uiDiagnostics: Object.freeze([]),
      });
    case "RUN_READING_FILE":
      return finalize({
        ...state,
        status: "ReadingFile",
        isBusy: true,
        activeStep: "Validate",
      });
    case "RUN_PARSING":
      return finalize({
        ...state,
        status: "Parsing",
        isBusy: true,
        activeStep: "Parse",
      });
    case "RUN_SUCCEEDED": {
      const warnings =
        action.result.ok &&
        (action.result.dataset.parseStatus === "ParsedWithWarnings" ||
          action.result.diagnostics.some(
            (d) => d.severity === "Warning" || d.severity === "Error",
          ));
      return finalize({
        ...state,
        isBusy: false,
        datasetResult: action.result,
        uiDiagnostics: Object.freeze([]),
        status: warnings ? "PreviewWithWarnings" : "PreviewReady",
        activeStep: warnings ? "Review" : "Preview",
      });
    }
    case "RUN_FAILED":
      return finalize({
        ...state,
        isBusy: false,
        datasetResult: action.result ?? null,
        uiDiagnostics: Object.freeze([...action.diagnostics]),
        status: "Failed",
        activeStep: "Review",
      });
    case "ADD_UI_DIAGNOSTIC":
      return finalize({
        ...state,
        uiDiagnostics: Object.freeze([...state.uiDiagnostics, action.diagnostic]),
      });
    case "RESET":
      return createPipelinePageInitialState(state.identity);
    default:
      return state;
  }
}
