"use client";

import React from "react";

import {
  hydrateOperationalWorkspaceStateOnMount,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalWorkspaceStateRuntime.ts";
import {
  traceOperationalFoundationOnce,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalWorkspaceRuntime.ts";
import { useOperationalWorkspaceView } from "../../../../lib/ui/mrpWorkspace/operational/useOperationalWorkspaceState.ts";
import { useSyncOperationalObjectContext } from "../../../../lib/ui/mrpWorkspace/operational/useSyncOperationalObjectContext.ts";
import { useSyncOperationalSceneAwareness } from "../../../../lib/ui/mrpWorkspace/operational/useSyncOperationalSceneAwareness.ts";
import {
  traceOperationalSceneAwarenessOnce,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalSceneAwarenessRuntime.ts";
import type { DashboardContext } from "../../../../lib/ui/mainRightPanelContract.ts";
import {
  operationalHeaderPurposeStyle,
  operationalHeaderTitleStyle,
  operationalInsightGridStyle,
  operationalVisualSpacing,
  operationalWorkspaceShellStyle,
  traceOperationalVisualPassOnce,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";
import { WorkspaceDataSourcePanel } from "./WorkspaceDataSourcePanel.tsx";
import { WorkspaceObjectApprovalPanel } from "./WorkspaceObjectApprovalPanel.tsx";
import { WorkspaceRelationshipApprovalPanel } from "./WorkspaceRelationshipApprovalPanel.tsx";
import { OperationalObjectContextPanel } from "./OperationalObjectContextPanel.tsx";
import { OperationalWorkspaceCard } from "./OperationalWorkspaceCard.tsx";

export type OperationalWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  dashboardContext?: DashboardContext;
}>;

export function OperationalWorkspace(props: OperationalWorkspaceProps): React.ReactElement {
  const view = useOperationalWorkspaceView();
  const [dataSourceRegistryRevision, setDataSourceRegistryRevision] = React.useState(0);
  const handleDataSourceRegistryChanged = React.useCallback(() => {
    setDataSourceRegistryRevision((revision) => revision + 1);
  }, []);

  useSyncOperationalObjectContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
  });

  useSyncOperationalSceneAwareness(view.objectContext);

  React.useEffect(() => {
    hydrateOperationalWorkspaceStateOnMount(props.mountKey);
    traceOperationalFoundationOnce(props.mountKey);
    traceOperationalVisualPassOnce(props.mountKey);
    traceOperationalSceneAwarenessOnce(props.mountKey);
  }, [props.mountKey]);

  const statusCard = view.cards.find((card) => card.id === "operational_status");
  const activityCard = view.cards.find((card) => card.id === "activity_level");
  const insightCards = view.cards.filter(
    (card) => card.id !== "operational_status" && card.id !== "activity_level"
  );

  return (
    <div
      id="nexora-operational-workspace"
      data-nx="operational-workspace"
      data-mrp-workspace-id="operational"
      data-mrp-workspace-mount-key={props.mountKey}
      data-operational-phase={view.phase}
      data-operational-revision={view.revision}
      data-operational-object-selected={view.objectContext.hasSelection ? "true" : "false"}
      data-operational-visual-pass="true"
      data-operational-scene-aware="true"
      style={operationalWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: operationalVisualSpacing.fieldGap,
        }}
      >
        <h2 style={operationalHeaderTitleStyle()}>Operational</h2>
        <p style={operationalHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <OperationalObjectContextPanel
        objectContext={view.objectContext}
        phase={view.phase}
      />

      {props.dashboardContext === "sources" ? (
        <>
          <WorkspaceDataSourcePanel
            refreshSignal={dataSourceRegistryRevision}
            onRegistryChanged={handleDataSourceRegistryChanged}
          />
          <WorkspaceObjectApprovalPanel refreshSignal={dataSourceRegistryRevision} />
          <WorkspaceRelationshipApprovalPanel refreshSignal={dataSourceRegistryRevision} />
        </>
      ) : null}

      {statusCard ? (
        <OperationalWorkspaceCard
          card={statusCard}
          activeOperationalStatus={view.phase === "ready" ? view.operationalStatus : null}
          statusOptions={view.statusOptions}
        />
      ) : null}

      {activityCard ? (
        <OperationalWorkspaceCard
          card={activityCard}
          activeActivityLevel={view.phase === "ready" ? view.activityLevel : null}
          activityOptions={view.activityOptions}
        />
      ) : null}

      <div style={operationalInsightGridStyle()}>
        {insightCards.map((card) => (
          <OperationalWorkspaceCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default OperationalWorkspace;
