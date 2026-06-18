"use client";

import React from "react";

import { traceScenarioFoundationBoundaryOnce } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioBoundaryRuntime.ts";
import {
  traceScenarioComparisonOnce,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioComparisonRuntime.ts";
import {
  traceScenarioHandoffOnce,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioHandoffRuntime.ts";
import {
  traceScenarioProjectionOnce,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioProjectionRuntime.ts";
import {
  traceScenarioGenerationOnce,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioGenerationRuntime.ts";
import { hydrateScenarioWorkspaceStateOnMount } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioWorkspaceStateRuntime.ts";
import { hydrateScenarioAuthoringUiOnMount } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioAuthoringUiRuntime.ts";
import {
  traceScenarioFoundationOnce,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioWorkspaceRuntime.ts";
import { useScenarioAuthoringUiView } from "../../../../lib/ui/mrpWorkspace/scenario/useScenarioAuthoringUiView.ts";
import { useSyncScenarioAuthoringUi } from "../../../../lib/ui/mrpWorkspace/scenario/useSyncScenarioAuthoringUi.ts";
import { useScenarioWorkspaceView } from "../../../../lib/ui/mrpWorkspace/scenario/useScenarioWorkspaceState.ts";
import { useSyncScenarioComparison } from "../../../../lib/ui/mrpWorkspace/scenario/useSyncScenarioComparison.ts";
import { useSyncScenarioProjection } from "../../../../lib/ui/mrpWorkspace/scenario/useSyncScenarioProjection.ts";
import { useSyncScenarioGeneration } from "../../../../lib/ui/mrpWorkspace/scenario/useSyncScenarioGeneration.ts";
import { useSyncScenarioWorkspaceContext } from "../../../../lib/ui/mrpWorkspace/scenario/useSyncScenarioWorkspaceContext.ts";
import {
  scenarioGenerationGridStyle,
  scenarioHeaderPurposeStyle,
  scenarioHeaderTitleStyle,
  scenarioInsightGridStyle,
  scenarioSectionLabelStyle,
  scenarioVisualSpacing,
  scenarioWorkspaceShellStyle,
  traceScenarioVisualPassOnce,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";
import { ScenarioAuthoringDraftPanel } from "./ScenarioAuthoringDraftPanel.tsx";
import { ScenarioComparisonMatrix } from "./ScenarioComparisonMatrix.tsx";
import { FutureProjectionPanel } from "./FutureProjectionPanel.tsx";
import { ScenarioHandoffPanel } from "./ScenarioHandoffPanel.tsx";
import { ScenarioGenerationCard } from "./ScenarioGenerationCard.tsx";
import { ScenarioWorkspaceCard } from "./ScenarioWorkspaceCard.tsx";
import { ScenarioWorkspaceContextPanel } from "./ScenarioWorkspaceContextPanel.tsx";

export type ScenarioWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export function ScenarioWorkspace(props: ScenarioWorkspaceProps): React.ReactElement {
  const view = useScenarioWorkspaceView();
  const authoringView = useScenarioAuthoringUiView();

  useSyncScenarioWorkspaceContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
  });

  useSyncScenarioGeneration({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
  });

  useSyncScenarioComparison();
  useSyncScenarioProjection();
  useSyncScenarioAuthoringUi({
    selectedObjectId: props.selectedObjectId,
  });

  React.useEffect(() => {
    hydrateScenarioWorkspaceStateOnMount(props.mountKey);
    hydrateScenarioAuthoringUiOnMount(props.mountKey);
    traceScenarioFoundationOnce(props.mountKey);
    traceScenarioVisualPassOnce(props.mountKey);
    traceScenarioFoundationBoundaryOnce(props.mountKey);
    traceScenarioGenerationOnce(props.mountKey);
    traceScenarioComparisonOnce(props.mountKey);
    traceScenarioProjectionOnce(props.mountKey);
    traceScenarioHandoffOnce(props.mountKey);
  }, [props.mountKey]);

  const summaryCard = view.cards.find((card) => card.id === "scenario_summary");
  const comparisonCard = view.cards.find((card) => card.id === "scenario_comparison");
  const futureCard = view.cards.find((card) => card.id === "future_projection");

  return (
    <div
      id="nexora-scenario-workspace"
      data-nx="scenario-workspace"
      data-mrp-workspace-id="scenario"
      data-mrp-workspace-mount-key={props.mountKey}
      data-scenario-phase={view.phase}
      data-scenario-revision={view.revision}
      data-scenario-object-selected={view.workspaceContext.hasSelection ? "true" : "false"}
      data-scenario-visual-pass="true"
      data-scenario-generation="true"
      data-scenario-comparison="true"
      data-scenario-projection="true"
      data-scenario-handoff="true"
      data-scenario-authoring-ui="true"
      data-scenario-authoring-phase={authoringView.phase}
      data-scenario-explores-futures-only="true"
      data-nexora-rule-11-boundary="true"
      style={scenarioWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: scenarioVisualSpacing.fieldGap,
        }}
      >
        <h2 style={scenarioHeaderTitleStyle()}>Scenario Overview</h2>
        <p style={scenarioHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <ScenarioWorkspaceContextPanel
        workspaceContext={view.workspaceContext}
        phase={view.phase}
      />

      <ScenarioAuthoringDraftPanel draft={authoringView.draft} phase={authoringView.phase} />

      {summaryCard ? <ScenarioWorkspaceCard card={summaryCard} /> : null}

      <section
        data-nx="scenario-generation-list"
        aria-label="Generated executive scenarios"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: scenarioVisualSpacing.fieldGap,
        }}
      >
        <div style={scenarioSectionLabelStyle()}>Scenario List</div>
        <div style={scenarioGenerationGridStyle()}>
          {view.generation.scenarios.map((scenario) => (
            <ScenarioGenerationCard
              key={scenario.id}
              scenario={scenario}
              phase={view.phase}
            />
          ))}
        </div>
      </section>

      <ScenarioComparisonMatrix comparison={view.comparison} phase={view.phase} />

      <FutureProjectionPanel projection={view.projection} phase={view.phase} />

      <ScenarioHandoffPanel
        handoff={view.handoff}
        generation={view.generation}
        selectedObjectId={props.selectedObjectId ?? view.workspaceContext.selectedObjectId}
        phase={view.phase}
      />

      {comparisonCard ? <ScenarioWorkspaceCard card={comparisonCard} /> : null}
      {futureCard ? <ScenarioWorkspaceCard card={futureCard} /> : null}
    </div>
  );
}

export default ScenarioWorkspace;
