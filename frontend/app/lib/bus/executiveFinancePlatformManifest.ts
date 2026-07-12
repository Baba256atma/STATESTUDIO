import { FinanceIdentity } from "./financeIndex.ts";
import { getFinanceManifest } from "./financeManifestIndex.ts";
import { getFinanceValidation } from "./financeValidationIndex.ts";
import type { ExecutiveFinancePlatformManifest as ExecutiveFinancePlatformManifestContract } from "./executiveFinancePlatformTypes.ts";

export function getExecutiveFinancePlatformManifest(): ExecutiveFinancePlatformManifestContract {
  const financeManifest = getFinanceManifest();
  const validation = getFinanceValidation();
  const readiness = validation.valid ? "Ready" : "NotReady";

  return Object.freeze({
    platformIdentity: Object.freeze({
      platformId: FinanceIdentity.platformId,
      platformName: FinanceIdentity.platformName,
      platformVersion: FinanceIdentity.platformVersion,
      platformCode: FinanceIdentity.platformCode,
      platformStage: FinanceIdentity.platformStage,
      platformReleaseState: "Draft",
      metadataOnly: true,
      immutable: true,
    }),
    supportedPhases: Object.freeze([
      "BUS-28:1",
      "BUS-28:2",
      "BUS-28:3",
      "BUS-28:4",
      "BUS-28:5",
      "BUS-28:6",
    ] as const),
    compatibilityStatus: financeManifest.summary.compatibilityStatus,
    dependencyStatus: "Compatible",
    validationStatus: readiness,
    manifestVersion: "1.0.0",
    apiVersion: "1.0.0",
    readinessState: readiness,
    certificationReadiness: financeManifest.summary.certificationReadiness,
    freezeReadiness: financeManifest.summary.freezeReadiness,
    metadataOnly: true,
    immutable: true,
  });
}
