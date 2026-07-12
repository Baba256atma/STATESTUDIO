import { ExecutiveFinancePlatformFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceManifestFoundation } from "./financeManifestIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import { ExecutiveFinanceValidationFoundation } from "./financeValidationIndex.ts";
import { getExecutiveFinancePlatformManifest } from "./executiveFinancePlatformManifest.ts";
import { ExecutiveFinancePlatformRegistry } from "./executiveFinancePlatformRegistry.ts";
import type { ExecutiveFinancePlatformResult } from "./executiveFinancePlatformTypes.ts";

export function buildExecutiveFinancePlatform(): ExecutiveFinancePlatformResult {
  return Object.freeze({
    contracts: ExecutiveFinancePlatformFoundation,
    registry: ExecutiveFinanceRegistryFoundation,
    model: ExecutiveFinanceModelFoundation,
    validation: ExecutiveFinanceValidationFoundation,
    manifest: ExecutiveFinanceManifestFoundation,
    platform: Object.freeze({
      registry: ExecutiveFinancePlatformRegistry,
      manifest: getExecutiveFinancePlatformManifest(),
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });
}

export function runExecutiveFinancePlatform(): ExecutiveFinancePlatformResult {
  return buildExecutiveFinancePlatform();
}

export function getExecutiveFinancePlatform(): ExecutiveFinancePlatformResult {
  return buildExecutiveFinancePlatform();
}
