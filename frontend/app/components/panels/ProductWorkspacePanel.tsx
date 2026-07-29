"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cardStyle, inputStyle, nx, primaryButtonStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";
import { readUnknownErrorMessage } from "../../lib/system/nexoraErrors";

type ProductWorkspaceRecord = {
  id?: string;
  label?: string;
  owner?: string;
  role?: string;
};

type SavedScenarioRecord = {
  id?: string;
  label?: string;
  episode_id?: string;
  created_at?: string;
};

type SavedReportRecord = {
  id?: string;
  label?: string;
  episode_id?: string;
  created_at?: string;
  summary?: {
    fragility_score?: unknown;
    best_action?: unknown;
  };
};

function readApiErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const record = json as Record<string, unknown>;
  const detail = record.detail;
  if (detail && typeof detail === "object") {
    const detailRecord = detail as Record<string, unknown>;
    const error = detailRecord.error;
    if (error && typeof error === "object") {
      const message = (error as Record<string, unknown>).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (typeof detailRecord.message === "string" && detailRecord.message.trim()) {
      return detailRecord.message;
    }
  }
  if (typeof detail === "string" && detail.trim()) return detail;
  return fallback;
}

function readRecordField<T extends Record<string, unknown>>(json: unknown, field: string): T | null {
  if (!json || typeof json !== "object") return null;
  const value = (json as Record<string, unknown>)[field];
  return value && typeof value === "object" ? (value as T) : null;
}

function readRecordList<T extends Record<string, unknown>>(json: unknown, field: string): T[] {
  if (!json || typeof json !== "object") return [];
  const value = (json as Record<string, unknown>)[field];
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is T => !!entry && typeof entry === "object") as T[];
}

type Props = {
  backendBase: string;
  episodeId: string | null;
  responseData?: unknown;
  currentScenarioInputs?: unknown[];
};

