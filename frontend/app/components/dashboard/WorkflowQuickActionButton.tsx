"use client";

import React, { useCallback } from "react";

import type { WorkflowLauncherActionView } from "../../lib/dashboard/workflowLauncher/workflowLauncherContract";
import {
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type WorkflowQuickActionButtonProps = Readonly<{
  action: WorkflowLauncherActionView;
  onActivate?: (action: WorkflowLauncherActionView) => void;
}>;

export function WorkflowQuickActionButton(props: WorkflowQuickActionButtonProps): React.ReactElement {
  const { action, onActivate } = props;
  const enabled = action.enabled;

  const handleClick = useCallback(() => {
    if (!enabled || !onActivate) return;
    onActivate(action);
  }, [action, enabled, onActivate]);

  return (
    <button
      type="button"
      data-nx="workflow-quick-action"
      data-workflow-action-id={action.id}
      disabled={!enabled}
      onClick={handleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${enabled ? nx.border : nx.borderSoft}`,
        background: enabled ? nx.bgElevated : nx.bgControl,
        color: enabled ? nx.text : nx.muted,
        cursor: enabled ? "pointer" : "not-allowed",
        minWidth: 0,
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
        <span
          aria-hidden
          style={{
            fontSize: 16,
            lineHeight: 1,
            color: enabled ? nx.accent : nx.lowMuted,
          }}
        >
          {action.icon}
        </span>
        <span
          style={{
            ...dashboardVisualTypography.cardTitle,
            fontSize: 13,
            fontWeight: 700,
            color: enabled ? nx.text : nx.muted,
          }}
        >
          {action.title}
        </span>
      </div>
      <span style={{ fontSize: 11, lineHeight: 1.4, color: enabled ? nx.textSoft : nx.lowMuted }}>
        {action.description}
      </span>
      {!enabled && action.disabledReason ? (
        <span style={{ fontSize: 10, color: nx.lowMuted, fontWeight: 600 }}>{action.disabledReason}</span>
      ) : null}
    </button>
  );
}

export default WorkflowQuickActionButton;
