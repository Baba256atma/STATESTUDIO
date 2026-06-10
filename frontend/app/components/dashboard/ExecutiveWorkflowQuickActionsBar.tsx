"use client";

import React, { useCallback, useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { WorkflowLauncherActionView } from "../../lib/dashboard/workflowLauncher/workflowLauncherContract";
import { buildWorkflowLauncherView, resolveReturnToWorkspaceTarget } from "../../lib/dashboard/workflowLauncher/workflowLauncherRuntime";
import type { DashboardHomeSectionLayoutVariant } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTypes";
import { applyDashboardHomeSectionChrome } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { WorkflowQuickActionButton } from "./WorkflowQuickActionButton";

export type ExecutiveWorkflowQuickActionsBarProps = Readonly<{
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  onFocusRecommendations?: () => void;
  onReturnToWorkspace?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
  layoutVariant?: DashboardHomeSectionLayoutVariant;
}>;

export function ExecutiveWorkflowQuickActionsBar(
  props: ExecutiveWorkflowQuickActionsBarProps
): React.ReactElement {
  const launcherView = useMemo(
    () =>
      buildWorkflowLauncherView({
        activeWorkspaceId: props.activeWorkspaceId,
        selectedObjectId: props.selectedObjectId,
      }),
    [props.activeWorkspaceId, props.selectedObjectId]
  );

  const handleActivate = useCallback(
    (action: WorkflowLauncherActionView) => {
      if (!action.enabled) return;

      switch (action.handler) {
        case "workspace_launch":
          if (action.targetWorkspaceId && props.onWorkspaceLaunch) {
            props.onWorkspaceLaunch(action.targetWorkspaceId);
          }
          break;
        case "focus_recommendations":
          props.onFocusRecommendations?.();
          break;
        case "return_workspace": {
          if (!props.onReturnToWorkspace) return;
          const target = resolveReturnToWorkspaceTarget({
            activeWorkspaceId: props.activeWorkspaceId,
            selectedObjectId: props.selectedObjectId,
          });
          if (target) {
            props.onReturnToWorkspace({
              workspaceId: target.workspaceId,
              returnKind: target.returnKind,
            });
          }
          break;
        }
        default:
          break;
      }
    },
    [
      props.activeWorkspaceId,
      props.onFocusRecommendations,
      props.onReturnToWorkspace,
      props.onWorkspaceLaunch,
      props.selectedObjectId,
    ]
  );

  const layoutVariant = props.layoutVariant ?? "standalone";

  return (
    <section
      data-nx="executive-workflow-quick-actions-bar"
      data-section-id="quick_actions"
      data-action-count={launcherView.actions.length}
      style={applyDashboardHomeSectionChrome(layoutVariant, {
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: `${dashboardVisualSpacing.sm}px ${dashboardVisualSpacing.md}px`,
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: dashboardVisualColors.surface,
      })}
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
          Quick Actions
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Strategic command strip — routes into existing dashboard experiences.
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))",
          gap: dashboardVisualSpacing.sm,
        }}
      >
        {launcherView.actions.map((action) => (
          <WorkflowQuickActionButton key={action.id} action={action} onActivate={handleActivate} />
        ))}
      </div>
    </section>
  );
}

export default ExecutiveWorkflowQuickActionsBar;
