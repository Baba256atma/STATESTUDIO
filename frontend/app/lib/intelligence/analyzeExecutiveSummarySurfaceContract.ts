/**
 * INT:1:4 — Analyze Executive Summary surface contract.
 *
 * Canonical read-only summary view for Analyze intelligence rendering.
 */

import type { AnalyzeIntelligenceBindingView } from "./analyzeIntelligenceBindingContract.ts";

export const ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC = "[ANALYZE_SUMMARY_SURFACE]" as const;

export const ANALYZE_SUMMARY_READY_DIAGNOSTIC = "[ANALYZE_SUMMARY_READY]" as const;

export const INT1_ANALYZE_SURFACE_COMPLETE_TAG = "[INT1_ANALYZE_SURFACE_COMPLETE]" as const;

/** @deprecated use ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC */
export const ANALYZE_SUMMARY_DIAGNOSTIC = ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC;

export const ANALYZE_EXECUTIVE_SUMMARY_VERSION = "1.4.0" as const;

export type AnalyzeExecutiveSummaryProfileSource = Readonly<{
  confidence: Readonly<{ score: number }>;
  scenarioSummary: Readonly<{
    recommendedScenarioLabel: string;
    scenarioCount: number;
  }>;
}>;

export type AnalyzeExecutiveSummaryBuildInput = Readonly<{
  intelligence: AnalyzeIntelligenceBindingView;
  profile?: AnalyzeExecutiveSummaryProfileSource | null;
}>;

export type AnalyzeExecutiveSummaryView = Readonly<{
  objectId: string;
  objectName: string;
  healthScore: number;
  healthLabel: string;
  impactScore: number;
  impactLabel: string;
  trendLabel: string;
  trendDetail: string;
  importanceScore: number;
  importanceLabel: string;
  riskScore: number;
  riskLabel: string;
  confidenceScore: number;
  confidenceLabel: string;
  scenarioSummaryLabel: string;
  scenarioSummaryDetail: string;
  summaryReady: true;
}>;

export const ANALYZE_SUMMARY_SURFACE_DIAGNOSTICS = Object.freeze([
  ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC,
  ANALYZE_SUMMARY_READY_DIAGNOSTIC,
] as const);

export const ANALYZE_SUMMARY_DIAGNOSTICS = ANALYZE_SUMMARY_SURFACE_DIAGNOSTICS;

function scenarioSummaryLabel(
  intelligence: AnalyzeIntelligenceBindingView,
  profile: AnalyzeExecutiveSummaryProfileSource | null | undefined
): string {
  const recommended = profile?.scenarioSummary.recommendedScenarioLabel?.trim();
  if (recommended) return recommended;
  const count = profile?.scenarioSummary.scenarioCount ?? 0;
  if (count > 0) return `${count} scenario(s)`;
  const summary = intelligence.scenarioSummary.trim();
  if (!summary) return "Unavailable";
  return summary.length > 48 ? `${summary.slice(0, 45)}...` : summary;
}

export function buildAnalyzeExecutiveSummaryView(
  input: AnalyzeExecutiveSummaryBuildInput
): AnalyzeExecutiveSummaryView {
  const { intelligence, profile = null } = input;
  const confidenceScore = profile?.confidence.score ?? 0;

  return Object.freeze({
    objectId: intelligence.objectId,
    objectName: intelligence.objectName,
    healthScore: intelligence.healthScore,
    healthLabel: String(intelligence.healthScore),
    impactScore: intelligence.impactScore,
    impactLabel: String(intelligence.impactScore),
    trendLabel: intelligence.trendLabel,
    trendDetail: intelligence.trendSummary,
    importanceScore: intelligence.importanceScore,
    importanceLabel: String(intelligence.importanceScore),
    riskScore: intelligence.riskScore,
    riskLabel: String(intelligence.riskScore),
    confidenceScore,
    confidenceLabel: String(confidenceScore),
    scenarioSummaryLabel: scenarioSummaryLabel(intelligence, profile),
    scenarioSummaryDetail: intelligence.scenarioSummary,
    summaryReady: true,
  });
}
