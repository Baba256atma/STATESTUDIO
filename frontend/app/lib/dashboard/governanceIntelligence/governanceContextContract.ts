/**
 * Phase 6:1 — Governance Context Contract.
 * Normalizes decision intelligence feeds into governance evaluation inputs.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { AdvisoryConfidenceEvaluation } from "../executiveAdvisory/confidence/advisoryConfidenceContract.ts";
import type { AdvisoryExplanationBundle } from "../executiveAdvisory/explainability/advisoryExplainabilityContract.ts";
import type { ExecutiveAdvisorySnapshot } from "../executiveAdvisory/executiveAdvisoryContract.ts";
import type { DecisionGuidanceSnapshot } from "../decisionGuidance/decisionGuidanceContract.ts";
import type { ScenarioIntelligenceSnapshot } from "../scenarioIntelligence/scenarioIntelligenceContract.ts";
import type { WarRoomIntelligenceSnapshot } from "../warRoomIntelligence/warRoomIntelligenceContract.ts";

export const GOVERNANCE_CONTEXT_CONTRACT_VERSION = "6.1.0";

export type GovernanceContextSource =
  | "decision_guidance"
  | "executive_advisory"
  | "war_room"
  | "scenario"
  | "policy"
  | "stakeholder"
  | "consensus";

export type DecisionGuidanceGovernanceContext = Readonly<{
  source: "decision_guidance";
  focus: string;
  confidenceLevel: string;
  tradeoffSummary: string;
  contextSummary: string;
}>;

export type ExecutiveAdvisoryGovernanceContext = Readonly<{
  source: "executive_advisory";
  focus: string;
  urgency: string;
  guidanceSummary: string;
}>;

export type WarRoomGovernanceContext = Readonly<{
  source: "war_room";
  decisionFocus: string;
  threatLevel: string;
  actionUrgency: string;
}>;

export type ScenarioGovernanceContext = Readonly<{
  source: "scenario";
  expectedImpact: string;
  confidence: string;
  comparisonSummary: string;
}>;

/** Future compatibility — structural placeholders only. */
export type PolicyGovernanceContext = Readonly<{
  source: "policy";
  status: "pending_enrichment";
  summary: string;
}>;

export type StakeholderGovernanceContext = Readonly<{
  source: "stakeholder";
  status: "pending_enrichment";
  summary: string;
}>;

export type ConsensusGovernanceContext = Readonly<{
  source: "consensus";
  status: "pending_enrichment";
  summary: string;
}>;

export type GovernanceConfidenceContext = Readonly<{
  level: string;
  label: string;
  trend: string;
  summary: string;
}>;

export type GovernanceExplainabilityContext = Readonly<{
  reasoningPath: string;
  evidenceSummary: string;
  assumptionsSummary: string;
}>;

export type GovernanceContext = Readonly<{
  decisionGuidance: DecisionGuidanceGovernanceContext;
  executiveAdvisory: ExecutiveAdvisoryGovernanceContext;
  warRoom: WarRoomGovernanceContext;
  scenario: ScenarioGovernanceContext;
  policy: PolicyGovernanceContext;
  stakeholder: StakeholderGovernanceContext;
  consensus: ConsensusGovernanceContext;
  confidence: GovernanceConfidenceContext;
  explainability: GovernanceExplainabilityContext;
  sourceChain: readonly GovernanceContextSource[];
}>;

export type GovernanceContextAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type GovernanceContextBuildInput = Readonly<{
  decisionGuidance: DecisionGuidanceSnapshot;
  advisorySnapshot: ExecutiveAdvisorySnapshot;
  confidenceEvaluation: AdvisoryConfidenceEvaluation;
  explanationBundle: AdvisoryExplanationBundle;
  warRoomSnapshot: WarRoomIntelligenceSnapshot;
  scenarioSnapshot: ScenarioIntelligenceSnapshot;
}>;
