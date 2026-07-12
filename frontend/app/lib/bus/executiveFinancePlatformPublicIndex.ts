export {
  FinanceContracts,
  getFinanceContracts,
  CURRENCY_TYPES,
  FINANCIAL_OBJECT_TYPES,
  FINANCIAL_PERIOD_TYPES,
  FINANCIAL_STATUSES,
  FINANCIAL_VISIBILITIES,
  FinanceEnums,
  FinanceIdentity,
  getFinanceIdentity,
  FinanceMetadata,
  getFinanceMetadata,
  FinanceApi,
  getFinancePublicApi,
} from "./financeIndex.ts";
export type * from "./financeIndex.ts";

export type * from "./financeRegistryIndex.ts";
export {
  FinanceObjectRegistry,
  findFinanceObjectByCode,
  findFinanceObjectsByCategory,
  getFinanceObjectRegistry,
  FinanceCategoryRegistry,
  getFinanceCategoryRegistry,
  FinanceApiRegistry,
  getFinanceApiRegistry,
  getFinanceRegistryManifest,
} from "./financeRegistryIndex.ts";

export type * from "./financeModelIndex.ts";
export {
  FinanceModelRegistry,
  getFinanceModel,
  FinanceRelationshipRegistry,
  getFinanceRelationships,
  FinanceOwnershipRegistry,
  getFinanceOwnership,
  FinanceAggregationRegistry,
  getFinanceAggregations,
  FinanceDependencyRegistry,
  getFinanceDependencies,
  getFinanceModelManifest,
} from "./financeModelIndex.ts";

export type * from "./financeValidationIndex.ts";
export {
  buildFinanceValidationRegistry,
  buildFinanceValidationSummary,
  hasDuplicateFinanceValidationIds,
  FINANCE_VALIDATION_RULES,
  createFinanceValidationEntry,
  runFinanceValidation,
  getFinanceValidation,
  getFinanceValidationManifest,
} from "./financeValidationIndex.ts";

export type * from "./financeManifestIndex.ts";
export {
  FinanceCompatibility,
  getFinanceCompatibility,
  FinanceDependencyMatrix,
  getFinanceDependencyMatrix,
  FinanceExtensionPolicy,
  getFinanceExtensionPolicy,
  FinanceManifest,
  buildFinanceManifest,
  getFinanceManifest,
} from "./financeManifestIndex.ts";

export type {
  ExecutiveFinancePlatformManifest,
  ExecutiveFinancePlatformRegistry as ExecutiveFinancePlatformRegistryContract,
  ExecutiveFinancePlatformResult,
} from "./executiveFinancePlatformIndex.ts";
export {
  ExecutiveFinancePlatformRegistry,
  buildExecutiveFinancePlatform,
  getExecutiveFinancePlatform,
  runExecutiveFinancePlatform,
  getExecutiveFinancePlatformManifest,
  ExecutiveFinancePlatform,
} from "./executiveFinancePlatformIndex.ts";

export type {
  ExecutiveFinanceCertificationComponent,
  ExecutiveFinanceCertificationGroup,
  ExecutiveFinanceCertificationSeverity,
  ExecutiveFinanceCertificationStatus,
  ExecutiveFinancePlatformCertificationEntry,
  ExecutiveFinancePlatformCertificationManifest,
  ExecutiveFinancePlatformCertificationRegistry as ExecutiveFinancePlatformCertificationRegistryContract,
  ExecutiveFinancePlatformCertificationResult,
  ExecutiveFinancePlatformCertificationSummary,
} from "./executiveFinancePlatformCertificationIndex.ts";
export {
  buildExecutiveFinancePlatformCertificationRegistry,
  buildExecutiveFinancePlatformCertificationSummary,
  buildExecutiveFinancePlatformCertificationManifest,
  buildExecutiveFinancePlatformCertification,
  getExecutiveFinancePlatformCertification,
  runExecutiveFinancePlatformCertification,
  ExecutiveFinancePlatformCertification,
} from "./executiveFinancePlatformCertificationIndex.ts";

export type {
  ExecutiveFinancePlatformCompatibility as ExecutiveFinancePlatformCompatibilityContract,
  ExecutiveFinancePlatformCompatibilityEntry,
  ExecutiveFinancePlatformFreezeManifest,
  ExecutiveFinancePlatformFreezeRegistry as ExecutiveFinancePlatformFreezeRegistryContract,
  ExecutiveFinancePlatformFreezeResult,
  ExecutiveFinancePlatformRegression as ExecutiveFinancePlatformRegressionContract,
} from "./executiveFinancePlatformFreezeIndex.ts";
export {
  ExecutiveFinancePlatformFreezeRegistry,
  ExecutiveFinancePlatformCompatibility,
  ExecutiveFinancePlatformRegression,
  getExecutiveFinancePlatformFreezeManifest,
  buildExecutiveFinancePlatformFreeze,
  runExecutiveFinancePlatformFreeze,
  getExecutiveFinancePlatformFreeze,
  ExecutiveFinancePlatformFreeze,
} from "./executiveFinancePlatformFreezeIndex.ts";

