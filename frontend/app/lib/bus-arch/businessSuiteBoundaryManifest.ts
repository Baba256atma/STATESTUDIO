import { BusinessSuiteBoundaryRegistry } from "./businessSuiteBoundaryRegistry.ts";
import type { BusinessSuiteBoundaryManifest } from "./businessSuiteBoundaryTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-arch-2-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildBusinessSuiteBoundaryManifest(): BusinessSuiteBoundaryManifest {
  const registry = BusinessSuiteBoundaryRegistry;
  const deterministicFingerprint = fingerprint([
    registry.metadata.boundaryId,
    registry.metadata.version,
    ...registry.platformBoundaries.map((boundary) => `${boundary.platformId}:${boundary.ownedDomain}`).sort(),
    ...registry.ownershipRegistry.map((ownership) => `${ownership.platformId}:${ownership.ownedDomain}`).sort(),
    ...registry.responsibilityRegistry.map((responsibility) => `${responsibility.platformId}:${responsibility.responsibilityId}`).sort(),
    ...registry.exposedServicesRegistry.map((exposure) => `${exposure.platformId}:${exposure.exposedCapability}`).sort(),
    ...registry.forbiddenAccessRegistry.map((restriction) => `${restriction.platformId}:${restriction.forbiddenAccess}`).sort(),
    ...registry.extensionRegistry.map((extension) => `${extension.platformId}:${extension.exposedCapability}`).sort(),
  ]);

  return Object.freeze({
    version: registry.metadata.version,
    architectureId: registry.metadata.architectureId,
    platformBoundaryCatalog: registry.platformBoundaries,
    ownershipMatrix: registry.ownershipRegistry,
    responsibilityMatrix: registry.responsibilityRegistry,
    exposureMatrix: registry.exposedServicesRegistry,
    consumerMatrix: registry.consumerRegistry,
    restrictionMatrix: registry.forbiddenAccessRegistry,
    extensionMatrix: registry.extensionRegistry,
    categories: registry.categories,
    metadata: registry.metadata,
    deterministicFingerprint,
  });
}
