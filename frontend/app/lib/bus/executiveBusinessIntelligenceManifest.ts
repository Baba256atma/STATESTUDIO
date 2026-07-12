import {
  ExecutiveBusinessIntelligenceContractDescription,
  ExecutiveBusinessIntelligenceContractId,
  ExecutiveBusinessIntelligenceContractName,
  ExecutiveBusinessIntelligenceContractVersion,
} from "./executiveBusinessIntelligenceIndex.ts";
import {
  ExecutiveBusinessIntelligenceCapabilityRegistry,
  ExecutiveBusinessIntelligenceDependencyRegistry,
  ExecutiveBusinessIntelligenceDomainRegistry,
  ExecutiveBusinessIntelligenceIntegrationRegistry,
  ExecutiveBusinessIntelligenceNamespaceRegistry,
  ExecutiveBusinessIntelligencePlatformRegistry,
  ExecutiveBusinessIntelligenceRegistryMetadata,
} from "./executiveBusinessIntelligenceRegistryIndex.ts";
import {
  ExecutiveBusinessIntelligenceCanonicalModel,
  ExecutiveBusinessIntelligenceModelDescription,
  ExecutiveBusinessIntelligenceModelId,
  ExecutiveBusinessIntelligenceModelMetadata,
  ExecutiveBusinessIntelligenceModelName,
  ExecutiveBusinessIntelligenceModelVersion,
} from "./executiveBusinessIntelligenceModelIndex.ts";
import {
  ExecutiveBusinessIntelligenceValidationDescription,
  ExecutiveBusinessIntelligenceValidationId,
  ExecutiveBusinessIntelligenceValidationName,
  ExecutiveBusinessIntelligenceValidationVersion,
  buildExecutiveBusinessIntelligenceValidationSummary,
  getExecutiveBusinessIntelligenceValidationChecks,
  getExecutiveBusinessIntelligenceValidationMetadata,
} from "./executiveBusinessIntelligenceValidationIndex.ts";

export const ExecutiveBusinessIntelligenceManifestId = "BUS-34:5" as const;

export const ExecutiveBusinessIntelligenceManifestVersion = "1.0.0" as const;

export const ExecutiveBusinessIntelligenceManifestName =
  "Executive Business Intelligence Manifest" as const;

export const ExecutiveBusinessIntelligenceManifestDescription =
  "Canonical metadata-only manifest layer for executive business intelligence." as const;

