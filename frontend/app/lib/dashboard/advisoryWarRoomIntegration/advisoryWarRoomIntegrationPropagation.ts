/**
 * Phase 5:6 — Advisory–War Room integration domain propagation.
 */

import { getAdvisoryContextForExecutiveAdvisory } from "../executiveAdvisory/aggregation/advisoryAggregationRuntime.ts";
import { getAdvisoryConfidenceForExecutiveAdvisory } from "../executiveAdvisory/confidence/advisoryConfidenceRuntime.ts";
import { getAdvisoryExplanationForExecutiveAdvisory } from "../executiveAdvisory/explainability/advisoryExplainabilityRuntime.ts";
import { getDecisionGuidanceSnapshotForExecutiveSummary } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { getWarRoomIntelligenceSnapshotForExecutiveSummary } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import type {
  AdvisoryTransformationLayer,
  AdvisoryWarRoomIntegrationBundle,
  AdvisoryWarRoomIntegrationInput,
  ConfidencePropagationLayer,
  ExplainabilityPropagationLayer,
  GuidanceDeliveryLayer,
  IntegrationTraceContract,
  TradeoffPropagationLayer,
  WarRoomIntakeContract,
} from "./advisoryWarRoomIntegrationContract.ts";

export function buildWarRoomIntake(input: AdvisoryWarRoomIntegrationInput): WarRoomIntakeContract {
  const warRoom = getWarRoomIntelligenceSnapshotForExecutiveSummary(input);

  return Object.freeze({
    situationOverview: warRoom.situationOverview.executiveSummary,
    criticalRisks: warRoom.criticalRisks.summary,
    timelinePressure: warRoom.timelinePressure.urgencySummary,
    scenarioComparison: warRoom.scenarioComparison.comparisonSummary,
    decisionFocus: warRoom.decisionFocus.label,
    decisionFocusLevel: warRoom.decisionFocus.focus,
    readiness: warRoom.advisoryIntegration.readiness,
    summary: "War Room decision context normalized for advisory integration",
  });
}

export function buildAdvisoryTransformation(
  input: AdvisoryWarRoomIntegrationInput
): AdvisoryTransformationLayer {
  const advisoryContext = getAdvisoryContextForExecutiveAdvisory(input);

  return Object.freeze({
    advisoryContext,
    sourceChain: advisoryContext.metadata.reasoningTrace.sourceChain,
    summary: "War Room context transformed into standardized advisory context",
  });
}

export function buildConfidencePropagation(
  input: AdvisoryWarRoomIntegrationInput
): ConfidencePropagationLayer {
  const evaluation = getAdvisoryConfidenceForExecutiveAdvisory(input);

  return Object.freeze({
    evaluation,
    drivers: evaluation.explanation.confidenceDrivers,
    limiters: evaluation.explanation.confidenceLimiters,
    summary: `Confidence ${evaluation.overall.label} propagated through integration pipeline`,
  });
}

export function buildExplainabilityPropagation(
  input: AdvisoryWarRoomIntegrationInput
): ExplainabilityPropagationLayer {
  const bundle = getAdvisoryExplanationForExecutiveAdvisory(input);

  return Object.freeze({
    bundle,
    reasoningPath: bundle.reasoningPath.pathLabel,
    assumptions: bundle.assumptionsAndUnknowns.entries.map((entry) => entry.label),
    summary: "Explainability metadata propagated with reasoning trace intact",
  });
}

