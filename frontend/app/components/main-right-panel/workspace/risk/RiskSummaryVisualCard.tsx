"use client";

import React from "react";

import {
  RISK_SUMMARY_METRIC_LABELS,
  type RiskSummaryVisual,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualSurfaceContract.ts";
import {
  riskCardDetailStyle,
  riskSectionLabelStyle,
  riskSummaryMetricLabelStyle,
  riskSummaryMetricsGridStyle,
  riskSummaryMetricValueStyle,
  riskSummaryVisualCardStyle,
  riskVisualColors,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualContract.ts";

export type RiskSummaryVisualCardProps = Readonly<{
  summary: RiskSummaryVisual;
  phase: "loading" | "ready" | "empty";
}>;

type MetricKey = keyof typeof RISK_SUMMARY_METRIC_LABELS;

const METRIC_KEYS = Object.freeze([
  "totalRisks",
  "elevatedRisks",
  "criticalRisks",
] as const satisfies readonly MetricKey[]);

const METRIC_ACCENTS: Readonly<Record<MetricKey, string>> = Object.freeze({
  totalRisks: riskVisualColors.text,
  elevatedRisks: riskVisualColors.warning,
  criticalRisks: riskVisualColors.critical,
});

export function RiskSummaryVisualCard(props: RiskSummaryVisualCardProps): React.ReactElement {
  const loading = props.phase === "loading";

  return (
    <section
      data-nx="risk-summary-visual"
      data-risk-visual-section="summary"
      aria-label="Risk summary"
      style={riskSummaryVisualCardStyle()}
    >
      <div style={riskSectionLabelStyle()}>Risk Summary</div>
      <div style={riskSummaryMetricsGridStyle()}>
        {METRIC_KEYS.map((metricKey) => (
          <div
            key={metricKey}
            data-risk-summary-metric={metricKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 0,
            }}
          >
            <div style={riskSummaryMetricLabelStyle()}>
              {RISK_SUMMARY_METRIC_LABELS[metricKey]}
            </div>
            <div style={riskSummaryMetricValueStyle(METRIC_ACCENTS[metricKey])}>
              {loading ? "—" : props.summary[metricKey]}
            </div>
          </div>
        ))}
      </div>
      {!loading ? (
        <p style={riskCardDetailStyle()}>
          Read-only scan of active scene risk markers.
        </p>
      ) : null}
    </section>
  );
}

export default RiskSummaryVisualCard;
