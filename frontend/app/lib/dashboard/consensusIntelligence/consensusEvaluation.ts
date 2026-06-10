/**
 * Phase 6:5 — Consensus Evaluation Layer.
 */

import type { ConsensusContext } from "./consensusContextContract.ts";
import { listAlignmentGroups, listConflictGroups } from "./consensusRegistry.ts";
import type {
  AlignmentZoneEntry,
  AlignmentZoneKind,
  ConsensusAttentionLevel,
  ConsensusConfidenceLevel,
  ConsensusLevel,
  ConvergenceLevel,
  DisagreementZoneEntry,
  DisagreementZoneKind,
  DivergenceLevel,
  InstitutionalTensionLevel,
} from "./consensusIntelligenceContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type ConsensusEvaluationResult = Readonly<{
  level: ConsensusLevel;
  levelTrend: ImpactDirection;
  alignmentZones: readonly AlignmentZoneEntry[];
  disagreementZones: readonly DisagreementZoneEntry[];
  convergence: ConvergenceLevel;
  convergenceTrend: ImpactDirection;
  divergence: DivergenceLevel;
  divergenceTrend: ImpactDirection;
  institutionalTension: InstitutionalTensionLevel;
  confidence: ConsensusConfidenceLevel;
  attention: ConsensusAttentionLevel;
}>;

function resolveConsensusLevel(ctx: ConsensusContext): { level: ConsensusLevel; trend: ImpactDirection } {
  const alignedSignals = [
    ctx.governance.governanceAlignment === "aligned",
    ctx.policy.policyAlignment === "aligned",
    ctx.strategicAlignment.alignmentScore === "strong_alignment",
    ctx.stakeholder.alignment === "aligned",
  ].filter(Boolean).length;

  if (alignedSignals >= 3 && ctx.stakeholder.tension === "no_significant_tension") {
    return { level: "strong_consensus", trend: "improving" };
  }
  if (
    ctx.stakeholder.impact === "negative" ||
    ctx.policy.policyAlignment === "potential_conflict" ||
    ctx.stakeholder.tension === "strategic_conflict"
  ) {
    return { level: "low_consensus", trend: "deteriorating" };
  }
  if (alignedSignals >= 2) {
    return { level: "moderate_consensus", trend: "stable" };
  }
  return { level: "mixed_alignment", trend: "stable" };
}

function buildAlignmentZones(ctx: ConsensusContext): AlignmentZoneEntry[] {
  const statusForZone = (zone: AlignmentZoneKind): string => {
    if (zone === "executive_alignment") {
      return ctx.governance.governanceAlignment === "aligned" ? "Aligned" : "Partial";
    }
    if (zone === "operational_alignment") {
      return ctx.stakeholder.impact !== "negative" ? "Aligned" : "Partial";
    }
    if (zone === "strategic_alignment") {
      return ctx.strategicAlignment.alignmentScore === "strong_alignment" ? "Aligned" : "Partial";
    }
    return ctx.stakeholder.alignment === "aligned" ? "Aligned" : "Partial";
  };

  return listAlignmentGroups().map((group) =>
    Object.freeze({
      zone: group.id,
      label: group.label,
      status: statusForZone(group.id),
      summary: group.summary,
    })
  );
}

function buildDisagreementZones(ctx: ConsensusContext): DisagreementZoneEntry[] {
  const active = (zone: DisagreementZoneKind): boolean => {
    if (zone === "priority_conflict") return ctx.strategicAlignment.strategicTension === "competing_priorities";
    if (zone === "resource_conflict") return ctx.policy.constraintSeverity === "significant" || ctx.policy.constraintSeverity === "critical";
    if (zone === "timeline_conflict") return ctx.decisionGuidance.focus === "decision_required";
    return ctx.policy.policyAlignment === "potential_conflict" || ctx.governance.governanceAlignment === "potential_misalignment";
  };

  return listConflictGroups().map((group) =>
    Object.freeze({
      zone: group.id,
      label: group.label,
      status: active(group.id) ? "Active" : "Inactive",
      summary: group.summary,
    })
  );
}

function resolveConvergence(ctx: ConsensusContext): { level: ConvergenceLevel; trend: ImpactDirection } {
  if (
    ctx.strategicAlignment.alignmentScore === "strong_alignment" &&
    ctx.stakeholder.alignment === "aligned"
  ) {
    return { level: "growing_convergence", trend: "improving" };
  }
  if (ctx.stakeholder.tension === "no_significant_tension") {
    return { level: "stable_convergence", trend: "stable" };
  }
  return { level: "weak_convergence", trend: "deteriorating" };
}

function resolveDivergence(ctx: ConsensusContext): { level: DivergenceLevel; trend: ImpactDirection } {
  if (ctx.stakeholder.tension === "strategic_conflict" || ctx.policy.policyAlignment === "potential_conflict") {
    return { level: "critical_divergence", trend: "deteriorating" };
  }
  if (ctx.stakeholder.impact === "mixed" || ctx.stakeholder.tension === "competing_priorities") {
    return { level: "increasing_divergence", trend: "deteriorating" };
  }
  if (ctx.stakeholder.impact === "negative") {
    return { level: "emerging_divergence", trend: "stable" };
  }
  return { level: "emerging_divergence", trend: "stable" };
}

function resolveInstitutionalTension(ctx: ConsensusContext): InstitutionalTensionLevel {
  if (
    ctx.stakeholder.tension === "strategic_conflict" ||
    ctx.policy.constraintSeverity === "critical"
  ) {
    return "critical";
  }
  if (
    ctx.stakeholder.tension === "resource_conflict" ||
    ctx.strategicAlignment.strategicTension === "strategic_conflict"
  ) {
    return "high";
  }
  if (ctx.stakeholder.tension === "competing_priorities" || ctx.policy.constraintSeverity === "significant") {
    return "moderate";
  }
  return "low";
}

function resolveAttention(
  level: ConsensusLevel,
  tension: InstitutionalTensionLevel,
  divergence: DivergenceLevel
): ConsensusAttentionLevel {
  if (level === "low_consensus" || tension === "critical" || divergence === "critical_divergence") {
    return "consensus_escalation";
  }
  if (tension === "high" || divergence === "increasing_divergence") {
    return "leadership_discussion_recommended";
  }
  if (level === "mixed_alignment") return "review";
  return "monitor";
}

export function evaluateConsensus(ctx: ConsensusContext): ConsensusEvaluationResult {
  const { level, trend } = resolveConsensusLevel(ctx);
  const { level: convergence, trend: convergenceTrend } = resolveConvergence(ctx);
  const { level: divergence, trend: divergenceTrend } = resolveDivergence(ctx);
  const institutionalTension = resolveInstitutionalTension(ctx);

  const confidence: ConsensusConfidenceLevel =
    ctx.confidenceLevel === "high" ? "high" : ctx.confidenceLevel === "low" ? "low" : "moderate";

  return Object.freeze({
    level,
    levelTrend: trend,
    alignmentZones: Object.freeze(buildAlignmentZones(ctx)),
    disagreementZones: Object.freeze(buildDisagreementZones(ctx)),
    convergence,
    convergenceTrend,
    divergence,
    divergenceTrend,
    institutionalTension,
    confidence,
    attention: resolveAttention(level, institutionalTension, divergence),
  });
}
