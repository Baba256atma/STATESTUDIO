"use client";

import React from "react";

import {
  CSV_MAPPING_TARGETS,
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  updateCsvColumnMapping,
  type CsvColumnMapping,
  type CsvImportFlowState,
  type CsvMappingReview,
  type CsvParseResult,
  type CsvPreparedImport,
  type CsvVerticalSliceInput,
} from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  type CsvCommittedImport,
  type CsvImportCommitResult,
} from "../../../lib/data-reality/csvRealDataImportStore.ts";
import type { WorkspaceId } from "../../../lib/workspace/workspaceRegistryContract.ts";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme.ts";

const operationalVisualColors = Object.freeze({
  accent: cockpit.accent,
  border: cockpit.border,
  muted: cockpit.muted,
  success: cockpit.success,
  text: cockpit.text,
  warning: cockpit.warning,
});

const operationalVisualSpacing = Object.freeze({ sectionGap: cockpit.space.md });

function operationalCardStyle(
  tone: "neutral" | "warning" | "accent",
): React.CSSProperties {
  const accent =
    tone === "warning"
      ? cockpit.warning
      : tone === "accent"
        ? cockpit.accent
        : cockpit.border;
  return {
    border: `1px solid ${accent}`,
    borderRadius: cockpit.radius.md,
    background: cockpit.panelSoft,
    boxShadow: tone === "accent" ? cockpit.elevation.focus : cockpit.elevation.flat,
    padding: cockpit.space.md,
  };
}

function operationalCardHeadlineStyle(
  tone: "neutral" | "accent",
): React.CSSProperties {
  return {
    color: tone === "accent" ? cockpit.accent : cockpit.text,
    fontSize: cockpit.type.cardTitle.size,
    fontWeight: cockpit.type.cardTitle.weight,
    letterSpacing: cockpit.type.cardTitle.tracking,
  };
}

function operationalCardDetailStyle(): React.CSSProperties {
  return {
    color: cockpit.textSoft,
    fontSize: cockpit.type.body.size,
    lineHeight: cockpit.type.body.lineHeight,
  };
}

function operationalSectionLabelStyle(): React.CSSProperties {
  return {
    color: cockpit.lowMuted,
    fontSize: cockpit.type.status.size,
    fontWeight: cockpit.type.status.weight,
    letterSpacing: cockpit.type.status.tracking,
    textTransform: "uppercase",
  };
}

export type CsvRealDataImportFlowProps = Readonly<{
  workspaceId: WorkspaceId;
  onClose: () => void;
  onCompleted?: (committed: CsvCommittedImport) => void;
}>;

type FlowModel = Readonly<{
  status: CsvImportFlowState;
  input: CsvVerticalSliceInput | null;
  parse: CsvParseResult | null;
  mapping: CsvMappingReview | null;
  prepared: CsvPreparedImport | null;
  commit: CsvImportCommitResult | null;
  error: string | null;
}>;

type FlowAction =
  | Readonly<{ type: "reset" }>
  | Readonly<{ type: "selected"; input: CsvVerticalSliceInput }>
  | Readonly<{ type: "parsing" }>
  | Readonly<{ type: "parsed"; parse: CsvParseResult; mapping: CsvMappingReview }>
  | Readonly<{ type: "mapping"; mapping: CsvMappingReview }>
  | Readonly<{ type: "validating" }>
  | Readonly<{ type: "prepared"; prepared: CsvPreparedImport }>
  | Readonly<{ type: "importing" }>
  | Readonly<{ type: "completed"; commit: CsvImportCommitResult }>
  | Readonly<{ type: "error"; message: string }>
  | Readonly<{ type: "back-to-mapping" }>;

const INITIAL_FLOW: FlowModel = Object.freeze({ status: "idle", input: null, parse: null, mapping: null, prepared: null, commit: null, error: null });

