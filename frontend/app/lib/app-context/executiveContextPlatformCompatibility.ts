import type { ExecutiveContextPlatformCompatibilityEntry } from "./executiveContextPlatformFreezeTypes.ts";

export const EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX: readonly ExecutiveContextPlatformCompatibilityEntry[] = Object.freeze([
  Object.freeze({ targetLayer: "APP-DOM Platform Freeze", targetName: "APP-DOM Consumer Platform Freeze", compatibility: "compatible", boundary: "public-api", notes: "Executive Context consumes APP-DOM platform status through APP-CTX builder metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "DOM Platform Freeze", targetName: "Domain Expertise Platform Freeze", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "Executive Context references DOM only through APP-DOM metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "APP", targetName: "Executive Intelligence Platform", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "APP engines consume frozen Executive Context containers.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "CORE", targetName: "Core Platform", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "CORE may consume context metadata contracts.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "KNL", targetName: "Knowledge Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "KNL may inspect context metadata without mutation.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "DS", targetName: "Data Substrate", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "DS may reference context snapshots.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "INT", targetName: "Integration Layer", compatibility: "consumer-compatible", boundary: "public-api", notes: "INT may transport frozen context metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LAY", targetName: "Executive Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LAY may consume Executive Context as input metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "ASS", targetName: "Assistant Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "ASS may consume context metadata without assistant runtime changes.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LLM", targetName: "Language Model Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LLM integrations may inspect context metadata without prompting behavior in APP-CTX.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "OPS", targetName: "Operations Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "OPS may consume release metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "BUS", targetName: "Business Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "BUS may consume context metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "STE", targetName: "Simulation & Testing Engine", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "STE may test context metadata without simulation execution in APP-CTX.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "EVE", targetName: "Event Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "EVE may reference context release metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "Future Executive Engines", targetName: "Future Executive Engines", compatibility: "future-compatible", boundary: "future-extension", notes: "Future engines must consume Executive Context through frozen public APIs.", runtimeDependency: false }),
]);

export function getExecutiveContextPlatformCompatibilityMatrix(): readonly ExecutiveContextPlatformCompatibilityEntry[] {
  return EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX;
}

export function isExecutiveContextPlatformCompatibilityMatrixValid(
  matrix: readonly ExecutiveContextPlatformCompatibilityEntry[] = EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = ["APP-DOM Platform Freeze", "DOM Platform Freeze", "APP", "CORE", "KNL", "DS", "INT", "LAY", "ASS", "LLM", "OPS", "BUS", "STE", "EVE", "Future Executive Engines"];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return requiredTargets.every((target) => targetSet.has(target)) && matrix.every((entry) => !entry.runtimeDependency && entry.notes.length > 0);
}
