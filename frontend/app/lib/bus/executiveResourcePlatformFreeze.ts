import { EXECUTIVE_RESOURCE_CERTIFICATION_METADATA, EXECUTIVE_RESOURCE_CERTIFICATION_POLICY, EXECUTIVE_RESOURCE_CERTIFICATION_STATUS, EXECUTIVE_RESOURCE_PLATFORM_CERTIFICATION } from "./executiveResourceCertificationIndex.ts";
import {
  EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_PLATFORM_MANIFEST,
} from "./executiveResourceManifestIndex.ts";
import {
  EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES,
  EXECUTIVE_RESOURCE_PLATFORM_IDENTITY,
  EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS,
  ExecutiveResourcePlatformFoundation,
} from "./executiveResourcePlatformIndex.ts";
import type {
  ExecutiveResourceFreezeCompatibility,
  ExecutiveResourceFreezeManifest,
  ExecutiveResourceFreezeMetadata,
  ExecutiveResourceFreezePolicy,
  ExecutiveResourceFreezeRegistry,
  ExecutiveResourceFreezeSummary,
  ExecutiveResourcePlatformFreeze,
  ExecutiveResourcePlatformFreezeBundle,
  ExecutiveResourceReleaseState,
} from "./executiveResourcePlatformFreezeTypes.ts";

export const EXECUTIVE_RESOURCE_FREEZE_NAMESPACE =
  "nexora.bus.executive-resource.freeze" as const;

export const EXECUTIVE_RESOURCE_FREEZE_VERSION = "1.0.0" as const;

export const EXECUTIVE_RESOURCE_FREEZE_STATUS = "FROZEN" as const;

export const EXECUTIVE_RESOURCE_RELEASE_STATUS = "RELEASED" as const;

export const EXECUTIVE_RESOURCE_FREEZE_DESCRIPTION =
  "Canonical metadata-only freeze layer for executive resource intelligence." as const;

