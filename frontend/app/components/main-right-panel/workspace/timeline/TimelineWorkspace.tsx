"use client";

import React from "react";

import type { SceneJson } from "../../../../lib/sceneTypes.ts";
import { traceTimelineSceneAwarenessOnce } from "../../../../lib/ui/mrpWorkspace/timeline/timelineSceneAwarenessRuntime.ts";
import { traceNexoraRule11ActiveOnce } from "../../../../lib/ui/mrpWorkspace/governance/nexoraRule11BoundaryRuntime.ts";
import { hydrateTimelineWorkspaceStateOnMount } from "../../../../lib/ui/mrpWorkspace/timeline/timelineWorkspaceStateRuntime.ts";
import { traceTimelineFoundationOnce } from "../../../../lib/ui/mrpWorkspace/timeline/timelineWorkspaceRuntime.ts";
import { useSyncTimelineObjectContext } from "../../../../lib/ui/mrpWorkspace/timeline/useSyncTimelineObjectContext.ts";
import { useSyncTimelineSceneAwareness } from "../../../../lib/ui/mrpWorkspace/timeline/useSyncTimelineSceneAwareness.ts";
import { useSyncTimelineWorkspaceData } from "../../../../lib/ui/mrpWorkspace/timeline/useSyncTimelineWorkspaceData.ts";
import { useTimelineWorkspaceView } from "../../../../lib/ui/mrpWorkspace/timeline/useTimelineWorkspaceState.ts";
import {
  timelineHeaderPurposeStyle,
  timelineHeaderTitleStyle,
  timelineInsightGridStyle,
  timelineVisualSpacing,
  timelineWorkspaceShellStyle,
  traceTimelineVisualPassOnce,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualContract.ts";
import { TimelineDecisionHistoryList } from "./TimelineDecisionHistoryList.tsx";
import { TimelineObjectContextPanel } from "./TimelineObjectContextPanel.tsx";
import { TimelineRecentEventsList } from "./TimelineRecentEventsList.tsx";
import { TimelineSceneCoveragePanel } from "./TimelineSceneCoveragePanel.tsx";
import { TimelineSummaryVisualCard } from "./TimelineSummaryVisualCard.tsx";
import { TimelineWorkspaceCard } from "./TimelineWorkspaceCard.tsx";

export type TimelineWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  workspaceSceneJson?: SceneJson | null;
}>;

export function TimelineWorkspace(props: TimelineWorkspaceProps): React.ReactElement {
  const view = useTimelineWorkspaceView();

  useSyncTimelineObjectContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    selectedObjectType: props.selectedObjectType,
    selectedObjectStatus: props.selectedObjectStatus,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
    sceneJson: props.workspaceSceneJson,
  });

  useSyncTimelineWorkspaceData({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
    sceneJson: props.workspaceSceneJson,
  });

  useSyncTimelineSceneAwareness({
    selectedObjectId: props.selectedObjectId,
    routeObjectId: props.routeObjectId,
    sceneJson: props.workspaceSceneJson,
  });

  React.useEffect(() => {
    hydrateTimelineWorkspaceStateOnMount(props.mountKey);
    traceTimelineFoundationOnce(props.mountKey);
    traceTimelineVisualPassOnce(props.mountKey);
    traceTimelineSceneAwarenessOnce(props.mountKey);
    traceNexoraRule11ActiveOnce(props.mountKey);
  }, [props.mountKey]);

  const insightCards = view.cards.filter(
    (card) => card.id === "important_changes" || card.id === "risk_evolution"
  );

  return (
    <div
      id="nexora-timeline-workspace"
      data-nx="timeline-workspace"
      data-mrp-workspace-id="timeline"
      data-mrp-workspace-mount-key={props.mountKey}
      data-timeline-phase={view.phase}
      data-timeline-revision={view.revision}
      data-timeline-object-selected={view.objectContext.hasSelection ? "true" : "false"}
      data-timeline-visual-pass="true"
      data-timeline-visual-surface="true"
      data-timeline-scene-aware="true"
      style={timelineWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: timelineVisualSpacing.fieldGap,
        }}
      >
        <h2 style={timelineHeaderTitleStyle()}>Timeline Overview</h2>
        <p style={timelineHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <TimelineObjectContextPanel objectContext={view.objectContext} phase={view.phase} />

      <TimelineSceneCoveragePanel
        coverage={view.sceneCoverage}
        readOnly={view.sceneAwarenessReadOnly}
        phase={view.phase}
      />

      <TimelineSummaryVisualCard summary={view.visualSurface.summary} phase={view.phase} />

      <TimelineRecentEventsList
        rows={view.visualSurface.recentEvents}
        emptyMessage={view.visualSurface.recentEventsEmptyMessage}
        phase={view.phase}
      />

      <TimelineDecisionHistoryList
        rows={view.visualSurface.decisionHistory}
        emptyMessage={view.visualSurface.decisionHistoryEmptyMessage}
        phase={view.phase}
      />

      <div style={timelineInsightGridStyle()}>
        {insightCards.map((card) => (
          <TimelineWorkspaceCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default TimelineWorkspace;
