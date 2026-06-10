"use client";

import React from "react";
import type { ExecutiveSummaryCard as ExecutiveSummaryCardModel } from "../../../lib/dashboard/executiveSummary/executiveSummaryContract.ts";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";

export type ExecutiveSummaryCardProps = {
  card: ExecutiveSummaryCardModel;
};

const ATTENTION_COLOR: Readonly<Record<ExecutiveSummaryCardModel["attention"], string>> = Object.freeze({
  attention_required: "var(--nx-risk)",
  monitor: "var(--nx-warning)",
  stable: "var(--nx-success)",
  unknown: "var(--nx-muted)",
});

export function ExecutiveSummaryCard(props: ExecutiveSummaryCardProps): React.ReactElement {
  const { card } = props;

  return (
    <div
      data-nx="executive-summary-card"
      data-card-kind={card.kind}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 8,
        border: `1px solid ${dashboardVisualColors.border}`,
        background: dashboardVisualColors.surface,
        minHeight: 88,
      }}
    >
      <div
        style={{
          ...dashboardVisualTypography.microLabel,
          color: dashboardVisualColors.textSoft,
        }}
      >
        {card.title}
      </div>
      <div style={{ ...dashboardVisualTypography.summaryValue, color: dashboardVisualColors.text }}>
        {card.primaryValue}
      </div>
      <div style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
        {card.secondaryValue}
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: ATTENTION_COLOR[card.attention],
          marginTop: 2,
        }}
      >
        {card.attention.replace("_", " ")}
      </span>
    </div>
  );
}

export default ExecutiveSummaryCard;
