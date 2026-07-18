"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import { formatBytes, formatInputModeLabel } from "../../lib/pipeline/pipelinePageFormatters";
import {
  PIPELINE_DELIMITER_OPTIONS,
  PIPELINE_INPUT_MODES,
  PIPELINE_PREVIEW_ROW_LIMITS,
  type PipelinePageAction,
  type PipelinePageState,
  type PipelineParseOptions,
  type PreviewRowLimitOption,
} from "../../lib/pipeline/pipelinePageTypes";

export interface PipelineInputPanelProps {
  readonly state: PipelinePageState;
  readonly dispatch: (action: PipelinePageAction) => void;
  readonly onSelectFile: (file: File) => void;
  readonly onRunPreview: () => void;
  readonly canRun: boolean;
  readonly isBusy: boolean;
}

export function PipelineInputPanel({
  state,
  dispatch,
  onSelectFile,
  onRunPreview,
  canRun,
  isBusy,
}: PipelineInputPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <aside
      aria-label="Pipeline input"
      style={{
        ...softCardStyle,
        padding: 16,
        display: "grid",
        gap: 16,
        alignContent: "start",
      }}
    >
      <div>
        <h2 style={{ margin: "0 0 10px", fontSize: 15, color: nx.textStrong }}>Input</h2>
        <div
          role="tablist"
          aria-label="Input mode"
          style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
        >
          {PIPELINE_INPUT_MODES.map((mode) => {
            const selected = state.inputMode === mode;
            return (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => dispatch({ type: "SET_INPUT_MODE", mode })}
                style={segmentStyle(selected)}
              >
                {formatInputModeLabel(mode)}
              </button>
            );
          })}
        </div>
      </div>

      {state.inputMode === "CsvFile" ? (
        <div style={{ display: "grid", gap: 8 }}>
          <label htmlFor="pipeline-csv-file" style={labelStyle}>
            CSV File
          </label>
          <input
            id="pipeline-csv-file"
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onSelectFile(file);
              }
            }}
          />
          {state.inputDraft.csvFile ? (
            <p style={{ margin: 0, fontSize: 13, color: nx.text }}>
              Selected: <strong>{state.inputDraft.csvFile.fileName}</strong> (
              {formatBytes(state.inputDraft.csvFile.fileSizeBytes)})
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: nx.muted }}>No file selected.</p>
          )}
        </div>
      ) : null}

      {state.inputMode === "CsvText" ? (
        <div style={{ display: "grid", gap: 8 }}>
          <label htmlFor="pipeline-csv-text-name" style={labelStyle}>
            Dataset name
          </label>
          <input
            id="pipeline-csv-text-name"
            type="text"
            value={state.inputDraft.csvText.name}
            onChange={(event) =>
              dispatch({ type: "SET_CSV_TEXT_NAME", name: event.target.value })
            }
            style={controlStyle}
          />
          <label htmlFor="pipeline-csv-text" style={labelStyle}>
            CSV text
          </label>
          <textarea
            id="pipeline-csv-text"
            value={state.inputDraft.csvText.content}
            onChange={(event) =>
              dispatch({ type: "SET_CSV_TEXT_CONTENT", content: event.target.value })
            }
            placeholder={"customer_name,product,quantity\nABC Company,Laptop,10"}
            rows={10}
            style={{ ...controlStyle, fontFamily: "ui-monospace, monospace", resize: "vertical" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: nx.muted }}>
              {state.inputDraft.csvText.content.length.toLocaleString()} characters
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: "CLEAR_CSV_TEXT" })}
              style={secondaryButtonStyle}
            >
              Clear text
            </button>
          </div>
        </div>
      ) : null}

      {state.inputMode === "ManualTable" ? (
        <ManualTableEditor state={state} dispatch={dispatch} />
      ) : null}

      <fieldset style={{ border: `1px solid ${nx.border}`, borderRadius: 8, padding: 12, margin: 0 }}>
        <legend style={{ padding: "0 6px", color: nx.textStrong, fontSize: 13 }}>
          Parse options
        </legend>
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <label htmlFor="pipeline-delimiter" style={labelStyle}>
              Delimiter
            </label>
            <select
              id="pipeline-delimiter"
              value={state.parseOptions.delimiter}
              onChange={(event) =>
                dispatch({
                  type: "SET_DELIMITER",
                  delimiter: event.target.value as PipelineParseOptions["delimiter"],
                })
              }
              style={controlStyle}
            >
              {PIPELINE_DELIMITER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <label style={{ ...labelStyle, display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={state.parseOptions.hasHeader}
              onChange={(event) =>
                dispatch({ type: "SET_HAS_HEADER", hasHeader: event.target.checked })
              }
            />
            Header row
          </label>
          <div>
            <label htmlFor="pipeline-preview-limit" style={labelStyle}>
              Preview row limit
            </label>
            <select
              id="pipeline-preview-limit"
              value={state.parseOptions.previewRowLimit}
              onChange={(event) =>
                dispatch({
                  type: "SET_PREVIEW_ROW_LIMIT",
                  previewRowLimit: Number(event.target.value) as PreviewRowLimitOption,
                })
              }
              style={controlStyle}
            >
              {PIPELINE_PREVIEW_ROW_LIMITS.map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
          <label style={{ ...labelStyle, display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={state.parseOptions.strictColumnCount}
              onChange={(event) =>
                dispatch({
                  type: "SET_STRICT_COLUMN_COUNT",
                  strictColumnCount: event.target.checked,
                })
              }
            />
            Strict column count
          </label>
        </div>
      </fieldset>

      <button
        type="button"
        onClick={onRunPreview}
        disabled={!canRun || isBusy}
        aria-disabled={!canRun || isBusy}
        style={{
          ...primaryButtonStyle,
          opacity: !canRun || isBusy ? 0.55 : 1,
          cursor: !canRun || isBusy ? "not-allowed" : "pointer",
        }}
      >
        {isBusy ? "Running…" : "Run Preview"}
      </button>
    </aside>
  );
}

function ManualTableEditor({
  state,
  dispatch,
}: {
  readonly state: PipelinePageState;
  readonly dispatch: (action: PipelinePageAction) => void;
}) {
  const table = state.inputDraft.manualTable;
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label htmlFor="pipeline-manual-name" style={labelStyle}>
        Table name
      </label>
      <input
        id="pipeline-manual-name"
        type="text"
        value={table.name}
        onChange={(event) =>
          dispatch({ type: "SET_MANUAL_TABLE_NAME", name: event.target.value })
        }
        style={controlStyle}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => dispatch({ type: "ADD_MANUAL_ROW" })} style={secondaryButtonStyle}>
          Add row
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "ADD_MANUAL_COLUMN" })}
          style={secondaryButtonStyle}
        >
          Add column
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
          <thead>
            <tr>
              <th scope="col" style={tableHeaderStyle}>
                #
              </th>
              {table.columns.map((column, columnIndex) => (
                <th key={`col-${columnIndex}`} scope="col" style={tableHeaderStyle}>
                  <input
                    aria-label={`Column ${columnIndex + 1} name`}
                    value={column}
                    onChange={(event) =>
                      dispatch({
                        type: "SET_MANUAL_COLUMN_NAME",
                        columnIndex,
                        name: event.target.value,
                      })
                    }
                    style={{ ...controlStyle, minWidth: 90 }}
                  />
                  <button
                    type="button"
                    aria-label={`Remove column ${columnIndex + 1}`}
                    onClick={() => dispatch({ type: "REMOVE_MANUAL_COLUMN", columnIndex })}
                    style={{ ...secondaryButtonStyle, marginTop: 4 }}
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                <td style={{ padding: 4, color: nx.muted }}>
                  {rowIndex + 1}
                  <button
                    type="button"
                    aria-label={`Remove row ${rowIndex + 1}`}
                    onClick={() => dispatch({ type: "REMOVE_MANUAL_ROW", rowIndex })}
                    style={{ ...secondaryButtonStyle, display: "block", marginTop: 4 }}
                  >
                    Remove
                  </button>
                </td>
                {row.map((cell, columnIndex) => (
                  <td key={`cell-${rowIndex}-${columnIndex}`} style={{ padding: 4 }}>
                    <input
                      aria-label={`Row ${rowIndex + 1} column ${columnIndex + 1}`}
                      value={cell}
                      onChange={(event) =>
                        dispatch({
                          type: "SET_MANUAL_CELL",
                          rowIndex,
                          columnIndex,
                          value: event.target.value,
                        })
                      }
                      style={controlStyle}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function segmentStyle(selected: boolean): React.CSSProperties {
  return {
    border: `1px solid ${selected ? nx.accent : nx.border}`,
    background: selected ? nx.accentSoft : nx.bgControl,
    color: nx.textStrong,
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    cursor: "pointer",
  };
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: nx.muted,
  fontWeight: 600,
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

const primaryButtonStyle: React.CSSProperties = {
  border: `1px solid ${nx.primaryCtaBorder}`,
  background: nx.primaryCtaBg,
  color: nx.primaryCtaColor,
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 14,
  fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
  border: `1px solid ${nx.border}`,
  background: nx.btnSecondaryBg,
  color: nx.btnSecondaryText,
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 12,
  cursor: "pointer",
};

const tableHeaderStyle: React.CSSProperties = {
  textAlign: "left",
  padding: 4,
  color: nx.muted,
  fontWeight: 600,
};
