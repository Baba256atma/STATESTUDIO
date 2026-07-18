"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { PipelineHealthState, PipelinePreviewViewModel } from "../../lib/pipeline/pipelinePreviewTypes";

export interface PipelineHealthSummaryProps {
  readonly preview: PipelinePreviewViewModel;
}

const ITEMS: readonly {
  readonly key: keyof PipelinePreviewViewModel["healthLabels"];
  readonly label: string;
}[] = Object.freeze([
  { key: "parseHealth", label: "Parse Health" },
  { key: "columnConsistency", label: "Column Consistency" },
  { key: "diagnosticSummary", label: "Diagnostic Summary" },
  { key: "formulaRisk", label: "Formula Risk" },
  { key: "previewCoverage", label: "Preview Coverage" },
  { key: "understandingReadiness", label: "Understanding Readiness" },
]);

const colorFor = (state: PipelineHealthState): string => {
  switch (state) {
    case "Healthy":
      return nx.success;
    case "Attention":
      return nx.warning;
    case "Blocked":
      return nx.risk;
    default:
      return nx.muted;
  }
};

export function PipelineHealthSummary({ preview }: PipelineHealthSummaryProps) {
  return (
    <section aria-label="Dataset health summary" style={{ ...softCardStyle, padding: 16 }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 15, color: nx.textStrong }}>Dataset Health</h2>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: nx.muted }}>
        Parser-preview health only — not a data-quality, trust, or confidence score.
      </p>
      <p role="status" style={{ margin: "0 0 12px", fontSize: 13, color: nx.textStrong }}>
        Overall: <strong style={{ color: colorFor(preview.healthState) }}>{preview.healthState}</strong>
        {" · "}
        Review: {preview.reviewStatus}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 10,
        }}
      >
        {ITEMS.map((item) => {
          const value = preview.healthLabels[item.key];
          return (
            <div
              key={item.key}
              style={{
                border: `1px solid ${nx.border}`,
                borderRadius: 6,
                padding: "10px 12px",
                background: nx.bgControl,
              }}
            >
              <div style={{ fontSize: 11, color: nx.muted, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: colorFor(value) }}>{value}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
