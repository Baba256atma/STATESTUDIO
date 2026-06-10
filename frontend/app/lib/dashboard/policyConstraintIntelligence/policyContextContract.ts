/**
 * Phase 6:3 — Policy Context Contract.
 * Normalizes governance, strategic, and decision feeds into policy evaluation inputs.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DecisionGuidanceSnapshot } from "../decisionGuidance/decisionGuidanceContract.ts";
import type { GovernanceIntelligenceSnapshot } from "../governanceIntelligence/governanceIntelligenceContract.ts";
import type { StrategicAlignmentSnapshot } from "../strategicAlignment/strategicAlignmentContract.ts";
import type { ScenarioIntelligenceSnapshot } from "../scenarioIntelligence/scenarioIntelligenceContract.ts";
import type { WarRoomIntelligenceSnapshot } from "../warRoomIntelligence/warRoomIntelligenceContract.ts";

export const POLICY_CONTEXT_CONTRACT_VERSION = "6.3.0";

export type PolicyContextSource =
  | "decision_guidance"
  | "governance"
  | "strategic_alignment"
  | "scenario"
  | "regulatory"
  | "enterprise_policy"
  | "stakeholder";

export type DecisionGuidancePolicyContext = Readonly<{
  source: "decision_guidance";
  focus: string;
  confidenceLevel: string;
  tradeoffSummary: string;
}>;

export type GovernancePolicyContext = Readonly<{
  source: "governance";
  alignment: string;
  attention: string;
  policyReviewStatus: string;
  conflictIndicator: string;
}>;

export type StrategicAlignmentPolicyContext = Readonly<{
  source: "strategic_alignment";
  alignmentScore: string;
  strategicAttention: string;
  tensionLevel: string;
}>;

export type ScenarioPolicyContext = Readonly<{
  source: "scenario";
  expectedImpact: string;
  confidence: string;
}>;

/** Future compatibility — structural placeholders only. */
export type RegulatoryPolicyContext = Readonly<{
  source: "regulatory";
  status: "pending_enrichment";
  summary: string;
}>;

export type EnterprisePolicyContext = Readonly<{
  source: "enterprise_policy";
  status: "pending_enrichment";
  summary: string;
}>;

export type StakeholderPolicyContext = Readonly<{
  source: "stakeholder";
  status: "pending_enrichment";
  summary: string;
}>;

export type PolicyContext = Readonly<{
  decisionGuidance: DecisionGuidancePolicyContext;
  governance: GovernancePolicyContext;
  strategicAlignment: StrategicAlignmentPolicyContext;
  scenario: ScenarioPolicyContext;
  warRoomUrgency: string;
  warRoomExposure: string;
  regulatory: RegulatoryPolicyContext;
  enterprisePolicy: EnterprisePolicyContext;
  stakeholder: StakeholderPolicyContext;
  sourceChain: readonly PolicyContextSource[];
}>;

export type PolicyContextAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type PolicyContextBuildInput = Readonly<{
  decisionGuidance: DecisionGuidanceSnapshot;
  governanceSnapshot: GovernanceIntelligenceSnapshot;
  strategicSnapshot: StrategicAlignmentSnapshot;
  scenarioSnapshot: ScenarioIntelligenceSnapshot;
  warRoomSnapshot: WarRoomIntelligenceSnapshot;
}>;
