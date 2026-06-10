"use client";

import React, { useCallback, useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import {
  buildRecentWorkflowSessions,
  formatRecentSessionTime,
} from "../../lib/dashboard/workflowLauncher/workflowLauncherRuntime";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveRecentWorkflowSurfaceProps = Readonly<{
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  onReopenSession?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
}>;

export function ExecutiveRecentWorkflowSurface(
  props: ExecutiveRecentWorkflowSurfaceProps
): React.ReactElement {
  const sessions = useMemo(
    () =>
      buildRecentWorkflowSessions({
        activeWorkspaceId: props.activeWorkspaceId,
        selectedObjectId: props.selectedObjectId,
      }),
    [props.activeWorkspaceId, props.selectedObjectId]
  );

  const handleReopen = useCallback(
    (workspaceId: ExecutiveWorkspaceId, returnKind: WorkspaceRecentReturnKind) => {
      props.onReopenSession?.({ workspaceId, returnKind });
    },
    [props.onReopenSession]
  );

  return (
    <section
      data-nx="executive-recent-workflow-surface"
      data-session-count={sessions.length}
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: `${dashboardVisualSpacing.sm}px ${dashboardVisualSpacing.md}px`,
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: dashboardVisualColors.surface,
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Recent Workflows
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Reopen recently used dashboard contexts.
        </div>
      </header>

      {sessions.length === 0 ? (
        <div
          data-nx="recent-workflow-empty-state"
          style={{
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.muted,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          No recent workflow sessions yet. Launch Analyze, Compare, Scenario, or War Room to build history.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
            gap: dashboardVisualSpacing.sm,
          }}
        >
          {sessions.map((session) => (
            <button
              key={session.workspaceId}
              type="button"
              data-nx="recent-workflow-session"
              data-workspace-id={session.workspaceId}
              onClick={() => handleReopen(session.workspaceId, session.returnKind)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
                padding: dashboardVisualSpacing.md,
                borderRadius: 12,
                border: `1px solid ${nx.border}`,
                background: nx.bgElevated,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>{session.sessionLabel}</span>
              <span style={{ color: nx.textSoft, fontSize: 12 }}>{session.workspaceName}</span>
              <span style={{ color: nx.lowMuted, fontSize: 10 }}>
                {formatRecentSessionTime(session.lastVisitedAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveRecentWorkflowSurface;
