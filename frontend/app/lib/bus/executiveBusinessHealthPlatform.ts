import * as contracts from "./executiveBusinessHealthIndex.ts";
import * as registry from "./executiveBusinessHealthRegistryIndex.ts";
import * as model from "./executiveBusinessHealthModelIndex.ts";
import * as validation from "./executiveBusinessHealthValidationIndex.ts";
import * as manifest from "./executiveBusinessHealthManifestIndex.ts";
import {
  ExecutiveBusinessHealthContractDescription,
  ExecutiveBusinessHealthContractId,
  ExecutiveBusinessHealthContractName,
  ExecutiveBusinessHealthContractVersion,
} from "./executiveBusinessHealthIndex.ts";
import { ExecutiveBusinessHealthRegistryMetadata } from "./executiveBusinessHealthRegistryIndex.ts";
import { ExecutiveBusinessHealthModelMetadata } from "./executiveBusinessHealthModelIndex.ts";
import { getExecutiveBusinessHealthValidationMetadata } from "./executiveBusinessHealthValidationIndex.ts";
import { ExecutiveBusinessHealthManifestMetadata, getExecutiveBusinessHealthDependencyMetadata, getExecutiveBusinessHealthPublicApiInventory } from "./executiveBusinessHealthManifestIndex.ts";

export const ExecutiveBusinessHealthPlatformId = "BUS-32:6" as const;

export const ExecutiveBusinessHealthPlatformVersion = "1.0.0" as const;

export const ExecutiveBusinessHealthPlatformName =
  "Executive Business Health Intelligence Platform" as const;

export const ExecutiveBusinessHealthPlatformDescription =
  "Canonical metadata-only platform layer for executive business health intelligence." as const;

export const ExecutiveBusinessHealthPlatformNamespace =
  "nexora.bus.executive-business-health.platform" as const;

export const ExecutiveBusinessHealthPlatformMetadata = Object.freeze({
  platformId: ExecutiveBusinessHealthPlatformId,
  platformVersion: ExecutiveBusinessHealthPlatformVersion,
  platformName: ExecutiveBusinessHealthPlatformName,
  platformDescription: ExecutiveBusinessHealthPlatformDescription,
  platformNamespace: ExecutiveBusinessHealthPlatformNamespace,
  identity: Object.freeze({
    id: ExecutiveBusinessHealthContractId,
    name: ExecutiveBusinessHealthContractName,
    namespace: "nexora.bus.executive-business-health",
    version: ExecutiveBusinessHealthContractVersion,
    description: ExecutiveBusinessHealthContractDescription,
    metadataOnly: true,
    immutable: true,
  }),
  architecture: Object.freeze({
    contracts: Object.freeze({
      id: ExecutiveBusinessHealthContractId,
      version: ExecutiveBusinessHealthContractVersion,
      name: ExecutiveBusinessHealthContractName,
    }),
    registry: ExecutiveBusinessHealthRegistryMetadata,
    model: ExecutiveBusinessHealthModelMetadata,
    validation: getExecutiveBusinessHealthValidationMetadata(),
    manifest: ExecutiveBusinessHealthManifestMetadata,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: getExecutiveBusinessHealthDependencyMetadata(),
  publicApi: Object.freeze({
    exportedNamespaces: Object.freeze([
      "executiveBusinessHealthIndex",
      "executiveBusinessHealthRegistryIndex",
      "executiveBusinessHealthModelIndex",
      "executiveBusinessHealthValidationIndex",
      "executiveBusinessHealthManifestIndex",
    ]),
    exportedMetadata: Object.freeze([
      ExecutiveBusinessHealthRegistryMetadata.registryNamespace,
      ExecutiveBusinessHealthModelMetadata.modelNamespace,
      getExecutiveBusinessHealthValidationMetadata().validationId,
      ExecutiveBusinessHealthManifestMetadata.manifestNamespace,
    ]),
    publicContracts: getExecutiveBusinessHealthPublicApiInventory(),
    metadataOnly: true,
    immutable: true,
  }),
  release: Object.freeze({
    releaseState: "Published",
    platformMaturity: "Foundation",
    metadataVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const buildExecutiveBusinessHealthPlatform = () =>
  Object.freeze({
    contracts: Object.freeze({ ...contracts }),
    registry: Object.freeze({ ...registry }),
    model: Object.freeze({ ...model }),
    validation: Object.freeze({ ...validation }),
    manifest: Object.freeze({ ...manifest }),
    metadata: ExecutiveBusinessHealthPlatformMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessHealthPlatform = buildExecutiveBusinessHealthPlatform();

export const getExecutiveBusinessHealthPlatform = () => ExecutiveBusinessHealthPlatform;

export const getExecutiveBusinessHealthPlatformSummary = () =>
  Object.freeze({
    namespaceCount: 5,
    dependencyCount: getExecutiveBusinessHealthDependencyMetadata().length,
    publicApiCount: getExecutiveBusinessHealthPublicApiInventory().length,
    releaseState: ExecutiveBusinessHealthPlatformMetadata.release.releaseState,
    platformMaturity: ExecutiveBusinessHealthPlatformMetadata.release.platformMaturity,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveBusinessHealthPlatformMetadata = () =>
  ExecutiveBusinessHealthPlatformMetadata;

export const getExecutiveBusinessHealthPlatformDependencies = () =>
  getExecutiveBusinessHealthDependencyMetadata();

export const getExecutiveBusinessHealthPlatformPublicApi = () =>
  ExecutiveBusinessHealthPlatformMetadata.publicApi;

export const ExecutiveBusinessHealthPlatformFoundation = Object.freeze({
  platform: ExecutiveBusinessHealthPlatform,
  metadata: ExecutiveBusinessHealthPlatformMetadata,
  buildExecutiveBusinessHealthPlatform,
  getExecutiveBusinessHealthPlatform,
  getExecutiveBusinessHealthPlatformSummary,
  getExecutiveBusinessHealthPlatformMetadata,
  getExecutiveBusinessHealthPlatformDependencies,
  getExecutiveBusinessHealthPlatformPublicApi,
  metadataOnly: true,
  immutable: true,
});
