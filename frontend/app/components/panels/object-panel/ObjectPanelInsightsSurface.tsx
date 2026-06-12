"use client";

import React, { useEffect } from "react";

import type { ObjectPanelExecutiveViewModel } from "../../../lib/object-panel/objectPanelExecutiveViewModel.ts";
import { traceObjectPanelPhase } from "../../../lib/object-panel/objectPanelDiagnostics.ts";
import { dashboardVisualSpacing } from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { nx } from "../../ui/nexoraTheme.ts";
import {
  objectPanelInsightCardStyle,
  objectPanelSectionLabel,
  objectPanelSectionStyle,
} from "./objectPanelExecutiveStyles.ts";

export type ObjectPanelInsightsSurfaceProps = Readonly<{
  view: ObjectPanelExecutiveViewModel;
}>;

export function ObjectPanelInsightsSurface(props: ObjectPanelInsightsSurfaceProps): React.ReactElement {
  useEffect(() => {
    traceObjectPanelPhase("insights");
  }, []);

  const insights = props.view.insights.slice(0, 3);

  if (insights.length === 0) {
    return (
      <section data-nx="object-panel-insights-surface" style={objectPanelSectionStyle}>
        <div style={objectPanelSectionLabel}>Object Insights</div>
        <div style={{ ...objectPanelInsightCardStyle, color: nx.muted }}>No prioritized insights yet.</div>
      </section>
    );
  }

  return (
    <section data-nx="object-panel-insights-surface" style={objectPanelSectionStyle}>
      <div style={objectPanelSectionLabel}>Object Insights</div>
      <div style={{ display: "flex", flexDirection: "column", gap: dashboardVisualSpacing.sm }}>
        {insights.map((insight, index) => (
          <div key={`${index}:${insight.slice(0, 24)}`} style={objectPanelInsightCardStyle}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: nx.lowMuted,
                marginBottom: 4,
              }}
            >
              Top Insight #{index + 1}
            </div>
            {insight}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ObjectPanelInsightsSurface;
