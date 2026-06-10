/**
 * Phase 6:2 — Alignment Evaluation Layer.
 * Evaluates decisions, scenarios, and governance context against strategic objectives.
 */

import type { StrategicContext } from "./strategicContextContract.ts";
import {
  listStrategicObjectives,
  type StrategicObjectiveImpactLevel,
} from "./strategicObjectiveRegistry.ts";
import type {
  ObjectiveImpactEntry,
  StrategicAlignmentScoreLevel,
  StrategicDirectionLevel,
  StrategicTensionLevel,
} from "./strategicAlignmentContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type AlignmentEvaluationResult = Readonly<{
  alignmentScore: StrategicAlignmentScoreLevel;
  alignmentTrend: ImpactDirection;
  direction: StrategicDirectionLevel;
  directionTrend: ImpactDirection;
  tension: StrategicTensionLevel;
  objectives: readonly ObjectiveImpactEntry[];
}>;

function resolveObjectiveImpact(
  objectiveId: string,
  label: string,
  ctx: StrategicContext
): StrategicObjectiveImpactLevel {
  if (objectiveId === "objective_a") {
    if (ctx.decisionGuidance.focus === "decision_required" && ctx.governance.alignment === "potential_misalignment") {
      return "at_risk";
    }
    if (ctx.scenario.expectedImpact.toLowerCase().includes("high") || ctx.scenario.expectedImpact.toLowerCase().includes("transformational")) {
      return "supported";
    }
    return "neutral";
  }
  if (objectiveId === "objective_b") {
    if (ctx.warRoom.threatExposure.toLowerCase().includes("critical") || ctx.warRoom.threatExposure.toLowerCase().includes("high")) {
      return "at_risk";
    }
    if (ctx.governance.alignment === "aligned" || ctx.governance.alignment === "partially_aligned") {
      return "supported";
    }
    return "neutral";
  }
  if (objectiveId === "objective_c") {
    if (ctx.decisionGuidance.focus === "investigate" || ctx.advisoryFocus === "investigate") {
      return "supported";
    }
    if (ctx.governance.attention === "governance_escalation") {
      return "at_risk";
    }
    return "neutral";
  }
  return "neutral";
}

function resolveAlignmentScore(ctx: StrategicContext): {
  score: StrategicAlignmentScoreLevel;
  trend: ImpactDirection;
} {
  const governanceAligned =
    ctx.governance.alignment === "aligned" || ctx.governance.alignment === "partially_aligned";
  const highConfidence = ctx.confidenceLevel === "high";
  const decisionPressure =
    ctx.decisionGuidance.focus === "decision_required" ||
    ctx.decisionGuidance.focus === "decision_recommended";

  if (governanceAligned && highConfidence && !decisionPressure) {
    return { score: "strong_alignment", trend: "improving" };
  }
  if (ctx.governance.alignment === "potential_misalignment") {
    return { score: "potential_misalignment", trend: "deteriorating" };
  }
  if (decisionPressure && !governanceAligned) {
    return { score: "weak_alignment", trend: "deteriorating" };
  }
  if (governanceAligned || ctx.confidenceLevel === "moderate") {
    return { score: "moderate_alignment", trend: "stable" };
  }
  return { score: "weak_alignment", trend: "stable" };
}

function resolveStrategicDirection(
  score: StrategicAlignmentScoreLevel,
  ctx: StrategicContext
): { direction: StrategicDirectionLevel; trend: ImpactDirection } {
  if (score === "strong_alignment" || score === "moderate_alignment") {
    if (ctx.decisionGuidance.focus === "decision_recommended") {
      return { direction: "advances_strategic_direction", trend: "improving" };
    }
    return { direction: "maintains_strategic_direction", trend: "stable" };
  }
  if (score === "potential_misalignment" || ctx.governance.alignment === "potential_misalignment") {
    return { direction: "conflicts_with_strategic_direction", trend: "deteriorating" };
  }
  return { direction: "maintains_strategic_direction", trend: "stable" };
}

function resolveStrategicTension(ctx: StrategicContext, objectives: readonly ObjectiveImpactEntry[]): StrategicTensionLevel {
  const atRiskCount = objectives.filter((entry) => entry.impact === "at_risk").length;
  const supportedCount = objectives.filter((entry) => entry.impact === "supported").length;

  if (atRiskCount >= 2 || ctx.governance.alignment === "potential_misalignment") {
    return "strategic_conflict";
  }
  if (atRiskCount >= 1 && supportedCount >= 1) {
    return "competing_priorities";
  }
  if (ctx.decisionGuidance.tradeoffSummary.length > 0 && ctx.decisionGuidance.focus !== "monitor") {
    return "competing_priorities";
  }
  return "no_significant_tension";
}

export function evaluateStrategicAlignment(ctx: StrategicContext): AlignmentEvaluationResult {
  const { score, trend } = resolveAlignmentScore(ctx);
  const { direction, trend: directionTrend } = resolveStrategicDirection(score, ctx);

  const objectives: ObjectiveImpactEntry[] = listStrategicObjectives().map((objective) => {
    const impact = resolveObjectiveImpact(objective.id, objective.label, ctx);
    return Object.freeze({
      objectiveId: objective.id,
      label: objective.label,
      impact,
      influence: objective.theme,
      visibility: objective.priority,
      summary: objective.summary,
    });
  });

  const tension = resolveStrategicTension(ctx, objectives);

  return Object.freeze({
    alignmentScore: score,
    alignmentTrend: trend,
    direction,
    directionTrend,
    tension,
    objectives: Object.freeze(objectives),
  });
}
