/**
 * INT:3 — Scenario Explanation Engine contract.
 *
 * Template-driven read-only executive scenario explanations from certified
 * DS-7 scenario intelligence. No AI generation, mutations, or simulation execution.
 */

import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import { EMPTY_EXECUTIVE_SCENARIO_SUMMARY } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import type { ScenarioComparisonFoundationRegistry } from "../scenario-intelligence/scenarioComparisonFoundationContract.ts";
import { EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY } from "../scenario-intelligence/scenarioComparisonFoundationContract.ts";
import type { ScenarioRecommendationRegistry } from "../scenario-intelligence/scenarioRecommendationContract.ts";
import { EMPTY_SCENARIO_RECOMMENDATION_REGISTRY } from "../scenario-intelligence/scenarioRecommendationContract.ts";
import type { ScenarioType } from "../scenario-intelligence/scenarioGenerationContract.ts";

export const SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC = "[SCENARIO_EXPLANATION_ENGINE]" as const;

export const SCENARIO_EXPLANATION_READY_DIAGNOSTIC = "[SCENARIO_EXPLANATION_READY]" as const;

export const INT3_SCENARIO_EXPLANATION_COMPLETE_TAG = "[INT3_SCENARIO_EXPLANATION_COMPLETE]" as const;

export const SCENARIO_EXPLANATION_ENGINE_VERSION = "3.5.0" as const;

export type ExecutiveScenarioExplanation = Readonly<{
  scenarioId: string;
  label: string;
  scenarioType: ScenarioType;
  summaryExplanation: string;
  comparisonExplanation: string | null;
  recommendationExplanation: string | null;
  confidenceExplanation: string;
  scenarioStrengths: string;
  scenarioWeaknesses: string;
  scenarioRecommendations: string;
  executiveSummary: string;
}>;

export type ScenarioExplanationRegistry = Readonly<{
  version: typeof SCENARIO_EXPLANATION_ENGINE_VERSION;
  explanationCount: number;
  explanations: readonly ExecutiveScenarioExplanation[];
  executiveSummary: string;
  scenarioIntelligence: ExecutiveScenarioSummary;
  comparisonFoundation: ScenarioComparisonFoundationRegistry;
  recommendationRegistry: ScenarioRecommendationRegistry;
  explanationReady: true;
  readOnly: true;
  simulationActive: false;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC,
    typeof SCENARIO_EXPLANATION_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioExplanationEngineBuildInput = Readonly<{
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
  scenarioIntelligence?: ExecutiveScenarioSummary;
  comparisonFoundation?: ScenarioComparisonFoundationRegistry;
  recommendationRegistry?: ScenarioRecommendationRegistry;
}>;

export const SCENARIO_EXPLANATION_ENGINE_DIAGNOSTICS = Object.freeze([
  SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC,
  SCENARIO_EXPLANATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_EXPLANATION_REGISTRY: ScenarioExplanationRegistry = Object.freeze({
  version: SCENARIO_EXPLANATION_ENGINE_VERSION,
  explanationCount: 0,
  explanations: Object.freeze([]),
  executiveSummary: "No scenario explanations are available.",
  scenarioIntelligence: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
  comparisonFoundation: EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY,
  recommendationRegistry: EMPTY_SCENARIO_RECOMMENDATION_REGISTRY,
  explanationReady: true,
  readOnly: true,
  simulationActive: false,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  topologyMutation: false,
  legacyRouterUsage: false,
  diagnostics: SCENARIO_EXPLANATION_ENGINE_DIAGNOSTICS,
});
