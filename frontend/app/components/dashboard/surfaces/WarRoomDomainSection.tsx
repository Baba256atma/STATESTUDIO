"use client";

import React from "react";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";

export type WarRoomDomainSectionProps = {
  domain: string;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  details?: readonly string[];
  meta?: string;
};

export function WarRoomDomainSection(props: WarRoomDomainSectionProps): React.ReactElement {
  const { domain, title, primaryValue, secondaryValue, details, meta } = props;

  return (
    <section
      data-nx="war-room-domain-section"
      data-domain={domain}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.xs,
        padding: dashboardVisualSpacing.md,
        borderRadius: 8,
        border: `1px solid ${dashboardVisualColors.border}`,
        background: dashboardVisualColors.surface,
      }}
    >
      <header
        data-nx="war-room-domain-header"
        style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}
      >
        {title}
      </header>
      <div style={{ ...dashboardVisualTypography.summaryValue, color: dashboardVisualColors.text }}>
        {primaryValue}
      </div>
      <div style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
        {secondaryValue}
      </div>
      {details && details.length > 0 ? (
        <ul
          style={{
            margin: `${dashboardVisualSpacing.xs}px 0 0`,
            paddingLeft: 16,
            fontSize: 11,
            color: dashboardVisualColors.textSoft,
            lineHeight: 1.5,
          }}
        >
          {details.map((detail) => (
            <li key={`${domain}:${detail}`}>{detail}</li>
          ))}
        </ul>
      ) : null}
      {meta ? (
        <div style={{ fontSize: 10, color: dashboardVisualColors.textSoft, marginTop: 2 }}>{meta}</div>
      ) : null}
    </section>
  );
}

export default WarRoomDomainSection;
