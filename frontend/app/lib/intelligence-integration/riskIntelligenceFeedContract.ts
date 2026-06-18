/**
 * INT:2:4 — Risk Intelligence Feed contract.
 *
 * Read-only feed from DS-6 Risk Intelligence into the existing Risk Dashboard
 * surface. No mutations, routing, or layout changes.
 */

import type { DashboardIntelligenceAdapterRegistry } from "./dashboardIntelligenceAdapterContract.ts";
import type { ExecutiveRiskSummary } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import { EMPTY_EXECUTIVE_RISK_SUMMARY } from "../risk-intelligence/executiveRiskSummaryContract.ts";

export const RISK_FEED_DIAGNOSTIC = "[RISK_FEED]" as const;

export const RISK_FEED_READY_DIAGNOSTIC = "[RISK_FEED_READY]" as const;

export const INT2_RISK_FEED_COMPLETE_TAG = "[INT2_RISK_FEED_COMPLETE]" as const;

export const RISK_INTELLIGENCE_FEED_VERSION = "2.4.0" as const;

export type RiskIntelligenceFeedSectionId =
  | "top_risks"
  | "risk_chains"
  | "risk_propagation"
  | "critical_vulnerabilities";

export type RiskIntelligenceFeedSection = Readonly<{
  id: RiskIntelligenceFeedSectionId;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  meta?: string;
  signalCount: number;
}>;

export type RiskIntelligenceFeedStatus = "empty" | "bound";

export type RiskIntelligenceFeedView = Readonly<{
  version: typeof RISK_INTELLIGENCE_FEED_VERSION;
  feedStatus: RiskIntelligenceFeedStatus;
  topRisks: RiskIntelligenceFeedSection;
  riskChains: RiskIntelligenceFeedSection;
  riskPropagation: RiskIntelligenceFeedSection;
  criticalVulnerabilities: RiskIntelligenceFeedSection;
  riskIntelligence: ExecutiveRiskSummary;
  feedReady: true;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [typeof RISK_FEED_DIAGNOSTIC, typeof RISK_FEED_READY_DIAGNOSTIC];
}>;

export type RiskIntelligenceFeedBuildInput = Readonly<{
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
  riskIntelligence?: ExecutiveRiskSummary;
  adapterRegistry?: DashboardIntelligenceAdapterRegistry;
}>;

export const RISK_FEED_DIAGNOSTICS = Object.freeze([
  RISK_FEED_DIAGNOSTIC,
  RISK_FEED_READY_DIAGNOSTIC,
] as const);

const EMPTY_SECTION = (
  id: RiskIntelligenceFeedSectionId,
  title: string,
  fallback: string
): RiskIntelligenceFeedSection =>
  Object.freeze({
    id,
    title,
    primaryValue: fallback,
    secondaryValue: "Awaiting certified DS-6 risk intelligence.",
    signalCount: 0,
  });

export const EMPTY_RISK_INTELLIGENCE_FEED_VIEW: RiskIntelligenceFeedView = Object.freeze({
  version: RISK_INTELLIGENCE_FEED_VERSION,
  feedStatus: "empty",
  topRisks: EMPTY_SECTION("top_risks", "Top Risks", "No top risk signals available."),
  riskChains: EMPTY_SECTION("risk_chains", "Risk Chains", "No risk chain signals available."),
  riskPropagation: EMPTY_SECTION("risk_propagation", "Risk Propagation", "No risk propagation signals available."),
  criticalVulnerabilities: EMPTY_SECTION(
    "critical_vulnerabilities",
    "Critical Vulnerabilities",
    "No critical vulnerability signals available."
  ),
  riskIntelligence: EMPTY_EXECUTIVE_RISK_SUMMARY,
  feedReady: true,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  topologyMutation: false,
  legacyRouterUsage: false,
  diagnostics: RISK_FEED_DIAGNOSTICS,
});
