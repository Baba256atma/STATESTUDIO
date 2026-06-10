"use client";

import React, { useCallback, useEffect, useRef } from "react";

import type { DashboardMode } from "../../lib/dashboard/dashboardModeRuntimeContract";
import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { DASHBOARD_HOME_CANONICAL_SECTION_ORDER } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutContract";
import type { WorkspaceRecommendationContext } from "../../lib/workspaces/workspaceRecommendationContract";
import type {
  WorkspaceRecentsContextInput,
  WorkspaceRecentReturnKind,
} from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardHomeLayoutSpacing,
} from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import {
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { DashboardHomeLayoutZone } from "./DashboardHomeLayoutZone";
import { ExecutiveSummaryCardsRow } from "./ExecutiveSummaryCardsRow";
import { ExecutiveWorkspaceSnapshotSection } from "./ExecutiveWorkspaceSnapshotSection";
import { ExecutiveWorkflowQuickActionsBar } from "./ExecutiveWorkflowQuickActionsBar";
import { ExecutiveRecommendationsSurface } from "./ExecutiveRecommendationsSurface";
import { ExecutiveRecentActivityTimeline } from "./ExecutiveRecentActivityTimeline";
import { ExecutiveFavoritesLayer } from "./ExecutiveFavoritesLayer";
import { ExecutiveWorkspaceRecoveryLayer } from "./ExecutiveWorkspaceRecoveryLayer";
import { ExecutiveWorkspaceOverview } from "./ExecutiveWorkspaceOverview";
import { traceMrp10Runtime, logMrp10RuntimeRenderChain } from "../../lib/dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace";

export type ExecutiveDashboardHomeSurfaceProps = Readonly<{
  dashboardMode: DashboardMode;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  recommendationContext?: WorkspaceRecommendationContext;
  recentsContext?: WorkspaceRecentsContextInput;
  onRecentReturn?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
}>;

export function ExecutiveDashboardHomeSurface(props: ExecutiveDashboardHomeSurfaceProps): React.ReactElement {
  const selectedObjectId = props.selectedObjectId?.trim() || null;
  const hasSelectedObject = Boolean(selectedObjectId);
  const recommendationsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    traceMrp10Runtime("ExecutiveDashboardHomeSurface mounted", {
      activeTab: "dashboard",
      dashboardMode: props.dashboardMode,
      selectedObjectId: props.selectedObjectId ?? null,
      rendering: "ExecutiveDashboardHomeSurface",
    });
    logMrp10RuntimeRenderChain({
      activeTab: "dashboard",
      dashboardMode: props.dashboardMode,
      selectedObjectId: props.selectedObjectId ?? null,
      rendering: "ExecutiveDashboardHomeSurface",
    });
  }, [props.dashboardMode, props.selectedObjectId]);

  const handleFocusRecommendations = useCallback(() => {
    recommendationsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleReturnToWorkspace = useCallback(
    (input: { workspaceId: ExecutiveWorkspaceId; returnKind: WorkspaceRecentReturnKind }) => {
      props.onRecentReturn?.(input);
    },
    [props.onRecentReturn]
  );

  const sharedContext = {
    activeWorkspaceId: props.activeWorkspaceId,
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    recommendationContext: props.recommendationContext,
    recentsContext: props.recentsContext,
  };

  return (
    <div
      data-nx="executive-dashboard-home-surface"
      data-dashboard-mode={props.dashboardMode}
      data-has-selected-object={hasSelectedObject ? "true" : "false"}
      data-layout-section-order={DASHBOARD_HOME_CANONICAL_SECTION_ORDER.join(",")}
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <DashboardHomeLayoutZone zoneId="executive_status" visualWeight="high">
        <ExecutiveSummaryCardsRow
          dashboardMode={props.dashboardMode}
          {...sharedContext}
          layoutVariant="zone-child"
        />
        <ExecutiveWorkspaceSnapshotSection
          dashboardMode={props.dashboardMode}
          {...sharedContext}
          onFocusRecommendations={handleFocusRecommendations}
          onWorkspaceLaunch={props.onWorkspaceLaunch}
          onResumeSession={handleReturnToWorkspace}
          layoutVariant="zone-child"
        />
      </DashboardHomeLayoutZone>

      <DashboardHomeLayoutZone zoneId="executive_action" visualWeight="medium">
        <ExecutiveWorkflowQuickActionsBar
          activeWorkspaceId={props.activeWorkspaceId}
          selectedObjectId={props.selectedObjectId}
          onWorkspaceLaunch={props.onWorkspaceLaunch}
          onFocusRecommendations={handleFocusRecommendations}
          onReturnToWorkspace={handleReturnToWorkspace}
          layoutVariant="zone-child"
        />
        {!hasSelectedObject ? (
          <div
            data-nx="dashboard-home-empty-state"
            style={{
              flexShrink: 0,
              padding: dashboardVisualSpacing.md,
              borderRadius: 12,
              border: `1px dashed ${nx.borderSoft}`,
              background: nx.bgElevated,
              color: nx.textSoft,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            No active object selected. Select a scene object to unlock object-scoped workspace launches.
          </div>
        ) : null}
      </DashboardHomeLayoutZone>

      <DashboardHomeLayoutZone zoneId="executive_guidance" visualWeight="medium">
        <ExecutiveRecommendationsSurface
          context={{
            ...props.recommendationContext,
            activeWorkspaceId: props.activeWorkspaceId,
            selectedObjectId: props.selectedObjectId,
            selectedObjectLabel: props.selectedObjectLabel,
          }}
          onWorkspaceLaunch={props.onWorkspaceLaunch}
          sectionRef={recommendationsSectionRef}
          layoutVariant="zone-child"
        />
      </DashboardHomeLayoutZone>

      <DashboardHomeLayoutZone zoneId="executive_continuity" visualWeight="low">
        <ExecutiveRecentActivityTimeline
          context={{
            selectedObjectId: props.selectedObjectId,
            selectedObjectLabel: props.selectedObjectLabel,
            activeWorkspaceId: props.activeWorkspaceId,
            ...props.recentsContext,
          }}
          onActivityReopen={handleReturnToWorkspace}
          layoutVariant="zone-child"
        />
        <ExecutiveFavoritesLayer
          activeWorkspaceId={props.activeWorkspaceId}
          selectedObjectId={props.selectedObjectId}
          onFavoriteOpen={props.onWorkspaceLaunch}
          layoutVariant="zone-child"
        />
        <ExecutiveWorkspaceRecoveryLayer
          context={{
            selectedObjectId: props.selectedObjectId,
            selectedObjectLabel: props.selectedObjectLabel,
            activeWorkspaceId: props.activeWorkspaceId,
            ...props.recentsContext,
          }}
          onRecoveryResume={handleReturnToWorkspace}
          layoutVariant="zone-child"
        />
      </DashboardHomeLayoutZone>

      <section
        data-nx="dashboard-home-workspace-tools"
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: dashboardHomeLayoutSpacing.sectionGap,
          padding: `${dashboardHomeLayoutSpacing.zonePaddingY}px ${dashboardHomeLayoutSpacing.zonePaddingX}px`,
          background: nx.bgControl,
          borderTop: `1px solid ${nx.borderSoft}`,
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
            Workspace Tools
          </div>
          <div style={{ color: nx.textSoft, fontSize: 11 }}>
            Full workspace catalog — supplementary access below executive zones.
          </div>
        </header>
        <ExecutiveWorkspaceOverview
          activeWorkspaceId={props.activeWorkspaceId}
          selectedObjectId={props.selectedObjectId}
          selectedObjectLabel={props.selectedObjectLabel}
          onWorkspaceLaunch={props.onWorkspaceLaunch}
          recommendationContext={props.recommendationContext}
          recentsContext={props.recentsContext}
          onRecentReturn={props.onRecentReturn}
          includeRecommendations={false}
          includeFavorites={false}
          includeRecents={false}
        />
      </section>
    </div>
  );
}

export default ExecutiveDashboardHomeSurface;
