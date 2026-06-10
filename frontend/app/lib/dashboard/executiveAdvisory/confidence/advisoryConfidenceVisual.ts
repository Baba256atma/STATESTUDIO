/**
 * Phase 5:3 — Advisory confidence visual layer (Nexora Visual Intelligence Framework).
 */

import { dashboardVisualColors, resolveDirectionColor } from "../../dashboardVisualTheme.ts";
import type { ImpactDirection } from "../../dashboardVisualSignalContract.ts";
import type {
  AdvisoryConfidenceEvaluation,
  OverallAdvisoryConfidenceLevel,
} from "./advisoryConfidenceContract.ts";

export type ConfidenceBadgeTone = "low" | "moderate" | "high" | "very_high";

export type ConfidenceBadge = Readonly<{
  label: string;
  tone: ConfidenceBadgeTone;
  color: string;
  background: string;
}>;

export type ConfidenceDomainIndicator = Readonly<{
  domain: string;
  label: string;
  summary: string;
}>;

export type ConfidenceVisualSummary = Readonly<{
  badge: ConfidenceBadge;
  trendColor: string;
  trend: ImpactDirection;
  domainIndicators: readonly ConfidenceDomainIndicator[];
  executiveSummary: string;
}>;

function resolveBadgeTone(level: OverallAdvisoryConfidenceLevel): ConfidenceBadgeTone {
  return level;
}

function resolveBadgeColors(tone: ConfidenceBadgeTone): { color: string; background: string } {
  if (tone === "very_high") {
    return { color: dashboardVisualColors.success, background: "rgba(34, 197, 94, 0.12)" };
  }
  if (tone === "high") {
    return { color: dashboardVisualColors.success, background: "rgba(34, 197, 94, 0.08)" };
  }
  if (tone === "moderate") {
    return { color: dashboardVisualColors.warning, background: "rgba(234, 179, 8, 0.1)" };
  }
  return { color: dashboardVisualColors.risk, background: "rgba(239, 68, 68, 0.1)" };
}

export function buildConfidenceVisualSummary(
  evaluation: AdvisoryConfidenceEvaluation
): ConfidenceVisualSummary {
  const tone = resolveBadgeTone(evaluation.overall.level);
  const colors = resolveBadgeColors(tone);

  return Object.freeze({
    badge: Object.freeze({
      label: evaluation.overall.label,
      tone,
      color: colors.color,
      background: colors.background,
    }),
    trendColor: resolveDirectionColor(evaluation.overall.trend),
    trend: evaluation.overall.trend,
    domainIndicators: Object.freeze([
      Object.freeze({
        domain: "coverage",
        label: evaluation.coverage.label,
        summary: evaluation.coverage.summary,
      }),
      Object.freeze({
        domain: "consistency",
        label: evaluation.consistency.label,
        summary: evaluation.consistency.summary,
      }),
      Object.freeze({
        domain: "freshness",
        label: evaluation.freshness.label,
        summary: evaluation.freshness.summary,
      }),
      Object.freeze({
        domain: "diversity",
        label: evaluation.diversity.label,
        summary: evaluation.diversity.summary,
      }),
      Object.freeze({
        domain: "stability",
        label: evaluation.stability.label,
        summary: evaluation.stability.summary,
      }),
    ]),
    executiveSummary: evaluation.explanation.summary,
  });
}
