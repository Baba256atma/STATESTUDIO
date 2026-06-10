/**
 * Phase 6:4 — Stakeholder Evaluation Layer.
 */

import type { StakeholderContext } from "./stakeholderContextContract.ts";
import { listStakeholderGroups, type StakeholderGroupEntry } from "./stakeholderRegistry.ts";
import type {
  StakeholderAlignmentEntry,
  StakeholderAlignmentLevel,
  StakeholderAttentionLevel,
  StakeholderConfidenceLevel,
  StakeholderImpactLevel,
  StakeholderInfluenceEntry,
  StakeholderSupportEntry,
  StakeholderSupportLevel,
  StakeholderTensionLevel,
  StakeholderVisibilityEntry,
} from "./stakeholderIntelligenceContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type StakeholderEvaluationResult = Readonly<{
  visibility: readonly StakeholderVisibilityEntry[];
  impact: StakeholderImpactLevel;
  impactTrend: ImpactDirection;
  aggregateAlignment: StakeholderAlignmentLevel;
  alignmentEntries: readonly StakeholderAlignmentEntry[];
  influenceEntries: readonly StakeholderInfluenceEntry[];
  tension: StakeholderTensionLevel;
  competingInterests: readonly string[];
  supportEntries: readonly StakeholderSupportEntry[];
  confidence: StakeholderConfidenceLevel;
  attention: StakeholderAttentionLevel;
}>;

function resolveGroupImpact(group: StakeholderGroupEntry, ctx: StakeholderContext): StakeholderImpactLevel {
  if (group.id === "executive_team" || group.id === "leadership") {
    if (ctx.decisionGuidance.focus === "decision_required") return "mixed";
    if (ctx.governance.alignment === "aligned") return "positive";
    return "neutral";
  }
  if (group.id === "operations") {
    if (ctx.warRoomUrgency.toLowerCase().includes("immediate")) return "negative";
    if (ctx.policy.constraintSeverity === "critical") return "negative";
    return "neutral";
  }
  if (group.id === "finance") {
    if (ctx.scenario.expectedImpact.toLowerCase().includes("high")) return "negative";
    if (ctx.strategicAlignment.alignmentScore === "strong_alignment") return "positive";
    return "neutral";
  }
  if (group.id === "customers" || group.id === "partners") {
    if (ctx.scenario.expectedImpact.toLowerCase().includes("high")) return "negative";
    if (ctx.scenario.expectedImpact.toLowerCase().includes("low")) return "positive";
    return "neutral";
  }
  if (group.id === "pmo") {
    if (ctx.strategicAlignment.tensionLevel === "competing_priorities") return "mixed";
    return "neutral";
  }
  return "neutral";
}

function resolveGroupAlignment(group: StakeholderGroupEntry, ctx: StakeholderContext): StakeholderAlignmentLevel {
  if (ctx.policy.policyAlignment === "potential_conflict" && group.category === "external") {
    return "misaligned";
  }
  if (ctx.strategicAlignment.tensionLevel === "strategic_conflict") {
    return group.defaultInfluence === "critical" ? "conflicting_interests" : "partially_aligned";
  }
  if (ctx.governance.alignment === "aligned" || ctx.governance.alignment === "partially_aligned") {
    return "aligned";
  }
  if (ctx.governance.alignment === "requires_review") return "partially_aligned";
  return "partially_aligned";
}

function resolveGroupSupport(group: StakeholderGroupEntry, ctx: StakeholderContext): StakeholderSupportLevel {
  const impact = resolveGroupImpact(group, ctx);
  if (impact === "positive") return "strong_support";
  if (impact === "negative") return "potential_resistance";
  if (impact === "mixed") return "uncertain_support";
  if (ctx.decisionGuidance.focus === "decision_required") return "uncertain_support";
  return "moderate_support";
}

function resolveAggregateImpact(impacts: readonly StakeholderImpactLevel[]): StakeholderImpactLevel {
  if (impacts.includes("negative") && impacts.includes("positive")) return "mixed";
  if (impacts.includes("negative")) return "negative";
  if (impacts.includes("mixed")) return "mixed";
  if (impacts.every((entry) => entry === "positive")) return "positive";
  if (impacts.includes("positive")) return "mixed";
  return "neutral";
}

