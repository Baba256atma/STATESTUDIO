import type { DomainOntologyCompatibilityEntry } from "./domainOntologyPlatformFreezeTypes.ts";

export const DOMAIN_ONTOLOGY_COMPATIBILITY_MATRIX: readonly DomainOntologyCompatibilityEntry[] = Object.freeze([
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
    notes: "May reference frozen vocabulary package metadata through DOM-2 public exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "KNL",
    targetName: "Knowledge Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Knowledge systems may consume frozen ontology metadata read-only.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "APP",
    targetName: "Application Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Application modules may inspect ontology exports without mutating them.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "LAY",
    targetName: "Executive Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Executive layers may reference ontology metadata as read-only context.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "ASS",
    targetName: "Assistant Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Assistant systems may consume ontology exports without inference behavior.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-4",
    targetName: "Future KPI Contract Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "KPI contracts must consume DOM-3 through frozen metadata only.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-5",
    targetName: "Future Regulation Metadata Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Regulation metadata must remain outside DOM-3 ontology freeze files.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-6",
    targetName: "Future Reasoning Contracts Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Reasoning contracts must not add runtime inference to DOM-3 platform freeze.",
    runtimeDependency: false,
  }),
]);

export function getDomainOntologyPlatformCompatibilityMatrix(): readonly DomainOntologyCompatibilityEntry[] {
  return DOMAIN_ONTOLOGY_COMPATIBILITY_MATRIX;
}

export function isDomainOntologyCompatibilityMatrixValid(
  matrix: readonly DomainOntologyCompatibilityEntry[] = DOMAIN_ONTOLOGY_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = ["DOM-1", "DOM-2", "KNL", "APP", "LAY", "ASS", "DOM-4", "DOM-5", "DOM-6"];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return (
    requiredTargets.every((target) => targetSet.has(target)) &&
    matrix.every((entry) => entry.runtimeDependency === false && entry.notes.trim().length > 0)
  );
}
