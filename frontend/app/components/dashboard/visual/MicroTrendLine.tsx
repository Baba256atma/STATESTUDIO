"use client";

import React from "react";
import type { DashboardTrendLineSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";
import {
  dashboardVisualColors,
  dashboardVisualSizing,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";

export type MicroTrendLineProps = {
  signal: DashboardTrendLineSignal;
};

function buildSparklinePath(points: readonly number[], width: number, height: number): string {
  if (points.length === 0) return "";
  const step = points.length > 1 ? width / (points.length - 1) : width;
  return points
    .map((value, index) => {
      const x = index * step;
      const y = height - value * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function MicroTrendLine(props: MicroTrendLineProps): React.ReactElement {
  const { signal } = props;
  const width = dashboardVisualSizing.microChartWidth;
  const height = dashboardVisualSizing.microChartHeight;
  const path = buildSparklinePath(signal.points, width, height);
  const stroke = resolveDirectionColor(signal.direction);

  return (
    <div
      data-nx="dashboard-micro-trend-line"
      data-direction={signal.direction}
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
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden
        style={{ display: "block", overflow: "visible" }}
      >
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default MicroTrendLine;
