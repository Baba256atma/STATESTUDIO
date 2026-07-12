import * as contracts from "./executiveBusinessIntelligenceIndex.ts";
import * as registry from "./executiveBusinessIntelligenceRegistryIndex.ts";
import * as model from "./executiveBusinessIntelligenceModelIndex.ts";
import * as validation from "./executiveBusinessIntelligenceValidationIndex.ts";
import * as manifest from "./executiveBusinessIntelligenceManifestIndex.ts";
import * as platform from "./executiveBusinessIntelligencePlatformIndex.ts";
import * as certification from "./executiveBusinessIntelligencePlatformCertificationIndex.ts";
import * as freeze from "./executiveBusinessIntelligencePlatformFreezeIndex.ts";
import {
  ExecutiveBusinessIntelligencePlatformCertificationVersion,
  runExecutiveBusinessIntelligencePlatformCertification,
} from "./executiveBusinessIntelligencePlatformCertificationIndex.ts";
import { getExecutiveBusinessIntelligenceManifestMetadata } from "./executiveBusinessIntelligenceManifestIndex.ts";
import {
  ExecutiveBusinessIntelligencePlatformMetadata,
  ExecutiveBusinessIntelligencePlatformName,
  ExecutiveBusinessIntelligencePlatformNamespace,
  ExecutiveBusinessIntelligencePlatformVersion,
} from "./executiveBusinessIntelligencePlatformIndex.ts";
import {
  ExecutiveBusinessIntelligencePlatformFreezeResult,
  ExecutiveBusinessIntelligencePlatformFreezeVersion,
  getExecutiveBusinessIntelligencePlatformCompatibility,
  getExecutiveBusinessIntelligencePlatformReleaseMetadata,
} from "./executiveBusinessIntelligencePlatformFreezeIndex.ts";

export * from "./executiveBusinessIntelligenceIndex.ts";
export * from "./executiveBusinessIntelligenceRegistryIndex.ts";
export * from "./executiveBusinessIntelligenceModelIndex.ts";
export * from "./executiveBusinessIntelligenceValidationIndex.ts";
export {
  ExecutiveBusinessIntelligenceManifest,
  ExecutiveBusinessIntelligenceManifestDescription,
  ExecutiveBusinessIntelligenceManifestFoundation,
  ExecutiveBusinessIntelligenceManifestId,
  ExecutiveBusinessIntelligenceManifestMetadata,
  ExecutiveBusinessIntelligenceManifestName,
  ExecutiveBusinessIntelligenceManifestVersion,
  buildExecutiveBusinessIntelligenceManifest,
  getExecutiveBusinessIntelligenceManifest,
  getExecutiveBusinessIntelligenceManifestMetadata,
  getExecutiveBusinessIntelligenceManifestSummary,
  getExecutiveBusinessIntelligencePublicApiInventory,
} from "./executiveBusinessIntelligenceManifestIndex.ts";
export * from "./executiveBusinessIntelligencePlatformIndex.ts";
export * from "./executiveBusinessIntelligencePlatformCertificationIndex.ts";
export * from "./executiveBusinessIntelligencePlatformFreezeIndex.ts";

export const ExecutiveBusinessIntelligencePublicIndexId = "BUS-34:9" as const;

export const ExecutiveBusinessIntelligencePublicIndexVersion =
  "1.0.0" as const;

export const ExecutiveBusinessIntelligencePublicIndexName =
  "Executive Business Intelligence Public Index" as const;

export const ExecutiveBusinessIntelligencePublicIndexDescription =
  "Final canonical public entry point for the unified Executive Business Intelligence Platform." as const;

export const ExecutiveBusinessIntelligencePublicIndexNamespace =
  "nexora.bus.executive-business-intelligence.public-index" as const;

export const ExecutiveBusinessIntelligencePublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveBusinessIntelligencePublicApiRegistry = Object.freeze({
  exportedNamespaces: Object.freeze([
    "executiveBusinessIntelligenceIndex",
    "executiveBusinessIntelligenceRegistryIndex",
    "executiveBusinessIntelligenceModelIndex",
    "executiveBusinessIntelligenceValidationIndex",
    "executiveBusinessIntelligenceManifestIndex",
    "executiveBusinessIntelligencePlatformIndex",
    "executiveBusinessIntelligencePlatformCertificationIndex",
    "executiveBusinessIntelligencePlatformFreezeIndex",
    "executiveBusinessIntelligencePublicIndex",
  ]),
  exportedApis: Object.freeze([
    "ExecutiveBusinessIntelligencePlatformPublicFoundation",
    "ExecutiveBusinessIntelligencePublicApiRegistry",
    "ExecutiveBusinessIntelligencePublicIndexId",
    "ExecutiveBusinessIntelligencePublicIndexVersion",
    "ExecutiveBusinessIntelligencePublicIndexName",
    "ExecutiveBusinessIntelligencePublicIndexDescription",
    "ExecutiveBusinessIntelligencePublicIndexNamespace",
    "ExecutiveBusinessIntelligencePublicIndexStatus",
    "getExecutiveBusinessIntelligencePublicFoundation",
    "getExecutiveBusinessIntelligencePublicMetadata",
    "getExecutiveBusinessIntelligencePublicApiRegistry",
    "getExecutiveBusinessIntelligenceReleaseSummary",
  ]),
  releaseStatus: ExecutiveBusinessIntelligencePublicIndexStatus.releaseStatus,
  platformMaturity:
    ExecutiveBusinessIntelligencePlatformMetadata.release.platformMaturity,
  apiStability: "Stable",
  compatibility: getExecutiveBusinessIntelligencePlatformCompatibility(),
  metadataOnly: true,
  immutable: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveBusinessIntelligencePublicIndexId,
  publicIndexVersion: ExecutiveBusinessIntelligencePublicIndexVersion,
  publicIndexName: ExecutiveBusinessIntelligencePublicIndexName,
  publicIndexDescription: ExecutiveBusinessIntelligencePublicIndexDescription,
  publicIndexNamespace: ExecutiveBusinessIntelligencePublicIndexNamespace,
  platformName: ExecutiveBusinessIntelligencePlatformName,
  platformNamespace: ExecutiveBusinessIntelligencePlatformNamespace,
  platformVersion: ExecutiveBusinessIntelligencePlatformVersion,
  status: ExecutiveBusinessIntelligencePublicIndexStatus,
  publicApiRegistry: ExecutiveBusinessIntelligencePublicApiRegistry,
  metadataOnly: true,
  immutable: true,
} as const);

const releaseSummary = Object.freeze({
  certificationVersion:
    ExecutiveBusinessIntelligencePlatformCertificationVersion,
  freezeVersion: ExecutiveBusinessIntelligencePlatformFreezeVersion,
  manifestVersion:
    getExecutiveBusinessIntelligenceManifestMetadata().manifestVersion,
  certificationStatus:
    runExecutiveBusinessIntelligencePlatformCertification()
      .certificationStatus,
  releaseStatus:
    getExecutiveBusinessIntelligencePlatformReleaseMetadata().releaseStatus,
  freezeStatus:
    getExecutiveBusinessIntelligencePlatformReleaseMetadata().freezeStatus,
  publicApiStable: ExecutiveBusinessIntelligencePlatformFreezeResult.publicApiStable,
  architectureComplete:
    ExecutiveBusinessIntelligencePlatformFreezeResult.architectureComplete,
  exportedNamespaceCount:
    ExecutiveBusinessIntelligencePublicApiRegistry.exportedNamespaces.length,
  exportedApiCount:
    ExecutiveBusinessIntelligencePublicApiRegistry.exportedApis.length,
  metadataOnly: true,
  immutable: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveBusinessIntelligencePublicIndexId,
  version: ExecutiveBusinessIntelligencePublicIndexVersion,
  name: ExecutiveBusinessIntelligencePublicIndexName,
  namespace: ExecutiveBusinessIntelligencePublicIndexNamespace,
  description: ExecutiveBusinessIntelligencePublicIndexDescription,
  status: ExecutiveBusinessIntelligencePublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessIntelligencePlatformPublicFoundation =
  Object.freeze({
    contracts: Object.freeze({ ...contracts }),
    registry: Object.freeze({ ...registry }),
    model: Object.freeze({ ...model }),
    validation: Object.freeze({ ...validation }),
    manifest: Object.freeze({ ...manifest }),
    platform: Object.freeze({ ...platform }),
    certification: Object.freeze({ ...certification }),
    freeze: Object.freeze({ ...freeze }),
    publicIndex,
    metadata: publicMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveBusinessIntelligencePublicFoundation = () =>
  ExecutiveBusinessIntelligencePlatformPublicFoundation;

export const getExecutiveBusinessIntelligencePublicMetadata = () =>
  publicMetadata;

export const getExecutiveBusinessIntelligencePublicApiRegistry = () =>
  ExecutiveBusinessIntelligencePublicApiRegistry;

export const getExecutiveBusinessIntelligenceReleaseSummary = () =>
  releaseSummary;
