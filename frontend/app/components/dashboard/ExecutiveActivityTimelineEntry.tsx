"use client";

import React, { useCallback } from "react";

import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { ExecutiveActivityTimelineEntryView } from "../../lib/dashboard/executiveContinuity/executiveContinuityContract";
import { EXECUTIVE_ACTIVITY_CATEGORY_LABELS } from "../../lib/dashboard/executiveContinuity/executiveContinuityContract";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import {
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveActivityTimelineEntryProps = Readonly<{
  entry: ExecutiveActivityTimelineEntryView;
  onReopen?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
}>;

export function ExecutiveActivityTimelineEntry(
  props: ExecutiveActivityTimelineEntryProps
): React.ReactElement {
  const { entry } = props;

  const handleAction = useCallback(() => {
    if (!entry.actionEnabled || !entry.returnKind || !entry.relatedWorkspaceId || !props.onReopen) {
      return;
    }
    props.onReopen({
      workspaceId: entry.relatedWorkspaceId,
      returnKind: entry.returnKind,
    });
  }, [entry.actionEnabled, entry.relatedWorkspaceId, entry.returnKind, props.onReopen]);

  return (
    <article
      data-nx="executive-activity-timeline-entry"
      data-activity-id={entry.id}
      data-activity-category={entry.activityCategory}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: dashboardVisualSpacing.md,
        alignItems: "start",
        padding: `${dashboardVisualSpacing.sm}px 0`,
        borderBottom: `1px solid ${nx.borderSoft}`,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: nx.accent,
          marginTop: 6,
          flexShrink: 0,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div
          style={{
            ...dashboardVisualTypography.cardTitle,
            color: nx.text,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {entry.title}
        </div>
        <div style={{ color: nx.lowMuted, fontSize: 11 }}>{entry.timestampLabel}</div>
        {entry.relatedWorkspaceName ? (
          <div style={{ color: nx.textSoft, fontSize: 12 }}>{entry.relatedWorkspaceName}</div>
        ) : null}
        {entry.relatedObjectLabel ? (
          <div style={{ color: nx.textSoft, fontSize: 12 }}>
            Object: {entry.relatedObjectLabel}
          </div>
        ) : null}
        <div style={{ color: nx.muted, fontSize: 10, fontWeight: 600 }}>
          {EXECUTIVE_ACTIVITY_CATEGORY_LABELS[entry.activityCategory]}
        </div>
      </div>

      {entry.actionLabel && entry.actionEnabled ? (
        <button
          type="button"
          onClick={handleAction}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: `1px solid ${nx.navTileActiveBorder}`,
            background: nx.btnSecondaryBg,
            color: nx.btnSecondaryText,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {entry.actionLabel}
        </button>
      ) : null}
    </article>
  );
}

export default ExecutiveActivityTimelineEntry;
