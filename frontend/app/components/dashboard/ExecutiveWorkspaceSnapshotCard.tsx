"use client";

import React from "react";

import type { WorkspaceSnapshotCardView } from "../../lib/dashboard/workspaceSnapshot/executiveWorkspaceSnapshotContract";
import {
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveWorkspaceSnapshotCardProps = Readonly<{
  card: WorkspaceSnapshotCardView;
}>;

export function ExecutiveWorkspaceSnapshotCard(
  props: ExecutiveWorkspaceSnapshotCardProps
): React.ReactElement {
  const { card } = props;

  return (
    <article
      data-nx="executive-workspace-snapshot-card"
      data-snapshot-card-id={card.id}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${nx.border}`,
        background: nx.bgElevated,
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {card.title}
      </div>
      <div
        style={{
          ...dashboardVisualTypography.cardTitle,
          color: nx.text,
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {card.primaryValue}
      </div>
      <div style={{ color: nx.textSoft, fontSize: 12, lineHeight: 1.4 }}>{card.secondaryValue}</div>
      <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.4 }}>{card.detail}</div>
    </article>
  );
}

export default ExecutiveWorkspaceSnapshotCard;
