import { BusinessSuiteArchitectureRegistry } from "./businessSuiteArchitectureIndex.ts";
import { BusinessSuiteBoundaryRegistry } from "./businessSuiteBoundaryIndex.ts";
import type {
  BusinessDependencyClassification,
  BusinessDependencyMetadata,
  BusinessDependencyRule,
  BusinessPlatformConsumer,
  BusinessPlatformDependency,
  BusinessPlatformProvider,
} from "./businessSuiteDependencyTypes.ts";

export const BUSINESS_DEPENDENCY_METADATA: BusinessDependencyMetadata = Object.freeze({
  dependencyMapId: "BUS-ARCH-3",
  architectureId: "BUS-ARCH",
  version: "1.0.0",
  purpose: "Immutable dependency and consumer map for Nexora Business Suite platforms.",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_DEPENDENCY_CATEGORIES: readonly BusinessDependencyClassification[] = Object.freeze([
  "architecture",
  "platform",
  "shared-service",
  "public-api",
  "manifest",
  "validation",
  "certification",
  "compatibility",
  "extension",
  "future",
] as const);

export const BUSINESS_DEPENDENCY_RULES: readonly BusinessDependencyRule[] = Object.freeze([
  Object.freeze({ ruleId: "public-api-only", description: "Dependencies may consume public APIs only.", required: true, metadataOnly: true, immutable: true }),
  Object.freeze({ ruleId: "metadata-only", description: "Dependencies are architectural metadata only.", required: true, metadataOnly: true, immutable: true }),
  Object.freeze({ ruleId: "no-provider-mutation", description: "Dependencies must not modify provider state.", required: true, metadataOnly: true, immutable: true }),
  Object.freeze({ ruleId: "boundary-preserved", description: "Dependencies must preserve BUS-ARCH-2 boundaries.", required: true, metadataOnly: true, immutable: true }),
] as const);

const ARCHITECTURE_PUBLIC_APIS = Object.freeze([
  "BusinessSuiteArchitectureRegistry",
  "buildBusinessSuiteArchitectureManifest",
  "validateBusinessSuiteArchitecture",
] as const);

const BOUNDARY_PUBLIC_APIS = Object.freeze([
  "BusinessSuiteBoundaryRegistry",
  "buildBusinessSuiteBoundaryManifest",
  "validateBusinessSuiteBoundary",
] as const);

export const BUSINESS_DEPENDENCY_KNOWN_PLATFORM_IDS: readonly string[] = Object.freeze([
  "BUS-ARCH-1",
  "BUS-ARCH-2",
  ...BusinessSuiteArchitectureRegistry.platforms.map((platform) => platform.platformId),
] as const);

function buildDependency(
  sourcePlatformId: string,
  targetPlatformId: "BUS-ARCH-1" | "BUS-ARCH-2",
  allowedPublicApiSurface: readonly string[],
  providerRole: string
): BusinessPlatformDependency {
  return Object.freeze({
    dependencyId: `${sourcePlatformId}-depends-on-${targetPlatformId.toLowerCase()}`,
    sourcePlatformId,
    targetPlatformId,
    dependencyType: "architecture",
    direction: "source-to-target",
    allowedPublicApiSurface,
    consumerRole: "Business platform metadata consumer",
    providerRole,
    restrictionRules: BUSINESS_DEPENDENCY_RULES,
    certificationRequirement: "Certified or certifiable public metadata API",
    metadataOnly: true,
    immutable: true,
  });
}

export const BUSINESS_ALLOWED_DEPENDENCY_REGISTRY: readonly BusinessPlatformDependency[] = Object.freeze(
  BusinessSuiteBoundaryRegistry.platformBoundaries.flatMap((boundary) => [
    buildDependency(boundary.platformId, "BUS-ARCH-1", ARCHITECTURE_PUBLIC_APIS, "Master architecture metadata provider"),
    buildDependency(boundary.platformId, "BUS-ARCH-2", BOUNDARY_PUBLIC_APIS, "Platform boundary metadata provider"),
  ])
);

export const BUSINESS_FORBIDDEN_DEPENDENCY_REGISTRY: readonly BusinessPlatformDependency[] = Object.freeze(
  BusinessSuiteBoundaryRegistry.platformBoundaries.flatMap((boundary) =>
    boundary.forbiddenDependencies.map((forbiddenDependency) =>
      Object.freeze({
        dependencyId: `${boundary.platformId}-forbids-${forbiddenDependency.replaceAll(" ", "-")}`,
        sourcePlatformId: boundary.platformId,
        targetPlatformId: forbiddenDependency,
        dependencyType: "future",
        direction: "source-to-target",
        allowedPublicApiSurface: Object.freeze([] as const),
        consumerRole: "Forbidden dependency declaration",
        providerRole: "Forbidden dependency target",
        restrictionRules: BUSINESS_DEPENDENCY_RULES,
        certificationRequirement: "Forbidden by BUS-ARCH-2 boundary isolation",
        metadataOnly: true,
        immutable: true,
      })
    )
  )
);

export const BUSINESS_CONSUMER_REGISTRY: readonly BusinessPlatformConsumer[] = Object.freeze(
  BUSINESS_ALLOWED_DEPENDENCY_REGISTRY.map((dependency) =>
    Object.freeze({
      consumerId: `${dependency.sourcePlatformId}-consumes-${dependency.targetPlatformId.toLowerCase()}`,
      platformId: dependency.sourcePlatformId,
      consumesPlatformId: dependency.targetPlatformId,
      allowedPublicApiSurface: dependency.allowedPublicApiSurface,
      consumerRole: dependency.consumerRole,
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BUSINESS_PROVIDER_REGISTRY: readonly BusinessPlatformProvider[] = Object.freeze(
  BUSINESS_ALLOWED_DEPENDENCY_REGISTRY.map((dependency) =>
    Object.freeze({
      providerId: `${dependency.targetPlatformId.toLowerCase()}-provides-to-${dependency.sourcePlatformId}`,
      platformId: dependency.targetPlatformId,
      providesToPlatformId: dependency.sourcePlatformId,
      allowedPublicApiSurface: dependency.allowedPublicApiSurface,
      providerRole: dependency.providerRole,
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BusinessSuiteDependencyRegistry = Object.freeze({
  metadata: BUSINESS_DEPENDENCY_METADATA,
  dependencyCategories: BUSINESS_DEPENDENCY_CATEGORIES,
  dependencyRules: BUSINESS_DEPENDENCY_RULES,
  knownPlatformIds: BUSINESS_DEPENDENCY_KNOWN_PLATFORM_IDS,
  dependencyMap: BUSINESS_ALLOWED_DEPENDENCY_REGISTRY,
  consumerMap: BUSINESS_CONSUMER_REGISTRY,
  providerMap: BUSINESS_PROVIDER_REGISTRY,
  allowedDependencyRegistry: BUSINESS_ALLOWED_DEPENDENCY_REGISTRY,
  forbiddenDependencyRegistry: BUSINESS_FORBIDDEN_DEPENDENCY_REGISTRY,
});
