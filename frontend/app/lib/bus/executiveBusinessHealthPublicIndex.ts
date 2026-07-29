import * as contracts from "./executiveBusinessHealthIndex.ts";
import * as registry from "./executiveBusinessHealthRegistryIndex.ts";
import * as model from "./executiveBusinessHealthModelIndex.ts";
import * as validation from "./executiveBusinessHealthValidationIndex.ts";
import * as manifest from "./executiveBusinessHealthManifestIndex.ts";
import * as platform from "./executiveBusinessHealthPlatformIndex.ts";
import * as certification from "./executiveBusinessHealthPlatformCertificationIndex.ts";
import * as freeze from "./executiveBusinessHealthPlatformFreezeIndex.ts";
import {
  ExecutiveBusinessHealthPlatformCertificationVersion,
  runExecutiveBusinessHealthPlatformCertification,
} from "./executiveBusinessHealthPlatformCertificationIndex.ts";
import { getExecutiveBusinessHealthManifestMetadata } from "./executiveBusinessHealthManifestIndex.ts";
import { ExecutiveBusinessHealthPlatformMetadata, ExecutiveBusinessHealthPlatformName, ExecutiveBusinessHealthPlatformNamespace, ExecutiveBusinessHealthPlatformVersion } from "./executiveBusinessHealthPlatformIndex.ts";
import { ExecutiveBusinessHealthPlatformFreezeVersion, ExecutiveBusinessHealthPlatformFreezeResult, getExecutiveBusinessHealthPlatformCompatibility, getExecutiveBusinessHealthPlatformReleaseMetadata } from "./executiveBusinessHealthPlatformFreezeIndex.ts";

export * from "./executiveBusinessHealthIndex.ts";
export * from "./executiveBusinessHealthRegistryIndex.ts";
export * from "./executiveBusinessHealthModelIndex.ts";
export * from "./executiveBusinessHealthValidationIndex.ts";
export * from "./executiveBusinessHealthManifestIndex.ts";
export * from "./executiveBusinessHealthPlatformIndex.ts";
export * from "./executiveBusinessHealthPlatformCertificationIndex.ts";
export * from "./executiveBusinessHealthPlatformFreezeIndex.ts";

export const ExecutiveBusinessHealthPublicIndexId = "BUS-32:9" as const;

export const ExecutiveBusinessHealthPublicIndexVersion = "1.0.0" as const;

export const ExecutiveBusinessHealthPublicIndexName =
  "Executive Business Health Public Index" as const;

export const ExecutiveBusinessHealthPublicIndexDescription =
  "Final canonical public entry point for the Executive Business Health Intelligence Platform." as const;

export const ExecutiveBusinessHealthPublicIndexNamespace =
  "nexora.bus.executive-business-health.public-index" as const;

export const ExecutiveBusinessHealthPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveBusinessHealthPublicApiRegistry = Object.freeze({
  exportedNamespaces: Object.freeze([
    "executiveBusinessHealthIndex",
    "executiveBusinessHealthRegistryIndex",
    "executiveBusinessHealthModelIndex",
    "executiveBusinessHealthValidationIndex",
    "executiveBusinessHealthManifestIndex",
    "executiveBusinessHealthPlatformIndex",
    "executiveBusinessHealthPlatformCertificationIndex",
    "executiveBusinessHealthPlatformFreezeIndex",
    "executiveBusinessHealthPublicIndex",
  ]),
  exportedApis: Object.freeze([
    "ExecutiveBusinessHealthPlatformPublicFoundation",
    "ExecutiveBusinessHealthPublicApiRegistry",
    "ExecutiveBusinessHealthPublicIndexId",
    "ExecutiveBusinessHealthPublicIndexVersion",
    "ExecutiveBusinessHealthPublicIndexName",
    "ExecutiveBusinessHealthPublicIndexDescription",
    "ExecutiveBusinessHealthPublicIndexNamespace",
    "ExecutiveBusinessHealthPublicIndexStatus",
    "getExecutiveBusinessHealthPublicFoundation",
    "getExecutiveBusinessHealthPublicMetadata",
    "getExecutiveBusinessHealthPublicApiRegistry",
    "getExecutiveBusinessHealthReleaseSummary",
  ]),
  releaseStatus: ExecutiveBusinessHealthPublicIndexStatus.releaseStatus,
  platformMaturity: ExecutiveBusinessHealthPlatformMetadata.release.platformMaturity,
  apiStability: "Stable",
  compatibility: getExecutiveBusinessHealthPlatformCompatibility(),
  metadataOnly: true,
  immutable: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveBusinessHealthPublicIndexId,
  publicIndexVersion: ExecutiveBusinessHealthPublicIndexVersion,
  publicIndexName: ExecutiveBusinessHealthPublicIndexName,
  publicIndexDescription: ExecutiveBusinessHealthPublicIndexDescription,
  publicIndexNamespace: ExecutiveBusinessHealthPublicIndexNamespace,
  platformName: ExecutiveBusinessHealthPlatformName,
  platformNamespace: ExecutiveBusinessHealthPlatformNamespace,
  platformVersion: ExecutiveBusinessHealthPlatformVersion,
  status: ExecutiveBusinessHealthPublicIndexStatus,
  publicApiRegistry: ExecutiveBusinessHealthPublicApiRegistry,
  metadataOnly: true,
  immutable: true,
} as const);

const releaseSummary = Object.freeze({
  certificationVersion: ExecutiveBusinessHealthPlatformCertificationVersion,
  freezeVersion: ExecutiveBusinessHealthPlatformFreezeVersion,
  manifestVersion: getExecutiveBusinessHealthManifestMetadata().manifestVersion,
  certificationStatus:
    runExecutiveBusinessHealthPlatformCertification().certificationStatus,
  releaseStatus: getExecutiveBusinessHealthPlatformReleaseMetadata().releaseStatus,
  freezeStatus: getExecutiveBusinessHealthPlatformReleaseMetadata().freezeStatus,
  publicApiStable: ExecutiveBusinessHealthPlatformFreezeResult.publicApiStable,
  architectureComplete:
    ExecutiveBusinessHealthPlatformFreezeResult.architectureComplete,
  exportedNamespaceCount:
    ExecutiveBusinessHealthPublicApiRegistry.exportedNamespaces.length,
  exportedApiCount: ExecutiveBusinessHealthPublicApiRegistry.exportedApis.length,
  metadataOnly: true,
  immutable: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveBusinessHealthPublicIndexId,
  version: ExecutiveBusinessHealthPublicIndexVersion,
  name: ExecutiveBusinessHealthPublicIndexName,
  namespace: ExecutiveBusinessHealthPublicIndexNamespace,
  description: ExecutiveBusinessHealthPublicIndexDescription,
  status: ExecutiveBusinessHealthPublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessHealthPlatformPublicFoundation = Object.freeze({
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

export const getExecutiveBusinessHealthPublicFoundation = () =>
  ExecutiveBusinessHealthPlatformPublicFoundation;

export const getExecutiveBusinessHealthPublicMetadata = () => publicMetadata;

export const getExecutiveBusinessHealthPublicApiRegistry = () =>
  ExecutiveBusinessHealthPublicApiRegistry;

export const getExecutiveBusinessHealthReleaseSummary = () => releaseSummary;
