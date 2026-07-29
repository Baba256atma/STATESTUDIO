import {
  ExecutiveFinancePlatformFoundation as ExecutiveFinanceContractsFoundation,
  FinanceApi,
  FinanceContracts,
  FinanceEnums,
  FinanceIdentity,
  FinanceMetadata,
} from "./financeIndex.ts";
import {
  ExecutiveFinanceRegistryFoundation,
  FinanceApiRegistry,
  FinanceCategoryRegistry,
  FinanceObjectRegistry,
} from "./financeRegistryIndex.ts";
import { FinanceAggregationRegistry, FinanceDependencyRegistry, FinanceModelRegistry, FinanceOwnershipRegistry, FinanceRelationshipRegistry } from "./financeModelIndex.ts";
import {
  ExecutiveFinanceValidationFoundation,
  getFinanceValidation,
  getFinanceValidationManifest,
  hasDuplicateFinanceValidationIds,
} from "./financeValidationIndex.ts";
import {
  ExecutiveFinanceManifestFoundation,
  FinanceCompatibility,
  FinanceDependencyMatrix,
  FinanceExtensionPolicy,
  getFinanceManifest,
} from "./financeManifestIndex.ts";
import {
  ExecutiveFinancePlatform,
  ExecutiveFinancePlatformFoundation,
  ExecutiveFinancePlatformRegistry,
  getExecutiveFinancePlatformManifest,
} from "./executiveFinancePlatformIndex.ts";
import { buildExecutiveFinancePlatformCertificationManifest } from "./executiveFinancePlatformCertificationManifest.ts";
import {
  buildExecutiveFinancePlatformCertificationRegistry,
  buildExecutiveFinancePlatformCertificationSummary,
} from "./executiveFinancePlatformCertificationRegistry.ts";
import type {
  ExecutiveFinancePlatformCertificationEntry,
  ExecutiveFinancePlatformCertificationResult,
} from "./executiveFinancePlatformCertificationTypes.ts";

function createEntry(
  entry: Omit<
    ExecutiveFinancePlatformCertificationEntry,
    "metadataOnly" | "immutable"
  >,
): ExecutiveFinancePlatformCertificationEntry {
  return Object.freeze({
    ...entry,
    metadataOnly: true,
    immutable: true,
  });
}

