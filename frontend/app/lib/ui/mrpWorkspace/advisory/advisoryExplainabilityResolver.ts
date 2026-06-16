/**
 * MRP:5A:4 — Derive recommendation explainability from consume-only intelligence.
 */

import { getOperationalWorkspaceState } from "../operational/operationalWorkspaceStateRuntime.ts";
import type { AdvisoryConfidenceLevel } from "./advisoryStateContract.ts";
import { ADVISORY_CONFIDENCE_LABELS } from "./advisoryStateContract.ts";
import type { AdvisoryRecommendationLayer } from "./advisoryRecommendationContract.ts";
import type { AdvisoryRecommendationIntake } from "./advisoryRecommendationIntakeContract.ts";
import {
  computeAdvisoryConfidenceMetrics,
} from "./advisoryRecommendationResolver.ts";
import {
  ADVISORY_EXPLAINABILITY_PURPOSE,
  DEFAULT_ADVISORY_EXPLAINABILITY_LAYER,
  MRP_ADVISORY_EXPLAINABILITY_TAG,
  RECOMMENDATION_DRIVER_SECTION_LABELS,
  RECOMMENDATION_DRIVER_SECTION_ORDER,
  type AdvisoryExplainabilityLayer,
  type AdvisoryExplainabilitySurface,
  type ConfidenceAnalysisSurface,
  type RecommendationDriverEntry,
  type RecommendationDriverSection,
  type RecommendationDriverSectionId,
  type RecommendationDriversSurface,
} from "./advisoryExplainabilityContract.ts";
import type { AdvisoryFieldSnapshot } from "./advisoryWorkspaceStateContract.ts";
import type { AdvisoryWorkspaceContext } from "./advisoryWorkspaceContextContract.ts";

function buildDriverSection(
  id: RecommendationDriverSectionId,
  drivers: readonly RecommendationDriverEntry[]
): RecommendationDriverSection {
  return Object.freeze({
    id,
    label: RECOMMENDATION_DRIVER_SECTION_LABELS[id],
    drivers: Object.freeze(drivers),
  });
}

function buildRiskDrivers(intake: AdvisoryRecommendationIntake): readonly RecommendationDriverEntry[] {
  if (!intake.risk.available) {
    return Object.freeze([
      Object.freeze({
        id: "risk:pending",
        label: "Risk intelligence pending",
        detail: "Certified risk workspace has no active signals for the selected object.",
      }),
    ]);
  }

  return Object.freeze([
    Object.freeze({
      id: "risk:count",
      label: "Risk signal volume",
      detail: `${intake.risk.riskCount} total risk signal${intake.risk.riskCount === 1 ? "" : "s"} tracked.`,
    }),
    Object.freeze({
      id: "risk:severity",
      label: "Severity distribution",
      detail: `${intake.risk.elevatedRiskCount} elevated and ${intake.risk.criticalRiskCount} critical under ${intake.risk.dominantRiskCategory}.`,
    }),
  ]);
}

function buildOperationalDrivers(
  intake: AdvisoryRecommendationIntake
): readonly RecommendationDriverEntry[] {
  const operationalState = getOperationalWorkspaceState();
  if (operationalState.phase !== "ready") {
    return Object.freeze([
      Object.freeze({
        id: "operational:pending",
        label: "Operational intelligence pending",
        detail: "Certified operational workspace is not ready for the selected object.",
      }),
    ]);
  }

  return Object.freeze([
    Object.freeze({
      id: "operational:status",
      label: "Operational status",
      detail: `${operationalState.operationalStatus} posture with ${operationalState.activityLevel} activity.`,
    }),
    Object.freeze({
      id: "operational:focus",
      label: "Operational focus",
      detail: operationalState.operationalFocus.headline,
    }),
    Object.freeze({
      id: "operational:notes",
      label: "Operational notes",
      detail: operationalState.operationalNotes.headline,
    }),
    ...(intake.timeline.available
      ? [
          Object.freeze({
            id: "operational:timeline",
            label: "Timeline activity",
            detail: `${intake.timeline.recentEventCount} recent and ${intake.timeline.decisionEventCount} decision timeline events.`,
          }),
        ]
      : []),
  ]);
}

function buildScenarioDrivers(
  intake: AdvisoryRecommendationIntake
): readonly RecommendationDriverEntry[] {
  if (!intake.scenario.available) {
    return Object.freeze([
      Object.freeze({
        id: "scenario:pending",
        label: "Scenario intelligence pending",
        detail: "Certified scenario workspace has no generated scenarios for evaluation.",
      }),
    ]);
  }

  return Object.freeze([
    Object.freeze({
      id: "scenario:count",
      label: "Scenario coverage",
      detail: `${intake.scenario.scenarioCount} generated scenario${intake.scenario.scenarioCount === 1 ? "" : "s"} evaluated.`,
    }),
    ...(intake.scenario.expectedProbability
      ? [
          Object.freeze({
            id: "scenario:expected",
            label: "Expected case probability",
            detail: `Expected trajectory projects ${intake.scenario.expectedProbability}.`,
          }),
        ]
      : []),
    ...(intake.scenario.worstCaseImpact
      ? [
          Object.freeze({
            id: "scenario:worst",
            label: "Worst-case impact",
            detail: `Downside scenario impact rated ${intake.scenario.worstCaseImpact}.`,
          }),
        ]
      : []),
  ]);
}

