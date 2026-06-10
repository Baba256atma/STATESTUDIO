/**
 * Phase 5:4 — Advisory explainability visual layer.
 */

import { dashboardVisualColors } from "../../dashboardVisualTheme.ts";
import type { AdvisoryExplanationBundle } from "./advisoryExplainabilityContract.ts";

export type ExplainabilityCard = Readonly<{
  domain: string;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  meta?: string;
}>;

export type ExplainabilityVisualSummary = Readonly<{
  guidanceCard: ExplainabilityCard;
  evidenceCard: ExplainabilityCard;
  reasoningCard: ExplainabilityCard;
  confidenceCard: ExplainabilityCard;
  assumptionsCard: ExplainabilityCard;
}>;

export function buildExplainabilityVisualSummary(
  bundle: AdvisoryExplanationBundle
): ExplainabilityVisualSummary {
  const topEvidence = [
    ...bundle.supportingEvidence.operational.slice(0, 1),
    ...bundle.supportingEvidence.risk.slice(0, 1),
    ...bundle.supportingEvidence.timeline.slice(0, 1),
  ];

  const driverLabels = bundle.confidenceDrivers.drivers.map((entry) => entry.label).join(" · ");
  const limiterLabels = bundle.confidenceLimiters.limiters.map((entry) => entry.label).join(" · ");

  return Object.freeze({
    guidanceCard: Object.freeze({
      domain: "guidance_explanation",
      title: "Guidance Explanation",
      primaryValue: bundle.guidance.executiveSummary,
      secondaryValue: bundle.guidance.primaryFactors.join(" · "),
      meta: bundle.guidance.whyThisGuidance,
    }),
    evidenceCard: Object.freeze({
      domain: "supporting_evidence",
      title: "Supporting Evidence",
      primaryValue: bundle.supportingEvidence.summary,
      secondaryValue: topEvidence.map((entry) => entry.label).join(" · "),
      meta: "Operational · Risk · Timeline · Scenario · War Room",
    }),
    reasoningCard: Object.freeze({
      domain: "reasoning_path",
      title: "Reasoning Path",
      primaryValue: bundle.reasoningPath.pathLabel,
      secondaryValue: bundle.reasoningPath.summary,
    }),
    confidenceCard: Object.freeze({
      domain: "confidence_explanation",
      title: "Confidence Explanation",
      primaryValue: driverLabels || "No major confidence drivers",
      secondaryValue: limiterLabels || "No major confidence limiters",
      meta: `${bundle.confidenceDrivers.summary} · ${bundle.confidenceLimiters.summary}`,
    }),
    assumptionsCard: Object.freeze({
      domain: "assumptions_unknowns",
      title: "Assumptions & Unknowns",
      primaryValue: bundle.assumptionsAndUnknowns.summary,
      secondaryValue: bundle.assumptionsAndUnknowns.entries
        .slice(0, 2)
        .map((entry) => entry.label)
        .join(" · "),
      meta: bundle.assumptionsAndUnknowns.entries
        .slice(0, 2)
        .map((entry) => entry.detail)
        .join(" · "),
    }),
  });
}

export function explainabilityCardStyle(): Readonly<{
  border: string;
  background: string;
  color: string;
}> {
  return Object.freeze({
    border: dashboardVisualColors.border,
    background: dashboardVisualColors.surface,
    color: dashboardVisualColors.text,
  });
}
