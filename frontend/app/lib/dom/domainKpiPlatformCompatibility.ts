import type { DomainKpiCompatibilityEntry } from "./domainKpiPlatformFreezeTypes.ts";

export const DOMAIN_KPI_COMPATIBILITY_MATRIX: readonly DomainKpiCompatibilityEntry[] = Object.freeze([
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
    targetLayer: "KNL",
    targetName: "Knowledge Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Knowledge systems may consume frozen KPI contract metadata read-only.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "APP",
    targetName: "Application Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Application modules may inspect KPI export metadata without calculating metrics.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "LAY",
    targetName: "Executive Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Executive layers may reference KPI contract metadata as read-only context.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "ASS",
    targetName: "Assistant Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Assistant systems may consume KPI metadata without recommendations or inference.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DS",
    targetName: "Data Source Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Data source integrations may inspect KPI reference metadata without evaluation behavior.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "INT",
    targetName: "Integration Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Integration modules may transport KPI contracts as immutable metadata.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-5",
    targetName: "Future Regulation Metadata Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Regulation metadata must remain outside DOM-4 KPI platform freeze files.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-6",
    targetName: "Future Reasoning Contracts Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Reasoning contracts must not add runtime inference to DOM-4 platform freeze.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-7",
    targetName: "Future Recommendation Contracts Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Recommendation contracts must remain separate from DOM-4 KPI contract metadata.",
    runtimeDependency: false,
  }),
]);

export function getDomainKpiPlatformCompatibilityMatrix(): readonly DomainKpiCompatibilityEntry[] {
  return DOMAIN_KPI_COMPATIBILITY_MATRIX;
}

export function isDomainKpiCompatibilityMatrixValid(
  matrix: readonly DomainKpiCompatibilityEntry[] = DOMAIN_KPI_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = [
    "DOM-1",
    "DOM-2",
    "DOM-3",
    "KNL",
    "APP",
    "LAY",
    "ASS",
    "DS",
    "INT",
    "DOM-5",
    "DOM-6",
    "DOM-7",
  ];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return (
    requiredTargets.every((target) => targetSet.has(target)) &&
    matrix.every((entry) => entry.runtimeDependency === false && entry.notes.trim().length > 0)
  );
}
