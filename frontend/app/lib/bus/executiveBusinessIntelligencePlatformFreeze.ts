import {
  ExecutiveBusinessIntelligencePlatformCertificationVersion,
  getExecutiveBusinessIntelligenceCertificationMetadata,
  runExecutiveBusinessIntelligencePlatformCertification,
} from "./executiveBusinessIntelligencePlatformCertificationIndex.ts";
import {
  ExecutiveBusinessIntelligenceManifestVersion,
  getExecutiveBusinessIntelligenceDependencyMetadata,
  getExecutiveBusinessIntelligenceManifestMetadata,
} from "./executiveBusinessIntelligenceManifestIndex.ts";
import {
  ExecutiveBusinessIntelligencePlatformDescription,
  ExecutiveBusinessIntelligencePlatformId,
  ExecutiveBusinessIntelligencePlatformName,
  ExecutiveBusinessIntelligencePlatformNamespace,
  ExecutiveBusinessIntelligencePlatformVersion,
  getExecutiveBusinessIntelligencePlatformDependencies,
  getExecutiveBusinessIntelligencePlatformPublicApi,
} from "./executiveBusinessIntelligencePlatformIndex.ts";

export const ExecutiveBusinessIntelligencePlatformFreezeId = "BUS-34:8" as const;

export const ExecutiveBusinessIntelligencePlatformFreezeVersion = "1.0.0" as const;

export const ExecutiveBusinessIntelligencePlatformFreezeName =
  "Executive Business Intelligence Platform Freeze" as const;

export const ExecutiveBusinessIntelligencePlatformFreezeDescription =
  "Canonical metadata-only freeze and release layer for the Executive Business Intelligence Platform." as const;

const freezeReleaseMetadata = Object.freeze({
  certificationStatus:
    runExecutiveBusinessIntelligencePlatformCertification().certificationStatus,
  certificationVersion: ExecutiveBusinessIntelligencePlatformCertificationVersion,
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
    id: "BUS-34:1",
    version: "1.0.0",
  }),
  registry: Object.freeze({
    id: "BUS-34:2",
    version: "1.0.0",
  }),
  model: Object.freeze({
    id: "BUS-34:3",
    version: "1.0.0",
  }),
  validation: Object.freeze({
    id: "BUS-34:4",
    version: "1.0.0",
  }),
  manifest: Object.freeze({
    id: "BUS-34:5",
    version: ExecutiveBusinessIntelligenceManifestVersion,
  }),
  platform: Object.freeze({
    id: "BUS-34:6",
    version: ExecutiveBusinessIntelligencePlatformVersion,
  }),
  certification: Object.freeze({
    id: "BUS-34:7",
    version: ExecutiveBusinessIntelligencePlatformCertificationVersion,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessIntelligencePlatformFreezeMetadata = Object.freeze({
  freezeId: ExecutiveBusinessIntelligencePlatformFreezeId,
  freezeVersion: ExecutiveBusinessIntelligencePlatformFreezeVersion,
  freezeName: ExecutiveBusinessIntelligencePlatformFreezeName,
  freezeDescription: ExecutiveBusinessIntelligencePlatformFreezeDescription,
  platformIdentity: Object.freeze({
    id: ExecutiveBusinessIntelligencePlatformId,
    name: ExecutiveBusinessIntelligencePlatformName,
    namespace: ExecutiveBusinessIntelligencePlatformNamespace,
    version: ExecutiveBusinessIntelligencePlatformVersion,
    description: ExecutiveBusinessIntelligencePlatformDescription,
    metadataOnly: true,
    immutable: true,
  }),
  certification: freezeReleaseMetadata,
  compatibility: compatibilityMetadata,
  dependencies: dependencyMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessIntelligencePlatformFreezeManifest = Object.freeze({
  id: "executive-business-intelligence-platform-freeze-manifest",
  version: ExecutiveBusinessIntelligencePlatformFreezeVersion,
  name: ExecutiveBusinessIntelligencePlatformFreezeName,
  namespace: "nexora.bus.executive-business-intelligence.freeze",
  description: ExecutiveBusinessIntelligencePlatformFreezeDescription,
  manifestMetadata: getExecutiveBusinessIntelligenceManifestMetadata(),
  certificationMetadata: getExecutiveBusinessIntelligenceCertificationMetadata(),
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessIntelligencePlatformFreezeSummary = Object.freeze({
  dependencyCount: getExecutiveBusinessIntelligenceDependencyMetadata().length,
  platformDependencyCount:
    getExecutiveBusinessIntelligencePlatformDependencies().length,
  publicApiNamespaceCount:
    getExecutiveBusinessIntelligencePlatformPublicApi().exportedNamespaces.length,
  certificationStatus: freezeReleaseMetadata.certificationStatus,
  releaseStatus: freezeReleaseMetadata.releaseStatus,
  freezeStatus: freezeReleaseMetadata.freezeStatus,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveBusinessIntelligencePlatformFreezeResult = Object.freeze({
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

export const buildExecutiveBusinessIntelligencePlatformFreeze = () =>
  Object.freeze({
    metadata: ExecutiveBusinessIntelligencePlatformFreezeMetadata,
    manifest: ExecutiveBusinessIntelligencePlatformFreezeManifest,
    summary: ExecutiveBusinessIntelligencePlatformFreezeSummary,
    result: ExecutiveBusinessIntelligencePlatformFreezeResult,
    release: freezeReleaseMetadata,
    compatibility: compatibilityMetadata,
    dependencies: dependencyMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveBusinessIntelligencePlatformFreeze = () =>
  buildExecutiveBusinessIntelligencePlatformFreeze();

export const getExecutiveBusinessIntelligencePlatformFreezeSummary = () =>
  ExecutiveBusinessIntelligencePlatformFreezeSummary;

export const getExecutiveBusinessIntelligencePlatformFreezeMetadata = () =>
  ExecutiveBusinessIntelligencePlatformFreezeMetadata;

export const getExecutiveBusinessIntelligencePlatformReleaseMetadata = () =>
  freezeReleaseMetadata;

export const getExecutiveBusinessIntelligencePlatformCompatibility = () =>
  compatibilityMetadata;

export const ExecutiveBusinessIntelligencePlatformFreezeFoundation = Object.freeze({
  metadata: ExecutiveBusinessIntelligencePlatformFreezeMetadata,
  manifest: ExecutiveBusinessIntelligencePlatformFreezeManifest,
  summary: ExecutiveBusinessIntelligencePlatformFreezeSummary,
  result: ExecutiveBusinessIntelligencePlatformFreezeResult,
  buildExecutiveBusinessIntelligencePlatformFreeze,
  getExecutiveBusinessIntelligencePlatformFreeze,
  getExecutiveBusinessIntelligencePlatformFreezeSummary,
  getExecutiveBusinessIntelligencePlatformFreezeMetadata,
  getExecutiveBusinessIntelligencePlatformReleaseMetadata,
  getExecutiveBusinessIntelligencePlatformCompatibility,
  metadataOnly: true,
  immutable: true,
});
