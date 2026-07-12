import {
  ExecutiveReportingContractDescription,
  ExecutiveReportingContractId,
  ExecutiveReportingContractName,
  ExecutiveReportingContractVersion,
} from "./executiveReportingIndex.ts";
import {
  ExecutiveReportAudienceRegistry,
  ExecutiveReportCategoryRegistry,
  ExecutiveReportDefinitionRegistry,
  ExecutiveReportFormatRegistry,
  ExecutiveReportTemplateRegistry,
  ExecutiveReportingRegistryMetadata,
} from "./executiveReportingRegistryIndex.ts";
import {
  ExecutiveReportingCanonicalModel,
  ExecutiveReportingModelDescription,
  ExecutiveReportingModelId,
  ExecutiveReportingModelMetadata,
  ExecutiveReportingModelName,
  ExecutiveReportingModelVersion,
} from "./executiveReportingModelIndex.ts";
import {
  ExecutiveReportingValidationDescription,
  ExecutiveReportingValidationId,
  ExecutiveReportingValidationName,
  ExecutiveReportingValidationVersion,
  buildExecutiveReportingValidationSummary,
  getExecutiveReportingValidationChecks,
  getExecutiveReportingValidationMetadata,
} from "./executiveReportingValidationIndex.ts";

export const ExecutiveReportingManifestId = "BUS-33:5" as const;

export const ExecutiveReportingManifestVersion = "1.0.0" as const;

export const ExecutiveReportingManifestName =
  "Executive Reporting Intelligence Manifest" as const;

export const ExecutiveReportingManifestDescription =
  "Canonical metadata-only manifest layer for executive reporting intelligence." as const;