function resolveTension(ctx: StakeholderContext, alignments: readonly StakeholderAlignmentEntry[]): StakeholderTensionLevel {
  const misaligned = alignments.filter(
    (entry) => entry.alignment === "misaligned" || entry.alignment === "conflicting_interests"
  ).length;

  if (ctx.strategicAlignment.tensionLevel === "strategic_conflict" || misaligned >= 3) {
    return "strategic_conflict";
  }
  if (ctx.policy.constraintSeverity === "significant" || ctx.policy.constraintSeverity === "critical") {
    return "resource_conflict";
  }
  if (misaligned >= 1 || ctx.strategicAlignment.tensionLevel === "competing_priorities") {
    return "competing_priorities";
  }
  return "no_significant_tension";
}

function resolveAttention(
  impact: StakeholderImpactLevel,
  tension: StakeholderTensionLevel,
  ctx: StakeholderContext
): StakeholderAttentionLevel {
  if (impact === "negative" && tension === "strategic_conflict") return "stakeholder_escalation";
  if (tension === "resource_conflict" || tension === "strategic_conflict") {
    return "leadership_discussion_recommended";
  }
  if (impact === "mixed" || ctx.decisionGuidance.focus === "decision_required") return "review";
  return "monitor";
}

export function evaluateStakeholders(ctx: StakeholderContext): StakeholderEvaluationResult {
  const groups = listStakeholderGroups();

  const visibility: StakeholderVisibilityEntry[] = groups.map((group) =>
    Object.freeze({
      groupId: group.id,
      label: group.label,
      visibility: group.category,
      summary: group.summary,
    })
  );

  const alignmentEntries: StakeholderAlignmentEntry[] = groups.map((group) => {
    const alignment = resolveGroupAlignment(group, ctx);
    return Object.freeze({
      groupId: group.id,
      label: group.label,
      alignment,
      summary: `${group.label} — ${alignment.replace(/_/g, " ")}`,
    });
  });

  const influenceEntries: StakeholderInfluenceEntry[] = groups.map((group) =>
    Object.freeze({
      groupId: group.id,
      label: group.label,
      influence: group.defaultInfluence,
      summary: `${group.label} influence: ${group.defaultInfluence}`,
    })
  );

  const supportEntries: StakeholderSupportEntry[] = groups.map((group) => {
    const support = resolveGroupSupport(group, ctx);
    return Object.freeze({
      groupId: group.id,
      label: group.label,
      support,
      summary: `${group.label} — ${support.replace(/_/g, " ")}`,
    });
  });

  const groupImpacts = groups.map((group) => resolveGroupImpact(group, ctx));
  const impact = resolveAggregateImpact(groupImpacts);
  const impactTrend: ImpactDirection =
    impact === "positive" ? "improving" : impact === "negative" ? "deteriorating" : "stable";

  const misalignedCount = alignmentEntries.filter(
    (entry) => entry.alignment === "misaligned" || entry.alignment === "conflicting_interests"
  ).length;
  const aggregateAlignment: StakeholderAlignmentLevel =
    misalignedCount >= 3
      ? "misaligned"
      : misalignedCount >= 1
        ? "conflicting_interests"
        : alignmentEntries.some((entry) => entry.alignment === "partially_aligned")
          ? "partially_aligned"
          : "aligned";

  const tension = resolveTension(ctx, alignmentEntries);
  const competingInterests = alignmentEntries
    .filter((entry) => entry.alignment !== "aligned")
    .map((entry) => `${entry.label}: ${entry.alignment.replace(/_/g, " ")}`);

  const confidence: StakeholderConfidenceLevel =
    ctx.confidenceLevel === "high" ? "high" : ctx.confidenceLevel === "low" ? "low" : "moderate";

  const attention = resolveAttention(impact, tension, ctx);

  return Object.freeze({
    visibility: Object.freeze(visibility),
    impact,
    impactTrend,
    aggregateAlignment,
    alignmentEntries: Object.freeze(alignmentEntries),
    influenceEntries: Object.freeze(influenceEntries),
    tension,
    competingInterests: Object.freeze(
      competingInterests.length > 0 ? competingInterests : ["No competing interests detected"]
    ),
    supportEntries: Object.freeze(supportEntries),
    confidence,
    attention,
  });
}
