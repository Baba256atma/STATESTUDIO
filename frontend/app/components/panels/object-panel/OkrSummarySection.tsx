"use client";

import React from "react";

import { nx } from "../../ui/nexoraTheme.ts";
import {
  objectPanelInsightCardStyle,
  objectPanelSectionLabel,
} from "./objectPanelExecutiveStyles.ts";
import type { ObjectOkrSummaryState } from "./okrSummaryRuntime.ts";

export type OkrSummarySectionProps = Readonly<{
  summary: ObjectOkrSummaryState;
}>;

export function OkrSummarySection(props: OkrSummarySectionProps): React.ReactElement | null {
  const { summary } = props;
  if (!summary.visible) return null;

  return (
    <div
      data-nx="object-panel-okr-summary"
      style={{ marginTop: 12, borderTop: `1px solid ${nx.borderSoft}`, paddingTop: 10 }}
    >
      <div style={objectPanelSectionLabel}>OKR Summary</div>
      {summary.emptyMessage ? (
        <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>{summary.emptyMessage}</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {summary.items.map((item) => (
            <div key={item.objectiveId} style={objectPanelInsightCardStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, color: nx.text, lineHeight: 1.25 }}>
                {item.objectiveTitle}
              </div>
              {item.healthAvailable ? (
                <div
                  style={{
                    marginTop: 4,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: nx.textSoft }}>
                    {item.healthStatusLabel}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: nx.text }}>
                    {item.progressLabel}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 4, color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
                  OKR health not available.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OkrSummarySection;
