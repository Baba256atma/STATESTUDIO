"use client";

import React from "react";

import type { DashboardHomeSummaryCardView } from "../../lib/dashboard/executiveSummaryLayerContract";
import {
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

const TONE_BORDER: Readonly<Record<DashboardHomeSummaryCardView["tone"], string>> = Object.freeze({
  neutral: nx.border,
  accent: nx.navTileActiveBorder,
  warning: nx.warning,
  muted: nx.borderSoft,
});

const TONE_VALUE: Readonly<Record<DashboardHomeSummaryCardView["tone"], string>> = Object.freeze({
  neutral: nx.text,
  accent: nx.text,
  warning: nx.warning,
  muted: nx.muted,
});

export type ExecutiveSummaryCardProps = Readonly<{
  card: DashboardHomeSummaryCardView;
}>;

export function ExecutiveSummaryCard(props: ExecutiveSummaryCardProps): React.ReactElement {
  const { card } = props;

  return (
    <article
      data-nx="executive-summary-card"
      data-summary-card-id={card.id}
      data-summary-tone={card.tone}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${TONE_BORDER[card.tone]}`,
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
          color: TONE_VALUE[card.tone],
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {card.primaryValue}
      </div>
      <div style={{ color: nx.textSoft, fontSize: 12, fontWeight: 600, lineHeight: 1.35 }}>
        {card.secondaryValue}
      </div>
      <p style={{ margin: 0, color: nx.lowMuted, fontSize: 11, lineHeight: 1.45 }}>{card.detail}</p>
    </article>
  );
}

export default ExecutiveSummaryCard;
