"use client";

import React from "react";

import {
  createNexoraLiveConnection,
  transitionNexoraLiveConnection,
  type NexoraLiveCommittedObservation,
  type NexoraLiveConnection,
  type NexoraLivePreparedObservation,
} from "../../../lib/data-reality/liveDataConnectorFoundation.ts";
import { commitNexoraLiveObservation, saveNexoraLiveConnection, setNexoraLiveConnectionState } from "../../../lib/data-reality/liveDataConnectionStore.ts";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme.ts";

export type NexoraLiveDataConnectionFlowProps = Readonly<{
  workspaceId: string;
  onClose: () => void;
  onObservationCommitted: (observation: NexoraLiveCommittedObservation, activate: boolean) => void;
}>;

type FlowStep = "configure"|"tested"|"connected"|"observed"|"committed"|"error";

function actionStyle(primary = false, disabled = false): React.CSSProperties { return { border: `1px solid ${primary ? cockpit.borderStrong : cockpit.border}`, borderRadius: cockpit.radius.sm, background: disabled ? cockpit.charcoal : primary ? cockpit.accentSoft : "transparent", color: disabled ? cockpit.lowMuted : primary ? cockpit.accent : cockpit.textSoft, cursor: disabled ? "default" : "pointer", fontFamily: "inherit", fontSize: "0.62rem", fontWeight: 700, padding: "0.44rem 0.55rem" }; }
function fieldStyle(): React.CSSProperties { return { width: "100%", boxSizing: "border-box", border: `1px solid ${cockpit.border}`, borderRadius: cockpit.radius.sm, background: cockpit.charcoal, color: cockpit.text, fontFamily: "inherit", fontSize: "0.68rem", padding: "0.48rem" }; }
function deepFreeze<T>(value: T): T { if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value as Record<string, unknown>).forEach(deepFreeze); Object.freeze(value); } return value; }

