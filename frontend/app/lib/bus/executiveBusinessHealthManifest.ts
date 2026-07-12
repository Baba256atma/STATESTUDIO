import {
  ExecutiveBusinessHealthContractDescription,
  ExecutiveBusinessHealthContractId,
  ExecutiveBusinessHealthContractName,
  ExecutiveBusinessHealthContractVersion,
} from "./executiveBusinessHealthIndex.ts";
import {
  ExecutiveBusinessHealthCapabilityRegistry,
  ExecutiveBusinessHealthDimensionRegistry,
  ExecutiveBusinessHealthDomainRegistry,
  ExecutiveBusinessHealthIndicatorRegistry,
  ExecutiveBusinessHealthRegistryMetadata,
} from "./executiveBusinessHealthRegistryIndex.ts";
import {
  ExecutiveBusinessHealthCanonicalModel,
  ExecutiveBusinessHealthModelDescription,
  ExecutiveBusinessHealthModelId,
  ExecutiveBusinessHealthModelMetadata,
  ExecutiveBusinessHealthModelName,
  ExecutiveBusinessHealthModelVersion,
} from "./executiveBusinessHealthModelIndex.ts";
import {
  ExecutiveBusinessHealthValidationDescription,
  ExecutiveBusinessHealthValidationId,
  ExecutiveBusinessHealthValidationName,
  ExecutiveBusinessHealthValidationVersion,
  buildExecutiveBusinessHealthValidationSummary,
  getExecutiveBusinessHealthValidationChecks,
  getExecutiveBusinessHealthValidationMetadata,
} from "./executiveBusinessHealthValidationIndex.ts";

export const ExecutiveBusinessHealthManifestId = "BUS-32:5" as const;

export const ExecutiveBusinessHealthManifestVersion = "1.0.0" as const;

export const ExecutiveBusinessHealthManifestName =
  "Executive Business Health Intelligence Manifest" as const;

export const ExecutiveBusinessHealthManifestDescription =
  "Canonical metadata-only manifest layer for executive business health intelligence." as const;

