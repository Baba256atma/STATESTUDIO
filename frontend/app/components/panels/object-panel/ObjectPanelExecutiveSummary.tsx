"use client";

import React, { useEffect } from "react";

import type { ObjectPanelExecutiveViewModel } from "../../../lib/object-panel/objectPanelExecutiveViewModel.ts";
import { traceObjectPanelPhase } from "../../../lib/object-panel/objectPanelDiagnostics.ts";
import { dashboardVisualSpacing, dashboardVisualTypography } from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { nx } from "../../ui/nexoraTheme.ts";
import { objectPanelSectionLabel, objectPanelSectionStyle } from "./objectPanelExecutiveStyles.ts";

export type ObjectPanelExecutiveSummaryProps = Readonly<{
  view: ObjectPanelExecutiveViewModel;
}>;

export function ObjectPanelExecutiveSummary(props: ObjectPanelExecutiveSummaryProps): React.ReactElement {
  useEffect(() => {
    traceObjectPanelPhase("summary");
  }, []);

  return (
    <section
      data-nx="object-panel-executive-summary"
      style={{
        ...objectPanelSectionStyle,
        padding: 14,
        border: "1px solid rgba(56,189,248,0.22)",
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--nx-accent-soft) 55%, var(--nx-bg-panel-soft)), var(--nx-bg-panel-soft))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div style={objectPanelSectionLabel}>Executive Summary</div>
      <p
        style={{
          margin: 0,
          ...dashboardVisualTypography.cardMeta,
          fontSize: 12,
          lineHeight: 1.55,
          color: nx.text,
          fontWeight: 500,
        }}
      >
        {props.view.executiveSummary}
      </p>
      <div
        style={{
          marginTop: dashboardVisualSpacing.sm,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: nx.accentMuted,
        }}
      >
        Briefing priority
      </div>
    </section>
  );
}

export default ObjectPanelExecutiveSummary;
