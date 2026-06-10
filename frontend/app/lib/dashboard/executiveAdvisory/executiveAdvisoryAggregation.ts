/**
 * Phase 5:2 — Executive Advisory surface generation.
 * Consumes Advisory Context only — does not consume raw intelligence directly.
 */

import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { getAdvisoryContextForExecutiveAdvisory } from "./aggregation/advisoryAggregationRuntime.ts";
import type { AdvisoryContext } from "./aggregation/advisoryContextContract.ts";
import { getAdvisoryConfidenceForExecutiveAdvisory } from "./confidence/advisoryConfidenceRuntime.ts";
import type { AdvisoryConfidenceEvaluation } from "./confidence/advisoryConfidenceContract.ts";
import { getAdvisoryExplanationForExecutiveAdvisory } from "./explainability/advisoryExplainabilityRuntime.ts";
import {
  type AdvisoryConfidenceCard,
  type AdvisoryConfidenceLevel,
  type AdvisoryContextSource,
  type AdvisoryFocusCard,
  type AdvisoryFocusLevel,
  type AdvisoryNarrativeCard,
  type AdvisoryUrgency,
  type ExecutiveAdvisoryAggregationInput,
  type ExecutiveAdvisorySnapshot,
  type ExecutiveAdvisorySurfaceModel,
  type GuidanceCandidateEntry,
  type GuidanceCandidatesCard,
  type PrioritySignalEntry,
  type PrioritySignalsCard,
  CANONICAL_EXECUTIVE_ADVISORY_OWNER,
  CANONICAL_EXECUTIVE_ADVISORY_SURFACE_ID,
} from "./executiveAdvisoryContract.ts";
import {
  reportAdvisoryConfidence,
  reportAdvisoryFocus,
  reportAdvisoryNarrative,
  reportExecutiveAdvisory,
  reportExecutiveAdvisorySurface,
  reportGuidanceCandidate,
  reportPrioritySignal,
} from "./executiveAdvisoryLogging.ts";

const FOCUS_LABEL: Readonly<Record<AdvisoryFocusLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  investigate: "Investigate",
  decision_recommended: "Decision Recommended",
});

const CONFIDENCE_LABEL: Readonly<Record<AdvisoryConfidenceLevel, string>> = Object.freeze({
  low: "Low Confidence",
  moderate: "Moderate Confidence",
  high: "High Confidence",
  very_high: "Very High Confidence",
});

function collectContextSources(input: ExecutiveAdvisoryAggregationInput): readonly AdvisoryContextSource[] {
  const sources: AdvisoryContextSource[] = [
    "operational",
    "risk",
    "timeline",
    "scenario",
    "dashboard",
  ];
  if (input.dashboardContext === "war_room" || input.dashboardContext === "timeline") {
    sources.push("war_room");
  }
  return Object.freeze([...new Set(sources)]);
}

function mapFocusFromContext(context: AdvisoryContext, dashboardContext: string): AdvisoryFocusLevel {
  const decisionInput = context.warRoom.decisionFocus;
  const riskAttention = context.risk.executiveAttention;
  if (
    decisionInput.impact === "transformational" ||
    decisionInput.priority === "critical" ||
    dashboardContext === "war_room"
  ) {
    return "decision_recommended";
  }
  if (riskAttention.priority === "critical" || riskAttention.priority === "high") return "investigate";
  if (decisionInput.priority === "moderate" || riskAttention.priority === "moderate") return "review";
  return "monitor";
}

function mapUrgency(context: AdvisoryContext): AdvisoryUrgency {
  const priority = context.metadata.priority;
  if (priority === "critical") return "urgent";
  if (priority === "high") return "high";
  if (priority === "moderate") return "moderate";
  return "low";
}

function buildFocusCard(context: AdvisoryContext, dashboardContext: string): AdvisoryFocusCard {
  const focusLevel = mapFocusFromContext(context, dashboardContext);
  return Object.freeze({
    focus: focusLevel,
    label: FOCUS_LABEL[focusLevel],
    urgency: mapUrgency(context),
    attentionLevel: context.risk.executiveAttention.label,
    summary:
      focusLevel === "decision_recommended"
        ? "Executive path selection deserves consideration — advisory guidance available"
        : focusLevel === "investigate"
          ? "Investigation warranted before commitment"
          : "Structured guidance without automated decisions",
  });
}

function buildPrioritySignalsCard(context: AdvisoryContext): PrioritySignalsCard {
  const domainMap: Record<string, PrioritySignalEntry["domain"]> = {
    operational: "operational",
    risk: "risk",
    timeline: "timeline",
    scenario: "scenario",
  };

  const topBySource = new Map<string, (typeof context.rankedInputs)[number]>();
  for (const input of context.rankedInputs) {
    if (!topBySource.has(input.source)) topBySource.set(input.source, input);
  }

  const signals: PrioritySignalEntry[] = [...topBySource.entries()]
    .filter(([source]) => source in domainMap)
    .map(([source, input]) =>
      Object.freeze({
        domain: domainMap[source]!,
        label: `${input.label}`,
        summary: input.explanation,
        rank: input.score,
        trend: input.trend,
      })
    )
    .sort((left, right) => left.rank - right.rank);

  const top = context.topPriority;

  return Object.freeze({
    signals: Object.freeze(signals),
    topPriority: top ? `${top.label}: ${top.explanation}` : "No immediate priority concentration",
    summary: "Executive-relevant priorities from advisory context — not exhaustive signal lists",
  });
}

