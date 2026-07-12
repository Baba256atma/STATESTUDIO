import * as contracts from "./executiveOrganizationIndex.ts";
import * as registry from "./executiveOrganizationRegistryIndex.ts";
import * as model from "./executiveOrganizationModelIndex.ts";
import * as validation from "./executiveOrganizationValidationIndex.ts";
import * as manifest from "./executiveOrganizationManifestIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
} from "./executiveOrganizationIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST,
} from "./executiveOrganizationManifestIndex.ts";
import type {
  ExecutiveOrganizationPlatform,
  ExecutiveOrganizationPlatformBundle,
  ExecutiveOrganizationPlatformCompatibility,
  ExecutiveOrganizationPlatformConsumer,
  ExecutiveOrganizationPlatformDependency,
  ExecutiveOrganizationPlatformExtensionPolicy,
  ExecutiveOrganizationPlatformMetadata,
  ExecutiveOrganizationPlatformSummary,
} from "./executiveOrganizationPlatformTypes.ts";

const platformMetadataBlock = Object.freeze({
  createdBy: "BUS-30:6",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY: ExecutiveOrganizationPlatform = Object.freeze({
  platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  platformName: EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
  platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
  platformStatus: "Published",
  platformDescription: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  platformMetadata: Object.freeze({
    createdBy: "BUS-30:6",
    platformLayer: "Platform",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES: readonly ExecutiveOrganizationPlatformDependency[] =
  Object.freeze([
    Object.freeze({
      dependencyId: "BUS-30:1",
      dependencyName: "Executive Organization Intelligence Contracts",
      dependencyVersion: "1.0.0",
      dependencyType: "Contracts",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-30:2",
      dependencyName: "Executive Organization Registry",
      dependencyVersion: "1.0.0",
      dependencyType: "Registry",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-30:3",
      dependencyName: "Executive Organization Model",
      dependencyVersion: "1.0.0",
      dependencyType: "Model",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-30:4",
      dependencyName: "Executive Organization Validation",
      dependencyVersion: "1.0.0",
      dependencyType: "Validation",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-30:5",
      dependencyName: "Executive Organization Manifest",
      dependencyVersion: "1.0.0",
      dependencyType: "Manifest",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_ORGANIZATION_PLATFORM_COMPATIBILITY: ExecutiveOrganizationPlatformCompatibility =
  Object.freeze({
    compatibilityVersion: "1.0.0",
    supportedPlatformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    compatibilityStatus: "Compatible",
    metadata: platformMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_CONSUMERS: readonly ExecutiveOrganizationPlatformConsumer[] =
  Object.freeze([
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-bus",
      consumerName: "BUS",
      consumerCategory: "BUS",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-ops",
      consumerName: "OPS",
      consumerCategory: "OPS",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-app",
      consumerName: "APP",
      consumerCategory: "APP",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-lay",
      consumerName: "LAY",
      consumerCategory: "LAY",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-core",
      consumerName: "CORE",
      consumerCategory: "CORE",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-advisor",
      consumerName: "Executive Advisor",
      consumerCategory: "ExecutiveAdvisor",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-dashboard",
      consumerName: "Executive Dashboard",
      consumerCategory: "ExecutiveDashboard",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-organization-platform-consumer-scenario",
      consumerName: "Executive Scenario Engine",
      consumerCategory: "ExecutiveScenarioEngine",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY: ExecutiveOrganizationPlatformExtensionPolicy =
  Object.freeze({
    extensionPolicyId: "executive-organization-platform-extension-policy",
    policyVersion: "1.0.0",
    supportedExtensions: Object.freeze([
      "Additive manifest metadata",
      "Additive validation metadata",
      "Additive compatibility metadata",
      "Additive platform consumers",
    ]),
    compatibilityRequirements: Object.freeze([
      "public-api-only",
      "metadata-only",
      "deterministic",
      "immutable",
      "backward-compatible",
    ]),
    metadata: platformMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_SUMMARY: ExecutiveOrganizationPlatformSummary =
  Object.freeze({
    componentCount: 10,
    dependencyCount: EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES.length,
    consumerCount: EXECUTIVE_ORGANIZATION_PLATFORM_CONSUMERS.length,
    platformStatus: "Published",
    metadata: platformMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_METADATA: ExecutiveOrganizationPlatformMetadata =
  Object.freeze({
    platformNamespace: "nexora.bus.executive-organization.platform",
    platformVersion: "1.0.0",
    platformStatus: "Published",
    platformDescription:
      "Canonical metadata-only platform layer for executive organization intelligence.",
    platformDependencies: Object.freeze(
      EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES.map((dependency) => dependency.dependencyName),
    ),
    platformConsumers: Object.freeze(
      EXECUTIVE_ORGANIZATION_PLATFORM_CONSUMERS.map((consumer) => consumer.consumerName),
    ),
    platformCompatibility: Object.freeze([
      `manifest-status:${EXECUTIVE_ORGANIZATION_PLATFORM_MANIFEST.manifestStatus}`,
      `manifest-public-api-count:${EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS.length}`,
      "metadata-only",
      "public-api-only",
      "deterministic",
      "immutable",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY",
  "EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES",
  "EXECUTIVE_ORGANIZATION_PLATFORM_COMPATIBILITY",
  "EXECUTIVE_ORGANIZATION_PLATFORM_CONSUMERS",
  "EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY",
  "EXECUTIVE_ORGANIZATION_PLATFORM_SUMMARY",
  "EXECUTIVE_ORGANIZATION_PLATFORM_METADATA",
  "ExecutiveOrganizationPlatformFoundation",
] as const);

export const ExecutiveOrganizationPlatformFoundation: ExecutiveOrganizationPlatformBundle =
  Object.freeze({
    identity: EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY,
    contracts: Object.freeze({ ...contracts }),
    registry: Object.freeze({ ...registry }),
    model: Object.freeze({ ...model }),
    validation: Object.freeze({ ...validation }),
    manifest: Object.freeze({ ...manifest }),
    dependencies: EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES,
    compatibility: EXECUTIVE_ORGANIZATION_PLATFORM_COMPATIBILITY,
    extensionPolicy: EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY,
    consumers: EXECUTIVE_ORGANIZATION_PLATFORM_CONSUMERS,
    summary: EXECUTIVE_ORGANIZATION_PLATFORM_SUMMARY,
    metadata: EXECUTIVE_ORGANIZATION_PLATFORM_METADATA,
    publicApis: EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });
