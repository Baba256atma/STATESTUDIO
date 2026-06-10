/**
 * Phase 6:4 — Stakeholder Context Contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DecisionGuidanceSnapshot } from "../decisionGuidance/decisionGuidanceContract.ts";
import type { GovernanceIntelligenceSnapshot } from "../governanceIntelligence/governanceIntelligenceContract.ts";
import type { StrategicAlignmentSnapshot } from "../strategicAlignment/strategicAlignmentContract.ts";
import type { PolicyConstraintIntelligenceSnapshot } from "../policyConstraintIntelligence/policyConstraintIntelligenceContract.ts";
import type { ScenarioIntelligenceSnapshot } from "../scenarioIntelligence/scenarioIntelligenceContract.ts";
import type { WarRoomIntelligenceSnapshot } from "../warRoomIntelligence/warRoomIntelligenceContract.ts";
import type { AdvisoryConfidenceEvaluation } from "../executiveAdvisory/confidence/advisoryConfidenceContract.ts";

export const STAKEHOLDER_CONTEXT_CONTRACT_VERSION = "6.4.0";

export type StakeholderContextSource =
  | "decision_guidance"
  | "governance"
  | "strategic_alignment"
  | "policy_constraint"
  | "scenario"
  | "consensus"
  | "enterprise"
  | "program";

export type DecisionGuidanceStakeholderContext = Readonly<{
  source: "decision_guidance";
  focus: string;
  confidenceLevel: string;
  guidanceSummary: string;
}>;

export type GovernanceStakeholderContext = Readonly<{
  source: "governance";
  alignment: string;
  attention: string;
  stakeholderSummary: string;
}>;

export type StrategicAlignmentStakeholderContext = Readonly<{
  source: "strategic_alignment";
  alignmentScore: string;
  tensionLevel: string;
  strategicAttention: string;
}>;

export type PolicyStakeholderContext = Readonly<{
  source: "policy_constraint";
  policyAlignment: string;
  constraintSeverity: string;
  policyAttention: string;
}>;

export type ScenarioStakeholderContext = Readonly<{
  source: "scenario";
  expectedImpact: string;
  confidence: string;
}>;

export type ConsensusStakeholderContext = Readonly<{
  source: "consensus";
  status: "pending_enrichment";
  summary: string;
}>;

export type EnterpriseStakeholderContext = Readonly<{
  source: "enterprise";
  status: "pending_enrichment";
  summary: string;
}>;

export type ProgramStakeholderContext = Readonly<{
  source: "program";
  status: "pending_enrichment";
  summary: string;
}>;

export type StakeholderContext = Readonly<{
  decisionGuidance: DecisionGuidanceStakeholderContext;
  governance: GovernanceStakeholderContext;
  strategicAlignment: StrategicAlignmentStakeholderContext;
  policy: PolicyStakeholderContext;
  scenario: ScenarioStakeholderContext;
  warRoomUrgency: string;
  warRoomExposure: string;
  confidenceLevel: string;
  confidenceLabel: string;
  consensus: ConsensusStakeholderContext;
  enterprise: EnterpriseStakeholderContext;
  program: ProgramStakeholderContext;
  sourceChain: readonly StakeholderContextSource[];
}>;

export type StakeholderContextAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type StakeholderContextBuildInput = Readonly<{
  decisionGuidance: DecisionGuidanceSnapshot;
  governanceSnapshot: GovernanceIntelligenceSnapshot;
  strategicSnapshot: StrategicAlignmentSnapshot;
  policySnapshot: PolicyConstraintIntelligenceSnapshot;
  scenarioSnapshot: ScenarioIntelligenceSnapshot;
  warRoomSnapshot: WarRoomIntelligenceSnapshot;
  confidenceEvaluation: AdvisoryConfidenceEvaluation;
}>;
