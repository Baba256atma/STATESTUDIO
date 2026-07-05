import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import { buildBusinessSuiteBoundaryManifest, validateBusinessSuiteBoundary } from "./businessSuiteBoundaryIndex.ts";
import { buildBusinessSuiteDependencyManifest, validateBusinessSuiteDependencyMap } from "./businessSuiteDependencyIndex.ts";
import { buildBusinessSuiteApiPolicyManifest } from "./businessSuiteApiPolicyManifest.ts";
import type { BusinessSuiteApiPolicyManifest, BusinessSuiteApiPolicyValidation } from "./businessSuiteApiPolicyTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): BusinessSuiteApiPolicyValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

export function validateBusinessSuiteApiPolicy(
  manifest: BusinessSuiteApiPolicyManifest = buildBusinessSuiteApiPolicyManifest()
): BusinessSuiteApiPolicyValidation {
  const errors: string[] = [];
  const rebuilt = buildBusinessSuiteApiPolicyManifest();
  const boundaryManifest = buildBusinessSuiteBoundaryManifest();
  const dependencyManifest = buildBusinessSuiteDependencyManifest();
  const knownPlatformIds = new Set(boundaryManifest.platformBoundaryCatalog.map((boundary) => boundary.platformId));
  const apiOwnerCounts = new Map<string, number>();
  const extensionOwnerCounts = new Map<string, number>();
  const publicApiIds = new Set(manifest.publicApiCatalog.map((api) => api.apiId));

  if (manifest.architectureId !== "BUS-ARCH") errors.push("invalid-architecture-id");
  if (manifest.version !== "1.0.0") errors.push("invalid-version");
  if (!manifest.metadata.metadataOnly || !manifest.metadata.immutable) errors.push("invalid-api-policy-metadata");
  if (manifest.deterministicFingerprint !== rebuilt.deterministicFingerprint) errors.push("manifest-not-deterministic");
  if (buildBusinessSuiteArchitectureManifest().metadata.architectureId !== "BUS-ARCH") errors.push("bus-arch-1-incompatible");
  if (!validateBusinessSuiteBoundary().valid) errors.push("bus-arch-2-incompatible");
  if (!validateBusinessSuiteDependencyMap().valid) errors.push("bus-arch-3-incompatible");

  errors.push(...duplicateValues(manifest.publicApiCatalog.map((api) => api.apiId)).map((id) => `duplicate-public-api:${id}`));
  errors.push(...duplicateValues(manifest.extensionCatalog.map((extension) => extension.extensionPointId)).map((id) => `duplicate-extension-point:${id}`));
  errors.push(...duplicateValues(manifest.consumerPermissionCatalog.map((permission) => permission.permissionId)).map((id) => `duplicate-consumer-permission:${id}`));

  for (const api of manifest.publicApiCatalog) {
    apiOwnerCounts.set(api.apiId, (apiOwnerCounts.get(api.apiId) ?? 0) + 1);
    if (!knownPlatformIds.has(api.owningPlatformId)) errors.push(`unknown-api-owner:${api.apiId}`);
    if (api.visibility !== "public") errors.push(`invalid-api-visibility:${api.apiId}`);
    if (!api.metadataOnly || !api.immutable) errors.push(`invalid-public-api:${api.apiId}`);
    if (api.consumerScope.length === 0) errors.push(`missing-consumer-scope:${api.apiId}`);
  }
  for (const surface of manifest.apiSurfaceCatalog) {
    if (!knownPlatformIds.has(surface.platformId)) errors.push(`unknown-api-surface-platform:${surface.surfaceId}`);
    if (!surface.publicApiIds.every((apiId) => publicApiIds.has(apiId))) errors.push(`surface-declares-unknown-api:${surface.surfaceId}`);
    if (!surface.metadataOnly || !surface.immutable) errors.push(`invalid-api-surface:${surface.surfaceId}`);
  }
  for (const extension of manifest.extensionCatalog) {
    extensionOwnerCounts.set(extension.extensionPointId, (extensionOwnerCounts.get(extension.extensionPointId) ?? 0) + 1);
    if (!knownPlatformIds.has(extension.owningPlatformId)) errors.push(`unknown-extension-owner:${extension.extensionPointId}`);
    if (!publicApiIds.has(extension.supportedApiId)) errors.push(`unknown-extension-api:${extension.extensionPointId}`);
    if (!extension.certificationRequired) errors.push(`extension-certification-missing:${extension.extensionPointId}`);
    if (!extension.metadataOnly || !extension.immutable) errors.push(`invalid-extension-point:${extension.extensionPointId}`);
  }
  for (const permission of manifest.consumerPermissionCatalog) {
    const dependencyExists = dependencyManifest.consumerCatalog.some(
      (consumer) => consumer.platformId === permission.consumerPlatformId && consumer.consumesPlatformId === permission.providerPlatformId
    );
    if (!dependencyExists) errors.push(`unknown-consumer-permission:${permission.permissionId}`);
    if (!permission.allowedApiIds.every((apiId) => publicApiIds.has(apiId) || apiId.startsWith("BUS-ARCH-"))) errors.push(`consumer-permission-unknown-api:${permission.permissionId}`);
    if (!permission.metadataOnly || !permission.immutable) errors.push(`invalid-consumer-permission:${permission.permissionId}`);
  }
  for (const [apiId, count] of apiOwnerCounts) {
    if (count !== 1) errors.push(`invalid-api-owner-count:${apiId}`);
  }
  for (const [extensionPointId, count] of extensionOwnerCounts) {
    if (count !== 1) errors.push(`invalid-extension-owner-count:${extensionPointId}`);
  }
  if (manifest.compatibilityPolicy.length !== 3) errors.push("compatibility-policy-incomplete");
  if (!manifest.compatibilityPolicy.every((policy) => policy.certificationRequired && policy.metadataOnly && policy.immutable)) errors.push("compatibility-policy-invalid");
  if (!manifest.versionPolicy.metadataOnly || !manifest.versionPolicy.immutable) errors.push("version-policy-invalid");
  if (!manifest.deprecationPolicy.metadataOnly || !manifest.deprecationPolicy.immutable) errors.push("deprecation-policy-invalid");
  if (!manifest.extensionPolicy.backwardCompatibilityRequired || !manifest.extensionPolicy.metadataOnly || !manifest.extensionPolicy.immutable) errors.push("extension-policy-invalid");

  return result(errors);
}
