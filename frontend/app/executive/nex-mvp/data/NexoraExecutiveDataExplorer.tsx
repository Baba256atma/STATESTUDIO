"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { CsvRealDataImportFlow } from "./NexoraCsvRealDataImportFlow.tsx";
import type { CsvSemanticClarification, CsvSemanticClarificationResult } from "../../../lib/data-reality/csvSemanticUnderstanding.ts";
import { NexoraLiveDataConnectionFlow } from "./NexoraLiveDataConnectionFlow.tsx";
import {
  getCsvImportCandidate,
  getCsvRealDataImportVersion,
  listCsvImportCandidates,
  listCsvRealDataImports,
  removeCsvRealDataImport,
  subscribeCsvRealDataImports,
  type CsvCommittedImport,
} from "../../../lib/data-reality/csvRealDataImportStore.ts";
import { analyzeCsvSourceRemovalImpact } from "../../../lib/data-reality/csvSourceRemovalImpact.ts";
import {
  compareExecutiveSources,
  createExecutiveSourceAdvisorContext,
  projectExecutiveSourceIntelligence,
  type ExecutiveSourceAdvisorContext,
  type ExecutiveSourceIntelligence,
} from "../../../lib/data-reality/executiveSourceIntelligence.ts";
import type { ExecutiveSourceProjectionInput } from "../../../lib/data-reality/executiveSourceIntelligence.ts";
import {
  createMonitoringAdvisorContext,
  evaluateProactiveMonitoring,
} from "../../../lib/data-reality/proactiveMonitoringFoundation.ts";
import type { NexoraLiveCommittedObservation, NexoraLiveConnection } from "../../../lib/data-reality/liveDataConnectorFoundation.ts";
import { disconnectNexoraLiveConnection, getLiveDataConnectionVersion, listNexoraLiveConnections, listNexoraLiveObservations, subscribeLiveDataConnections } from "../../../lib/data-reality/liveDataConnectionStore.ts";
import {
  disableAutomaticMonitoring,
  enableAutomaticMonitoring,
  getAutomaticMonitoringPolicy,
  getAutomaticMonitoringRuntimeState,
  getAutomaticMonitoringRuntimeVersion,
  pauseAutomaticMonitoring,
  resumeAutomaticMonitoring,
  runNexoraMonitoringObservation,
  setAutomaticMonitoringExecutionOwner,
  subscribeAutomaticMonitoringRuntime,
  updateAutomaticMonitoringFrequency,
  type NexoraMonitoringFrequency,
} from "../../../lib/data-reality/automaticMonitoringRuntime.ts";
import { persistDurableMonitoringRuntimeBrowser } from "../../../lib/data-reality/durableMonitoringRuntime.ts";
import { getCsvDurabilityHealth, getCsvDurabilityHealthMessage, subscribeCsvDurabilityHealth } from "../../../lib/data-reality/csvRealDataImportDurability.ts";
import { requestBackgroundMonitoringRefresh, syncBackgroundMonitoringSnapshot } from "../../../lib/data-reality/backgroundMonitoringClient.ts";
import { requestNexoraLiveObservation } from "../../../lib/data-reality/liveDataObservationClient.ts";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme.ts";
import { describeCsvSourceForManager, csvConfirmedMappings, csvUncertainMeaningCopy, projectCsvDataRailSource, projectNexoraDataRailLibrary } from "./nexoraDataRailPresentation.ts";
import { projectCsvImportAsDecisionTheatreDataObject } from "../../../lib/decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";

export type NexoraExecutiveDataExplorerProps = Readonly<{
  workspaceId: string;
  activeImport: CsvCommittedImport | null;
  activeLiveObservation: NexoraLiveCommittedObservation | null;
  onImportCommitted: (committed: CsvCommittedImport) => void;
  onLiveObservationActivated: (observation: NexoraLiveCommittedObservation) => void;
  onViewOnStage: (stageObjectId: string) => void;
  onShowDataObjectOnStage: (dataObjectId: string) => void;
  onAdvisorContext: (context: ExecutiveSourceAdvisorContext) => void;
  onDataObjectSelection?: (dataObjectId: string | null) => void;
  selectedDataObjectId?: string | null;
  onSemanticClarificationRequest?: (need: CsvSemanticClarification, resolve: (utterance: string) => CsvSemanticClarificationResult) => void;
  onSemanticClarificationCancel?: (sourceContextId: string) => void;
  awaitingClarificationFieldId?: string | null;
  onSourceRemoved?: (sourceContextId: string) => void;
  onDismissRemovalReview?: () => void;
  removalReviewSourceId?: string | null;
  selectedSourceId?: string | null;
  onSelectSource?: (sourceId: string | null) => void;
}>;

function liveProjection(observation: NexoraLiveCommittedObservation): ExecutiveSourceProjectionInput {
  return Object.freeze({ workspaceId: observation.workspaceId, sourceContextId: observation.sourceContextId, sourceLabel: observation.sourceLabel, committedAt: observation.committedAt, recordCount: observation.recordCount, mappingId: observation.mappingId, snapshot: observation.snapshot, handoff: observation.handoff, dataReality: observation.dataReality });
}

function deepFreeze<T>(value: T): T { if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value as Record<string, unknown>).forEach(deepFreeze); Object.freeze(value); } return value; }

function actionStyle(primary = false, danger = false): React.CSSProperties {
  return {
    border: `1px solid ${danger ? "rgba(248,113,113,0.42)" : primary ? cockpit.borderStrong : cockpit.border}`,
    borderRadius: cockpit.radius.sm,
    background: danger ? "rgba(248,113,113,0.09)" : primary ? cockpit.accentSoft : "transparent",
    color: danger ? cockpit.risk : primary ? cockpit.accent : cockpit.textSoft,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.62rem",
    fontWeight: 700,
    padding: "0.4rem 0.5rem",
  };
}

function stateColor(state: ExecutiveSourceIntelligence["overallState"]): string {
  return state === "critical" ? cockpit.risk : state === "attention" ? cockpit.warning : cockpit.success;
}

function stateLabel(state: ExecutiveSourceIntelligence["overallState"]): string {
  return state === "critical" ? "CRITICAL" : state === "attention" ? "WATCH" : "STABLE";
}

