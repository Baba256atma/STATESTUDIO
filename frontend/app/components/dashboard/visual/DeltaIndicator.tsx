"use client";

import React from "react";
import type { DashboardDeltaIndicator } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";
import { dashboardVisualColors, dashboardVisualTypography } from "../../../lib/dashboard/dashboardVisualTheme.ts";

export type DeltaIndicatorProps = {
  signal: DashboardDeltaIndicator;
};

function resolveDeltaColor(direction: DashboardDeltaIndicator["direction"]): string {
  if (direction === "up") return dashboardVisualColors.success;
  if (direction === "down") return dashboardVisualColors.risk;
  return dashboardVisualColors.muted;
}

export function DeltaIndicator(props: DeltaIndicatorProps): React.ReactElement {
  const { signal } = props;
  return (
    <span
      data-nx="dashboard-delta-indicator"
      data-direction={signal.direction}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: dashboardVisualTypography.cardMeta.fontSize,
        fontWeight: 600,
        color: resolveDeltaColor(signal.direction),
      }}
    >
      <span style={{ opacity: 0.7, fontWeight: 500 }}>{signal.label}</span>
      <span>{signal.value}</span>
    </span>
  );
}

export default DeltaIndicator;
