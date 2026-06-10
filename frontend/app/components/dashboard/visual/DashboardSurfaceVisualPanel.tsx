"use client";

import React from "react";
import type { DashboardSurfaceVisualBundle } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";
import {
  dashboardVisualColors,
  dashboardVisualPanelStyle,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { ExecutiveImpactCard } from "./ExecutiveImpactCard.tsx";
import { MicroBarSeries } from "./MicroBarSeries.tsx";
import { MicroTrendLine } from "./MicroTrendLine.tsx";

export type DashboardSurfaceVisualPanelProps = {
  bundle: DashboardSurfaceVisualBundle;
};

export function DashboardSurfaceVisualPanel(props: DashboardSurfaceVisualPanelProps): React.ReactElement {
  const { bundle } = props;

  return (
    <div data-nx="dashboard-surface-visual-panel" data-surface={bundle.panelType} style={dashboardVisualPanelStyle()}>
      <div
        style={{
          ...dashboardVisualTypography.microLabel,
          color: dashboardVisualColors.textSoft,
        }}
      >
        Executive Visual Intelligence
      </div>

      <ExecutiveImpactCard signal={bundle.impactCard} />

      <div
        data-nx="dashboard-micro-charts"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        {bundle.microCharts.map((chart) =>
          chart.kind === "trend_line" ? (
            <MicroTrendLine key={`${bundle.panelType}:${chart.label}`} signal={chart} />
          ) : (
            <MicroBarSeries key={`${bundle.panelType}:${chart.label}`} signal={chart} />
          )
        )}
      </div>
    </div>
  );
}

export default DashboardSurfaceVisualPanel;