function SourceIntelligenceView({
  source, intelligence, active, imports, onActivate, onShowDataObjectOnStage,
  activeSourceContextId, onAdvisorContext, onUpdate, onRemoved, onSourceRemoved, onDismissRemovalReview, onCloseDetails, requestedReview,
}: Readonly<{
  source: CsvCommittedImport;
  intelligence: ExecutiveSourceIntelligence;
  active: boolean;
  activeSourceContextId: string | null;
  imports: readonly CsvCommittedImport[];
  onActivate: () => void;
  onShowDataObjectOnStage: (dataObjectId: string) => void;
  onAdvisorContext: (context: ExecutiveSourceAdvisorContext) => void;
  onUpdate: () => void;
  onRemoved: () => void;
  onSourceRemoved: (sourceContextId: string) => void;
  onDismissRemovalReview: () => void;
  onCloseDetails: () => void;
  requestedReview: boolean;
}>): React.ReactElement {
  const [comparing, setComparing] = useState(false);
  const [comparisonSourceId, setComparisonSourceId] = useState<string | null>(null);
  const [managementOpen, setManagementOpen] = useState(false);
  const [managementMessage, setManagementMessage] = useState<string | null>(null);
  const [meaningChangeOpen, setMeaningChangeOpen] = useState(false);
  const [localRemovalReview, setLocalRemovalReview] = useState(false);
  const comparisonSource = imports.find((entry) => entry.sourceContextId === comparisonSourceId) ?? null;
  const comparison = comparisonSource ? compareExecutiveSources(source, comparisonSource) : null;
  const removalImpact = analyzeCsvSourceRemovalImpact({
    source,
    peers: imports,
    activeSourceContextId,
  });
  const removalReviewOpen = requestedReview || localRemovalReview;
  const managementShown = managementOpen || requestedReview || localRemovalReview;

  return (
    <section data-testid="nexora-rdi3-source-intelligence" data-rdi3-source={source.sourceContextId} style={{ display: "grid", gap: "0.62rem", padding: "0.62rem", border: `1px solid ${cockpit.borderStrong}`, borderRadius: cockpit.radius.md, background: cockpit.panelSoft }}>
      <header style={{ display: "grid", gap: "0.18rem" }}>
        <span style={{ color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>CSV file</span>
        <strong style={{ color: cockpit.text, fontSize: "0.78rem", overflowWrap: "anywhere" }}>{source.prepared.fileName}</strong>
        <span style={{ color: cockpit.muted, fontSize: "0.6rem" }}>{intelligence.recordCount} row · {active ? "Active" : "Available"}</span>
        <button type="button" data-testid="nexora-data-source-close-details" style={actionStyle()} onClick={onCloseDetails}>Close details</button>
      </header>

      <div>
        <span style={{ color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>About this data</span>
        <p data-testid="nexora-csv-about" style={{ margin: "0.28rem 0 0", color: cockpit.textSoft, fontSize: "0.68rem", lineHeight: 1.48 }}>{describeCsvSourceForManager({ fileName: source.prepared.fileName, mapping: source.prepared.mapping, relatedObjectLabels: intelligence.affectedObjects.map((entry) => entry.objectLabel) })}</p>
      </div>

      <div data-testid="nexora-csv-understanding">
        <span style={{ color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nexora understands</span>
        <div style={{ display: "grid", gap: "0.22rem", marginTop: "0.35rem" }}>
          {csvConfirmedMappings(source.prepared.mapping).map((mapping) => (
            <div key={mapping.columnIndex} style={{ color: cockpit.textSoft, fontSize: "0.62rem" }}><span aria-hidden style={{ color: cockpit.success }}>✓</span> {mapping.sourceColumn} · {mapping.semantic?.confirmedMeaning ?? mapping.targetLabel}{mapping.semantic?.confirmationSource === "manager" ? " · Confirmed by manager" : mapping.semantic?.confirmationSource === "authoritative-mapping" ? " · Authoritative mapping" : ""}</div>
          ))}
        </div>
      </div>

      <details data-testid="nexora-csv-columns">
        <summary style={{ color: cockpit.lowMuted, cursor: "pointer", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Columns · {source.prepared.mapping.mappings.length}</summary>
        <div style={{ display: "grid", gap: "0.28rem", marginTop: "0.35rem" }}>
          {source.prepared.mapping.mappings.map((mapping) => (
            <div key={mapping.columnIndex} style={{ display: "grid", gap: "0.08rem" }}>
              <span style={{ color: cockpit.text, fontSize: "0.62rem" }}>{mapping.sourceColumn}</span>
              <span style={{ color: mapping.semantic?.confirmedMeaning || mapping.targetLabel ? cockpit.success : cockpit.warning, fontSize: "0.56rem" }}>{mapping.semantic?.confirmedMeaning ?? mapping.targetLabel ?? csvUncertainMeaningCopy(mapping)}</span>
            </div>
          ))}
        </div>
      </details>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ color: cockpit.lowMuted, fontSize: "0.58rem", textTransform: "uppercase" }}>Executive State</span>
        <strong style={{ color: stateColor(intelligence.overallState), fontSize: "0.72rem", letterSpacing: "0.08em" }}>{stateLabel(intelligence.overallState)}</strong>
      </div>
      <p style={{ margin: 0, color: cockpit.textSoft, fontSize: "0.68rem", lineHeight: 1.48 }}>{intelligence.interpretation}</p>

      <details data-testid="nexora-csv-view-changes">
        <summary style={{ color: cockpit.accent, cursor: "pointer", fontSize: "0.61rem" }}>View Changes</summary>
        <div style={{ display: "grid", gap: "0.28rem", marginTop: "0.35rem" }}>
          <span style={{ color: cockpit.muted, fontSize: "0.56rem" }}>Source: {source.prepared.fileName}</span>
          {intelligence.affectedObjects.length === 0 ? <span style={{ color: cockpit.muted, fontSize: "0.58rem" }}>No canonical object observations for this source.</span> : intelligence.affectedObjects.map((entry) => (
            <div key={entry.objectKey} style={{ display: "grid", gap: "0.12rem" }}>
              <span style={{ color: cockpit.textSoft, fontSize: "0.59rem" }}>{entry.objectLabel}</span>
              {entry.signals.slice(0, 2).map((signal) => <span key={signal.kpiId} style={{ color: cockpit.muted, fontSize: "0.56rem" }}>{signal.label} · {signal.value.toFixed(1)}{signal.unit}</span>)}
            </div>
          ))}
        </div>
      </details>

      <div data-testid="nexora-csv-related-objects">
        <span style={{ color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Related Objects</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.35rem" }}>
          {intelligence.affectedObjects.length === 0 ? <span style={{ color: cockpit.muted, fontSize: "0.58rem" }}>No related objects from this source.</span> : intelligence.affectedObjects.map((entry) => <span key={entry.objectKey} style={{ border: `1px solid ${stateColor(entry.state)}`, borderRadius: cockpit.radius.pill, color: stateColor(entry.state), fontSize: "0.56rem", padding: "0.18rem 0.36rem" }}>{entry.objectLabel}</span>)}
        </div>
      </div>

      {meaningChangeOpen ? <div data-testid="nexora-csv-change-meaning-review" style={{ display: "grid", gap: "0.35rem", border: `1px solid ${cockpit.warning}`, borderRadius: cockpit.radius.sm, padding: "0.5rem" }}>
        <span style={{ color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Change meaning</span>
        <p style={{ margin: 0, color: cockpit.textSoft, fontSize: "0.62rem", lineHeight: 1.45 }}>{intelligence.affectedObjects.length > 0 ? `This meaning is currently used by ${intelligence.affectedObjects.map((entry) => entry.objectLabel).slice(0, 3).join(", ")}. Changing it may update how Nexora interprets this source.` : "Changing a confirmed meaning requires updating this source. Nexora will not silently rewrite business reality."}</p>
        <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.56rem" }}>{removalImpact.managerSummary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}><button type="button" data-testid="nexora-csv-change-meaning-confirm" style={actionStyle(true)} onClick={() => { setMeaningChangeOpen(false); onUpdate(); }}>Update source</button><button type="button" data-testid="nexora-csv-keep-current" style={actionStyle()} onClick={() => setMeaningChangeOpen(false)}>Keep current</button></div>
      </div> : <button type="button" data-testid="nexora-csv-change-meaning" style={actionStyle()} onClick={() => setMeaningChangeOpen(true)}>Change meaning</button>}

      <details data-testid="nexora-csv-committed-preview" style={{ minWidth: 0 }}>
        <summary style={{ color: cockpit.lowMuted, cursor: "pointer", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Data preview · {Math.min(5, source.prepared.parse.records.length)} rows</summary>
        <div style={{ width: "100%", overflowX: "auto", marginTop: "0.35rem", border: `1px solid ${cockpit.border}`, borderRadius: cockpit.radius.sm }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.55rem" }}>
            <thead><tr>{source.prepared.parse.columns.map((column) => <th key={column.index} style={{ color: cockpit.muted, textAlign: "left", padding: "0.32rem 0.4rem", borderBottom: `1px solid ${cockpit.border}` }}>{column.name}</th>)}</tr></thead>
            <tbody>{source.prepared.parse.records.slice(0, 5).map((record) => <tr key={record.recordId}>{record.values.map((value, index) => <td key={index} style={{ color: cockpit.textSoft, padding: "0.32rem 0.4rem", borderTop: `1px solid ${cockpit.border}`, whiteSpace: "nowrap" }}>{value === null ? "—" : String(value)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <span style={{ display: "block", marginTop: "0.28rem", color: cockpit.muted, fontSize: "0.52rem" }}>Preview only. This does not change the source.</span>
      </details>

      <details>
        <summary style={{ color: cockpit.muted, cursor: "pointer", fontSize: "0.58rem" }}>Signals and dates</summary>
        <div style={{ display: "grid", gap: "0.25rem", marginTop: "0.35rem" }}>
          <span style={{ color: cockpit.muted, fontSize: "0.58rem" }}>Imported {intelligence.importedAt.slice(0, 10)}</span>
          {intelligence.topSignals.slice(0, 3).map((signal) => <span key={signal} style={{ color: cockpit.muted, fontSize: "0.61rem", lineHeight: 1.35 }}>• {signal}</span>)}
        </div>
      </details>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        <button type="button" data-testid="nexora-data-object-show-on-stage" style={actionStyle(true)} onClick={() => {
          onShowDataObjectOnStage(projectCsvImportAsDecisionTheatreDataObject(source).id);
        }}>Show on Stage</button>
        <button type="button" style={actionStyle()} onClick={() => setComparing((value) => !value)}>Compare</button>
        <button type="button" data-testid="nexora-data-source-ask-nexora" style={actionStyle()} onClick={() => onAdvisorContext(createExecutiveSourceAdvisorContext(intelligence))}>Ask Nexora</button>
        {!active ? <button type="button" style={actionStyle()} onClick={onActivate}>Use as Active Source</button> : null}
        <button type="button" data-testid="nexora-data-source-more" style={actionStyle()} onClick={() => setManagementOpen((value) => !value)}>More</button>
      </div>

      {comparing ? <section data-testid="nexora-rdi3-compare-selection" style={{ display: "grid", gap: "0.35rem", borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.55rem" }}>
        <span style={{ color: cockpit.lowMuted, fontSize: "0.55rem", textTransform: "uppercase" }}>Compare with</span>
        {imports.filter((entry) => entry.sourceContextId !== source.sourceContextId).map((entry) => <button key={entry.sourceContextId} type="button" style={actionStyle(comparisonSourceId === entry.sourceContextId)} onClick={() => setComparisonSourceId(entry.sourceContextId)}>{entry.prepared.fileName}</button>)}
        {imports.length < 2 ? <span style={{ color: cockpit.muted, fontSize: "0.61rem" }}>Import another compatible source to compare.</span> : null}
      </section> : null}

      {comparison && comparisonSource ? <section data-testid="nexora-rdi3-comparison" data-comparison-readiness={comparison.readiness} style={{ display: "grid", gap: "0.48rem", borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.55rem" }}>
        <strong style={{ color: cockpit.text, fontSize: "0.69rem" }}>{source.prepared.fileName} → {comparisonSource.prepared.fileName}</strong>
        <span style={{ color: comparison.readiness === "incompatible" ? cockpit.risk : cockpit.textSoft, fontSize: "0.61rem", lineHeight: 1.4 }}>{comparison.summary}</span>
        {comparison.stateTransitions.map((entry) => <div key={entry.objectKey} style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem", fontSize: "0.6rem" }}><span style={{ color: cockpit.textSoft }}>{entry.objectLabel}</span><span style={{ color: entry.direction === "deteriorated" ? cockpit.risk : entry.direction === "improved" ? cockpit.success : cockpit.muted, textTransform: "uppercase" }}>{entry.from} → {entry.to}</span></div>)}
        {comparison.metricDeltas.slice(0, 3).map((entry) => <span key={entry.kpiId} style={{ color: cockpit.muted, fontSize: "0.58rem" }}>{entry.label}: {entry.baseValue.toFixed(1)} → {entry.comparisonValue.toFixed(1)}{entry.unit} ({entry.delta > 0 ? "+" : ""}{entry.delta.toFixed(1)})</span>)}
        {comparison.readiness !== "incompatible" ? <button type="button" style={actionStyle(true)} onClick={() => onAdvisorContext(createExecutiveSourceAdvisorContext(comparison))}>Explain Change</button> : null}
        <details><summary style={{ color: cockpit.muted, cursor: "pointer", fontSize: "0.58rem" }}>Evidence & provenance</summary><div style={{ display: "grid", gap: "0.2rem", marginTop: "0.3rem" }}>{comparison.metricDeltas.slice(0, 5).map((entry) => <span key={entry.kpiId} style={{ color: cockpit.lowMuted, fontSize: "0.54rem", overflowWrap: "anywhere" }}>{entry.objectLabel} · {entry.baseSourceField} → {entry.comparisonSourceField}</span>)}</div></details>
      </section> : null}

      {managementShown ? <section data-testid="nexora-rdi3-source-management" style={{ display: "grid", gap: "0.35rem", borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.55rem" }}>
        <button type="button" style={actionStyle()} onClick={onUpdate}>Update source</button>
        {!removalReviewOpen ? <button type="button" data-testid="nexora-data-source-remove-intent" style={actionStyle(false, true)} onClick={() => { setLocalRemovalReview(true); setManagementMessage(null); }}>Remove data source</button> : null}
        {removalReviewOpen ? <section data-testid="nexora-data-source-removal-review" data-removal-impact={removalImpact.impactClass} data-source-id={source.sourceContextId} style={{ display: "grid", gap: "0.4rem" }}>
          <strong style={{ color: cockpit.text, fontSize: "0.68rem" }}>Remove {source.prepared.fileName}?</strong>
          <span style={{ color: cockpit.textSoft, fontSize: "0.61rem", lineHeight: 1.45 }}>{removalImpact.managerSummary}</span>
          <span style={{ color: cockpit.muted, fontSize: "0.58rem", lineHeight: 1.4 }}>Historical records stay. This does not cancel a Decision or remove the source from history. Remove from Stage is a different action.</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            <button type="button" data-testid="nexora-data-source-remove-cancel" style={actionStyle()} onClick={() => { setLocalRemovalReview(false); onDismissRemovalReview(); }}>Cancel</button>
            <button type="button" data-testid="nexora-data-source-remove-confirm" style={actionStyle(false, true)} onClick={() => {
              const result = removeCsvRealDataImport({
                workspaceId: source.workspaceId,
                sourceContextId: source.sourceContextId,
                activeSourceContextId,
                confirmedActiveRemoval: active,
                removedAt: new Date().toISOString(),
              });
              setManagementMessage(result.removed ? "Data source removed." : result.reason === "active_source" ? "This source is still in use. Confirm removal again, or cancel." : "The source could not be removed.");
              if (result.removed) {
                onSourceRemoved(source.sourceContextId);
                onRemoved();
              }
            }}>Remove data source</button>
          </div>
        </section> : null}
        {managementMessage ? <span data-testid="nexora-data-source-removal-message" style={{ color: cockpit.muted, fontSize: "0.58rem" }}>{managementMessage}</span> : null}
      </section> : null}
    </section>
  );
}

function LiveSourceView({ connection, observations, activeSourceContextId, onActivate, onViewOnStage, onAdvisorContext, onCloseDetails }: Readonly<{
  connection: NexoraLiveConnection;
  observations: readonly NexoraLiveCommittedObservation[];
  activeSourceContextId: string | null;
  onActivate: (observation: NexoraLiveCommittedObservation) => void;
  onViewOnStage: (stageObjectId: string) => void;
  onAdvisorContext: (context: ExecutiveSourceAdvisorContext) => void;
  onCloseDetails: () => void;
}>): React.ReactElement {
  const latest = observations[observations.length - 1] ?? null;
  const previous = observations[observations.length - 2] ?? null;
  const intelligence = latest ? projectExecutiveSourceIntelligence(liveProjection(latest)) : null;
  const monitoring = latest && previous ? evaluateProactiveMonitoring(Object.freeze({ previous: liveProjection(previous), current: liveProjection(latest) })) : null;
  const active = activeSourceContextId === `live:${connection.connectionId}`;
  const monitoringVersion = useSyncExternalStore(subscribeAutomaticMonitoringRuntime, getAutomaticMonitoringRuntimeVersion, () => 0);
  void monitoringVersion;
  const monitoringPolicy = getAutomaticMonitoringPolicy(connection.workspaceId, connection.connectionId);
  const monitoringRuntime = getAutomaticMonitoringRuntimeState(connection.workspaceId, connection.connectionId);
  const [frequency, setFrequency] = useState<NexoraMonitoringFrequency>(monitoringPolicy?.frequency ?? "every-6-hours");
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState<string | null>(null); const [management, setManagement] = useState(false);
  const setExecutionOwner = async (owner: "foreground" | "background") => {
    const now = new Date().toISOString(); setBusy(true); setMessage(null);
    try {
      setAutomaticMonitoringExecutionOwner(connection.workspaceId, connection.connectionId, owner, now);
      const snapshot = await persistDurableMonitoringRuntimeBrowser(globalThis.localStorage, now);
      if (owner === "background") await syncBackgroundMonitoringSnapshot(snapshot, now);
      setMessage(owner === "background" ? "Background monitoring is active. Monitoring continues while the Executive UI is closed." : "Foreground monitoring is active for this Nexora session.");
    } catch (error) {
      setAutomaticMonitoringExecutionOwner(connection.workspaceId, connection.connectionId, "foreground", new Date().toISOString());
      setMessage(error instanceof Error ? error.message : "Monitoring ownership could not be changed.");
    } finally { setBusy(false); }
  };
  const refresh = async () => {
    const observedAt = new Date().toISOString(); setBusy(true); setMessage(null);
    try {
      if (monitoringPolicy?.executionOwner === "background") {
        const background = await requestBackgroundMonitoringRefresh(connection.workspaceId, connection.connectionId, observedAt);
        setMessage(background.completed ? "New background observation saved for review. Active truth was not changed." : background.reason === "already-observing" ? "A background observation is already running. No duplicate refresh was started." : "Background refresh failed. Previous active truth remains intact.");
        return;
      }
      const result = await runNexoraMonitoringObservation({
        trigger: "manual",
        connection,
        policy: monitoringPolicy,
        observedAt,
        observe: async ({ observationId, observedAt: requestedAt }) => {
          const response = await requestNexoraLiveObservation(connection, { observationId, observedAt: requestedAt });
          if (!response.prepared) throw new Error(response.message);
          return deepFreeze(response.prepared);
        },
      });
      if (result.reason === "already-observing") setMessage("An automatic observation is already running. No duplicate refresh was started.");
      else if (!result.completed) setMessage("Refresh failed. Previous active truth remains intact.");
      else setMessage("New observation saved for review. Active truth was not changed.");
    } finally { setBusy(false); }
  };
  return <section data-testid="nexora-rdi4-live-source" style={{ display: "grid", gap: "0.58rem", padding: "0.62rem", border: `1px solid ${cockpit.borderStrong}`, borderRadius: cockpit.radius.md, background: cockpit.panelSoft }}>
    <header><span style={{ color: cockpit.lowMuted, fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Connected source</span><strong style={{ display: "block", color: cockpit.text, fontSize: "0.76rem", marginTop: "0.18rem" }}>{connection.displayName}</strong><span style={{ color: connection.status === "degraded" ? cockpit.warning : connection.status === "connected" ? cockpit.success : cockpit.muted, fontSize: "0.59rem", textTransform: "uppercase" }}>{connection.status}{active ? " · Active" : ""}</span><button type="button" data-testid="nexora-data-source-close-details" style={{ ...actionStyle(), marginTop: "0.35rem" }} onClick={onCloseDetails}>Close details</button></header>
    {intelligence ? <div><span style={{ color: cockpit.lowMuted, fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Related Objects</span><div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.35rem" }}>{intelligence.affectedObjects.map((entry) => <span key={entry.objectKey} style={{ border: `1px solid ${stateColor(entry.state)}`, borderRadius: cockpit.radius.pill, color: stateColor(entry.state), fontSize: "0.56rem", padding: "0.18rem 0.36rem" }}>{entry.objectLabel}</span>)}</div></div> : <span style={{ color: cockpit.textSoft, fontSize: "0.64rem" }}>Connected is not Active. Refresh to create the first observation.</span>}
    {intelligence ? <strong style={{ color: stateColor(intelligence.overallState), fontSize: "0.68rem" }}>{stateLabel(intelligence.overallState)}</strong> : null}
    {monitoring ? <section data-testid="nexora-pm1-monitoring-summary" data-pm1-status={monitoring.status} style={{ display: "grid", gap: "0.38rem", borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.5rem" }}>
      <span style={{ color: cockpit.lowMuted, fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Since previous observation</span>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        <strong style={{ color: monitoring.meaningfulChangeCount > 0 ? cockpit.warning : cockpit.success, fontSize: "0.61rem" }}>{monitoring.meaningfulChangeCount} meaningful</strong>
        <span style={{ color: cockpit.muted, fontSize: "0.61rem" }}>·</span>
        <strong style={{ color: monitoring.attentionCandidateCount > 0 ? cockpit.risk : cockpit.muted, fontSize: "0.61rem" }}>{monitoring.attentionCandidateCount} may require attention</strong>
      </div>
      <span style={{ color: cockpit.textSoft, fontSize: "0.6rem", lineHeight: 1.4 }}>{monitoring.summary}</span>
      <details data-testid="nexora-pm1-view-changes"><summary style={{ color: cockpit.accent, cursor: "pointer", fontSize: "0.61rem" }}>View Changes</summary><div style={{ display: "grid", gap: "0.32rem", marginTop: "0.4rem" }}>
        <span style={{ color: cockpit.muted, fontSize: "0.56rem" }}>Source: {connection.displayName}</span>
        {monitoring.events.length === 0 ? <span style={{ color: cockpit.muted, fontSize: "0.58rem" }}>No canonical KPI or state movement.</span> : monitoring.events.map((event) => <div key={event.changeId} style={{ display: "grid", gap: "0.16rem", borderLeft: `2px solid ${event.significance === "critical" ? cockpit.risk : event.significance === "meaningful" ? cockpit.warning : cockpit.border}`, paddingLeft: "0.38rem" }}>
          <span style={{ color: cockpit.textSoft, fontSize: "0.59rem" }}><strong>{event.subjectLabel}</strong> · {event.significance} · {event.lifecycle}</span>
          {event.metricChanges.filter((delta) => delta.delta !== 0).map((delta) => <span key={delta.kpiId} style={{ color: cockpit.muted, fontSize: "0.56rem" }}>{delta.label}: {delta.baseValue.toFixed(1)} → {delta.comparisonValue.toFixed(1)}{delta.unit}</span>)}
          {event.stateTransition && event.stateTransition.from !== event.stateTransition.to ? <span style={{ color: event.direction === "deteriorated" ? cockpit.risk : cockpit.success, fontSize: "0.56rem", textTransform: "uppercase" }}>{event.stateTransition.from} → {event.stateTransition.to}</span> : null}
          {event.subjectId.startsWith("obj-") ? <button type="button" style={actionStyle()} onClick={() => onViewOnStage(event.subjectId)}>View on Stage</button> : null}
        </div>)}
        {monitoring.meaningfulChangeCount > 0 ? <button type="button" style={actionStyle(true)} onClick={() => onAdvisorContext(createMonitoringAdvisorContext(monitoring))}>Ask Nexora</button> : null}
      </div></details>
    </section> : null}
    <details data-testid="nexora-pm2-automatic-monitoring" data-monitoring-enabled={monitoringPolicy?.enabled === true} data-monitoring-status={monitoringRuntime?.status ?? "idle"} style={{ display: "grid", gap: "0.38rem", borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.5rem" }}>
      <summary style={{ color: cockpit.muted, cursor: "pointer", fontSize: "0.58rem" }}>Monitoring</summary>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem", alignItems: "baseline" }}><span style={{ color: cockpit.lowMuted, fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Automatic Monitoring</span><strong style={{ color: monitoringPolicy?.enabled && !monitoringPolicy.paused ? cockpit.success : cockpit.muted, fontSize: "0.58rem", textTransform: "uppercase" }}>{monitoringPolicy?.enabled ? monitoringPolicy.paused ? "Paused" : "On" : "Off"}</strong></div>
      {!monitoringPolicy?.enabled ? <><label style={{ color: cockpit.textSoft, fontSize: "0.58rem" }}>Frequency<select aria-label="Monitoring frequency" value={frequency} onChange={(event) => setFrequency(event.target.value as NexoraMonitoringFrequency)} style={{ display: "block", width: "100%", marginTop: "0.25rem", background: cockpit.panel, border: `1px solid ${cockpit.border}`, borderRadius: cockpit.radius.sm, color: cockpit.textSoft, fontFamily: "inherit", fontSize: "0.6rem", padding: "0.35rem" }}><option value="hourly">Hourly</option><option value="every-6-hours">Every 6 hours</option><option value="daily">Daily</option></select></label><button type="button" style={actionStyle(true)} onClick={() => enableAutomaticMonitoring({ workspaceId: connection.workspaceId, connectionId: connection.connectionId, targetId: `pm1:target:${connection.workspaceId}:live:${connection.connectionId}`, frequency, enabledAt: new Date().toISOString() })}>Enable Monitoring</button></> : <>
        <span style={{ color: cockpit.textSoft, fontSize: "0.59rem" }}>{monitoringPolicy.frequency === "hourly" ? "Every hour" : monitoringPolicy.frequency === "every-6-hours" ? "Every 6 hours" : "Daily"} · Durable policy · {monitoringPolicy.executionOwner === "background" ? "Persistent server runner" : "Foreground/session runner"}</span>
        <span style={{ color: cockpit.muted, fontSize: "0.57rem" }}>{monitoringPolicy.executionOwner === "background" ? "Monitoring continues while the Executive UI is closed" : "Monitoring resumes when Nexora is open"}</span>
        <strong style={{ color: monitoringPolicy.executionOwner === "background" ? cockpit.accent : cockpit.muted, fontSize: "0.58rem" }}>{monitoringPolicy.executionOwner === "background" ? "Background Monitoring" : "Foreground Monitoring"}</strong>
        <span style={{ color: cockpit.muted, fontSize: "0.57rem" }}>Status: {monitoringRuntime?.status ?? "scheduled"}</span>
        <span style={{ color: cockpit.muted, fontSize: "0.57rem" }}>Last checked: {monitoringRuntime?.lastSuccessAt ? new Date(monitoringRuntime.lastSuccessAt).toLocaleString() : "Waiting for first automatic check"}</span>
        <span style={{ color: cockpit.muted, fontSize: "0.57rem" }}>Next eligible: {monitoringRuntime?.nextEligibleAt ? new Date(monitoringRuntime.nextEligibleAt).toLocaleString() : "Paused until manager action"}</span>
        {monitoringRuntime?.lastFailureReason ? <span style={{ color: cockpit.warning, fontSize: "0.57rem" }}>{monitoringRuntime.lastFailureReason}</span> : null}
        <label style={{ color: cockpit.textSoft, fontSize: "0.58rem" }}>Frequency<select aria-label="Active monitoring frequency" value={monitoringPolicy.frequency} onChange={(event) => updateAutomaticMonitoringFrequency(connection.workspaceId, connection.connectionId, event.target.value as NexoraMonitoringFrequency, new Date().toISOString())} style={{ display: "block", width: "100%", marginTop: "0.25rem", background: cockpit.panel, border: `1px solid ${cockpit.border}`, borderRadius: cockpit.radius.sm, color: cockpit.textSoft, fontFamily: "inherit", fontSize: "0.6rem", padding: "0.35rem" }}><option value="hourly">Hourly</option><option value="every-6-hours">Every 6 hours</option><option value="daily">Daily</option></select></label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>{monitoringPolicy.paused ? <button type="button" style={actionStyle(true)} onClick={() => resumeAutomaticMonitoring(connection.workspaceId, connection.connectionId, new Date().toISOString())}>Resume Monitoring</button> : <button type="button" style={actionStyle()} onClick={() => pauseAutomaticMonitoring(connection.workspaceId, connection.connectionId, new Date().toISOString())}>Pause Monitoring</button>}{monitoringPolicy.executionOwner === "background" ? <button type="button" style={actionStyle()} disabled={busy} onClick={() => void setExecutionOwner("foreground")}>Use Foreground Monitoring</button> : <button type="button" style={actionStyle(true)} disabled={busy} onClick={() => void setExecutionOwner("background")}>Enable Background Monitoring</button>}<button type="button" style={actionStyle(false, true)} onClick={() => disableAutomaticMonitoring(connection.workspaceId, connection.connectionId, new Date().toISOString())}>Disable</button></div>
      </>}
    </details>
    {message ? <span style={{ color: connection.status === "degraded" ? cockpit.warning : cockpit.success, fontSize: "0.6rem", lineHeight: 1.4 }}>{message}</span> : null}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}><button type="button" data-testid="nexora-rdi4-card-refresh" style={actionStyle(true)} disabled={busy || connection.status === "disconnected"} onClick={() => void refresh()}>{busy ? "Refreshing…" : "Refresh"}</button>{latest && !active ? <button type="button" style={actionStyle()} onClick={() => onActivate(latest)}>Use as Active Source</button> : null}{intelligence ? <><button type="button" style={actionStyle()} onClick={() => { const target = intelligence.affectedObjects.find((item) => item.stageObjectId)?.stageObjectId; if (target) onViewOnStage(target); }}>View on Stage</button><button type="button" data-testid="nexora-data-source-ask-nexora" style={actionStyle()} onClick={() => onAdvisorContext(createExecutiveSourceAdvisorContext(intelligence))}>Ask Nexora</button></> : null}<button type="button" style={actionStyle()} onClick={() => setManagement((value) => !value)}>More</button></div>
    {management ? <section data-testid="nexora-rdi4-disconnect-safety" style={{ borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.45rem" }}>{active ? <span style={{ color: cockpit.warning, fontSize: "0.61rem", lineHeight: 1.4 }}>This connection supplies active business data. Replace it before disconnecting. Historical observations will be retained.</span> : <button type="button" style={actionStyle(false, true)} onClick={() => { const result = disconnectNexoraLiveConnection({ workspaceId: connection.workspaceId, connectionId: connection.connectionId, activeSourceContextId, disconnectedAt: new Date().toISOString() }); setMessage(result.disconnected ? "Disconnected. Historical observations were retained." : "Disconnect was refused safely."); }}>Disconnect Source</button>}</section> : null}
  </section>;
}

export function NexoraExecutiveDataExplorer({ workspaceId, activeImport, activeLiveObservation, onImportCommitted, onLiveObservationActivated, onViewOnStage, onShowDataObjectOnStage, onAdvisorContext, onDataObjectSelection, selectedDataObjectId, onSemanticClarificationRequest, onSemanticClarificationCancel, awaitingClarificationFieldId, onSourceRemoved, onDismissRemovalReview, removalReviewSourceId, selectedSourceId: selectedSourceIdProp, onSelectSource }: NexoraExecutiveDataExplorerProps) {
  const [adding, setAdding] = useState(false);
  const [addKind, setAddKind] = useState<"csv" | "live" | null>(null);
  const [csvIntake, setCsvIntake] = useState<"new" | "resume" | "update">("new");
  const [intakeNonce, setIntakeNonce] = useState(0);
  const [updatingSource, setUpdatingSource] = useState<CsvCommittedImport | null>(null);
  const [internalSelectedSourceId, setInternalSelectedSourceId] = useState<string | null>(null);
  const selectedSourceId = selectedSourceIdProp !== undefined ? selectedSourceIdProp : internalSelectedSourceId;
  const setSelectedSourceId = (sourceId: string | null) => {
    if (onSelectSource) onSelectSource(sourceId);
    else setInternalSelectedSourceId(sourceId);
  };
  const version = useSyncExternalStore(subscribeCsvRealDataImports, getCsvRealDataImportVersion, () => 0);
  const liveVersion = useSyncExternalStore(subscribeLiveDataConnections, getLiveDataConnectionVersion, () => 0);
  const durabilityHealth = useSyncExternalStore(subscribeCsvDurabilityHealth, getCsvDurabilityHealth, () => "idle" as const);
  const durabilityMessage = useSyncExternalStore(subscribeCsvDurabilityHealth, getCsvDurabilityHealthMessage, () => null);
  const imports = listCsvRealDataImports(workspaceId);
  const pendingCandidates = listCsvImportCandidates(workspaceId);
  const liveConnections = listNexoraLiveConnections(workspaceId);
  void version; void liveVersion;

  const intelligenceBySource = useMemo(() => new Map(imports.map((entry) => [entry.sourceContextId, projectExecutiveSourceIntelligence(entry)])), [imports]);
  const latestObservationByConnectionId = Object.fromEntries(liveConnections.map((connection) => {
    const history = listNexoraLiveObservations(workspaceId, connection.connectionId);
    return [connection.connectionId, history[history.length - 1] ?? null];
  }));
  const library = projectNexoraDataRailLibrary({
    csvImports: imports,
    liveConnections,
    latestObservationByConnectionId,
    activeCsvSourceId: activeImport?.sourceContextId ?? null,
    activeLiveSourceContextId: activeLiveObservation?.sourceContextId ?? null,
    pendingCandidates,
  });
  const selected = imports.find((entry) => entry.sourceContextId === selectedSourceId) ?? null;
  const selectedIntelligence = selected ? intelligenceBySource.get(selected.sourceContextId) ?? null : null;
  const selectedPresentation = selected && selectedIntelligence ? projectCsvDataRailSource({ committed: selected, intelligence: selectedIntelligence, active: activeImport?.sourceContextId === selected.sourceContextId }) : null;
  useEffect(() => { onDataObjectSelection?.(selectedPresentation?.dataObjectId ?? null); }, [onDataObjectSelection, selectedPresentation?.dataObjectId]);
  void selectedDataObjectId;

  const selectedLive = liveConnections.find((entry) => entry.connectionId === selectedSourceId) ?? null;
  const csvFlowOpen = adding && addKind === "csv";
  const resumingCandidate = csvIntake === "resume" && selectedSourceId ? getCsvImportCandidate(workspaceId, selectedSourceId) : null;
  const updatingCandidate = csvIntake === "update" && updatingSource ? getCsvImportCandidate(workspaceId, updatingSource.sourceContextId) : null;
  const selectRow = (id: string) => {
    const pendingRow = library.csvRows.find((row) => row.id === id && row.lifecycle === "pending");
    if (pendingRow) {
      if (selectedSourceId === id && csvFlowOpen && csvIntake === "resume") {
        setAdding(false);
        setAddKind(null);
        setUpdatingSource(null);
        setSelectedSourceId(null);
        return;
      }
      setUpdatingSource(null);
      setCsvIntake("resume");
      setAdding(true);
      setAddKind("csv");
      setSelectedSourceId(id);
      return;
    }
    if (csvFlowOpen) {
      setAdding(false);
      setAddKind(null);
      setUpdatingSource(null);
    }
    setSelectedSourceId(selectedSourceId === id ? null : id);
  };
  return <div data-testid="nexora-rdi2-data-explorer" data-data-rail="true" data-csv-durability={durabilityHealth} data-source-count={String(library.totalCount)} data-csv-count={String(library.csvCount)} data-csv-committed-count={String(library.committedCsvCount)} data-csv-pending-count={String(library.pendingCsvCount)} data-connected-count={String(library.connectedCount)} data-selected-source-id={selectedSourceId ?? "none"} data-selected-data-object-id={selectedPresentation?.dataObjectId ?? "none"} data-rdi3="executive-source-intelligence" data-rdi4="live-connector-foundation" data-rdi2-canonical-route="/executive" style={{ display: "flex", flexDirection: "column", gap: "0.85rem", padding: "0.15rem 0", minWidth: 0 }}>
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div><p style={{ margin: 0, color: cockpit.text, fontSize: "0.74rem", letterSpacing: "0.13em", textTransform: "uppercase" }}>Sources · {library.totalCount}</p><p style={{ margin: "0.28rem 0 0", color: cockpit.lowMuted, fontSize: "0.58rem" }}>CSV · {library.csvCount} · Ready · {library.committedCsvCount} · Pending · {library.pendingCsvCount} · Connected · {library.connectedCount}</p>{durabilityHealth === "session-only" && durabilityMessage ? <p data-testid="nexora-csv-durability-warning" style={{ margin: "0.35rem 0 0", color: cockpit.warning, fontSize: "0.58rem", lineHeight: 1.4 }}>{durabilityMessage}</p> : null}</div><strong data-testid="nexora-data-rail-source-count" style={{ color: cockpit.muted, fontSize: "0.68rem", fontWeight: 500 }}>{library.totalCount}</strong></header>
    {!adding ? <button type="button" data-testid="nexora-rdi2-add-data" style={{ ...actionStyle(false), border: "none", borderTop: `1px solid ${cockpit.border}`, borderBottom: `1px solid ${cockpit.border}`, borderRadius: 0, padding: "0.65rem 0.1rem", color: cockpit.accent, textAlign: "left" }} onClick={() => { setUpdatingSource(null); setCsvIntake("new"); setIntakeNonce((value) => value + 1); setAdding(true); setAddKind(null); }}>+ Add Data</button> : null}
    {adding && addKind === null ? <section data-testid="nexora-rdi4-source-choice" style={{ display: "grid", gap: "0.42rem", border: `1px solid ${cockpit.border}`, borderRadius: cockpit.radius.md, padding: "0.62rem" }}><span style={{ color: cockpit.lowMuted, fontSize: "0.56rem", textTransform: "uppercase" }}>Add Data</span><button type="button" style={actionStyle()} onClick={() => setAddKind("csv")}><strong>Upload File</strong><span style={{ display: "block", color: cockpit.muted, fontSize: "0.55rem", marginTop: "0.12rem" }}>CSV</span></button><button type="button" style={actionStyle(true)} onClick={() => setAddKind("live")}><strong>Connect Source</strong><span style={{ display: "block", color: cockpit.muted, fontSize: "0.55rem", marginTop: "0.12rem" }}>GitHub Repository Health</span></button><button type="button" style={actionStyle()} onClick={() => setAdding(false)}>Cancel</button></section> : null}
    {adding && addKind === "csv" ? <CsvRealDataImportFlow key={csvIntake === "new" ? `new-csv-${intakeNonce}` : resumingCandidate?.candidateId ?? updatingSource?.sourceContextId ?? "csv"} workspaceId={workspaceId} replacementSource={csvIntake === "update" ? updatingSource : null} initialCandidate={csvIntake === "resume" ? resumingCandidate : csvIntake === "update" ? updatingCandidate : null} intakeMode={csvIntake} onSemanticClarificationRequest={onSemanticClarificationRequest} onSemanticClarificationCancel={onSemanticClarificationCancel} awaitingClarificationFieldId={awaitingClarificationFieldId} onAdoptExistingSource={(source) => { setUpdatingSource(source); setCsvIntake("update"); }} onClose={() => { setAdding(false); setAddKind(null); setUpdatingSource(null); }} onCancelled={() => { if (csvIntake === "resume") setSelectedSourceId(null); }} onCompleted={(committed) => { onImportCommitted(committed); setAdding(false); setAddKind(null); setUpdatingSource(null); setSelectedSourceId(committed.sourceContextId); }} /> : null}
    {adding && addKind === "live" ? <NexoraLiveDataConnectionFlow workspaceId={workspaceId} onClose={() => { setAdding(false); setAddKind(null); }} onObservationCommitted={(observation, activate) => { setSelectedSourceId(observation.connectionId); if (activate) onLiveObservationActivated(observation); }} /> : null}

    <section aria-label="CSV files" style={{ display: "grid", gap: "0.18rem" }}>
      <p style={{ margin: 0, color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>CSV files</p>
      {library.csvEmpty ? <div data-testid="nexora-data-rail-empty" style={{ padding: "0.85rem 0.25rem", borderBottom: `1px solid ${cockpit.border}` }}><p style={{ margin: 0, color: cockpit.textSoft, fontSize: "0.72rem" }}>No CSV sources yet.</p><p style={{ margin: "0.45rem 0 0", color: cockpit.muted, fontSize: "0.64rem", lineHeight: 1.5 }}>Add a CSV to let Nexora work with your business data.</p></div> : null}
      {library.csvRows.map((row) => {
        const committed = imports.find((entry) => entry.sourceContextId === row.id) ?? null;
        const selectedCard = selectedSourceId === row.id;
        return <button key={row.id} type="button" data-testid={committed ? `nexora-rdi3-source-${committed.importId}` : "nexora-csv-pending-row"} data-source-filename={row.label} data-source-active={row.active} data-source-selected={selectedCard} data-source-status={row.statusLabel} data-source-kind="csv" data-source-lifecycle={row.lifecycle} data-data-object-id={committed ? projectCsvImportAsDecisionTheatreDataObject(committed).id : "pending"} onClick={() => selectRow(row.id)} style={{ border: "none", borderLeft: `2px solid ${selectedCard ? cockpit.accent : "transparent"}`, borderBottom: `1px solid ${cockpit.border}`, background: selectedCard ? "rgba(56,189,248,0.06)" : "transparent", color: cockpit.text, cursor: "pointer", fontFamily: "inherit", padding: "0.62rem 0.55rem", textAlign: "left", minWidth: 0 }}>
          <span style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem", alignItems: "baseline" }}><strong style={{ fontSize: "0.7rem", fontWeight: 560, overflowWrap: "anywhere" }}>{row.label}</strong>{row.active ? <span style={{ color: cockpit.accent, fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Active</span> : null}</span>
          <span style={{ display: "block", marginTop: "0.22rem", color: row.attention ? cockpit.warning : cockpit.success, fontSize: "0.59rem" }}>{row.typeLabel} · {row.statusLabel}</span>
          {row.lifecycle === "pending" ? <span style={{ display: "block", marginTop: "0.16rem", color: cockpit.lowMuted, fontSize: "0.55rem" }}>Needs review</span> : row.relatedObjectLabels.length > 0 ? <span style={{ display: "block", marginTop: "0.16rem", color: cockpit.lowMuted, fontSize: "0.55rem" }}>{row.relatedObjectLabels.join(" · ")}</span> : null}
        </button>;
      })}
    </section>

    <section aria-label="Connected sources" style={{ display: "grid", gap: "0.4rem" }}>
      <p style={{ margin: 0, color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Connected</p>
      {library.connectedCount === 0 ? <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.66rem" }}>No connected sources in this workspace.</p> : library.connectedRows.map((row) => <button key={row.id} type="button" data-testid={`nexora-rdi4-connection-${liveConnections.find((entry) => entry.connectionId === row.id)?.providerId ?? row.id}`} data-source-active={row.active} data-source-kind="connected" data-source-selected={selectedSourceId === row.id} onClick={() => selectRow(row.id)} style={{ border: `1px solid ${selectedSourceId === row.id ? cockpit.borderStrong : cockpit.border}`, borderRadius: cockpit.radius.sm, background: selectedSourceId === row.id ? cockpit.accentSoft : cockpit.panelSoft, color: cockpit.text, cursor: "pointer", fontFamily: "inherit", padding: "0.5rem 0.58rem", textAlign: "left" }}><span style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem" }}><strong style={{ fontSize: "0.69rem" }}>{row.label}</strong><strong style={{ color: row.attention ? cockpit.warning : cockpit.success, fontSize: "0.54rem", textTransform: "uppercase" }}>{row.statusLabel}</strong></span>{row.relatedObjectLabels.length > 0 ? <span style={{ display: "block", color: cockpit.muted, fontSize: "0.58rem", marginTop: "0.18rem" }}>{row.relatedObjectLabels.join(" · ")}</span> : null}{row.active ? <span style={{ display: "block", color: cockpit.accent, fontSize: "0.52rem", marginTop: "0.12rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Active</span> : null}</button>)}
    </section>

    {selected && selectedIntelligence && !csvFlowOpen ? <SourceIntelligenceView key={selected.sourceContextId} source={selected} intelligence={selectedIntelligence} active={activeImport?.sourceContextId === selected.sourceContextId} activeSourceContextId={activeImport?.sourceContextId ?? null} imports={imports} onActivate={() => onImportCommitted(selected)} onShowDataObjectOnStage={onShowDataObjectOnStage} onAdvisorContext={onAdvisorContext} onUpdate={() => { setUpdatingSource(selected); setCsvIntake("update"); setAdding(true); setAddKind("csv"); }} onRemoved={() => setSelectedSourceId(null)} onSourceRemoved={(sourceContextId) => onSourceRemoved?.(sourceContextId)} onDismissRemovalReview={() => onDismissRemovalReview?.()} onCloseDetails={() => setSelectedSourceId(null)} requestedReview={removalReviewSourceId === selected.sourceContextId} /> : null}
    {selectedLive && !csvFlowOpen ? <LiveSourceView key={selectedLive.connectionId} connection={selectedLive} observations={listNexoraLiveObservations(workspaceId, selectedLive.connectionId)} activeSourceContextId={activeLiveObservation?.sourceContextId ?? activeImport?.sourceContextId ?? null} onActivate={onLiveObservationActivated} onViewOnStage={onViewOnStage} onAdvisorContext={onAdvisorContext} onCloseDetails={() => setSelectedSourceId(null)} /> : null}
  </div>;
}

export default NexoraExecutiveDataExplorer;
