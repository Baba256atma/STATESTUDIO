"use client";

import React from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { DashboardWorkspaceLauncher } from "./DashboardWorkspaceLauncher";
import { ExecutiveWorkspaceRecommendations } from "./ExecutiveWorkspaceRecommendations";
import { ExecutiveFavoritesSurface } from "./ExecutiveFavoritesSurface";
import { ExecutiveWorkspaceRecentsSurface } from "./ExecutiveWorkspaceRecentsSurface";
import type { WorkspaceRecommendationContext } from "../../lib/workspaces/workspaceRecommendationContract";
import type {
  WorkspaceRecentsContextInput,
  WorkspaceRecentReturnKind,
} from "../../lib/workspaces/workspaceRecentsContract";

export type ExecutiveWorkspaceOverviewProps = Readonly<{
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  recommendationContext?: WorkspaceRecommendationContext;
  recentsContext?: WorkspaceRecentsContextInput;
  onRecentReturn?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
  includeRecommendations?: boolean;
  includeFavorites?: boolean;
  includeRecents?: boolean;
}>;

/** MRP:9 navigation surfaces — reused by Dashboard Home and workspace modes. */
export function ExecutiveWorkspaceOverview(props: ExecutiveWorkspaceOverviewProps): React.ReactElement {
  return (
    <>
      <DashboardWorkspaceLauncher
        activeWorkspaceId={props.activeWorkspaceId ?? null}
        selectedObjectId={props.selectedObjectId ?? null}
        selectedObjectLabel={props.selectedObjectLabel ?? null}
        onLaunchRequest={props.onWorkspaceLaunch}
      />

      {props.includeRecommendations !== false ? (
        <ExecutiveWorkspaceRecommendations
          context={props.recommendationContext}
          onQuickActionLaunch={props.onWorkspaceLaunch}
        />
      ) : null}

      {props.includeFavorites !== false ? (
        <ExecutiveFavoritesSurface
          activeWorkspaceId={props.activeWorkspaceId ?? null}
          selectedObjectId={props.selectedObjectId ?? null}
          onFavoriteLaunch={props.onWorkspaceLaunch}
        />
      ) : null}

      {props.includeRecents !== false ? (
        <ExecutiveWorkspaceRecentsSurface
          context={props.recentsContext}
          onRecentReturn={props.onRecentReturn}
        />
      ) : null}
    </>
  );
}

export default ExecutiveWorkspaceOverview;
