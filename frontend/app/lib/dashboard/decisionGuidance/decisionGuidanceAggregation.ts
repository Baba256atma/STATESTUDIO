/**
 * Phase 5:5 — Decision Guidance aggregation.
 * Consumes Executive Advisory, Confidence, Explainability, and War Room feeds only.
 */

import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { resolveExecutiveAdvisorySurface } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import {
  buildTradeoffPropagation,
  buildWarRoomIntake,
} from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationPropagation.ts";
import {
  CANONICAL_DECISION_GUIDANCE_OWNER,
  CANONICAL_DECISION_GUIDANCE_SURFACE_ID,
} from "./decisionGuidanceContract.ts";
import type {
  DecisionContextCard,
  DecisionFocusCard,
  DecisionFocusLevel,
  DecisionGuidanceAggregationInput,
  DecisionGuidanceSnapshot,
  DecisionGuidanceSurfaceModel,
  ExecutiveGuidanceCard,
  ExecutiveGuidanceEntry,
  ExplanationSummaryCard,
  ConfidenceSummaryCard,
  TradeoffSummaryCard,
} from "./decisionGuidanceContract.ts";
import {
  reportConfidenceSummary,
  reportDecisionContext,
  reportDecisionFocus,
  reportDecisionGuidance,
  reportDecisionGuidanceSurface,
  reportExecutiveGuidance,
  reportExplanationSummary,
  reportTradeoffSummary,
} from "./decisionGuidanceLogging.ts";

const FOCUS_LABEL: Readonly<Record<DecisionFocusLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  investigate: "Investigate",
  decision_recommended: "Decision Recommended",
  decision_required: "Decision Required",
});

function resolveDecisionFocus(
  input: DecisionGuidanceAggregationInput,
  advisoryFocus: string,
  warRoomFocus: string
): DecisionFocusLevel {
  if (input.dashboardContext === "war_room" && warRoomFocus === "decision_required") {
    return "decision_required";
  }
  if (advisoryFocus === "decision_recommended") return "decision_recommended";
  if (advisoryFocus === "investigate") return "investigate";
  if (advisoryFocus === "review") return "review";
  return "monitor";
}

function buildDecisionFocusCard(input: DecisionGuidanceAggregationInput): DecisionFocusCard {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const intake = buildWarRoomIntake(input);
  const focus = resolveDecisionFocus(
    input,
    advisory.snapshot.focus.focus,
    intake.decisionFocusLevel
  );

  return Object.freeze({
    focus,
    label: FOCUS_LABEL[focus],
    urgency: advisory.snapshot.focus.urgency,
    attentionStatus: advisory.snapshot.focus.attentionLevel,
    summary:
      focus === "decision_required"
        ? "Executive decision required — evaluate tradeoffs before committing"
        : advisory.snapshot.focus.summary,
  });
}

function buildExecutiveGuidanceCard(input: DecisionGuidanceAggregationInput): ExecutiveGuidanceCard {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const entries: ExecutiveGuidanceEntry[] = advisory.snapshot.guidanceCandidates.candidates.map(
    (candidate) =>
      Object.freeze({
        kind: candidate.kind,
        label: candidate.label,
        suggestion: candidate.suggestion,
      })
  );

  if (advisory.explanationBundle.assumptionsAndUnknowns.entries.length > 0) {
    entries.push(
      Object.freeze({
        kind: "validate_assumptions",
        label: "Validate Assumptions",
        suggestion: advisory.explanationBundle.assumptionsAndUnknowns.summary,
      })
    );
  }

  return Object.freeze({
    entries: Object.freeze(entries),
    summary: "Advisory guidance for executive evaluation — not prescriptive commands",
  });
}

function buildConfidenceSummaryCard(input: DecisionGuidanceAggregationInput): ConfidenceSummaryCard {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const evaluation = advisory.confidenceEvaluation;

  return Object.freeze({
    level: evaluation.overall.level,
    label: evaluation.overall.label,
    trend: evaluation.overall.trend,
    summary: evaluation.explanation.summary,
  });
}

