import { buildBusinessSuiteBoundaryManifest } from "./businessSuiteBoundaryManifest.ts";
import { BusinessSuiteBoundaryRegistry } from "./businessSuiteBoundaryRegistry.ts";
import type { BusinessSuiteBoundaryManifest, BusinessSuiteBoundaryValidation } from "./businessSuiteBoundaryTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): BusinessSuiteBoundaryValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

export function validateBusinessSuiteBoundary(
  manifest: BusinessSuiteBoundaryManifest = buildBusinessSuiteBoundaryManifest()
): BusinessSuiteBoundaryValidation {
  const errors: string[] = [];
  const rebuilt = buildBusinessSuiteBoundaryManifest();
  const boundaryPlatformIds = new Set(manifest.platformBoundaryCatalog.map((boundary) => boundary.platformId));
  const ownershipByPlatform = new Map<string, number>();
  const responsibilityByPlatform = new Map<string, number>();
  const exposuresByPlatform = new Map<string, Set<string>>();

  if (manifest.architectureId !== "BUS-ARCH") errors.push("invalid-architecture-id");
  if (manifest.version !== "1.0.0") errors.push("invalid-version");
  if (!manifest.metadata.metadataOnly || !manifest.metadata.immutable) errors.push("invalid-boundary-metadata");
  if (manifest.deterministicFingerprint !== rebuilt.deterministicFingerprint) errors.push("manifest-not-deterministic");
  if (manifest.platformBoundaryCatalog.length === 0) errors.push("missing-boundaries");
  if (manifest.ownershipMatrix.length !== manifest.platformBoundaryCatalog.length) errors.push("ownership-matrix-incomplete");
  if (manifest.responsibilityMatrix.length !== manifest.platformBoundaryCatalog.length) errors.push("responsibility-matrix-incomplete");
  if (manifest.restrictionMatrix.length < manifest.platformBoundaryCatalog.length) errors.push("restriction-matrix-incomplete");
  if (manifest.extensionMatrix.length !== manifest.platformBoundaryCatalog.length) errors.push("extension-matrix-incomplete");

  errors.push(...duplicateValues(manifest.platformBoundaryCatalog.map((boundary) => boundary.boundaryId)).map((id) => `duplicate-boundary:${id}`));
  errors.push(...duplicateValues(manifest.categories).map((id) => `duplicate-category:${id}`));
  errors.push(...duplicateValues(manifest.ownershipMatrix.map((ownership) => ownership.ownershipId)).map((id) => `duplicate-ownership:${id}`));

  for (const ownership of manifest.ownershipMatrix) {
    ownershipByPlatform.set(ownership.platformId, (ownershipByPlatform.get(ownership.platformId) ?? 0) + 1);
    if (!ownership.exclusive || !ownership.metadataOnly || !ownership.immutable) errors.push(`invalid-ownership:${ownership.ownershipId}`);
    if (!boundaryPlatformIds.has(ownership.platformId)) errors.push(`unknown-ownership-platform:${ownership.platformId}`);
  }
  for (const responsibility of manifest.responsibilityMatrix) {
    responsibilityByPlatform.set(responsibility.platformId, (responsibilityByPlatform.get(responsibility.platformId) ?? 0) + 1);
    if (!responsibility.metadataOnly || !responsibility.immutable) errors.push(`invalid-responsibility:${responsibility.responsibilityId}`);
    if (!boundaryPlatformIds.has(responsibility.platformId)) errors.push(`unknown-responsibility-platform:${responsibility.platformId}`);
  }
  for (const exposure of manifest.exposureMatrix) {
    const capabilities = exposuresByPlatform.get(exposure.platformId) ?? new Set<string>();
    capabilities.add(exposure.exposedCapability);
    exposuresByPlatform.set(exposure.platformId, capabilities);
    if (exposure.internalImplementationExposed) errors.push(`forbidden-exposure:${exposure.exposureId}`);
    if (!exposure.metadataOnly || !exposure.immutable) errors.push(`invalid-exposure:${exposure.exposureId}`);
  }
  for (const restriction of manifest.restrictionMatrix) {
    if (!restriction.metadataOnly || !restriction.immutable) errors.push(`invalid-restriction:${restriction.restrictionId}`);
    if (!boundaryPlatformIds.has(restriction.platformId)) errors.push(`unknown-restriction-platform:${restriction.platformId}`);
  }
  for (const boundary of manifest.platformBoundaryCatalog) {
    if ((ownershipByPlatform.get(boundary.platformId) ?? 0) !== 1) errors.push(`invalid-ownership-count:${boundary.platformId}`);
    if ((responsibilityByPlatform.get(boundary.platformId) ?? 0) !== 1) errors.push(`invalid-responsibility-count:${boundary.platformId}`);
    const exposures = exposuresByPlatform.get(boundary.platformId) ?? new Set<string>();
    for (const publicApi of boundary.publicApis) {
      if (!exposures.has(publicApi)) errors.push(`undeclared-exposure:${boundary.platformId}:${publicApi}`);
    }
    if (!boundary.metadataOnly || !boundary.immutable) errors.push(`invalid-boundary:${boundary.boundaryId}`);
  }

  if (BusinessSuiteBoundaryRegistry.metadata.boundaryId !== "BUS-ARCH-2") errors.push("registry-version-mismatch");

  return result(errors);
}
