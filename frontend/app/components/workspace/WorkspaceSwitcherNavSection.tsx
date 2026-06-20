"use client";

import React, { useCallback, useMemo, useSyncExternalStore } from "react";
import { nx } from "../ui/nexoraTheme";
import { leftNavPrimaryButtonStyle } from "../../lib/ui/leftNavDesignTokens";
import type { Workspace } from "../../lib/workspace/workspaceRegistryContract";
import { openWorkspaceHubModal } from "./WorkspaceModalHost";
import {
  getWorkspaceRegistrySnapshot,
  subscribeWorkspaceRegistry,
} from "../../lib/workspace/workspaceRegistryStore";

function useWorkspaceRegistryView(): {
  activeWorkspaceId: string | null;
  activeWorkspace: Workspace | null;
} {
  const snapshot = useSyncExternalStore(
    subscribeWorkspaceRegistry,
    getWorkspaceRegistrySnapshot,
    getWorkspaceRegistrySnapshot
  );

  return useMemo(
    () => ({
      activeWorkspaceId: snapshot.activeWorkspaceId,
      activeWorkspace: snapshot.activeWorkspaceId ? snapshot.workspaces[snapshot.activeWorkspaceId] ?? null : null,
    }),
    [snapshot]
  );
}

export function WorkspaceSwitcherNavSection(): React.ReactElement | null {
  const { activeWorkspaceId, activeWorkspace } = useWorkspaceRegistryView();

  if (!activeWorkspace) return null;

  return (
    <section
      id="nexora-leftnav-workspaces"
      aria-label="Workspaces"
      style={{
        width: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingTop: 10,
        borderTop: `1px solid ${nx.border}`,
      }}
    >
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        Workspaces
      </div>
      <button
        type="button"
        title={activeWorkspace.workspaceName}
        aria-label={`Current workspace: ${activeWorkspace.workspaceName}`}
        aria-current="page"
        aria-pressed
        data-workspace-id={activeWorkspace.workspaceId}
        data-active-workspace={activeWorkspaceId === activeWorkspace.workspaceId ? "true" : "false"}
        style={leftNavPrimaryButtonStyle({
          active: true,
          navTileActiveBorder: nx.navTileActiveBorder,
          navTileActiveBg: nx.navTileActiveBg,
          navTileInactiveBg: nx.navTileInactiveBg,
          navTileActiveShadow: nx.navTileActiveShadow,
          border: nx.border,
          text: nx.text,
          muted: nx.muted,
        })}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            lineHeight: 1,
            textTransform: "uppercase",
            color: nx.navShortActive,
          }}
        >
          Current Workspace
        </span>
        <span
          style={{
            fontSize: 11,
            lineHeight: 1.15,
            textAlign: "left",
            overflowWrap: "anywhere",
          }}
        >
          {activeWorkspace.workspaceName}
        </span>
      </button>
      <button
        type="button"
        title="Manage Workspaces"
        aria-label="Manage Workspaces"
        onClick={openWorkspaceHubModal}
        style={workspaceLifecycleButtonStyle()}
      >
        Manage
      </button>
    </section>
  );
}

function workspaceLifecycleButtonStyle(disabled = false): React.CSSProperties {
  return {
    minHeight: 34,
    borderRadius: 4,
    border: `1px solid ${nx.border}`,
    background: nx.bgPanelSoft,
    color: disabled ? nx.lowMuted : nx.muted,
    fontSize: 10,
    fontWeight: 800,
    lineHeight: 1.15,
    padding: "7px 6px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.52 : 1,
    textAlign: "left",
  };
}
