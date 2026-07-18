"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import { formatSampleValues } from "../../lib/pipeline/pipelinePageFormatters";
import type { PipelineColumnView } from "../../lib/pipeline/pipelinePageTypes";
import type { PipelineSortDirection } from "../../lib/pipeline/pipelinePreviewTypes";

export interface PipelineColumnPreviewProps {
  readonly columns: readonly PipelineColumnView[];
  readonly selectedColumnKeys?: readonly string[];
  readonly focusedColumnKey?: string | null;
  readonly blockingColumnIndexes?: readonly number[];
  readonly sortColumnKey?: string | null;
  readonly sortDirection?: PipelineSortDirection;
  readonly onToggleColumn?: (columnKey: string) => void;
  readonly onFocusColumn?: (columnKey: string) => void;
  readonly onSelectAll?: () => void;
  readonly onClearAll?: () => void;
  readonly onSortColumn?: (columnKey: string, direction: PipelineSortDirection) => void;
}

export function PipelineColumnPreview({
  columns,
  selectedColumnKeys,
  focusedColumnKey = null,
  blockingColumnIndexes = [],
  sortColumnKey = null,
  sortDirection = "None",
  onToggleColumn,
  onFocusColumn,
  onSelectAll,
  onClearAll,
  onSortColumn,
}: PipelineColumnPreviewProps) {
  const selectionEnabled = selectedColumnKeys !== undefined;

  return (
    <section aria-label="Column preview" style={{ ...softCardStyle, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 15, color: nx.textStrong }}>Column Preview</h2>
        {selectionEnabled ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onSelectAll} style={secondaryButton}>
              Select All
            </button>
            <button type="button" onClick={onClearAll} style={secondaryButton}>
              Clear All
            </button>
          </div>
        ) : null}
      </div>
      {columns.length === 0 ? (
        <p style={{ margin: 0, color: nx.muted, fontSize: 13 }}>No columns yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {selectionEnabled ? (
                  <th scope="col" style={headerStyle}>
                    Selected
                  </th>
                ) : null}
                {[
                  "Index",
                  "Column Name",
                  "Internal Key",
                  "Primitive Type",
                  "Sample Values",
                  "Empty Count",
                  "Formula Risk",
                ].map((header) => (
                  <th key={header} scope="col" style={headerStyle}>
                    {header}
                  </th>
                ))}
                {onSortColumn ? (
                  <th scope="col" style={headerStyle}>
                    Sort
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {columns.map((column) => {
                const selected = selectedColumnKeys?.includes(column.key) ?? false;
                const focused = focusedColumnKey === column.key;
                const blocked = blockingColumnIndexes.includes(column.index);
                return (
                  <tr
                    key={column.key}
                    style={{
                      background: focused ? nx.accentSoft : undefined,
                      outline: blocked ? `1px solid ${nx.risk}` : undefined,
                    }}
                  >
                    {selectionEnabled ? (
                      <td style={cellStyle}>
                        <input
                          type="checkbox"
                          checked={selected}
                          aria-checked={selected}
                          aria-label={`Select column ${column.displayName}`}
                          onChange={() => onToggleColumn?.(column.key)}
                        />
                      </td>
                    ) : null}
                    <td style={cellStyle}>{column.index}</td>
                    <td style={cellStyle}>
                      <button
                        type="button"
                        onClick={() => onFocusColumn?.(column.key)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: nx.textStrong,
                          cursor: "pointer",
                          padding: 0,
                          fontWeight: focused ? 700 : 500,
                          textDecoration: "underline",
                        }}
                      >
                        {column.displayName}
                      </button>
                      {blocked ? (
                        <span style={{ marginLeft: 6, color: nx.risk, fontSize: 11 }}>
                          [blocking]
                        </span>
                      ) : null}
                    </td>
                    <td style={{ ...cellStyle, fontFamily: "ui-monospace, monospace" }}>
                      {column.key}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        color: column.isUnknown ? nx.warning : nx.textStrong,
                        fontWeight: column.isUnknown ? 600 : 500,
                      }}
                    >
                      {column.primitiveType}
                      {column.isUnknown ? " (Unknown)" : ""}
                    </td>
                    <td style={cellStyle}>{formatSampleValues(column.sampleValues)}</td>
                    <td style={cellStyle}>{column.emptyValueCount}</td>
                    <td style={cellStyle}>{column.formulaRiskCount}</td>
                    {onSortColumn ? (
                      <td style={cellStyle}>
                        <select
                          aria-label={`Sort by ${column.displayName}`}
                          value={
                            sortColumnKey === column.key ? sortDirection : "None"
                          }
                          onChange={(event) =>
                            onSortColumn(
                              column.key,
                              event.target.value as PipelineSortDirection,
                            )
                          }
                          style={{
                            border: `1px solid ${nx.border}`,
                            borderRadius: 4,
                            background: nx.bgControl,
                            color: nx.text,
                            fontSize: 12,
                          }}
                        >
                          <option value="None">None</option>
                          <option value="Ascending">Ascending</option>
                          <option value="Descending">Descending</option>
                        </select>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
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
  color: nx.text,
  verticalAlign: "top",
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
