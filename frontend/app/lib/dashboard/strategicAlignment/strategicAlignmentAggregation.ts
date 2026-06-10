/**
 * Phase 6:2 — Strategic Alignment aggregation.
 * Consumes governance, decision guidance, advisory, and scenario feeds only.
 */

import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { resolveExecutiveAdvisorySurface } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import { resolveDecisionGuidanceSurface } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { resolveGovernanceIntelligenceSurface } from "../governanceIntelligence/governanceIntelligenceRuntime.ts";
import { getScenarioIntelligenceSnapshotForExecutiveSummary } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { getWarRoomIntelligenceSnapshotForExecutiveSummary } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { buildStrategicContext } from "./strategicContextGeneration.ts";
import { evaluateStrategicAlignment } from "./strategicAlignmentEvaluation.ts";
import {
  CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
  CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID,
} from "./strategicAlignmentContract.ts";
import type {
  StrategicAlignmentAggregationInput,
  StrategicAlignmentScoreCard,
  StrategicAlignmentScoreLevel,
  StrategicAlignmentSnapshot,
  StrategicAlignmentSurfaceModel,
  StrategicAttentionCard,
  StrategicAttentionLevel,
  StrategicConfidenceCard,
  StrategicConfidenceLevel,
  StrategicDirectionCard,
  StrategicDirectionLevel,
  StrategicObjectivesImpactCard,
  StrategicTensionCard,
  StrategicTensionLevel,
  StrategicTradeoffCard,
  StrategicTradeoffEntry,
} from "./strategicAlignmentContract.ts";
import type { StrategicContext } from "./strategicContextContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import {
  reportObjectiveImpact,
  reportStrategicAlignment,
  reportStrategicAlignmentSurface,
  reportStrategicAttention,
  reportStrategicConfidence,
  reportStrategicDirection,
  reportStrategicTension,
  reportStrategicTradeoff,
} from "./strategicAlignmentLogging.ts";

const SCORE_LABEL: Readonly<Record<StrategicAlignmentScoreLevel, string>> = Object.freeze({
  strong_alignment: "Strong Alignment",
  moderate_alignment: "Moderate Alignment",
  weak_alignment: "Weak Alignment",
  potential_misalignment: "Potential Misalignment",
});

const DIRECTION_LABEL: Readonly<Record<StrategicDirectionLevel, string>> = Object.freeze({
  advances_strategic_direction: "Advances Strategic Direction",
  maintains_strategic_direction: "Maintains Strategic Direction",
  conflicts_with_strategic_direction: "Conflicts With Strategic Direction",
});

const TENSION_LABEL: Readonly<Record<StrategicTensionLevel, string>> = Object.freeze({
  no_significant_tension: "No Significant Tension",
  competing_priorities: "Competing Priorities",
  strategic_conflict: "Strategic Conflict",
});

const ATTENTION_LABEL: Readonly<Record<StrategicAttentionLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  leadership_attention_recommended: "Leadership Attention Recommended",
  strategic_escalation: "Strategic Escalation",
});

const IMPACT_LABEL: Readonly<Record<"supported" | "neutral" | "at_risk", string>> = Object.freeze({
  supported: "Supported",
  neutral: "Neutral",
  at_risk: "At Risk",
});

function buildAlignmentScoreCard(
  score: StrategicAlignmentScoreLevel,
  trend: ImpactDirection
): StrategicAlignmentScoreCard {
  return Object.freeze({
    score,
    label: SCORE_LABEL[score],
    trend,
    summary:
      score === "strong_alignment"
        ? "Decision posture strongly supports organizational strategic intent"
        : score === "moderate_alignment"
          ? "Strategic alignment is moderate — leadership review may clarify direction"
          : score === "weak_alignment"
            ? "Weak strategic alignment — evaluate objective impact before proceeding"
            : "Potential strategic misalignment — leadership should understand conflicts",
  });
}

function buildObjectivesImpactCard(evaluation: ReturnType<typeof evaluateStrategicAlignment>): StrategicObjectivesImpactCard {
  return Object.freeze({
    objectives: evaluation.objectives,
    summary: "Objective impact from decision and governance context — institutional direction awareness",
  });
}

function buildStrategicDirectionCard(
  direction: StrategicDirectionLevel,
  trend: ImpactDirection
): StrategicDirectionCard {
  return Object.freeze({
    direction,
    label: DIRECTION_LABEL[direction],
    trend,
    summary:
      direction === "advances_strategic_direction"
        ? "Current decision trajectory advances institutional direction"
        : direction === "maintains_strategic_direction"
          ? "Decision maintains current strategic direction without significant shift"
          : "Decision may conflict with established strategic direction",
  });
}

function buildStrategicTradeoffCard(ctx: StrategicContext): StrategicTradeoffCard {
  const tradeoffs: StrategicTradeoffEntry[] = [
    Object.freeze({
      axis: "growth_vs_stability",
      label: "Growth vs Stability",
      indicator: ctx.scenario.expectedImpact,
      implication: ctx.governance.governanceSummary,
    }),
    Object.freeze({
      axis: "innovation_vs_risk",
      label: "Innovation vs Risk",
      indicator: ctx.warRoom.threatExposure,
      implication: ctx.decisionGuidance.tradeoffSummary,
    }),
    Object.freeze({
      axis: "speed_vs_governance",
      label: "Speed vs Governance",
      indicator: ctx.warRoom.urgency,
      implication: `Governance: ${ctx.governance.attention}`,
    }),
    Object.freeze({
      axis: "short_term_vs_long_term",
      label: "Short-Term vs Long-Term",
      indicator: ctx.decisionGuidance.focus,
      implication: ctx.scenario.comparisonSummary,
    }),
  ];

  return Object.freeze({
    tradeoffs: Object.freeze(tradeoffs),
    summary: "Strategic tradeoffs remain visible for executive evaluation",
  });
}

