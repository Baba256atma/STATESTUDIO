"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import {
  ALL_DIAGNOSTIC_CATEGORIES,
  ALL_DIAGNOSTIC_SEVERITIES,
  type PipelinePreviewAction,
  type PipelinePreviewViewModel,
} from "../../lib/pipeline/pipelinePreviewTypes";

export interface PipelineDiagnosticFiltersProps {
  readonly preview: PipelinePreviewViewModel;
  readonly dispatch: (action: PipelinePreviewAction) => void;
}

export function PipelineDiagnosticFilters({ preview, dispatch }: PipelineDiagnosticFiltersProps) {
  return (
    <section aria-label="Diagnostic filters" style={{ ...softCardStyle, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 15, color: nx.textStrong }}>Diagnostic Filters</h2>
        <button
          type="button"
          onClick={() => dispatch({ type: "RESET_DIAGNOSTIC_FILTERS" })}
          style={secondaryButton}
        >
          Reset Filters
        </button>
      </div>
      <p style={{ margin: "8px 0 12px", fontSize: 12, color: nx.muted }}>
        Full diagnostic counts remain unchanged. Blocking issues still affect readiness.
      </p>

      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>Severity</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {ALL_DIAGNOSTIC_SEVERITIES.map((severity) => (
            <label key={severity} style={checkLabel}>
              <input
                type="checkbox"
                checked={preview.diagnosticSeverities.includes(severity)}
                onChange={() => dispatch({ type: "TOGGLE_SEVERITY", severity })}
              />
              {severity}
              {severity === "Blocking" ? " (affects readiness)" : ""}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ ...fieldsetStyle, marginTop: 10 }}>
        <legend style={legendStyle}>Category</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {ALL_DIAGNOSTIC_CATEGORIES.map((category) => (
            <label key={category} style={checkLabel}>
              <input
                type="checkbox"
                checked={preview.diagnosticCategories.includes(category)}
                onChange={() => dispatch({ type: "TOGGLE_CATEGORY", category })}
              />
              {category}
            </label>
          ))}
        </div>
      </fieldset>

      <p style={{ margin: "10px 0 0", fontSize: 12, color: nx.textSoft }}>
        Showing {preview.visibleDiagnostics.length} of {preview.diagnosticCounts.total} diagnostics
        {" · "}
        Full counts — Blocking {preview.diagnosticCounts.blocking}, Error{" "}
        {preview.diagnosticCounts.error}, Warning {preview.diagnosticCounts.warning}, Info{" "}
        {preview.diagnosticCounts.info}
      </p>
    </section>
  );
}

const fieldsetStyle: React.CSSProperties = {
  border: `1px solid ${nx.border}`,
  borderRadius: 8,
  margin: 0,
  padding: 10,
};

const legendStyle: React.CSSProperties = {
  padding: "0 6px",
  fontSize: 12,
  color: nx.textStrong,
};

const checkLabel: React.CSSProperties = {
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
  fontSize: 12,
  color: nx.text,
};

const secondaryButton: React.CSSProperties = {
  border: `1px solid ${nx.border}`,
  background: nx.btnSecondaryBg,
  color: nx.btnSecondaryText,
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 12,
  cursor: "pointer",
};
