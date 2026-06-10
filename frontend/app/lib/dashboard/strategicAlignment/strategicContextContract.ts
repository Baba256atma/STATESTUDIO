/**
 * Phase 6:2 — Strategic Context Contract.
 * Normalizes governance and decision intelligence feeds into strategic evaluation inputs.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DecisionGuidanceSnapshot } from "../decisionGuidance/decisionGuidanceContract.ts";
import type { GovernanceIntelligenceSnapshot } from "../governanceIntelligence/governanceIntelligenceContract.ts";
import type { ScenarioIntelligenceSnapshot } from "../scenarioIntelligence/scenarioIntelligenceContract.ts";
import type { WarRoomIntelligenceSnapshot } from "../warRoomIntelligence/warRoomIntelligenceContract.ts";
import type { ExecutiveAdvisorySnapshot } from "../executiveAdvisory/executiveAdvisoryContract.ts";
import type { AdvisoryConfidenceEvaluation } from "../executiveAdvisory/confidence/advisoryConfidenceContract.ts";

export const STRATEGIC_CONTEXT_CONTRACT_VERSION = "6.2.0";

export type StrategicContextSource =
  | "decision_guidance"
  | "governance"
  | "scenario"
  | "war_room"
  | "portfolio"
  | "program"
  | "enterprise";

export type DecisionGuidanceStrategicContext = Readonly<{
  source: "decision_guidance";
  focus: string;
  confidenceLevel: string;
  tradeoffSummary: string;
  guidanceSummary: string;
}>;

export type GovernanceStrategicContext = Readonly<{
  source: "governance";
  alignment: string;
  attention: string;
  governanceSummary: string;
}>;

export type ScenarioStrategicContext = Readonly<{
  source: "scenario";
  expectedImpact: string;
  confidence: string;
  comparisonSummary: string;
}>;

export type WarRoomStrategicContext = Readonly<{
  source: "war_room";
  decisionFocus: string;
  threatExposure: string;
  urgency: string;
}>;

/** Future compatibility — structural placeholders only. */
export type PortfolioStrategicContext = Readonly<{
  source: "portfolio";
  status: "pending_enrichment";
  summary: string;
}>;

export type ProgramStrategicContext = Readonly<{
  source: "program";
  status: "pending_enrichment";
  summary: string;
}>;

export type EnterpriseStrategicContext = Readonly<{
  source: "enterprise";
  status: "pending_enrichment";
  summary: string;
}>;

export type StrategicContext = Readonly<{
  decisionGuidance: DecisionGuidanceStrategicContext;
  governance: GovernanceStrategicContext;
  scenario: ScenarioStrategicContext;
  warRoom: WarRoomStrategicContext;
  portfolio: PortfolioStrategicContext;
  program: ProgramStrategicContext;
  enterprise: EnterpriseStrategicContext;
  advisoryFocus: string;
  confidenceLevel: string;
  confidenceLabel: string;
  sourceChain: readonly StrategicContextSource[];
}>;

export type StrategicContextAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type StrategicContextBuildInput = Readonly<{
  decisionGuidance: DecisionGuidanceSnapshot;
  governanceSnapshot: GovernanceIntelligenceSnapshot;
  advisorySnapshot: ExecutiveAdvisorySnapshot;
  confidenceEvaluation: AdvisoryConfidenceEvaluation;
  warRoomSnapshot: WarRoomIntelligenceSnapshot;
  scenarioSnapshot: ScenarioIntelligenceSnapshot;
}>;
