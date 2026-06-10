"use client";

import React from "react";
import type { AdvisoryExplanationBundle } from "../../../lib/dashboard/executiveAdvisory/explainability/advisoryExplainabilityContract.ts";
import { buildExplainabilityVisualSummary } from "../../../lib/dashboard/executiveAdvisory/explainability/advisoryExplainabilityVisual.ts";
import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { AdvisoryDomainCard } from "./AdvisoryDomainCard.tsx";

export type AdvisoryExplainabilitySectionProps = Readonly<{
  explanationBundle: AdvisoryExplanationBundle;
  dataNx?: string;
}>;

export function AdvisoryExplainabilitySection(
  props: AdvisoryExplainabilitySectionProps
): React.ReactElement {
  const { explanationBundle, dataNx = "advisory-explainability" } = props;
  const visual = buildExplainabilityVisualSummary(explanationBundle);

  return (
    <div
      data-nx={dataNx}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.md,
      }}
    >
      <span style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Advisory Explainability
      </span>

      <div
        style={{
          padding: dashboardVisualSpacing.sm,
          borderRadius: 8,
          border: `1px solid ${dashboardVisualColors.border}`,
          background: dashboardVisualColors.surface,
        }}
      >
        <span style={{ ...dashboardVisualTypography.cardTitle, color: dashboardVisualColors.text }}>
          {visual.guidanceCard.title}
        </span>
        <p style={{ margin: `${dashboardVisualSpacing.xs}px 0`, ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
          {visual.guidanceCard.primaryValue}
        </p>
        <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>{visual.guidanceCard.meta}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="supporting_evidence"
          title={visual.evidenceCard.title}
          primaryValue={visual.evidenceCard.primaryValue}
          secondaryValue={visual.evidenceCard.secondaryValue}
          meta={visual.evidenceCard.meta}
        />
        <AdvisoryDomainCard
          domain="reasoning_path"
          title={visual.reasoningCard.title}
          primaryValue={visual.reasoningCard.primaryValue}
          secondaryValue={visual.reasoningCard.secondaryValue}
        />
        <AdvisoryDomainCard
          domain="confidence_explanation"
          title={visual.confidenceCard.title}
          primaryValue={visual.confidenceCard.primaryValue}
          secondaryValue={visual.confidenceCard.secondaryValue}
          meta={visual.confidenceCard.meta}
        />
        <AdvisoryDomainCard
          domain="assumptions_unknowns"
          title={visual.assumptionsCard.title}
          primaryValue={visual.assumptionsCard.primaryValue}
          secondaryValue={visual.assumptionsCard.secondaryValue}
          meta={visual.assumptionsCard.meta}
        />
      </div>
    </div>
  );
}

export default AdvisoryExplainabilitySection;
