import { getExecutiveKpiPlatformManifest } from "./executiveKpiPlatformManifest.ts";
import { EXECUTIVE_KPI_PLATFORM_REGISTRY } from "./executiveKpiPlatformRegistry.ts";
import type {
  ExecutiveKpiPlatformManifest,
  ExecutiveKpiPlatformRegistry,
  ExecutiveKpiPlatformValidation,
} from "./executiveKpiPlatformTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiPlatformValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateRegistry(registry: ExecutiveKpiPlatformRegistry): readonly string[] {
  const errors: string[] = [];

  if (registry.platformName !== "Executive KPI Platform") errors.push("invalid-platform-name");
  if (registry.platformId !== "BUS-1") errors.push("invalid-platform-id");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (!registry.description) errors.push("missing-description");
  if (registry.lifecycle.status !== "Foundation" || registry.lifecycle.state !== "Immutable") errors.push("invalid-lifecycle");
  if (registry.dependencies.length !== 7) errors.push("invalid-dependencies");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.capabilities.length === 0) errors.push("missing-capabilities");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.releaseMetadata.metadataOnly || !registry.releaseMetadata.immutable) errors.push("invalid-release-metadata");
  if (registry.extensionPolicy.foundationMutationAllowed || registry.extensionPolicy.runtimeExecutionAllowed || registry.extensionPolicy.businessLogicAllowed) errors.push("invalid-extension-policy");

  errors.push(...duplicateValues(registry.capabilities.map((capability) => capability.capabilityId)).map((id) => `duplicate-capability:${id}`));
  errors.push(...duplicateValues(registry.publicApis.map((api) => api.apiName)).map((id) => `duplicate-public-api:${id}`));

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiPlatformManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platform !== "Executive KPI Platform") errors.push("invalid-manifest-platform");
  if (manifest.platformId !== "BUS-1") errors.push("invalid-manifest-platform-id");
  if (manifest.version !== "1.0.0") errors.push("invalid-manifest-version");
  if (manifest.phase !== "BUS-1") errors.push("invalid-manifest-phase");
  if (manifest.capabilities.length === 0) errors.push("missing-manifest-capabilities");
  if (manifest.dependencies.length !== 7) errors.push("invalid-manifest-dependencies");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-manifest-release-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiPlatform(
  registry: ExecutiveKpiPlatformRegistry = EXECUTIVE_KPI_PLATFORM_REGISTRY,
  manifest: ExecutiveKpiPlatformManifest = getExecutiveKpiPlatformManifest()
): ExecutiveKpiPlatformValidation {
  const errors = Object.freeze([...validateRegistry(registry), ...validateManifest(manifest)]);
  return result(errors);
}
