import type { DomainReasoningCompatibilityEntry } from "./domainReasoningPlatformFreezeTypes.ts";

export const DOMAIN_REASONING_COMPATIBILITY_MATRIX: readonly DomainReasoningCompatibilityEntry[] = Object.freeze([
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
    targetLayer: "KNL",
    targetName: "Knowledge Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Knowledge systems may consume reasoning contracts as read-only metadata.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "APP",
    targetName: "Executive Intelligence Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Application modules may inspect reasoning contract requirements without executing reasoning.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "LAY",
    targetName: "Executive Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Executive layers may consume reasoning contracts as context without judgment or inference.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "ASS",
    targetName: "Assistant Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Assistant systems may read reasoning metadata without recommendations or runtime execution.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "INT",
    targetName: "Integration Layer",
    compatibility: "consumer-compatible",
    boundary: "metadata-contract",
    notes: "Integration modules may transport reasoning contracts as immutable metadata.",
    runtimeDependency: false,
  }),
  Object.freeze({
    targetLayer: "DOM-7",
    targetName: "Future Recommendation Contract Platform",
    compatibility: "future-compatible",
    boundary: "future-extension",
    notes: "Recommendation contracts must remain separate from DOM-6 reasoning contracts.",
    runtimeDependency: false,
  }),
]);

export function getDomainReasoningPlatformCompatibilityMatrix(): readonly DomainReasoningCompatibilityEntry[] {
  return DOMAIN_REASONING_COMPATIBILITY_MATRIX;
}

export function isDomainReasoningCompatibilityMatrixValid(
  matrix: readonly DomainReasoningCompatibilityEntry[] = DOMAIN_REASONING_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = ["DOM-1", "DOM-2", "DOM-3", "DOM-4", "DOM-5", "KNL", "APP", "LAY", "ASS", "INT", "DOM-7"];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return (
    requiredTargets.every((target) => targetSet.has(target)) &&
    matrix.every((entry) => entry.runtimeDependency === false && entry.notes.trim().length > 0)
  );
}
