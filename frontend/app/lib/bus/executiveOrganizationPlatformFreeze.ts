import {
  EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
  EXECUTIVE_ORGANIZATION_PLATFORM_CERTIFICATION,
} from "./executiveOrganizationCertificationIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST,
} from "./executiveOrganizationManifestIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES,
  EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY,
  EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS,
  ExecutiveOrganizationPlatformFoundation,
} from "./executiveOrganizationPlatformIndex.ts";
import type {
  ExecutiveOrganizationFreezeCompatibility,
  ExecutiveOrganizationFreezeManifest,
  ExecutiveOrganizationFreezeMetadata,
  ExecutiveOrganizationFreezePolicy,
  ExecutiveOrganizationFreezeRegistry,
  ExecutiveOrganizationFreezeSummary,
  ExecutiveOrganizationPlatformFreeze,
  ExecutiveOrganizationPlatformFreezeBundle,
  ExecutiveOrganizationReleaseState,
} from "./executiveOrganizationPlatformFreezeTypes.ts";

export const EXECUTIVE_ORGANIZATION_FREEZE_NAMESPACE =
  "nexora.bus.executive-organization.freeze" as const;

export const EXECUTIVE_ORGANIZATION_FREEZE_VERSION = "1.0.0" as const;

export const EXECUTIVE_ORGANIZATION_FREEZE_STATUS = "FROZEN" as const;

export const EXECUTIVE_ORGANIZATION_RELEASE_STATUS = "RELEASED" as const;

export const EXECUTIVE_ORGANIZATION_FREEZE_DESCRIPTION =
  "Canonical metadata-only freeze layer for executive organization intelligence." as const;

