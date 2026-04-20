"use client";

import React, { useCallback, useMemo, useState } from "react";
import { nx } from "../ui/nexoraTheme";
import {
  isProductionMultiSourceConnectorId,
  PRODUCTION_MULTI_SOURCE_CONNECTOR_IDS,
  type ProductionMultiSourceConnectorId,
} from "../../screens/homeScreenMultiSourceIngestionDev";
import type { ConnectorRunInputOut, MultiSourceIngestionRequest } from "../../lib/api/ingestionApi";
import type {
  ScheduledAssessmentDefinition,
  ScheduleType,
} from "../../lib/scheduled/scheduledAssessmentStorage";

const MAX_SOURCES = 3;

const CONNECTOR_LABELS: Record<ProductionMultiSourceConnectorId, { label: string; placeholder: string }> = {
  manual_text: { label: "Manual text", placeholder: "Short business text…" },
  web_source: { label: "Web URL", placeholder: "https://www.reuters.com/…" },
  csv_upload: { label: "CSV file path", placeholder: "/absolute/path/data.csv" },
};

export type SaveScheduledPayload = {
  request: MultiSourceIngestionRequest;
  name: string;
  scheduleType: ScheduleType;
  intervalMinutes: number;
  dailyTime: string | null;
};

export type MultiSourceAssessPopoverProps = {
  open: boolean;
  onClose: () => void;
  defaultDomain: string | null;
  submitting: boolean;
  errorMessage: string | null;
  /** Dispatches `nexora:run-multi-source-assessment` with built request. */
  onRunAssessment: (request: MultiSourceIngestionRequest) => void;
  /** B.11 — saved recurring definitions (read-only list + actions). */
  scheduledDefinitions: ScheduledAssessmentDefinition[];
  onToggleScheduledEnabled: (id: string, enabled: boolean) => void;
  onDeleteScheduled: (id: string) => void;
  onSaveScheduled: (payload: SaveScheduledPayload) => void;
};

type Row = { connectorId: ProductionMultiSourceConnectorId; value: string };

function buildConfigForRow(row: Row): Record<string, unknown> {
  const v = row.value.trim();
  if (row.connectorId === "manual_text") return { text: v };
  if (row.connectorId === "web_source") return { url: v };
  return { file_path: v };
}

