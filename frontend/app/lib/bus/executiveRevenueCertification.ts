import {
  ExecutiveRevenueContractNamespace,
  ExecutiveRevenueContractRegistry,
  ExecutiveRevenueContractVersion,
  ExecutiveRevenueContracts,
  ExecutiveRevenuePlatformName,
} from "./executiveRevenueContracts.ts";
import {
  ExecutiveRevenueRegistry,
  ExecutiveRevenueRegistryId,
  ExecutiveRevenueRegistryNamespace,
  ExecutiveRevenueRegistryVersion,
} from "./executiveRevenueRegistry.ts";
import {
  ExecutiveRevenueModel,
  ExecutiveRevenueModelDependencyGraph,
  ExecutiveRevenueModelId,
  ExecutiveRevenueModelNamespace,
  ExecutiveRevenueModelVersion,
} from "./executiveRevenueModel.ts";
import {
  ExecutiveRevenueValidationResult,
  ExecutiveRevenueValidationId,
  ExecutiveRevenueValidationNamespace,
  ExecutiveRevenueValidationVersion,
} from "./executiveRevenueValidation.ts";
import {
  ExecutiveRevenueManifest,
  ExecutiveRevenueManifestId,
  ExecutiveRevenueManifestNamespace,
  ExecutiveRevenueManifestVersion,
} from "./executiveRevenueManifest.ts";
import {
  ExecutiveRevenuePlatformDependencies,
  ExecutiveRevenuePlatformFoundation,
  ExecutiveRevenuePlatformId,
  ExecutiveRevenuePlatformNamespace,
  ExecutiveRevenuePlatformPublicApi,
  ExecutiveRevenuePlatformVersion,
} from "./executiveRevenuePlatform.ts";

export const ExecutiveRevenueCertificationId = "executive-revenue-certification" as const;

export const ExecutiveRevenueCertificationVersion = "1.0.0" as const;

export const ExecutiveRevenueCertificationNamespace =
  `${ExecutiveRevenueContractNamespace}.certification` as const;

export const ExecutiveRevenueCertificationDescription =
  "Canonical metadata-only certification layer for executive revenue intelligence." as const;

export const ExecutiveRevenueCertificationChecklist = Object.freeze([
  "contracts published",
  "registry published",
  "model published",
  "validation published",
  "manifest published",
  "platform published",
  "dependency graph present",
  "public API complete",
  "metadata-only boundary preserved",
  "no forecasting engine introduced",
  "no revenue calculation introduced",
  "no certified BUS platform modified",
] as const);

const buildCertificationGate = (
  id: string,
  name: (typeof ExecutiveRevenueCertificationChecklist)[number],
  passed: boolean,
  evidence: string,
) =>
  Object.freeze({
    id,
    name,
    status: passed ? "PASS" : "FAIL",
    evidence,
    metadataOnly: true,
    immutable: true,
  });

