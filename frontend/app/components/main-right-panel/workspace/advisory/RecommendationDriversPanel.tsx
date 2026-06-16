"use client";

import React from "react";

import {
  RECOMMENDATION_DRIVER_SECTION_ORDER,
  type AdvisoryExplainabilitySurface,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryExplainabilityContract.ts";
import {
  advisoryExplainabilityDriverDetailStyle,
  advisoryExplainabilityDriverListStyle,
  advisoryExplainabilitySectionGridStyle,
  advisoryExplainabilityShellStyle,
  advisorySectionLabelStyle,
  advisoryVisualSpacing,
  executiveRecommendationSourcesStyle,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryVisualContract.ts";

export type RecommendationDriversPanelProps = Readonly<{
  explainability: AdvisoryExplainabilitySurface;
  phase: "loading" | "ready" | "empty";
}>;

export function RecommendationDriversPanel(
  props: RecommendationDriversPanelProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const sections = RECOMMENDATION_DRIVER_SECTION_ORDER.map((id) =>
    props.explainability.drivers.sections.find((section) => section.id === id)
  ).filter(Boolean);

  return (
    <section
      data-nx="recommendation-drivers-panel"
      data-advisory-explainability="true"
      data-advisory-explainability-section="drivers"
      aria-label="Recommendation drivers"
      style={advisoryExplainabilityShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: advisoryVisualSpacing.fieldGap,
        }}
      >
        <div style={advisorySectionLabelStyle()}>Recommendation Drivers</div>
        <p style={executiveRecommendationSourcesStyle()}>{props.explainability.purpose}</p>
      </header>

      <div style={advisoryExplainabilitySectionGridStyle()}>
        {sections.map((section) => (
          <div
            key={section!.id}
            data-advisory-driver-section={section!.id}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: advisoryVisualSpacing.fieldGap,
              minWidth: 0,
            }}
          >
            <div style={advisorySectionLabelStyle()}>{section!.label}</div>
            {loading ? (
              <div style={advisoryExplainabilityDriverDetailStyle()}>Loading…</div>
            ) : section!.drivers.length === 0 ? (
              <div style={advisoryExplainabilityDriverDetailStyle()}>No drivers available.</div>
            ) : (
              <ul style={advisoryExplainabilityDriverListStyle()}>
                {section!.drivers.map((driver) => (
                  <li key={driver.id}>
                    <div style={advisorySectionLabelStyle()}>{driver.label}</div>
                    <div style={advisoryExplainabilityDriverDetailStyle()}>{driver.detail}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecommendationDriversPanel;