import { ExecutiveFinancePlatformFoundation as ExecutiveFinanceContractsFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import { ExecutiveFinanceValidationFoundation } from "./financeValidationIndex.ts";
import { ExecutiveFinanceManifestFoundation } from "./financeManifestIndex.ts";
import { ExecutiveFinancePlatformFoundation } from "./executiveFinancePlatformIndex.ts";
import { ExecutiveFinancePlatformCertificationFoundation } from "./executiveFinancePlatformCertificationIndex.ts";
import { ExecutiveFinancePlatformFreezeFoundation, getExecutiveFinancePlatformFreezeManifest } from "./executiveFinancePlatformFreezeIndex.ts";

export type ExecutiveFinancePlatformPublicIndexMetadata = Readonly<{
  readonly publicIndexId: "executive-finance-platform-public-index";
  readonly publicIndexName: "Executive Finance Platform Public Index";
  readonly platformCode: "EXEC_FIN";
  readonly platformVersion: "1.0.0";
  readonly releaseVersion: "1.0.0";
  readonly certificationStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly releaseStatus: "Released";
  readonly exportedPhaseCount: 8;
  readonly exportedApiCount: 47;
  readonly consumedPublicIndexes: readonly [
    "financeIndex.ts",
    "financeRegistryIndex.ts",
    "financeModelIndex.ts",
    "financeValidationIndex.ts",
    "financeManifestIndex.ts",
    "executiveFinancePlatformIndex.ts",
    "executiveFinancePlatformCertificationIndex.ts",
    "executiveFinancePlatformFreezeIndex.ts",
  ];
  readonly boundaryPolicy: Readonly<{
    readonly importThroughPublicIndexOnly: true;
    readonly previousPhaseInternalsPrivate: true;
    readonly futureExtensionsPublicApiOnly: true;
    readonly directImplementationImportsProhibited: true;
    readonly runtimeExecutionAllowed: false;
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export const ExecutiveFinancePlatformPublicIndex: ExecutiveFinancePlatformPublicIndexMetadata = Object.freeze({
  publicIndexId: "executive-finance-platform-public-index",
  publicIndexName: "Executive Finance Platform Public Index",
  platformCode: "EXEC_FIN",
  platformVersion: "1.0.0",
  releaseVersion: "1.0.0",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  exportedPhaseCount: 8,
  exportedApiCount: 47,
  consumedPublicIndexes: Object.freeze([
    "financeIndex.ts",
    "financeRegistryIndex.ts",
    "financeModelIndex.ts",
    "financeValidationIndex.ts",
    "financeManifestIndex.ts",
    "executiveFinancePlatformIndex.ts",
    "executiveFinancePlatformCertificationIndex.ts",
    "executiveFinancePlatformFreezeIndex.ts",
  ] as const),
  boundaryPolicy: Object.freeze({
    importThroughPublicIndexOnly: true,
    previousPhaseInternalsPrivate: true,
    futureExtensionsPublicApiOnly: true,
    directImplementationImportsProhibited: true,
    runtimeExecutionAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveFinancePlatformPublicFoundation = Object.freeze({
  contracts: ExecutiveFinanceContractsFoundation,
  registry: ExecutiveFinanceRegistryFoundation,
  model: ExecutiveFinanceModelFoundation,
  validation: ExecutiveFinanceValidationFoundation,
  manifest: ExecutiveFinanceManifestFoundation,
  platform: ExecutiveFinancePlatformFoundation,
  certification: ExecutiveFinancePlatformCertificationFoundation,
  freeze: ExecutiveFinancePlatformFreezeFoundation,
  publicIndex: ExecutiveFinancePlatformPublicIndex,
  metadataOnly: true,
  immutable: true,
});

export function getExecutiveFinancePlatformPublicIndex(): ExecutiveFinancePlatformPublicIndexMetadata {
  return ExecutiveFinancePlatformPublicIndex;
}

export function getExecutiveFinancePlatformPublicFoundation(): typeof ExecutiveFinancePlatformPublicFoundation {
  return ExecutiveFinancePlatformPublicFoundation;
}
