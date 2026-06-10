"use client";

import React from "react";

import type { ExecutiveIntelligenceBriefingView } from "../../lib/dashboard/executiveBriefing/executiveBriefingContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveIntelligenceBriefingLayerProps = Readonly<{
  briefing: ExecutiveIntelligenceBriefingView;
}>;

export function ExecutiveIntelligenceBriefingLayer(
  props: ExecutiveIntelligenceBriefingLayerProps
): React.ReactElement {
  const { briefing } = props;

  return (
    <div
      data-nx="executive-intelligence-briefing-layer"
      data-section-id="intelligence_briefing"
      data-briefing-nominal={briefing.isNominal ? "true" : "false"}
      data-briefing-count={briefing.totalCount}
      style={{
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${briefing.isNominal ? nx.borderSoft : nx.border}`,
        background: briefing.isNominal ? nx.bgControl : dashboardVisualColors.surface,
      }}
    >
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Intelligence Briefing
      </div>
      <p
        style={{
          margin: 0,
          color: briefing.isNominal ? nx.textSoft : nx.text,
          fontSize: 13,
          lineHeight: 1.55,
          fontWeight: briefing.isNominal ? 500 : 600,
        }}
      >
        {briefing.narrative}
      </p>
    </div>
  );
}

export default ExecutiveIntelligenceBriefingLayer;
