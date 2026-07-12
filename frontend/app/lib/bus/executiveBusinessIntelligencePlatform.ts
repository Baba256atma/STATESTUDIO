import * as contracts from "./executiveBusinessIntelligenceIndex.ts";
import * as registry from "./executiveBusinessIntelligenceRegistryIndex.ts";
import * as model from "./executiveBusinessIntelligenceModelIndex.ts";
import * as validation from "./executiveBusinessIntelligenceValidationIndex.ts";
import * as manifest from "./executiveBusinessIntelligenceManifestIndex.ts";
import {
  ExecutiveBusinessIntelligenceContractDescription,
  ExecutiveBusinessIntelligenceContractId,
  ExecutiveBusinessIntelligenceContractName,
  ExecutiveBusinessIntelligenceContractVersion,
} from "./executiveBusinessIntelligenceIndex.ts";
import { ExecutiveBusinessIntelligenceRegistryMetadata } from "./executiveBusinessIntelligenceRegistryIndex.ts";
import {
  ExecutiveBusinessIntelligenceModelMetadata,
} from "./executiveBusinessIntelligenceModelIndex.ts";
import { getExecutiveBusinessIntelligenceValidationMetadata } from "./executiveBusinessIntelligenceValidationIndex.ts";
import {
  ExecutiveBusinessIntelligenceManifestMetadata,
  getExecutiveBusinessIntelligenceDependencyMetadata,
  getExecutiveBusinessIntelligencePublicApiInventory,
} from "./executiveBusinessIntelligenceManifestIndex.ts";

export const ExecutiveBusinessIntelligencePlatformId = "BUS-34:6" as const;

export const ExecutiveBusinessIntelligencePlatformVersion = "1.0.0" as const;

export const ExecutiveBusinessIntelligencePlatformName =
  "Executive Business Intelligence Platform" as const;

export const ExecutiveBusinessIntelligencePlatformDescription =
  "Canonical metadata-only platform layer for executive business intelligence." as const;

export const ExecutiveBusinessIntelligencePlatformNamespace =
  "nexora.bus.executive-business-intelligence.platform" as const;

export const ExecutiveBusinessIntelligencePlatformMetadata = Object.freeze({
  platformId: ExecutiveBusinessIntelligencePlatformId,
  platformVersion: ExecutiveBusinessIntelligencePlatformVersion,
  platformName: ExecutiveBusinessIntelligencePlatformName,
  platformDescription: ExecutiveBusinessIntelligencePlatformDescription,
  platformNamespace: ExecutiveBusinessIntelligencePlatformNamespace,
  identity: Object.freeze({
    id: ExecutiveBusinessIntelligenceContractId,
    name: ExecutiveBusinessIntelligenceContractName,
    namespace: "nexora.bus.executive-business-intelligence",
    version: ExecutiveBusinessIntelligenceContractVersion,
    description: ExecutiveBusinessIntelligenceContractDescription,
    metadataOnly: true,
    immutable: true,
  }),
  architecture: Object.freeze({
    contracts: Object.freeze({
      id: ExecutiveBusinessIntelligenceContractId,
      version: ExecutiveBusinessIntelligenceContractVersion,
      name: ExecutiveBusinessIntelligenceContractName,
    }),
    registry: ExecutiveBusinessIntelligenceRegistryMetadata,
    model: ExecutiveBusinessIntelligenceModelMetadata,
    validation: getExecutiveBusinessIntelligenceValidationMetadata(),
    manifest: ExecutiveBusinessIntelligenceManifestMetadata,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: getExecutiveBusinessIntelligenceDependencyMetadata(),
  publicApi: Object.freeze({
    exportedNamespaces: Object.freeze([
      "executiveBusinessIntelligenceIndex",
      "executiveBusinessIntelligenceRegistryIndex",
      "executiveBusinessIntelligenceModelIndex",
      "executiveBusinessIntelligenceValidationIndex",
      "executiveBusinessIntelligenceManifestIndex",
    ]),
    exportedMetadata: Object.freeze([
      ExecutiveBusinessIntelligenceRegistryMetadata.registryNamespace,
      ExecutiveBusinessIntelligenceModelMetadata.modelNamespace,
      getExecutiveBusinessIntelligenceValidationMetadata().validationNamespace,
      ExecutiveBusinessIntelligenceManifestMetadata.manifestNamespace,
    ]),
    publicContracts: getExecutiveBusinessIntelligencePublicApiInventory(),
    metadataOnly: true,
    immutable: true,
  }),
  release: Object.freeze({
    releaseState: "Published",
    platformMaturity: "Foundation",
    metadataVersion: "1.0.0",
    releaseReadiness:
      ExecutiveBusinessIntelligenceManifestMetadata.manifestConsumers.includes(
        "BUS-34:6 Platform",
      )
        ? "Ready"
        : "Blocked",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const buildExecutiveBusinessIntelligencePlatform = () =>
  Object.freeze({
    contracts: Object.freeze({ ...contracts }),
    registry: Object.freeze({ ...registry }),
    model: Object.freeze({ ...model }),
    validation: Object.freeze({ ...validation }),
    manifest: Object.freeze({ ...manifest }),
    metadata: ExecutiveBusinessIntelligencePlatformMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessIntelligencePlatform =
  buildExecutiveBusinessIntelligencePlatform();

export const getExecutiveBusinessIntelligencePlatform = () =>
  ExecutiveBusinessIntelligencePlatform;

export const getExecutiveBusinessIntelligencePlatformSummary = () =>
  Object.freeze({
    namespaceCount: 5,
    dependencyCount: getExecutiveBusinessIntelligenceDependencyMetadata().length,
    publicApiCount: getExecutiveBusinessIntelligencePublicApiInventory().length,
    releaseState: ExecutiveBusinessIntelligencePlatformMetadata.release.releaseState,
    platformMaturity:
      ExecutiveBusinessIntelligencePlatformMetadata.release.platformMaturity,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveBusinessIntelligencePlatformMetadata = () =>
  ExecutiveBusinessIntelligencePlatformMetadata;

export const getExecutiveBusinessIntelligencePlatformDependencies = () =>
  getExecutiveBusinessIntelligenceDependencyMetadata();

export const getExecutiveBusinessIntelligencePlatformPublicApi = () =>
  ExecutiveBusinessIntelligencePlatformMetadata.publicApi;

export const ExecutiveBusinessIntelligencePlatformFoundation = Object.freeze({
  platform: ExecutiveBusinessIntelligencePlatform,
  metadata: ExecutiveBusinessIntelligencePlatformMetadata,
  buildExecutiveBusinessIntelligencePlatform,
  getExecutiveBusinessIntelligencePlatform,
  getExecutiveBusinessIntelligencePlatformSummary,
  getExecutiveBusinessIntelligencePlatformMetadata,
  getExecutiveBusinessIntelligencePlatformDependencies,
  getExecutiveBusinessIntelligencePlatformPublicApi,
  metadataOnly: true,
  immutable: true,
});