function buildCertificationEntries(): readonly ExecutiveFinancePlatformCertificationEntry[] {
  const financeValidation = getFinanceValidation();
  const financeValidationManifest = getFinanceValidationManifest();
  const financeManifest = getFinanceManifest();
  const executivePlatformManifest = getExecutiveFinancePlatformManifest();

  return Object.freeze([
    createEntry({
      id: "finance-certification-contracts",
      component: "BUS-28:1",
      certificationGroup: "Contracts",
      description: "Verifies contracts, identity, metadata, enums, and public APIs exist.",
      severity: "Error",
      status:
        FinanceContracts.objectTypes.length === 16 &&
        FinanceIdentity.platformId === "BUS-28" &&
        FinanceMetadata.contractVersion === "1.0.0" &&
        FinanceEnums.FINANCIAL_OBJECT_TYPES.length === 16 &&
        FinanceApi.length > 0
          ? "Passed"
          : "Failed",
      result:
        FinanceContracts.objectTypes.length === 16 &&
        FinanceIdentity.platformId === "BUS-28" &&
        FinanceMetadata.contractVersion === "1.0.0" &&
        FinanceEnums.FINANCIAL_OBJECT_TYPES.length === 16 &&
        FinanceApi.length > 0
          ? "Compliant"
          : "NonCompliant",
      evidence: "financeIndex.ts public foundation",
    }),
    createEntry({
      id: "finance-certification-registry",
      component: "BUS-28:2",
      certificationGroup: "Registry",
      description: "Verifies registry completeness, category completeness, API registry completeness, and lookup APIs.",
      severity: "Error",
      status:
        FinanceObjectRegistry.objects.length === 16 &&
        FinanceCategoryRegistry.categories.length === 9 &&
        FinanceApiRegistry.apis.length === 10 &&
        typeof ExecutiveFinanceRegistryFoundation.findFinanceObjectByCode === "function" &&
        typeof ExecutiveFinanceRegistryFoundation.findFinanceObjectsByCategory === "function"
          ? "Passed"
          : "Failed",
      result:
        FinanceObjectRegistry.objects.length === 16 &&
        FinanceCategoryRegistry.categories.length === 9 &&
        FinanceApiRegistry.apis.length === 10 &&
        typeof ExecutiveFinanceRegistryFoundation.findFinanceObjectByCode === "function" &&
        typeof ExecutiveFinanceRegistryFoundation.findFinanceObjectsByCategory === "function"
          ? "Compliant"
          : "NonCompliant",
      evidence: "financeRegistryIndex.ts public foundation",
    }),
    createEntry({
      id: "finance-certification-model",
      component: "BUS-28:3",
      certificationGroup: "Model",
      description: "Verifies model, relationships, ownership, aggregation, and dependency registries exist.",
      severity: "Error",
      status:
        FinanceModelRegistry.entities.length === 16 &&
        FinanceRelationshipRegistry.relationships.length > 0 &&
        FinanceOwnershipRegistry.ownership.length > 0 &&
        FinanceAggregationRegistry.aggregations.length > 0 &&
        FinanceDependencyRegistry.dependencies.length > 0
          ? "Passed"
          : "Failed",
      result:
        FinanceModelRegistry.entities.length === 16 &&
        FinanceRelationshipRegistry.relationships.length > 0 &&
        FinanceOwnershipRegistry.ownership.length > 0 &&
        FinanceAggregationRegistry.aggregations.length > 0 &&
        FinanceDependencyRegistry.dependencies.length > 0
          ? "Compliant"
          : "NonCompliant",
      evidence: "financeModelIndex.ts public foundation",
    }),
    createEntry({
      id: "finance-certification-validation",
      component: "BUS-28:4",
      certificationGroup: "Validation",
      description: "Verifies validation registry, runner, manifest, and duplicate detection are available.",
      severity: "Error",
      status:
        financeValidation.registry.validations.length === 6 &&
        typeof ExecutiveFinanceValidationFoundation.runFinanceValidation === "function" &&
        financeValidationManifest.phaseId === "BUS-28:4" &&
        typeof hasDuplicateFinanceValidationIds === "function"
          ? "Passed"
          : "Failed",
      result:
        financeValidation.registry.validations.length === 6 &&
        typeof ExecutiveFinanceValidationFoundation.runFinanceValidation === "function" &&
        financeValidationManifest.phaseId === "BUS-28:4" &&
        typeof hasDuplicateFinanceValidationIds === "function"
          ? "Compliant"
          : "NonCompliant",
      evidence: "financeValidationIndex.ts public foundation",
    }),
    createEntry({
      id: "finance-certification-manifest",
      component: "BUS-28:5",
      certificationGroup: "Manifest",
      description: "Verifies finance manifest, compatibility matrix, dependency matrix, and extension policy exist.",
      severity: "Error",
      status:
        financeManifest.phaseRegistry.length === 5 &&
        FinanceCompatibility.entries.length === 6 &&
        FinanceDependencyMatrix.entries.length === 4 &&
        FinanceExtensionPolicy.allowedExtensions.length === 4
          ? "Passed"
          : "Failed",
      result:
        financeManifest.phaseRegistry.length === 5 &&
        FinanceCompatibility.entries.length === 6 &&
        FinanceDependencyMatrix.entries.length === 4 &&
        FinanceExtensionPolicy.allowedExtensions.length === 4
          ? "Compliant"
          : "NonCompliant",
      evidence: "financeManifestIndex.ts public foundation",
    }),
    createEntry({
      id: "finance-certification-platform",
      component: "BUS-28:6",
      certificationGroup: "Platform",
      description: "Verifies platform registry, runner, unified namespace, and platform manifest exist.",
      severity: "Error",
      status:
        ExecutiveFinancePlatformRegistry.exportedApis.length === 6 &&
        typeof ExecutiveFinancePlatform.buildExecutiveFinancePlatform === "function" &&
        ExecutiveFinancePlatformFoundation.metadataOnly &&
        executivePlatformManifest.supportedPhases.length === 6
          ? "Passed"
          : "Failed",
      result:
        ExecutiveFinancePlatformRegistry.exportedApis.length === 6 &&
        typeof ExecutiveFinancePlatform.buildExecutiveFinancePlatform === "function" &&
        ExecutiveFinancePlatformFoundation.metadataOnly &&
        executivePlatformManifest.supportedPhases.length === 6
          ? "Compliant"
          : "NonCompliant",
      evidence: "executiveFinancePlatformIndex.ts public foundation",
    }),
    createEntry({
      id: "finance-certification-publicapi",
      component: "ExecutiveFinancePlatform",
      certificationGroup: "PublicApi",
      description: "Verifies required public APIs are exported across foundations.",
      severity: "Error",
      status:
        typeof ExecutiveFinancePlatformFoundation.getExecutiveFinancePlatform === "function" &&
        typeof ExecutiveFinanceManifestFoundation.getFinanceManifest === "function" &&
        typeof ExecutiveFinanceValidationFoundation.getFinanceValidation === "function"
          ? "Passed"
          : "Failed",
      result:
        typeof ExecutiveFinancePlatformFoundation.getExecutiveFinancePlatform === "function" &&
        typeof ExecutiveFinanceManifestFoundation.getFinanceManifest === "function" &&
        typeof ExecutiveFinanceValidationFoundation.getFinanceValidation === "function"
          ? "Compliant"
          : "NonCompliant",
      evidence: "public API indices for BUS-28:1 through BUS-28:6",
    }),
    createEntry({
      id: "finance-certification-architecture",
      component: "ExecutiveFinancePlatform",
      certificationGroup: "Architecture",
      description: "Verifies immutable metadata, deterministic outputs, metadata-only composition, and public boundaries.",
      severity: "Error",
      status:
        ExecutiveFinanceContractsFoundation.immutable &&
        ExecutiveFinanceContractsFoundation.metadataOnly &&
        ExecutiveFinancePlatformFoundation.immutable &&
        ExecutiveFinancePlatformFoundation.metadataOnly &&
        financeValidation.valid &&
        executivePlatformManifest.readinessState === "Ready"
          ? "Passed"
          : "Failed",
      result:
        ExecutiveFinanceContractsFoundation.immutable &&
        ExecutiveFinanceContractsFoundation.metadataOnly &&
        ExecutiveFinancePlatformFoundation.immutable &&
        ExecutiveFinancePlatformFoundation.metadataOnly &&
        financeValidation.valid &&
        executivePlatformManifest.readinessState === "Ready"
          ? "Compliant"
          : "NonCompliant",
      evidence: "deterministic public metadata composition",
    }),
  ] as const);
}

export function buildExecutiveFinancePlatformCertification(): ExecutiveFinancePlatformCertificationResult {
  const entries = buildCertificationEntries();
  const registry = buildExecutiveFinancePlatformCertificationRegistry(entries);
  const summary = buildExecutiveFinancePlatformCertificationSummary(entries);
  const certified = summary.failed === 0;
  const manifest = buildExecutiveFinancePlatformCertificationManifest(certified);

  return Object.freeze({
    registry,
    summary,
    manifest,
    certified,
    metadataOnly: true,
    immutable: true,
  });
}

export function runExecutiveFinancePlatformCertification(): ExecutiveFinancePlatformCertificationResult {
  return buildExecutiveFinancePlatformCertification();
}

export function getExecutiveFinancePlatformCertification(): ExecutiveFinancePlatformCertificationResult {
  return buildExecutiveFinancePlatformCertification();
}
