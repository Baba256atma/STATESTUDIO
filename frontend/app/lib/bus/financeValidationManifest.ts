import { FinanceApiRegistry } from "./financeRegistryIndex.ts";
import { runFinanceValidation } from "./financeValidationRunner.ts";
import type { FinanceValidationManifest } from "./financeValidationTypes.ts";

export function getFinanceValidationManifest(): FinanceValidationManifest {
  const validation = runFinanceValidation();

  return Object.freeze({
    phaseId: "BUS-28:4",
    version: "1.0.0",
    consumedPhases: Object.freeze(["BUS-28:1", "BUS-28:2", "BUS-28:3"] as const),
    validationCount: validation.summary.validationCount,
    passedCount: validation.summary.passedCount,
    warningCount: validation.summary.warningCount,
    failedCount: validation.summary.failedCount,
    publicApiCount: FinanceApiRegistry.apis.length + 5,
    certificationReadiness: validation.valid ? "Ready" : "NotReady",
    metadataOnly: true,
    immutable: true,
  });
}
