import type { DomainRecommendationCompatibilityEntry } from "./domainRecommendationPlatformFreezeTypes.ts";

export const DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX: readonly DomainRecommendationCompatibilityEntry[] = Object.freeze([
  Object.freeze({
    targetLayer: "DOM-1",
    targetName: "Domain Foundation",
    compatibility: "compatible",
    boundary: "public-api",
    notes: "Consumes domain package identity and validation contracts through DOM-1 public exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-2",
    targetName: "Vocabulary Platform",
    compatibility: "compatible",
    boundary: "public-api",
    notes: "May reference frozen vocabulary metadata through DOM-2 public exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-3",
    targetName: "Ontology Platform",
    compatibility: "compatible",
    boundary: "public-api",
    notes: "May reference frozen ontology metadata through DOM-3 public exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-4",
    targetName: "KPI Platform",
    compatibility: "compatible",
    boundary: "public-api",
    notes: "May reference frozen KPI metadata through DOM-4 public exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-5",
    targetName: "Regulation Platform",
    compatibility: "compatible",
    boundary: "public-api",
    notes: "May reference frozen regulation metadata through DOM-5 certification exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-6",
    targetName: "Reasoning Platform",
    compatibility: "compatible",
    boundary: "public-api",
    notes: "May reference frozen reasoning contract metadata through DOM-6 platform freeze exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "KNL",
    targetName: "Knowledge Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Knowledge systems may consume recommendation contracts as read-only metadata.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "APP",
    targetName: "Executive Intelligence Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Application modules may inspect recommendation contract requirements without generating recommendations.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "LAY",
    targetName: "Executive Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Executive layers may consume recommendation contracts as metadata without judgment or decision making.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "ASS",
    targetName: "Assistant Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Assistant systems may read recommendation metadata without autonomous recommendations or execution.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "INT",
    targetName: "Integration Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Integration modules may transport recommendation contracts as immutable metadata.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM Platform Certification",
    targetName: "Future DOM Platform Certification",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Future DOM certification may consume DOM-7 freeze metadata through stable public APIs.",
    runtimeDependency: false,
  }),
]);

export function getDomainRecommendationPlatformCompatibilityMatrix(): readonly DomainRecommendationCompatibilityEntry[] {
  return DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX;
}

export function isDomainRecommendationCompatibilityMatrixValid(
  matrix: readonly DomainRecommendationCompatibilityEntry[] = DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = [
    "DOM-1",
    "DOM-2",
    "DOM-3",
    "DOM-4",
    "DOM-5",
    "DOM-6",
    "KNL",
    "APP",
    "LAY",
    "ASS",
    "INT",
    "DOM Platform Certification",
  ];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return (
    requiredTargets.every((target) => targetSet.has(target)) &&
    matrix.every((entry) => entry.runtimeDependency === false && entry.notes.trim().length > 0)
  );
}
