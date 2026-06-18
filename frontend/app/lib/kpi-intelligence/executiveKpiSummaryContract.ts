/**
 * DS:5:7 — Executive KPI Intelligence Aggregator contract.
 *
 * Read-only executive summary across KPI health, trend, impact,
 * dependencies, and confidence.
 */

import type { KpiHealthProfile } from "./kpiHealthContract.ts";
import type { KpiDependencyProfile } from "./kpiDependencyContract.ts";
import type { KpiImpactProfile } from "./kpiImpactContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";
import type { KpiTrendProfile } from "./kpiTrendContract.ts";

export const EXEC_KPI_SUMMARY_DIAGNOSTIC = "[EXEC_KPI_SUMMARY]" as const;

export const EXEC_KPI_SUMMARY_READY_DIAGNOSTIC = "[EXEC_KPI_SUMMARY_READY]" as const;

export const EXEC_KPI_SUMMARY_VERSION = "5.7.0" as const;

export type ExecutiveKpiAttentionLevel = "monitor" | "review" | "prioritize";

export type ExecutiveKpiSummaryProfile = Readonly<{
  kpiId: string;
  label: string;
  confidenceScore: number;
  dependencyScore: number;
  dependency?: KpiDependencyProfile;
  intelligence?: KpiIntelligenceProfile;
  health?: KpiHealthProfile;
  trend?: KpiTrendProfile;
  impact?: KpiImpactProfile;
}>;

export type ExecutiveKpiAttention = Readonly<{
  kpiId: string;
  attentionLevel: ExecutiveKpiAttentionLevel;
  reason: string;
}>;

export type ExecutiveKpiSummary = Readonly<{
  version: typeof EXEC_KPI_SUMMARY_VERSION;
  executiveSummary: string;
  kpiCount: number;
  averageHealthScore: number;
  averageTrendStrength: number;
  averageImpactScore: number;
  averageDependencyScore: number;
  averageConfidenceScore: number;
  topPerformingKpis: readonly string[];
  topDecliningKpis: readonly string[];
  topCriticalKpis: readonly string[];
  recommendedAttention: readonly ExecutiveKpiAttention[];
  profiles: readonly ExecutiveKpiSummaryProfile[];
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof EXEC_KPI_SUMMARY_DIAGNOSTIC,
    typeof EXEC_KPI_SUMMARY_READY_DIAGNOSTIC,
  ];
}>;

export type ExecutiveKpiSummaryBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly { kpiId: string; value: number; capturedAt?: string }[];
  intelligenceProfiles?: readonly KpiIntelligenceProfile[];
  healthProfiles?: readonly KpiHealthProfile[];
  dependencyProfiles?: readonly KpiDependencyProfile[];
  trendProfiles?: readonly KpiTrendProfile[];
  impactProfiles?: readonly KpiImpactProfile[];
}>;

export const EXEC_KPI_SUMMARY_DIAGNOSTICS = Object.freeze([
  EXEC_KPI_SUMMARY_DIAGNOSTIC,
  EXEC_KPI_SUMMARY_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_KPI_SUMMARY: ExecutiveKpiSummary = Object.freeze({
  version: EXEC_KPI_SUMMARY_VERSION,
  executiveSummary: "No KPI intelligence is available.",
  kpiCount: 0,
  averageHealthScore: 0,
  averageTrendStrength: 0,
  averageImpactScore: 0,
  averageDependencyScore: 0,
  averageConfidenceScore: 0,
  topPerformingKpis: Object.freeze([]),
  topDecliningKpis: Object.freeze([]),
  topCriticalKpis: Object.freeze([]),
  recommendedAttention: Object.freeze([]),
  profiles: Object.freeze([]),
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  diagnostics: EXEC_KPI_SUMMARY_DIAGNOSTICS,
});
