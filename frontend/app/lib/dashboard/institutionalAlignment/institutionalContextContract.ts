/**
 * Phase 6:6 — Institutional Context Contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { GovernanceIntelligenceSnapshot } from "../governanceIntelligence/governanceIntelligenceContract.ts";
import type { StrategicAlignmentSnapshot } from "../strategicAlignment/strategicAlignmentContract.ts";
import type { PolicyConstraintIntelligenceSnapshot } from "../policyConstraintIntelligence/policyConstraintIntelligenceContract.ts";
import type { StakeholderIntelligenceSnapshot } from "../stakeholderIntelligence/stakeholderIntelligenceContract.ts";
import type { ConsensusIntelligenceSnapshot } from "../consensusIntelligence/consensusIntelligenceContract.ts";

export const INSTITUTIONAL_CONTEXT_CONTRACT_VERSION = "6.6.0";

export type InstitutionalContextSource =
  | "governance"
  | "strategic_alignment"
  | "policy_constraint"
  | "stakeholder_intelligence"
  | "consensus_intelligence"
  | "enterprise"
  | "portfolio"
  | "board";

export type GovernanceInstitutionalContext = Readonly<{
  source: "governance";
  alignment: string;
  attention: string;
  alignmentSummary: string;
}>;

export type StrategicInstitutionalContext = Readonly<{
  source: "strategic_alignment";
  alignmentScore: string;
  strategicAttention: string;
  alignmentSummary: string;
}>;

export type PolicyInstitutionalContext = Readonly<{
  source: "policy_constraint";
  policyAlignment: string;
  constraintSeverity: string;
  policyAttention: string;
}>;

export type StakeholderInstitutionalContext = Readonly<{
  source: "stakeholder_intelligence";
  impact: string;
  alignment: string;
  tension: string;
  attention: string;
}>;

export type ConsensusInstitutionalContext = Readonly<{
  source: "consensus_intelligence";
  consensusLevel: string;
  institutionalTension: string;
  consensusAttention: string;
}>;

export type EnterpriseInstitutionalContext = Readonly<{
  source: "enterprise";
  status: "pending_enrichment";
  summary: string;
}>;

export type PortfolioInstitutionalContext = Readonly<{
  source: "portfolio";
  status: "pending_enrichment";
  summary: string;
}>;

export type BoardInstitutionalContext = Readonly<{
  source: "board";
  status: "pending_enrichment";
  summary: string;
}>;

export type InstitutionalContext = Readonly<{
  governance: GovernanceInstitutionalContext;
  strategicAlignment: StrategicInstitutionalContext;
  policy: PolicyInstitutionalContext;
  stakeholder: StakeholderInstitutionalContext;
  consensus: ConsensusInstitutionalContext;
  enterprise: EnterpriseInstitutionalContext;
  portfolio: PortfolioInstitutionalContext;
  board: BoardInstitutionalContext;
  sourceChain: readonly InstitutionalContextSource[];
}>;

export type InstitutionalContextAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type InstitutionalContextBuildInput = Readonly<{
  governanceSnapshot: GovernanceIntelligenceSnapshot;
  strategicSnapshot: StrategicAlignmentSnapshot;
  policySnapshot: PolicyConstraintIntelligenceSnapshot;
  stakeholderSnapshot: StakeholderIntelligenceSnapshot;
  consensusSnapshot: ConsensusIntelligenceSnapshot;
}>;
