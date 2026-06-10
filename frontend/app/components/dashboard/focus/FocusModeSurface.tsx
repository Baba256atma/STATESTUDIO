"use client";

import type React from "react";

import {
  FOCUS_MODE_FUTURE_ACTIONS,
  type FocusModeContextView,
} from "../../../lib/dashboard/focus/focusModeContract";
import { nx, softCardStyle } from "../../ui/nexoraTheme";

export type FocusModeSurfaceProps = {
  context: FocusModeContextView | null;
};

function metricCell(label: string, value: string): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: nx.lowMuted,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: nx.text, lineHeight: 1.2 }}>
        {value}
      </div>
    </div>
  );
}

function disabledActionStyle(): React.CSSProperties {
  return {
    minHeight: 32,
    padding: "0 10px",
    borderRadius: 8,
    border: `1px solid ${nx.borderSoft}`,
    background: "rgba(2,6,23,0.22)",
    color: nx.lowMuted,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.02em",
    cursor: "not-allowed",
    textAlign: "center" as const,
    opacity: 0.72,
  };
}

export function FocusModeSurface(props: FocusModeSurfaceProps): React.ReactElement {
  const context = props.context;

  if (!context) {
    return (
      <div
        data-nx="focus-mode-surface"
        data-nx-focus-state="empty"
        style={{
          flex: 1,
          minHeight: 0,
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: `1px solid ${nx.border}`,
            background: nx.bgElevated,
            color: nx.muted,
            fontSize: 13,
            lineHeight: 1.45,
            textAlign: "center",
          }}
        >
          No active object selected.
        </div>
      </div>
    );
  }

  return (
    <div
      data-nx="focus-mode-surface"
      data-nx-focus-state="active"
      data-nx-focus-object-id={context.objectId}
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <header
        style={{
          flexShrink: 0,
          padding: "14px 14px 12px",
          borderBottom: `1px solid ${nx.borderSoft}`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Focus
        </div>
        <div style={{ color: nx.text, fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
          {context.objectName}
        </div>
      </header>

      <section style={{ flexShrink: 0, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...softCardStyle, padding: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {metricCell("Status", context.status)}
            {metricCell("Impact", context.impact)}
            {metricCell("Confidence", context.confidenceLabel)}
            {metricCell("Object Type", context.objectType)}
            <div style={{ gridColumn: "1 / -1" }}>{metricCell("Last Updated", context.lastUpdated)}</div>
          </div>
        </div>

        <div style={{ ...softCardStyle, padding: 12 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            Object Description
          </div>
          <div
            style={{
              marginTop: 8,
              color: nx.textSoft,
              fontSize: 12,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {context.description}
          </div>
        </div>

        <div style={{ ...softCardStyle, padding: 12, border: `1px solid ${nx.borderSoft}` }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            Available Executive Actions
          </div>
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {FOCUS_MODE_FUTURE_ACTIONS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                disabled
                aria-disabled
                title="Not implemented yet"
                style={disabledActionStyle()}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FocusModeSurface;
