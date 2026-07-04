import type { AppDomainPlatformCompatibilityEntry } from "./appDomainPlatformFreezeTypes.ts";

export const APP_DOMAIN_COMPATIBILITY_MATRIX: readonly AppDomainPlatformCompatibilityEntry[] = Object.freeze([
  Object.freeze({ targetLayer: "DomainExpertisePlatformFreeze", targetName: "Domain Expertise Platform Freeze", compatibility: "compatible", boundary: "public-api", notes: "APP-DOM consumes DOM metadata through the bridge facade only.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "APP", targetName: "Executive Intelligence Platform", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "APP may consume frozen APP-DOM metadata contracts.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "KNL", targetName: "Knowledge Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "KNL may inspect APP-DOM metadata without mutation.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "CORE", targetName: "Core Platform", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "CORE may consume APP-DOM release metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "DS", targetName: "Data Substrate", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "DS may reference APP-DOM metadata snapshots.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "INT", targetName: "Integration Layer", compatibility: "consumer-compatible", boundary: "public-api", notes: "INT may transport APP-DOM frozen metadata through public APIs.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LAY", targetName: "Executive Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LAY may consume selected domain context metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "ASS", targetName: "Assistant Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "ASS may consume domain context metadata without assistant runtime changes.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "LLM", targetName: "Language Model Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "LLM integrations may inspect metadata without prompting behavior in APP-DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "OPS", targetName: "Operations Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "OPS may consume APP-DOM release metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "BUS", targetName: "Business Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "BUS may consume selected domain context metadata.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "STE", targetName: "Simulation & Testing Engine", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "STE may test APP-DOM metadata without simulation execution in APP-DOM.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "EVE", targetName: "Event Layer", compatibility: "consumer-compatible", boundary: "metadata-contract", notes: "EVE may reference APP-DOM release metadata without event runtime changes.", runtimeDependency: false }),
  Object.freeze({ targetLayer: "Future APP engines", targetName: "Future APP Engines", compatibility: "future-compatible", boundary: "future-extension", notes: "Future engines must consume APP-DOM through frozen public APIs.", runtimeDependency: false }),
]);

export function getAppDomainPlatformCompatibilityMatrix(): readonly AppDomainPlatformCompatibilityEntry[] {
  return APP_DOMAIN_COMPATIBILITY_MATRIX;
}

export function isAppDomainPlatformCompatibilityMatrixValid(
  matrix: readonly AppDomainPlatformCompatibilityEntry[] = APP_DOMAIN_COMPATIBILITY_MATRIX
): boolean {
  const requiredTargets = ["DomainExpertisePlatformFreeze", "APP", "KNL", "CORE", "DS", "INT", "LAY", "ASS", "LLM", "OPS", "BUS", "STE", "EVE", "Future APP engines"];
  const targetSet = new Set(matrix.map((entry) => entry.targetLayer));
  return requiredTargets.every((target) => targetSet.has(target)) && matrix.every((entry) => !entry.runtimeDependency && entry.notes.length > 0);
}