export function buildTradeoffPropagation(
  input: AdvisoryWarRoomIntegrationInput
): TradeoffPropagationLayer {
  const warRoom = getWarRoomIntelligenceSnapshotForExecutiveSummary(input);
  const advisoryContext = getAdvisoryContextForExecutiveAdvisory(input);

  const tradeoffs = Object.freeze([
    ...warRoom.tradeoffAnalysis.tradeoffs.map((entry) =>
      Object.freeze({
        domain: "decision" as const,
        label: entry.label,
        indicator: entry.indicator,
      })
    ),
    Object.freeze({
      domain: "scenario" as const,
      label: advisoryContext.scenario.tradeoffs.label,
      indicator: advisoryContext.scenario.tradeoffs.explanation,
    }),
    Object.freeze({
      domain: "risk" as const,
      label: advisoryContext.risk.exposure.label,
      indicator: advisoryContext.risk.momentum.explanation,
    }),
    Object.freeze({
      domain: "timeline" as const,
      label: advisoryContext.timeline.milestonePressure.label,
      indicator: advisoryContext.timeline.scheduleDrift.explanation,
    }),
    Object.freeze({
      domain: "operational" as const,
      label: advisoryContext.operational.pressure.label,
      indicator: advisoryContext.operational.health.explanation,
    }),
  ]);

  return Object.freeze({
    tradeoffs,
    summary: warRoom.tradeoffAnalysis.summary,
  });
}

export function buildGuidanceDelivery(input: AdvisoryWarRoomIntegrationInput): GuidanceDeliveryLayer {
  const snapshot = getDecisionGuidanceSnapshotForExecutiveSummary(input);

  return Object.freeze({
    snapshot,
    summary: "Decision Guidance delivery — executive presentation layer output",
  });
}

export function buildIntegrationTrace(
  input: AdvisoryWarRoomIntegrationInput,
  layers: {
    intake: WarRoomIntakeContract;
    transformation: AdvisoryTransformationLayer;
    confidencePropagation: ConfidencePropagationLayer;
    explainabilityPropagation: ExplainabilityPropagationLayer;
    tradeoffPropagation: TradeoffPropagationLayer;
    guidanceDelivery: GuidanceDeliveryLayer;
  }
): IntegrationTraceContract {
  const steps = Object.freeze([
    Object.freeze({
      step: "war_room_intake",
      source: "war_room" as const,
      detail: layers.intake.summary,
    }),
    Object.freeze({
      step: "advisory_transformation",
      source: "executive_advisory" as const,
      detail: layers.transformation.summary,
    }),
    Object.freeze({
      step: "confidence_propagation",
      source: "confidence_framework" as const,
      detail: layers.confidencePropagation.summary,
    }),
    Object.freeze({
      step: "explainability_propagation",
      source: "explainability_layer" as const,
      detail: layers.explainabilityPropagation.summary,
    }),
    Object.freeze({
      step: "tradeoff_propagation",
      source: "war_room" as const,
      detail: layers.tradeoffPropagation.summary,
    }),
    Object.freeze({
      step: "guidance_delivery",
      source: "decision_guidance" as const,
      detail: layers.guidanceDelivery.summary,
    }),
  ]);

  const pathLabel = "War Room ↓ Advisory ↓ Decision Guidance";

  return Object.freeze({
    steps,
    pathLabel,
    summary:
      input.dashboardContext === "war_room"
        ? `${pathLabel} — active integration trace for executive decision context`
        : `${pathLabel} — integration trace available when war room context activates`,
  });
}

export function buildAdvisoryWarRoomIntegrationBundle(
  input: AdvisoryWarRoomIntegrationInput
): AdvisoryWarRoomIntegrationBundle {
  const intake = buildWarRoomIntake(input);
  const transformation = buildAdvisoryTransformation(input);
  const confidencePropagation = buildConfidencePropagation(input);
  const explainabilityPropagation = buildExplainabilityPropagation(input);
  const tradeoffPropagation = buildTradeoffPropagation(input);
  const guidanceDelivery = buildGuidanceDelivery(input);
  const trace = buildIntegrationTrace(input, {
    intake,
    transformation,
    confidencePropagation,
    explainabilityPropagation,
    tradeoffPropagation,
    guidanceDelivery,
  });

  return Object.freeze({
    intake,
    transformation,
    confidencePropagation,
    explainabilityPropagation,
    tradeoffPropagation,
    guidanceDelivery,
    trace,
  });
}
