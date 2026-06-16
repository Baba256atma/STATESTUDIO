"use client";

import React from "react";

import type { DashboardContext } from "../../lib/ui/mainRightPanelContract.ts";
import type { DashboardMode } from "../../lib/dashboard/dashboardModeRuntimeContract.ts";
import type { SceneJson } from "../../lib/sceneTypes.ts";
import { MrpDynamicWorkspaceLoader } from "./MrpDynamicWorkspaceLoader.tsx";

export type MrpDynamicWorkspaceZoneProps = Readonly<{
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  subWorkspaceMode?: string | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  workspaceSceneJson?: SceneJson | null;
  renderDashboardRuntime: () => React.ReactNode;
}>;

export function MrpDynamicWorkspaceZone(props: MrpDynamicWorkspaceZoneProps): React.ReactElement {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    globalThis.console?.debug?.("[MRP_DYNAMIC_RENDER_ZONE]", {
      action: "render_zone_active",
      dashboardMode: props.dashboardMode,
      dashboardContext: props.dashboardContext,
    });
  }, [props.dashboardContext, props.dashboardMode]);

  return (
    <section
      id="nexora-mrp-dynamic-workspace-zone"
      data-nx="mrp-dynamic-render-zone"
      aria-label="Dynamic workspace area"
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <MrpDynamicWorkspaceLoader
        dashboardMode={props.dashboardMode}
        dashboardContext={props.dashboardContext}
        subWorkspaceMode={props.subWorkspaceMode}
        selectedObjectId={props.selectedObjectId}
        selectedObjectLabel={props.selectedObjectLabel}
        selectedObjectType={props.selectedObjectType}
        selectedObjectStatus={props.selectedObjectStatus}
        routeObjectId={props.routeObjectId}
        routeObjectName={props.routeObjectName}
        workspaceSceneJson={props.workspaceSceneJson}
        renderDashboardRuntime={props.renderDashboardRuntime}
      />
    </section>
  );
}

export default MrpDynamicWorkspaceZone;
