"use client";

import React from "react";

import type { AdvisoryExplainabilitySurface } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryExplainabilityContract.ts";
import {
  advisoryExplainabilityDriverDetailStyle,
  advisoryExplainabilityDriverListStyle,
  advisoryExplainabilityScoreStyle,
  advisoryExplainabilitySectionGridStyle,
  advisoryExplainabilityShellStyle,
  advisorySectionLabelStyle,
  advisoryVisualSpacing,
  executiveRecommendationSourcesStyle,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryVisualContract.ts";

export type ConfidenceAnalysisPanelProps = Readonly<{
  explainability: AdvisoryExplainabilitySurface;
  phase: "loading" | "ready" | "empty";
}>;

export function ConfidenceAnalysisPanel(
  props: ConfidenceAnalysisPanelProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const { confidenceAnalysis } = props.explainability;

  return (
    <section
      data-nx="confidence-analysis-panel"
      data-advisory-explainability="true"
      data-advisory-explainability-section="confidence"
      aria-label="Confidence analysis"
      style={advisoryExplainabilityShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: advisoryVisualSpacing.fieldGap,
        }}
      >
        <div style={advisorySectionLabelStyle()}>Confidence Analysis</div>
        <p style={executiveRecommendationSourcesStyle()}>
          Confidence score, supporting evidence, and uncertainty indicators.
        </p>
      </header>

      <div style={advisoryExplainabilitySectionGridStyle()}>
        <div
          data-advisory-confidence-score="true"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: advisoryVisualSpacing.fieldGap,
          }}
        >
          <div style={advisorySectionLabelStyle()}>Confidence Score</div>
          {loading ? (
            <div style={advisoryExplainabilityDriverDetailStyle()}>Loading…</div>
          ) : (
            <>
              <div style={advisoryExplainabilityScoreStyle()}>
                {confidenceAnalysis.confidenceScore}/100
              </div>
              <div style={advisoryExplainabilityDriverDetailStyle()}>
                {confidenceAnalysis.confidenceLabel}
              </div>
            </>
          )}
        </div>

        <div
          data-advisory-confidence-evidence="true"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: advisoryVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={advisorySectionLabelStyle()}>Supporting Evidence</div>
          {loading ? (
            <div style={advisoryExplainabilityDriverDetailStyle()}>Loading…</div>
          ) : (
            <ul style={advisoryExplainabilityDriverListStyle()}>
              {confidenceAnalysis.supportingEvidence.map((entry, index) => (
                <li key={`evidence:${index}`} style={advisoryExplainabilityDriverDetailStyle()}>
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          data-advisory-confidence-uncertainty="true"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: advisoryVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={advisorySectionLabelStyle()}>Uncertainty Indicators</div>
          {loading ? (
            <div style={advisoryExplainabilityDriverDetailStyle()}>Loading…</div>
          ) : (
            <ul style={advisoryExplainabilityDriverListStyle()}>
              {confidenceAnalysis.uncertaintyIndicators.map((entry, index) => (
                <li key={`uncertainty:${index}`} style={advisoryExplainabilityDriverDetailStyle()}>
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default ConfidenceAnalysisPanel;
