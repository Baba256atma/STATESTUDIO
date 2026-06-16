"use client";

import React from "react";

import {
  TIMELINE_SCENE_COVERAGE_LABELS,
  type TimelineSceneCoverage,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineSceneAwarenessContract.ts";
import {
  timelineCardDetailStyle,
  timelineSceneCoverageCardStyle,
  timelineSectionLabelStyle,
  timelineSummaryMetricLabelStyle,
  timelineSummaryMetricsGridStyle,
  timelineSummaryMetricValueStyle,
  timelineVisualColors,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualContract.ts";

export type TimelineSceneCoveragePanelProps = Readonly<{
  coverage: TimelineSceneCoverage;
  readOnly: true;
  phase: "loading" | "ready" | "empty";
}>;

type CoverageKey = keyof typeof TIMELINE_SCENE_COVERAGE_LABELS;

const COVERAGE_KEYS = Object.freeze([
  "objectsTracked",
  "objectsWithEvents",
  "recentEvents",
] as const satisfies readonly CoverageKey[]);

const COVERAGE_ACCENTS: Readonly<Record<CoverageKey, string>> = Object.freeze({
  objectsTracked: timelineVisualColors.text,
  objectsWithEvents: timelineVisualColors.warning,
  recentEvents: timelineVisualColors.accent,
});

export function TimelineSceneCoveragePanel(
  props: TimelineSceneCoveragePanelProps
): React.ReactElement {
  const loading = props.phase === "loading";

  return (
    <section
      data-nx="timeline-scene-coverage"
      data-timeline-scene-aware="true"
      data-timeline-scene-readonly={props.readOnly ? "true" : "false"}
      aria-label="Timeline coverage"
      style={timelineSceneCoverageCardStyle()}
    >
      <div style={timelineSectionLabelStyle()}>Timeline Coverage</div>
      <div style={timelineSummaryMetricsGridStyle()}>
        {COVERAGE_KEYS.map((coverageKey) => (
          <div
            key={coverageKey}
            data-timeline-scene-coverage-metric={coverageKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 0,
            }}
          >
            <div style={timelineSummaryMetricLabelStyle()}>
              {TIMELINE_SCENE_COVERAGE_LABELS[coverageKey]}
            </div>
            <div style={timelineSummaryMetricValueStyle(COVERAGE_ACCENTS[coverageKey])}>
              {loading ? "—" : props.coverage[coverageKey]}
            </div>
          </div>
        ))}
      </div>
      {!loading ? (
        <p style={timelineCardDetailStyle()}>
          Read-only scene scan — no topology, camera, or object writes.
        </p>
      ) : null}
    </section>
  );
}

export default TimelineSceneCoveragePanel;
