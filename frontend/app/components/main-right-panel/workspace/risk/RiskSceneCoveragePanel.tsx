"use client";

import React from "react";

import {
  RISK_SCENE_COVERAGE_LABELS,
  type RiskSceneCoverage,
} from "../../../../lib/ui/mrpWorkspace/risk/riskSceneAwarenessContract.ts";
import {
  riskCardDetailStyle,
  riskSceneCoverageCardStyle,
  riskSectionLabelStyle,
  riskSummaryMetricLabelStyle,
  riskSummaryMetricsGridStyle,
  riskSummaryMetricValueStyle,
  riskVisualColors,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualContract.ts";

export type RiskSceneCoveragePanelProps = Readonly<{
  coverage: RiskSceneCoverage;
  readOnly: true;
  phase: "loading" | "ready" | "empty";
}>;

type CoverageKey = keyof typeof RISK_SCENE_COVERAGE_LABELS;

const COVERAGE_KEYS = Object.freeze([
  "objectsMonitored",
  "objectsWithRisk",
  "criticalObjects",
] as const satisfies readonly CoverageKey[]);

const COVERAGE_ACCENTS: Readonly<Record<CoverageKey, string>> = Object.freeze({
  objectsMonitored: riskVisualColors.text,
  objectsWithRisk: riskVisualColors.warning,
  criticalObjects: riskVisualColors.critical,
});

export function RiskSceneCoveragePanel(
  props: RiskSceneCoveragePanelProps
): React.ReactElement {
  const loading = props.phase === "loading";

  return (
    <section
      data-nx="risk-scene-coverage"
      data-risk-scene-aware="true"
      data-risk-scene-readonly={props.readOnly ? "true" : "false"}
      aria-label="Risk coverage"
      style={riskSceneCoverageCardStyle()}
    >
      <div style={riskSectionLabelStyle()}>Risk Coverage</div>
      <div style={riskSummaryMetricsGridStyle()}>
        {COVERAGE_KEYS.map((coverageKey) => (
          <div
            key={coverageKey}
            data-risk-scene-coverage-metric={coverageKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 0,
            }}
          >
            <div style={riskSummaryMetricLabelStyle()}>
              {RISK_SCENE_COVERAGE_LABELS[coverageKey]}
            </div>
            <div style={riskSummaryMetricValueStyle(COVERAGE_ACCENTS[coverageKey])}>
              {loading ? "—" : props.coverage[coverageKey]}
            </div>
          </div>
        ))}
      </div>
      {!loading ? (
        <p style={riskCardDetailStyle()}>
          Read-only scene scan — no topology, camera, or object writes.
        </p>
      ) : null}
    </section>
  );
}

export default RiskSceneCoveragePanel;
