/**
 * MRP:5A:3 — Sync executive recommendation surface into advisory workspace state.
 */

import {
  ADVISORY_RECOMMENDATION_PURPOSE,
  MRP_ADVISORY_RECOMMENDATION_TAG,
  type AdvisoryRecommendationLayer,
  type AdvisoryRecommendationSurface,
} from "./advisoryRecommendationContract.ts";
import {
  buildAdvisoryRecommendationIntakeSignature,
  buildAdvisoryRecommendationSignature,
  buildAdvisoryRecommendationSurface,
  buildAlternativeRecommendationsSnapshot,
  buildAssumptionsSnapshot,
  buildExecutiveRecommendationCardSnapshot,
  buildAdvisoryRecommendationIntake,
  deriveAdvisoryRecommendationLayer,
} from "./advisoryRecommendationResolver.ts";
import {
  buildAdvisoryExplainabilitySignature,
  buildAdvisoryExplainabilitySurface,
  buildConfidenceSummarySnapshot,
  buildRecommendationDriversSnapshot,
  deriveAdvisoryExplainabilityLayer,
} from "./advisoryExplainabilityResolver.ts";
import {
  ADVISORY_EXPLAINABILITY_PURPOSE,
  MRP_ADVISORY_EXPLAINABILITY_TAG,
} from "./advisoryExplainabilityContract.ts";
import {
  getAdvisoryWorkspaceState,
  publishAdvisoryWorkspaceState,
} from "./advisoryWorkspaceStateRuntime.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRecommendationOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_ADVISORY_RECOMMENDATION_TAG, detail);
}

export function buildAdvisoryRecommendationSurfaceFromLayer(
  layer: AdvisoryRecommendationLayer
): AdvisoryRecommendationSurface {
  return buildAdvisoryRecommendationSurface(layer);
}

export function syncAdvisoryRecommendation(): AdvisoryRecommendationLayer {
  const workspaceState = getAdvisoryWorkspaceState();
  const intake = buildAdvisoryRecommendationIntake();
  const layer = deriveAdvisoryRecommendationLayer({
    intake,
    workspaceContext: workspaceState.workspaceContext,
  });
  const explainabilityLayer = deriveAdvisoryExplainabilityLayer({
    intake,
    workspaceContext: workspaceState.workspaceContext,
    recommendationLayer: layer,
  });
  const intakeSignature = buildAdvisoryRecommendationIntakeSignature(intake);
  const layerSignature = buildAdvisoryRecommendationSignature(layer);
  const explainabilitySignature = buildAdvisoryExplainabilitySignature(explainabilityLayer);
  const objectId = workspaceState.workspaceContext.selectedObjectId;

  const result = publishAdvisoryWorkspaceState({
    phase: workspaceState.phase === "loading" ? "ready" : workspaceState.phase,
    recommendationId: workspaceState.workspaceContext.hasSelection
      ? `recommendation:${objectId ?? "objectless"}`
      : null,
    recommendationTitle: layer.card.recommendation,
    confidence: layer.card.confidence,
    rationale: layer.card.why,
    selectedObjectId: objectId,
    sourceScenarioId: intake.scenario.available
      ? `scenario:${objectId ?? "objectless"}:expected_case`
      : null,
    sourceDecisionId: intake.warRoom.activeDecisionId,
    recommendationLayer: layer,
    recommendationReadOnly: true,
    recommendationSurface: buildAdvisoryRecommendationSurfaceFromLayer(layer),
    explainabilityLayer,
    explainabilityReadOnly: true,
    explainabilitySurface: buildAdvisoryExplainabilitySurface(explainabilityLayer),
    executiveRecommendation: buildExecutiveRecommendationCardSnapshot(layer),
    recommendationDrivers: buildRecommendationDriversSnapshot(explainabilityLayer),
    confidenceSummary: buildConfidenceSummarySnapshot(explainabilityLayer),
    assumptions: buildAssumptionsSnapshot(layer),
    alternativeRecommendations: buildAlternativeRecommendationsSnapshot(layer),
  });

  logRecommendationOnce(`${intakeSignature}:${layerSignature}:${explainabilitySignature}`, {
    action: "advisory_recommendation_synced",
    changed: result.changed,
    revision: result.revision,
    sourceCount: layer.sources.length,
    driverSections: explainabilityLayer.drivers.sections.length,
    confidenceScore: explainabilityLayer.confidenceAnalysis.confidenceScore,
    consumesIntelligenceOnly: true,
    createsRecommendation: true,
    executesActions: false,
    purpose: ADVISORY_RECOMMENDATION_PURPOSE,
    explainabilityPurpose: ADVISORY_EXPLAINABILITY_PURPOSE,
    explainabilityTag: MRP_ADVISORY_EXPLAINABILITY_TAG,
  });

  return layer;
}

export function traceAdvisoryRecommendationOnce(mountKey?: string | null): void {
  logRecommendationOnce(`trace:${mountKey ?? "default"}`, {
    action: "advisory_recommendation_active",
    mountKey: mountKey ?? null,
    purpose: ADVISORY_RECOMMENDATION_PURPOSE,
  });
}

export function resetAdvisoryRecommendationRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