export default function ProductWorkspacePanel({
  backendBase,
  episodeId,
  responseData,
  currentScenarioInputs,
}: Props) {
  // MVP-FROZEN: advanced document/export management is intentionally deferred.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<ProductWorkspaceRecord | null>(null);
  const [scenarios, setScenarios] = useState<SavedScenarioRecord[]>([]);
  const [reports, setReports] = useState<SavedReportRecord[]>([]);
  const [saveScenarioLabel, setSaveScenarioLabel] = useState("");
  const [saveReportLabel, setSaveReportLabel] = useState("");
  const [savingScenario, setSavingScenario] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [selectedReportJson, setSelectedReportJson] = useState<Record<string, unknown> | null>(null);

  const canSave = typeof episodeId === "string" && episodeId.trim().length > 0;
  const wsId = String(workspace?.id ?? "").trim();
  const scenarioInputs = Array.isArray(currentScenarioInputs) ? currentScenarioInputs : [];

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendBase}/product/workspace`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = readApiErrorMessage(json, "Failed to load workspace.");
        throw new Error(String(msg));
      }
      setWorkspace(readRecordField<ProductWorkspaceRecord>(json, "workspace"));
    } catch (e: unknown) {
      setError(readUnknownErrorMessage(e, "Failed to load workspace."));
    } finally {
      setLoading(false);
    }
  }, [backendBase]);

  const loadScenarios = useCallback(async () => {
    if (!wsId) return;
    try {
      const res = await fetch(`${backendBase}/product/workspace/${encodeURIComponent(wsId)}/scenarios`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = readApiErrorMessage(json, "Failed to load scenarios.");
        throw new Error(String(msg));
      }
      setScenarios(readRecordList<SavedScenarioRecord>(json, "items"));
    } catch (e: unknown) {
      setError(readUnknownErrorMessage(e, "Failed to load scenarios."));
    }
  }, [backendBase, wsId]);

  const loadReports = useCallback(async () => {
    if (!wsId) return;
    try {
      const res = await fetch(`${backendBase}/product/workspace/${encodeURIComponent(wsId)}/reports`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = readApiErrorMessage(json, "Failed to load reports.");
        throw new Error(String(msg));
      }
      setReports(readRecordList<SavedReportRecord>(json, "items"));
    } catch (e: unknown) {
      setError(readUnknownErrorMessage(e, "Failed to load reports."));
    }
  }, [backendBase, wsId]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  useEffect(() => {
    if (!wsId) return;
    void loadScenarios();
    void loadReports();
  }, [loadScenarios, loadReports, wsId]);

  const saveScenario = useCallback(async () => {
    if (!wsId || !canSave || !episodeId) return;
    setSavingScenario(true);
    setError(null);
    try {
      const res = await fetch(`${backendBase}/product/workspace/${encodeURIComponent(wsId)}/scenario`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          label: saveScenarioLabel.trim() || "Saved scenario",
          episode_id: episodeId,
          scenario_inputs: scenarioInputs,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = readApiErrorMessage(json, "Failed to save scenario.");
        throw new Error(String(msg));
      }
      setSaveScenarioLabel("");
      await loadScenarios();
    } catch (e: unknown) {
      setError(readUnknownErrorMessage(e, "Failed to save scenario."));
    } finally {
      setSavingScenario(false);
    }
  }, [backendBase, canSave, episodeId, loadScenarios, saveScenarioLabel, scenarioInputs, wsId]);

  const reportSummary = useMemo(() => {
    const response = (responseData ?? null) as Record<string, unknown> | null;
    const sceneJson = (response?.scene_json ?? null) as Record<string, unknown> | null;
    const scene = (sceneJson?.scene ?? null) as Record<string, unknown> | null;
    const fragility = (response?.fragility ?? scene?.fragility ?? null) as Record<string, unknown> | null;
    const strategicAdvice = (response?.strategic_advice ?? sceneJson?.strategic_advice ?? null) as Record<string, unknown> | null;
    const strategicPatterns = (response?.strategic_patterns ?? sceneJson?.strategic_patterns ?? null) as Record<string, unknown> | null;
    const primaryRecommendation = (strategicAdvice?.primary_recommendation ?? null) as Record<string, unknown> | null;
    const topPattern = (strategicPatterns?.top_pattern ?? null) as Record<string, unknown> | null;
    const fragilityScore = Number(fragility?.score ?? 0);
    const bestAction = String(primaryRecommendation?.action ?? "");
    const topPatternLabel = String(topPattern?.label ?? "");
    return {
      fragility_score: Number.isFinite(fragilityScore) ? fragilityScore : 0,
      best_action: bestAction,
      top_pattern: topPatternLabel,
    };
  }, [responseData]);

  const saveReport = useCallback(async () => {
    if (!wsId || !canSave || !episodeId) return;
    setSavingReport(true);
    setError(null);
    try {
      const res = await fetch(`${backendBase}/product/workspace/${encodeURIComponent(wsId)}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          label: saveReportLabel.trim() || "Saved report",
          episode_id: episodeId,
          summary: reportSummary,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = readApiErrorMessage(json, "Failed to save report.");
        throw new Error(String(msg));
      }
      setSaveReportLabel("");
      await loadReports();
    } catch (e: unknown) {
      setError(readUnknownErrorMessage(e, "Failed to save report."));
    } finally {
      setSavingReport(false);
    }
  }, [backendBase, canSave, episodeId, loadReports, reportSummary, saveReportLabel, wsId]);

  const viewReportJson = useCallback(async (reportId: string) => {
    if (!wsId || !reportId) return;
    setError(null);
    try {
      const res = await fetch(`${backendBase}/product/workspace/${encodeURIComponent(wsId)}/report/${encodeURIComponent(reportId)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = readApiErrorMessage(json, "Failed to load report JSON.");
        throw new Error(String(msg));
      }
      setSelectedReportJson(readRecordField<Record<string, unknown>>(json, "item"));
    } catch (e: unknown) {
      setError(readUnknownErrorMessage(e, "Failed to load report JSON."));
    }
  }, [backendBase, wsId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0, overflow: "auto" }}>
      <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Workspace</div>
      <div style={{ color: nx.muted, fontSize: 12 }}>Product workspace for saved scenarios and reports.</div>

      {!canSave ? (
        <EmptyStateCard text="Create saved scenarios and reports from current analysis. Run a scenario or send a chat message first so Nexora can save product artifacts." />
      ) : null}

      {loading ? <LoadingStateCard text="Loading workspace…" /> : null}
      {error ? <ErrorStateCard text={error} /> : null}

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Workspace</div>
        <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
          {String(workspace?.label ?? (loading ? "Loading..." : "-"))}
        </div>
        <div style={{ color: nx.text, fontSize: 12 }}>Owner: {String(workspace?.owner ?? "-")}</div>
        <div style={{ color: "#93c5fd", fontSize: 12 }}>Role: {String(workspace?.role ?? "-")}</div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Save Scenario</div>
        <input
          style={inputStyle}
          placeholder="Scenario label"
          value={saveScenarioLabel}
          onChange={(e) => setSaveScenarioLabel(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void saveScenario()}
          disabled={!canSave || !wsId || savingScenario}
          style={{
            ...primaryButtonStyle,
            opacity: !canSave || !wsId || savingScenario ? 0.7 : 1,
            cursor: !canSave || !wsId || savingScenario ? "default" : "pointer",
          }}
        >
          {savingScenario ? "Saving..." : "Save Scenario"}
        </button>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Save Report</div>
        <input
          style={inputStyle}
          placeholder="Report label"
          value={saveReportLabel}
          onChange={(e) => setSaveReportLabel(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void saveReport()}
          disabled={!canSave || !wsId || savingReport}
          style={{
            ...primaryButtonStyle,
            opacity: !canSave || !wsId || savingReport ? 0.7 : 1,
            cursor: !canSave || !wsId || savingReport ? "default" : "pointer",
          }}
        >
          {savingReport ? "Saving..." : "Save Report"}
        </button>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Saved Scenarios</div>
        {scenarios.length ? (
          scenarios.map((s) => (
            <div key={String(s?.id ?? Math.random())} style={{ ...softCardStyle, padding: 10 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{String(s?.label ?? "-")}</div>
              <div style={{ color: "#cbd5e1", fontSize: 12 }}>Episode: {String(s?.episode_id ?? "-")}</div>
              <div style={{ color: nx.lowMuted, fontSize: 11 }}>{String(s?.created_at ?? "")}</div>
            </div>
          ))
        ) : (
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>No saved scenarios.</div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Saved Reports</div>
        {reports.length ? (
          reports.map((r) => (
            <div key={String(r?.id ?? Math.random())} style={{ ...softCardStyle, padding: 10 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{String(r?.label ?? "-")}</div>
              <div style={{ color: nx.text, fontSize: 12 }}>Episode: {String(r?.episode_id ?? "-")}</div>
              <div style={{ color: "#93c5fd", fontSize: 11 }}>
                Fragility: {String(r?.summary?.fragility_score ?? "-")} · Best action: {String(r?.summary?.best_action ?? "-")}
              </div>
              <div style={{ color: nx.lowMuted, fontSize: 11 }}>{String(r?.created_at ?? "")}</div>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <button
                  type="button"
                  onClick={() => void viewReportJson(String(r?.id ?? ""))}
                  style={{ ...primaryButtonStyle, padding: "6px 9px", fontSize: 11 }}
                >
                  View Report JSON
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>No saved reports yet.</div>
        )}
      </div>

      {selectedReportJson ? (
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Report Summary</div>
          <div style={{ color: nx.text, fontSize: 12 }}>
            {String(selectedReportJson?.label ?? "Saved report")}
          </div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 11,
              color: "#cbd5e1",
              background: "rgba(2,6,23,0.45)",
              border: `1px solid ${nx.border}`,
              borderRadius: 10,
              padding: 10,
            }}
          >
            {JSON.stringify(selectedReportJson, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
