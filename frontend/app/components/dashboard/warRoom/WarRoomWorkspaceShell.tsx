"use client";

import type React from "react";

import {
  WAR_ROOM_SITUATION_FUTURE_MESSAGE,
  type WarRoomWorkspaceContextView,
} from "../../../lib/dashboard/warRoom/warRoomModeContract";
import { nx, softCardStyle } from "../../ui/nexoraTheme";

export type WarRoomWorkspaceShellProps = {
  context: WarRoomWorkspaceContextView | null;
};

function headerMetric(label: string, value: string): React.ReactElement {
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

function moduleRow(module: WarRoomWorkspaceContextView["modules"][number]): React.ReactElement {
  return (
    <div
      key={module.id}
      data-nx-war-room-module={module.id}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${nx.borderSoft}`,
        background: "rgba(2,6,23,0.24)",
      }}
    >
      <span style={{ color: nx.textSoft, fontSize: 12, fontWeight: 650 }}>{module.label}</span>
      <span
        style={{
          flexShrink: 0,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: nx.lowMuted,
        }}
      >
        coming soon
      </span>
    </div>
  );
}

export function WarRoomWorkspaceShell(props: WarRoomWorkspaceShellProps): React.ReactElement {
  const context = props.context;

  if (!context) {
    return (
      <div
        data-nx="war-room-workspace-shell"
        data-nx-war-room-state="empty"
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
      data-nx="war-room-workspace-shell"
      data-nx-war-room-state="active"
      data-nx-war-room-object-id={context.objectId}
      data-nx-war-room-status={context.warRoomStatus}
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
          War Room
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
            {headerMetric("Object", context.objectName)}
            {headerMetric("Status", context.warRoomStatusLabel)}
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
              marginBottom: 8,
            }}
          >
            Executive Situation Summary
          </div>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 650, lineHeight: 1.45 }}>
            {context.situationSummaryMessage}
          </div>
          <div style={{ marginTop: 8, color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            {WAR_ROOM_SITUATION_FUTURE_MESSAGE}
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
              marginBottom: 10,
            }}
          >
            War Room Modules
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {context.modules.map((entry) => moduleRow(entry))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WarRoomWorkspaceShell;