const manifestMetadataBlock = Object.freeze({
  createdBy: "BUS-34:5",
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessIntelligenceManifestMetadata = Object.freeze({
  manifestId: ExecutiveBusinessIntelligenceManifestId,
  manifestVersion: ExecutiveBusinessIntelligenceManifestVersion,
  manifestName: ExecutiveBusinessIntelligenceManifestName,
  manifestDescription: ExecutiveBusinessIntelligenceManifestDescription,
  manifestNamespace: "nexora.bus.executive-business-intelligence.manifest",
  manifestDependencies: Object.freeze([
    "BUS-34:1 Executive Business Intelligence Contracts",
    "BUS-34:2 Executive Business Intelligence Registry",
    "BUS-34:3 Executive Business Intelligence Model",
    "BUS-34:4 Executive Business Intelligence Validation",
  ]),
  manifestConsumers: Object.freeze([
    "BUS-34:6 Platform",
    "BUS-34:7 Certification",
    "BUS-34:8 Freeze",
    "BUS-34:9 Public Index",
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
  "ExecutiveBusinessIntelligenceContractId",
  "ExecutiveBusinessIntelligenceContractVersion",
  "ExecutiveBusinessIntelligenceContractName",
  "ExecutiveBusinessIntelligenceContractDescription",
  "ExecutiveBusinessIntelligenceRegistryFoundation",
  "ExecutiveBusinessIntelligenceCanonicalModel",
  "ExecutiveBusinessIntelligenceModelFoundation",
  "validateExecutiveBusinessIntelligenceModel",
  "buildExecutiveBusinessIntelligenceValidationSummary",
  "getExecutiveBusinessIntelligenceValidationChecks",
  "getExecutiveBusinessIntelligenceValidationMetadata",
] as const);

const dependencyMetadata = Object.freeze([
  Object.freeze({
    id: "BUS-34:1",
    name: "Executive Business Intelligence Contracts",
    version: ExecutiveBusinessIntelligenceContractVersion,
    category: "Contracts",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-34:2",
    name: "Executive Business Intelligence Registry",
    version: ExecutiveBusinessIntelligenceRegistryMetadata.registryVersion,
    category: "Registry",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-34:3",
    name: ExecutiveBusinessIntelligenceModelName,
    version: ExecutiveBusinessIntelligenceModelVersion,
    category: "Model",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-34:4",
    name: ExecutiveBusinessIntelligenceValidationName,
    version: ExecutiveBusinessIntelligenceValidationVersion,
    category: "Validation",
    metadata: manifestMetadataBlock,
  }),
] as const);

const manifest = Object.freeze({
  platformIdentity: Object.freeze({
    id: ExecutiveBusinessIntelligenceContractId,
    name: ExecutiveBusinessIntelligenceContractName,
    version: ExecutiveBusinessIntelligenceContractVersion,
    namespace: "nexora.bus.executive-business-intelligence",
    description: ExecutiveBusinessIntelligenceContractDescription,
    metadataOnly: true,
    immutable: true,
  }),
  architecture: Object.freeze({
    contracts: Object.freeze({
      id: ExecutiveBusinessIntelligenceContractId,
      version: ExecutiveBusinessIntelligenceContractVersion,
      description: ExecutiveBusinessIntelligenceContractDescription,
    }),
    registry: ExecutiveBusinessIntelligenceRegistryMetadata,
    model: Object.freeze({
      id: ExecutiveBusinessIntelligenceModelId,
      version: ExecutiveBusinessIntelligenceModelVersion,
      name: ExecutiveBusinessIntelligenceModelName,
      description: ExecutiveBusinessIntelligenceModelDescription,
      metadata: ExecutiveBusinessIntelligenceModelMetadata,
    }),
    validation: Object.freeze({
      id: ExecutiveBusinessIntelligenceValidationId,
      version: ExecutiveBusinessIntelligenceValidationVersion,
      name: ExecutiveBusinessIntelligenceValidationName,
      description: ExecutiveBusinessIntelligenceValidationDescription,
      metadata: getExecutiveBusinessIntelligenceValidationMetadata(),
      summary: buildExecutiveBusinessIntelligenceValidationSummary(),
    }),
    metadataOnly: true,
    immutable: true,
  }),
  businessIntelligenceCoverage: Object.freeze({
    domains: ExecutiveBusinessIntelligenceDomainRegistry,
    capabilities: ExecutiveBusinessIntelligenceCapabilityRegistry,
    platforms: ExecutiveBusinessIntelligencePlatformRegistry,
    namespaces: ExecutiveBusinessIntelligenceNamespaceRegistry,
    dependencies: ExecutiveBusinessIntelligenceDependencyRegistry,
    integrations: ExecutiveBusinessIntelligenceIntegrationRegistry,
    metadataOnly: true,
    immutable: true,
  }),
  publicApi: Object.freeze({
    exportedApis: publicApiInventory,
    exportedMetadata: Object.freeze([
      ExecutiveBusinessIntelligenceRegistryMetadata.registryNamespace,
      ExecutiveBusinessIntelligenceModelMetadata.modelNamespace,
      getExecutiveBusinessIntelligenceValidationMetadata().validationNamespace,
    ]),
    publicNamespaces: Object.freeze([
      "executiveBusinessIntelligenceIndex",
      "executiveBusinessIntelligenceRegistryIndex",
      "executiveBusinessIntelligenceModelIndex",
      "executiveBusinessIntelligenceValidationIndex",
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
    manifestVersion: ExecutiveBusinessIntelligenceManifestVersion,
    generatedMetadata: Object.freeze({
      createdBy: "BUS-34:5",
      registryVersion: ExecutiveBusinessIntelligenceRegistryMetadata.registryVersion,
      modelVersion: ExecutiveBusinessIntelligenceModelVersion,
      validationVersion: ExecutiveBusinessIntelligenceValidationVersion,
      metadataOnly: true,
      immutable: true,
    }),
    releaseReadiness: Object.freeze({
      ready: buildExecutiveBusinessIntelligenceValidationSummary().failedChecks === 0,
      status:
        buildExecutiveBusinessIntelligenceValidationSummary().failedChecks === 0
          ? "Ready"
          : "Blocked",
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  }),
  metadata: ExecutiveBusinessIntelligenceManifestMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

export const buildExecutiveBusinessIntelligenceManifest = () => manifest;

export const getExecutiveBusinessIntelligenceManifest = () => manifest;

export const getExecutiveBusinessIntelligenceManifestSummary = () =>
  Object.freeze({
    dependencyCount: dependencyMetadata.length,
    domainCount: ExecutiveBusinessIntelligenceDomainRegistry.length,
    capabilityCount: ExecutiveBusinessIntelligenceCapabilityRegistry.length,
    platformCount: ExecutiveBusinessIntelligencePlatformRegistry.length,
    namespaceCount: ExecutiveBusinessIntelligenceNamespaceRegistry.length,
    integrationCount: ExecutiveBusinessIntelligenceIntegrationRegistry.length,
    publicApiCount: publicApiInventory.length,
    validationCheckCount: getExecutiveBusinessIntelligenceValidationChecks().length,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveBusinessIntelligenceManifestMetadata = () =>
  ExecutiveBusinessIntelligenceManifestMetadata;

export const getExecutiveBusinessIntelligencePublicApiInventory = () =>
  publicApiInventory;

export const getExecutiveBusinessIntelligenceDependencyMetadata = () =>
  dependencyMetadata;

export const ExecutiveBusinessIntelligenceManifest = manifest;

export const ExecutiveBusinessIntelligenceManifestFoundation = Object.freeze({
  manifest: ExecutiveBusinessIntelligenceManifest,
  metadata: ExecutiveBusinessIntelligenceManifestMetadata,
  buildExecutiveBusinessIntelligenceManifest,
  getExecutiveBusinessIntelligenceManifest,
  getExecutiveBusinessIntelligenceManifestSummary,
  getExecutiveBusinessIntelligenceManifestMetadata,
  getExecutiveBusinessIntelligencePublicApiInventory,
  getExecutiveBusinessIntelligenceDependencyMetadata,
  canonicalModel: ExecutiveBusinessIntelligenceCanonicalModel,
  metadataOnly: true,
  immutable: true,
});
