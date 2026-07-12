import * as contracts from "./executiveResourceIndex.ts";
import * as registry from "./executiveResourceRegistryIndex.ts";
import * as model from "./executiveResourceModelIndex.ts";
import * as validation from "./executiveResourceValidationIndex.ts";
import * as manifest from "./executiveResourceManifestIndex.ts";
import {
  EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
} from "./executiveResourceIndex.ts";
import {
  EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_PLATFORM_MANIFEST,
} from "./executiveResourceManifestIndex.ts";
import type {
  ExecutiveResourcePlatform,
  ExecutiveResourcePlatformBundle,
  ExecutiveResourcePlatformCompatibility,
  ExecutiveResourcePlatformConsumer,
  ExecutiveResourcePlatformDependency,
  ExecutiveResourcePlatformExtensionPolicy,
  ExecutiveResourcePlatformMetadata,
  ExecutiveResourcePlatformSummary,
} from "./executiveResourcePlatformTypes.ts";

const platformMetadataBlock = Object.freeze({
  createdBy: "BUS-31:6",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_RESOURCE_PLATFORM_IDENTITY: ExecutiveResourcePlatform = Object.freeze({
  platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
  platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
  platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  platformStatus: "Published",
  platformDescription: EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  platformMetadata: Object.freeze({
    createdBy: "BUS-31:6",
    platformLayer: "Platform",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES: readonly ExecutiveResourcePlatformDependency[] =
  Object.freeze([
    Object.freeze({
      dependencyId: "BUS-31:1",
      dependencyName: "Executive Resource Intelligence Contracts",
      dependencyVersion: "1.0.0",
      dependencyType: "Contracts",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-31:2",
      dependencyName: "Executive Resource Registry",
      dependencyVersion: "1.0.0",
      dependencyType: "Registry",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-31:3",
      dependencyName: "Executive Resource Model",
      dependencyVersion: "1.0.0",
      dependencyType: "Model",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-31:4",
      dependencyName: "Executive Resource Validation",
      dependencyVersion: "1.0.0",
      dependencyType: "Validation",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      dependencyId: "BUS-31:5",
      dependencyName: "Executive Resource Manifest",
      dependencyVersion: "1.0.0",
      dependencyType: "Manifest",
      dependencyStatus: "Available",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_RESOURCE_PLATFORM_COMPATIBILITY: ExecutiveResourcePlatformCompatibility =
  Object.freeze({
    compatibilityVersion: "1.0.0",
    supportedPlatformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    compatibilityStatus: "Compatible",
    metadata: platformMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_PLATFORM_CONSUMERS: readonly ExecutiveResourcePlatformConsumer[] =
  Object.freeze([
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-bus",
      consumerName: "BUS",
      consumerCategory: "BUS",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-ops",
      consumerName: "OPS",
      consumerCategory: "OPS",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-app",
      consumerName: "APP",
      consumerCategory: "APP",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-lay",
      consumerName: "LAY",
      consumerCategory: "LAY",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-core",
      consumerName: "CORE",
      consumerCategory: "CORE",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-advisor",
      consumerName: "Executive Advisor",
      consumerCategory: "ExecutiveAdvisor",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-dashboard",
      consumerName: "Executive Dashboard",
      consumerCategory: "ExecutiveDashboard",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-scenario",
      consumerName: "Executive Scenario Engine",
      consumerCategory: "ExecutiveScenarioEngine",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-planning",
      consumerName: "Executive Planning",
      consumerCategory: "ExecutivePlanning",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      consumerId: "executive-resource-platform-consumer-allocation",
      consumerName: "Executive Allocation",
      consumerCategory: "ExecutiveAllocation",
      metadata: platformMetadataBlock,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

export const EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY: ExecutiveResourcePlatformExtensionPolicy =
  Object.freeze({
    extensionPolicyId: "executive-resource-platform-extension-policy",
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

export const EXECUTIVE_RESOURCE_PLATFORM_SUMMARY: ExecutiveResourcePlatformSummary =
  Object.freeze({
    componentCount: 10,
    dependencyCount: EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES.length,
    consumerCount: EXECUTIVE_RESOURCE_PLATFORM_CONSUMERS.length,
    platformStatus: "Published",
    metadata: platformMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_PLATFORM_METADATA: ExecutiveResourcePlatformMetadata =
  Object.freeze({
    platformNamespace: "nexora.bus.executive-resource.platform",
    platformVersion: "1.0.0",
    platformStatus: "Published",
    platformDescription:
      "Canonical metadata-only platform layer for executive resource intelligence.",
    platformDependencies: Object.freeze(
      EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES.map((dependency) => dependency.dependencyName),
    ),
    platformConsumers: Object.freeze(
      EXECUTIVE_RESOURCE_PLATFORM_CONSUMERS.map((consumer) => consumer.consumerName),
    ),
    platformCompatibility: Object.freeze([
      `manifest-status:${EXECUTIVE_RESOURCE_PLATFORM_MANIFEST.manifestStatus}`,
      `manifest-public-api-count:${EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS.length}`,
      "metadata-only",
      "public-api-only",
      "deterministic",
      "immutable",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_PLATFORM_IDENTITY",
  "EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES",
  "EXECUTIVE_RESOURCE_PLATFORM_COMPATIBILITY",
  "EXECUTIVE_RESOURCE_PLATFORM_CONSUMERS",
  "EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY",
  "EXECUTIVE_RESOURCE_PLATFORM_SUMMARY",
  "EXECUTIVE_RESOURCE_PLATFORM_METADATA",
  "ExecutiveResourcePlatformFoundation",
] as const);

export const ExecutiveResourcePlatformFoundation: ExecutiveResourcePlatformBundle = Object.freeze({
  identity: EXECUTIVE_RESOURCE_PLATFORM_IDENTITY,
  contracts: Object.freeze({ ...contracts }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  dependencies: EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES,
  compatibility: EXECUTIVE_RESOURCE_PLATFORM_COMPATIBILITY,
  extensionPolicy: EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY,
  consumers: EXECUTIVE_RESOURCE_PLATFORM_CONSUMERS,
  summary: EXECUTIVE_RESOURCE_PLATFORM_SUMMARY,
  metadata: EXECUTIVE_RESOURCE_PLATFORM_METADATA,
  publicApis: EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});
