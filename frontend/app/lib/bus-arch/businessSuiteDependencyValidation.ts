import { BusinessSuiteArchitectureRegistry, buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import { BusinessSuiteBoundaryRegistry, buildBusinessSuiteBoundaryManifest, validateBusinessSuiteBoundary } from "./businessSuiteBoundaryIndex.ts";
import { buildBusinessSuiteDependencyManifest } from "./businessSuiteDependencyManifest.ts";
import type { BusinessPlatformDependency, BusinessSuiteDependencyMap, BusinessSuiteDependencyValidation } from "./businessSuiteDependencyTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function hasCycle(edges: readonly BusinessPlatformDependency[]): boolean {
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    const targets = graph.get(edge.sourcePlatformId) ?? [];
    graph.set(edge.sourcePlatformId, [...targets, edge.targetPlatformId]);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(node: string): boolean {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const target of graph.get(node) ?? []) {
      if (visit(target)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }

  return [...graph.keys()].some((node) => visit(node));
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): BusinessSuiteDependencyValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

export function validateBusinessSuiteDependencyMap(
  manifest: BusinessSuiteDependencyMap = buildBusinessSuiteDependencyManifest()
): BusinessSuiteDependencyValidation {
  const errors: string[] = [];
  const rebuilt = buildBusinessSuiteDependencyManifest();
  const knownPlatformIds = new Set(manifest.knownPlatformIds);
  const boundaryPlatformIds = new Set(BusinessSuiteBoundaryRegistry.platformBoundaries.map((boundary) => boundary.platformId));
  const architecturePlatformIds = new Set(BusinessSuiteArchitectureRegistry.platforms.map((platform) => platform.platformId));
  const allowedEdgeIds = new Set(manifest.allowedDependencies.map((dependency) => dependency.dependencyId));
  const forbiddenEdgeIds = new Set(manifest.forbiddenDependencies.map((dependency) => `${dependency.sourcePlatformId}->${dependency.targetPlatformId}`));

  if (manifest.architectureId !== "BUS-ARCH") errors.push("invalid-architecture-id");
  if (manifest.version !== "1.0.0") errors.push("invalid-version");
  if (!manifest.metadata.metadataOnly || !manifest.metadata.immutable) errors.push("invalid-dependency-metadata");
  if (manifest.deterministicFingerprint !== rebuilt.deterministicFingerprint) errors.push("manifest-not-deterministic");
  if (buildBusinessSuiteArchitectureManifest().metadata.architectureId !== "BUS-ARCH") errors.push("bus-arch-1-incompatible");
  if (buildBusinessSuiteBoundaryManifest().architectureId !== "BUS-ARCH") errors.push("bus-arch-2-incompatible");
  if (!validateBusinessSuiteBoundary().valid) errors.push("bus-arch-2-validation-failed");

  errors.push(...duplicateValues(manifest.dependencyCatalog.map((dependency) => dependency.dependencyId)).map((id) => `duplicate-dependency:${id}`));
  errors.push(
    ...duplicateValues(manifest.dependencyCatalog.map((dependency) => `${dependency.sourcePlatformId}->${dependency.targetPlatformId}`)).map(
      (edge) => `duplicate-dependency-edge:${edge}`
    )
  );
  errors.push(...duplicateValues(manifest.consumerCatalog.map((consumer) => consumer.consumerId)).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(manifest.providerCatalog.map((provider) => provider.providerId)).map((id) => `duplicate-provider:${id}`));

  for (const platformId of architecturePlatformIds) {
    if (!boundaryPlatformIds.has(platformId)) errors.push(`missing-boundary-platform:${platformId}`);
  }
  for (const dependency of manifest.dependencyCatalog) {
    if (!knownPlatformIds.has(dependency.sourcePlatformId)) errors.push(`unknown-source-platform:${dependency.sourcePlatformId}`);
    if (!knownPlatformIds.has(dependency.targetPlatformId)) errors.push(`unknown-target-platform:${dependency.targetPlatformId}`);
    if (forbiddenEdgeIds.has(`${dependency.sourcePlatformId}->${dependency.targetPlatformId}`)) errors.push(`forbidden-dependency:${dependency.dependencyId}`);
    if (dependency.allowedPublicApiSurface.length === 0) errors.push(`missing-public-api-surface:${dependency.dependencyId}`);
    if (dependency.allowedPublicApiSurface.some((publicApi) => publicApi.toLowerCase().includes("private"))) errors.push(`private-module-dependency:${dependency.dependencyId}`);
    if (!dependency.metadataOnly || !dependency.immutable) errors.push(`invalid-dependency:${dependency.dependencyId}`);
    if (!dependency.restrictionRules.every((rule) => rule.required && rule.metadataOnly && rule.immutable)) errors.push(`invalid-dependency-rules:${dependency.dependencyId}`);
    if (!allowedEdgeIds.has(dependency.dependencyId)) errors.push(`undeclared-allowed-dependency:${dependency.dependencyId}`);
  }
  for (const consumer of manifest.consumerCatalog) {
    if (!knownPlatformIds.has(consumer.platformId)) errors.push(`unknown-consumer-platform:${consumer.platformId}`);
    if (!knownPlatformIds.has(consumer.consumesPlatformId)) errors.push(`unknown-consumed-platform:${consumer.consumesPlatformId}`);
    if (consumer.allowedPublicApiSurface.length === 0) errors.push(`missing-consumer-api-surface:${consumer.consumerId}`);
    if (!consumer.metadataOnly || !consumer.immutable) errors.push(`invalid-consumer:${consumer.consumerId}`);
  }
  for (const provider of manifest.providerCatalog) {
    if (!knownPlatformIds.has(provider.platformId)) errors.push(`unknown-provider-platform:${provider.platformId}`);
    if (!knownPlatformIds.has(provider.providesToPlatformId)) errors.push(`unknown-provider-consumer-platform:${provider.providesToPlatformId}`);
    if (provider.allowedPublicApiSurface.length === 0) errors.push(`missing-provider-api-surface:${provider.providerId}`);
    if (!provider.metadataOnly || !provider.immutable) errors.push(`invalid-provider:${provider.providerId}`);
  }
  for (const forbiddenDependency of manifest.forbiddenDependencies) {
    if (forbiddenDependency.allowedPublicApiSurface.length !== 0) errors.push(`invalid-forbidden-api-surface:${forbiddenDependency.dependencyId}`);
    if (!forbiddenDependency.metadataOnly || !forbiddenDependency.immutable) errors.push(`invalid-forbidden-dependency:${forbiddenDependency.dependencyId}`);
  }
  if (hasCycle(manifest.dependencyCatalog)) errors.push("circular-dependency-detected");

  return result(errors);
}