const freezeMetadataBlock = Object.freeze({
  createdBy: "BUS-31:8",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_RESOURCE_FREEZE_METADATA: ExecutiveResourceFreezeMetadata =
  Object.freeze({
    freezeNamespace: EXECUTIVE_RESOURCE_FREEZE_NAMESPACE,
    freezeVersion: EXECUTIVE_RESOURCE_FREEZE_VERSION,
    freezeStatus: EXECUTIVE_RESOURCE_FREEZE_STATUS,
    freezeDescription: EXECUTIVE_RESOURCE_FREEZE_DESCRIPTION,
    freezeDependencies: Object.freeze([
      "BUS-31:1 Executive Resource Intelligence Contracts",
      "BUS-31:2 Executive Resource Registry",
      "BUS-31:3 Executive Resource Model",
      "BUS-31:4 Executive Resource Validation",
      "BUS-31:5 Executive Resource Manifest",
      "BUS-31:6 Executive Resource Platform",
      "BUS-31:7 Executive Resource Certification",
    ]),
    freezeConsumers: Object.freeze([
      "BUS-31:9 Public Index",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_PLATFORM_FREEZE: ExecutiveResourcePlatformFreeze = Object.freeze({
  freezeId: "executive-resource-platform-freeze",
  freezeVersion: EXECUTIVE_RESOURCE_FREEZE_VERSION,
  platformId: EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformId,
  platformVersion: EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformVersion,
  freezeStatus: EXECUTIVE_RESOURCE_FREEZE_STATUS,
  releaseStatus: EXECUTIVE_RESOURCE_RELEASE_STATUS,
  freezeDate: "2026-07-06",
  freezeMetadata: Object.freeze({
    freezeNamespace: EXECUTIVE_RESOURCE_FREEZE_NAMESPACE,
    freezeDescription: EXECUTIVE_RESOURCE_FREEZE_DESCRIPTION,
    freezeDependencies: EXECUTIVE_RESOURCE_FREEZE_METADATA.freezeDependencies,
    freezeConsumers: EXECUTIVE_RESOURCE_FREEZE_METADATA.freezeConsumers,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_FREEZE_MANIFEST: ExecutiveResourceFreezeManifest = Object.freeze({
  manifestId: "executive-resource-freeze-manifest",
  manifestVersion: "1.0.0",
  certifiedPlatformVersion: EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformVersion,
  freezeVersion: EXECUTIVE_RESOURCE_FREEZE_VERSION,
  manifestStatus: "Published",
  metadata: freezeMetadataBlock,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_FREEZE_REGISTRY: ExecutiveResourceFreezeRegistry = Object.freeze({
  registryId: "executive-resource-freeze-registry",
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
    EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES.map((dependency) => dependency.dependencyName),
  ),
  releaseSnapshot: Object.freeze([
    `certification-status:${EXECUTIVE_RESOURCE_CERTIFICATION_STATUS}`,
    `freeze-status:${EXECUTIVE_RESOURCE_FREEZE_STATUS}`,
    `release-status:${EXECUTIVE_RESOURCE_RELEASE_STATUS}`,
    `manifest-status:${EXECUTIVE_RESOURCE_PLATFORM_MANIFEST.manifestStatus}`,
  ]),
  metadata: freezeMetadataBlock,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_FREEZE_COMPATIBILITY: ExecutiveResourceFreezeCompatibility =
  Object.freeze({
    supportedPlatformVersion: EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformVersion,
    freezeVersion: EXECUTIVE_RESOURCE_FREEZE_VERSION,
    compatibilityStatus: "Compatible",
    metadata: freezeMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_FREEZE_POLICY: ExecutiveResourceFreezePolicy = Object.freeze({
  policyId: "executive-resource-freeze-policy",
  policyVersion: "1.0.0",
  policyName: "Executive Resource Platform Freeze Policy",
  policyDescription:
    "Defines the metadata-only freeze requirements for the Executive Resource Platform.",
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

export const EXECUTIVE_RESOURCE_FREEZE_SUMMARY: ExecutiveResourceFreezeSummary = Object.freeze({
  certifiedComponentCount: EXECUTIVE_RESOURCE_FREEZE_REGISTRY.certifiedComponents.length,
  dependencyCount: EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES.length,
  platformStatus: "Published",
  freezeStatus: EXECUTIVE_RESOURCE_FREEZE_STATUS,
  releaseStatus: EXECUTIVE_RESOURCE_RELEASE_STATUS,
  metadata: freezeMetadataBlock,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_RELEASE_STATE: ExecutiveResourceReleaseState = Object.freeze({
  releaseId: "BUS-31:8",
  releaseVersion: "1.0.0",
  releaseStage: "Freeze",
  releaseStatus: EXECUTIVE_RESOURCE_RELEASE_STATUS,
  certificationReference: "executive-resource-certification",
  freezeReference: "executive-resource-platform-freeze",
  metadata: freezeMetadataBlock,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_FREEZE_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_FREEZE_NAMESPACE",
  "EXECUTIVE_RESOURCE_FREEZE_VERSION",
  "EXECUTIVE_RESOURCE_FREEZE_STATUS",
  "EXECUTIVE_RESOURCE_RELEASE_STATUS",
  "EXECUTIVE_RESOURCE_FREEZE_DESCRIPTION",
  "EXECUTIVE_RESOURCE_FREEZE_METADATA",
  "EXECUTIVE_RESOURCE_PLATFORM_FREEZE",
  "EXECUTIVE_RESOURCE_FREEZE_MANIFEST",
  "EXECUTIVE_RESOURCE_FREEZE_REGISTRY",
  "EXECUTIVE_RESOURCE_FREEZE_COMPATIBILITY",
  "EXECUTIVE_RESOURCE_FREEZE_POLICY",
  "EXECUTIVE_RESOURCE_FREEZE_SUMMARY",
  "EXECUTIVE_RESOURCE_RELEASE_STATE",
  "ExecutiveResourcePlatformFreezeFoundation",
] as const);

export const ExecutiveResourcePlatformFreezeFoundation: ExecutiveResourcePlatformFreezeBundle =
  Object.freeze({
    platform: EXECUTIVE_RESOURCE_PLATFORM_FREEZE,
    manifest: EXECUTIVE_RESOURCE_FREEZE_MANIFEST,
    registry: EXECUTIVE_RESOURCE_FREEZE_REGISTRY,
    compatibility: EXECUTIVE_RESOURCE_FREEZE_COMPATIBILITY,
    policy: EXECUTIVE_RESOURCE_FREEZE_POLICY,
    summary: EXECUTIVE_RESOURCE_FREEZE_SUMMARY,
    release: EXECUTIVE_RESOURCE_RELEASE_STATE,
    metadata: EXECUTIVE_RESOURCE_FREEZE_METADATA,
    publicApis: EXECUTIVE_RESOURCE_FREEZE_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_FREEZE_FOUNDATION_COMPATIBILITY = Object.freeze({
  certificationStatus: EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
  certificationVersion: EXECUTIVE_RESOURCE_PLATFORM_CERTIFICATION.certificationVersion,
  certificationPolicyId: EXECUTIVE_RESOURCE_CERTIFICATION_POLICY.policyId,
  certificationDependencyCount:
    EXECUTIVE_RESOURCE_CERTIFICATION_METADATA.certificationDependencies.length,
  manifestPublicApiCount: EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS.length,
  platformPublicApiCount: EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS.length,
  releasePlatformId: EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformId,
  metadataOnlyBoundaryPreserved:
    ExecutiveResourcePlatformFoundation.metadataOnly &&
    EXECUTIVE_RESOURCE_PLATFORM_MANIFEST.metadataOnly,
  metadataOnly: true,
  immutable: true,
});
