/**
 * INT:3 — KPI Explanation Engine contract.
 *
 * Read-only executive KPI explanations from certified DS-5 intelligence.
 * No mutations, routing, scene, or topology changes.
 */

import type { ExecutiveKpiSummary } from "../kpi-intelligence/executiveKpiSummaryContract.ts";
import { EMPTY_EXECUTIVE_KPI_SUMMARY } from "../kpi-intelligence/executiveKpiSummaryContract.ts";

export const KPI_EXPLANATION_ENGINE_DIAGNOSTIC = "[KPI_EXPLANATION_ENGINE]" as const;

export const KPI_EXPLANATION_READY_DIAGNOSTIC = "[KPI_EXPLANATION_READY]" as const;

export const INT3_KPI_EXPLANATION_COMPLETE_TAG = "[INT3_KPI_EXPLANATION_COMPLETE]" as const;

export const KPI_EXPLANATION_ENGINE_VERSION = "3.1.0" as const;

export type KpiExplanationKind = "improving" | "declining" | "critical" | "stable";

export type ExecutiveKpiExplanation = Readonly<{
  kpiId: string;
  label: string;
  kind: KpiExplanationKind;
  headline: string;
  healthExplanation: string;
  trendExplanation: string;
  impactExplanation: string;
  confidenceExplanation: string;
  executiveSummary: string;
  whyImproving: string | null;
  whyDeclining: string | null;
  whyCritical: string | null;
}>;

export type KpiExplanationRegistry = Readonly<{
  version: typeof KPI_EXPLANATION_ENGINE_VERSION;
  explanationCount: number;
  explanations: readonly ExecutiveKpiExplanation[];
  improvingExplanations: readonly ExecutiveKpiExplanation[];
  decliningExplanations: readonly ExecutiveKpiExplanation[];
  criticalExplanations: readonly ExecutiveKpiExplanation[];
  executiveSummary: string;
  kpiIntelligence: ExecutiveKpiSummary;
  explanationReady: true;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof KPI_EXPLANATION_ENGINE_DIAGNOSTIC,
    typeof KPI_EXPLANATION_READY_DIAGNOSTIC,
  ];
}>;

export type KpiExplanationEngineBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  kpiIntelligence?: ExecutiveKpiSummary;
}>;

export const KPI_EXPLANATION_ENGINE_DIAGNOSTICS = Object.freeze([
  KPI_EXPLANATION_ENGINE_DIAGNOSTIC,
  KPI_EXPLANATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_EXPLANATION_REGISTRY: KpiExplanationRegistry = Object.freeze({
  version: KPI_EXPLANATION_ENGINE_VERSION,
  explanationCount: 0,
  explanations: Object.freeze([]),
  improvingExplanations: Object.freeze([]),
  decliningExplanations: Object.freeze([]),
  criticalExplanations: Object.freeze([]),
  executiveSummary: "No KPI explanations are available.",
  kpiIntelligence: EMPTY_EXECUTIVE_KPI_SUMMARY,
  explanationReady: true,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  topologyMutation: false,
  legacyRouterUsage: false,
  diagnostics: KPI_EXPLANATION_ENGINE_DIAGNOSTICS,
});
