"use client";

import React from "react";

import { traceWarRoomFoundationBoundaryOnce } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomBoundaryRuntime.ts";
import { traceWarRoomRuntimeOnce } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomStateRuntime.ts";
import { traceWarRoomScenarioIntakeOnce } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomScenarioIntakeRuntime.ts";
import { traceWarRoomActionPlanOnce } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomActionPlanRuntime.ts";
import { traceWarRoomMonitoringOnce } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomMonitoringRuntime.ts";
import { useSyncWarRoomActionPlan } from "../../../../lib/ui/mrpWorkspace/warRoom/useSyncWarRoomActionPlan.ts";
import { useSyncWarRoomMonitoring } from "../../../../lib/ui/mrpWorkspace/warRoom/useSyncWarRoomMonitoring.ts";
import { hydrateWarRoomWorkspaceStateOnMount } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomWorkspaceStateRuntime.ts";
import { traceWarRoomFoundationOnce } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomWorkspaceRuntime.ts";
import { useWarRoomWorkspaceView } from "../../../../lib/ui/mrpWorkspace/warRoom/useWarRoomWorkspaceState.ts";
import { useSyncWarRoomWorkspaceContext } from "../../../../lib/ui/mrpWorkspace/warRoom/useSyncWarRoomWorkspaceContext.ts";
import {
  traceWarRoomVisualPassOnce,
  warRoomHeaderPurposeStyle,
  warRoomHeaderTitleStyle,
  warRoomInsightGridStyle,
  warRoomWorkspaceShellStyle,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomVisualContract.ts";
import { WarRoomWorkspaceCard } from "./WarRoomWorkspaceCard.tsx";
import { WarRoomWorkspaceContextPanel } from "./WarRoomWorkspaceContextPanel.tsx";
import { ActionPlanPanel } from "./ActionPlanPanel.tsx";
import { WatchMonitorPanel } from "./WatchMonitorPanel.tsx";

export type WarRoomWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export function WarRoomWorkspace(props: WarRoomWorkspaceProps): React.ReactElement {
  const view = useWarRoomWorkspaceView();

  useSyncWarRoomWorkspaceContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
  });

  useSyncWarRoomActionPlan();
  useSyncWarRoomMonitoring();

  React.useEffect(() => {
    hydrateWarRoomWorkspaceStateOnMount(props.mountKey);
    traceWarRoomFoundationOnce(props.mountKey);
    traceWarRoomVisualPassOnce(props.mountKey);
    traceWarRoomFoundationBoundaryOnce(props.mountKey);
    traceWarRoomRuntimeOnce(props.mountKey);
    traceWarRoomScenarioIntakeOnce(props.mountKey);
    traceWarRoomActionPlanOnce(props.mountKey);
    traceWarRoomMonitoringOnce(props.mountKey);
  }, [props.mountKey]);

  return (
    <div
      id="nexora-war-room-workspace"
      data-nx="war-room-workspace"
      data-mrp-workspace-id="war_room"
      data-mrp-workspace-mount-key={props.mountKey}
      data-war-room-phase={view.phase}
      data-war-room-revision={view.revision}
      data-war-room-object-selected={view.workspaceContext.hasSelection ? "true" : "false"}
      data-war-room-visual-pass="true"
      data-war-room-owns-commitment-only="true"
      data-war-room-action-plan="true"
      data-war-room-monitoring="true"
      data-nexora-rule-11-boundary="true"
      data-nexora-rule-13-commitment-ownership="true"
      style={warRoomWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <h2 style={warRoomHeaderTitleStyle()}>War Room Overview</h2>
        <p style={warRoomHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <WarRoomWorkspaceContextPanel
        workspaceContext={view.workspaceContext}
        phase={view.phase}
      />

      <ActionPlanPanel actionPlan={view.actionPlan} phase={view.phase} />

      <WatchMonitorPanel monitoring={view.monitoring} phase={view.phase} />

      <section
        data-nx="war-room-workspace-sections"
        aria-label="War Room commitment surfaces"
        style={warRoomInsightGridStyle()}
      >
        {view.cards.map((card) => (
          <WarRoomWorkspaceCard key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
}

export default WarRoomWorkspace;
