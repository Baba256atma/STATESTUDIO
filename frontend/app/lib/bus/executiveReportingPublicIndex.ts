import * as contracts from "./executiveReportingIndex.ts";
import * as registry from "./executiveReportingRegistryIndex.ts";
import * as model from "./executiveReportingModelIndex.ts";
import * as validation from "./executiveReportingValidationIndex.ts";
import * as manifest from "./executiveReportingManifestIndex.ts";
import * as platform from "./executiveReportingPlatformIndex.ts";
import * as certification from "./executiveReportingPlatformCertificationIndex.ts";
import * as freeze from "./executiveReportingPlatformFreezeIndex.ts";
import {
  ExecutiveReportingPlatformCertificationVersion,
  runExecutiveReportingPlatformCertification,
} from "./executiveReportingPlatformCertificationIndex.ts";
import { getExecutiveReportingManifestMetadata } from "./executiveReportingManifestIndex.ts";
import {
  ExecutiveReportingPlatformMetadata,
  ExecutiveReportingPlatformName,
  ExecutiveReportingPlatformNamespace,
  ExecutiveReportingPlatformVersion,
} from "./executiveReportingPlatformIndex.ts";
import {
  ExecutiveReportingPlatformFreezeResult,
  ExecutiveReportingPlatformFreezeVersion,
  getExecutiveReportingPlatformCompatibility,
  getExecutiveReportingPlatformReleaseMetadata,
} from "./executiveReportingPlatformFreezeIndex.ts";

export * from "./executiveReportingIndex.ts";
export * from "./executiveReportingRegistryIndex.ts";
export * from "./executiveReportingModelIndex.ts";
export * from "./executiveReportingValidationIndex.ts";
export * from "./executiveReportingManifestIndex.ts";
export * from "./executiveReportingPlatformIndex.ts";
export * from "./executiveReportingPlatformCertificationIndex.ts";
export * from "./executiveReportingPlatformFreezeIndex.ts";

export const ExecutiveReportingPublicIndexId = "BUS-33:9" as const;

export const ExecutiveReportingPublicIndexVersion = "1.0.0" as const;

export const ExecutiveReportingPublicIndexName =
  "Executive Reporting Public Index" as const;

export const ExecutiveReportingPublicIndexDescription =
  "Final canonical public entry point for the Executive Reporting Intelligence Platform." as const;

export const ExecutiveReportingPublicIndexNamespace =
  "nexora.bus.executive-reporting.public-index" as const;

export const ExecutiveReportingPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveReportingPublicApiRegistry = Object.freeze({
  exportedNamespaces: Object.freeze([
    "executiveReportingIndex",
    "executiveReportingRegistryIndex",
    "executiveReportingModelIndex",
    "executiveReportingValidationIndex",
    "executiveReportingManifestIndex",
    "executiveReportingPlatformIndex",
    "executiveReportingPlatformCertificationIndex",
    "executiveReportingPlatformFreezeIndex",
    "executiveReportingPublicIndex",
  ]),
  exportedApis: Object.freeze([
    "ExecutiveReportingPlatformPublicFoundation",
    "ExecutiveReportingPublicApiRegistry",
    "ExecutiveReportingPublicIndexId",
    "ExecutiveReportingPublicIndexVersion",
    "ExecutiveReportingPublicIndexName",
    "ExecutiveReportingPublicIndexDescription",
    "ExecutiveReportingPublicIndexNamespace",
    "ExecutiveReportingPublicIndexStatus",
    "getExecutiveReportingPublicFoundation",
    "getExecutiveReportingPublicMetadata",
    "getExecutiveReportingPublicApiRegistry",
    "getExecutiveReportingReleaseSummary",
  ]),
  releaseStatus: ExecutiveReportingPublicIndexStatus.releaseStatus,
  platformMaturity: ExecutiveReportingPlatformMetadata.release.platformMaturity,
  apiStability: "Stable",
  compatibility: getExecutiveReportingPlatformCompatibility(),
  metadataOnly: true,
  immutable: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveReportingPublicIndexId,
  publicIndexVersion: ExecutiveReportingPublicIndexVersion,
  publicIndexName: ExecutiveReportingPublicIndexName,
  publicIndexDescription: ExecutiveReportingPublicIndexDescription,
  publicIndexNamespace: ExecutiveReportingPublicIndexNamespace,
  platformName: ExecutiveReportingPlatformName,
  platformNamespace: ExecutiveReportingPlatformNamespace,
  platformVersion: ExecutiveReportingPlatformVersion,
  status: ExecutiveReportingPublicIndexStatus,
  publicApiRegistry: ExecutiveReportingPublicApiRegistry,
  metadataOnly: true,
  immutable: true,
} as const);

const releaseSummary = Object.freeze({
  certificationVersion: ExecutiveReportingPlatformCertificationVersion,
  freezeVersion: ExecutiveReportingPlatformFreezeVersion,
  manifestVersion: getExecutiveReportingManifestMetadata().manifestVersion,
  certificationStatus: runExecutiveReportingPlatformCertification().certificationStatus,
  releaseStatus: getExecutiveReportingPlatformReleaseMetadata().releaseStatus,
  freezeStatus: getExecutiveReportingPlatformReleaseMetadata().freezeStatus,
  publicApiStable: ExecutiveReportingPlatformFreezeResult.publicApiStable,
  architectureComplete: ExecutiveReportingPlatformFreezeResult.architectureComplete,
  exportedNamespaceCount: ExecutiveReportingPublicApiRegistry.exportedNamespaces.length,
  exportedApiCount: ExecutiveReportingPublicApiRegistry.exportedApis.length,
  metadataOnly: true,
  immutable: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveReportingPublicIndexId,
  version: ExecutiveReportingPublicIndexVersion,
  name: ExecutiveReportingPublicIndexName,
  namespace: ExecutiveReportingPublicIndexNamespace,
  description: ExecutiveReportingPublicIndexDescription,
  status: ExecutiveReportingPublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveReportingPlatformPublicFoundation = Object.freeze({
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

export const getExecutiveReportingPublicFoundation = () =>
  ExecutiveReportingPlatformPublicFoundation;

export const getExecutiveReportingPublicMetadata = () => publicMetadata;

export const getExecutiveReportingPublicApiRegistry = () =>
  ExecutiveReportingPublicApiRegistry;

export const getExecutiveReportingReleaseSummary = () => releaseSummary;