function buildNarrativeCard(context: AdvisoryContext, dashboardContext: string): AdvisoryNarrativeCard {
  return Object.freeze({
    situationSummary: context.warRoom.situationOverview.explanation,
    executiveBriefing: context.operational.health.explanation,
    contextSummary:
      dashboardContext === "war_room"
        ? `War Room advisory context: ${context.warRoom.decisionFocus.label}`
        : `Advisory context: ${context.operational.health.explanation} · ${context.risk.exposure.explanation}`,
  });
}

function buildGuidanceCandidatesCard(
  context: AdvisoryContext,
  dashboardContext: string,
  focus: AdvisoryFocusLevel
): GuidanceCandidatesCard {
  const candidates: GuidanceCandidateEntry[] = [];

  if (focus === "decision_recommended" || focus === "investigate") {
    candidates.push(
      Object.freeze({
        kind: "investigate_further",
        label: "Investigate Further",
        suggestion: context.warRoom.decisionFocus.explanation,
        priority: "high",
      }),
      Object.freeze({
        kind: "compare_alternatives",
        label: "Compare Alternatives",
        suggestion: context.warRoom.scenarioComparison.explanation,
        priority: "high",
      })
    );
  }

  if (dashboardContext === "war_room" || context.metadata.reasoningTrace.confidenceFactors.some((f) => f.includes("ready"))) {
    candidates.push(
      Object.freeze({
        kind: "escalate_review",
        label: "Escalate Review",
        suggestion: "War Room context available for structured executive review",
        priority: "moderate",
      })
    );
  }

  if (context.scenario.investigationPaths.explanation.length > 0) {
    candidates.push(
      Object.freeze({
        kind: "investigate_further",
        label: "Investigate Further",
        suggestion: context.scenario.investigationPaths.explanation,
        priority: "moderate",
      })
    );
  }

  if (focus === "monitor") {
    candidates.push(
      Object.freeze({
        kind: "maintain_monitoring",
        label: "Maintain Monitoring",
        suggestion: "Continue observing converged advisory context",
        priority: "low",
      })
    );
  }

  const unique = candidates.filter(
    (entry, index, list) => list.findIndex((item) => item.kind === entry.kind) === index
  );

  return Object.freeze({
    candidates: Object.freeze(unique),
    summary: "Guidance suggestions — not commands; executive judgment remains authoritative",
  });
}

function buildConfidenceCard(evaluation: AdvisoryConfidenceEvaluation): AdvisoryConfidenceCard {
  const level = evaluation.overall.level as AdvisoryConfidenceLevel;

  return Object.freeze({
    level,
    label: CONFIDENCE_LABEL[level],
    trend: evaluation.overall.trend,
    explanation: evaluation.explanation.summary,
  });
}

export function aggregateExecutiveAdvisory(
  input: ExecutiveAdvisoryAggregationInput
): ExecutiveAdvisorySurfaceModel {
  const advisoryContext = getAdvisoryContextForExecutiveAdvisory(input);
  const confidenceEvaluation = getAdvisoryConfidenceForExecutiveAdvisory(input);
  const explanationBundle = getAdvisoryExplanationForExecutiveAdvisory(input);
  const focus = buildFocusCard(advisoryContext, input.dashboardContext);
  const prioritySignals = buildPrioritySignalsCard(advisoryContext);
  const narrative = buildNarrativeCard(advisoryContext, input.dashboardContext);
  const guidanceCandidates = buildGuidanceCandidatesCard(
    advisoryContext,
    input.dashboardContext,
    focus.focus
  );
  const confidence = buildConfidenceCard(confidenceEvaluation);

  const warRoomContextBridge = advisoryContext.metadata.auditTrail.summary;

  const snapshot: ExecutiveAdvisorySnapshot = Object.freeze({
    focus,
    prioritySignals,
    narrative,
    guidanceCandidates,
    confidence,
    warRoomContextBridge,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_EXECUTIVE_ADVISORY_SURFACE_ID);

  const model: ExecutiveAdvisorySurfaceModel = Object.freeze({
    surfaceId: CANONICAL_EXECUTIVE_ADVISORY_SURFACE_ID,
    owner: CANONICAL_EXECUTIVE_ADVISORY_OWNER,
    headline: "What deserves consideration?",
    snapshot,
    visualBundle,
    contextSources: collectContextSources(input),
    advisoryContext,
    confidenceEvaluation,
    explanationBundle,
  });

  reportExecutiveAdvisory({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "5.4.0",
    focus: focus.focus,
    aggregationOwner: "advisoryAggregationRuntime",
    confidenceOwner: "advisoryConfidenceRuntime",
    explainabilityOwner: "advisoryExplainabilityRuntime",
  });
  reportAdvisoryFocus(snapshot.focus);
  reportPrioritySignal(snapshot.prioritySignals);
  reportAdvisoryNarrative(snapshot.narrative);
  reportGuidanceCandidate(snapshot.guidanceCandidates);
  reportAdvisoryConfidence(snapshot.confidence);
  reportExecutiveAdvisorySurface(model);

  return model;
}