export function NexoraLiveDataConnectionFlow({ workspaceId, onClose, onObservationCommitted }: NexoraLiveDataConnectionFlowProps): React.ReactElement {
  const [owner, setOwner] = React.useState("vercel"); const [repository, setRepository] = React.useState("next.js");
  const [displayName, setDisplayName] = React.useState("Engineering Source"); const [step, setStep] = React.useState<FlowStep>("configure");
  const [busy, setBusy] = React.useState(false); const [message, setMessage] = React.useState("Public repository access. Any optional credential remains server-managed.");
  const [connection, setConnection] = React.useState<NexoraLiveConnection | null>(null); const [prepared, setPrepared] = React.useState<NexoraLivePreparedObservation | null>(null);
  const connectionId = React.useMemo(() => `github:${workspaceId}:${owner.trim().toLowerCase()}/${repository.trim().toLowerCase()}`, [workspaceId, owner, repository]);
  const request = React.useCallback(async (action: "test"|"observe") => {
    const observedAt = new Date().toISOString(); const observationId = `OBS-${Date.now().toString(36)}`;
    const response = await fetch("/api/rdi/live/github", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, workspaceId, connectionId, displayName, owner, repository, observedAt, observationId }) });
    const result = await response.json() as { ok: boolean; state?: NexoraLiveConnection["status"]; message: string; credentialMode?: string; connection?: NexoraLiveConnection; prepared?: NexoraLivePreparedObservation };
    if (!response.ok || !result.ok) throw new Error(result.message || "The source could not be reached."); return deepFreeze(result);
  }, [connectionId, displayName, owner, repository, workspaceId]);

  const test = async () => { setBusy(true); try { const result = await request("test"); setMessage(`${result.message} · ${result.credentialMode === "server-managed" ? "Server-managed credential" : "Public access"}`); setStep("tested"); } catch (error) { setMessage(error instanceof Error ? error.message : "Connection test failed."); setStep("error"); } finally { setBusy(false); } };
  const connect = () => { const now = new Date().toISOString(); const base = createNexoraLiveConnection({ connectionId, workspaceId, providerId: "github", providerType: "source-control", displayName, capabilities: Object.freeze(["manual-fetch", "refresh", "health-check"]), createdAt: now, configurationReference: `github:${owner}/${repository}`, credentialReference: null }); const connected = transitionNexoraLiveConnection(base, "connected", now); saveNexoraLiveConnection(connected); setConnection(connected); setMessage("Connected. No business data is active until you refresh, review, and activate it."); setStep("connected"); };
  const refresh = async () => { if (!connection) return; setBusy(true); try { const result = await request("observe"); if (!result.prepared) throw new Error("No canonical observation was returned."); setPrepared(result.prepared); setMessage("Observation validated through RDI and Data Reality. Review before saving or activating."); setStep("observed"); } catch (error) { setNexoraLiveConnectionState({ workspaceId, connectionId, state: "degraded", updatedAt: new Date().toISOString() }); setMessage(`${error instanceof Error ? error.message : "Refresh failed."} Nexora is continuing to use the last successfully validated observation.`); setStep("error"); } finally { setBusy(false); } };
  const commit = (activate: boolean) => { if (!connection || !prepared) return; const result = commitNexoraLiveObservation({ connection, prepared, committedAt: new Date().toISOString() }); if (!result.committed || !result.observation) { setMessage("The observation could not be committed; previous truth remains intact."); setStep("error"); return; } setStep("committed"); setMessage(activate ? "Observation activated as current executive truth." : "Observation saved. Connected remains separate from Active."); onObservationCommitted(result.observation, activate); };
  const objectStates = prepared?.dataReality?.objectStates ?? [];

  return <section data-testid="nexora-rdi4-connect-flow" data-rdi4-step={step} style={{ display: "grid", gap: "0.62rem", border: `1px solid ${cockpit.borderStrong}`, borderRadius: cockpit.radius.md, background: cockpit.panelSoft, padding: "0.68rem" }}>
    <header><span style={{ color: cockpit.lowMuted, fontSize: "0.55rem", letterSpacing: "0.11em", textTransform: "uppercase" }}>Connect Source</span><strong style={{ display: "block", color: cockpit.text, fontSize: "0.76rem", marginTop: "0.2rem" }}>GitHub Repository Health</strong><span style={{ color: cockpit.muted, fontSize: "0.6rem", lineHeight: 1.4 }}>Issue workload and recent resolution signals only.</span></header>
    {(step === "configure" || step === "tested" || step === "error") && !connection ? <div style={{ display: "grid", gap: "0.42rem" }}><label style={{ color: cockpit.textSoft, fontSize: "0.58rem" }}>Source name<input aria-label="Source name" style={fieldStyle()} value={displayName} onChange={(event) => { setDisplayName(event.target.value); setStep("configure"); }} /></label><label style={{ color: cockpit.textSoft, fontSize: "0.58rem" }}>Repository owner<input aria-label="Repository owner" style={fieldStyle()} value={owner} onChange={(event) => { setOwner(event.target.value); setStep("configure"); }} /></label><label style={{ color: cockpit.textSoft, fontSize: "0.58rem" }}>Repository<input aria-label="Repository" style={fieldStyle()} value={repository} onChange={(event) => { setRepository(event.target.value); setStep("configure"); }} /></label><div style={{ padding: "0.45rem", border: `1px solid ${cockpit.border}`, borderRadius: cockpit.radius.sm, color: cockpit.lowMuted, fontSize: "0.57rem", lineHeight: 1.4 }}>Authorization: public access or a server-managed environment credential. Tokens never enter this browser.</div></div> : null}
    <span data-testid="nexora-rdi4-flow-message" style={{ color: step === "error" ? cockpit.risk : step === "tested" || step === "observed" || step === "committed" ? cockpit.success : cockpit.textSoft, fontSize: "0.62rem", lineHeight: 1.45 }}>{message}</span>
    {prepared?.ready ? <section data-testid="nexora-rdi4-observation-review" style={{ display: "grid", gap: "0.3rem", borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.52rem" }}><span style={{ color: cockpit.lowMuted, fontSize: "0.54rem", textTransform: "uppercase" }}>Observation Review</span><strong style={{ color: cockpit.text, fontSize: "0.68rem" }}>{prepared.recordCount} external record · {objectStates.length} affected objects</strong>{objectStates.map((item) => <span key={item.objectKey} style={{ color: item.state === "critical" ? cockpit.risk : item.state === "attention" ? cockpit.warning : cockpit.success, fontSize: "0.6rem", textTransform: "capitalize" }}>{item.objectKey} · {item.state}</span>)}<details><summary style={{ color: cockpit.muted, fontSize: "0.57rem", cursor: "pointer" }}>Evidence & provenance</summary><span style={{ display: "block", color: cockpit.lowMuted, fontSize: "0.54rem", overflowWrap: "anywhere", marginTop: "0.25rem" }}>{prepared.snapshot?.source.identity.providerName} → {prepared.snapshot?.source.identity.connectionId} → {prepared.observationId}</span></details></section> : null}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>{!connection ? <button type="button" style={actionStyle(step === "configure", busy)} disabled={busy} onClick={() => void test()}>{busy ? "Testing…" : "Test Connection"}</button> : null}{step === "tested" ? <button type="button" style={actionStyle(true)} onClick={connect}>Connect</button> : null}{connection && !prepared ? <button type="button" data-testid="nexora-rdi4-refresh" style={actionStyle(true, busy)} disabled={busy} onClick={() => void refresh()}>{busy ? "Refreshing…" : "Refresh Data"}</button> : null}{prepared?.ready && step !== "committed" ? <><button type="button" style={actionStyle()} onClick={() => commit(false)}>Save Observation</button><button type="button" style={actionStyle(true)} onClick={() => commit(true)}>Activate</button></> : null}<button type="button" style={actionStyle()} onClick={onClose}>{step === "committed" ? "Done" : "Cancel"}</button></div>
  </section>;
}