export function MultiSourceAssessPopover(props: MultiSourceAssessPopoverProps) {
  const [rows, setRows] = useState<Row[]>([
    { connectorId: "web_source", value: "" },
    { connectorId: "csv_upload", value: "" },
  ]);
  const [domainInput, setDomainInput] = useState(() => (props.defaultDomain ?? "").trim());
  const [localError, setLocalError] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [saveScheduleType, setSaveScheduleType] = useState<ScheduleType>("interval");
  const [saveIntervalMinutes, setSaveIntervalMinutes] = useState(60);
  const [saveDailyTime, setSaveDailyTime] = useState("09:00");
  const [saveRecurringError, setSaveRecurringError] = useState<string | null>(null);

  React.useEffect(() => {
    if (props.open) {
      setDomainInput((props.defaultDomain ?? "").trim());
      setLocalError(null);
      setSaveRecurringError(null);
    }
  }, [props.open, props.defaultDomain]);

  const canAddRow = rows.length < MAX_SOURCES;

  const buildRequest = useCallback((): MultiSourceIngestionRequest | null => {
    const sources: ConnectorRunInputOut[] = [];
    for (const row of rows) {
      if (!isProductionMultiSourceConnectorId(row.connectorId)) continue;
      const v = row.value.trim();
      if (!v) continue;
      sources.push({ connector_id: row.connectorId, config: buildConfigForRow({ ...row, value: v }) });
    }
    if (sources.length === 0) return null;
    const d = domainInput.trim();
    return d ? { sources, domain: d } : { sources };
  }, [rows, domainInput]);

  const handleSubmit = useCallback(() => {
    if (props.submitting) return;
    const req = buildRequest();
    if (!req) {
      setLocalError("Add at least one source with a value.");
      return;
    }
    setLocalError(null);
    props.onRunAssessment(req);
  }, [buildRequest, props]);

  const handleSaveRecurring = useCallback(() => {
    const req = buildRequest();
    if (!req) {
      setSaveRecurringError("Add at least one source before saving a schedule.");
      return;
    }
    const name = saveName.trim() || "Recurring assessment";
    setSaveRecurringError(null);
    props.onSaveScheduled({
      request: req,
      name,
      scheduleType: saveScheduleType,
      intervalMinutes: saveIntervalMinutes,
      dailyTime: saveScheduleType === "daily" ? saveDailyTime.trim() || "09:00" : null,
    });
  }, [buildRequest, props, saveName, saveScheduleType, saveIntervalMinutes, saveDailyTime]);

  const statusLine = useMemo(() => {
    if (props.submitting) return "Submitting…";
    if (props.errorMessage) return props.errorMessage;
    if (localError) return localError;
    if (saveRecurringError) return saveRecurringError;
    return null;
  }, [props.submitting, props.errorMessage, localError, saveRecurringError]);

  if (!props.open) return null;

  return (
    <>
    <button
      type="button"
      aria-label="Dismiss"
      disabled={props.submitting}
      onClick={() => {
        if (!props.submitting) props.onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 199,
        margin: 0,
        padding: 0,
        border: "none",
        background: "rgba(0,0,0,0.22)",
        cursor: props.submitting ? "default" : "pointer",
      }}
    />
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Assess multiple sources"
      style={{
        position: "fixed",
        zIndex: 200,
        left: "50%",
        top: 88,
        transform: "translateX(-50%)",
        width: "min(440px, calc(100vw - 24px))",
        maxHeight: "min(420px, calc(100vh - 120px))",
        overflow: "auto",
        borderRadius: 14,
        border: `1px solid ${nx.borderStrong}`,
        background: nx.bgShell,
        boxShadow: nx.headerShadow,
        padding: "14px 16px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div style={{ color: nx.textStrong, fontSize: 13, fontWeight: 800 }}>Assess sources</div>
        <button
          type="button"
          onClick={props.onClose}
          disabled={props.submitting}
          style={{
            border: "none",
            background: "transparent",
            color: nx.muted,
            cursor: props.submitting ? "default" : "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div style={{ color: nx.lowMuted, fontSize: 10, marginBottom: 12, lineHeight: 1.4 }}>
        Run up to {MAX_SOURCES} connectors through the same trust-weighted merge, scanner, and scene path as dev tools.
        Paths and URLs must be valid for your environment.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((row, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Source {idx + 1}
            </label>
            <select
              value={row.connectorId}
              disabled={props.submitting}
              onChange={(e) => {
                const v = e.target.value;
                if (!isProductionMultiSourceConnectorId(v)) return;
                setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, connectorId: v } : r)));
              }}
              style={{
                height: 32,
                borderRadius: 8,
                border: `1px solid ${nx.border}`,
                background: nx.consoleBg,
                color: nx.text,
                fontSize: 12,
                padding: "0 8px",
              }}
            >
              {PRODUCTION_MULTI_SOURCE_CONNECTOR_IDS.map((id) => (
                <option key={id} value={id}>
                  {CONNECTOR_LABELS[id].label}
                </option>
              ))}
            </select>
            <input
              value={row.value}
              disabled={props.submitting}
              onChange={(e) => setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, value: e.target.value } : r)))}
              placeholder={CONNECTOR_LABELS[row.connectorId].placeholder}
              style={{
                height: 34,
                borderRadius: 8,
                border: `1px solid ${nx.border}`,
                background: nx.consoleBg,
                color: nx.text,
                fontSize: 12,
                padding: "0 10px",
              }}
            />
          </div>
        ))}
      </div>

      {canAddRow ? (
        <button
          type="button"
          disabled={props.submitting}
          onClick={() => setRows((prev) => [...prev, { connectorId: "manual_text", value: "" }])}
          style={{
            marginTop: 10,
            alignSelf: "flex-start",
            fontSize: 11,
            fontWeight: 700,
            color: nx.accentInk,
            background: "transparent",
            border: "none",
            cursor: props.submitting ? "default" : "pointer",
            padding: 0,
          }}
        >
          + Add source (max {MAX_SOURCES})
        </button>
      ) : null}

      <div style={{ marginTop: 12 }}>
        <label style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Domain (optional)
        </label>
        <input
          value={domainInput}
          disabled={props.submitting}
          onChange={(e) => setDomainInput(e.target.value)}
          placeholder="e.g. retail"
          style={{
            marginTop: 4,
            width: "100%",
            boxSizing: "border-box",
            height: 34,
            borderRadius: 8,
            border: `1px solid ${nx.border}`,
            background: nx.consoleBg,
            color: nx.text,
            fontSize: 12,
            padding: "0 10px",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: `1px solid ${nx.borderSoft}`,
        }}
      >
        <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Recurring (B.11)
        </div>
        <div style={{ color: nx.muted, fontSize: 10, marginTop: 4, lineHeight: 1.35 }}>
          Saves this source set locally and re-runs it on a simple schedule (browser tab must stay open).
        </div>
        <input
          value={saveName}
          disabled={props.submitting}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Schedule name"
          style={{
            marginTop: 8,
            width: "100%",
            boxSizing: "border-box",
            height: 32,
            borderRadius: 8,
            border: `1px solid ${nx.border}`,
            background: nx.consoleBg,
            color: nx.text,
            fontSize: 12,
            padding: "0 10px",
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={saveScheduleType}
            disabled={props.submitting}
            onChange={(e) => setSaveScheduleType(e.target.value as ScheduleType)}
            style={{
              height: 32,
              borderRadius: 8,
              border: `1px solid ${nx.border}`,
              background: nx.consoleBg,
              color: nx.text,
              fontSize: 11,
            }}
          >
            <option value="interval">Every … minutes</option>
            <option value="daily">Daily at (local)</option>
          </select>
          {saveScheduleType === "interval" ? (
            <select
              value={saveIntervalMinutes}
              disabled={props.submitting}
              onChange={(e) => setSaveIntervalMinutes(Number(e.target.value))}
              style={{
                height: 32,
                borderRadius: 8,
                border: `1px solid ${nx.border}`,
                background: nx.consoleBg,
                color: nx.text,
                fontSize: 11,
              }}
            >
              {[15, 30, 60, 360, 720, 1440].map((m) => (
                <option key={m} value={m}>
                  {m >= 60 ? `${m / 60}h` : `${m}m`}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              value={saveDailyTime}
              disabled={props.submitting}
              onChange={(e) => setSaveDailyTime(e.target.value)}
              style={{
                height: 32,
                borderRadius: 8,
                border: `1px solid ${nx.border}`,
                background: nx.consoleBg,
                color: nx.text,
                fontSize: 12,
                padding: "0 6px",
              }}
            />
          )}
        </div>
        <button
          type="button"
          disabled={props.submitting}
          onClick={handleSaveRecurring}
          style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: 700,
            padding: "6px 12px",
            borderRadius: 8,
            border: `1px solid ${nx.border}`,
            background: nx.chipSurface,
            color: nx.accentInk,
            cursor: props.submitting ? "default" : "pointer",
          }}
        >
          Save as recurring
        </button>

        {props.scheduledDefinitions.length > 0 ? (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700 }}>Saved</div>
            {props.scheduledDefinitions.map((d) => (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 10,
                  color: nx.textSoft,
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="checkbox"
                  checked={d.enabled}
                  disabled={props.submitting}
                  onChange={(e) => props.onToggleScheduledEnabled(d.id, e.target.checked)}
                  title="Enable schedule"
                />
                <span style={{ flex: 1, minWidth: 120, fontWeight: 600 }}>{d.name}</span>
                <span style={{ color: nx.muted }}>
                  {d.scheduleType === "interval" ? `every ${d.intervalMinutes}m` : `daily ${d.dailyTime ?? "09:00"}`}
                </span>
                <span style={{ color: nx.muted }}>
                  {d.lastStatus}
                  {d.lastRunAt ? ` · ${new Date(d.lastRunAt).toLocaleString()}` : ""}
                </span>
                <button
                  type="button"
                  disabled={props.submitting}
                  onClick={() => props.onDeleteScheduled(d.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: nx.risk,
                    cursor: props.submitting ? "default" : "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {statusLine ? (
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            fontWeight: 600,
            color: props.errorMessage || localError || saveRecurringError ? nx.risk : nx.accentMuted,
          }}
        >
          {statusLine}
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
        <button
          type="button"
          disabled={props.submitting}
          onClick={props.onClose}
          className="nexora-secondary-cta"
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "6px 12px",
            borderRadius: 8,
            border: `1px solid ${nx.border}`,
            background: nx.consoleBg,
            color: nx.textSoft,
            cursor: props.submitting ? "default" : "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={props.submitting}
          onClick={handleSubmit}
          className="nexora-primary-cta"
          style={{
            fontSize: 11,
            fontWeight: 800,
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${nx.borderStrong}`,
            background: nx.accentInk,
            color: nx.bgShell,
            cursor: props.submitting ? "default" : "pointer",
            opacity: props.submitting ? 0.7 : 1,
          }}
        >
          Run assessment
        </button>
      </div>
    </div>
    </>
  );
}
