"use client";

import React from "react";

import type { ExecutiveContinuitySummaryView } from "../../lib/dashboard/executiveContinuity/executiveContinuityContract";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveContinuityLayerProps = Readonly<{
  continuity: ExecutiveContinuitySummaryView;
}>;

export function ExecutiveContinuityLayer(props: ExecutiveContinuityLayerProps): React.ReactElement {
  const { continuity } = props;

  return (
    <div
      data-nx="executive-continuity-layer"
      data-continuity-empty={continuity.isEmpty ? "true" : "false"}
      data-activity-count={continuity.activityCount}
      style={{
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${continuity.isEmpty ? nx.borderSoft : nx.border}`,
        background: continuity.isEmpty ? nx.bgControl : dashboardVisualColors.surface,
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
        Executive Continuity
      </div>
      <p
        style={{
          margin: 0,
          color: continuity.isEmpty ? nx.textSoft : nx.text,
          fontSize: 13,
          lineHeight: 1.55,
          fontWeight: continuity.isEmpty ? 500 : 600,
        }}
      >
        {continuity.narrative}
      </p>
    </div>
  );
}

export default ExecutiveContinuityLayer;