function buildStrategicTensionCard(
  tension: StrategicTensionLevel,
  objectives: StrategicObjectivesImpactCard
): StrategicTensionCard {
  const conflicting = objectives.objectives
    .filter((entry) => entry.impact === "at_risk")
    .map((entry) => `${entry.label}: ${IMPACT_LABEL[entry.impact]}`);

  return Object.freeze({
    level: tension,
    label: TENSION_LABEL[tension],
    conflictingPriorities: Object.freeze(conflicting.length > 0 ? conflicting : ["No active conflicts"]),
    summary:
      tension === "no_significant_tension"
        ? "No significant strategic tension detected in current context"
        : tension === "competing_priorities"
          ? "Competing strategic priorities require leadership awareness"
          : "Strategic conflict detected — leadership should evaluate tradeoffs",
  });
}

function resolveStrategicConfidence(ctx: StrategicContext): StrategicConfidenceCard {
  const level: StrategicConfidenceLevel =
    ctx.confidenceLevel === "high"
      ? "high"
      : ctx.confidenceLevel === "low"
        ? "low"
        : "moderate";

  const trend: ImpactDirection =
    level === "high" ? "improving" : level === "low" ? "deteriorating" : "stable";

  return Object.freeze({
    level,
    label: ctx.confidenceLabel,
    trend,
    metadata: `Inherited from Advisory Confidence Framework · ${ctx.confidenceLevel}`,
    summary: "Strategic alignment conclusions inherit advisory confidence metadata",
  });
}

function resolveStrategicAttention(
  score: StrategicAlignmentScoreLevel,
  tension: StrategicTensionLevel,
  ctx: StrategicContext
): StrategicAttentionCard {
  let level: StrategicAttentionLevel = "monitor";

  if (score === "potential_misalignment" || tension === "strategic_conflict") {
    level = "strategic_escalation";
  } else if (score === "weak_alignment" || tension === "competing_priorities") {
    level = "leadership_attention_recommended";
  } else if (ctx.decisionGuidance.focus === "decision_required" || ctx.governance.attention === "approval_recommended") {
    level = "review";
  }

  return Object.freeze({
    level,
    label: ATTENTION_LABEL[level],
    escalationIndicator: level === "strategic_escalation" ? "Escalation recommended" : "No escalation",
    leadershipReviewIndicator:
      level === "leadership_attention_recommended" || level === "strategic_escalation"
        ? "Leadership review recommended"
        : "Routine monitoring",
    summary: "Primary strategic output — institutional direction awareness",
  });
}

function collectStrategicInputs(input: StrategicAlignmentAggregationInput): StrategicContext {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const decisionGuidance = resolveDecisionGuidanceSurface(input);
  const governance = resolveGovernanceIntelligenceSurface(input);
  const warRoom = getWarRoomIntelligenceSnapshotForExecutiveSummary(input);
  const scenario = getScenarioIntelligenceSnapshotForExecutiveSummary(input);

  return buildStrategicContext({
    decisionGuidance: decisionGuidance.snapshot,
    governanceSnapshot: governance.snapshot,
    advisorySnapshot: advisory.snapshot,
    confidenceEvaluation: advisory.confidenceEvaluation,
    warRoomSnapshot: warRoom,
    scenarioSnapshot: scenario,
  });
}

export function aggregateStrategicAlignment(
  input: StrategicAlignmentAggregationInput
): StrategicAlignmentSurfaceModel {
  const strategicContext = collectStrategicInputs(input);
  const evaluation = evaluateStrategicAlignment(strategicContext);

  const alignmentScore = buildAlignmentScoreCard(evaluation.alignmentScore, evaluation.alignmentTrend);
  const objectivesImpact = buildObjectivesImpactCard(evaluation);
  const strategicDirection = buildStrategicDirectionCard(evaluation.direction, evaluation.directionTrend);
  const strategicTradeoffs = buildStrategicTradeoffCard(strategicContext);
  const strategicTension = buildStrategicTensionCard(evaluation.tension, objectivesImpact);
  const strategicConfidence = resolveStrategicConfidence(strategicContext);
  const strategicAttention = resolveStrategicAttention(
    evaluation.alignmentScore,
    evaluation.tension,
    strategicContext
  );

  const snapshot: StrategicAlignmentSnapshot = Object.freeze({
    alignmentScore,
    objectivesImpact,
    strategicDirection,
    strategicTradeoffs,
    strategicTension,
    strategicConfidence,
    strategicAttention,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID);

  const model: StrategicAlignmentSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID,
    owner: CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
    headline: "Does this decision move the organization toward its strategic goals?",
    strategicContext,
    snapshot,
    visualBundle,
  });

  reportStrategicAlignment({
    dashboardContext: input.dashboardContext,
    version: "6.2.0",
    score: alignmentScore.score,
    owner: CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
  });
  reportObjectiveImpact(snapshot.objectivesImpact);
  reportStrategicDirection(snapshot.strategicDirection);
  reportStrategicTradeoff(snapshot.strategicTradeoffs);
  reportStrategicTension(snapshot.strategicTension);
  reportStrategicConfidence(snapshot.strategicConfidence);
  reportStrategicAttention(snapshot.strategicAttention);
  reportStrategicAlignmentSurface(model);

  return model;
}
