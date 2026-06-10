/**
 * Phase 6:5 — Consensus Context Contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DecisionGuidanceSnapshot } from "../decisionGuidance/decisionGuidanceContract.ts";
import type { GovernanceIntelligenceSnapshot } from "../governanceIntelligence/governanceIntelligenceContract.ts";
import type { StrategicAlignmentSnapshot } from "../strategicAlignment/strategicAlignmentContract.ts";
import type { PolicyConstraintIntelligenceSnapshot } from "../policyConstraintIntelligence/policyConstraintIntelligenceContract.ts";
import type { StakeholderIntelligenceSnapshot } from "../stakeholderIntelligence/stakeholderIntelligenceContract.ts";
import type { AdvisoryConfidenceEvaluation } from "../executiveAdvisory/confidence/advisoryConfidenceContract.ts";

export const CONSENSUS_CONTEXT_CONTRACT_VERSION = "6.5.0";

export type ConsensusContextSource =
  | "stakeholder_intelligence"
  | "policy_constraint"
  | "strategic_alignment"
  | "governance"
  | "decision_guidance"
  | "portfolio"
  | "enterprise"
  | "institutional_advisory";

export type StakeholderConsensusContext = Readonly<{
  source: "stakeholder_intelligence";
  impact: string;
  alignment: string;
  tension: string;
  supportSummary: string;
}>;

export type PolicyConsensusContext = Readonly<{
  source: "policy_constraint";
  policyAlignment: string;
  constraintSeverity: string;
  policyAttention: string;
}>;

export type StrategicConsensusContext = Readonly<{
  source: "strategic_alignment";
  alignmentScore: string;
  strategicTension: string;
  strategicAttention: string;
}>;

export type GovernanceConsensusContext = Readonly<{
  source: "governance";
  governanceAlignment: string;
  governanceAttention: string;
}>;

export type DecisionGuidanceConsensusContext = Readonly<{
  source: "decision_guidance";
  focus: string;
  confidenceLevel: string;
}>;

export type PortfolioConsensusContext = Readonly<{
  source: "portfolio";
  status: "pending_enrichment";
  summary: string;
}>;

export type EnterpriseConsensusContext = Readonly<{
  source: "enterprise";
  status: "pending_enrichment";
  summary: string;
}>;

export type InstitutionalAdvisoryConsensusContext = Readonly<{
  source: "institutional_advisory";
  status: "pending_enrichment";
  summary: string;
}>;

export type ConsensusContext = Readonly<{
  stakeholder: StakeholderConsensusContext;
  policy: PolicyConsensusContext;
  strategicAlignment: StrategicConsensusContext;
  governance: GovernanceConsensusContext;
  decisionGuidance: DecisionGuidanceConsensusContext;
  confidenceLevel: string;
  confidenceLabel: string;
  portfolio: PortfolioConsensusContext;
  enterprise: EnterpriseConsensusContext;
  institutionalAdvisory: InstitutionalAdvisoryConsensusContext;
  sourceChain: readonly ConsensusContextSource[];
}>;

export type ConsensusContextAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type ConsensusContextBuildInput = Readonly<{
  stakeholderSnapshot: StakeholderIntelligenceSnapshot;
  policySnapshot: PolicyConstraintIntelligenceSnapshot;
  strategicSnapshot: StrategicAlignmentSnapshot;
  governanceSnapshot: GovernanceIntelligenceSnapshot;
  decisionGuidanceSnapshot: DecisionGuidanceSnapshot;
  confidenceEvaluation: AdvisoryConfidenceEvaluation;
}>;
