/**
 * MRP:5A:5 — Validate RecommendationPackage for governance intake.
 */

import type { AdvisoryConfidenceLevel } from "../advisory/advisoryStateContract.ts";
import type { RecommendationPackage } from "../advisory/advisoryHandoffContract.ts";
import type { RecommendationPackageValidation } from "./governanceRecommendationIntakeContract.ts";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidConfidence(value: unknown): value is AdvisoryConfidenceLevel {
  return (
    value === "unknown" ||
    value === "low" ||
    value === "moderate" ||
    value === "high" ||
    value === "very_high"
  );
}

function isValidTimestamp(value: string): boolean {
  if (!value) return false;
  return Number.isFinite(Date.parse(value));
}

export function validateRecommendationPackage(
  recommendationPackage: RecommendationPackage
): RecommendationPackageValidation {
  const errors: string[] = [];

  if (!normalizeText(recommendationPackage.recommendationId)) {
    errors.push("recommendationId is required.");
  }
  if (!normalizeText(recommendationPackage.recommendationTitle)) {
    errors.push("recommendationTitle is required.");
  }
  if (!isValidConfidence(recommendationPackage.confidence)) {
    errors.push("confidence must be a valid advisory confidence level.");
  }
  if (!normalizeText(recommendationPackage.rationale)) {
    errors.push("rationale is required.");
  }
  if (!Array.isArray(recommendationPackage.supportingDrivers)) {
    errors.push("supportingDrivers must be an array.");
  }
  if (
    recommendationPackage.sourceScenarioId !== null &&
    !normalizeText(recommendationPackage.sourceScenarioId)
  ) {
    errors.push("sourceScenarioId must be null or a non-empty string.");
  }
  if (
    recommendationPackage.sourceDecisionId !== null &&
    !normalizeText(recommendationPackage.sourceDecisionId)
  ) {
    errors.push("sourceDecisionId must be null or a non-empty string.");
  }
  if (!isValidTimestamp(normalizeText(recommendationPackage.createdAt))) {
    errors.push("createdAt must be a valid timestamp.");
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}
