"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import { formatEmptyCell } from "../../lib/pipeline/pipelinePageFormatters";
import type {
  PipelineColumnView,
  PipelinePreviewRowView,
} from "../../lib/pipeline/pipelinePageTypes";

export interface PipelineDataPreviewProps {
  readonly columns: readonly PipelineColumnView[];
  readonly rows: readonly PipelinePreviewRowView[];
}

export function PipelineDataPreview({ columns, rows }: PipelineDataPreviewProps) {
  return (
    <section aria-label="Data preview" style={{ ...softCardStyle, padding: 16 }}>
      <h2 style={{ margin: "0 0 12px", fontSize: 15, color: nx.textStrong }}>Data Preview</h2>
      {rows.length === 0 ? (
        <p style={{ margin: 0, color: nx.muted, fontSize: 13 }}>No preview rows yet.</p>
      ) : (
        <div style={{ overflowX: "auto", maxHeight: 320, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ position: "sticky", top: 0, background: nx.bgElevated, zIndex: 1 }}>
              <tr>
                <th scope="col" style={headerStyle}>
                  #
                </th>
                {columns.map((column) => (
                  <th key={column.key} scope="col" style={headerStyle}>
                    {column.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.rowIndex}>
                  <td style={cellStyle}>{row.rowIndex + 1}</td>
                  {row.values.map((value, columnIndex) => {
                    const formulaRisk = row.formulaRiskFlags[columnIndex] === true;
                    const empty = value.length === 0;
                    return (
                      <td
                        key={`${row.rowIndex}-${columnIndex}`}
                        style={{
                          ...cellStyle,
                          color: empty ? nx.muted : nx.text,
                          fontStyle: empty ? "italic" : "normal",
                          background: formulaRisk ? nx.accentSoft : undefined,
                        }}
                        title={formulaRisk ? "Formula-risk value (not executed)" : undefined}
                      >
                        {formatEmptyCell(value)}
                        {formulaRisk ? (
                          <span style={{ marginLeft: 6, color: nx.warning, fontSize: 11 }}>
                            [formula-risk]
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const headerStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: `1px solid ${nx.border}`,
  color: nx.muted,
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const cellStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: `1px solid ${nx.borderSoft}`,
  verticalAlign: "top",
};
