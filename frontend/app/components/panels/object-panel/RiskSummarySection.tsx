"use client";

import React from "react";

import { nx } from "../../ui/nexoraTheme.ts";
import {
  objectPanelInsightCardStyle,
  objectPanelSectionLabel,
} from "./objectPanelExecutiveStyles.ts";
import type { ObjectRiskSummaryItem, ObjectRiskSummaryState } from "./riskSummaryRuntime.ts";

export type RiskSummarySectionProps = Readonly<{
  summary: ObjectRiskSummaryState;
}>;

function RiskSummaryCard(props: { item: ObjectRiskSummaryItem }): React.ReactElement {
  const { item } = props;

  return (
    <div style={objectPanelInsightCardStyle}>
      <div style={{ fontSize: 12, fontWeight: 800, color: nx.text, lineHeight: 1.25 }}>
        {item.riskTitle}
      </div>
      {item.severityAvailable ? (
        <div
          style={{
            marginTop: 4,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto auto auto",
            gap: 8,
            alignItems: "baseline",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: nx.textSoft }}>
            {item.severityLevelLabel}
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: nx.text }}>{item.priorityLabel}</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: nx.text }}>{item.severityScoreLabel}</div>
        </div>
      ) : (
        <div style={{ marginTop: 4, color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
          Risk severity not available.
        </div>
      )}
    </div>
  );
}

export function RiskSummarySection(props: RiskSummarySectionProps): React.ReactElement | null {
  const { summary } = props;
  if (!summary.visible) return null;

  return (
    <div
      data-nx="object-panel-risk-summary"
      style={{ marginTop: 12, borderTop: `1px solid ${nx.borderSoft}`, paddingTop: 10 }}
    >
      <div style={objectPanelSectionLabel}>Risk Summary</div>
      {summary.emptyMessage ? (
        <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>{summary.emptyMessage}</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {summary.items.map((item) => (
            <RiskSummaryCard key={item.riskId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RiskSummarySection;