function buildStrategicDrivers(
  intake: AdvisoryRecommendationIntake,
  workspaceContext: AdvisoryWorkspaceContext
): readonly RecommendationDriverEntry[] {
  const strategy =
    intake.warRoom.selectedStrategy?.trim() ||
    workspaceContext.recommendationFocus.trim() ||
    null;

  if (!intake.warRoom.available && !strategy) {
    return Object.freeze([
      Object.freeze({
        id: "strategic:pending",
        label: "Strategic intelligence pending",
        detail: "War Room strategy focus not yet available for explainability.",
      }),
    ]);
  }

  return Object.freeze([
    ...(strategy
      ? [
          Object.freeze({
            id: "strategic:focus",
            label: "Strategy focus",
            detail: strategy,
          }),
        ]
      : []),
    ...(intake.warRoom.status
      ? [
          Object.freeze({
            id: "strategic:war_room_status",
            label: "War Room status",
            detail: `War Room posture ${intake.warRoom.status} (consume-only — commitment owned elsewhere).`,
          }),
        ]
      : []),
    ...(intake.warRoom.activeDecisionId
      ? [
          Object.freeze({
            id: "strategic:decision",
            label: "Linked decision context",
            detail: `Active decision ${intake.warRoom.activeDecisionId} informs strategic alignment.`,
          }),
        ]
      : []),
  ]);
}

function buildSupportingEvidence(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
  metrics: ReturnType<typeof computeAdvisoryConfidenceMetrics>;
}): readonly string[] {
  const { intake, workspaceContext, metrics } = input;
  const evidence: string[] = [];

  if (workspaceContext.hasSelection) {
    evidence.push(`Object context locked to ${workspaceContext.selectedObject}.`);
  }
  if (intake.risk.available) {
    evidence.push(
      `${intake.risk.riskCount} risk signals with dominant category ${intake.risk.dominantRiskCategory}.`
    );
  }
  if (intake.timeline.available) {
    evidence.push(`${intake.timeline.totalEvents} timeline events including ${intake.timeline.recentEventCount} recent.`);
  }
  if (intake.scenario.available && intake.scenario.expectedProbability) {
    evidence.push(`Scenario expected case probability ${intake.scenario.expectedProbability}.`);
  }
  if (intake.warRoom.available && intake.warRoom.selectedStrategy) {
    evidence.push(`War Room strategy focus ${intake.warRoom.selectedStrategy}.`);
  }
  const operationalState = getOperationalWorkspaceState();
  if (operationalState.phase === "ready") {
    evidence.push(
      `Operational posture ${operationalState.operationalStatus} at ${operationalState.activityLevel} activity.`
    );
  }
  evidence.push(`${metrics.dataPoints} certified intelligence data points synthesized.`);

  return Object.freeze(evidence);
}

function buildUncertaintyIndicators(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
  metrics: ReturnType<typeof computeAdvisoryConfidenceMetrics>;
}): readonly string[] {
  const { intake, workspaceContext, metrics } = input;
  const indicators: string[] = [];

  if (!workspaceContext.hasSelection) {
    indicators.push("No object selection — recommendation explainability not fully evaluated.");
  }
  if (!intake.risk.available) indicators.push("Risk workspace intelligence unavailable.");
  if (!intake.timeline.available) indicators.push("Timeline workspace intelligence unavailable.");
  if (!intake.scenario.available) indicators.push("Scenario workspace intelligence unavailable.");
  if (!intake.warRoom.available) indicators.push("War Room intelligence unavailable.");
  const operationalState = getOperationalWorkspaceState();
  if (operationalState.phase !== "ready") {
    indicators.push("Operational workspace intelligence unavailable.");
  }
  if (intake.risk.criticalRiskCount > 0) {
    indicators.push(`${intake.risk.criticalRiskCount} critical risk signal${intake.risk.criticalRiskCount === 1 ? "" : "s"} increase uncertainty.`);
  }
  if (metrics.dataPoints < 3) {
    indicators.push("Limited certified data points — confidence may shift as intelligence arrives.");
  }
  if (metrics.riskPressure > 4) {
    indicators.push("Elevated risk pressure reduces recommendation certainty.");
  }

  return Object.freeze(indicators.length > 0 ? indicators : ["No material uncertainty indicators detected."]);
}

