/**
 * INT:2:5 — Scenario Intelligence Feed contract.
 *
 * Read-only feed from DS-7 Scenario Intelligence into the existing Scenario
 * Dashboard surface. No simulation execution, mutations, or routing changes.
 */

import type { DashboardIntelligenceAdapterRegistry } from "./dashboardIntelligenceAdapterContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import { EMPTY_EXECUTIVE_SCENARIO_SUMMARY } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";

export const SCENARIO_FEED_DIAGNOSTIC = "[SCENARIO_FEED]" as const;

export const SCENARIO_FEED_READY_DIAGNOSTIC = "[SCENARIO_FEED_READY]" as const;

export const INT2_SCENARIO_FEED_COMPLETE_TAG = "[INT2_SCENARIO_FEED_COMPLETE]" as const;

export const SCENARIO_INTELLIGENCE_FEED_VERSION = "2.5.0" as const;

export type ScenarioIntelligenceFeedSectionId =
  | "scenario_summaries"
  | "scenario_recommendations"
  | "scenario_confidence"
  | "scenario_comparison_summaries";

export type ScenarioIntelligenceFeedSection = Readonly<{
  id: ScenarioIntelligenceFeedSectionId;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  meta?: string;
  signalCount: number;
}>;

export type ScenarioIntelligenceFeedStatus = "empty" | "bound";

export type ScenarioIntelligenceFeedView = Readonly<{
  version: typeof SCENARIO_INTELLIGENCE_FEED_VERSION;
  feedStatus: ScenarioIntelligenceFeedStatus;
  scenarioSummaries: ScenarioIntelligenceFeedSection;
  scenarioRecommendations: ScenarioIntelligenceFeedSection;
  scenarioConfidence: ScenarioIntelligenceFeedSection;
  scenarioComparisonSummaries: ScenarioIntelligenceFeedSection;
  scenarioIntelligence: ExecutiveScenarioSummary;
  feedReady: true;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  simulationActive: false;
  diagnostics: readonly [typeof SCENARIO_FEED_DIAGNOSTIC, typeof SCENARIO_FEED_READY_DIAGNOSTIC];
}>;

export type ScenarioIntelligenceFeedBuildInput = Readonly<{
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
  scenarioIntelligence?: ExecutiveScenarioSummary;
  adapterRegistry?: DashboardIntelligenceAdapterRegistry;
}>;

export const SCENARIO_FEED_DIAGNOSTICS = Object.freeze([
  SCENARIO_FEED_DIAGNOSTIC,
  SCENARIO_FEED_READY_DIAGNOSTIC,
] as const);

const EMPTY_SECTION = (
  id: ScenarioIntelligenceFeedSectionId,
  title: string,
  fallback: string
): ScenarioIntelligenceFeedSection =>
  Object.freeze({
    id,
    title,
    primaryValue: fallback,
    secondaryValue: "Awaiting certified DS-7 scenario intelligence.",
    signalCount: 0,
  });

export const EMPTY_SCENARIO_INTELLIGENCE_FEED_VIEW: ScenarioIntelligenceFeedView = Object.freeze({
  version: SCENARIO_INTELLIGENCE_FEED_VERSION,
  feedStatus: "empty",
  scenarioSummaries: EMPTY_SECTION("scenario_summaries", "Scenario Summaries", "No scenario summaries available."),
  scenarioRecommendations: EMPTY_SECTION(
    "scenario_recommendations",
    "Scenario Recommendations",
    "No scenario recommendations available."
  ),
  scenarioConfidence: EMPTY_SECTION(
    "scenario_confidence",
    "Scenario Confidence",
    "No scenario confidence signals available."
  ),
  scenarioComparisonSummaries: EMPTY_SECTION(
    "scenario_comparison_summaries",
    "Scenario Comparison Summaries",
    "No scenario comparison summaries available."
  ),
  scenarioIntelligence: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
  feedReady: true,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  topologyMutation: false,
  legacyRouterUsage: false,
  simulationActive: false,
  diagnostics: SCENARIO_FEED_DIAGNOSTICS,
});
