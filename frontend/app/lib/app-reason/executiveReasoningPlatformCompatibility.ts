import type { ExecutiveReasoningPlatformCompatibilityEntry } from "./executiveReasoningPlatformFreezeTypes.ts";

export const EXECUTIVE_REASONING_COMPATIBILITY_MATRIX: readonly ExecutiveReasoningPlatformCompatibilityEntry[] = Object.freeze([
  Object.freeze({ targetLayer: "ExecutiveContextPlatformFreeze", targetName: "Executive Context Platform Freeze", compatibility: "compatible", boundary: "public-api", notes: "Executive Reasoning contracts consume frozen context platform metadata through public APIs.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "APP-DOM Platform Freeze", targetName: "APP-DOM Consumer Platform Freeze", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "Executive Reasoning may inspect domain bridge metadata indirectly through context metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "DomainExpertisePlatformFreeze", targetName: "Domain Expertise Platform Freeze", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "Executive Reasoning remains compatible with frozen DOM metadata through APP-DOM and APP-CTX boundaries.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "APP", targetName: "Executive Intelligence Platform", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "APP engines may consume frozen reasoning contracts as metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "CORE", targetName: "Core Platform", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "CORE may reference reasoning platform identity metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "KNL", targetName: "Knowledge Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "KNL may inspect reasoning contract trace metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "DS", targetName: "Data Substrate", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "DS may store or transport immutable reasoning metadata externally.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "INT", targetName: "Integration Layer", compatibility: "consumer-compatible", boundary: "public-api", notes: "INT may integrate frozen reasoning metadata without runtime execution.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LAY", targetName: "Executive Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LAY may consume APP reasoning contracts without modifying LAY engines.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "ASS", targetName: "Assistant Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "ASS may inspect reasoning metadata without chat runtime behavior.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LLM", targetName: "Language Model Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LLM integrations may inspect metadata without prompting behavior in APP-REASON.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "OPS", targetName: "Operations Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "OPS may consume freeze and release metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "BUS", targetName: "Business Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "BUS may consume contract metadata without business reasoning.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "STE", targetName: "Simulation & Testing Engine", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "STE may test metadata contracts without simulation execution in APP-REASON.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "EVE", targetName: "Event Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "EVE may reference platform release metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "Future Executive Judgment Platform", targetName: "Future Executive Judgment Platform", compatibility: "future-compatible", boundary: "future-extension", notes: "Future judgment phases must consume APP-REASON through frozen public APIs.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "Future Executive Recommendation Platform", targetName: "Future Executive Recommendation Platform", compatibility: "future-compatible", boundary: "future-extension", notes: "Future recommendation phases must consume APP-REASON metadata without changing frozen contracts.", runtimeDependency: false }),
]);

export function getExecutiveReasoningPlatformCompatibilityMatrix(): readonly ExecutiveReasoningPlatformCompatibilityEntry[] {
  return EXECUTIVE_REASONING_COMPATIBILITY_MATRIX;
}

export function isExecutiveReasoningPlatformCompatibilityMatrixValid(
  matrix: readonly ExecutiveReasoningPlatformCompatibilityEntry[] = EXECUTIVE_REASONING_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = [
    "ExecutiveContextPlatformFreeze",
    "APP-DOM Platform Freeze",
    "DomainExpertisePlatformFreeze",
    "APP",
    "CORE",
    "KNL",
    "DS",
    "INT",
    "LAY",
    "ASS",
    "LLM",
    "OPS",
    "BUS",
    "STE",
    "EVE",
    "Future Executive Judgment Platform",
    "Future Executive Recommendation Platform",
  ];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return requiredTargets.every((target) => targetSet.has(target)) && matrix.every((entry) => !entry.runtimeDependency && entry.notes.length > 0);
}
