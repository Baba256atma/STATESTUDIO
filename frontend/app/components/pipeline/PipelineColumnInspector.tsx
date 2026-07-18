"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import { formatSampleValues } from "../../lib/pipeline/pipelinePageFormatters";
import type { PipelinePreviewViewModel } from "../../lib/pipeline/pipelinePreviewTypes";

export interface PipelineColumnInspectorProps {
  readonly preview: PipelinePreviewViewModel;
}

export function PipelineColumnInspector({ preview }: PipelineColumnInspectorProps) {
  const focused = preview.focusedColumn;
  return (
    <aside
      aria-label="Column inspector"
      className="pipeline-column-inspector"
      style={{ ...softCardStyle, padding: 16 }}
    >
      <h2 style={{ margin: "0 0 12px", fontSize: 15, color: nx.textStrong }}>Column Inspector</h2>
      {focused === null ? (
        <p style={{ margin: 0, color: nx.muted, fontSize: 13 }}>
          Focus a column to inspect its metadata.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
          <Item label="Original Name" value={focused.column.displayName} />
          <Item label="Internal Key" value={focused.column.key} mono />
          <Item label="Primitive Type" value={focused.column.primitiveType} />
          <Item
            label="Sample Value Count"
            value={String(focused.column.sampleValues.length)}
          />
          <Item label="Empty Value Count" value={String(focused.column.emptyValueCount)} />
          <Item label="Formula Risk Count" value={String(focused.column.formulaRiskCount)} />
          <Item label="Sample Values" value={formatSampleValues(focused.column.sampleValues, 5)} />
          <Item
            label="Selected for Understanding"
            value={focused.selectedForUnderstanding ? "Yes" : "No"}
          />
          <div>
            <div style={{ color: nx.muted, fontSize: 11, marginBottom: 4 }}>Related Diagnostics</div>
            {focused.relatedDiagnostics.length === 0 ? (
              <div style={{ color: nx.text }}>None</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {focused.relatedDiagnostics.map((d) => (
                  <li key={d.diagnosticId}>
                    {d.code} — {d.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p
            role="note"
            style={{
              margin: "8px 0 0",
              padding: 10,
              borderRadius: 6,
              background: nx.bgControl,
              border: `1px solid ${nx.border}`,
              color: nx.textStrong,
              fontWeight: 600,
            }}
          >
            Semantic meaning has not been determined yet.
          </p>
        </div>
      )}
    </aside>
  );
}

function Item({
  label,
  value,
  mono,
}: {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
}) {
  return (
    <div>
      <div style={{ color: nx.muted, fontSize: 11, marginBottom: 2 }}>{label}</div>
      <div
        style={{
          color: nx.textStrong,
          fontFamily: mono ? "ui-monospace, monospace" : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
