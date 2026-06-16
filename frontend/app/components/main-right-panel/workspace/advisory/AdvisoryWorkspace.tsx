"use client";

import React from "react";

import { traceAdvisoryRecommendationOnce } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryRecommendationRuntime.ts";
import { traceAdvisoryExplainabilityOnce } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryExplainabilityRuntime.ts";
import { traceAdvisoryHandoffOnce } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryHandoffRuntime.ts";
import { traceAdvisoryFoundationBoundaryOnce } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryBoundaryRuntime.ts";
import { traceAdvisoryRuntimeOnce } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryStateRuntime.ts";
import { traceAdvisorySceneAwarenessOnce } from "../../../../lib/ui/mrpWorkspace/advisory/advisorySceneAwarenessRuntime.ts";
import { hydrateAdvisoryWorkspaceStateOnMount } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryWorkspaceStateRuntime.ts";
import { traceAdvisoryFoundationOnce } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryWorkspaceRuntime.ts";
import { useAdvisoryWorkspaceView } from "../../../../lib/ui/mrpWorkspace/advisory/useAdvisoryWorkspaceState.ts";
import { useSyncAdvisoryRecommendation } from "../../../../lib/ui/mrpWorkspace/advisory/useSyncAdvisoryRecommendation.ts";
import { useSyncAdvisoryWorkspaceContext } from "../../../../lib/ui/mrpWorkspace/advisory/useSyncAdvisoryWorkspaceContext.ts";
import {
  traceAdvisoryVisualPassOnce,
  advisoryHeaderPurposeStyle,
  advisoryHeaderTitleStyle,
  advisoryInsightGridStyle,
  advisoryWorkspaceShellStyle,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryVisualContract.ts";
import { AdvisoryWorkspaceCard } from "./AdvisoryWorkspaceCard.tsx";
import { AdvisoryWorkspaceContextPanel } from "./AdvisoryWorkspaceContextPanel.tsx";
import { ExecutiveRecommendationCard } from "./ExecutiveRecommendationCard.tsx";
import { RecommendationDriversPanel } from "./RecommendationDriversPanel.tsx";
import { ConfidenceAnalysisPanel } from "./ConfidenceAnalysisPanel.tsx";
import { AdvisoryHandoffPanel } from "./AdvisoryHandoffPanel.tsx";

export type AdvisoryWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export function AdvisoryWorkspace(props: AdvisoryWorkspaceProps): React.ReactElement {
  const view = useAdvisoryWorkspaceView();

  useSyncAdvisoryWorkspaceContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
  });

  useSyncAdvisoryRecommendation();

  React.useEffect(() => {
    hydrateAdvisoryWorkspaceStateOnMount(props.mountKey);
    traceAdvisoryFoundationOnce(props.mountKey);
    traceAdvisoryVisualPassOnce(props.mountKey);
    traceAdvisoryFoundationBoundaryOnce(props.mountKey);
    traceAdvisoryRuntimeOnce(props.mountKey);
    traceAdvisorySceneAwarenessOnce(props.mountKey);
    traceAdvisoryRecommendationOnce(props.mountKey);
    traceAdvisoryExplainabilityOnce(props.mountKey);
    traceAdvisoryHandoffOnce(props.mountKey);
  }, [props.mountKey]);

  return (
    <div
      id="nexora-advisory-workspace"
      data-nx="advisory-workspace"
      data-mrp-workspace-id="advisory"
      data-mrp-workspace-mount-key={props.mountKey}
      data-advisory-phase={view.phase}
      data-advisory-revision={view.revision}
      data-advisory-object-selected={view.workspaceContext.hasSelection ? "true" : "false"}
      data-advisory-visual-pass="true"
      data-advisory-owns-recommendations-only="true"
      data-mrp-advisory-runtime="true"
      data-mrp-advisory-recommendation="true"
      data-mrp-advisory-explainability="true"
      data-mrp-advisory-handoff="true"
      data-nexora-rule-14-recommendation-ownership="true"
      style={advisoryWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <h2 style={advisoryHeaderTitleStyle()}>Advisory Overview</h2>
        <p style={advisoryHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <AdvisoryWorkspaceContextPanel
        workspaceContext={view.workspaceContext}
        phase={view.phase}
      />

      <ExecutiveRecommendationCard
        recommendation={view.recommendation}
        phase={view.phase}
      />

      <RecommendationDriversPanel
        explainability={view.explainability}
        phase={view.phase}
      />

      <ConfidenceAnalysisPanel
        explainability={view.explainability}
        phase={view.phase}
      />

      <AdvisoryHandoffPanel
        handoff={view.handoff}
        recommendation={view.recommendation}
        phase={view.phase}
      />

      <section
        data-nx="advisory-workspace-sections"
        aria-label="Advisory recommendation surfaces"
        style={advisoryInsightGridStyle()}
      >
        {view.cards.map((card) => (
          <AdvisoryWorkspaceCard key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
}

export default AdvisoryWorkspace;
