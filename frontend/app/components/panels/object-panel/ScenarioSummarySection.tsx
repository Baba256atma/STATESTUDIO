"use client";

import React from "react";

import { nx } from "../../ui/nexoraTheme.ts";
import {
  objectPanelInsightCardStyle,
  objectPanelSectionLabel,
} from "./objectPanelExecutiveStyles.ts";
import type { ObjectScenarioSummaryState } from "../../../lib/scenario/scenarioWorkspaceIntegrationRuntime.ts";

export type ScenarioSummarySectionProps = Readonly<{
  summary: ObjectScenarioSummaryState;
}>;

export function ScenarioSummarySection(
  props: ScenarioSummarySectionProps
): React.ReactElement | null {
  const { summary } = props;
  if (!summary.visible) return null;

  return (
    <div
      data-nx="object-panel-scenario-summary"
      style={{ marginTop: 12, borderTop: `1px solid ${nx.borderSoft}`, paddingTop: 10 }}
    >
      <div style={objectPanelSectionLabel}>Scenario Summary</div>
      {summary.latestSimulationLabel ? (
        <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.45, marginBottom: 6 }}>
          Latest Simulation: {summary.latestSimulationLabel}
        </div>
      ) : null}
      {summary.latestComparisonLabel ? (
        <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.45, marginBottom: 6 }}>
          Latest Comparison: {summary.latestComparisonLabel}
        </div>
      ) : null}
      <div style={{ color: nx.muted, fontSize: 10, lineHeight: 1.4, marginBottom: 8 }}>
        Timeline: {summary.timelineStatus}
      </div>
      {summary.emptyMessage ? (
        <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>{summary.emptyMessage}</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {summary.items.map((item) => (
            <div key={item.scenarioId} style={objectPanelInsightCardStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, color: nx.text, lineHeight: 1.25 }}>
                {item.scenarioName}
              </div>
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
                  {item.scenarioStatus}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: nx.text }}>
                  {item.simulationStatus ?? "No simulation"}
                </div>
              </div>
              {item.insightSummary ? (
                <div style={{ marginTop: 4, color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
                  {item.insightSummary}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScenarioSummarySection;
