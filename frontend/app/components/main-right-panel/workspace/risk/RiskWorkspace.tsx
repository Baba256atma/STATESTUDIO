"use client";

import React from "react";

import type { SceneJson } from "../../../../lib/sceneTypes.ts";
import { traceRiskSceneAwarenessOnce } from "../../../../lib/ui/mrpWorkspace/risk/riskSceneAwarenessRuntime.ts";
import { hydrateRiskWorkspaceStateOnMount } from "../../../../lib/ui/mrpWorkspace/risk/riskWorkspaceStateRuntime.ts";
import { traceRiskFoundationOnce } from "../../../../lib/ui/mrpWorkspace/risk/riskWorkspaceRuntime.ts";
import { useRiskWorkspaceView } from "../../../../lib/ui/mrpWorkspace/risk/useRiskWorkspaceState.ts";
import { useSyncRiskObjectContext } from "../../../../lib/ui/mrpWorkspace/risk/useSyncRiskObjectContext.ts";
import { useSyncRiskSceneAwareness } from "../../../../lib/ui/mrpWorkspace/risk/useSyncRiskSceneAwareness.ts";
import { useSyncRiskWorkspaceData } from "../../../../lib/ui/mrpWorkspace/risk/useSyncRiskWorkspaceData.ts";
import {
  riskHeaderPurposeStyle,
  riskHeaderTitleStyle,
  riskInsightGridStyle,
  riskVisualSpacing,
  riskWorkspaceShellStyle,
  traceRiskVisualPassOnce,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualContract.ts";
import { RiskObjectContextPanel } from "./RiskObjectContextPanel.tsx";
import { RiskSceneCoveragePanel } from "./RiskSceneCoveragePanel.tsx";
import { RiskSummaryVisualCard } from "./RiskSummaryVisualCard.tsx";
import { RiskTopRisksList } from "./RiskTopRisksList.tsx";
import { RiskWorkspaceCard } from "./RiskWorkspaceCard.tsx";

export type RiskWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  workspaceSceneJson?: SceneJson | null;
}>;

export function RiskWorkspace(props: RiskWorkspaceProps): React.ReactElement {
  const view = useRiskWorkspaceView();

  useSyncRiskObjectContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
    sceneJson: props.workspaceSceneJson,
  });

  useSyncRiskWorkspaceData({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
    sceneJson: props.workspaceSceneJson,
  });

  useSyncRiskSceneAwareness({
    selectedObjectId: props.selectedObjectId,
    routeObjectId: props.routeObjectId,
    sceneJson: props.workspaceSceneJson,
  });

  React.useEffect(() => {
    hydrateRiskWorkspaceStateOnMount(props.mountKey);
    traceRiskFoundationOnce(props.mountKey);
    traceRiskVisualPassOnce(props.mountKey);
    traceRiskSceneAwarenessOnce(props.mountKey);
  }, [props.mountKey]);

  const insightCards = view.cards.filter(
    (card) => card.id === "risk_drivers" || card.id === "recommended_monitoring"
  );

  return (
    <div
      id="nexora-risk-workspace"
      data-nx="risk-workspace"
      data-mrp-workspace-id="risk"
      data-mrp-workspace-mount-key={props.mountKey}
      data-risk-phase={view.phase}
      data-risk-revision={view.revision}
      data-risk-object-selected={view.objectContext.hasSelection ? "true" : "false"}
      data-risk-visual-pass="true"
      data-risk-visual-surface="true"
      data-risk-scene-aware="true"
      style={riskWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: riskVisualSpacing.fieldGap,
        }}
      >
        <h2 style={riskHeaderTitleStyle()}>Risk Overview</h2>
        <p style={riskHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <RiskObjectContextPanel objectContext={view.objectContext} phase={view.phase} />

      <RiskSceneCoveragePanel
        coverage={view.sceneCoverage}
        readOnly={view.sceneAwarenessReadOnly}
        phase={view.phase}
      />

      <RiskSummaryVisualCard summary={view.visualSurface.summary} phase={view.phase} />

      <RiskTopRisksList
        rows={view.visualSurface.topRisks}
        emptyMessage={view.visualSurface.emptyMessage}
        phase={view.phase}
      />

      <div style={riskInsightGridStyle()}>
        {insightCards.map((card) => (
          <RiskWorkspaceCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default RiskWorkspace;
