/**
 * DS:7:9 — Scenario Recommendation Engine contract.
 *
 * Read-only decision recommendation profiles derived from scenario results.
 * Foundation only — no UI rendering, scene mutation, or execution authority.
 */

import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryContract.ts";
import { EMPTY_EXECUTIVE_SCENARIO_SUMMARY } from "./executiveScenarioSummaryContract.ts";
import type { ScenarioRegistry, ScenarioResult, ScenarioType } from "./scenarioGenerationContract.ts";
import { EMPTY_SCENARIO_REGISTRY } from "./scenarioGenerationContract.ts";

export const SCENARIO_RECOMMENDATION_DIAGNOSTIC = "[SCENARIO_RECOMMENDATION]" as const;

export const SCENARIO_RECOMMENDATION_READY_DIAGNOSTIC = "[SCENARIO_RECOMMENDATION_READY]" as const;

export const SCENARIO_RECOMMENDATION_ENGINE_VERSION = "7.9.0" as const;

export type ScenarioRecommendationConfidenceLevel = "low" | "moderate" | "high";

export type ScenarioRecommendationReasonKind =
  | "impact_confidence"
  | "composite_impact"
  | "opportunity_signal"
  | "threat_posture"
  | "scenario_result"
  | "comparative_advantage";

export type ScenarioRecommendationSupportingReason = Readonly<{
  reasonId: string;
  kind: ScenarioRecommendationReasonKind;
  label: string;
  detail: string;
  weight: number;
}>;

export type ScenarioRecommendationCandidateScore = Readonly<{
  scenarioId: string;
  scenarioType: ScenarioType;
  label: string;
  recommendationScore: number;
  rank: number;
}>;

export type ScenarioRecommendationProfile = Readonly<{
  recommendationId: string;
  recommendedScenarioId: string;
  recommendedScenarioType: ScenarioType;
  recommendedScenarioLabel: string;
  recommendedScenarioResult: ScenarioResult;
  supportingReasons: readonly ScenarioRecommendationSupportingReason[];
  confidence: number;
  confidenceLevel: ScenarioRecommendationConfidenceLevel;
  candidateScores: readonly ScenarioRecommendationCandidateScore[];
  scenarioResultCount: number;
  recommendationReady: true;
  readOnly: true;
}>;

export type ScenarioRecommendationRegistry = Readonly<{
  version: typeof SCENARIO_RECOMMENDATION_ENGINE_VERSION;
  profile: ScenarioRecommendationProfile;
  scenarioResults: readonly ScenarioResult[];
  scenarioRegistry: ScenarioRegistry;
  executiveScenarioSummary: ExecutiveScenarioSummary;
  recommendationReady: true;
  readOnly: true;
  sceneMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof SCENARIO_RECOMMENDATION_DIAGNOSTIC,
    typeof SCENARIO_RECOMMENDATION_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioRecommendationBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  risks?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  scenarioIds?: readonly string[];
  scenarioRegistry?: ScenarioRegistry;
  scenarioResults?: readonly ScenarioResult[];
  executiveScenarioSummary?: ExecutiveScenarioSummary;
}>;

export const SCENARIO_RECOMMENDATION_DIAGNOSTICS = Object.freeze([
  SCENARIO_RECOMMENDATION_DIAGNOSTIC,
  SCENARIO_RECOMMENDATION_READY_DIAGNOSTIC,
] as const);

const EMPTY_RECOMMENDATION_PROFILE: ScenarioRecommendationProfile = Object.freeze({
  recommendationId: "scenario-recommendation:none",
  recommendedScenarioId: "",
  recommendedScenarioType: "baseline",
  recommendedScenarioLabel: "No recommendation",
  recommendedScenarioResult: Object.freeze({
    scenarioId: "",
    scenarioType: "baseline",
    label: "No recommendation",
    summary: "No scenario results are available for recommendation.",
    outcomeScore: null,
    definition: Object.freeze({
      scenarioId: "",
      label: "No recommendation",
      scenarioType: "baseline",
      description: "",
      assumptions: Object.freeze({}),
      focusObjectIds: Object.freeze([]),
      foundationOnly: true,
      generationActive: false,
    }),
    impact: Object.freeze({
      scenarioId: "",
      scenarioType: "baseline",
      impactedObjectIds: Object.freeze([]),
      impactedKpiIds: Object.freeze([]),
      impactAreas: Object.freeze([]),
      baselineScore: 0,
      projectedScore: null,
      severity: 0,
      confidence: 0,
      impactReady: true,
    }),
    evaluationReady: true,
    simulationActive: false,
  }),
  supportingReasons: Object.freeze([]),
  confidence: 0,
  confidenceLevel: "low",
  candidateScores: Object.freeze([]),
  scenarioResultCount: 0,
  recommendationReady: true,
  readOnly: true,
});

export const EMPTY_SCENARIO_RECOMMENDATION_REGISTRY: ScenarioRecommendationRegistry = Object.freeze({
  version: SCENARIO_RECOMMENDATION_ENGINE_VERSION,
  profile: EMPTY_RECOMMENDATION_PROFILE,
  scenarioResults: Object.freeze([]),
  scenarioRegistry: EMPTY_SCENARIO_REGISTRY,
  executiveScenarioSummary: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
  recommendationReady: true,
  readOnly: true,
  sceneMutation: false,
  simulationActive: false,
  diagnostics: SCENARIO_RECOMMENDATION_DIAGNOSTICS,
});
