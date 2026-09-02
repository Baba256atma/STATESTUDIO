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
  csvImportCandidateId,
  discardCsvImportCandidate,
  getCsvImportCandidate,
  getCsvRealDataImport,
  saveCsvImportCandidate,
  type CsvCommittedImport,
  type CsvImportCandidate,
  type CsvImportCommitResult,
} from "../../../lib/data-reality/csvRealDataImportStore.ts";
import {
  applyCsvSemanticClarification,
  interpretCsvSemantics,
  nextCsvSemanticClarification,
  type CsvSemanticClarification,
  type CsvSemanticClarificationResult,
} from "../../../lib/data-reality/csvSemanticUnderstanding.ts";
import {
  describeCsvNeedsAttentionForManager,
  describeCsvSourceForManager,
  csvConfirmedMappings,
  csvPotentialRelatedLabels,
  csvUncertainMeaningCopy,
  csvUnconfirmedMappings,
} from "./nexoraDataRailPresentation.ts";
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
  replacementSource?: CsvCommittedImport | null;
  initialCandidate?: CsvImportCandidate | null;
  intakeMode?: "new" | "resume" | "update";
  onClose: () => void;
  onCancelled?: () => void;
  onCompleted?: (committed: CsvCommittedImport) => void;
  onAdoptExistingSource?: (source: CsvCommittedImport) => void;
  onSemanticClarificationRequest?: (
    need: CsvSemanticClarification,
    resolve: (utterance: string) => CsvSemanticClarificationResult,
  ) => void;
  onSemanticClarificationCancel?: (sourceContextId: string) => void;
  awaitingClarificationFieldId?: string | null;
}>;

export function matchesCsvReplacementIdentity(source: CsvCommittedImport, fileName: string): boolean {
  void source;
  return /\.csv$/i.test(fileName);
}

export function describeCsvImportValidationError(error: string): string {
  return describeCsvNeedsAttentionForManager(error);
}