export function deriveRecommendationDriversSurface(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
}): RecommendationDriversSurface {
  const sections = Object.freeze(
    RECOMMENDATION_DRIVER_SECTION_ORDER.map((id) => {
      switch (id) {
        case "risk_drivers":
          return buildDriverSection(id, buildRiskDrivers(input.intake));
        case "operational_drivers":
          return buildDriverSection(id, buildOperationalDrivers(input.intake));
        case "scenario_drivers":
          return buildDriverSection(id, buildScenarioDrivers(input.intake));
        case "strategic_drivers":
          return buildDriverSection(id, buildStrategicDrivers(input.intake, input.workspaceContext));
      }
    })
  );

  return Object.freeze({
    purpose: ADVISORY_EXPLAINABILITY_PURPOSE,
    sections,
    explainsRecommendationOnly: true,
  });
}

export function deriveConfidenceAnalysisSurface(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
  confidence: AdvisoryConfidenceLevel;
}): ConfidenceAnalysisSurface {
  const metrics = computeAdvisoryConfidenceMetrics({
    intake: input.intake,
    workspaceContext: input.workspaceContext,
  });

  return Object.freeze({
    confidenceScore: metrics.confidenceScore,
    confidenceLabel: ADVISORY_CONFIDENCE_LABELS[input.confidence],
    confidenceLevel: input.confidence,
    supportingEvidence: buildSupportingEvidence({
      intake: input.intake,
      workspaceContext: input.workspaceContext,
      metrics,
    }),
    uncertaintyIndicators: buildUncertaintyIndicators({
      intake: input.intake,
      workspaceContext: input.workspaceContext,
      metrics,
    }),
  });
}

export function deriveAdvisoryExplainabilityLayer(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
  recommendationLayer: AdvisoryRecommendationLayer;
}): AdvisoryExplainabilityLayer {
  if (!input.workspaceContext.hasSelection) {
    return DEFAULT_ADVISORY_EXPLAINABILITY_LAYER;
  }

  const drivers = deriveRecommendationDriversSurface({
    intake: input.intake,
    workspaceContext: input.workspaceContext,
  });
  const confidenceAnalysis = deriveConfidenceAnalysisSurface({
    intake: input.intake,
    workspaceContext: input.workspaceContext,
    confidence: input.recommendationLayer.card.confidence,
  });

  return Object.freeze({
    drivers,
    confidenceAnalysis,
    explainsRecommendationOnly: true,
  });
}

export function buildAdvisoryExplainabilitySignature(
  layer: AdvisoryExplainabilityLayer
): string {
  return JSON.stringify({
    drivers: layer.drivers.sections.map((section) => ({
      id: section.id,
      drivers: section.drivers.map((driver) => driver.id),
    })),
    confidenceAnalysis: {
      confidenceScore: layer.confidenceAnalysis.confidenceScore,
      confidenceLevel: layer.confidenceAnalysis.confidenceLevel,
      supportingEvidence: layer.confidenceAnalysis.supportingEvidence,
      uncertaintyIndicators: layer.confidenceAnalysis.uncertaintyIndicators,
    },
    explainsRecommendationOnly: layer.explainsRecommendationOnly,
  });
}

export function buildAdvisoryExplainabilitySurface(
  layer: AdvisoryExplainabilityLayer
): AdvisoryExplainabilitySurface {
  return Object.freeze({
    purpose: ADVISORY_EXPLAINABILITY_PURPOSE,
    drivers: layer.drivers,
    confidenceAnalysis: layer.confidenceAnalysis,
    explainsRecommendationOnly: true,
  });
}

function countActiveDrivers(layer: AdvisoryExplainabilityLayer): number {
  return layer.drivers.sections.reduce(
    (total, section) =>
      total +
      section.drivers.filter((driver) => !driver.id.endsWith(":pending")).length,
    0
  );
}

export function buildRecommendationDriversSnapshot(
  layer: AdvisoryExplainabilityLayer
): AdvisoryFieldSnapshot {
  const activeDrivers = countActiveDrivers(layer);
  const sectionSummary = layer.drivers.sections
    .map((section) => `${section.label}: ${section.drivers.length}`)
    .join(" · ");

  return Object.freeze({
    headline:
      activeDrivers > 0
        ? `${activeDrivers} recommendation driver${activeDrivers === 1 ? "" : "s"} across 4 sections`
        : "Recommendation drivers pending",
    detail: `${MRP_ADVISORY_EXPLAINABILITY_TAG} ${sectionSummary}. ${ADVISORY_EXPLAINABILITY_PURPOSE}`,
  });
}

export function buildConfidenceSummarySnapshot(
  layer: AdvisoryExplainabilityLayer
): AdvisoryFieldSnapshot {
  const { confidenceAnalysis } = layer;

  return Object.freeze({
    headline: `${confidenceAnalysis.confidenceLabel} confidence (${confidenceAnalysis.confidenceScore}/100)`,
    detail: `${MRP_ADVISORY_EXPLAINABILITY_TAG} ${confidenceAnalysis.supportingEvidence.length} evidence signal${confidenceAnalysis.supportingEvidence.length === 1 ? "" : "s"} · ${confidenceAnalysis.uncertaintyIndicators.length} uncertainty indicator${confidenceAnalysis.uncertaintyIndicators.length === 1 ? "" : "s"}.`,
  });
}
