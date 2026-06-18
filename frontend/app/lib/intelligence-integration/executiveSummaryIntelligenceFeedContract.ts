/**
 * INT:2:2 — Executive Summary Intelligence Feed contract.
 *
 * Read-only feed from Intelligence Core (DS-3 → DS-7) into the existing
 * Executive Summary surface. No mutations, routing, or layout changes.
 */

import type { DashboardIntelligenceAdapterRegistry } from "./dashboardIntelligenceAdapterContract.ts";
import type { ExecutiveIntelligenceSnapshot } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import { EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT } from "../intelligence/executiveIntelligenceSnapshotContract.ts";

export const EXEC_SUMMARY_FEED_DIAGNOSTIC = "[EXEC_SUMMARY_FEED]" as const;

export const EXEC_SUMMARY_FEED_READY_DIAGNOSTIC = "[EXEC_SUMMARY_FEED_READY]" as const;

export const INT2_EXEC_SUMMARY_COMPLETE_TAG = "[INT2_EXEC_SUMMARY_COMPLETE]" as const;

export const EXEC_SUMMARY_INTELLIGENCE_FEED_VERSION = "2.2.0" as const;

export type ExecutiveSummaryIntelligenceFeedSectionId =
  | "top_health_signals"
  | "top_risks"
  | "top_kpi_signals"
  | "top_scenario_signals";

export type ExecutiveSummaryIntelligenceFeedSection = Readonly<{
  id: ExecutiveSummaryIntelligenceFeedSectionId;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  signalCount: number;
}>;

export type ExecutiveSummaryIntelligenceFeedStatus = "empty" | "bound";

export type ExecutiveSummaryIntelligenceFeedView = Readonly<{
  version: typeof EXEC_SUMMARY_INTELLIGENCE_FEED_VERSION;
  feedStatus: ExecutiveSummaryIntelligenceFeedStatus;
  topHealthSignals: ExecutiveSummaryIntelligenceFeedSection;
  topRisks: ExecutiveSummaryIntelligenceFeedSection;
  topKpiSignals: ExecutiveSummaryIntelligenceFeedSection;
  topScenarioSignals: ExecutiveSummaryIntelligenceFeedSection;
  snapshot: ExecutiveIntelligenceSnapshot;
  feedReady: true;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof EXEC_SUMMARY_FEED_DIAGNOSTIC,
    typeof EXEC_SUMMARY_FEED_READY_DIAGNOSTIC,
  ];
}>;

export type ExecutiveSummaryIntelligenceFeedBuildInput = Readonly<{
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
  adapterRegistry?: DashboardIntelligenceAdapterRegistry;
}>;

export const EXEC_SUMMARY_FEED_DIAGNOSTICS = Object.freeze([
  EXEC_SUMMARY_FEED_DIAGNOSTIC,
  EXEC_SUMMARY_FEED_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_SECTION: ExecutiveSummaryIntelligenceFeedSection =
  Object.freeze({
    id: "top_health_signals",
    title: "Top Health Signals",
    primaryValue: "No intelligence signals available.",
    secondaryValue: "Awaiting certified object intelligence.",
    signalCount: 0,
  });

export const EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_VIEW: ExecutiveSummaryIntelligenceFeedView =
  Object.freeze({
    version: EXEC_SUMMARY_INTELLIGENCE_FEED_VERSION,
    feedStatus: "empty",
    topHealthSignals: Object.freeze({
      ...EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_SECTION,
      id: "top_health_signals",
      title: "Top Health Signals",
    }),
    topRisks: Object.freeze({
      ...EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_SECTION,
      id: "top_risks",
      title: "Top Risks",
      primaryValue: "No risk signals available.",
      secondaryValue: "Awaiting certified risk intelligence.",
    }),
    topKpiSignals: Object.freeze({
      ...EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_SECTION,
      id: "top_kpi_signals",
      title: "Top KPI Signals",
      primaryValue: "No KPI signals available.",
      secondaryValue: "Awaiting certified KPI intelligence.",
    }),
    topScenarioSignals: Object.freeze({
      ...EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_SECTION,
      id: "top_scenario_signals",
      title: "Top Scenario Signals",
      primaryValue: "No scenario signals available.",
      secondaryValue: "Awaiting certified scenario intelligence.",
    }),
    snapshot: EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT,
    feedReady: true,
    readOnly: true,
    sceneMutation: false,
    objectMutation: false,
    mrpMutation: false,
    routingMutation: false,
    topologyMutation: false,
    legacyRouterUsage: false,
    diagnostics: EXEC_SUMMARY_FEED_DIAGNOSTICS,
  });
