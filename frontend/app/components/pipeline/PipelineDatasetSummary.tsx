"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { PipelinePageViewModel } from "../../lib/pipeline/pipelinePageTypes";

export interface PipelineDatasetSummaryProps {
  readonly viewModel: PipelinePageViewModel;
}

const cards = (
  viewModel: PipelinePageViewModel,
): readonly { readonly label: string; readonly value: string }[] =>
  Object.freeze([
    { label: "Dataset", value: viewModel.datasetName ?? "—" },
    { label: "Source Mode", value: viewModel.sourceMode ?? "—" },
    { label: "Encoding", value: viewModel.encoding ?? "—" },
    { label: "Delimiter", value: viewModel.delimiter ?? "—" },
    { label: "Columns", value: viewModel.columnCount?.toString() ?? "—" },
    { label: "Observed Rows", value: viewModel.rowCountObserved?.toString() ?? "—" },
    { label: "Previewed Rows", value: viewModel.rowCountPreviewed?.toString() ?? "—" },
    { label: "Parse Status", value: viewModel.parseStatus ?? "—" },
  ]);

export function PipelineDatasetSummary({ viewModel }: PipelineDatasetSummaryProps) {
  const items = cards(viewModel);
  return (
    <section
      id="pipeline-dataset-summary"
      aria-label="Dataset summary"
      tabIndex={-1}
      style={{ ...softCardStyle, padding: 16 }}
    >
      <h2 style={{ margin: "0 0 12px", fontSize: 15, color: nx.textStrong }}>Dataset Summary</h2>
      {viewModel.datasetName === null ? (
        <p style={{ margin: 0, color: nx.muted, fontSize: 13 }}>
          Run preview to populate dataset metadata.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 10,
          }}
        >
          {items.map((item) => (
            <div
              key={item.label}
              style={{
                border: `1px solid ${nx.border}`,
                borderRadius: 6,
                padding: "10px 12px",
                background: nx.bgControl,
              }}
            >
              <div style={{ fontSize: 11, color: nx.muted, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, color: nx.textStrong, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