const manifestMetadataBlock = Object.freeze({
  createdBy: "BUS-33:5",
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveReportingManifestMetadata = Object.freeze({
  manifestId: ExecutiveReportingManifestId,
  manifestVersion: ExecutiveReportingManifestVersion,
  manifestName: ExecutiveReportingManifestName,
  manifestDescription: ExecutiveReportingManifestDescription,
  manifestNamespace: "nexora.bus.executive-reporting.manifest",
  manifestDependencies: Object.freeze([
    "BUS-33:1 Executive Reporting Intelligence Contracts",
    "BUS-33:2 Executive Reporting Registry",
    "BUS-33:3 Executive Reporting Model",
    "BUS-33:4 Executive Reporting Validation",
  ]),
  manifestConsumers: Object.freeze([
    "BUS-33:6 Platform",
    "BUS-33:7 Certification",
    "BUS-33:8 Freeze",
    "BUS-33:9 Public Index",
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
  "ExecutiveReportingContractId",
  "ExecutiveReportingContractVersion",
  "ExecutiveReportingContractName",
  "ExecutiveReportingContractDescription",
  "ExecutiveReportingRegistryFoundation",
  "ExecutiveReportingCanonicalModel",
  "ExecutiveReportingModelFoundation",
  "validateExecutiveReportingModel",
  "buildExecutiveReportingValidationSummary",
  "getExecutiveReportingValidationChecks",
  "getExecutiveReportingValidationMetadata",
] as const);

const dependencyMetadata = Object.freeze([
  Object.freeze({
    id: "BUS-33:1",
    name: "Executive Reporting Intelligence Contracts",
    version: ExecutiveReportingContractVersion,
    category: "Contracts",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-33:2",
    name: "Executive Reporting Registry",
    version: ExecutiveReportingRegistryMetadata.registryVersion,
    category: "Registry",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-33:3",
    name: ExecutiveReportingModelName,
    version: ExecutiveReportingModelVersion,
    category: "Model",
    metadata: manifestMetadataBlock,
  }),
  Object.freeze({
    id: "BUS-33:4",
    name: ExecutiveReportingValidationName,
    version: ExecutiveReportingValidationVersion,
    category: "Validation",
    metadata: manifestMetadataBlock,
  }),
] as const);

const manifest = Object.freeze({
  platformIdentity: Object.freeze({
    id: ExecutiveReportingContractId,
    name: ExecutiveReportingContractName,
    version: ExecutiveReportingContractVersion,
    namespace: "nexora.bus.executive-reporting",
    description: ExecutiveReportingContractDescription,
    metadataOnly: true,
    immutable: true,
  }),
  architecture: Object.freeze({
    contracts: Object.freeze({
      id: ExecutiveReportingContractId,
      version: ExecutiveReportingContractVersion,
      description: ExecutiveReportingContractDescription,
    }),
    registry: ExecutiveReportingRegistryMetadata,
    model: Object.freeze({
      id: ExecutiveReportingModelId,
      version: ExecutiveReportingModelVersion,
      name: ExecutiveReportingModelName,
      description: ExecutiveReportingModelDescription,
      metadata: ExecutiveReportingModelMetadata,
    }),
    validation: Object.freeze({
      id: ExecutiveReportingValidationId,
      version: ExecutiveReportingValidationVersion,
      name: ExecutiveReportingValidationName,
      description: ExecutiveReportingValidationDescription,
      metadata: getExecutiveReportingValidationMetadata(),
      summary: buildExecutiveReportingValidationSummary(),
    }),
    metadataOnly: true,
    immutable: true,
  }),
  reportingCoverage: Object.freeze({
    categories: ExecutiveReportCategoryRegistry,
    audiences: ExecutiveReportAudienceRegistry,
    formats: ExecutiveReportFormatRegistry,
    templates: ExecutiveReportTemplateRegistry,
    definitions: ExecutiveReportDefinitionRegistry,
    metadataOnly: true,
    immutable: true,
  }),
  publicApi: Object.freeze({
    exportedApis: publicApiInventory,
    exportedMetadata: Object.freeze([
      ExecutiveReportingRegistryMetadata.registryNamespace,
      ExecutiveReportingModelMetadata.modelNamespace,
      getExecutiveReportingValidationMetadata().validationNamespace,
    ]),
    publicNamespaces: Object.freeze([
      "executiveReportingIndex",
      "executiveReportingRegistryIndex",
      "executiveReportingModelIndex",
      "executiveReportingValidationIndex",
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
    manifestVersion: ExecutiveReportingManifestVersion,
    generatedMetadata: Object.freeze({
      createdBy: "BUS-33:5",
      registryVersion: ExecutiveReportingRegistryMetadata.registryVersion,
      modelVersion: ExecutiveReportingModelVersion,
      validationVersion: ExecutiveReportingValidationVersion,
      metadataOnly: true,
      immutable: true,
    }),
    releaseReadiness: Object.freeze({
      ready: buildExecutiveReportingValidationSummary().failedChecks === 0,
      status:
        buildExecutiveReportingValidationSummary().failedChecks === 0
          ? "Ready"
          : "Blocked",
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  }),
  metadata: ExecutiveReportingManifestMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

export const buildExecutiveReportingManifest = () => manifest;

export const getExecutiveReportingManifest = () => manifest;

export const getExecutiveReportingManifestSummary = () =>
  Object.freeze({
    dependencyCount: dependencyMetadata.length,
    categoryCount: ExecutiveReportCategoryRegistry.length,
    audienceCount: ExecutiveReportAudienceRegistry.length,
    formatCount: ExecutiveReportFormatRegistry.length,
    templateCount: ExecutiveReportTemplateRegistry.length,
    definitionCount: ExecutiveReportDefinitionRegistry.length,
    publicApiCount: publicApiInventory.length,
    validationCheckCount: getExecutiveReportingValidationChecks().length,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveReportingManifestMetadata = () =>
  ExecutiveReportingManifestMetadata;

export const getExecutiveReportingPublicApiInventory = () => publicApiInventory;

export const getExecutiveReportingDependencyMetadata = () => dependencyMetadata;

export const ExecutiveReportingManifest = manifest;

export const ExecutiveReportingManifestFoundation = Object.freeze({
  manifest: ExecutiveReportingManifest,
  metadata: ExecutiveReportingManifestMetadata,
  buildExecutiveReportingManifest,
  getExecutiveReportingManifest,
  getExecutiveReportingManifestSummary,
  getExecutiveReportingManifestMetadata,
  getExecutiveReportingPublicApiInventory,
  getExecutiveReportingDependencyMetadata,
  canonicalModel: ExecutiveReportingCanonicalModel,
  metadataOnly: true,
  immutable: true,
});
