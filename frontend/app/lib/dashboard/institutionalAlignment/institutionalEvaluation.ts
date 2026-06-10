/**
 * Phase 6:6 — Institutional evaluation layer.
 */

import type { InstitutionalContext } from "./institutionalContextContract.ts";
import type {
  ConsensusStatusLevel,
  GovernanceStatusLevel,
  InstitutionalAttentionLevel,
  InstitutionalHealthLevel,
  PolicyStatusLevel,
  StakeholderStatusLevel,
  StrategicAlignmentStatusLevel,
} from "./institutionalAlignmentContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type InstitutionalEvaluationResult = Readonly<{
  health: InstitutionalHealthLevel;
  healthTrend: ImpactDirection;
  governanceStatus: GovernanceStatusLevel;
  strategicStatus: StrategicAlignmentStatusLevel;
  policyStatus: PolicyStatusLevel;
  stakeholderStatus: StakeholderStatusLevel;
  consensusStatus: ConsensusStatusLevel;
  attention: InstitutionalAttentionLevel;
}>;

function resolveGovernanceStatus(ctx: InstitutionalContext): GovernanceStatusLevel {
  if (
    ctx.governance.attention === "governance_escalation" ||
    ctx.governance.alignment === "potential_misalignment"
  ) {
    return "governance_escalation";
  }
  if (
    ctx.governance.attention === "approval_recommended" ||
    ctx.governance.alignment === "requires_review"
  ) {
    return "governance_review_required";
  }
  return "governance_aligned";
}

function resolveStrategicStatus(ctx: InstitutionalContext): StrategicAlignmentStatusLevel {
  if (
    ctx.strategicAlignment.alignmentScore === "potential_misalignment" ||
    ctx.strategicAlignment.alignmentScore === "weak_alignment"
  ) {
    return "strategic_misalignment";
  }
  if (ctx.strategicAlignment.alignmentScore === "moderate_alignment") {
    return "mixed_strategic_signals";
  }
  return "strategic_objectives_supported";
}

function resolvePolicyStatus(ctx: InstitutionalContext): PolicyStatusLevel {
  if (
    ctx.policy.policyAlignment === "potential_conflict" ||
    ctx.policy.constraintSeverity === "critical"
  ) {
    return "policy_conflict";
  }
  if (
    ctx.policy.constraintSeverity === "significant" ||
    ctx.policy.policyAlignment === "requires_review"
  ) {
    return "constraint_pressure";
  }
  return "policy_aligned";
}

function resolveStakeholderStatus(ctx: InstitutionalContext): StakeholderStatusLevel {
  if (
    ctx.stakeholder.impact === "negative" ||
    ctx.stakeholder.tension === "strategic_conflict" ||
    ctx.stakeholder.alignment === "misaligned"
  ) {
    return "stakeholder_resistance";
  }
  if (
    ctx.stakeholder.impact === "mixed" ||
    ctx.stakeholder.tension === "competing_priorities" ||
    ctx.stakeholder.alignment === "conflicting_interests"
  ) {
    return "mixed_support";
  }
  return "strong_support";
}

function resolveConsensusStatus(ctx: InstitutionalContext): ConsensusStatusLevel {
  if (
    ctx.consensus.consensusLevel === "low_consensus" ||
    ctx.consensus.institutionalTension === "critical" ||
    ctx.consensus.institutionalTension === "high"
  ) {
    return "institutional_tension";
  }
  if (
    ctx.consensus.consensusLevel === "mixed_alignment" ||
    ctx.consensus.consensusLevel === "moderate_consensus"
  ) {
    return "partial_consensus";
  }
  return "strong_consensus";
}

function resolveInstitutionalHealth(
  governance: GovernanceStatusLevel,
  strategic: StrategicAlignmentStatusLevel,
  policy: PolicyStatusLevel,
  stakeholder: StakeholderStatusLevel,
  consensus: ConsensusStatusLevel
): { level: InstitutionalHealthLevel; trend: ImpactDirection } {
  const riskSignals = [
    governance === "governance_escalation",
    strategic === "strategic_misalignment",
    policy === "policy_conflict",
    stakeholder === "stakeholder_resistance",
    consensus === "institutional_tension",
  ].filter(Boolean).length;

  const alignedSignals = [
    governance === "governance_aligned",
    strategic === "strategic_objectives_supported",
    policy === "policy_aligned",
    stakeholder === "strong_support",
    consensus === "strong_consensus",
  ].filter(Boolean).length;

  if (riskSignals >= 2) {
    return { level: "institutional_risk", trend: "deteriorating" };
  }
  if (alignedSignals >= 4) {
    return { level: "strong_alignment", trend: "improving" };
  }
  if (alignedSignals >= 2) {
    return { level: "moderate_alignment", trend: "stable" };
  }
  return { level: "fragmented_alignment", trend: "stable" };
}

function resolveAttention(
  health: InstitutionalHealthLevel,
  governance: GovernanceStatusLevel,
  consensus: ConsensusStatusLevel
): InstitutionalAttentionLevel {
  if (
    health === "institutional_risk" ||
    governance === "governance_escalation" ||
    consensus === "institutional_tension"
  ) {
    return "institutional_escalation";
  }
  if (health === "fragmented_alignment" || governance === "governance_review_required") {
    return "leadership_discussion_recommended";
  }
  if (health === "moderate_alignment") return "review";
  return "monitor";
}

export function evaluateInstitutionalAlignment(
  ctx: InstitutionalContext
): InstitutionalEvaluationResult {
  const governanceStatus = resolveGovernanceStatus(ctx);
  const strategicStatus = resolveStrategicStatus(ctx);
  const policyStatus = resolvePolicyStatus(ctx);
  const stakeholderStatus = resolveStakeholderStatus(ctx);
  const consensusStatus = resolveConsensusStatus(ctx);
  const { level: health, trend: healthTrend } = resolveInstitutionalHealth(
    governanceStatus,
    strategicStatus,
    policyStatus,
    stakeholderStatus,
    consensusStatus
  );

  return Object.freeze({
    health,
    healthTrend,
    governanceStatus,
    strategicStatus,
    policyStatus,
    stakeholderStatus,
    consensusStatus,
    attention: resolveAttention(health, governanceStatus, consensusStatus),
  });
}
