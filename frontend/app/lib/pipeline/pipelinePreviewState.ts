/**
 * UI-PIPE-1:2 — Pipeline Preview State.
 *
 * Pure initial state and reducer for the preview-review experience.
 * Ownership: owned exclusively by UI-PIPE-1:2.
 */

import {
  ALL_DIAGNOSTIC_CATEGORIES,
  ALL_DIAGNOSTIC_SEVERITIES,
  type PipelinePreviewAction,
  type PipelinePreviewState,
} from "./pipelinePreviewTypes.ts";

const defaultSort = Object.freeze({
  columnKey: null,
  direction: "None" as const,
});

export function createPipelinePreviewInitialState(): PipelinePreviewState {
  return Object.freeze({
    searchQuery: "",
    selectedColumnKeys: Object.freeze([]),
    focusedColumnKey: null,
    diagnosticSeverities: ALL_DIAGNOSTIC_SEVERITIES,
    diagnosticCategories: ALL_DIAGNOSTIC_CATEGORIES,
    showOnlyRowsWithDiagnostics: false,
    showOnlyRowsWithFormulaRisk: false,
    currentPage: 1,
    pageSize: 25,
    sortConfiguration: defaultSort,
    reviewStatus: "NotStarted",
    handoff: null,
    initializedForDatasetId: null,
  });
}

const withPageReset = (
  state: PipelinePreviewState,
  patch: Partial<PipelinePreviewState>,
): PipelinePreviewState =>
  Object.freeze({
    ...state,
    ...patch,
    currentPage: 1,
    handoff: patch.handoff === undefined ? null : patch.handoff,
    reviewStatus:
      patch.reviewStatus ??
      (state.reviewStatus === "ReadyForUnderstanding" ? "Reviewing" : state.reviewStatus),
  });

/** Pure preview-experience reducer. Never mutates prior state. */
export function reducePipelinePreviewState(
  state: PipelinePreviewState,
  action: PipelinePreviewAction,
): PipelinePreviewState {
  switch (action.type) {
    case "INITIALIZE_FROM_DATASET": {
      const keys = Object.freeze(action.dataset.columns.map((c) => c.key));
      return Object.freeze({
        ...createPipelinePreviewInitialState(),
        selectedColumnKeys: keys,
        focusedColumnKey: keys[0] ?? null,
        reviewStatus: "Reviewing",
        initializedForDatasetId: action.dataset.datasetId,
      });
    }
    case "SET_SEARCH_QUERY":
      return withPageReset(state, { searchQuery: action.searchQuery });
    case "SET_ROW_FILTER_DIAGNOSTICS":
      return withPageReset(state, { showOnlyRowsWithDiagnostics: action.enabled });
    case "SET_ROW_FILTER_FORMULA_RISK":
      return withPageReset(state, { showOnlyRowsWithFormulaRisk: action.enabled });
    case "TOGGLE_SEVERITY": {
      const has = state.diagnosticSeverities.includes(action.severity);
      const next = has
        ? state.diagnosticSeverities.filter((s) => s !== action.severity)
        : [...state.diagnosticSeverities, action.severity];
      return Object.freeze({
        ...state,
        diagnosticSeverities: Object.freeze(next),
        handoff: null,
        reviewStatus:
          state.reviewStatus === "ReadyForUnderstanding" ? "Reviewing" : state.reviewStatus,
      });
    }
    case "TOGGLE_CATEGORY": {
      const has = state.diagnosticCategories.includes(action.category);
      const next = has
        ? state.diagnosticCategories.filter((c) => c !== action.category)
        : [...state.diagnosticCategories, action.category];
      return Object.freeze({
        ...state,
        diagnosticCategories: Object.freeze(next),
        handoff: null,
        reviewStatus:
          state.reviewStatus === "ReadyForUnderstanding" ? "Reviewing" : state.reviewStatus,
      });
    }
    case "RESET_DIAGNOSTIC_FILTERS":
      return Object.freeze({
        ...state,
        diagnosticSeverities: ALL_DIAGNOSTIC_SEVERITIES,
        diagnosticCategories: ALL_DIAGNOSTIC_CATEGORIES,
      });
    case "SELECT_ALL_COLUMNS":
      return Object.freeze({
        ...state,
        selectedColumnKeys: Object.freeze([...action.columnKeys]),
        handoff: null,
        reviewStatus:
          state.reviewStatus === "ReadyForUnderstanding" ? "Reviewing" : state.reviewStatus,
      });
    case "CLEAR_ALL_COLUMNS":
      return Object.freeze({
        ...state,
        selectedColumnKeys: Object.freeze([]),
        handoff: null,
        reviewStatus:
          state.reviewStatus === "ReadyForUnderstanding" ? "Reviewing" : state.reviewStatus,
      });
    case "TOGGLE_COLUMN": {
      const selected = state.selectedColumnKeys.includes(action.columnKey);
      const next = selected
        ? state.selectedColumnKeys.filter((k) => k !== action.columnKey)
        : [...state.selectedColumnKeys, action.columnKey];
      // Preserve stable order matching allKeys.
      const ordered = action.allKeys.filter((k) => next.includes(k));
      return Object.freeze({
        ...state,
        selectedColumnKeys: Object.freeze(ordered),
        handoff: null,
        reviewStatus:
          state.reviewStatus === "ReadyForUnderstanding" ? "Reviewing" : state.reviewStatus,
      });
    }
    case "FOCUS_COLUMN":
      return Object.freeze({ ...state, focusedColumnKey: action.columnKey });
    case "SET_PAGE":
      return Object.freeze({
        ...state,
        currentPage: Math.max(1, action.page),
      });
    case "SET_PAGE_SIZE":
      return withPageReset(state, { pageSize: action.pageSize });
    case "SET_SORT":
      return withPageReset(state, {
        sortConfiguration: Object.freeze({
          columnKey: action.direction === "None" ? null : action.columnKey,
          direction: action.direction,
        }),
      });
    case "CONFIRM_PREVIEW":
      return Object.freeze({
        ...state,
        handoff: action.handoff,
        reviewStatus: "ReadyForUnderstanding",
      });
    case "MARK_BLOCKED":
      return Object.freeze({
        ...state,
        reviewStatus: "Blocked",
        handoff: null,
      });
    case "RESET":
      return createPipelinePreviewInitialState();
    default:
      return state;
  }
}
