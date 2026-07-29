import {
  EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY,
  EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
} from "./executiveOrganizationIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY,
  EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS,
} from "./executiveOrganizationRegistryIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_MODEL_METADATA,
  EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_MODEL_STATUS,
} from "./executiveOrganizationModelIndex.ts";
import { EXECUTIVE_ORGANIZATION_VALIDATION_PUBLIC_APIS, EXECUTIVE_ORGANIZATION_VALIDATION_RESULT } from "./executiveOrganizationValidationIndex.ts";
import type {
  ExecutiveOrganizationManifestBundle,
  ExecutiveOrganizationManifestCompatibility,
  ExecutiveOrganizationManifestComponent,
  ExecutiveOrganizationManifestDependency,
  ExecutiveOrganizationManifestIdentity,
  ExecutiveOrganizationManifestMetadata,
  ExecutiveOrganizationManifestSummary,
  ExecutiveOrganizationPlatformManifest,
  ExecutiveOrganizationReleaseMetadata,
} from "./executiveOrganizationManifestTypes.ts";

export const EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE =
  "nexora.bus.executive-organization.manifest" as const;

export const EXECUTIVE_ORGANIZATION_MANIFEST_VERSION = "1.0.0" as const;

export const EXECUTIVE_ORGANIZATION_MANIFEST_STATUS = "Published" as const;

export const EXECUTIVE_ORGANIZATION_MANIFEST_DESCRIPTION =
  "Canonical metadata-only manifest layer for executive organization intelligence." as const;

