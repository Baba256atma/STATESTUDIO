import { BusinessSuiteBoundaryRegistry } from "./businessSuiteBoundaryIndex.ts";
import { BusinessSuiteDependencyRegistry } from "./businessSuiteDependencyIndex.ts";
import type {
  BusinessApiConsumer,
  BusinessApiMetadata,
  BusinessApiSurface,
  BusinessCompatibilityPolicy,
  BusinessExtensionPoint,
  BusinessExtensionPolicy,
  BusinessPublicApi,
  BusinessVersionPolicy,
} from "./businessSuiteApiPolicyTypes.ts";

export const BUSINESS_API_POLICY_METADATA: BusinessApiMetadata = Object.freeze({
  apiPolicyId: "BUS-ARCH-4",
  architectureId: "BUS-ARCH",
  version: "1.0.0",
  purpose: "Immutable public API and extension policy for Nexora Business Suite platforms.",
  metadataOnly: true,
  immutable: true,
});

function publicApiId(platformId: string, publicApi: string): string {
  return `${platformId}:${publicApi}`;
}

export const BUSINESS_PUBLIC_API_REGISTRY: readonly BusinessPublicApi[] = Object.freeze(
  BusinessSuiteBoundaryRegistry.platformBoundaries.flatMap((boundary) =>
    boundary.publicApis.map((publicApi) =>
      Object.freeze({
        apiId: publicApiId(boundary.platformId, publicApi),
        owningPlatformId: boundary.platformId,
        visibility: "public",
        consumerScope: boundary.allowedConsumers,
        stabilityLevel: "future",
        version: "1.0.0",
        compatibilityClass: "additive-only",
        extensionSupport: publicApi.endsWith(".manifest"),
        certificationRequirement: "Certified public API metadata required before consumption.",
        metadataOnly: true,
        immutable: true,
      })
    )
  )
);

export const BUSINESS_API_SURFACE_REGISTRY: readonly BusinessApiSurface[] = Object.freeze(
  BusinessSuiteBoundaryRegistry.platformBoundaries.map((boundary) =>
    Object.freeze({
      surfaceId: `${boundary.platformId}-public-api-surface`,
      platformId: boundary.platformId,
      publicApiIds: Object.freeze(boundary.publicApis.map((publicApi) => publicApiId(boundary.platformId, publicApi)).sort()),
      visibility: "public",
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BUSINESS_EXTENSION_POINT_REGISTRY: readonly BusinessExtensionPoint[] = Object.freeze(
  BusinessSuiteBoundaryRegistry.platformBoundaries.map((boundary) =>
    Object.freeze({
      extensionPointId: `${boundary.platformId}-certified-extension-point`,
      owningPlatformId: boundary.platformId,
      supportedApiId: publicApiId(boundary.platformId, `${boundary.platformId}.manifest`),
      compatibilityClass: "certification-required",
      certificationRequired: true,
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BUSINESS_COMPATIBILITY_REGISTRY: readonly BusinessCompatibilityPolicy[] = Object.freeze([
  Object.freeze({
    policyId: "backward-compatible-public-api",
    compatibilityClass: "backward-compatible",
    guarantee: "Certified public APIs remain readable by existing certified consumers.",
    certificationRequired: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    policyId: "additive-only-extension",
    compatibilityClass: "additive-only",
    guarantee: "Extension changes must be additive and metadata-only.",
    certificationRequired: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    policyId: "certification-required-change",
    compatibilityClass: "certification-required",
    guarantee: "Any public surface change requires certification metadata.",
    certificationRequired: true,
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const BUSINESS_VERSION_REGISTRY: BusinessVersionPolicy = Object.freeze({
  policyId: "business-suite-semver-policy",
  majorVersionRule: "Major versions require new certification metadata.",
  minorVersionRule: "Minor versions may add public metadata without breaking certified consumers.",
  patchVersionRule: "Patch versions may clarify metadata without changing public contracts.",
  deprecationLifecycle: "Deprecated public APIs remain declared until a certified major version.",
  certificationLifecycle: "Every public API version must publish certification metadata.",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_DEPRECATION_REGISTRY: BusinessVersionPolicy = Object.freeze({
  policyId: "business-suite-deprecation-policy",
  majorVersionRule: "Removal is permitted only in a certified major version.",
  minorVersionRule: "Deprecation notices may be added as metadata in minor versions.",
  patchVersionRule: "Patch versions cannot introduce deprecation removals.",
  deprecationLifecycle: "Deprecation must preserve public readability for certified consumers.",
  certificationLifecycle: "Deprecation metadata requires validation before platform freeze.",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_EXTENSION_POLICY_REGISTRY: BusinessExtensionPolicy = Object.freeze({
  policyId: "business-suite-extension-policy",
  rules: Object.freeze([
    "Extensions must use public APIs only.",
    "Extensions must not modify certified platforms.",
    "Extensions must not access private modules.",
    "Extensions must preserve BUS-ARCH boundaries.",
    "Extensions must not introduce circular dependencies.",
  ] as const),
  futurePlatformRegistration: "allowed-with-certification",
  backwardCompatibilityRequired: true,
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_CONSUMER_PERMISSION_REGISTRY: readonly BusinessApiConsumer[] = Object.freeze(
  BusinessSuiteDependencyRegistry.consumerMap.map((consumer) =>
    Object.freeze({
      permissionId: `${consumer.consumerId}-api-permission`,
      consumerPlatformId: consumer.platformId,
      providerPlatformId: consumer.consumesPlatformId,
      allowedApiIds: Object.freeze(consumer.allowedPublicApiSurface.map((api) => `${consumer.consumesPlatformId}:${api}`).sort()),
      permissionScope: "certified-public-api",
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BusinessSuiteApiPolicyRegistry = Object.freeze({
  metadata: BUSINESS_API_POLICY_METADATA,
  publicApiRegistry: BUSINESS_PUBLIC_API_REGISTRY,
  apiSurfaceRegistry: BUSINESS_API_SURFACE_REGISTRY,
  extensionPointRegistry: BUSINESS_EXTENSION_POINT_REGISTRY,
  compatibilityRegistry: BUSINESS_COMPATIBILITY_REGISTRY,
  versionRegistry: BUSINESS_VERSION_REGISTRY,
  deprecationRegistry: BUSINESS_DEPRECATION_REGISTRY,
  extensionPolicyRegistry: BUSINESS_EXTENSION_POLICY_REGISTRY,
  consumerPermissionRegistry: BUSINESS_CONSUMER_PERMISSION_REGISTRY,
});
