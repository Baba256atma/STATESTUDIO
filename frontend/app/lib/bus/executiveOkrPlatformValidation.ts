import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatformManifest } from "./executiveOkrPlatformManifest.ts";
import { EXECUTIVE_OKR_PLATFORM_REGISTRY } from "./executiveOkrPlatformRegistry.ts";
import type {
  ExecutiveOkrPlatformManifest,
  ExecutiveOkrPlatformRegistry,
  ExecutiveOkrPlatformValidation,
} from "./executiveOkrPlatformTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveOkrPlatformValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateRegistry(registry: ExecutiveOkrPlatformRegistry): readonly string[] {
  const errors: string[] = [];

  if (registry.platformName !== "Executive OKR Platform") errors.push("invalid-platform-name");
  if (registry.platformId !== "BUS-13") errors.push("invalid-platform-id");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (!registry.description) errors.push("missing-description");
  if (registry.lifecycle.status !== "Foundation" || registry.lifecycle.state !== "Immutable") errors.push("invalid-lifecycle");
  if (registry.dependencies.length !== 9) errors.push("invalid-dependencies");
  if (!registry.dependencies.some((dependency) => dependency.dependencyId === "BUS Executive KPI Platform")) errors.push("missing-kpi-freeze-dependency");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.capabilities.length !== 10) errors.push("invalid-capabilities");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.releaseMetadata.metadataOnly || !registry.releaseMetadata.immutable) errors.push("invalid-release-metadata");
  if (
    registry.extensionPolicy.foundationMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.businessLogicAllowed ||
    registry.extensionPolicy.okrScoringAllowed ||
    registry.extensionPolicy.progressCalculationAllowed
  ) {
    errors.push("invalid-extension-policy");
  }

  errors.push(...duplicateValues(registry.capabilities.map((capability) => capability.capabilityId)).map((id) => `duplicate-capability:${id}`));
  errors.push(...duplicateValues(registry.publicApis.map((api) => api.apiName)).map((id) => `duplicate-public-api:${id}`));

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveOkrPlatformManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platform !== "Executive OKR Platform") errors.push("invalid-manifest-platform");
  if (manifest.platformId !== "BUS-13") errors.push("invalid-manifest-platform-id");
  if (manifest.version !== "1.0.0") errors.push("invalid-manifest-version");
  if (manifest.phase !== "BUS-13") errors.push("invalid-manifest-phase");
  if (manifest.capabilities.length !== 10) errors.push("invalid-manifest-capabilities");
  if (manifest.dependencies.length !== 9) errors.push("invalid-manifest-dependencies");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (!manifest.kpiFreezeAvailable || manifest.kpiFreezeState !== "Certified Frozen Released") errors.push("kpi-freeze-unavailable");
  if (manifest.certificationStatus !== "Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-manifest-release-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveOkrPlatform(
  registry: ExecutiveOkrPlatformRegistry = EXECUTIVE_OKR_PLATFORM_REGISTRY,
  manifest: ExecutiveOkrPlatformManifest = getExecutiveOkrPlatformManifest()
): ExecutiveOkrPlatformValidation {
  const kpiFreezeState = getExecutiveKpiPlatformFreezeState();
  const errors = Object.freeze([
    ...(kpiFreezeState.status === "PASS" && kpiFreezeState.finalState === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);
  return result(errors);
}