type FlowModel = Readonly<{
  status: CsvImportFlowState;
  input: CsvVerticalSliceInput | null;
  parse: CsvParseResult | null;
  mapping: CsvMappingReview | null;
  prepared: CsvPreparedImport | null;
  commit: CsvImportCommitResult | null;
  error: string | null;
  existingCommitted: CsvCommittedImport | null;
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
  | Readonly<{ type: "committed-exists"; source: CsvCommittedImport }>
  | Readonly<{ type: "back-to-mapping" }>;

const INITIAL_FLOW: FlowModel = Object.freeze({ status: "idle", input: null, parse: null, mapping: null, prepared: null, commit: null, error: null, existingCommitted: null });

function flowFromCandidate(candidate: CsvImportCandidate | null | undefined): FlowModel {
  if (!candidate) return INITIAL_FLOW;
  const status = candidate.status === "completed" || candidate.status === "importing" ? "mapping" : candidate.status;
  return Object.freeze({
    status,
    input: candidate.input,
    parse: candidate.parse,
    mapping: candidate.mapping,
    prepared: candidate.prepared,
    commit: null,
    error: candidate.error,
    existingCommitted: null,
  });
}

function reducer(state: FlowModel, action: FlowAction): FlowModel {
  switch (action.type) {
    case "reset": return INITIAL_FLOW;
    case "selected": return Object.freeze({ ...INITIAL_FLOW, status: "file-selected", input: action.input });
    case "parsing": return Object.freeze({ ...state, status: "parsing", error: null, existingCommitted: null });
    case "parsed": return Object.freeze({ ...state, status: action.parse.valid ? "preview" : "error", parse: action.parse, mapping: action.mapping, error: action.parse.valid ? null : action.parse.issues[0]?.message ?? "CSV parsing failed.", existingCommitted: null });
    case "mapping": return Object.freeze({ ...state, status: "mapping", mapping: action.mapping, prepared: null, error: null });
    case "validating": return Object.freeze({ ...state, status: "validating", error: null });
    case "prepared": return Object.freeze({ ...state, status: action.prepared.ready ? "ready" : "error", prepared: action.prepared, error: action.prepared.ready ? null : describeCsvImportValidationError(action.prepared.errors[0] ?? "Validation failed.") });
    case "importing": return Object.freeze({ ...state, status: "importing", error: null });
    case "completed": return Object.freeze({ ...state, status: "completed", commit: action.commit });
    case "error": return Object.freeze({ ...state, status: "error", error: action.message, existingCommitted: null });
    case "committed-exists": return Object.freeze({ ...INITIAL_FLOW, status: "idle", error: `${action.source.prepared.fileName} already exists. Update existing source?`, existingCommitted: action.source });
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
  const [flow, dispatch] = React.useReducer(reducer, props.initialCandidate ?? null, flowFromCandidate);
  const flowRef = React.useRef(flow);
  React.useEffect(() => { flowRef.current = flow; }, [flow]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const pendingFileRef = React.useRef<File | null>(null);
  const persistedIdRef = React.useRef<string | null>(props.initialCandidate?.candidateId ?? null);
  const [cancelArmed, setCancelArmed] = React.useState(false);
  const [editingColumn, setEditingColumn] = React.useState<number | null>(null);
  const [localReplacement, setLocalReplacement] = React.useState<CsvCommittedImport | null>(props.replacementSource ?? null);
  const replacement = props.replacementSource ?? localReplacement;

  const persist = React.useCallback((next: FlowModel) => {
    if (!next.input || next.status === "idle" || next.status === "completed") return;
    const candidateId = replacement?.sourceContextId ?? csvImportCandidateId(props.workspaceId, next.input.fileName);
    const result = saveCsvImportCandidate(Object.freeze({
      workspaceId: props.workspaceId,
      candidateId,
      fileName: next.input.fileName,
      status: next.status,
      input: next.input,
      parse: next.parse,
      mapping: next.mapping,
      prepared: next.prepared,
      error: next.error,
      replacementSourceContextId: replacement?.sourceContextId ?? null,
    }), { replaceCandidateId: persistedIdRef.current ?? candidateId });
    if (!result.saved) {
      dispatch({ type: "error", message: "A pending source with this filename already exists." });
      return;
    }
    persistedIdRef.current = candidateId;
  }, [props.workspaceId, replacement?.sourceContextId]);

  React.useEffect(() => {
    persist(flow);
  }, [flow, persist]);

  const receiveFile = React.useCallback(async (file: File | null, adopted?: CsvCommittedImport | null) => {
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      dispatch({ type: "error", message: "Choose a .csv file. RDI:2 does not accept spreadsheets or JSON." });
      return;
    }
    const activeReplacement = adopted ?? replacement;
    const candidateId = activeReplacement?.sourceContextId ?? csvImportCandidateId(props.workspaceId, file.name);
    const occupant = getCsvImportCandidate(props.workspaceId, candidateId);
    const currentId = flowRef.current.input ? (replacement?.sourceContextId ?? csvImportCandidateId(props.workspaceId, flowRef.current.input.fileName)) : null;
    if (occupant && currentId !== candidateId) {
      dispatch({ type: "error", message: "A pending source with this filename already exists." });
      return;
    }
    const committed = getCsvRealDataImport(props.workspaceId, candidateId);
    if (committed && !activeReplacement) {
      pendingFileRef.current = file;
      dispatch({ type: "committed-exists", source: committed });
      return;
    }
    const importedAt = new Date().toISOString();
    const observedAt = new Date(file.lastModified || Date.now()).toISOString();
    const importId = buildImportId(file, props.workspaceId, importedAt);
    const csvText = await file.text();
    const input: CsvVerticalSliceInput = Object.freeze({
      workspaceId: props.workspaceId,
      fileName: file.name,
      fileSize: file.size,
      csvText,
      importId,
      importedAt,
      observedAt,
      ...(props.replacementSource ? { sourceContextId: props.replacementSource.sourceContextId } : activeReplacement ? { sourceContextId: activeReplacement.sourceContextId } : {}),
    });
    dispatch({ type: "selected", input });
    dispatch({ type: "parsing" });
    const parse = parseCsvDeterministically(csvText);
    const structural = suggestCsvColumnMappings(parse.columns, importId);
    const mapping = interpretCsvSemantics({
      input,
      parse,
      structural,
      previousMapping: props.replacementSource?.prepared.mapping ?? activeReplacement?.prepared.mapping ?? (currentId === candidateId ? flowRef.current.mapping : null),
    });
    dispatch({ type: "parsed", parse, mapping });
  }, [props.workspaceId, replacement]);

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

  const askNexora = React.useCallback((need: CsvSemanticClarification) => {
    const mappingAtAsk = flowRef.current.mapping;
    const mappingId = mappingAtAsk?.mappingId ?? null;
    props.onSemanticClarificationRequest?.(need, (utterance) => {
      const current = flowRef.current.mapping;
      if (!current || (mappingId && current.mappingId !== mappingId)) {
        return Object.freeze({
          review: current ?? mappingAtAsk ?? { mappingId: "", mappings: [], readyForValidation: false, recognizedCount: 0, suggestedCount: 0, ignoredCount: 0, unresolvedCount: 0 },
          resolved: false,
          deferred: false,
          acknowledgement: "That clarification is no longer open.",
        });
      }
      const result = applyCsvSemanticClarification(current, need.fieldId, utterance);
      dispatch({ type: "mapping", mapping: result.review });
      persist({ ...flowRef.current, mapping: result.review, status: "mapping" });
      return result;
    });
  }, [persist, props]);

  const cancelOpenClarification = React.useCallback(() => {
    const sourceId = flowRef.current.mapping?.mappings.find((entry) => entry.semantic)?.semantic?.sourceContextId;
    if (sourceId) props.onSemanticClarificationCancel?.(sourceId);
  }, [props]);

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
  const understoodMappings = flow.mapping ? csvConfirmedMappings(flow.mapping) : [];
  const unresolvedMappings = flow.mapping ? csvUnconfirmedMappings(flow.mapping) : [];
  const potentialRelated = flow.mapping ? csvPotentialRelatedLabels(flow.mapping) : [];
  const nextClarification = flow.mapping ? nextCsvSemanticClarification(flow.mapping) : null;
  const managerWork = Boolean(flow.mapping?.mappings.some((entry) => entry.semantic?.confirmationSource === "manager"));
  const attentionCopy = flow.error && !flow.existingCommitted ? flow.error : flow.prepared && !flow.prepared.ready ? describeCsvNeedsAttentionForManager(flow.prepared.errors[0] ?? "Validation failed.") : null;

  const closeDetails = React.useCallback(() => {
    props.onClose();
  }, [props]);

  const cancelImport = React.useCallback(() => {
    if (managerWork && !cancelArmed) {
      setCancelArmed(true);
      return;
    }
    const candidateId = replacement?.sourceContextId
      ?? (flowRef.current.input ? csvImportCandidateId(props.workspaceId, flowRef.current.input.fileName) : null);
    cancelOpenClarification();
    if (candidateId) discardCsvImportCandidate(props.workspaceId, candidateId);
    persistedIdRef.current = null;
    dispatch({ type: "reset" });
    setCancelArmed(false);
    props.onCancelled?.();
    props.onClose();
  }, [cancelArmed, cancelOpenClarification, managerWork, props, replacement?.sourceContextId]);

  return (
    <section data-nx="rdi2-csv-import-flow" data-rdi2-state={flow.status} data-rdi2-action={replacement ? "replace" : "new"} data-csv-intake={props.intakeMode ?? (replacement ? "update" : flow.input ? "resume" : "new")} aria-label="Upload CSV" style={{ ...operationalCardStyle(flow.status === "error" ? "warning" : "accent"), display: "grid", width: "100%", minWidth: 0, boxSizing: "border-box", overflow: "hidden", gap: operationalVisualSpacing.sectionGap }}>
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={operationalSectionLabelStyle()}>{replacement ? "Update source" : flow.input ? "Pending review" : "New source"}</div>
          <div style={operationalCardHeadlineStyle("accent")}>{flow.input?.fileName ?? replacement?.prepared.fileName ?? "CSV"}</div>
          <p style={{ ...operationalCardDetailStyle(), marginBottom: 0 }}>Nexora reviews the source locally. You confirm anything uncertain before it can affect business reality.</p>
        </div>
        <button type="button" data-testid="nexora-csv-review-close" style={actionStyle()} onClick={closeDetails}>Close</button>
      </header>

      {!flow.input ? (
        <div
          data-rdi2-evidence="upload"
          data-testid="nexora-csv-new-intake"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          style={{ border: `1px dashed ${operationalVisualColors.accent}`, borderRadius: 4, padding: 22, textAlign: "center", background: "rgba(56, 189, 248, 0.04)" }}
        >
          <p style={{ ...operationalCardDetailStyle(), marginTop: 0 }}>Choose or drop a CSV. The file stays local.</p>
          <button type="button" data-testid="nexora-csv-choose-file" style={actionStyle(true)} onClick={() => inputRef.current?.click()}>Choose CSV</button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: 10, border: `1px solid ${operationalVisualColors.border}`, borderRadius: 4 }}>
          <div style={{ minWidth: 0 }}>
            <strong style={{ color: operationalVisualColors.text, fontSize: 13 }}>{flow.input.fileName}</strong>
            <div style={{ color: operationalVisualColors.muted, fontSize: 11 }}>{formatSize(flow.input.fileSize)} · {flow.parse?.records.length ?? 0} rows · {flow.parse?.columns.length ?? 0} columns</div>
          </div>
          <div style={{ display: "flex", width: "100%", gap: 6, flexWrap: "wrap" }}>
            <button type="button" style={actionStyle()} onClick={() => inputRef.current?.click()}>Replace File</button>
            <button type="button" data-testid="nexora-csv-cancel-import" style={actionStyle()} onClick={cancelImport}>{cancelArmed ? "Confirm cancel" : replacement ? "Cancel update" : "Cancel import"}</button>
          </div>
        </div>
      )}

      {flow.error && (!showReview || flow.existingCommitted) ? <div role="alert" style={{ color: operationalVisualColors.warning, fontSize: 12 }}>{flow.error}</div> : null}
      {flow.existingCommitted ? <div data-testid="nexora-csv-existing-source" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" data-testid="nexora-csv-update-existing" style={actionStyle(true)} onClick={() => {
          const source = flow.existingCommitted;
          const file = pendingFileRef.current;
          if (!source || !file) return;
          setLocalReplacement(source);
          props.onAdoptExistingSource?.(source);
          void receiveFile(file, source);
        }}>Update existing source</button>
        <button type="button" style={actionStyle()} onClick={() => { pendingFileRef.current = null; dispatch({ type: "reset" }); }}>Choose a different file</button>
      </div> : null}

      {showReview && flow.parse && flow.mapping ? (
        <div data-rdi2-evidence="preview-mapping" style={{ display: "grid", minWidth: 0, gap: operationalVisualSpacing.sectionGap }}>
          <section data-testid="nexora-csv-understanding-summary" data-clarification-required={unresolvedMappings.length > 0 ? "true" : "false"} style={{ display: "grid", gap: "0.55rem", padding: "0.65rem 0", borderTop: `1px solid ${cockpit.border}`, borderBottom: `1px solid ${cockpit.border}` }}>
            <div data-testid="nexora-csv-about">
              <div style={operationalSectionLabelStyle()}>About this data</div>
              <p style={{ ...operationalCardDetailStyle(), margin: "0.35rem 0 0" }}>{describeCsvSourceForManager({ fileName: flow.input?.fileName ?? "", mapping: flow.mapping })}</p>
            </div>
            {attentionCopy ? <div data-testid="nexora-csv-needs-attention" role="alert"><div style={{ ...operationalSectionLabelStyle(), color: cockpit.warning }}>Needs attention</div><p style={{ ...operationalCardDetailStyle(), margin: "0.35rem 0 0" }}>{attentionCopy}</p><p style={{ ...operationalCardDetailStyle(), margin: "0.28rem 0 0" }}>This does not mean the file is broken. A required business field is not in this source.</p></div> : null}
            <div>
              <div style={operationalSectionLabelStyle()}>Nexora understands</div>
              {understoodMappings.length === 0 ? <p style={{ ...operationalCardDetailStyle(), margin: "0.35rem 0 0" }}>No business meanings are confirmed yet.</p> : understoodMappings.map((mapping) => (
                <div key={mapping.columnIndex} data-confirmation-source={mapping.semantic?.confirmationSource ?? "none"} style={{ color: cockpit.textSoft, fontSize: "0.68rem", marginTop: "0.32rem" }}>
                  <span aria-hidden style={{ color: cockpit.success }}>✓</span> {mapping.sourceColumn}<div style={{ color: cockpit.muted, fontSize: "0.62rem" }}>{mapping.semantic?.confirmedMeaning ?? mapping.targetLabel}{mapping.semantic?.confirmationSource === "manager" ? " · Confirmed by manager" : mapping.semantic?.confirmationSource === "authoritative-mapping" ? " · Authoritative mapping" : ""}</div>
                </div>
              ))}
            </div>
            {unresolvedMappings.length > 0 ? <details data-testid="nexora-csv-needs-clarification" open>
              <summary style={{ ...operationalSectionLabelStyle(), color: cockpit.warning, cursor: "pointer" }}>Needs clarification · {unresolvedMappings.length}</summary>
              {unresolvedMappings.map((mapping) => {
                const awaitingThis = props.awaitingClarificationFieldId != null && props.awaitingClarificationFieldId === mapping.semantic?.fieldId;
                return <div key={mapping.columnIndex} data-semantic-state={mapping.semantic?.state} data-awaiting-clarification={awaitingThis ? "true" : "false"} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.45rem", color: cockpit.textSoft, fontSize: "0.68rem", marginTop: "0.32rem" }}><span>{mapping.sourceColumn}<small style={{ display: "block", color: cockpit.muted }}>{csvUncertainMeaningCopy(mapping)}</small></span>{nextClarification?.fieldId === mapping.semantic?.fieldId ? <button type="button" data-testid={`nexora-csv-ask-${mapping.sourceColumn}`} data-ask-nexora-state={awaitingThis ? "awaiting-manager" : "open"} style={actionStyle(true)} onClick={() => askNexora(nextClarification!)}>{awaitingThis ? "Waiting for your answer" : "Ask Nexora"}</button> : null}</div>;
              })}
              <p style={{ ...operationalCardDetailStyle(), margin: "0.4rem 0 0" }}>The Advisor asks one useful question at a time. Answer in the conversation.</p>
            </details> : null}
          </section>

          <div data-testid="nexora-csv-pending-related-objects">
            <div style={operationalSectionLabelStyle()}>{potentialRelated.length > 0 ? "Potentially related" : "Related Objects"}</div>
            {potentialRelated.length > 0 ? <p data-testid="nexora-csv-potentially-related" style={{ ...operationalCardDetailStyle(), margin: "0.32rem 0 0" }}>{potentialRelated.map((label) => `${label} ?`).join(" · ")}<span style={{ display: "block", marginTop: "0.2rem" }}>Nexora has not connected these objects yet.</span></p> : <p style={{ ...operationalCardDetailStyle(), margin: "0.32rem 0 0" }}>Available after validation</p>}
          </div>

          <details data-testid="nexora-csv-columns" style={{ minWidth: 0 }}>
            <summary style={{ ...operationalSectionLabelStyle(), cursor: "pointer" }}>Columns · {flow.mapping.mappings.length}</summary>
            <div style={{ display: "grid", gap: 7, marginTop: 8 }}>
              {flow.mapping.mappings.map((mapping) => {
                const locked = mapping.confirmed && editingColumn !== mapping.columnIndex;
                const authoritative = mapping.semantic?.confirmationSource === "authoritative-mapping";
                return <div key={mapping.columnIndex} style={{ display: "grid", gap: 6, fontSize: 12 }}>
                  <span style={{ color: operationalVisualColors.text }}>{mapping.sourceColumn}<small style={{ color: statusTone(mapping.status), display: "block" }}>{mapping.semantic?.confirmationSource === "manager" ? "Confirmed by manager" : authoritative ? "Understood from authoritative mapping" : csvUncertainMeaningCopy(mapping)}</small></span>
                  {locked ? <button type="button" data-testid={`nexora-csv-change-meaning-${mapping.sourceColumn}`} style={actionStyle()} onClick={() => setEditingColumn(mapping.columnIndex)}>Change meaning</button> : <select aria-label={`Map ${mapping.sourceColumn}`} value={mapping.ignored ? "" : mapping.targetId ?? "pending"} onChange={(event) => { handleMapping(mapping.columnIndex, event.target.value === "" ? null : event.target.value); setEditingColumn(null); }} style={{ width: "100%", minWidth: 0, border: `1px solid ${operationalVisualColors.border}`, borderRadius: 4, background: cockpit.charcoal, color: operationalVisualColors.text, padding: 7 }}>
                    <option value="pending" disabled>Choose meaning…</option>
                    <option value="">Ignore this column</option>
                    {CSV_MAPPING_TARGETS.map((target) => <option key={target.targetId} value={target.targetId}>{target.label}</option>)}
                  </select>}
                  {editingColumn === mapping.columnIndex ? <button type="button" data-testid="nexora-csv-keep-current" style={actionStyle()} onClick={() => setEditingColumn(null)}>Keep current</button> : null}
                </div>;
              })}
            </div>
          </details>

          <details data-testid="nexora-csv-preview-disclosure" style={{ minWidth: 0 }}>
            <summary style={{ ...operationalSectionLabelStyle(), cursor: "pointer" }}>Data preview · {previewRecords.length} rows</summary>
            <div style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflowX: "auto", border: `1px solid ${operationalVisualColors.border}`, borderRadius: 4, marginTop: "0.35rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr>{flow.parse.columns.map((column) => <th key={column.index} style={{ color: operationalVisualColors.muted, textAlign: "left", padding: 8, borderBottom: `1px solid ${operationalVisualColors.border}` }}>{column.name}</th>)}</tr></thead>
                <tbody>{previewRecords.map((record) => <tr key={record.recordId}>{record.values.map((value, index) => <td key={index} style={{ color: operationalVisualColors.text, padding: 8, borderTop: `1px solid ${operationalVisualColors.border}`, whiteSpace: "nowrap" }}>{value === null ? "—" : String(value)}</td>)}</tr>)}</tbody>
              </table>
            </div>
            {flow.parse.records.length > previewRecords.length ? <p style={operationalCardDetailStyle()}>Showing {previewRecords.length} of {flow.parse.records.length} rows.</p> : <p style={operationalCardDetailStyle()}>Preview only. This does not change the file.</p>}
          </details>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {flow.status !== "ready" && flow.status !== "completed" ? (
              <button type="button" style={actionStyle(!nextClarification, !flow.mapping.readyForValidation)} disabled={!flow.mapping.readyForValidation} onClick={validate}>{unresolvedMappings.length > 0 ? `${unresolvedMappings.length} field${unresolvedMappings.length === 1 ? "" : "s"} need clarification` : "Validate Import"}</button>
            ) : null}
          </div>
        </div>
      ) : null}

      {flow.prepared?.ready && flow.prepared.summary && flow.status !== "completed" ? (
        <div data-rdi2-evidence="validation" style={{ ...operationalCardStyle("neutral"), display: "grid", gap: 7 }}>
          <div style={operationalCardHeadlineStyle("accent")}>Ready to use</div>
          <div style={{ color: operationalVisualColors.success, fontSize: 12 }}>✓ {flow.prepared.summary.importedRecordCount} valid rows</div>
          <div style={{ color: operationalVisualColors.success, fontSize: 12 }}>✓ {flow.prepared.summary.recognizedMeanings.join(", ")} recognized</div>
          <div style={{ color: operationalVisualColors.text, fontSize: 12 }}>{flow.prepared.summary.updatedObjectCount} Executive Objects will update</div>
          {existing ? <div style={{ color: operationalVisualColors.warning, fontSize: 12 }}>An earlier snapshot exists for this source. Choose replacement or cancel.</div> : null}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <button type="button" data-testid="nexora-csv-use-this-data" style={actionStyle(true)} onClick={() => commit(Boolean(replacement ?? existing))}>{replacement ? "Update source" : existing ? "Replace Existing Source Snapshot" : "Use this data"}</button>
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

      <input ref={inputRef} data-testid="nexora-csv-file-input" aria-label="Choose CSV file" type="file" accept=".csv,text/csv" onChange={handleFile} style={cockpit.visuallyHidden} />
    </section>
  );
}

export default CsvRealDataImportFlow;
