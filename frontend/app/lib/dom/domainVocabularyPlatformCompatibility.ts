import type { DomainVocabularyCompatibilityEntry } from "./domainVocabularyPlatformFreezeTypes.ts";

export const DOMAIN_VOCABULARY_COMPATIBILITY_MATRIX: readonly DomainVocabularyCompatibilityEntry[] = Object.freeze([
  Object.freeze({
    targetLayer: "DOM-1",
    targetName: "Domain Foundation",
    compatibility: "compatible",
    boundary: "public-api",
    notes: "Consumes domain identity and validation contracts through DOM-1 public exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "KNL",
    targetName: "Knowledge Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Knowledge systems may consume frozen vocabulary metadata through public exports.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "APP",
    targetName: "Application Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Application modules may inspect exported vocabulary metadata without mutating it.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "LAY",
    targetName: "Executive Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Executive layers may reference vocabulary metadata as read-only context.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "ASS",
    targetName: "Assistant Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Assistant systems may consume vocabulary exports without inference behavior.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-3",
    targetName: "Future Ontology Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Ontology expansion must consume DOM-2 through public frozen metadata only.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-4",
    targetName: "Future KPI Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "KPI expansion must not add KPI semantics to DOM-2 vocabulary freeze files.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-5",
    targetName: "Future Regulation Layer",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Regulation expansion must remain outside the DOM-2 vocabulary platform.",
    runtimeDependency: false,
  }),
]);

export function getDomainVocabularyPlatformCompatibilityMatrix(): readonly DomainVocabularyCompatibilityEntry[] {
  return DOMAIN_VOCABULARY_COMPATIBILITY_MATRIX;
}

export function isDomainVocabularyCompatibilityMatrixValid(
  matrix: readonly DomainVocabularyCompatibilityEntry[] = DOMAIN_VOCABULARY_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = ["DOM-1", "KNL", "APP", "LAY", "ASS", "DOM-3", "DOM-4", "DOM-5"];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return (
    requiredTargets.every((target) => targetSet.has(target)) &&
    matrix.every((entry) => entry.runtimeDependency === false && entry.notes.trim().length > 0)
  );
}
