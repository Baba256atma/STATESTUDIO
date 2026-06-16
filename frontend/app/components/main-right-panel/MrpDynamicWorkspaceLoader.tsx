"use client";

import React from "react";

import type { DashboardContext } from "../../lib/ui/mainRightPanelContract.ts";
import type { DashboardMode } from "../../lib/dashboard/dashboardModeRuntimeContract.ts";
import type { SceneJson } from "../../lib/sceneTypes.ts";
import {
  MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG,
  type MrpWorkspaceId,
  type MrpWorkspaceMountPlan,
} from "../../lib/ui/mrpWorkspace/mrpWorkspaceLoaderContract.ts";
import { resolveMrpWorkspaceMountPlan } from "../../lib/ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { useMrpWorkspaceMountLifecycle } from "../../lib/ui/mrpWorkspace/useMrpWorkspaceMountLifecycle.ts";
import { MrpWorkspaceLoaderShell } from "./workspace/MrpWorkspaceLoaderShell.tsx";
import { ExecutiveSummaryWorkspace } from "./workspace/executive-summary/ExecutiveSummaryWorkspace.tsx";
import { OperationalWorkspace } from "./workspace/operational/OperationalWorkspace.tsx";
import { RiskWorkspace } from "./workspace/risk/RiskWorkspace.tsx";
import { TimelineWorkspace } from "./workspace/timeline/TimelineWorkspace.tsx";
import { ScenarioWorkspace } from "./workspace/scenario/ScenarioWorkspace.tsx";
import { WarRoomWorkspace } from "./workspace/warRoom/WarRoomWorkspace.tsx";
import { AdvisoryWorkspace } from "./workspace/advisory/AdvisoryWorkspace.tsx";
import { GovernanceWorkspace } from "./workspace/governance/GovernanceWorkspace.tsx";

export type MrpDynamicWorkspaceLoaderProps = Readonly<{
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

type CertifiedWorkspaceCommonProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  dashboardContext?: DashboardContext;
}>;

const CERTIFIED_MRP_WORKSPACE_IDS: ReadonlySet<MrpWorkspaceId> = new Set([
  "executive_summary",
  "operational",
  "risk",
  "timeline",
  "scenario",
  "war_room",
  "advisory",
  "governance",
]);

let certifiedRendererTraceLogged = false;

function traceCertifiedWorkspaceRendererOnce(plan: MrpWorkspaceMountPlan): void {
  if (process.env.NODE_ENV === "production" || certifiedRendererTraceLogged) return;
  certifiedRendererTraceLogged = true;
  globalThis.console?.debug?.(MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG, {
    action: "certified_workspace_renderer_connected",
    workspaceId: plan.workspaceId,
    mountTarget: plan.mountTarget,
  });
}

function buildCertifiedWorkspaceCommonProps(
  plan: MrpWorkspaceMountPlan,
  props: MrpDynamicWorkspaceLoaderProps
): CertifiedWorkspaceCommonProps {
  return Object.freeze({
    mountKey: plan.mountKey,
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
    dashboardContext: props.dashboardContext,
  });
}

function renderCertifiedWorkspace(
  plan: MrpWorkspaceMountPlan,
  props: MrpDynamicWorkspaceLoaderProps
): React.ReactNode {
  if (!CERTIFIED_MRP_WORKSPACE_IDS.has(plan.workspaceId)) {
    return (
      <MrpWorkspaceLoaderShell workspaceId={plan.workspaceId} mountKey={plan.mountKey} />
    );
  }

  traceCertifiedWorkspaceRendererOnce(plan);

  const commonProps = buildCertifiedWorkspaceCommonProps(plan, props);

  switch (plan.workspaceId) {
    case "executive_summary":
      return <ExecutiveSummaryWorkspace {...commonProps} />;
    case "operational":
      return <OperationalWorkspace {...commonProps} />;
    case "risk":
      return (
        <RiskWorkspace
          {...commonProps}
          workspaceSceneJson={props.workspaceSceneJson}
        />
      );
    case "timeline":
      return (
        <TimelineWorkspace
          {...commonProps}
          workspaceSceneJson={props.workspaceSceneJson}
        />
      );
    case "scenario":
      return <ScenarioWorkspace {...commonProps} />;
    case "war_room":
      return <WarRoomWorkspace {...commonProps} />;
    case "advisory":
      return <AdvisoryWorkspace {...commonProps} />;
    case "governance":
      return <GovernanceWorkspace {...commonProps} />;
    default:
      return (
        <MrpWorkspaceLoaderShell workspaceId={plan.workspaceId} mountKey={plan.mountKey} />
      );
  }
}

function MrpDynamicWorkspaceLoaderComponent(
  props: MrpDynamicWorkspaceLoaderProps
): React.ReactElement {
  const plan = React.useMemo(
    (): MrpWorkspaceMountPlan =>
      resolveMrpWorkspaceMountPlan({
        dashboardMode: props.dashboardMode,
        dashboardContext: props.dashboardContext,
        subWorkspaceMode: props.subWorkspaceMode,
      }),
    [props.dashboardContext, props.dashboardMode, props.subWorkspaceMode]
  );

  useMrpWorkspaceMountLifecycle(plan);

  const content =
    plan.mountTarget === "dashboard_runtime"
      ? props.renderDashboardRuntime()
      : renderCertifiedWorkspace(plan, props);

  return (
    <div
      key={plan.mountKey}
      data-nx="mrp-dynamic-workspace-loader"
      data-mrp-workspace-id={plan.workspaceId}
      data-mrp-workspace-mount-key={plan.mountKey}
      data-mrp-workspace-mount-target={plan.mountTarget}
      data-mrp-certified-workspace-renderer={
        CERTIFIED_MRP_WORKSPACE_IDS.has(plan.workspaceId) &&
        plan.mountTarget !== "dashboard_runtime"
          ? "true"
          : "false"
      }
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {content}
    </div>
  );
}

export const MrpDynamicWorkspaceLoader = React.memo(MrpDynamicWorkspaceLoaderComponent);
MrpDynamicWorkspaceLoader.displayName = "MrpDynamicWorkspaceLoader";

export default MrpDynamicWorkspaceLoader;
