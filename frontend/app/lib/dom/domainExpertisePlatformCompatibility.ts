import type { DomainExpertisePlatformCompatibilityEntry } from "./domainExpertisePlatformFreezeTypes.ts";

export const DOMAIN_EXPERTISE_COMPATIBILITY_MATRIX: readonly DomainExpertisePlatformCompatibilityEntry[] = Object.freeze([
  Object.freeze({ targetLayer: "CORE", targetName: "Core Platform", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "CORE may consume frozen domain metadata through public DOM APIs.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "KNL", targetName: "Knowledge Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "KNL may index domain expertise metadata without mutating DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "DS", targetName: "Data Substrate", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "DS may reference frozen domain contracts as metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "INT", targetName: "Integration Layer", compatibility: "consumer-compatible", boundary: "public-api", notes: "INT may transport DOM manifests and registries through public APIs.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LLM", targetName: "Language Model Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LLM integrations may inspect DOM metadata without prompts or inference in DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "APP", targetName: "Application Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "APP may consume domain contracts for future product behavior outside DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "ASS", targetName: "Assistant Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "ASS may read DOM platform metadata without adding assistant runtime behavior.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LAY", targetName: "Executive Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LAY may consume reasoning and recommendation contracts as metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "IDN", targetName: "Identity Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "IDN may reference domain metadata without identity behavior changes.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "OPS", targetName: "Operations Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "OPS may consume release metadata without operational runtime in DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "BUS", targetName: "Business Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "BUS may consume frozen domain expertise metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "STE", targetName: "Simulation & Testing Engine", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "STE may test against DOM metadata without simulation logic in DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "EVE", targetName: "Event Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "EVE may reference release metadata without event runtime in DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "Future platform extensions", targetName: "Future Domain Platform Extensions", compatibility: "future-compatible", boundary: "future-extension", notes: "Future DOM phases must preserve metadata-only public API consumption.", runtimeDependency: false }),
]);

export function getDomainExpertisePlatformCompatibilityMatrix(): readonly DomainExpertisePlatformCompatibilityEntry[] {
  return DOMAIN_EXPERTISE_COMPATIBILITY_MATRIX;
}

export function isDomainExpertisePlatformCompatibilityMatrixValid(
  matrix: readonly DomainExpertisePlatformCompatibilityEntry[] = DOMAIN_EXPERTISE_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = ["CORE", "KNL", "DS", "INT", "LLM", "APP", "ASS", "LAY", "IDN", "OPS", "BUS", "STE", "EVE", "Future platform extensions"];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return (
    requiredTargets.every((target) => targetSet.has(target)) &&
    matrix.every((entry) => entry.runtimeDependency === false && entry.notes.trim().length > 0)
  );
}
