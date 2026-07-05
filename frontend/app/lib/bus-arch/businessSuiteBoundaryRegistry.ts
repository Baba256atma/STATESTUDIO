import { BusinessSuiteArchitectureRegistry } from "./businessSuiteArchitectureIndex.ts";
import type {
  BoundaryClassification,
  BoundaryConsumer,
  BoundaryExposure,
  BoundaryMetadata,
  BoundaryOwnership,
  BoundaryRestriction,
  BoundaryResponsibility,
  BusinessPlatformBoundary,
} from "./businessSuiteBoundaryTypes.ts";

export const BUSINESS_BOUNDARY_METADATA: BoundaryMetadata = Object.freeze({
  boundaryId: "BUS-ARCH-2",
  architectureId: "BUS-ARCH",
  version: "1.0.0",
  purpose: "Immutable platform boundary map for Nexora Business Suite platforms.",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_BOUNDARY_CATEGORIES: readonly BoundaryClassification[] = Object.freeze([
  "Ownership",
  "Responsibility",
  "Exposure",
  "Consumption",
  "Isolation",
  "Extension",
  "Governance",
  "Certification",
] as const);

const FORBIDDEN_DEPENDENCIES = Object.freeze([
  "private modules",
  "contract bypass",
  "upstream mutation",
  "circular dependencies",
  "internal implementation exposure",
] as const);

export const BUSINESS_PLATFORM_BOUNDARIES: readonly BusinessPlatformBoundary[] = Object.freeze(
  BusinessSuiteArchitectureRegistry.platforms.map((platform) =>
    Object.freeze({
      boundaryId: `${platform.platformId}-boundary`,
      platformId: platform.platformId,
      platformName: platform.platformName,
      purpose: platform.description,
      ownedDomain: platform.category,
      publicApis: Object.freeze([`${platform.platformId}.manifest`, `${platform.platformId}.registry`, `${platform.platformId}.validation`] as const),
      allowedConsumers: Object.freeze(["APP", "LAY", "ASS", "OPS", "EVE", "BUS"] as const),
      allowedProviders: Object.freeze(["BUS-ARCH", "certified-business-platforms"] as const),
      internalScope: `${platform.platformName} internal metadata contracts.`,
      externalScope: `${platform.platformName} public metadata APIs.`,
      extensionPoints: Object.freeze([`${platform.platformId}.extensions`] as const),
      forbiddenDependencies: FORBIDDEN_DEPENDENCIES,
      classifications: BUSINESS_BOUNDARY_CATEGORIES,
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BUSINESS_BOUNDARY_OWNERSHIP_REGISTRY: readonly BoundaryOwnership[] = Object.freeze(
  BUSINESS_PLATFORM_BOUNDARIES.map((boundary) =>
    Object.freeze({
      ownershipId: `${boundary.platformId}-ownership`,
      platformId: boundary.platformId,
      ownedDomain: boundary.ownedDomain,
      owner: boundary.platformName,
      exclusive: true,
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BUSINESS_BOUNDARY_RESPONSIBILITY_REGISTRY: readonly BoundaryResponsibility[] = Object.freeze(
  BUSINESS_PLATFORM_BOUNDARIES.map((boundary) =>
    Object.freeze({
      responsibilityId: `${boundary.platformId}-responsibility`,
      platformId: boundary.platformId,
      responsibility: `${boundary.platformName} owns ${boundary.ownedDomain} metadata boundaries.`,
      classification: "Responsibility",
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BUSINESS_BOUNDARY_EXPOSED_SERVICES_REGISTRY: readonly BoundaryExposure[] = Object.freeze(
  BUSINESS_PLATFORM_BOUNDARIES.flatMap((boundary) =>
    boundary.publicApis.map((publicApi) =>
      Object.freeze({
        exposureId: `${boundary.platformId}-${publicApi.split(".").at(-1) ?? "api"}-exposure`,
        platformId: boundary.platformId,
        exposedCapability: publicApi,
        publicApiBoundary: "Public API Only",
        internalImplementationExposed: false,
        metadataOnly: true,
        immutable: true,
      })
    )
  )
);

export const BUSINESS_BOUNDARY_FORBIDDEN_ACCESS_REGISTRY: readonly BoundaryRestriction[] = Object.freeze(
  BUSINESS_PLATFORM_BOUNDARIES.flatMap((boundary) =>
    boundary.forbiddenDependencies.map((forbiddenAccess) =>
      Object.freeze({
        restrictionId: `${boundary.platformId}-${forbiddenAccess.replaceAll(" ", "-")}`,
        platformId: boundary.platformId,
        forbiddenAccess,
        reason: `${boundary.platformName} must preserve platform isolation.`,
        metadataOnly: true,
        immutable: true,
      })
    )
  )
);

export const BUSINESS_BOUNDARY_CONSUMER_REGISTRY: readonly BoundaryConsumer[] = Object.freeze(
  BUSINESS_PLATFORM_BOUNDARIES.flatMap((boundary) =>
    boundary.allowedConsumers.map((consumerName) =>
      Object.freeze({
        consumerId: `${boundary.platformId}-${consumerName.toLowerCase()}-consumer`,
        platformId: boundary.platformId,
        consumerName,
        accessBoundary: "Public API Only",
        metadataOnly: true,
        immutable: true,
      })
    )
  )
);

export const BUSINESS_BOUNDARY_EXTENSION_REGISTRY: readonly BoundaryExposure[] = Object.freeze(
  BUSINESS_PLATFORM_BOUNDARIES.flatMap((boundary) =>
    boundary.extensionPoints.map((extensionPoint) =>
      Object.freeze({
        exposureId: `${boundary.platformId}-extension-exposure`,
        platformId: boundary.platformId,
        exposedCapability: extensionPoint,
        publicApiBoundary: "Public API Only",
        internalImplementationExposed: false,
        metadataOnly: true,
        immutable: true,
      })
    )
  )
);

export const BusinessSuiteBoundaryRegistry = Object.freeze({
  metadata: BUSINESS_BOUNDARY_METADATA,
  categories: BUSINESS_BOUNDARY_CATEGORIES,
  platformBoundaries: BUSINESS_PLATFORM_BOUNDARIES,
  ownershipRegistry: BUSINESS_BOUNDARY_OWNERSHIP_REGISTRY,
  exposedServicesRegistry: BUSINESS_BOUNDARY_EXPOSED_SERVICES_REGISTRY,
  forbiddenAccessRegistry: BUSINESS_BOUNDARY_FORBIDDEN_ACCESS_REGISTRY,
  consumerRegistry: BUSINESS_BOUNDARY_CONSUMER_REGISTRY,
  responsibilityRegistry: BUSINESS_BOUNDARY_RESPONSIBILITY_REGISTRY,
  extensionRegistry: BUSINESS_BOUNDARY_EXTENSION_REGISTRY,
});
