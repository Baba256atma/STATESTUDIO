"use client";

import React from "react";

import {
  hydrateExecutiveSummaryStateOnMount,
} from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryStateRuntime.ts";
import {
  traceExecutiveSummaryFoundationOnce,
} from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryWorkspaceRuntime.ts";
import {
  executiveSummaryHeaderPurposeStyle,
  executiveSummaryHeaderTitleStyle,
  executiveSummaryInsightGridStyle,
  executiveSummaryVisualSpacing,
  executiveSummaryWorkspaceShellStyle,
  traceExecutiveSummaryVisualPassOnce,
} from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryVisualContract.ts";
import { useExecutiveSummaryWorkspaceView } from "../../../../lib/ui/mrpWorkspace/executiveSummary/useExecutiveSummaryState.ts";
import { useSyncExecutiveSummaryObjectContext } from "../../../../lib/ui/mrpWorkspace/executiveSummary/useSyncExecutiveSummaryObjectContext.ts";
import { ExecutiveSummaryObjectContextPanel } from "./ExecutiveSummaryObjectContextPanel.tsx";
import { ExecutiveSummaryWorkspaceCard } from "./ExecutiveSummaryWorkspaceCard.tsx";

export type ExecutiveSummaryWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export function ExecutiveSummaryWorkspace(props: ExecutiveSummaryWorkspaceProps): React.ReactElement {
  const view = useExecutiveSummaryWorkspaceView();

  useSyncExecutiveSummaryObjectContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
  });

  React.useEffect(() => {
    hydrateExecutiveSummaryStateOnMount(props.mountKey);
    traceExecutiveSummaryFoundationOnce(props.mountKey);
    traceExecutiveSummaryVisualPassOnce(props.mountKey);
  }, [props.mountKey]);

  const systemStatusCard = view.cards.find((card) => card.id === "system_status");
  const insightCards = view.cards.filter((card) => card.id !== "system_status");

  return (
    <div
      id="nexora-executive-summary-workspace"
      data-nx="executive-summary-workspace"
      data-mrp-workspace-id="executive_summary"
      data-mrp-workspace-mount-key={props.mountKey}
      data-executive-summary-phase={view.phase}
      data-executive-summary-revision={view.revision}
      data-executive-summary-object-selected={view.objectContext.hasSelection ? "true" : "false"}
      data-executive-summary-visual-pass="true"
      style={executiveSummaryWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: executiveSummaryVisualSpacing.fieldGap,
        }}
      >
        <h2 style={executiveSummaryHeaderTitleStyle()}>Executive Summary</h2>
        <p style={executiveSummaryHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <ExecutiveSummaryObjectContextPanel
        objectContext={view.objectContext}
        phase={view.phase}
      />

      {systemStatusCard ? (
        <ExecutiveSummaryWorkspaceCard
          card={systemStatusCard}
          activeSystemStatus={view.phase === "ready" ? view.systemStatus : null}
        />
      ) : null}

      <div style={executiveSummaryInsightGridStyle()}>
        {insightCards.map((card) => (
          <ExecutiveSummaryWorkspaceCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default ExecutiveSummaryWorkspace;
