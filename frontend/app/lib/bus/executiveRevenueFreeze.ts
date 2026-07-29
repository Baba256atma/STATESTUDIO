import {
  ExecutiveRevenueContractNamespace,
  ExecutiveRevenueContractRegistry,
  ExecutiveRevenueContractVersion,
} from "./executiveRevenueContracts.ts";
import {
  ExecutiveRevenueRegistryId,
  ExecutiveRevenueRegistryNamespace,
  ExecutiveRevenueRegistryVersion,
} from "./executiveRevenueRegistry.ts";
import {
  ExecutiveRevenueModelId,
  ExecutiveRevenueModelNamespace,
  ExecutiveRevenueModelVersion,
} from "./executiveRevenueModel.ts";
import {
  ExecutiveRevenueValidationId,
  ExecutiveRevenueValidationNamespace,
  ExecutiveRevenueValidationResult,
  ExecutiveRevenueValidationVersion,
} from "./executiveRevenueValidation.ts";
import { ExecutiveRevenueManifest, ExecutiveRevenueManifestDependencies, ExecutiveRevenueManifestId, ExecutiveRevenueManifestNamespace, ExecutiveRevenueManifestPublicSurface, ExecutiveRevenueManifestVersion } from "./executiveRevenueManifest.ts";
import {
  ExecutiveRevenuePlatformDependencies,
  ExecutiveRevenuePlatformFoundation,
  ExecutiveRevenuePlatformId,
  ExecutiveRevenuePlatformNamespace,
  ExecutiveRevenuePlatformPublicApi,
  ExecutiveRevenuePlatformVersion,
} from "./executiveRevenuePlatform.ts";
import {
  ExecutiveRevenueCertificationFoundation,
  ExecutiveRevenueCertificationGates,
  ExecutiveRevenueCertificationId,
  ExecutiveRevenueCertificationNamespace,
  ExecutiveRevenueCertificationResult,
  ExecutiveRevenueCertificationVersion,
} from "./executiveRevenueCertification.ts";

export const ExecutiveRevenueFreezeId = "executive-revenue-freeze" as const;

export const ExecutiveRevenueFreezeVersion = "1.0.0" as const;

export const ExecutiveRevenueFreezeNamespace = `${ExecutiveRevenueContractNamespace}.freeze` as const;

export const ExecutiveRevenueFreezeDescription =
  "Canonical metadata-only freeze and release layer for executive revenue intelligence." as const;

export const ExecutiveRevenueFreezeDependencies = Object.freeze({
  contracts: Object.freeze({
    phaseId: "BUS-29:1",
    namespace: ExecutiveRevenueContractNamespace,
    version: ExecutiveRevenueContractVersion,
    publicApiCount: ExecutiveRevenueContractRegistry.publicApis.length,
    metadataOnly: true,
    immutable: true,
  }),
  registry: Object.freeze({
    phaseId: "BUS-29:2",
    registryId: ExecutiveRevenueRegistryId,
    namespace: ExecutiveRevenueRegistryNamespace,
    version: ExecutiveRevenueRegistryVersion,
    metadataOnly: true,
    immutable: true,
  }),
  model: Object.freeze({
    phaseId: "BUS-29:3",
    modelId: ExecutiveRevenueModelId,
    namespace: ExecutiveRevenueModelNamespace,
    version: ExecutiveRevenueModelVersion,
    metadataOnly: true,
    immutable: true,
  }),
  validation: Object.freeze({
    phaseId: "BUS-29:4",
    validationId: ExecutiveRevenueValidationId,
    namespace: ExecutiveRevenueValidationNamespace,
    version: ExecutiveRevenueValidationVersion,
    structurallyComplete: ExecutiveRevenueValidationResult.structurallyComplete,
    metadataOnly: true,
    immutable: true,
  }),
  manifest: Object.freeze({
    phaseId: "BUS-29:5",
    manifestId: ExecutiveRevenueManifestId,
    namespace: ExecutiveRevenueManifestNamespace,
    version: ExecutiveRevenueManifestVersion,
    metadataOnly: true,
    immutable: true,
  }),
  platform: Object.freeze({
    phaseId: "BUS-29:6",
    platformId: ExecutiveRevenuePlatformId,
    namespace: ExecutiveRevenuePlatformNamespace,
    version: ExecutiveRevenuePlatformVersion,
    metadataOnly: true,
    immutable: true,
  }),
  certification: Object.freeze({
    phaseId: "BUS-29:7",
    certificationId: ExecutiveRevenueCertificationId,
    namespace: ExecutiveRevenueCertificationNamespace,
    version: ExecutiveRevenueCertificationVersion,
    result: ExecutiveRevenueCertificationResult.result,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueFreezeCompatibility = Object.freeze({
  contractsToManifest:
    ExecutiveRevenueManifestDependencies.contracts.namespace === ExecutiveRevenueContractNamespace,
  registryToPlatform:
    ExecutiveRevenuePlatformDependencies.registry.namespace === ExecutiveRevenueRegistryNamespace,
  modelToValidation:
    ExecutiveRevenuePlatformDependencies.model.namespace === ExecutiveRevenueModelNamespace &&
    ExecutiveRevenueValidationResult.structurallyComplete,
  certificationToFreeze:
    ExecutiveRevenueCertificationResult.result === "PASS" &&
    ExecutiveRevenueCertificationGates.length > 0,
  publicApiStable:
    ExecutiveRevenuePlatformPublicApi.length > 0 &&
    ExecutiveRevenueManifestPublicSurface.manifest.length > 0,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueFreezePublicApi = Object.freeze([
  "ExecutiveRevenueFreezeId",
  "ExecutiveRevenueFreezeVersion",
  "ExecutiveRevenueFreezeNamespace",
  "ExecutiveRevenueFreezeDescription",
  "ExecutiveRevenueFreezeDependencies",
  "ExecutiveRevenueFreezeCompatibility",
  "ExecutiveRevenueFreezePublicApi",
  "ExecutiveRevenueFreezeResult",
  "ExecutiveRevenueFreezeFoundation",
] as const);

export const ExecutiveRevenueFreezeResult = Object.freeze({
  freezeId: ExecutiveRevenueFreezeId,
  freezeVersion: ExecutiveRevenueFreezeVersion,
  freezeNamespace: ExecutiveRevenueFreezeNamespace,
  freezeDescription: ExecutiveRevenueFreezeDescription,
  certified: ExecutiveRevenueCertificationResult.result === "PASS",
  frozen: true,
  released: true,
  metadataOnly: true,
  publicApiStable: true,
  releaseState: "released" as const,
  freezeState: "frozen" as const,
  certificationState: "certified" as const,
  dependencies: ExecutiveRevenueFreezeDependencies,
  compatibility: ExecutiveRevenueFreezeCompatibility,
  metadataOnlyBoundaryPreserved:
    ExecutiveRevenueManifest.metadataOnly &&
    ExecutiveRevenuePlatformFoundation.metadataOnly &&
    ExecutiveRevenueCertificationFoundation.metadataOnly,
  immutable: true,
});

export const ExecutiveRevenueFreezeFoundation = Object.freeze({
  ExecutiveRevenueFreezeId,
  ExecutiveRevenueFreezeVersion,
  ExecutiveRevenueFreezeNamespace,
  ExecutiveRevenueFreezeDescription,
  ExecutiveRevenueFreezeDependencies,
  ExecutiveRevenueFreezeCompatibility,
  ExecutiveRevenueFreezePublicApi,
  ExecutiveRevenueFreezeResult,
  metadataOnly: true,
  immutable: true,
});
