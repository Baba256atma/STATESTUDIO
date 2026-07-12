import {
  EXECUTIVE_RESOURCE_CONTRACT_REGISTRY,
  EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
} from "./executiveResourceIndex.ts";
import {
  EXECUTIVE_RESOURCE_PLATFORM_REGISTRY,
  EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS,
} from "./executiveResourceRegistryIndex.ts";
import {
  EXECUTIVE_RESOURCE_MODEL_METADATA,
  EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS,
} from "./executiveResourceModelIndex.ts";
import {
  EXECUTIVE_RESOURCE_VALIDATION_METADATA,
  EXECUTIVE_RESOURCE_VALIDATION_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_VALIDATION_RESULT,
} from "./executiveResourceValidationIndex.ts";
import type {
  ExecutiveResourceManifestBundle,
  ExecutiveResourceManifestCompatibility,
  ExecutiveResourceManifestComponent,
  ExecutiveResourceManifestDependency,
  ExecutiveResourceManifestIdentity,
  ExecutiveResourceManifestMetadata,
  ExecutiveResourceManifestSummary,
  ExecutiveResourcePlatformManifest,
  ExecutiveResourceReleaseMetadata,
} from "./executiveResourceManifestTypes.ts";

export const EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE =
  "nexora.bus.executive-resource.manifest" as const;

export const EXECUTIVE_RESOURCE_MANIFEST_VERSION = "1.0.0" as const;

export const EXECUTIVE_RESOURCE_MANIFEST_STATUS = "Published" as const;

export const EXECUTIVE_RESOURCE_MANIFEST_DESCRIPTION =
  "Canonical metadata-only manifest layer for executive resource intelligence." as const;

