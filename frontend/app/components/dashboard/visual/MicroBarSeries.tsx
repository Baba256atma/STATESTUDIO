"use client";

import React from "react";
import type { DashboardMicroBarSeriesSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";
import {
  dashboardVisualColors,
  dashboardVisualSizing,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";

export type MicroBarSeriesProps = {
  signal: DashboardMicroBarSeriesSignal;
};

export function MicroBarSeries(props: MicroBarSeriesProps): React.ReactElement {
  const { signal } = props;
  const height = dashboardVisualSizing.microChartHeight;
  const barWidth = dashboardVisualSizing.microBarWidth;

  return (
    <div
      data-nx="dashboard-micro-bar-series"
      style={{ display: "flex", flexDirection: "column", gap: dashboardVisualSpacing.xs, minWidth: 0 }}
    >
      <span
        style={{
          ...dashboardVisualTypography.microLabel,
          color: dashboardVisualColors.textSoft,
        }}
      >
        {signal.label}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height,
        }}
        aria-hidden
      >
        {signal.values.map((value, index) => (
          <div
            key={`${signal.label}:${index}`}
            style={{
              width: barWidth,
              height: Math.max(4, value * height),
              borderRadius: 2,
              background: dashboardVisualColors.barFill,
              opacity: 0.55 + value * 0.45,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default MicroBarSeries;
