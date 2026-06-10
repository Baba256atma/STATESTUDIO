"use client";

import React, { useState } from "react";

import {
  emitObjectPanelActionRequest,
  OBJECT_PANEL_DASHBOARD_ACTIONS,
  objectPanelDashboardActionLabel,
  type ObjectPanelDashboardAction,
} from "../../lib/object-panel/objectPanelActionRouterContract";
import {
  emitExecutiveObjectPanelAction,
  EXECUTIVE_ADVANCED_ACTIONS,
  type ExecutiveActionPanelModel,
} from "../../lib/object-panel/executiveActionPanelContract";
import { nx, softCardStyle } from "../ui/nexoraTheme";

type Props = {
  model: ExecutiveActionPanelModel;
  focusModeActive?: boolean;
};

function riskBadgeStyle(level: string): React.CSSProperties {
  const normalized = String(level ?? "").trim().toLowerCase();
  const base: React.CSSProperties = {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 750,
    padding: "2px 8px",
    borderRadius: 999,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  };
  if (normalized.includes("critical") || normalized.includes("severe")) {
    return { ...base, background: "rgba(248,113,113,0.18)", color: "#fecaca", border: "1px solid rgba(248,113,113,0.35)" };
  }
  if (normalized.includes("high")) {
    return { ...base, background: "rgba(251,146,60,0.16)", color: "#fed7aa", border: "1px solid rgba(251,146,60,0.32)" };
  }
  if (normalized.includes("medium") || normalized.includes("moderate")) {
    return { ...base, background: "rgba(250,204,21,0.14)", color: "#fef08a", border: "1px solid rgba(250,204,21,0.28)" };
  }
  if (normalized.includes("low")) {
    return { ...base, background: "rgba(74,222,128,0.14)", color: "#bbf7d0", border: "1px solid rgba(74,222,128,0.28)" };
  }
  return { ...base, background: "rgba(148,163,184,0.12)", color: nx.muted, border: "1px solid rgba(148,163,184,0.2)" };
}

function statusBadgeStyle(status: string): React.CSSProperties {
  const normalized = String(status ?? "").trim().toLowerCase();
  const base: React.CSSProperties = {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 999,
    letterSpacing: "0.03em",
    textTransform: "capitalize" as const,
    border: `1px solid ${nx.borderSoft}`,
    color: nx.textSoft,
    background: "rgba(2,6,23,0.28)",
  };
  if (normalized.includes("active") || normalized.includes("healthy") || normalized.includes("stable")) {
    return { ...base, color: "#bbf7d0", border: "1px solid rgba(74,222,128,0.28)", background: "rgba(74,222,128,0.1)" };
  }
  if (normalized.includes("warn") || normalized.includes("monitor")) {
    return { ...base, color: "#fef08a", border: "1px solid rgba(250,204,21,0.28)", background: "rgba(250,204,21,0.08)" };
  }
  return base;
}

function actionButtonStyle(primary = false, active = false): React.CSSProperties {
  return {
    minHeight: 32,
    padding: "0 10px",
    borderRadius: 8,
    border: primary || active ? "1px solid rgba(56,189,248,0.38)" : `1px solid ${nx.borderSoft}`,
    background: primary || active ? "rgba(56,189,248,0.16)" : "rgba(2,6,23,0.32)",
    color: primary || active ? nx.text : nx.textSoft,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.02em",
    cursor: "pointer",
    textAlign: "center" as const,
  };
}

function ContextMetric(props: { label: string; value: string | number }): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: nx.lowMuted }}>
        {props.label}
      </div>
      <div style={{ marginTop: 3, fontSize: 13, fontWeight: 800, color: nx.text, lineHeight: 1.1 }}>{props.value}</div>
    </div>
  );
}

export function ExecutiveActionPanel({ model, focusModeActive = false }: Props): React.ReactElement {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const objectId = model.objectId.trim();

  return (
    <div
      data-nx="executive-action-panel"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <section style={{ ...softCardStyle, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Object Panel
        </div>
        <div style={{ marginTop: 8, fontSize: 15, fontWeight: 800, color: nx.text, lineHeight: 1.2 }}>
          {model.objectName}
        </div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
          <div>
            <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Type
            </div>
            <div style={{ marginTop: 3, color: nx.textSoft, fontWeight: 650 }}>{model.objectType}</div>
          </div>
          <div>
            <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Status
            </div>
            <div style={{ marginTop: 4 }}>
              <span style={statusBadgeStyle(model.status)}>{model.status}</span>
            </div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Risk
            </div>
            <div style={{ marginTop: 4 }}>
              <span style={riskBadgeStyle(model.riskLevel)}>{model.riskLevel}</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...softCardStyle, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Operational Context
        </div>
        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          <ContextMetric label="Connections" value={model.connections} />
          <ContextMetric label="Dependencies" value={model.dependencies} />
          <ContextMetric label="Scenarios" value={model.scenarios} />
          <ContextMetric label="Updated" value={model.lastUpdated ?? "Runtime"} />
        </div>
      </section>

      <section style={{ ...softCardStyle, padding: 12, border: "1px solid rgba(56,189,248,0.18)" }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Actions
        </div>
        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {OBJECT_PANEL_DASHBOARD_ACTIONS.map((entry) => {
            const isFocus = entry === "focus";
            const active = isFocus && focusModeActive;
            return (
              <button
                key={entry}
                type="button"
                aria-pressed={active}
                style={actionButtonStyle(isFocus, active)}
                onClick={() =>
                  emitObjectPanelActionRequest({
                    action: entry as ObjectPanelDashboardAction,
                    objectId,
                    objectName: model.objectName,
                  })
                }
              >
                {objectPanelDashboardActionLabel(entry)}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ ...softCardStyle, padding: 10 }}>
        <button
          type="button"
          aria-expanded={advancedOpen}
          onClick={() => setAdvancedOpen((value) => !value)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            border: "none",
            background: "transparent",
            color: nx.muted,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span>Advanced Actions</span>
          <span aria-hidden>{advancedOpen ? "▾" : "▸"}</span>
        </button>
        {advancedOpen ? (
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {EXECUTIVE_ADVANCED_ACTIONS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                style={actionButtonStyle(false)}
                onClick={() => emitExecutiveObjectPanelAction(entry.id, objectId)}
              >
                {entry.label}
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default ExecutiveActionPanel;