const manifestMetadataBlock = Object.freeze({
  createdBy: "BUS-31:5",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_RESOURCE_MANIFEST_METADATA: ExecutiveResourceManifestMetadata =
  Object.freeze({
    manifestNamespace: EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE,
    manifestVersion: EXECUTIVE_RESOURCE_MANIFEST_VERSION,
    manifestStatus: EXECUTIVE_RESOURCE_MANIFEST_STATUS,
    manifestDescription: EXECUTIVE_RESOURCE_MANIFEST_DESCRIPTION,
    manifestDependencies: Object.freeze([
      "BUS-31:1 Executive Resource Intelligence Contracts",
      "BUS-31:2 Executive Resource Registry",
      "BUS-31:3 Executive Resource Model",
      "BUS-31:4 Executive Resource Validation",
    ]),
    manifestConsumers: Object.freeze([
      "BUS-31:6 Platform",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    manifestCompatibility: Object.freeze([
      `contracts:${EXECUTIVE_RESOURCE_CONTRACT_REGISTRY.platform.platformId}`,
      `registry:${EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformId}`,
      `model:${EXECUTIVE_RESOURCE_MODEL_METADATA.modelVersion}`,
      `validation:${EXECUTIVE_RESOURCE_VALIDATION_RESULT.validationVersion}`,
      "metadata-only",
      "public-api-only",
      "deterministic",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_PLATFORM_MANIFEST: ExecutiveResourcePlatformManifest =
  Object.freeze({
    manifestId: "executive-resource-platform-manifest",
    manifestVersion: EXECUTIVE_RESOURCE_MANIFEST_VERSION,
    platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
    platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
    platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
    platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    platformStatus: "Published",
    manifestStatus: EXECUTIVE_RESOURCE_MANIFEST_STATUS,
    manifestDescription: EXECUTIVE_RESOURCE_MANIFEST_DESCRIPTION,
    manifestMetadata: EXECUTIVE_RESOURCE_MANIFEST_METADATA,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_MANIFEST_IDENTITY: ExecutiveResourceManifestIdentity =
  Object.freeze({
    identityId: "executive-resource-manifest-identity",
    identityName: "Executive Resource Platform Manifest",
    identityNamespace: EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE,
    identityVersion: EXECUTIVE_RESOURCE_MANIFEST_VERSION,
    identityMetadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_MANIFEST_DEPENDENCIES: readonly ExecutiveResourceManifestDependency[] =
  Object.freeze([
    Object.freeze({
      dependencyId: "BUS-31:1",
      dependencyName: "Executive Resource Intelligence Contracts",
      dependencyType: "Contracts",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-31:2",
      dependencyName: "Executive Resource Registry",
      dependencyType: "Registry",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-31:3",
      dependencyName: "Executive Resource Model",
      dependencyType: "Model",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-31:4",
      dependencyName: "Executive Resource Validation",
      dependencyType: "Validation",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_RESOURCE_MANIFEST_COMPONENTS: readonly ExecutiveResourceManifestComponent[] =
  Object.freeze([
    Object.freeze({
      componentId: "executive-resource-manifest-component-contracts",
      componentName: "Contracts",
      componentCategory: "Contracts",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-resource-manifest-component-registry",
      componentName: "Registry",
      componentCategory: "Registry",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-resource-manifest-component-model",
      componentName: "Model",
      componentCategory: "Model",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-resource-manifest-component-validation",
      componentName: "Validation",
      componentCategory: "Validation",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-resource-manifest-component-platform-metadata",
      componentName: "Platform Metadata",
      componentCategory: "PlatformMetadata",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-resource-manifest-component-public-api",
      componentName: "Public API",
      componentCategory: "PublicAPI",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-resource-manifest-component-compatibility",
      componentName: "Compatibility",
      componentCategory: "Compatibility",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-resource-manifest-component-documentation",
      componentName: "Documentation",
      componentCategory: "Documentation",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_RESOURCE_MANIFEST_COMPATIBILITY: ExecutiveResourceManifestCompatibility =
  Object.freeze({
    compatibilityVersion: "1.0.0",
    supportedPlatformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    compatibilityStatus: "Compatible",
    metadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_RELEASE_METADATA: ExecutiveResourceReleaseMetadata =
  Object.freeze({
    releaseId: "BUS-31:5",
    releaseVersion: "1.0.0",
    releaseStatus: "Published",
    releaseType: "MetadataOnly",
    releaseDescription:
      "Official metadata-only release manifest for the Executive Resource Intelligence Platform.",
    metadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_MANIFEST_SUMMARY: ExecutiveResourceManifestSummary =
  Object.freeze({
    componentCount: EXECUTIVE_RESOURCE_MANIFEST_COMPONENTS.length,
    dependencyCount: EXECUTIVE_RESOURCE_MANIFEST_DEPENDENCIES.length,
    platformStatus: "Published",
    manifestStatus: EXECUTIVE_RESOURCE_MANIFEST_STATUS,
    metadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_MANIFEST_NAMESPACE",
  "EXECUTIVE_RESOURCE_MANIFEST_VERSION",
  "EXECUTIVE_RESOURCE_MANIFEST_STATUS",
  "EXECUTIVE_RESOURCE_MANIFEST_DESCRIPTION",
  "EXECUTIVE_RESOURCE_MANIFEST_METADATA",
  "EXECUTIVE_RESOURCE_PLATFORM_MANIFEST",
  "EXECUTIVE_RESOURCE_MANIFEST_IDENTITY",
  "EXECUTIVE_RESOURCE_MANIFEST_DEPENDENCIES",
  "EXECUTIVE_RESOURCE_MANIFEST_COMPONENTS",
  "EXECUTIVE_RESOURCE_MANIFEST_COMPATIBILITY",
  "EXECUTIVE_RESOURCE_RELEASE_METADATA",
  "EXECUTIVE_RESOURCE_MANIFEST_SUMMARY",
  "ExecutiveResourceManifestFoundation",
] as const);

export const ExecutiveResourceManifestFoundation: ExecutiveResourceManifestBundle = Object.freeze({
  platform: EXECUTIVE_RESOURCE_PLATFORM_MANIFEST,
  identity: EXECUTIVE_RESOURCE_MANIFEST_IDENTITY,
  dependencies: EXECUTIVE_RESOURCE_MANIFEST_DEPENDENCIES,
  components: EXECUTIVE_RESOURCE_MANIFEST_COMPONENTS,
  compatibility: EXECUTIVE_RESOURCE_MANIFEST_COMPATIBILITY,
  release: EXECUTIVE_RESOURCE_RELEASE_METADATA,
  summary: EXECUTIVE_RESOURCE_MANIFEST_SUMMARY,
  metadata: EXECUTIVE_RESOURCE_MANIFEST_METADATA,
  publicApis: EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_MANIFEST_FOUNDATION_COMPATIBILITY = Object.freeze({
  contractPublicApiCount: EXECUTIVE_RESOURCE_CONTRACT_REGISTRY.publicApis.length,
  registryPublicApiCount: EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS.length,
  modelPublicApiCount: EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS.length,
  validationPublicApiCount: EXECUTIVE_RESOURCE_VALIDATION_PUBLIC_APIS.length,
  validationStatus: EXECUTIVE_RESOURCE_VALIDATION_RESULT.validationStatus,
  platformDescription: EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  metadataOnly: true,
  immutable: true,
});
