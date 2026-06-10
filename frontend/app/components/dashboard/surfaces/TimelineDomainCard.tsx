"use client";

import React from "react";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";

export type TimelineDomainCardProps = {
  domain: string;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  meta?: string;
};

export function TimelineDomainCard(props: TimelineDomainCardProps): React.ReactElement {
  const { domain, title, primaryValue, secondaryValue, meta } = props;

  return (
    <div
      data-nx="timeline-domain-card"
      data-domain={domain}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 8,
        border: `1px solid ${dashboardVisualColors.border}`,
        background: dashboardVisualColors.surface,
        minHeight: 100,
      }}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        {title}
      </div>
      <div style={{ ...dashboardVisualTypography.summaryValue, color: dashboardVisualColors.text }}>
        {primaryValue}
      </div>
      <div style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
        {secondaryValue}
      </div>
      {meta ? (
        <div style={{ fontSize: 10, color: dashboardVisualColors.textSoft, marginTop: 2 }}>{meta}</div>
      ) : null}
    </div>
  );
}

export default TimelineDomainCard;