function reducer(state: FlowModel, action: FlowAction): FlowModel {
  switch (action.type) {
    case "reset": return INITIAL_FLOW;
    case "selected": return Object.freeze({ ...INITIAL_FLOW, status: "file-selected", input: action.input });
    case "parsing": return Object.freeze({ ...state, status: "parsing", error: null });
    case "parsed": return Object.freeze({ ...state, status: action.parse.valid ? "preview" : "error", parse: action.parse, mapping: action.mapping, error: action.parse.valid ? null : action.parse.issues[0]?.message ?? "CSV parsing failed." });
    case "mapping": return Object.freeze({ ...state, status: "mapping", mapping: action.mapping, prepared: null, error: null });
    case "validating": return Object.freeze({ ...state, status: "validating", error: null });
    case "prepared": return Object.freeze({ ...state, status: action.prepared.ready ? "ready" : "error", prepared: action.prepared, error: action.prepared.ready ? null : action.prepared.errors[0] ?? "Validation failed." });
    case "importing": return Object.freeze({ ...state, status: "importing", error: null });
    case "completed": return Object.freeze({ ...state, status: "completed", commit: action.commit });
    case "error": return Object.freeze({ ...state, status: "error", error: action.message });
    case "back-to-mapping": return Object.freeze({ ...state, status: "mapping", prepared: null, commit: null, error: null });
  }
}

function actionStyle(primary = false, disabled = false): React.CSSProperties {
  return {
    border: `1px solid ${primary ? operationalVisualColors.accent : operationalVisualColors.border}`,
    borderRadius: 4,
    background: disabled ? cockpit.charcoal : primary ? cockpit.accentSoft : cockpit.panelSoft,
    color: disabled ? operationalVisualColors.muted : primary ? operationalVisualColors.accent : operationalVisualColors.text,
    cursor: disabled ? "default" : "pointer",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.06em",
    padding: "8px 12px",
    textTransform: "uppercase",
  };
}

function formatSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function buildImportId(file: File, workspaceId: WorkspaceId, importedAt: string): string {
  const token = `${workspaceId}:${file.name}:${file.size}:${file.lastModified}:${importedAt}`;
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `RDI-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function statusTone(status: CsvColumnMapping["status"]): string {
  if (status === "recognized") return operationalVisualColors.success;
  if (status === "suggested") return operationalVisualColors.accent;
  return operationalVisualColors.warning;
}

export function CsvRealDataImportFlow(props: CsvRealDataImportFlowProps): React.ReactElement {
  const [flow, dispatch] = React.useReducer(reducer, INITIAL_FLOW);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const receiveFile = React.useCallback(async (file: File | null) => {
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      dispatch({ type: "error", message: "Choose a .csv file. RDI:2 does not accept spreadsheets or JSON." });
      return;
    }
    const importedAt = new Date().toISOString();
    const observedAt = new Date(file.lastModified || Date.now()).toISOString();
    const importId = buildImportId(file, props.workspaceId, importedAt);
    const csvText = await file.text();
    const input: CsvVerticalSliceInput = Object.freeze({ workspaceId: props.workspaceId, fileName: file.name, fileSize: file.size, csvText, importId, importedAt, observedAt });
    dispatch({ type: "selected", input });
    dispatch({ type: "parsing" });
    const parse = parseCsvDeterministically(csvText);
    const mapping = suggestCsvColumnMappings(parse.columns, importId);
    dispatch({ type: "parsed", parse, mapping });
  }, [props.workspaceId]);

  const handleFile = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    void receiveFile(file);
  }, [receiveFile]);

  const handleDrop = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    void receiveFile(event.dataTransfer.files?.[0] ?? null);
  }, [receiveFile]);

  const handleMapping = React.useCallback((columnIndex: number, targetId: string | null) => {
    if (!flow.mapping) return;
    dispatch({ type: "mapping", mapping: updateCsvColumnMapping(flow.mapping, columnIndex, targetId) });
  }, [flow.mapping]);

  const validate = React.useCallback(() => {
    if (!flow.input || !flow.mapping) return;
    dispatch({ type: "validating" });
    dispatch({ type: "prepared", prepared: prepareCsvRealDataImport(flow.input, flow.mapping) });
  }, [flow.input, flow.mapping]);

  const commit = React.useCallback((replace: boolean) => {
    if (!flow.prepared) return;
    dispatch({ type: "importing" });
    const result = commitPreparedCsvRealDataImport({
      prepared: flow.prepared,
      expectedWorkspaceId: props.workspaceId,
      mode: replace ? "replace" : "new",
      committedAt: new Date().toISOString(),
    });
    if (!result.committed) {
      dispatch({ type: "error", message: result.reason === "source_exists" ? "This source already exists. Choose Replace Existing Source Snapshot or cancel." : "Import was not committed; previous Runtime truth is unchanged." });
      return;
    }
    dispatch({ type: "completed", commit: result });
    if (result.current) props.onCompleted?.(result.current);
  }, [flow.prepared, props]);

  const existing = flow.prepared ? getCsvRealDataImport(props.workspaceId, flow.prepared.sourceContextId) : null;
  const showReview = Boolean(flow.parse && flow.mapping && flow.status !== "idle" && flow.status !== "file-selected");
  const previewRecords = flow.parse?.records.slice(0, 5) ?? [];

  return (
    <section data-nx="rdi2-csv-import-flow" data-rdi2-state={flow.status} aria-label="Upload CSV" style={{ ...operationalCardStyle(flow.status === "error" ? "warning" : "accent"), display: "grid", width: "100%", minWidth: 0, boxSizing: "border-box", overflow: "hidden", gap: operationalVisualSpacing.sectionGap }}>
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={operationalSectionLabelStyle()}>Add Data</div>
          <div style={operationalCardHeadlineStyle("accent")}>Upload CSV</div>
          <p style={{ ...operationalCardDetailStyle(), marginBottom: 0 }}>Give Nexora the file, confirm what it understood, then see what it means.</p>
        </div>
        <button type="button" style={actionStyle()} onClick={props.onClose}>Close</button>
      </header>

      {!flow.input ? (
        <div
          data-rdi2-evidence="upload"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          style={{ border: `1px dashed ${operationalVisualColors.accent}`, borderRadius: 4, padding: 22, textAlign: "center", background: "rgba(56, 189, 248, 0.04)" }}
        >
          <p style={{ ...operationalCardDetailStyle(), marginTop: 0 }}>Drop one CSV here or choose it from your device. The file stays local.</p>
          <button type="button" style={actionStyle(true)} onClick={() => inputRef.current?.click()}>Choose CSV</button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: 10, border: `1px solid ${operationalVisualColors.border}`, borderRadius: 4 }}>
          <div style={{ minWidth: 0 }}>
            <strong style={{ color: operationalVisualColors.text, fontSize: 13 }}>{flow.input.fileName}</strong>
            <div style={{ color: operationalVisualColors.muted, fontSize: 11 }}>{formatSize(flow.input.fileSize)} · {flow.parse?.records.length ?? 0} rows · {flow.parse?.columns.length ?? 0} columns</div>
          </div>
          <div style={{ display: "flex", width: "100%", gap: 6, flexWrap: "wrap" }}>
            <button type="button" style={actionStyle()} onClick={() => inputRef.current?.click()}>Replace File</button>
            <button type="button" style={actionStyle()} onClick={() => dispatch({ type: "reset" })}>Remove</button>
          </div>
        </div>
      )}

      {flow.error ? <div role="alert" style={{ color: operationalVisualColors.warning, fontSize: 12 }}>{flow.error}</div> : null}

      {showReview && flow.parse && flow.mapping ? (
        <div data-rdi2-evidence="preview-mapping" style={{ display: "grid", minWidth: 0, gap: operationalVisualSpacing.sectionGap }}>
          <div style={{ minWidth: 0 }}>
            <div style={operationalSectionLabelStyle()}>Preview</div>
            <div style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflowX: "auto", border: `1px solid ${operationalVisualColors.border}`, borderRadius: 4 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr>{flow.parse.columns.map((column) => <th key={column.index} style={{ color: operationalVisualColors.muted, textAlign: "left", padding: 8, borderBottom: `1px solid ${operationalVisualColors.border}` }}>{column.name}</th>)}</tr></thead>
                <tbody>{previewRecords.map((record) => <tr key={record.recordId}>{record.values.map((value, index) => <td key={index} style={{ color: operationalVisualColors.text, padding: 8, borderTop: `1px solid ${operationalVisualColors.border}`, whiteSpace: "nowrap" }}>{value === null ? "—" : String(value)}</td>)}</tr>)}</tbody>
              </table>
            </div>
            {flow.parse.records.length > previewRecords.length ? <p style={operationalCardDetailStyle()}>Showing 5 of {flow.parse.records.length} rows.</p> : null}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={operationalSectionLabelStyle()}>Review what Nexora understood</div>
            <div style={{ display: "grid", gap: 7 }}>
              {flow.mapping.mappings.map((mapping) => (
                <label key={mapping.columnIndex} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 6, alignItems: "center", fontSize: 12 }}>
                  <span style={{ color: operationalVisualColors.text }}>{mapping.sourceColumn}<small style={{ color: statusTone(mapping.status), display: "block", textTransform: "uppercase" }}>{mapping.status}{mapping.status === "suggested" && !mapping.confirmed ? " · confirm" : ""}</small></span>
                  <select aria-label={`Map ${mapping.sourceColumn}`} value={mapping.ignored ? "" : mapping.targetId ?? "pending"} onChange={(event) => handleMapping(mapping.columnIndex, event.target.value === "" ? null : event.target.value)} style={{ width: "100%", minWidth: 0, border: `1px solid ${operationalVisualColors.border}`, borderRadius: 4, background: cockpit.charcoal, color: operationalVisualColors.text, padding: 7 }}>
                    <option value="pending" disabled>Choose meaning…</option>
                    <option value="">Ignore this column</option>
                    {CSV_MAPPING_TARGETS.map((target) => <option key={target.targetId} value={target.targetId}>{target.label}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </div>

          {flow.status !== "ready" && flow.status !== "completed" ? (
            <button type="button" style={actionStyle(true, !flow.mapping.readyForValidation)} disabled={!flow.mapping.readyForValidation} onClick={validate}>Validate Import</button>
          ) : null}
        </div>
      ) : null}

      {flow.prepared?.ready && flow.prepared.summary && flow.status !== "completed" ? (
        <div data-rdi2-evidence="validation" style={{ ...operationalCardStyle("neutral"), display: "grid", gap: 7 }}>
          <div style={operationalCardHeadlineStyle("accent")}>Ready to import</div>
          <div style={{ color: operationalVisualColors.success, fontSize: 12 }}>✓ {flow.prepared.summary.importedRecordCount} valid rows</div>
          <div style={{ color: operationalVisualColors.success, fontSize: 12 }}>✓ {flow.prepared.summary.recognizedMeanings.join(", ")} recognized</div>
          <div style={{ color: operationalVisualColors.text, fontSize: 12 }}>{flow.prepared.summary.updatedObjectCount} Executive Objects will update</div>
          {existing ? <div style={{ color: operationalVisualColors.warning, fontSize: 12 }}>An earlier snapshot exists for this source. Choose replacement or cancel.</div> : null}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <button type="button" style={actionStyle(true)} onClick={() => commit(Boolean(existing))}>{existing ? "Replace Existing Source Snapshot" : "Import"}</button>
            <button type="button" style={actionStyle()} onClick={() => dispatch({ type: "back-to-mapping" })}>Back</button>
            {existing ? <button type="button" style={actionStyle()} onClick={() => dispatch({ type: "reset" })}>Cancel</button> : null}
          </div>
        </div>
      ) : null}

      {flow.status === "completed" && flow.commit?.current?.prepared.summary ? (
        <div data-rdi2-evidence="completed" style={{ ...operationalCardStyle("accent"), display: "grid", gap: 8 }}>
          <div style={operationalCardHeadlineStyle("accent")}>Data connected</div>
          <div style={{ color: operationalVisualColors.text, fontSize: 13 }}>{flow.commit.current.prepared.summary.importedRecordCount} records imported</div>
          <div style={{ color: operationalVisualColors.text, fontSize: 12 }}>{flow.commit.current.prepared.summary.recognizedMeanings.join(", ")} recognized</div>
          <div style={{ color: operationalVisualColors.text, fontSize: 12 }}>{flow.commit.current.prepared.summary.updatedObjectCount} Executive Objects updated · {flow.commit.current.prepared.summary.attentionObjectCount + flow.commit.current.prepared.summary.criticalObjectCount} require attention</div>
          <div data-rdi2-evidence="stage-advisor" style={{ display: "grid", gap: 6, marginTop: 4 }}>
            <div style={operationalSectionLabelStyle()}>Executive result</div>
            {flow.commit.current.prepared.runtime?.projections.map((projection) => <div key={projection.stageObjectId} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderTop: `1px solid ${operationalVisualColors.border}`, paddingTop: 6, fontSize: 12 }}><span style={{ color: operationalVisualColors.text }}>{projection.objectKey}</span><span style={{ color: projection.mvpStatus === "stable" ? operationalVisualColors.success : operationalVisualColors.warning, textTransform: "uppercase" }}>{projection.mvpStatus}</span></div>)}
            <p style={{ ...operationalCardDetailStyle(), marginBottom: 0 }}>{flow.commit.current.prepared.advisor?.observationResolution.observations[0]?.executiveMeaning ?? "Advisor consumed the updated certified executive reality."}</p>
          </div>
          <button type="button" style={actionStyle(true)} onClick={props.onClose}>View Changes</button>
        </div>
      ) : null}

      <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: "none" }} aria-hidden />
    </section>
  );
}

export default CsvRealDataImportFlow;