const freezeMetadataBlock = Object.freeze({
  createdBy: "BUS-30:8",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_ORGANIZATION_FREEZE_METADATA: ExecutiveOrganizationFreezeMetadata =
  Object.freeze({
    freezeNamespace: EXECUTIVE_ORGANIZATION_FREEZE_NAMESPACE,
    freezeVersion: EXECUTIVE_ORGANIZATION_FREEZE_VERSION,
    freezeStatus: EXECUTIVE_ORGANIZATION_FREEZE_STATUS,
    freezeDescription: EXECUTIVE_ORGANIZATION_FREEZE_DESCRIPTION,
    freezeDependencies: Object.freeze([
      "BUS-30:1 Executive Organization Intelligence Contracts",
      "BUS-30:2 Executive Organization Registry",
      "BUS-30:3 Executive Organization Model",
      "BUS-30:4 Executive Organization Validation",
      "BUS-30:5 Executive Organization Manifest",
      "BUS-30:6 Executive Organization Platform",
      "BUS-30:7 Executive Organization Certification",
    ]),
    freezeConsumers: Object.freeze([
      "BUS-30:9 Public Index",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_FREEZE: ExecutiveOrganizationPlatformFreeze =
  Object.freeze({
    freezeId: "executive-organization-platform-freeze",
    freezeVersion: EXECUTIVE_ORGANIZATION_FREEZE_VERSION,
    platformId: EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformId,
    platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformVersion,
    freezeStatus: EXECUTIVE_ORGANIZATION_FREEZE_STATUS,
    releaseStatus: EXECUTIVE_ORGANIZATION_RELEASE_STATUS,
    freezeDate: "2026-07-06",
    freezeMetadata: Object.freeze({
      freezeNamespace: EXECUTIVE_ORGANIZATION_FREEZE_NAMESPACE,
      freezeDescription: EXECUTIVE_ORGANIZATION_FREEZE_DESCRIPTION,
      freezeDependencies: EXECUTIVE_ORGANIZATION_FREEZE_METADATA.freezeDependencies,
      freezeConsumers: EXECUTIVE_ORGANIZATION_FREEZE_METADATA.freezeConsumers,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_FREEZE_MANIFEST: ExecutiveOrganizationFreezeManifest =
  Object.freeze({
    manifestId: "executive-organization-freeze-manifest",
    manifestVersion: "1.0.0",
    certifiedPlatformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformVersion,
    freezeVersion: EXECUTIVE_ORGANIZATION_FREEZE_VERSION,
    manifestStatus: "Published",
    metadata: freezeMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_FREEZE_REGISTRY: ExecutiveOrganizationFreezeRegistry =
  Object.freeze({
    registryId: "executive-organization-freeze-registry",
    certifiedComponents: Object.freeze([
      "Contracts",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Platform",
      "Certification",
    ]),
    dependencySnapshot: Object.freeze(
      EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES.map((dependency) => dependency.dependencyName),
    ),
    releaseSnapshot: Object.freeze([
      `certification-status:${EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS}`,
      `freeze-status:${EXECUTIVE_ORGANIZATION_FREEZE_STATUS}`,
      `release-status:${EXECUTIVE_ORGANIZATION_RELEASE_STATUS}`,
      `manifest-status:${EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST.manifestStatus}`,
    ]),
    metadata: freezeMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_FREEZE_COMPATIBILITY: ExecutiveOrganizationFreezeCompatibility =
  Object.freeze({
    supportedPlatformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformVersion,
    freezeVersion: EXECUTIVE_ORGANIZATION_FREEZE_VERSION,
    compatibilityStatus: "Compatible",
    metadata: freezeMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_FREEZE_POLICY: ExecutiveOrganizationFreezePolicy = Object.freeze({
  policyId: "executive-organization-freeze-policy",
  policyVersion: "1.0.0",
  policyName: "Executive Organization Platform Freeze Policy",
  policyDescription:
    "Defines the metadata-only freeze requirements for the Executive Organization Platform.",
  freezeRequirements: Object.freeze([
    "certification-pass",
    "public-api-stability",
    "manifest-published",
    "metadata-only",
    "immutable-artifacts",
    "deterministic-architecture",
  ]),
  metadata: freezeMetadataBlock,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_FREEZE_SUMMARY: ExecutiveOrganizationFreezeSummary =
  Object.freeze({
    certifiedComponentCount: EXECUTIVE_ORGANIZATION_FREEZE_REGISTRY.certifiedComponents.length,
    dependencyCount: EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES.length,
    platformStatus: "Published",
    freezeStatus: EXECUTIVE_ORGANIZATION_FREEZE_STATUS,
    releaseStatus: EXECUTIVE_ORGANIZATION_RELEASE_STATUS,
    metadata: freezeMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_RELEASE_STATE: ExecutiveOrganizationReleaseState = Object.freeze({
  releaseId: "BUS-30:8",
  releaseVersion: "1.0.0",
  releaseStage: "Freeze",
  releaseStatus: EXECUTIVE_ORGANIZATION_RELEASE_STATUS,
  certificationReference: "executive-organization-certification",
  freezeReference: "executive-organization-platform-freeze",
  metadata: freezeMetadataBlock,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_FREEZE_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_ORGANIZATION_FREEZE_NAMESPACE",
  "EXECUTIVE_ORGANIZATION_FREEZE_VERSION",
  "EXECUTIVE_ORGANIZATION_FREEZE_STATUS",
  "EXECUTIVE_ORGANIZATION_RELEASE_STATUS",
  "EXECUTIVE_ORGANIZATION_FREEZE_DESCRIPTION",
  "EXECUTIVE_ORGANIZATION_FREEZE_METADATA",
  "EXECUTIVE_ORGANIZATION_PLATFORM_FREEZE",
  "EXECUTIVE_ORGANIZATION_FREEZE_MANIFEST",
  "EXECUTIVE_ORGANIZATION_FREEZE_REGISTRY",
  "EXECUTIVE_ORGANIZATION_FREEZE_COMPATIBILITY",
  "EXECUTIVE_ORGANIZATION_FREEZE_POLICY",
  "EXECUTIVE_ORGANIZATION_FREEZE_SUMMARY",
  "EXECUTIVE_ORGANIZATION_RELEASE_STATE",
  "ExecutiveOrganizationPlatformFreezeFoundation",
] as const);

export const ExecutiveOrganizationPlatformFreezeFoundation: ExecutiveOrganizationPlatformFreezeBundle =
  Object.freeze({
    platform: EXECUTIVE_ORGANIZATION_PLATFORM_FREEZE,
    manifest: EXECUTIVE_ORGANIZATION_FREEZE_MANIFEST,
    registry: EXECUTIVE_ORGANIZATION_FREEZE_REGISTRY,
    compatibility: EXECUTIVE_ORGANIZATION_FREEZE_COMPATIBILITY,
    policy: EXECUTIVE_ORGANIZATION_FREEZE_POLICY,
    summary: EXECUTIVE_ORGANIZATION_FREEZE_SUMMARY,
    release: EXECUTIVE_ORGANIZATION_RELEASE_STATE,
    metadata: EXECUTIVE_ORGANIZATION_FREEZE_METADATA,
    publicApis: EXECUTIVE_ORGANIZATION_FREEZE_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_FREEZE_FOUNDATION_COMPATIBILITY = Object.freeze({
  certificationStatus: EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
  certificationVersion: EXECUTIVE_ORGANIZATION_PLATFORM_CERTIFICATION.certificationVersion,
  certificationPolicyId: EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY.policyId,
  certificationDependencyCount:
    EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA.certificationDependencies.length,
  manifestPublicApiCount: EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS.length,
  platformPublicApiCount: EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS.length,
  releasePlatformId: EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformId,
  metadataOnlyBoundaryPreserved:
    ExecutiveOrganizationPlatformFoundation.metadataOnly &&
    EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST.metadataOnly,
  metadataOnly: true,
  immutable: true,
});
