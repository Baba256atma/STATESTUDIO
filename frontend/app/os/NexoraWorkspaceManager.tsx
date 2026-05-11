"use client";

import React from "react";

import type { NexoraOSStateSnapshot, NexoraWorkspace } from "./NexoraOSContracts.ts";

export type NexoraWorkspaceManagerProps = {
  state: NexoraOSStateSnapshot;
  onSwitchWorkspace?: (workspaceId: string) => void;
};

const managerStyle = {
  position: "fixed",
  left: 12,
  top: 12,
  zIndex: 30,
  maxWidth: 310,
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(2, 6, 23, 0.64)",
  color: "rgba(226, 232, 240, 0.88)",
  backdropFilter: "blur(12px)",
  pointerEvents: "auto",
} as const;

const labelStyle = {
  fontSize: 10,
  fontWeight: 850,
  color: "rgba(125, 211, 252, 0.82)",
  textTransform: "uppercase",
} as const;

function activeWorkspace(state: NexoraOSStateSnapshot): NexoraWorkspace | null {
  return state.workspaces.find((workspace) => workspace.id === state.activeWorkspaceId) ?? null;
}

export function NexoraWorkspaceManager({
  state,
  onSwitchWorkspace,
}: NexoraWorkspaceManagerProps): React.ReactElement | null {
  if (process.env.NODE_ENV === "production") return null;
  const active = activeWorkspace(state);

  return (
    <aside data-nx="nexora-os-workspace-manager" style={managerStyle} aria-label="Nexora OS workspace manager">
      <div style={labelStyle}>Nexora OS</div>
      <div style={{ marginTop: 3, fontSize: 12, fontWeight: 800 }}>
        {active?.title ?? "No active workspace"}
      </div>
      <div style={{ marginTop: 2, fontSize: 11, color: "rgba(203, 213, 225, 0.74)" }}>
        module: {state.activeModule} · audit: {state.auditEvents.length}
      </div>
      {state.workspaces.length > 1 ? (
        <select
          value={state.activeWorkspaceId ?? ""}
          onChange={(event) => onSwitchWorkspace?.(event.target.value)}
          style={{
            marginTop: 6,
            width: "100%",
            borderRadius: 8,
            border: "1px solid rgba(148, 163, 184, 0.22)",
            background: "rgba(15, 23, 42, 0.72)",
            color: "rgba(226, 232, 240, 0.92)",
            fontSize: 11,
            padding: "5px 6px",
          }}
        >
          {state.workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.title}
            </option>
          ))}
        </select>
      ) : null}
    </aside>
  );
}

export default NexoraWorkspaceManager;
