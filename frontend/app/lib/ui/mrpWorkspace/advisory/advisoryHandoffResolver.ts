/**
 * MRP:5A:5 — Build RecommendationPackage from advisory workspace state.
 */

import type { AdvisoryExplainabilityLayer } from "./advisoryExplainabilityContract.ts";
import {
  type RecommendationPackage,
  type AdvisoryHandoffInput,
} from "./advisoryHandoffContract.ts";
import type { AdvisoryWorkspaceState } from "./advisoryWorkspaceStateContract.ts";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function buildSupportingDriversFromExplainability(
  explainabilityLayer: AdvisoryExplainabilityLayer
): readonly string[] {
  return Object.freeze(
    explainabilityLayer.drivers.sections.flatMap((section) =>
      section.drivers.map((driver) => `${section.label}: ${driver.label} — ${driver.detail}`)
    )
  );
}

export function buildRecommendationPackage(
  state: AdvisoryWorkspaceState,
  input: AdvisoryHandoffInput = {}
): RecommendationPackage | null {
  if (!state.workspaceContext.hasSelection || !state.recommendationId) {
    return null;
  }

  const recommendationTitle =
    normalizeText(state.recommendationTitle) ||
    normalizeText(state.recommendationLayer.card.recommendation);
  const rationale =
    normalizeText(state.rationale) || normalizeText(state.recommendationLayer.card.why);

  if (!recommendationTitle || !rationale) {
    return null;
  }

  const supportingDrivers = buildSupportingDriversFromExplainability(state.explainabilityLayer);

  return Object.freeze({
    recommendationId: state.recommendationId,
    recommendationTitle,
    confidence: state.confidence,
    rationale,
    supportingDrivers,
    sourceScenarioId: state.sourceScenarioId,
    sourceDecisionId: state.sourceDecisionId,
    createdAt: input.createdAt ?? new Date().toISOString(),
  });
}

export function buildRecommendationPackageSignature(
  recommendationPackage: RecommendationPackage
): string {
  return JSON.stringify(recommendationPackage);
}