const manifestMetadataBlock = Object.freeze({
  createdBy: "BUS-32:5",
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessHealthManifestMetadata = Object.freeze({
  manifestId: ExecutiveBusinessHealthManifestId,
  manifestVersion: ExecutiveBusinessHealthManifestVersion,
  manifestName: ExecutiveBusinessHealthManifestName,
  manifestDescription: ExecutiveBusinessHealthManifestDescription,
  manifestNamespace: "nexora.bus.executive-business-health.manifest",
  manifestDependencies: Object.freeze([
    "BUS-32:1 Executive Business Health Intelligence Contracts",
    "BUS-32:2 Executive Business Health Registry",
    "BUS-32:3 Executive Business Health Model",
    "BUS-32:4 Executive Business Health Validation",
  ]),
  manifestConsumers: Object.freeze([
    "BUS-32:6 Platform",
    "BUS-32:7 Certification",
    "BUS-32:8 Freeze",
    "BUS-32:9 Public Index",
  ]),
  manifestCompatibility: Object.freeze([
    "metadata-only",
    "public-api-only",
    "deterministic",
    "immutable",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);

const publicApiInventory = Object.freeze([
  "ExecutiveBusinessHealthContractId",
  "ExecutiveBusinessHealthContractVersion",
  "ExecutiveBusinessHealthContractName",
  "ExecutiveBusinessHealthContractDescription",
  "ExecutiveBusinessHealthRegistryFoundation",
  "ExecutiveBusinessHealthCanonicalModel",
  "ExecutiveBusinessHealthModelFoundation",
  "validateExecutiveBusinessHealthModel",
  "buildExecutiveBusinessHealthValidationSummary",
  "getExecutiveBusinessHealthValidationChecks",
  "getExecutiveBusinessHealthValidationMetadata",
] as const);

const dependencyMetadata = Object.freeze([
  Object.freeze({
    id: "BUS-32:1",
    name: "Executive Business Health Intelligence Contracts",
    version: ExecutiveBusinessHealthContractVersion,
    category: "Contracts",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-32:2",
    name: "Executive Business Health Registry",
    version: ExecutiveBusinessHealthRegistryMetadata.registryVersion,
    category: "Registry",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-32:3",
    name: ExecutiveBusinessHealthModelName,
    version: ExecutiveBusinessHealthModelVersion,
    category: "Model",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-32:4",
    name: ExecutiveBusinessHealthValidationName,
    version: ExecutiveBusinessHealthValidationVersion,
    category: "Validation",
    metadata: manifestMetadataBlock,
  }),
] as const);

const manifest = Object.freeze({
  platformIdentity: Object.freeze({
    id: ExecutiveBusinessHealthContractId,
    name: ExecutiveBusinessHealthContractName,
    version: ExecutiveBusinessHealthContractVersion,
    namespace: "nexora.bus.executive-business-health",
    description: ExecutiveBusinessHealthContractDescription,
    metadataOnly: true,
    immutable: true,
  }),
  architecture: Object.freeze({
    contracts: Object.freeze({
      id: ExecutiveBusinessHealthContractId,
      version: ExecutiveBusinessHealthContractVersion,
      description: ExecutiveBusinessHealthContractDescription,
    }),
    registry: ExecutiveBusinessHealthRegistryMetadata,
    model: Object.freeze({
      id: ExecutiveBusinessHealthModelId,
      version: ExecutiveBusinessHealthModelVersion,
      name: ExecutiveBusinessHealthModelName,
      description: ExecutiveBusinessHealthModelDescription,
      metadata: ExecutiveBusinessHealthModelMetadata,
    }),
    validation: Object.freeze({
      id: ExecutiveBusinessHealthValidationId,
      version: ExecutiveBusinessHealthValidationVersion,
      name: ExecutiveBusinessHealthValidationName,
      description: ExecutiveBusinessHealthValidationDescription,
      metadata: getExecutiveBusinessHealthValidationMetadata(),
      summary: buildExecutiveBusinessHealthValidationSummary(),
    }),
    metadataOnly: true,
    immutable: true,
  }),
  executiveHealthCoverage: Object.freeze({
    domains: ExecutiveBusinessHealthDomainRegistry,
    dimensions: ExecutiveBusinessHealthDimensionRegistry,
    capabilities: ExecutiveBusinessHealthCapabilityRegistry,
    indicators: ExecutiveBusinessHealthIndicatorRegistry,
    metadataOnly: true,
    immutable: true,
  }),
  publicApi: Object.freeze({
    exportedApis: publicApiInventory,
    exportedMetadata: Object.freeze([
      ExecutiveBusinessHealthRegistryMetadata.registryNamespace,
      ExecutiveBusinessHealthModelMetadata.modelNamespace,
      getExecutiveBusinessHealthValidationMetadata().validationId,
    ]),
    publicNamespaces: Object.freeze([
      "executiveBusinessHealthIndex",
      "executiveBusinessHealthRegistryIndex",
      "executiveBusinessHealthModelIndex",
      "executiveBusinessHealthValidationIndex",
    ]),
    metadataOnly: true,
    immutable: true,
  }),
  compatibility: Object.freeze({
    supportedArchitectureVersion: "1.0.0",
    compatibilityStatus: "Compatible",
    extensionPolicy: Object.freeze([
      "additive-metadata-only",
      "public-api-driven",
      "no-runtime-state",
    ]),
    metadataOnly: true,
    immutable: true,
  }),
  release: Object.freeze({
    manifestVersion: ExecutiveBusinessHealthManifestVersion,
    generatedMetadata: Object.freeze({
      createdBy: "BUS-32:5",
      registryVersion: ExecutiveBusinessHealthRegistryMetadata.registryVersion,
      modelVersion: ExecutiveBusinessHealthModelVersion,
      validationVersion: ExecutiveBusinessHealthValidationVersion,
      metadataOnly: true,
      immutable: true,
    }),
    releaseReadiness: Object.freeze({
      ready: buildExecutiveBusinessHealthValidationSummary().failedChecks === 0,
      status:
        buildExecutiveBusinessHealthValidationSummary().failedChecks === 0
          ? "Ready"
          : "Blocked",
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  }),
  metadata: ExecutiveBusinessHealthManifestMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

export const buildExecutiveBusinessHealthManifest = () => manifest;

export const getExecutiveBusinessHealthManifest = () => manifest;

export const getExecutiveBusinessHealthManifestSummary = () =>
  Object.freeze({
    dependencyCount: dependencyMetadata.length,
    domainCount: ExecutiveBusinessHealthDomainRegistry.length,
    dimensionCount: ExecutiveBusinessHealthDimensionRegistry.length,
    capabilityCount: ExecutiveBusinessHealthCapabilityRegistry.length,
    indicatorCount: ExecutiveBusinessHealthIndicatorRegistry.length,
    publicApiCount: publicApiInventory.length,
    validationCheckCount: getExecutiveBusinessHealthValidationChecks().length,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveBusinessHealthManifestMetadata = () =>
  ExecutiveBusinessHealthManifestMetadata;

export const getExecutiveBusinessHealthPublicApiInventory = () => publicApiInventory;

export const getExecutiveBusinessHealthDependencyMetadata = () => dependencyMetadata;

export const ExecutiveBusinessHealthManifest = manifest;

export const ExecutiveBusinessHealthManifestFoundation = Object.freeze({
  manifest: ExecutiveBusinessHealthManifest,
  metadata: ExecutiveBusinessHealthManifestMetadata,
  buildExecutiveBusinessHealthManifest,
  getExecutiveBusinessHealthManifest,
  getExecutiveBusinessHealthManifestSummary,
  getExecutiveBusinessHealthManifestMetadata,
  getExecutiveBusinessHealthPublicApiInventory,
  getExecutiveBusinessHealthDependencyMetadata,
  canonicalModel: ExecutiveBusinessHealthCanonicalModel,
  metadataOnly: true,
  immutable: true,
});
