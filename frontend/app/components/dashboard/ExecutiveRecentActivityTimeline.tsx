"use client";

import React, { useCallback, useMemo } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { buildExecutiveActivityTimelineView } from "../../lib/dashboard/executiveContinuity/executiveContinuityRuntime";
import type { DashboardHomeSectionLayoutVariant } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTypes";
import { applyDashboardHomeSectionChrome } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import type { WorkspaceRecentsContextInput } from "../../lib/workspaces/workspaceRecentsContract";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { ExecutiveContinuityLayer } from "./ExecutiveContinuityLayer";
import { ExecutiveActivityTimelineEntry } from "./ExecutiveActivityTimelineEntry";

export type ExecutiveRecentActivityTimelineProps = Readonly<{
  context?: WorkspaceRecentsContextInput;
  onActivityReopen?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
  layoutVariant?: DashboardHomeSectionLayoutVariant;
}>;

export function ExecutiveRecentActivityTimeline(
  props: ExecutiveRecentActivityTimelineProps
): React.ReactElement {
  const timelineView = useMemo(
    () => buildExecutiveActivityTimelineView(props.context ?? {}),
    [props.context]
  );

  const handleReopen = useCallback(
    (input: { workspaceId: ExecutiveWorkspaceId; returnKind: WorkspaceRecentReturnKind }) => {
      props.onActivityReopen?.(input);
    },
    [props.onActivityReopen]
  );

  const layoutVariant = props.layoutVariant ?? "standalone";

  return (
    <section
      data-nx="executive-recent-activity-timeline"
      data-section-id="recent_activity_timeline"
      data-activity-count={timelineView.entries.length}
      data-continuity-empty={timelineView.continuity.isEmpty ? "true" : "false"}
      style={applyDashboardHomeSectionChrome(layoutVariant, {
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: `${dashboardVisualSpacing.sm}px ${dashboardVisualSpacing.md}px`,
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: dashboardVisualColors.surface,
      })}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Recent Activity
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11 }}>
          What was I doing recently — executive continuity history.
        </div>
      </header>

      <ExecutiveContinuityLayer continuity={timelineView.continuity} />

      {timelineView.continuity.isEmpty ? (
        <div
          data-nx="executive-activity-timeline-empty-state"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: dashboardVisualSpacing.md,
            borderRadius: 12,
            border: `1px dashed ${nx.borderSoft}`,
            color: nx.textSoft,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          <span>No recent activity available.</span>
          <span>Begin by opening a workflow from Quick Actions.</span>
        </div>
      ) : (
        <div data-nx="executive-activity-timeline-list">
          {timelineView.entries.map((entry) => (
            <ExecutiveActivityTimelineEntry key={entry.id} entry={entry} onReopen={handleReopen} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveRecentActivityTimeline;
