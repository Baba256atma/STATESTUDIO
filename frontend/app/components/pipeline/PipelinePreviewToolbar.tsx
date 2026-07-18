"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import type {
  PipelinePreviewAction,
  PipelinePreviewViewModel,
} from "../../lib/pipeline/pipelinePreviewTypes";

export interface PipelinePreviewToolbarProps {
  readonly preview: PipelinePreviewViewModel;
  readonly dispatch: (action: PipelinePreviewAction) => void;
}

export function PipelinePreviewToolbar({ preview, dispatch }: PipelinePreviewToolbarProps) {
  return (
    <section
      aria-label="Preview toolbar"
      className="pipeline-preview-toolbar"
      style={{ ...softCardStyle, padding: 12, display: "grid", gap: 10 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "end" }}>
        <div style={{ flex: "1 1 220px" }}>
          <label htmlFor="pipeline-preview-search" style={labelStyle}>
            Search preview rows
          </label>
          <input
            id="pipeline-preview-search"
            type="search"
            value={preview.searchQuery}
            onChange={(event) =>
              dispatch({ type: "SET_SEARCH_QUERY", searchQuery: event.target.value })
            }
            placeholder="Match cell text…"
            style={controlStyle}
          />
        </div>
        <p style={{ margin: 0, fontSize: 13, color: nx.muted }} role="status" aria-live="polite">
          Showing {preview.filteredRowCount} of {preview.totalPreviewRowCount} preview rows
        </p>
      </div>

      <fieldset style={{ border: `1px solid ${nx.border}`, borderRadius: 8, margin: 0, padding: 10 }}>
        <legend style={{ padding: "0 6px", fontSize: 12, color: nx.textStrong }}>Row filters</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <label style={checkLabel}>
            <input
              type="checkbox"
              checked={
                !preview.showOnlyRowsWithDiagnostics && !preview.showOnlyRowsWithFormulaRisk
              }
              onChange={() => {
                dispatch({ type: "SET_ROW_FILTER_DIAGNOSTICS", enabled: false });
                dispatch({ type: "SET_ROW_FILTER_FORMULA_RISK", enabled: false });
              }}
            />
            All Rows
          </label>
          <label style={checkLabel}>
            <input
              type="checkbox"
              checked={preview.showOnlyRowsWithDiagnostics}
              onChange={(event) =>
                dispatch({ type: "SET_ROW_FILTER_DIAGNOSTICS", enabled: event.target.checked })
              }
            />
            Rows With Diagnostics
          </label>
          <label style={checkLabel}>
            <input
              type="checkbox"
              checked={preview.showOnlyRowsWithFormulaRisk}
              onChange={(event) =>
                dispatch({ type: "SET_ROW_FILTER_FORMULA_RISK", enabled: event.target.checked })
              }
            />
            Rows With Formula Risk
          </label>
        </div>
      </fieldset>

      {preview.emptyState.kind === "NoMatchingRows" ? (
        <p role="status" style={{ margin: 0, color: nx.warning, fontSize: 13 }}>
          {preview.emptyState.message}
        </p>
      ) : null}
    </section>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: nx.muted,
  fontWeight: 600,
  marginBottom: 4,
};

const controlStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${nx.border}`,
  borderRadius: 6,
  background: nx.bgControl,
  color: nx.text,
  padding: "8px 10px",
  fontSize: 13,
};

const checkLabel: React.CSSProperties = {
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
  fontSize: 13,
  color: nx.text,
};
