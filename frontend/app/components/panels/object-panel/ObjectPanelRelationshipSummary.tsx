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

export type ObjectPanelRelationshipSummaryProps = Readonly<{
  view: ObjectPanelExecutiveViewModel;
}>;

function RelationshipMetric(props: { label: string; value: number }): React.ReactElement {
  return (
    <div style={{ ...objectPanelMetricCardStyle, minHeight: 64 }}>
      <div style={{ ...dashboardVisualTypography.microLabel, color: nx.lowMuted, fontSize: 9 }}>{props.label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: nx.text, lineHeight: 1 }}>{props.value}</div>
    </div>
  );
}

export function ObjectPanelRelationshipSummary(props: ObjectPanelRelationshipSummaryProps): React.ReactElement {
  useEffect(() => {
    traceObjectPanelPhase("relationships");
  }, []);

  const { relationships } = props.view;

  return (
    <section data-nx="object-panel-relationship-summary" style={objectPanelSectionStyle}>
      <div style={objectPanelSectionLabel}>Object Relationships</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        <RelationshipMetric label="Connected" value={relationships.connectedObjects} />
        <RelationshipMetric label="Dependencies" value={relationships.dependencies} />
        <RelationshipMetric label="Influence" value={relationships.influenceCount} />
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: nx.muted, lineHeight: 1.4 }}>
        Compact topology summary — graph rendering deferred.
      </div>
    </section>
  );
}

export default ObjectPanelRelationshipSummary;
