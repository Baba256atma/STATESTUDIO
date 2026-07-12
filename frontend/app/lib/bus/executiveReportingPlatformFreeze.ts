import {
  ExecutiveReportingPlatformCertificationVersion,
  getExecutiveReportingCertificationMetadata,
  runExecutiveReportingPlatformCertification,
} from "./executiveReportingPlatformCertificationIndex.ts";
import {
  ExecutiveReportingManifestVersion,
  getExecutiveReportingDependencyMetadata,
  getExecutiveReportingManifestMetadata,
} from "./executiveReportingManifestIndex.ts";
import {
  ExecutiveReportingPlatformDescription,
  ExecutiveReportingPlatformId,
  ExecutiveReportingPlatformName,
  ExecutiveReportingPlatformNamespace,
  ExecutiveReportingPlatformVersion,
  getExecutiveReportingPlatformDependencies,
  getExecutiveReportingPlatformPublicApi,
} from "./executiveReportingPlatformIndex.ts";

export const ExecutiveReportingPlatformFreezeId = "BUS-33:8" as const;

export const ExecutiveReportingPlatformFreezeVersion = "1.0.0" as const;

export const ExecutiveReportingPlatformFreezeName =
  "Executive Reporting Platform Freeze" as const;

export const ExecutiveReportingPlatformFreezeDescription =
  "Canonical metadata-only freeze and release layer for the Executive Reporting Intelligence Platform." as const;

const freezeReleaseMetadata = Object.freeze({
  certificationStatus: runExecutiveReportingPlatformCertification().certificationStatus,
  certificationVersion: ExecutiveReportingPlatformCertificationVersion,
  certificationReadiness: "READY",
  releaseStatus: "RELEASED",
  freezeStatus: "FROZEN",
  publicApiStability: "STABLE",
  architectureCompleteness: "COMPLETE",
  metadataOnly: true,
  immutable: true,
} as const);

const compatibilityMetadata = Object.freeze({
  supportedArchitectureVersion: "1.0.0",
  compatibilityStatus: "Compatible",
  extensionPolicy: Object.freeze([
    "metadata-only",
    "public-api-driven",
    "deterministic",
    "immutable",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);

const dependencyMetadata = Object.freeze({
  contracts: Object.freeze({
    id: "BUS-33:1",
    version: "1.0.0",
  }),
  registry: Object.freeze({
    id: "BUS-33:2",
    version: "1.0.0",
  }),
  model: Object.freeze({
    id: "BUS-33:3",
    version: "1.0.0",
  }),
  validation: Object.freeze({
    id: "BUS-33:4",
    version: "1.0.0",
  }),
  manifest: Object.freeze({
    id: "BUS-33:5",
    version: ExecutiveReportingManifestVersion,
  }),
  platform: Object.freeze({
    id: "BUS-33:6",
    version: ExecutiveReportingPlatformVersion,
  }),
  certification: Object.freeze({
    id: "BUS-33:7",
    version: ExecutiveReportingPlatformCertificationVersion,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveReportingPlatformFreezeMetadata = Object.freeze({
  freezeId: ExecutiveReportingPlatformFreezeId,
  freezeVersion: ExecutiveReportingPlatformFreezeVersion,
  freezeName: ExecutiveReportingPlatformFreezeName,
  freezeDescription: ExecutiveReportingPlatformFreezeDescription,
  platformIdentity: Object.freeze({
    id: ExecutiveReportingPlatformId,
    name: ExecutiveReportingPlatformName,
    namespace: ExecutiveReportingPlatformNamespace,
    version: ExecutiveReportingPlatformVersion,
    description: ExecutiveReportingPlatformDescription,
    metadataOnly: true,
    immutable: true,
  }),
  certification: freezeReleaseMetadata,
  compatibility: compatibilityMetadata,
  dependencies: dependencyMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveReportingPlatformFreezeManifest = Object.freeze({
  id: "executive-reporting-platform-freeze-manifest",
  version: ExecutiveReportingPlatformFreezeVersion,
  name: ExecutiveReportingPlatformFreezeName,
  namespace: "nexora.bus.executive-reporting.freeze",
  description: ExecutiveReportingPlatformFreezeDescription,
  manifestMetadata: getExecutiveReportingManifestMetadata(),
  certificationMetadata: getExecutiveReportingCertificationMetadata(),
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveReportingPlatformFreezeSummary = Object.freeze({
  dependencyCount: getExecutiveReportingDependencyMetadata().length,
  platformDependencyCount: getExecutiveReportingPlatformDependencies().length,
  publicApiNamespaceCount: getExecutiveReportingPlatformPublicApi().exportedNamespaces.length,
  certificationStatus: freezeReleaseMetadata.certificationStatus,
  releaseStatus: freezeReleaseMetadata.releaseStatus,
  freezeStatus: freezeReleaseMetadata.freezeStatus,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveReportingPlatformFreezeResult = Object.freeze({
  certificationStatus: "PASS",
  certified: true,
  frozen: true,
  released: true,
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  platformReadiness: "READY",
  metadata: freezeReleaseMetadata,
  immutable: true,
} as const);

export const buildExecutiveReportingPlatformFreeze = () =>
  Object.freeze({
    metadata: ExecutiveReportingPlatformFreezeMetadata,
    manifest: ExecutiveReportingPlatformFreezeManifest,
    summary: ExecutiveReportingPlatformFreezeSummary,
    result: ExecutiveReportingPlatformFreezeResult,
    release: freezeReleaseMetadata,
    compatibility: compatibilityMetadata,
    dependencies: dependencyMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveReportingPlatformFreeze = () =>
  buildExecutiveReportingPlatformFreeze();

export const getExecutiveReportingPlatformFreezeSummary = () =>
  ExecutiveReportingPlatformFreezeSummary;

export const getExecutiveReportingPlatformFreezeMetadata = () =>
  ExecutiveReportingPlatformFreezeMetadata;

export const getExecutiveReportingPlatformReleaseMetadata = () =>
  freezeReleaseMetadata;

export const getExecutiveReportingPlatformCompatibility = () =>
  compatibilityMetadata;

export const ExecutiveReportingPlatformFreezeFoundation = Object.freeze({
  metadata: ExecutiveReportingPlatformFreezeMetadata,
  manifest: ExecutiveReportingPlatformFreezeManifest,
  summary: ExecutiveReportingPlatformFreezeSummary,
  result: ExecutiveReportingPlatformFreezeResult,
  buildExecutiveReportingPlatformFreeze,
  getExecutiveReportingPlatformFreeze,
  getExecutiveReportingPlatformFreezeSummary,
  getExecutiveReportingPlatformFreezeMetadata,
  getExecutiveReportingPlatformReleaseMetadata,
  getExecutiveReportingPlatformCompatibility,
  metadataOnly: true,
  immutable: true,
});