function buildExplanationSummaryCard(input: DecisionGuidanceAggregationInput): ExplanationSummaryCard {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const bundle = advisory.explanationBundle;

  return Object.freeze({
    supportingEvidence: bundle.supportingEvidence.summary,
    confidenceDrivers: bundle.confidenceDrivers.summary,
    confidenceLimiters: bundle.confidenceLimiters.summary,
    reasoningPath: bundle.reasoningPath.pathLabel,
    summary: bundle.guidance.executiveSummary,
  });
}

function buildTradeoffSummaryCard(input: DecisionGuidanceAggregationInput): TradeoffSummaryCard {
  const propagation = buildTradeoffPropagation(input);
  const tradeoffs = propagation.tradeoffs
    .filter((entry) => entry.domain === "decision")
    .map((entry) =>
      Object.freeze({
        label: entry.label,
        indicator: entry.indicator,
      })
    );

  return Object.freeze({
    tradeoffs: Object.freeze(tradeoffs),
    summary: propagation.summary,
  });
}

function buildDecisionContextCard(input: DecisionGuidanceAggregationInput): DecisionContextCard {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const ctx = advisory.advisoryContext;

  const highlights = Object.freeze([
    Object.freeze({
      domain: "operational" as const,
      label: ctx.operational.health.label,
      summary: ctx.operational.health.explanation,
    }),
    Object.freeze({
      domain: "risk" as const,
      label: ctx.risk.exposure.label,
      summary: ctx.risk.exposure.explanation,
    }),
    Object.freeze({
      domain: "timeline" as const,
      label: ctx.timeline.decisionWindows.label,
      summary: ctx.timeline.decisionWindows.explanation,
    }),
    Object.freeze({
      domain: "scenario" as const,
      label: ctx.scenario.expectedImpact.label,
      summary: ctx.scenario.expectedImpact.explanation,
    }),
    Object.freeze({
      domain: "war_room" as const,
      label: ctx.warRoom.decisionFocus.label,
      summary: ctx.warRoom.decisionFocus.explanation,
    }),
  ]);

  return Object.freeze({
    highlights,
    summary: "Situational grounding across intelligence domains — decision preparation, not automation",
  });
}

export function aggregateDecisionGuidance(
  input: DecisionGuidanceAggregationInput
): DecisionGuidanceSurfaceModel {
  const decisionFocus = buildDecisionFocusCard(input);
  const executiveGuidance = buildExecutiveGuidanceCard(input);
  const confidenceSummary = buildConfidenceSummaryCard(input);
  const explanationSummary = buildExplanationSummaryCard(input);
  const tradeoffSummary = buildTradeoffSummaryCard(input);
  const decisionContext = buildDecisionContextCard(input);

  const snapshot: DecisionGuidanceSnapshot = Object.freeze({
    decisionFocus,
    executiveGuidance,
    confidenceSummary,
    explanationSummary,
    tradeoffSummary,
    decisionContext,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_DECISION_GUIDANCE_SURFACE_ID);

  const model: DecisionGuidanceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_DECISION_GUIDANCE_SURFACE_ID,
    owner: CANONICAL_DECISION_GUIDANCE_OWNER,
    headline: "What deserves action — and why?",
    snapshot,
    visualBundle,
  });

  reportDecisionGuidance({
    dashboardContext: input.dashboardContext,
    version: "5.5.0",
    focus: decisionFocus.focus,
    owner: CANONICAL_DECISION_GUIDANCE_OWNER,
  });
  reportDecisionFocus(snapshot.decisionFocus);
  reportExecutiveGuidance(snapshot.executiveGuidance);
  reportConfidenceSummary(snapshot.confidenceSummary);
  reportExplanationSummary(snapshot.explanationSummary);
  reportTradeoffSummary(snapshot.tradeoffSummary);
  reportDecisionContext(snapshot.decisionContext);
  reportDecisionGuidanceSurface(model);

  return model;
}
