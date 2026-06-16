"use client";

import React from "react";

import {
  TIMELINE_SUMMARY_METRIC_LABELS,
  type TimelineSummaryVisual,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualSurfaceContract.ts";
import {
  timelineCardDetailStyle,
  timelineSectionLabelStyle,
  timelineSummaryMetricLabelStyle,
  timelineSummaryMetricsGridStyle,
  timelineSummaryMetricTextValueStyle,
  timelineSummaryMetricValueStyle,
  timelineSummaryVisualCardStyle,
  timelineVisualColors,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualContract.ts";

export type TimelineSummaryVisualCardProps = Readonly<{
  summary: TimelineSummaryVisual;
  phase: "loading" | "ready" | "empty";
}>;

type NumericMetricKey = "totalEvents" | "decisionsRecorded" | "riskEvents";

const NUMERIC_METRIC_KEYS = Object.freeze([
  "totalEvents",
  "decisionsRecorded",
  "riskEvents",
] as const satisfies readonly NumericMetricKey[]);

const METRIC_ACCENTS: Readonly<Record<NumericMetricKey, string>> = Object.freeze({
  totalEvents: timelineVisualColors.text,
  decisionsRecorded: timelineVisualColors.warning,
  riskEvents: timelineVisualColors.critical,
});

export function TimelineSummaryVisualCard(
  props: TimelineSummaryVisualCardProps
): React.ReactElement {
  const loading = props.phase === "loading";

  return (
    <section
      data-nx="timeline-summary-visual"
      data-timeline-visual-section="summary"
      aria-label="Timeline summary"
      style={timelineSummaryVisualCardStyle()}
    >
      <div style={timelineSectionLabelStyle()}>Timeline Summary</div>
      <div style={timelineSummaryMetricsGridStyle()}>
        {NUMERIC_METRIC_KEYS.map((metricKey) => (
          <div
            key={metricKey}
            data-timeline-summary-metric={metricKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 0,
            }}
          >
            <div style={timelineSummaryMetricLabelStyle()}>
              {TIMELINE_SUMMARY_METRIC_LABELS[metricKey]}
            </div>
            <div style={timelineSummaryMetricValueStyle(METRIC_ACCENTS[metricKey])}>
              {loading ? "—" : props.summary[metricKey]}
            </div>
          </div>
        ))}
        <div
          data-timeline-summary-metric="lastActivity"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
            gridColumn: "1 / -1",
          }}
        >
          <div style={timelineSummaryMetricLabelStyle()}>
            {TIMELINE_SUMMARY_METRIC_LABELS.lastActivity}
          </div>
          <div style={timelineSummaryMetricTextValueStyle()}>
            {loading ? "—" : props.summary.lastActivity}
          </div>
        </div>
      </div>
      {!loading ? (
        <p style={timelineCardDetailStyle()}>
          Read-only scan of navigation history and scene timeline markers.
        </p>
      ) : null}
    </section>
  );
}

export default TimelineSummaryVisualCard;
