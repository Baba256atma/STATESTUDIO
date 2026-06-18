/**
 * INT:2:3 — Operational Intelligence Feed contract.
 *
 * Read-only feed from Intelligence Core (DS-3 → DS-7) into the existing
 * Operational Intelligence surface. No mutations, routing, or layout changes.
 */

import type { DashboardIntelligenceAdapterRegistry } from "./dashboardIntelligenceAdapterContract.ts";
import type { ExecutiveIntelligenceSnapshot } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import { EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT } from "../intelligence/executiveIntelligenceSnapshotContract.ts";

export const OPERATIONAL_FEED_DIAGNOSTIC = "[OPERATIONAL_FEED]" as const;

export const OPERATIONAL_FEED_READY_DIAGNOSTIC = "[OPERATIONAL_FEED_READY]" as const;

export const INT2_OPERATIONAL_FEED_COMPLETE_TAG = "[INT2_OPERATIONAL_FEED_COMPLETE]" as const;

export const OPERATIONAL_INTELLIGENCE_FEED_VERSION = "2.3.0" as const;

export type OperationalIntelligenceFeedSectionId =
  | "object_health"
  | "object_trend"
  | "relationship_health"
  | "relationship_dependency"
  | "operational_kpi_signals";

export type OperationalIntelligenceFeedSection = Readonly<{
  id: OperationalIntelligenceFeedSectionId;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  meta?: string;
  signalCount: number;
}>;

export type OperationalIntelligenceFeedStatus = "empty" | "bound";

export type OperationalIntelligenceFeedView = Readonly<{
  version: typeof OPERATIONAL_INTELLIGENCE_FEED_VERSION;
  feedStatus: OperationalIntelligenceFeedStatus;
  objectHealth: OperationalIntelligenceFeedSection;
  objectTrend: OperationalIntelligenceFeedSection;
  relationshipHealth: OperationalIntelligenceFeedSection;
  relationshipDependency: OperationalIntelligenceFeedSection;
  operationalKpiSignals: OperationalIntelligenceFeedSection;
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
    typeof OPERATIONAL_FEED_DIAGNOSTIC,
    typeof OPERATIONAL_FEED_READY_DIAGNOSTIC,
  ];
}>;

export type OperationalIntelligenceFeedBuildInput = Readonly<{
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

export const OPERATIONAL_FEED_DIAGNOSTICS = Object.freeze([
  OPERATIONAL_FEED_DIAGNOSTIC,
  OPERATIONAL_FEED_READY_DIAGNOSTIC,
] as const);

const EMPTY_SECTION = (
  id: OperationalIntelligenceFeedSectionId,
  title: string,
  fallback: string
): OperationalIntelligenceFeedSection =>
  Object.freeze({
    id,
    title,
    primaryValue: fallback,
    secondaryValue: "Awaiting certified intelligence.",
    signalCount: 0,
  });

export const EMPTY_OPERATIONAL_INTELLIGENCE_FEED_VIEW: OperationalIntelligenceFeedView = Object.freeze({
  version: OPERATIONAL_INTELLIGENCE_FEED_VERSION,
  feedStatus: "empty",
  objectHealth: EMPTY_SECTION("object_health", "Object Health", "No object health signals available."),
  objectTrend: EMPTY_SECTION("object_trend", "Object Trend", "No object trend signals available."),
  relationshipHealth: EMPTY_SECTION(
    "relationship_health",
    "Relationship Health",
    "No relationship health signals available."
  ),
  relationshipDependency: EMPTY_SECTION(
    "relationship_dependency",
    "Relationship Dependency",
    "No relationship dependency signals available."
  ),
  operationalKpiSignals: EMPTY_SECTION(
    "operational_kpi_signals",
    "Operational KPI Signals",
    "No operational KPI signals available."
  ),
  snapshot: EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT,
  feedReady: true,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  topologyMutation: false,
  legacyRouterUsage: false,
  diagnostics: OPERATIONAL_FEED_DIAGNOSTICS,
});