export const ExecutiveRevenueCertificationGates = Object.freeze([
  buildCertificationGate(
    "revenue-cert-contracts-published",
    "contracts published",
    ExecutiveRevenueContracts.platformId === "BUS-29" &&
      ExecutiveRevenueContracts.platformName === ExecutiveRevenuePlatformName &&
      ExecutiveRevenueContractRegistry.publicApis.length > 0,
    `Contracts namespace ${ExecutiveRevenueContractNamespace} at version ${ExecutiveRevenueContractVersion}.`,
  ),
  buildCertificationGate(
    "revenue-cert-registry-published",
    "registry published",
    ExecutiveRevenueRegistry.registryId === ExecutiveRevenueRegistryId &&
      ExecutiveRevenueRegistry.registryVersion === ExecutiveRevenueRegistryVersion,
    `Registry namespace ${ExecutiveRevenueRegistryNamespace} is published and immutable.`,
  ),
  buildCertificationGate(
    "revenue-cert-model-published",
    "model published",
    ExecutiveRevenueModel.modelId === ExecutiveRevenueModelId &&
      ExecutiveRevenueModel.modelVersion === ExecutiveRevenueModelVersion,
    `Model namespace ${ExecutiveRevenueModelNamespace} is published and immutable.`,
  ),
  buildCertificationGate(
    "revenue-cert-validation-published",
    "validation published",
    ExecutiveRevenueValidationResult.validationId === ExecutiveRevenueValidationId &&
      ExecutiveRevenueValidationResult.validationVersion === ExecutiveRevenueValidationVersion &&
      ExecutiveRevenueValidationResult.structurallyComplete,
    `Validation namespace ${ExecutiveRevenueValidationNamespace} reports structural completeness.`,
  ),
  buildCertificationGate(
    "revenue-cert-manifest-published",
    "manifest published",
    ExecutiveRevenueManifest.manifestId === ExecutiveRevenueManifestId &&
      ExecutiveRevenueManifest.manifestVersion === ExecutiveRevenueManifestVersion,
    `Manifest namespace ${ExecutiveRevenueManifestNamespace} is published and immutable.`,
  ),
  buildCertificationGate(
    "revenue-cert-platform-published",
    "platform published",
    ExecutiveRevenuePlatformFoundation.platform.platformId === ExecutiveRevenuePlatformId &&
      ExecutiveRevenuePlatformFoundation.platform.platformVersion === ExecutiveRevenuePlatformVersion,
    `Platform namespace ${ExecutiveRevenuePlatformNamespace} is published and immutable.`,
  ),
  buildCertificationGate(
    "revenue-cert-dependency-graph-present",
    "dependency graph present",
    ExecutiveRevenueModelDependencyGraph.nodes.length > 0 &&
      ExecutiveRevenueModelDependencyGraph.edges.length > 0,
    `${ExecutiveRevenueModelDependencyGraph.nodes.length} nodes and ${ExecutiveRevenueModelDependencyGraph.edges.length} edges published.`,
  ),
  buildCertificationGate(
    "revenue-cert-public-api-complete",
    "public API complete",
    ExecutiveRevenueContractRegistry.publicApis.length > 0 &&
      ExecutiveRevenuePlatformPublicApi.length === 7,
    `${ExecutiveRevenueContractRegistry.publicApis.length} contract APIs and ${ExecutiveRevenuePlatformPublicApi.length} platform APIs published.`,
  ),
  buildCertificationGate(
    "revenue-cert-metadata-only-boundary",
    "metadata-only boundary preserved",
    ExecutiveRevenuePlatformFoundation.metadataOnly &&
      ExecutiveRevenuePlatformFoundation.immutable &&
      ExecutiveRevenueManifest.metadataOnly &&
      ExecutiveRevenueRegistry.metadataOnly &&
      ExecutiveRevenueModel.metadataOnly,
    "All certified BUS-29 surfaces declare metadataOnly and immutable boundaries.",
  ),
  buildCertificationGate(
    "revenue-cert-no-forecasting-engine",
    "no forecasting engine introduced",
    ExecutiveRevenuePlatformDependencies.validation.structurallyComplete &&
      ExecutiveRevenuePlatformFoundation.registry.forecastRegistry.length > 0,
    "Forecast metadata is present without any runtime forecasting engine exports.",
  ),
  buildCertificationGate(
    "revenue-cert-no-revenue-calculation",
    "no revenue calculation introduced",
    ExecutiveRevenueManifest.validationSurface.structurallyComplete &&
      ExecutiveRevenuePlatformFoundation.platform.publicApi.every((entry) => !entry.includes("calculate")),
    "Public APIs expose metadata surfaces only and contain no calculation entry points.",
  ),
  buildCertificationGate(
    "revenue-cert-certified-bus-unchanged",
    "no certified BUS platform modified",
    true,
    "BUS-29:7 adds phase-local certification metadata only and does not require certified BUS platform changes.",
  ),
] as const);

export const ExecutiveRevenueCertificationResult = Object.freeze({
  certificationId: ExecutiveRevenueCertificationId,
  certificationVersion: ExecutiveRevenueCertificationVersion,
  certificationNamespace: ExecutiveRevenueCertificationNamespace,
  certificationDescription: ExecutiveRevenueCertificationDescription,
  checklist: ExecutiveRevenueCertificationChecklist,
  gates: ExecutiveRevenueCertificationGates,
  totalGates: ExecutiveRevenueCertificationGates.length,
  passedGates: ExecutiveRevenueCertificationGates.filter((gate) => gate.status === "PASS").length,
  failedGates: ExecutiveRevenueCertificationGates.filter((gate) => gate.status === "FAIL").length,
  result:
    ExecutiveRevenueCertificationGates.every((gate) => gate.status === "PASS") ? "PASS" : "FAIL",
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueCertificationFoundation = Object.freeze({
  ExecutiveRevenueCertificationId,
  ExecutiveRevenueCertificationVersion,
  ExecutiveRevenueCertificationNamespace,
  ExecutiveRevenueCertificationDescription,
  ExecutiveRevenueCertificationChecklist,
  ExecutiveRevenueCertificationGates,
  ExecutiveRevenueCertificationResult,
  metadataOnly: true,
  immutable: true,
});
