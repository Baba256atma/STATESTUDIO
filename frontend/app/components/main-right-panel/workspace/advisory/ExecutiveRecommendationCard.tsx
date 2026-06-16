"use client";

import React from "react";

import {
  ADVISORY_RECOMMENDATION_FIELD_LABELS,
  type AdvisoryRecommendationSurface,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryRecommendationContract.ts";
import { ADVISORY_CONFIDENCE_LABELS } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryStateContract.ts";
import {
  advisorySectionLabelStyle,
  advisoryVisualSpacing,
  executiveRecommendationCardShellStyle,
  executiveRecommendationFieldShellStyle,
  executiveRecommendationFieldValueStyle,
  executiveRecommendationSourcesStyle,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryVisualContract.ts";

export type ExecutiveRecommendationCardProps = Readonly<{
  recommendation: AdvisoryRecommendationSurface;
  phase: "loading" | "ready" | "empty";
}>;

type RecommendationFieldKey = keyof typeof ADVISORY_RECOMMENDATION_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "recommendation",
  "why",
  "expectedBenefit",
  "expectedRisk",
  "confidence",
] as const satisfies readonly RecommendationFieldKey[]);

function resolveFieldValue(
  recommendation: AdvisoryRecommendationSurface,
  fieldKey: RecommendationFieldKey
): string {
  if (fieldKey === "confidence") {
    return ADVISORY_CONFIDENCE_LABELS[recommendation.card.confidence];
  }
  return recommendation.card[fieldKey];
}

export function ExecutiveRecommendationCard(
  props: ExecutiveRecommendationCardProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const muted = loading || props.phase === "empty";

  return (
    <section
      data-nx="executive-recommendation-card"
      data-advisory-recommendation="true"
      data-advisory-consumes-intelligence="true"
      data-advisory-creates-recommendation="true"
      data-advisory-executes-actions="false"
      aria-label="Executive recommendation"
      style={executiveRecommendationCardShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: advisoryVisualSpacing.fieldGap,
        }}
      >
        <div style={advisorySectionLabelStyle()}>Executive Recommendation</div>
        <p style={executiveRecommendationSourcesStyle()}>
          {props.recommendation.sources.length > 0
            ? `Intelligence consumed from ${props.recommendation.sources.join(", ")}.`
            : "Awaiting certified workspace intelligence."}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: advisoryVisualSpacing.cardGap,
        }}
      >
        {FIELD_KEYS.map((fieldKey) => (
          <div
            key={fieldKey}
            data-advisory-recommendation-field={fieldKey}
            style={executiveRecommendationFieldShellStyle()}
          >
            <div style={advisorySectionLabelStyle()}>
              {ADVISORY_RECOMMENDATION_FIELD_LABELS[fieldKey]}
            </div>
            <div style={executiveRecommendationFieldValueStyle(muted ? undefined : undefined)}>
              {loading ? "Loading…" : resolveFieldValue(props.recommendation, fieldKey)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExecutiveRecommendationCard;
