"use client";

import React, { useMemo } from "react";

import type { DashboardMode } from "../../lib/dashboard/dashboardModeRuntimeContract";
import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { buildExecutiveWorkspaceSnapshotView } from "../../lib/dashboard/workspaceSnapshot/executiveWorkspaceSnapshotRuntime";
import type { WorkspaceRecommendationContext } from "../../lib/workspaces/workspaceRecommendationContract";
import type {
  WorkspaceRecentsContextInput,
  WorkspaceRecentReturnKind,
} from "../../lib/workspaces/workspaceRecentsContract";
import type { DashboardHomeSectionLayoutVariant } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTypes";
import { applyDashboardHomeSectionChrome } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { ExecutiveWorkspaceSnapshotCard } from "./ExecutiveWorkspaceSnapshotCard";
import { ExecutiveDailyReadinessLayer } from "./ExecutiveDailyReadinessLayer";

export type ExecutiveWorkspaceSnapshotSectionProps = Readonly<{
  dashboardMode: DashboardMode;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  recommendationContext?: WorkspaceRecommendationContext;
  recentsContext?: WorkspaceRecentsContextInput;
  onFocusRecommendations?: () => void;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  onResumeSession?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
  layoutVariant?: DashboardHomeSectionLayoutVariant;
}>;

export function ExecutiveWorkspaceSnapshotSection(
  props: ExecutiveWorkspaceSnapshotSectionProps
): React.ReactElement {
  const snapshotView = useMemo(
    () =>
      buildExecutiveWorkspaceSnapshotView({
        dashboardMode: props.dashboardMode,
        activeWorkspaceId: props.activeWorkspaceId,
        selectedObjectId: props.selectedObjectId,
        selectedObjectLabel: props.selectedObjectLabel,
        selectedObjectType: props.selectedObjectType,
        selectedObjectStatus: props.selectedObjectStatus,
        recommendationContext: props.recommendationContext,
        recentsContext: props.recentsContext,
      }),
    [
      props.activeWorkspaceId,
      props.dashboardMode,
      props.recentsContext,
      props.recommendationContext,
      props.selectedObjectId,
      props.selectedObjectLabel,
      props.selectedObjectStatus,
      props.selectedObjectType,
    ]
  );

  const layoutVariant = props.layoutVariant ?? "standalone";

  return (
    <section
      data-nx="executive-workspace-snapshot-section"
      data-section-id="workspace_snapshot"
      data-runtime-available={snapshotView.runtimeAvailable ? "true" : "false"}
      data-readiness-state={snapshotView.readiness.state}
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
          Workspace Snapshot
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          Current operational context — readiness overview only.
        </div>
      </header>

      {!snapshotView.runtimeAvailable ? (
        <div
          data-nx="workspace-snapshot-unavailable"
          style={{
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.textSoft,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          Workspace status unavailable.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
            gap: dashboardVisualSpacing.sm,
          }}
        >
          {snapshotView.cards.map((card) => (
            <ExecutiveWorkspaceSnapshotCard key={card.id} card={card} />
          ))}
        </div>
      )}

      <ExecutiveDailyReadinessLayer
        readiness={snapshotView.readiness}
        onFocusRecommendations={props.onFocusRecommendations}
        onWorkspaceLaunch={props.onWorkspaceLaunch}
        onResumeSession={props.onResumeSession}
      />
    </section>
  );
}

export default ExecutiveWorkspaceSnapshotSection;
