"use client";

import type React from "react";

import type { TypeCAlert } from "../../lib/typec/typeCAlerts.ts";

export type TypeCAlertPanelProps = {
  alerts: TypeCAlert[];
  onAcknowledge: (alertId: string) => void;
  onClearAll: () => void;
};

const panelStyle = {
  position: "fixed",
  left: 16,
  top: 342,
  zIndex: 48,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "min(42vh, 360px)",
  overflowY: "auto",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(248, 113, 113, 0.22)",
  background: "linear-gradient(180deg, rgba(69, 10, 10, 0.9), rgba(2, 6, 23, 0.9))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.34)",
  color: "rgba(254, 242, 242, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const labelStyle = {
  color: "rgba(252, 165, 165, 0.78)",
  fontSize: 10,
  fontWeight: 850,
  textTransform: "uppercase",
} as const;

const titleStyle = {
  margin: "3px 0 0",
  fontSize: 14,
  lineHeight: 1.25,
  fontWeight: 800,
  letterSpacing: 0,
} as const;

const textStyle = {
  margin: "4px 0 0",
  color: "rgba(254, 226, 226, 0.84)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid rgba(254, 202, 202, 0.24)",
  background: "rgba(15, 23, 42, 0.54)",
  color: "rgba(254, 242, 242, 0.92)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 750,
  padding: "6px 9px",
} as const;

function levelColor(level: TypeCAlert["level"]): string {
  if (level === "critical") return "rgba(248, 113, 113, 0.95)";
  if (level === "warning") return "rgba(251, 191, 36, 0.95)";
  return "rgba(125, 211, 252, 0.9)";
}

function formatTime(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Now";
  }
}

export function TypeCAlertPanel({
  alerts,
  onAcknowledge,
  onClearAll,
}: TypeCAlertPanelProps): React.ReactElement | null {
  if (!alerts.length) return null;

  return (
    <aside data-nx="typec-alert-panel" aria-label="Type-C execution alerts" style={panelStyle}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={labelStyle}>Execution Alerts</div>
          <h2 style={titleStyle}>Feedback Loop</h2>
        </div>
        <button type="button" onClick={onClearAll} style={buttonStyle}>
          Clear All
        </button>
      </div>

      <div style={{ display: "grid", gap: 9, marginTop: 10 }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              borderRadius: 10,
              border: "1px solid rgba(254, 202, 202, 0.14)",
              background: "rgba(15, 23, 42, 0.34)",
              padding: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <strong style={{ color: levelColor(alert.level), fontSize: 10, textTransform: "uppercase" }}>
                {alert.level}
              </strong>
              <span style={{ color: "rgba(254, 226, 226, 0.56)", fontSize: 10 }}>
                {formatTime(alert.timestamp)}
              </span>
            </div>
            <div style={textStyle}>{alert.message}</div>
            {alert.relatedObjectIds.length ? (
              <div style={{ ...textStyle, color: "rgba(254, 202, 202, 0.64)", fontSize: 11 }}>
                Related: {alert.relatedObjectIds.join(", ")}
              </div>
            ) : null}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button type="button" onClick={() => onAcknowledge(alert.id)} style={buttonStyle}>
                Acknowledge
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default TypeCAlertPanel;
