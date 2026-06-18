/**
 * INT:1:2 — Analyze Intelligence Profile contract.
 *
 * Canonical read-only Analyze contract surfacing executive-facing health,
 * impact, trend, importance, risk, scenario summary, and confidence exposures.
 */

import type { ExecutiveIntelligenceSnapshot } from "./executiveIntelligenceSnapshotContract.ts";
import { EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT } from "./executiveIntelligenceSnapshotContract.ts";

export const ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTIC = "[ANALYZE_INTELLIGENCE_CONTRACT]" as const;

export const ANALYZE_INTELLIGENCE_CONTRACT_READY_DIAGNOSTIC =
  "[ANALYZE_INTELLIGENCE_CONTRACT_READY]" as const;

export const INT1_ANALYZE_CONTRACT_COMPLETE_TAG = "[INT1_ANALYZE_CONTRACT_COMPLETE]" as const;

export const ANALYZE_INTELLIGENCE_PROFILE_VERSION = "1.2.0" as const;

export type AnalyzeHealthExposure = Readonly<{
  score: number;
  summary: string;
  objectAverageScore: number;
  kpiAverageScore: number;
  contractReady: true;
}>;

export type AnalyzeImpactExposure = Readonly<{
  score: number;
  summary: string;
  objectAverageScore: number;
  kpiAverageScore: number;
  contractReady: true;
}>;

export type AnalyzeTrendExposure = Readonly<{
  summary: string;
  improvingCount: number;
  stableCount: number;
  decliningCount: number;
  volatileCount: number;
  topDecliningKpis: readonly string[];
  contractReady: true;
}>;

export type AnalyzeImportanceExposure = Readonly<{
  score: number;
  summary: string;
  recommendedAttentionCount: number;
  contractReady: true;
}>;

export type AnalyzeRiskExposure = Readonly<{
  score: number;
  summary: string;
  topRisks: readonly string[];
  recommendedAttentionCount: number;
  contractReady: true;
}>;

export type AnalyzeScenarioSummaryExposure = Readonly<{
  summary: string;
  scenarioCount: number;
  recommendedScenarioId: string;
  recommendedScenarioLabel: string;
  contractReady: true;
}>;

export type AnalyzeConfidenceExposure = Readonly<{
  score: number;
  summary: string;
  objectAverageScore: number;
  kpiAverageScore: number;
  contractReady: true;
}>;

export type AnalyzeIntelligenceProfile = Readonly<{
  profileId: string;
  version: typeof ANALYZE_INTELLIGENCE_PROFILE_VERSION;
  analyzeSummary: string;
  health: AnalyzeHealthExposure;
  impact: AnalyzeImpactExposure;
  trend: AnalyzeTrendExposure;
  importance: AnalyzeImportanceExposure;
  risk: AnalyzeRiskExposure;
  scenarioSummary: AnalyzeScenarioSummaryExposure;
  confidence: AnalyzeConfidenceExposure;
  snapshotVersion: string;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  mrpMutation: false;
  simulationActive: false;
  uiRendering: false;
  diagnostics: readonly [
    typeof ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTIC,
    typeof ANALYZE_INTELLIGENCE_CONTRACT_READY_DIAGNOSTIC,
  ];
}>;

export type AnalyzeIntelligenceProfileBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  risks?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  selectedObjectId?: string | null;
  snapshot?: ExecutiveIntelligenceSnapshot;
}>;

export const ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTICS = Object.freeze([
  ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTIC,
  ANALYZE_INTELLIGENCE_CONTRACT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_ANALYZE_INTELLIGENCE_PROFILE: AnalyzeIntelligenceProfile = Object.freeze({
  profileId: "analyze-intelligence:none",
  version: ANALYZE_INTELLIGENCE_PROFILE_VERSION,
  analyzeSummary: "No analyze intelligence profile is available.",
  health: Object.freeze({
    score: 0,
    summary: "No health signals available.",
    objectAverageScore: 0,
    kpiAverageScore: 0,
    contractReady: true,
  }),
  impact: Object.freeze({
    score: 0,
    summary: "No impact signals available.",
    objectAverageScore: 0,
    kpiAverageScore: 0,
    contractReady: true,
  }),
  trend: Object.freeze({
    summary: "No trend signals available.",
    improvingCount: 0,
    stableCount: 0,
    decliningCount: 0,
    volatileCount: 0,
    topDecliningKpis: Object.freeze([]),
    contractReady: true,
  }),
  importance: Object.freeze({
    score: 0,
    summary: "No importance signals available.",
    recommendedAttentionCount: 0,
    contractReady: true,
  }),
  risk: Object.freeze({
    score: 0,
    summary: "No risk signals available.",
    topRisks: Object.freeze([]),
    recommendedAttentionCount: 0,
    contractReady: true,
  }),
  scenarioSummary: Object.freeze({
    summary: "No scenario summary available.",
    scenarioCount: 0,
    recommendedScenarioId: "",
    recommendedScenarioLabel: "",
    contractReady: true,
  }),
  confidence: Object.freeze({
    score: 0,
    summary: "No confidence signals available.",
    objectAverageScore: 0,
    kpiAverageScore: 0,
    contractReady: true,
  }),
  snapshotVersion: EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT.version,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  routingMutation: false,
  mrpMutation: false,
  simulationActive: false,
  uiRendering: false,
  diagnostics: ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTICS,
});