const manifestMetadataBlock = Object.freeze({
  createdBy: "BUS-30:5",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_ORGANIZATION_MANIFEST_METADATA: ExecutiveOrganizationManifestMetadata =
  Object.freeze({
    manifestNamespace: EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE,
    manifestVersion: EXECUTIVE_ORGANIZATION_MANIFEST_VERSION,
    manifestStatus: EXECUTIVE_ORGANIZATION_MANIFEST_STATUS,
    manifestDescription: EXECUTIVE_ORGANIZATION_MANIFEST_DESCRIPTION,
    manifestDependencies: Object.freeze([
      "BUS-30:1 Executive Organization Intelligence Contracts",
      "BUS-30:2 Executive Organization Registry",
      "BUS-30:3 Executive Organization Model",
      "BUS-30:4 Executive Organization Validation",
    ]),
    manifestConsumers: Object.freeze([
      "BUS-30:6 Platform",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    manifestCompatibility: Object.freeze([
      `contracts:${EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY.platformId}`,
      `registry:${EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY.platformId}`,
      `model:${EXECUTIVE_ORGANIZATION_MODEL_METADATA.modelVersion}`,
      `validation:${EXECUTIVE_ORGANIZATION_VALIDATION_RESULT.validationVersion}`,
      "metadata-only",
      "public-api-only",
      "deterministic",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST: ExecutiveOrganizationPlatformManifest =
  Object.freeze({
    manifestId: "executive-organization-platform-manifest",
    manifestVersion: EXECUTIVE_ORGANIZATION_MANIFEST_VERSION,
    platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
    platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
    platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    platformStatus: "Published",
    manifestStatus: EXECUTIVE_ORGANIZATION_MANIFEST_STATUS,
    manifestDescription: EXECUTIVE_ORGANIZATION_MANIFEST_DESCRIPTION,
    manifestMetadata: EXECUTIVE_ORGANIZATION_MANIFEST_METADATA,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_MANIFEST_IDENTITY: ExecutiveOrganizationManifestIdentity =
  Object.freeze({
    identityId: "executive-organization-manifest-identity",
    identityName: "Executive Organization Platform Manifest",
    identityNamespace: EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE,
    identityVersion: EXECUTIVE_ORGANIZATION_MANIFEST_VERSION,
    identityMetadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_MANIFEST_DEPENDENCIES: readonly ExecutiveOrganizationManifestDependency[] =
  Object.freeze([
    Object.freeze({
      dependencyId: "BUS-30:1",
      dependencyName: "Executive Organization Intelligence Contracts",
      dependencyType: "Contracts",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-30:2",
      dependencyName: "Executive Organization Registry",
      dependencyType: "Registry",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-30:3",
      dependencyName: "Executive Organization Model",
      dependencyType: "Model",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-30:4",
      dependencyName: "Executive Organization Validation",
      dependencyType: "Validation",
      dependencyVersion: "1.0.0",
      dependencyStatus: "Available",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_ORGANIZATION_MANIFEST_COMPONENTS: readonly ExecutiveOrganizationManifestComponent[] =
  Object.freeze([
    Object.freeze({
      componentId: "executive-organization-manifest-component-contracts",
      componentName: "Contracts",
      componentCategory: "Contracts",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-organization-manifest-component-registry",
      componentName: "Registry",
      componentCategory: "Registry",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-organization-manifest-component-model",
      componentName: "Model",
      componentCategory: "Model",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-organization-manifest-component-validation",
      componentName: "Validation",
      componentCategory: "Validation",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-organization-manifest-component-platform-metadata",
      componentName: "Platform Metadata",
      componentCategory: "PlatformMetadata",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-organization-manifest-component-public-api",
      componentName: "Public API",
      componentCategory: "PublicAPI",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-organization-manifest-component-documentation",
      componentName: "Documentation",
      componentCategory: "Documentation",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      componentId: "executive-organization-manifest-component-compatibility",
      componentName: "Compatibility",
      componentCategory: "Compatibility",
      componentVersion: "1.0.0",
      componentStatus: "Published",
      metadata: manifestMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_ORGANIZATION_MANIFEST_COMPATIBILITY: ExecutiveOrganizationManifestCompatibility =
  Object.freeze({
    compatibilityVersion: "1.0.0",
    supportedPlatformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    compatibilityStatus: "Compatible",
    metadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_RELEASE_METADATA: ExecutiveOrganizationReleaseMetadata =
  Object.freeze({
    releaseId: "BUS-30:5",
    releaseVersion: "1.0.0",
    releaseStatus: "Published",
    releaseType: "MetadataOnly",
    releaseDescription:
      "Official metadata-only release manifest for the Executive Organization Intelligence Platform.",
    metadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_MANIFEST_SUMMARY: ExecutiveOrganizationManifestSummary =
  Object.freeze({
    componentCount: EXECUTIVE_ORGANIZATION_MANIFEST_COMPONENTS.length,
    dependencyCount: EXECUTIVE_ORGANIZATION_MANIFEST_DEPENDENCIES.length,
    platformStatus: "Published",
    manifestStatus: EXECUTIVE_ORGANIZATION_MANIFEST_STATUS,
    metadata: manifestMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_ORGANIZATION_MANIFEST_NAMESPACE",
  "EXECUTIVE_ORGANIZATION_MANIFEST_VERSION",
  "EXECUTIVE_ORGANIZATION_MANIFEST_STATUS",
  "EXECUTIVE_ORGANIZATION_MANIFEST_DESCRIPTION",
  "EXECUTIVE_ORGANIZATION_MANIFEST_METADATA",
  "EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST",
  "EXECUTIVE_ORGANIZATION_MANIFEST_IDENTITY",
  "EXECUTIVE_ORGANIZATION_MANIFEST_DEPENDENCIES",
  "EXECUTIVE_ORGANIZATION_MANIFEST_COMPONENTS",
  "EXECUTIVE_ORGANIZATION_MANIFEST_COMPATIBILITY",
  "EXECUTIVE_ORGANIZATION_RELEASE_METADATA",
  "EXECUTIVE_ORGANIZATION_MANIFEST_SUMMARY",
  "ExecutiveOrganizationManifestFoundation",
] as const);

export const ExecutiveOrganizationManifestFoundation: ExecutiveOrganizationManifestBundle =
  Object.freeze({
    platform: EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST,
    identity: EXECUTIVE_ORGANIZATION_MANIFEST_IDENTITY,
    dependencies: EXECUTIVE_ORGANIZATION_MANIFEST_DEPENDENCIES,
    components: EXECUTIVE_ORGANIZATION_MANIFEST_COMPONENTS,
    compatibility: EXECUTIVE_ORGANIZATION_MANIFEST_COMPATIBILITY,
    release: EXECUTIVE_ORGANIZATION_RELEASE_METADATA,
    summary: EXECUTIVE_ORGANIZATION_MANIFEST_SUMMARY,
    metadata: EXECUTIVE_ORGANIZATION_MANIFEST_METADATA,
    publicApis: EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_MANIFEST_FOUNDATION_COMPATIBILITY = Object.freeze({
  contractPublicApiCount: EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY.publicApis.length,
  registryPublicApiCount: EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS.length,
  modelPublicApiCount: EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS.length,
  validationPublicApiCount: EXECUTIVE_ORGANIZATION_VALIDATION_PUBLIC_APIS.length,
  validationStatus: EXECUTIVE_ORGANIZATION_VALIDATION_RESULT.validationStatus,
  platformDescription: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  modelStatus: EXECUTIVE_ORGANIZATION_MODEL_STATUS,
  metadataOnly: true,
  immutable: true,
});
