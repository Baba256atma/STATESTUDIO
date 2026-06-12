"use client";

import React, { useEffect } from "react";

import type { ObjectPanelExecutiveViewModel } from "../../../lib/object-panel/objectPanelExecutiveViewModel.ts";
import { traceObjectPanelPhase } from "../../../lib/object-panel/objectPanelDiagnostics.ts";
import { dashboardVisualTypography } from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { nx } from "../../ui/nexoraTheme.ts";
import {
  objectPanelMetricCardStyle,
  objectPanelSectionLabel,
  objectPanelSectionStyle,
} from "./objectPanelExecutiveStyles.ts";

export type ObjectPanelSignalsGridProps = Readonly<{
  view: ObjectPanelExecutiveViewModel;
}>;

function SignalCard(props: { label: string; value: string; emphasis?: boolean }): React.ReactElement {
  return (
    <div style={objectPanelMetricCardStyle}>
      <div style={{ ...dashboardVisualTypography.microLabel, color: nx.lowMuted, fontSize: 9 }}>{props.label}</div>
      <div
        style={{
          fontSize: props.emphasis ? 14 : 13,
          fontWeight: 800,
          color: props.emphasis ? nx.text : nx.textSoft,
          lineHeight: 1.1,
          textTransform: props.label === "Risk Level" ? "capitalize" : "none",
        }}
      >
        {props.value}
      </div>
    </div>
  );
}

export function ObjectPanelSignalsGrid(props: ObjectPanelSignalsGridProps): React.ReactElement {
  useEffect(() => {
    traceObjectPanelPhase("signals");
  }, []);

  const { signals } = props.view;

  return (
    <section data-nx="object-panel-signals-grid" style={objectPanelSectionStyle}>
      <div style={objectPanelSectionLabel}>Object Signals</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        <SignalCard label="Status" value={signals.status} />
        <SignalCard label="Impact" value={signals.impact} emphasis />
        <SignalCard label="Confidence" value={signals.confidence} />
        <SignalCard label="Risk Level" value={signals.riskLevel} emphasis />
      </div>
    </section>
  );
}

export default ObjectPanelSignalsGrid;
