import {
  ExecutiveFinancePlatformFoundation,
  FinanceIdentity,
  FinanceMetadata,
} from "./financeIndex.ts";
import {
  ExecutiveFinanceRegistryFoundation,
  FinanceApiRegistry,
  FinanceCategoryRegistry,
  FinanceObjectRegistry,
  getFinanceRegistryManifest,
} from "./financeRegistryIndex.ts";
import {
  ExecutiveFinanceModelFoundation,
  FinanceAggregationRegistry,
  FinanceDependencyRegistry,
  FinanceModelRegistry,
  FinanceOwnershipRegistry,
  FinanceRelationshipRegistry,
  getFinanceModelManifest,
} from "./financeModelIndex.ts";
import {
  ExecutiveFinanceValidationFoundation,
  getFinanceValidation,
  getFinanceValidationManifest,
} from "./financeValidationIndex.ts";
import { FinanceCompatibility, getFinanceCompatibility } from "./financeCompatibility.ts";
import { FinanceDependencyMatrix, getFinanceDependencyMatrix } from "./financeDependencyMatrix.ts";
import { FinanceExtensionPolicy, getFinanceExtensionPolicy } from "./financeExtensionPolicy.ts";
import type {
  FinanceManifest as FinanceManifestContract,
  FinanceManifestPhaseId,
  FinancePhaseRegistryEntry,
  FinanceManifestSummary,
} from "./financeManifestTypes.ts";

function buildPhaseRegistry(): readonly FinancePhaseRegistryEntry[] {
  const registryManifest = getFinanceRegistryManifest();
  const modelManifest = getFinanceModelManifest();
  const validationManifest = getFinanceValidationManifest();

  return Object.freeze([
    Object.freeze({
      phaseId: "BUS-28:1",
      name: "Finance Contracts",
      version: "1.0.0",
      status: "Foundation",
      dependencies: Object.freeze([] as const),
      publicApis: Object.freeze(FinanceMetadata.publicApis),
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      phaseId: "BUS-28:2",
      name: registryManifest.phaseName,
      version: "1.0.0",
      status: "Registry",
      dependencies: Object.freeze(["BUS-28:1"] as const),
      publicApis: Object.freeze(FinanceApiRegistry.apis.map((entry) => entry.apiName)),
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      phaseId: "BUS-28:3",
      name: "Executive Financial Model",
      version: "1.0.0",
      status: "Model",
      dependencies: Object.freeze(["BUS-28:1", "BUS-28:2"] as const),
      publicApis: Object.freeze([
        "getFinanceModel",
        "getFinanceRelationships",
        "getFinanceOwnership",
        "getFinanceAggregations",
        "getFinanceDependencies",
        "getFinanceModelManifest",
      ] as const),
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      phaseId: "BUS-28:4",
      name: "Executive Financial Validation",
      version: "1.0.0",
      status: "Validation",
      dependencies: Object.freeze(["BUS-28:1", "BUS-28:2", "BUS-28:3"] as const),
      publicApis: Object.freeze([
        "runFinanceValidation",
        "getFinanceValidation",
        "getFinanceValidationManifest",
      ] as const),
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      phaseId: "BUS-28:5",
      name: "Executive Financial Manifest",
      version: "1.0.0",
      status: "Manifest",
      dependencies: Object.freeze(["BUS-28:1", "BUS-28:2", "BUS-28:3", "BUS-28:4"] as const),
      publicApis: Object.freeze([
        "buildFinanceManifest",
        "getFinanceManifest",
        "getFinanceCompatibility",
        "getFinanceDependencyMatrix",
        "getFinanceExtensionPolicy",
      ] as const),
      metadataOnly: true,
      immutable: true,
    }),
  ] as const);
}

function buildManifestSummary(): FinanceManifestSummary {
  const validation = getFinanceValidation();

  return Object.freeze({
    entityCount: FinanceModelRegistry.entities.length,
    registryCount: 4,
    relationshipCount: FinanceRelationshipRegistry.relationships.length,
    validationCount: validation.summary.validationCount,
    publicApiCount: 33,
    dependencyCount: FinanceDependencyMatrix.entries.length,
    compatibilityStatus: "Compatible",
    certificationReadiness: validation.valid ? "Ready" : "NotReady",
    freezeReadiness: validation.valid ? "Ready" : "NotReady",
    metadataOnly: true,
    immutable: true,
  });
}

export function buildFinanceManifest(): FinanceManifestContract {
  const validation = getFinanceValidation();

  return Object.freeze({
    platformIdentity: Object.freeze({
      platformId: FinanceIdentity.platformId,
      platformName: FinanceIdentity.platformName,
      platformVersion: FinanceIdentity.platformVersion,
      platformCode: FinanceIdentity.platformCode,
      architectureStage: FinanceIdentity.platformStage,
      releaseStatus: "Draft",
      supportedArchitecture: "Nexora Executive Platform",
      architectureLayer: FinanceMetadata.architectureLayer,
      metadataOnly: true,
      immutable: true,
    }),
    consumedPhases: Object.freeze(["BUS-28:1", "BUS-28:2", "BUS-28:3", "BUS-28:4"] as const),
    exportedPhases: Object.freeze(["BUS-28:5"] as const),
    supportedConsumers: Object.freeze([
      "BUS-28:6 Financial Platform",
      "BUS-28:7 Financial Certification",
      "BUS-28:8 Financial Freeze",
      "BUS-28:9 Financial Public Index",
    ] as const),
    certificationReadiness: validation.valid ? "Ready" : "NotReady",
    validationReadiness: validation.valid ? "Ready" : "NotReady",
    phaseRegistry: buildPhaseRegistry(),
    compatibility: getFinanceCompatibility(),
    dependencyMatrix: getFinanceDependencyMatrix(),
    extensionPolicy: getFinanceExtensionPolicy(),
    summary: buildManifestSummary(),
    metadataOnly: true,
    immutable: true,
  });
}

const FINANCE_MANIFEST = buildFinanceManifest();

export const FinanceManifest = FINANCE_MANIFEST;

export function getFinanceManifest(): FinanceManifestContract {
  return FINANCE_MANIFEST;
}
