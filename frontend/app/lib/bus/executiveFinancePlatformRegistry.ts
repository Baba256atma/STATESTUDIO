import { FinanceIdentity } from "./financeIndex.ts";
import { FinanceDependencyMatrix } from "./financeManifestIndex.ts";
import { getFinanceValidation } from "./financeValidationIndex.ts";
import type { ExecutiveFinancePlatformRegistry as ExecutiveFinancePlatformRegistryContract } from "./executiveFinancePlatformTypes.ts";

const EXECUTIVE_FINANCE_PLATFORM_EXPORTED_APIS = Object.freeze([
  "runExecutiveFinancePlatform",
  "buildExecutiveFinancePlatform",
  "getExecutiveFinancePlatform",
  "getExecutiveFinancePlatformManifest",
  "ExecutiveFinancePlatform",
  "ExecutiveFinancePlatformFoundation",
] as const);

export const ExecutiveFinancePlatformRegistry: ExecutiveFinancePlatformRegistryContract = Object.freeze({
  platformId: FinanceIdentity.platformId,
  platformVersion: FinanceIdentity.platformVersion,
  platformCode: FinanceIdentity.platformCode,
  platformStage: FinanceIdentity.platformStage,
  platformReleaseState: "Draft",
  consumedPhases: Object.freeze(["BUS-28:1", "BUS-28:2", "BUS-28:3", "BUS-28:4", "BUS-28:5"] as const),
  exportedApis: EXECUTIVE_FINANCE_PLATFORM_EXPORTED_APIS,
  dependencySummary: Object.freeze({
    dependencyCount: FinanceDependencyMatrix.entries.length,
    status: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount: 6,
    status: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  validationSummary: Object.freeze({
    validationCount: getFinanceValidation().summary.validationCount,
    passedCount: getFinanceValidation().summary.passedCount,
    failedCount: getFinanceValidation().summary.failedCount,
    status: getFinanceValidation().valid ? "Ready" : "NotReady",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});
