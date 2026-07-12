import * as contracts from "./executiveReportingIndex.ts";
import * as registry from "./executiveReportingRegistryIndex.ts";
import * as model from "./executiveReportingModelIndex.ts";
import * as validation from "./executiveReportingValidationIndex.ts";
import * as manifest from "./executiveReportingManifestIndex.ts";
import {
  ExecutiveReportingContractDescription,
  ExecutiveReportingContractId,
  ExecutiveReportingContractName,
  ExecutiveReportingContractVersion,
} from "./executiveReportingIndex.ts";
import { ExecutiveReportingRegistryMetadata } from "./executiveReportingRegistryIndex.ts";
import {
  ExecutiveReportingModelMetadata,
  ExecutiveReportingModelName,
  ExecutiveReportingModelVersion,
} from "./executiveReportingModelIndex.ts";
import {
  ExecutiveReportingValidationName,
  ExecutiveReportingValidationVersion,
  getExecutiveReportingValidationMetadata,
} from "./executiveReportingValidationIndex.ts";
import {
  ExecutiveReportingManifestMetadata,
  ExecutiveReportingManifestName,
  ExecutiveReportingManifestVersion,
  getExecutiveReportingDependencyMetadata,
  getExecutiveReportingPublicApiInventory,
} from "./executiveReportingManifestIndex.ts";

export const ExecutiveReportingPlatformId = "BUS-33:6" as const;

export const ExecutiveReportingPlatformVersion = "1.0.0" as const;

export const ExecutiveReportingPlatformName =
  "Executive Reporting Intelligence Platform" as const;

export const ExecutiveReportingPlatformDescription =
  "Canonical metadata-only platform layer for executive reporting intelligence." as const;

export const ExecutiveReportingPlatformNamespace =
  "nexora.bus.executive-reporting.platform" as const;

export const ExecutiveReportingPlatformMetadata = Object.freeze({
  platformId: ExecutiveReportingPlatformId,
  platformVersion: ExecutiveReportingPlatformVersion,
  platformName: ExecutiveReportingPlatformName,
  platformDescription: ExecutiveReportingPlatformDescription,
  platformNamespace: ExecutiveReportingPlatformNamespace,
  identity: Object.freeze({
    id: ExecutiveReportingContractId,
    name: ExecutiveReportingContractName,
    namespace: "nexora.bus.executive-reporting",
    version: ExecutiveReportingContractVersion,
    description: ExecutiveReportingContractDescription,
    metadataOnly: true,
    immutable: true,
  }),
  architecture: Object.freeze({
    contracts: Object.freeze({
      id: ExecutiveReportingContractId,
      version: ExecutiveReportingContractVersion,
      name: ExecutiveReportingContractName,
    }),
    registry: ExecutiveReportingRegistryMetadata,
    model: ExecutiveReportingModelMetadata,
    validation: getExecutiveReportingValidationMetadata(),
    manifest: ExecutiveReportingManifestMetadata,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: getExecutiveReportingDependencyMetadata(),
  publicApi: Object.freeze({
    exportedNamespaces: Object.freeze([
      "executiveReportingIndex",
      "executiveReportingRegistryIndex",
      "executiveReportingModelIndex",
      "executiveReportingValidationIndex",
      "executiveReportingManifestIndex",
    ]),
    exportedMetadata: Object.freeze([
      ExecutiveReportingRegistryMetadata.registryNamespace,
      ExecutiveReportingModelMetadata.modelNamespace,
      getExecutiveReportingValidationMetadata().validationNamespace,
      ExecutiveReportingManifestMetadata.manifestNamespace,
    ]),
    publicContracts: getExecutiveReportingPublicApiInventory(),
    metadataOnly: true,
    immutable: true,
  }),
  release: Object.freeze({
    releaseState: "Published",
    platformMaturity: "Foundation",
    metadataVersion: "1.0.0",
    releaseReadiness: ExecutiveReportingManifestMetadata.manifestConsumers.includes(
      "BUS-33:6 Platform",
    )
      ? "Ready"
      : "Blocked",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const buildExecutiveReportingPlatform = () =>
  Object.freeze({
    contracts: Object.freeze({ ...contracts }),
    registry: Object.freeze({ ...registry }),
    model: Object.freeze({ ...model }),
    validation: Object.freeze({ ...validation }),
    manifest: Object.freeze({ ...manifest }),
    metadata: ExecutiveReportingPlatformMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveReportingPlatform = buildExecutiveReportingPlatform();

export const getExecutiveReportingPlatform = () => ExecutiveReportingPlatform;

export const getExecutiveReportingPlatformSummary = () =>
  Object.freeze({
    namespaceCount: 5,
    dependencyCount: getExecutiveReportingDependencyMetadata().length,
    publicApiCount: getExecutiveReportingPublicApiInventory().length,
    releaseState: ExecutiveReportingPlatformMetadata.release.releaseState,
    platformMaturity: ExecutiveReportingPlatformMetadata.release.platformMaturity,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveReportingPlatformMetadata = () =>
  ExecutiveReportingPlatformMetadata;

export const getExecutiveReportingPlatformDependencies = () =>
  getExecutiveReportingDependencyMetadata();

export const getExecutiveReportingPlatformPublicApi = () =>
  ExecutiveReportingPlatformMetadata.publicApi;

export const ExecutiveReportingPlatformFoundation = Object.freeze({
  platform: ExecutiveReportingPlatform,
  metadata: ExecutiveReportingPlatformMetadata,
  buildExecutiveReportingPlatform,
  getExecutiveReportingPlatform,
  getExecutiveReportingPlatformSummary,
  getExecutiveReportingPlatformMetadata,
  getExecutiveReportingPlatformDependencies,
  getExecutiveReportingPlatformPublicApi,
  metadataOnly: true,
  immutable: true,
});
